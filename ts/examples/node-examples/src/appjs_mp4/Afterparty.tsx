import { View, SlideShow, Slide, Image } from '@swmansion/smelter';
import { TitleSlide } from './TitleSlide';

const ASSETS = [
  { source: './assets/afterparty/afterparty1.jpeg' },
  { source: './assets/afterparty/afterparty2.jpeg' },
  { source: './assets/afterparty/afterparty3.jpeg' },
  { source: './assets/afterparty/afterparty4.jpeg' },
  { source: './assets/afterparty/afterparty5.jpeg' },
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

// function SlideWithLabel({ label, children }: { label: string; children: ReactElement }) {
//   return (
//     <View>
//       <Rescaler>{children}</Rescaler>
//       <View style={{ bottom: 10, left: 10, height: 50 }}>
//         <Text
//           style={{ fontSize: 40, color: '#FF0000', lineHeight: 50, backgroundColor: '#FFFFFF88' }}>
//           {label}
//         </Text>
//       </View>
//     </View>
//   );
// }
