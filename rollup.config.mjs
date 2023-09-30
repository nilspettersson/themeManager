import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";

import packageJson from "./package.json" assert { type: "json" };

export default [
  {
    input: "src/compile.ts",
    output: {
      file: "dist/cli/compile.js",
      format: "cjs",
    },
    plugins: [
      resolve(),
      commonjs(),
      typescript({
        jsx: "react-jsx",
        target: "ES2016",
        module: "CommonJS",
        lib: ["es2017", "es7", "es6", "dom"],
        outDir: "../dist",
        strict: true,
        esModuleInterop: true,
        declaration: true,
        declarationMap: true,
        sourceMap: true,
        skipLibCheck: true,
      }),
      {
        name: "addShebang",
        renderChunk(code) {
          return `#!/usr/bin/env node\n${code}`;
        },
      },
    ],
  },
  {
    external: ["react", "react-dom"],
    input: "src/index.ts",
    output: [
      {
        file: packageJson.main,
        format: "cjs",
        sourcemap: true,
      },
      {
        file: packageJson.module,
        format: "esm",
        sourcemap: true,
      },
    ],
    plugins: [
      resolve(),
      commonjs(),
      typescript({ tsconfig: "./tsconfig.json" }),
    ],
  },
  {
    input: "dist/esm/types/index.d.ts",
    output: [{ file: "dist/index.d.ts", format: "esm" }],
    plugins: [dts()],
  },
];
