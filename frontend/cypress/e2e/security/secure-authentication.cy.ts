/**
 * Secure Authentication E2E Tests
 * Tests complete authentication flow with secure token management
 */

describe('Secure Authentication', () => {
  beforeEach(() => {
    cy.clearAllSessionStorage();
    cy.clearAllLocalStorage();
    cy.clearCookies();
  });

  describe('Login Flow', () => {
    it('should successfully login with valid credentials', () => {
      cy.visit('/login');

      // Fill in credentials
      cy.get('input[name="email"]').type(Cypress.env('TEST_NURSE_EMAIL'));
      cy.get('input[name="password"]').type(Cypress.env('TEST_NURSE_PASSWORD'));

      // Submit login form
      cy.get('button[type="submit"]').click();

      // Should redirect to dashboard
      cy.url().should('include', '/dashboard');

      // Should store token in sessionStorage (not localStorage)
      cy.window().then((win) => {
        const token = win.sessionStorage.getItem('secure_auth_token');
        expect(token).to.exist;
        expect(token).to.match(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/); // JWT format

        // Should NOT be in localStorage
        const localToken = win.localStorage.getItem('secure_auth_token');
        expect(localToken).to.be.null;
      });

      // Should display user info
      cy.contains(Cypress.env('TEST_NURSE_EMAIL')).should('be.visible');
    });

    it('should fail login with invalid credentials', () => {
      cy.visit('/login');

      cy.get('input[name="email"]').type('invalid@example.com');
      cy.get('input[name="password"]').type('wrongpassword');

      cy.get('button[type="submit"]').click();

      // Should show error message
      cy.contains('Invalid credentials').should('be.visible');

      // Should remain on login page
      cy.url().should('include', '/login');

      // Should NOT store token
      cy.window().then((win) => {
        expect(win.sessionStorage.getItem('secure_auth_token')).to.be.null;
      });
    });

    it('should prevent access to protected routes without login', () => {
      cy.visit('/dashboard');

      // Should redirect to login
      cy.url().should('include', '/login');
    });

    it('should validate email format', () => {
      cy.visit('/login');

      cy.get('input[name="email"]').type('invalid-email');
      cy.get('input[name="password"]').type('password123');

      cy.get('button[type="submit"]').click();

      // Should show validation error
      cy.contains('Invalid email').should('be.visible');
    });

    it('should require password', () => {
      cy.visit('/login');

      cy.get('input[name="email"]').type('test@example.com');
      // Don't enter password

      cy.get('button[type="submit"]').click();

      // Should show validation error
      cy.contains('Password is required').should('be.visible');
    });
  });

  describe('Token Security', () => {
    beforeEach(() => {
      // Login first
      cy.visit('/login');
      cy.get('input[name="email"]').type(Cypress.env('TEST_NURSE_EMAIL'));
      cy.get('input[name="password"]').type(Cypress.env('TEST_NURSE_PASSWORD'));
      cy.get('button[type="submit"]').click();
      cy.url().should('include', '/dashboard');
    });

    it('should store token in sessionStorage', () => {
      cy.window().then((win) => {
        const token = win.sessionStorage.getItem('secure_auth_token');
        const metadata = win.sessionStorage.getItem('secure_token_metadata');

        expect(token).to.exist;
        expect(metadata).to.exist;

        const meta = JSON.parse(metadata);
        expect(meta).to.have.property('issuedAt');
        expect(meta).to.have.property('expiresAt');
        expect(meta).to.have.property('lastActivity');
      });
    });

    it('should include token in API requests', () => {
      // Intercept API call
      cy.intercept('GET', '/api/v1/students*').as('getStudents');

      cy.visit('/students');

      cy.wait('@getStudents').then((interception) => {
        expect(interception.request.headers).to.have.property('authorization');
        expect(interception.request.headers.authorization).to.match(/^Bearer /);
      });
    });

    it('should clear token from sessionStorage on tab close', () => {
      cy.window().then((win) => {
        // Token should be in sessionStorage
        expect(win.sessionStorage.getItem('secure_auth_token')).to.exist;

        // Simulate closing and reopening (new session)
        win.sessionStorage.clear();

        // Visit protected route
        cy.visit('/dashboard');

        // Should redirect to login (token is gone)
        cy.url().should('include', '/login');
      });
    });

    it('should migrate legacy localStorage tokens to sessionStorage', () => {
      // Logout first
      cy.contains('Logout').click();

      cy.window().then((win) => {
        // Simulate legacy token in localStorage
        const legacyToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkxlZ2FjeSBVc2VyIiwiZXhwIjo5OTk5OTk5OTk5LCJpYXQiOjE1MTYyMzkwMjJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

        win.localStorage.setItem('auth_token', legacyToken);
      });

      // Reload page to trigger migration
      cy.reload();

      cy.window().then((win) => {
        // Token should be migrated to sessionStorage
        expect(win.sessionStorage.getItem('secure_auth_token')).to.equal(legacyToken);

        // Should be removed from localStorage
        expect(win.localStorage.getItem('auth_token')).to.be.null;
      });
    });
  });

  describe('Logout Flow', () => {
    beforeEach(() => {
      // Login first
      cy.visit('/login');
      cy.get('input[name="email"]').type(Cypress.env('TEST_NURSE_EMAIL'));
      cy.get('input[name="password"]').type(Cypress.env('TEST_NURSE_PASSWORD'));
      cy.get('button[type="submit"]').click();
      cy.url().should('include', '/dashboard');
    });

    it('should successfully logout', () => {
      // Click logout
      cy.contains('Logout').click();

      // Should redirect to login
      cy.url().should('include', '/login');

      // Should clear sessionStorage
      cy.window().then((win) => {
        expect(win.sessionStorage.getItem('secure_auth_token')).to.be.null;
        expect(win.sessionStorage.getItem('secure_token_metadata')).to.be.null;
      });

      // Should clear localStorage
      cy.window().then((win) => {
        expect(win.localStorage.getItem('auth-storage')).to.be.null;
      });
    });

    it('should prevent access to protected routes after logout', () => {
      cy.contains('Logout').click();

      cy.visit('/dashboard');

      // Should redirect to login
      cy.url().should('include', '/login');
    });
  });

  describe('Session Persistence', () => {
    beforeEach(() => {
      cy.visit('/login');
      cy.get('input[name="email"]').type(Cypress.env('TEST_NURSE_EMAIL'));
      cy.get('input[name="password"]').type(Cypress.env('TEST_NURSE_PASSWORD'));
      cy.get('button[type="submit"]').click();
      cy.url().should('include', '/dashboard');
    });

    it('should maintain session on page reload', () => {
      cy.reload();

      // Should still be logged in
      cy.url().should('include', '/dashboard');
      cy.contains(Cypress.env('TEST_NURSE_EMAIL')).should('be.visible');
    });

    it('should maintain session when navigating between pages', () => {
      cy.visit('/students');
      cy.url().should('include', '/students');

      cy.visit('/dashboard');
      cy.url().should('include', '/dashboard');

      // Should still be authenticated
      cy.window().then((win) => {
        expect(win.sessionStorage.getItem('secure_auth_token')).to.exist;
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors gracefully', () => {
      cy.intercept('POST', '/api/v1/auth/login', {
        forceNetworkError: true,
      }).as('loginError');

      cy.visit('/login');
      cy.get('input[name="email"]').type('test@example.com');
      cy.get('input[name="password"]').type('password123');
      cy.get('button[type="submit"]').click();

      // Should show error message
      cy.contains(/network error|failed to connect/i).should('be.visible');
    });

    it('should handle server errors gracefully', () => {
      cy.intercept('POST', '/api/v1/auth/login', {
        statusCode: 500,
        body: { message: 'Internal server error' },
      }).as('serverError');

      cy.visit('/login');
      cy.get('input[name="email"]').type('test@example.com');
      cy.get('input[name="password"]').type('password123');
      cy.get('button[type="submit"]').click();

      // Should show error message
      cy.contains(/server error|something went wrong/i).should('be.visible');
    });

    it('should handle rate limiting', () => {
      cy.intercept('POST', '/api/v1/auth/login', {
        statusCode: 429,
        body: { message: 'Too many requests' },
      }).as('rateLimited');

      cy.visit('/login');
      cy.get('input[name="email"]').type('test@example.com');
      cy.get('input[name="password"]').type('password123');
      cy.get('button[type="submit"]').click();

      // Should show rate limit message
      cy.contains(/too many requests|try again later/i).should('be.visible');
    });
  });

  describe('Password Requirements', () => {
    it('should enforce minimum password length', () => {
      cy.visit('/register'); // Assuming registration page exists

      cy.get('input[name="email"]').type('new@example.com');
      cy.get('input[name="password"]').type('short');
      cy.get('button[type="submit"]').click();

      cy.contains(/password must be at least/i).should('be.visible');
    });

    it('should require strong passwords on registration', () => {
      cy.visit('/register');

      cy.get('input[name="email"]').type('new@example.com');
      cy.get('input[name="password"]').type('weakpassword');
      cy.get('button[type="submit"]').click();

      cy.contains(/password must contain/i).should('be.visible');
    });
  });

  describe('Accessibility', () => {
    it('should be keyboard navigable', () => {
      cy.visit('/login');

      // Tab to email field
      cy.get('body').tab();
      cy.focused().should('have.attr', 'name', 'email');

      // Tab to password field
      cy.focused().tab();
      cy.focused().should('have.attr', 'name', 'password');

      // Tab to submit button
      cy.focused().tab();
      cy.focused().should('have.attr', 'type', 'submit');
    });

    it('should have proper ARIA labels', () => {
      cy.visit('/login');

      cy.get('input[name="email"]').should('have.attr', 'aria-label');
      cy.get('input[name="password"]').should('have.attr', 'aria-label');
      cy.get('button[type="submit"]').should('have.attr', 'aria-label');
    });

    it('should show password visibility toggle', () => {
      cy.visit('/login');

      cy.get('input[name="password"]').should('have.attr', 'type', 'password');

      cy.get('[aria-label*="show password"]').click();

      cy.get('input[name="password"]').should('have.attr', 'type', 'text');
    });
  });
});
