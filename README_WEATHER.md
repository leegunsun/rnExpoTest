# Weather Time Machine 🌤️⏰

오늘 날씨와 작년 같은 날 날씨를 비교하는 React Native 앱입니다.

## 📱 주요 기능

- ✅ 오늘 날씨와 작년 같은 날 날씨 비교
- ✅ 온도 차이를 시각적으로 표시 (색상, 화살표, 숫자)
- ✅ Pull-to-refresh로 데이터 새로고침
- ✅ 위치 자동 감지 (권한 거부 시 서울 기본값)
- ✅ 동적 그라데이션 배경 (온도 비교에 따라 변경)
- ✅ 날씨 상세 정보 (습도, 바람, 미세먼지)

## 🏗️ 프로젝트 구조

```
app/
  index.tsx              # 메인 화면 (단일 화면)
  _layout.tsx            # 앱 레이아웃

components/
  ui/
    GradientBackground.tsx   # 동적 배경
    LoadingSkeleton.tsx      # 로딩 스켈레톤
  weather/
    LocationHeader.tsx       # 위치/날짜 헤더
    WeatherCard.tsx          # 개별 날씨 카드
    ComparisonIndicator.tsx  # 온도 차이 인디케이터
    ComparisonCard.tsx       # 메인 비교 카드
    WeatherDetails.tsx       # 상세 정보

hooks/
  use-location.ts           # 위치 권한 및 위치 정보
  use-weather-comparison.ts # 날씨 비교 데이터

services/
  mock-weather-data.ts      # Mock 데이터
  weather-service.ts        # API 인터페이스 (준비됨)

utils/
  temperature-utils.ts      # 온도 계산/변환
  date-utils.ts            # 날짜 포맷팅

constants/
  weather-theme.ts         # 날씨 전용 테마

types/
  weather.ts              # TypeScript 타입 정의
```

## 🚀 시작하기

### 1. 의존성 설치
```bash
npm install
```

### 2. 개발 서버 시작
```bash
npm start
# 또는
npx expo start
```

### 3. 플랫폼별 실행
```bash
npm run ios      # iOS 시뮬레이터
npm run android  # Android 에뮬레이터
npm run web      # 웹 브라우저
```

## 🔧 기술 스택

- **React Native**: 0.81.5
- **Expo SDK**: 54
- **React**: 19.1.0
- **Expo Router**: 6.0 (파일 기반 라우팅)
- **React Native Reanimated**: 4.1 (애니메이션)
- **Expo Location**: 위치 서비스
- **Expo Linear Gradient**: 그라데이션 배경
- **TypeScript**: 5.9.2

## 📦 설치된 패키지

```json
{
  "expo-location": "위치 권한 및 위치 정보",
  "expo-linear-gradient": "그라데이션 배경",
  "react-native-reanimated": "부드러운 애니메이션",
  "expo-router": "파일 기반 라우팅"
}
```

## 🎨 디자인 시스템

### 색상 테마
- **따뜻함** (작년보다 따뜻): #FF6B6B → #FF8787
- **추움** (작년보다 추움): #4ECDC4 → #44A39F
- **비슷함** (±2°C): #95A5A6 → #7F8C8D

### 날씨 아이콘
- ☀️ 맑음 (sunny)
- ☁️ 흐림 (cloudy)
- 🌧️ 비 (rainy)
- ❄️ 눈 (snowy)

## 🔌 API 연동 준비

현재는 Mock 데이터를 사용하고 있습니다. 실제 API로 전환하려면:

### 1. `services/weather-service.ts` 수정

```typescript
weatherService.updateConfig({
  useMockData: false,
  apiKey: 'YOUR_API_KEY',
  baseUrl: 'https://api.openweathermap.org/data/2.5'
});
```

### 2. 권장 API 서비스

1. **OpenWeatherMap** (https://openweathermap.org/api)
   - 현재 날씨: `/data/2.5/weather`
   - 과거 데이터: `/data/2.5/onecall/timemachine`

2. **WeatherAPI** (https://www.weatherapi.com/)
   - 현재: `/v1/current.json`
   - 과거: `/v1/history.json`

3. **기상청 공공 API** (https://data.go.kr)
   - 단기예보, 중기예보, 과거 기상 데이터

### 3. API 인터페이스

`services/weather-service.ts` 파일에 실제 API 호출 로직을 구현하면 됩니다. 인터페이스는 이미 정의되어 있습니다:

```typescript
interface WeatherAPI {
  getCurrentWeather(lat: number, lon: number): Promise<WeatherData>;
  getHistoricalWeather(lat: number, lon: number, date: string): Promise<WeatherData>;
}
```

## 📱 권한 설정

### iOS
`app.json`에 이미 설정되어 있습니다:
```json
{
  "ios": {
    "infoPlist": {
      "NSLocationWhenInUseUsageDescription": "이 앱은 현재 위치의 날씨 정보를 제공하기 위해 위치 권한이 필요합니다."
    }
  }
}
```

### Android
`app.json`에 이미 설정되어 있습니다:
```json
{
  "android": {
    "permissions": [
      "ACCESS_COARSE_LOCATION",
      "ACCESS_FINE_LOCATION"
    ]
  }
}
```

## 🧪 테스트

```bash
npm run lint     # ESLint 검사
npx tsc --noEmit # TypeScript 타입 검사
```

## 🎯 향후 개선 사항

### Phase 2 - 향상
- [ ] Reanimated 애니메이션 추가
- [ ] 로컬 스토리지 캐싱
- [ ] 에러 처리 개선
- [ ] 성능 최적화

### 추가 기능 아이디어
- [ ] 주간 날씨 비교
- [ ] 날씨 알림
- [ ] 위젯 지원
- [ ] 다국어 지원
- [ ] 다크모드 최적화

## 📝 개발 노트

### Mock 데이터 시나리오
`services/mock-weather-data.ts`에 세 가지 시나리오가 준비되어 있습니다:
- `warmer`: 작년보다 따뜻한 날씨
- `colder`: 작년보다 추운 날씨
- `similar`: 작년과 비슷한 날씨

### 온도 비교 로직
- 차이 ≤ 2°C: 비슷함
- 차이 > 2°C: 따뜻함 또는 추움

## 🐛 문제 해결

### 위치 권한이 작동하지 않는 경우
1. 앱을 완전히 종료하고 재시작
2. 기기 설정에서 위치 권한 확인
3. 개발 중에는 시뮬레이터/에뮬레이터 위치 설정 확인

### 데이터가 로드되지 않는 경우
1. Pull-to-refresh로 새로고침
2. 네트워크 연결 확인
3. Mock 데이터 사용 여부 확인 (`useMockData: true`)

## 📄 라이선스

MIT License

## 👥 개발자

Weather Time Machine Team
