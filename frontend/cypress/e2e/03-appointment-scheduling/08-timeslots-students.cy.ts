/// <reference types="cypress" />

/**
 * Appointment Scheduling: Time Slots & Student Association (16 tests)
 *
 * Tests time slot management and student association features
 */

describe('Appointment Scheduling - Time Slot Management', () => {
  beforeEach(() => {
    cy.login('nurse')
    cy.visit('/appointments')
  })

  it('should display available time slots', () => {
    cy.get('[data-testid=add-appointment-button]').click()
    cy.get('[data-testid=appointment-date]').type('2024-12-01')
    cy.get('[data-testid=available-slots]').should('be.visible')
  })

  it('should show time slots in chronological order', () => {
    cy.get('[data-testid=add-appointment-button]').click()
    cy.get('[data-testid=appointment-date]').type('2024-12-01')
    cy.get('[data-testid=time-slot]').first().should('contain', '08:00')
  })

  it('should mark booked slots as unavailable', () => {
    cy.get('[data-testid=add-appointment-button]').click()
    cy.get('[data-testid=appointment-date]').type('2024-11-15')
    cy.get('[data-testid=time-slot-booked]').should('exist')
  })

  it('should allow selecting available time slot', () => {
    cy.get('[data-testid=add-appointment-button]').click()
    cy.get('[data-testid=appointment-date]').type('2024-12-01')
    cy.get('[data-testid=time-slot-available]').first().click()
    cy.get('[data-testid=appointment-time]').should('not.have.value', '')
  })

  it('should prevent double-booking', () => {
    cy.get('[data-testid=add-appointment-button]').click()
    cy.get('[data-testid=appointment-student-select]').select(1)
    cy.get('[data-testid=appointment-date]').type('2024-11-15')
    cy.get('[data-testid=appointment-time]').type('10:00')
    cy.get('[data-testid=appointment-type]').select('Check-up')
    cy.get('[data-testid=save-appointment-button]').click()

    cy.get('[data-testid=error-message]').should('contain', 'Time slot already booked')
  })

  it('should display slot duration options', () => {
    cy.get('[data-testid=add-appointment-button]').click()
    cy.get('[data-testid=appointment-duration]').should('be.visible')
  })

  it('should show buffer time between appointments', () => {
    cy.get('[data-testid=add-appointment-button]').click()
    cy.get('[data-testid=appointment-date]').type('2024-12-01')
    cy.get('[data-testid=buffer-time-indicator]').should('exist')
  })

  it('should display slot capacity indicator', () => {
    cy.get('[data-testid=add-appointment-button]').click()
    cy.get('[data-testid=appointment-date]').type('2024-12-01')
    cy.get('[data-testid=slot-capacity]').should('be.visible')
  })
})

describe('Appointment Scheduling - Student Association', () => {
  beforeEach(() => {
    cy.login('nurse')
    cy.visit('/appointments')
  })

  it('should display student selection dropdown', () => {
    cy.get('[data-testid=add-appointment-button]').click()
    cy.get('[data-testid=appointment-student-select]').should('be.visible')
  })

  it('should list all active students', () => {
    cy.get('[data-testid=add-appointment-button]').click()
    cy.get('[data-testid=appointment-student-select] option').should('have.length.greaterThan', 1)
  })

  it('should display student medical information', () => {
    cy.get('[data-testid=add-appointment-button]').click()
    cy.get('[data-testid=appointment-student-select]').select(1)
    cy.get('[data-testid=student-medical-info]').should('be.visible')
  })

  it('should show student allergies when selected', () => {
    cy.get('[data-testid=add-appointment-button]').click()
    cy.get('[data-testid=appointment-student-select]').select(1)
    cy.get('[data-testid=student-allergies]').should('be.visible')
  })

  it('should display student current medications', () => {
    cy.get('[data-testid=add-appointment-button]').click()
    cy.get('[data-testid=appointment-student-select]').select(1)
    cy.get('[data-testid=student-medications]').should('be.visible')
  })

  it('should filter appointments by student', () => {
    cy.get('[data-testid=filter-button]').click()
    cy.get('[data-testid=student-filter]').select(1)
    cy.get('[data-testid=apply-filters-button]').click()

    cy.get('[data-testid=appointment-event]').should('have.length.greaterThan', 0)
  })

  it('should show student appointment history', () => {
    cy.get('[data-testid=appointment-event]').first().click()
    cy.get('[data-testid=view-student-history]').click()
    cy.get('[data-testid=student-appointment-history]').should('be.visible')
  })

  it('should link to student profile from appointment', () => {
    cy.get('[data-testid=appointment-event]').first().click()
    cy.get('[data-testid=student-profile-link]').click()
    cy.url().should('include', '/students/')
  })
})
