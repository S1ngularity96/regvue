// eslint-disable-next-line @typescript-eslint/no-var-requires
const plugin = require("tailwindcss/plugin");

module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [
    plugin(function ({ addUtilities }) {
      const newUtilities = {
        ".horizontal-tb": {
          writingMode: "horizontal-tb",
        },
        ".vertical-rl": {
          writingMode: "vertical-rl",
        },
        ".vertical-lr": {
          writingMode: "vertical-lr",
        },
      };
      addUtilities(newUtilities);
    }),
  ],
  // This "hack" ensures your IDE detects all normal Tailwind classes, while JIT is used when compiling the project.
  // All the normal Tailwind classes should show up in code completion. It can't show all the new classes generated by JIT.
  mode: process.env.NODE_ENV ? "jit" : undefined,
};
