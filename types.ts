//Theme Types

export type ThemeColorsType = Record<string, Record<string, any>>;

type ThemeRequireredValues = {
  colors: ThemeColorsType;
};

export type ThemeType = ThemeRequireredValues & Record<string, any>;
