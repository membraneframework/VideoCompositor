import { useEffect, useState } from 'react';
import Smelter from '@swmansion/smelter-node';
import { View, Text } from '@swmansion/smelter';
import { ffplayStartPlayerAsync, sleep } from './utils';

type PartialTextProps = {
  text: string;
};

function SimpleComponent(props: PartialTextProps) {
  return <Text style={{ fontSize: 40 }}>{props.text}</Text>;
}

function ExampleApp() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (count > 4) {
      return;
    }
    const timeout = setTimeout(() => {
      setCount(count + 1);
    }, 5000);
    return () => {
      clearTimeout(timeout);
    };
  });

  return (
    <View style={{ direction: 'column' }}>
      {[...Array(count)].map((_value, index) => (
        <SimpleComponent key={index} text="Example text" />
      ))}
      <View />
      <Text style={{ fontSize: 30 }}>Text component example (fontSize={30})</Text>
      Raw text example (default fontSize={50})
      <View />
      Counter: {count}
    </View>
  );
}

async function run() {
  const smelter = new Smelter();
  await smelter.init();

  void ffplayStartPlayerAsync('127.0.0.1', 8001);
  await sleep(2000);

  await smelter.registerOutput('output_1', <ExampleApp />, {
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
  await smelter.start();
}
void run();
