import { createContext, useState, useMemo } from "react";
import { createTheme } from "@mui/material/styles";

export const tokens = (mode) => ({
  ...(mode === "dark"
    ? {
        grey: {
          100: "#e0e0e0",
          200: "#c2c2c2",
          300: "#a3a3a3",
          400: "#858585",
          500: "#666666",
          600: "#525252",
          700: "#3d3d3d",
          800: "#292929",
          900: "#141414",
        },
        primary: {
          100: "#d0d1d5",
          200: "#a1a4ab",
          300: "#727681",
          400: "#1F2A40",
          500: "#141b2d",
          600: "#101624",
          700: "#0c101b",
          800: "#080b12",
          900: "#040509",
        },
        greenAccent: {
          100: "#dbf5ee",
          200: "#b7ebde",
          300: "#94e2cd",
          400: "#70d8bd",
          500: "#4cceac",
          600: "#3da58a",
          700: "#2e7c67",
          800: "#1e5245",
          900: "#0f2922",
        },
        redAccent: {
          100: "#f8dcdb",
          200: "#f1b9b7",
          300: "#e99592",
          400: "#e2726e",
          500: "#db4f4a",
          600: "#af3f3b",
          700: "#832f2c",
          800: "#58201e",
          900: "#2c100f",
        },
        blueAccent: {
          100: "#e1e2fe",
          200: "#c3c6fd",
          300: "#a4a9fc",
          400: "#868dfb",
          500: "#6870fa",
          600: "#535ac8",
          700: "#3e4396",
          800: "#2a2d64",
          900: "#151632",
        },
        yellowAccent: {
          100: "#fff7cc",
          200: "#ffef99",
          300: "#ffe766",
          400: "#ffdf33",
          500: "#ffd700",
          600: "#cca600",
          700: "#997800",
          800: "#665000",
          900: "#332800",
        },
        pinkAccent: {
          100: "#ffe0f7",
          200: "#ffc1ef",
          300: "#ffa3e7",
          400: "#ff84df",
          500: "#ff66d7",
          600: "#cc51ac",
          700: "#993d80",
          800: "#662856",
          900: "#33142b",
        },
        purpleAccent: {
          100: "#f2e5ff",
          200: "#d4bfff",
          300: "#b599ff",
          400: "#966eff",
          500: "#7744ff",
          600: "#602ecc",
          700: "#491f99",
          800: "#331466",
          900: "#1a0a33",
        },
        orangeAccent: {
          100: "#ffe5cc",
          200: "#ffcc99",
          300: "#ffb266",
          400: "#ff9933",
          500: "#ff8000",
          600: "#cc6600",
          700: "#994c00",
          800: "#663300",
          900: "#331900",
        },
        cyanAccent: {
          100: "#ccf5ff",
          200: "#99ebff",
          300: "#66e0ff",
          400: "#33d6ff",
          500: "#00ccff",
          600: "#0099cc",
          700: "#007399",
          800: "#004d66",
          900: "#002633",
        },
        tealAccent: {
          100: "#ccfffb",
          200: "#99fff7",
          300: "#66fff2",
          400: "#33ffee",
          500: "#00ffe9",
          600: "#00ccbb",
          700: "#00998c",
          800: "#00665e",
          900: "#00332f",
        },
      }
    : {
        grey: {
          100: "#141414",
          200: "#292929",
          300: "#3d3d3d",
          400: "#525252",
          500: "#666666",
          600: "#858585",
          700: "#a3a3a3",
          800: "#c2c2c2",
          900: "#e0e0e0",
        },
        primary: {
          100: "#040509",
          200: "#080b12",
          300: "#0c101b",
          400: "#f2f0f0",
          500: "#141b2d",
          600: "#1F2A40",
          700: "#727681",
          800: "#a1a4ab",
          900: "#d0d1d5",
        },
        greenAccent: {
          100: "#0f2922",
          200: "#1e5245",
          300: "#2e7c67",
          400: "#3da58a",
          500: "#4cceac",
          600: "#70d8bd",
          700: "#94e2cd",
          800: "#b7ebde",
          900: "#dbf5ee",
        },
        redAccent: {
          100: "#2c100f",
          200: "#58201e",
          300: "#832f2c",
          400: "#af3f3b",
          500: "#db4f4a",
          600: "#e2726e",
          700: "#e99592",
          800: "#f1b9b7",
          900: "#f8dcdb",
        },
        blueAccent: {
          100: "#151632",
          200: "#2a2d64",
          300: "#3e4396",
          400: "#535ac8",
          500: "#6870fa",
          600: "#868dfb",
          700: "#a4a9fc",
          800: "#c3c6fd",
          900: "#e1e2fe",
        },
        yellowAccent: {
          100: "#332800",
          200: "#665000",
          300: "#997800",
          400: "#cca600",
          500: "#ffd700",
          600: "#ffdf33",
          700: "#ffe766",
          800: "#ffef99",
          900: "#fff7cc",
        },
        pinkAccent: {
          100: "#33142b",
          200: "#662856",
          300: "#993d80",
          400: "#cc51ac",
          500: "#ff66d7",
          600: "#ff84df",
          700: "#ffa3e7",
          800: "#ffc1ef",
          900: "#ffe0f7",
        },
        purpleAccent: {
          100: "#1a0a33",
          200: "#331466",
          300: "#491f99",
          400: "#602ecc",
          500: "#7744ff",
          600: "#966eff",
          700: "#b599ff",
          800: "#d4bfff",
          900: "#f2e5ff",
        },
        orangeAccent: {
          100: "#331900",
          200: "#663300",
          300: "#994c00",
          400: "#cc6600",
          500: "#ff8000",
          600: "#ff9933",
          700: "#ffb266",
          800: "#ffcc99",
          900: "#ffe5cc",
        },
        cyanAccent: {
          100: "#002633",
          200: "#004d66",
          300: "#007399",
          400: "#0099cc",
          500: "#00ccff",
          600: "#33d6ff",
          700: "#66e0ff",
          800: "#99ebff",
          900: "#ccf5ff",
        },
        tealAccent: {
          100: "#00332f",
          200: "#00665e",
          300: "#00998c",
          400: "#00ccbb",
          500: "#00ffe9",
          600: "#33ffee",
          700: "#66fff2",
          800: "#99fff7",
          900: "#ccfffb",
        },
      }),
});

export const themeSettings = (mode) => {
  const colors = tokens(mode);
  return {
    palette: {
      mode: mode,
      ...(mode === "dark"
        ? {
            primary: {
              main: colors.primary[500],
            },
            secondary: {
              main: colors.greenAccent[500],
            },
            neutral: {
              dark: colors.grey[700],
              main: colors.grey[500],
              light: colors.grey[100],
            },
            background: {
              default: colors.primary[500],
            },
          }
        : {
            primary: {
              main: colors.primary[100],
            },
            secondary: {
              main: colors.greenAccent[500],
            },
            neutral: {
              dark: colors.grey[700],
              main: colors.grey[500],
              light: colors.grey[100],
            },
            background: {
              default: "#fcfcfc",
            },
          }),
    },
    typography: {
      fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
      fontSize: 12,
      h1: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
        fontSize: 40,
      },
      h2: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
        fontSize: 32,
      },
      h3: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
        fontSize: 24,
      },
      h4: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
        fontSize: 20,
      },
      h5: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
        fontSize: 16,
      },
      h6: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
        fontSize: 14,
      },
    },
  };
};

// context for color mode
export const ColorModeContext = createContext({
  toggleColorMode: () => {},
});

export const useMode = () => {
  const [mode, setMode] = useState("dark");

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () =>
        setMode((prev) => (prev === "light" ? "dark" : "light")),
    }),
    []
  );

  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  return [theme, colorMode];
};
