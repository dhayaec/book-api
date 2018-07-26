module.exports = {
  verbose: true,
  rootDir: './',
  // moduleFileExtensions: ['ts', 'tsx', 'js'], // un comment for coverage
  moduleFileExtensions: ['js'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$',
  testPathIgnorePatterns: ['<rootDir>/node_modules/'],
  collectCoverage: true,
  testEnvironment: 'node',
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/types/**/*.{ts,tsx}',
    '!**/node_modules/**',
    '!**/vendor/**'
  ]
};
