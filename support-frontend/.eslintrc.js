module.exports = {
  extends: '@guardian/eslint-config-typescript',
  rules: {
    // TODO: update this to 'warn' or delete once the post-migration fixing process is done
    "import/no-default-export": "off",
    "react/function-component-definition": [1, {
      "namedComponents": "function-declaration",
      "unnamedComponents": "function-expression",
    }],
    "@emotion/pkg-renaming": "error",
  },
  settings: {
    'import/resolver': {
      typescript: {
        project: 'tsconfig.json',
      }
    }
  },
  plugins: [
    "@emotion",
    "react"
  ]
}
