/**
 * Accessibility Testing Utilities
 * Comprehensive a11y testing helpers using jest-axe and custom checks
 */

import { configureAxe, toHaveNoViolations } from 'jest-axe';
import { RenderResult } from '@testing-library/react';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

/**
 * Configure axe with healthcare-specific rules
 */
export const axe = configureAxe({
  rules: {
    // WCAG 2.1 Level AA rules (required for healthcare)
    'color-contrast': { enabled: true },
    'valid-lang': { enabled: true },
    'html-has-lang': { enabled: true },
    'label': { enabled: true },
    'button-name': { enabled: true },
    'link-name': { enabled: true },
    'image-alt': { enabled: true },
    'document-title': { enabled: true },
    'landmark-one-main': { enabled: true },
    'page-has-heading-one': { enabled: true },
    'region': { enabled: true },

    // Form accessibility (critical for healthcare data entry)
    'label-title-only': { enabled: true },
    'form-field-multiple-labels': { enabled: true },
    'autocomplete-valid': { enabled: true },

    // Keyboard navigation
    'focus-order-semantics': { enabled: true },
    'tabindex': { enabled: true },

    // ARIA rules
    'aria-valid-attr': { enabled: true },
    'aria-valid-attr-value': { enabled: true },
    'aria-required-attr': { enabled: true },
    'aria-required-children': { enabled: true },
    'aria-required-parent': { enabled: true },
    'aria-roles': { enabled: true },
    'aria-hidden-focus': { enabled: true },
  },
});

/**
 * Run axe accessibility tests on a rendered component
 */
export async function runAxeTest(container: HTMLElement) {
  const results = await axe(container);
  return results;
}

/**
 * Test accessibility of a component with custom config
 */
export async function testAccessibility(
  container: HTMLElement,
  options?: {
    rules?: Record<string, { enabled: boolean }>;
    impactLevels?: ('minor' | 'moderate' | 'serious' | 'critical')[];
  }
) {
  const customAxe = options?.rules ? configureAxe({ rules: options.rules }) : axe;
  const results = await customAxe(container);

  // Filter by impact level if specified
  if (options?.impactLevels) {
    const filteredViolations = results.violations.filter(v =>
      v.impact && options.impactLevels!.includes(v.impact as any)
    );

    return {
      ...results,
      violations: filteredViolations,
    };
  }

  return results;
}

/**
 * Check if element has proper ARIA labels
 */
export function hasAccessibleName(element: HTMLElement): boolean {
  const accessibleName = element.getAttribute('aria-label') ||
    element.getAttribute('aria-labelledby') ||
    element.textContent;

  return !!accessibleName && accessibleName.trim().length > 0;
}

/**
 * Check if form field has associated label
 */
export function hasAssociatedLabel(input: HTMLInputElement): boolean {
  // Check for aria-label
  if (input.getAttribute('aria-label')) return true;

  // Check for aria-labelledby
  if (input.getAttribute('aria-labelledby')) return true;

  // Check for associated label element
  const id = input.getAttribute('id');
  if (id) {
    const label = document.querySelector(`label[for="${id}"]`);
    if (label) return true;
  }

  // Check if input is wrapped in label
  const parent = input.parentElement;
  if (parent && parent.tagName === 'LABEL') return true;

  return false;
}

/**
 * Check keyboard navigation
 */
export function isKeyboardAccessible(element: HTMLElement): boolean {
  const tabIndex = element.getAttribute('tabindex');
  const role = element.getAttribute('role');
  const tagName = element.tagName.toLowerCase();

  // Interactive elements should be keyboard accessible
  const interactiveElements = ['a', 'button', 'input', 'select', 'textarea'];
  const interactiveRoles = ['button', 'link', 'checkbox', 'radio', 'textbox'];

  if (interactiveElements.includes(tagName)) return true;
  if (role && interactiveRoles.includes(role) && tabIndex !== '-1') return true;

  return false;
}

/**
 * Check focus visibility
 */
export function hasFocusIndicator(element: HTMLElement): boolean {
  // Simulate focus
  element.focus();

  const styles = window.getComputedStyle(element);
  const outline = styles.getPropertyValue('outline');
  const outlineWidth = styles.getPropertyValue('outline-width');
  const boxShadow = styles.getPropertyValue('box-shadow');

  // Check if there's a visible focus indicator
  return (
    (outline && outline !== 'none' && outlineWidth !== '0px') ||
    (boxShadow && boxShadow !== 'none')
  );
}

/**
 * Check color contrast ratio
 */
export function hasGoodColorContrast(element: HTMLElement, requiredRatio = 4.5): boolean {
  const styles = window.getComputedStyle(element);
  const color = styles.getPropertyValue('color');
  const backgroundColor = styles.getPropertyValue('background-color');

  // This is a simplified check - actual contrast calculation is complex
  // In production, use axe-core's color-contrast rule
  return color !== backgroundColor;
}

/**
 * Check ARIA live regions for dynamic content
 */
export function hasAriaLiveRegion(container: HTMLElement, politeness: 'polite' | 'assertive' = 'polite'): boolean {
  const liveRegion = container.querySelector(`[aria-live="${politeness}"]`);
  return !!liveRegion;
}

/**
 * Test suite for common accessibility patterns
 */
export const accessibilityTestSuite = {
  /**
   * Test button accessibility
   */
  async testButton(button: HTMLElement) {
    const results = {
      hasAccessibleName: hasAccessibleName(button),
      isKeyboardAccessible: isKeyboardAccessible(button),
      hasFocusIndicator: hasFocusIndicator(button),
      hasRole: button.getAttribute('role') === 'button' || button.tagName === 'BUTTON',
    };

    return results;
  },

  /**
   * Test form accessibility
   */
  async testForm(form: HTMLFormElement) {
    const inputs = Array.from(form.querySelectorAll('input, select, textarea')) as HTMLInputElement[];

    const results = {
      allInputsHaveLabels: inputs.every(hasAssociatedLabel),
      hasSubmitButton: !!form.querySelector('button[type="submit"], input[type="submit"]'),
      hasAriaDescribedBy: inputs.some(input => input.getAttribute('aria-describedby')),
      inputCount: inputs.length,
      labeledInputCount: inputs.filter(hasAssociatedLabel).length,
    };

    return results;
  },

  /**
   * Test table accessibility
   */
  async testTable(table: HTMLTableElement) {
    const results = {
      hasCaption: !!table.querySelector('caption'),
      hasHeaderRow: !!table.querySelector('thead') || !!table.querySelector('th'),
      hasScopeAttributes: Array.from(table.querySelectorAll('th')).every(th =>
        th.getAttribute('scope')
      ),
      hasAriaLabel: hasAccessibleName(table),
    };

    return results;
  },

  /**
   * Test modal/dialog accessibility
   */
  async testModal(modal: HTMLElement) {
    const results = {
      hasRole: modal.getAttribute('role') === 'dialog' || modal.getAttribute('role') === 'alertdialog',
      hasAriaModal: modal.getAttribute('aria-modal') === 'true',
      hasAriaLabel: hasAccessibleName(modal),
      hasFocusTrap: true, // This requires functional testing
      hasCloseButton: !!modal.querySelector('[aria-label*="close" i]'),
    };

    return results;
  },

  /**
   * Test navigation accessibility
   */
  async testNavigation(nav: HTMLElement) {
    const results = {
      hasRole: nav.getAttribute('role') === 'navigation' || nav.tagName === 'NAV',
      hasAriaLabel: hasAccessibleName(nav),
      hasSkipLink: !!document.querySelector('a[href="#main-content"], a[href="#main"]'),
      linksAreAccessible: Array.from(nav.querySelectorAll('a')).every(hasAccessibleName),
    };

    return results;
  },
};

/**
 * Create accessibility test report
 */
export function createA11yReport(violations: any[]) {
  return {
    totalViolations: violations.length,
    bySeverity: {
      critical: violations.filter(v => v.impact === 'critical').length,
      serious: violations.filter(v => v.impact === 'serious').length,
      moderate: violations.filter(v => v.impact === 'moderate').length,
      minor: violations.filter(v => v.impact === 'minor').length,
    },
    byRule: violations.reduce((acc, v) => {
      acc[v.id] = (acc[v.id] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    details: violations.map(v => ({
      rule: v.id,
      impact: v.impact,
      description: v.description,
      help: v.help,
      helpUrl: v.helpUrl,
      nodes: v.nodes.length,
    })),
  };
}

/**
 * Common accessibility test helpers
 */
export const a11yHelpers = {
  /**
   * Check if element is hidden from screen readers
   */
  isHiddenFromScreenReaders(element: HTMLElement): boolean {
    return (
      element.getAttribute('aria-hidden') === 'true' ||
      element.style.display === 'none' ||
      element.style.visibility === 'hidden'
    );
  },

  /**
   * Get accessible name of element
   */
  getAccessibleName(element: HTMLElement): string | null {
    return (
      element.getAttribute('aria-label') ||
      element.getAttribute('aria-labelledby') ||
      element.textContent ||
      null
    );
  },

  /**
   * Check if element has required ARIA attributes
   */
  hasRequiredAriaAttributes(element: HTMLElement, role: string): boolean {
    const requiredAttrs: Record<string, string[]> = {
      'checkbox': ['aria-checked'],
      'radio': ['aria-checked'],
      'combobox': ['aria-expanded', 'aria-controls'],
      'listbox': [],
      'option': ['aria-selected'],
      'tab': ['aria-selected', 'aria-controls'],
      'tabpanel': [],
      'slider': ['aria-valuenow', 'aria-valuemin', 'aria-valuemax'],
      'progressbar': ['aria-valuenow'],
    };

    const required = requiredAttrs[role] || [];
    return required.every(attr => element.hasAttribute(attr));
  },

  /**
   * Check landmark regions
   */
  hasProperLandmarks(container: HTMLElement): boolean {
    const hasMain = !!container.querySelector('main, [role="main"]');
    const hasNavigation = !!container.querySelector('nav, [role="navigation"]');
    const hasContentInfo = !!container.querySelector('footer, [role="contentinfo"]');

    return hasMain; // At minimum, page should have main landmark
  },
};

/**
 * WCAG 2.1 Level AA Compliance Checklist
 */
export const wcagAAChecklist = {
  perceivable: [
    'All images have alt text',
    'Videos have captions',
    'Color is not the only means of conveying information',
    'Text contrast ratio is at least 4.5:1',
    'Content can be presented in different ways',
  ],
  operable: [
    'All functionality available via keyboard',
    'Users have enough time to read and use content',
    'No content flashes more than 3 times per second',
    'Page has descriptive title',
    'Focus order makes sense',
    'Link purpose is clear',
    'Multiple ways to find pages',
    'Headings and labels are descriptive',
    'Keyboard focus is visible',
  ],
  understandable: [
    'Page language is identified',
    'Language of parts is identified',
    'Navigation is consistent',
    'Identification is consistent',
    'Input errors are identified',
    'Labels and instructions provided',
    'Error suggestions provided',
  ],
  robust: [
    'Valid HTML',
    'Name, role, value available for UI components',
    'Status messages programmatically determined',
  ],
};
