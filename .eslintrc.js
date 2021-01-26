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
        "max-params": [0]
    }
}
