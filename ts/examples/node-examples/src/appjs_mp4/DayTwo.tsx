import { View, SlideShow, Slide, Image } from '@swmansion/smelter';
import { TitleSlide } from './TitleSlide';
import path from 'path';

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
        <Slide>
          <TitleSlide text={'Day two!'} />
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
