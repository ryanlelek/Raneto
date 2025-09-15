import js from '@eslint/js';
import promise from 'eslint-plugin-promise';
import unusedImports from 'eslint-plugin-unused-imports';
import jest from 'eslint-plugin-jest';
import globals from 'globals';

export default [
  js.configs.recommended,
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
    plugins: {
      promise,
      'unused-imports': unusedImports,
      jest,
    },
    rules: {
      camelcase: 0,
      curly: 2,
      eqeqeq: 2,
      'func-call-spacing': 0,
      'guard-for-in': 2,
      indent: ['error', 2, { SwitchCase: 1 }],
      'key-spacing': 0,
      'max-depth': ['error', { max: 4 }],
      'no-irregular-whitespace': 2,
      'no-multi-spaces': 0,
      'padded-blocks': 0,
      quotes: ['error', 'single', { allowTemplateLiterals: true }],
      semi: 0,
      'no-path-concat': 1,
      'no-undef': 2,
      'unused-imports/no-unused-imports': 'error',
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'no-var': 1,
    },
  },
];
