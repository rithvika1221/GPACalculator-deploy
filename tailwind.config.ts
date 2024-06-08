import type { Config } from 'tailwindcss';
import {nextui} from "@nextui-org/react";

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      gridTemplateColumns: {
        '13': 'repeat(13, minmax(0, 1fr))',
      },
      backgroundImage: {
        'gradient-to-r': 'linear-gradient(to right, #3d52a0, #3d52a0)',
        'gradient-to-b': 'linear-gradient(to right, #7091e6, #7091e6)'
      },
      colors: {
        blue: {
          400: '#2589FE',
          500: '#0070F3',
          600: '#2F6FEB',
        },
        theme: {
          one: '#3d52a0',
          two: '#7091e6',
          three: '#8697c4',
          four:'#abdbda',
          five:'#ede8f5'
        },
        'custom-green': '#ede8f5',
        'custom-button': '#edf7f6',
      },
    },
    keyframes: {
      shimmer: {
        '100%': {
          transform: 'translateX(100%)',
        },
      },
    },
  },
  plugins: [require('@tailwindcss/forms'), nextui()],
};
export default config;
