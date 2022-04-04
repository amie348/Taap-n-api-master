module.exports = {
    extends: ["plugin:react/recommended"],
    plugins: ["react", "eslint-plugin-prettier", "@typescript-eslint"],
    env: {
        browser: true,
        es6: true,
        jest: true,
    },
    globals: {
        Atomics: "readonly",
        SharedArrayBuffer: "readonly",
    },
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaFeatures: {
            tsx: true,
        },
        ecmaVersion: 2020,
        sourceType: "module",
        project: "./tsconfig.json",
    },
    rules: {
        "no-debugger": "error",
        "consistent-return": "error",
        "linebreak-style": "off",
        "react/forbid-prop-types": "warn",
        "no-console": "error",
        "react/forbid-prop-types": "warn",
        "react/no-array-index-key": "warn",
        "react/prop-types": "off",
        "react/jsx-uses-react": "error",
        "react/jsx-uses-vars": "error",
        "no-unused-vars": "off",
        "@typescript-eslint/no-unused-vars": "error",
        "prettier/prettier": [
            "error",
            {
                endOfLine: "auto",
            },
        ],
    },
};