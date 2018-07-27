module.exports = {
  verbose: true,
  rootDir: './',
  moduleFileExtensions: ['js'],
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?)$',
  testPathIgnorePatterns: ['<rootDir>/node_modules/'],
  collectCoverage: true,
  testEnvironment: 'node',
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/types/**/*.{js,jsx}',
    '!**/node_modules/**',
    '!**/vendor/**'
  ]
};
