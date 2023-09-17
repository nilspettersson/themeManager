//Theme Types
type ThemeRequireredValues = {
  colors: Record<string, Record<string, any>>;
};

export type ThemeCreatorType = ThemeRequireredValues & Record<string, any>;
