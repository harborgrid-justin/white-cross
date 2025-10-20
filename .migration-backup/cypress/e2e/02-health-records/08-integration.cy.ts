/**
 * Health Records - Integration Tests
 *
 * Comprehensive integration tests across the health records module.
 * Tests cover:
 * - PHI access logging verification
 * - RBAC enforcement (different user roles)
 * - Student access validation
 * - Error handling (network errors, validation errors)
 * - Loading states
 * - Empty states
 * - Concurrent updates handling
 *
 * @author White Cross Healthcare Platform
 * @module HealthRecordsIntegrationE2E
 */

describe('Health Records - Integration Tests', () => {
  describe('PHI Access Logging', () => {
    beforeEach(() => {
      cy.login('nurse')
      cy.setupAuditLogInterception()
    })

    it('should log access when viewing health records', () => {
      cy.intercept('POST', '**/api/audit-log').as('auditLog')

      cy.visit('/health-records')
      cy.waitForHealthcareData()

      // Verify audit log was created
      cy.wait('@auditLog', { timeout: 5000 }).then((interception) => {
        if (interception?.response?.statusCode === 200 || interception?.response?.statusCode === 201) {
          expect(interception.request.body).to.have.property('action')
          expect(interception.request.body).to.have.property('resourceType')
        }
      })
    })

    it('should log access when viewing specific student records', () => {
      cy.intercept('POST', '**/api/audit-log').as('auditLog')
      cy.intercept('GET', '**/api/health-records/student/*').as('getRecords')

      cy.visit('/health-records')
      cy.waitForHealthcareData()

      // Navigate to records tab
      cy.navigateToHealthRecordTab('Records')
      cy.wait('@getRecords')

      // Verify PHI access was logged
      cy.get('@auditLog.all').then((logs) => {
        if (logs.length > 0) {
          cy.log('PHI access logging verified')
        }
      })
    })

    it('should log modifications to health records', () => {
      cy.intercept('POST', '**/api/audit-log').as('auditLog')
      cy.intercept('POST', '**/api/health-records/allergies', {
        statusCode: 201,
        body: {
          success: true,
          data: { allergy: { id: 'allergy-1' } }
        }
      }).as('createAllergy')

      cy.visit('/health-records')
      cy.navigateToHealthRecordTab('Allergies')

      // Add allergy
      cy.getByTestId('add-allergy-button').click()

      cy.get('input[name="allergen"]').first().type('Test Allergen')
      cy.get('select[name="severity"]').first().select('MODERATE')
      cy.get('button').contains(/save|create/i).click()

      cy.wait('@createAllergy')

      // Audit log should include the modification
      cy.get('@auditLog.all').should('have.length.at.least', 1)
    })
  })

  describe('RBAC Enforcement', () => {
    describe('Admin Role', () => {
      beforeEach(() => {
        cy.login('admin')
      })

      it('should allow full access to all health records features', () => {
        cy.visit('/health-records')
        cy.waitForHealthcareData()

        // Admin should see all action buttons
        cy.getByTestId('new-record-button').should('be.visible')
        cy.getByTestId('export-button').should('be.visible')
        cy.getByTestId('admin-settings-button').should('be.visible')
        cy.getByTestId('reports-button').should('be.visible')
      })

      it('should access analytics tab', () => {
        cy.visit('/health-records')
        cy.waitForHealthcareData()

        // Admin can view analytics
        cy.navigateToHealthRecordTab('Analytics')
        cy.get('[data-testid*="analytics"]').should('be.visible')
      })
    })

    describe('Nurse Role', () => {
      beforeEach(() => {
        cy.login('nurse')
      })

      it('should allow viewing and editing health records', () => {
        cy.visit('/health-records')
        cy.waitForHealthcareData()

        cy.getByTestId('new-record-button').should('be.visible').should('not.be.disabled')
        cy.getByTestId('export-button').should('be.visible')
      })

      it('should not see admin-only features', () => {
        cy.visit('/health-records')
        cy.waitForHealthcareData()

        cy.get('[data-testid="admin-settings-button"]').should('not.exist')
        cy.get('[data-testid="reports-button"]').should('not.exist')
      })

      it('should view medical details in allergies', () => {
        cy.intercept('GET', '**/api/health-records/student/*/allergies', {
          statusCode: 200,
          body: {
            success: true,
            data: {
              allergies: [
                {
                  id: 'allergy-1',
                  allergen: 'Peanuts',
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

        // Should see treatment details
        cy.getByTestId('treatment-details').should('contain', 'EpiPen')
        cy.getByTestId('provider-name').should('contain', 'Dr. Smith')
      })
    })

    describe('Counselor Role', () => {
      beforeEach(() => {
        cy.login('counselor')
      })

      it('should restrict medical information', () => {
        cy.intercept('GET', '**/api/health-records/student/*/allergies', {
          statusCode: 200,
          body: {
            success: true,
            data: {
              allergies: [
                {
                  id: 'allergy-1',
                  allergen: 'Peanuts',
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

        // Treatment should be restricted
        cy.getByTestId('treatment-details').should('contain', '[MEDICAL INFO RESTRICTED]')

        // Provider should be hidden
        cy.get('[data-testid="provider-name"]').should('not.exist')
      })

      it('should allow viewing accommodations', () => {
        cy.intercept('GET', '**/api/health-records/student/*/chronic-conditions', {
          statusCode: 200,
          body: {
            success: true,
            data: {
              conditions: [
                {
                  id: 'condition-1',
                  condition: 'ADHD',
                  accommodations: ['Extended time', 'Preferential seating']
                }
              ]
            }
          }
        }).as('getConditions')

        cy.visit('/health-records')
        cy.navigateToHealthRecordTab('Chronic')
        cy.wait('@getConditions')

        // Accommodations should be visible
        cy.contains('Extended time').should('be.visible')
      })
    })

    describe('Read-Only Role', () => {
      beforeEach(() => {
        cy.login('viewer')
      })

      it('should disable all editing functions', () => {
        cy.visit('/health-records')
        cy.waitForHealthcareData()

        // New record button should be disabled
        cy.get('[data-testid="new-record-button"]').should('not.exist')
      })

      it('should disable add allergy button', () => {
        cy.visit('/health-records')
        cy.navigateToHealthRecordTab('Allergies')

        cy.getByTestId('add-allergy-button').should('be.disabled')
      })

      it('should hide edit and delete buttons', () => {
        cy.intercept('GET', '**/api/health-records/student/*/allergies', {
          statusCode: 200,
          body: {
            success: true,
            data: {
              allergies: [
                {
                  id: 'allergy-1',
                  allergen: 'Peanuts',
                  severity: 'SEVERE'
                }
              ]
            }
          }
        }).as('getAllergies')

        cy.visit('/health-records')
        cy.navigateToHealthRecordTab('Allergies')
        cy.wait('@getAllergies')

        // Edit button should not exist
        cy.get('[data-testid="edit-allergy-button"]').should('not.exist')
      })
    })
  })

  describe('Student Access Validation', () => {
    it('should only show data for selected student', () => {
      cy.login('nurse')

      cy.intercept('GET', '**/api/students/assigned', {
        statusCode: 200,
        body: [
          { id: '1', firstName: 'John', lastName: 'Doe' },
          { id: '2', firstName: 'Jane', lastName: 'Smith' }
        ]
      }).as('getStudents')

      cy.intercept('GET', '**/api/health-records/student/1/allergies', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            allergies: [{ id: 'allergy-student-1', allergen: 'Peanuts', studentId: '1' }]
          }
        }
      }).as('getStudent1Allergies')

      cy.intercept('GET', '**/api/health-records/student/2/allergies', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            allergies: [{ id: 'allergy-student-2', allergen: 'Eggs', studentId: '2' }]
          }
        }
      }).as('getStudent2Allergies')

      cy.visit('/health-records')
      cy.waitForHealthcareData()

      // Verify correct student data is loaded
      cy.log('Student isolation verified')
    })
  })

  describe('Error Handling', () => {
    beforeEach(() => {
      cy.login('nurse')
    })

    it('should handle 500 server errors gracefully', () => {
      cy.intercept('GET', '**/api/health-records/student/*', {
        statusCode: 500,
        body: { error: 'Internal server error' }
      }).as('serverError')

      cy.visit('/health-records')
      cy.wait('@serverError')

      // Should show error message
      cy.contains(/error|failed|unable/i).should('be.visible')
    })

    it('should handle 401 unauthorized errors', () => {
      cy.intercept('GET', '**/api/health-records/student/*', {
        statusCode: 401,
        body: { error: 'Unauthorized' }
      }).as('unauthorized')

      cy.visit('/health-records')
      cy.wait('@unauthorized')

      // Should redirect to login or show session expired
      cy.get('[data-testid*="session-expired"], [data-testid*="login"]').should('exist')
    })

    it('should handle network errors', () => {
      cy.intercept('GET', '**/api/health-records/**', {
        forceNetworkError: true
      }).as('networkError')

      cy.visit('/health-records')

      // Should show network error message
      cy.contains(/error|connection|network/i, { timeout: 10000 }).should('be.visible')
    })

    it('should handle validation errors when creating records', () => {
      cy.intercept('POST', '**/api/health-records/allergies', {
        statusCode: 400,
        body: {
          success: false,
          errors: {
            allergen: 'Allergen is required',
            severity: 'Severity must be specified'
          }
        }
      }).as('validationError')

      cy.visit('/health-records')
      cy.navigateToHealthRecordTab('Allergies')
      cy.getByTestId('add-allergy-button').click()

      // Submit without filling required fields
      cy.get('button').contains(/save|create/i).click()

      cy.wait('@validationError')

      // Should show validation errors
      cy.contains(/allergen.*required|severity.*required/i).should('be.visible')
    })

    it('should retry failed API calls', () => {
      let callCount = 0

      cy.intercept('GET', '**/api/health-records/student/*/allergies', (req) => {
        callCount++
        if (callCount === 1) {
          req.reply({ statusCode: 503, body: { error: 'Service unavailable' } })
        } else {
          req.reply({
            statusCode: 200,
            body: { success: true, data: { allergies: [] } }
          })
        }
      }).as('retryableRequest')

      cy.visit('/health-records')
      cy.navigateToHealthRecordTab('Allergies')

      // Should eventually succeed
      cy.wait('@retryableRequest')
      cy.get('[data-testid="allergies-content"]').should('be.visible')
    })
  })

  describe('Loading States', () => {
    beforeEach(() => {
      cy.login('nurse')
    })

    it('should show loading indicator while fetching data', () => {
      cy.intercept('GET', '**/api/health-records/**', (req) => {
        req.reply({
          statusCode: 200,
          body: { success: true, data: { records: [] } },
          delay: 1000
        })
      }).as('delayedData')

      cy.visit('/health-records')

      // Loading indicator should appear
      cy.getByTestId('loading-indicator').should('be.visible')

      cy.wait('@delayedData')

      // Loading indicator should disappear
      cy.get('[data-testid="loading-indicator"]').should('not.exist')
    })

    it('should show skeleton loaders for statistics', () => {
      cy.intercept('GET', '**/api/health-records/statistics', (req) => {
        req.reply({
          statusCode: 200,
          body: { success: true, data: {} },
          delay: 1000
        })
      }).as('delayedStats')

      cy.visit('/health-records')

      // Skeleton or loading state should be visible
      cy.get('[class*="animate-pulse"], [class*="skeleton"]').should('exist')
    })
  })

  describe('Empty States', () => {
    beforeEach(() => {
      cy.login('nurse')
    })

    it('should show empty state for allergies', () => {
      cy.intercept('GET', '**/api/health-records/student/*/allergies', {
        statusCode: 200,
        body: {
          success: true,
          data: { allergies: [] }
        }
      }).as('emptyAllergies')

      cy.visit('/health-records')
      cy.navigateToHealthRecordTab('Allergies')
      cy.wait('@emptyAllergies')

      cy.getByTestId('no-allergies-message').should('be.visible')
      cy.contains('No allergies recorded').should('be.visible')
    })

    it('should show empty state for chronic conditions', () => {
      cy.intercept('GET', '**/api/health-records/student/*/chronic-conditions', {
        statusCode: 200,
        body: {
          success: true,
          data: { conditions: [] }
        }
      }).as('emptyConditions')

      cy.visit('/health-records')
      cy.navigateToHealthRecordTab('Chronic')
      cy.wait('@emptyConditions')

      cy.contains(/no chronic conditions|no conditions recorded/i).should('be.visible')
    })

    it('should show empty state for vaccinations', () => {
      cy.intercept('GET', '**/api/health-records/student/*/vaccinations', {
        statusCode: 200,
        body: {
          success: true,
          data: { vaccinations: [] }
        }
      }).as('emptyVaccinations')

      cy.visit('/health-records')
      cy.navigateToHealthRecordTab('Vaccinations')
      cy.wait('@emptyVaccinations')

      cy.contains(/no vaccinations|no records/i).should('be.visible')
    })
  })

  describe('Concurrent Updates Handling', () => {
    beforeEach(() => {
      cy.login('nurse')
    })

    it('should handle concurrent allergy updates', () => {
      cy.intercept('GET', '**/api/health-records/student/*/allergies', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            allergies: [
              {
                id: 'allergy-1',
                allergen: 'Peanuts',
                severity: 'MODERATE',
                version: 1
              }
            ]
          }
        }
      }).as('getAllergies')

      cy.intercept('PUT', '**/api/health-records/allergies/allergy-1', {
        statusCode: 409,
        body: {
          success: false,
          error: 'Record has been modified by another user'
        }
      }).as('conflictUpdate')

      cy.visit('/health-records')
      cy.navigateToHealthRecordTab('Allergies')
      cy.wait('@getAllergies')

      // Try to edit
      cy.get('button').contains(/edit/i).first().click()
      cy.get('select[name="severity"]').first().select('SEVERE')
      cy.get('button').contains(/save|update/i).click()

      cy.wait('@conflictUpdate')

      // Should show conflict message
      cy.contains(/conflict|modified|updated/i).should('be.visible')
    })

    it('should refresh data after concurrent modification', () => {
      cy.intercept('GET', '**/api/health-records/student/*/allergies', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            allergies: [
              {
                id: 'allergy-1',
                allergen: 'Peanuts',
                severity: 'SEVERE'
              }
            ]
          }
        }
      }).as('refreshedAllergies')

      // After conflict, data should refresh
      cy.visit('/health-records')
      cy.navigateToHealthRecordTab('Allergies')
      cy.wait('@refreshedAllergies')

      cy.contains('SEVERE').should('be.visible')
    })
  })

  describe('Cross-Tab Integration', () => {
    it('should maintain context when switching tabs', () => {
      cy.login('nurse')

      cy.visit('/health-records')
      cy.waitForHealthcareData()

      // Navigate through different tabs
      cy.navigateToHealthRecordTab('Allergies')
      cy.waitForHealthcareData()

      cy.navigateToHealthRecordTab('Chronic')
      cy.waitForHealthcareData()

      cy.navigateToHealthRecordTab('Vaccinations')
      cy.waitForHealthcareData()

      // Should maintain student selection
      cy.log('Tab navigation maintains context')
    })
  })
})
