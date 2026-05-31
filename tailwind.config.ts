import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#1e3a8a',
          700: '#1d4ed8',
          900: '#1e3a8a',
          950: '#172554',
        },
        ink: '#0f172a',
        accent: {
          amber: '#f59e0b',
          red: '#dc2626',
          green: '#16a34a',
        },
      },
      boxShadow: {
        card: '0 2px 8px rgba(30,58,138,0.08)',
        cardLg: '0 4px 20px rgba(30,58,138,0.12)',
      },
    },
  },
  plugins: [],
}

export default config
