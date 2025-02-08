/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin');

export default {
  content: ["./index.html",
            "./src/**/*.{js,ts,jsx,tsx}",],
  theme: {
    extend: {},
  },
  plugins: [require('daisyui'),
    plugin(function ({ addUtilities }) {
      addUtilities({
          '.scrollbar-width-auto': {
              'scrollbar-width': 'auto',
          },

          '.scrollbar-none': {
              'scrollbar-width': 'none',
              '&::-webkit-scrollbar': {
                  'display': 'none'
              }
          },

          '.scrollbar-thin': {
              'scrollbar-width': 'thin',
          },

          '.scrollbar-light': {
              '&::-webkit-scrollbar': {
                  width: '5px',
                  height: '8px',
                  background: '#374151',
                  border: '4px solid transparent',
                  borderRadius: '8px',
              },
              '&::-webkit-scrollbar-thumb': {
                  background: '#4f46e5',
                  border: '4px solid transparent',
                  borderRadius: '8px',
                  backgroundClip: 'paddingBox',
              },
              '&::-webkit-scrollbar-thumb:hover': {
                  background: '#6366f1',
              },
          }
      })
  }),],
}

