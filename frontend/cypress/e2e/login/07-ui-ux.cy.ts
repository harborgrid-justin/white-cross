/// <reference types="cypress" />

describe('Login - UI/UX', () => {
  beforeEach(() => {
    cy.visit('/login');
    cy.waitForPageLoad();
  });

  it('should display all required UI elements', () => {
    // Header
    cy.get('h1').should('be.visible');
    cy.get('h1').should('contain', 'Sign in');

    // Form fields
    cy.get('#email').should('be.visible');
    cy.get('#password').should('be.visible');
    cy.get('#remember-me').should('be.visible');

    // Buttons and links
    cy.get('button[type="submit"]').should('be.visible');
    cy.get('a[href="/forgot-password"]').should('be.visible');

    // OAuth buttons
    cy.contains('Google').should('be.visible');
    cy.contains('Microsoft').should('be.visible');
  });

  it('should have proper placeholder text', () => {
    cy.get('#email').should('have.attr', 'placeholder', 'Email address');
    cy.get('#password').should('have.attr', 'placeholder', 'Password');
  });

  it('should show proper button text states', () => {
    // Initial state
    cy.get('button[type="submit"]').should('contain', 'Sign in');

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

      // Loading state
      cy.get('button[type="submit"]').should('contain', 'Signing in...');
    });
  });

  it('should have responsive design', () => {
    // Test mobile viewport
    cy.viewport('iphone-x');
    cy.get('form').should('be.visible');
    cy.get('#email').should('be.visible');

    // Test tablet viewport
    cy.viewport('ipad-2');
    cy.get('form').should('be.visible');

    // Test desktop viewport
    cy.viewport(1920, 1080);
    cy.get('form').should('be.visible');
  });

  it('should have proper spacing and layout', () => {
    cy.get('form').should('have.css', 'display');
    cy.get('#email').should('have.css', 'padding');
    cy.get('#password').should('have.css', 'padding');
  });

  it('should show loading spinner during submission', () => {
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

      // Loading spinner should be visible
      cy.get('button[type="submit"]').find('svg').should('exist');
      cy.get('button[type="submit"]').find('.animate-spin').should('exist');
    });
  });

  it('should have proper focus styles', () => {
    cy.get('#email').focus();
    cy.get('#email').should('have.focus');

    cy.get('#password').focus();
    cy.get('#password').should('have.focus');
  });

  it('should have proper error styling', () => {
    cy.fixture('users').then((users) => {
      const { email, password } = users.invalidUser;

      cy.get('#email').type(email);
      cy.get('#password').type(password);
      cy.get('button[type="submit"]').click();

      // Error alert should have proper styling
      cy.get('[role="alert"]').should('have.css', 'background-color');
      cy.get('[role="alert"]').should('be.visible');
    });
  });

  it('should have proper button hover states', () => {
    cy.get('#email').type('test@example.com');
    cy.get('#password').type('password123');

    cy.get('button[type="submit"]').trigger('mouseover');
    cy.get('button[type="submit"]').should('have.css', 'cursor', 'pointer');
  });

  it('should display forgot password link', () => {
    cy.get('a[href="/forgot-password"]').should('be.visible');
    cy.get('a[href="/forgot-password"]').should('contain', 'Forgot your password');
  });

  it('should display help text', () => {
    cy.contains('Need help?').should('be.visible');
    cy.contains('system administrator').should('be.visible');
  });

  it('should have proper form alignment', () => {
    cy.get('form').should('be.visible');
    cy.get('.max-w-md').should('exist'); // Form container
  });

  it('should show OAuth divider', () => {
    cy.contains('Or continue with').should('be.visible');
  });

  it('should have proper OAuth button styling', () => {
    cy.contains('Google').parent('button').should('have.css', 'border');
    cy.contains('Microsoft').parent('button').should('have.css', 'border');
  });

  it('should display remember me checkbox properly', () => {
    cy.get('#remember-me').should('be.visible');
    cy.get('label[for="remember-me"]').should('contain', 'Remember me');
  });
});
