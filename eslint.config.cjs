const tsParser = require('@typescript-eslint/parser');
const tsPlugin = require('@typescript-eslint/eslint-plugin');

const browserGlobals = {
  document: 'readonly',
  fetch: 'readonly',
  localStorage: 'readonly',
  window: 'readonly',
};

const nodeGlobals = {
  Buffer: 'readonly',
  __dirname: 'readonly',
  console: 'readonly',
  module: 'readonly',
  process: 'readonly',
  require: 'readonly',
};

const jestGlobals = {
  afterAll: 'readonly',
  beforeAll: 'readonly',
  describe: 'readonly',
  expect: 'readonly',
  it: 'readonly',
  jest: 'readonly',
};

const sharedRules = {
  '@typescript-eslint/no-unused-vars': [
    'warn',
    {
      argsIgnorePattern: '^_',
      caughtErrorsIgnorePattern: '^_',
      varsIgnorePattern: '^_',
    },
  ],
  'no-unused-vars': 'off',
};

module.exports = [
  {
    ignores: [
      '**/dist/**',
      '**/node_modules/**',
      '**/coverage/**',
      '**/*.tsbuildinfo',
    ],
  },
  {
    files: ['client/src/**/*.{js,jsx,ts,tsx}', 'shared/src/**/*.ts'],
    languageOptions: {
      ecmaVersion: 'latest',
      globals: browserGlobals,
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      sourceType: 'module',
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: sharedRules,
  },
  {
    files: ['server/src/**/*.ts'],
    languageOptions: {
      ecmaVersion: 'latest',
      globals: nodeGlobals,
      parser: tsParser,
      sourceType: 'module',
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: sharedRules,
  },
  {
    files: ['server/tests/**/*.ts'],
    languageOptions: {
      ecmaVersion: 'latest',
      globals: {
        ...nodeGlobals,
        ...jestGlobals,
      },
      parser: tsParser,
      sourceType: 'module',
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: sharedRules,
  },
];
