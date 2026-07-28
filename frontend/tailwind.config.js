/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Orange (ton orange "Claude") = couleur primaire = boutons, liens actifs, accents
        primary: {
          DEFAULT: "#E8590C",
          light: "#FF8A3D",
          dark: "#B8440A",
        },
        // Bleu (façon Facebook) = couleur secondaire = navbar, éléments secondaires
        secondary: {
          DEFAULT: "#1877F2",
          light: "#4E9BFF",
          dark: "#0F5DC7",
        },
        // Gris neutre pro pour les fonds et textes
        neutral: {
          bg: "#F7F8FA",
          text: "#1E1E1E",
        },
      },
    },
  },
  plugins: [],
}