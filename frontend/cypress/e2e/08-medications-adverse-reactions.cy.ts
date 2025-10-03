// Medications Management - Adverse Reactions Tab (Tests 81-100)
describe('Medications - Adverse Reactions Tab', () => {
  beforeEach(() => {
    cy.loginAsNurse()
    cy.interceptMedicationAPI()
    cy.visit('/medications')
    cy.get('[data-testid="adverse-reactions-tab"]').click()
  })

  // Test 81: Display adverse reactions tab
  it('should display the adverse reactions tab correctly', () => {
    cy.get('[data-testid="adverse-reactions-tab"]').should('have.class', 'border-blue-500')
    cy.get('[data-testid="report-reaction-button"]').should('be.visible')
    cy.get('[data-testid="report-reaction-button"]').should('contain.text', 'Report Reaction')
  })

  // Test 82: Display adverse reactions table
  it('should display adverse reactions table with correct headers', () => {
    cy.get('[data-testid="adverse-reactions-table"]').should('be.visible')
    cy.get('[data-testid="adverse-reactions-table"]').within(() => {
      cy.get('[data-testid="date-column"]').should('contain.text', 'Date')
      cy.get('[data-testid="student-column"]').should('contain.text', 'Student')
      cy.get('[data-testid="severity-column"]').should('contain.text', 'Severity')
      cy.get('[data-testid="reaction-column"]').should('contain.text', 'Reaction')
      cy.get('[data-testid="action-column"]').should('contain.text', 'Action Taken')
      cy.get('[data-testid="reporter-column"]').should('contain.text', 'Reported By')
    })
  })

  // Test 83: Display adverse reaction rows
  it('should display adverse reaction entries with correct information', () => {
    cy.get('[data-testid="reaction-row"]:first').should('be.visible')
    cy.get('[data-testid="reaction-row"]:first').within(() => {
      cy.get('[data-testid="reaction-date"]').should('be.visible')
      cy.get('[data-testid="student-name"]').should('contain.text', 'Emma Wilson')
      cy.get('[data-testid="severity-badge"]').should('be.visible')
      cy.get('[data-testid="reaction-description"]').should('be.visible')
      cy.get('[data-testid="actions-taken"]').should('be.visible')
      cy.get('[data-testid="reporter-name"]').should('contain.text', 'Sarah Johnson')
    })
  })

  // Test 84: Display severity badges correctly
  it('should display severity badges with appropriate colors', () => {
    cy.get('[data-testid="severity-badge"]').contains('MEDIUM').should('have.class', 'bg-yellow-100')
    cy.get('[data-testid="severity-badge"]').contains('MEDIUM').should('have.class', 'text-yellow-800')
  })

  // Test 85: Display critical severity badge
  it('should display critical severity with red styling', () => {
    cy.intercept('GET', '**/api/medications/adverse-reactions*', {
      body: {
        success: true,
        data: {
          reactions: [{
            id: '2',
            occurredAt: '2025-01-20',
            severity: 'CRITICAL',
            description: 'Severe allergic reaction',
            actionsTaken: 'Emergency protocol activated',
            student: { firstName: 'John', lastName: 'Smith' },
            reportedBy: { firstName: 'Sarah', lastName: 'Johnson' }
          }]
        }
      }
    }).as('getCriticalReactions')
    
    cy.reload()
    cy.get('[data-testid="adverse-reactions-tab"]').click()
    cy.wait('@getCriticalReactions')
    
    cy.get('[data-testid="severity-badge"]').contains('CRITICAL').should('have.class', 'bg-red-100')
    cy.get('[data-testid="severity-badge"]').contains('CRITICAL').should('have.class', 'text-red-800')
  })

  // Test 86: Display high severity badge
  it('should display high severity with orange styling', () => {
    cy.intercept('GET', '**/api/medications/adverse-reactions*', {
      body: {
        success: true,
        data: {
          reactions: [{
            id: '3',
            occurredAt: '2025-01-18',
            severity: 'HIGH',
            description: 'Significant side effects',
            actionsTaken: 'Medication adjusted',
            student: { firstName: 'Jane', lastName: 'Doe' },
            reportedBy: { firstName: 'Sarah', lastName: 'Johnson' }
          }]
        }
      }
    }).as('getHighSeverityReactions')
    
    cy.reload()
    cy.get('[data-testid="adverse-reactions-tab"]').click()
    cy.wait('@getHighSeverityReactions')
    
    cy.get('[data-testid="severity-badge"]').contains('HIGH').should('have.class', 'bg-orange-100')
    cy.get('[data-testid="severity-badge"]').contains('HIGH').should('have.class', 'text-orange-800')
  })

  // Test 87: Display low severity badge
  it('should display low severity with green styling', () => {
    cy.intercept('GET', '**/api/medications/adverse-reactions*', {
      body: {
        success: true,
        data: {
          reactions: [{
            id: '4',
            occurredAt: '2025-01-16',
            severity: 'LOW',
            description: 'Minor stomach upset',
            actionsTaken: 'Monitored, resolved naturally',
            student: { firstName: 'Mike', lastName: 'Johnson' },
            reportedBy: { firstName: 'Sarah', lastName: 'Johnson' }
          }]
        }
      }
    }).as('getLowSeverityReactions')
    
    cy.reload()
    cy.get('[data-testid="adverse-reactions-tab"]').click()
    cy.wait('@getLowSeverityReactions')
    
    cy.get('[data-testid="severity-badge"]').contains('LOW').should('have.class', 'bg-green-100')
    cy.get('[data-testid="severity-badge"]').contains('LOW').should('have.class', 'text-green-800')
  })

  // Test 88: Open report reaction modal
  it('should open report reaction modal when clicking report button', () => {
    cy.get('[data-testid="report-reaction-button"]').click()
    cy.get('[data-testid="report-reaction-modal"]').should('be.visible')
    cy.get('[data-testid="modal-title"]').should('contain.text', 'Report Adverse Reaction')
  })

  // Test 89: Display report reaction form fields
  it('should display all required fields in report reaction form', () => {
    cy.get('[data-testid="report-reaction-button"]').click()
    cy.get('[data-testid="report-reaction-modal"]').within(() => {
      cy.get('[data-testid="student-select"]').should('be.visible')
      cy.get('[data-testid="medication-select"]').should('be.visible')
      cy.get('[data-testid="severity-select"]').should('be.visible')
      cy.get('[data-testid="occurrence-date"]').should('be.visible')
      cy.get('[data-testid="reaction-description"]').should('be.visible')
      cy.get('[data-testid="actions-taken"]').should('be.visible')
      cy.get('[data-testid="submit-report-button"]').should('be.visible')
      cy.get('[data-testid="cancel-button"]').should('be.visible')
    })
  })

  // Test 90: Fill and submit adverse reaction report
  it('should successfully submit adverse reaction report', () => {
    cy.get('[data-testid="report-reaction-button"]').click()
    cy.get('[data-testid="report-reaction-modal"]').within(() => {
      cy.get('[data-testid="student-select"]').select('Emma Wilson')
      cy.get('[data-testid="medication-select"]').select('Aspirin')
      cy.get('[data-testid="severity-select"]').select('MEDIUM')
      cy.get('[data-testid="occurrence-date"]').type('2025-01-21')
      cy.get('[data-testid="reaction-description"]').type('Student experienced mild nausea after taking medication')
      cy.get('[data-testid="actions-taken"]').type('Gave medication with food, symptoms resolved within 30 minutes')
      cy.get('[data-testid="submit-report-button"]').click()
    })
    cy.get('[data-testid="success-toast"]').should('contain.text', 'Adverse reaction reported successfully')
  })

  // Test 91: Validate required fields in report form
  it('should validate required fields in adverse reaction form', () => {
    cy.get('[data-testid="report-reaction-button"]').click()
    cy.get('[data-testid="report-reaction-modal"]').within(() => {
      cy.get('[data-testid="submit-report-button"]').click()
      cy.get('[data-testid="student-error"]').should('contain.text', 'Student is required')
      cy.get('[data-testid="medication-error"]').should('contain.text', 'Medication is required')
      cy.get('[data-testid="severity-error"]').should('contain.text', 'Severity is required')
      cy.get('[data-testid="description-error"]').should('contain.text', 'Reaction description is required')
    })
  })

  // Test 92: Cancel report reaction
  it('should close modal when clicking cancel', () => {
    cy.get('[data-testid="report-reaction-button"]').click()
    cy.get('[data-testid="report-reaction-modal"]').should('be.visible')
    cy.get('[data-testid="cancel-button"]').click()
    cy.get('[data-testid="report-reaction-modal"]').should('not.exist')
  })

  // Test 93: Empty adverse reactions state
  it('should display empty state when no adverse reactions exist', () => {
    cy.intercept('GET', '**/api/medications/adverse-reactions*', {
      body: {
        success: true,
        data: { reactions: [] }
      }
    }).as('getEmptyReactions')
    
    cy.visit('/medications')
    cy.get('[data-testid="adverse-reactions-tab"]').click()
    cy.wait('@getEmptyReactions')
    
    cy.get('[data-testid="empty-reactions"]').should('be.visible')
    cy.get('[data-testid="empty-reactions"]').should('contain.text', 'No adverse reactions reported')
    cy.get('[data-testid="empty-reactions-icon"]').should('be.visible')
  })

  // Test 94: Loading state for adverse reactions
  it('should display loading state while fetching adverse reactions', () => {
    cy.intercept('GET', '**/api/medications/adverse-reactions*', { delay: 2000, fixture: 'reactions.json' }).as('getReactionsDelay')
    cy.visit('/medications')
    cy.get('[data-testid="adverse-reactions-tab"]').click()
    cy.get('[data-testid="loading-spinner"]').should('be.visible')
    cy.get('[data-testid="loading-text"]').should('contain.text', 'Loading adverse reactions...')
    cy.wait('@getReactionsDelay')
    cy.get('[data-testid="loading-spinner"]').should('not.exist')
  })

  // Test 95: Truncate long descriptions
  it('should truncate long reaction descriptions', () => {
    cy.get('[data-testid="reaction-description"]').should('have.class', 'truncate')
    cy.get('[data-testid="reaction-description"]').should('have.class', 'max-w-xs')
  })

  // Test 96: Truncate long actions taken
  it('should truncate long actions taken descriptions', () => {
    cy.get('[data-testid="actions-taken"]').should('have.class', 'truncate')
    cy.get('[data-testid="actions-taken"]').should('have.class', 'max-w-xs')
  })

  // Test 97: View full reaction details
  it('should show full details when clicking on reaction row', () => {
    cy.get('[data-testid="reaction-row"]:first').click()
    cy.get('[data-testid="reaction-details-modal"]').should('be.visible')
    cy.get('[data-testid="reaction-details-modal"]').within(() => {
      cy.get('[data-testid="full-description"]').should('be.visible')
      cy.get('[data-testid="full-actions"]').should('be.visible')
      cy.get('[data-testid="occurrence-time"]').should('be.visible')
      cy.get('[data-testid="medication-details"]').should('be.visible')
    })
  })

  // Test 98: Filter reactions by severity
  it('should filter reactions by severity level', () => {
    cy.get('[data-testid="severity-filter"]').should('be.visible')
    cy.get('[data-testid="severity-filter"]').select('CRITICAL')
    cy.get('[data-testid="reaction-row"]').should('contain.text', 'CRITICAL')
    cy.get('[data-testid="reaction-row"]').should('not.contain.text', 'MEDIUM')
  })

  // Test 99: Sort reactions by date
  it('should sort reactions by occurrence date', () => {
    cy.get('[data-testid="date-sort-button"]').click()
    // Verify first row has most recent date
    cy.get('[data-testid="reaction-row"]:first [data-testid="reaction-date"]').should('be.visible')
    
    cy.get('[data-testid="date-sort-button"]').click()
    // Verify sorting order changed
    cy.get('[data-testid="reaction-row"]:first [data-testid="reaction-date"]').should('be.visible')
  })

  // Test 100: Export adverse reactions report
  it('should allow exporting adverse reactions report', () => {
    cy.get('[data-testid="export-reactions-button"]').should('be.visible')
    cy.get('[data-testid="export-reactions-button"]').click()
    cy.get('[data-testid="export-options-modal"]').should('be.visible')
    cy.get('[data-testid="export-options-modal"]').within(() => {
      cy.get('[data-testid="date-range-start"]').should('be.visible')
      cy.get('[data-testid="date-range-end"]').should('be.visible')
      cy.get('[data-testid="export-format"]').should('be.visible')
      cy.get('[data-testid="confirm-export-button"]').should('be.visible')
    })
    
    cy.get('[data-testid="export-format"]').select('PDF')
    cy.get('[data-testid="confirm-export-button"]').click()
    cy.get('[data-testid="success-toast"]').should('contain.text', 'Report exported successfully')
  })
})