import { View, SlideShow, Slide, Image } from '@swmansion/smelter';
import { TitleSlide } from './TitleSlide';
import path from 'path';

const ASSETS = [
  { source: path.join(__dirname, 'assets/afterparty/afterparty1.jpeg') },
  { source: path.join(__dirname, 'assets/afterparty/afterparty2.jpeg') },
  { source: path.join(__dirname, 'assets/afterparty/afterparty3.jpeg') },
  { source: path.join(__dirname, 'assets/afterparty/afterparty4.jpeg') },
  { source: path.join(__dirname, 'assets/afterparty/afterparty5.jpeg') },
] as const;

export function AfterpartyScene() {
  return (
    <View>
      <SlideShow>
        <Slide>
          <TitleSlide text={'Afterparty!'} />
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
