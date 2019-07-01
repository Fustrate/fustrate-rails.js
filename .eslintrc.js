module.exports = {
  rules: {
    "class-methods-use-this": 0,
    "no-extend-native": 0,
    "no-param-reassign": 0,
  },
  env: {
    browser: true,
    node: true,
  },
  extends: "airbnb-base",
  overrides: [
    {
      files: [
        "**/*.spec.js"
      ],
      env: {
        jest: true
      },
      plugins: ["jest"],
      rules: {
        "jest/no-disabled-tests": "warn",
        "jest/no-focused-tests": "error",
        "jest/no-identical-title": "error",
        "jest/prefer-to-have-length": "warn",
        "jest/valid-expect": "error"
      }
    }
  ],
};
