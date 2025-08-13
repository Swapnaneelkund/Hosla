import js from '@eslint/js';
import pluginImport from 'eslint-plugin-import';
import prettier from 'eslint-config-prettier';

const importRules = pluginImport.configs.recommended.rules;

export default [
  js.configs.recommended,
  prettier,
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: 'module',
      globals: {
        console: 'readonly',
        process: 'readonly',
        setTimeout: 'readonly',
        fetch: 'readonly',
        describe: 'readonly',
        test: 'readonly',
        expect: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly'
      }
    },
    plugins: { import: pluginImport },
    rules: {
      ...importRules,
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'import/order': ['warn', { groups: ['builtin','external','internal','parent','sibling','index'], 'newlines-between': 'always' }]
    }
  }
];
