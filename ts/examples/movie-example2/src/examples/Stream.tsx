import { InputStream, Rescaler, View } from '@swmansion/smelter';

function Stream() {
  return (
    <View style={{ backgroundColor: '#161127' }}>
      <Rescaler
        style={{
          width: 1024,
          height: 576,
          borderRadius: 24,
          borderColor: 'white',
          borderWidth: 1,
        }}>
        <InputStream inputId="screen" />
      </Rescaler>
      <Rescaler
        style={{
          top: 16,
          left: 16,
          width: 256,
          height: 180,
          rescaleMode: 'fill',
          borderRadius: 24,
        }}>
        <InputStream inputId="camera" />
      </Rescaler>
    </View>
  );
}

export default Stream;
