// /** @type {import('tailwindcss').Config} */
// export default {
//   darkMode: "class",

//   content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],

//   theme: {
//     extend: {
//       colors: {
//         primary: {
//           50: "#EAF6E7",
//           100: "#D7EDCF",
//           200: "#B6DBA8",
//           300: "#95C981",
//           400: "#74B75A",
//           500: "#5E9E49",
//           600: "#4A7D3A",
//           700: "#375C2B",
//           800: "#243B1C",
//           900: "#14220F",
//         },

//         accent: {
//           yellow: "#D9D36B",
//           lime: "#AFC95A",
//           olive: "#7F8F4A",
//           500: "#7F8F4A",
//         },

//         neutral: {
//           50: "#E8ECE8",
//           100: "#D3D9D3",
//           200: "#AAB5AA",
//           300: "#7D8A7D",
//           400: "#5E695E",
//           500: "#475247",
//           600: "#323B32",
//           700: "#242B24",
//           800: "#181D18",
//           900: "#0D110D",

//           bg: "#0F1510",
//           surface: "#172019",
//           elevated: "#1E2A20",
//           border: "#2E3A30",
//         },
//       },

//       fontFamily: {
//         display: ["Poppins", "ui-sans-serif", "system-ui", "sans-serif"],
//         body: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
//       },

//       backgroundImage: {
//         "gradient-primary":
//           "linear-gradient(135deg, #14220F 0%, #243B1C 45%, #375C2B 100%)",

//         "gradient-subtle":
//           "linear-gradient(135deg, rgba(165, 200, 158, 0.26) 0%, rgba(255, 251, 177, 0.45) 45%, rgba(216, 233, 131, 0.28) 100%)",

//         // "gradient-subtle":
//         //   "linear-gradient(135deg, rgba(20,34,15,0.95) 0%, rgba(36,59,28,0.92) 50%, rgba(127,143,74,0.18) 100%)",

//         "gradient-hover": "linear-gradient(135deg, #375C2B 0%, #5E9E49 100%)",
//       },

//       boxShadow: {
//         card: "0 6px 18px rgba(0,0,0,0.35)",

//         "card-hover": "0 12px 30px rgba(95, 158, 73, 0.18)",

//         button: "0 12px 24px rgba(95, 158, 73, 0.28)",

//         focus: "0 0 0 3px rgba(216, 233, 131, 0.22)",
//       },
//     },
//   },

//   plugins: [],
// };

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",

  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],

  theme: {
    extend: {
      colors: {
        primary: {
          50: "#F3E8FF",
          100: "#E9D5FF",
          200: "#D8B4FE",
          300: "#C084FC",
          400: "#A855F7",
          500: "#9333EA",
          600: "#7E22CE",
          700: "#6B21A8",
          800: "#581C87",
          900: "#3B0764",
        },

        accent: {
          pink: "#F0ABFC",
          purple: "#C084FC",
          violet: "#8B5CF6",
          500: "#A855F7",
        },

        neutral: {
          50: "#F5F3FF",
          100: "#EDE9FE",
          200: "#DDD6FE",
          300: "#C4B5FD",
          400: "#A78BFA",
          500: "#7C6AA6",
          600: "#5B4B7A",
          700: "#3F3351",
          800: "#241B2E",
          900: "#140F1C",

          bg: "#0F0A19",
          surface: "#181124",
          elevated: "#221933",
          border: "#312347",
        },
      },

      fontFamily: {
        display: ["Poppins", "ui-sans-serif", "system-ui", "sans-serif"],
        body: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },

      backgroundImage: {
        "gradient-primary":
          "linear-gradient(135deg, #140F1C 0%, #312347 45%, #7E22CE 100%)",

        "gradient-subtle":
          "linear-gradient(135deg, rgba(88,28,135,0.85) 0%, rgba(126,34,206,0.25) 50%, rgba(192,132,252,0.15) 100%)",

        "gradient-hover": "linear-gradient(135deg, #6B21A8 0%, #A855F7 100%)",
      },

      boxShadow: {
        card: "0 6px 18px rgba(0,0,0,0.40)",

        "card-hover": "0 12px 30px rgba(168,85,247,0.25)",

        button: "0 12px 24px rgba(147,51,234,0.35)",

        focus: "0 0 0 3px rgba(192,132,252,0.30)",
      },
    },
  },

  plugins: [],
};
