/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f8f7f4',
          100: '#e8e6df',
          200: '#d3cfc3',
          300: '#b8b1a1',
          400: '#9c9280',
          500: '#867c69',
          600: '#6d6454',
          700: '#574f44',
          800: '#443d35',
          900: '#332e28',
        }
      },
      fontFamily: {
        serif: ['Merriweather', 'serif'],
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
  ],
}