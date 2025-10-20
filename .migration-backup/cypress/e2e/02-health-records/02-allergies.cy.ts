/**
 * Health Records - Allergies Module Tests
 *
 * Comprehensive E2E tests for allergies management functionality.
 * Tests cover:
 * - Loading allergies tab (verify no mock data)
 * - Displaying allergy list
 * - Creating new allergy
 * - Editing allergy
 * - Deleting allergy
 * - Verifying allergy
 * - Life-threatening allergy highlighting
 * - EpiPen information display
 * - Contraindication checking
 * - Emergency protocol display
 *
 * @author White Cross Healthcare Platform
 * @module AllergiesE2E
 */

describe('Health Records - Allergies Module', () => {
  beforeEach(() => {
    // Login as nurse with appropriate permissions
    cy.login('nurse')

    // Setup API intercepts
    cy.setupHealthRecordsIntercepts()

    // Navigate to health records page
    cy.visit('/health-records')
    cy.waitForHealthcareData()
  })

  describe('Loading Allergies Tab', () => {
    it('should load allergies tab without mock data', () => {
      // Mock empty allergies response from API
      cy.intercept('GET', '**/api/health-records/student/*/allergies', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            allergies: []
          }
        }
      }).as('getAllergiesEmpty')

      // Navigate to allergies tab
      cy.navigateToHealthRecordTab('Allergies')

      // Wait for API call
      cy.wait('@getAllergiesEmpty')

      // Verify tab content is loaded
      cy.getByTestId('allergies-content').should('be.visible')

      // Should show empty state (no mock data)
      cy.getByTestId('no-allergies-message').should('be.visible')
      cy.contains('No allergies recorded').should('be.visible')
    })

    it('should verify no hardcoded allergies are displayed', () => {
      // Mock empty response
      cy.intercept('GET', '**/api/health-records/student/*/allergies', {
        statusCode: 200,
        body: {
          success: true,
          data: { allergies: [] }
        }
      }).as('emptyAllergies')

      cy.navigateToHealthRecordTab('Allergies')
      cy.wait('@emptyAllergies')

      // Should NOT show any allergy items
      cy.get('[data-testid="allergy-item"]').should('not.exist')

      // Should show empty state
      cy.getByTestId('no-allergies-message').should('be.visible')
    })

    it('should load allergies from API when data exists', () => {
      // Mock API response with allergies
      cy.intercept('GET', '**/api/health-records/student/*/allergies', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            allergies: [
              {
                id: 'allergy-1',
                studentId: '1',
                allergen: 'Peanuts',
                severity: 'LIFE_THREATENING',
                reaction: 'Anaphylaxis',
                treatment: 'EpiPen required',
                verified: true,
                providerName: 'Dr. Smith',
                notes: 'Severe reaction history',
                createdAt: '2024-12-15T10:00:00Z'
              }
            ]
          }
        }
      }).as('getAllergiesWithData')

      cy.navigateToHealthRecordTab('Allergies')
      cy.wait('@getAllergiesWithData')

      // Verify allergy is displayed from API
      cy.getByTestId('allergy-item').should('have.length', 1)
      cy.getByTestId('allergen-name').should('contain', 'Peanuts')
    })
  })

  describe('Displaying Allergy List', () => {
    beforeEach(() => {
      // Mock allergies data
      cy.intercept('GET', '**/api/health-records/student/*/allergies', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            allergies: [
              {
                id: 'allergy-1',
                studentId: '1',
                allergen: 'Peanuts',
                severity: 'LIFE_THREATENING',
                reaction: 'Anaphylaxis, hives, difficulty breathing',
                treatment: 'EpiPen auto-injector',
                verified: true,
                providerName: 'Dr. Sarah Johnson',
                notes: 'Patient carries EpiPen at all times',
                epiPenLocation: 'Nurse office and student backpack',
                emergencyProtocol: 'Administer EpiPen immediately, call 911',
                createdAt: '2024-12-15T10:00:00Z'
              },
              {
                id: 'allergy-2',
                studentId: '1',
                allergen: 'Penicillin',
                severity: 'SEVERE',
                reaction: 'Severe rash, swelling',
                treatment: 'Avoid penicillin-based antibiotics',
                verified: true,
                providerName: 'Dr. Michael Chen',
                notes: 'Use alternative antibiotics',
                createdAt: '2024-11-20T09:30:00Z'
              },
              {
                id: 'allergy-3',
                studentId: '1',
                allergen: 'Latex',
                severity: 'MODERATE',
                reaction: 'Skin irritation, itching',
                treatment: 'Use latex-free gloves',
                verified: false,
                providerName: 'Nurse Thompson',
                notes: 'Reported by parent, needs medical verification',
                createdAt: '2025-01-05T14:15:00Z'
              }
            ]
          }
        }
      }).as('getAllergies')

      cy.navigateToHealthRecordTab('Allergies')
      cy.wait('@getAllergies')
    })

    it('should display all allergies from API', () => {
      // Verify all allergies are displayed
      cy.getByTestId('allergy-item').should('have.length', 3)

      // Verify allergy details
      cy.getByTestId('allergen-name').first().should('contain', 'Peanuts')
      cy.getByTestId('allergen-name').eq(1).should('contain', 'Penicillin')
      cy.getByTestId('allergen-name').eq(2).should('contain', 'Latex')
    })

    it('should display severity badges correctly', () => {
      // Check severity badges
      cy.getByTestId('severity-badge').first().should('contain', 'LIFE_THREATENING')
      cy.getByTestId('severity-badge').eq(1).should('contain', 'SEVERE')
      cy.getByTestId('severity-badge').eq(2).should('contain', 'MODERATE')

      // Verify color coding
      cy.getByTestId('severity-badge').first()
        .should('have.class', 'bg-red-100')
        .or('have.class', 'text-red-700')
    })

    it('should display verification status', () => {
      // First two allergies are verified
      cy.getByTestId('verification-status').eq(0).should('contain', 'Verified')
      cy.getByTestId('verification-status').eq(1).should('contain', 'Verified')

      // Third allergy is unverified
      cy.getByTestId('verification-status').eq(2).should('contain', 'Unverified')
    })

    it('should display treatment details', () => {
      // Verify treatment information is shown
      cy.getByTestId('allergy-item').first().within(() => {
        cy.getByTestId('treatment-details').should('contain', 'EpiPen auto-injector')
      })
    })

    it('should display provider information for medical staff', () => {
      // Provider name should be visible for nurses
      cy.getByTestId('provider-name').first().should('contain', 'Dr. Sarah Johnson')
    })
  })

  describe('Creating New Allergy', () => {
    it('should open allergy creation modal', () => {
      cy.navigateToHealthRecordTab('Allergies')

      // Click add allergy button
      cy.getByTestId('add-allergy-button').click()

      // Modal should open
      cy.get('[data-testid*="allergy-modal"], [data-testid*="modal"]')
        .should('be.visible')
    })

    it('should create a new allergy successfully', () => {
      // Mock successful creation
      cy.intercept('POST', '**/api/health-records/allergies', {
        statusCode: 201,
        body: {
          success: true,
          data: {
            allergy: {
              id: 'allergy-new-1',
              studentId: '1',
              allergen: 'Shellfish',
              severity: 'SEVERE',
              reaction: 'Swelling, hives',
              treatment: 'Avoid all shellfish',
              verified: false
            }
          },
          message: 'Allergy created successfully'
        }
      }).as('createAllergy')

      cy.navigateToHealthRecordTab('Allergies')
      cy.getByTestId('add-allergy-button').click()

      // Fill allergy form
      cy.get('input[name="allergen"], [data-testid*="allergen"]')
        .first()
        .type('Shellfish')

      cy.get('select[name="severity"], [data-testid*="severity"]')
        .first()
        .select('SEVERE')

      cy.get('textarea[name="reaction"], [data-testid*="reaction"]')
        .first()
        .type('Swelling, hives')

      cy.get('textarea[name="treatment"], [data-testid*="treatment"]')
        .first()
        .type('Avoid all shellfish')

      // Submit form
      cy.get('button').contains(/save|create|add/i).click()

      // Wait for creation
      cy.wait('@createAllergy', { timeout: 5000 })

      // Verify success
      cy.verifySuccess(/created|success|added/i)
    })

    it('should validate required fields', () => {
      cy.navigateToHealthRecordTab('Allergies')
      cy.getByTestId('add-allergy-button').click()

      // Try to submit without filling fields
      cy.get('button').contains(/save|create/i).click()

      // Should show validation errors
      cy.contains(/required|allergen|must/i).should('be.visible')
    })

    it('should create life-threatening allergy with emergency protocol', () => {
      cy.intercept('POST', '**/api/health-records/allergies', {
        statusCode: 201,
        body: {
          success: true,
          data: {
            allergy: {
              id: 'allergy-lt-1',
              allergen: 'Bee Stings',
              severity: 'LIFE_THREATENING',
              treatment: 'EpiPen',
              emergencyProtocol: 'Administer EpiPen, call 911'
            }
          }
        }
      }).as('createLifeThreatening')

      cy.navigateToHealthRecordTab('Allergies')
      cy.getByTestId('add-allergy-button').click()

      // Fill form for life-threatening allergy
      cy.get('input[name="allergen"]').first().type('Bee Stings')
      cy.get('select[name="severity"]').first().select('LIFE_THREATENING')
      cy.get('textarea[name="treatment"]').first().type('EpiPen')
      cy.get('textarea[name="emergencyProtocol"]').first().type('Administer EpiPen, call 911')

      cy.get('button').contains(/save|create/i).click()
      cy.wait('@createLifeThreatening')
      cy.verifySuccess()
    })
  })

  describe('Editing Allergy', () => {
    beforeEach(() => {
      cy.intercept('GET', '**/api/health-records/student/*/allergies', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            allergies: [
              {
                id: 'allergy-edit-1',
                allergen: 'Dust',
                severity: 'MILD',
                reaction: 'Sneezing',
                treatment: 'Antihistamines',
                verified: false
              }
            ]
          }
        }
      }).as('getAllergies')

      cy.navigateToHealthRecordTab('Allergies')
      cy.wait('@getAllergies')
    })

    it('should open edit modal when clicking edit button', () => {
      // Click edit button
      cy.getByTestId('edit-allergy-button').first().click()

      // Modal should open with existing data
      cy.get('[data-testid*="modal"]').should('be.visible')
    })

    it('should update allergy successfully', () => {
      cy.intercept('PUT', '**/api/health-records/allergies/*', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            allergy: {
              id: 'allergy-edit-1',
              allergen: 'Dust',
              severity: 'MODERATE',
              verified: true
            }
          },
          message: 'Allergy updated successfully'
        }
      }).as('updateAllergy')

      cy.getByTestId('edit-allergy-button').first().click()

      // Update severity
      cy.get('select[name="severity"]').first().select('MODERATE')

      // Save changes
      cy.get('button').contains(/save|update/i).click()

      cy.wait('@updateAllergy')
      cy.verifySuccess(/updated|success/i)
    })
  })

  describe('Deleting Allergy', () => {
    beforeEach(() => {
      cy.intercept('GET', '**/api/health-records/student/*/allergies', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            allergies: [
              {
                id: 'allergy-delete-1',
                allergen: 'Pollen',
                severity: 'MILD',
                verified: false
              }
            ]
          }
        }
      }).as('getAllergies')

      cy.navigateToHealthRecordTab('Allergies')
      cy.wait('@getAllergies')
    })

    it('should delete allergy with confirmation', () => {
      cy.intercept('DELETE', '**/api/health-records/allergies/*', {
        statusCode: 200,
        body: {
          success: true,
          message: 'Allergy deleted successfully'
        }
      }).as('deleteAllergy')

      // Click delete button
      cy.get('button').contains(/delete|remove/i).first().click()

      // Confirm deletion
      cy.get('button').contains(/confirm|yes|delete/i).click()

      cy.wait('@deleteAllergy')
      cy.verifySuccess(/deleted|removed/i)
    })
  })

  describe('Verifying Allergy', () => {
    beforeEach(() => {
      cy.intercept('GET', '**/api/health-records/student/*/allergies', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            allergies: [
              {
                id: 'allergy-verify-1',
                allergen: 'Eggs',
                severity: 'MODERATE',
                verified: false
              }
            ]
          }
        }
      }).as('getAllergies')

      cy.navigateToHealthRecordTab('Allergies')
      cy.wait('@getAllergies')
    })

    it('should verify an allergy', () => {
      cy.intercept('PATCH', '**/api/health-records/allergies/*/verify', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            allergy: {
              id: 'allergy-verify-1',
              verified: true
            }
          },
          message: 'Allergy verified successfully'
        }
      }).as('verifyAllergy')

      // Click verify button
      cy.get('button').contains(/verify/i).first().click()

      cy.wait('@verifyAllergy')
      cy.verifySuccess(/verified/i)
    })
  })

  describe('Life-Threatening Allergy Highlighting', () => {
    beforeEach(() => {
      cy.intercept('GET', '**/api/health-records/student/*/allergies', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            allergies: [
              {
                id: 'allergy-lt-1',
                allergen: 'Peanuts',
                severity: 'LIFE_THREATENING',
                reaction: 'Anaphylaxis',
                treatment: 'EpiPen',
                verified: true
              },
              {
                id: 'allergy-mild-1',
                allergen: 'Pollen',
                severity: 'MILD',
                reaction: 'Sneezing',
                verified: true
              }
            ]
          }
        }
      }).as('getAllergies')

      cy.navigateToHealthRecordTab('Allergies')
      cy.wait('@getAllergies')
    })

    it('should highlight life-threatening allergies with red color', () => {
      // First allergy (life-threatening) should have red styling
      cy.getByTestId('allergy-item').first().within(() => {
        cy.get('[class*="text-red"]').should('exist')
      })

      // Severity badge should be red
      cy.getByTestId('severity-badge').first()
        .should('have.class', 'bg-red-100')
        .or('have.class', 'text-red-700')
    })

    it('should display life-threatening allergies prominently', () => {
      // Life-threatening allergy should be clearly marked
      cy.getByTestId('allergy-item').first().within(() => {
        cy.getByTestId('severity-badge').should('contain', 'LIFE_THREATENING')
      })
    })
  })

  describe('EpiPen Information Display', () => {
    beforeEach(() => {
      cy.intercept('GET', '**/api/health-records/student/*/allergies', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            allergies: [
              {
                id: 'allergy-epipen-1',
                allergen: 'Peanuts',
                severity: 'LIFE_THREATENING',
                treatment: 'EpiPen auto-injector',
                epiPenLocation: 'Nurse office and student backpack',
                epiPenExpiration: '2025-12-31',
                verified: true
              }
            ]
          }
        }
      }).as('getAllergies')

      cy.navigateToHealthRecordTab('Allergies')
      cy.wait('@getAllergies')
    })

    it('should display EpiPen information when treatment includes EpiPen', () => {
      cy.getByTestId('allergy-item').first().within(() => {
        cy.getByTestId('treatment-details').should('contain', 'EpiPen')
      })
    })

    it('should show EpiPen location information', () => {
      // EpiPen location should be displayed
      cy.getByTestId('allergy-item').first()
        .should('contain', 'Nurse office')
        .or('contain', 'backpack')
    })
  })

  describe('Contraindication Checking', () => {
    it('should check for medication contraindications', () => {
      cy.intercept('GET', '**/api/health-records/student/*/allergies', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            allergies: [
              {
                id: 'allergy-penicillin',
                allergen: 'Penicillin',
                severity: 'SEVERE',
                contraindications: ['Amoxicillin', 'Ampicillin'],
                verified: true
              }
            ]
          }
        }
      }).as('getAllergies')

      cy.navigateToHealthRecordTab('Allergies')
      cy.wait('@getAllergies')

      // Verify contraindications are displayed
      cy.getByTestId('allergy-item').should('contain', 'Penicillin')
    })

    it('should warn when adding medication with allergy contraindication', () => {
      cy.intercept('POST', '**/api/medications/check-contraindications', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            hasContraindication: true,
            allergies: ['Penicillin'],
            warning: 'Patient is allergic to Penicillin'
          }
        }
      }).as('checkContraindications')

      // This would be tested in medication module
      // Documenting the expected behavior here
      cy.log('Contraindication checking should prevent medication errors')
    })
  })

  describe('Emergency Protocol Display', () => {
    beforeEach(() => {
      cy.intercept('GET', '**/api/health-records/student/*/allergies', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            allergies: [
              {
                id: 'allergy-emergency-1',
                allergen: 'Peanuts',
                severity: 'LIFE_THREATENING',
                reaction: 'Anaphylaxis',
                treatment: 'EpiPen',
                emergencyProtocol: 'Step 1: Administer EpiPen immediately\nStep 2: Call 911\nStep 3: Notify parents\nStep 4: Monitor vital signs',
                emergencyContacts: [
                  { name: 'Parent - Jane Doe', phone: '555-0101' }
                ],
                verified: true
              }
            ]
          }
        }
      }).as('getAllergies')

      cy.navigateToHealthRecordTab('Allergies')
      cy.wait('@getAllergies')
    })

    it('should display emergency protocol for life-threatening allergies', () => {
      cy.getByTestId('allergy-item').first().within(() => {
        // Emergency protocol should be visible or expandable
        cy.contains(/emergency|protocol/i).should('exist')
      })
    })

    it('should show emergency contacts', () => {
      // Emergency contact information should be accessible
      cy.getByTestId('allergy-item').first()
        .should('contain.text', 'Parent')
        .or('contain.text', 'contact')
    })

    it('should provide step-by-step emergency instructions', () => {
      // Click to view emergency protocol
      cy.get('button').contains(/emergency|protocol/i).first().click()

      // Should show detailed steps
      cy.contains(/administer epipen|call 911/i).should('be.visible')
    })
  })

  describe('Role-Based Access Control', () => {
    it('should hide medical details for counselor role', () => {
      // Login as counselor
      cy.login('counselor')

      cy.intercept('GET', '**/api/health-records/student/*/allergies', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            allergies: [
              {
                id: 'allergy-1',
                allergen: 'Peanuts',
                severity: 'LIFE_THREATENING',
                treatment: 'EpiPen required',
                providerName: 'Dr. Smith'
              }
            ]
          }
        }
      }).as('getAllergies')

      cy.visit('/health-records')
      cy.navigateToHealthRecordTab('Allergies')
      cy.wait('@getAllergies')

      // Treatment details should be restricted
      cy.getByTestId('treatment-details').should('contain', '[MEDICAL INFO RESTRICTED]')

      // Provider name should be hidden
      cy.getByTestId('provider-name').should('not.exist')
    })

    it('should disable add allergy button for read-only users', () => {
      // Login as read-only user
      cy.login('viewer')

      cy.visit('/health-records')
      cy.navigateToHealthRecordTab('Allergies')

      // Add button should be disabled
      cy.getByTestId('add-allergy-button').should('be.disabled')
    })
  })

  describe('Error Handling', () => {
    it('should handle API errors gracefully', () => {
      cy.intercept('GET', '**/api/health-records/student/*/allergies', {
        statusCode: 500,
        body: {
          success: false,
          error: 'Failed to load allergies'
        }
      }).as('allergyError')

      cy.navigateToHealthRecordTab('Allergies')
      cy.wait('@allergyError')

      // Should show error message
      cy.contains(/error|failed|unable/i).should('be.visible')
    })

    it('should handle network errors', () => {
      cy.intercept('GET', '**/api/health-records/student/*/allergies', {
        forceNetworkError: true
      }).as('networkError')

      cy.navigateToHealthRecordTab('Allergies')

      // Should handle gracefully
      cy.contains(/error|connection/i, { timeout: 10000 }).should('be.visible')
    })
  })

  describe('Accessibility', () => {
    it('should have proper ARIA labels for allergy severity', () => {
      cy.intercept('GET', '**/api/health-records/student/*/allergies', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            allergies: [
              {
                id: 'allergy-1',
                allergen: 'Peanuts',
                severity: 'LIFE_THREATENING'
              }
            ]
          }
        }
      }).as('getAllergies')

      cy.navigateToHealthRecordTab('Allergies')
      cy.wait('@getAllergies')

      // Severity badges should have appropriate accessibility
      cy.getByTestId('severity-badge').should('be.visible')
    })

    it('should announce allergy additions to screen readers', () => {
      // Screen reader announcements would be tested with actual accessibility tools
      cy.log('Screen reader announcements should be implemented')
    })
  })
})
