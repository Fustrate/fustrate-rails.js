module.exports = {
  rules: {
    'class-methods-use-this': 0,
    'no-extend-native': 0,
    'no-param-reassign': 0,
  },
  env: {
    browser: true,
    node: true,
  },
  extends: ['airbnb-base', 'prettier'],
  overrides: [
    {
      files: ['**/*.spec.js'],
      env: {
        jest: true,
      },
      plugins: ['jest'],
      rules: {
        'jest/expect-expect': 'warn',
        'jest/no-disabled-tests': 'warn',
        'jest/no-focused-tests': 'error',
        'jest/no-identical-title': 'error',
        'jest/no-test-prefixes': 'warn',
        'jest/no-truthy-falsy': 'warn',
        'jest/prefer-to-be-null': 'warn',
        'jest/prefer-to-be-undefined': 'warn',
        'jest/prefer-to-contain': 'warn',
        'jest/prefer-to-have-length': 'warn',
        'jest/valid-expect': 'error',
      },
    },
  ],
};
