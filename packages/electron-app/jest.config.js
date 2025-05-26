module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  setupFiles: ['<rootDir>/tests/renderer-smoke-polyfill.ts'],
  setupFilesAfterEnv: ['@testing-library/jest-dom'],
  moduleNameMapper: {
    '^electron$': '<rootDir>/__mocks__/electron.js',
    '\\.(css|less|scss|sass|styl)$': 'identity-obj-proxy',
  },
  testPathIgnorePatterns: ['/node_modules/', '/tests/e2e/'],
}; 