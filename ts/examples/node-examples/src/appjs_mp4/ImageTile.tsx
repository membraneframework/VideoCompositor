import { Rescaler, Image } from '@swmansion/smelter';

export function ImageTile({ source }: { source: string }) {
  return (
    <Rescaler>
      <Image source={source} />
    </Rescaler>
  );
}
