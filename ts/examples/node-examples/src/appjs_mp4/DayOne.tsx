import { View, SlideShow, Slide } from '@swmansion/smelter';
import { TitleSlide } from './TitleSlide';
import path from 'path';
import { ImageTile } from './ImageTile';

const ASSETS = [
  { source: path.join(__dirname, 'assets/dayOne/dayOne1.jpeg') },
  { source: path.join(__dirname, 'assets/dayOne/dayOne2.jpeg') },
  { source: path.join(__dirname, 'assets/dayOne/dayOne3.jpeg') },
  { source: path.join(__dirname, 'assets/dayOne/dayOne4.jpeg') },
  { source: path.join(__dirname, 'assets/dayOne/dayOne5.jpeg') },
] as const;

export function DayOneScene() {
  return (
    <View>
      <SlideShow>
        <Slide durationMs={3000}>
          <TitleSlide text={'Day one!'} />
        </Slide>
        {ASSETS.map(({ source }) => (
          <Slide key={source} durationMs={3000}>
            <ImageTile source={source} />
          </Slide>
        ))}
      </SlideShow>
    </View>
  );
}
