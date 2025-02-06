import { Rescaler, Text } from '@swmansion/smelter';

export function TitleSlide(props: { text: string }) {
  return (
    <Rescaler>
      <Text
        style={{
          fontSize: 800,
          color: '#FF0000',
          lineHeight: 800,
          backgroundColor: '#FFFFFF88',
        }}>
        {props.text}
      </Text>
    </Rescaler>
  );
}
