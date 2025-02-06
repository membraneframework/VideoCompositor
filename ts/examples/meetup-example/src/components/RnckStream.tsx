import { InputStream, Text, useInputStreams, View } from '@swmansion/smelter';

function RnckStream() {
  const inputs = useInputStreams();
  const inputState = inputs['video']?.videoState;

  if (inputState === 'playing') {
    return (
      <View style={{ width: 1280, height: 720 }}>
        <InputStream inputId="video" />
        <View style={{ width: 230, height: 40, backgroundColor: '#ffffff', bottom: 20, left: 500 }}>
          <Text
            style={{
              fontSize: 48,
              fontWeight: 'semi_bold',
              fontFamily: 'Noto Sans',
              color: '#33539d',
            }}>
            Playing MP4 file
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
