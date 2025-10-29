import { axe, toHaveNoViolations } from 'jest-axe';
import { render } from '@testing-library/react';
import type { ReactElement } from 'react';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

/**
 * Test component for accessibility violations
 */
export async function testA11y(ui: ReactElement, options = {}) {
  const { container } = render(ui);
  const results = await axe(container, options);
  expect(results).toHaveNoViolations();
}

/**
 * Test component for specific accessibility rules
 */
export async function testA11yRules(
  ui: ReactElement,
  rules: string[],
  options = {}
) {
  const { container } = render(ui);
  const results = await axe(container, {
    rules: rules.reduce((acc, rule) => ({ ...acc, [rule]: { enabled: true } }), {}),
    ...options,
  });
  expect(results).toHaveNoViolations();
}

/**
 * Common accessibility test scenarios
 */
export const a11yScenarios = {
  /**
   * Test form accessibility
   */
  async testFormA11y(ui: ReactElement) {
    return testA11yRules(ui, [
      'label',
      'label-title-only',
      'form-field-multiple-labels',
      'input-button-name',
      'input-image-alt',
      'select-name',
      'aria-input-field-name',
    ]);
  },

  /**
   * Test button accessibility
   */
  async testButtonA11y(ui: ReactElement) {
    return testA11yRules(ui, [
      'button-name',
      'aria-command-name',
      'role-img-alt',
    ]);
  },

  /**
   * Test navigation accessibility
   */
  async testNavigationA11y(ui: ReactElement) {
    return testA11yRules(ui, [
      'landmark-one-main',
      'region',
      'skip-link',
      'bypass',
    ]);
  },

  /**
   * Test color contrast
   */
  async testColorContrast(ui: ReactElement) {
    return testA11yRules(ui, [
      'color-contrast',
      'link-in-text-block',
    ]);
  },

  /**
   * Test heading structure
   */
  async testHeadings(ui: ReactElement) {
    return testA11yRules(ui, [
      'heading-order',
      'empty-heading',
      'page-has-heading-one',
    ]);
  },

  /**
   * Test image accessibility
   */
  async testImageA11y(ui: ReactElement) {
    return testA11yRules(ui, [
      'image-alt',
      'role-img-alt',
      'input-image-alt',
    ]);
  },

  /**
   * Test table accessibility
   */
  async testTableA11y(ui: ReactElement) {
    return testA11yRules(ui, [
      'table-fake-caption',
      'td-headers-attr',
      'th-has-data-cells',
      'scope-attr-valid',
    ]);
  },

  /**
   * Test ARIA attributes
   */
  async testARIA(ui: ReactElement) {
    return testA11yRules(ui, [
      'aria-valid-attr',
      'aria-valid-attr-value',
      'aria-allowed-attr',
      'aria-required-attr',
      'aria-required-children',
      'aria-required-parent',
    ]);
  },
};

/**
 * Get accessibility report
 */
export async function getA11yReport(ui: ReactElement) {
  const { container } = render(ui);
  const results = await axe(container);

  return {
    violations: results.violations,
    passes: results.passes,
    incomplete: results.incomplete,
    summary: {
      total: results.violations.length + results.passes.length + results.incomplete.length,
      violations: results.violations.length,
      passes: results.passes.length,
      incomplete: results.incomplete.length,
    },
  };
}

/**
 * Check for keyboard navigation
 */
export function checkKeyboardNavigation(element: HTMLElement) {
  const focusableElements = element.querySelectorAll(
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );

  return {
    count: focusableElements.length,
    elements: Array.from(focusableElements),
    hasFocusableElements: focusableElements.length > 0,
  };
}

/**
 * Check for ARIA labels
 */
export function checkARIALabels(element: HTMLElement) {
  const elementsWithARIA = element.querySelectorAll(
    '[aria-label], [aria-labelledby], [aria-describedby]'
  );

  return {
    count: elementsWithARIA.length,
    elements: Array.from(elementsWithARIA),
    hasARIALabels: elementsWithARIA.length > 0,
  };
}

/**
 * Check for semantic HTML
 */
export function checkSemanticHTML(element: HTMLElement) {
  const semanticElements = element.querySelectorAll(
    'header, nav, main, article, section, aside, footer, h1, h2, h3, h4, h5, h6'
  );

  return {
    count: semanticElements.length,
    elements: Array.from(semanticElements),
    hasSemanticElements: semanticElements.length > 0,
  };
}
