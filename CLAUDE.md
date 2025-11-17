# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React Native application built with Expo SDK 54 using the new Expo Router for file-based routing. The project uses React 19.1.0 and React Native 0.81.5 with TypeScript, supporting iOS, Android, and web platforms.

**Key Technologies**:
- Expo Router 6.0 with file-based routing and typed routes
- React Navigation 7.x for bottom tabs and navigation
- React Native Reanimated 4.1 for animations
- React 19 with experimental React Compiler enabled
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
npm run lint      # Run ESLint using expo lint command
```

### Project Reset
```bash
npm run reset-project   # Interactive script to create fresh /app directory
                        # Moves or deletes existing app/components/hooks/constants/scripts
```

## Architecture & File Structure

### Routing Architecture
The app uses **Expo Router file-based routing** with a tab-based navigation structure:

- **Root Layout** (`app/_layout.tsx`): ThemeProvider with Stack navigator, anchor set to '(tabs)'
- **Tab Group** (`app/(tabs)/`): Directory with parentheses creates route group without affecting URL
  - `_layout.tsx`: Tab navigator configuration
  - `index.tsx`: Home/first tab screen
  - `explore.tsx`: Second tab screen
- **Modal** (`app/modal.tsx`): Modal presentation screen accessible from anywhere

**Important**: The `unstable_settings.anchor = '(tabs)'` in root layout sets the initial route to the tabs group.

### Component Organization

**Themed Components** (`components/`):
- `themed-text.tsx`, `themed-view.tsx`: Auto-switch between light/dark themes using `@/constants/theme.ts` Colors
- `parallax-scroll-view.tsx`: Reusable scroll view with parallax header effect
- `external-link.tsx`: Opens links in browser with expo-web-browser
- `haptic-tab.tsx`: Tab bar item with haptic feedback
- `hello-wave.tsx`: Animated wave component using Reanimated

**UI Components** (`components/ui/`):
- `collapsible.tsx`: Collapsible section component
- `icon-symbol.tsx` / `icon-symbol.ios.tsx`: Platform-specific icon implementations (iOS uses SF Symbols via expo-symbols)

### Theming System

**Theme Configuration** (`constants/theme.ts`):
- `Colors` object with `light` and `dark` color schemes
- `Fonts` object with platform-specific font families (iOS, web, default)
- Supports system font families: sans, serif, rounded, mono

**Color Scheme Hooks** (`hooks/`):
- `use-color-scheme.ts`: Re-exports React Native's useColorScheme for native
- `use-color-scheme.web.ts`: Web-specific implementation with localStorage persistence
- `use-theme-color.ts`: Hook to retrieve theme-specific colors from Constants

**Platform-Specific Files**: Use `.web.ts` or `.ios.tsx` extensions for platform-specific implementations. Expo Router automatically selects the correct file.

### Path Aliases
TypeScript is configured with `@/*` alias mapping to project root:
```typescript
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
```

## Expo Configuration

### App Settings (`app.json`)
- **Scheme**: `myapp://` for deep linking
- **New Architecture**: Enabled (React Native's new architecture)
- **Typed Routes**: Enabled for type-safe navigation
- **React Compiler**: Experimental React Compiler enabled
- **Edge-to-Edge**: Android edge-to-edge display enabled
- **Predictive Back**: Disabled on Android (predictiveBackGestureEnabled: false)

### Assets
- Icons and splash screens in `assets/images/`
- Separate Android adaptive icon assets (foreground, background, monochrome)
- Dark mode splash screen configured

## Development Guidelines

### File-Based Routing
- Files in `app/` directory automatically become routes
- Use `(directory)` for route groups that don't affect the URL path
- `_layout.tsx` files define layouts for their directory level
- Index files (`index.tsx`) serve as the default route for their directory

### Adding New Screens
1. Create `.tsx` file in `app/` or nested directories
2. Use `_layout.tsx` to configure navigation for that level
3. For tabs, add to `app/(tabs)/` directory
4. For modals or stacks, configure in parent `_layout.tsx`

### Theming
- Always use themed components (`ThemedText`, `ThemedView`) or `useThemeColor` hook
- Define new colors in `constants/theme.ts` under both `light` and `dark` schemes
- The app automatically responds to system color scheme changes

### Platform-Specific Code
- Create `.web.tsx` / `.ios.tsx` / `.android.tsx` variants for platform-specific implementations
- Metro bundler automatically selects the correct file
- Fallback to base file if platform-specific version doesn't exist

### React 19 & New Architecture
- Use hooks and functional components (class components discouraged)
- React Compiler optimizes re-renders automatically
- New Architecture enables concurrent features and better performance
