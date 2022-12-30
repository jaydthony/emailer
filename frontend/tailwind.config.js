/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "style-100": "#FCF6D8",
        "style-200": "#F9EBB1",
        "style-lightblue": "#003CFF",
      },
    },
    container: {
      center: true,
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("daisyui"),
  ],
};
