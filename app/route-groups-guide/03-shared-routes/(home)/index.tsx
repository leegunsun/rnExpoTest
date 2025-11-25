/**
 * 홈 탭 메인 화면
 *
 * 여기서 [user] 프로필로 이동하면:
 * - segments에 "(home)"이 포함됨
 * - 뒤로 가기하면 이 화면으로 돌아옴
 *
 * 여러 파라미터 전달 예제:
 * - user: 동적 세그먼트 (URL 경로에 포함)
 * - tab, highlight, referrer: 쿼리 파라미터
 */

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

export default function HomeTabScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={[styles.header, { backgroundColor: "#4ECDC4" }]}>
          <Text style={styles.headerIcon}>🏠</Text>
          <ThemedText style={styles.headerTitle}>홈 탭</ThemedText>
          <ThemedText style={styles.headerSubtitle}>
            여러 파라미터 전달 예제
          </ThemedText>
        </View>

        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            👥 기본 파라미터 (user만 전달)
          </ThemedText>

          <Pressable
            style={({ pressed }) => [
              styles.userCard,
              { backgroundColor: colors.card },
              pressed && styles.pressed,
            ]}
            onPress={() => router.push({
              pathname: "/route-groups-guide/03-shared-routes/(home)/[user]",
              params: { user: "user-baconbrix" }
            })}
          >
            <View style={[styles.avatar, { backgroundColor: "#FF6B6B" }]}>
              <Text style={styles.avatarText}>B</Text>
            </View>
            <View style={styles.userInfo}>
              <ThemedText style={styles.userName}>Bacon Brix</ThemedText>
              <ThemedText style={styles.userHandle}>기본 (user만)</ThemedText>
            </View>
            <Text style={styles.arrow}>→</Text>
          </Pressable>
        </View>

        {/* 여러 파라미터 예제 섹션 */}
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            📦 여러 파라미터 전달 예제
          </ThemedText>
          <ThemedText style={styles.sectionDescription}>
            동적 세그먼트 + 쿼리 파라미터를 함께 전달합니다
          </ThemedText>

          {/* 예제 1: 탭 지정 */}
          <Pressable
            style={({ pressed }) => [
              styles.userCard,
              { backgroundColor: colors.card, borderLeftWidth: 4, borderLeftColor: "#FF6B6B" },
              pressed && styles.pressed,
            ]}
            onPress={() => router.push({
              pathname: "/route-groups-guide/03-shared-routes/(home)/[user]",
              params: {
                user: "user-baconbrix",
                tab: "posts",           // 기본 탭
                referrer: "home-feed"   // 어디서 왔는지
              }
            })}
          >
            <View style={[styles.avatar, { backgroundColor: "#FF6B6B" }]}>
              <Text style={styles.avatarText}>📝</Text>
            </View>
            <View style={styles.userInfo}>
              <ThemedText style={styles.userName}>게시물 탭으로 이동</ThemedText>
              <ThemedText style={styles.paramText}>tab: "posts", referrer: "home-feed"</ThemedText>
            </View>
            <Text style={styles.arrow}>→</Text>
          </Pressable>

          {/* 예제 2: 팔로워 탭 + 하이라이트 */}
          <Pressable
            style={({ pressed }) => [
              styles.userCard,
              { backgroundColor: colors.card, borderLeftWidth: 4, borderLeftColor: "#4ECDC4" },
              pressed && styles.pressed,
            ]}
            onPress={() => router.push({
              pathname: "/route-groups-guide/03-shared-routes/(home)/[user]",
              params: {
                user: "user-expo",
                tab: "followers",
                highlight: "true",
                badge: "verified"
              }
            })}
          >
            <View style={[styles.avatar, { backgroundColor: "#4ECDC4" }]}>
              <Text style={styles.avatarText}>👥</Text>
            </View>
            <View style={styles.userInfo}>
              <ThemedText style={styles.userName}>팔로워 + 하이라이트</ThemedText>
              <ThemedText style={styles.paramText}>tab: "followers", highlight: "true", badge: "verified"</ThemedText>
            </View>
            <Text style={styles.arrow}>→</Text>
          </Pressable>

          {/* 예제 3: 모든 파라미터 */}
          <Pressable
            style={({ pressed }) => [
              styles.userCard,
              { backgroundColor: colors.card, borderLeftWidth: 4, borderLeftColor: "#FFB347" },
              pressed && styles.pressed,
            ]}
            onPress={() => router.push({
              pathname: "/route-groups-guide/03-shared-routes/(home)/[user]",
              params: {
                user: "user-baconbrix",
                tab: "media",
                referrer: "recommendation",
                highlight: "true",
                scrollTo: "top",
                showModal: "follow"
              }
            })}
          >
            <View style={[styles.avatar, { backgroundColor: "#FFB347" }]}>
              <Text style={styles.avatarText}>🎯</Text>
            </View>
            <View style={styles.userInfo}>
              <ThemedText style={styles.userName}>모든 파라미터 전달</ThemedText>
              <ThemedText style={styles.paramText}>tab, referrer, highlight, scrollTo, showModal</ThemedText>
            </View>
            <Text style={styles.arrow}>→</Text>
          </Pressable>
        </View>

        {/* 코드 설명 박스 */}
        <View style={[styles.codeBox, { backgroundColor: colors.card, borderColor: "#4ECDC4" }]}>
          <ThemedText type="subtitle" style={styles.codeTitle}>
            💻 코드 예시
          </ThemedText>
          <ThemedText style={styles.codeText}>
{`router.push({
  pathname: "/.../[user]",
  params: {
    user: "user-baconbrix",  // URL 경로
    tab: "posts",            // 쿼리 파라미터
    referrer: "home-feed",   // 쿼리 파라미터
    highlight: "true"        // 쿼리 파라미터
  }
})`}
          </ThemedText>
          <ThemedText style={[styles.resultText, { color: colors.tint }]}>
            {"\n"}결과 URL:{"\n"}
            /user-baconbrix?tab=posts&referrer=home-feed&highlight=true
          </ThemedText>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingBottom: 40 },
  header: {
    padding: 24,
    alignItems: "center",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerIcon: { fontSize: 48, marginBottom: 12 },
  headerTitle: { fontSize: 24, fontWeight: "700", color: "#FFFFFF", marginBottom: 8 },
  headerSubtitle: { fontSize: 14, color: "#FFFFFF", opacity: 0.9, textAlign: "center" },
  section: { padding: 20 },
  sectionTitle: { marginBottom: 8 },
  sectionDescription: { fontSize: 14, opacity: 0.7, marginBottom: 16 },
  userCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  pressed: { opacity: 0.7 },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: { fontSize: 20, fontWeight: "700", color: "#FFFFFF" },
  userInfo: { flex: 1, marginLeft: 12 },
  userName: { fontSize: 16, fontWeight: "600" },
  userHandle: { fontSize: 14, opacity: 0.7 },
  paramText: { fontSize: 11, fontFamily: "monospace", opacity: 0.6, marginTop: 4 },
  arrow: { fontSize: 20, opacity: 0.5 },
  codeBox: {
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 12,
    borderWidth: 2,
  },
  codeTitle: { marginBottom: 12 },
  codeText: { fontSize: 11, fontFamily: "monospace", opacity: 0.8, lineHeight: 18 },
  resultText: { fontSize: 11, fontFamily: "monospace", lineHeight: 16 },
});
