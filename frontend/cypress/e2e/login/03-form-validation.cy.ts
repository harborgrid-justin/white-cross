/// <reference types="cypress" />

describe('Login - Form Validation', () => {
  beforeEach(() => {
    cy.visit('/login');
    cy.waitForPageLoad();
  });

  it('should validate email format', () => {
    cy.fixture('users').then((users) => {
      const { email, password } = users.invalidEmail;

      cy.get('#email').type(email);
      cy.get('#password').type(password);

      // Check HTML5 validation
      cy.get('#email').should('have.attr', 'type', 'email');
      
      // Try to submit
      cy.get('button[type="submit"]').click();

      // Should stay on login page due to validation
      cy.url().should('include', '/login');
    });
  });

  it('should require email field', () => {
    cy.get('#email').should('have.attr', 'required');
    cy.get('#email').should('have.attr', 'aria-required', 'true');
  });

  it('should require password field', () => {
    cy.get('#password').should('have.attr', 'required');
    cy.get('#password').should('have.attr', 'aria-required', 'true');
  });

  it('should have proper autocomplete attributes', () => {
    cy.get('#email').should('have.attr', 'autocomplete', 'email');
    cy.get('#password').should('have.attr', 'autocomplete', 'current-password');
  });

  it('should have proper input types', () => {
    cy.get('#email').should('have.attr', 'type', 'email');
    cy.get('#password').should('have.attr', 'type', 'password');
  });

  it('should have proper labels', () => {
    // Check for label elements or aria-label
    cy.get('label[for="email"]').should('exist');
    cy.get('label[for="password"]').should('exist');
  });

  it('should disable submit button when form is invalid', () => {
    // Empty form should have disabled submit
    cy.get('button[type="submit"]').should('be.disabled');

    // Only email filled
    cy.get('#email').type('test@example.com');
    cy.get('button[type="submit"]').should('be.disabled');

    // Clear email, fill password
    cy.get('#email').clear();
    cy.get('#password').type('password123');
    cy.get('button[type="submit"]').should('be.disabled');

    // Both filled - should be enabled
    cy.get('#email').type('test@example.com');
    cy.get('button[type="submit"]').should('be.enabled');
  });

  it('should trim whitespace from email', () => {
    const emailWithSpaces = '  test@example.com  ';
    
    cy.get('#email').type(emailWithSpaces);
    cy.get('#password').type('password123');

    // Intercept to check the actual request
    cy.intercept('POST', '**/api/auth/login').as('loginRequest');
    
    cy.get('button[type="submit"]').click();

    cy.wait('@loginRequest').then((interception) => {
      // Email should be trimmed in the request
      expect(interception.request.body.email).to.equal('test@example.com');
    });
  });

  it('should handle very long email addresses', () => {
    const longEmail = 'a'.repeat(100) + '@example.com';
    
    cy.get('#email').type(longEmail);
    cy.get('#password').type('password123');
    
    // Should still accept the input
    cy.get('#email').should('have.value', longEmail);
  });

  it('should handle special characters in password', () => {
    const specialPassword = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    cy.get('#email').type('test@example.com');
    cy.get('#password').type(specialPassword);
    
    cy.get('#password').should('have.value', specialPassword);
  });
});
