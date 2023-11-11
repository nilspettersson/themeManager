import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { tailwindTheme } from "../utils/tailwind";
import { ThemeType } from "../utils/types";

function convertTocssVars(theme: any) {
  const key = Object.keys(theme.colors)[0];
  return getValuesInobjectRecursive("color", { ...theme.colors[key ?? ""] });
}

function getValuesInobjectRecursive(root: string, object: any) {
  for (const key in object) {
    const value = object[key];
    if (typeof value === "string") {
      if (root !== "") {
        object[key] = "var(--" + root + "-" + key + ")";
      } else {
        object[key] = "var(" + root + key + ")";
      }

      continue;
    } else if (typeof value === "object") {
      object[key] = getValuesInobjectRecursive(
        root + (root !== "" ? "-" : "") + key,
        value
      );
    }
  }
  return object;
}

function useThemeContext<T extends ThemeType>(theme: ThemeType) {
  type Colors = keyof T["colors"];
  const [colorScheme, setColorScheme] = useState<string>("light");

  const themeWithoutColors = tailwindTheme(theme) as any;
  themeWithoutColors.colors = undefined;

  const colors = convertTocssVars(theme) as T["colors"]["light"];

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", colorScheme);
  }, [colorScheme]);

  return {
    theme: {
      ...(themeWithoutColors as Omit<T, "colors">),
      colors: colors,
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

export function createVarioTheme<T extends ThemeType>(theme: T) {
  return {
    useVarioTheme: function useVarioTheme<T extends ThemeType>() {
      return useContext(ThemeContext) as ReturnType<typeof useThemeContext<T>>;
    },
    VarioThemeProvider: function VarioThemeProvider({
      children,
    }: {
      children: ReactNode;
    }) {
      const ctx = useThemeContext<typeof theme>(theme);
      return (
        <ThemeContext.Provider value={ctx}>{children}</ThemeContext.Provider>
      );
    },
  };
}
