/**
 * (home) 그룹의 Stack 네비게이터
 *
 * 홈 탭 내의 화면들을 스택으로 관리합니다.
 * [user].tsx로 이동해도 이 스택 내에서 동작합니다.
 */

import { Stack } from "expo-router";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function HomeLayout() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.text,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "홈 탭",
          headerShown: true,
        }}
      />
    </Stack>
  );
}
