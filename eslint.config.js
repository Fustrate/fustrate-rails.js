import path from 'node:path';

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

import jest from 'eslint-plugin-jest';
import lodash from 'eslint-plugin-lodash';
import stylistic from '@stylistic/eslint-plugin';
import unicorn from 'eslint-plugin-unicorn';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  unicorn.configs['flat/recommended'],
  {
    // eslint-plugin-lodash doesn't have a flat config option (yet?)
    plugins: { lodash },
    rules: lodash.configs.recommended.rules,
  },
  stylistic.configs.customize({
    indent: 2,
    semi: true,
    braceStyle: '1tbs',
    quoteProps: 'consistent-as-needed',
    arrowParens: true,
    commaDangle: 'always-multiline',
  }),
  {
    plugins: { stylistic },
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: path.resolve('.'),
      },
    },
    rules: {
      // ----------------------------------------------- Disabled Rules ------------------------------------------------

      // I want to allow 0 spaces between property definitions.
      'lines-between-class-members': 'off',

      'no-alert': 'off',

      // This is just ridiculous - can't even assign to a property of a parameter
      'no-param-reassign': 'off',

      // I'm just not there yet on types
      // https://typescript-eslint.io/rules/
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/require-await': 'off',

      // -------------------------------------------- Disabled Lodash Rules --------------------------------------------

      // Wants to use _.constant('constant') instead of a getter that returns a constant
      'lodash/prefer-constant': 'off',

      // `_.pull(obj, 'item')` mutates the collection passed, this prefers `obj = _.without(obj, 'item')`
      'lodash/prefer-immutable-method': 'off',

      // I prefer to use native methods when possible.
      'lodash/prefer-lodash-method': 'off',
      'lodash/prefer-lodash-typecheck': 'off',

      // Empty functions are fine by me.
      'lodash/prefer-noop': 'off',

      // Recommends `_.map(col, 'owner.name')` instead of `col.map((prop) => prop.owner.name)`
      'lodash/prop-shorthand': 'off',

      // ------------------------------------------- Disabled Unicorn Rules --------------------------------------------

      // `for (const x of y)` is restricted by airbnb's `no-restricted-syntax` rule.
      'unicorn/no-array-for-each': 'off',

      // `window.prompt` returns `null` when you click the cancel button. I don't get this rule.
      'unicorn/no-null': 'off',

      // When nodes are detached/attached, the dataset disappears whereas data- attributes live on.
      'unicorn/prefer-dom-node-dataset': 'off',

      // This is in ES2021, but we target ES6
      'unicorn/prefer-string-replace-all': 'off',

      // I use abbreviations, sue me.
      'unicorn/prevent-abbreviations': 'off',

      // --------------------------------------------- Tweak the defaults ----------------------------------------------

      // Ignore class definition lines that are too long
      'max-len': ['error', 120, 2, { ignoreStrings: true }],
    },
  },
  {
    files: ['**/*.spec.ts'],
    extends: [jest.configs['flat/recommended']],
    rules: {
      // Disabled tests have
      'jest/no-disabled-tests': 'off',
      '@typescript-eslint/no-empty-function': 'off',
    },
  },
);
