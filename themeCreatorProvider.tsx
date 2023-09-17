import React, { createContext, useContext, useState } from "react";
import { PropsWithChildren } from "react"; // Import PropsWithChildren separately
import { ThemeColorsType, ThemeCreatorType } from "./types";

function useThemeContext<T extends ThemeCreatorType>(theme: ThemeCreatorType) {
  type Colors = keyof T["colors"];
  const [colorScheme, setColorScheme] = useState<Colors & "light">("light");

  const themeWithoutColors = { ...theme } as any;
  themeWithoutColors.colors = undefined;
  return {
    customTheme: {
      colors: theme.colors[colorScheme] as T["colors"]["light"],
      vars: themeWithoutColors as Omit<T, "colors">,
    },
    //customTheme: theme as Omit<T, "colors">,
    //themeColors: theme.colors[colorScheme] as T["colors"]["light"],
  };
}

const ThemeContext = createContext<ReturnType<typeof useThemeContext>>(
  {} as never
);

export function ThemeProvider<T extends ThemeCreatorType>({
  children,
}: PropsWithChildren) {
  const ctx = useThemeContext<T>({ colors: {} }); // Pass the generic type T

  return <ThemeContext.Provider value={ctx}>{children}</ThemeContext.Provider>;
}

export function useCustomTheme<T extends ThemeCreatorType>() {
  return useContext(ThemeContext) as ReturnType<typeof useThemeContext<T>>;
}
