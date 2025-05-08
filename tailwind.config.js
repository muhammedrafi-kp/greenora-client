/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        xs: '480px', 
      },
      fontFamily: {
        // sans: ['Poppins', 'Arial', 'sans-serif'],
        // sans: ['Inter', 'system-ui', 'Avenir', 'Helvetica', 'Arial', 'sans-serif']
        body: ['Inter', 'system-ui', 'Avenir', 'Helvetica', 'Arial', 'sans-serif'],
        heading: ['Poppins', 'Arial', 'sans-serif'],
      },
      fontSize: {
        'xxs': '0.625rem', // 10px
      },
    },
  },
  plugins: [],
};
