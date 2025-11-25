import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface Notification {
  id: number;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

export default function NotificationsScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const notifications: Notification[] = [
    {
      id: 1,
      type: 'success',
      title: '프로필 업데이트 완료',
      message: '프로필 정보가 성공적으로 업데이트되었습니다.',
      time: '방금 전',
      read: false,
    },
    {
      id: 2,
      type: 'info',
      title: '새 메시지',
      message: 'Jane Doe님이 메시지를 보냈습니다: "안녕하세요! 프로젝트..."',
      time: '5분 전',
      read: false,
    },
    {
      id: 3,
      type: 'warning',
      title: '비밀번호 변경 권장',
      message: '마지막 비밀번호 변경 후 90일이 경과했습니다.',
      time: '1시간 전',
      read: false,
    },
    {
      id: 4,
      type: 'info',
      title: '시스템 업데이트',
      message: '새로운 기능이 추가되었습니다. 지금 확인해보세요!',
      time: '2시간 전',
      read: true,
    },
    {
      id: 5,
      type: 'error',
      title: '로그인 실패',
      message: '다른 기기에서 로그인 시도가 감지되었습니다.',
      time: '1일 전',
      read: true,
    },
  ];

  const getIconName = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return 'checkmark-circle';
      case 'info':
        return 'information-circle';
      case 'warning':
        return 'warning';
      case 'error':
        return 'alert-circle';
    }
  };

  const getIconColor = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return '#4CAF50';
      case 'info':
        return '#2196F3';
      case 'warning':
        return '#FF9800';
      case 'error':
        return '#FF3B30';
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#121212' : '#f5f5f5' }]}>
      {/* Header Actions */}
      <View style={[styles.header, { backgroundColor: isDark ? '#1e1e1e' : '#fff' }]}>
        <TouchableOpacity style={styles.headerButton}>
          <Text style={styles.headerButtonText}>모두 읽음</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerButton}>
          <Text style={[styles.headerButtonText, { color: '#FF3B30' }]}>모두 삭제</Text>
        </TouchableOpacity>
      </View>

      <ScrollView>
        {notifications.map((notification) => (
          <TouchableOpacity
            key={notification.id}
            style={[
              styles.notificationItem,
              {
                backgroundColor: isDark ? '#1e1e1e' : '#fff',
                borderLeftColor: getIconColor(notification.type),
              },
              !notification.read && styles.unreadItem,
            ]}
            activeOpacity={0.7}
          >
            {/* Icon */}
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: getIconColor(notification.type) + '20' },
              ]}
            >
              <Ionicons
                name={getIconName(notification.type)}
                size={24}
                color={getIconColor(notification.type)}
              />
            </View>

            {/* Content */}
            <View style={styles.content}>
              <View style={styles.header}>
                <Text style={[styles.title, { color: isDark ? '#fff' : '#333' }]}>
                  {notification.title}
                </Text>
                {!notification.read && <View style={styles.unreadDot} />}
              </View>
              <Text style={[styles.message, { color: isDark ? '#bbb' : '#666' }]}>
                {notification.message}
              </Text>
              <Text style={[styles.time, { color: isDark ? '#888' : '#999' }]}>
                {notification.time}
              </Text>
            </View>

            {/* Actions */}
            <TouchableOpacity style={styles.moreButton}>
              <Ionicons name="ellipsis-vertical" size={20} color={isDark ? '#bbb' : '#666'} />
            </TouchableOpacity>
          </TouchableOpacity>
        ))}

        {/* Empty State */}
        {notifications.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="notifications-off-outline" size={64} color="#ccc" />
            <Text style={[styles.emptyText, { color: isDark ? '#bbb' : '#666' }]}>
              알림이 없습니다
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  headerButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2196F3',
  },
  notificationItem: {
    flexDirection: 'row',
    padding: 16,
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  unreadItem: {
    opacity: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  message: {
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 20,
  },
  time: {
    fontSize: 12,
  },
  moreButton: {
    padding: 4,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2196F3',
    marginLeft: 8,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyText: {
    fontSize: 16,
    marginTop: 16,
  },
});
