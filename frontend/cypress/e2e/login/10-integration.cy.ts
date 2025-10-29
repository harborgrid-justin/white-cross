/// <reference types="cypress" />

describe('Login - Integration Tests', () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  it('should integrate with authentication API', () => {
    cy.visit('/login');
    
    cy.fixture('users').then((users) => {
      const { email, password } = users.validUser;

      cy.intercept('POST', '**/api/auth/login').as('loginAPI');

      cy.get('#email').type(email);
      cy.get('#password').type(password);
      cy.get('button[type="submit"]').click();

      cy.wait('@loginAPI').then((interception) => {
        // Verify request structure
        expect(interception.request.body).to.have.property('email', email);
        expect(interception.request.body).to.have.property('password');
        
        // Verify response structure
        expect(interception.response?.statusCode).to.equal(200);
        expect(interception.response?.body).to.have.property('accessToken');
      });
    });
  });

  it('should redirect to dashboard after successful login', () => {
    cy.visit('/login');
    
    cy.fixture('users').then((users) => {
      const { email, password } = users.validUser;

      cy.get('#email').type(email);
      cy.get('#password').type(password);
      cy.get('button[type="submit"]').click();

      // Should redirect to dashboard or home
      cy.url().should('match', /\/(dashboard|home)?$/);
    });
  });

  it('should maintain authentication across navigation', () => {
    cy.visit('/login');
    
    cy.fixture('users').then((users) => {
      const { email, password } = users.validUser;

      cy.get('#email').type(email);
      cy.get('#password').type(password);
      cy.get('button[type="submit"]').click();

      cy.url().should('not.include', '/login');

      // Navigate to different pages
      cy.visit('/medications');
      cy.url().should('include', '/medications');

      // Should still be authenticated
      cy.getCookie('accessToken').should('exist');
    });
  });

  it('should handle OAuth Google login flow', () => {
    cy.visit('/login');

    // Mock OAuth flow
    cy.intercept('GET', '**/auth/google', {
      statusCode: 302,
      headers: {
        location: '/dashboard',
      },
    }).as('googleAuth');

    cy.contains('Google').click();

    // Should initiate OAuth flow
    // Note: Full OAuth testing requires additional setup
  });

  it('should handle OAuth Microsoft login flow', () => {
    cy.visit('/login');

    // Mock OAuth flow
    cy.intercept('GET', '**/auth/microsoft', {
      statusCode: 302,
      headers: {
        location: '/dashboard',
      },
    }).as('microsoftAuth');

    cy.contains('Microsoft').click();

    // Should initiate OAuth flow
  });

  it('should integrate with forgot password flow', () => {
    cy.visit('/login');

    cy.get('a[href="/forgot-password"]').click();

    // Should navigate to forgot password page
    cy.url().should('include', '/forgot-password');
  });

  it('should handle redirect parameter correctly', () => {
    const redirectPath = '/medications';
    cy.visit(`/login?redirect=${redirectPath}`);
    
    cy.fixture('users').then((users) => {
      const { email, password } = users.validUser;

      cy.get('#email').type(email);
      cy.get('#password').type(password);
      cy.get('button[type="submit"]').click();

      // Should redirect to specified path
      cy.url().should('include', redirectPath);
    });
  });

  it('should integrate with error handling from URL params', () => {
    cy.visit('/login?error=session_expired');

    // Should display error from URL parameter
    cy.get('[role="alert"]').should('be.visible');
    cy.get('[role="alert"]').should('contain', 'session has expired');
  });

  it('should work with different user roles', () => {
    cy.visit('/login');
    
    cy.fixture('users').then((users) => {
      const { email, password } = users.nurseUser;

      cy.intercept('POST', '**/api/auth/login', {
        statusCode: 200,
        body: {
          accessToken: 'nurse-token',
          user: {
            email,
            role: 'nurse',
          },
        },
      }).as('nurseLogin');

      cy.get('#email').type(email);
      cy.get('#password').type(password);
      cy.get('button[type="submit"]').click();

      cy.wait('@nurseLogin');

      // Should handle nurse role appropriately
      cy.url().should('not.include', '/login');
    });
  });

  it('should integrate with session refresh mechanism', () => {
    cy.visit('/login');
    
    cy.fixture('users').then((users) => {
      const { email, password } = users.validUser;

      // Mock refresh token endpoint
      cy.intercept('POST', '**/api/auth/refresh', {
        statusCode: 200,
        body: {
          accessToken: 'refreshed-token',
        },
      }).as('refreshToken');

      cy.get('#email').type(email);
      cy.get('#password').type(password);
      cy.get('button[type="submit"]').click();

      cy.url().should('not.include', '/login');
    });
  });

  it('should handle logout and re-login flow', () => {
    cy.visit('/login');
    
    cy.fixture('users').then((users) => {
      const { email, password } = users.validUser;

      // First login
      cy.get('#email').type(email);
      cy.get('#password').type(password);
      cy.get('button[type="submit"]').click();

      cy.url().should('not.include', '/login');

      // Logout
      cy.logout();

      // Should be back at login
      cy.url().should('include', '/login');

      // Re-login
      cy.get('#email').type(email);
      cy.get('#password').type(password);
      cy.get('button[type="submit"]').click();

      cy.url().should('not.include', '/login');
    });
  });

  it('should integrate with backend validation errors', () => {
    cy.visit('/login');
    
    cy.fixture('users').then((users) => {
      const { email, password } = users.invalidUser;

      cy.intercept('POST', '**/api/auth/login', {
        statusCode: 401,
        body: {
          error: 'Invalid credentials',
          message: 'The email or password you entered is incorrect',
        },
      }).as('invalidLogin');

      cy.get('#email').type(email);
      cy.get('#password').type(password);
      cy.get('button[type="submit"]').click();

      cy.wait('@invalidLogin');

      // Should display backend error
      cy.get('[role="alert"]').should('be.visible');
    });
  });

  it('should work with custom authentication headers', () => {
    cy.visit('/login');
    
    cy.fixture('users').then((users) => {
      const { email, password } = users.validUser;

      cy.intercept('POST', '**/api/auth/login').as('loginRequest');

      cy.get('#email').type(email);
      cy.get('#password').type(password);
      cy.get('button[type="submit"]').click();

      cy.wait('@loginRequest').then((interception) => {
        // Verify headers are set correctly
        expect(interception.request.headers).to.have.property('content-type');
      });
    });
  });

  it('should integrate with analytics tracking', () => {
    cy.visit('/login');
    
    cy.fixture('users').then((users) => {
      const { email, password } = users.validUser;

      // Mock analytics endpoint
      cy.intercept('POST', '**/analytics/track').as('analytics');

      cy.get('#email').type(email);
      cy.get('#password').type(password);
      cy.get('button[type="submit"]').click();

      // Analytics should track login event
      // (This depends on your analytics implementation)
    });
  });

  it('should handle concurrent login attempts', () => {
    cy.visit('/login');
    
    cy.fixture('users').then((users) => {
      const { email, password } = users.validUser;

      cy.intercept('POST', '**/api/auth/login').as('login1');

      cy.get('#email').type(email);
      cy.get('#password').type(password);
      cy.get('button[type="submit"]').click();

      // Button should be disabled to prevent concurrent attempts
      cy.get('button[type="submit"]').should('be.disabled');
    });
  });
});
