
import type {Config} from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        body: ['Inter', 'sans-serif'],
        headline: ['"Edu QLD Hand"', 'cursive'],
        handwriting: ['Truculenta', 'sans-serif'],
        code: ['monospace'],
        saira: ['Saira', 'sans-serif'],
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        pink_accent: 'hsl(var(--pink-accent))',
        violet_accent: 'hsl(var(--violet-accent))',
        orange_accent: 'hsl(var(--orange-accent))',
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
        'pulse-glow': {
          '0%, 100%': {
            boxShadow: '0 0 2px 0px hsl(var(--accent)), 0 0 4px 0px hsl(var(--accent) / 0.7)',
            opacity: '0.7',
          },
          '50%': {
            boxShadow: '0 0 8px 2px hsl(var(--accent)), 0 0 12px 2px hsl(var(--accent) / 0.7)',
            opacity: '1',
          },
        },
        'pulse-glow-pink': {
          '0%, 100%': {
              boxShadow: '0 0 3px 0px hsl(var(--pink-accent)), 0 0 6px 0px hsl(var(--pink-accent) / 0.7)',
          },
          '50%': {
              boxShadow: '0 0 10px 2px hsl(var(--pink-accent)), 0 0 14px 2px hsl(var(--pink-accent) / 0.7)',
          },
        },
        'glitch-1': {
          '0%, 100%': { 'clip-path': 'inset(50% 0 30% 0)' },
          '10%': { 'clip-path': 'inset(20% 0 1% 0)' },
          '20%': { 'clip-path': 'inset(80% 0 5% 0)' },
          '30%': { 'clip-path': 'inset(5% 0 90% 0)' },
          '40%': { 'clip-path': 'inset(60% 0 35% 0)' },
          '50%': { 'clip-path': 'inset(30% 0 55% 0)' },
          '60%': { 'clip-path': 'inset(10% 0 75% 0)' },
          '70%': { 'clip-path': 'inset(90% 0 1% 0)' },
          '80%': { 'clip-path': 'inset(45% 0 45% 0)' },
          '90%': { 'clip-path': 'inset(5% 0 80% 0)' },
        },
        'glitch-2': {
          '0%, 100%': { 'clip-path': 'inset(5% 0 80% 0)' },
          '10%': { 'clip-path': 'inset(90% 0 1% 0)' },
          '20%': { 'clip-path': 'inset(10% 0 75% 0)' },
          '30%': { 'clip-path': 'inset(60% 0 35% 0)' },
          '40%': { 'clip-path': 'inset(30% 0 55% 0)' },
          '50%': { 'clip-path': 'inset(80% 0 5% 0)' },
          '60%': { 'clip-path': 'inset(20% 0 1% 0)' },
          '70%': { 'clip-path': 'inset(50% 0 30% 0)' },
          '80%': { 'clip-path': 'inset(5% 0 90% 0)' },
          '90%': { 'clip-path': 'inset(45% 0 45% 0)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'pulse-glow': 'pulse-glow 2.5s ease-in-out infinite',
        'pulse-glow-pink': 'pulse-glow-pink 2.5s ease-in-out infinite',
        'glitch-1': 'glitch-1 .8s linear infinite',
        'glitch-2': 'glitch-2 1.2s linear infinite reverse',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;
