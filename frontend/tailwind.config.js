/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        base: {
          950: '#05070B',
          900: '#0A0E16',
          850: '#0D1220',
          800: '#111827',
          700: '#1A2333',
          600: '#28334A',
          500: '#3C4A66',
        },
        frost: {
          400: '#7DF0DA',
          300: '#5EEAD4',
          500: '#2DD4BF',
          600: '#14B8A6',
        },
        risk: {
          low: '#34D399',
          medium: '#FBBF24',
          high: '#FB923C',
          critical: '#F87171',
        },
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(94,234,212,0.08), 0 8px 30px rgba(0,0,0,0.45)',
        card: '0 1px 0 rgba(255,255,255,0.04) inset, 0 8px 24px rgba(0,0,0,0.35)',
      },
      backgroundImage: {
        'grid-fade': 'radial-gradient(ellipse at top, rgba(94,234,212,0.06), transparent 60%)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}
