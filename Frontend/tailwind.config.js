import daisyui from "../node_modules/daisyui/index.js";

//  @type {import('tailwindcss').Config} 
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
	  extend: {
		      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(-100%)' },
        }
      },
      animation: {
        marquee: 'marquee 12s linear infinite',
      }
	},
  },
  plugins: [daisyui],
  daisyui: {
	themes: [
	  "light",
	  "dark",
	  "cupcake",
	  "bumblebee",
	  "emerald",
	  "corporate",
	  "synthwave",
	  "retro",
	  "cyberpunk",
	  "valentine",
	  "halloween",
	  "garden",
	  "forest",
	  "aqua",
	  "lofi",
	  "pastel",
	  "fantasy",
	  "wireframe",
	  "black",
	  "luxury",
	  "dracula",
	  "cmyk",
	  "autumn",
	  "business",
	  "acid",
	  "lemonade",
	  "night",
	  "coffee",
	  "winter",
	  "dim",
	  "nord",
	  "sunset",
	],
  },
};
