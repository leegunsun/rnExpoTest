/**
 * 공유 프로필 화면 컴포넌트
 *
 * (home)/[user].tsx와 (search)/[user].tsx에서 공유됩니다.
 * _shared 폴더는 라우트로 인식되지 않습니다 (언더스코어 접두사).
 *
 * 여러 파라미터 수신 예제:
 * - user: 동적 세그먼트 (필수)
 * - tab, referrer, highlight 등: 쿼리 파라미터 (선택)
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

// 파라미터 타입 정의
type ProfileParams = {
  // 필수: 동적 세그먼트
  user: string;
  // 선택: 쿼리 파라미터들
  tab?: string;
  referrer?: string;
  highlight?: string;
  badge?: string;
  scrollTo?: string;
  showModal?: string;
  searchQuery?: string;
  resultIndex?: string;
  isRecommended?: string;
  filter?: string;
  sortBy?: string;
  showStats?: string;
  expandBio?: string;
  category?: string;
};

export function UserProfileScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<ProfileParams>();
  const pathname = usePathname();
  const segments = useSegments();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  // 필수 파라미터
  const { user } = params;

  // 선택적 파라미터들 추출
  const {
    tab,
    referrer,
    highlight,
    badge,
    scrollTo,
    showModal,
    searchQuery,
    resultIndex,
    isRecommended,
    filter,
    sortBy,
    showStats,
    expandBio,
    category,
  } = params;

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

  // user를 제외한 쿼리 파라미터만 추출
  const queryParams = Object.entries(params).filter(
    ([key, value]) => key !== "user" && value !== undefined
  );

  // 디버깅용 console.log
  console.log("=== [user].tsx Debug Info ===");
  console.log("All params:", JSON.stringify(params));
  console.log("user:", user);
  console.log("Query params count:", queryParams.length);
  console.log("pathname:", pathname);
  console.log("segments:", JSON.stringify(segments));
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
            {badge === "verified" || badge === "official" ? " ✓" : ""}
          </ThemedText>
          <ThemedText style={styles.username}>@{user?.replace("user-", "")}</ThemedText>
          <ThemedText style={styles.bio}>{userData.bio}</ThemedText>

          {/* 뱃지 표시 */}
          {badge && (
            <View style={[styles.badgeContainer, { backgroundColor: tabColor }]}>
              <Text style={styles.badgeText}>🏆 {badge}</Text>
            </View>
          )}

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

        {/* 컨텍스트 정보 */}
        <View style={[styles.contextInfo, { backgroundColor: tabColor }]}>
          <Text style={styles.contextIcon}>🔗</Text>
          <Text style={styles.contextTitle}>
            {fromTab} 탭에서 접근
          </Text>
          {referrer && (
            <Text style={styles.contextSubtitle}>
              referrer: {referrer}
            </Text>
          )}
        </View>

        {/* 📦 전달받은 파라미터 표시 */}
        <View style={[styles.paramsBox, { backgroundColor: colors.card, borderColor: tabColor }]}>
          <ThemedText type="subtitle" style={styles.paramsTitle}>
            📦 전달받은 파라미터 ({queryParams.length + 1}개)
          </ThemedText>

          {/* 필수 파라미터: user */}
          <View style={[styles.paramItem, { borderLeftColor: tabColor }]}>
            <ThemedText style={styles.paramKey}>user</ThemedText>
            <ThemedText style={styles.paramValue}>{user}</ThemedText>
            <ThemedText style={styles.paramType}>동적 세그먼트 (필수)</ThemedText>
          </View>

          {/* 선택적 쿼리 파라미터들 */}
          {queryParams.map(([key, value]) => (
            <View key={key} style={[styles.paramItem, { borderLeftColor: "#FFB347" }]}>
              <ThemedText style={styles.paramKey}>{key}</ThemedText>
              <ThemedText style={styles.paramValue}>{value}</ThemedText>
              <ThemedText style={styles.paramType}>쿼리 파라미터</ThemedText>
            </View>
          ))}

          {queryParams.length === 0 && (
            <ThemedText style={styles.noParams}>
              쿼리 파라미터 없음 (user만 전달됨)
            </ThemedText>
          )}
        </View>

        {/* 활성 탭 표시 (tab 파라미터가 있을 경우) */}
        {tab && (
          <View style={[styles.activeTabBox, { backgroundColor: colors.card }]}>
            <ThemedText type="subtitle" style={styles.activeTabTitle}>
              📑 활성 탭: {tab}
            </ThemedText>
            <View style={styles.tabButtons}>
              {["posts", "followers", "media", "likes"].map((t) => (
                <View
                  key={t}
                  style={[
                    styles.tabButton,
                    { backgroundColor: t === tab ? tabColor : colors.background },
                  ]}
                >
                  <Text style={[styles.tabButtonText, { color: t === tab ? "#FFF" : colors.text }]}>
                    {t}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* 하이라이트 효과 */}
        {highlight === "true" && (
          <View style={[styles.highlightBox, { borderColor: "#FFB347" }]}>
            <Text style={styles.highlightIcon}>✨</Text>
            <ThemedText style={styles.highlightText}>
              하이라이트 모드 활성화됨!
            </ThemedText>
          </View>
        )}

        {/* 검색 관련 정보 */}
        {searchQuery && (
          <View style={[styles.searchInfoBox, { backgroundColor: colors.card }]}>
            <ThemedText type="subtitle">🔍 검색 정보</ThemedText>
            <ThemedText style={styles.searchInfoText}>
              검색어: "{searchQuery}"
              {resultIndex && `\n검색 결과 순위: #${resultIndex}`}
              {isRecommended === "true" && "\n⭐ 추천 계정"}
            </ThemedText>
          </View>
        )}

        {/* 기술 정보 */}
        <View style={[styles.techBox, { backgroundColor: colors.card }]}>
          <ThemedText type="subtitle" style={styles.techTitle}>
            🔧 기술 정보
          </ThemedText>

          <View style={styles.techItem}>
            <ThemedText style={styles.techLabel}>pathname:</ThemedText>
            <ThemedText style={[styles.techValue, { color: tabColor }]}>{pathname}</ThemedText>
          </View>

          <View style={styles.techItem}>
            <ThemedText style={styles.techLabel}>segments:</ThemedText>
            <ThemedText style={styles.techValue}>{JSON.stringify(segments)}</ThemedText>
          </View>

          <View style={styles.techItem}>
            <ThemedText style={styles.techLabel}>currentGroup:</ThemedText>
            <ThemedText style={styles.techValue}>{currentGroup || "undefined"}</ThemedText>
          </View>
        </View>

        {/* 코드 예시 */}
        <View style={[styles.codeBox, { backgroundColor: colors.card, borderColor: tabColor }]}>
          <ThemedText type="subtitle" style={styles.codeTitle}>
            💻 파라미터 받기 코드
          </ThemedText>
          <ThemedText style={styles.codeText}>
{`// 타입 정의
type ProfileParams = {
  user: string;        // 필수
  tab?: string;        // 선택
  referrer?: string;   // 선택
  // ...
};

// 파라미터 받기
const params = useLocalSearchParams<ProfileParams>();
const { user, tab, referrer } = params;`}
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
    paddingBottom: 24,
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
  username: { fontSize: 14, opacity: 0.7, marginBottom: 8 },
  bio: { fontSize: 14, textAlign: "center", marginBottom: 12 },
  badgeContainer: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 12,
  },
  badgeText: { color: "#FFFFFF", fontSize: 12, fontWeight: "600" },
  stats: { flexDirection: "row", gap: 32 },
  statItem: { alignItems: "center" },
  statValue: { fontSize: 20, fontWeight: "700" },
  statLabel: { fontSize: 12, opacity: 0.7, marginTop: 4 },
  contextInfo: {
    marginHorizontal: 20,
    marginTop: 20,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  contextIcon: { fontSize: 32, marginBottom: 8 },
  contextTitle: { fontSize: 16, fontWeight: "700", color: "#FFFFFF" },
  contextSubtitle: { fontSize: 12, color: "#FFFFFF", opacity: 0.8, marginTop: 4 },
  paramsBox: {
    marginHorizontal: 20,
    marginTop: 20,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
  },
  paramsTitle: { marginBottom: 12 },
  paramItem: {
    paddingLeft: 12,
    paddingVertical: 8,
    borderLeftWidth: 3,
    marginBottom: 8,
  },
  paramKey: { fontSize: 14, fontWeight: "700", fontFamily: "monospace" },
  paramValue: { fontSize: 13, fontFamily: "monospace", opacity: 0.8 },
  paramType: { fontSize: 10, opacity: 0.5, marginTop: 2 },
  noParams: { fontSize: 13, opacity: 0.5, fontStyle: "italic" },
  activeTabBox: {
    marginHorizontal: 20,
    marginTop: 20,
    padding: 16,
    borderRadius: 12,
  },
  activeTabTitle: { marginBottom: 12 },
  tabButtons: { flexDirection: "row", gap: 8 },
  tabButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tabButtonText: { fontSize: 12, fontWeight: "600" },
  highlightBox: {
    marginHorizontal: 20,
    marginTop: 20,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF9E6",
  },
  highlightIcon: { fontSize: 24, marginRight: 12 },
  highlightText: { fontSize: 14, fontWeight: "600", color: "#FFB347" },
  searchInfoBox: {
    marginHorizontal: 20,
    marginTop: 20,
    padding: 16,
    borderRadius: 12,
  },
  searchInfoText: { fontSize: 13, opacity: 0.8, marginTop: 8, lineHeight: 20 },
  techBox: {
    marginHorizontal: 20,
    marginTop: 20,
    padding: 16,
    borderRadius: 12,
  },
  techTitle: { marginBottom: 12 },
  techItem: { marginBottom: 8 },
  techLabel: { fontSize: 12, fontWeight: "700", opacity: 0.7 },
  techValue: { fontSize: 11, fontFamily: "monospace", opacity: 0.8 },
  codeBox: {
    marginHorizontal: 20,
    marginTop: 20,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
  },
  codeTitle: { marginBottom: 12 },
  codeText: { fontSize: 10, fontFamily: "monospace", opacity: 0.8, lineHeight: 16 },
  backButton: {
    marginHorizontal: 20,
    marginTop: 20,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 2,
  },
  buttonPressed: { opacity: 0.7 },
  backButtonText: { fontSize: 16, fontWeight: "600" },
});
