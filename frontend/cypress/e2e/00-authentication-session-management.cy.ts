/// <reference types="cypress" />

describe('Authentication and Session Management - Comprehensive Testing', () => {
  beforeEach(() => {
    cy.clearCookies()
    cy.clearLocalStorage()
    
    // Mock authentication API calls
    cy.intercept('POST', '**/api/auth/login', (req) => {
      const { email, password } = req.body
      
      if (email === 'nurse@school.edu' && password === 'NursePassword123!') {
        req.reply({
          statusCode: 200,
          body: {
            success: true,
            data: {
              token: 'mock-nurse-token',
              user: { id: '1', email: 'nurse@school.edu', role: 'NURSE' },
              expiresAt: new Date(Date.now() + 3600000).toISOString()
            }
          }
        })
      } else if (email === 'expired@school.edu' && password === 'ExpiredPassword123!') {
        req.reply({
          statusCode: 200,
          body: {
            success: true,
            data: {
              token: 'mock-expired-token',
              user: { id: '2', email: 'expired@school.edu', role: 'NURSE' },
              expiresAt: new Date(Date.now() - 1000).toISOString() // Already expired
            }
          }
        })
      } else {
        req.reply({
          statusCode: 401,
          body: {
            success: false,
            error: { message: 'Invalid credentials' }
          }
        })
      }
    }).as('loginRequest')
    
    // Mock token verification
    cy.intercept('GET', '**/api/auth/verify', (req) => {
      const authHeader = req.headers.authorization
      const token = Array.isArray(authHeader) ? authHeader[0]?.replace('Bearer ', '') : authHeader?.replace('Bearer ', '')
      
      if (token === 'mock-nurse-token') {
        req.reply({
          statusCode: 200,
          body: {
            success: true,
            data: { id: '1', email: 'nurse@school.edu', role: 'NURSE', isActive: true }
          }
        })
      } else if (token === 'mock-expired-token' || !token) {
        req.reply({
          statusCode: 401,
          body: {
            success: false,
            error: { message: 'Token expired', code: 'TOKEN_EXPIRED' }
          }
        })
      } else {
        req.reply({
          statusCode: 401,
          body: {
            success: false,
            error: { message: 'Invalid token' }
          }
        })
      }
    }).as('verifyToken')
  })

  describe('Basic Authentication Flow', () => {
    it('should successfully log in with valid credentials', () => {
      cy.visit('/login')
      cy.get('[data-testid="email-input"]').type('nurse@school.edu')
      cy.get('[data-testid="password-input"]').type('NursePassword123!')
      cy.get('[data-testid="login-button"]').click()
      
      cy.wait('@loginRequest')
      cy.url().should('not.include', '/login')
      cy.get('[data-testid="user-menu"]').should('be.visible')
      
      // Verify token is stored
      cy.window().then((win) => {
        const token = win.localStorage.getItem('authToken')
        expect(token).to.exist
      })
    })

    it('should reject invalid credentials', () => {
      cy.visit('/login')
      cy.get('[data-testid="email-input"]').type('invalid@school.edu')
      cy.get('[data-testid="password-input"]').type('wrongpassword')
      cy.get('[data-testid="login-button"]').click()
      
      cy.wait('@loginRequest')
      cy.get('[data-testid="error-message"]').should('contain', 'Invalid credentials')
      cy.url().should('include', '/login')
    })

    it('should redirect unauthenticated users to login page', () => {
      cy.visit('/students')
      cy.url().should('include', '/login')
      cy.get('[data-testid="auth-required-message"]')
        .should('be.visible')
        .and('contain.text', 'Please log in to access')
    })
  })

  describe('Session Management', () => {
    beforeEach(() => {
      // Login for session management tests
      cy.visit('/login')
      cy.get('[data-testid="email-input"]').type('nurse@school.edu')
      cy.get('[data-testid="password-input"]').type('NursePassword123!')
      cy.get('[data-testid="login-button"]').click()
      cy.wait('@loginRequest')
      cy.url().should('not.include', '/login')
    })

    it('should maintain session across page refreshes', () => {
      cy.visit('/students')
      cy.get('[data-testid="user-menu"]').should('be.visible')
      
      cy.reload()
      cy.get('[data-testid="user-menu"]').should('be.visible')
      cy.url().should('not.include', '/login')
    })

    it('should maintain session across different pages', () => {
      cy.visit('/students')
      cy.get('[data-testid="user-menu"]').should('be.visible')
      
      cy.visit('/medications')
      cy.get('[data-testid="user-menu"]').should('be.visible')
      cy.url().should('not.include', '/login')
      
      cy.visit('/health-records')
      cy.get('[data-testid="user-menu"]').should('be.visible')
      cy.url().should('not.include', '/login')
    })

    it('should handle session expiration gracefully', () => {
      cy.visit('/students')
      cy.get('[data-testid="user-menu"]').should('be.visible')
      
      // Simulate session expiration
      cy.window().then((win) => {
        win.localStorage.removeItem('authToken')
        win.localStorage.removeItem('token')
      })
      
      // Mock expired token response
      cy.intercept('GET', '**/api/auth/verify', {
        statusCode: 401,
        body: {
          success: false,
          error: { message: 'Token expired', code: 'TOKEN_EXPIRED' }
        }
      }).as('expiredTokenCheck')
      
      // Try to navigate to another protected route
      cy.visit('/medications')
      cy.url().should('include', '/login')
      cy.get('[data-testid="session-expired-message"]')
        .should('be.visible')
        .and('contain.text', 'session has expired')
    })

    it('should handle token expiration during API calls', () => {
      cy.visit('/students')
      cy.get('[data-testid="user-menu"]').should('be.visible')
      
      // Mock API calls to return 401
      cy.intercept('GET', '**/api/students*', {
        statusCode: 401,
        body: {
          success: false,
          error: { message: 'Token expired', code: 'TOKEN_EXPIRED' }
        }
      }).as('expiredApiCall')
      
      // Trigger an API call
      cy.get('[data-testid="refresh-button"]').click()
      
      // Should redirect to login
      cy.url().should('include', '/login')
      cy.get('[data-testid="session-expired-message"]')
        .should('be.visible')
        .and('contain.text', 'session has expired')
    })

    it('should clear all authentication data on logout', () => {
      cy.visit('/students')
      cy.get('[data-testid="user-menu"]').should('be.visible')
      
      // Logout
      cy.get('[data-testid="user-menu"]').click()
      cy.get('[data-testid="logout-button"]').click()
      
      // Verify redirect to login
      cy.url().should('include', '/login')
      
      // Verify tokens are cleared
      cy.window().then((win) => {
        expect(win.localStorage.getItem('authToken')).to.be.null
        expect(win.localStorage.getItem('token')).to.be.null
        expect(win.localStorage.getItem('refreshToken')).to.be.null
      })
      
      // Verify can't access protected routes
      cy.visit('/students')
      cy.url().should('include', '/login')
    })
  })

  describe('Multiple Authentication Scenarios', () => {
    it('should handle concurrent session expiration across multiple tabs', () => {
      // Simulate multiple tab scenario by storing session data
      cy.visit('/login')
      cy.get('[data-testid="email-input"]').type('nurse@school.edu')
      cy.get('[data-testid="password-input"]').type('NursePassword123!')
      cy.get('[data-testid="login-button"]').click()
      cy.wait('@loginRequest')
      
      cy.visit('/students')
      cy.get('[data-testid="user-menu"]').should('be.visible')
      
      // Simulate session expiration in another tab by clearing storage
      cy.window().then((win) => {
        // Simulate another tab clearing the session
        win.localStorage.removeItem('authToken')
        // Trigger a storage event like another tab would
        win.dispatchEvent(new StorageEvent('storage', {
          key: 'authToken',
          oldValue: 'mock-nurse-token',
          newValue: null
        }))
      })
      
      // Should detect session loss and redirect
      cy.wait(1000) // Give time for storage event to propagate
      cy.visit('/medications') // Try to navigate
      cy.url().should('include', '/login')
    })

    it('should handle network failures during authentication', () => {
      // Mock network failure
      cy.intercept('POST', '**/api/auth/login', {
        forceNetworkError: true
      }).as('networkFailure')
      
      cy.visit('/login')
      cy.get('[data-testid="email-input"]').type('nurse@school.edu')
      cy.get('[data-testid="password-input"]').type('NursePassword123!')
      cy.get('[data-testid="login-button"]').click()
      
      cy.get('[data-testid="network-error-message"]')
        .should('be.visible')
        .and('contain.text', 'Network error')
      cy.url().should('include', '/login')
    })

    it('should handle malformed authentication responses', () => {
      cy.intercept('POST', '**/api/auth/login', {
        statusCode: 200,
        body: { invalid: 'response' } // Malformed response
      }).as('malformedResponse')
      
      cy.visit('/login')
      cy.get('[data-testid="email-input"]').type('nurse@school.edu')
      cy.get('[data-testid="password-input"]').type('NursePassword123!')
      cy.get('[data-testid="login-button"]').click()
      
      cy.get('[data-testid="error-message"]')
        .should('be.visible')
        .and('contain.text', 'Authentication failed')
      cy.url().should('include', '/login')
    })
  })

  describe('Security Validations', () => {
    it('should not store sensitive data in localStorage after logout', () => {
      cy.visit('/login')
      cy.get('[data-testid="email-input"]').type('nurse@school.edu')
      cy.get('[data-testid="password-input"]').type('NursePassword123!')
      cy.get('[data-testid="login-button"]').click()
      cy.wait('@loginRequest')
      
      cy.visit('/students')
      cy.get('[data-testid="user-menu"]').click()
      cy.get('[data-testid="logout-button"]').click()
      
      // Verify no sensitive data remains
      cy.window().then((win) => {
        const keys = Object.keys(win.localStorage)
        keys.forEach(key => {
          const value = win.localStorage.getItem(key)
          expect(value).to.not.contain('token')
          expect(value).to.not.contain('password')
          expect(value).to.not.contain('auth')
        })
      })
    })

    it('should validate session on each protected route access', () => {
      cy.visit('/login')
      cy.get('[data-testid="email-input"]').type('nurse@school.edu')
      cy.get('[data-testid="password-input"]').type('NursePassword123!')
      cy.get('[data-testid="login-button"]').click()
      cy.wait('@loginRequest')
      
      // Each protected route should validate session
      cy.visit('/students')
      cy.wait('@verifyToken')
      cy.get('[data-testid="user-menu"]').should('be.visible')
      
      cy.visit('/medications')  
      cy.wait('@verifyToken')
      cy.get('[data-testid="user-menu"]').should('be.visible')
      
      cy.visit('/health-records')
      cy.wait('@verifyToken')
      cy.get('[data-testid="user-menu"]').should('be.visible')
    })

    it('should enforce session timeout limits', () => {
      // Login with a token that's about to expire
      cy.visit('/login')
      cy.get('[data-testid="email-input"]').type('expired@school.edu')
      cy.get('[data-testid="password-input"]').type('ExpiredPassword123!')
      cy.get('[data-testid="login-button"]').click()
      cy.wait('@loginRequest')
      
      // Immediately try to access a protected route
      cy.visit('/students')
      
      // Should be redirected due to expired token
      cy.url().should('include', '/login')
      cy.get('[data-testid="session-expired-message"]')
        .should('be.visible')
        .and('contain.text', 'session has expired')
    })
  })
})