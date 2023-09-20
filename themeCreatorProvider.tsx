import { ReactNode, createContext, useContext, useState } from "react";
import { ThemeType } from "./types";

function useThemeContext<T extends ThemeType>(theme: ThemeType) {
  type Colors = keyof T["colors"];
  const [colorScheme, setColorScheme] = useState<Colors & "light">("light");

  const themeWithoutColors = { ...theme } as any;
  themeWithoutColors.colors = undefined;
  return {
    customTheme: {
      colors: theme.colors[colorScheme] as T["colors"]["light"],
      vars: themeWithoutColors as Omit<T, "colors">,
    },
  };
}

const ThemeContext = createContext<ReturnType<typeof useThemeContext>>(
  {} as never
);

export function ThemeProvider<T extends ThemeType>({
  theme,
  children,
}: {
  theme: ThemeType;
  children: ReactNode;
}) {
  const ctx = useThemeContext<T>(theme);
  return <ThemeContext.Provider value={ctx}>{children}</ThemeContext.Provider>;
}

export function useCustomTheme<T extends ThemeType>() {
  return useContext(ThemeContext) as ReturnType<typeof useThemeContext<T>>;
}
