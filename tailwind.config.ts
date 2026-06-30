import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      colors: {
        graphite: '#0a0a0a',
        'pure-black': '#000000',
        carbon: '#171717',
        concrete: '#737373',
        ash: '#a1a1a1',
        smoke: '#b9b9b9',
        hairline: '#e5e5e5',
        mist: '#f2f2f2',
        chalk: '#ffffff',
        forest: {
          DEFAULT: '#1a3320',
          deep: '#0f1a12',
          light: '#2d5a3d',
          50: '#f0f5f1',
          100: '#dce8de',
          200: '#bcd4c1',
          300: '#93b89d',
          400: '#5e8a6c',
          500: '#3f6b4e',
          600: '#2d5a3d',
          700: '#234731',
          800: '#1a3320',
          900: '#0f1a12',
        },
        gold: {
          DEFAULT: '#d4af37',
          dark: '#b8973a',
          light: '#e8d48b',
          50: '#faf6e8',
          100: '#f5ecc8',
          200: '#ecd9a0',
          300: '#e3c878',
          400: '#dabb55',
          500: '#d4af37',
          600: '#b8973a',
          700: '#997d30',
          800: '#7a6427',
          900: '#5c4b1d',
        },
        champagne: {
          50: '#fbf7ef',
          100: '#f5ecda',
          200: '#ecdcbf',
          300: '#e0c79e',
          400: '#d6b483',
          500: '#cba068',
          600: '#a98453',
        },
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #d4af37 0%, #b8973a 100%)',
      },
      borderRadius: {
        'nav': '10px',
        'card': '14px',
        'pill': '9999px',
        'badge': '26px',
        'input': '10px',
        'button': '10px',
      },
      spacing: {
        '18': '4.5rem',
        '83': '83px',
      },
      maxWidth: {
        'page': '1200px',
      },
      fontSize: {
        'caption': ['12px', { lineHeight: '1.5' }],
        'body': ['14px', { lineHeight: '1.43' }],
        'subheading': ['18px', { lineHeight: '1.5', letterSpacing: '-0.45px' }],
        'display': ['48px', { lineHeight: '1.1', letterSpacing: '-2.4px' }],
      },
      boxShadow: {
        'subtle': '0px 0px 0px 2px #ffffff',
        'subtle-2': '0px 0px 0px 1px rgba(10, 10, 10, 0.1)',
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-in-out',
        'slide-up': 'slideUp 0.6s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
