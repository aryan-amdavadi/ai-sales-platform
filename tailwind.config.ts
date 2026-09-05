import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/features/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        primaryInk: '#0F172A',
        deepNavy: '#1E293B',
        obsidian: '#0B0F17',
        darkSlate: '#0D1117',
        royalBlue: '#2563EB',
        teal: {
          DEFAULT: '#0F9D9A',
          50: '#E8F7F5',
          100: '#D1F0EC',
          500: '#0F9D9A',
          600: '#0D8683',
        },
        softTeal: '#E8F7F5',
        iceBlue: '#EFF6FF',
        background: '#F8FAFC',
        surface: '#FFFFFF',
        border: '#E2E8F0',
        mutedText: '#64748B',
        primaryText: '#0F172A',
        secondaryText: '#475569',
        success: '#16A34A',
        warning: '#D97706',
        error: '#DC2626',
        
        // standard mappings
        primary: {
          DEFAULT: '#10233F',
          foreground: '#FFFFFF',
        },
        accent: {
          DEFAULT: '#2563EB',
          foreground: '#FFFFFF',
        },
        muted: {
          DEFAULT: '#F1F5F9',
          foreground: '#64748B',
        },
        card: {
          DEFAULT: '#FFFFFF',
          foreground: '#10233F',
        },
        intent: {
          high: '#0F9D9A',
          medium: '#D97706',
          low: '#64748B',
          hot: '#2563EB',
        },
      },
      borderRadius: {
        sm: '6px',
        DEFAULT: '10px',
        md: '10px',
        lg: '14px',
        xl: '16px',
      },
      boxShadow: {
        sm: '0 1px 3px rgba(16, 35, 63, 0.04)',
        DEFAULT: '0 4px 20px rgba(16, 35, 63, 0.05)',
        md: '0 4px 20px rgba(16, 35, 63, 0.05)',
        lg: '0 8px 30px rgba(16, 35, 63, 0.08)',
        glass: '0 8px 32px 0 rgba(16, 35, 63, 0.06)',
      },
      keyframes: {
        'pulse-subtle': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
      animation: {
        'pulse-subtle': 'pulse-subtle 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
