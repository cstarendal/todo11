module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/packages'],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  projects: [
    {
      displayName: 'domain',
      testMatch: ['<rootDir>/packages/domain/**/*.test.ts'],
      testEnvironment: 'node',
    },
    {
      displayName: 'application', 
      testMatch: ['<rootDir>/packages/application/**/*.test.ts'],
      testEnvironment: 'node',
    },
    {
      displayName: 'shared',
      testMatch: ['<rootDir>/packages/shared/**/*.test.ts'], 
      testEnvironment: 'node',
    },
    {
      displayName: 'ui-web',
      preset: 'ts-jest',
      testMatch: ['<rootDir>/packages/ui-web/**/*.test.ts'],
      testEnvironment: 'jsdom',
      setupFilesAfterEnv: ['<rootDir>/packages/ui-web/jest-setup.ts'],
      transform: {
        '^.+\\.ts$': 'ts-jest',
      },
      moduleFileExtensions: ['ts', 'js'],
    },
  ],
  collectCoverageFrom: [
    'packages/*/src/**/*.ts',
    '!packages/*/src/**/*.d.ts',
    '!packages/*/src/index.ts',
    '!packages/ui-web/src/vanilla-app.ts', // Exclude vanilla-app.ts
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/packages/ui-web/backup/',
    '<rootDir>/packages/ui-web/backup/',
    '**/backup/**',
  ],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100
    }
  },
  coverageReporters: ['text', 'lcov', 'html']
};
