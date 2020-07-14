module.exports = {
  extends: 'stylelint-config-standard',
  rules: {
    'color-named': 'never',
    'font-family-name-quotes': 'always-where-recommended',
    'font-weight-notation': 'numeric',
    'function-url-quotes': 'always',
    'value-no-vendor-prefix': true,
    'value-list-comma-newline-before': 'never-multi-line',
    'selector-attribute-quotes': 'always',
    'selector-max-specificity': '0,5,2',
    'max-nesting-depth': 3,
    'no-unknown-animations': true,
  },
}
