module.exports = {
  root: true,
  env: { es2023: true, node: true, jest: true },
  extends: [
    'eslint:recommended',
    'plugin:import/recommended',
    'plugin:jsdoc/recommended',
    'prettier'
  ],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  rules: {
    'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    'import/order': ['warn', { groups: ['builtin','external','internal','parent','sibling','index'], 'newlines-between': 'always' }],
    'jsdoc/require-param-description': 0,
    'jsdoc/require-returns-description': 0,
    'jsdoc/tag-lines': 0
  },
  settings: {
    jsdoc: { mode: 'typescript' }
  }
};
