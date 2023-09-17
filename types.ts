//Theme Types

export type ThemeColorsType = Record<string, Record<string, any>>;

type ThemeRequireredValues = {
  colors: ThemeColorsType;
};

export type ThemeCreatorType = ThemeRequireredValues & Record<string, any>;
