/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f0f7ff",
          100: "#d9ebff",
          500: "#0b5fff",
          700: "#003ab5"
        }
      },
      boxShadow: {
        soft: "0 8px 30px rgba(12, 20, 38, 0.08)"
      }
    }
  },
  plugins: []
};
