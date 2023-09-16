#!/usr/bin/env node

import fs from "fs";
import ts from "typescript";

export const themeCreator = () => {
  let tsFilename = "";
  let cssFilename = "";
  if (process.argv.length >= 3) {
    tsFilename = process.argv[2];
    if (process.argv.length >= 4) {
      cssFilename = process.argv[3];
    }
  }
  fs.readFile(tsFilename, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    const result = ts.transpileModule(data, {
      compilerOptions: {
        target: ts.ScriptTarget.ES2015,
        module: ts.ModuleKind.CommonJS,
      },
    });

    if (result.diagnostics && result.diagnostics.length > 0) {
      // Handle any compilation errors here.
      console.error(result.diagnostics);
      throw new Error("TypeScript compilation failed.");
    }

    const themeObject = eval(result.outputText);
    console.log(themeObject);

    const themeColors = { ...themeObject.colors };
    themeObject.colors = undefined;

    let index = 0;
    let allThemeColors: Array<string> = [];
    let rootColors = "";
    let sassVariables = "";
    for (const key in themeColors) {
      const themeColor = themeColors[key];

      console.log("themeColors", themeColor);

      const colorlist = getValuesInobjectRecursive("color", themeColor);
      let colors = "";
      let sassColors = "";
      colorlist.forEach((color) => {
        colors += "--" + color.key + ": " + color.value + ";\n";
        sassColors += "$" + color.key + ": var(--" + color.key + ");\n";
      });

      //First theme should be used in root
      if (index === 0) {
        rootColors = colors;
        sassVariables = sassColors;
      }

      allThemeColors.push(
        "html[data-theme='" + key + "'] { \n" + colors + "}\n"
      );

      index++;
    }

    const values = getValuesInobjectRecursive("", themeObject);
    let cssVariables = "";
    cssVariables += sassVariables;
    values.forEach(
      (color) =>
        (cssVariables += "$" + color.key + ": var(--" + color.key + ");\n")
    );

    cssVariables += ":root { \n";
    cssVariables += rootColors + "\n";
    values.forEach(
      (color) => (cssVariables += "--" + color.key + ": " + color.value + ";\n")
    );

    cssVariables += "}\n";

    allThemeColors.forEach((item) => (cssVariables += item));

    fs.writeFile(cssFilename, cssVariables, (err) => {
      if (err) {
        console.error(err);
      }
      // file written successfully
    });
  });
};

function cssVariable(root: string, key: string, value: string) {
  if (root !== "") {
    return "--" + root + "-" + key + ": " + value;
  }
  return "--" + key + ": " + value;
}

function getValuesInobjectRecursive(root: string, object: any) {
  const values: Array<{ key: string; value: string }> = [];
  for (const key in object) {
    const value = object[key];
    if (typeof value === "string") {
      if (root !== "") {
        values.push({ key: root + "-" + key, value: value });
      } else {
        values.push({ key: root + key, value: value });
      }

      continue;
    } else if (typeof value === "object") {
      const innerValues = getValuesInobjectRecursive(
        root + (root !== "" ? "-" : "") + key,
        value
      );
      values.push(...innerValues);
    }
  }
  return values;
}

themeCreator();

//Theme Types
type ThemeRequireredValues = {
  colors: Record<string, Record<string, any>>;
};

export type ThemeCreatorType = ThemeRequireredValues & Record<string, any>;
