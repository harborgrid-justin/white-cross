// @ts-check
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['eslint.config.mjs'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: 'module',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      "prettier/prettier": ["error", { endOfLine: "auto" }],

      // CRITICAL SECURITY: Prevent direct process.env access
      // All configuration should go through ConfigService
      'no-restricted-syntax': [
        'error',
        {
          selector: 'MemberExpression[object.name="process"][property.name="env"]',
          message:
            'Direct process.env access is not allowed. ' +
            'Use ConfigService instead for type-safe, validated configuration. ' +
            'See /workspaces/white-cross/backend/CONFIGURATION_GUIDE.md for migration guide. ' +
            'Allowed locations: src/config/*.config.ts, main.ts, and test files only.',
        },
      ],

      // LOGGING STANDARDS: Prevent console.log usage
      // All logging should go through LoggerService
      'no-console': [
        'error',
        {
          allow: ['warn', 'error'],
        },
      ],

      // Additional restricted properties
      'no-restricted-properties': [
        'error',
        {
          object: 'console',
          property: 'log',
          message:
            'console.log is not allowed. Use LoggerService instead for structured logging. ' +
            'Import: import { LoggerService } from \'@/shared/logging/logger.service\'; ' +
            'Example: logger.log(\'message\', { context: \'YourClass\' }); ' +
            'For debug info: logger.debug(\'message\'); ' +
            'For errors: logger.error(\'message\', error); ' +
            'See docs/adr/ERROR_HANDLING_STANDARDS.md for details.',
        },
        {
          object: 'console',
          property: 'info',
          message: 'console.info is not allowed. Use LoggerService.log() instead.',
        },
        {
          object: 'console',
          property: 'debug',
          message: 'console.debug is not allowed. Use LoggerService.debug() instead.',
        },
        {
          object: 'console',
          property: 'trace',
          message: 'console.trace is not allowed. Use LoggerService.verbose() instead.',
        },
      ],
    },
  },
  // Exception: Allow process.env in configuration files and main.ts
  {
    files: [
      'src/config/**/*.ts',
      'src/main.ts',
      '**/*.spec.ts',
      '**/*.test.ts',
      'test/**/*.ts',
    ],
    rules: {
      'no-restricted-syntax': 'off',
    },
  },
);
