import { useCallback, useState } from 'react';
import './App.css';
import Navbar from './components/Navbar.tsx';
import CompositorCanvas from './components/SmelterCanvas.tsx';
import Stream from './examples/Stream.tsx';
import { setWasmBundleUrl } from '@swmansion/smelter-web-wasm';
import NotoSansFont from '../assets/NotoSans.ttf';
import type { Smelter } from '@swmansion/smelter-web-wasm';

setWasmBundleUrl('/assets/smelter.wasm');

function App() {
  const [smelter, setSmelter] = useState<Smelter>();

  const onCanvasCreate = useCallback(async (smelter: Smelter) => {
    setSmelter(smelter);
    await smelter.registerFont(NotoSansFont);
    try {
      await smelter.registerInput('camera', { type: 'camera' });
      // await smelter.registerInput('screen', { type: 'screen_capture' });
    } catch (err: any) {
      console.warn('Failed to register input', err);
    }
  }, []);

  const shareScreen = async () => {
    await smelter?.registerInput('screen', { type: 'screen_capture' });
  };

  return (
    <div className="mainWrapper">
      <Navbar />
      <div className="streamWrapper">
        <CompositorCanvas onCanvasCreate={onCanvasCreate} width={1026} height={578}>
          <Stream />
        </CompositorCanvas>
        <div className="buttonWrapper">
          <div>
            <button onClick={shareScreen}>Share screen</button>
          </div>
          <div>
            <button>Break time</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
