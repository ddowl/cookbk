module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
      "^.+\\.tsx?$": "ts-jest",
      "^.+\\.ts?$": "ts-jest",
  },
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.(js?|ts?|jsx?|tsx?)$",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  // collectCoverage: true,
};