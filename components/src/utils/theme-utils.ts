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
