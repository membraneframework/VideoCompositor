import './App.css';
import { useCallback } from 'react';
import type { Smelter } from '@swmansion/smelter-web-wasm';
import CompositorCanvas from './components/SmelterCanvas';
import NotoSansFont from '../assets/NotoSans.ttf';

const SPEAKER_URL = '../assets/speaker.mp4';
const RNCK_URL = '../assets/rnck.mp4';

import { setWasmBundleUrl } from '@swmansion/smelter-web-wasm';
import RnckStream from './components/RnckStream';

setWasmBundleUrl('/assets/smelter.wasm');

function App() {
  const onCanvasCreate = useCallback(async (compositor: Smelter) => {
    await compositor.registerFont(NotoSansFont);
    await compositor.registerInput('video', { type: 'mp4', url: MP4_URL });
  }, []);

  return (
    <div className="card">
      <CompositorCanvas onCanvasCreate={onCanvasCreate} width={1280} height={720}>
        <RnckStream />
      </CompositorCanvas>
    </div>
  );
}

export default App;
