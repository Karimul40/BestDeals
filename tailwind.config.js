/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#F9F5FF',
          100: '#F4EBFF',
          200: '#E9D7FE',
          300: '#D6BBFB',
          400: '#B692F6',
          500: '#9E77ED',
          600: '#7F56D9',
          700: '#6941C6', // Figma primary brand purple
          800: '#53389E',
          900: '#42307D',
        },
        navy: {
          900: '#0B1B2B', // Figma dark footer
          950: '#081420',
        },
        success: {
          light: '#ECFDF3',
          DEFAULT: '#12B76A',
          dark: '#027A48',
        },
        warning: {
          light: '#FFFAEB',
          DEFAULT: '#F79009',
          dark: '#B54708',
        },
        danger: {
          light: '#FEF3F2',
          DEFAULT: '#F04438',
          dark: '#B42318',
        },
      },
    },
  },
  plugins: [],
};
