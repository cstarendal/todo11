module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/packages'],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  projects: [
    {
      displayName: 'domain',
      preset: 'ts-jest',
      testMatch: ['<rootDir>/packages/domain/**/*.test.ts'],
      testEnvironment: 'node',
      transform: {
        '^.+\\.ts$': 'ts-jest',
      },
      moduleFileExtensions: ['ts', 'js'],
    },
    {
      displayName: 'application', 
      preset: 'ts-jest',
      testMatch: ['<rootDir>/packages/application/**/*.test.ts'],
      testEnvironment: 'node',
      transform: {
        '^.+\\.ts$': 'ts-jest',
      },
      moduleFileExtensions: ['ts', 'js'],
    },
    {
      displayName: 'shared',
      preset: 'ts-jest',
      testMatch: ['<rootDir>/packages/shared/**/*.test.ts'], 
      testEnvironment: 'node',
      transform: {
        '^.+\\.ts$': 'ts-jest',
      },
      moduleFileExtensions: ['ts', 'js'],
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
    '!**/backup/**',
    '!**/*.backup.*',
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
    '.*backup.*',
    '.*\\.backup\\..*',
    '/packages/.*/backup/',
    '.*/backup/.*',
    'packages/ui-web/backup',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  coverageReporters: ['text', 'lcov', 'html']
};
