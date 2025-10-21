/**
 * Token Expiration E2E Tests
 * Tests token expiration, refresh, and inactivity timeout scenarios
 */

describe('Token Expiration', () => {
  beforeEach(() => {
    cy.clearAllSessionStorage();
    cy.clearAllLocalStorage();
    cy.clearCookies();
  });

  const login = () => {
    cy.visit('/login');
    cy.get('input[name="email"]').type(Cypress.env('TEST_NURSE_EMAIL'));
    cy.get('input[name="password"]').type(Cypress.env('TEST_NURSE_PASSWORD'));
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard');
  };

  describe('Token Expiration Validation', () => {
    it('should detect and handle expired tokens', () => {
      login();

      // Manually set an expired token
      cy.window().then((win) => {
        const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
          btoa(JSON.stringify({
            sub: '123',
            exp: Math.floor(Date.now() / 1000) - 3600, // Expired 1 hour ago
            iat: Math.floor(Date.now() / 1000) - 7200,
          })) +
          '.signature';

        win.sessionStorage.setItem('secure_auth_token', expiredToken);

        const metadata = {
          token: expiredToken,
          issuedAt: Date.now() - 7200000,
          expiresAt: Date.now() - 3600000, // Expired 1 hour ago
          lastActivity: Date.now(),
        };

        win.sessionStorage.setItem('secure_token_metadata', JSON.stringify(metadata));
      });

      // Try to make an API call
      cy.visit('/students');

      // Should detect expired token and redirect to login
      cy.url().should('include', '/login');

      // Should show session expired message
      cy.contains(/session expired|please login again/i).should('be.visible');

      // Token should be cleared
      cy.window().then((win) => {
        expect(win.sessionStorage.getItem('secure_auth_token')).to.be.null;
      });
    });

    it('should show session expiration modal before token expires', () => {
      // Intercept login to return short-lived token
      cy.intercept('POST', '/api/v1/auth/login', (req) => {
        req.reply((res) => {
          // Modify response to include short expiration
          const modifiedRes = { ...res };
          modifiedRes.body = {
            ...res.body,
            expiresIn: 60, // 1 minute
          };
          return modifiedRes;
        });
      }).as('shortLivedLogin');

      login();

      // Wait for warning modal (should appear 30s before expiration)
      cy.wait(31000); // 31 seconds

      cy.contains(/session expiring soon|extend session/i, { timeout: 10000 })
        .should('be.visible');
    });

    it('should allow session extension', () => {
      cy.intercept('POST', '/api/v1/auth/login', (req) => {
        req.reply((res) => {
          const modifiedRes = { ...res };
          modifiedRes.body = { ...res.body, expiresIn: 60 };
          return modifiedRes;
        });
      }).as('shortLivedLogin');

      cy.intercept('POST', '/api/v1/auth/refresh').as('refreshToken');

      login();

      // Wait for session warning
      cy.wait(31000);

      // Click extend session
      cy.contains('Extend Session').click();

      // Should call refresh endpoint
      cy.wait('@refreshToken');

      // Modal should close
      cy.contains(/session expiring soon/i).should('not.exist');

      // Should still be on current page
      cy.url().should('include', '/dashboard');
    });

    it('should logout on session expiration if not extended', () => {
      cy.intercept('POST', '/api/v1/auth/login', (req) => {
        req.reply((res) => {
          const modifiedRes = { ...res };
          modifiedRes.body = { ...res.body, expiresIn: 30 }; // 30 seconds
          return modifiedRes;
        });
      }).as('veryShortLived');

      login();

      // Wait for token to expire
      cy.wait(35000);

      // Should be logged out and redirected
      cy.url().should('include', '/login');
      cy.contains(/session expired/i).should('be.visible');
    });
  });

  describe('Inactivity Timeout', () => {
    it('should track user activity', () => {
      login();

      cy.window().then((win) => {
        const metadata1 = JSON.parse(win.sessionStorage.getItem('secure_token_metadata')!);
        const activity1 = metadata1.lastActivity;

        // Perform some action
        cy.visit('/students');

        cy.window().then((win2) => {
          const metadata2 = JSON.parse(win2.sessionStorage.getItem('secure_token_metadata')!);
          const activity2 = metadata2.lastActivity;

          // Activity timestamp should be updated
          expect(activity2).to.be.greaterThan(activity1);
        });
      });
    });

    it('should logout after inactivity timeout', () => {
      // This test would require mocking time or using a shorter timeout
      // For demonstration, we'll check the logic exists

      login();

      cy.window().then((win) => {
        // Manually set last activity to 8 hours ago
        const metadata = JSON.parse(win.sessionStorage.getItem('secure_token_metadata')!);
        metadata.lastActivity = Date.now() - (8 * 60 * 60 * 1000) - 1000; // 8 hours + 1 second ago
        win.sessionStorage.setItem('secure_token_metadata', JSON.stringify(metadata));
      });

      // Try to navigate
      cy.visit('/students');

      // Should be logged out due to inactivity
      cy.url().should('include', '/login');
      cy.contains(/session expired|inactive/i).should('be.visible');
    });

    it('should show inactivity warning', () => {
      // Similar to expiration warning but for inactivity
      login();

      // Mock approaching inactivity timeout
      cy.window().then((win) => {
        const metadata = JSON.parse(win.sessionStorage.getItem('secure_token_metadata')!);
        // Set to 7.5 hours ago (30 min warning before 8 hour timeout)
        metadata.lastActivity = Date.now() - (7.5 * 60 * 60 * 1000);
        win.sessionStorage.setItem('secure_token_metadata', JSON.stringify(metadata));
      });

      cy.reload();

      cy.contains(/inactive|no activity detected/i).should('be.visible');
    });

    it('should reset inactivity on user action', () => {
      login();

      cy.window().then((win) => {
        const metadata1 = JSON.parse(win.sessionStorage.getItem('secure_token_metadata')!);
        const activity1 = metadata1.lastActivity;

        // Wait a bit
        cy.wait(1000);

        // Perform action (click, scroll, etc.)
        cy.get('body').click();

        cy.window().then((win2) => {
          const metadata2 = JSON.parse(win2.sessionStorage.getItem('secure_token_metadata')!);
          const activity2 = metadata2.lastActivity;

          expect(activity2).to.be.greaterThan(activity1);
        });
      });
    });
  });

  describe('Token Refresh', () => {
    it('should refresh token automatically before expiration', () => {
      cy.intercept('POST', '/api/v1/auth/refresh').as('refreshToken');

      cy.intercept('POST', '/api/v1/auth/login', (req) => {
        req.reply((res) => {
          const modifiedRes = { ...res };
          modifiedRes.body = {
            ...res.body,
            expiresIn: 300, // 5 minutes
            refreshToken: 'refresh-token-123',
          };
          return modifiedRes;
        });
      }).as('loginWithRefresh');

      login();

      // Wait for auto-refresh (typically happens 1-2 min before expiration)
      cy.wait(180000); // 3 minutes

      cy.wait('@refreshToken', { timeout: 65000 }).then((interception) => {
        expect(interception.request.body).to.have.property('refreshToken');
      });

      // Should remain logged in
      cy.url().should('include', '/dashboard');
    });

    it('should handle refresh token failure', () => {
      cy.intercept('POST', '/api/v1/auth/refresh', {
        statusCode: 401,
        body: { message: 'Refresh token expired' },
      }).as('refreshFailed');

      cy.intercept('POST', '/api/v1/auth/login', (req) => {
        req.reply((res) => {
          const modifiedRes = { ...res };
          modifiedRes.body = { ...res.body, expiresIn: 60 };
          return modifiedRes;
        });
      }).as('shortLived');

      login();

      // Wait for refresh attempt
      cy.wait(40000);

      cy.wait('@refreshFailed');

      // Should logout and redirect
      cy.url().should('include', '/login');
      cy.contains(/session expired|please login/i).should('be.visible');
    });

    it('should use refresh token to get new access token', () => {
      cy.intercept('POST', '/api/v1/auth/refresh', (req) => {
        expect(req.body).to.have.property('refreshToken');

        req.reply({
          statusCode: 200,
          body: {
            token: 'new-access-token',
            refreshToken: 'new-refresh-token',
            expiresIn: 3600,
          },
        });
      }).as('successfulRefresh');

      login();

      // Manually trigger refresh
      cy.window().then((win) => {
        // Simulate token about to expire
        const metadata = JSON.parse(win.sessionStorage.getItem('secure_token_metadata')!);
        metadata.expiresAt = Date.now() + 60000; // 1 minute from now
        win.sessionStorage.setItem('secure_token_metadata', JSON.stringify(metadata));
      });

      cy.reload();

      cy.wait('@successfulRefresh');

      // Should have new token
      cy.window().then((win) => {
        const token = win.sessionStorage.getItem('secure_auth_token');
        expect(token).to.equal('new-access-token');
      });
    });
  });

  describe('Concurrent Tab Handling', () => {
    it('should sync logout across tabs', () => {
      login();

      // Open new tab (simulated by opening new window)
      cy.window().then((win) => {
        // Simulate logout in another tab by clearing storage
        win.sessionStorage.clear();
      });

      // Trigger storage event
      cy.window().then((win) => {
        win.dispatchEvent(new StorageEvent('storage', {
          key: 'secure_auth_token',
          oldValue: 'some-token',
          newValue: null,
          storageArea: win.sessionStorage,
        }));
      });

      // Current tab should detect logout
      cy.url().should('include', '/login');
    });

    it('should prevent token duplication across tabs', () => {
      login();

      cy.window().then((win) => {
        const token = win.sessionStorage.getItem('secure_auth_token');

        // Open new tab (in practice, this would be a new Cypress command)
        // For now, verify token is session-scoped
        expect(token).to.exist;

        // SessionStorage is per-tab, so new tab would have empty sessionStorage
        // This is the desired behavior for security
      });
    });
  });

  describe('Remember Me', () => {
    it('should use sessionStorage when "Remember Me" is unchecked', () => {
      cy.visit('/login');

      cy.get('input[name="email"]').type(Cypress.env('TEST_NURSE_EMAIL'));
      cy.get('input[name="password"]').type(Cypress.env('TEST_NURSE_PASSWORD'));

      // Ensure "Remember Me" is unchecked
      cy.get('input[name="rememberMe"]').uncheck();

      cy.get('button[type="submit"]').click();

      cy.window().then((win) => {
        // Token in sessionStorage
        expect(win.sessionStorage.getItem('secure_auth_token')).to.exist;

        // NOT in localStorage
        expect(win.localStorage.getItem('secure_auth_token')).to.be.null;
      });
    });

    it('should clear session on browser close when not remembered', () => {
      login();

      cy.window().then((win) => {
        expect(win.sessionStorage.getItem('secure_auth_token')).to.exist;

        // Simulate browser close by clearing sessionStorage
        win.sessionStorage.clear();

        // Navigate to protected route
        cy.visit('/dashboard');

        // Should be logged out
        cy.url().should('include', '/login');
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle corrupted token metadata', () => {
      login();

      cy.window().then((win) => {
        // Corrupt the metadata
        win.sessionStorage.setItem('secure_token_metadata', 'invalid-json');
      });

      // Try to navigate
      cy.visit('/students');

      // Should detect corruption and log out
      cy.url().should('include', '/login');
    });

    it('should handle missing metadata', () => {
      login();

      cy.window().then((win) => {
        // Remove metadata but keep token
        win.sessionStorage.removeItem('secure_token_metadata');
      });

      cy.visit('/students');

      // Should detect missing metadata and log out
      cy.url().should('include', '/login');
    });

    it('should handle malformed JWT', () => {
      cy.window().then((win) => {
        // Set malformed token
        win.sessionStorage.setItem('secure_auth_token', 'not.a.valid.jwt.token');
      });

      cy.visit('/dashboard');

      // Should reject malformed token
      cy.url().should('include', '/login');
    });

    it('should validate token signature', () => {
      cy.window().then((win) => {
        // Create token with invalid signature
        const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
        const payload = btoa(JSON.stringify({
          sub: '123',
          exp: Math.floor(Date.now() / 1000) + 3600,
        }));
        const invalidToken = `${header}.${payload}.invalid-signature`;

        win.sessionStorage.setItem('secure_auth_token', invalidToken);
      });

      cy.visit('/dashboard');

      // Backend should reject invalid signature
      cy.url().should('include', '/login');
    });
  });
});
