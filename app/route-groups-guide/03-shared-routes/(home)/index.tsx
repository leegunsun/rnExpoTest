/**
 * 홈 탭 메인 화면
 *
 * 여기서 [user] 프로필로 이동하면:
 * - segments에 "(home)"이 포함됨
 * - 뒤로 가기하면 이 화면으로 돌아옴
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
            여기서 프로필로 이동하면 "(home)" 컨텍스트가 유지됩니다
          </ThemedText>
        </View>

        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            👥 추천 사용자
          </ThemedText>
          <ThemedText style={styles.sectionDescription}>
            프로필을 클릭하면 공유된 [user].tsx가 렌더링됩니다
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
              <ThemedText style={styles.userHandle}>@baconbrix</ThemedText>
            </View>
            <Text style={styles.arrow}>→</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.userCard,
              { backgroundColor: colors.card },
              pressed && styles.pressed,
            ]}
            onPress={() => router.push({
              pathname: "/route-groups-guide/03-shared-routes/(home)/[user]",
              params: { user: "user-expo" }
            })}
          >
            <View style={[styles.avatar, { backgroundColor: "#4ECDC4" }]}>
              <Text style={styles.avatarText}>E</Text>
            </View>
            <View style={styles.userInfo}>
              <ThemedText style={styles.userName}>Expo Team</ThemedText>
              <ThemedText style={styles.userHandle}>@expo</ThemedText>
            </View>
            <Text style={styles.arrow}>→</Text>
          </Pressable>
        </View>

        <View style={[styles.infoBox, { backgroundColor: colors.card, borderColor: "#4ECDC4" }]}>
          <ThemedText type="subtitle" style={styles.infoTitle}>
            💡 홈 탭에서의 이동
          </ThemedText>
          <ThemedText style={styles.infoText}>
            <ThemedText style={styles.code}>router.push("/(home)/user-baconbrix")</ThemedText>
            {"\n\n"}
            이렇게 이동하면:{"\n"}
            • segments에 "(home)" 포함{"\n"}
            • 프로필 화면에서 "홈 탭에서 접근" 표시{"\n"}
            • 뒤로 가기 → 이 화면으로 복귀
          </ThemedText>
        </View>
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
  arrow: { fontSize: 20, opacity: 0.5 },
  infoBox: {
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 12,
    borderWidth: 2,
  },
  infoTitle: { marginBottom: 12 },
  infoText: { fontSize: 13, lineHeight: 22, opacity: 0.8 },
  code: { fontFamily: "monospace", backgroundColor: "rgba(0,0,0,0.1)", fontSize: 12 },
});
