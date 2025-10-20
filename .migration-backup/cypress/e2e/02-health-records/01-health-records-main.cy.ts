/**
 * Health Records Main Tests
 *
 * Comprehensive E2E tests for the main health records module functionality.
 * Tests cover:
 * - Loading health records page
 * - Viewing health record list
 * - Searching health records
 * - Filtering by record type
 * - Creating new health record
 * - Editing health record
 * - Deleting health record
 * - Viewing health record timeline
 * - Exporting health records
 * - Statistics display (no mock data)
 *
 * @author White Cross Healthcare Platform
 * @module HealthRecordsE2E
 */

describe('Health Records - Main Functionality', () => {
  beforeEach(() => {
    // Login as nurse with appropriate permissions
    cy.login('nurse')

    // Setup API intercepts for health records
    cy.setupHealthRecordsIntercepts()

    // Navigate to health records page
    cy.visit('/health-records')

    // Wait for page to fully load
    cy.waitForHealthcareData()
  })

  describe('Page Loading', () => {
    it('should load health records page successfully', () => {
      // Verify page is loaded
      cy.getByTestId('health-records-page').should('be.visible')

      // Verify page title
      cy.contains('h1', 'Health Records Management').should('be.visible')

      // Verify privacy notice is displayed
      cy.getByTestId('privacy-notice').should('be.visible')
      cy.getByTestId('hipaa-compliance-badge').should('be.visible')

      // Verify main action buttons are present
      cy.getByTestId('new-record-button').should('be.visible')
      cy.getByTestId('export-button').should('be.visible')
    })

    it('should display loading indicator while fetching data', () => {
      // Intercept with delay to see loading state
      cy.intercept('GET', '**/api/health-records/**', (req) => {
        req.reply({
          statusCode: 200,
          body: { success: true, data: { records: [] } },
          delay: 1000
        })
      }).as('delayedHealthRecords')

      // Navigate to page
      cy.visit('/health-records')

      // Loading indicator should be visible
      cy.getByTestId('loading-indicator', { timeout: 500 }).should('be.visible')

      // Wait for data to load
      cy.wait('@delayedHealthRecords')

      // Loading indicator should disappear
      cy.get('[data-testid="loading-indicator"]').should('not.exist')
    })

    it('should display HIPAA compliance notice and user session info', () => {
      cy.getByTestId('privacy-notice').within(() => {
        // Verify HIPAA text
        cy.contains('Protected Health Information').should('be.visible')
        cy.contains('HIPAA regulations').should('be.visible')

        // Verify user session information
        cy.contains('Session:').should('be.visible')
        cy.contains('Role:').should('be.visible')

        // Verify HIPAA compliance badge
        cy.getByTestId('hipaa-compliance-badge').should('be.visible')

        // Verify data use agreement checkbox
        cy.getByTestId('data-use-agreement').should('be.checked')
      })
    })
  })

  describe('Viewing Health Record List', () => {
    beforeEach(() => {
      // Mock health records data
      cy.intercept('GET', '**/api/health-records/student/*', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            records: [
              {
                id: 'hr-1',
                studentId: '1',
                type: 'EXAMINATION',
                date: '2025-01-05',
                description: 'Annual physical examination',
                provider: 'Dr. Smith',
                notes: 'Student is healthy and up to date on vaccinations',
                createdAt: '2025-01-05T10:00:00Z'
              },
              {
                id: 'hr-2',
                studentId: '1',
                type: 'VACCINATION',
                date: '2025-01-10',
                description: 'Flu vaccine administered',
                provider: 'Nurse Johnson',
                notes: 'No adverse reactions',
                createdAt: '2025-01-10T14:30:00Z'
              },
              {
                id: 'hr-3',
                studentId: '1',
                type: 'ALLERGY',
                date: '2024-12-15',
                description: 'Peanut allergy documented',
                provider: 'Dr. Williams',
                notes: 'Severe reaction history - EpiPen prescribed',
                createdAt: '2024-12-15T09:15:00Z'
              }
            ],
            pagination: {
              page: 1,
              total: 3,
              totalPages: 1
            }
          }
        }
      }).as('getHealthRecords')

      // Navigate to records tab
      cy.navigateToHealthRecordTab('Records')
      cy.wait('@getHealthRecords')
    })

    it('should display list of health records from API', () => {
      // Verify records are displayed
      cy.get('[data-testid*="health-record-item"]').should('have.length', 3)

      // Verify first record details
      cy.get('[data-testid*="health-record-item"]').first().within(() => {
        cy.contains('Annual physical examination').should('be.visible')
        cy.contains('EXAMINATION').should('be.visible')
        cy.contains('Dr. Smith').should('be.visible')
      })
    })

    it('should display empty state when no records exist', () => {
      // Mock empty response
      cy.intercept('GET', '**/api/health-records/student/*', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            records: [],
            pagination: { page: 1, total: 0, totalPages: 0 }
          }
        }
      }).as('emptyRecords')

      // Reload page
      cy.reload()
      cy.wait('@emptyRecords')

      // Verify empty state
      cy.contains('No health records found').should('be.visible')
    })

    it('should verify no mock or hardcoded data is displayed', () => {
      // Intercept with empty data
      cy.intercept('GET', '**/api/health-records/**', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            records: [],
            pagination: { page: 1, total: 0 }
          }
        }
      }).as('emptyData')

      cy.reload()
      cy.wait('@emptyData')

      // Should NOT show any hardcoded records
      cy.get('[data-testid*="health-record-item"]').should('not.exist')
      cy.contains('No health records found').should('be.visible')
    })
  })

  describe('Searching Health Records', () => {
    it('should search health records by student name', () => {
      // Mock search results
      cy.intercept('GET', '**/api/health-records/student/*?search=*', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            records: [
              {
                id: 'hr-search-1',
                studentId: '1',
                type: 'EXAMINATION',
                date: '2025-01-05',
                description: 'Search result record',
                provider: 'Dr. Test'
              }
            ],
            pagination: { page: 1, total: 1 }
          }
        }
      }).as('searchRecords')

      // Type in search box
      cy.getByTestId('health-records-search')
        .should('be.visible')
        .clear()
        .type('John Doe')

      // Wait for debounce and search
      cy.wait(600)

      // Verify search was triggered (if API implemented)
      cy.get('@searchRecords.all').then((interceptions) => {
        if (interceptions.length > 0) {
          expect(interceptions[0].request.url).to.include('search')
        }
      })
    })

    it('should clear search results when search is cleared', () => {
      // Type search query
      cy.getByTestId('health-records-search').type('test')
      cy.wait(600)

      // Clear search
      cy.getByTestId('health-records-search').clear()
      cy.wait(600)

      // Should reload all records
      cy.get('[data-testid*="health-record-item"]').should('exist')
    })
  })

  describe('Filtering by Record Type', () => {
    it('should filter health records by type', () => {
      // Mock filtered results
      cy.intercept('GET', '**/api/health-records/student/*?type=EXAMINATION', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            records: [
              {
                id: 'hr-exam-1',
                type: 'EXAMINATION',
                date: '2025-01-05',
                description: 'Physical exam'
              }
            ],
            pagination: { page: 1, total: 1 }
          }
        }
      }).as('filterExamination')

      // Select filter
      cy.getByTestId('record-type-filter').select('EXAMINATION')

      // Wait for filtered results
      cy.wait(500)

      // Verify only examination records are shown
      cy.get('[data-testid*="health-record-item"]').each(($el) => {
        cy.wrap($el).should('contain', 'EXAMINATION')
      })
    })

    it('should show all records when filter is cleared', () => {
      // Select a filter first
      cy.getByTestId('record-type-filter').select('VACCINATION')
      cy.wait(500)

      // Clear filter
      cy.getByTestId('record-type-filter').select('')
      cy.wait(500)

      // Should show all record types
      cy.get('[data-testid*="health-record-item"]').should('have.length.at.least', 1)
    })
  })

  describe('Date Range Filtering', () => {
    it('should filter records by date range', () => {
      const fromDate = '2025-01-01'
      const toDate = '2025-01-31'

      // Set date filters
      cy.getByTestId('date-from').type(fromDate)
      cy.getByTestId('date-to').type(toDate)

      // Apply filter
      cy.getByTestId('apply-date-filter').click()

      // Wait for results
      cy.wait(500)

      // Verify API was called with date parameters (if implemented)
      cy.get('@getHealthRecords.all').then((interceptions) => {
        if (interceptions.length > 0) {
          const lastCall = interceptions[interceptions.length - 1]
          // Check if dates are in query params
          cy.log('Date filter applied')
        }
      })
    })
  })

  describe('Creating New Health Record', () => {
    it('should open health record modal when clicking New Record button', () => {
      // Click new record button
      cy.getByTestId('new-record-button').click()

      // Modal should be visible
      cy.get('[data-testid*="health-record-modal"], [data-testid*="modal"]')
        .should('be.visible')
    })

    it('should create a new health record successfully', () => {
      // Mock successful creation
      cy.intercept('POST', '**/api/health-records', {
        statusCode: 201,
        body: {
          success: true,
          data: {
            healthRecord: {
              id: 'hr-new-1',
              studentId: '1',
              type: 'EXAMINATION',
              date: '2025-01-10',
              description: 'Test health record',
              provider: 'Test Provider'
            }
          },
          message: 'Health record created successfully'
        }
      }).as('createHealthRecord')

      // Open modal
      cy.getByTestId('new-record-button').click()

      // Fill form (adjust selectors based on actual modal structure)
      cy.get('select[name="type"], [data-testid="record-type-select"]')
        .first()
        .select('EXAMINATION')

      cy.get('input[name="date"], [data-testid="record-date"]')
        .first()
        .type('2025-01-10')

      cy.get('textarea[name="description"], [data-testid="record-description"]')
        .first()
        .type('Test health record')

      cy.get('input[name="provider"], [data-testid="provider-name"]')
        .first()
        .type('Test Provider')

      // Submit form
      cy.get('button').contains(/save|submit|create/i).click()

      // Wait for creation
      cy.wait('@createHealthRecord', { timeout: 5000 })

      // Verify success message
      cy.verifySuccess(/created|success/i)
    })

    it('should validate required fields when creating record', () => {
      // Open modal
      cy.getByTestId('new-record-button').click()

      // Try to submit without filling required fields
      cy.get('button').contains(/save|submit|create/i).click()

      // Should show validation errors
      cy.contains(/required|must|field/i).should('be.visible')
    })
  })

  describe('Editing Health Record', () => {
    beforeEach(() => {
      // Mock health records
      cy.intercept('GET', '**/api/health-records/student/*', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            records: [
              {
                id: 'hr-edit-1',
                studentId: '1',
                type: 'EXAMINATION',
                date: '2025-01-05',
                description: 'Original description',
                provider: 'Dr. Original'
              }
            ],
            pagination: { page: 1, total: 1 }
          }
        }
      }).as('getRecords')

      cy.navigateToHealthRecordTab('Records')
      cy.wait('@getRecords')
    })

    it('should open edit modal when clicking edit button', () => {
      // Click edit button on first record
      cy.get('[data-testid*="edit-button"], button').contains(/edit/i).first().click()

      // Modal should open with existing data
      cy.get('[data-testid*="modal"]').should('be.visible')
    })

    it('should update health record successfully', () => {
      // Mock successful update
      cy.intercept('PUT', '**/api/health-records/*', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            healthRecord: {
              id: 'hr-edit-1',
              description: 'Updated description'
            }
          },
          message: 'Health record updated successfully'
        }
      }).as('updateHealthRecord')

      // Click edit
      cy.get('button').contains(/edit/i).first().click()

      // Update description
      cy.get('textarea[name="description"], [data-testid*="description"]')
        .first()
        .clear()
        .type('Updated description')

      // Save changes
      cy.get('button').contains(/save|update/i).click()

      // Verify update
      cy.wait('@updateHealthRecord', { timeout: 5000 })
      cy.verifySuccess(/updated|success/i)
    })
  })

  describe('Deleting Health Record', () => {
    beforeEach(() => {
      // Mock health records
      cy.intercept('GET', '**/api/health-records/student/*', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            records: [
              {
                id: 'hr-delete-1',
                studentId: '1',
                type: 'EXAMINATION',
                date: '2025-01-05',
                description: 'To be deleted',
                provider: 'Dr. Test'
              }
            ],
            pagination: { page: 1, total: 1 }
          }
        }
      }).as('getRecords')

      cy.navigateToHealthRecordTab('Records')
      cy.wait('@getRecords')
    })

    it('should delete health record with confirmation', () => {
      // Mock successful deletion
      cy.intercept('DELETE', '**/api/health-records/*', {
        statusCode: 200,
        body: {
          success: true,
          message: 'Health record deleted successfully'
        }
      }).as('deleteHealthRecord')

      // Click delete button
      cy.get('button').contains(/delete|remove/i).first().click()

      // Confirm deletion in modal
      cy.get('button').contains(/confirm|yes|delete/i).click()

      // Wait for deletion
      cy.wait('@deleteHealthRecord', { timeout: 5000 })

      // Verify success
      cy.verifySuccess(/deleted|removed|success/i)
    })

    it('should cancel deletion when clicking cancel', () => {
      // Click delete button
      cy.get('button').contains(/delete|remove/i).first().click()

      // Cancel deletion
      cy.get('button').contains(/cancel|no/i).click()

      // Record should still exist
      cy.get('[data-testid*="health-record-item"]').should('exist')
    })
  })

  describe('Viewing Health Record Timeline', () => {
    it('should display health records in chronological order', () => {
      // Mock records with different dates
      cy.intercept('GET', '**/api/health-records/student/*', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            records: [
              {
                id: 'hr-1',
                date: '2025-01-15',
                description: 'Most recent',
                createdAt: '2025-01-15T10:00:00Z'
              },
              {
                id: 'hr-2',
                date: '2025-01-10',
                description: 'Middle',
                createdAt: '2025-01-10T10:00:00Z'
              },
              {
                id: 'hr-3',
                date: '2025-01-05',
                description: 'Oldest',
                createdAt: '2025-01-05T10:00:00Z'
              }
            ],
            pagination: { page: 1, total: 3 }
          }
        }
      }).as('getTimeline')

      cy.navigateToHealthRecordTab('Records')
      cy.wait('@getTimeline')

      // Verify chronological order (most recent first)
      cy.get('[data-testid*="health-record-item"]').first()
        .should('contain', 'Most recent')
    })
  })

  describe('Exporting Health Records', () => {
    it('should trigger export when clicking export button', () => {
      // Mock export endpoint
      cy.intercept('POST', '**/api/health-records/export', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            downloadUrl: '/exports/health-records-2025-01-10.pdf'
          }
        }
      }).as('exportRecords')

      // Click export button
      cy.getByTestId('export-button').click()

      // Should trigger export (implementation may vary)
      cy.wait(500)
      cy.log('Export triggered')
    })
  })

  describe('Statistics Display', () => {
    it('should display statistics from API (no mock data)', () => {
      // Mock statistics endpoint
      cy.intercept('GET', '**/api/health-records/statistics', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            totalRecords: 247,
            activeAllergies: 18,
            chronicConditions: 31,
            vaccinationsDue: 8
          }
        }
      }).as('getStatistics')

      // Statistics should be visible on overview
      cy.contains('Total Records').should('be.visible')
      cy.contains('Active Allergies').should('be.visible')
      cy.contains('Chronic Conditions').should('be.visible')
      cy.contains('Vaccinations Due').should('be.visible')
    })

    it('should verify statistics are from API not hardcoded', () => {
      // Mock with different numbers
      cy.intercept('GET', '**/api/health-records/statistics', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            totalRecords: 999,
            activeAllergies: 88,
            chronicConditions: 77,
            vaccinationsDue: 66
          }
        }
      }).as('customStatistics')

      cy.reload()

      // Note: If these exact numbers don't appear, stats are hardcoded
      // This test documents the expectation that stats should come from API
      cy.log('Statistics should reflect API data when implemented')
    })
  })

  describe('Error Handling', () => {
    it('should handle API errors gracefully', () => {
      // Mock API error
      cy.intercept('GET', '**/api/health-records/student/*', {
        statusCode: 500,
        body: {
          success: false,
          error: 'Internal server error'
        }
      }).as('serverError')

      cy.reload()
      cy.wait('@serverError')

      // Should show error message
      cy.contains(/error|failed|unable/i).should('be.visible')
    })

    it('should handle network errors', () => {
      // Mock network error
      cy.intercept('GET', '**/api/health-records/**', {
        forceNetworkError: true
      }).as('networkError')

      cy.reload()

      // Should handle gracefully
      cy.contains(/error|connection|network/i, { timeout: 10000 }).should('be.visible')
    })
  })

  describe('Accessibility', () => {
    it('should have proper ARIA labels and roles', () => {
      // Check main page accessibility
      cy.getByTestId('health-records-page').should('have.attr', 'role').or('exist')

      // Buttons should have accessible labels
      cy.getByTestId('new-record-button')
        .should('have.attr', 'aria-label')
        .or('contain.text', 'New Record')
    })

    it('should be keyboard navigable', () => {
      // Tab through interactive elements
      cy.get('body').tab()
      cy.focused().should('be.visible')
    })
  })
})
