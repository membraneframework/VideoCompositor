import './App.css';
import { useCallback } from 'react';
import { setWasmBundleUrl, type Smelter } from '@swmansion/smelter-web-wasm';
import CompositorCanvas from './components/SmelterCanvas';
import NotoSansFont from '../assets/Aeonik.woff';

import SpeakerUrl from '../assets/speaker.mp4';
import RnckUrl from '../assets/rnck.mp4';
import RnckStream from './components/RnckStream';

const MP4_URL =
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4';
// const SPEAKER_URL = '../assets/speaker.mp4';
// const RNCK_URL = '../assets/rnck.mp4';

setWasmBundleUrl('/assets/smelter.wasm');

function App() {
  console.log('RnckUrl ', RnckUrl);
  const onCanvasCreate = useCallback(async (compositor: Smelter) => {
    await compositor.registerFont(NotoSansFont);
    await compositor.registerInput('speaker', { type: 'mp4', url: SpeakerUrl });
    await compositor.registerInput('rnck', {
      type: 'mp4',
      url: new URL(RnckUrl, import.meta.url).toString(),
    });
  }, []);

  return (
    <div className="card">
      <CompositorCanvas onCanvasCreate={onCanvasCreate} width={1920} height={1080}>
        <RnckStream />
      </CompositorCanvas>
    </div>
  );
}

export default App;
