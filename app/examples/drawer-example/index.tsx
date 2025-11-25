import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useColorScheme } from '@/hooks/use-color-scheme';

/**
 * Home Screen (Drawer의 첫 번째 화면)
 *
 * Flutter 비교:
 * Scaffold(
 *   appBar: AppBar(
 *     leading: IconButton(icon: Icon(Icons.menu), onPressed: () => ...),
 *   ),
 *   body: ...
 * )
 */
export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const router = useRouter();

  const cards = [
    {
      id: 1,
      title: '날씨',
      description: '오늘의 날씨를 확인하세요',
      icon: 'partly-sunny',
      color: '#FF9800',
      route: '/examples/drawer-example/profile',
    },
    {
      id: 2,
      title: '할 일',
      description: '3개의 작업이 남았습니다',
      icon: 'checkbox',
      color: '#4CAF50',
      route: '/examples/drawer-example/settings',
    },
    {
      id: 3,
      title: '메시지',
      description: '5개의 새 메시지',
      icon: 'mail',
      color: '#2196F3',
      route: '/examples/drawer-example/notifications',
    },
    {
      id: 4,
      title: '캘린더',
      description: '다가오는 일정 보기',
      icon: 'calendar',
      color: '#9C27B0',
      route: '/examples/drawer-example/help',
    },
  ];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: isDark ? '#121212' : '#f5f5f5' }]}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Welcome Section */}
      <View style={[styles.welcomeCard, { backgroundColor: isDark ? '#1e1e1e' : '#fff' }]}>
        <Text style={[styles.welcomeText, { color: isDark ? '#fff' : '#333' }]}>
          안녕하세요! 👋
        </Text>
        <Text style={[styles.welcomeSubtext, { color: isDark ? '#bbb' : '#666' }]}>
          Drawer Navigation 예제입니다
        </Text>
      </View>

      {/* Info Section */}
      <View style={styles.infoSection}>
        <Text style={[styles.sectionTitle, { color: isDark ? '#fff' : '#333' }]}>
          Drawer 사용 방법
        </Text>
        <View style={[styles.infoCard, { backgroundColor: isDark ? '#1e1e1e' : '#fff' }]}>
          <View style={styles.infoRow}>
            <Ionicons name="menu" size={24} color="#2196F3" />
            <Text style={[styles.infoText, { color: isDark ? '#bbb' : '#666' }]}>
              좌측 상단의 메뉴 아이콘을 탭하거나
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="hand-left" size={24} color="#2196F3" />
            <Text style={[styles.infoText, { color: isDark ? '#bbb' : '#666' }]}>
              화면 왼쪽 가장자리에서 오른쪽으로 스와이프하세요
            </Text>
          </View>
        </View>
      </View>

      {/* Quick Actions Grid */}
      <View style={styles.cardsSection}>
        <Text style={[styles.sectionTitle, { color: isDark ? '#fff' : '#333' }]}>
          빠른 실행
        </Text>
        <View style={styles.cardsGrid}>
          {cards.map((card) => (
            <TouchableOpacity
              key={card.id}
              style={[
                styles.card,
                {
                  backgroundColor: isDark ? '#1e1e1e' : '#fff',
                  borderLeftColor: card.color,
                },
              ]}
              onPress={() => router.push(card.route as any)}
              activeOpacity={0.7}
            >
              <View style={[styles.cardIconContainer, { backgroundColor: card.color + '20' }]}>
                <Ionicons name={card.icon as any} size={28} color={card.color} />
              </View>
              <View style={styles.cardContent}>
                <Text style={[styles.cardTitle, { color: isDark ? '#fff' : '#333' }]}>
                  {card.title}
                </Text>
                <Text style={[styles.cardDescription, { color: isDark ? '#bbb' : '#666' }]}>
                  {card.description}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  welcomeCard: {
    padding: 24,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  welcomeSubtext: {
    fontSize: 16,
  },
  infoSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  infoCard: {
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    marginLeft: 12,
    flex: 1,
  },
  cardsSection: {
    marginBottom: 20,
  },
  cardsGrid: {
    gap: 12,
  },
  card: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
  },
});
