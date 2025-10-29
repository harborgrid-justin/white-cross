/// <reference types="cypress" />

// ***********************************************
// This file contains custom Cypress commands
// and overrides existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to login with email and password
       * @example cy.login('user@example.com', 'password123')
       */
      login(email: string, password: string, rememberMe?: boolean): Chainable<void>;

      /**
       * Custom command to logout
       * @example cy.logout()
       */
      logout(): Chainable<void>;

      /**
       * Custom command to get element by data-testid attribute
       * @example cy.getByTestId('submit-button')
       */
      getByTestId(testId: string): Chainable<JQuery<HTMLElement>>;

      /**
       * Custom command to check if user is authenticated
       * @example cy.checkAuthenticated()
       */
      checkAuthenticated(): Chainable<void>;

      /**
       * Custom command to fill login form
       * @example cy.fillLoginForm('user@example.com', 'password123')
       */
      fillLoginForm(email: string, password: string, rememberMe?: boolean): Chainable<void>;

      /**
       * Custom command to wait for page load
       * @example cy.waitForPageLoad()
       */
      waitForPageLoad(): Chainable<void>;
    }
  }
}

/**
 * Login command - Performs complete login flow
 */
Cypress.Commands.add('login', (email: string, password: string, rememberMe = false) => {
  cy.session(
    [email, password],
    () => {
      cy.visit('/login');
      cy.get('#email').type(email);
      cy.get('#password').type(password);
      
      if (rememberMe) {
        cy.get('#remember-me').check();
      }
      
      cy.get('button[type="submit"]').click();
      
      // Wait for redirect after successful login
      cy.url().should('not.include', '/login');
      cy.url().should('match', /\/(dashboard)?/);
    },
    {
      validate() {
        // Validate session is still valid
        cy.getCookie('accessToken').should('exist');
      },
    }
  );
});

/**
 * Logout command
 */
Cypress.Commands.add('logout', () => {
  cy.window().then((win) => {
    win.localStorage.clear();
    win.sessionStorage.clear();
  });
  cy.clearCookies();
  cy.visit('/login');
});

/**
 * Get element by data-testid
 */
Cypress.Commands.add('getByTestId', (testId: string) => {
  return cy.get(`[data-testid="${testId}"]`);
});

/**
 * Check if user is authenticated
 */
Cypress.Commands.add('checkAuthenticated', () => {
  cy.getCookie('accessToken').should('exist');
  cy.url().should('not.include', '/login');
});

/**
 * Fill login form without submitting
 */
Cypress.Commands.add('fillLoginForm', (email: string, password: string, rememberMe = false) => {
  cy.get('#email').clear().type(email);
  cy.get('#password').clear().type(password);
  
  if (rememberMe) {
    cy.get('#remember-me').check();
  } else {
    cy.get('#remember-me').uncheck();
  }
});

/**
 * Wait for page to fully load
 */
Cypress.Commands.add('waitForPageLoad', () => {
  cy.window().should('have.property', 'document');
  cy.document().should('have.property', 'readyState', 'complete');
});

// Prevent TypeScript errors
export {};
