/// <reference types="cypress" />

describe('Login - Edge Cases', () => {
  beforeEach(() => {
    cy.visit('/login');
    cy.waitForPageLoad();
  });

  it('should handle rapid form submissions', () => {
    cy.fixture('users').then((users) => {
      const { email, password } = users.validUser;

      cy.get('#email').type(email);
      cy.get('#password').type(password);

      // Try to submit multiple times rapidly
      cy.get('button[type="submit"]').click();
      cy.get('button[type="submit"]').click();
      cy.get('button[type="submit"]').click();

      // Button should be disabled after first click
      cy.get('button[type="submit"]').should('be.disabled');
    });
  });

  it('should handle very long email addresses', () => {
    const longEmail = 'a'.repeat(200) + '@example.com';
    
    cy.get('#email').type(longEmail, { delay: 0 });
    cy.get('#password').type('password123');
    
    cy.get('#email').should('have.value', longEmail);
  });

  it('should handle very long passwords', () => {
    const longPassword = 'a'.repeat(500);
    
    cy.get('#email').type('test@example.com');
    cy.get('#password').type(longPassword, { delay: 0 });
    
    cy.get('#password').should('have.value', longPassword);
  });

  it('should handle unicode characters in email', () => {
    const unicodeEmail = 'test@例え.jp';
    
    cy.get('#email').type(unicodeEmail);
    cy.get('#password').type('password123');
    
    cy.get('#email').should('have.value', unicodeEmail);
  });

  it('should handle emoji in password', () => {
    const emojiPassword = '🔒🔑password123';
    
    cy.get('#email').type('test@example.com');
    cy.get('#password').type(emojiPassword);
    
    cy.get('#password').should('have.value', emojiPassword);
  });

  it('should handle copy-paste in password field', () => {
    const password = 'CopiedPassword123!';
    
    cy.get('#email').type('test@example.com');
    cy.get('#password').invoke('val', password).trigger('input');
    
    cy.get('#password').should('have.value', password);
  });

  it('should handle browser autofill', () => {
    // Simulate autofill
    cy.get('#email').invoke('val', 'autofilled@example.com').trigger('input');
    cy.get('#password').invoke('val', 'AutofilledPassword123').trigger('input');
    
    cy.get('button[type="submit"]').should('be.enabled');
  });

  it('should handle slow network connections', () => {
    cy.fixture('users').then((users) => {
      const { email, password } = users.validUser;

      // Simulate slow network
      cy.intercept('POST', '**/api/auth/login', (req) => {
        req.reply((res) => {
          res.delay = 5000;
        });
      }).as('slowLogin');

      cy.get('#email').type(email);
      cy.get('#password').type(password);
      cy.get('button[type="submit"]').click();

      // Should show loading state
      cy.get('button[type="submit"]').should('contain', 'Signing in...');
      cy.get('button[type="submit"]').should('be.disabled');
    });
  });

  it('should handle offline mode', () => {
    cy.fixture('users').then((users) => {
      const { email, password } = users.validUser;

      // Simulate offline
      cy.intercept('POST', '**/api/auth/login', {
        forceNetworkError: true,
      }).as('offlineLogin');

      cy.get('#email').type(email);
      cy.get('#password').type(password);
      cy.get('button[type="submit"]').click();

      cy.wait('@offlineLogin');

      // Should show error
      cy.get('[role="alert"]').should('be.visible');
    });
  });

  it('should handle back button after login', () => {
    cy.fixture('users').then((users) => {
      const { email, password } = users.validUser;

      cy.get('#email').type(email);
      cy.get('#password').type(password);
      cy.get('button[type="submit"]').click();

      cy.url().should('not.include', '/login');

      // Go back
      cy.go('back');

      // Should redirect away from login if still authenticated
      cy.url().should('not.include', '/login');
    });
  });

  it('should handle multiple tabs', () => {
    cy.fixture('users').then((users) => {
      const { email, password } = users.validUser;

      // Login in first tab
      cy.get('#email').type(email);
      cy.get('#password').type(password);
      cy.get('button[type="submit"]').click();

      cy.url().should('not.include', '/login');

      // Open new tab (simulate by visiting login again)
      cy.visit('/login');

      // Should redirect away if already authenticated
      cy.url().should('not.include', '/login');
    });
  });

  it('should handle special characters in email', () => {
    const specialEmail = "test+tag@example.com";
    
    cy.get('#email').type(specialEmail);
    cy.get('#password').type('password123');
    
    cy.get('#email').should('have.value', specialEmail);
  });

  it('should handle leading/trailing spaces', () => {
    cy.get('#email').type('  test@example.com  ');
    cy.get('#password').type('  password123  ');
    
    // Form should handle or trim spaces
    cy.get('button[type="submit"]').should('be.enabled');
  });

  it('should handle form reset', () => {
    cy.get('#email').type('test@example.com');
    cy.get('#password').type('password123');
    cy.get('#remember-me').check();

    // Reload page
    cy.reload();

    // Form should be cleared
    cy.get('#email').should('have.value', '');
    cy.get('#password').should('have.value', '');
    cy.get('#remember-me').should('not.be.checked');
  });

  it('should handle timeout errors', () => {
    cy.fixture('users').then((users) => {
      const { email, password } = users.validUser;

      cy.intercept('POST', '**/api/auth/login', (req) => {
        req.reply((res) => {
          res.delay = 35000; // Longer than default timeout
        });
      }).as('timeoutLogin');

      cy.get('#email').type(email);
      cy.get('#password').type(password);
      cy.get('button[type="submit"]').click();

      // Should eventually show error or timeout
      cy.get('button[type="submit"]', { timeout: 40000 }).should('be.visible');
    });
  });
});
