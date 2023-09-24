# react-vario-theme

![npm](https://img.shields.io/npm/v/react-vario-theme)

**react-vario-theme** is a tool for managing themes in React applications. Easily convert a TypeScript theme object into CSS variables and seamlessly switch between multiple themes using the **ThemeVarioProvider** context.

## Features

- 💡 Easily define themes in a TypeScript object
- 🌟 Singular Source of Truth
- 🔄 Instant theme switching
- 🎨 Access theme colors in react using ThemeProvider
- 💫 Supports multiple themes
- 🌈 Seamless Tailwind Integration by automatically generating all theme variables for Tailwind
- 🤖 Built-in TypeScript support for strong typing

## Usage

### 1. Define your theme

Create a TypeScript object with your theme specifications. Colors will always be needed and can contain as many color schemes as you want. **Important:** To make sure that your theme will work as intended use it in its own file, for example theme.ts

```typescript
import { ThemeType } from "react-vario-theme";

export const varoTheme = {
  colors: {
    light: {
      primary: "#007bff",
      text: {
        default: "#6c757d",
        link: "#007bff",
      },
    },
    dark: {
      primary: "#007bff",
      text: {
        default: "#6c757d",
        link: "#007bff",
      },
    },
  },
  padding: {
    sm: "5px",
    md: "10px",
    lg: "20px",
  },
} as const satisfies ThemeType;

```

### 2. Generate css variables
npx react-vario-theme compile "path to your theme object" "path and name of the css/sass file you want to create"
When the css variables are generated they can be used in css or in react using the theme context provider. 
```
npx react-vario-theme compile src/styles/theme.ts src/styles/theme.scss
```
### 3. Optional: Tailwind support
You can get all your theme css variables in tailwind using "tailwindTheme"
```typescript
import { tailwindColors, tailwindTheme } from "react-vario-theme";
import { type Config } from "tailwindcss";
import { varoTheme } from "./src/styles/theme";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: tailwindTheme(varoTheme),
  plugins: [],
} satisfies Config;

```

### 3. Use `VarioThemeProvider`

Wrap your application with the `VarioThemeProvider`.

```jsx
import { varoTheme } from "~/styles/theme";
import { VarioThemeProvider } from 'react-vario-theme';

const App = () => {
  return (
    <VarioThemeProvider theme={varoTheme}>
      <Component {...pageProps} />
    </VarioThemeProvider>
  );
};
```

### 4. Access Theme Variables

You can now access theme variables anywhere within your components.

```jsx
import { varoTheme } from "~/styles/theme";
const MyComponent = () => {
  const { theme, colorScheme, changeColorScheme } =
    useVarioTheme<typeof varoTheme>();
  
  return (
    <button
      style={{ backgroundColor: theme.colors.primary }}
    >
      Click Me
    </button>
  );
};
```

## API

### `VarioThemeProvider`

Props:

- `theme`: The theme object containing key-value pairs of CSS variables.

### `useCustomTheme<T>()`

Returns:

- `theme, colorScheme, changeColorScheme`: An object containing the colors and variables of the theme, strongly typed with TypeScript when using `typeof`. All the variables will be equal to the css variable generated by react-vario-theme compile
