#!/usr/bin/env node

import fs from "fs";
import ts from "typescript";
import chokidar from "chokidar";

process.on("uncaughtException", (err, origin) => {
  console.error("Caught exception:", err, "Exception origin:", origin);
});

let tsFilename = "";
let cssFilename = "";
let sass = false;
let watch = false;

if (process.argv.includes("--watch")) {
  watch = true;
}

if (process.argv.length >= 5) {
  tsFilename = process.argv[3];
  cssFilename = process.argv[4];
  for (let i = 5; i < process.argv.length; i++) {
    if (process.argv[i] == "sass") {
      sass = true;
    }
  }
} else throw "Missing arguments";

if (!watch) {
  themeCreator(tsFilename, cssFilename, sass);
} else {
  const watcher = chokidar.watch([tsFilename], {
    persistent: true,
  });

  watcher.on("change", (path) => {
    console.log(`File ${path} has been changed, recompiling...`);
    themeCreator(tsFilename, cssFilename, sass);
  });
}

function themeCreator(tsFilename: string, cssFilename: string, sass: boolean) {
  try {
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

      let themeObject: any;
      themeObject = eval(result.outputText);

      const themeColors = { ...themeObject.colors };
      themeObject.colors = undefined;

      let index = 0;
      let allThemeColors: Array<string> = [];
      let rootColors = "";
      let sassVariables = "";
      for (const key in themeColors) {
        const themeColor = themeColors[key];

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
      if (sass) {
        cssVariables += sassVariables;
        values.forEach(
          (color) =>
            (cssVariables += "$" + color.key + ": var(--" + color.key + ");\n")
        );
      }

      cssVariables += ":root { \n";
      cssVariables += rootColors + "\n";
      values.forEach(
        (color) =>
          (cssVariables += "--" + color.key + ": " + color.value + ";\n")
      );

      cssVariables += "}\n";

      allThemeColors.forEach((item) => (cssVariables += item));

      fs.writeFile(cssFilename, cssVariables, (err) => {
        if (err) {
          console.error(err);
        }
      });
    });
    console.log("Compiled");
  } catch (error) {
    console.error(error);
  }
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
