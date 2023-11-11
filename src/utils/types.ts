//Theme Types
export type ThemeRequireredValues = {
  colors: { light: Record<string, any> } & {
    [key: string]: Record<string, any>;
  };
};

export type ThemeType = ThemeRequireredValues & Record<string, any>;
