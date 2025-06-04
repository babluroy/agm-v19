module.exports = {
  preset: 'jest-preset-angular',
  //https://github.com/thymikee/jest-preset-angular/issues/167#issuecomment-459686655
  modulePathIgnorePatterns: ["<rootDir>/dist/"],
  moduleNameMapper: {
    "^@babluroy/agm-core$": "<rootDir>/packages/core/src/public-api.ts",
    "^@babluroy/agm-core/(.*)$": "<rootDir>/packages/core/src/$1",
    "^@babluroy/agm-(.*)$": "<rootDir>/dist/$1"
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
};
