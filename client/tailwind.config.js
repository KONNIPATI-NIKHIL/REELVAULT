/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#0B0C10',
          secondary: '#12141B',
          card: '#181B24',
          elevated: '#1E2130',
        },
        text: {
          primary: '#F5F3EF',
          secondary: '#9498A5',
          muted: '#5A5D6B',
        },
        accent: {
          gold: '#C9A84C',
          'gold-light': '#E8C97A',
          'gold-muted': '#7A6530',
          violet: '#7C6EF0',
          'violet-light': '#A99DF5',
          'violet-muted': '#3D3680',
        },
        border: {
          subtle: 'rgba(255,255,255,0.06)',
          moderate: 'rgba(255,255,255,0.10)',
          strong: 'rgba(255,255,255,0.18)',
        },
      },
      fontFamily: {
        heading: ['Space Grotesk', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #C9A84C, #E8C97A)',
        'violet-gradient': 'linear-gradient(135deg, #7C6EF0, #A99DF5)',
        'card-gradient': 'linear-gradient(180deg, transparent 50%, rgba(11,12,16,0.95) 100%)',
      },
      boxShadow: {
        'card': '0 4px 24px rgba(0,0,0,0.4)',
        'card-hover': '0 8px 40px rgba(0,0,0,0.6)',
        'gold': '0 0 20px rgba(201,168,76,0.25)',
        'violet': '0 0 20px rgba(124,110,240,0.25)',
        'modal': '0 25px 60px rgba(0,0,0,0.7)',
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
