/// <reference types="cypress" />

describe('Health Records - Integration and API Testing (Tests 141-150)', () => {
  beforeEach(() => {
    cy.clearCookies()
    cy.clearLocalStorage()
    cy.loginAsNurse()
    cy.visit('/health-records')
  })

  describe('External System Integration (Tests 141-145)', () => {
    it('Test 141: Should integrate with Student Information System (SIS)', () => {
      cy.intercept('GET', '**/api/integrations/sis/students', { fixture: 'sisStudents.json' }).as('getSISStudents')
      cy.intercept('POST', '**/api/integrations/sis/sync', { 
        statusCode: 200,
        body: { success: true, syncedCount: 15, errors: [] }
      }).as('syncSIS')
      
      cy.get('[data-testid="integration-settings-button"]').click()
      cy.get('[data-testid="integration-modal"]').should('be.visible')
      cy.get('[data-testid="sis-integration-tab"]').click()
      
      cy.get('[data-testid="sis-status"]').should('contain', 'Connected')
      cy.get('[data-testid="last-sync-time"]').should('be.visible')
      cy.get('[data-testid="sync-now-button"]').should('be.visible')
      
      // Test manual sync
      cy.get('[data-testid="sync-now-button"]').click()
      cy.wait('@syncSIS')
      
      cy.get('[data-testid="sync-success-message"]').should('contain', '15 student records synchronized')
      cy.get('[data-testid="sync-progress"]').should('not.exist')
    })

    it('Test 142: Should integrate with Electronic Health Records (EHR) system', () => {
      cy.intercept('GET', '**/api/integrations/ehr/providers', { fixture: 'ehrProviders.json' }).as('getEHRProviders')
      cy.intercept('POST', '**/api/integrations/ehr/import-records', {
        statusCode: 200,
        body: { 
          success: true, 
          importedRecords: 8,
          skippedRecords: 2,
          errors: [
            { recordId: 'EHR-001', error: 'Invalid date format' }
          ]
        }
      }).as('importEHRRecords')
      
      cy.get('[data-testid="import-button"]').click()
      cy.get('[data-testid="import-modal"]').should('be.visible')
      cy.get('[data-testid="ehr-import-tab"]').click()
      
      cy.get('[data-testid="ehr-provider-select"]').select('Children\'s Hospital')
      cy.get('[data-testid="date-range-start"]').type('2024-01-01')
      cy.get('[data-testid="date-range-end"]').type('2024-01-31')
      cy.get('[data-testid="record-types"]').within(() => {
        cy.get('[data-testid="physical-exams"]').check()
        cy.get('[data-testid="vaccinations"]').check()
      })
      
      cy.get('[data-testid="start-import-button"]').click()
      cy.wait('@importEHRRecords')
      
      cy.get('[data-testid="import-results"]').should('be.visible')
      cy.get('[data-testid="imported-count"]').should('contain', '8 records imported')
      cy.get('[data-testid="skipped-count"]').should('contain', '2 records skipped')
      cy.get('[data-testid="error-details"]').should('contain', 'Invalid date format')
    })

    it('Test 143: Should integrate with pharmacy management system', () => {
      cy.intercept('GET', '**/api/integrations/pharmacy/medications', { fixture: 'pharmacyMedications.json' }).as('getPharmacyMeds')
      cy.intercept('POST', '**/api/integrations/pharmacy/verify-prescription', {
        statusCode: 200,
        body: {
          success: true,
          verified: true,
          prescriptionDetails: {
            rxNumber: 'RX123456',
            prescriber: 'Dr. Johnson',
            pharmacy: 'School District Pharmacy',
            fillDate: '2024-01-15'
          }
        }
      }).as('verifyPrescription')
      
      cy.get('[data-testid="tab-medications"]').click()
      cy.get('[data-testid="add-medication-button"]').click()
      cy.get('[data-testid="medication-modal"]').should('be.visible')
      
      cy.get('[data-testid="verify-prescription-tab"]').click()
      cy.get('[data-testid="rx-number-input"]').type('RX123456')
      cy.get('[data-testid="verify-button"]').click()
      
      cy.wait('@verifyPrescription')
      
      cy.get('[data-testid="prescription-verified"]').should('be.visible')
      cy.get('[data-testid="prescriber-name"]').should('contain', 'Dr. Johnson')
      cy.get('[data-testid="pharmacy-name"]').should('contain', 'School District Pharmacy')
      cy.get('[data-testid="auto-fill-button"]').should('be.visible')
      
      // Test auto-fill functionality
      cy.get('[data-testid="auto-fill-button"]').click()
      cy.get('[data-testid="medication-name-input"]').should('not.be.empty')
      cy.get('[data-testid="dosage-input"]').should('not.be.empty')
    })

    it('Test 144: Should integrate with laboratory information system (LIS)', () => {
      cy.intercept('GET', '**/api/integrations/lis/labs/pending', { fixture: 'pendingLabs.json' }).as('getPendingLabs')
      cy.intercept('POST', '**/api/integrations/lis/import-results', {
        statusCode: 200,
        body: {
          success: true,
          importedResults: 12,
          criticalValues: 1
        }
      }).as('importLabResults')
      
      cy.get('[data-testid="tab-lab-results"]').click()
      cy.get('[data-testid="pending-results-banner"]').should('be.visible')
      cy.get('[data-testid="pending-count"]').should('contain', 'pending lab results')
      
      cy.get('[data-testid="import-pending-button"]').click()
      cy.wait('@importLabResults')
      
      cy.get('[data-testid="import-success-message"]').should('contain', '12 lab results imported')
      cy.get('[data-testid="critical-values-alert"]').should('be.visible')
      cy.get('[data-testid="critical-values-alert"]').should('contain', '1 critical value requires attention')
      
      // Verify critical value notification
      cy.get('[data-testid="critical-value-notification"]').should('be.visible')
      cy.get('[data-testid="view-critical-button"]').click()
      cy.get('[data-testid="critical-value-modal"]').should('be.visible')
    })

    it('Test 145: Should handle integration failures gracefully', () => {
      cy.intercept('GET', '**/api/integrations/sis/students', {
        statusCode: 503,
        body: { error: 'Service unavailable' }
      }).as('getSISError')
      
      cy.get('[data-testid="integration-settings-button"]').click()
      cy.get('[data-testid="integration-modal"]').should('be.visible')
      cy.get('[data-testid="sis-integration-tab"]').click()
      
      cy.wait('@getSISError')
      
      cy.get('[data-testid="integration-error"]').should('be.visible')
      cy.get('[data-testid="error-message"]').should('contain', 'Unable to connect to Student Information System')
      cy.get('[data-testid="retry-connection-button"]').should('be.visible')
      cy.get('[data-testid="offline-mode-button"]').should('be.visible')
      
      // Test offline mode
      cy.get('[data-testid="offline-mode-button"]').click()
      cy.get('[data-testid="offline-mode-notice"]').should('be.visible')
      cy.get('[data-testid="offline-mode-notice"]').should('contain', 'Integration temporarily disabled')
    })
  })

  describe('API Response Handling (Tests 146-150)', () => {
    it('Test 146: Should handle paginated API responses correctly', () => {
      cy.intercept('GET', '**/api/health-records**', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            records: Array.from({ length: 10 }, (_, i) => ({
              id: `record-${i + 1}`,
              type: 'Physical Exam',
              date: '2024-01-15',
              provider: 'Dr. Smith'
            })),
            pagination: {
              page: 1,
              limit: 10,
              total: 75,
              pages: 8,
              hasNext: true,
              hasPrevious: false
            }
          }
        }
      }).as('getHealthRecordsPage1')
      
      cy.reload()
      cy.get('[data-testid="tab-records"]').click()
      cy.wait('@getHealthRecordsPage1')
      
      cy.get('[data-testid="health-record-item"]').should('have.length', 10)
      cy.get('[data-testid="pagination-info"]').should('contain', 'Showing 1-10 of 75 records')
      cy.get('[data-testid="next-page-button"]').should('be.enabled')
      cy.get('[data-testid="previous-page-button"]').should('be.disabled')
      
      // Test next page
      cy.intercept('GET', '**/api/health-records**page=2**', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            records: Array.from({ length: 10 }, (_, i) => ({
              id: `record-${i + 11}`,
              type: 'Vaccination',
              date: '2024-01-20',
              provider: 'Dr. Johnson'
            })),
            pagination: {
              page: 2,
              limit: 10,
              total: 75,
              pages: 8,
              hasNext: true,
              hasPrevious: true
            }
          }
        }
      }).as('getHealthRecordsPage2')
      
      cy.get('[data-testid="next-page-button"]').click()
      cy.wait('@getHealthRecordsPage2')
      
      cy.get('[data-testid="pagination-info"]').should('contain', 'Showing 11-20 of 75 records')
      cy.get('[data-testid="previous-page-button"]').should('be.enabled')
    })

    it('Test 147: Should handle API response caching appropriately', () => {
      const healthRecordsResponse = { fixture: 'healthRecords.json' }
      cy.intercept('GET', '**/api/health-records/**', healthRecordsResponse).as('getHealthRecords')
      
      cy.get('[data-testid="tab-records"]').click()
      cy.wait('@getHealthRecords')
      
      // Navigate away and back
      cy.get('[data-testid="tab-allergies"]').click()
      cy.get('[data-testid="tab-records"]').click()
      
      // Should use cached data (no new API call)
      cy.get('@getHealthRecords.all').should('have.length', 1)
      cy.get('[data-testid="health-record-item"]').should('be.visible')
      
      // Force refresh should make new API call
      cy.get('[data-testid="refresh-button"]').click()
      cy.wait('@getHealthRecords')
      cy.get('@getHealthRecords.all').should('have.length', 2)
    })

    it('Test 148: Should handle real-time updates via WebSocket', () => {
      cy.window().then((win) => {
        // Mock WebSocket connection
        const mockWebSocket = {
          send: cy.stub(),
          close: cy.stub(),
          addEventListener: cy.stub(),
          readyState: 1 // OPEN
        }
        
        cy.stub(win, 'WebSocket').returns(mockWebSocket)
        
        // Simulate real-time update
        setTimeout(() => {
          const updateEvent = new CustomEvent('message', {
            detail: {
              data: JSON.stringify({
                type: 'HEALTH_RECORD_UPDATED',
                payload: {
                  recordId: 'record-123',
                  studentId: 'student-456',
                  changes: { status: 'REVIEWED' }
                }
              })
            }
          })
          win.dispatchEvent(updateEvent)
        }, 1000)
      })
      
      cy.get('[data-testid="tab-records"]').click()
      
      // Should show real-time update notification
      cy.get('[data-testid="realtime-update-notification"]', { timeout: 5000 }).should('be.visible')
      cy.get('[data-testid="update-message"]').should('contain', 'Health record has been updated')
      cy.get('[data-testid="refresh-data-button"]').should('be.visible')
      
      cy.get('[data-testid="refresh-data-button"]').click()
      cy.get('[data-testid="realtime-update-notification"]').should('not.exist')
    })

    it('Test 149: Should handle API versioning correctly', () => {
      // Test with older API version
      cy.intercept('GET', '**/api/v1/health-records/**', {
        statusCode: 200,
        body: {
          success: true,
          data: [{
            id: '1',
            type: 'Physical Exam',
            date: '2024-01-15',
            // Old format without some new fields
          }]
        }
      }).as('getHealthRecordsV1')
      
      // Test with newer API version
      cy.intercept('GET', '**/api/v2/health-records/**', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            records: [{
              id: '1',
              type: 'Physical Exam',
              date: '2024-01-15',
              provider: { name: 'Dr. Smith', license: 'ABC123' },
              metadata: { version: 2, lastModified: '2024-01-15T10:00:00Z' }
            }],
            pagination: { page: 1, total: 1 }
          }
        }
      }).as('getHealthRecordsV2')
      
      // Application should handle both versions gracefully
      cy.visit('/health-records?api_version=v1')
      cy.get('[data-testid="tab-records"]').click()
      cy.wait('@getHealthRecordsV1')
      
      cy.get('[data-testid="health-record-item"]').should('be.visible')
      
      // Switch to newer version
      cy.visit('/health-records?api_version=v2')
      cy.get('[data-testid="tab-records"]').click()
      cy.wait('@getHealthRecordsV2')
      
      cy.get('[data-testid="health-record-item"]').should('be.visible')
      cy.get('[data-testid="provider-license"]').should('contain', 'ABC123')
    })

    it('Test 150: Should handle batch API operations efficiently', () => {
      cy.intercept('POST', '**/api/health-records/batch', {
        statusCode: 200,
        body: {
          success: true,
          processed: 15,
          successful: 14,
          failed: 1,
          results: [
            { id: 'record-1', status: 'success' },
            { id: 'record-2', status: 'success' },
            { id: 'record-3', status: 'failed', error: 'Invalid date' }
          ]
        }
      }).as('batchUpdateRecords')
      
      cy.get('[data-testid="tab-records"]').click()
      
      // Select multiple records
      cy.get('[data-testid="select-all-checkbox"]').check()
      cy.get('[data-testid="selected-count"]').should('contain', 'selected')
      
      // Perform batch operation
      cy.get('[data-testid="batch-actions-dropdown"]').click()
      cy.get('[data-testid="batch-update-status"]').click()
      
      cy.get('[data-testid="batch-update-modal"]').should('be.visible')
      cy.get('[data-testid="new-status-select"]').select('REVIEWED')
      cy.get('[data-testid="confirm-batch-update"]').click()
      
      cy.wait('@batchUpdateRecords')
      
      cy.get('[data-testid="batch-results-modal"]').should('be.visible')
      cy.get('[data-testid="successful-count"]').should('contain', '14 records updated successfully')
      cy.get('[data-testid="failed-count"]').should('contain', '1 record failed')
      cy.get('[data-testid="error-details"]').should('contain', 'Invalid date')
      
      // Should refresh the list
      cy.get('[data-testid="close-results-button"]').click()
      cy.get('[data-testid="health-record-item"]').should('be.visible')
    })
  })
})

describe('Health Records - Data Synchronization and Conflict Resolution (Tests 151-160)', () => {
  beforeEach(() => {
    cy.clearCookies()
    cy.clearLocalStorage()
    cy.loginAsNurse()
    cy.visit('/health-records')
  })

  describe('Multi-User Synchronization (Tests 151-155)', () => {
    it('Test 151: Should handle concurrent editing conflicts', () => {
      cy.intercept('GET', '**/api/health-records/allergies/1', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            id: '1',
            allergen: 'Peanuts',
            severity: 'SEVERE',
            version: 1,
            lastModified: '2024-01-15T10:00:00Z'
          }
        }
      }).as('getAllergy')
      
      cy.get('[data-testid="tab-allergies"]').click()
      cy.get('[data-testid="allergy-item"]').first().within(() => {
        cy.get('[data-testid="edit-allergy-button"]').click()
      })
      
      cy.wait('@getAllergy')
      cy.get('[data-testid="edit-allergy-modal"]').should('be.visible')
      
      // Simulate another user editing the same record
      cy.intercept('PUT', '**/api/health-records/allergies/1', {
        statusCode: 409,
        body: {
          error: 'Conflict',
          message: 'Record has been modified by another user',
          currentData: {
            id: '1',
            allergen: 'Tree Nuts',
            severity: 'LIFE_THREATENING',
            version: 2,
            lastModified: '2024-01-15T10:05:00Z',
            modifiedBy: 'Jane Smith, RN'
          },
          yourChanges: {
            severity: 'MODERATE'
          }
        }
      }).as('conflictResponse')
      
      cy.get('[data-testid="severity-select"]').select('MODERATE')
      cy.get('[data-testid="save-allergy-button"]').click()
      
      cy.wait('@conflictResponse')
      
      cy.get('[data-testid="conflict-resolution-modal"]').should('be.visible')
      cy.get('[data-testid="conflict-message"]').should('contain', 'modified by another user')
      cy.get('[data-testid="other-user-name"]').should('contain', 'Jane Smith, RN')
      
      // Show current vs. your changes
      cy.get('[data-testid="current-changes"]').within(() => {
        cy.get('[data-testid="allergen-change"]').should('contain', 'Tree Nuts')
        cy.get('[data-testid="severity-change"]').should('contain', 'LIFE_THREATENING')
      })
      
      cy.get('[data-testid="your-changes"]').within(() => {
        cy.get('[data-testid="severity-change"]').should('contain', 'MODERATE')
      })
      
      // Resolution options
      cy.get('[data-testid="keep-current-button"]').should('be.visible')
      cy.get('[data-testid="keep-yours-button"]').should('be.visible')
      cy.get('[data-testid="merge-changes-button"]').should('be.visible')
    })

    it('Test 152: Should provide real-time collaboration indicators', () => {
      cy.intercept('GET', '**/api/health-records/active-editors/**', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            activeEditors: [
              {
                userId: 'user-456',
                userName: 'Mary Johnson, RN',
                recordId: 'record-123',
                editingField: 'description',
                lastActivity: '2024-01-15T10:00:00Z'
              }
            ]
          }
        }
      }).as('getActiveEditors')
      
      cy.get('[data-testid="tab-records"]').click()
      cy.wait('@getActiveEditors')
      
      // Should show collaboration indicators
      cy.get('[data-testid="record-123"]').within(() => {
        cy.get('[data-testid="active-editor-indicator"]').should('be.visible')
        cy.get('[data-testid="editor-avatar"]').should('be.visible')
        cy.get('[data-testid="editor-tooltip"]').trigger('mouseover')
      })
      
      cy.get('[data-testid="editor-tooltip-content"]').should('contain', 'Mary Johnson, RN is currently editing')
      
      // Should prevent editing when someone else is editing
      cy.get('[data-testid="record-123"]').click()
      cy.get('[data-testid="edit-locked-message"]').should('be.visible')
      cy.get('[data-testid="edit-locked-message"]').should('contain', 'This record is currently being edited')
      cy.get('[data-testid="request-edit-access-button"]').should('be.visible')
    })

    it('Test 153: Should handle offline-online synchronization', () => {
      // Simulate going offline
      cy.window().then((win) => {
        Object.defineProperty(win.navigator, 'onLine', { value: false, writable: true })
        win.dispatchEvent(new Event('offline'))
      })
      
      cy.get('[data-testid="offline-indicator"]').should('be.visible')
      cy.get('[data-testid="offline-mode-banner"]').should('contain', 'You are currently offline')
      
      // Make changes while offline
      cy.get('[data-testid="tab-allergies"]').click()
      cy.get('[data-testid="add-allergy-button"]').click()
      cy.get('[data-testid="add-allergy-modal"]').should('be.visible')
      
      cy.get('[data-testid="allergen-input"]').type('Shellfish')
      cy.get('[data-testid="severity-select"]').select('SEVERE')
      cy.get('[data-testid="reaction-input"]').type('Hives and swelling')
      cy.get('[data-testid="save-allergy-button"]').click()
      
      // Should queue changes for sync
      cy.get('[data-testid="offline-save-message"]').should('contain', 'Changes saved locally')
      cy.get('[data-testid="pending-sync-indicator"]').should('be.visible')
      cy.get('[data-testid="pending-changes-count"]').should('contain', '1 pending change')
      
      // Simulate coming back online
      cy.intercept('POST', '**/api/health-records/sync', {
        statusCode: 200,
        body: {
          success: true,
          synced: 1,
          conflicts: 0
        }
      }).as('syncOfflineChanges')
      
      cy.window().then((win) => {
        Object.defineProperty(win.navigator, 'onLine', { value: true, writable: true })
        win.dispatchEvent(new Event('online'))
      })
      
      cy.get('[data-testid="online-indicator"]').should('be.visible')
      cy.get('[data-testid="syncing-indicator"]').should('be.visible')
      
      cy.wait('@syncOfflineChanges')
      
      cy.get('[data-testid="sync-success-message"]').should('contain', '1 change synchronized')
      cy.get('[data-testid="pending-sync-indicator"]').should('not.exist')
    })

    it('Test 154: Should handle merge conflicts in offline sync', () => {
      // Setup scenario where offline changes conflict with server changes
      cy.intercept('POST', '**/api/health-records/sync', {
        statusCode: 409,
        body: {
          success: false,
          conflicts: [
            {
              recordId: 'allergy-123',
              localChanges: { severity: 'MODERATE' },
              serverChanges: { severity: 'SEVERE', modifiedBy: 'Dr. Smith' },
              timestamp: '2024-01-15T10:30:00Z'
            }
          ]
        }
      }).as('syncWithConflicts')
      
      // Simulate offline changes
      cy.window().then((win) => {
        win.localStorage.setItem('pendingChanges', JSON.stringify([
          {
            id: 'allergy-123',
            type: 'UPDATE',
            data: { severity: 'MODERATE' },
            timestamp: '2024-01-15T10:00:00Z'
          }
        ]))
        
        Object.defineProperty(win.navigator, 'onLine', { value: true, writable: true })
        win.dispatchEvent(new Event('online'))
      })
      
      cy.reload()
      cy.wait('@syncWithConflicts')
      
      cy.get('[data-testid="conflict-resolution-modal"]').should('be.visible')
      cy.get('[data-testid="conflict-count"]').should('contain', '1 conflict needs resolution')
      
      cy.get('[data-testid="conflict-item"]').within(() => {
        cy.get('[data-testid="local-change"]').should('contain', 'MODERATE')
        cy.get('[data-testid="server-change"]').should('contain', 'SEVERE')
        cy.get('[data-testid="modified-by"]').should('contain', 'Dr. Smith')
        
        cy.get('[data-testid="use-local-button"]').should('be.visible')
        cy.get('[data-testid="use-server-button"]').should('be.visible')
        cy.get('[data-testid="merge-manual-button"]').should('be.visible')
      })
      
      // Choose server version
      cy.get('[data-testid="use-server-button"]').click()
      cy.get('[data-testid="resolve-conflicts-button"]').click()
      
      cy.get('[data-testid="conflicts-resolved-message"]').should('be.visible')
    })

    it('Test 155: Should validate data consistency across sessions', () => {
      cy.intercept('GET', '**/api/health-records/consistency-check', {
        statusCode: 200,
        body: {
          success: true,
          consistencyIssues: [
            {
              type: 'ORPHANED_RECORD',
              recordId: 'med-456',
              description: 'Medication record references deleted student',
              severity: 'HIGH'
            },
            {
              type: 'DUPLICATE_ENTRY',
              recordIds: ['allergy-123', 'allergy-124'],
              description: 'Duplicate allergy entries for same student',
              severity: 'MEDIUM'
            }
          ]
        }
      }).as('consistencyCheck')
      
      cy.get('[data-testid="admin-tools-button"]').click()
      cy.get('[data-testid="consistency-check-button"]').click()
      
      cy.wait('@consistencyCheck')
      
      cy.get('[data-testid="consistency-report-modal"]').should('be.visible')
      cy.get('[data-testid="issues-found"]').should('contain', '2 consistency issues found')
      
      cy.get('[data-testid="issue-item"]').should('have.length', 2)
      
      // High severity issue
      cy.get('[data-testid="issue-item"]').first().within(() => {
        cy.get('[data-testid="severity-badge"]').should('have.class', 'bg-red-100')
        cy.get('[data-testid="issue-description"]').should('contain', 'references deleted student')
        cy.get('[data-testid="auto-fix-button"]').should('be.visible')
        cy.get('[data-testid="manual-review-button"]').should('be.visible')
      })
      
      // Auto-fix option
      cy.get('[data-testid="auto-fix-button"]').first().click()
      cy.get('[data-testid="fix-confirmation-modal"]').should('be.visible')
      cy.get('[data-testid="confirm-fix-button"]').click()
      
      cy.get('[data-testid="fix-success-message"]').should('contain', 'Issue resolved automatically')
    })
  })

  describe('Import/Export Integration (Tests 156-160)', () => {
    it('Test 156: Should export data in multiple formats', () => {
      cy.intercept('POST', '**/api/health-records/export', {
        statusCode: 200,
        body: {
          success: true,
          exportId: 'export-123',
          downloadUrl: '/api/downloads/export-123.csv'
        }
      }).as('exportData')
      
      cy.get('[data-testid="export-button"]').click()
      cy.get('[data-testid="export-modal"]').should('be.visible')
      
      // Configure export options
      cy.get('[data-testid="export-format-select"]').select('CSV')
      cy.get('[data-testid="date-range-checkbox"]').check()
      cy.get('[data-testid="start-date-input"]').type('2024-01-01')
      cy.get('[data-testid="end-date-input"]').type('2024-01-31')
      
      cy.get('[data-testid="include-allergies"]').check()
      cy.get('[data-testid="include-medications"]').check()
      cy.get('[data-testid="include-vaccinations"]').check()
      
      cy.get('[data-testid="start-export-button"]').click()
      cy.wait('@exportData')
      
      cy.get('[data-testid="export-progress"]').should('be.visible')
      cy.get('[data-testid="download-link"]').should('be.visible')
      cy.get('[data-testid="download-link"]').should('contain', 'Download CSV Export')
      
      // Test different formats
      cy.get('[data-testid="export-format-select"]').select('PDF')
      cy.get('[data-testid="start-export-button"]').click()
      
      cy.get('[data-testid="pdf-options"]').should('be.visible')
      cy.get('[data-testid="include-charts"]').should('be.visible')
      cy.get('[data-testid="include-photos"]').should('be.visible')
    })

    it('Test 157: Should import data with validation and error handling', () => {
      cy.intercept('POST', '**/api/health-records/import/validate', {
        statusCode: 200,
        body: {
          success: true,
          validRecords: 45,
          invalidRecords: 5,
          errors: [
            { row: 3, error: 'Invalid date format' },
            { row: 7, error: 'Missing required field: allergen' },
            { row: 12, error: 'Invalid severity level' }
          ]
        }
      }).as('validateImport')
      
      cy.intercept('POST', '**/api/health-records/import/process', {
        statusCode: 200,
        body: {
          success: true,
          imported: 45,
          skipped: 5,
          duplicates: 2
        }
      }).as('processImport')
      
      cy.get('[data-testid="import-button"]').click()
      cy.get('[data-testid="import-modal"]').should('be.visible')
      
      // Upload file
      cy.get('[data-testid="file-upload"]').selectFile('cypress/fixtures/health-records-import.csv')
      cy.get('[data-testid="file-info"]').should('contain', 'health-records-import.csv')
      
      cy.get('[data-testid="validate-button"]').click()
      cy.wait('@validateImport')
      
      // Show validation results
      cy.get('[data-testid="validation-results"]').should('be.visible')
      cy.get('[data-testid="valid-count"]').should('contain', '45 valid records')
      cy.get('[data-testid="invalid-count"]').should('contain', '5 invalid records')
      
      cy.get('[data-testid="error-list"]').should('be.visible')
      cy.get('[data-testid="error-item"]').should('have.length', 3)
      cy.get('[data-testid="error-item"]').first().should('contain', 'Row 3: Invalid date format')
      
      // Option to proceed with valid records only
      cy.get('[data-testid="import-valid-only"]').check()
      cy.get('[data-testid="proceed-import-button"]').click()
      
      cy.wait('@processImport')
      
      cy.get('[data-testid="import-results"]').should('be.visible')
      cy.get('[data-testid="imported-count"]').should('contain', '45 records imported')
      cy.get('[data-testid="skipped-count"]').should('contain', '5 records skipped')
    })

    it('Test 158: Should handle large file imports with progress tracking', () => {
      cy.intercept('POST', '**/api/health-records/import/large', {
        statusCode: 202,
        body: {
          success: true,
          jobId: 'import-job-456',
          estimatedTime: '5 minutes'
        }
      }).as('startLargeImport')
      
      // Mock progress updates
      let progressValue = 0
      cy.intercept('GET', '**/api/health-records/import/progress/import-job-456', () => {
        progressValue += 20
        return {
          statusCode: 200,
          body: {
            success: true,
            progress: Math.min(progressValue, 100),
            status: progressValue >= 100 ? 'COMPLETED' : 'PROCESSING',
            processedRecords: Math.floor((progressValue / 100) * 1000),
            totalRecords: 1000
          }
        }
      }).as('getImportProgress')
      
      cy.get('[data-testid="import-button"]').click()
      cy.get('[data-testid="import-modal"]').should('be.visible')
      
      cy.get('[data-testid="file-upload"]').selectFile('cypress/fixtures/large-health-records.csv')
      cy.get('[data-testid="large-file-warning"]').should('be.visible')
      cy.get('[data-testid="large-file-warning"]').should('contain', 'Large file detected')
      
      cy.get('[data-testid="start-import-button"]').click()
      cy.wait('@startLargeImport')
      
      cy.get('[data-testid="import-progress-modal"]').should('be.visible')
      cy.get('[data-testid="progress-bar"]').should('be.visible')
      cy.get('[data-testid="estimated-time"]').should('contain', '5 minutes')
      
      // Progress should update
      cy.wait('@getImportProgress')
      cy.get('[data-testid="progress-percentage"]').should('contain', '20%')
      cy.get('[data-testid="processed-count"]').should('contain', '200 of 1000')
      
      // Continue checking progress
      cy.wait('@getImportProgress')
      cy.get('[data-testid="progress-percentage"]').should('contain', '40%')
      
      // Eventually complete
      cy.wait('@getImportProgress', { timeout: 10000 })
      cy.get('[data-testid="import-complete-message"]').should('be.visible')
      cy.get('[data-testid="view-results-button"]').should('be.visible')
    })

    it('Test 159: Should maintain data relationships during import/export', () => {
      cy.intercept('GET', '**/api/health-records/export/relationships', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            students: [
              { id: 'student-1', name: 'John Doe' }
            ],
            allergies: [
              { id: 'allergy-1', studentId: 'student-1', allergen: 'Peanuts' }
            ],
            medications: [
              { id: 'med-1', studentId: 'student-1', name: 'EpiPen', allergyId: 'allergy-1' }
            ]
          }
        }
      }).as('exportWithRelationships')
      
      cy.get('[data-testid="export-button"]').click()
      cy.get('[data-testid="export-modal"]').should('be.visible')
      
      cy.get('[data-testid="preserve-relationships"]').check()
      cy.get('[data-testid="export-format-select"]').select('JSON')
      cy.get('[data-testid="start-export-button"]').click()
      
      cy.wait('@exportWithRelationships')
      
      // Import the same data to test relationship preservation
      cy.intercept('POST', '**/api/health-records/import/with-relationships', {
        statusCode: 200,
        body: {
          success: true,
          studentsCreated: 1,
          allergiesCreated: 1,
          medicationsCreated: 1,
          relationshipsPreserved: 2
        }
      }).as('importWithRelationships')
      
      cy.get('[data-testid="import-button"]').click()
      cy.get('[data-testid="import-modal"]').should('be.visible')
      
      cy.get('[data-testid="file-upload"]').selectFile('cypress/fixtures/export-with-relationships.json')
      cy.get('[data-testid="preserve-relationships"]').check()
      cy.get('[data-testid="start-import-button"]').click()
      
      cy.wait('@importWithRelationships')
      
      cy.get('[data-testid="relationships-preserved"]').should('contain', '2 relationships preserved')
      cy.get('[data-testid="relationship-verification"]').should('be.visible')
    })

    it('Test 160: Should handle integration with external backup systems', () => {
      cy.intercept('POST', '**/api/integrations/backup/schedule', {
        statusCode: 200,
        body: {
          success: true,
          backupId: 'backup-789',
          nextBackup: '2024-01-16T02:00:00Z'
        }
      }).as('scheduleBackup')
      
      cy.intercept('GET', '**/api/integrations/backup/status', {
        statusCode: 200,
        body: {
          success: true,
          lastBackup: '2024-01-15T02:00:00Z',
          nextBackup: '2024-01-16T02:00:00Z',
          backupSize: '2.5 GB',
          status: 'HEALTHY'
        }
      }).as('getBackupStatus')
      
      cy.get('[data-testid="admin-tools-button"]').click()
      cy.get('[data-testid="backup-settings-button"]').click()
      
      cy.get('[data-testid="backup-settings-modal"]').should('be.visible')
      cy.wait('@getBackupStatus')
      
      cy.get('[data-testid="backup-status"]').should('contain', 'HEALTHY')
      cy.get('[data-testid="last-backup-time"]').should('be.visible')
      cy.get('[data-testid="next-backup-time"]').should('be.visible')
      cy.get('[data-testid="backup-size"]').should('contain', '2.5 GB')
      
      // Schedule immediate backup
      cy.get('[data-testid="backup-now-button"]').click()
      cy.get('[data-testid="backup-confirmation-modal"]').should('be.visible')
      cy.get('[data-testid="confirm-backup-button"]').click()
      
      cy.wait('@scheduleBackup')
      
      cy.get('[data-testid="backup-scheduled-message"]').should('contain', 'Backup scheduled successfully')
      cy.get('[data-testid="backup-progress"]').should('be.visible')
      
      // Test restore functionality
      cy.get('[data-testid="restore-from-backup-button"]').click()
      cy.get('[data-testid="restore-warning"]').should('be.visible')
      cy.get('[data-testid="restore-warning"]').should('contain', 'This will replace current data')
      cy.get('[data-testid="available-backups"]').should('be.visible')
    })
  })
})