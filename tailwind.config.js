const colors = require("tailwindcss/colors")

module.exports = {
  purge: {
    enabled: process.env.NODE_ENV === "production",
    content: ["src/**/*.js", "src/**/*.jsx"],
  },
  theme: {
    extend: {
      colors: {
        beige: {
          100: "#f6f5f2",
          200: "#d4d6be",
          300: "#d9dcbf",
          500: "#908666",
          600: "#67592c",
          700: "#5d4530",
          750: "#463322",
          751: "#402915",
        },
        cultured: {
          white: "#fbfaf9",
          black: "#404547",
        },
        green: {
          mottainai: "#73ba25",
          terminal: "#22da26"
        },
        solarized: {
          background: "#fdf6e3",
          content: "#586e75"
        }
      },
      fontFamily: {
        sans: ["Lato", "sans-serif"],
      },
    },
  },
  variants: {
    display: ["group-hover", "group-focus"],
    extend: {
      opacity: ["disabled"],
      backgroundColor: ["disabled", "even"],
      cursor: ["disabled"]
    },
  },
}
