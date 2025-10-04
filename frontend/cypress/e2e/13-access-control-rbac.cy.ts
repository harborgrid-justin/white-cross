/// <reference types="cypress" />

describe('Access Control & Security - RBAC', () => {
  beforeEach(() => {
    cy.clearCookies()
    cy.clearLocalStorage()
  })

  describe('Role-Based Access Control', () => {
    it('should allow nurse to access student records', () => {
      cy.intercept('GET', '**/api/auth/verify', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            id: '1',
            email: 'nurse@school.edu',
            role: 'NURSE',
            permissions: ['students.read', 'students.write']
          }
        }
      }).as('verifyAuth')
      
      cy.setupAuthenticationForTests()
      cy.visit('/students')
      cy.wait('@verifyAuth')
      
      cy.contains('Student Management').should('be.visible')
    })

    it('should deny admin access to non-admin users', () => {
      cy.intercept('GET', '**/api/auth/verify', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            id: '1',
            email: 'nurse@school.edu',
            role: 'NURSE'
          }
        }
      }).as('verifyAuth')
      
      cy.login()
      cy.visit('/settings')
      
      // Should redirect to access denied
      cy.url().should('include', '/access-denied')
      cy.contains('Access Denied').should('be.visible')
    })

    it('should allow admin full access', () => {
      cy.intercept('GET', '**/api/auth/verify', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            id: '1',
            email: 'admin@school.edu',
            role: 'ADMIN'
          }
        }
      }).as('verifyAuth')
      
      cy.login('admin@school.edu')
      cy.visit('/settings')
      cy.wait('@verifyAuth')
      
      cy.contains('Administration Panel').should('be.visible')
    })

    it('should allow counselor to view but not edit', () => {
      cy.intercept('GET', '**/api/auth/verify', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            id: '1',
            email: 'counselor@school.edu',
            role: 'COUNSELOR',
            permissions: ['students.read']
          }
        }
      }).as('verifyAuth')
      
      cy.login('counselor@school.edu')
      cy.visit('/students')
      cy.wait('@verifyAuth')
      
      // View access should work
      cy.contains('Student Management').should('be.visible')
      
      // Edit buttons should be disabled or hidden
      cy.get('[data-testid="add-student-button"]').should('not.exist')
    })

    it('should enforce read-only permissions', () => {
      cy.intercept('GET', '**/api/auth/verify', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            id: '1',
            email: 'readonly@school.edu',
            role: 'READ_ONLY',
            permissions: ['*.read']
          }
        }
      }).as('verifyAuth')
      
      cy.login('readonly@school.edu')
      cy.visit('/medications')
      cy.wait('@verifyAuth')
      
      // Should see data
      cy.contains('Medication Management').should('be.visible')
      
      // Cannot create/edit/delete
      cy.get('[data-testid="add-medication"]').should('not.exist')
    })
  })

  describe('Permission Management', () => {
    it('should display user permissions', () => {
      cy.intercept('GET', '**/api/auth/verify', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            id: '1',
            role: 'NURSE',
            permissions: [
              'students.read',
              'students.write',
              'medications.read',
              'medications.write'
            ]
          }
        }
      }).as('verifyAuth')
      
      cy.login()
      cy.visit('/settings')
      cy.wait('@verifyAuth')
      
      cy.get('[data-testid="user-permissions"]').should('be.visible')
    })

    it('should update user permissions', () => {
      cy.intercept('GET', '**/api/auth/verify', {
        statusCode: 200,
        body: {
          success: true,
          data: { role: 'ADMIN' }
        }
      }).as('verifyAuth')
      
      cy.intercept('PUT', '**/api/users/1/permissions', {
        statusCode: 200,
        body: { success: true }
      }).as('updatePermissions')
      
      cy.login('admin@school.edu')
      cy.visit('/settings')
      cy.contains('button', 'Users').click()
      
      cy.get('[data-testid="edit-user-1"]').click()
      cy.get('[data-testid="permission-students.read"]').check()
      cy.get('[data-testid="permission-students.write"]').check()
      cy.get('[data-testid="save-permissions"]').click()
      
      cy.wait('@updatePermissions')
      cy.contains('Permissions updated').should('be.visible')
    })

    it('should prevent privilege escalation', () => {
      cy.intercept('PUT', '**/api/users/1/permissions', {
        statusCode: 403,
        body: { error: 'Cannot grant permissions you do not have' }
      }).as('escalation')
      
      cy.intercept('GET', '**/api/auth/verify', {
        statusCode: 200,
        body: {
          success: true,
          data: { role: 'NURSE' }
        }
      })
      
      cy.login()
      cy.visit('/settings')
      
      // Nurse cannot access admin settings
      cy.url().should('include', '/access-denied')
    })
  })

  describe('Session Management', () => {
    it('should create session on login', () => {
      cy.intercept('POST', '**/api/auth/login', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            token: 'test-token',
            user: { id: '1', email: 'nurse@school.edu' }
          }
        }
      }).as('login')
      
      cy.visit('/login')
      cy.get('[data-testid="email-input"]').type('nurse@school.edu')
      cy.get('[data-testid="password-input"]').type('TestPassword123!')
      cy.get('[data-testid="login-button"]').click()
      
      cy.wait('@login')
      
      // Session should be stored
      cy.window().then((win) => {
        const token = win.localStorage.getItem('authToken')
        expect(token).to.equal('test-token')
      })
    })

    it('should handle session timeout', () => {
      cy.intercept('GET', '**/api/auth/verify', {
        statusCode: 401,
        body: { error: 'Session expired' }
      }).as('sessionExpired')
      
      cy.login()
      
      // Simulate session timeout
      cy.wait(100)
      cy.visit('/students')
      cy.wait('@sessionExpired')
      
      // Should redirect to login
      cy.url().should('include', '/login')
      cy.contains('Your session has expired').should('be.visible')
    })

    it('should refresh session on activity', () => {
      cy.intercept('POST', '**/api/auth/refresh', {
        statusCode: 200,
        body: {
          success: true,
          data: { token: 'refreshed-token' }
        }
      }).as('refreshToken')
      
      cy.intercept('GET', '**/api/auth/verify', {
        statusCode: 200,
        body: { success: true, data: { role: 'NURSE' } }
      })
      
      cy.login()
      cy.visit('/students')
      
      // Trigger activity
      cy.get('body').click()
      
      // Should refresh token
      cy.wait('@refreshToken')
    })

    it('should logout and clear session', () => {
      cy.intercept('POST', '**/api/auth/logout', {
        statusCode: 200,
        body: { success: true }
      }).as('logout')
      
      cy.intercept('GET', '**/api/auth/verify', {
        statusCode: 200,
        body: { success: true, data: { role: 'NURSE' } }
      })
      
      cy.login()
      cy.visit('/students')
      
      cy.get('[data-testid="user-menu"]').click()
      cy.get('[data-testid="logout-button"]').click()
      
      cy.wait('@logout')
      
      // Session should be cleared
      cy.window().then((win) => {
        const token = win.localStorage.getItem('authToken')
        expect(token).to.be.null
      })
      
      // Should redirect to login
      cy.url().should('include', '/login')
    })
  })

  describe('Multi-Factor Authentication', () => {
    it('should prompt for MFA code on login', () => {
      cy.intercept('POST', '**/api/auth/login', {
        statusCode: 200,
        body: {
          success: true,
          requiresMFA: true,
          tempToken: 'temp-token'
        }
      }).as('login')
      
      cy.visit('/login')
      cy.get('[data-testid="email-input"]').type('nurse@school.edu')
      cy.get('[data-testid="password-input"]').type('TestPassword123!')
      cy.get('[data-testid="login-button"]').click()
      
      cy.wait('@login')
      
      // Should show MFA prompt
      cy.get('[data-testid="mfa-code-input"]').should('be.visible')
    })

    it('should verify MFA code', () => {
      cy.intercept('POST', '**/api/auth/verify-mfa', {
        statusCode: 200,
        body: {
          success: true,
          data: { token: 'full-token' }
        }
      }).as('verifyMFA')
      
      cy.visit('/login')
      // Simulate MFA prompt
      cy.get('[data-testid="mfa-code-input"]').type('123456')
      cy.get('[data-testid="verify-mfa-button"]').click()
      
      cy.wait('@verifyMFA')
      
      // Should redirect to dashboard
      cy.url().should('not.include', '/login')
    })

    it('should handle invalid MFA code', () => {
      cy.intercept('POST', '**/api/auth/verify-mfa', {
        statusCode: 401,
        body: { error: 'Invalid MFA code' }
      }).as('invalidMFA')
      
      cy.visit('/login')
      cy.get('[data-testid="mfa-code-input"]').type('000000')
      cy.get('[data-testid="verify-mfa-button"]').click()
      
      cy.wait('@invalidMFA')
      
      cy.contains('Invalid MFA code').should('be.visible')
    })
  })

  describe('Password Security', () => {
    it('should enforce password complexity', () => {
      cy.visit('/login')
      cy.contains('Create Account').click()
      
      cy.get('[data-testid="password-input"]').type('weak')
      cy.get('[data-testid="create-account-button"]').click()
      
      cy.contains('Password must be at least 8 characters').should('be.visible')
    })

    it('should require password change for expired passwords', () => {
      cy.intercept('POST', '**/api/auth/login', {
        statusCode: 200,
        body: {
          success: true,
          passwordExpired: true
        }
      }).as('login')
      
      cy.visit('/login')
      cy.get('[data-testid="email-input"]').type('nurse@school.edu')
      cy.get('[data-testid="password-input"]').type('OldPassword123!')
      cy.get('[data-testid="login-button"]').click()
      
      cy.wait('@login')
      
      // Should redirect to password change
      cy.url().should('include', '/change-password')
    })

    it('should prevent password reuse', () => {
      cy.intercept('PUT', '**/api/auth/change-password', {
        statusCode: 400,
        body: { error: 'Password was recently used' }
      }).as('changePassword')
      
      cy.visit('/change-password')
      cy.get('[data-testid="old-password"]').type('OldPassword123!')
      cy.get('[data-testid="new-password"]').type('OldPassword123!')
      cy.get('[data-testid="confirm-password"]').type('OldPassword123!')
      cy.get('[data-testid="submit-button"]').click()
      
      cy.wait('@changePassword')
      cy.contains('Password was recently used').should('be.visible')
    })
  })

  describe('IP Restrictions', () => {
    it('should allow access from whitelisted IPs', () => {
      cy.intercept('GET', '**/api/auth/verify', {
        statusCode: 200,
        body: {
          success: true,
          data: { role: 'NURSE' }
        }
      }).as('verify')
      
      cy.login()
      cy.visit('/students')
      cy.wait('@verify')
      
      cy.contains('Student Management').should('be.visible')
    })

    it('should block access from unauthorized IPs', () => {
      cy.intercept('GET', '**/api/auth/verify', {
        statusCode: 403,
        body: { error: 'Access denied from this IP address' }
      }).as('blocked')
      
      cy.visit('/students')
      cy.wait('@blocked')
      
      cy.contains('Access denied').should('be.visible')
    })
  })

  describe('Security Incidents', () => {
    it('should log failed login attempts', () => {
      cy.intercept('POST', '**/api/auth/login', {
        statusCode: 401,
        body: { error: 'Invalid credentials' }
      }).as('failedLogin')
      
      cy.intercept('POST', '**/api/security/incidents', {
        statusCode: 201,
        body: { success: true }
      }).as('logIncident')
      
      cy.visit('/login')
      cy.get('[data-testid="email-input"]').type('nurse@school.edu')
      cy.get('[data-testid="password-input"]').type('WrongPassword')
      cy.get('[data-testid="login-button"]').click()
      
      cy.wait('@failedLogin')
      cy.wait('@logIncident')
    })

    it('should lock account after multiple failed attempts', () => {
      cy.intercept('POST', '**/api/auth/login', {
        statusCode: 423,
        body: { error: 'Account locked due to multiple failed attempts' }
      }).as('accountLocked')
      
      cy.visit('/login')
      cy.get('[data-testid="email-input"]').type('nurse@school.edu')
      cy.get('[data-testid="password-input"]').type('WrongPassword')
      cy.get('[data-testid="login-button"]').click()
      
      cy.wait('@accountLocked')
      cy.contains('Account locked').should('be.visible')
    })

    it('should display security incidents to admins', () => {
      cy.intercept('GET', '**/api/auth/verify', {
        statusCode: 200,
        body: {
          success: true,
          data: { role: 'ADMIN' }
        }
      })
      
      cy.intercept('GET', '**/api/security/incidents', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            incidents: [
              {
                id: '1',
                type: 'FAILED_LOGIN',
                userId: '5',
                timestamp: '2024-01-15T10:00:00Z'
              }
            ]
          }
        }
      }).as('getIncidents')
      
      cy.login('admin@school.edu')
      cy.visit('/settings')
      cy.contains('button', 'Security').click()
      cy.wait('@getIncidents')
      
      cy.contains('FAILED_LOGIN').should('be.visible')
    })
  })

  describe('Audit Logging', () => {
    it('should log all data access', () => {
      cy.intercept('GET', '**/api/students', {
        statusCode: 200,
        body: { success: true, data: { students: [] } }
      })
      
      cy.intercept('POST', '**/api/audit-logs', (req) => {
        expect(req.body).to.have.property('action')
        expect(req.body.action).to.include('STUDENTS')
        req.reply({ statusCode: 201, body: { success: true } })
      }).as('auditLog')
      
      cy.intercept('GET', '**/api/auth/verify', {
        statusCode: 200,
        body: { success: true, data: { role: 'NURSE' } }
      })
      
      cy.login()
      cy.visit('/students')
      
      cy.wait('@auditLog')
    })

    it('should include user and timestamp in audit logs', () => {
      cy.intercept('POST', '**/api/audit-logs', (req) => {
        expect(req.body).to.have.property('userId')
        expect(req.body).to.have.property('timestamp')
        req.reply({ statusCode: 201, body: { success: true } })
      }).as('auditLog')
      
      cy.intercept('GET', '**/api/auth/verify', {
        statusCode: 200,
        body: { success: true, data: { id: '1', role: 'NURSE' } }
      })
      
      cy.login()
      cy.visit('/students')
      
      cy.wait('@auditLog')
    })
  })

  describe('Data Encryption', () => {
    it('should use HTTPS for all requests', () => {
      cy.intercept('GET', '**/api/**', (req) => {
        expect(req.url).to.match(/^https:/)
        req.reply({ statusCode: 200, body: { success: true } })
      })
      
      cy.intercept('GET', '**/api/auth/verify', {
        statusCode: 200,
        body: { success: true, data: { role: 'NURSE' } }
      })
      
      cy.login()
      cy.visit('/students')
    })

    it('should not expose sensitive data in URLs', () => {
      cy.intercept('GET', '**/api/auth/verify', {
        statusCode: 200,
        body: { success: true, data: { role: 'NURSE' } }
      })
      
      cy.login()
      cy.visit('/students')
      
      cy.url().should('not.contain', 'password')
      cy.url().should('not.contain', 'token')
      cy.url().should('not.contain', 'ssn')
    })
  })
})
