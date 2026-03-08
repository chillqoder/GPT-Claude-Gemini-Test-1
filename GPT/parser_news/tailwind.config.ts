import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./store/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: ["class"],
  theme: {
    extend: {
      colors: {
        background: "#0F1117",
        surface: "#1A1D27",
        primary: "#3B82F6",
        accent: "#22C55E",
        warning: "#F59E0B",
        text: "#F1F5F9",
        muted: "#64748B",
        line: "#2D3748",
      },
      fontFamily: {
        display: ["var(--font-inter)"],
        body: ["var(--font-inter)"],
        headline: ["var(--font-newsreader)"],
        mono: ["var(--font-mono)"],
      },
      boxShadow: {
        card: "0 24px 64px rgba(15, 17, 23, 0.35)",
      },
      animation: {
        shimmer: "shimmer 1.6s linear infinite",
        "pulse-ring": "pulseRing 1.2s ease-in-out infinite",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        pulseRing: {
          "0%, 100%": { transform: "scale(1)", opacity: "0.5" },
          "50%": { transform: "scale(1.08)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
