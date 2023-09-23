# react-vario-theme

![npm](https://img.shields.io/npm/v/react-vario-theme)

**react-vario-theme** is a tool for managing themes in React applications. Easily convert a TypeScript theme object into CSS variables and seamlessly switch between multiple themes using the **ThemeVarioProvider** context.

## Features

- 💡 Easily define themes in a TypeScript object
- 🔄 Instant theme switching
- 🎨 Access theme colors in react using ThemeProvider
- 💫 Supports multiple themes
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

### 2. Use `ThemeProvider`

Wrap your application with the `ThemeProvider`.

```jsx
import { ThemeProvider } from 'react-vario-theme';

const App = () => {
  return (
    <ThemeProvider theme={varoTheme}>
      <Component {...pageProps} />
    </ThemeProvider>
  );
};
```

### 3. Access Theme Variables

You can now access theme variables anywhere within your components.

```jsx
import { useCustomTheme } from 'react-vario-theme';

const MyComponent = () => {
  const { customTheme } = useCustomTheme<typeof lightTheme>();
  
  return (
    <button
      style={{ backgroundColor: customTheme.colors.primary }}
    >
      Click Me
    </button>
  );
};
```

## API

### `ThemeProvider`

Props:

- `theme`: The theme object containing key-value pairs of CSS variables.
- `initialTheme`: Optionally set the initial theme during the first render.

### `useCustomTheme<T>()`

Returns:

- `customTheme`: An object containing the colors and variables of the theme, strongly typed with TypeScript when using `typeof`.
