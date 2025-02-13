import { InputStream, Rescaler, View } from '@swmansion/smelter';

function Commercial() {
  return (
    <View style={{ backgroundColor: '#161127' }}>
      <Rescaler
        style={{
          borderRadius: 24,
          borderColor: 'white',
          borderWidth: 1,
        }}>
        <InputStream inputId="commercial" />
      </Rescaler>
    </View>
  );
}
export default Commercial;
