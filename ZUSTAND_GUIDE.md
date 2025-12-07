# Zustand 완벽 가이드 (초보자용)

완전 초보자를 위해 기초부터 차근차근 설명합니다.

---

## 목차

1. [상태 관리란 무엇인가?](#-1장-상태-관리란-무엇인가)
2. [Zustand 소개](#-2장-zustand-소개)
3. [Zustand 기본 개념](#-3장-zustand-기본-개념)
4. [첫 번째 Store 만들기](#-4장-첫-번째-store-만들기)
5. [set 함수 완전 정복](#-5장-set-함수-완전-정복)
6. [get 함수 이해하기](#-6장-get-함수-이해하기)
7. [컴포넌트에서 상태 구독하기](#-7장-컴포넌트에서-상태-구독하기)
8. [TypeScript와 함께 사용하기](#-8장-typescript와-함께-사용하기)
9. [비동기 액션 (Async Actions)](#-9장-비동기-액션-async-actions)
10. [미들웨어 (Middleware)](#-10장-미들웨어-middleware)
11. [persist 미들웨어 상세](#-11장-persist-미들웨어-상세)
12. [subscribeWithSelector 미들웨어](#-12장-subscribewithselector-미들웨어)
13. [Selector (선택자) 패턴](#-13장-selector-선택자-패턴)
14. [스토어 간 연동](#-14장-스토어-간-연동)
15. [Computed 값 (파생 상태)](#-15장-computed-값-파생-상태)
16. [React 외부에서 스토어 사용](#-16장-react-외부에서-스토어-사용)
17. [모듈 구조화](#-17장-모듈-구조화)
18. [실전 패턴 모음](#-18장-실전-패턴-모음)
19. [디버깅 및 개발 도구](#-19장-디버깅-및-개발-도구)
20. [정리 및 체크리스트](#-20장-정리-및-체크리스트)

---

## 📚 1장: 상태 관리란 무엇인가?

### 1.1 문제 상황 이해하기

React에서 데이터를 관리할 때 겪는 문제를 먼저 이해해봅시다.

```
앱 구조 예시:

        App
         │
    ┌────┴────┐
    │         │
  Header    Main
    │         │
 UserName   Content
              │
           UserProfile
```

만약 `UserName`과 `UserProfile` 컴포넌트 둘 다 사용자 이름이 필요하다면?

**방법 1: Props Drilling (일반적인 방법)**

```tsx
// App에서 시작해서 모든 중간 컴포넌트를 거쳐 전달
function App() {
  const [userName, setUserName] = useState('홍길동');

  return (
    <>
      <Header userName={userName} />  {/* Header는 사용 안 하지만 전달해야 함 */}
      <Main userName={userName} />    {/* Main도 사용 안 하지만 전달해야 함 */}
    </>
  );
}

function Header({ userName }) {
  return <UserName userName={userName} />;  // 그냥 전달만 함
}

function Main({ userName }) {
  return <Content userName={userName} />;   // 그냥 전달만 함
}

// ... 계속 전달, 전달, 전달...
```

**문제점:**
- 중간 컴포넌트들이 사용하지도 않는 데이터를 전달해야 함
- 컴포넌트가 많아지면 관리가 매우 힘들어짐
- 데이터 흐름 추적이 어려워짐

### 1.2 상태 관리 라이브러리의 해결책

```
        App
         │
    ┌────┴────┐
    │         │
  Header    Main
    │         │
 UserName   Content        ←──┐
              │                │
           UserProfile    ←──┼── 🗄️ Store (전역 저장소)
                              │     userName: '홍길동'
              어디서든 직접 접근 가능!
```

**상태 관리 라이브러리**를 사용하면:
- 데이터를 **중앙 저장소(Store)**에 보관
- 어떤 컴포넌트든 **직접** 데이터에 접근 가능
- Props로 계속 전달할 필요 없음

---

## 📚 2장: Zustand 소개

### 2.1 Zustand란?

**Zustand**(독일어로 "상태"라는 뜻)는 React용 상태 관리 라이브러리입니다.

**특징:**
- 🪶 **가볍다**: 번들 크기가 매우 작음 (~1KB)
- 📝 **간단하다**: 배우기 쉽고 코드량이 적음
- 🔧 **유연하다**: 필요한 기능만 선택적으로 사용
- ⚡ **빠르다**: 불필요한 리렌더링 최소화

**다른 라이브러리와 비교:**

| 특성 | Redux | MobX | Zustand |
|------|-------|------|---------|
| 학습 난이도 | 어려움 | 보통 | **쉬움** |
| 코드량 | 많음 | 보통 | **적음** |
| 보일러플레이트 | 많음 | 보통 | **거의 없음** |
| 번들 크기 | ~7KB | ~16KB | **~1KB** |

### 2.2 설치하기

```bash
# npm 사용 시
npm install zustand

# React Native에서 persist 사용 시 추가 설치
npm install @react-native-async-storage/async-storage
```

---

## 📚 3장: Zustand 기본 개념

### 3.1 핵심 용어 정리

시작하기 전에 용어를 정리합니다:

```
┌─────────────────────────────────────────────────────────┐
│                      🗄️ Store (스토어)                  │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │              📦 State (상태)                     │   │
│  │                                                  │   │
│  │  • count: 0          ← 저장된 데이터            │   │
│  │  • userName: '홍길동'                            │   │
│  │  • isLoading: false                             │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │              ⚡ Actions (액션)                   │   │
│  │                                                  │   │
│  │  • increment()       ← 상태를 변경하는 함수들    │   │
│  │  • setUserName()                                │   │
│  │  • fetchData()                                  │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

| 용어 | 설명 | 비유 |
|------|------|------|
| **Store** | 상태와 액션을 담는 컨테이너 | 🏦 은행 전체 |
| **State** | 저장된 데이터 | 💰 은행 잔고 |
| **Action** | 상태를 변경하는 함수 | 📝 입금/출금 신청서 |
| **set** | 상태를 업데이트하는 함수 | ✍️ 잔고 수정 |
| **get** | 현재 상태를 읽는 함수 | 👀 잔고 조회 |

---

## 📚 4장: 첫 번째 Store 만들기

### 4.1 가장 간단한 예제

```typescript
// stores/counter-store.ts

import { create } from 'zustand';

// 1️⃣ 스토어 생성
const useCounterStore = create((set) => ({
  // 📦 State (상태)
  count: 0,

  // ⚡ Actions (액션)
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 }),
}));

export default useCounterStore;
```

**코드 분석:**

```typescript
import { create } from 'zustand';
//       ^^^^^^
//       Zustand에서 제공하는 스토어 생성 함수
```

```typescript
const useCounterStore = create((set) => ({
//    ^^^^^^^^^^^^^^^
//    관례적으로 'use'로 시작 (React Hook이므로)
//
//                      ^^^
//                      상태를 변경할 때 사용하는 함수
//                      Zustand가 자동으로 제공
```

```typescript
  count: 0,
  // ^^^^^
  // 초기 상태 값
```

```typescript
  increment: () => set((state) => ({ count: state.count + 1 })),
  // ^^^^^^^^^
  // 액션 이름
  //
  //           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  //           set 함수를 호출하여 상태 변경
  //
  //               ^^^^^^^
  //               현재 상태를 받아서
  //
  //                          ^^^^^^^^^^^^^^^^^^^^^^^^^^
  //                          새로운 상태 객체 반환
```

### 4.2 컴포넌트에서 사용하기

```tsx
// components/Counter.tsx

import useCounterStore from '../stores/counter-store';

function Counter() {
  // 스토어에서 필요한 것들을 가져옴
  const count = useCounterStore((state) => state.count);
  const increment = useCounterStore((state) => state.increment);
  const decrement = useCounterStore((state) => state.decrement);
  const reset = useCounterStore((state) => state.reset);

  return (
    <div>
      <h1>카운트: {count}</h1>
      <button onClick={increment}>+1</button>
      <button onClick={decrement}>-1</button>
      <button onClick={reset}>리셋</button>
    </div>
  );
}
```

**사용 흐름:**

```
1. 사용자가 "+1" 버튼 클릭
          │
          ▼
2. increment() 액션 실행
          │
          ▼
3. set() 호출 → count가 0에서 1로 변경
          │
          ▼
4. Zustand가 변경 감지
          │
          ▼
5. count를 구독하는 컴포넌트만 리렌더링
          │
          ▼
6. 화면에 "카운트: 1" 표시
```

---

## 📚 5장: `set` 함수 완전 정복

### 5.1 set 함수의 두 가지 사용법

**방법 1: 객체 직접 전달** (이전 상태가 필요 없을 때)

```typescript
// 단순히 새 값으로 교체
set({ count: 0 })           // count를 0으로 설정
set({ userName: '홍길동' })  // userName을 '홍길동'으로 설정
set({ isLoading: true })    // isLoading을 true로 설정
```

**방법 2: 함수 전달** (이전 상태가 필요할 때)

```typescript
// 이전 상태를 기반으로 계산
set((state) => ({ count: state.count + 1 }))  // 기존 count에 1 더하기
set((state) => ({ items: [...state.items, newItem] }))  // 배열에 항목 추가
```

### 5.2 중요한 규칙: 부분 업데이트

Zustand의 `set`은 **부분 업데이트(Partial Update)**를 합니다:

```typescript
// 스토어 상태
{
  name: '홍길동',
  age: 25,
  city: '서울'
}

// set({ age: 26 }) 호출 시
{
  name: '홍길동',  // ← 유지됨
  age: 26,        // ← 변경됨
  city: '서울'    // ← 유지됨
}
```

**React의 useState와 비교:**

```typescript
// React useState - 전체 교체 (spread 필요)
setState((prev) => ({ ...prev, age: 26 }));

// Zustand set - 자동 병합 (spread 불필요)
set({ age: 26 });
```

### 5.3 set의 두 번째 인자: replace

```typescript
// 기본값: false (부분 업데이트)
set({ age: 26 }, false);

// true로 설정하면: 전체 교체
set({ age: 26 }, true);  // name, city가 사라짐!
```

---

## 📚 6장: `get` 함수 이해하기

### 6.1 get 함수란?

`get`은 **현재 스토어의 상태를 읽는 함수**입니다.

```typescript
const useStore = create((set, get) => ({
  //                          ^^^
  //                          두 번째 인자로 받음

  firstName: '길동',
  lastName: '홍',

  // get()을 사용하여 현재 상태 읽기
  getFullName: () => {
    const state = get();  // 현재 상태 전체를 가져옴
    return `${state.lastName}${state.firstName}`;
  },
}));
```

### 6.2 언제 get을 사용하나요?

**상황 1: 액션 안에서 다른 상태값이 필요할 때**

```typescript
const useCartStore = create((set, get) => ({
  items: [],
  discount: 0.1,  // 10% 할인

  // 총액 계산 시 items와 discount 둘 다 필요
  getTotalPrice: () => {
    const { items, discount } = get();
    const subtotal = items.reduce((sum, item) => sum + item.price, 0);
    return subtotal * (1 - discount);
  },
}));
```

**상황 2: 조건부로 상태 변경할 때**

```typescript
const useStore = create((set, get) => ({
  count: 0,
  maxCount: 10,

  increment: () => {
    const { count, maxCount } = get();

    // 현재 상태를 확인하고 조건부로 변경
    if (count < maxCount) {
      set({ count: count + 1 });
    } else {
      console.log('최대값에 도달했습니다!');
    }
  },
}));
```

**상황 3: 다른 액션을 호출할 때**

```typescript
const useStore = create((set, get) => ({
  data: null,
  isLoading: false,

  fetchData: async () => {
    set({ isLoading: true });
    const response = await fetch('/api/data');
    const data = await response.json();
    set({ data, isLoading: false });
  },

  // 다른 액션 안에서 fetchData 호출
  refreshData: async () => {
    get().fetchData();  // fetchData 액션 실행
  },
}));
```

---

## 📚 7장: 컴포넌트에서 상태 구독하기

### 7.1 구독(Subscription)이란?

**구독** = 상태가 변경되면 알려달라고 등록하는 것

```
┌─────────────┐     구독      ┌─────────────┐
│  Component  │ ───────────▶ │    Store    │
│             │              │             │
│  count 표시  │ ◀─────────── │  count: 5   │
└─────────────┘    변경 알림   └─────────────┘
```

### 7.2 세 가지 구독 방법

**방법 1: 선택적 구독 (권장 ⭐)**

```tsx
function Counter() {
  // count만 구독 - count가 변경될 때만 리렌더링
  const count = useCounterStore((state) => state.count);

  return <div>{count}</div>;
}
```

**방법 2: 여러 상태 개별 구독**

```tsx
function Counter() {
  // 각각 따로 구독
  const count = useCounterStore((state) => state.count);
  const name = useCounterStore((state) => state.name);

  // count 또는 name이 변경될 때 리렌더링
  return <div>{name}: {count}</div>;
}
```

**방법 3: 전체 구독 (비권장 ⚠️)**

```tsx
function Counter() {
  // 전체 스토어 구독 - 어떤 상태든 변경되면 리렌더링
  const { count, name, age, city } = useCounterStore();

  return <div>{count}</div>;
}
```

### 7.3 왜 선택적 구독이 중요한가?

```
스토어 상태: { count: 0, theme: 'dark', user: {...} }

┌─────────────────────────────────────────────────────────┐
│                     전체 구독 시                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  count 변경 → 리렌더링 ✓                                │
│  theme 변경 → 리렌더링 ✓  ← 불필요한 리렌더링!          │
│  user 변경  → 리렌더링 ✓  ← 불필요한 리렌더링!          │
│                                                         │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                   count만 구독 시                        │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  count 변경 → 리렌더링 ✓                                │
│  theme 변경 → 무시 ✗      ← 성능 최적화!                │
│  user 변경  → 무시 ✗      ← 성능 최적화!                │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 7.4 액션만 가져오기 (리렌더링 방지)

```tsx
function IncrementButton() {
  // 액션만 가져옴 - 상태가 변해도 이 컴포넌트는 리렌더링 안 됨
  const increment = useCounterStore((state) => state.increment);

  return <button onClick={increment}>+1</button>;
}
```

**왜 액션은 리렌더링을 발생시키지 않나요?**

액션(함수)은 스토어가 생성될 때 한 번 만들어지고 변경되지 않습니다.
상태(데이터)만 변경되므로, 액션만 구독하면 리렌더링이 발생하지 않습니다.

---

## 📚 8장: TypeScript와 함께 사용하기

### 8.1 기본 타입 정의

```typescript
// stores/user-store.ts

import { create } from 'zustand';

// 1️⃣ 상태 타입 정의
interface UserState {
  name: string;
  age: number;
  email: string;
}

// 2️⃣ 액션 타입 정의
interface UserActions {
  setName: (name: string) => void;
  setAge: (age: number) => void;
  setEmail: (email: string) => void;
  reset: () => void;
}

// 3️⃣ 전체 스토어 타입 = 상태 + 액션
type UserStore = UserState & UserActions;

// 4️⃣ 초기 상태 (재사용을 위해 분리)
const initialState: UserState = {
  name: '',
  age: 0,
  email: '',
};

// 5️⃣ 스토어 생성 (타입 지정)
export const useUserStore = create<UserStore>()((set) => ({
  // 초기 상태 spread
  ...initialState,

  // 액션 구현
  setName: (name) => set({ name }),
  setAge: (age) => set({ age }),
  setEmail: (email) => set({ email }),
  reset: () => set(initialState),
}));
```

### 8.2 프로젝트 코드 분석: location-store.ts

이 프로젝트의 실제 코드를 분석해봅시다:

```typescript
// 1️⃣ 타입 정의
type PermissionStatus = 'undetermined' | 'granted' | 'denied';

interface LocationState {
  location: LocationInfo | null;  // null 가능 (아직 위치를 모를 때)
  isLoading: boolean;
  error: string | null;           // null 가능 (에러 없을 때)
  permissionStatus: PermissionStatus;
  lastUpdated: Date | null;
}

interface LocationActions {
  requestLocation: () => Promise<void>;  // 비동기 함수
  setLocation: (location: LocationInfo) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

type LocationStore = LocationState & LocationActions;
```

**타입 분리의 장점:**
- 상태와 액션이 명확히 구분됨
- 자동완성 지원
- 컴파일 타임에 오류 발견
- 코드 문서화 역할

---

## 📚 9장: 비동기 액션 (Async Actions)

### 9.1 비동기 작업이란?

**동기(Sync)**: 코드가 순서대로 즉시 실행
**비동기(Async)**: 시간이 걸리는 작업 (API 호출, 파일 읽기 등)

```typescript
// 동기 작업 - 즉시 완료
set({ count: 1 });

// 비동기 작업 - 시간이 걸림
await fetch('/api/data');  // 서버 응답 기다림
```

### 9.2 비동기 액션 패턴

```typescript
const useDataStore = create((set) => ({
  data: null,
  isLoading: false,
  error: null,

  // async/await 사용
  fetchData: async () => {
    // 1단계: 로딩 시작
    set({ isLoading: true, error: null });

    try {
      // 2단계: 데이터 요청 (시간 소요)
      const response = await fetch('/api/data');
      const data = await response.json();

      // 3단계: 성공 - 데이터 저장
      set({ data, isLoading: false });

    } catch (error) {
      // 3단계: 실패 - 에러 저장
      set({
        error: error.message,
        isLoading: false
      });
    }
  },
}));
```

**실행 흐름:**

```
fetchData() 호출
       │
       ▼
┌──────────────────┐
│ isLoading: true  │ ← UI에 로딩 스피너 표시
│ error: null      │
└──────────────────┘
       │
       ▼
   API 요청 중...
   (1~2초 소요)
       │
       ├─────────────────────┐
       │                     │
       ▼                     ▼
    성공 시                실패 시
┌──────────────────┐  ┌──────────────────┐
│ data: {...}      │  │ data: null       │
│ isLoading: false │  │ isLoading: false │
│ error: null      │  │ error: "..."     │
└──────────────────┘  └──────────────────┘
       │                     │
       ▼                     ▼
  데이터 표시            에러 메시지 표시
```

### 9.3 프로젝트 코드 분석: requestLocation

```typescript
requestLocation: async () => {
  // 🔵 1단계: 로딩 시작, 이전 에러 초기화
  set({ isLoading: true, error: null });

  try {
    // 🔵 2단계: 위치 권한 요청
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== 'granted') {
      // 🟡 권한 거부됨 → 기본 위치 사용
      set({
        location: DEFAULT_LOCATION,
        isLoading: false,
        permissionStatus: 'denied',
        lastUpdated: new Date(),
      });
      return;  // 함수 종료
    }

    // 🔵 3단계: 권한 있음 → 현재 위치 가져오기
    set({ permissionStatus: 'granted' });

    try {
      const position = await Location.getCurrentPositionAsync({...});

      // 🔵 4단계: 역지오코딩 (좌표 → 주소 변환)
      try {
        const [address] = await Location.reverseGeocodeAsync({...});

        // 🟢 성공: 모든 정보 저장
        set({
          location: {
            city: address?.city || '현재 위치',
            district: address?.district || '',
            coords: { latitude, longitude },
          },
          isLoading: false,
          lastUpdated: new Date(),
        });

      } catch (geocodeError) {
        // 🟡 주소 변환 실패 → 좌표만 사용
        set({
          location: { city: '현재 위치', coords: {...} },
          isLoading: false,
        });
      }

    } catch (positionError) {
      // 🟡 위치 서비스 불가 → 기본 위치 사용
      set({ location: DEFAULT_LOCATION, isLoading: false });
    }

  } catch (err) {
    // 🔴 전체 실패: 에러 저장
    set({
      location: DEFAULT_LOCATION,
      isLoading: false,
      error: err.message,
    });
  }
},
```

**중첩 try-catch의 이유:**

```
권한 요청 ─┬─ 성공 → 위치 가져오기 ─┬─ 성공 → 주소 변환 ─┬─ 성공 → 완료
           │                        │                     │
           │                        │                     └─ 실패 → 좌표만 사용
           │                        │
           │                        └─ 실패 → 기본 위치 사용
           │
           └─ 실패 → 에러 저장 + 기본 위치 사용

각 단계에서 실패해도 앱이 멈추지 않고 적절한 폴백(fallback) 처리
```

---

## 📚 10장: 미들웨어 (Middleware)

### 10.1 미들웨어란?

**미들웨어** = 스토어에 추가 기능을 덧붙이는 도구

```
일반 스토어:
┌───────────────┐
│    Store      │
│  state + set  │
└───────────────┘

미들웨어 적용 후:
┌───────────────────────────────────────┐
│           🧅 미들웨어 레이어           │
│  ┌─────────────────────────────────┐  │
│  │         🧅 미들웨어 레이어       │  │
│  │  ┌───────────────────────────┐  │  │
│  │  │         Store             │  │  │
│  │  │      state + set          │  │  │
│  │  └───────────────────────────┘  │  │
│  │        + 추가 기능 1            │  │
│  └─────────────────────────────────┘  │
│            + 추가 기능 2               │
└───────────────────────────────────────┘
```

### 10.2 주요 미들웨어

| 미들웨어 | 기능 | 사용 사례 |
|----------|------|-----------|
| `persist` | 상태 저장/복원 | 로그인 유지, 설정 저장 |
| `devtools` | Redux DevTools 연동 | 개발 중 디버깅 |
| `subscribeWithSelector` | 선택적 구독 | 특정 상태 변경 감지 |
| `immer` | 불변성 관리 | 복잡한 중첩 객체 수정 |

---

## 📚 11장: persist 미들웨어 상세

### 11.1 persist란?

**persist** = 상태를 저장소에 **영구 저장**하는 미들웨어

```
앱 실행 중:
┌─────────────┐      자동 저장      ┌─────────────────────┐
│   Store     │ ─────────────────▶ │  Storage            │
│ count: 5    │                    │  (AsyncStorage)     │
└─────────────┘                    │  {"count": 5}       │
                                   └─────────────────────┘

앱 재시작:
┌─────────────┐      자동 복원      ┌─────────────────────┐
│   Store     │ ◀───────────────── │  Storage            │
│ count: 5    │                    │  {"count": 5}       │
└─────────────┘                    └─────────────────────┘
```

### 11.2 기본 사용법

```typescript
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useStore = create(
  persist(
    // 1️⃣ 원래 스토어 정의
    (set) => ({
      count: 0,
      increment: () => set((state) => ({ count: state.count + 1 })),
    }),

    // 2️⃣ persist 설정
    {
      name: 'my-storage',  // 저장소에서 사용할 키 이름
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
```

### 11.3 persist 설정 옵션

```typescript
{
  // 필수: 저장소 키 이름
  name: 'location-storage',

  // 필수: 저장소 선택
  storage: createJSONStorage(() => AsyncStorage),

  // 선택: 일부 상태만 저장
  partialize: (state) => ({
    location: state.location,
    permissionStatus: state.permissionStatus,
    // isLoading, error는 저장 안 함 (앱 재시작 시 불필요)
  }),

  // 선택: 버전 관리 (마이그레이션용)
  version: 1,

  // 선택: 버전 업그레이드 시 데이터 변환
  migrate: (persistedState, version) => {
    if (version === 0) {
      // 이전 버전 데이터를 새 형식으로 변환
    }
    return persistedState;
  },

  // 선택: 복원 완료 후 실행할 콜백
  onRehydrateStorage: (state) => {
    console.log('복원 시작');
    return (state, error) => {
      if (error) {
        console.log('복원 실패:', error);
      } else {
        console.log('복원 완료');
      }
    };
  },
}
```

### 11.4 프로젝트 코드 분석

```typescript
export const useLocationStore = create<LocationStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      // ... 액션들
    }),
    {
      name: 'location-storage',
      storage: createJSONStorage(() => AsyncStorage),

      // 🔑 핵심: 일부만 저장
      partialize: (state) => ({
        location: state.location,           // ✅ 저장 (위치 정보)
        permissionStatus: state.permissionStatus,  // ✅ 저장 (권한 상태)
        // isLoading: ❌ 저장 안 함 (항상 false로 시작)
        // error: ❌ 저장 안 함 (이전 에러 불필요)
        // lastUpdated: ❌ 저장 안 함 (매번 새로 갱신)
      }),
    }
  )
);
```

**partialize를 사용하는 이유:**

| 상태 | 저장? | 이유 |
|------|-------|------|
| `location` | ✅ | 앱 재시작 시 이전 위치 사용 |
| `permissionStatus` | ✅ | 권한 상태 기억 |
| `isLoading` | ❌ | 항상 false로 시작해야 함 |
| `error` | ❌ | 이전 세션 에러 불필요 |
| `lastUpdated` | ❌ | 새로 갱신할 것 |

### 11.5 저장소 종류

```typescript
// 🌐 웹 브라우저 - localStorage
import { persist, createJSONStorage } from 'zustand/middleware';

const useStore = create(
  persist(
    (set) => ({ /* ... */ }),
    {
      name: 'web-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// 📱 React Native - AsyncStorage
import AsyncStorage from '@react-native-async-storage/async-storage';

const useStore = create(
  persist(
    (set) => ({ /* ... */ }),
    {
      name: 'mobile-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// 🔒 보안이 필요한 데이터 - SecureStore
import * as SecureStore from 'expo-secure-store';

const secureStorage = {
  getItem: async (name) => await SecureStore.getItemAsync(name),
  setItem: async (name, value) => await SecureStore.setItemAsync(name, value),
  removeItem: async (name) => await SecureStore.deleteItemAsync(name),
};

const useStore = create(
  persist(
    (set) => ({ /* ... */ }),
    {
      name: 'secure-storage',
      storage: createJSONStorage(() => secureStorage),
    }
  )
);
```

---

## 📚 12장: subscribeWithSelector 미들웨어

### 12.1 subscribeWithSelector란?

**일반 구독**: 스토어의 **아무** 상태가 변해도 알림
**선택적 구독**: **특정** 상태가 변할 때만 알림

```typescript
import { subscribeWithSelector } from 'zustand/middleware';

const useStore = create(
  subscribeWithSelector((set) => ({
    count: 0,
    name: '홍길동',
    increment: () => set((state) => ({ count: state.count + 1 })),
  }))
);
```

### 12.2 외부에서 상태 변경 감지하기

```typescript
// 🎯 count가 변경될 때만 실행
const unsubscribe = useStore.subscribe(
  (state) => state.count,           // 감시할 상태 선택
  (count, previousCount) => {       // 변경 시 실행할 콜백
    console.log(`count 변경: ${previousCount} → ${count}`);

    // 예: 분석 이벤트 전송
    analytics.track('count_changed', { count });
  }
);

// 구독 해제
unsubscribe();
```

### 12.3 사용 예시

```typescript
// 프로젝트의 weather-store.ts에서

export const useWeatherStore = create<WeatherStore>()(
  subscribeWithSelector((set, get) => ({
    weatherData: null,
    // ... 나머지 상태와 액션
  }))
);

// 사용 예: 날씨 데이터가 로드되면 분석 이벤트 전송
useWeatherStore.subscribe(
  (state) => state.weatherData,
  (weatherData, prevWeatherData) => {
    if (weatherData && !prevWeatherData) {
      // 처음 데이터가 로드된 경우
      analytics.track('weather_loaded', {
        temperature: weatherData.today.temperature,
      });
    }
  }
);
```

### 12.4 subscribeWithSelector vs 일반 subscribe

```typescript
// ❌ 일반 subscribe - 모든 변경에 반응
useStore.subscribe((state) => {
  console.log('무언가 변경됨');  // count, name 뭐든 변경되면 실행
});

// ✅ subscribeWithSelector - 특정 상태에만 반응
useStore.subscribe(
  (state) => state.count,
  (count) => {
    console.log('count만 변경됨');  // count 변경 시에만 실행
  }
);
```

---

## 📚 13장: Selector (선택자) 패턴

### 13.1 Selector란?

**Selector** = 스토어에서 필요한 데이터만 추출하는 함수

```typescript
// 선택자 정의
const selectLocation = (state: LocationStore) => state.location;
const selectIsLoading = (state: LocationStore) => state.isLoading;

// 사용
const location = useLocationStore(selectLocation);
const isLoading = useLocationStore(selectIsLoading);
```

### 13.2 왜 Selector를 분리하나요?

**이유 1: 재사용성**

```typescript
// 선택자를 한 번 정의하면
export const selectLocation = (state) => state.location;

// 여러 컴포넌트에서 재사용
// ComponentA.tsx
const location = useLocationStore(selectLocation);

// ComponentB.tsx
const location = useLocationStore(selectLocation);

// ComponentC.tsx
const location = useLocationStore(selectLocation);
```

**이유 2: 유지보수성**

```typescript
// 상태 구조가 변경되면 선택자만 수정
// Before: state.location
// After: state.user.location

// 선택자 하나만 수정하면 끝!
export const selectLocation = (state) => state.user.location;

// 모든 컴포넌트는 그대로 작동
```

**이유 3: 파생 데이터 계산**

```typescript
// 복잡한 계산 로직을 선택자에 캡슐화
export const selectTemperatureDiff = (state: WeatherStore) => {
  if (!state.weatherData) return null;
  return state.weatherData.today.temperature - state.weatherData.lastYear.temperature;
};

// 컴포넌트에서는 간단하게 사용
const tempDiff = useWeatherStore(selectTemperatureDiff);
```

### 13.3 프로젝트의 Selector 예시

```typescript
// location-store.ts에서

/** 위치 정보만 선택 */
export const selectLocation = (state: LocationStore) => state.location;

/** 로딩 상태만 선택 */
export const selectIsLoading = (state: LocationStore) => state.isLoading;

/** 에러만 선택 */
export const selectError = (state: LocationStore) => state.error;

/** 좌표만 선택 (중첩 객체에서 추출) */
export const selectCoords = (state: LocationStore) => state.location?.coords;

/** 복합 선택자: 위치 + 로딩 상태 */
export const selectLocationWithLoading = (state: LocationStore) => ({
  location: state.location,
  isLoading: state.isLoading,
});
```

---

## 📚 14장: 스토어 간 연동

### 14.1 다른 스토어의 상태 읽기

```typescript
// weather-store.ts에서 location-store 사용

import { useLocationStore } from './location-store';

export const useWeatherStore = create((set, get) => ({
  // ...

  fetchWeatherFromCurrentLocation: async () => {
    // 🔑 다른 스토어의 현재 상태 가져오기
    const location = useLocationStore.getState().location;

    if (!location) {
      set({ error: '위치 정보가 없습니다' });
      return;
    }

    // 가져온 위치로 날씨 조회
    const { latitude, longitude } = location.coords;
    await get().fetchWeather(latitude, longitude);
  },
}));
```

### 14.2 getState() 이해하기

```typescript
// useStore() - React Hook (컴포넌트 안에서만 사용)
function Component() {
  const count = useStore((state) => state.count);  // ✅
}

// useStore.getState() - 어디서나 사용 가능
function utilityFunction() {
  const count = useStore.getState().count;  // ✅
}

// 이벤트 핸들러에서
document.addEventListener('click', () => {
  const count = useStore.getState().count;  // ✅
});

// 다른 스토어에서
const useOtherStore = create((set) => ({
  doSomething: () => {
    const count = useStore.getState().count;  // ✅
  },
}));
```

### 14.3 스토어 연동 패턴

```
┌─────────────────────┐       getState()      ┌─────────────────────┐
│   Location Store    │ ◀──────────────────── │   Weather Store     │
│                     │                        │                     │
│  location: {...}    │                        │  fetchWeather()     │
│  requestLocation()  │                        │  uses location      │
└─────────────────────┘                        └─────────────────────┘

Weather Store가 Location Store의 상태를 읽어서 날씨 조회
```

---

## 📚 15장: Computed 값 (파생 상태)

### 15.1 Computed 값이란?

**Computed** = 다른 상태에서 **계산된** 값

```typescript
// 예: 장바구니
items: [
  { name: '사과', price: 1000, quantity: 3 },
  { name: '바나나', price: 500, quantity: 2 },
]

// Computed 값들:
totalItems: 5           // 3 + 2
totalPrice: 4000        // (1000*3) + (500*2)
isEmpty: false          // items.length === 0
```

### 15.2 Zustand에서 Computed 구현

**방법 1: getter 사용**

```typescript
const useCartStore = create((set, get) => ({
  items: [],

  // getter로 computed 값 정의
  get totalPrice() {
    return get().items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  },

  get totalItems() {
    return get().items.reduce(
      (sum, item) => sum + item.quantity,
      0
    );
  },

  get isEmpty() {
    return get().items.length === 0;
  },
}));

// 사용
const totalPrice = useCartStore((state) => state.totalPrice);
```

**방법 2: Selector에서 계산**

```typescript
const useCartStore = create((set) => ({
  items: [],
}));

// Selector에서 계산
export const selectTotalPrice = (state) =>
  state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

export const selectTotalItems = (state) =>
  state.items.reduce((sum, item) => sum + item.quantity, 0);

// 사용
const totalPrice = useCartStore(selectTotalPrice);
```

### 15.3 프로젝트 코드: weather-store.ts

```typescript
export const useWeatherStore = create<WeatherStore>()(
  subscribeWithSelector((set, get) => ({
    weatherData: null,

    // Computed 값들 (getter 패턴)
    get currentTemperature() {
      return get().weatherData?.today.temperature ?? null;
    },

    get lastYearTemperature() {
      return get().weatherData?.lastYear.temperature ?? null;
    },

    get temperatureDifference() {
      const data = get().weatherData;
      if (!data) return null;
      return data.today.temperature - data.lastYear.temperature;
    },

    get temperatureComparison() {
      const data = get().weatherData;
      if (!data) return null;
      const diff = data.today.temperature - data.lastYear.temperature;
      if (diff > 2) return 'warmer';
      if (diff < -2) return 'colder';
      return 'similar';
    },

    // ... 액션들
  }))
);
```

---

## 📚 16장: React 외부에서 스토어 사용

### 16.1 getState()와 setState()

```typescript
// 스토어 정의
const useStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
}));

// React 컴포넌트 외부에서 사용

// 1️⃣ 현재 상태 읽기
const currentCount = useStore.getState().count;
console.log(currentCount);  // 0

// 2️⃣ 액션 실행
useStore.getState().increment();

// 3️⃣ 직접 상태 변경 (권장하지 않음)
useStore.setState({ count: 100 });

// 4️⃣ 상태 변경 구독
const unsubscribe = useStore.subscribe((state) => {
  console.log('상태 변경됨:', state);
});
```

### 16.2 사용 사례

**API 서비스에서:**

```typescript
// services/weather-service.ts
import { useLocationStore } from '@/store';

class WeatherService {
  async getCurrentWeather() {
    // React 외부에서 위치 정보 읽기
    const location = useLocationStore.getState().location;

    if (!location) {
      throw new Error('위치 정보가 없습니다');
    }

    return this.fetchWeather(location.coords);
  }
}
```

**네비게이션에서:**

```typescript
// navigation/NavigationService.ts
import { useAuthStore } from '@/store';

function navigateBasedOnAuth() {
  const isLoggedIn = useAuthStore.getState().isLoggedIn;

  if (isLoggedIn) {
    navigate('Home');
  } else {
    navigate('Login');
  }
}
```

**이벤트 리스너에서:**

```typescript
// 앱 시작 시
AppState.addEventListener('change', (nextAppState) => {
  if (nextAppState === 'active') {
    // 앱이 포그라운드로 돌아오면 위치 갱신
    useLocationStore.getState().requestLocation();
  }
});
```

---

## 📚 17장: 모듈 구조화

### 17.1 index.ts를 통한 re-export

```typescript
// store/index.ts

// Location Store exports
export {
  useLocationStore,
  selectLocation,
  selectIsLoading as selectLocationIsLoading,  // 이름 충돌 방지
  selectError as selectLocationError,
  selectCoords,
  selectLocationWithLoading,
} from './location-store';

// Weather Store exports
export {
  useWeatherStore,
  selectWeatherData,
  selectIsLoading as selectWeatherIsLoading,
  selectIsRefreshing,
  selectError as selectWeatherError,
  selectTodayWeather,
  selectLastYearWeather,
  selectTemperatureDiff,
} from './weather-store';
```

**사용:**

```typescript
// ❌ 개별 파일에서 import (비권장)
import { useLocationStore } from '@/store/location-store';
import { useWeatherStore } from '@/store/weather-store';

// ✅ index.ts에서 한 번에 import (권장)
import {
  useLocationStore,
  useWeatherStore,
  selectLocation,
  selectWeatherData,
} from '@/store';
```

### 17.2 스토어 파일 구조 템플릿

```typescript
/**
 * [Store Name] - 설명
 *
 * 학습 포인트:
 * 1. ...
 * 2. ...
 */

import { create } from 'zustand';
// ... 필요한 미들웨어 import

// ============================================================
// 타입 정의
// ============================================================

interface SomeState {
  // 상태 타입
}

interface SomeActions {
  // 액션 타입
}

type SomeStore = SomeState & SomeActions;

// ============================================================
// 상수
// ============================================================

const initialState: SomeState = {
  // 초기값
};

// ============================================================
// 스토어 생성
// ============================================================

export const useSomeStore = create<SomeStore>()(
  // 미들웨어 적용
  (set, get) => ({
    ...initialState,
    // 액션 구현
  })
);

// ============================================================
// 선택자 (Selectors)
// ============================================================

export const selectSomething = (state: SomeStore) => state.something;
```

---

## 📚 18장: 실전 패턴 모음

### 18.1 로딩/에러 상태 관리

```typescript
interface AsyncState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}

const useDataStore = create<AsyncState<Data> & Actions>()((set) => ({
  data: null,
  isLoading: false,
  error: null,

  fetchData: async () => {
    set({ isLoading: true, error: null });

    try {
      const data = await api.getData();
      set({ data, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : '오류 발생',
        isLoading: false
      });
    }
  },
}));
```

### 18.2 리스트 CRUD 작업

```typescript
interface TodoStore {
  todos: Todo[];
  addTodo: (text: string) => void;
  removeTodo: (id: string) => void;
  toggleTodo: (id: string) => void;
  updateTodo: (id: string, text: string) => void;
}

const useTodoStore = create<TodoStore>()((set) => ({
  todos: [],

  addTodo: (text) => set((state) => ({
    todos: [...state.todos, { id: Date.now().toString(), text, completed: false }],
  })),

  removeTodo: (id) => set((state) => ({
    todos: state.todos.filter((todo) => todo.id !== id),
  })),

  toggleTodo: (id) => set((state) => ({
    todos: state.todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ),
  })),

  updateTodo: (id, text) => set((state) => ({
    todos: state.todos.map((todo) =>
      todo.id === id ? { ...todo, text } : todo
    ),
  })),
}));
```

### 18.3 폼 상태 관리

```typescript
interface FormStore {
  values: { name: string; email: string; password: string };
  errors: { name?: string; email?: string; password?: string };
  touched: { name: boolean; email: boolean; password: boolean };

  setValue: (field: string, value: string) => void;
  setTouched: (field: string) => void;
  validate: () => boolean;
  reset: () => void;
}

const initialFormState = {
  values: { name: '', email: '', password: '' },
  errors: {},
  touched: { name: false, email: false, password: false },
};

const useFormStore = create<FormStore>()((set, get) => ({
  ...initialFormState,

  setValue: (field, value) => set((state) => ({
    values: { ...state.values, [field]: value },
  })),

  setTouched: (field) => set((state) => ({
    touched: { ...state.touched, [field]: true },
  })),

  validate: () => {
    const { values } = get();
    const errors: FormStore['errors'] = {};

    if (!values.name) errors.name = '이름을 입력하세요';
    if (!values.email) errors.email = '이메일을 입력하세요';
    if (values.password.length < 6) errors.password = '비밀번호는 6자 이상';

    set({ errors });
    return Object.keys(errors).length === 0;
  },

  reset: () => set(initialFormState),
}));
```

### 18.4 인증 상태 관리

```typescript
interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;

  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,

      get isAuthenticated() {
        return get().token !== null;
      },

      login: async (email, password) => {
        const response = await authApi.login(email, password);
        set({ user: response.user, token: response.token });
      },

      logout: () => {
        set({ user: null, token: null });
      },

      checkAuth: async () => {
        const token = get().token;
        if (!token) return;

        try {
          const user = await authApi.me(token);
          set({ user });
        } catch {
          set({ user: null, token: null });
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ token: state.token }),
    }
  )
);
```

---

## 📚 19장: 디버깅 및 개발 도구

### 19.1 devtools 미들웨어

```typescript
import { devtools } from 'zustand/middleware';

const useStore = create(
  devtools(
    (set) => ({
      count: 0,
      increment: () => set(
        (state) => ({ count: state.count + 1 }),
        false,          // replace 여부
        'increment'     // 액션 이름 (DevTools에 표시)
      ),
    }),
    { name: 'CounterStore' }  // DevTools에서 표시될 스토어 이름
  )
);
```

### 19.2 여러 미들웨어 조합

```typescript
import { create } from 'zustand';
import { devtools, persist, subscribeWithSelector } from 'zustand/middleware';

const useStore = create<Store>()(
  devtools(                              // 3️⃣ 가장 바깥
    persist(                             // 2️⃣ 중간
      subscribeWithSelector(             // 1️⃣ 가장 안쪽
        (set, get) => ({
          // 스토어 정의
        })
      ),
      { name: 'my-storage' }
    ),
    { name: 'MyStore' }
  )
);
```

### 19.3 콘솔 로깅

```typescript
// 상태 변경 로깅
useStore.subscribe((state) => {
  console.log('📦 상태 변경:', state);
});

// 특정 상태만 로깅 (subscribeWithSelector 필요)
useStore.subscribe(
  (state) => state.count,
  (count, prevCount) => {
    console.log(`📊 count: ${prevCount} → ${count}`);
  }
);
```

---

## 📚 20장: 정리 및 체크리스트

### 20.1 핵심 개념 요약

```
┌─────────────────────────────────────────────────────────────┐
│                    Zustand 핵심 개념                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. create()      스토어를 생성하는 함수                    │
│                                                             │
│  2. set()         상태를 변경하는 함수 (부분 업데이트)      │
│                                                             │
│  3. get()         현재 상태를 읽는 함수                     │
│                                                             │
│  4. 선택적 구독    필요한 상태만 구독하여 최적화            │
│                                                             │
│  5. getState()    React 외부에서 상태 접근                  │
│                                                             │
│  6. 미들웨어       persist, devtools 등 기능 확장           │
│                                                             │
│  7. Selector      상태 추출 함수로 재사용성/유지보수성 향상 │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 20.2 사용 체크리스트

| 항목 | 확인 |
|------|------|
| 타입 정의 (State, Actions, Store) | ☐ |
| 초기 상태 분리 (initialState) | ☐ |
| 선택적 구독 사용 | ☐ |
| Selector 함수 분리 | ☐ |
| persist 필요 시 partialize 설정 | ☐ |
| 비동기 액션의 로딩/에러 처리 | ☐ |
| index.ts에서 re-export | ☐ |

### 20.3 흔한 실수

```typescript
// ❌ 실수 1: 전체 상태 구독
const { count } = useStore();  // 다른 상태 변경에도 리렌더링

// ✅ 올바른 방법
const count = useStore((state) => state.count);
```

```typescript
// ❌ 실수 2: set에서 불필요한 spread
set((state) => ({ ...state, count: state.count + 1 }));

// ✅ 올바른 방법 (Zustand가 자동 병합)
set((state) => ({ count: state.count + 1 }));
```

```typescript
// ❌ 실수 3: 컴포넌트 안에서 getState 사용
function Component() {
  // 상태가 변해도 리렌더링 안 됨!
  const count = useStore.getState().count;
}

// ✅ 올바른 방법
function Component() {
  const count = useStore((state) => state.count);
}
```

```typescript
// ❌ 실수 4: 미들웨어 순서 잘못
create(persist(devtools(...)));  // devtools가 제대로 작동 안 함

// ✅ 올바른 방법 (devtools가 바깥에)
create(devtools(persist(...)));
```

---

## 📚 부록: 빠른 참조 카드

### A. 스토어 생성

```typescript
// 기본
const useStore = create((set, get) => ({ ... }));

// TypeScript
const useStore = create<Store>()((set, get) => ({ ... }));

// 미들웨어 적용
const useStore = create<Store>()(
  persist(
    subscribeWithSelector(
      (set, get) => ({ ... })
    ),
    { name: 'storage-key' }
  )
);
```

### B. 상태 변경 (set)

```typescript
set({ count: 0 });                              // 직접 설정
set((state) => ({ count: state.count + 1 }));   // 이전 상태 기반
set({ count: 0 }, true);                        // 전체 교체
```

### C. 컴포넌트에서 사용

```typescript
const count = useStore((s) => s.count);        // 선택적 구독
const increment = useStore((s) => s.increment); // 액션만
const { count, name } = useStore();             // 전체 (비권장)
```

### D. React 외부에서 사용

```typescript
useStore.getState().count;        // 상태 읽기
useStore.getState().increment();  // 액션 실행
useStore.setState({ count: 0 });  // 직접 변경
useStore.subscribe(callback);     // 구독
```

---

## 📚 부록: 이 프로젝트의 스토어 파일

이 가이드와 함께 참고할 수 있는 프로젝트 파일들:

- `store/location-store.ts` - persist 미들웨어 예제
- `store/weather-store.ts` - subscribeWithSelector와 computed 값 예제
- `store/index.ts` - 모듈 re-export 패턴

---

*이 가이드를 통해 Zustand의 모든 핵심 개념을 학습하셨습니다. 프로젝트의 `store/` 디렉토리에 있는 실제 코드를 직접 수정해보면서 연습하시면 더 빠르게 익숙해지실 수 있습니다.*
