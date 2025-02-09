module.exports = {
  testEnvironment: 'node',
  setupFilesAfterEnv: ['./backend/src/setupTests.js', './frontend/src/setupTests.js'],
  moduleFileExtensions: ['js', 'ts', 'json', 'node'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
};