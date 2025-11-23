/**
 * Examples Layout
 *
 * (examples) 라우트 그룹의 레이아웃 설정
 *
 * Route Groups:
 * - 괄호로 감싼 폴더 (예: (examples))는 URL 경로에 포함되지 않음
 * - 관련 화면들을 그룹화하면서 URL 구조는 유지
 * - 각 그룹마다 독립적인 레이아웃 설정 가능
 *
 * Stack Navigation:
 * - Expo Router의 Stack은 화면 전환과 네비게이션 스택 관리
 * - Flutter의 Navigator.push/pop과 유사
 * - headerShown, title 등 옵션으로 커스터마이징
 */

import { Stack } from "expo-router";

export default function ExamplesLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "#4ECDC4",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "600",
        },
      }}
    >
      {/* 예제 인덱스 */}
      <Stack.Screen
        name="index"
        options={{
          title: "학습 예제",
          headerShown: true,
        }}
      />

      {/* 레이아웃 예제 */}
      <Stack.Screen
        name="layout-examples"
        options={{
          title: "레이아웃 기초",
          headerShown: true,
        }}
      />

      {/* 앱 바 예제 */}
      <Stack.Screen
        name="appbar-example"
        options={{
          title: "앱 바 (AppBar)",
          headerShown: true,
        }}
      />

      {/* 바텀 네비게이션 예제 */}
      <Stack.Screen
        name="bottom-nav-example"
        options={{
          title: "바텀 네비게이션",
          headerShown: true,
        }}
      />

      {/* FAB 예제 */}
      <Stack.Screen
        name="fab-example"
        options={{
          title: "플로팅 액션 버튼",
          headerShown: true,
        }}
      />

      {/* 통합 예제 */}
      <Stack.Screen
        name="combined-example"
        options={{
          title: "통합 예제",
          headerShown: true,
        }}
      />
    </Stack>
  );
}
