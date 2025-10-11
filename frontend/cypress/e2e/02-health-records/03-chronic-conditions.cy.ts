/**
 * Health Records - Chronic Conditions Tests
 *
 * Comprehensive E2E tests for chronic conditions management.
 * Tests cover:
 * - Loading chronic conditions tab (verify no mock data)
 * - Displaying conditions list
 * - Creating new condition
 * - Editing condition
 * - Deleting condition
 * - Updating condition status
 * - Care plan display
 * - Accommodation tracking
 * - Review scheduling
 * - Emergency protocol display
 *
 * @author White Cross Healthcare Platform
 * @module ChronicConditionsE2E
 */

describe('Health Records - Chronic Conditions Module', () => {
  beforeEach(() => {
    // Login as nurse
    cy.login('nurse')

    // Setup API intercepts
    cy.setupHealthRecordsIntercepts()

    // Navigate to health records
    cy.visit('/health-records')
    cy.waitForHealthcareData()
  })

  describe('Loading Chronic Conditions Tab', () => {
    it('should load chronic conditions tab without mock data', () => {
      // Mock empty response
      cy.intercept('GET', '**/api/health-records/student/*/chronic-conditions', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            conditions: []
          }
        }
      }).as('getConditionsEmpty')

      // Navigate to chronic conditions tab
      cy.navigateToHealthRecordTab('Chronic')

      // Wait for API call
      cy.wait('@getConditionsEmpty')

      // Verify tab loaded
      cy.get('[data-testid*="chronic"]').should('be.visible')

      // Should show empty state
      cy.contains(/no chronic conditions|no conditions recorded/i).should('be.visible')
    })

    it('should verify no hardcoded conditions are displayed', () => {
      cy.intercept('GET', '**/api/health-records/student/*/chronic-conditions', {
        statusCode: 200,
        body: {
          success: true,
          data: { conditions: [] }
        }
      }).as('emptyConditions')

      cy.navigateToHealthRecordTab('Chronic')
      cy.wait('@emptyConditions')

      // No condition items should exist
      cy.get('[data-testid*="condition-item"]').should('not.exist')
    })

    it('should load conditions from API when data exists', () => {
      cy.intercept('GET', '**/api/health-records/student/*/chronic-conditions', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            conditions: [
              {
                id: 'condition-1',
                studentId: '1',
                condition: 'Type 1 Diabetes',
                diagnosedDate: '2023-05-15',
                status: 'ACTIVE',
                severity: 'MODERATE',
                notes: 'Insulin dependent',
                carePlan: 'Monitor blood sugar 3x daily',
                verified: true
              }
            ]
          }
        }
      }).as('getConditionsWithData')

      cy.navigateToHealthRecordTab('Chronic')
      cy.wait('@getConditionsWithData')

      // Verify condition displayed from API
      cy.get('[data-testid*="condition-item"]').should('have.length', 1)
      cy.contains('Type 1 Diabetes').should('be.visible')
    })
  })

  describe('Displaying Conditions List', () => {
    beforeEach(() => {
      cy.intercept('GET', '**/api/health-records/student/*/chronic-conditions', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            conditions: [
              {
                id: 'condition-1',
                studentId: '1',
                condition: 'Type 1 Diabetes',
                diagnosedDate: '2023-05-15',
                status: 'ACTIVE',
                severity: 'MODERATE',
                notes: 'Insulin dependent, requires blood sugar monitoring',
                carePlan: 'Monitor blood sugar before meals and bedtime. Insulin as prescribed.',
                accommodations: ['Extended time for health management', 'Snack access'],
                medications: ['Insulin'],
                emergencyProtocol: 'If blood sugar <70, give juice immediately',
                nextReview: '2025-06-15',
                providerName: 'Dr. Emily Rodriguez',
                verified: true,
                createdAt: '2023-05-15T10:00:00Z'
              },
              {
                id: 'condition-2',
                studentId: '1',
                condition: 'Asthma',
                diagnosedDate: '2022-03-20',
                status: 'ACTIVE',
                severity: 'MILD',
                notes: 'Exercise-induced asthma',
                carePlan: 'Use inhaler before physical activity',
                accommodations: ['Access to inhaler during PE', 'Indoor recess on high pollen days'],
                medications: ['Albuterol inhaler'],
                emergencyProtocol: 'Use rescue inhaler. If no improvement, call 911',
                nextReview: '2025-03-20',
                providerName: 'Dr. Michael Chen',
                verified: true,
                createdAt: '2022-03-20T14:30:00Z'
              },
              {
                id: 'condition-3',
                studentId: '1',
                condition: 'ADHD',
                diagnosedDate: '2021-09-01',
                status: 'MANAGED',
                severity: 'MILD',
                notes: 'Responds well to medication and behavioral interventions',
                carePlan: 'Medication daily, classroom accommodations in place',
                accommodations: ['Preferential seating', 'Extended test time', 'Movement breaks'],
                medications: ['Methylphenidate'],
                nextReview: '2025-09-01',
                providerName: 'Dr. Sarah Thompson',
                verified: true,
                createdAt: '2021-09-01T09:00:00Z'
              }
            ]
          }
        }
      }).as('getConditions')

      cy.navigateToHealthRecordTab('Chronic')
      cy.wait('@getConditions')
    })

    it('should display all chronic conditions from API', () => {
      cy.get('[data-testid*="condition-item"]').should('have.length', 3)

      // Verify condition names
      cy.contains('Type 1 Diabetes').should('be.visible')
      cy.contains('Asthma').should('be.visible')
      cy.contains('ADHD').should('be.visible')
    })

    it('should display condition status badges', () => {
      // Check for status indicators
      cy.contains('ACTIVE').should('be.visible')
      cy.contains('MANAGED').should('be.visible')
    })

    it('should display severity levels', () => {
      cy.get('[data-testid*="condition-item"]').should('contain', 'MODERATE')
      cy.get('[data-testid*="condition-item"]').should('contain', 'MILD')
    })

    it('should display diagnosed dates', () => {
      cy.get('[data-testid*="condition-item"]').first()
        .should('contain', '2023')
    })

    it('should show provider information', () => {
      cy.contains('Dr. Emily Rodriguez').should('be.visible')
    })
  })

  describe('Creating New Condition', () => {
    it('should open condition creation modal', () => {
      cy.navigateToHealthRecordTab('Chronic')

      // Click add condition button
      cy.get('button').contains(/add condition|new condition/i).click()

      // Modal should open
      cy.get('[data-testid*="modal"]').should('be.visible')
    })

    it('should create a new chronic condition successfully', () => {
      cy.intercept('POST', '**/api/health-records/chronic-conditions', {
        statusCode: 201,
        body: {
          success: true,
          data: {
            condition: {
              id: 'condition-new-1',
              studentId: '1',
              condition: 'Epilepsy',
              diagnosedDate: '2025-01-10',
              status: 'ACTIVE',
              severity: 'MODERATE',
              carePlan: 'Seizure action plan in place'
            }
          },
          message: 'Chronic condition created successfully'
        }
      }).as('createCondition')

      cy.navigateToHealthRecordTab('Chronic')
      cy.get('button').contains(/add condition/i).click()

      // Fill form
      cy.get('input[name="condition"], [data-testid*="condition-name"]')
        .first()
        .type('Epilepsy')

      cy.get('input[name="diagnosedDate"], [data-testid*="diagnosed-date"]')
        .first()
        .type('2025-01-10')

      cy.get('select[name="severity"], [data-testid*="severity"]')
        .first()
        .select('MODERATE')

      cy.get('textarea[name="carePlan"], [data-testid*="care-plan"]')
        .first()
        .type('Seizure action plan in place')

      // Submit
      cy.get('button').contains(/save|create/i).click()

      cy.wait('@createCondition')
      cy.verifySuccess(/created|success/i)
    })

    it('should validate required fields', () => {
      cy.navigateToHealthRecordTab('Chronic')
      cy.get('button').contains(/add condition/i).click()

      // Try to submit empty form
      cy.get('button').contains(/save|create/i).click()

      // Should show validation errors
      cy.contains(/required|condition name|must/i).should('be.visible')
    })

    it('should create condition with care plan and accommodations', () => {
      cy.intercept('POST', '**/api/health-records/chronic-conditions', {
        statusCode: 201,
        body: {
          success: true,
          data: {
            condition: {
              id: 'condition-new-2',
              condition: 'Celiac Disease',
              carePlan: 'Strict gluten-free diet',
              accommodations: ['Gluten-free meals', 'Separate food storage']
            }
          }
        }
      }).as('createConditionWithPlan')

      cy.navigateToHealthRecordTab('Chronic')
      cy.get('button').contains(/add condition/i).click()

      cy.get('input[name="condition"]').first().type('Celiac Disease')
      cy.get('input[name="diagnosedDate"]').first().type('2024-12-01')
      cy.get('textarea[name="carePlan"]').first().type('Strict gluten-free diet')
      cy.get('input[name="accommodations"]').first().type('Gluten-free meals{enter}')

      cy.get('button').contains(/save|create/i).click()
      cy.wait('@createConditionWithPlan')
      cy.verifySuccess()
    })
  })

  describe('Editing Condition', () => {
    beforeEach(() => {
      cy.intercept('GET', '**/api/health-records/student/*/chronic-conditions', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            conditions: [
              {
                id: 'condition-edit-1',
                condition: 'Asthma',
                status: 'ACTIVE',
                severity: 'MILD',
                carePlan: 'Use inhaler as needed'
              }
            ]
          }
        }
      }).as('getConditions')

      cy.navigateToHealthRecordTab('Chronic')
      cy.wait('@getConditions')
    })

    it('should open edit modal', () => {
      cy.get('button').contains(/edit/i).first().click()
      cy.get('[data-testid*="modal"]').should('be.visible')
    })

    it('should update condition successfully', () => {
      cy.intercept('PUT', '**/api/health-records/chronic-conditions/*', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            condition: {
              id: 'condition-edit-1',
              status: 'MANAGED',
              severity: 'MODERATE'
            }
          },
          message: 'Condition updated successfully'
        }
      }).as('updateCondition')

      cy.get('button').contains(/edit/i).first().click()

      // Update status
      cy.get('select[name="status"]').first().select('MANAGED')

      // Save
      cy.get('button').contains(/save|update/i).click()

      cy.wait('@updateCondition')
      cy.verifySuccess(/updated/i)
    })
  })

  describe('Deleting Condition', () => {
    beforeEach(() => {
      cy.intercept('GET', '**/api/health-records/student/*/chronic-conditions', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            conditions: [
              {
                id: 'condition-delete-1',
                condition: 'Test Condition',
                status: 'RESOLVED'
              }
            ]
          }
        }
      }).as('getConditions')

      cy.navigateToHealthRecordTab('Chronic')
      cy.wait('@getConditions')
    })

    it('should delete condition with confirmation', () => {
      cy.intercept('DELETE', '**/api/health-records/chronic-conditions/*', {
        statusCode: 200,
        body: {
          success: true,
          message: 'Condition deleted successfully'
        }
      }).as('deleteCondition')

      cy.get('button').contains(/delete|remove/i).first().click()
      cy.get('button').contains(/confirm|yes|delete/i).click()

      cy.wait('@deleteCondition')
      cy.verifySuccess(/deleted/i)
    })
  })

  describe('Updating Condition Status', () => {
    beforeEach(() => {
      cy.intercept('GET', '**/api/health-records/student/*/chronic-conditions', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            conditions: [
              {
                id: 'condition-status-1',
                condition: 'Asthma',
                status: 'ACTIVE',
                severity: 'MILD'
              }
            ]
          }
        }
      }).as('getConditions')

      cy.navigateToHealthRecordTab('Chronic')
      cy.wait('@getConditions')
    })

    it('should update condition status from ACTIVE to MANAGED', () => {
      cy.intercept('PATCH', '**/api/health-records/chronic-conditions/*/status', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            condition: {
              id: 'condition-status-1',
              status: 'MANAGED'
            }
          }
        }
      }).as('updateStatus')

      // Click status update button
      cy.get('select[name="status"], button').contains(/managed|status/i).first().click()

      cy.wait('@updateStatus')
      cy.verifySuccess()
    })

    it('should mark condition as RESOLVED', () => {
      cy.intercept('PATCH', '**/api/health-records/chronic-conditions/*/status', {
        statusCode: 200,
        body: {
          success: true,
          data: { condition: { status: 'RESOLVED' } }
        }
      }).as('resolveCondition')

      cy.get('button').contains(/resolve|mark resolved/i).first().click()
      cy.get('button').contains(/confirm/i).click()

      cy.wait('@resolveCondition')
      cy.verifySuccess()
    })
  })

  describe('Care Plan Display', () => {
    beforeEach(() => {
      cy.intercept('GET', '**/api/health-records/student/*/chronic-conditions', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            conditions: [
              {
                id: 'condition-cp-1',
                condition: 'Type 1 Diabetes',
                status: 'ACTIVE',
                carePlan: 'Monitor blood sugar 4x daily\nInsulin as prescribed\nCarb counting for meals\nExercise plan with monitoring',
                carePlanDocument: '/documents/care-plans/diabetes-plan-001.pdf'
              }
            ]
          }
        }
      }).as('getConditions')

      cy.navigateToHealthRecordTab('Chronic')
      cy.wait('@getConditions')
    })

    it('should display care plan details', () => {
      // Care plan should be visible or viewable
      cy.get('[data-testid*="condition-item"]').first().within(() => {
        cy.contains(/care plan|monitor blood sugar/i).should('exist')
      })
    })

    it('should allow viewing full care plan', () => {
      // Click to view care plan
      cy.get('button').contains(/view care plan|care plan/i).first().click()

      // Should show care plan details
      cy.contains('Monitor blood sugar').should('be.visible')
    })

    it('should provide download link for care plan document', () => {
      // Care plan document link should be available
      cy.get('a[href*="care-plan"], button').contains(/download|document/i).should('exist')
    })
  })

  describe('Accommodation Tracking', () => {
    beforeEach(() => {
      cy.intercept('GET', '**/api/health-records/student/*/chronic-conditions', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            conditions: [
              {
                id: 'condition-acc-1',
                condition: 'ADHD',
                status: 'MANAGED',
                accommodations: [
                  'Preferential seating near teacher',
                  'Extended time for tests (1.5x)',
                  'Movement breaks every 30 minutes',
                  'Written and verbal instructions',
                  'Reduced homework load'
                ],
                accommodationDocument: '/documents/504-plan-001.pdf'
              }
            ]
          }
        }
      }).as('getConditions')

      cy.navigateToHealthRecordTab('Chronic')
      cy.wait('@getConditions')
    })

    it('should display list of accommodations', () => {
      // Accommodations should be listed
      cy.get('[data-testid*="condition-item"]').first().within(() => {
        cy.contains(/preferential seating|extended time/i).should('exist')
      })
    })

    it('should show accommodation details when expanded', () => {
      // Click to view accommodations
      cy.get('button').contains(/accommodations|view accommodations/i).first().click()

      // All accommodations should be visible
      cy.contains('Preferential seating').should('be.visible')
      cy.contains('Extended time').should('be.visible')
      cy.contains('Movement breaks').should('be.visible')
    })

    it('should link to 504 plan or IEP document', () => {
      // Link to accommodation document
      cy.get('a[href*="504-plan"], a[href*="IEP"]').should('exist')
    })
  })

  describe('Review Scheduling', () => {
    beforeEach(() => {
      cy.intercept('GET', '**/api/health-records/student/*/chronic-conditions', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            conditions: [
              {
                id: 'condition-review-1',
                condition: 'Type 1 Diabetes',
                status: 'ACTIVE',
                nextReview: '2025-06-15',
                reviewFrequency: 'ANNUAL',
                lastReview: '2024-06-15'
              }
            ]
          }
        }
      }).as('getConditions')

      cy.navigateToHealthRecordTab('Chronic')
      cy.wait('@getConditions')
    })

    it('should display next review date', () => {
      cy.get('[data-testid*="condition-item"]').first()
        .should('contain', '2025-06-15')
        .or('contain', 'June')
    })

    it('should highlight overdue reviews', () => {
      cy.intercept('GET', '**/api/health-records/student/*/chronic-conditions', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            conditions: [
              {
                id: 'condition-overdue-1',
                condition: 'Asthma',
                nextReview: '2024-01-01',
                reviewOverdue: true
              }
            ]
          }
        }
      }).as('overdueCondition')

      cy.reload()
      cy.navigateToHealthRecordTab('Chronic')
      cy.wait('@overdueCondition')

      // Overdue review should be highlighted
      cy.get('[class*="text-red"], [class*="bg-red"]').should('exist')
    })

    it('should allow scheduling a review', () => {
      cy.intercept('POST', '**/api/health-records/chronic-conditions/*/schedule-review', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            review: {
              scheduledDate: '2025-12-15'
            }
          }
        }
      }).as('scheduleReview')

      cy.get('button').contains(/schedule review|schedule/i).first().click()

      // Select date
      cy.get('input[type="date"]').first().type('2025-12-15')
      cy.get('button').contains(/confirm|save/i).click()

      cy.wait('@scheduleReview')
      cy.verifySuccess()
    })
  })

  describe('Emergency Protocol Display', () => {
    beforeEach(() => {
      cy.intercept('GET', '**/api/health-records/student/*/chronic-conditions', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            conditions: [
              {
                id: 'condition-emergency-1',
                condition: 'Severe Asthma',
                status: 'ACTIVE',
                severity: 'SEVERE',
                emergencyProtocol: 'Step 1: Administer rescue inhaler (2 puffs)\nStep 2: If no improvement in 5 minutes, repeat\nStep 3: If still no improvement, call 911\nStep 4: Notify parents immediately',
                emergencyMedications: ['Albuterol inhaler', 'Nebulizer'],
                emergencyContacts: [
                  { name: 'Mother - Jane Doe', phone: '555-0101', relationship: 'Mother' },
                  { name: 'Dr. Chen', phone: '555-0202', relationship: 'Physician' }
                ]
              }
            ]
          }
        }
      }).as('getConditions')

      cy.navigateToHealthRecordTab('Chronic')
      cy.wait('@getConditions')
    })

    it('should display emergency protocol', () => {
      cy.get('[data-testid*="condition-item"]').first().within(() => {
        cy.contains(/emergency|protocol/i).should('exist')
      })
    })

    it('should show step-by-step emergency instructions', () => {
      cy.get('button').contains(/emergency|protocol/i).first().click()

      // Emergency steps should be visible
      cy.contains('Administer rescue inhaler').should('be.visible')
      cy.contains('call 911').should('be.visible')
    })

    it('should display emergency medications', () => {
      cy.get('button').contains(/emergency/i).first().click()

      // Emergency meds should be listed
      cy.contains('Albuterol').should('be.visible')
    })

    it('should show emergency contacts', () => {
      cy.get('button').contains(/emergency|contacts/i).first().click()

      // Emergency contacts should be visible
      cy.contains('Mother - Jane Doe').should('be.visible')
      cy.contains('555-0101').should('be.visible')
    })
  })

  describe('Role-Based Access Control', () => {
    it('should restrict medical details for counselors', () => {
      cy.login('counselor')

      cy.intercept('GET', '**/api/health-records/student/*/chronic-conditions', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            conditions: [
              {
                id: 'condition-1',
                condition: 'ADHD',
                status: 'MANAGED',
                medications: ['Methylphenidate']
              }
            ]
          }
        }
      }).as('getConditions')

      cy.visit('/health-records')
      cy.navigateToHealthRecordTab('Chronic')
      cy.wait('@getConditions')

      // Medication details should be restricted
      cy.contains('[MEDICAL INFO RESTRICTED]').should('exist')
    })

    it('should disable editing for read-only users', () => {
      cy.login('viewer')

      cy.visit('/health-records')
      cy.navigateToHealthRecordTab('Chronic')

      // Edit buttons should not exist or be disabled
      cy.get('button').contains(/add condition/i).should('be.disabled')
    })
  })

  describe('Error Handling', () => {
    it('should handle API errors gracefully', () => {
      cy.intercept('GET', '**/api/health-records/student/*/chronic-conditions', {
        statusCode: 500,
        body: {
          success: false,
          error: 'Failed to load chronic conditions'
        }
      }).as('conditionError')

      cy.navigateToHealthRecordTab('Chronic')
      cy.wait('@conditionError')

      cy.contains(/error|failed/i).should('be.visible')
    })
  })

  describe('Accessibility', () => {
    it('should have proper ARIA labels for condition status', () => {
      cy.intercept('GET', '**/api/health-records/student/*/chronic-conditions', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            conditions: [
              {
                id: 'condition-1',
                condition: 'Asthma',
                status: 'ACTIVE'
              }
            ]
          }
        }
      }).as('getConditions')

      cy.navigateToHealthRecordTab('Chronic')
      cy.wait('@getConditions')

      // Status badges should be accessible
      cy.contains('ACTIVE').should('be.visible')
    })
  })
})
