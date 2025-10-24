/**
 * Cypress to Playwright Selector and Command Converter
 * Utility functions to help migrate Cypress tests to Playwright
 */

/**
 * Convert Cypress selector to Playwright locator
 * 
 * @param cypressSelector - Cypress selector string
 * @returns Playwright-compatible locator string
 */
export function convertSelector(cypressSelector: string): string {
  // Handle data-cy attributes
  if (cypressSelector.startsWith('[data-cy=')) {
    return cypressSelector;
  }

  // Handle cy.get() selectors
  if (cypressSelector.includes('data-cy=')) {
    return cypressSelector;
  }

  // Handle :contains() selector
  if (cypressSelector.includes(':contains(')) {
    const match = cypressSelector.match(/:contains\(['"](.+?)['"]\)/);
    if (match) {
      const text = match[1];
      const baseSelector = cypressSelector.split(':contains(')[0];
      return `${baseSelector}:has-text("${text}")`;
    }
  }

  // Handle Cypress-specific pseudo-selectors
  if (cypressSelector.includes(':visible')) {
    return cypressSelector.replace(':visible', ':visible');
  }

  // Return as-is for standard CSS selectors
  return cypressSelector;
}

/**
 * Mapping of Cypress commands to Playwright equivalents
 */
export const COMMAND_MAPPING = {
  // Navigation
  'cy.visit': 'await page.goto',
  'cy.go': 'await page.goBack() or page.goForward()',
  'cy.reload': 'await page.reload()',
  
  // Querying
  'cy.get': 'page.locator',
  'cy.find': 'locator.locator',
  'cy.contains': 'page.locator(\'text=...\') or getByText',
  'cy.within': 'locator context',
  
  // Actions
  'cy.click': 'await locator.click()',
  'cy.dblclick': 'await locator.dblclick()',
  'cy.type': 'await locator.fill() or type()',
  'cy.clear': 'await locator.clear()',
  'cy.check': 'await locator.check()',
  'cy.uncheck': 'await locator.uncheck()',
  'cy.select': 'await page.selectOption()',
  'cy.focus': 'await locator.focus()',
  'cy.blur': 'await locator.blur()',
  
  // Assertions
  'cy.should(\'be.visible\')': 'await expect(locator).toBeVisible()',
  'cy.should(\'not.be.visible\')': 'await expect(locator).toBeHidden()',
  'cy.should(\'exist\')': 'await expect(locator).toHaveCount(>0)',
  'cy.should(\'not.exist\')': 'await expect(locator).toHaveCount(0)',
  'cy.should(\'have.text\')': 'await expect(locator).toHaveText()',
  'cy.should(\'contain.text\')': 'await expect(locator).toContainText()',
  'cy.should(\'have.value\')': 'await expect(locator).toHaveValue()',
  'cy.should(\'be.checked\')': 'await expect(locator).toBeChecked()',
  'cy.should(\'be.disabled\')': 'await expect(locator).toBeDisabled()',
  'cy.should(\'be.enabled\')': 'await expect(locator).toBeEnabled()',
  'cy.should(\'have.attr\')': 'await expect(locator).toHaveAttribute()',
  'cy.should(\'have.class\')': 'await expect(locator).toHaveClass()',
  
  // Waiting
  'cy.wait': 'await page.waitForTimeout() or waitForResponse()',
  'cy.waitFor': 'await locator.waitFor()',
  
  // Network
  'cy.intercept': 'await page.route()',
  'cy.request': 'await page.request.get/post/etc()',
  
  // Storage
  'cy.clearLocalStorage': 'await page.evaluate(() => localStorage.clear())',
  'cy.clearCookies': 'await context.clearCookies()',
  
  // Window
  'cy.window': 'await page.evaluate(() => window)',
  'cy.viewport': 'await page.setViewportSize()',
  'cy.screenshot': 'await page.screenshot()',
  
  // Custom Commands
  'cy.login': 'await login(page, userType)',
  'cy.logout': 'await logout(page)',
  'cy.typeIntoField': 'await typeIntoField(page, fieldName, value)',
  'cy.clickButton': 'await clickButton(page, buttonName)',
  'cy.waitForHealthcareData': 'await setupHealthcareMocks(page)'
} as const;

/**
 * Generate Playwright code from Cypress command
 * 
 * @param cypressCommand - Cypress command string
 * @returns Equivalent Playwright code
 */
export function convertCommand(cypressCommand: string): string {
  // Remove cy. prefix
  const command = cypressCommand.trim();
  
  // Check for direct mapping
  for (const [cypressCmd, playwrightCmd] of Object.entries(COMMAND_MAPPING)) {
    if (command.startsWith(cypressCmd)) {
      return playwrightCmd;
    }
  }
  
  return `// TODO: Convert Cypress command: ${command}`;
}

/**
 * Common patterns for migration
 */
export const MIGRATION_PATTERNS = {
  // Cypress: cy.get('[data-cy=email-input]').type('test@example.com')
  // Playwright: await page.locator('[data-cy=email-input]').fill('test@example.com')
  typeToInput: {
    cypress: 'cy.get(selector).type(value)',
    playwright: 'await page.locator(selector).fill(value)'
  },
  
  // Cypress: cy.get('[data-cy=submit-button]').click()
  // Playwright: await page.locator('[data-cy=submit-button]').click()
  clickButton: {
    cypress: 'cy.get(selector).click()',
    playwright: 'await page.locator(selector).click()'
  },
  
  // Cypress: cy.contains('Login').click()
  // Playwright: await page.locator('text=Login').click()
  clickByText: {
    cypress: 'cy.contains(text).click()',
    playwright: 'await page.locator(\'text=...\').click()'
  },
  
  // Cypress: cy.get(selector).should('be.visible')
  // Playwright: await expect(page.locator(selector)).toBeVisible()
  assertVisible: {
    cypress: 'cy.get(selector).should(\'be.visible\')',
    playwright: 'await expect(page.locator(selector)).toBeVisible()'
  },
  
  // Cypress: cy.url().should('include', '/dashboard')
  // Playwright: await expect(page).toHaveURL(/dashboard/)
  assertUrl: {
    cypress: 'cy.url().should(\'include\', path)',
    playwright: 'await expect(page).toHaveURL(/path/)'
  },
  
  // Cypress: cy.intercept('GET', '/api/users', { fixture: 'users' }).as('getUsers')
  // Playwright: await page.route('**/api/users', route => route.fulfill({ body: mockData }))
  interceptApi: {
    cypress: 'cy.intercept(method, url, response).as(alias)',
    playwright: 'await page.route(url, route => route.fulfill(response))'
  }
} as const;

/**
 * Tips for migration
 */
export const MIGRATION_TIPS = [
  'Use page.locator() instead of cy.get()',
  'Use await with all async operations',
  'Use expect() from @playwright/test for assertions',
  'Use page.route() for API mocking instead of cy.intercept()',
  'Use .fill() instead of .type() for better reliability',
  'Use toBeVisible() instead of should(\'be.visible\')',
  'Use page.waitForURL() instead of cy.url().should()',
  'Use page.waitForLoadState() for page load waits',
  'Use test fixtures for authentication instead of beforeEach hooks',
  'Use page.waitForSelector() instead of cy.waitFor()'
] as const;

export default {
  convertSelector,
  convertCommand,
  COMMAND_MAPPING,
  MIGRATION_PATTERNS,
  MIGRATION_TIPS
};
