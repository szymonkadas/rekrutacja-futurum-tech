import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'
import noRelativeImportPaths from 'eslint-plugin-no-relative-import-paths'
import tsParser from '@typescript-eslint/parser'

// I didn't play around it that much, just so it would work with the path aliases and recommended ones by vite
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['src/**/*.{ts,tsx}'],
    plugins: {
      'no-relative-import-paths': noRelativeImportPaths,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: { project: './tsconfig.app.json' },
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    settings: {
      'import/resolver': {
        typescript: {
          project: './tsconfig.app.json',
        },
      },
    },
    rules: {
      'no-relative-import-paths/no-relative-import-paths': [
        'error',
        {
          rootDir: 'src',     // punkt odniesienia
          prefix: '/src',     // alias, którego ma używać fixer
        },
      ],
    },
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
  },
])
