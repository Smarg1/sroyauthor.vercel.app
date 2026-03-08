import js from '@eslint/js';
import nextPlugin from '@next/eslint-plugin-next';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import importPlugin from 'eslint-plugin-import';
import perfectionist from 'eslint-plugin-perfectionist';
import reactPlugin from 'eslint-plugin-react';

export default [
  {
    ignores: [
      'node_modules',
      '.next',
      'dist',
      'build',
      'coverage',
      'out',
      'eslint.config.mjs',
      'prettier.config.mjs',
      'postcss.config.mjs',
      'next.config.ts',
      'global.d.ts',
      'next-env.d.ts',
      'src/lib/types/db.types.ts',
    ],
  },

  js.configs.recommended,

  nextPlugin.configs['core-web-vitals'],

  {
    files: ['**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: ['./tsconfig.json'],
        tsconfigRootDir: import.meta.dirname,
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: {
        process: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        console: 'readonly',
        requestAnimationFrame: 'readonly',
        cancelAnimationFrame: 'readonly',
        React: 'readonly',
      },
    },

    plugins: {
      react: reactPlugin,
      import: importPlugin,
      perfectionist,
      '@typescript-eslint': tsPlugin,
    },

    settings: {
      react: { version: 'detect' },
      'import/resolver': {
        typescript: { project: './tsconfig.json' },
      },
    },

    rules: {
      /* ---------------- CODE QUALITY ---------------- */
      'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
      'no-debugger': 'error',
      'no-var': 'error',
      'prefer-const': 'error',
      'prefer-template': 'error',
      eqeqeq: ['error', 'always'],
      'no-implicit-coercion': 'error',
      'no-useless-return': 'error',
      'no-unreachable': 'error',
      'no-await-in-loop': 'error',
      'require-atomic-updates': 'error',

      /* ---------------- TYPESCRIPT SAFETY ---------------- */
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-misused-promises': 'error',
      '@typescript-eslint/no-unnecessary-condition': 'error',
      '@typescript-eslint/no-unnecessary-type-assertion': 'error',
      '@typescript-eslint/prefer-nullish-coalescing': 'error',
      '@typescript-eslint/prefer-optional-chain': 'error',
      '@typescript-eslint/strict-boolean-expressions': [
        'error',
        {
          allowString: false,
          allowNumber: true,
          allowNullableObject: true,
          allowNullableBoolean: true,
        },
      ],
      '@typescript-eslint/switch-exhaustiveness-check': 'error',

      /* ---------------- REACT STRUCTURE ---------------- */
      'react/jsx-key': 'error',
      'react/jsx-no-duplicate-props': 'error',
      'react/self-closing-comp': 'error',
      'react/no-unknown-property': 'error',
      'react/jsx-boolean-value': ['error', 'never'],
      'react/jsx-fragments': ['error', 'syntax'],
      'react/jsx-no-useless-fragment': 'error',

      /* ---------------- REACT PERFORMANCE ---------------- */
      'react/jsx-no-bind': [
        'warn',
        { allowArrowFunctions: true, allowBind: false, ignoreRefs: true },
      ],
      'react/jsx-no-leaked-render': ['error', { validStrategies: ['ternary'] }],
      'react/no-unstable-nested-components': ['warn', { allowAsProps: true }],
      'react/jsx-no-constructed-context-values': 'error',

      /* ---------------- NEXT.JS ---------------- */
      '@next/next/no-img-element': 'warn',
      '@next/next/no-html-link-for-pages': 'off',
      '@next/next/no-sync-scripts': 'error',

      /* ---------------- IMPORT SANITY ---------------- */
      'import/no-duplicates': 'error',
      'import/no-cycle': 'warn',
      'import/no-self-import': 'error',
      'import/no-useless-path-segments': 'error',
      'import/no-anonymous-default-export': [
        'warn',
        {
          allowArray: false,
          allowArrowFunction: true,
          allowAnonymousClass: false,
          allowAnonymousFunction: true,
        },
      ],
      'import/no-named-as-default-member': 'warn',

      /* ---------------- STRUCTURE DISCIPLINE (PERFECTIONIST) ---------------- */
      'perfectionist/sort-imports': ['warn', { type: 'natural', order: 'asc' }],
      'perfectionist/sort-exports': ['warn', { type: 'natural', order: 'asc' }],
      'perfectionist/sort-object-types': ['warn', { type: 'natural', order: 'asc' }],
      'perfectionist/sort-union-types': ['warn', { type: 'natural', order: 'asc' }],
    },
  },
];
