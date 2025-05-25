module.exports = {
  root: true,
  // Använd enkel konfiguration som fungerar i CI/CD
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended'
  ],
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module'
  },
  env: {
    node: true,
    es6: true
  },
  rules: {
    'no-unused-vars': 'off', // Stäng av JS rule
    '@typescript-eslint/no-unused-vars': 'error', // Använd TS rule istället
    'prefer-const': 'error',
    'no-console': 'warn'
  },
  ignorePatterns: [
    'dist/',
    'coverage/',
    '*.js'
  ]
};
