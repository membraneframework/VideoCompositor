import Smelter from '@swmansion/smelter-node';
import { View, Text } from '@swmansion/smelter';
import { ffplayStartPlayerAsync } from './smelterFfplayHelper';

function App() {
  return (
    <View style={{ direction: 'column' }}>
      <View />
      <Text style={{ fontSize: 50 }}>Open index.ts and get started</Text>
      <View style={{ height: 20 }} />
      <Text style={{ width: 1000, fontSize: 30, wrap: 'word' }}>
        This example renders static text and sends the output stream via RTP to local port 8001.
        Generated code includes helpers in smelterFfplayHelper.ts that display the output stream
        using ffplay, make sure to remove them for any real production use.
      </Text>
      <View />
    </View>
  );
}

async function run() {
  const smelter = new Smelter();
  await smelter.init();

  // Display output with `ffplay`.
  await ffplayStartPlayerAsync('127.0.0.0', 8001);

  await smelter.registerOutput('output_1', <App />, {
    type: 'rtp_stream',
    port: 8001,
    ip: '127.0.0.1',
    transportProtocol: 'udp',
    video: {
      encoder: {
        type: 'ffmpeg_h264',
        preset: 'ultrafast',
      },
      resolution: {
        width: 1920,
        height: 1080,
      },
    },
  });

  // Connect any additional inputs/images/shader you might need before the start.

  await smelter.start();
}
void run();
