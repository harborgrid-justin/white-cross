// Medications Management - Reminders Tab (Tests 61-80)
describe('Medications - Reminders Tab', () => {
  beforeEach(() => {
    cy.loginAsNurse()
    cy.interceptMedicationAPI()
    cy.visit('/medications')
    cy.get('[data-testid="reminders-tab"]').click()
  })

  // Test 61: Display reminders tab
  it('should display the reminders tab correctly', () => {
    cy.get('[data-testid="reminders-tab"]').should('have.class', 'border-blue-500')
    cy.get('[data-testid="todays-schedule"]').should('be.visible')
    cy.get('[data-testid="todays-schedule"]').should('contain.text', "Today's Medication Schedule")
  })

  // Test 62: Display current date
  it('should display the current date in the schedule header', () => {
    const today = new Date().toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
    cy.get('[data-testid="schedule-date"]').should('contain.text', today)
  })

  // Test 63: Display reminder cards
  it('should display medication reminder cards', () => {
    cy.get('[data-testid="reminder-card"]').should('have.length.at.least', 1)
    cy.get('[data-testid="reminder-card"]:first').should('be.visible')
    cy.get('[data-testid="reminder-card"]:first').within(() => {
      cy.get('[data-testid="reminder-time"]').should('be.visible')
      cy.get('[data-testid="student-name"]').should('be.visible')
      cy.get('[data-testid="medication-info"]').should('be.visible')
      cy.get('[data-testid="reminder-status"]').should('be.visible')
    })
  })

  // Test 64: Display pending reminder status
  it('should display pending reminders with correct styling', () => {
    cy.get('[data-testid="reminder-card"]').contains('PENDING').parent().within(() => {
      cy.get('[data-testid="reminder-card"]').should('have.class', 'border-blue-500')
      cy.get('[data-testid="reminder-card"]').should('have.class', 'bg-blue-50')
      cy.get('[data-testid="reminder-icon"]').should('have.class', 'text-blue-600')
      cy.get('[data-testid="reminder-icon"]').should('have.class', 'bg-blue-100')
    })
  })

  // Test 65: Display completed reminder status
  it('should display completed reminders with correct styling', () => {
    cy.get('[data-testid="reminder-card"]').contains('COMPLETED').parent().within(() => {
      cy.get('[data-testid="reminder-card"]').should('have.class', 'border-green-500')
      cy.get('[data-testid="reminder-card"]').should('have.class', 'bg-green-50')
      cy.get('[data-testid="reminder-icon"]').should('have.class', 'text-green-600')
      cy.get('[data-testid="reminder-icon"]').should('have.class', 'bg-green-100')
    })
  })

  // Test 66: Display missed reminder status
  it('should display missed reminders with correct styling', () => {
    cy.intercept('GET', '**/api/medications/reminders*', {
      body: {
        success: true,
        data: {
          reminders: [{
            id: '3',
            studentName: 'Jane Doe',
            medicationName: 'Missed Medicine',
            dosage: '5mg',
            scheduledTime: new Date(Date.now() - 7200000).toISOString(),
            status: 'MISSED'
          }]
        }
      }
    }).as('getMissedReminders')
    
    cy.reload()
    cy.get('[data-testid="reminders-tab"]').click()
    cy.wait('@getMissedReminders')
    
    cy.get('[data-testid="reminder-card"]').contains('MISSED').parent().within(() => {
      cy.get('[data-testid="reminder-card"]').should('have.class', 'border-red-500')
      cy.get('[data-testid="reminder-card"]').should('have.class', 'bg-red-50')
      cy.get('[data-testid="reminder-icon"]').should('have.class', 'text-red-600')
      cy.get('[data-testid="reminder-icon"]').should('have.class', 'bg-red-100')
    })
  })

  // Test 67: Display reminder time formatting
  it('should display reminder times in correct format', () => {
    cy.get('[data-testid="reminder-time"]').should('match', /\d{1,2}:\d{2} (AM|PM)/)
  })

  // Test 68: Display student information
  it('should display student names in reminders', () => {
    cy.get('[data-testid="reminder-card"]:first').within(() => {
      cy.get('[data-testid="student-name"]').should('contain.text', 'Emma Wilson')
    })
  })

  // Test 69: Display medication and dosage information
  it('should display medication name and dosage', () => {
    cy.get('[data-testid="reminder-card"]:first').within(() => {
      cy.get('[data-testid="medication-info"]').should('contain.text', 'Albuterol Inhaler - 2 puffs')
    })
  })

  // Test 70: Display status badges
  it('should display status badges with correct colors', () => {
    cy.get('[data-testid="pending-badge"]').should('be.visible')
    cy.get('[data-testid="pending-badge"]').should('have.class', 'bg-blue-100')
    cy.get('[data-testid="pending-badge"]').should('have.class', 'text-blue-800')
    
    cy.get('[data-testid="completed-badge"]').should('be.visible')
    cy.get('[data-testid="completed-badge"]').should('have.class', 'bg-green-100')
    cy.get('[data-testid="completed-badge"]').should('have.class', 'text-green-800')
  })

  // Test 71: Empty reminders state
  it('should display empty state when no reminders for today', () => {
    cy.intercept('GET', '**/api/medications/reminders*', {
      body: {
        success: true,
        data: { reminders: [] }
      }
    }).as('getEmptyReminders')
    
    cy.visit('/medications')
    cy.get('[data-testid="reminders-tab"]').click()
    cy.wait('@getEmptyReminders')
    
    cy.get('[data-testid="empty-reminders"]').should('be.visible')
    cy.get('[data-testid="empty-reminders"]').should('contain.text', 'No medication reminders for today')
    cy.get('[data-testid="empty-reminders-icon"]').should('be.visible')
  })

  // Test 72: Loading state for reminders
  it('should display loading state while fetching reminders', () => {
    cy.intercept('GET', '**/api/medications/reminders*', { delay: 2000, fixture: 'reminders.json' }).as('getRemindersDelay')
    cy.visit('/medications')
    cy.get('[data-testid="reminders-tab"]').click()
    cy.get('[data-testid="loading-spinner"]').should('be.visible')
    cy.get('[data-testid="loading-text"]').should('contain.text', 'Loading reminders...')
    cy.wait('@getRemindersDelay')
    cy.get('[data-testid="loading-spinner"]').should('not.exist')
  })

  // Test 73: Mark reminder as completed
  it('should allow marking pending reminders as completed', () => {
    cy.get('[data-testid="reminder-card"]').contains('PENDING').parent().within(() => {
      cy.get('[data-testid="mark-completed-button"]').should('be.visible')
      cy.get('[data-testid="mark-completed-button"]').click()
    })
    cy.get('[data-testid="success-toast"]').should('contain.text', 'Reminder marked as completed')
  })

  // Test 74: Add administration notes
  it('should allow adding administration notes to reminders', () => {
    cy.get('[data-testid="reminder-card"]:first').within(() => {
      cy.get('[data-testid="add-notes-button"]').click()
    })
    cy.get('[data-testid="notes-modal"]').should('be.visible')
    cy.get('[data-testid="notes-textarea"]').type('Student took medication without issues')
    cy.get('[data-testid="save-notes-button"]').click()
    cy.get('[data-testid="success-toast"]').should('contain.text', 'Notes added successfully')
  })

  // Test 75: View reminder details
  it('should display reminder details when clicking on card', () => {
    cy.get('[data-testid="reminder-card"]:first').click()
    cy.get('[data-testid="reminder-details-modal"]').should('be.visible')
    cy.get('[data-testid="reminder-details-modal"]').within(() => {
      cy.get('[data-testid="student-details"]').should('be.visible')
      cy.get('[data-testid="medication-details"]').should('be.visible')
      cy.get('[data-testid="scheduled-time"]').should('be.visible')
      cy.get('[data-testid="administration-history"]').should('be.visible')
    })
  })

  // Test 76: Filter reminders by status
  it('should filter reminders by status', () => {
    cy.get('[data-testid="status-filter"]').should('be.visible')
    cy.get('[data-testid="status-filter"]').select('COMPLETED')
    cy.get('[data-testid="reminder-card"]').should('contain.text', 'COMPLETED')
    cy.get('[data-testid="reminder-card"]').should('not.contain.text', 'PENDING')
  })

  // Test 77: Auto-refresh reminders
  it('should automatically refresh reminders every minute', () => {
    cy.intercept('GET', '**/api/medications/reminders*').as('getReminders')
    cy.get('[data-testid="reminders-tab"]').click()
    cy.wait('@getReminders')
    
    // Wait for auto-refresh (should happen every 60 seconds in real app, shortened for test)
    cy.wait(61000)
    cy.get('@getReminders.all').should('have.length.greaterThan', 1)
  })

  // Test 78: Display overdue reminders
  it('should highlight overdue reminders', () => {
    cy.intercept('GET', '**/api/medications/reminders*', {
      body: {
        success: true,
        data: {
          reminders: [{
            id: '4',
            studentName: 'Overdue Student',
            medicationName: 'Overdue Med',
            dosage: '10mg',
            scheduledTime: new Date(Date.now() - 3600000).toISOString(),
            status: 'OVERDUE'
          }]
        }
      }
    }).as('getOverdueReminders')
    
    cy.reload()
    cy.get('[data-testid="reminders-tab"]').click()
    cy.wait('@getOverdueReminders')
    
    cy.get('[data-testid="overdue-indicator"]').should('be.visible')
    cy.get('[data-testid="overdue-indicator"]').should('have.class', 'text-red-600')
    cy.get('[data-testid="overdue-indicator"]').should('contain.text', 'OVERDUE')
  })

  // Test 79: Snooze reminder functionality
  it('should allow snoozing reminders for later', () => {
    cy.get('[data-testid="reminder-card"]').contains('PENDING').parent().within(() => {
      cy.get('[data-testid="snooze-button"]').click()
    })
    cy.get('[data-testid="snooze-modal"]').should('be.visible')
    cy.get('[data-testid="snooze-15min"]').click()
    cy.get('[data-testid="success-toast"]').should('contain.text', 'Reminder snoozed for 15 minutes')
  })

  // Test 80: Print medication schedule
  it('should allow printing daily medication schedule', () => {
    cy.get('[data-testid="print-schedule-button"]').should('be.visible')
    cy.get('[data-testid="print-schedule-button"]').click()
    cy.get('[data-testid="print-preview-modal"]').should('be.visible')
    cy.get('[data-testid="print-preview-modal"]').within(() => {
      cy.get('[data-testid="schedule-header"]').should('contain.text', 'Daily Medication Schedule')
      cy.get('[data-testid="print-confirm-button"]').should('be.visible')
    })
  })
})