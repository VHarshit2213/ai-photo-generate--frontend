/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f3e8ff",
          500: "#8b5cf6",
          600: "#7c3aed",
          700: "#6d28d9",
        },
        accent: {
          500: "#ff9f43",
        },
      },
      gradients: {
        background:
          "linear-gradient(135deg, #f3e8ff 0%, #ffffff 50%, #dbeafe 100%)",
      },
    },
  },
  plugins: [],
};
