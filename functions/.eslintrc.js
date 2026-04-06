module.exports = {
  env: {
    es6: true,
    node: true
  },
  parserOptions: {
    ecmaVersion: 2020
  },
  extends: ["eslint:recommended", "google"],
  rules: {
    "no-restricted-globals": ["error", "name", "length"],
    "prefer-arrow-callback": "error",
    "quotes": ["error", "double", {allowTemplateLiterals: true}],
    "indent": ["error", 2],
    "max-len": ["error", {code: 120}],
    "comma-dangle": ["error", "never"],
    "arrow-parens": ["error", "as-needed"]
  },
  overrides: [
    {
      files: ["**/*.spec.*"],
      env: {
        mocha: true
      },
      rules: {}
    }
  ],
  globals: {}
};
