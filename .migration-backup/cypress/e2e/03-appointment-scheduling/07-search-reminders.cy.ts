/// <reference types="cypress" />

/**
 * Appointment Scheduling: Search, Filtering & Reminders (18 tests)
 *
 * Tests search/filter functionality and reminder features
 */

describe('Appointment Scheduling - Appointment Search & Filtering', () => {
  beforeEach(() => {
    cy.login('nurse')
    cy.visit('/appointments')
  })

  it('should display search input', () => {
    cy.get('[data-testid=appointment-search]').should('be.visible')
  })

  it('should filter appointments by student name', () => {
    cy.get('[data-testid=appointment-search]').type('John')
    cy.get('[data-testid=appointment-event]').should('contain', 'John')
  })

  it('should filter appointments by type', () => {
    cy.get('[data-testid=filter-button]').click()
    cy.get('[data-testid=type-filter]').select('Check-up')
    cy.get('[data-testid=apply-filters-button]').click()

    cy.get('[data-testid=appointment-event]').each(($event) => {
      cy.wrap($event).should('contain', 'Check-up')
    })
  })

  it('should filter appointments by status', () => {
    cy.get('[data-testid=filter-button]').click()
    cy.get('[data-testid=status-filter]').select('Scheduled')
    cy.get('[data-testid=apply-filters-button]').click()

    cy.get('[data-testid=appointment-event]').should('exist')
  })

  it('should filter appointments by date range', () => {
    cy.get('[data-testid=filter-button]').click()
    cy.get('[data-testid=start-date-filter]').type('2024-11-01')
    cy.get('[data-testid=end-date-filter]').type('2024-11-30')
    cy.get('[data-testid=apply-filters-button]').click()

    cy.get('[data-testid=appointment-event]').should('have.length.greaterThan', 0)
  })

  it('should clear all filters', () => {
    cy.get('[data-testid=filter-button]').click()
    cy.get('[data-testid=type-filter]').select('Check-up')
    cy.get('[data-testid=apply-filters-button]').click()

    cy.get('[data-testid=clear-filters-button]').click()
    cy.get('[data-testid=appointment-event]').should('have.length.greaterThan', 0)
  })

  it('should show no results message when no matches', () => {
    cy.get('[data-testid=appointment-search]').type('NonexistentStudent12345')
    cy.get('[data-testid=no-results-message]').should('be.visible')
    cy.get('[data-testid=no-results-message]').should('contain', 'No appointments found')
  })

  it('should display active filter badges', () => {
    cy.get('[data-testid=filter-button]').click()
    cy.get('[data-testid=type-filter]').select('Follow-up')
    cy.get('[data-testid=apply-filters-button]').click()

    cy.get('[data-testid=filter-badge]').should('be.visible')
    cy.get('[data-testid=filter-badge]').should('contain', 'Follow-up')
  })

  it('should filter by upcoming appointments only', () => {
    cy.get('[data-testid=upcoming-only-filter]').check()
    cy.get('[data-testid=appointment-event]').should('have.length.greaterThan', 0)
  })

  it('should persist filters when switching views', () => {
    cy.get('[data-testid=filter-button]').click()
    cy.get('[data-testid=type-filter]').select('Vaccination')
    cy.get('[data-testid=apply-filters-button]').click()

    cy.get('[data-testid=view-list-button]').click()
    cy.get('[data-testid=filter-badge]').should('contain', 'Vaccination')
  })
})

describe('Appointment Scheduling - Appointment Reminders & Notifications', () => {
  beforeEach(() => {
    cy.login('nurse')
    cy.visit('/appointments')
  })

  it('should display reminder settings in appointment form', () => {
    cy.get('[data-testid=add-appointment-button]').click()
    cy.get('[data-testid=reminder-settings]').should('be.visible')
  })

  it('should enable email reminder', () => {
    cy.get('[data-testid=add-appointment-button]').click()
    cy.get('[data-testid=email-reminder-checkbox]').check()
    cy.get('[data-testid=email-reminder-checkbox]').should('be.checked')
  })

  it('should enable SMS reminder', () => {
    cy.get('[data-testid=add-appointment-button]').click()
    cy.get('[data-testid=sms-reminder-checkbox]').check()
    cy.get('[data-testid=sms-reminder-checkbox]').should('be.checked')
  })

  it('should set reminder time before appointment', () => {
    cy.get('[data-testid=add-appointment-button]').click()
    cy.get('[data-testid=email-reminder-checkbox]').check()
    cy.get('[data-testid=reminder-time]').select('24 hours before')
    cy.get('[data-testid=reminder-time]').should('have.value', '24')
  })

  it('should display upcoming reminders list', () => {
    cy.get('[data-testid=reminders-button]').click()
    cy.get('[data-testid=reminders-list]').should('be.visible')
  })

  it('should send reminder on appointment creation', () => {
    cy.intercept('POST', '/api/reminders').as('sendReminder')

    cy.fixture('appointments').then((appointments) => {
      const newAppointment = appointments.testAppointment1

      cy.get('[data-testid=add-appointment-button]').click()
      cy.get('[data-testid=appointment-student-select]').select(newAppointment.studentName)
      cy.get('[data-testid=appointment-date]').type(newAppointment.date)
      cy.get('[data-testid=appointment-time]').type(newAppointment.time)
      cy.get('[data-testid=appointment-type]').select(newAppointment.type)
      cy.get('[data-testid=email-reminder-checkbox]').check()
      cy.get('[data-testid=save-appointment-button]').click()

      cy.wait('@sendReminder')
    })
  })

  it('should show notification preferences', () => {
    cy.get('[data-testid=notification-settings-button]').click()
    cy.get('[data-testid=notification-preferences]').should('be.visible')
  })

  it('should display confirmation notification after appointment', () => {
    cy.get('[data-testid=appointment-event]').first().click()
    cy.get('[data-testid=mark-completed-button]').click()
    cy.get('[data-testid=success-message]').should('contain', 'Appointment completed')
  })
})
