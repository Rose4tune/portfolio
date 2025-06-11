import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/content/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#eaeafe",
          100: "#dcdcff",
          200: "#bebeff",
          300: "#a0a0ff",
          400: "#8888ff",
          500: "#6666ff",
          600: "#4c4cff",
          700: "#3333ff",
          800: "#1a1aff",
          900: "#0000ff",
          DEFAULT: "#6666ff",
        },
      },
      fontFamily: {
        sans: ["Pretendard", "sans-serif"],
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: "100ch",
            color: "inherit",
            a: {
              textDecoration: "none",
              fontWeight: "500",
            },
            strong: {
              color: "inherit",
              fontWeight: "600",
            },
            code: {
              color: "inherit",
            },
            h1: {
              color: "inherit",
            },
            h2: {
              color: "inherit",
            },
            h3: {
              color: "inherit",
            },
            h4: {
              color: "inherit",
            },
            blockquote: {
              color: "inherit",
            },
          },
        },
      },
    },
  },
};

export default config;
