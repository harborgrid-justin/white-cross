/// <reference types="cypress" />

describe('Health Records Management - Overview', () => {
  beforeEach(() => {
    cy.clearCookies()
    cy.clearLocalStorage()
    
    // Mock authentication
    cy.intercept('GET', '**/api/auth/verify', {
      statusCode: 200,
      body: {
        success: true,
        data: {
          id: '1',
          email: 'nurse@school.edu',
          role: 'NURSE',
          firstName: 'Test',
          lastName: 'Nurse'
        }
      }
    }).as('verifyAuth')
    
    // Mock health records API
    cy.intercept('GET', '**/api/health-records*', {
      statusCode: 200,
      body: {
        success: true,
        data: {
          records: [
            {
              id: '1',
              studentId: 'STU001',
              studentName: 'Emma Wilson',
              recordType: 'EXAMINATION',
              date: '2024-01-15',
              provider: 'Dr. Smith',
              summary: 'Annual physical examination'
            }
          ],
          total: 1
        }
      }
    }).as('getRecords')
    
    cy.login()
    cy.visit('/health-records')
    cy.wait('@verifyAuth')
  })

  describe('Overview Page', () => {
    it('should display health records management page', () => {
      cy.contains('Health Records Management').should('be.visible')
    })

    it('should show EHR overview card', () => {
      cy.contains('Electronic Health Records').should('be.visible')
      cy.contains('Digital medical examination records').should('be.visible')
    })

    it('should display vaccination tracking card', () => {
      cy.contains('Vaccination Tracking').should('be.visible')
      cy.contains('Compliance monitoring').should('be.visible')
    })

    it('should show allergy management card', () => {
      cy.contains('Allergy Management').should('be.visible')
      cy.contains('Comprehensive allergy management').should('be.visible')
    })

    it('should display chronic conditions card', () => {
      cy.contains('Chronic Condition Monitoring').should('be.visible')
      cy.contains('Care plans').should('be.visible')
    })
  })

  describe('Tab Navigation', () => {
    it('should display all health record tabs', () => {
      const tabs = ['Overview', 'Records', 'Vaccinations', 'Allergies', 'Conditions']
      
      tabs.forEach(tab => {
        cy.contains('button', tab).should('be.visible')
      })
    })

    it('should switch between tabs', () => {
      cy.contains('button', 'Records').click()
      cy.contains('button', 'Records').should('have.class', 'text-blue-600')
      
      cy.contains('button', 'Vaccinations').click()
      cy.contains('button', 'Vaccinations').should('have.class', 'text-blue-600')
    })
  })

  describe('Quick Actions', () => {
    it('should display quick actions section', () => {
      cy.contains('Quick Actions').should('be.visible')
    })

    it('should have add new record action', () => {
      cy.contains('Add New Record').should('be.visible')
    })

    it('should have view records action', () => {
      cy.contains('View Records').should('be.visible')
    })

    it('should navigate when clicking quick action', () => {
      cy.contains('View Records').click()
      cy.contains('button', 'Records').should('have.class', 'text-blue-600')
    })
  })

  describe('Statistics Display', () => {
    it('should show total records count', () => {
      cy.intercept('GET', '**/api/health-records/statistics', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            totalRecords: 1247,
            vaccinations: 324,
            allergies: 87,
            conditions: 43
          }
        }
      }).as('getStats')
      
      cy.wait('@getStats')
      cy.contains('1,247').should('be.visible')
    })

    it('should display vaccination statistics', () => {
      cy.intercept('GET', '**/api/health-records/vaccination-stats', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            upToDate: 95,
            overdue: 5,
            upcoming: 12
          }
        }
      }).as('getVaccStats')
      
      cy.wait('@getVaccStats')
      cy.contains('95%').should('be.visible')
    })
  })

  describe('Search Functionality', () => {
    it('should search health records by student name', () => {
      cy.get('[data-testid="health-records-search"]').type('Emma Wilson')
      cy.contains('Emma Wilson').should('be.visible')
    })

    it('should filter by record type', () => {
      cy.get('[data-testid="record-type-filter"]').select('EXAMINATION')
      cy.contains('EXAMINATION').should('be.visible')
    })

    it('should filter by date range', () => {
      cy.get('[data-testid="date-from"]').type('2024-01-01')
      cy.get('[data-testid="date-to"]').type('2024-12-31')
      cy.get('[data-testid="apply-date-filter"]').click()
      
      cy.wait('@getRecords')
    })
  })

  describe('Authentication & Authorization', () => {
    it('should require authentication', () => {
      cy.testUnauthorizedAccess('/health-records')
    })

    it('should verify HIPAA compliance permissions', () => {
      cy.intercept('GET', '**/api/auth/verify', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            id: '1',
            email: 'nurse@school.edu',
            role: 'NURSE',
            permissions: ['health_records.read', 'health_records.hipaa']
          }
        }
      }).as('verifyPerms')
      
      cy.reload()
      cy.wait('@verifyPerms')
      
      cy.contains('Health Records').should('be.visible')
    })
  })

  describe('Session Management', () => {
    it('should handle session expiration', () => {
      cy.simulateSessionExpiration()
      
      cy.contains('button', 'Records').click()
      cy.expectSessionExpiredRedirect()
    })

    it('should maintain authentication across refreshes', () => {
      cy.reload()
      cy.contains('Health Records Management').should('be.visible')
    })
  })

  describe('Healthcare Compliance', () => {
    it('should log health record access for HIPAA audit', () => {
      cy.intercept('POST', '**/api/audit-logs', (req) => {
        expect(req.body).to.have.property('action')
        expect(req.body.action).to.include('HEALTH_RECORD')
        req.reply({ statusCode: 200, body: { success: true } })
      }).as('auditLog')
      
      cy.wait('@auditLog')
    })

    it('should mask sensitive information by default', () => {
      cy.contains('Social Security').should('not.exist')
      cy.contains('SSN').should('not.exist')
    })

    it('should require additional auth for sensitive data', () => {
      cy.get('[data-testid="view-sensitive-data"]').click()
      
      cy.get('[data-testid="auth-modal"]').should('be.visible')
      cy.contains('Additional Authentication Required').should('be.visible')
    })
  })

  describe('Error Handling', () => {
    it('should handle API errors gracefully', () => {
      cy.intercept('GET', '**/api/health-records*', {
        statusCode: 500,
        body: { error: 'Server error' }
      }).as('recordsError')
      
      cy.reload()
      cy.wait('@recordsError')
      
      cy.contains('Health Records Management').should('be.visible')
    })

    it('should handle network timeouts', () => {
      cy.intercept('GET', '**/api/health-records*', {
        statusCode: 408,
        body: { error: 'Timeout' }
      }).as('timeout')
      
      cy.reload()
      cy.wait('@timeout')
      
      cy.contains('Failed to load health records').should('be.visible')
    })
  })

  describe('Responsive Design', () => {
    it('should be mobile responsive', () => {
      cy.viewport('iphone-x')
      cy.contains('Health Records').should('be.visible')
    })

    it('should be tablet responsive', () => {
      cy.viewport('ipad-2')
      cy.contains('Health Records').should('be.visible')
    })

    it('should handle desktop view', () => {
      cy.viewport(1920, 1080)
      cy.contains('Electronic Health Records').should('be.visible')
    })
  })

  describe('Accessibility', () => {
    it('should have proper heading structure', () => {
      cy.get('h1').should('contain', 'Health Records')
    })

    it('should support keyboard navigation', () => {
      cy.contains('button', 'Records').focus()
      cy.focused().type('{enter}')
      cy.contains('button', 'Records').should('have.class', 'text-blue-600')
    })

    it('should have accessible buttons', () => {
      cy.contains('button', 'Overview')
        .should('not.be.disabled')
        .should('be.visible')
    })
  })
})
