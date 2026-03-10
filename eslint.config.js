import js from "@eslint/js";
import tseslint from "typescript-eslint";
import tailwind from "eslint-plugin-tailwindcss";

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...tailwind.configs["flat/recommended"],
  {
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      "tailwindcss/no-custom-classname": "off",
    },
  },
  {
    ignores: ["dist/", "node_modules/", ".wrangler/"],
  }
);
