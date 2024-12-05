const envs = require("dotenv").config({ path: "./.env.test" });

global.console.log = jest.fn();

module.exports = {
  roots: ["<rootDir>/src"],
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        tsconfig: "tsconfig.json",
      },
    ],
  },
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$",
  coverageReporters: ["clover", "json", "lcov", ["text", { skipFull: true }]],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  env: {
    ...envs.parsed,
    NODE_ENV: "test",
  },
};
