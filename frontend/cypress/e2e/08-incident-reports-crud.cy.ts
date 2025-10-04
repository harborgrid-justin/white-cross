/// <reference types="cypress" />

describe('Incident Reporting - CRUD Operations', () => {
  beforeEach(() => {
    cy.clearCookies()
    cy.clearLocalStorage()
    
    cy.intercept('GET', '**/api/auth/verify', {
      statusCode: 200,
      body: {
        success: true,
        data: { id: '1', email: 'nurse@school.edu', role: 'NURSE' }
      }
    }).as('verifyAuth')
    
    cy.intercept('GET', '**/api/incidents*', {
      statusCode: 200,
      body: {
        success: true,
        data: {
          incidents: [
            {
              id: '1',
              studentId: 'STU001',
              studentName: 'Emma Wilson',
              incidentType: 'INJURY',
              location: 'Playground',
              dateTime: '2024-01-15T10:30:00Z',
              severity: 'MINOR',
              status: 'REPORTED',
              description: 'Minor fall on playground'
            }
          ],
          total: 1
        }
      }
    }).as('getIncidents')
    
    cy.login()
    cy.visit('/incident-reports')
    cy.wait('@verifyAuth')
  })

  describe('Incident List Display', () => {
    it('should display incident reports page', () => {
      cy.contains('Incident Reporting').should('be.visible')
    })

    it('should show incident list', () => {
      cy.wait('@getIncidents')
      cy.contains('Emma Wilson').should('be.visible')
      cy.contains('INJURY').should('be.visible')
    })

    it('should display incident details', () => {
      cy.wait('@getIncidents')
      cy.contains('Playground').should('be.visible')
      cy.contains('MINOR').should('be.visible')
    })

    it('should show incident status', () => {
      cy.wait('@getIncidents')
      cy.contains('REPORTED').should('be.visible')
    })
  })

  describe('Create Incident Report', () => {
    it('should open create incident modal', () => {
      cy.wait('@getIncidents')
      cy.get('[data-testid="create-incident-button"]').click()
      cy.get('[data-testid="incident-modal"]').should('be.visible')
    })

    it('should validate required fields', () => {
      cy.wait('@getIncidents')
      cy.get('[data-testid="create-incident-button"]').click()
      cy.get('[data-testid="save-incident"]').click()
      
      cy.contains('Student is required').should('be.visible')
      cy.contains('Incident type is required').should('be.visible')
      cy.contains('Location is required').should('be.visible')
      cy.contains('Description is required').should('be.visible')
    })

    it('should successfully create incident report', () => {
      cy.wait('@getIncidents')
      
      cy.intercept('POST', '**/api/incidents', {
        statusCode: 201,
        body: {
          success: true,
          data: {
            id: '2',
            studentName: 'Jake Davis',
            incidentType: 'ILLNESS'
          }
        }
      }).as('createIncident')
      
      cy.get('[data-testid="create-incident-button"]').click()
      
      cy.get('[data-testid="student-select"]').select('STU002')
      cy.get('[data-testid="incident-type"]').select('ILLNESS')
      cy.get('[data-testid="location"]').type('Classroom 101')
      cy.get('[data-testid="date-time"]').type('2024-01-16T14:00')
      cy.get('[data-testid="severity"]').select('MINOR')
      cy.get('[data-testid="description"]').type('Student complained of headache')
      
      cy.get('[data-testid="save-incident"]').click()
      
      cy.wait('@createIncident')
      cy.contains('Incident report created').should('be.visible')
    })

    it('should require minimum description length', () => {
      cy.wait('@getIncidents')
      cy.get('[data-testid="create-incident-button"]').click()
      
      cy.get('[data-testid="description"]').type('Too short')
      cy.get('[data-testid="save-incident"]').click()
      
      cy.contains('Description must be at least 20 characters').should('be.visible')
    })

    it('should auto-notify parents for severe incidents', () => {
      cy.wait('@getIncidents')
      
      cy.get('[data-testid="create-incident-button"]').click()
      cy.get('[data-testid="severity"]').select('SEVERE')
      
      cy.get('[data-testid="auto-notify"]').should('be.checked')
    })
  })

  describe('Incident Types', () => {
    it('should display all incident types', () => {
      cy.wait('@getIncidents')
      cy.get('[data-testid="create-incident-button"]').click()
      
      const types = [
        'INJURY',
        'ILLNESS',
        'MEDICATION_ERROR',
        'ALLERGIC_REACTION',
        'BEHAVIORAL',
        'SAFETY_CONCERN'
      ]
      
      types.forEach(type => {
        cy.get('[data-testid="incident-type"]').should('contain', type)
      })
    })

    it('should show appropriate fields based on type', () => {
      cy.wait('@getIncidents')
      cy.get('[data-testid="create-incident-button"]').click()
      
      cy.get('[data-testid="incident-type"]').select('INJURY')
      cy.get('[data-testid="injury-details"]').should('be.visible')
      
      cy.get('[data-testid="incident-type"]').select('MEDICATION_ERROR')
      cy.get('[data-testid="medication-details"]').should('be.visible')
    })
  })

  describe('Photo Evidence Upload', () => {
    it('should allow photo uploads', () => {
      cy.wait('@getIncidents')
      cy.get('[data-testid="create-incident-button"]').click()
      
      cy.get('[data-testid="photo-upload"]').should('be.visible')
    })

    it('should validate file types', () => {
      cy.wait('@getIncidents')
      cy.get('[data-testid="create-incident-button"]').click()
      
      const file = 'invalid.txt'
      cy.get('[data-testid="photo-upload"]').selectFile(file, { force: true })
      
      cy.contains('Only image files are allowed').should('be.visible')
    })

    it('should validate file size', () => {
      cy.wait('@getIncidents')
      cy.get('[data-testid="create-incident-button"]').click()
      
      // Mock large file
      cy.intercept('POST', '**/api/incidents/photos', {
        statusCode: 400,
        body: { error: 'File too large' }
      }).as('uploadError')
      
      cy.get('[data-testid="save-incident"]').click()
      cy.wait('@uploadError')
    })

    it('should preview uploaded photos', () => {
      cy.wait('@getIncidents')
      cy.get('[data-testid="create-incident-button"]').click()
      
      cy.get('[data-testid="photo-upload"]').selectFile('cypress/fixtures/test-image.jpg', { force: true })
      cy.get('[data-testid="photo-preview"]').should('be.visible')
    })
  })

  describe('Witness Statements', () => {
    it('should add witness statements', () => {
      cy.wait('@getIncidents')
      cy.get('[data-testid="create-incident-button"]').click()
      
      cy.get('[data-testid="add-witness"]').click()
      cy.get('[data-testid="witness-name"]').type('Teacher Smith')
      cy.get('[data-testid="witness-statement"]').type('I saw the student fall')
      cy.get('[data-testid="save-witness"]').click()
      
      cy.contains('Teacher Smith').should('be.visible')
    })

    it('should allow multiple witnesses', () => {
      cy.wait('@getIncidents')
      cy.get('[data-testid="create-incident-button"]').click()
      
      cy.get('[data-testid="add-witness"]').click()
      cy.get('[data-testid="witness-name"]').type('Teacher Smith')
      cy.get('[data-testid="witness-statement"]').type('Witnessed incident')
      cy.get('[data-testid="save-witness"]').click()
      
      cy.get('[data-testid="add-witness"]').click()
      cy.get('[data-testid="witness-name"]').type('Student Helper')
      cy.get('[data-testid="witness-statement"]').type('Also saw what happened')
      cy.get('[data-testid="save-witness"]').click()
      
      cy.get('[data-testid="witness-list"]').children().should('have.length', 2)
    })
  })

  describe('Update Incident Report', () => {
    it('should open edit modal', () => {
      cy.wait('@getIncidents')
      cy.get('[data-testid="edit-incident-1"]').click()
      cy.get('[data-testid="incident-modal"]').should('be.visible')
    })

    it('should successfully update incident', () => {
      cy.wait('@getIncidents')
      
      cy.intercept('PUT', '**/api/incidents/1', {
        statusCode: 200,
        body: { success: true }
      }).as('updateIncident')
      
      cy.get('[data-testid="edit-incident-1"]').click()
      cy.get('[data-testid="description"]').clear().type('Updated description with more details about the incident')
      cy.get('[data-testid="save-incident"]').click()
      
      cy.wait('@updateIncident')
      cy.contains('Incident updated').should('be.visible')
    })

    it('should prevent editing of submitted reports', () => {
      cy.intercept('GET', '**/api/incidents*', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            incidents: [
              {
                id: '1',
                status: 'SUBMITTED'
              }
            ]
          }
        }
      }).as('getSubmitted')
      
      cy.reload()
      cy.wait('@getSubmitted')
      
      cy.get('[data-testid="edit-incident-1"]').should('be.disabled')
    })
  })

  describe('Incident Status Management', () => {
    it('should update incident status', () => {
      cy.wait('@getIncidents')
      
      cy.intercept('PUT', '**/api/incidents/1/status', {
        statusCode: 200,
        body: { success: true }
      }).as('updateStatus')
      
      cy.get('[data-testid="status-select-1"]').select('UNDER_REVIEW')
      
      cy.wait('@updateStatus')
      cy.contains('UNDER_REVIEW').should('be.visible')
    })

    it('should require notes when closing incident', () => {
      cy.wait('@getIncidents')
      
      cy.get('[data-testid="status-select-1"]').select('CLOSED')
      cy.get('[data-testid="closure-notes"]').should('be.visible')
    })

    it('should notify parents on status change', () => {
      cy.wait('@getIncidents')
      
      cy.intercept('PUT', '**/api/incidents/1/status', {
        statusCode: 200,
        body: { success: true }
      }).as('updateStatus')
      
      cy.get('[data-testid="status-select-1"]').select('RESOLVED')
      cy.get('[data-testid="notify-parents"]').check()
      
      cy.wait('@updateStatus')
      cy.contains('Parents notified').should('be.visible')
    })
  })

  describe('Follow-up Actions', () => {
    it('should add follow-up actions', () => {
      cy.wait('@getIncidents')
      cy.get('[data-testid="view-incident-1"]').click()
      
      cy.get('[data-testid="add-follow-up"]').click()
      cy.get('[data-testid="action-description"]').type('Schedule follow-up appointment')
      cy.get('[data-testid="due-date"]').type('2024-01-20')
      cy.get('[data-testid="save-follow-up"]').click()
      
      cy.contains('Follow-up action added').should('be.visible')
    })

    it('should track follow-up completion', () => {
      cy.wait('@getIncidents')
      
      cy.intercept('PUT', '**/api/incidents/1/follow-up/1/complete', {
        statusCode: 200,
        body: { success: true }
      }).as('completeFollowUp')
      
      cy.get('[data-testid="complete-follow-up-1"]').click()
      
      cy.wait('@completeFollowUp')
      cy.get('[data-testid="follow-up-1"]').should('contain', 'Completed')
    })
  })

  describe('Parent Notification', () => {
    it('should notify parents immediately', () => {
      cy.wait('@getIncidents')
      
      cy.intercept('POST', '**/api/incidents/1/notify', {
        statusCode: 200,
        body: {
          success: true,
          data: { notified: ['email', 'sms'] }
        }
      }).as('notifyParents')
      
      cy.get('[data-testid="notify-parents-1"]').click()
      
      cy.wait('@notifyParents')
      cy.contains('Parents notified via email and SMS').should('be.visible')
    })

    it('should track notification delivery', () => {
      cy.wait('@getIncidents')
      cy.get('[data-testid="view-incident-1"]').click()
      
      cy.get('[data-testid="notification-log"]').should('be.visible')
      cy.contains('Notification History').should('be.visible')
    })
  })

  describe('Search and Filter', () => {
    it('should search by student name', () => {
      cy.wait('@getIncidents')
      cy.get('[data-testid="incident-search"]').type('Emma')
      cy.contains('Emma Wilson').should('be.visible')
    })

    it('should filter by incident type', () => {
      cy.wait('@getIncidents')
      cy.get('[data-testid="type-filter"]').select('INJURY')
      cy.contains('INJURY').should('be.visible')
    })

    it('should filter by severity', () => {
      cy.wait('@getIncidents')
      cy.get('[data-testid="severity-filter"]').select('MINOR')
      cy.contains('MINOR').should('be.visible')
    })

    it('should filter by status', () => {
      cy.wait('@getIncidents')
      cy.get('[data-testid="status-filter"]').select('REPORTED')
      cy.contains('REPORTED').should('be.visible')
    })

    it('should filter by date range', () => {
      cy.wait('@getIncidents')
      cy.get('[data-testid="date-from"]').type('2024-01-01')
      cy.get('[data-testid="date-to"]').type('2024-01-31')
      cy.get('[data-testid="apply-filter"]').click()
      
      cy.wait('@getIncidents')
    })
  })

  describe('Export and Reporting', () => {
    it('should export incident reports', () => {
      cy.wait('@getIncidents')
      
      cy.intercept('GET', '**/api/incidents/export*', {
        statusCode: 200,
        headers: { 'Content-Type': 'text/csv' },
        body: 'Student,Type,Date\nEmma Wilson,INJURY,2024-01-15'
      }).as('export')
      
      cy.get('[data-testid="export-incidents"]').click()
      cy.wait('@export')
    })

    it('should generate compliance report', () => {
      cy.wait('@getIncidents')
      
      cy.intercept('GET', '**/api/incidents/compliance-report', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            totalIncidents: 45,
            resolved: 40,
            pending: 5
          }
        }
      }).as('complianceReport')
      
      cy.get('[data-testid="generate-report"]').click()
      cy.wait('@complianceReport')
      
      cy.contains('45').should('be.visible')
    })
  })

  describe('Legal Compliance', () => {
    it('should require signature for serious incidents', () => {
      cy.wait('@getIncidents')
      
      cy.intercept('GET', '**/api/incidents/1', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            id: '1',
            severity: 'SEVERE',
            requiresSignature: true
          }
        }
      }).as('getIncident')
      
      cy.get('[data-testid="view-incident-1"]').click()
      cy.wait('@getIncident')
      
      cy.get('[data-testid="signature-required"]').should('be.visible')
    })

    it('should track all document access', () => {
      cy.intercept('POST', '**/api/audit-logs', (req) => {
        expect(req.body.action).to.include('INCIDENT')
        req.reply({ statusCode: 200, body: { success: true } })
      }).as('auditLog')
      
      cy.wait('@auditLog')
    })
  })

  describe('Error Handling', () => {
    it('should handle API errors', () => {
      cy.intercept('GET', '**/api/incidents*', {
        statusCode: 500,
        body: { error: 'Server error' }
      }).as('error')
      
      cy.reload()
      cy.wait('@error')
      cy.contains('Failed to load incidents').should('be.visible')
    })
  })

  describe('Responsive Design', () => {
    it('should be mobile responsive', () => {
      cy.viewport('iphone-x')
      cy.contains('Incident').should('be.visible')
    })
  })
})
