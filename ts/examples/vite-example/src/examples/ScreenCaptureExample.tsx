import { useCallback, useRef } from 'react';
import type { Smelter } from '@swmansion/smelter-web-wasm';
import { InputStream, Rescaler, Text, View } from '@swmansion/smelter';
import CompositorCanvas from '../components/SmelterCanvas';
import NotoSansFont from '../../assets/NotoSans.ttf';

function ScreenCaptureExample() {
  const btnRef = useRef<HTMLButtonElement>(null);
  const onCanvasCreate = useCallback(async (smelter: Smelter) => {
    await smelter.registerFont(NotoSansFont);
    if (!btnRef.current) {
      return
    }
    // TODO(noituri): This is hacky  workaround for safari
    btnRef.current.onclick = async () => {
      try {
        await smelter.registerInput('screen', { type: 'screen_capture' });
      } catch (err: any) {
        console.warn('Failed to register screen capture input', err);
      }
    };
  }, []);

  return (
    <div className="card">
      <button ref={btnRef}>Share</button>
      <CompositorCanvas onCanvasCreate={onCanvasCreate} width={1280} height={720}>
        <Scene />
      </CompositorCanvas>
    </div>
  );
}

function Scene() {
  return (
    <View>
      <Rescaler>
        <InputStream inputId="screen" />
      </Rescaler>
      <View style={{ width: 400, height: 40, backgroundColor: '#000000', bottom: 20, left: 520 }}>
        <Text style={{ fontSize: 30, fontFamily: 'Noto Sans' }}>Screen capture example</Text>
      </View>
    </View>
  );
}

export default ScreenCaptureExample;
