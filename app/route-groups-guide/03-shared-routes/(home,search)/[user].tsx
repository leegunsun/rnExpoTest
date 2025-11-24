/**
 * Shared Route - 사용자 프로필 화면
 *
 * 배열 문법 덕분에 이 파일 하나가 두 경로를 생성합니다:
 * - /(home)/[user] → 홈 탭에서 접근
 * - /(search)/[user] → 검색 탭에서 접근
 *
 * 네비게이션 스택은 각각 독립적으로 유지됩니다!
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

export default function UserProfileScreen() {
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
  const currentGroup = segments[segments.length - 3]; // (home) 또는 (search)
  const fromTab = currentGroup === "(home)" ? "홈" : currentGroup === "(search)" ? "검색" : "알 수 없음";

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Profile Header */}
        <View style={[styles.profileHeader, { backgroundColor: colors.card }]}>
          <View style={styles.avatar}>
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
        <View style={[styles.sharedInfo, { backgroundColor: "#4ECDC4" }]}>
          <Text style={styles.sharedIcon}>🔗</Text>
          <ThemedText style={styles.sharedTitle}>
            Shared Route 동작 중!
          </ThemedText>
          <ThemedText style={styles.sharedText}>
            이 화면은 {fromTab} 탭에서 접근했습니다
          </ThemedText>
        </View>

        {/* Technical Details */}
        <View style={[styles.detailsBox, { backgroundColor: colors.card }]}>
          <ThemedText type="subtitle" style={styles.detailsTitle}>
            🔍 기술 정보
          </ThemedText>

          <View style={styles.detailItem}>
            <ThemedText style={styles.detailLabel}>📂 파일 경로:</ThemedText>
            <ThemedText style={styles.detailValue}>
              app/(home,search)/[user].tsx
            </ThemedText>
          </View>

          <View style={styles.detailItem}>
            <ThemedText style={styles.detailLabel}>🌐 실제 URL:</ThemedText>
            <ThemedText style={[styles.detailValue, styles.url]}>
              {pathname}
            </ThemedText>
          </View>

          <View style={styles.detailItem}>
            <ThemedText style={styles.detailLabel}>🧭 Segments:</ThemedText>
            <ThemedText style={styles.detailValue}>
              {JSON.stringify(segments, null, 2)}
            </ThemedText>
          </View>

          <View style={styles.detailItem}>
            <ThemedText style={styles.detailLabel}>📍 접근 경로:</ThemedText>
            <ThemedText style={styles.detailValue}>
              {currentGroup === "(home)" && "/(home)/[user] → 홈 탭"}
              {currentGroup === "(search)" && "/(search)/[user] → 검색 탭"}
            </ThemedText>
          </View>
        </View>

        {/* Explanation */}
        <View
          style={[
            styles.explanationBox,
            { backgroundColor: colors.card, borderColor: "#FFB347" },
          ]}
        >
          <ThemedText type="subtitle" style={styles.explanationTitle}>
            💡 어떻게 동작하나요?
          </ThemedText>
          <ThemedText style={styles.explanationText}>
            <ThemedText style={styles.bold}>1. 배열 문법:</ThemedText>
            {"\n"}(home,search)/ 디렉터리가 두 개의 경로를 생성
            {"\n\n"}
            <ThemedText style={styles.bold}>2. 독립적 스택:</ThemedText>
            {"\n"}홈 탭과 검색 탭의 네비게이션 스택은 별도로 관리
            {"\n\n"}
            <ThemedText style={styles.bold}>3. 뒤로 가기:</ThemedText>
            {"\n"}뒤로 가면 각 탭의 이전 화면으로 돌아감
            {"\n\n"}
            <ThemedText style={styles.highlight}>
              ✨ Instagram이나 Twitter에서 사용하는 바로 그 패턴입니다!
            </ThemedText>
          </ThemedText>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.backButton,
            { borderColor: colors.tint },
            pressed && styles.buttonPressed,
          ]}
          onPress={() => router.back()}
        >
          <Text style={[styles.backButtonText, { color: colors.tint }]}>
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
    paddingTop: 60,
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
    backgroundColor: "#4ECDC4",
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
  url: { color: "#4ECDC4" },
  explanationBox: {
    marginHorizontal: 20,
    marginTop: 24,
    padding: 20,
    borderRadius: 12,
    borderWidth: 2,
  },
  explanationTitle: { marginBottom: 12 },
  explanationText: { fontSize: 13, lineHeight: 22, opacity: 0.8 },
  bold: { fontWeight: "700" },
  highlight: { fontWeight: "600", color: "#4ECDC4" },
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
