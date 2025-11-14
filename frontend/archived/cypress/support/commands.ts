/**
 * Custom Cypress Commands for White Cross Healthcare Platform
 *
 * Reusable commands for common testing operations:
 * - Authentication
 * - Navigation
 * - Form interactions
 * - API mocking
 *
 * @module cypress/support/commands
 */

/// <reference types="cypress" />

/**
 * Custom command to login as a user
 *
 * @example
 * cy.login('nurse@example.com', 'password123')
 */
Cypress.Commands.add('login', (email: string, password: string) => {
  cy.visit('/login');
  cy.findByLabelText(/email/i).type(email);
  cy.findByLabelText(/password/i).type(password);
  cy.findByRole('button', { name: /log in|login|sign in/i }).click();
  cy.url().should('include', '/dashboard');
});

/**
 * Custom command to login via API (faster than UI login)
 *
 * @example
 * cy.loginByApi('nurse@example.com', 'password123')
 */
Cypress.Commands.add('loginByApi', (email: string, password: string) => {
  cy.request({
    method: 'POST',
    url: '/api/v1/auth/login',
    body: { email, password },
  }).then((response) => {
    window.localStorage.setItem('token', response.body.token);
    window.localStorage.setItem('user', JSON.stringify(response.body.user));
  });
});

/**
 * Custom command to logout
 *
 * @example
 * cy.logout()
 */
Cypress.Commands.add('logout', () => {
  cy.findByRole('button', { name: /logout|sign out/i }).click();
  cy.url().should('include', '/login');
});

/**
 * Custom command to navigate to a page
 *
 * @example
 * cy.navigateTo('Students')
 */
Cypress.Commands.add('navigateTo', (pageName: string) => {
  cy.findByRole('link', { name: new RegExp(pageName, 'i') }).click();
  cy.url().should('include', pageName.toLowerCase());
});

/**
 * Custom command to fill out a form
 *
 * @example
 * cy.fillForm({
 *   'First Name': 'John',
 *   'Last Name': 'Doe',
 *   'Email': 'john@example.com'
 * })
 */
Cypress.Commands.add('fillForm', (fields: Record<string, string>) => {
  Object.entries(fields).forEach(([label, value]) => {
    cy.findByLabelText(new RegExp(label, 'i')).type(value);
  });
});

/**
 * Custom command to wait for API request
 *
 * @example
 * cy.waitForApi('GET', '/api/v1/students')
 */
Cypress.Commands.add('waitForApi', (method: string, url: string, alias?: string) => {
  const aliasName = alias || `${method}_${url.replace(/\//g, '_')}`;
  cy.intercept(method, url).as(aliasName);
  return cy.wait(`@${aliasName}`);
});

/**
 * Custom command to mock API response
 *
 * @example
 * cy.mockApi('GET', '/api/v1/students', { fixture: 'students.json' })
 */
Cypress.Commands.add('mockApi', (method: string, url: string, response: any) => {
  cy.intercept(method, url, response);
});

/**
 * Custom command to check accessibility
 *
 * @example
 * cy.checkA11y()
 */
Cypress.Commands.add('checkA11y', () => {
  cy.injectAxe();
  cy.checkA11y();
});

/**
 * Custom command to take a snapshot for visual regression
 *
 * @example
 * cy.visualSnapshot('Homepage')
 */
Cypress.Commands.add('visualSnapshot', (name: string) => {
  cy.screenshot(name, { capture: 'fullPage' });
});

// Extend Cypress namespace with custom commands
declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Login via UI
       */
      login(email: string, password: string): Chainable<void>;

      /**
       * Login via API (faster)
       */
      loginByApi(email: string, password: string): Chainable<void>;

      /**
       * Logout
       */
      logout(): Chainable<void>;

      /**
       * Navigate to a page
       */
      navigateTo(pageName: string): Chainable<void>;

      /**
       * Fill out a form
       */
      fillForm(fields: Record<string, string>): Chainable<void>;

      /**
       * Wait for API request
       */
      waitForApi(method: string, url: string, alias?: string): Chainable<any>;

      /**
       * Mock API response
       */
      mockApi(method: string, url: string, response: any): Chainable<void>;

      /**
       * Check accessibility
       */
      checkA11y(): Chainable<void>;

      /**
       * Take visual snapshot
       */
      visualSnapshot(name: string): Chainable<void>;
    }
  }
}

export {};
