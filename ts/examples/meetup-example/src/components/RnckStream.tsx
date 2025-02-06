import { InputStream, Text, useInputStreams, View, Image } from '@swmansion/smelter';
import Background from '../../assets/background.png';
import Label from './Label';

function RnckStream() {
  const inputs = useInputStreams();
  const inputState = inputs['rnck']?.videoState;

  if (inputState === 'playing') {
    return (
      <View style={{ width: 1920, height: 1080, padding: 12 }}>
        <View style={{ width: 1920, height: 1080, top: 0, left: 0 }}>
          <Image source={new URL(Background, import.meta.url).toString()} />
        </View>
        <Label />
        <View style={{ padding: 12, width: 292 }}>
          <View style={{ height: 338, width: 292, borderRadius: 16, bottom: 0, left: 0 }}>
            <InputStream inputId="speaker" />
          </View>
        </View>
        <View style={{ padding: 12 }}>
          <View style={{ width: 1573, height: 874, top: 0, right: 0, borderRadius: 12 }}>
            <InputStream inputId="rnck" />
          </View>
        </View>
        <View
          style={{
            width: 230,
            height: 40,
            bottom: 0,
            right: 0,
            paddingVertical: 80,
            paddingRight: 150,
          }}>
          <Text
            style={{
              fontSize: 58,
              fontWeight: 'semi_bold',
              fontFamily: 'Noto Sans',
              color: '#ffffff',
            }}>
            RNCK #14
          </Text>
        </View>
      </View>
    );
  }

  if (inputState === 'finished') {
    return (
      <View style={{ backgroundColor: '#ffffff' }}>
        <View style={{ width: 530, height: 40, bottom: 340, left: 500 }}>
          <Text
            style={{
              fontSize: 48,
              fontWeight: 'semi_bold',
              fontFamily: 'Noto Sans',
              color: '#33539d',
            }}>
            See you next time!
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={{ backgroundColor: '#ffffff' }}>
      <View style={{ width: 530, height: 40, bottom: 340, left: 500 }}>
        <Text
          style={{
            fontSize: 48,
            fontWeight: 'semi_bold',
            fontFamily: 'Noto Sans',
            color: '#33539d',
          }}>
          Loading MP4 file
        </Text>
      </View>
    </View>
  );
}

export default RnckStream;
