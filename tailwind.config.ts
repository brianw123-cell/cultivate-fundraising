import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#FAF8F3",
        ink: "#14201A",
        forest: {
          50: "#EAF3EE",
          100: "#D8F3DC",
          200: "#B7E4C7",
          300: "#95D5B2",
          400: "#74C69D",
          500: "#52B788",
          600: "#40916C",
          700: "#2D6A4F",
          800: "#1B4332",
          900: "#122A20",
          950: "#0B1A14",
        },
        gold: {
          50: "#FBF3DD",
          100: "#F6E6BB",
          200: "#EFD48D",
          300: "#E9C46A",
          400: "#DCB23E",
          500: "#D4A017",
          600: "#B0830F",
          700: "#86640C",
          800: "#5E4708",
          900: "#3A2C05",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "ui-serif", "Georgia", "serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(20,32,26,0.04), 0 4px 16px rgba(20,32,26,0.06)",
        lift: "0 8px 30px rgba(20,32,26,0.10)",
      },
      borderRadius: {
        xl: "0.875rem",
        "2xl": "1.25rem",
      },
    },
  },
  plugins: [],
};

export default config;
