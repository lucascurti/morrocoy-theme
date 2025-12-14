import typescriptEslintPlugin from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import eslintConfigPrettier from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import globals from 'globals';

const OFF = 'off';
const WARN = 'warn';
const ERROR = 'error';

const eslintConfig = [
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      'build/**',
      'themes/**',
      'coverage/**',
      '**/*.config.js',
      '**/*.config.mjs',
    ],
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
      globals: {
        ...globals.node,
      },
    },
    plugins: {
      '@typescript-eslint': typescriptEslintPlugin,
      import: importPlugin,
    },
    rules: {
      // TypeScript rules
      '@typescript-eslint/no-explicit-any': ERROR,
      '@typescript-eslint/no-unused-vars': [
        ERROR,
        {
          args: 'after-used',
          ignoreRestSiblings: true,
          destructuredArrayIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          argsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-deprecated': ERROR,
      '@typescript-eslint/explicit-function-return-type': OFF,
      '@typescript-eslint/explicit-module-boundary-types': OFF,
      '@typescript-eslint/no-non-null-assertion': OFF,
      '@typescript-eslint/consistent-type-imports': OFF,

      // General rules
      'no-console': OFF, // Allow console in this CLI/build tool project
      'no-debugger': ERROR,
      'prefer-const': ERROR,
      'no-var': ERROR,
      eqeqeq: [ERROR, 'always', { null: 'ignore' }],
      curly: [ERROR, 'multi-line'],

      // Import rules
      'import/no-cycle': WARN,
      'import/no-self-import': ERROR,
      'import/no-duplicates': ERROR,
      'import/first': ERROR,
      'import/consistent-type-specifier-style': [ERROR, 'prefer-top-level'],
      'import/order': [
        ERROR,
        {
          'newlines-between': 'always',
          groups: ['type', 'builtin', 'external', ['parent', 'sibling'], 'index'],
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
      'sort-imports': [
        ERROR,
        {
          ignoreCase: true,
          ignoreDeclarationSort: true,
          ignoreMemberSort: false,
          memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
          allowSeparatedGroups: true,
        },
      ],
    },
  },
  {
    // Test files - relax some rules
    files: ['**/*.test.ts', '**/*.test.tsx', '**/*.spec.ts', '**/*.spec.tsx'],
    rules: {
      '@typescript-eslint/no-explicit-any': OFF,
    },
  },
  // Must be last: disables rules that conflict with Prettier
  eslintConfigPrettier,
];

export default eslintConfig;
