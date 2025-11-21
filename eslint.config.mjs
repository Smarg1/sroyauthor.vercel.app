import { dirname } from 'path'
import { fileURLToPath } from 'url'

import nextPlugin from '@next/eslint-plugin-next'
import tsPlugin from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import importPlugin from 'eslint-plugin-import'
import reactPlugin from 'eslint-plugin-react'
import reactHooksPlugin from 'eslint-plugin-react-hooks'
import fg from 'fast-glob'
import globals from 'globals'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const tsconfigs = await fg('**/tsconfig.json', { ignore: ['**/node_modules/**', '**/.next/**', '**/dist/**', '**/build/**', '**/out/**'] })

export default [
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: { project: tsconfigs, tsconfigRootDir: __dirname },
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.worker,
        ...globals.webextensions,
        ...globals.serviceworker,
        ...globals.window,
      },
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    plugins: { '@typescript-eslint': tsPlugin },
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-misused-promises': ['error', { checksVoidReturn: false }],
      '@typescript-eslint/require-await': 'error',
      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
      '@typescript-eslint/prefer-nullish-coalescing': 'error',
      '@typescript-eslint/prefer-optional-chain': 'error',
      '@/quotes': ['error', 'single', { avoidEscape: true }],
      '@/semi': ['error', 'always'],
      '@/space-before-function-paren': ['error', 'never'],
      '@/indent': ['error', 2],
      '@/comma-dangle': ['error', 'always-multiline'],
    },
  },
  {
    files: ['**/*.{ts,tsx,js,jsx,mjs,cjs}'],
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      '@next/next': nextPlugin,
      import: importPlugin,
    },
    settings: {
      react: { version: 'detect' },
      'import/resolver': {
        typescript: { project: tsconfigs },
        node: { extensions: ['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs'] },
      },
    },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      '@next/next/no-img-element': 'off',
      'import/order': ['error',{
        groups:['builtin','external','internal','parent','sibling','index'],
        'newlines-between':'always',
        alphabetize:{ order:'asc', caseInsensitive:true }
      }],
      'import/no-unresolved':'error',
      'import/no-cycle':'error',
      'import/newline-after-import':['error',{ count:1 }],
    },
    ignores: [
      'node_modules/**',
      '.next/**',
      'out/**',
      'build/**',
      'dist/**',
      '.vercel/**',
      '.next/**',
      '.vscode/**',
      '**/*.d.ts',
      '**/*.map',
      'next-env.d.ts',
    ],
  },
]
