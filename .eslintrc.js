module.exports = {
  plugins: ['lodash'],
  rules: {
    'class-methods-use-this': 'off',
    'no-extend-native': 'off',
    'no-param-reassign': 'off',

    'lodash/import-scope': 'error',
  },
  env: {
    browser: true,
    node: true,
  },
  extends: ['airbnb-base'],
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
