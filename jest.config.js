module.exports = {
  verbose: true,
  rootDir: './',
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(tsx?)$',
  testPathIgnorePatterns: ['<rootDir>/node_modules/'],
  collectCoverage: true,
  testEnvironment: 'node',
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/types/**/*.{ts,tsx}',
    '!src/utils/createTypes.ts',
    '!**/node_modules/**',
    '!**/vendor/**',
    '!src/migration/**',
    '!src/subscriber/**',
    '!src/setup.ts',
    '!src/index.ts',
  ]
};
