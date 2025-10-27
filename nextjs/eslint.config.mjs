/**
 * ESLint Configuration (Flat Config) - White Cross Healthcare Platform
 *
 * Modern ESLint flat configuration for Next.js 15+ with TypeScript support.
 * Uses the new flat config format introduced in ESLint v9, which provides better
 * composition, clearer precedence rules, and improved performance.
 *
 * Key Features:
 * - Next.js Core Web Vitals rules for performance and accessibility
 * - TypeScript-specific linting rules for type safety
 * - Storybook plugin support for component development
 * - Custom ignore patterns for build artifacts
 *
 * Ruleset Components:
 * - Core Web Vitals: Performance, accessibility, and best practices
 * - TypeScript: Type-safe coding patterns and conventions
 * - Healthcare-specific: Code quality standards for patient-critical code
 *
 * Ignored Directories:
 * - .next/: Next.js build output
 * - out/: Static export output
 * - build/: Production build artifacts
 * - next-env.d.ts: Next.js TypeScript declarations
 *
 * Healthcare Code Quality Standards:
 * - Strict type checking for PHI handling
 * - Accessibility rules for healthcare UI (WCAG 2.1 AAA)
 * - Performance rules for responsive healthcare dashboards
 * - Security rules for HIPAA-compliant code
 *
 * Migration from Legacy Config:
 * - Replaces .eslintrc.json with flat config
 * - Uses ESM import syntax (not CommonJS require)
 * - Flattened rule precedence (no extends/overrides)
 *
 * @module eslint.config
 * @see https://eslint.org/docs/latest/use/configure/configuration-files
 * @see https://nextjs.org/docs/app/building-your-application/configuring/eslint
 * @see https://github.com/storybookjs/eslint-plugin-storybook
 * @version 1.0.0
 * @since 2025-10-26
 */

// Storybook ESLint plugin for component story linting
// See: https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import { defineConfig, globalIgnores } from "eslint/config";

// Next.js Core Web Vitals rules (performance, accessibility, best practices)
import nextVitals from "eslint-config-next/core-web-vitals";

// Next.js TypeScript rules (type safety and TypeScript conventions)
import nextTs from "eslint-config-next/typescript";

/**
 * ESLint configuration array using flat config format.
 *
 * Configuration is composed of multiple rulesets with explicit precedence.
 * Later configurations override earlier ones.
 *
 * @type {import('eslint').Linter.FlatConfig[]}
 */
const eslintConfig = defineConfig([
  // Next.js Core Web Vitals rules
  // Includes performance, accessibility, and React best practices
  ...nextVitals,

  // Next.js TypeScript-specific rules
  // Adds type-safe coding patterns and TypeScript conventions
  ...nextTs,

  // Override default ignores of eslint-config-next
  // Custom ignore patterns for healthcare platform build artifacts
  globalIgnores([
    // Next.js build output directory
    ".next/**",

    // Static export output directory
    "out/**",

    // Production build artifacts
    "build/**",

    // Next.js TypeScript declarations (auto-generated)
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
