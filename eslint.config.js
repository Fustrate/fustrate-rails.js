import path from 'node:path';

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

import jest from 'eslint-plugin-jest';
import lodash from 'eslint-plugin-lodash';
import stylistic from '@stylistic/eslint-plugin';
import unicorn from 'eslint-plugin-unicorn';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  stylistic.configs.customize({
    indent: 2,
    semi: true,
    braceStyle: '1tbs',
    quoteProps: 'consistent-as-needed',
    arrowParens: true,
    commaDangle: 'always-multiline',
  }),
  {
    // ---------------------------------------------- Tweak the defaults -----------------------------------------------
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: path.resolve('.'),
      },
    },
    rules: {
      // Only enforce spacing between methods, not properties.
      // https://eslint.style/rules/default/lines-between-class-members
      'lines-between-class-members': ['error', {
        enforce: [{ next: 'method', blankLine: 'always', prev: 'method' }],
      }],

      // Ignore class definition lines that are too long
      'max-len': ['error', 120, 2, { ignoreStrings: true }],

      'no-alert': 'off',

      // This is just ridiculous - can't even assign to a property of a parameter
      'no-param-reassign': 'off',
    },
  },
  {
    // ----------------------------------------------- Typescript Rules ------------------------------------------------
    rules: {
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

      '@typescript-eslint/restrict-template-expressions': ['error', {
        allowNumber: true,
      }],
    },
  },
  {
    // ------------------------------------------------- Lodash Rules --------------------------------------------------
    plugins: { lodash },
    rules: {
      // eslint-plugin-lodash doesn't have a flat config option (yet?)
      ...lodash.configs.recommended.rules,

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
    },
  },
  unicorn.configs['flat/recommended'],
  {
    // ------------------------------------------------- Unicorn Rules -------------------------------------------------
    rules: {
      // `window.prompt` returns `null` when you click the cancel button. I don't get this rule.
      'unicorn/no-null': 'off',

      // When nodes are detached/attached, the dataset disappears whereas data- attributes live on.
      'unicorn/prefer-dom-node-dataset': 'off',

      // This is in ES2021, but we target ES6
      'unicorn/prefer-string-replace-all': 'off',

      // I use abbreviations, sue me.
      'unicorn/prevent-abbreviations': 'off',
    },
  },
  {
    // -------------------------------------------------- Test Files ---------------------------------------------------
    files: ['**/*.spec.ts'],
    extends: [jest.configs['flat/recommended']],
    rules: {
      // Disabled tests have empty functions
      'jest/no-disabled-tests': 'off',
      '@typescript-eslint/no-empty-function': 'off',
    },
  },
);
