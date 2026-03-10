/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
        body: ['var(--font-body)', 'sans-serif']
      },
      colors: {
        ink: {
          50: '#f5f7f7',
          100: '#e7ecec',
          200: '#c7d2d3',
          300: '#a7b8ba',
          400: '#7a8d91',
          500: '#5e7176',
          600: '#48585c',
          700: '#3a474b',
          800: '#2b3437',
          900: '#1b2123'
        },
        accent: {
          500: '#f5b344',
          600: '#e49a19'
        }
      },
      boxShadow: {
        soft: '0 10px 30px rgba(0,0,0,0.12)'
      }
    }
  },
  plugins: []
};
