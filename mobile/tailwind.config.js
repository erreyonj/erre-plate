/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./index.{js,jsx,ts,tsx}",
    "./screens/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./navigation/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        'eplate-tan':         '#a3866d',
        'eplate-charcoal':    '#2b322a',
        'eplate-cream':       '#d6d7d1',
        'eplate-brown':       '#56402b',
        'eplate-gold':        '#f1b84d',
        'eplate-forest':      '#364524',
        'eplate-terracotta':  '#c96b3a',
        'eplate-turquoise':   '#038568',
        'eplate-offwhite':    '#fcfcfa',
        'eplate-lightgray':   '#e8e9e4',
        'eplate-midgray':     '#9a9d95',
        'eplate-darkgray':    '#4a5248',
        'eplate-gold-subtle': '#fef9ec',
      },
    },
  },
  plugins: [],
};
