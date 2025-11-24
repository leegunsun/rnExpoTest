# Route Groups 완벽 가이드

Expo Router 공식 문서 기반 Route Groups 학습 예제 모음입니다.

## 🎯 Route Groups란?

괄호로 감싼 디렉터리명 (예: `(tabs)`)은 **URL 경로에 포함되지 않습니다**.

```
app/(tabs)/feed.tsx  →  /feed  (✅ tabs가 제거됨)
app/tabs/feed.tsx    →  /tabs/feed  (❌ tabs가 포함됨)
```

## 📚 예제 목록

### 01. 기본 개념
Route Groups vs 일반 디렉터리 비교

- `without-groups/` - URL에 포함되는 일반 디렉터리
- `(with-groups)/` - URL에서 제거되는 Route Groups

**핵심**: 파일 구조 조직화 vs URL 구조

### 02. Layout 패턴
Route Groups + `_layout.tsx`로 네비게이션 구성

- `(tabs)/` - Tab Navigation 패턴
- `(stack)/` - Stack Navigation 패턴

**핵심**: 레이아웃 공유와 네비게이션 분리

### 03. Shared Routes ⭐ 가장 중요!
배열 문법으로 여러 그룹에서 화면 공유

```
app/(home,search)/[user].tsx
```

생성되는 경로:
- `/(home)/[user]` → 홈 탭에서 접근
- `/(search)/[user]` → 검색 탭에서 접근

**핵심**: 하나의 파일, 여러 경로, 독립적 네비게이션 스택

## 🔑 핵심 개념 정리

### 1. 조직화 (Organization)
```
app/
├── (auth)/           ← 인증 관련 화면 그룹
│   ├── login.tsx
│   └── signup.tsx
└── (app)/            ← 메인 앱 화면 그룹
    └── dashboard.tsx
```

### 2. Layout 공유 (Layout Sharing)
```typescript
// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="home" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}
```

### 3. Shared Routes (Route Sharing)
```
app/(home,search)/[user].tsx  ← 배열 문법!
```

Instagram, Twitter처럼 같은 프로필 화면을 여러 탭에서 접근하는 패턴

## 💡 언제 사용하나?

### ✅ Route Groups를 사용할 때

1. **파일 조직화**: URL 영향 없이 폴더 정리
2. **레이아웃 그룹화**: 같은 레이아웃을 공유하는 화면들
3. **네비게이션 분리**: Tab, Stack 등 다양한 네비게이션 패턴
4. **화면 공유**: 여러 탭에서 같은 화면 접근 (배열 문법)
5. **인증 흐름**: 로그인/로그아웃 화면 분리

### ❌ 일반 디렉터리를 사용할 때

1. **URL 구조**: URL에 포함되어야 하는 경로
2. **명확한 계층**: `/users/123` 같은 명확한 URL 구조
3. **SEO 중요**: 웹에서 검색 엔진 최적화가 중요한 경우
4. **API 경로**: RESTful URL 설계

## 🎓 학습 순서

1. **01-basic** - Route Groups의 기본 개념 이해
2. **02-layouts** - Layout 패턴 학습
3. **03-shared-routes** ⭐ - 배열 문법 마스터 (가장 중요!)

## 📖 공식 문서

- [Route Groups](https://docs.expo.dev/router/advanced/route-groups/)
- [Shared Routes](https://docs.expo.dev/router/advanced/shared-routes/)
- [Layouts](https://docs.expo.dev/router/layouts/)
- [Typed Routes](https://docs.expo.dev/router/reference/typed-routes/)

## 🚀 실전 활용

**Instagram 스타일 앱:**
```
app/
├── (tabs)/
│   ├── _layout.tsx
│   ├── (feed,search,notifications)/
│   │   ├── index.tsx
│   │   ├── [user].tsx        ← 프로필 공유!
│   │   └── [post].tsx        ← 게시물 공유!
│   └── profile.tsx
```

**E-commerce 앱:**
```
app/
├── (auth)/
│   ├── login.tsx
│   └── signup.tsx
└── (app)/
    ├── (tabs)/
    │   ├── home.tsx
    │   ├── cart.tsx
    │   └── profile.tsx
    └── (modals)/
        └── checkout.tsx
```

## 🎯 베스트 프랙티스

1. **명확한 네이밍**: 그룹 이름은 목적을 명확히
2. **중첩 제한**: 2-3 레벨 이하로 유지
3. **Layout 활용**: `_layout.tsx`와 함께 사용
4. **Typed Routes**: 타입 안전성 활용
5. **배열 문법 신중하게**: 정말 공유가 필요한 화면만

## 💻 개발 팁

**타입 재생성:**
```bash
npx expo start --clear
```

**Route Groups 디버깅:**
```typescript
import { useSegments, usePathname } from 'expo-router';

export default function Screen() {
  const segments = useSegments();
  const pathname = usePathname();

  console.log('Segments:', segments);  // ['(tabs)', 'home']
  console.log('Pathname:', pathname);  // '/home'
}
```

## 🎉 완료!

Route Groups를 마스터하면:
- ✅ 파일 구조를 깔끔하게 조직화
- ✅ URL은 간결하게 유지
- ✅ 네이티브 앱 네비게이션 패턴 구현
- ✅ 코드 중복 최소화
- ✅ 유지보수성 향상

Happy coding! 🚀
