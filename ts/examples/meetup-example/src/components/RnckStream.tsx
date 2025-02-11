import {
  InputStream,
  Text,
  useInputStreams,
  View,
  Image,
  Tiles,
  Rescaler,
} from '@swmansion/smelter';
import Background from '../../assets/background.png';
import Label from './Label';
import EventLabel from './EventLabel';

function RnckStream() {
  const inputs = useInputStreams();
  const inputState = inputs['rnck']?.videoState;

  if (inputState === 'playing') {
    return (
      <View style={{ width: 1920, height: 1080, padding: 12 }}>
        <View style={{ width: 1920, height: 1080, top: 0, left: 0 }}>
          <Image source={new URL(Background, import.meta.url).toString()} />
        </View>
        <Label speaker={'Kacper Kapuściak'} subject={"What's new in React Native"} />

        <View
          style={{
            height: 338 + 24,
            width: 292 + 24,
            borderRadius: 100,
            padding: 12,
            bottom: 0,
            left: 0,
          }}>
          <Rescaler>
            <InputStream inputId="speaker" />
          </Rescaler>
        </View>

        <View style={{ padding: 12 }}>
          <View style={{ width: 1573, height: 874, top: 0, right: 0, borderRadius: 12 }}>
            <InputStream inputId="rnck" />
          </View>
        </View>
        <EventLabel eventName="RNCK #14" />
      </View>
    );
  }

  if (inputState === 'finished') {
    return (
      <Tiles>
        <Text
          style={{
            fontSize: 120,
            fontWeight: 'semi_bold',
            fontFamily: 'Noto Sans',
          }}>
          See you next time
        </Text>
      </Tiles>
    );
  }

  return (
    <Tiles>
      <Text
        style={{
          fontSize: 120,
          fontWeight: 'semi_bold',
          fontFamily: 'Noto Sans',
        }}>
        Loading mp4 file
      </Text>
    </Tiles>
  );
}

export default RnckStream;
