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

export function darken(hex: string, percent: number): string {
  // Validate the hex string
  if (!/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex))
    throw new Error("Invalid hex color code");

  // Calculate the adjustment value
  const adjust = 1 - percent / 100;

  // Convert shortform hex to longform (e.g., "#FFF" to "#FFFFFF")
  if (hex.length === 4) {
    hex = `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`;
  }

  // Extract the Red, Green, and Blue components from the hex string
  let red = parseInt(hex.slice(1, 3), 16);
  let green = parseInt(hex.slice(3, 5), 16);
  let blue = parseInt(hex.slice(5, 7), 16);

  // Adjust each color component
  red = Math.round(red * adjust);
  green = Math.round(green * adjust);
  blue = Math.round(blue * adjust);

  // Ensure that values are within the valid range [0, 255]
  red = Math.max(0, Math.min(255, red));
  green = Math.max(0, Math.min(255, green));
  blue = Math.max(0, Math.min(255, blue));

  // Convert the RGB components back to a hex string and return it
  return `#${red.toString(16).padStart(2, "0")}${green
    .toString(16)
    .padStart(2, "0")}${blue.toString(16).padStart(2, "0")}`;
}
