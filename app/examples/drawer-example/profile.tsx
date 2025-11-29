import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { shadows } from '@/utils/shadow-utils';

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const stats = [
    { label: '게시물', value: 42 },
    { label: '팔로워', value: 1234 },
    { label: '팔로잉', value: 567 },
  ];

  const profileItems = [
    { icon: 'mail', label: '이메일', value: 'john.doe@example.com' },
    { icon: 'call', label: '전화번호', value: '+82 10-1234-5678' },
    { icon: 'location', label: '위치', value: 'Seoul, South Korea' },
    { icon: 'calendar', label: '가입일', value: '2024년 1월' },
  ];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: isDark ? '#121212' : '#f5f5f5' }]}
    >
      {/* Profile Header */}
      <View style={[styles.header, { backgroundColor: isDark ? '#1e1e1e' : '#fff' }]}>
        <Image
          source={{ uri: 'https://via.placeholder.com/120' }}
          style={styles.avatar}
        />
        <Text style={[styles.name, { color: isDark ? '#fff' : '#333' }]}>John Doe</Text>
        <Text style={[styles.bio, { color: isDark ? '#bbb' : '#666' }]}>
          Flutter 개발자에서 React Native 개발자로 전향 중 🚀
        </Text>

        {/* Stats */}
        <View style={styles.statsContainer}>
          {stats.map((stat, index) => (
            <View key={index} style={styles.statItem}>
              <Text style={[styles.statValue, { color: isDark ? '#fff' : '#333' }]}>
                {stat.value}
              </Text>
              <Text style={[styles.statLabel, { color: isDark ? '#bbb' : '#666' }]}>
                {stat.label}
              </Text>
            </View>
          ))}
        </View>

        {/* Edit Profile Button */}
        <TouchableOpacity
          style={styles.editButton}
          activeOpacity={0.7}
        >
          <Text style={styles.editButtonText}>프로필 수정</Text>
        </TouchableOpacity>
      </View>

      {/* Profile Information */}
      <View style={styles.infoSection}>
        <Text style={[styles.sectionTitle, { color: isDark ? '#fff' : '#333' }]}>
          정보
        </Text>
        <View style={[styles.infoCard, { backgroundColor: isDark ? '#1e1e1e' : '#fff' }]}>
          {profileItems.map((item, index) => (
            <View
              key={index}
              style={[
                styles.infoItem,
                index !== profileItems.length - 1 && styles.infoItemBorder,
                { borderBottomColor: isDark ? '#333' : '#eee' },
              ]}
            >
              <View style={styles.infoItemLeft}>
                <Ionicons
                  name={item.icon as any}
                  size={20}
                  color={isDark ? '#2196F3' : '#2196F3'}
                />
                <Text style={[styles.infoLabel, { color: isDark ? '#bbb' : '#666' }]}>
                  {item.label}
                </Text>
              </View>
              <Text style={[styles.infoValue, { color: isDark ? '#fff' : '#333' }]}>
                {item.value}
              </Text>
            </View>
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
  header: {
    padding: 24,
    alignItems: 'center',
    ...shadows.md,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
    borderWidth: 4,
    borderColor: '#2196F3',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  bio: {
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
  },
  editButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  infoSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  infoCard: {
    borderRadius: 12,
    padding: 16,
    ...shadows.md,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  infoItemBorder: {
    borderBottomWidth: 1,
  },
  infoItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 14,
    marginLeft: 12,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
  },
});
