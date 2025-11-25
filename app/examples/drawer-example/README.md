# Drawer Navigation 예제

Flutter의 `Drawer` 위젯을 React Native Expo로 구현하는 방법입니다.

## 🎯 학습 목표

- Expo Router에서 Drawer Navigation 구현 방법 이해
- Flutter의 Drawer 위젯과 비교하여 학습
- 커스텀 Drawer Content 만드는 방법
- Drawer에서 화면 간 네비게이션 처리

## 📱 Flutter vs React Native Expo

### Flutter 코드

```dart
Scaffold(
  appBar: AppBar(
    title: Text('홈'),
    leading: IconButton(
      icon: Icon(Icons.menu),
      onPressed: () {
        // Drawer 열기
      },
    ),
  ),
  drawer: Drawer(
    child: ListView(
      padding: EdgeInsets.zero,
      children: [
        DrawerHeader(
          decoration: BoxDecoration(
            color: Colors.blue,
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              CircleAvatar(
                radius: 40,
                backgroundImage: NetworkImage('https://via.placeholder.com/80'),
              ),
              SizedBox(height: 10),
              Text(
                'John Doe',
                style: TextStyle(color: Colors.white, fontSize: 18),
              ),
              Text(
                'john.doe@example.com',
                style: TextStyle(color: Colors.white70, fontSize: 14),
              ),
            ],
          ),
        ),
        ListTile(
          leading: Icon(Icons.home),
          title: Text('홈'),
          onTap: () {
            Navigator.pop(context);
          },
        ),
        ListTile(
          leading: Icon(Icons.person),
          title: Text('프로필'),
          onTap: () {
            Navigator.pop(context);
            Navigator.pushNamed(context, '/profile');
          },
        ),
        ListTile(
          leading: Icon(Icons.settings),
          title: Text('설정'),
          onTap: () {
            Navigator.pop(context);
            Navigator.pushNamed(context, '/settings');
          },
        ),
      ],
    ),
  ),
  body: Center(
    child: Text('홈 화면'),
  ),
)
```

### React Native Expo 코드

#### 1. Drawer 레이아웃 설정 (`_layout.tsx`)

```tsx
import { Drawer } from 'expo-router/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function DrawerLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        screenOptions={{
          drawerStyle: {
            backgroundColor: '#fff',
            width: 280,
          },
          drawerActiveTintColor: '#2196F3',
          drawerInactiveTintColor: '#666',
        }}
      >
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
      </Drawer>
    </GestureHandlerRootView>
  );
}
```

#### 2. 커스텀 Drawer Content

```tsx
import { DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';

function CustomDrawerContent(props: any) {
  return (
    <DrawerContentScrollView {...props}>
      {/* Drawer Header */}
      <View style={styles.drawerHeader}>
        <Image
          source={{ uri: 'https://via.placeholder.com/80' }}
          style={styles.avatar}
        />
        <Text style={styles.userName}>John Doe</Text>
        <Text style={styles.userEmail}>john.doe@example.com</Text>
      </View>

      {/* Drawer Items */}
      <DrawerItemList {...props} />

      {/* Custom Item */}
      <DrawerItem
        label="로그아웃"
        icon={({ color, size }) => (
          <Ionicons name="log-out-outline" size={size} color={color} />
        )}
        onPress={() => console.log('로그아웃')}
      />
    </DrawerContentScrollView>
  );
}

// Drawer에 적용
<Drawer drawerContent={(props) => <CustomDrawerContent {...props} />}>
  {/* ... */}
</Drawer>
```

## 🔑 핵심 개념

### 1. 파일 기반 라우팅

Flutter의 Named Routes와 달리, Expo Router는 파일 시스템을 기반으로 라우팅을 자동 생성합니다.

**파일 구조:**
```
app/examples/drawer-example/
├── _layout.tsx        # Drawer 설정
├── index.tsx          # 홈 화면
├── profile.tsx        # 프로필 화면
├── settings.tsx       # 설정 화면
└── notifications.tsx  # 알림 화면
```

**Flutter 비교:**
- Flutter: `routes: { '/home': (context) => HomePage() }`
- Expo Router: 파일 이름이 자동으로 라우트가 됨

### 2. Drawer 열기/닫기

**Flutter:**
```dart
// 열기
Scaffold.of(context).openDrawer();

// 닫기
Navigator.pop(context);
```

**React Native Expo:**
```tsx
import { useNavigation } from 'expo-router';

const navigation = useNavigation();

// 열기
navigation.openDrawer();

// 닫기
navigation.closeDrawer();

// 토글
navigation.toggleDrawer();
```

### 3. 제스처 지원

**Flutter:**
```dart
Drawer(
  // 스와이프로 자동으로 열림
)
```

**React Native Expo:**
```tsx
<GestureHandlerRootView style={{ flex: 1 }}>
  <Drawer
    screenOptions={{
      swipeEnabled: true, // 기본값: true
      swipeEdgeWidth: 50, // 스와이프 감지 영역
    }}
  >
    {/* ... */}
  </Drawer>
</GestureHandlerRootView>
```

⚠️ **중요**: `GestureHandlerRootView`로 감싸야 제스처가 작동합니다!

### 4. Drawer 커스터마이징

#### 스타일

**Flutter:**
```dart
Drawer(
  width: 280,
  backgroundColor: Colors.white,
  child: ...
)
```

**React Native Expo:**
```tsx
<Drawer
  screenOptions={{
    drawerStyle: {
      backgroundColor: '#fff',
      width: 280,
    },
    drawerActiveTintColor: '#2196F3',      // 선택된 항목 색상
    drawerInactiveTintColor: '#666',       // 비활성 항목 색상
    drawerLabelStyle: {
      fontSize: 16,
      fontWeight: '500',
    },
  }}
/>
```

#### Badge (알림 개수)

**Flutter:**
```dart
ListTile(
  title: Text('알림'),
  trailing: Container(
    padding: EdgeInsets.all(6),
    decoration: BoxDecoration(
      color: Colors.red,
      shape: BoxShape.circle,
    ),
    child: Text('3', style: TextStyle(color: Colors.white)),
  ),
)
```

**React Native Expo:**
```tsx
<Drawer.Screen
  name="notifications"
  options={{
    drawerLabel: '알림',
    drawerBadge: 3,
    drawerBadgeStyle: {
      backgroundColor: '#FF3B30',
    },
  }}
/>
```

## 🎨 다크 모드 지원

### Flutter
```dart
Theme.of(context).brightness == Brightness.dark
```

### React Native Expo
```tsx
import { useColorScheme } from '@/hooks/use-color-scheme';

const colorScheme = useColorScheme();
const isDark = colorScheme === 'dark';

<Drawer
  screenOptions={{
    drawerStyle: {
      backgroundColor: isDark ? '#121212' : '#fff',
    },
  }}
/>
```

## 📋 주요 차이점 정리

| 기능 | Flutter | React Native Expo |
|------|---------|-------------------|
| **기본 구조** | `Drawer` 위젯 | `<Drawer>` 컴포넌트 |
| **라우팅** | Named Routes | 파일 기반 라우팅 |
| **열기/닫기** | `Scaffold.of(context).openDrawer()` | `navigation.openDrawer()` |
| **커스터마이징** | `DrawerHeader`, `ListView` | `drawerContent` prop |
| **아이콘** | `leading` prop | `drawerIcon` prop |
| **제스처** | 자동 지원 | `GestureHandlerRootView` 필요 |
| **배지** | 수동 구현 | `drawerBadge` prop |

## 🔧 설치된 패키지

```bash
npm install @react-navigation/drawer react-native-gesture-handler react-native-reanimated
```

## 💡 실용 팁

### 1. Drawer 위치 변경 (오른쪽)
```tsx
<Drawer
  screenOptions={{
    drawerPosition: 'right', // 기본값: 'left'
  }}
/>
```

### 2. Drawer 타입 변경
```tsx
<Drawer
  screenOptions={{
    drawerType: 'slide',  // 'front' | 'back' | 'slide' | 'permanent'
  }}
/>
```

### 3. 프로그래밍 방식으로 네비게이션
```tsx
import { useRouter } from 'expo-router';

const router = useRouter();
router.push('/examples/drawer-example/profile');
```

## 🚀 다음 단계

1. ✅ Drawer Navigation 기본 구현
2. ✅ 커스텀 Drawer Content 만들기
3. ✅ 다크 모드 지원
4. ✅ 여러 화면 추가 및 네비게이션

더 복잡한 예제를 원하시면:
- 중첩 네비게이션 (Drawer + Tabs)
- 조건부 Drawer 항목
- 권한 기반 라우팅

## 📚 참고 자료

- [Expo Router Drawer 문서](https://docs.expo.dev/router/advanced/drawer/)
- [React Navigation Drawer 문서](https://reactnavigation.org/docs/drawer-navigator/)
- [Flutter Drawer 문서](https://api.flutter.dev/flutter/material/Drawer-class.html)
