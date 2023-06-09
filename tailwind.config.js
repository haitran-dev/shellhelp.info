/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      backgroundImage: {
        "gradient-logo": "linear-gradient(135deg, #7219E3, #1ADBB8)",
        "gradient-long":
          "linear-gradient(125deg, #7219E3, #1ADBB8, #7219E3, #1ADBB8, #7219E3, #1ADBB8, #7219E3)",
        "gradient-default":
          "linear-gradient(135deg, #40e0a3, #ff8c00, #ff0055)",
      },
      colors: {
        warn: "hsl(45, 100%, 50%)",
        "warn-light": "hsl(5, 100%, 40%)",
        error: "hsl(0, 100%, 70%)",
        "error-light": "hsl(0, 100%, 40%)",
        cmd: "hsl(200, 100%, 70%)",
        "cmd-light": "hsl(200, 100%, 40%)",
        "sub-cmd": "hsl(150, 100%, 70%)",
        "sub-cmd-light": "hsl(150, 50%, 40%)",
        option: "hsl(270, 100%, 70%)",
        "option-light": "hsl(270, 100%, 40%)",
        args: "hsl(360, 100%, 70%)",
        "args-light": "hsl(360, 100%, 40%)",
      },
      animation: {
        flash: "flash 1s infinite",
        shake: "shake 0.2s",
      },
      keyframes: {
        flash: {
          "51%": { opacity: 1 },
          "1%, 50%": { opacity: 0 },
        },
        shake: {
          "0%, 100%": { transform: "rotate(0deg)" },
          "50%": { transform: "rotate(10deg)" },
        },
      },
    },
  },
  plugins: [],
};
