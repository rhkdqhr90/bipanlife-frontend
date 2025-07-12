import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-pretendard)"],
      },
      colors: {
        primary: "#3B82F6", // Blue 500
        secondary: "#6B7280", // Gray 500
        accent: "#F59E0B", // Amber 500
        danger: "#EF4444", // Red 500
      },
      spacing: {
        "128": "32rem",
        "144": "36rem",
      },
    },
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
    },
  },
  plugins: [typography],
};

export default config;
