type CountMap = {
  1: ["1"];
  2: ["1", "2"];
  3: ["1", "2", "3"];
  4: ["1", "2", "3", "4"];
  5: ["1", "2", "3", "4", "5"];
  6: ["1", "2", "3", "4", "5", "6"];
  7: ["1", "2", "3", "4", "5", "6", "7"];
  8: ["1", "2", "3", "4", "5", "6", "7", "8"];
  9: ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
  10: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
};

type GenerateValuesReturn<Count extends keyof CountMap> = {
  [K in CountMap[Count][number]]: string;
};

export function generateValues<Count extends keyof CountMap>(
  value: number,
  multiplier: number,
  text: string,
  count: Count
): GenerateValuesReturn<Count> {
  const values: Partial<GenerateValuesReturn<Count>> = {};

  for (let i = 0; i < +count; i++) {
    values[`${i + 1}` as CountMap[Count][number]] =
      value * Math.pow(multiplier, i) + text;
  }

  return values as GenerateValuesReturn<Count>;
}

export function lighten(hex: string, percent: number): string {
  if (!/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex))
    throw new Error("Invalid hex color code");
  const adjust = 1 + percent / 100;

  if (hex.length === 4) {
    hex = `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`;
  }

  let red = parseInt(hex.slice(1, 3), 16);
  let green = parseInt(hex.slice(3, 5), 16);
  let blue = parseInt(hex.slice(5, 7), 16);

  red = Math.round(red * adjust);
  green = Math.round(green * adjust);
  blue = Math.round(blue * adjust);

  red = Math.max(0, Math.min(255, red));
  green = Math.max(0, Math.min(255, green));
  blue = Math.max(0, Math.min(255, blue));

  return `#${red.toString(16).padStart(2, "0")}${green
    .toString(16)
    .padStart(2, "0")}${blue.toString(16).padStart(2, "0")}`;
}

export function darken(hex: string, percent: number): string {
  if (!/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex))
    throw new Error("Invalid hex color code");

  const adjust = 1 - percent / 100;
  if (hex.length === 4) {
    hex = `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`;
  }

  let red = parseInt(hex.slice(1, 3), 16);
  let green = parseInt(hex.slice(3, 5), 16);
  let blue = parseInt(hex.slice(5, 7), 16);

  red = Math.round(red * adjust);
  green = Math.round(green * adjust);
  blue = Math.round(blue * adjust);

  red = Math.max(0, Math.min(255, red));
  green = Math.max(0, Math.min(255, green));
  blue = Math.max(0, Math.min(255, blue));

  return `#${red.toString(16).padStart(2, "0")}${green
    .toString(16)
    .padStart(2, "0")}${blue.toString(16).padStart(2, "0")}`;
}

export function colorVariants<
  T extends {
    color: string;
    variants: Record<string, number>;
    additionalColors?: Record<string, string>;
  }
>(input: T) {
  const { color, variants, additionalColors } = input;
  const output: Record<string, string> = { default: color };
  output["default"] = color;

  for (let key in variants)
    output[key] = lighten(color, variants[key] as number);

  for (const key in additionalColors) {
    output[key] = additionalColors[key] as string;
  }
  return output as Record<string, string> &
    T["variants"] &
    T["additionalColors"];
}

export function brightnessVariants<T extends Record<string, number>>(
  color: string,
  variants: T
) {
  const output = [] as any;
  output["default"] = color;
  for (let key in variants)
    output[key] = lighten(color, variants[key] as number);
  return output as T & { default: string };
}
