module.exports = {
  env: {
    es2021: true,
    node: true
  },
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module'
  },
  extends: ['eslint:recommended', 'prettier'],
  plugins: ['prettier', '@babel'],
  rules: {
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto'
      }
    ],
    'no-unused-vars': [2, { args: 'all', argsIgnorePattern: '^_' }]
  }
};
