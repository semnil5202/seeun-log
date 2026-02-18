import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';

/** @type {import("eslint").Linter.Config[]} */
export default [
  {
    files: ['**/*.{jsx,tsx}'],
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      ...reactPlugin.configs.flat.recommended.rules,
      ...reactPlugin.configs.flat['jsx-runtime'].rules,
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react/jsx-curly-brace-presence': ['error', { props: 'never', children: 'never' }],
      'react/no-unknown-property': ['error', { ignore: ['css'] }],
      'no-restricted-syntax': [
        'error',
        {
          selector: "TSQualifiedName[left.name='React']",
          message: 'React.* 네임스페이스 대신, import type을 사용해주세요.',
        },
        {
          selector: "JSXMemberExpression[object.name='React']",
          message: 'React.* 네임스페이스 대신, import를 사용해주세요.',
        },
      ],
    },
  },
];
