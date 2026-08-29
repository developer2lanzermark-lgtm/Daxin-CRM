/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        daxin: {
          50: '#f0f7ff',
          100: '#e0effe',
          200: '#bae0fd',
          300: '#7cc7fb',
          400: '#36abf7',
          500: '#0c8fe9',
          600: '#0170c8',
          700: '#0259a2',
          800: '#064b85',
          900: '#0b3f6f',
          950: '#082849',
        },
        pipeline: {
          unprogress: {
            bg: '#F1F5F9', // Slate 100
            text: '#475569', // Slate 600
            border: '#CBD5E1', // Slate 300
            dot: '#94A3B8', // Slate 400
            badge: '#E2E8F0', // Slate 200
          },
          process: {
            bg: '#FEF3C7', // Amber 100
            text: '#B45309', // Amber 700
            border: '#FCD34D', // Amber 300
            dot: '#F59E0B', // Amber 500
            badge: '#FDE68A', // Amber 200
          },
          select: {
            bg: '#DCFCE7', // Emerald 100
            text: '#15803D', // Emerald 700
            border: '#86EFAC', // Emerald 300
            dot: '#22C55E', // Emerald 500
            badge: '#BBF7D0', // Emerald 200
          },
          reject: {
            bg: '#FEE2E2', // Red 100
            text: '#B91C1C', // Red 700
            border: '#FCA5A5', // Red 300
            dot: '#EF4444', // Red 500
            badge: '#FECACA', // Red 200
          },
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 10px 0 rgba(0, 0, 0, 0.04), 0 1px 3px 0 rgba(0, 0, 0, 0.02)',
        'card': '0 4px 20px -2px rgba(0, 0, 0, 0.05), 0 2px 6px -1px rgba(0, 0, 0, 0.03)',
      }
    },
  },
  plugins: [],
}
