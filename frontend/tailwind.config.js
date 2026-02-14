/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        safe: { DEFAULT: "#0d9488", light: "#5eead4" },
        emergency: "#dc2626",
        calm: "#0891b2",
      },
      minHeight: { touch: "48px" },
      minWidth: { touch: "48px" },
    },
  },
  plugins: [],
};
