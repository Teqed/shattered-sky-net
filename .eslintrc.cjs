/* eslint-env node */
// require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
  // parser: '@typescript-eslint/parser',
  // plugins: ['@typescript-eslint', 'prettier'],
  root: true,
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    // 'prettier',
    '@vue/eslint-config-typescript',
    // '@vue/eslint-config-prettier',
    // '@nuxtjs/eslint-module',
    '@nuxtjs/eslint-config-typescript',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    'vue/html-end-tags': 'off',
	'unicorn/filename-case': 'off',
    // 'unicorn/filename-case': 'warn',
    'no-tabs': 'off',
    // 'no-tabs': ['warn', { allowIndentationTabs: true }],
    'comma-dangle': 'off',
    semi: 'off',
    '@typescript-eslint/quotes': ['warn', 'single'],
    'vue/multi-word-component-names': 'off',
    'no-console': 'off',
    '@typescript-eslint/indent': ['off'],
    indent: 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/return-await': 'off',
    'object-curly-newline': [
      'off',
      {
        ObjectExpression: 'always',
        ObjectPattern: { multiline: true },
        ImportDeclaration: { multiline: true, minProperties: 3 },
        ExportDeclaration: { multiline: true, minProperties: 3 },
      },
    ],
    'object-curly-spacing': ['off'],
    '@typescript-eslint/object-curly-spacing': 'off',
    'max-len': ['warn', { code: 120 }],
    'no-plusplus': ['warn', { allowForLoopAfterthoughts: true }],
    'implicit-arrow-linebreak': ['off', 'beside'], // Interferes with Prettier
    // 'prettier/prettier': [
    //   'warn',
    //   {
    //     singleQuote: true,
    //     trailingComma: 'all',
    //     // printWidth: 100,
    //     // tabWidth: 2,
    //     semi: true,
    //     // bracketSpacing: true,
    //     // jsxBracketSameLine: false,
    //     // parser: 'typescript',
    //     // useTabs: true,
    //     arrowParens: 'avoid',
    //     selfClosingElements: 'none',
    //     overrides: [
    //       {
    //         files: ['*.ts', '*.tsx', '*.mts', '*.mtx'], // Your TypeScript files extension
    //         options: {
    //           parser: 'typescript',
    //         },
    //       },
    //       {
    //         files: ['*.vue'], // Your Vue files extension
    //         options: {
    //           parser: 'vue-eslint-parser',
    //         },
    //       },
    //     ],
    //     endOfLine: 'lf',
    //     quoteProps: 'as-needed',
    //   },
    // ],
    'no-unused-vars': 'off',
    'node/no-missing-import': 0,
    'unicorn/no-array-for-each': 'off',
    'prefer-const': 'warn',
    'unicorn/no-unused-properties': 'warn',
    // '@typescript-eslint/naming-convention': 'warn',
    // '@typescript-eslint/no-unnecessary-type-assertion': 'warn',
    '@typescript-eslint/sort-type-union-intersection-members': 'warn',
    'unicorn/no-await-expression-member': 'warn',
    'no-await-in-loop': 'warn',
    'promise/prefer-await-to-then': 'warn',
    'import/prefer-default-export': 'warn',
    'unicorn/prevent-abbreviations': 'warn',
    'unicorn/no-nested-ternary': 'warn',
    'unicorn/no-null': 'warn',
    'unicorn/no-useless-undefined': 'warn',
    'unicorn/prefer-query-selector': 'warn',
    'import/order': 'warn',
    'func-style': ['warn'],
    '@typescript-eslint/consistent-type-assertions': 'warn',
    '@typescript-eslint/brace-style': [
      'off',
      'allman',
      { allowSingleLine: true },
    ],
  },
};
