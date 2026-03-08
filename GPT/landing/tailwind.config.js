/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        moss: '#2E4036',
        clay: '#CC5833',
        cream: '#F2F0E9',
        charcoal: '#1A1A1A',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
        serif: ['"Cormorant Garamond"', 'serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      boxShadow: {
        panel: '0 30px 80px rgba(26, 26, 26, 0.12)',
      },
      backgroundImage: {
        grain:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180' viewBox='0 0 180 180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.95' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23n)' opacity='0.18'/%3E%3C/svg%3E\")",
      },
      animation: {
        blink: 'blink 1s step-end infinite',
        pulseSoft: 'pulseSoft 2.2s ease-in-out infinite',
        drift: 'drift 18s linear infinite',
      },
      keyframes: {
        blink: {
          '50%': { opacity: '0' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '0.45', transform: 'scale(0.98)' },
          '50%': { opacity: '1', transform: 'scale(1.04)' },
        },
        drift: {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
      },
    },
  },
  plugins: [],
}
