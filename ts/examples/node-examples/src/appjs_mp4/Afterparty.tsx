import { View, SlideShow, Slide } from '@swmansion/smelter';
import { TitleSlide } from './TitleSlide';
import { ImageTile } from './ImageTile';
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
        <Slide durationMs={3000}>
          <TitleSlide text={'Afterparty!'} />
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
