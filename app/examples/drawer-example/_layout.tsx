import { Drawer } from 'expo-router/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';

/**
 * Custom Drawer Content Component
 * Flutter의 Drawer 위젯의 DrawerHeader + ListView와 유사
 */
function CustomDrawerContent(props: any) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <DrawerContentScrollView {...props}>
      {/* Drawer Header - Flutter의 DrawerHeader와 유사 */}
      <View style={[styles.drawerHeader, { backgroundColor: isDark ? '#1a1a1a' : '#2196F3' }]}>
        <Image
          source={{ uri: 'https://via.placeholder.com/80' }}
          style={styles.avatar}
        />
        <Text style={styles.userName}>John Doe</Text>
        <Text style={styles.userEmail}>john.doe@example.com</Text>
      </View>

      {/* Drawer Items - Flutter의 ListTile과 유사 */}
      <DrawerItemList {...props} />

      {/* Custom Drawer Item - 추가 메뉴 */}
      <DrawerItem
        label="로그아웃"
        icon={({ color, size }) => (
          <Ionicons name="log-out-outline" size={size} color={color} />
        )}
        onPress={() => {
          console.log('로그아웃');
        }}
        labelStyle={{ color: isDark ? '#fff' : '#000' }}
      />
    </DrawerContentScrollView>
  );
}

/**
 * Drawer Layout Component
 *
 * Flutter 비교:
 * Scaffold(
 *   drawer: Drawer(
 *     child: ListView(...)
 *   )
 * )
 *
 * → Expo Router의 <Drawer> 컴포넌트
 */
export default function DrawerLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
          drawerStyle: {
            backgroundColor: isDark ? '#121212' : '#fff',
            width: 280,
          },
          drawerActiveTintColor: '#2196F3',
          drawerInactiveTintColor: isDark ? '#bbb' : '#666',
          drawerLabelStyle: {
            fontSize: 16,
            fontWeight: '500',
          },
          headerStyle: {
            backgroundColor: isDark ? '#1a1a1a' : '#2196F3',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        {/* Home Screen */}
        <Drawer.Screen
          name="index"
          options={{
            drawerLabel: '홈',
            title: '홈',
            drawerIcon: ({ color, size }) => (
              <Ionicons name="home-outline" size={size} color={color} />
            ),
          }}
        />

        {/* Profile Screen */}
        <Drawer.Screen
          name="profile"
          options={{
            drawerLabel: '프로필',
            title: '프로필',
            drawerIcon: ({ color, size }) => (
              <Ionicons name="person-outline" size={size} color={color} />
            ),
          }}
        />

        {/* Settings Screen */}
        <Drawer.Screen
          name="settings"
          options={{
            drawerLabel: '설정',
            title: '설정',
            drawerIcon: ({ color, size }) => (
              <Ionicons name="settings-outline" size={size} color={color} />
            ),
          }}
        />

        {/* Notifications Screen */}
        <Drawer.Screen
          name="notifications"
          options={{
            drawerLabel: '알림',
            title: '알림',
            drawerIcon: ({ color, size }) => (
              <Ionicons name="notifications-outline" size={size} color={color} />
            ),
            drawerBadge: 3, // Badge 표시 (새 알림 개수)
            drawerBadgeStyle: {
              backgroundColor: '#FF3B30',
            },
          }}
        />

        {/* Help Screen */}
        <Drawer.Screen
          name="help"
          options={{
            drawerLabel: '도움말',
            title: '도움말',
            drawerIcon: ({ color, size }) => (
              <Ionicons name="help-circle-outline" size={size} color={color} />
            ),
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  drawerHeader: {
    padding: 20,
    marginBottom: 10,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
    borderWidth: 3,
    borderColor: '#fff',
  },
  userName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 5,
  },
  userEmail: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.8,
    marginTop: 2,
  },
});
