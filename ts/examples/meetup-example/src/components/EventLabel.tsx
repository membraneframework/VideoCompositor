import { Text, View } from '@swmansion/smelter';

function EventLabel({ eventName }: { eventName: string }) {
  return (
    <View
      style={{
        width: 230,
        height: 40,
        bottom: 0,
        right: 0,
        paddingVertical: 80,
        paddingRight: 150,
      }}>
      <Text
        style={{
          fontSize: 58,
          fontWeight: 'semi_bold',
          fontFamily: 'Noto Sans',
          color: '#ffffff',
        }}>
        {eventName}
      </Text>
    </View>
  );
}

export default EventLabel;
