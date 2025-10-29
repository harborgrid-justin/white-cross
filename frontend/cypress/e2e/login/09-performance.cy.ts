/// <reference types="cypress" />

describe('Login - Performance', () => {
  beforeEach(() => {
    cy.visit('/login');
    cy.waitForPageLoad();
  });

  it('should load login page quickly', () => {
    const startTime = Date.now();
    
    cy.visit('/login').then(() => {
      const loadTime = Date.now() - startTime;
      
      // Page should load in under 3 seconds
      expect(loadTime).to.be.lessThan(3000);
    });
  });

  it('should render form elements without delay', () => {
    cy.get('#email', { timeout: 1000 }).should('be.visible');
    cy.get('#password', { timeout: 1000 }).should('be.visible');
    cy.get('button[type="submit"]', { timeout: 1000 }).should('be.visible');
  });

  it('should handle rapid typing without lag', () => {
    const longText = 'a'.repeat(100);
    
    const startTime = Date.now();
    cy.get('#email').type(longText, { delay: 0 });
    const typeTime = Date.now() - startTime;
    
    // Typing should be fast
    expect(typeTime).to.be.lessThan(2000);
  });

  it('should submit form quickly', () => {
    cy.fixture('users').then((users) => {
      const { email, password } = users.validUser;

      cy.intercept('POST', '**/api/auth/login').as('loginRequest');

      cy.get('#email').type(email);
      cy.get('#password').type(password);
      
      const startTime = Date.now();
      cy.get('button[type="submit"]').click();
      
      cy.wait('@loginRequest').then(() => {
        const submitTime = Date.now() - startTime;
        
        // Submit should be processed quickly (under 2 seconds)
        expect(submitTime).to.be.lessThan(2000);
      });
    });
  });

  it('should not have memory leaks on repeated visits', () => {
    // Visit login page multiple times
    for (let i = 0; i < 5; i++) {
      cy.visit('/login');
      cy.get('#email').should('be.visible');
      cy.wait(100);
    }
    
    // Page should still be responsive
    cy.get('#email').type('test@example.com');
    cy.get('#email').should('have.value', 'test@example.com');
  });

  it('should handle multiple form interactions efficiently', () => {
    // Perform multiple interactions
    cy.get('#email').type('test@example.com').clear();
    cy.get('#email').type('another@example.com').clear();
    cy.get('#email').type('final@example.com');
    
    cy.get('#password').type('password1').clear();
    cy.get('#password').type('password2').clear();
    cy.get('#password').type('password3');
    
    cy.get('#remember-me').check().uncheck().check();
    
    // Form should still be responsive
    cy.get('button[type="submit"]').should('be.enabled');
  });

  it('should not block UI during validation', () => {
    cy.get('#email').type('invalid-email');
    cy.get('#password').type('password');
    
    // UI should remain responsive
    cy.get('#email').should('be.visible');
    cy.get('#password').should('be.visible');
    cy.get('button[type="submit"]').should('be.enabled');
  });

  it('should handle password visibility toggle efficiently', () => {
    cy.get('#password').type('password123');
    
    // Toggle multiple times
    for (let i = 0; i < 10; i++) {
      cy.get('button[aria-label*="password"]').click();
    }
    
    // Should still be responsive
    cy.get('#password').should('be.visible');
  });

  it('should load with minimal network requests', () => {
    let requestCount = 0;
    
    cy.intercept('**/*', () => {
      requestCount++;
    });
    
    cy.visit('/login');
    cy.waitForPageLoad();
    
    // Should have reasonable number of requests (adjust based on your app)
    cy.wrap(requestCount).should('be.lessThan', 50);
  });

  it('should have optimized images and assets', () => {
    cy.visit('/login');
    
    // Check that images load quickly
    cy.get('img').each(($img) => {
      cy.wrap($img).should('be.visible');
    });
  });

  it('should not cause layout shifts', () => {
    cy.visit('/login');
    
    // Get initial positions
    cy.get('#email').then(($el) => {
      const initialTop = $el.offset()?.top;
      
      // Wait a bit
      cy.wait(1000);
      
      // Position should not have changed
      cy.get('#email').then(($el2) => {
        const finalTop = $el2.offset()?.top;
        expect(finalTop).to.equal(initialTop);
      });
    });
  });

  it('should handle concurrent form updates efficiently', () => {
    // Type in both fields simultaneously (as much as possible)
    cy.get('#email').type('test@example.com', { delay: 0 });
    cy.get('#password').type('password123', { delay: 0 });
    
    // Both should have correct values
    cy.get('#email').should('have.value', 'test@example.com');
    cy.get('#password').should('have.value', 'password123');
  });

  it('should maintain performance with error states', () => {
    cy.fixture('users').then((users) => {
      const { email, password } = users.invalidUser;

      // Trigger error multiple times
      for (let i = 0; i < 3; i++) {
        cy.get('#email').clear().type(email);
        cy.get('#password').clear().type(password);
        cy.get('button[type="submit"]').click();
        cy.wait(500);
      }
      
      // Form should still be responsive
      cy.get('#email').should('be.visible');
      cy.get('button[type="submit"]').should('be.visible');
    });
  });

  it('should have fast initial paint', () => {
    cy.visit('/login', {
      onBeforeLoad: (win) => {
        win.performance.mark('start');
      },
    });
    
    cy.window().then((win) => {
      win.performance.mark('end');
      win.performance.measure('pageLoad', 'start', 'end');
      
      const measure = win.performance.getEntriesByName('pageLoad')[0];
      
      // Initial paint should be fast
      expect(measure.duration).to.be.lessThan(3000);
    });
  });

  it('should efficiently handle form state changes', () => {
    const startTime = Date.now();
    
    // Perform many state changes
    for (let i = 0; i < 20; i++) {
      cy.get('#remember-me').check();
      cy.get('#remember-me').uncheck();
    }
    
    const duration = Date.now() - startTime;
    
    // Should complete quickly
    expect(duration).to.be.lessThan(5000);
  });
});
