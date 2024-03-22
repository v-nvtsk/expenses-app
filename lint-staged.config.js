module.exports = {
  "src/**/*.ts?(x)": () => "npm run tsc",
  "*.{ts,tsx}": ["npm run format --", "npm run lint --"],
  "*.{css,scss}": ["npm run style --", "npm run format --"],
  "*.md": "npm run format --list-different",
};

/* 

  "lint-staged": {
    "*.{ts,tsx}": [
      "npx prettier --write",
      "npx eslint --fix",
      "npx tsc --noEmit"
    ],
    "*.{css,scss}": [
      "npx stylelint --",
      "npx prettier --write"
    ],
    "*.md": "prettier --list-different"
  }
*/
