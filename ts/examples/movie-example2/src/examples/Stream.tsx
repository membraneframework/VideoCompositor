import { InputStream, Rescaler, useInputStreams, View } from '@swmansion/smelter';
import { useStore } from 'zustand';
import { store } from '../store';
import Commercial from './Commercial';

function Stream() {
  const showCommercial = useStore(store, state => state.showCommercial);

  const inputs = useInputStreams();
  const hasScreenCapture = !!inputs['screen'];
  const cameraPosition = hasScreenCapture
    ? {
        top: 16,
        left: 16,
        width: 256,
        height: 180,
      }
    : {
        top: 0,
        left: 0,
        width: 1026,
        height: 578,
      };

  if (showCommercial) {
    return <Commercial />;
  }

  return (
    <View style={{ backgroundColor: '#161127' }}>
      <Rescaler
        style={{
          borderRadius: 24,
          borderColor: 'white',
          borderWidth: 1,
        }}>
        <InputStream inputId="screen" />
      </Rescaler>
      <Rescaler
        transition={{ durationMs: 1000 }}
        style={{
          ...cameraPosition,
          rescaleMode: 'fill',
          borderRadius: 24,
        }}>
        <InputStream inputId="camera" />
      </Rescaler>
    </View>
  );
}
export default Stream;
