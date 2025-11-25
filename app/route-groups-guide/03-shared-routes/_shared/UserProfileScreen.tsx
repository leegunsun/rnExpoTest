/**
 * 공유 프로필 화면 컴포넌트
 *
 * (home)/[user].tsx와 (search)/[user].tsx에서 공유됩니다.
 * _shared 폴더는 라우트로 인식되지 않습니다 (언더스코어 접두사).
 */

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useLocalSearchParams, usePathname, useRouter, useSegments } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

// 사용자 데이터 (예시)
const USERS: Record<string, { name: string; bio: string; followers: string; posts: string }> = {
  "user-baconbrix": {
    name: "Bacon Brix",
    bio: "React Native & Expo enthusiast 🚀",
    followers: "12.5K",
    posts: "342",
  },
  "user-expo": {
    name: "Expo Team",
    bio: "Build amazing apps with React Native 💙",
    followers: "89.2K",
    posts: "1.2K",
  },
};

export function UserProfileScreen() {
  const router = useRouter();
  const { user } = useLocalSearchParams<{ user: string }>();
  const pathname = usePathname();
  const segments = useSegments();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const userData = USERS[user || ""] || {
    name: user?.replace("user-", "") || "Unknown",
    bio: "No bio available",
    followers: "0",
    posts: "0",
  };

  // 현재 어느 그룹에서 접근했는지 판단
  const currentGroup = segments.find(seg => seg === "(home)" || seg === "(search)");
  const fromTab = currentGroup === "(home)" ? "홈" : currentGroup === "(search)" ? "검색" : "알 수 없음";
  const tabColor = currentGroup === "(home)" ? "#4ECDC4" : currentGroup === "(search)" ? "#FF6B6B" : "#95A5A6";

  // 🔍 디버깅용 console.log
  console.log("=== [user].tsx Debug Info ===");
  console.log("user:", user);
  console.log("pathname:", pathname);
  console.log("segments:", JSON.stringify(segments));
  console.log("currentGroup:", currentGroup);
  console.log("fromTab:", fromTab);
  console.log("============================");

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Profile Header */}
        <View style={[styles.profileHeader, { backgroundColor: colors.card }]}>
          <View style={[styles.avatar, { backgroundColor: tabColor }]}>
            <Text style={styles.avatarText}>
              {userData.name.charAt(0).toUpperCase()}
            </Text>
          </View>
          <ThemedText type="title" style={styles.name}>
            {userData.name}
          </ThemedText>
          <ThemedText style={styles.username}>@{user?.replace("user-", "")}</ThemedText>
          <ThemedText style={styles.bio}>{userData.bio}</ThemedText>

          <View style={styles.stats}>
            <View style={styles.statItem}>
              <ThemedText style={styles.statValue}>{userData.posts}</ThemedText>
              <ThemedText style={styles.statLabel}>게시물</ThemedText>
            </View>
            <View style={styles.statItem}>
              <ThemedText style={styles.statValue}>{userData.followers}</ThemedText>
              <ThemedText style={styles.statLabel}>팔로워</ThemedText>
            </View>
          </View>
        </View>

        {/* Shared Route Info */}
        <View style={[styles.sharedInfo, { backgroundColor: tabColor }]}>
          <Text style={styles.sharedIcon}>🔗</Text>
          <Text style={styles.sharedTitle}>
            Shared Route 동작 중!
          </Text>
          <Text style={styles.sharedText}>
            이 화면은 <Text style={styles.bold}>{fromTab}</Text> 탭에서 접근했습니다
          </Text>
        </View>

        {/* Technical Details */}
        <View style={[styles.detailsBox, { backgroundColor: colors.card }]}>
          <ThemedText type="subtitle" style={styles.detailsTitle}>
            🔍 기술 정보
          </ThemedText>

          <View style={styles.detailItem}>
            <ThemedText style={styles.detailLabel}>📂 파일 경로:</ThemedText>
            <ThemedText style={styles.detailValue}>
              _shared/UserProfileScreen.tsx
            </ThemedText>
          </View>

          <View style={styles.detailItem}>
            <ThemedText style={styles.detailLabel}>📍 라우트 파일:</ThemedText>
            <ThemedText style={styles.detailValue}>
              ({currentGroup || "?"})/[user].tsx
            </ThemedText>
          </View>

          <View style={styles.detailItem}>
            <ThemedText style={styles.detailLabel}>🌐 실제 URL:</ThemedText>
            <ThemedText style={[styles.detailValue, { color: tabColor }]}>
              {pathname}
            </ThemedText>
          </View>

          <View style={styles.detailItem}>
            <ThemedText style={styles.detailLabel}>🧭 Segments:</ThemedText>
            <ThemedText style={styles.detailValue}>
              {JSON.stringify(segments, null, 2)}
            </ThemedText>
          </View>
        </View>

        {/* Explanation */}
        <View
          style={[
            styles.explanationBox,
            { backgroundColor: colors.card, borderColor: tabColor },
          ]}
        >
          <ThemedText type="subtitle" style={styles.explanationTitle}>
            💡 어떻게 동작하나요?
          </ThemedText>
          <ThemedText style={styles.explanationText}>
            <ThemedText style={styles.bold}>1. 공유 컴포넌트:</ThemedText>
            {"\n"}_shared/UserProfileScreen.tsx에 로직 작성
            {"\n\n"}
            <ThemedText style={styles.bold}>2. 각 탭에서 import:</ThemedText>
            {"\n"}(home)/[user].tsx → import 후 export
            {"\n"}(search)/[user].tsx → import 후 export
            {"\n\n"}
            <ThemedText style={styles.bold}>3. 독립적 스택:</ThemedText>
            {"\n"}각 탭의 네비게이션 스택이 별도로 관리됨
            {"\n\n"}
            <ThemedText style={{ fontWeight: "600", color: tabColor }}>
              ✨ 뒤로 가기하면 {fromTab} 탭으로 돌아갑니다!
            </ThemedText>
          </ThemedText>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.backButton,
            { borderColor: tabColor },
            pressed && styles.buttonPressed,
          ]}
          onPress={() => router.back()}
        >
          <Text style={[styles.backButtonText, { color: tabColor }]}>
            ← {fromTab} 탭으로 돌아가기
          </Text>
        </Pressable>

        <View style={{ height: 40 }} />
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingBottom: 40 },
  profileHeader: {
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 32,
    alignItems: "center",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  avatarText: { fontSize: 32, fontWeight: "700", color: "#FFFFFF" },
  name: { marginBottom: 4 },
  username: { fontSize: 14, opacity: 0.7, marginBottom: 12 },
  bio: { fontSize: 14, textAlign: "center", marginBottom: 20 },
  stats: { flexDirection: "row", gap: 32 },
  statItem: { alignItems: "center" },
  statValue: { fontSize: 20, fontWeight: "700" },
  statLabel: { fontSize: 12, opacity: 0.7, marginTop: 4 },
  sharedInfo: {
    marginHorizontal: 20,
    marginTop: 24,
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
  },
  sharedIcon: { fontSize: 48, marginBottom: 12 },
  sharedTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  sharedText: { fontSize: 14, color: "#FFFFFF", opacity: 0.9 },
  bold: { fontWeight: "700" },
  detailsBox: {
    marginHorizontal: 20,
    marginTop: 24,
    padding: 20,
    borderRadius: 12,
  },
  detailsTitle: { marginBottom: 16 },
  detailItem: { marginBottom: 16 },
  detailLabel: { fontSize: 13, fontWeight: "700", marginBottom: 6 },
  detailValue: { fontSize: 12, fontFamily: "monospace", opacity: 0.8 },
  explanationBox: {
    marginHorizontal: 20,
    marginTop: 24,
    padding: 20,
    borderRadius: 12,
    borderWidth: 2,
  },
  explanationTitle: { marginBottom: 12 },
  explanationText: { fontSize: 13, lineHeight: 22, opacity: 0.8 },
  backButton: {
    marginHorizontal: 20,
    marginTop: 24,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 2,
  },
  buttonPressed: { opacity: 0.7 },
  backButtonText: { fontSize: 16, fontWeight: "600" },
});
