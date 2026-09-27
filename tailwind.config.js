/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        rexton: {
          dark: '#0B0B0B',
          black: '#121212',
          surface: '#181818',
          card: '#222222',
          border: '#E5E5E5',
          'border-dark': '#2A2A2A',
          gold: '#C5A880',
          'gold-light': '#D4AF37',
          'gold-hover': '#B8976C',
          cream: '#FAF9F6',
          muted: '#666666',
          'muted-light': '#9E9E9E',
          accent: '#9B111E', // Subtle Swiss ruby jewel accent
        },
      },
      fontFamily: {
        serif: ['var(--font-cinzel)', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['var(--font-inter)', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      letterSpacing: {
        widest: '.2em',
        ultra: '.3em',
      },
      boxShadow: {
        'luxury': '0 20px 40px -15px rgba(0, 0, 0, 0.05)',
        'luxury-hover': '0 25px 50px -12px rgba(0, 0, 0, 0.12)',
        'gold-glow': '0 0 25px rgba(197, 168, 128, 0.25)',
      },
    },
  },
  plugins: [],
};
