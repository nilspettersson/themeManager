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

function adjustBrightness(hex: string, percent: number): string {
  if (!/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex))
    throw new Error("Invalid hex color code");

  // Convert hex to RGB
  let r = parseInt(hex.slice(1, 3), 16);
  let g = parseInt(hex.slice(3, 5), 16);
  let b = parseInt(hex.slice(5, 7), 16);

  // Convert RGB to HSL
  (r /= 255), (g /= 255), (b /= 255);
  let max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h = (max + min) / 2;
  let s = (max + min) / 2;
  let l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    let d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  // Adjust lightness
  l = l + percent / 100;
  l = Math.min(1, Math.max(0, l));

  // Convert HSL back to RGB
  function hue2rgb(p: number, q: number, t: number) {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  }

  if (s === 0) {
    r = g = b = l;
  } else {
    let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    let p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  // Convert RGB back to hex
  return `#${Math.round(r * 255)
    .toString(16)
    .padStart(2, "0")}${Math.round(g * 255)
    .toString(16)
    .padStart(2, "0")}${Math.round(b * 255)
    .toString(16)
    .padStart(2, "0")}`;
}

export function lighten(hex: string, percent: number): string {
  return adjustBrightness(hex, percent);
}

export function darken(hex: string, percent: number): string {
  return adjustBrightness(hex, -percent);
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
  return output as Record<keyof T["variants"], string> &
    Record<keyof T["additionalColors"], string> & { default: string };
}

export function brightnessVariants<T extends Record<string, number>>(
  color: string,
  variants: T
) {
  const output = [] as any;
  output["default"] = color;
  for (let key in variants)
    output[key] = lighten(color, variants[key] as number);
  return output as Record<keyof T, string> & { default: string };
}
