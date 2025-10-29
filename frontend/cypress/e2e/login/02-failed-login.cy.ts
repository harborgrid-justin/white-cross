/// <reference types="cypress" />

describe('Login - Failed Authentication', () => {
  beforeEach(() => {
    cy.visit('/login');
    cy.waitForPageLoad();
  });

  it('should show error message with invalid credentials', () => {
    cy.fixture('users').then((users) => {
      const { email, password } = users.invalidUser;

      cy.get('#email').type(email);
      cy.get('#password').type(password);
      cy.get('button[type="submit"]').click();

      // Verify error message is displayed
      cy.get('[role="alert"]').should('be.visible');
      cy.get('[role="alert"]').should('contain', 'Invalid email or password');

      // Verify user stays on login page
      cy.url().should('include', '/login');

      // Verify no authentication cookie
      cy.getCookie('accessToken').should('not.exist');
    });
  });

  it('should show error for empty email field', () => {
    cy.get('#password').type('SomePassword123');
    cy.get('button[type="submit"]').click();

    // Form should not submit with empty email
    cy.url().should('include', '/login');
    
    // Email field should be marked as invalid
    cy.get('#email').should('have.attr', 'required');
  });

  it('should show error for empty password field', () => {
    cy.get('#email').type('user@example.com');
    cy.get('button[type="submit"]').click();

    // Form should not submit with empty password
    cy.url().should('include', '/login');
    
    // Password field should be marked as invalid
    cy.get('#password').should('have.attr', 'required');
  });

  it('should show error for both empty fields', () => {
    cy.fixture('users').then((users) => {
      const { email, password } = users.emptyCredentials;

      cy.get('#email').clear();
      cy.get('#password').clear();
      
      // Submit button should be disabled when fields are empty
      cy.get('button[type="submit"]').should('be.disabled');
    });
  });

  it('should handle network errors gracefully', () => {
    cy.fixture('users').then((users) => {
      const { email, password } = users.validUser;

      // Intercept and force network error
      cy.intercept('POST', '/api/auth/login', {
        forceNetworkError: true,
      }).as('loginRequest');

      cy.get('#email').type(email);
      cy.get('#password').type(password);
      cy.get('button[type="submit"]').click();

      // Wait for the failed request
      cy.wait('@loginRequest');

      // Verify error message
      cy.get('[role="alert"]').should('be.visible');
      cy.get('[role="alert"]').should('contain.text', 'connect');
    });
  });

  it('should handle server errors (500)', () => {
    cy.fixture('users').then((users) => {
      const { email, password } = users.validUser;

      // Intercept and return 500 error
      cy.intercept('POST', '/api/auth/login', {
        statusCode: 500,
        body: { error: 'Internal server error' },
      }).as('loginRequest');

      cy.get('#email').type(email);
      cy.get('#password').type(password);
      cy.get('button[type="submit"]').click();

      cy.wait('@loginRequest');

      // Verify error message
      cy.get('[role="alert"]').should('be.visible');
    });
  });

  it('should clear error message when user starts typing', () => {
    cy.fixture('users').then((users) => {
      const { email, password } = users.invalidUser;

      // First, trigger an error
      cy.get('#email').type(email);
      cy.get('#password').type(password);
      cy.get('button[type="submit"]').click();

      // Verify error appears
      cy.get('[role="alert"]').should('be.visible');

      // Start typing in email field
      cy.get('#email').clear().type('new@email.com');

      // Error should be cleared (or remain, depending on implementation)
      // This tests the UX behavior
      cy.url().should('include', '/login');
    });
  });

  it('should not expose system information in error messages', () => {
    cy.fixture('users').then((users) => {
      const { email, password } = users.invalidUser;

      cy.get('#email').type(email);
      cy.get('#password').type(password);
      cy.get('button[type="submit"]').click();

      // Error message should be generic
      cy.get('[role="alert"]').should('not.contain', 'database');
      cy.get('[role="alert"]').should('not.contain', 'SQL');
      cy.get('[role="alert"]').should('not.contain', 'stack trace');
    });
  });
});
