import nextPlugin from '@next/eslint-plugin-next';
import queryPlugin from '@tanstack/eslint-plugin-query';

/** @type {import("eslint").Linter.Config[]} */
export default [
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      '@next/next': nextPlugin,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      '@next/next/no-img-element': 'off',
    },
  },
  ...queryPlugin.configs['flat/recommended'],
];
