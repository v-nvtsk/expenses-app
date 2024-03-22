module.exports = {
  extends: "stylelint-config-recommended",
  plugins: ["stylelint-css-modules"],
  rules: {
    "css-modules/composed-class-names": true,
    "css-modules/css-variables": true,
  },
  ignoreFiles: ["src/app/bootstrap.min.css"],
  cache: true,
};
