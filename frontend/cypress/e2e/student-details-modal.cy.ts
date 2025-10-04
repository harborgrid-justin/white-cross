/// <reference types="cypress" />

describe('Student Details Modal and Interactions', () => {
  beforeEach(() => {
    // Set up API interceptors first
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
    }).as('verifyAuth')
    
    // Mock students API with test data
    cy.intercept('GET', '**/api/students*', {
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
              dateOfBirth: '2010-03-15',
              grade: '8',
              gender: 'FEMALE',
              isActive: true,
              emergencyContacts: [
                {
                  id: '1',
                  firstName: 'Jennifer',
                  lastName: 'Wilson',
                  relationship: 'Mother',
                  phoneNumber: '(555) 123-4567',
                  isPrimary: true
                }
              ],
              allergies: [
                {
                  id: '1',
                  allergen: 'Peanuts',
                  severity: 'LIFE_THREATENING'
                }
              ],
              medications: [
                { id: '1', name: 'EpiPen', dosage: '0.3mg' }
              ]
            },
            {
              id: '2',
              studentNumber: 'STU002',
              firstName: 'Liam',
              lastName: 'Davis',
              dateOfBirth: '2011-07-22',
              grade: '7',
              gender: 'MALE',
              isActive: true,
              emergencyContacts: [
                {
                  id: '2',
                  firstName: 'Michael',
                  lastName: 'Davis',
                  relationship: 'Father',
                  phoneNumber: '(555) 234-5678',
                  isPrimary: true
                }
              ],
              allergies: [],
              medications: [
                { id: '2', name: 'Albuterol Inhaler', dosage: '90mcg' }
              ]
            }
          ],
          pagination: { page: 1, limit: 10, total: 2, pages: 1 }
        }
      }
    }).as('getStudents')
    
    // Set up authentication state
    cy.window().then((win) => {
      win.localStorage.setItem('authToken', 'mock-nurse-token')
      win.localStorage.setItem('user', JSON.stringify({
        id: '1',
        email: 'nurse@school.edu',
        role: 'NURSE',
        firstName: 'Test',
        lastName: 'Nurse'
      }))
    })
    
    cy.visit('/students')
    cy.wait('@getStudents')
    cy.get('[data-testid="student-table"]', { timeout: 10000 }).should('be.visible')
  })

  describe('Modal Opening and Basic Display', () => {
    it('should open student details modal when clicking on student row', () => {
      cy.get('[data-testid="student-row"]').first().click()
      
      cy.get('[data-testid="student-details-modal"]').should('be.visible')
      cy.get('[data-testid="student-name"]')
        .should('be.visible')
        .and('contain.text', 'Emma Wilson')
    })

    it('should display basic student information correctly', () => {
      cy.get('[data-testid="student-row"]').first().click()
      
      cy.get('[data-testid="student-details-modal"]').within(() => {
        cy.get('[data-testid="student-id"]')
          .should('be.visible')
          .and('contain.text', 'ID: STU001')
        
        cy.get('[data-testid="student-grade"]')
          .should('be.visible')
          .and('contain.text', 'Grade: 8')
        
        cy.get('div').should('contain.text', 'DOB: 3/15/2010')
        cy.get('div').should('contain.text', 'Gender: FEMALE')
      })
    })

    it('should close modal when clicking the close button', () => {
      cy.get('[data-testid="student-row"]').first().click()
      cy.get('[data-testid="student-details-modal"]').should('be.visible')
      
      cy.get('button').contains('×').click()
      cy.get('[data-testid="student-details-modal"]').should('not.exist')
    })

    it('should close modal when clicking outside the modal', () => {
      cy.get('[data-testid="student-row"]').first().click()
      cy.get('[data-testid="student-details-modal"]').should('be.visible')
      
      // Click on the backdrop
      cy.get('.fixed.inset-0.bg-gray-600').click({ force: true })
      cy.get('[data-testid="student-details-modal"]').should('not.exist')
    })

    it('should close modal when pressing escape key', () => {
      cy.get('[data-testid="student-row"]').first().click()
      cy.get('[data-testid="student-details-modal"]').should('be.visible')
      
      cy.get('body').type('{esc}')
      cy.get('[data-testid="student-details-modal"]').should('not.exist')
    })
  })

  describe('Medical Information Display', () => {
    it('should display critical allergy alerts prominently', () => {
      cy.get('[data-testid="student-row"]').first().click()
      
      cy.get('[data-testid="critical-allergy-alert"]')
        .should('be.visible')
        .and('have.class', 'bg-red-50')
      
      cy.get('[data-testid="critical-allergy-alert"]').within(() => {
        cy.get('.font-medium.text-red-800')
          .should('contain.text', 'Critical Allergies:')
        
        cy.get('.text-red-700')
          .should('contain.text', 'Peanuts (LIFE_THREATENING)')
      })
    })

    it('should display current medications information', () => {
      cy.get('[data-testid="student-row"]').first().click()
      
      cy.get('[data-testid="medication-alert"]')
        .should('be.visible')
        .and('have.class', 'bg-blue-50')
      
      cy.get('[data-testid="medication-alert"]').within(() => {
        cy.get('.font-medium.text-blue-800')
          .should('contain.text', 'Medications:')
        
        cy.get('.text-blue-700')
          .should('contain.text', 'EpiPen - 0.3mg')
      })
    })

    it('should handle students with no allergies or medications', () => {
      // Mock student with no medical alerts
      cy.intercept('GET', '**/api/students*', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            students: [
              {
                id: '3',
                studentNumber: 'STU003',
                firstName: 'Sophia',
                lastName: 'Miller',
                dateOfBirth: '2009-11-08',
                grade: '9',
                gender: 'FEMALE',
                isActive: true,
                emergencyContacts: [
                  {
                    id: '3',
                    firstName: 'Lisa',
                    lastName: 'Miller',
                    relationship: 'Mother',
                    phoneNumber: '(555) 345-6789',
                    isPrimary: true
                  }
                ],
                allergies: [],
                medications: []
              }
            ],
            pagination: { page: 1, limit: 10, total: 1, pages: 1 }
          }
        }
      }).as('getStudentNoMedical')
      
      cy.reload()
      cy.wait('@getStudentNoMedical')
      
      cy.get('[data-testid="student-row"]').first().click()
      
      // Should not show medical alert sections
      cy.get('[data-testid="critical-allergy-alert"]').should('not.exist')
      cy.get('[data-testid="medication-alert"]').should('not.exist')
    })

    it('should display allergy severity levels with appropriate colors', () => {
      // Mock student with different allergy severities
      cy.intercept('GET', '**/api/students*', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            students: [
              {
                id: '1',
                studentNumber: 'STU001',
                firstName: 'Test',
                lastName: 'Student',
                dateOfBirth: '2010-01-01',
                grade: '8',
                gender: 'FEMALE',
                isActive: true,
                emergencyContacts: [],
                allergies: [
                  { id: '1', allergen: 'Peanuts', severity: 'LIFE_THREATENING' },
                  { id: '2', allergen: 'Milk', severity: 'MODERATE' },
                  { id: '3', allergen: 'Pollen', severity: 'MILD' }
                ],
                medications: []
              }
            ],
            pagination: { page: 1, limit: 10, total: 1, pages: 1 }
          }
        }
      }).as('getStudentMultipleAllergies')
      
      cy.reload()
      cy.wait('@getStudentMultipleAllergies')
      
      cy.get('[data-testid="student-row"]').first().click()
      
      cy.get('[data-testid="critical-allergy-alert"]').within(() => {
        cy.get('.text-red-700').should('contain.text', 'Peanuts (LIFE_THREATENING)')
        cy.get('.text-red-700').should('contain.text', 'Milk (MODERATE)')
        cy.get('.text-red-700').should('contain.text', 'Pollen (MILD)')
      })
    })
  })

  describe('Emergency Contact Information', () => {
    it('should display primary emergency contact information', () => {
      cy.get('[data-testid="student-row"]').first().click()
      
      cy.get('[data-testid="student-details-modal"]').within(() => {
        // Should show emergency contact info in the basic information or separate section
        cy.get('div').should('contain.text', 'Jennifer Wilson')
        cy.get('div').should('contain.text', '(555) 123-4567')
      })
    })

    it('should handle students with multiple emergency contacts', () => {
      // Mock student with multiple emergency contacts
      cy.intercept('GET', '**/api/students*', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            students: [
              {
                id: '1',
                studentNumber: 'STU001',
                firstName: 'Test',
                lastName: 'Student',
                dateOfBirth: '2010-01-01',
                grade: '8',
                gender: 'FEMALE',
                isActive: true,
                emergencyContacts: [
                  {
                    id: '1',
                    firstName: 'Jennifer',
                    lastName: 'Wilson',
                    relationship: 'Mother',
                    phoneNumber: '(555) 123-4567',
                    isPrimary: true
                  },
                  {
                    id: '2',
                    firstName: 'Robert',
                    lastName: 'Wilson',
                    relationship: 'Father',
                    phoneNumber: '(555) 123-4568',
                    isPrimary: false
                  }
                ],
                allergies: [],
                medications: []
              }
            ],
            pagination: { page: 1, limit: 10, total: 1, pages: 1 }
          }
        }
      }).as('getStudentMultipleContacts')
      
      cy.reload()
      cy.wait('@getStudentMultipleContacts')
      
      cy.get('[data-testid="student-row"]').first().click()
      
      // Should display primary contact prominently
      cy.get('[data-testid="student-details-modal"]').within(() => {
        cy.get('div').should('contain.text', 'Jennifer Wilson')
        cy.get('div').should('contain.text', '(555) 123-4567')
      })
    })

    it('should handle students with no emergency contacts', () => {
      // Mock student with no emergency contacts
      cy.intercept('GET', '**/api/students*', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            students: [
              {
                id: '1',
                studentNumber: 'STU001',
                firstName: 'Test',
                lastName: 'Student',
                dateOfBirth: '2010-01-01',
                grade: '8',
                gender: 'FEMALE',
                isActive: true,
                emergencyContacts: [],
                allergies: [],
                medications: []
              }
            ],
            pagination: { page: 1, limit: 10, total: 1, pages: 1 }
          }
        }
      }).as('getStudentNoContacts')
      
      cy.reload()
      cy.wait('@getStudentNoContacts')
      
      cy.get('[data-testid="student-row"]').first().click()
      
      // Should show appropriate message
      cy.get('[data-testid="student-details-modal"]').within(() => {
        cy.get('[data-testid="no-emergency-contacts"]')
          .should('be.visible')
          .and('contain.text', 'No emergency contacts on file')
      })
    })
  })

  describe('Modal Interactions and Navigation', () => {
    it('should allow navigation between multiple student modals', () => {
      // Open first student modal
      cy.get('[data-testid="student-row"]').first().click()
      cy.get('[data-testid="student-name"]').should('contain.text', 'Emma Wilson')
      
      // Close and open second student modal
      cy.get('button').contains('×').click()
      cy.get('[data-testid="student-row"]').eq(1).click()
      cy.get('[data-testid="student-name"]').should('contain.text', 'Liam Davis')
    })

    it('should maintain modal state when switching between tabs', () => {
      cy.get('[data-testid="student-row"]').first().click()
      cy.get('[data-testid="student-details-modal"]').should('be.visible')
      
      // Switch to another tab/window (simulate)
      cy.window().then((win) => {
        win.blur()
        win.focus()
      })
      
      // Modal should still be visible
      cy.get('[data-testid="student-details-modal"]').should('be.visible')
    })

    it('should handle rapid modal opening/closing without errors', () => {
      // Rapidly open and close modals
      for (let i = 0; i < 3; i++) {
        cy.get('[data-testid="student-row"]').first().click()
        cy.get('[data-testid="student-details-modal"]').should('be.visible')
        cy.get('button').contains('×').click()
        cy.get('[data-testid="student-details-modal"]').should('not.exist')
      }
    })

    it('should prevent body scrolling when modal is open', () => {
      cy.get('[data-testid="student-row"]').first().click()
      
      // Body should have overflow hidden or similar
      cy.get('body').then(($body) => {
        expect($body).to.satisfy(($el: JQuery<HTMLElement>) => {
          return $el.css('overflow') === 'hidden' || $el.hasClass('modal-open')
        })
      })
      
      // Close modal
      cy.get('button').contains('×').click()
      
      // Body scrolling should be restored
      cy.get('body').should('not.have.css', 'overflow', 'hidden')
        .and('not.have.class', 'modal-open')
    })
  })

  describe('Responsive Design and Mobile Interaction', () => {
    it('should display properly on mobile viewports', () => {
      cy.viewport('iphone-6')
      
      cy.get('[data-testid="student-row"]').first().click()
      
      // Modal should take full width on mobile
      cy.get('[data-testid="student-details-modal"]')
        .should('be.visible')
        .and('have.css', 'width')
      
      // Content should be readable
      cy.get('[data-testid="student-name"]').should('be.visible')
      cy.get('[data-testid="student-id"]').should('be.visible')
    })

    it('should handle touch interactions properly', () => {
      cy.viewport('ipad-2')
      
      // Touch to open modal
      cy.get('[data-testid="student-row"]').first().trigger('touchstart')
      cy.get('[data-testid="student-row"]').first().trigger('touchend')
      
      cy.get('[data-testid="student-details-modal"]').should('be.visible')
      
      // Touch to close modal
      cy.get('button').contains('×').trigger('touchstart')
      cy.get('button').contains('×').trigger('touchend')
      
      cy.get('[data-testid="student-details-modal"]').should('not.exist')
    })

    it('should adjust layout for tablet viewports', () => {
      cy.viewport('ipad-2')
      
      cy.get('[data-testid="student-row"]').first().click()
      
      // Modal should have appropriate width on tablet
      cy.get('[data-testid="student-details-modal"]')
        .should('be.visible')
        .and('not.have.class', 'w-full') // Should not be full width on tablet
    })
  })

  describe('Data Loading and Error States', () => {
    it('should show loading state while fetching student details', () => {
      // Mock delayed response
      cy.intercept('GET', '**/api/students*', {
        statusCode: 200,
        delay: 2000,
        body: {
          success: true,
          data: {
            students: [],
            pagination: { page: 1, limit: 10, total: 0, pages: 0 }
          }
        }
      }).as('getStudentsDelayed')
      
      cy.reload()
      
      // Should show loading spinner
      cy.get('[data-testid="loading-spinner"]').should('be.visible')
      
      cy.wait('@getStudentsDelayed')
      cy.get('[data-testid="loading-spinner"]').should('not.exist')
    })

    it('should handle missing student data gracefully', () => {
      // Mock student with missing fields
      cy.intercept('GET', '**/api/students*', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            students: [
              {
                id: '1',
                studentNumber: 'STU001',
                firstName: 'Incomplete',
                lastName: 'Student',
                // Missing fields
                isActive: true,
                emergencyContacts: [],
                allergies: [],
                medications: []
              }
            ],
            pagination: { page: 1, limit: 10, total: 1, pages: 1 }
          }
        }
      }).as('getIncompleteStudent')
      
      cy.reload()
      cy.wait('@getIncompleteStudent')
      
      cy.get('[data-testid="student-row"]').first().click()
      
      // Should handle missing data gracefully
      cy.get('[data-testid="student-details-modal"]').should('be.visible')
      cy.get('[data-testid="student-name"]').should('contain.text', 'Incomplete Student')
    })

    it('should display error message for failed data loads', () => {
      cy.intercept('GET', '**/api/students*', {
        statusCode: 500,
        body: { success: false, error: { message: 'Server error' } }
      }).as('getStudentsError')
      
      cy.reload()
      cy.wait('@getStudentsError')
      
      // Should show error message
      cy.get('[data-testid="error-message"]')
        .should('be.visible')
        .and('contain.text', 'Failed to load students')
    })
  })

  describe('Accessibility and Keyboard Navigation', () => {
    it('should be keyboard accessible', () => {
      // Tab to first student row
      cy.get('[data-testid="student-row"]').first().focus()
      cy.get('[data-testid="student-row"]').first().should('be.focused')
      
      // Enter to open modal
      cy.focused().type('{enter}')
      cy.get('[data-testid="student-details-modal"]').should('be.visible')
      
      // Tab to close button
      cy.get('[data-testid="student-details-modal"]').within(() => {
        cy.get('button').contains('×').focus().should('be.focused')
      })
      
      // Enter to close modal
      cy.focused().type('{enter}')
      cy.get('[data-testid="student-details-modal"]').should('not.exist')
    })

    it('should trap focus within modal', () => {
      cy.get('[data-testid="student-row"]').first().click()
      
      // Focus should be trapped within modal
      cy.get('[data-testid="student-details-modal"]').within(() => {
        cy.get('button').contains('×').focus()
        cy.focused().type('{tab}')
        // Focus should cycle back to first focusable element
        cy.focused().should('be.visible')
      })
    })

    it('should have proper ARIA attributes', () => {
      cy.get('[data-testid="student-row"]').first().click()
      
      cy.get('[data-testid="student-details-modal"]')
        .should('have.attr', 'role', 'dialog')
        .and('have.attr', 'aria-modal', 'true')
      
      cy.get('[data-testid="student-name"]')
        .should('have.attr', 'id')
      
      cy.get('[data-testid="student-details-modal"]')
        .should('have.attr', 'aria-labelledby')
    })

    it('should announce modal content to screen readers', () => {
      cy.get('[data-testid="student-row"]').first().click()
      
      // Modal should have appropriate live region announcements
      cy.get('[data-testid="student-details-modal"]').then(($modal) => {
        expect($modal).to.satisfy(($el: JQuery<HTMLElement>) => {
          return $el.attr('aria-live') || $el.find('[role="status"]').length > 0
        })
      })
    })

    it('should restore focus when modal closes', () => {
      // Focus on student row
      cy.get('[data-testid="student-row"]').first().focus()
      
      // Open modal
      cy.focused().click()
      cy.get('[data-testid="student-details-modal"]').should('be.visible')
      
      // Close modal
      cy.get('button').contains('×').click()
      
      // Focus should return to original element
      cy.get('[data-testid="student-row"]').first().should('be.focused')
    })
  })

  describe('Integration with Other Features', () => {
    it('should provide links to edit student information', () => {
      cy.get('[data-testid="student-row"]').first().click()
      
      cy.get('[data-testid="student-details-modal"]').within(() => {
        cy.get('[data-testid="edit-student-button"]')
          .should('be.visible')
          .and('contain.text', 'Edit Student')
      })
    })

    it('should provide navigation to health records', () => {
      cy.get('[data-testid="student-row"]').first().click()
      
      cy.get('[data-testid="student-details-modal"]').within(() => {
        cy.get('[data-testid="view-health-records-button"]')
          .should('be.visible')
          .and('contain.text', 'View Health Records')
      })
    })

    it('should allow quick actions from modal', () => {
      cy.get('[data-testid="student-row"]').first().click()
      
      cy.get('[data-testid="student-details-modal"]').within(() => {
        // Should have quick action buttons
        cy.get('[data-testid="quick-actions"]').should('be.visible')
        cy.get('[data-testid="contact-emergency"]').should('be.visible')
        cy.get('[data-testid="add-medication"]').should('be.visible')
        cy.get('[data-testid="create-incident-report"]').should('be.visible')
      })
    })
  })
})