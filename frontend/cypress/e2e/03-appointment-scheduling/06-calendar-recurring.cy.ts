/// <reference types="cypress" />

/**
 * Appointment Scheduling: Calendar View & Recurring Appointments (22 tests)
 *
 * Tests calendar navigation and recurring appointment functionality
 */

describe('Appointment Scheduling - Calendar View & Navigation', () => {
  beforeEach(() => {
    cy.login('nurse')
    cy.visit('/appointments')
  })

  it('should display calendar in month view by default', () => {
    cy.get('[data-testid=calendar-view]').should('be.visible')
    cy.get('[data-testid=calendar-month-view]').should('be.visible')
  })

  it('should navigate to next month when next button is clicked', () => {
    cy.get('[data-testid=current-period-display]').invoke('text').as('currentMonth')
    cy.get('[data-testid=next-period-button]').click()

    cy.get('@currentMonth').then((currentMonth) => {
      cy.get('[data-testid=current-period-display]').should('not.contain', currentMonth)
    })
  })

  it('should navigate to previous month when prev button is clicked', () => {
    cy.get('[data-testid=current-period-display]').invoke('text').as('currentMonth')
    cy.get('[data-testid=prev-period-button]').click()

    cy.get('@currentMonth').then((currentMonth) => {
      cy.get('[data-testid=current-period-display]').should('not.contain', currentMonth)
    })
  })

  it('should return to today when today button is clicked', () => {
    cy.get('[data-testid=next-period-button]').click()
    cy.get('[data-testid=next-period-button]').click()
    cy.get('[data-testid=today-button]').click()

    const today = new Date()
    const monthName = today.toLocaleString('default', { month: 'long' })
    cy.get('[data-testid=current-period-display]').should('contain', monthName)
  })

  it('should switch to week view', () => {
    cy.get('[data-testid=view-week-button]').click()
    cy.get('[data-testid=calendar-week-view]').should('be.visible')
  })

  it('should switch to day view', () => {
    cy.get('[data-testid=view-day-button]').click()
    cy.get('[data-testid=calendar-day-view]').should('be.visible')
  })

  it('should highlight today on calendar', () => {
    cy.get('[data-testid=today-highlight]').should('be.visible')
  })

  it('should display appointments on correct dates', () => {
    cy.get('[data-testid=appointment-event]').first().should('be.visible')
  })

  it('should show appointment count on calendar dates', () => {
    cy.get('[data-testid=date-appointment-count]').should('exist')
  })

  it('should allow clicking on date to create appointment', () => {
    cy.get('[data-testid=calendar-date-cell]').first().click()
    cy.get('[data-testid=appointment-modal]').should('be.visible')
  })

  it('should display color-coded appointments by type', () => {
    cy.get('[data-testid=appointment-event]').first().should('have.css', 'background-color')
  })

  it('should show calendar legend for appointment types', () => {
    cy.get('[data-testid=calendar-legend]').should('be.visible')
    cy.get('[data-testid=legend-item]').should('have.length.greaterThan', 0)
  })
})

describe('Appointment Scheduling - Recurring Appointments', () => {
  beforeEach(() => {
    cy.login('nurse')
    cy.visit('/appointments')
  })

  it('should display recurring appointment option', () => {
    cy.get('[data-testid=add-appointment-button]').click()
    cy.get('[data-testid=recurring-checkbox]').should('be.visible')
  })

  it('should show recurrence options when enabled', () => {
    cy.get('[data-testid=add-appointment-button]').click()
    cy.get('[data-testid=recurring-checkbox]').check()
    cy.get('[data-testid=recurrence-pattern]').should('be.visible')
  })

  it('should create daily recurring appointments', () => {
    cy.get('[data-testid=add-appointment-button]').click()
    cy.get('[data-testid=appointment-student-select]').select(1)
    cy.get('[data-testid=appointment-date]').type('2024-11-15')
    cy.get('[data-testid=appointment-time]').type('10:00')
    cy.get('[data-testid=appointment-type]').select('Medication')
    cy.get('[data-testid=recurring-checkbox]').check()
    cy.get('[data-testid=recurrence-pattern]').select('Daily')
    cy.get('[data-testid=recurrence-end-date]').type('2024-11-20')
    cy.get('[data-testid=save-appointment-button]').click()

    cy.get('[data-testid=success-message]').should('contain', 'Recurring appointments created')
  })

  it('should create weekly recurring appointments', () => {
    cy.get('[data-testid=add-appointment-button]').click()
    cy.get('[data-testid=appointment-student-select]').select(1)
    cy.get('[data-testid=appointment-date]').type('2024-11-15')
    cy.get('[data-testid=appointment-time]').type('14:00')
    cy.get('[data-testid=appointment-type]').select('Check-up')
    cy.get('[data-testid=recurring-checkbox]').check()
    cy.get('[data-testid=recurrence-pattern]').select('Weekly')
    cy.get('[data-testid=recurrence-end-date]').type('2024-12-15')
    cy.get('[data-testid=save-appointment-button]').click()

    cy.get('[data-testid=success-message]').should('be.visible')
  })

  it('should create monthly recurring appointments', () => {
    cy.get('[data-testid=add-appointment-button]').click()
    cy.get('[data-testid=appointment-student-select]').select(1)
    cy.get('[data-testid=appointment-date]').type('2024-11-15')
    cy.get('[data-testid=appointment-time]').type('09:00')
    cy.get('[data-testid=appointment-type]').select('Follow-up')
    cy.get('[data-testid=recurring-checkbox]').check()
    cy.get('[data-testid=recurrence-pattern]').select('Monthly')
    cy.get('[data-testid=recurrence-count]').type('6')
    cy.get('[data-testid=save-appointment-button]').click()

    cy.get('[data-testid=success-message]').should('be.visible')
  })

  it('should display recurring indicator on appointments', () => {
    cy.get('[data-testid=recurring-appointment-icon]').should('exist')
  })

  it('should allow editing single occurrence', () => {
    cy.get('[data-testid=recurring-appointment-icon]').first().click()
    cy.get('[data-testid=edit-occurrence-option]').click()
    cy.get('[data-testid=appointment-modal]').should('be.visible')
  })

  it('should allow editing all occurrences', () => {
    cy.get('[data-testid=recurring-appointment-icon]').first().click()
    cy.get('[data-testid=edit-series-option]').click()
    cy.get('[data-testid=appointment-modal]').should('be.visible')
  })

  it('should validate recurrence end date', () => {
    cy.get('[data-testid=add-appointment-button]').click()
    cy.get('[data-testid=appointment-student-select]').select(1)
    cy.get('[data-testid=appointment-date]').type('2024-11-15')
    cy.get('[data-testid=appointment-time]').type('10:00')
    cy.get('[data-testid=recurring-checkbox]').check()
    cy.get('[data-testid=recurrence-end-date]').type('2024-11-10')
    cy.get('[data-testid=save-appointment-button]').click()

    cy.get('[data-testid=recurrence-error]').should('contain', 'End date must be after start date')
  })

  it('should cancel recurring series', () => {
    cy.get('[data-testid=recurring-appointment-icon]').first().click()
    cy.get('[data-testid=cancel-series-option]').click()
    cy.get('[data-testid=cancellation-reason]').type('No longer needed')
    cy.get('[data-testid=confirm-cancel-button]').click()

    cy.get('[data-testid=success-message]').should('contain', 'Recurring series cancelled')
  })
})
