import { OfflineSmelter } from '@swmansion/smelter-node';
import { SlideShow, Slide } from '@swmansion/smelter';
import { downloadAllAssets } from '../utils';
import path from 'path';
import { TitleSlide } from './TitleSlide';
import { DayOneScene } from './DayOne';
import { DayTwoScene } from './DayTwo';
import { AfterpartyScene } from './Afterparty';

function AppJs() {
  return (
    <SlideShow>
      <Slide durationMs={3000}>
        <TitleSlide text="App.js conf 2024" />
      </Slide>
      <Slide>
        <DayOneScene />
      </Slide>
      <Slide>
        <DayTwoScene />
      </Slide>
      <Slide>
        <AfterpartyScene />
      </Slide>
    </SlideShow>
  );
}

async function run() {
  await downloadAllAssets();
  const smelter = new OfflineSmelter();
  await smelter.init();

  await smelter.registerInput('input_1', {
    type: 'mp4',
    serverPath: path.join(__dirname, '../../.assets/BigBuckBunny.mp4'),
    offsetMs: 0,
    required: true,
  });

  await smelter.render(<AppJs />, {
    type: 'mp4',
    serverPath: path.join(__dirname, '../../.assets/appjss_output.mp4'),
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
    audio: {
      encoder: {
        type: 'aac',
        channels: 'stereo',
      },
    },
  });
}
void run();
