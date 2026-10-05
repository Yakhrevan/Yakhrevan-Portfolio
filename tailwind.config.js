/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: "#2563EB",
          "blue-dark": "#1D4ED8",
          sky: "#38BDF8",
          "sky-light": "#E0F2FE",
          orange: "#F97316",
          navy: "#0F172A",
          slate: "#64748B",
          bg: "#F6F9FF",
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        hand: ['Caveat', 'cursive'],
      },
      boxShadow: {
        card: '0 4px 24px -4px rgba(15,23,42,0.08)',
        'card-hover': '0 12px 40px -8px rgba(15,23,42,0.12)',
        lift: '0 20px 50px -12px rgba(15,23,42,0.18)',
        glow: '0 8px 24px rgba(37,99,235,0.35)',
        'glow-sky': '0 0 20px rgba(56,189,248,0.35)',
        'glow-blue': '0 0 20px rgba(37,99,235,0.35)',
        'glow-orange': '0 0 20px rgba(249,115,22,0.35)',
      },
      keyframes: {
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        bounceGentle: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        float: 'float 5s ease-in-out infinite',
        'bounce-gentle': 'bounceGentle 2s ease-in-out infinite',
        'spin-slow': 'spin 12s linear infinite',
        shimmer: 'shimmer 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
