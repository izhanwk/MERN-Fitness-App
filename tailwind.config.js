/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        "dm-sans": ["DM Sans", "sans-serif"],
      },
      fill: {
        none: "none",
      },
      strokeWidth: {
        width: "20px",
      },
      strokeDasharray: {
        dasharray: "200px",
      },
    },
  },
  plugins: [],
};
