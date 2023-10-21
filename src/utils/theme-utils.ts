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

type ReplaceDotWithDash<T extends string> = T extends `${infer A}.${infer B}`
  ? `${A}-${B}`
  : T;
type Flatten<T extends object> = object extends T
  ? object
  : {
      [K in keyof T]-?: (
        x: NonNullable<T[K]> extends infer V
          ? V extends object
            ? V extends readonly any[]
              ? Pick<T, K>
              : Flatten<V> extends infer FV
              ? {
                  [P in keyof FV as `${Extract<K, string | number>}.${Extract<
                    P,
                    string | number
                  >}`]: FV[P];
                }
              : never
            : Pick<T, K>
          : never
      ) => void;
    } extends Record<keyof T, (y: infer O) => void>
  ? O extends infer U
    ? { [K in keyof O]: O[K] }
    : never
  : never;

export function flatten<T extends object, TT extends string>(
  obj: T,
  prefix: TT
) {
  const result: any = {};

  const recurse = (currentObj: any, currentPrefix: string) => {
    for (const key in currentObj) {
      if (Object.hasOwnProperty.call(currentObj, key)) {
        const value = currentObj[key];
        const newPrefix = currentPrefix ? `${currentPrefix}-${key}` : key;
        if (value && typeof value === "object" && !Array.isArray(value)) {
          recurse(value, newPrefix);
        } else {
          result[prefix + newPrefix] = value;
        }
      }
    }
  };
  recurse(obj, "");

  const output = result as Flatten<T>;
  type ColorTypes = keyof typeof output & string;
  type TransformedColorTypes = {
    [Key in ColorTypes as ReplaceDotWithDash<Key>]: string;
  };
  type FlattenType = {
    [Key in keyof TransformedColorTypes as ReplaceDotWithDash<`${typeof prefix}${Key}`>]: string;
  };
  return result as FlattenType;
}
export function flattenColors<T extends object>(obj: T) {
  return flatten(obj, "color-");
}

const componentToHex = (c: number) => {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
};
export const rgbToHex = (r: number, g: number, b: number) => {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
};

export const hexToRgb = (hex: string) => {
  let r = parseInt(hex.slice(1, 3), 16);
  let g = parseInt(hex.slice(3, 5), 16);
  let b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
};

type TupleOf<
  Length extends number,
  ElementType,
  T extends any[] = []
> = T["length"] extends Length
  ? T
  : TupleOf<Length, ElementType, [ElementType, ...T]>;

export const generateColors = <T extends number>(
  hex: string,
  count: T,
  reverse?: boolean
) => {
  if (!/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex))
    throw new Error("Invalid hex color code");

  const rgb = hexToRgb(hex);

  count--;
  let colorArray: string[] = [];
  const max = Math.max(Math.max(rgb.r, Math.max(rgb.g, rgb.b)), 1);
  for (let i = -1; i < count; i++) {
    const stepMult = i + 1;
    let step = 255 / (max * count);
    let rValue = rgb.r * step * stepMult;
    let gValue = rgb.g * step * stepMult;
    let bValue = rgb.b * step * stepMult;
    colorArray.push(
      rgbToHex(Math.round(rValue), Math.round(gValue), Math.round(bValue))
    );
  }
  return reverse ? colorArray.reverse() : (colorArray as TupleOf<T, string>);
};
