/// <reference types="cypress" />

/**
 * Data Validation - Appointment Form Validation (15 tests)
 *
 * Tests data validation rules for appointment scheduling forms
 */

describe('Data Validation - Appointment Form Validation', () => {
  beforeEach(() => {
    cy.login('nurse')
    cy.visit('/appointments')
  })

  it('should require student selection', () => {
    cy.get('button').contains(/schedule|new.*appointment/i).click()
    cy.get('button[type="submit"]').click()
    cy.contains(/student.*required|select.*student/i).should('be.visible')
  })

  it('should require appointment date', () => {
    cy.get('button').contains(/schedule|new.*appointment/i).click()
    cy.get('button[type="submit"]').click()
    cy.contains(/date.*required/i).should('be.visible')
  })

  it('should require appointment time', () => {
    cy.get('button').contains(/schedule|new.*appointment/i).click()
    cy.get('button[type="submit"]').click()
    cy.contains(/time.*required/i).should('be.visible')
  })

  it('should prevent past appointment dates', () => {
    cy.get('button').contains(/schedule|new.*appointment/i).click()
    const pastDate = new Date('2020-01-01').toISOString().split('T')[0]
    cy.get('input[name="appointmentDate"]').type(pastDate)
    cy.get('input[name="appointmentDate"]').blur()
    cy.contains(/past.*date|future.*date.*required/i).should('be.visible')
  })

  it('should validate appointment time slots', () => {
    cy.get('button').contains(/schedule|new.*appointment/i).click()
    cy.get('input[name="appointmentTime"]').type('25:00')
    cy.get('input[name="appointmentTime"]').blur()
    cy.contains(/invalid.*time/i).should('be.visible')
  })

  it('should require appointment type', () => {
    cy.get('button').contains(/schedule|new.*appointment/i).click()
    cy.get('button[type="submit"]').click()
    cy.contains(/type.*required|select.*type/i).should('be.visible')
  })

  it('should validate appointment duration', () => {
    cy.get('button').contains(/schedule|new.*appointment/i).click()
    cy.get('input[name="duration"]').type('0')
    cy.get('input[name="duration"]').blur()
    cy.contains(/invalid.*duration|duration.*greater/i).should('be.visible')
  })

  it('should check for scheduling conflicts', () => {
    cy.get('button').contains(/schedule|new.*appointment/i).click()
    cy.get('input[name="appointmentDate"]').type('2024-12-15')
    cy.get('input[name="appointmentTime"]').type('10:00')
    cy.get('input[name="appointmentTime"]').blur()
    cy.contains(/conflict|already.*scheduled/i).should('exist')
  })

  it('should validate business hours', () => {
    cy.get('button').contains(/schedule|new.*appointment/i).click()
    cy.get('input[name="appointmentTime"]').type('23:00')
    cy.get('input[name="appointmentTime"]').blur()
    cy.contains(/business.*hours|outside.*hours/i).should('be.visible')
  })

  it('should require reason for appointment', () => {
    cy.get('button').contains(/schedule|new.*appointment/i).click()
    cy.get('button[type="submit"]').click()
    cy.contains(/reason.*required|purpose.*required/i).should('be.visible')
  })

  it('should validate notes field length', () => {
    cy.get('button').contains(/schedule|new.*appointment/i).click()
    const longText = 'a'.repeat(1001)
    cy.get('textarea[name="notes"]').type(longText)
    cy.get('textarea[name="notes"]').blur()
    cy.contains(/too.*long|maximum.*length/i).should('be.visible')
  })

  it('should validate location/room selection', () => {
    cy.get('button').contains(/schedule|new.*appointment/i).click()
    cy.get('select[name="location"]').should('exist')
  })

  it('should prevent double booking', () => {
    cy.get('button').contains(/schedule|new.*appointment/i).click()
    cy.get('input[name="appointmentDate"]').type('2024-12-15')
    cy.get('input[name="appointmentTime"]').type('10:00')
    cy.contains(/unavailable|already.*booked/i).should('exist')
  })

  it('should validate recurring appointment settings', () => {
    cy.get('button').contains(/schedule|new.*appointment/i).click()
    cy.get('input[type="checkbox"][name="recurring"]').check()
    cy.get('select[name="frequency"]').should('be.visible')
  })

  it('should require end date for recurring appointments', () => {
    cy.get('button').contains(/schedule|new.*appointment/i).click()
    cy.get('input[type="checkbox"][name="recurring"]').check()
    cy.get('button[type="submit"]').click()
    cy.contains(/end.*date.*required/i).should('be.visible')
  })
})
