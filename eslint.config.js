import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  {
    files: ['src/**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    ignores: ['**/node_modules/**', 'dist/**', 'build/**']
  },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ...pluginReact.configs.flat.recommended,
    rules: {
      'react/no-unescaped-entities': 'off',
      "@typescript-eslint/no-explicit-any": "off",
      "no-console": ["error", { allow: ["warn", "error"] }]
    },
  },
];
