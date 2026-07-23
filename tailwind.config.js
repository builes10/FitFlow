/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#ff6b35',      // Naranja fuerte (energía + fuerza)
        secondary: '#ff8555',    // Naranja más claro (hover)
        dark: {
          bg: '#0a0e27',         // Negro profundo
          card: '#1a1f3a',       // Gris oscuro para cards
          border: '#2d3355',     // Borde sutil
          text: '#e0e0e0',       // Texto gris claro
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  darkMode: 'class',
  plugins: [],
}
