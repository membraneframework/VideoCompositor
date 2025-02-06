import { View, SlideShow, Slide, Image } from '@swmansion/smelter';
import { TitleSlide } from './TitleSlide';
import path from 'path';

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
        <Slide>
          <TitleSlide text={'Day one!'} />
        </Slide>
        {ASSETS.map(({ source }) => (
          <Slide key={source} durationMs={3000}>
            <Image source={source} />
          </Slide>
        ))}
      </SlideShow>
    </View>
  );
}
