import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        blush: "#ffdfe5",
        sky: "#cfe9ff",
        mint: "#dff8f2",
        butter: "#fff3d9",
        grape: "#d8d0ff",
        ink: "#1f2933"
      },
      fontFamily: {
        display: ["\"DM Sans\"", "system-ui", "sans-serif"],
        body: ["\"Nunito\"", "system-ui", "sans-serif"]
      },
      boxShadow: {
        soft: "0 15px 60px rgba(51, 94, 137, 0.15)"
      }
    }
  },
  plugins: []
};

export default config;
