/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#F5F9F2",
          100: "#EBF3E5",
          200: "#D8E983",
          300: "#C5DE71",
          400: "#B2D35F",
          500: "#A5C89E",
          600: "#8FB382",
          700: "#7FA373",
          800: "#6F9364",
          900: "#2B4A2B",
        },
        accent: {
          yellow: "#FFFBB1",
          lime: "#D8E983",
          olive: "#AEB877",
          500: "#AEB877",
        },
        neutral: {
          50: "#FEFEF5",
          100: "#F9F9F9",
          200: "#F5F9F2",
          300: "#E8E8E8",
          400: "#D8D8D8",
          500: "#BFBFBF",
          600: "#808080",
          700: "#5A6B5A",
          800: "#4A4A4A",
          900: "#2B4A2B",
        },
      },
      fontFamily: {
        display: ["Poppins", "ui-sans-serif", "system-ui", "sans-serif"],
        body: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "gradient-primary":
          "linear-gradient(135deg, #FFFBB1 0%, #D8E983 48%, #A5C89E 100%)",
        "gradient-subtle":
          "linear-gradient(135deg, rgba(165, 200, 158, 0.26) 0%, rgba(255, 251, 177, 0.45) 45%, rgba(216, 233, 131, 0.28) 100%)",
        "gradient-hover": "linear-gradient(135deg, #D8E983 0%, #A5C89E 100%)",
      },
      boxShadow: {
        card: "0 4px 12px rgba(0, 0, 0, 0.05)",
        "card-hover": "0 12px 24px rgba(165, 200, 158, 0.15)",
        button: "0 12px 24px rgba(174, 184, 119, 0.38)",
        focus: "0 0 0 3px rgba(216, 233, 131, 0.35)",
      },
    },
  },
  plugins: [],
};
