/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display: ['Pacifico', 'cursive'],
        heading: ['Playfair Display', 'serif'],
        body: ['Inter', 'sans-serif']
      },
      colors: {
        primary: '#D73D3D',
        'primary-dark': '#B72B2B',
        secondary: 'oklch(0.95 0.0058 264.53)',
        'brand-gold': '#D4AF37',
        'brand-cream': '#FFF8F4',
        'brand-success': '#0B6F43'
      },
      borderRadius: {
        lg: '0.625rem',
        xl: '0.875rem'
      }
    }
  },
  plugins: []
};