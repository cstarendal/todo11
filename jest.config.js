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
      displayName: 'infrastructure',
      preset: 'ts-jest',
      testMatch: ['<rootDir>/packages/infrastructure/**/*.test.ts'],
      testEnvironment: 'node',
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
    '!packages/electron-app/**/*',
    '!**/backup/**',
    '!**/*.backup.*',
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
    '.*backup.*',
    '.*\\.backup\\..*',
    '/packages/.*/backup/',
    '.*/backup/.*',
    '/helpers/',
    '.*helpers.*',
  ],
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90
    }
  },
  coverageReporters: ['text', 'lcov', 'html']
};
