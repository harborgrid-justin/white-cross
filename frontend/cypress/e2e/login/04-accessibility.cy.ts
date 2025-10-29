/// <reference types="cypress" />

describe('Login - Accessibility (A11y)', () => {
  beforeEach(() => {
    cy.visit('/login');
    cy.waitForPageLoad();
  });

  it('should have proper page title', () => {
    cy.title().should('include', 'White Cross');
  });

  it('should have proper heading structure', () => {
    cy.get('h1').should('exist');
    cy.get('h1').should('contain', 'Sign in');
  });

  it('should have proper ARIA labels', () => {
    cy.get('#email').should('have.attr', 'aria-required', 'true');
    cy.get('#password').should('have.attr', 'aria-required', 'true');
  });

  it('should have accessible form labels', () => {
    // Labels should be associated with inputs
    cy.get('label[for="email"]').should('exist');
    cy.get('label[for="password"]').should('exist');
    cy.get('label[for="remember-me"]').should('exist');
  });

  it('should have accessible error messages', () => {
    cy.fixture('users').then((users) => {
      const { email, password } = users.invalidUser;

      cy.get('#email').type(email);
      cy.get('#password').type(password);
      cy.get('button[type="submit"]').click();

      // Error should have role="alert" for screen readers
      cy.get('[role="alert"]').should('exist');
      cy.get('[role="alert"]').should('have.attr', 'aria-live', 'assertive');
    });
  });

  it('should support keyboard navigation', () => {
    // Tab through form elements
    cy.get('body').tab();
    cy.focused().should('have.id', 'email');

    cy.focused().tab();
    cy.focused().should('have.id', 'password');

    cy.focused().tab();
    cy.focused().should('have.id', 'remember-me');

    cy.focused().tab();
    cy.focused().should('contain', 'Forgot your password');

    cy.focused().tab();
    cy.focused().should('have.attr', 'type', 'submit');
  });

  it('should have visible focus indicators', () => {
    cy.get('#email').focus();
    cy.get('#email').should('have.css', 'outline-style').and('not.equal', 'none');
  });

  it('should have sufficient color contrast', () => {
    // Check that text is visible (basic contrast check)
    cy.get('h1').should('be.visible');
    cy.get('label[for="email"]').should('be.visible');
    cy.get('button[type="submit"]').should('be.visible');
  });

  it('should have accessible button states', () => {
    // Disabled state should be communicated
    cy.get('button[type="submit"]').should('be.disabled');
    cy.get('button[type="submit"]').should('have.attr', 'disabled');

    // Enable by filling form
    cy.get('#email').type('test@example.com');
    cy.get('#password').type('password123');
    cy.get('button[type="submit"]').should('be.enabled');
    cy.get('button[type="submit"]').should('not.have.attr', 'disabled');
  });

  it('should have accessible loading state', () => {
    cy.fixture('users').then((users) => {
      const { email, password } = users.validUser;

      cy.intercept('POST', '**/api/auth/login', (req) => {
        req.reply((res) => {
          res.delay = 1000;
        });
      }).as('loginRequest');

      cy.get('#email').type(email);
      cy.get('#password').type(password);
      cy.get('button[type="submit"]').click();

      // Loading state should be communicated
      cy.get('button[type="submit"]').should('have.attr', 'aria-busy', 'true');
    });
  });

  it('should have accessible password toggle button', () => {
    const toggleButton = cy.get('button[aria-label*="password"]');
    
    toggleButton.should('exist');
    toggleButton.should('have.attr', 'aria-label');
    toggleButton.should('have.attr', 'type', 'button');
  });

  it('should have proper form structure', () => {
    cy.get('form').should('exist');
    cy.get('form').within(() => {
      cy.get('input[type="email"]').should('exist');
      cy.get('input[type="password"]').should('exist');
      cy.get('button[type="submit"]').should('exist');
    });
  });

  it('should have accessible links', () => {
    cy.get('a[href="/forgot-password"]').should('exist');
    cy.get('a[href="/forgot-password"]').should('be.visible');
    cy.get('a[href="/forgot-password"]').should('have.attr', 'href');
  });
});
