//Theme Types
type ThemeRequireredValues = {
  colors: Record<string, Record<string, any>>;
};

export * from "./themeCreatorProvider";

export type ThemeCreatorType = ThemeRequireredValues & Record<string, any>;
