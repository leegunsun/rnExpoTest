/**
 * 검색 탭 메인 화면
 *
 * 여기서 [user] 프로필로 이동하면:
 * - segments에 "(search)"가 포함됨
 * - 뒤로 가기하면 이 화면으로 돌아옴
 *
 * 검색 컨텍스트에서의 여러 파라미터 전달 예제
 */

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useState } from "react";

export default function SearchTabScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={[styles.header, { backgroundColor: "#FF6B6B" }]}>
          <Text style={styles.headerIcon}>🔍</Text>
          <ThemedText style={styles.headerTitle}>검색 탭</ThemedText>
          <ThemedText style={styles.headerSubtitle}>
            검색 컨텍스트에서 파라미터 전달
          </ThemedText>
        </View>

        <View style={styles.searchContainer}>
          <TextInput
            style={[styles.searchInput, { backgroundColor: colors.card, color: colors.text }]}
            placeholder="사용자 검색..."
            placeholderTextColor={colors.text + "80"}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            🔥 검색 결과 (여러 파라미터 전달)
          </ThemedText>

          {/* 검색 결과 1: 검색어 포함 */}
          <Pressable
            style={({ pressed }) => [
              styles.userCard,
              { backgroundColor: colors.card, borderLeftWidth: 4, borderLeftColor: "#FF6B6B" },
              pressed && styles.pressed,
            ]}
            onPress={() => router.push({
              pathname: "/route-groups-guide/03-shared-routes/(search)/[user]",
              params: {
                user: "user-baconbrix",
                referrer: "search",
                searchQuery: searchQuery || "bacon",
                resultIndex: "1"
              }
            })}
          >
            <View style={[styles.avatar, { backgroundColor: "#FF6B6B" }]}>
              <Text style={styles.avatarText}>B</Text>
            </View>
            <View style={styles.userInfo}>
              <ThemedText style={styles.userName}>Bacon Brix</ThemedText>
              <ThemedText style={styles.searchMatch}>검색 결과 #1</ThemedText>
              <ThemedText style={styles.paramText}>referrer: "search", searchQuery, resultIndex</ThemedText>
            </View>
            <Text style={styles.arrow}>→</Text>
          </Pressable>

          {/* 검색 결과 2: 추천 뱃지 포함 */}
          <Pressable
            style={({ pressed }) => [
              styles.userCard,
              { backgroundColor: colors.card, borderLeftWidth: 4, borderLeftColor: "#4ECDC4" },
              pressed && styles.pressed,
            ]}
            onPress={() => router.push({
              pathname: "/route-groups-guide/03-shared-routes/(search)/[user]",
              params: {
                user: "user-expo",
                referrer: "search",
                isRecommended: "true",
                badge: "official",
                category: "developer-tools"
              }
            })}
          >
            <View style={[styles.avatar, { backgroundColor: "#4ECDC4" }]}>
              <Text style={styles.avatarText}>E</Text>
            </View>
            <View style={styles.userInfo}>
              <ThemedText style={styles.userName}>Expo Team ✓</ThemedText>
              <ThemedText style={styles.searchMatch}>추천 계정</ThemedText>
              <ThemedText style={styles.paramText}>isRecommended, badge: "official", category</ThemedText>
            </View>
            <Text style={styles.arrow}>→</Text>
          </Pressable>

          {/* 검색 결과 3: 필터 적용 */}
          <Pressable
            style={({ pressed }) => [
              styles.userCard,
              { backgroundColor: colors.card, borderLeftWidth: 4, borderLeftColor: "#FFB347" },
              pressed && styles.pressed,
            ]}
            onPress={() => router.push({
              pathname: "/route-groups-guide/03-shared-routes/(search)/[user]",
              params: {
                user: "user-baconbrix",
                referrer: "search-filtered",
                filter: "verified",
                sortBy: "followers",
                showStats: "true",
                expandBio: "true"
              }
            })}
          >
            <View style={[styles.avatar, { backgroundColor: "#FFB347" }]}>
              <Text style={styles.avatarText}>🎯</Text>
            </View>
            <View style={styles.userInfo}>
              <ThemedText style={styles.userName}>필터 적용 결과</ThemedText>
              <ThemedText style={styles.searchMatch}>인증된 계정 • 팔로워순</ThemedText>
              <ThemedText style={styles.paramText}>filter, sortBy, showStats, expandBio</ThemedText>
            </View>
            <Text style={styles.arrow}>→</Text>
          </Pressable>
        </View>

        {/* 코드 설명 */}
        <View style={[styles.codeBox, { backgroundColor: colors.card, borderColor: "#FF6B6B" }]}>
          <ThemedText type="subtitle" style={styles.codeTitle}>
            💡 검색 컨텍스트 파라미터
          </ThemedText>
          <ThemedText style={styles.codeText}>
{`// 검색 결과에서 유용한 파라미터들
params: {
  user: "user-expo",
  referrer: "search",      // 출처
  searchQuery: "expo",     // 검색어
  resultIndex: "1",        // 결과 순위
  isRecommended: "true",   // 추천 여부
  filter: "verified",      // 적용된 필터
  sortBy: "followers"      // 정렬 기준
}`}
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
  searchContainer: { padding: 20 },
  searchInput: {
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
  },
  section: { paddingHorizontal: 20 },
  sectionTitle: { marginBottom: 16 },
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
  searchMatch: { fontSize: 12, color: "#FF6B6B", marginTop: 2 },
  paramText: { fontSize: 10, fontFamily: "monospace", opacity: 0.5, marginTop: 4 },
  arrow: { fontSize: 20, opacity: 0.5 },
  codeBox: {
    marginHorizontal: 20,
    marginTop: 20,
    padding: 20,
    borderRadius: 12,
    borderWidth: 2,
  },
  codeTitle: { marginBottom: 12 },
  codeText: { fontSize: 11, fontFamily: "monospace", opacity: 0.8, lineHeight: 18 },
});
