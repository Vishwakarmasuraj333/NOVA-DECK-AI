import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        nova: {
          midnight: "#10091F",
          surface: "#1B1230",
          surfaceHover: "#241840",
          card: "#170F2B",
          border: "#2E224D",
          borderLight: "#3E2E66",
          magenta: "#E82DA8",
          magentaHover: "#F048B5",
          cyan: "#43D5E8",
          cyanHover: "#5CE0F1",
          softWhite: "#F8F5FF",
          muted: "#B7AEC9",
          darkMuted: "#7B6F93",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-space)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "nova-hero": "radial-gradient(ellipse at 50% -20%, rgba(232, 45, 168, 0.25) 0%, rgba(67, 213, 232, 0.15) 35%, rgba(16, 9, 31, 0) 70%)",
        "card-glow": "radial-gradient(circle at 50% 0%, rgba(232, 45, 168, 0.12), transparent 70%)",
      },
      boxShadow: {
        "nova-glow": "0 0 25px -5px rgba(232, 45, 168, 0.3), 0 0 15px -5px rgba(67, 213, 232, 0.2)",
        "cyan-glow": "0 0 20px -3px rgba(67, 213, 232, 0.35)",
        "magenta-glow": "0 0 20px -3px rgba(232, 45, 168, 0.35)",
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float": "float 6s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
