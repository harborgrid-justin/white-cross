/// <reference types="cypress" />

describe('Student Medical Alerts and Emergency Contacts', () => {
  beforeEach(() => {
    cy.loginAsNurse()
    cy.interceptStudentAPI()
    cy.visit('/students')
    cy.waitForStudentTable()
  })

  describe('Medical Alert Indicators', () => {
    it('should display allergy indicators for students with allergies', () => {
      cy.get('[data-testid="student-row"]').first().within(() => {
        cy.get('[data-testid="allergy-indicator"]')
          .should('be.visible')
          .and('have.class', 'bg-red-100')
          .and('have.class', 'text-red-800')
          .and('contain.text', 'Allergies')
      })
    })

    it('should display medication indicators for students on medications', () => {
      cy.get('[data-testid="student-row"]').first().within(() => {
        cy.get('[data-testid="medication-indicator"]')
          .should('be.visible')
          .and('have.class', 'bg-blue-100')
          .and('have.class', 'text-blue-800')
          .and('contain.text', 'Medications')
      })
    })

    it('should show life-threatening allergy warnings prominently', () => {
      // Mock student with life-threatening allergy
      cy.intercept('GET', '**/api/students*', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            students: [
              {
                id: '1',
                studentNumber: 'STU001',
                firstName: 'Critical',
                lastName: 'Patient',
                dateOfBirth: '2010-01-01',
                grade: '8',
                gender: 'FEMALE',
                isActive: true,
                emergencyContacts: [],
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
              }
            ],
            pagination: { page: 1, limit: 10, total: 1, pages: 1 }
          }
        }
      }).as('getCriticalStudent')
      
      cy.reload()
      cy.wait('@getCriticalStudent')
      
      cy.get('[data-testid="student-row"]').first().within(() => {
        cy.get('[data-testid="allergy-indicator"]')
          .should('be.visible')
          .and('have.class', 'bg-red-100')
        
        // Should have emergency medication indicator
        cy.get('[data-testid="medication-indicator"]')
          .should('be.visible')
          .and('contain.text', 'Medications')
      })
    })

    it('should handle students with multiple medical alerts', () => {
      // Mock student with multiple conditions
      cy.intercept('GET', '**/api/students*', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            students: [
              {
                id: '1',
                studentNumber: 'STU001',
                firstName: 'Multiple',
                lastName: 'Conditions',
                dateOfBirth: '2010-01-01',
                grade: '8',
                gender: 'FEMALE',
                isActive: true,
                emergencyContacts: [],
                allergies: [
                  { id: '1', allergen: 'Peanuts', severity: 'LIFE_THREATENING' },
                  { id: '2', allergen: 'Shellfish', severity: 'SEVERE' },
                  { id: '3', allergen: 'Latex', severity: 'MODERATE' }
                ],
                medications: [
                  { id: '1', name: 'EpiPen', dosage: '0.3mg' },
                  { id: '2', name: 'Albuterol', dosage: '90mcg' },
                  { id: '3', name: 'Benadryl', dosage: '25mg' }
                ]
              }
            ],
            pagination: { page: 1, limit: 10, total: 1, pages: 1 }
          }
        }
      }).as('getMultipleConditionsStudent')
      
      cy.reload()
      cy.wait('@getMultipleConditionsStudent')
      
      cy.get('[data-testid="student-row"]').first().within(() => {
        // Should show both indicators
        cy.get('[data-testid="allergy-indicator"]').should('be.visible')
        cy.get('[data-testid="medication-indicator"]').should('be.visible')
      })
    })

    it('should not show indicators for students without medical alerts', () => {
      // Mock student with no medical conditions
      cy.intercept('GET', '**/api/students*', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            students: [
              {
                id: '1',
                studentNumber: 'STU001',
                firstName: 'Healthy',
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
      }).as('getHealthyStudent')
      
      cy.reload()
      cy.wait('@getHealthyStudent')
      
      cy.get('[data-testid="student-row"]').first().within(() => {
        // Should not show medical alert indicators
        cy.get('[data-testid="allergy-indicator"]').should('not.exist')
        cy.get('[data-testid="medication-indicator"]').should('not.exist')
      })
    })

    it('should use different colors for different alert severities', () => {
      // This would be tested if the UI differentiated severity levels
      cy.get('[data-testid="student-row"]').first().within(() => {
        cy.get('[data-testid="allergy-indicator"]')
          .should('have.class', 'bg-red-100') // Life-threatening = red
      })
    })
  })

  describe('Emergency Contact Display', () => {
    it('should display primary emergency contact information in student row', () => {
      cy.get('[data-testid="student-row"]').first().within(() => {
        // Should show primary contact name and phone
        cy.get('td').contains('Jennifer Wilson').should('be.visible')
        cy.get('td').contains('(555) 123-4567').should('be.visible')
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
                  },
                  {
                    id: '3',
                    firstName: 'Mary',
                    lastName: 'Johnson',
                    relationship: 'Grandmother',
                    phoneNumber: '(555) 123-4569',
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
      
      cy.get('[data-testid="student-row"]').first().within(() => {
        // Should only show primary contact in table
        cy.get('td').contains('Jennifer Wilson').should('be.visible')
        cy.get('td').contains('(555) 123-4567').should('be.visible')
        
        // Should not show secondary contacts in table
        cy.get('td').should('not.contain.text', 'Robert Wilson')
        cy.get('td').should('not.contain.text', 'Mary Johnson')
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
                firstName: 'No',
                lastName: 'Contacts',
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
      
      cy.get('[data-testid="student-row"]').first().within(() => {
        // Should show empty state or warning
        cy.get('td').contains('No emergency contact').should('be.visible')
          .or('contain.text', 'Not provided')
      })
    })

    it('should show warning for outdated emergency contact information', () => {
      // Mock student with flagged emergency contact
      cy.intercept('GET', '**/api/students*', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            students: [
              {
                id: '1',
                studentNumber: 'STU001',
                firstName: 'Outdated',
                lastName: 'Contact',
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
                    isPrimary: true,
                    lastVerified: '2023-01-01', // Old verification date
                    needsUpdate: true
                  }
                ],
                allergies: [],
                medications: []
              }
            ],
            pagination: { page: 1, limit: 10, total: 1, pages: 1 }
          }
        }
      }).as('getStudentOutdatedContact')
      
      cy.reload()
      cy.wait('@getStudentOutdatedContact')
      
      cy.get('[data-testid="student-row"]').first().within(() => {
        // Should show warning indicator
        cy.get('[data-testid="contact-warning"]')
          .should('be.visible')
          .and('have.class', 'text-yellow-600')
      })
    })
  })

  describe('Emergency Contact Actions', () => {
    it('should provide quick dial functionality for emergency contacts', () => {
      cy.get('[data-testid="student-row"]').first().within(() => {
        cy.get('[data-testid="quick-dial-button"]')
          .should('be.visible')
          .and('have.attr', 'href', 'tel:(555) 123-4567')
      })
    })

    it('should allow sending emergency notifications', () => {
      cy.intercept('POST', '**/api/emergency/notify', {
        statusCode: 200,
        body: { success: true, notificationId: 'NOTIFY001' }
      }).as('sendEmergencyNotification')
      
      cy.get('[data-testid="student-row"]').first().within(() => {
        cy.get('[data-testid="student-actions"]').click()
      })
      
      cy.get('[data-testid="emergency-notify-button"]').click()
      
      // Should open emergency notification modal
      cy.get('[data-testid="emergency-notification-modal"]').should('be.visible')
      
      cy.get('[data-testid="emergency-type-select"]').select('medical')
      cy.get('[data-testid="emergency-message-textarea"]')
        .type('Student has fallen and requires immediate attention')
      
      cy.get('[data-testid="send-notification-button"]').click()
      cy.wait('@sendEmergencyNotification')
      
      cy.waitForToast('Emergency notification sent successfully')
    })

    it('should show emergency contact call history', () => {
      cy.get('[data-testid="student-row"]').first().click()
      cy.get('[data-testid="student-details-modal"]').should('be.visible')
      
      cy.get('[data-testid="contact-history-tab"]').click()
      
      // Should show recent contact attempts
      cy.get('[data-testid="contact-history-list"]').should('be.visible')
      cy.get('[data-testid="contact-attempt"]').should('have.length.at.least', 1)
    })

    it('should handle failed contact attempts', () => {
      cy.intercept('POST', '**/api/emergency/notify', {
        statusCode: 500,
        body: { success: false, error: 'Contact unreachable' }
      }).as('failedNotification')
      
      cy.get('[data-testid="student-row"]').first().within(() => {
        cy.get('[data-testid="student-actions"]').click()
      })
      
      cy.get('[data-testid="emergency-notify-button"]').click()
      cy.get('[data-testid="emergency-type-select"]').select('medical')
      cy.get('[data-testid="emergency-message-textarea"]')
        .type('Test emergency message')
      
      cy.get('[data-testid="send-notification-button"]').click()
      cy.wait('@failedNotification')
      
      cy.waitForToast('Failed to send notification')
      
      // Should suggest alternative contacts
      cy.get('[data-testid="alternative-contacts"]').should('be.visible')
    })
  })

  describe('Medical Alert Interactions', () => {
    it('should show detailed allergy information on hover', () => {
      cy.get('[data-testid="student-row"]').first().within(() => {
        cy.get('[data-testid="allergy-indicator"]').trigger('mouseover')
      })
      
      // Should show tooltip with detailed allergy info
      cy.get('[data-testid="allergy-tooltip"]')
        .should('be.visible')
        .and('contain.text', 'Peanuts - LIFE_THREATENING')
        .and('contain.text', 'Keep EpiPen nearby')
    })

    it('should show medication schedule on hover', () => {
      cy.get('[data-testid="student-row"]').first().within(() => {
        cy.get('[data-testid="medication-indicator"]').trigger('mouseover')
      })
      
      // Should show tooltip with medication schedule
      cy.get('[data-testid="medication-tooltip"]')
        .should('be.visible')
        .and('contain.text', 'EpiPen - 0.3mg')
        .and('contain.text', 'As needed for allergic reactions')
    })

    it('should provide quick access to medical action plans', () => {
      cy.get('[data-testid="student-row"]').first().within(() => {
        cy.get('[data-testid="allergy-indicator"]').click()
      })
      
      // Should open medical action plan modal
      cy.get('[data-testid="action-plan-modal"]').should('be.visible')
      cy.get('[data-testid="allergy-action-plan"]')
        .should('be.visible')
        .and('contain.text', 'Severe Allergic Reaction Protocol')
    })

    it('should highlight critical medical alerts prominently', () => {
      cy.get('[data-testid="student-row"]').first().within(() => {
        // Life-threatening allergies should have special styling
        cy.get('[data-testid="allergy-indicator"]')
          .should('have.class', 'bg-red-100')
          .and('have.class', 'text-red-800')
          .and('contain', '🚨') // Emergency icon
      })
    })

    it('should allow quick medication administration logging', () => {
      cy.intercept('POST', '**/api/medications/administer', {
        statusCode: 200,
        body: { success: true, administrationId: 'MED001' }
      }).as('logMedicationAdmin')
      
      cy.get('[data-testid="student-row"]').first().within(() => {
        cy.get('[data-testid="medication-indicator"]').click()
      })
      
      cy.get('[data-testid="quick-admin-modal"]').should('be.visible')
      cy.get('[data-testid="medication-select"]').select('EpiPen')
      cy.get('[data-testid="dosage-input"]').should('have.value', '0.3mg')
      cy.get('[data-testid="admin-time-input"]').type('14:30')
      cy.get('[data-testid="admin-notes-textarea"]')
        .type('Administered during allergic reaction to peanuts')
      
      cy.get('[data-testid="log-administration-button"]').click()
      cy.wait('@logMedicationAdmin')
      
      cy.waitForToast('Medication administration logged successfully')
    })
  })

  describe('Bulk Medical Alert Management', () => {
    it('should allow filtering students by medical alert types', () => {
      cy.get('[data-testid="filter-button"]').click()
      cy.get('[data-testid="medical-alert-filter"]').should('be.visible')
      
      // Filter by allergy alerts
      cy.get('[data-testid="allergy-filter-checkbox"]').check()
      cy.get('[data-testid="apply-filters-button"]').click()
      
      // Should show only students with allergies
      cy.get('[data-testid="student-row"]').each(($row) => {
        cy.wrap($row).find('[data-testid="allergy-indicator"]').should('exist')
      })
    })

    it('should provide emergency alert broadcast functionality', () => {
      cy.intercept('POST', '**/api/emergency/broadcast', {
        statusCode: 200,
        body: { success: true, broadcastId: 'BROADCAST001' }
      }).as('emergencyBroadcast')
      
      // Select students with medical alerts
      cy.get('[data-testid="student-row"]').each(($row) => {
        cy.wrap($row).find('input[type="checkbox"]').check()
      })
      
      cy.get('[data-testid="bulk-actions-menu"]').should('be.visible')
      cy.get('[data-testid="emergency-broadcast-button"]').click()
      
      cy.get('[data-testid="broadcast-modal"]').should('be.visible')
      cy.get('[data-testid="broadcast-type-select"]').select('medical-emergency')
      cy.get('[data-testid="broadcast-message-textarea"]')
        .type('School lockdown in progress. Keep students in current location.')
      
      cy.get('[data-testid="send-broadcast-button"]').click()
      cy.wait('@emergencyBroadcast')
      
      cy.waitForToast('Emergency broadcast sent to all selected emergency contacts')
    })

    it('should generate medical alert reports', () => {
      cy.intercept('POST', '**/api/reports/medical-alerts', {
        statusCode: 200,
        body: { success: true, reportId: 'REPORT001', downloadUrl: '/reports/medical-alerts.pdf' }
      }).as('generateMedicalReport')
      
      cy.get('[data-testid="reports-button"]').click()
      cy.get('[data-testid="medical-alerts-report"]').click()
      
      cy.get('[data-testid="report-options-modal"]').should('be.visible')
      cy.get('[data-testid="include-allergies-checkbox"]').check()
      cy.get('[data-testid="include-medications-checkbox"]').check()
      cy.get('[data-testid="include-emergency-contacts-checkbox"]').check()
      
      cy.get('[data-testid="generate-report-button"]').click()
      cy.wait('@generateMedicalReport')
      
      cy.waitForToast('Medical alert report generated successfully')
      cy.get('[data-testid="download-report-button"]').should('be.visible')
    })
  })

  describe('Real-time Updates and Notifications', () => {
    it('should update medical alerts in real-time when changed', () => {
      // Mock WebSocket or SSE updates
      cy.window().then((win) => {
        win.dispatchEvent(new CustomEvent('student-medical-update', {
          detail: {
            studentId: '1',
            type: 'allergy-added',
            data: { allergen: 'Eggs', severity: 'MODERATE' }
          }
        }))
      })
      
      // Should show updated allergy indicator
      cy.get('[data-testid="student-row"]').first().within(() => {
        cy.get('[data-testid="allergy-indicator"]').should('be.visible')
      })
      
      // Should show update notification
      cy.waitForToast('Student medical information updated')
    })

    it('should show emergency contact status updates', () => {
      cy.window().then((win) => {
        win.dispatchEvent(new CustomEvent('emergency-contact-status', {
          detail: {
            studentId: '1',
            contactId: '1',
            status: 'unreachable',
            lastAttempt: new Date().toISOString()
          }
        }))
      })
      
      // Should show contact status indicator
      cy.get('[data-testid="student-row"]').first().within(() => {
        cy.get('[data-testid="contact-status-warning"]')
          .should('be.visible')
          .and('have.class', 'text-yellow-600')
      })
    })

    it('should handle medication administration reminders', () => {
      cy.window().then((win) => {
        win.dispatchEvent(new CustomEvent('medication-reminder', {
          detail: {
            studentId: '1',
            medicationName: 'Albuterol',
            scheduledTime: '15:00',
            overdue: true
          }
        }))
      })
      
      // Should show overdue medication indicator
      cy.get('[data-testid="student-row"]').first().within(() => {
        cy.get('[data-testid="medication-overdue"]')
          .should('be.visible')
          .and('have.class', 'bg-orange-100')
      })
      
      cy.waitForToast('Medication administration overdue for student')
    })
  })

  describe('Compliance and Audit Trail', () => {
    it('should log all medical alert views for audit', () => {
      cy.intercept('POST', '**/api/audit/medical-alert-view', {
        statusCode: 200,
        body: { success: true }
      }).as('logMedicalAlertView')
      
      cy.get('[data-testid="student-row"]').first().within(() => {
        cy.get('[data-testid="allergy-indicator"]').click()
      })
      
      cy.wait('@logMedicalAlertView').then((interception) => {
        expect(interception.request.body).to.include({
          action: 'VIEW_MEDICAL_ALERT',
          studentId: '1',
          alertType: 'allergy'
        })
      })
    })

    it('should log emergency contact access attempts', () => {
      cy.intercept('POST', '**/api/audit/emergency-contact-access', {
        statusCode: 200,
        body: { success: true }
      }).as('logContactAccess')
      
      cy.get('[data-testid="student-row"]').first().within(() => {
        cy.get('[data-testid="quick-dial-button"]').click()
      })
      
      cy.wait('@logContactAccess').then((interception) => {
        expect(interception.request.body).to.include({
          action: 'ACCESS_EMERGENCY_CONTACT',
          studentId: '1',
          contactId: '1'
        })
      })
    })

    it('should maintain HIPAA compliance for medical information display', () => {
      // Should not show detailed medical info to unauthorized users
      cy.loginAsReadOnly()
      cy.visit('/students')
      
      cy.get('[data-testid="student-row"]').first().within(() => {
        // Should show limited medical info
        cy.get('[data-testid="allergy-indicator"]')
          .should('contain.text', 'Medical Alert')
          .and('not.contain.text', 'Peanuts') // Specific allergen hidden
      })
    })
  })
})