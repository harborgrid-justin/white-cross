/// <reference types="cypress" />

describe('Emergency Contacts - CRUD Operations', () => {
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
    
    cy.intercept('GET', '**/api/emergency-contacts*', {
      statusCode: 200,
      body: {
        success: true,
        data: {
          contacts: [
            {
              id: '1',
              studentId: 'STU001',
              studentName: 'Emma Wilson',
              firstName: 'Jennifer',
              lastName: 'Wilson',
              relationship: 'Mother',
              phoneNumber: '(555) 123-4567',
              email: 'jennifer@email.com',
              isPrimary: true,
              canPickup: true
            }
          ],
          total: 1
        }
      }
    }).as('getContacts')
    
    // Mock emergency contacts by student endpoint
    cy.intercept('GET', '**/api/emergency-contacts/student/**', {
      statusCode: 200,
      body: {
        success: true,
        data: {
          contacts: [
            {
              id: '1',
              studentId: '1',
              firstName: 'Jennifer',
              lastName: 'Wilson',
              relationship: 'Mother',
              phoneNumber: '(555) 123-4567',
              email: 'jennifer@email.com',
              isPrimary: true,
              address: '123 Main St',
              city: 'Springfield',
              state: 'IL',
              zipCode: '62701'
            }
          ]
        }
      }
    }).as('getStudentContacts')
    
    // Mock statistics endpoint
    cy.intercept('GET', '**/api/emergency-contacts/statistics', {
      statusCode: 200,
      body: {
        success: true,
        data: {
          totalContacts: 3,
          primaryContacts: 2,
          secondaryContacts: 1,
          averageContactsPerStudent: 2.5
        }
      }
    }).as('getStatistics')
    
    // Mock students endpoint
    cy.intercept('GET', '**/api/students**', {
      statusCode: 200,
      body: {
        success: true,
        data: {
          students: [
            {
              id: '1',
              studentNumber: 'STU001',
              firstName: 'Emma',
              lastName: 'Wilson',
              grade: '8',
              dateOfBirth: '2010-03-15',
              gender: 'FEMALE'
            }
          ],
          total: 1,
          totalPages: 1,
          currentPage: 1
        }
      }
    }).as('getStudents')
    
    cy.loginAsNurse()
    cy.visit('/emergency-contacts')
    cy.wait('@verifyAuth')
  })

  describe('Contact List Display', () => {
    it('should display emergency contacts page', () => {
      cy.contains('Emergency Contact System').should('be.visible')
    })

    it('should show contact list', () => {
      cy.wait(['@getContacts', '@getStudentContacts'])
      cy.contains('Jennifer Wilson').should('be.visible')
      cy.contains('Mother').should('be.visible')
    })

    it('should display contact details', () => {
      cy.wait(['@getContacts', '@getStudentContacts'])
      cy.contains('(555) 123-4567').should('be.visible')
      cy.contains('jennifer@email.com').should('be.visible')
    })

    it('should indicate primary contacts', () => {
      cy.wait(['@getContacts', '@getStudentContacts'])
      cy.get('[data-testid="primary-badge-1"]').should('be.visible')
    })
  })

  describe('Add Emergency Contact', () => {
    it('should open add contact modal', () => {
      cy.wait(['@getContacts', '@getStudentContacts'])
      cy.get('[data-testid="add-contact-button"]').click()
      cy.get('[data-testid="contact-modal"]').should('be.visible')
    })

    it('should validate required fields', () => {
      cy.wait(['@getContacts', '@getStudentContacts'])
      cy.get('[data-testid="add-contact-button"]').click()
      cy.get('[data-testid="save-contact"]').click()
      
      cy.contains('First name is required').should('be.visible')
      cy.contains('Last name is required').should('be.visible')
      cy.contains('Phone number is required').should('be.visible')
      cy.contains('Relationship is required').should('be.visible')
    })

    it('should validate phone number format', () => {
      cy.wait(['@getContacts', '@getStudentContacts'])
      cy.get('[data-testid="add-contact-button"]').click()
      
      cy.get('[data-testid="phone-number"]').type('invalid')
      cy.get('[data-testid="save-contact"]').click()
      
      cy.contains('Invalid phone number format').should('be.visible')
    })

    it('should validate email format', () => {
      cy.wait(['@getContacts', '@getStudentContacts'])
      cy.get('[data-testid="add-contact-button"]').click()
      
      cy.get('[data-testid="email"]').type('invalid-email')
      cy.get('[data-testid="save-contact"]').click()
      
      cy.contains('Invalid email format').should('be.visible')
    })

    it('should successfully add emergency contact', () => {
      cy.wait('@getContacts')
      
      cy.intercept('POST', '**/api/emergency-contacts', {
        statusCode: 201,
        body: {
          success: true,
          data: {
            id: '2',
            firstName: 'John',
            lastName: 'Wilson',
            relationship: 'Father',
            phoneNumber: '(555) 234-5678'
          }
        }
      }).as('addContact')
      
      cy.get('[data-testid="add-contact-button"]').click()
      
      cy.get('[data-testid="student-select"]').select('STU001')
      cy.get('[data-testid="first-name"]').type('John')
      cy.get('[data-testid="last-name"]').type('Wilson')
      cy.get('[data-testid="relationship"]').select('Father')
      cy.get('[data-testid="phone-number"]').type('(555) 234-5678')
      cy.get('[data-testid="email"]').type('john@email.com')
      
      cy.get('[data-testid="save-contact"]').click()
      
      cy.wait('@addContact')
      cy.contains('Emergency contact added').should('be.visible')
    })
  })

  describe('Update Emergency Contact', () => {
    it('should open edit modal', () => {
      cy.wait('@getContacts')
      cy.get('[data-testid="edit-contact-1"]').click()
      cy.get('[data-testid="contact-modal"]').should('be.visible')
      cy.get('[data-testid="first-name"]').should('have.value', 'Jennifer')
    })

    it('should update contact information', () => {
      cy.wait('@getContacts')
      
      cy.intercept('PUT', '**/api/emergency-contacts/1', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            id: '1',
            phoneNumber: '(555) 999-8888'
          }
        }
      }).as('updateContact')
      
      cy.get('[data-testid="edit-contact-1"]').click()
      
      cy.get('[data-testid="phone-number"]').clear().type('(555) 999-8888')
      cy.get('[data-testid="save-contact"]').click()
      
      cy.wait('@updateContact')
      cy.contains('Contact updated').should('be.visible')
    })

    it('should toggle primary contact status', () => {
      cy.wait('@getContacts')
      
      cy.intercept('PUT', '**/api/emergency-contacts/1', {
        statusCode: 200,
        body: { success: true }
      }).as('updatePrimary')
      
      cy.get('[data-testid="edit-contact-1"]').click()
      cy.get('[data-testid="is-primary"]').uncheck()
      cy.get('[data-testid="save-contact"]').click()
      
      cy.wait('@updatePrimary')
    })

    it('should update pickup authorization', () => {
      cy.wait('@getContacts')
      
      cy.get('[data-testid="edit-contact-1"]').click()
      cy.get('[data-testid="can-pickup"]').check()
      cy.get('[data-testid="save-contact"]').click()
    })
  })

  describe('Delete Emergency Contact', () => {
    it('should show confirmation dialog', () => {
      cy.wait('@getContacts')
      cy.get('[data-testid="delete-contact-1"]').click()
      cy.get('[data-testid="confirm-dialog"]').should('be.visible')
      cy.contains('Are you sure you want to delete this contact?').should('be.visible')
    })

    it('should cancel deletion', () => {
      cy.wait('@getContacts')
      cy.get('[data-testid="delete-contact-1"]').click()
      cy.get('[data-testid="cancel-delete"]').click()
      cy.contains('Jennifer Wilson').should('be.visible')
    })

    it('should successfully delete contact', () => {
      cy.wait('@getContacts')
      
      cy.intercept('DELETE', '**/api/emergency-contacts/1', {
        statusCode: 200,
        body: { success: true }
      }).as('deleteContact')
      
      cy.get('[data-testid="delete-contact-1"]').click()
      cy.get('[data-testid="confirm-delete"]').click()
      
      cy.wait('@deleteContact')
      cy.contains('Contact deleted').should('be.visible')
    })

    it('should prevent deleting last primary contact', () => {
      cy.wait('@getContacts')
      
      cy.intercept('DELETE', '**/api/emergency-contacts/1', {
        statusCode: 400,
        body: { error: 'Cannot delete last primary contact' }
      }).as('deleteError')
      
      cy.get('[data-testid="delete-contact-1"]').click()
      cy.get('[data-testid="confirm-delete"]').click()
      
      cy.wait('@deleteError')
      cy.contains('Cannot delete last primary contact').should('be.visible')
    })
  })

  describe('Search and Filter', () => {
    it('should search contacts by name', () => {
      cy.wait('@getContacts')
      cy.get('[data-testid="contact-search"]').type('Jennifer')
      cy.contains('Jennifer Wilson').should('be.visible')
    })

    it('should filter by student', () => {
      cy.wait('@getContacts')
      cy.get('[data-testid="student-filter"]').select('STU001')
      cy.contains('Emma Wilson').should('be.visible')
    })

    it('should filter by relationship', () => {
      cy.wait('@getContacts')
      cy.get('[data-testid="relationship-filter"]').select('Mother')
      cy.contains('Mother').should('be.visible')
    })

    it('should filter primary contacts only', () => {
      cy.wait('@getContacts')
      cy.get('[data-testid="primary-only"]').check()
      cy.get('[data-testid="primary-badge-1"]').should('be.visible')
    })
  })

  describe('Contact Hierarchy', () => {
    it('should display contacts in priority order', () => {
      cy.intercept('GET', '**/api/emergency-contacts*', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            contacts: [
              { id: '1', firstName: 'Jennifer', isPrimary: true, priority: 1 },
              { id: '2', firstName: 'John', isPrimary: false, priority: 2 },
              { id: '3', firstName: 'Mary', isPrimary: false, priority: 3 }
            ]
          }
        }
      }).as('getContactsPriority')
      
      cy.reload()
      cy.wait('@getContactsPriority')
      
      cy.get('[data-testid="contacts-list"] tr').first().should('contain', 'Jennifer')
    })

    it('should update contact priority', () => {
      cy.wait('@getContacts')
      
      cy.intercept('PUT', '**/api/emergency-contacts/1/priority', {
        statusCode: 200,
        body: { success: true }
      }).as('updatePriority')
      
      cy.get('[data-testid="change-priority-1"]').click()
      cy.get('[data-testid="priority-up"]').click()
      
      cy.wait('@updatePriority')
    })
  })

  describe('Contact Verification', () => {
    it('should mark contact as verified', () => {
      cy.wait('@getContacts')
      
      cy.intercept('POST', '**/api/emergency-contacts/1/verify', {
        statusCode: 200,
        body: { success: true }
      }).as('verifyContact')
      
      cy.get('[data-testid="verify-contact-1"]').click()
      
      cy.wait('@verifyContact')
      cy.get('[data-testid="verified-badge-1"]').should('be.visible')
    })

    it('should record verification date', () => {
      cy.wait('@getContacts')
      
      cy.get('[data-testid="view-contact-1"]').click()
      cy.contains('Last Verified').should('be.visible')
    })

    it('should show unverified contacts warning', () => {
      cy.intercept('GET', '**/api/emergency-contacts/unverified', {
        statusCode: 200,
        body: {
          success: true,
          data: { count: 5 }
        }
      }).as('getUnverified')
      
      cy.wait('@getUnverified')
      cy.contains('5 unverified contacts').should('be.visible')
    })
  })

  describe('Bulk Operations', () => {
    it('should select multiple contacts', () => {
      cy.wait('@getContacts')
      cy.get('[data-testid="select-contact-1"]').check()
      cy.get('[data-testid="bulk-actions"]').should('be.visible')
    })

    it('should verify multiple contacts', () => {
      cy.wait('@getContacts')
      
      cy.intercept('POST', '**/api/emergency-contacts/bulk-verify', {
        statusCode: 200,
        body: { success: true }
      }).as('bulkVerify')
      
      cy.get('[data-testid="select-contact-1"]').check()
      cy.get('[data-testid="bulk-verify"]').click()
      
      cy.wait('@bulkVerify')
      cy.contains('Contacts verified').should('be.visible')
    })

    it('should export selected contacts', () => {
      cy.wait('@getContacts')
      
      cy.intercept('POST', '**/api/emergency-contacts/export', {
        statusCode: 200,
        headers: { 'Content-Type': 'text/csv' },
        body: 'Name,Phone,Email\nJennifer Wilson,(555) 123-4567,jennifer@email.com'
      }).as('export')
      
      cy.get('[data-testid="select-contact-1"]').check()
      cy.get('[data-testid="bulk-export"]').click()
      
      cy.wait('@export')
    })
  })

  describe('Error Handling', () => {
    it('should handle API errors', () => {
      cy.intercept('GET', '**/api/emergency-contacts*', {
        statusCode: 500,
        body: { error: 'Server error' }
      }).as('error')
      
      cy.reload()
      cy.wait('@error')
      cy.contains('Failed to load contacts').should('be.visible')
    })

    it('should handle add contact errors', () => {
      cy.wait('@getContacts')
      
      cy.intercept('POST', '**/api/emergency-contacts', {
        statusCode: 400,
        body: { error: 'Invalid data' }
      }).as('addError')
      
      cy.get('[data-testid="add-contact-button"]').click()
      cy.get('[data-testid="save-contact"]').click()
      
      cy.wait('@addError')
    })
  })

  describe('Healthcare Compliance', () => {
    it('should log contact access', () => {
      cy.intercept('POST', '**/api/audit-logs', (req) => {
        expect(req.body.action).to.include('CONTACT')
        req.reply({ statusCode: 200, body: { success: true } })
      }).as('auditLog')
      
      cy.wait('@auditLog')
    })

    it('should require authorization for modifications', () => {
      cy.intercept('POST', '**/api/emergency-contacts', {
        statusCode: 403,
        body: { error: 'Insufficient permissions' }
      }).as('unauthorized')
      
      cy.wait('@getContacts')
      cy.get('[data-testid="add-contact-button"]').click()
      cy.get('[data-testid="save-contact"]').click()
      
      cy.wait('@unauthorized')
    })
  })

  describe('Responsive Design', () => {
    it('should be mobile responsive', () => {
      cy.viewport('iphone-x')
      cy.contains('Emergency Contact').should('be.visible')
    })

    it('should be tablet responsive', () => {
      cy.viewport('ipad-2')
      cy.contains('Emergency Contact').should('be.visible')
    })
  })
})
