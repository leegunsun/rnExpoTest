/**
 * 03. Shared Routes - 탭 레이아웃
 *
 * 이 레이아웃이 (home)과 (search) 탭을 관리합니다.
 * 각 탭의 [user].tsx는 동일한 _shared/UserProfileScreen.tsx를 사용합니다.
 */

import { Tabs } from "expo-router";
import { Text } from "react-native";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function SharedRoutesLayout() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.tint,
        tabBarStyle: {
          backgroundColor: colors.background,
        },
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.text,
      }}
    >
      <Tabs.Screen
        name="(home)"
        options={{
          title: "홈",
          tabBarIcon: () => <Text style={{ fontSize: 20 }}>🏠</Text>,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="(search)"
        options={{
          title: "검색",
          tabBarIcon: () => <Text style={{ fontSize: 20 }}>🔍</Text>,
          headerShown: false,
        }}
      />
      {/* index.tsx는 탭에서 숨김 - 가이드 진입점으로만 사용 */}
      <Tabs.Screen
        name="index"
        options={{
          href: null,
        }}
      />
      {/* _shared 폴더는 라우트가 아니므로 설정 불필요 */}
    </Tabs>
  );
}
