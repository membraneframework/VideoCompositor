import { View, SlideShow, Slide } from '@swmansion/smelter';
import { TitleSlide } from './TitleSlide';
import path from 'path';
import { ImageTile } from './ImageTile';

const ASSETS = [
  { source: path.join(__dirname, 'assets/dayTwo/dayTwo1.jpeg') },
  { source: path.join(__dirname, 'assets/dayTwo/dayTwo2.jpeg') },
  { source: path.join(__dirname, 'assets/dayTwo/dayTwo3.jpeg') },
  { source: path.join(__dirname, 'assets/dayTwo/dayTwo4.jpeg') },
  { source: path.join(__dirname, 'assets/dayTwo/dayTwo5.jpeg') },
] as const;

export function DayTwoScene() {
  return (
    <View>
      <SlideShow>
        <Slide durationMs={3000}>
          <TitleSlide text={'Day two!'} />
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
