use std::{io::Read, time::Duration};

use bytes::{Buf, BytesMut};

use crate::pipeline::{
    decoder::AacDepayloaderMode,
    types::{EncodedChunk, EncodedChunkKind},
    AudioCodec,
};

use super::RolloverState;

#[derive(Debug, thiserror::Error)]
pub enum AacDepayloadingError {
    #[error("Packet too short")]
    PacketTooShort,

    #[error("Interleaving is not supported")]
    InterleavingNotSupported,
}

impl AacDepayloaderMode {
    fn size_len_in_bits(&self) -> usize {
        match self {
            AacDepayloaderMode::LowBitrate => 6,
            AacDepayloaderMode::HighBitrate => 13,
        }
    }

    fn index_len_in_bits(&self) -> usize {
        match self {
            AacDepayloaderMode::LowBitrate => 2,
            AacDepayloaderMode::HighBitrate => 3,
        }
    }

    fn header_len_in_bytes(&self) -> usize {
        match self {
            AacDepayloaderMode::LowBitrate => 1,
            AacDepayloaderMode::HighBitrate => 2,
        }
    }
}

pub struct AacDepayloader {
    mode: AacDepayloaderMode,
    asc: Asc,
    rollover_state: RolloverState,
}

/// MPEG-4 part 3, 1.6.3.4
fn freq_id_to_freq(id: u8) -> Result<u32, AudioSpecificConfigParseError> {
    match id {
        0x0 => Ok(96000),
        0x1 => Ok(88200),
        0x2 => Ok(64000),
        0x3 => Ok(48000),
        0x4 => Ok(44100),
        0x5 => Ok(32000),
        0x6 => Ok(24000),
        0x7 => Ok(22050),
        0x8 => Ok(16000),
        0x9 => Ok(12000),
        0xa => Ok(11025),
        0xb => Ok(8000),
        0xc => Ok(7350),
        _ => Err(AudioSpecificConfigParseError::IllegalValue),
    }
}

/// MPEG-4 part 3, 4.5.1.1
fn frame_length_flag_to_frame_length(flag: bool) -> u32 {
    match flag {
        true => 960,
        false => 1024,
    }
}

struct Asc {
    _profile: u8,
    frequency: u32,
    _channel: u8,
    frame_length: u32,
}

#[derive(Debug, thiserror::Error)]
pub enum AudioSpecificConfigParseError {
    #[error("ASC is not long enough")]
    TooShort,

    #[error("Illegal value in ASC")]
    IllegalValue,
}

// MPEG-4 part 3, sections 1.6.2.1 & 4.4.1
fn parse_asc(asc: &[u8]) -> Result<Asc, AudioSpecificConfigParseError> {
    // TODO: this can probably be rewritten using [nom](https://lib.rs/crates/nom), which would
    // make it a lot more understandable
    let mut reader = std::io::Cursor::new(asc);

    if reader.remaining() < 2 {
        return Err(AudioSpecificConfigParseError::TooShort);
    }

    let first = reader.get_u8();
    let second = reader.get_u8();

    let mut profile = (0b11111000 & first) >> 3;
    let frequency: u32;
    let channel: u8;
    let frame_length: u32;

    if profile == 31 {
        profile = ((first & 0b00000111) << 3) + ((second & 0b11100000) >> 5) + 0b00100000;
        let frequency_id = (second & 0b00011110) >> 1;

        let channel_and_frame_len_bytes: [u8; 2];

        if frequency_id == 15 {
            if reader.remaining() < 4 {
                return Err(AudioSpecificConfigParseError::TooShort);
            }

            let mut rest = [0; 4];
            reader.read_exact(&mut rest).unwrap();

            frequency = (((second & 0b00000001) as u32) << 23)
                | ((rest[0] as u32) << 15)
                | ((rest[1] as u32) << 7)
                | (((rest[2] & 0b11111110) >> 1) as u32);

            channel_and_frame_len_bytes = [rest[2], rest[3]];
        } else {
            if reader.remaining() < 1 {
                return Err(AudioSpecificConfigParseError::TooShort);
            }
            let last = reader.get_u8();

            channel_and_frame_len_bytes = [second, last];
            frequency = freq_id_to_freq(frequency_id)?
        };

        let [b1, b2] = channel_and_frame_len_bytes;
        channel = ((b1 & 0b00000001) << 3) | ((b2 & 0b11100000) >> 5);
        let frame_length_flag = b2 & 0b00010000 != 0;

        frame_length = frame_length_flag_to_frame_length(frame_length_flag);
    } else {
        let frequency_id = ((first & 0b00000111) << 1) + ((second & 0b10000000) >> 7);
        let channel_and_frame_len_byte: u8;

        if frequency_id == 15 {
            if reader.remaining() < 3 {
                return Err(AudioSpecificConfigParseError::TooShort);
            }

            let mut rest = [0; 3];
            reader.read_exact(&mut rest).unwrap();
            frequency = (((second & 0b01111111) as u32) << 17)
                | ((rest[0] as u32) << 9)
                | ((rest[1] as u32) << 1)
                | (((rest[2] & 0b10000000) >> 7) as u32);

            channel_and_frame_len_byte = rest[2];
        } else {
            frequency = freq_id_to_freq(frequency_id)?;
            channel_and_frame_len_byte = second;
        }

        channel = (channel_and_frame_len_byte & 0b01111000) >> 3;
        let frame_length_flag = channel_and_frame_len_byte & 0b00000100 != 0;
        frame_length = frame_length_flag_to_frame_length(frame_length_flag);
    }

    Ok(Asc {
        _profile: profile,
        frequency,
        _channel: channel,
        frame_length,
    })
}

#[derive(Debug, thiserror::Error)]
pub enum AacDepayloaderNewError {
    #[error(transparent)]
    AudioSpecificConfigParseError(#[from] AudioSpecificConfigParseError),
}

impl AacDepayloader {
    pub(super) fn new(
        mode: AacDepayloaderMode,
        asc: &[u8],
    ) -> Result<Self, AacDepayloaderNewError> {
        let asc = parse_asc(asc)?;
        Ok(Self {
            mode,
            asc,
            rollover_state: RolloverState::default(),
        })
    }

    /// Related spec:
    ///  - [RFC 3640, section 3.2. RTP Payload Structure](https://datatracker.ietf.org/doc/html/rfc3640#section-3.2)
    ///  - [RFC 3640, section 3.3.5. Low Bit-rate AAC](https://datatracker.ietf.org/doc/html/rfc3640#section-3.3.5)
    ///  - [RFC 3640, section 3.3.6. High Bit-rate AAC](https://datatracker.ietf.org/doc/html/rfc3640#section-3.3.6)
    pub(super) fn depayload(
        &mut self,
        packet: rtp::packet::Packet,
    ) -> Result<Vec<EncodedChunk>, AacDepayloadingError> {
        let mut reader = std::io::Cursor::new(packet.payload);

        if reader.remaining() < 2 {
            return Err(AacDepayloadingError::PacketTooShort);
        }

        let headers_len = reader.get_u16() / 8;
        if reader.remaining() < headers_len as usize {
            return Err(AacDepayloadingError::PacketTooShort);
        }

        let header_len = self.mode.header_len_in_bytes();
        let header_count = headers_len as usize / header_len;
        let mut headers = Vec::new();

        for _ in 0..header_count {
            let mut header: u16 = 0;
            for _ in 0..header_len {
                header <<= 8;
                header |= reader.get_u8() as u16;
            }

            headers.push(header);
        }

        struct Header {
            index: u8,
            size: u16,
        }

        let headers = headers
            .into_iter()
            .map(|h| Header {
                size: h >> self.mode.index_len_in_bits(),
                index: (h & (u16::MAX >> self.mode.size_len_in_bits())) as u8,
            })
            .collect::<Vec<_>>();

        if headers.iter().any(|h| h.index != 0) {
            return Err(AacDepayloadingError::InterleavingNotSupported);
        }

        let packet_pts = self.rollover_state.timestamp(packet.header.timestamp);
        let packet_pts = Duration::from_secs_f64(packet_pts as f64 / self.asc.frequency as f64);
        let frame_duration =
            Duration::from_secs_f64(self.asc.frame_length as f64 / self.asc.frequency as f64);
        let mut chunks = Vec::new();
        for (i, header) in headers.iter().enumerate() {
            if reader.remaining() < header.size.into() {
                return Err(AacDepayloadingError::PacketTooShort);
            }

            let mut payload = BytesMut::zeroed(header.size as usize);
            reader.read_exact(&mut payload).unwrap();
            let payload = payload.freeze();

            let pts = packet_pts + frame_duration * (i as u32);

            chunks.push(EncodedChunk {
                pts,
                data: payload,
                dts: None,
                kind: EncodedChunkKind::Audio(AudioCodec::Aac),
            });
        }

        Ok(chunks)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn asc_simple() {
        let asc = [0b00010010, 0b00010000];
        let parsed = parse_asc(&asc).unwrap();

        assert_eq!(parsed._profile, 2);
        assert_eq!(parsed.frequency, 44_100);
        assert_eq!(parsed._channel, 2);
        assert_eq!(parsed.frame_length, 1024);
    }

    #[test]
    fn asc_complicated_frequency() {
        let asc = [0b00010111, 0b10000000, 0b00010000, 0b10011011, 0b10010100];
        let parsed = parse_asc(&asc).unwrap();

        assert_eq!(parsed._profile, 2);
        assert_eq!(parsed.frequency, 0x2137);
        assert_eq!(parsed._channel, 2);
        assert_eq!(parsed.frame_length, 960);
    }

    #[test]
    fn asc_complicated_profile() {
        let asc = [0b11111001, 0b01000110, 0b00100000];
        let parsed = parse_asc(&asc).unwrap();

        assert_eq!(parsed._profile, 42);
        assert_eq!(parsed.frequency, 48_000);
        assert_eq!(parsed._channel, 1);
        assert_eq!(parsed.frame_length, 1024);
    }

    #[test]
    fn asc_complicated_profile_and_frequency() {
        let asc = [
            0b11111001, 0b01011110, 0b00000000, 0b01000010, 0b01101110, 0b01000000,
        ];
        let parsed = parse_asc(&asc).unwrap();

        assert_eq!(parsed._profile, 42);
        assert_eq!(parsed.frequency, 0x2137);
        assert_eq!(parsed._channel, 2);
        assert_eq!(parsed.frame_length, 1024);
    }
}
