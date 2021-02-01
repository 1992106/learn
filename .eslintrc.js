module.exports = {
    extends: [
        'alloy',
    ],
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint'],
    rules: {
        // 禁止使用 var
        'no-var': "error",
        // 优先使用 interface 而不是 type
        '@typescript-eslint/consistent-type-definitions': [
            "error",
            "interface"
        ],
        'no-unused-vars': "off",
        "no-cond-assign": "off",
        "no-param-reassign": "off",
        "no-eq-null": "off",
        "eqeqeq": "off",
        "no-promise-executor-return": "off",
        "no-return-assign": "off",
        "max-params": ["off"],
        "one-var": ["off", {
          "var": "always", // Exactly one var declaration per function
          "let": "always", // Exactly one let declaration per block
          "const": "never" // Exactly one declarator per const declaration per block
      }],
      "no-sequences": ["off"]
    }
}

// "off" or 0 - turn the rule off
// "warn" or 1 - turn the rule on as a warning (doesn't affect exit code)
// "error" or 2 - turn the rule on as an error (exit code will be 1)
