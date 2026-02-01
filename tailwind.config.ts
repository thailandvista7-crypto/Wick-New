import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        olive: {
          50: "#f6f7f3",
          100: "#e9ede0",
          200: "#d3dac2",
          300: "#b4c19a",
          400: "#9aa876",
          500: "#7d8c5a",
          600: "#636f48",
          700: "#4f583b",
          800: "#424832",
          900: "#383e2c",
          950: "#1d2016",
        },
        beige: {
          50: "#faf9f6",
          100: "#f4f2eb",
          200: "#e8e3d4",
          300: "#d9d0b8",
          400: "#c7ba9a",
          500: "#b8a882",
          600: "#a8966f",
          700: "#8d7a5d",
          800: "#75664f",
          900: "#615544",
          950: "#332c22",
        },
        amber: {
          50: "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",
          700: "#b45309",
          800: "#92400e",
          900: "#78350f",
          950: "#451a03",
        },
      },
      fontFamily: {
        serif: ["Georgia", "Times New Roman", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)",
        luxury: "0 10px 40px -10px rgba(0, 0, 0, 0.1)",
      },
    },
  },
  plugins: [],
};
export default config;
