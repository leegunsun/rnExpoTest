# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Weather Time Machine** React Native application built with Expo SDK 54. The app compares today's weather with last year's weather on the same date, displaying the comparison with dynamic gradients and visual indicators.

**Key Technologies**:
- Expo Router 6.0 with file-based routing and typed routes
- React Query (TanStack Query) v5 for data fetching and caching
- Axios for HTTP client with interceptors
- React Native Reanimated 4.1 for animations
- Expo Location for geolocation services
- React 19.1.0 with experimental React Compiler enabled
- New Architecture enabled (newArchEnabled: true)

## Development Commands

### Starting the App
```bash
# Start development server
npm start
# or
npx expo start

# Platform-specific launch
npm run android   # Start on Android emulator
npm run ios       # Start on iOS simulator
npm run web       # Start web version
```

### Code Quality
```bash
npm run lint          # Run ESLint using expo lint command
npx tsc --noEmit      # Run TypeScript type checking
```

### Project Reset
```bash
npm run reset-project   # Interactive script to create fresh /app directory
```

## Architecture & File Structure

### Application Architecture

The app follows a **feature-based architecture** with distinct layers:

1. **Features Layer** (`features/`): Feature modules with screens, components, services, and types
   - Each feature is self-contained with its own screens, components, services, and types
   - Currently unused but structure is ready for multi-screen expansion

2. **Data Layer** (`api/`, `services/`): Data fetching and state management
   - `api/`: React Query + Axios integration for general API calls
   - `services/`: Domain-specific services (e.g., weather service with mock data)

3. **UI Layer** (`components/`): Reusable UI components
   - `components/ui/`: Generic UI components (gradients, skeletons, icons)
   - `components/weather/`: Weather-specific components (cards, indicators, headers)

4. **Cross-Cutting** (`hooks/`, `utils/`, `constants/`, `types/`): Shared utilities

### Routing Architecture

The app uses **Expo Router file-based routing** with a simplified single-screen structure:

- **Root Layout** (`app/_layout.tsx`): Wraps app with React Query's QueryClientProvider and ThemeProvider
- **Main Screen** (`app/index.tsx`): Single weather comparison screen (no tabs)

**Important**: The app currently has a single-screen layout showing weather comparison. The tab-based navigation mentioned in legacy docs has been removed.

### Data Fetching Architecture

**React Query Integration** (`api/`):
- **Query Client** (`api/query-client.ts`): Configured with React Native network status integration via NetInfo
- **Axios Client** (`api/client.ts`): HTTP client with request/response interceptors and auth token management
- **Query Hooks** (`api/queries/`): Custom hooks for specific API resources (users, posts)
- **Default Options**: 1min staleTime, 5min gcTime, 2 retries, refetch on reconnect

**Weather Service Pattern** (`services/weather-service.ts`):
- Abstraction layer for weather data fetching
- Currently uses **mock data** (configurable via `useMockData: true`)
- Ready for real API integration (OpenWeatherMap, WeatherAPI, or Korean Met Admin)
- Service singleton pattern with updateable configuration

**Custom Hooks**:
- `use-weather-comparison.ts`: Manages weather data fetching with loading/refresh states (manual fetch, not using React Query)
- `use-location.ts`: Handles location permissions and geolocation with fallback to Seoul coordinates

### Component Organization

**Weather Components** (`components/weather/`):
- `LocationHeader.tsx`: Shows location, date, and refresh button
- `WeatherCard.tsx`: Individual weather card for today/last year
- `ComparisonCard.tsx`: Main comparison card showing both weather cards
- `ComparisonIndicator.tsx`: Visual temperature difference indicator (arrow, color, text)
- `WeatherDetails.tsx`: Additional weather info (humidity, wind, AQI)

**UI Components** (`components/ui/`):
- `GradientBackground.tsx`: Dynamic gradient background based on temperature
- `LoadingSkeleton.tsx`: Skeleton loading state component
- `Collapsible.tsx`: Collapsible section component
- `icon-symbol.tsx` / `icon-symbol.ios.tsx`: Platform-specific icon implementations

**Themed Components** (`components/`):
- `themed-text.tsx`, `themed-view.tsx`: Auto-switch between light/dark themes
- `parallax-scroll-view.tsx`: Reusable scroll view with parallax header effect
- `external-link.tsx`: Opens links in browser with expo-web-browser
- `haptic-tab.tsx`: Tab bar item with haptic feedback
- `hello-wave.tsx`: Animated wave component using Reanimated

### Theming System

**Theme Configuration**:
- `constants/theme.ts`: General app theme with Colors and Fonts (light/dark schemes)
- `constants/weather-theme.ts`: Weather-specific theme with temperature-based colors
  - Warmer: #FF6B6B → #FF8787
  - Colder: #4ECDC4 → #44A39F
  - Similar: #95A5A6 → #7F8C8D

**Color Scheme Hooks** (`hooks/`):
- `use-color-scheme.ts`: Re-exports React Native's useColorScheme for native
- `use-color-scheme.web.ts`: Web-specific implementation with localStorage persistence
- `use-theme-color.ts`: Hook to retrieve theme-specific colors from Constants

### Utilities & Types

**Utilities** (`utils/`):
- `temperature-utils.ts`: Temperature calculations and conversions
- `date-utils.ts`: Date formatting and manipulation

**Types** (`types/`):
- `weather.ts`: Weather-specific TypeScript type definitions (WeatherData, WeatherComparison, WeatherCondition, etc.)
- `api/types.ts`: API-related types (User, Post, PaginatedResponse, etc.)

### Path Aliases
TypeScript is configured with `@/*` alias mapping to project root:
```typescript
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { weatherService } from '@/services/weather-service';
import { useWeatherComparison } from '@/hooks/use-weather-comparison';
```

## Expo Configuration

### App Settings (`app.json`)
- **Name**: "Weather Time Machine"
- **Scheme**: `myapp://` for deep linking
- **New Architecture**: Enabled
- **Typed Routes**: Enabled for type-safe navigation
- **React Compiler**: Experimental React Compiler enabled
- **Location Permissions**: Configured for iOS and Android with user-facing descriptions in Korean
- **Splash Screen**: Custom splash with temperature-based gradient background

## Development Guidelines

### Data Fetching Patterns

**When to use React Query** (for REST APIs):
- Use for external API calls (JSONPlaceholder example in `api/queries/`)
- Automatic caching, refetching, and network status handling
- See `api/README.md` for comprehensive guide

**When to use Custom Hooks** (for complex domain logic):
- Use for domain-specific data that needs custom logic (e.g., `use-weather-comparison`)
- When you need manual control over fetch timing and state
- Current weather service uses this pattern but could be migrated to React Query

### Weather Service Integration

**Current Setup**: Mock data mode enabled
```typescript
// services/weather-service.ts
export const weatherService = new WeatherService({ useMockData: true });
```

**To switch to real API**:
1. Implement API calls in `WeatherService` class (commented examples provided)
2. Update configuration:
```typescript
weatherService.updateConfig({
  useMockData: false,
  apiKey: 'YOUR_API_KEY',
  baseUrl: 'https://api.openweathermap.org/data/2.5'
});
```

**Recommended APIs**:
- OpenWeatherMap: `/data/2.5/weather` (current), `/data/2.5/onecall/timemachine` (historical)
- WeatherAPI: `/v1/current.json`, `/v1/history.json`
- Korean Met Admin (기상청): https://data.go.kr

### Adding New Features

**For new API endpoints**:
1. Define types in `api/types.ts`
2. Create query hook in `api/queries/`
3. Follow query key factory pattern (see `api/README.md`)

**For new screens**:
1. Create feature module in `features/[feature-name]/`
2. Add screen to `app/` directory (file-based routing)
3. Update `app/_layout.tsx` if navigation changes needed

**For new weather features**:
1. Add types to `types/weather.ts`
2. Extend `WeatherService` interface in `services/weather-service.ts`
3. Create custom hook if needed in `hooks/`
4. Update mock data in `services/mock-weather-data.ts` for testing

### Platform-Specific Code
- Create `.web.tsx` / `.ios.tsx` / `.android.tsx` variants for platform-specific implementations
- Metro bundler automatically selects the correct file
- Fallback to base file if platform-specific version doesn't exist

### React 19 & New Architecture
- Use hooks and functional components (class components discouraged)
- React Compiler optimizes re-renders automatically
- New Architecture enables concurrent features and better performance
- Be aware of React 19 breaking changes if updating dependencies
