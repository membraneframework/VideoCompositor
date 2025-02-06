import { Text, View } from '@swmansion/smelter';
import { useEffect, useState } from 'react';
function Label() {
  const [labelActive, setLabelActive] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setLabelActive(true);
    }, 5000);
  }, []);

  return (
    <View
      id="label_container"
      style={{
        width: labelActive ? 540 : 0,
        height: 128,
        bottom: 50,
        left: 340,
        direction: 'column',
      }}
      transition={{ durationMs: 1000, easingFunction: 'bounce' }}>
      <View
        style={{
          paddingVertical: 8,
          paddingHorizontal: 24,
          backgroundColor: '#3f519666',
          height: 50,
          width: 485,
        }}>
        <Text
          style={{
            fontSize: 48,
            fontWeight: 'semi_bold',
            fontFamily: 'Noto Sans',
            color: '#FFFFFF',
          }}>
          KACPER KAPUŚCIAK
        </Text>
      </View>
      <View style={{ height: 8 }} />
      <View
        style={{
          paddingVertical: 8,
          paddingHorizontal: 24,
          backgroundColor: '#60A5CBCC',
          height: 50,
          width: 424,
        }}>
        <Text
          style={{
            fontSize: 32,
            fontFamily: 'Noto Sans',
            color: '#FFFFFF',
          }}>
          What's new in React Native
        </Text>
      </View>
      {/* <Text
        style={{
          fontSize: 48,
          fontWeight: 'semi_bold',
          fontFamily: 'Noto Sans',
          color: '#FFFFFF',
          backgroundColor: '#60A5CBCC',
        }}>
        What's new in React Native
      </Text> */}
    </View>
  );
}

export default Label;
