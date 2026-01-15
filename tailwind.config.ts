import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Background colors
        background: '#09090B',
        card: '#18181B',
        'card-hover': '#1F1F23',
        border: '#27272A',
        'border-light': '#3F3F46',
        
        // Text colors
        'text-primary': '#FFFFFF',
        'text-secondary': '#A1A1AA',
        'text-muted': '#71717A',
        
        // Brand colors OhMySeason
        oms: {
          green: '#50F172',
          cyan: '#07F0FF',
          pink: '#FD4BAB',
          yellow: '#FBBF24',
          violet: '#A855F7',
          orange: '#F97316',
          blue: '#3B82F6',
        },
        
        // Status colors
        success: '#50F172',
        warning: '#FBBF24',
        error: '#EF4444',
        info: '#07F0FF',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'pulse-slow': 'pulse 3s infinite',
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
