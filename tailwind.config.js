/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        canvas: '#F6F7F9',
        ink: {
          900: '#1F2733',
          700: '#3A4453',
          500: '#5B6573',
          400: '#8A93A1',
        },
        accent: {
          blue: '#3B82F6',
          green: '#10B981',
        },
        navy: '#1E293B',
      },
      borderRadius: {
        xl: '12px',
        '2xl': '16px',
      },
      boxShadow: {
        card: '0 1px 2px rgba(16,24,40,0.04), 0 1px 3px rgba(16,24,40,0.06)',
        pop: '0 10px 30px rgba(16,24,40,0.12)',
      },
    },
  },
  plugins: [],
}
