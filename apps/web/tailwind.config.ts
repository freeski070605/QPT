import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"]
      },
      colors: {
        brand: {
          bg: "#FFFFFF",
          primary: "#0F3D2E",
          accent: "#1E6B4C",
          neutral: "#F5F7F6",
          text: "#1A1A1A"
        }
      },
      boxShadow: {
        soft: "0 16px 40px rgba(15, 61, 46, 0.08)",
        card: "0 10px 30px rgba(15, 61, 46, 0.08)"
      },
      borderRadius: {
        soft: "18px"
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        }
      },
      animation: {
        fadeUp: "fadeUp 0.8s ease-out"
      }
    }
  },
  plugins: []
};

export default config;
