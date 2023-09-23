import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { ThemeType } from "./types";
import { tailwindTheme } from "./utils/tailwind";

function convertTocssVars(theme: any) {
  const colors = { ...theme.colors.light } as any;
  let convertedColors = {} as any;

  for (const key in colors) {
    convertedColors[key] = "var(--color-" + key + ")";
  }
  return convertedColors;
}

function useThemeContext<T extends ThemeType>(theme: ThemeType) {
  type Colors = keyof T["colors"];
  const [colorScheme, setColorScheme] = useState<string>("light");

  const themeWithoutColors = tailwindTheme(theme) as any;
  themeWithoutColors.colors = undefined;

  const colors = convertTocssVars(theme) as Record<
    keyof T["colors"]["light"],
    string
  >;

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", colorScheme);
  }, [colorScheme]);

  return {
    theme: {
      colors: colors,
      vars: themeWithoutColors as Omit<T, "colors">,
    },
    colorScheme,
    changeColorScheme: (scheme: Colors) => setColorScheme(scheme as string),
  };
}

const ThemeContext = createContext<ReturnType<typeof useThemeContext>>(
  {} as never
);

export function VarioThemeProvider<T extends ThemeType>({
  theme,
  children,
}: {
  theme: T;
  children: ReactNode;
}) {
  const ctx = useThemeContext<typeof theme>(theme);
  return <ThemeContext.Provider value={ctx}>{children}</ThemeContext.Provider>;
}

export function useVarioTheme<T extends ThemeType>() {
  return useContext(ThemeContext) as ReturnType<typeof useThemeContext<T>>;
}
