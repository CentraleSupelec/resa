module.exports = {
  extends: ["airbnb-base", "prettier"],
  env: {
    browser: true,
    jest: true,
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
  },
  rules: {
    "no-control-regex": "off",
    "no-console": "off",
    "no-underscore-dangle": "off",
    "prefer-destructuring": "off",
    camelcase: "off",
    "no-async-promise-executor": "off",
    "import/prefer-default-export": "off",
  },
};
