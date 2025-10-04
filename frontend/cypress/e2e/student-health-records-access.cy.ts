/// <reference types="cypress" />

describe('Student Health Records Access Control', () => {
  beforeEach(() => {
    // Mock health records API
    cy.intercept('POST', '**/api/health-records/log-access', {
      statusCode: 200,
      body: { success: true }
    }).as('logAccess')
    
    cy.intercept('GET', '**/api/auth/verify', {
      statusCode: 200,
      body: {
        success: true,
        data: {
          id: '1',
          email: 'nurse@school.edu',
          role: 'NURSE',
          firstName: 'Test',
          lastName: 'Nurse',
          isActive: true
        }
      }
    }).as('verifyToken')
  })

  describe('Role-Based Access Control', () => {
    it('should allow nurse access to regular student health records', () => {
      cy.loginAsNurse()
      cy.visit('/students/regular-student-123/health-records')
      
      cy.wait('@logAccess')
      cy.get('[data-testid="health-record-content"]').should('be.visible')
      cy.get('h1').should('contain.text', 'Health Records')
    })

    it('should allow admin access to restricted student health records', () => {
      cy.loginAsAdmin()
      cy.visit('/students/restricted-student-456/health-records')
      
      cy.wait('@logAccess')
      cy.get('[data-testid="health-record-content"]').should('be.visible')
      cy.get('h1').should('contain.text', 'Health Records')
    })

    it('should deny nurse access to restricted student health records', () => {
      cy.loginAsNurse()
      cy.visit('/students/restricted-student-456/health-records')
      
      // Should show access denied page
      cy.get('[data-testid="access-denied-message"]')
        .should('be.visible')
        .and('contain.text', 'You do not have permission to view this student\'s records')
      
      cy.get('[data-testid="back-button"]').should('be.visible')
    })

    it('should deny read-only user access to sensitive records', () => {
      cy.loginAsReadOnly()
      cy.visit('/students/sensitive-student-789/health-records')
      
      // Should show access denied page
      cy.get('[data-testid="access-denied-message"]')
        .should('be.visible')
        .and('contain.text', 'You do not have permission to view this student\'s records')
    })

    it('should allow counselor access to basic health records but not sensitive ones', () => {
      cy.loginAsCounselor()
      cy.visit('/students/regular-student-123/health-records')
      
      cy.wait('@logAccess')
      cy.get('[data-testid="health-record-content"]').should('be.visible')
      
      // Try to access sensitive records
      cy.visit('/students/sensitive-student-789/health-records')
      cy.get('[data-testid="access-denied-message"]').should('be.visible')
    })
  })

  describe('Sensitive Record Warnings', () => {
    it('should show sensitive record warning for flagged students', () => {
      cy.loginAsAdmin()
      cy.visit('/students/sensitive-student-789/health-records')
      
      // Should show sensitive record warning modal
      cy.get('[data-testid="sensitive-record-warning"]').should('be.visible')
      cy.get('[data-testid="warning-title"]')
        .should('contain.text', 'Sensitive Health Record Access')
      
      cy.get('[data-testid="warning-message"]')
        .should('contain.text', 'This student has been flagged as having sensitive health information')
      
      cy.get('[data-testid="confirm-access-button"]').should('be.visible')
      cy.get('[data-testid="cancel-access-button"]').should('be.visible')
    })

    it('should grant access after confirming sensitive record warning', () => {
      cy.loginAsAdmin()
      cy.visit('/students/sensitive-student-789/health-records')
      
      cy.get('[data-testid="sensitive-record-warning"]').should('be.visible')
      cy.get('[data-testid="confirm-access-button"]').click()
      
      // Should proceed to health records
      cy.wait('@logAccess')
      cy.get('[data-testid="health-record-content"]').should('be.visible')
      cy.get('[data-testid="sensitive-record-warning"]').should('not.exist')
    })

    it('should redirect back when canceling sensitive record access', () => {
      cy.loginAsAdmin()
      cy.visit('/students/sensitive-student-789/health-records')
      
      cy.get('[data-testid="sensitive-record-warning"]').should('be.visible')
      cy.get('[data-testid="cancel-access-button"]').click()
      
      // Should redirect back to health records list
      cy.url().should('include', '/health-records')
      cy.url().should('not.include', '/students/sensitive-student-789')
    })

    it('should log sensitive record access attempts', () => {
      cy.intercept('POST', '**/api/health-records/log-access', {
        statusCode: 200,
        body: { success: true }
      }).as('logSensitiveAccess')
      
      cy.loginAsAdmin()
      cy.visit('/students/sensitive-student-789/health-records')
      
      cy.get('[data-testid="confirm-access-button"]').click()
      
      cy.wait('@logSensitiveAccess').then((interception) => {
        expect(interception.request.body).to.include({
          action: 'VIEW_STUDENT_RECORD',
          studentId: 'sensitive-student-789'
        })
        expect(interception.request.body.details).to.include({
          tab: 'health-records'
        })
      })
    })
  })

  describe('Session and Authentication Validation', () => {
    it('should redirect to login if user is not authenticated', () => {
      cy.clearLocalStorage()
      cy.clearCookies()
      cy.visit('/students/regular-student-123/health-records')
      
      cy.url().should('include', '/login')
      cy.expectAuthenticationRequired()
    })

    it('should handle expired session during health record access', () => {
      cy.loginAsNurse()
      cy.visit('/students/regular-student-123/health-records')
      
      // Simulate session expiration
      cy.simulateSessionExpiration()
      
      // Try to access another record
      cy.visit('/students/regular-student-456/health-records')
      
      cy.expectSessionExpiredRedirect()
    })

    it('should re-validate permissions on page refresh', () => {
      cy.loginAsNurse()
      cy.visit('/students/restricted-student-456/health-records')
      
      // Should show access denied
      cy.get('[data-testid="access-denied-message"]').should('be.visible')
      
      // Refresh page
      cy.reload()
      
      // Should still show access denied
      cy.get('[data-testid="access-denied-message"]').should('be.visible')
    })

    it('should handle network errors during access validation gracefully', () => {
      cy.loginAsNurse()
      
      // Mock network error for access validation
      cy.intercept('POST', '**/api/health-records/log-access', {
        statusCode: 500,
        body: { success: false, error: { message: 'Network error' } }
      }).as('accessValidationError')
      
      cy.visit('/students/regular-student-123/health-records')
      
      cy.wait('@accessValidationError')
      
      // Should still allow access but show warning about logging failure
      cy.get('[data-testid="health-record-content"]').should('be.visible')
      cy.get('[data-testid="logging-warning"]')
        .should('be.visible')
        .and('contain.text', 'Access logging temporarily unavailable')
    })
  })

  describe('Audit Trail and Logging', () => {
    it('should log all health record access attempts', () => {
      cy.intercept('POST', '**/api/health-records/log-access', {
        statusCode: 200,
        body: { success: true }
      }).as('logHealthRecordAccess')
      
      cy.loginAsNurse()
      cy.visit('/students/regular-student-123/health-records')
      
      cy.wait('@logHealthRecordAccess').then((interception) => {
        expect(interception.request.body).to.deep.include({
          action: 'VIEW_STUDENT_RECORD',
          studentId: 'regular-student-123',
          details: {
            tab: 'health-records',
            accessTime: Cypress._.isString
          }
        })
      })
    })

    it('should log denied access attempts', () => {
      cy.intercept('POST', '**/api/health-records/log-access', {
        statusCode: 200,
        body: { success: true }
      }).as('logDeniedAccess')
      
      cy.loginAsNurse()
      cy.visit('/students/restricted-student-456/health-records')
      
      // Access should be denied, but attempt should still be logged
      cy.wait('@logDeniedAccess').then((interception) => {
        expect(interception.request.body).to.include({
          action: 'ACCESS_DENIED',
          studentId: 'restricted-student-456'
        })
      })
    })

    it('should include user context in audit logs', () => {
      cy.loginAsAdmin()
      cy.visit('/students/regular-student-123/health-records')
      
      cy.wait('@logAccess').then((interception) => {
        expect(interception.request.body.userContext).to.include({
          userId: '1',
          userRole: 'ADMIN',
          userEmail: 'admin@school.edu'
        })
      })
    })

    it('should log time spent viewing records', () => {
      cy.loginAsNurse()
      cy.visit('/students/regular-student-123/health-records')
      
      // Stay on page for a few seconds
      cy.wait(3000)
      
      // Navigate away to trigger session end logging
      cy.visit('/health-records')
      
      cy.get('@logAccess.all').should('have.length.at.least', 2)
    })
  })

  describe('Data Privacy and HIPAA Compliance', () => {
    it('should display privacy notice before accessing sensitive records', () => {
      cy.loginAsAdmin()
      cy.visit('/students/sensitive-student-789/health-records')
      
      cy.get('[data-testid="privacy-notice"]')
        .should('be.visible')
        .and('contain.text', 'HIPAA Privacy Notice')
        .and('contain.text', 'Protected Health Information')
      
      cy.get('[data-testid="acknowledge-privacy-button"]').should('be.visible')
    })

    it('should require explicit consent for accessing sensitive information', () => {
      cy.loginAsAdmin()
      cy.visit('/students/sensitive-student-789/health-records')
      
      // Should require checkbox acknowledgment
      cy.get('[data-testid="hipaa-acknowledgment-checkbox"]').should('be.visible')
      cy.get('[data-testid="confirm-access-button"]').should('be.disabled')
      
      // Enable access after acknowledgment
      cy.get('[data-testid="hipaa-acknowledgment-checkbox"]').check()
      cy.get('[data-testid="confirm-access-button"]').should('be.enabled')
    })

    it('should mask sensitive data for unauthorized users', () => {
      cy.loginAsReadOnly()
      cy.visit('/students/regular-student-123/health-records')
      
      // Should show limited view
      cy.get('[data-testid="limited-access-notice"]')
        .should('be.visible')
        .and('contain.text', 'Limited access: Some information may be restricted')
      
      // Sensitive fields should be masked
      cy.get('[data-testid="masked-field"]').should('contain.text', '***')
    })

    it('should auto-logout after period of inactivity on sensitive records', () => {
      cy.loginAsAdmin()
      cy.visit('/students/sensitive-student-789/health-records')
      cy.get('[data-testid="confirm-access-button"]').click()
      
      // Mock inactivity timeout
      cy.window().then((win) => {
        win.dispatchEvent(new Event('user-inactive'))
      })
      
      // Should redirect to login with session timeout message
      cy.expectSessionExpiredRedirect()
    })
  })

  describe('Emergency Access Override', () => {
    it('should allow emergency access with proper justification', () => {
      cy.loginAsNurse()
      
      // Mock emergency override
      cy.intercept('POST', '**/api/health-records/emergency-override', {
        statusCode: 200,
        body: { success: true, temporaryAccess: true }
      }).as('emergencyOverride')
      
      cy.visit('/students/restricted-student-456/health-records')
      
      // Should show access denied with emergency override option
      cy.get('[data-testid="emergency-override-button"]').should('be.visible')
      cy.get('[data-testid="emergency-override-button"]').click()
      
      // Should show emergency access form
      cy.get('[data-testid="emergency-justification-textarea"]')
        .should('be.visible')
        .type('Student collapsed in hallway, need immediate access to medical history')
      
      cy.get('[data-testid="submit-emergency-override"]').click()
      cy.wait('@emergencyOverride')
      
      // Should grant temporary access
      cy.get('[data-testid="health-record-content"]').should('be.visible')
      cy.get('[data-testid="emergency-access-notice"]')
        .should('be.visible')
        .and('contain.text', 'Emergency Access Granted')
    })

    it('should log emergency access overrides with high priority', () => {
      cy.intercept('POST', '**/api/health-records/emergency-override', {
        statusCode: 200,
        body: { success: true }
      }).as('logEmergencyOverride')
      
      cy.loginAsNurse()
      cy.visit('/students/restricted-student-456/health-records')
      
      cy.get('[data-testid="emergency-override-button"]').click()
      cy.get('[data-testid="emergency-justification-textarea"]')
        .type('Medical emergency requiring immediate access')
      cy.get('[data-testid="submit-emergency-override"]').click()
      
      cy.wait('@logEmergencyOverride').then((interception) => {
        expect(interception.request.body).to.include({
          action: 'EMERGENCY_OVERRIDE',
          priority: 'HIGH',
          justification: 'Medical emergency requiring immediate access'
        })
      })
    })

    it('should expire emergency access after specified time', () => {
      cy.loginAsNurse()
      cy.visit('/students/restricted-student-456/health-records')
      
      // Grant emergency access
      cy.get('[data-testid="emergency-override-button"]').click()
      cy.get('[data-testid="emergency-justification-textarea"]')
        .type('Emergency access needed')
      cy.get('[data-testid="submit-emergency-override"]').click()
      
      // Should show countdown timer
      cy.get('[data-testid="emergency-access-timer"]')
        .should('be.visible')
        .and('contain.text', 'Emergency access expires in')
      
      // Mock timer expiration
      cy.window().then((win) => {
        win.dispatchEvent(new CustomEvent('emergency-access-expired'))
      })
      
      // Should revert to access denied
      cy.get('[data-testid="access-denied-message"]').should('be.visible')
    })
  })

  describe('Multi-Factor Authentication for Sensitive Records', () => {
    it('should require MFA for highly sensitive records', () => {
      cy.loginAsAdmin()
      cy.visit('/students/highly-sensitive-student-999/health-records')
      
      // Should prompt for additional authentication
      cy.get('[data-testid="mfa-challenge"]').should('be.visible')
      cy.get('[data-testid="mfa-code-input"]').should('be.visible')
      cy.get('[data-testid="mfa-submit-button"]').should('be.visible')
    })

    it('should grant access after successful MFA verification', () => {
      cy.intercept('POST', '**/api/auth/verify-mfa', {
        statusCode: 200,
        body: { success: true, verified: true }
      }).as('verifyMFA')
      
      cy.loginAsAdmin()
      cy.visit('/students/highly-sensitive-student-999/health-records')
      
      cy.get('[data-testid="mfa-code-input"]').type('123456')
      cy.get('[data-testid="mfa-submit-button"]').click()
      cy.wait('@verifyMFA')
      
      // Should proceed to health records
      cy.get('[data-testid="health-record-content"]').should('be.visible')
      cy.get('[data-testid="mfa-challenge"]').should('not.exist')
    })

    it('should deny access after failed MFA attempts', () => {
      cy.intercept('POST', '**/api/auth/verify-mfa', {
        statusCode: 401,
        body: { success: false, error: 'Invalid MFA code' }
      }).as('failedMFA')
      
      cy.loginAsAdmin()
      cy.visit('/students/highly-sensitive-student-999/health-records')
      
      // Try invalid code multiple times
      for (let i = 0; i < 3; i++) {
        cy.get('[data-testid="mfa-code-input"]').clear().type('000000')
        cy.get('[data-testid="mfa-submit-button"]').click()
        cy.wait('@failedMFA')
      }
      
      // Should lock out user after multiple failures
      cy.get('[data-testid="mfa-lockout-message"]')
        .should('be.visible')
        .and('contain.text', 'Too many failed attempts')
      
      cy.get('[data-testid="contact-admin-message"]').should('be.visible')
    })
  })

  describe('Cross-Browser and Device Access Control', () => {
    it('should maintain access control across browser sessions', () => {
      cy.loginAsNurse()
      cy.visit('/students/restricted-student-456/health-records')
      
      // Should be denied
      cy.get('[data-testid="access-denied-message"]').should('be.visible')
      
      // Clear session and login as admin in same test
      cy.clearLocalStorage()
      cy.loginAsAdmin()
      cy.visit('/students/restricted-student-456/health-records')
      
      // Should be granted
      cy.get('[data-testid="health-record-content"]').should('be.visible')
    })

    it('should handle concurrent session management', () => {
      cy.loginAsNurse()
      
      // Simulate another session logging in as different user
      cy.window().then((win) => {
        win.localStorage.setItem('concurrent-session-detected', 'true')
        win.dispatchEvent(new Event('storage'))
      })
      
      cy.visit('/students/regular-student-123/health-records')
      
      // Should prompt about concurrent session
      cy.get('[data-testid="concurrent-session-warning"]')
        .should('be.visible')
        .and('contain.text', 'Another session detected')
    })
  })
})