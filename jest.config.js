// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

require('./src/polyfills');

module.exports = {
  moduleFileExtensions: ['js', 'json'],
  roots: ['./src/', './test/'],
  // resetMocks: false,
  // restoreMocks: false,
  // timers: 'real',
  // verbose: null,
  // watchman: true,
  testEnvironment: 'jsdom',
};
