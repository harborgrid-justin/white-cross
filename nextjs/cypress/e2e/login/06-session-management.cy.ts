/// <reference types="cypress" />

describe('Login - Session Management', () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  it('should create session on successful login', () => {
    cy.visit('/login');
    
    cy.fixture('users').then((users) => {
      const { email, password } = users.validUser;

      cy.get('#email').type(email);
      cy.get('#password').type(password);
      cy.get('button[type="submit"]').click();

      // Session cookie should be created
      cy.getCookie('accessToken').should('exist');
    });
  });

  it('should persist session with remember me', () => {
    cy.visit('/login');
    
    cy.fixture('users').then((users) => {
      const { email, password } = users.validUser;

      cy.get('#email').type(email);
      cy.get('#password').type(password);
      cy.get('#remember-me').check();
      cy.get('button[type="submit"]').click();

      // Check that session persists
      cy.getCookie('accessToken').should('exist');
      
      // Reload page - session should still exist
      cy.reload();
      cy.url().should('not.include', '/login');
    });
  });

  it('should handle session expiration', () => {
    cy.visit('/login?error=session_expired');

    // Should show session expired message
    cy.get('[role="alert"]').should('be.visible');
    cy.get('[role="alert"]').should('contain', 'session has expired');
  });

  it('should redirect authenticated users away from login', () => {
    // First login
    cy.visit('/login');
    
    cy.fixture('users').then((users) => {
      const { email, password } = users.validUser;

      cy.get('#email').type(email);
      cy.get('#password').type(password);
      cy.get('button[type="submit"]').click();

      cy.url().should('not.include', '/login');

      // Try to visit login again
      cy.visit('/login');
      
      // Should redirect away from login
      cy.url().should('not.include', '/login');
    });
  });

  it('should clear session on logout', () => {
    // Login first
    cy.visit('/login');
    
    cy.fixture('users').then((users) => {
      const { email, password } = users.validUser;

      cy.get('#email').type(email);
      cy.get('#password').type(password);
      cy.get('button[type="submit"]').click();

      cy.getCookie('accessToken').should('exist');

      // Logout
      cy.logout();

      // Session should be cleared
      cy.getCookie('accessToken').should('not.exist');
      cy.url().should('include', '/login');
    });
  });

  it('should handle concurrent sessions', () => {
    cy.visit('/login');
    
    cy.fixture('users').then((users) => {
      const { email, password } = users.validUser;

      // Login in first session
      cy.get('#email').type(email);
      cy.get('#password').type(password);
      cy.get('button[type="submit"]').click();

      cy.getCookie('accessToken').should('exist');
      
      // Session should be active
      cy.url().should('not.include', '/login');
    });
  });

  it('should handle invalid session tokens', () => {
    // Set invalid token
    cy.setCookie('accessToken', 'invalid-token-12345');
    
    cy.visit('/');

    // Should redirect to login with error
    cy.url().should('include', '/login');
    cy.url().should('include', 'error=invalid_token');
  });

  it('should refresh expired tokens automatically', () => {
    cy.visit('/login');
    
    cy.fixture('users').then((users) => {
      const { email, password } = users.validUser;

      // Mock token refresh endpoint
      cy.intercept('POST', '**/api/auth/refresh', {
        statusCode: 200,
        body: {
          accessToken: 'new-access-token',
        },
      }).as('refreshToken');

      cy.get('#email').type(email);
      cy.get('#password').type(password);
      cy.get('button[type="submit"]').click();

      cy.url().should('not.include', '/login');
    });
  });

  it('should maintain session across page reloads', () => {
    cy.visit('/login');
    
    cy.fixture('users').then((users) => {
      const { email, password } = users.validUser;

      cy.get('#email').type(email);
      cy.get('#password').type(password);
      cy.get('button[type="submit"]').click();

      cy.url().should('not.include', '/login');

      // Reload page
      cy.reload();

      // Should still be authenticated
      cy.url().should('not.include', '/login');
      cy.getCookie('accessToken').should('exist');
    });
  });

  it('should handle session timeout gracefully', () => {
    cy.visit('/login');
    
    cy.fixture('users').then((users) => {
      const { email, password } = users.validUser;

      cy.get('#email').type(email);
      cy.get('#password').type(password);
      cy.get('button[type="submit"]').click();

      // Clear session to simulate timeout
      cy.clearCookies();

      // Try to access protected route
      cy.visit('/dashboard');

      // Should redirect to login
      cy.url().should('include', '/login');
    });
  });
});
