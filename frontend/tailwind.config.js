/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        recall: {
          mint: "#E0FFE0",
          green: "#166534",
          greenDark: "#14532d",
          nav: "#4b5563",
        },
        safe: { DEFAULT: "#0d9488", light: "#5eead4" },
        emergency: "#dc2626",
        calm: "#0891b2",
        cardIcon: {
          orange: "#FFDAB9",
          blue: "#ADD8E6",
          green: "#98FB98",
        },
      },
      minHeight: { touch: "48px" },
      minWidth: { touch: "48px" },
      fontFamily: {
        sans: ["Inter", "Plus Jakarta Sans", "system-ui", "sans-serif"],
      },
      borderRadius: {
        pill: "9999px",
        card: "16px",
      },
      boxShadow: {
        card: "0 4px 14px rgba(0,0,0,0.06)",
      },
    },
  },
  plugins: [],
};
