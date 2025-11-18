import { StyleSheet, Text, View } from 'react-native';



// function SomeComp() {
//   return <Text>Hello</Text>;
// }

// SomeComp에 Screen이라는 하위 컴포넌트를 붙임
SomeComp.Screen = function MyScreen() {
  return <Text>I am a screen!</Text>;
};

export default function HomeScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {/* <SomeComp /> */}
      <SomeComp.Screen />
    </View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
