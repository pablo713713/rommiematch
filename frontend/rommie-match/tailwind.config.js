/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{html,ts}"
  ],
  theme: {
    extend: {
      colors: {
        pastel: {
          pink: "#f9c5d1",   // rosado pastel
          blue: "#a7c7e7",   // azul pastel
          cream: "#fff4e6",  // crema
          lilac: "#d9c7e7",  // lila suave (para detalles)
        },
      },
    },
  },
  plugins: [],
};
