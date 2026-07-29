import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import importPlugin from 'eslint-plugin-import';
import prettier from 'eslint-plugin-prettier';

export default [
  // Ignore build + config files
  {
    ignores: ['dist', 'node_modules', './src/middlewares/system/validate.ts'],
  },

  // Base JS rules
  js.configs.recommended,

  // TypeScript rules (STRICT + SAFE)
  ...tseslint.configs.strictTypeChecked,

  {
    files: ['**/*.ts'],

    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
      },
    },

    plugins: {
      import: importPlugin,
      prettier,
    },

    rules: {
      // 🔒 Reliability rules
      'no-debugger': 'error',

      // 🔥 TypeScript strictness
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-explicit-any': 0,
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/await-thenable': 'error',

      // 🚫 Prevent bad patterns
      '@typescript-eslint/no-explicit-any': 'warn',

      // 📦 Import hygiene
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal'],
          'newlines-between': 'always',
        },
      ],

      // 🎨 Prettier integration
      'prettier/prettier': 'error',
    },
  },
];
