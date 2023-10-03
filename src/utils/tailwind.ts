export function tailwindColors(theme: any) {
  const colors = { ...theme.colors.light } as any;
  let convertedColors = {} as any;

  let currentObjValues = getValuesInobjectRecursive("color", colors);
  currentObjValues.forEach((item) => {
    convertedColors[item.key] = "var(--" + item.key + ")";
  });
  return convertedColors;
}

export function tailwindTheme(theme: any) {
  const themeMisc = { ...theme } as any;
  themeMisc.colors = undefined;
  let tailwindTheme = {} as any;

  for (const key in theme) {
    const value = themeMisc[key];
    if (typeof value === "object") {
      tailwindTheme[key] = {};
      let currentObjValues = getValuesInobjectRecursive("", themeMisc[key]);
      currentObjValues.forEach((item) => {
        tailwindTheme[key][item.key] = "var(--" + key + "-" + item.key + ")";
      });
    } else if (typeof value === "string") {
      tailwindTheme[key] = "var(--" + key + ")";
    }
  }
  tailwindTheme["colors"] = tailwindColors(theme);
  return tailwindTheme;
}

// console.log(
//   tailwindColors({
//     colors: {
//       light: {
//         primary: {
//           default: "#00bfff", // Lighter shade of blue
//           hover: "#009ad7", // Slightly darker blue on hover
//           active: "#007baa", // Even darker blue for active state
//         },
//         secondary: {
//           default: "#757575", // Grey
//           hover: "#626262", // Dark grey on hover
//           active: "#505050", // Even darker grey for active state
//         },
//       },
//       dark: {
//         primary: "green",
//         background: "black",
//       },
//     },
//     padding: {
//       sm: "5px",
//       md: "10px",
//       lg: "20px",
//     },
//     width: "2000px",
//   })
// );

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
