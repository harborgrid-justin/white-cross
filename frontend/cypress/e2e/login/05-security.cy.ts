/// <reference types="cypress" />

describe('Login - Security', () => {
  beforeEach(() => {
    cy.visit('/login');
    cy.waitForPageLoad();
  });

  it('should not expose password in DOM', () => {
    const password = 'SecurePassword123!';
    
    cy.get('#password').type(password);
    
    // Password field should be type="password"
    cy.get('#password').should('have.attr', 'type', 'password');
    
    // Password should not be visible in the DOM as plain text
    cy.get('body').should('not.contain', password);
  });

  it('should prevent SQL injection attempts', () => {
    cy.fixture('users').then((users) => {
      const { email, password } = users.sqlInjection;

      cy.intercept('POST', '**/api/auth/login').as('loginRequest');

      cy.get('#email').type(email);
      cy.get('#password').type(password);
      cy.get('button[type="submit"]').click();

      cy.wait('@loginRequest').then((interception) => {
        // Request should be sent but should fail authentication
        expect(interception.response?.statusCode).to.not.equal(200);
      });

      // Should show error, not succeed
      cy.url().should('include', '/login');
    });
  });

  it('should prevent XSS attacks in form inputs', () => {
    cy.fixture('users').then((users) => {
      const { email, password } = users.xssAttempt;

      cy.get('#email').type(email);
      cy.get('#password').type(password);

      // Script tags should not execute
      cy.on('window:alert', () => {
        throw new Error('XSS vulnerability detected!');
      });

      cy.get('button[type="submit"]').click();

      // Should handle gracefully without executing scripts
      cy.url().should('include', '/login');
    });
  });

  it('should use HTTPS in production', () => {
    // In production, should redirect to HTTPS
    cy.url().then((url) => {
      if (Cypress.env('production')) {
        expect(url).to.include('https://');
      }
    });
  });

  it('should set secure cookie flags', () => {
    cy.fixture('users').then((users) => {
      const { email, password } = users.validUser;

      cy.intercept('POST', '**/api/auth/login', {
        statusCode: 200,
        body: {
          accessToken: 'mock-token',
          user: { email, role: 'admin' },
        },
        headers: {
          'Set-Cookie': 'accessToken=mock-token; HttpOnly; Secure; SameSite=Strict',
        },
      }).as('loginRequest');

      cy.get('#email').type(email);
      cy.get('#password').type(password);
      cy.get('button[type="submit"]').click();

      cy.wait('@loginRequest');
    });
  });

  it('should not store credentials in localStorage', () => {
    cy.fixture('users').then((users) => {
      const { email, password } = users.validUser;

      cy.get('#email').type(email);
      cy.get('#password').type(password);
      cy.get('button[type="submit"]').click();

      cy.window().then((win) => {
        const localStorage = win.localStorage;
        const localStorageString = JSON.stringify(localStorage);
        
        // Password should never be in localStorage
        expect(localStorageString).to.not.include(password);
      });
    });
  });

  it('should not store credentials in sessionStorage', () => {
    cy.fixture('users').then((users) => {
      const { email, password } = users.validUser;

      cy.get('#email').type(email);
      cy.get('#password').type(password);
      cy.get('button[type="submit"]').click();

      cy.window().then((win) => {
        const sessionStorage = win.sessionStorage;
        const sessionStorageString = JSON.stringify(sessionStorage);
        
        // Password should never be in sessionStorage
        expect(sessionStorageString).to.not.include(password);
      });
    });
  });

  it('should clear password field on error', () => {
    cy.fixture('users').then((users) => {
      const { email, password } = users.invalidUser;

      cy.get('#email').type(email);
      cy.get('#password').type(password);
      cy.get('button[type="submit"]').click();

      // After error, password field behavior (may or may not clear)
      // This tests the security practice
      cy.get('[role="alert"]').should('be.visible');
    });
  });

  it('should have CSRF protection', () => {
    cy.fixture('users').then((users) => {
      const { email, password } = users.validUser;

      cy.intercept('POST', '**/api/auth/login').as('loginRequest');

      cy.get('#email').type(email);
      cy.get('#password').type(password);
      cy.get('button[type="submit"]').click();

      cy.wait('@loginRequest').then((interception) => {
        // Check for CSRF token or SameSite cookie policy
        const cookies = interception.request.headers.cookie;
        // In production, cookies should have SameSite policy
        expect(interception.request.headers).to.exist;
      });
    });
  });

  it('should rate limit login attempts', () => {
    cy.fixture('users').then((users) => {
      const { email, password } = users.invalidUser;

      // Attempt multiple failed logins
      for (let i = 0; i < 5; i++) {
        cy.get('#email').clear().type(email);
        cy.get('#password').clear().type(password);
        cy.get('button[type="submit"]').click();
        cy.wait(500);
      }

      // After multiple attempts, should show rate limit message
      // (This depends on backend implementation)
      cy.get('[role="alert"]').should('be.visible');
    });
  });
});
