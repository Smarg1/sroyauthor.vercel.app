/** @type {import('prettier').Config} */
const config = {
  printWidth: 90,
  tabWidth: 2,
  useTabs: false,

  semi: true,
  singleQuote: true,
  quoteProps: 'as-needed',

  trailingComma: 'all',
  arrowParens: 'always',

  bracketSpacing: true,
  bracketSameLine: false,

  endOfLine: 'lf',

  plugins: ['prettier-plugin-tailwindcss'],
};

export default config;
