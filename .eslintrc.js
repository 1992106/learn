module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:prettier/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  plugins: ['@typescript-eslint'],
  rules: {
    'prettier/prettier': ["error", { endOfLine: 'lf' }],
    "no-undef": "off",
    "no-unused-vars": "off",
    "no-redeclare": "off",
    "no-useless-escape": "off",
    "no-prototype-builtins": "off",
    "no-constant-condition": "off",
    "guard-for-in": "off"
  }
}

// "off" or 0 - turn the rule off
// "warn" or 1 - turn the rule on as a warning (doesn't affect exit code)
// "error" or 2 - turn the rule on as an error (exit code will be 1)
