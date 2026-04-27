import js from "@eslint/js";
import globals from "globals";

export default [
  { ignores: ["node_modules", "dist"] },
  js.configs.recommended,
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      globals: { ...globals.browser, ...globals.es2021 },
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
  },
  {
    files: ["vite.config.js", "postcss.config.js", "tailwind.config.js"],
    languageOptions: {
      globals: { ...globals.node },
    },
  },
];
