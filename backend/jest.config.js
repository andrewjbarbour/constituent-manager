module.exports = {
  testEnvironment: "node",
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
  moduleFileExtensions: ["ts", "js", "json", "node"],
  testRegex: "(/__tests__/.*|(\\.|/))(test|spec)\\.(ts|js)$",
  coverageDirectory: "coverage",
  collectCoverage: true,
  preset: "ts-jest",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  globalSetup: "<rootDir>/jest.globalSetup.js",
  globals: {
    "ts-jest": {
      diagnostics: false,
    },
  },
};
