/**
 * Tabs Layout - Route Groups로 Tab Navigation 구성
 * 파일: app/route-groups-guide/02-layouts/(tabs)/_layout.tsx
 * (tabs)는 URL에 포함되지 않음
 */

import { Tabs } from "expo-router";
import { Text } from "react-native";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#4ECDC4",
        headerStyle: { backgroundColor: "#4ECDC4" },
        headerTintColor: "#fff",
        headerTitleStyle: { fontWeight: "bold" },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "홈",
          tabBarIcon: () => <Text>🏠</Text>,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "설정",
          tabBarIcon: () => <Text>⚙️</Text>,
        }}
      />
    </Tabs>
  );
}
