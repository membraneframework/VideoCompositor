import { useCallback, useRef } from 'react';
import './App.css';
import Navbar from './components/Navbar.tsx';
import CompositorCanvas from './components/SmelterCanvas.tsx';
import Stream from './examples/Stream.tsx';
import { setWasmBundleUrl } from '@swmansion/smelter-web-wasm';
import NotoSansFont from '../assets/NotoSans.ttf';
import type { Smelter } from '@swmansion/smelter-web-wasm';
import { useStore } from 'zustand';
import { store } from './store.ts';
import CommercialMp4 from '../assets/appjs.mp4';

setWasmBundleUrl('/assets/smelter.wasm');

function App() {
  const toggleCommercial = useStore(store, state => state.toggleCommercial);

  const smelterRef = useRef<Smelter>();

  const onCanvasCreate = useCallback(async (smelter: Smelter) => {
    smelterRef.current = smelter;
    await smelter.registerFont(NotoSansFont);
    try {
      await smelter.registerInput('camera', { type: 'camera' });
      await smelterRef.current?.registerInput('commercial', {
        type: 'mp4',
        url: new URL(CommercialMp4, import.meta.url).toString(),
      });
    } catch (err: any) {
      console.warn('Failed to register input', err);
    }
  }, []);

  const shareScreen = async () => {
    await smelterRef.current?.registerInput('screen', { type: 'screen_capture' });
  };

  const runCommercial = async () => {
    toggleCommercial();
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
            <button onClick={runCommercial}>Break time</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
