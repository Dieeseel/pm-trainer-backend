// @ts-check
import { defineConfig } from "eslint/config";
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import prettierConfig from "eslint-config-prettier";
import prettierPlugin from "eslint-plugin-prettier";
import eslintNestJs from "@darraghor/eslint-plugin-nestjs-typed";
import globals from "globals";
import importXPlugin from "eslint-plugin-import-x";

export default defineConfig([
  eslint.configs.recommended,
  tseslint.configs.strictTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      prettier: prettierPlugin,
      "import-x": importXPlugin,
    },
    rules: {
      "prettier/prettier": "error",
      "no-console": "error",
      "no-debugger": "error",
      "no-duplicate-case": "error",
      "@typescript-eslint/no-extraneous-class": "off",
      "import-x/order": [
        "error",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            ["parent", "sibling", "index"],
            "object",
            "type",
          ],
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
          "newlines-between": "always",
        },
      ],
    },
  },
  eslintNestJs.configs.flatRecommended,
  {
    ignores: ["dist", "node_modules", "eslint.config.mjs", "build"],
  },
  prettierConfig,
]);
