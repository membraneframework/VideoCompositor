import { Text, Rescaler } from '@swmansion/smelter';

export function TitleSlide(props: { text: string }) {
  return (
    <Rescaler>
      <Text
        style={{
          fontSize: 400,
          color: '#FFFFFF',
          lineHeight: 800,
          backgroundColor: '#10156a',
        }}>
        {props.text}
      </Text>
    </Rescaler>
  );
}
