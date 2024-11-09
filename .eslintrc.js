module.exports = {
  root: true,
  extends: ['standard'],
  globals: {
    IS_DEVELOPMENT: 'readonly'
  },
  parserOptions: {
    emacVersion: 2020
  },
  rules: {
    'no-new': 0
  }
}
