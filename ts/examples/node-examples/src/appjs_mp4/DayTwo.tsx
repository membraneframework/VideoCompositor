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
        {/* <Slide durationMs={3000}>
          <SlideWithLabel label="BigBuckBunny sample video as <InputStream />">
            <InputStream inputId="input_1" />
          </SlideWithLabel>
        </Slide>
        <Slide>
          <TitleSlide text="Part 2" />
        </Slide>
        <Slide>
          <SlideWithLabel label="ForBiggerEscapes sample video as <Mp4 />">
            <Mp4
              source="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4"
              volume={0.8}
            />
          </SlideWithLabel>
        </Slide>
        <Slide>
          <TitleSlide text="Part 3" />
        </Slide>
        <Slide>
          <SlideWithLabel label="ForBiggerBlazes sample video as <Mp4 />">
            <Mp4
              source="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
              volume={0.8}
            />
          </SlideWithLabel>
        </Slide> */}
      </SlideShow>
    </View>
  );
}
