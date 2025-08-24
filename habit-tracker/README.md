# Habit Tracker (Expo + NativeWind)

Friendly, wellness-focused habit tracker with pastel gradients, rounded cards, and airy spacing.

## Features
- Welcome, Dashboard, Add Habit screens
- Gradient CTA button and circular progress ring
- Tailwind (NativeWind) styling with custom palette
- Icons via `@expo/vector-icons`

## Tech Stack
- Expo
- NativeWind (Tailwind for React Native)
- `expo-linear-gradient`
- `react-native-svg`
- `@expo/vector-icons`
- React Navigation (bottom tabs)

## Setup

1) Create a new Expo project (TypeScript template):
```bash
npx create-expo-app@latest habit-tracker --template
# Choose: Blank (TypeScript)
cd habit-tracker
```

2) Install UI dependencies:
```bash
npm i nativewind @expo/vector-icons @react-navigation/native @react-navigation/bottom-tabs
expo install tailwindcss react-native-svg expo-linear-gradient react-native-screens react-native-safe-area-context react-native-gesture-handler
```

3) Configure Tailwind (NativeWind):
- Create `tailwind.config.js` at the project root and paste the one from this repo's `habit-tracker/tailwind.config.js`.
- Add the Babel plugin by creating `babel.config.js` (or merging into your existing one):
```js
module.exports = function (api) {
  api.cache(true);
  return { presets: ["babel-preset-expo"], plugins: ["nativewind/babel"] };
};
```

4) TypeScript config (optional, for better `className` typings):
- In `tsconfig.json` add:
```json
{
  "compilerOptions": {
    "types": ["nativewind/types"]
  }
}
```

5) Copy source files:
- Replace your generated `App.tsx` with `habit-tracker/App.tsx` from this repo
- Copy the `src/` folder (`components`, `screens`, `theme`)

6) Run the app:
```bash
npm start
# Press 'i' for iOS simulator or 'a' for Android emulator, or scan QR with Expo Go
```

## Design
- Palette
  - primaryBlue `#3B6AFF`
  - gradientPink `#F093FB`
  - gradientBlue `#6FD6FF`
  - white `#FFFFFF`
  - lightBlue `#D6ECFF`
  - navy `#1E2A4A`
  - softPink `#FFB7D5`
- Gradients
  - Top: linear-gradient(180deg, `#F093FB` 0%, `#6FD6FF` 100%)
  - Button: linear-gradient(90deg, `#3B6AFF` 0%, `#6FD6FF` 100%)
- Rounded corners: 16–24px (`rounded-2xl`, `rounded-3xl`)

## Notes
- This project is frontend-only; no backend required
- Uses system sans by default; swap to Inter (via `expo-google-fonts`) if desired







