import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        /* ── Ethiopian palette ─────────────────────────── */
        green: {
          50:  "#F0F7F2",
          100: "#DCEEE2",
          200: "#B5DCC3",
          300: "#80C49E",
          400: "#4DAC7A",
          500: "#258C59",
          600: "#1A7046",
          700: "#155836",  /* primary brand green */
          800: "#104228",
          900: "#0B2D1B",
          950: "#061810",
        },
        gold: {
          50:  "#FFFBEB",
          100: "#FEF3C7",
          200: "#FDE68A",
          300: "#FCD34D",
          400: "#FBBF24",
          500: "#D4A017",  /* primary accent gold */
          600: "#B08010",
          700: "#8A620B",
          800: "#634507",
          900: "#3D2A04",
        },
        red: {
          50:  "#FEF2F2",
          100: "#FEE2E2",
          200: "#FECACA",
          300: "#FCA5A5",
          400: "#F87171",
          500: "#EF4444",
          600: "#C81E1E",  /* primary accent red */
          700: "#9B1515",
          800: "#7A1111",
          900: "#5A0C0C",
        },
        cream: {
          50:  "#FFFEF9",
          100: "#FAF6EF",  /* page background */
          200: "#F4EDD9",
          300: "#EAD9B5",
          400: "#D9C08A",
          500: "#C4A25C",
        },
        ink: {
          DEFAULT: "#1A1A0F",
          soft:    "#3D3D2E",
          muted:   "#6B6355",
          faint:   "#A09880",
        },
        /* ── legacy aliases kept so existing admin code compiles ── */
        teal: {
          50:  "#F0F7F2",
          100: "#DCEEE2",
          200: "#B5DCC3",
          300: "#80C49E",
          400: "#4DAC7A",
          500: "#258C59",
          600: "#1A7046",
          700: "#155836",
          800: "#104228",
          900: "#0B2D1B",
        },
        gray: {
          50:  "#F9F8F6",
          100: "#F2F0EC",
          200: "#E5E2DA",
          300: "#CECCBF",
          400: "#B0AC9E",
          500: "#8A8678",
          600: "#6B6760",
          700: "#4E4B44",
          800: "#333129",
          900: "#1C1B14",
          950: "#0E0D09",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans:    ["var(--font-sans)",    "system-ui", "sans-serif"],
      },
      boxShadow: {
        warm:   "0 1px 3px 0 rgba(26,26,15,0.08), 0 1px 2px -1px rgba(26,26,15,0.06)",
        "warm-md": "0 4px 6px -1px rgba(26,26,15,0.10), 0 2px 4px -2px rgba(26,26,15,0.06)",
        "warm-lg": "0 10px 15px -3px rgba(26,26,15,0.10), 0 4px 6px -4px rgba(26,26,15,0.06)",
      },
      backgroundImage: {
        "flag-stripe": "linear-gradient(to right, #155836 33.33%, #D4A017 33.33% 66.66%, #C81E1E 66.66%)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
