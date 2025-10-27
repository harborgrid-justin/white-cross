/// <reference types="cypress" />

describe('Login - Successful Authentication', () => {
  beforeEach(() => {
    cy.visit('/login');
    cy.waitForPageLoad();
  });

  it('should successfully login with valid credentials', () => {
    cy.fixture('users').then((users) => {
      const { email, password } = users.validUser;

      // Intercept the login API call
      cy.intercept('POST', '/api/auth/login').as('loginRequest');

      // Fill in the login form
      cy.get('#email').should('be.visible').type(email);
      cy.get('#password').should('be.visible').type(password);

      // Submit the form
      cy.get('button[type="submit"]').should('be.enabled').click();

      // Wait for the login request to complete
      cy.wait('@loginRequest').then((interception) => {
        // Log the response for debugging
        cy.log('Login response:', JSON.stringify(interception.response?.body));
      });

      // Verify successful login (with longer timeout for redirect)
      cy.url({ timeout: 5000 }).should('not.include', '/login');
      cy.url().should('match', /\/(dashboard)?/);

      // Verify authentication cookie exists
      cy.getCookie('accessToken').should('exist');
    });
  });

  it('should successfully login with remember me checked', () => {
    cy.fixture('users').then((users) => {
      const { email, password } = users.validUser;

      // Intercept the login API call
      cy.intercept('POST', '/api/auth/login').as('loginRequest');

      cy.get('#email').type(email);
      cy.get('#password').type(password);
      cy.get('#remember-me').check().should('be.checked');

      cy.get('button[type="submit"]').click();

      // Wait for the login request
      cy.wait('@loginRequest');

      // Verify successful login (with longer timeout for redirect)
      cy.url({ timeout: 5000 }).should('not.include', '/login');
      cy.getCookie('accessToken').should('exist');
    });
  });

  it('should show loading state during login', () => {
    cy.fixture('users').then((users) => {
      const { email, password } = users.validUser;

      cy.get('#email').type(email);
      cy.get('#password').type(password);

      // Intercept the login request to add delay
      cy.intercept('POST', '/api/auth/login', (req) => {
        req.reply((res) => {
          res.delay = 1000;
        });
      }).as('loginRequest');

      cy.get('button[type="submit"]').click();

      // Verify loading state
      cy.get('button[type="submit"]').should('contain', 'Signing in...');
      cy.get('button[type="submit"]').should('be.disabled');

      // Wait for request to complete
      cy.wait('@loginRequest');
    });
  });

  it('should toggle password visibility', () => {
    cy.get('#password').should('have.attr', 'type', 'password');

    // Click show password button
    cy.get('button[aria-label*="Show password"]').click();
    cy.get('#password').should('have.attr', 'type', 'text');

    // Click hide password button
    cy.get('button[aria-label*="Hide password"]').click();
    cy.get('#password').should('have.attr', 'type', 'password');
  });

  it('should redirect to intended page after login', () => {
    cy.visit('/login?redirect=/medications');

    cy.fixture('users').then((users) => {
      const { email, password } = users.validUser;

      cy.get('#email').type(email);
      cy.get('#password').type(password);
      cy.get('button[type="submit"]').click();

      // Should redirect to medications page
      cy.url().should('include', '/medications');
    });
  });
});
