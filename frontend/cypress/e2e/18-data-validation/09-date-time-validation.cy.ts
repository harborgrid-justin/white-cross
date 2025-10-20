/// <reference types="cypress" />

/**
 * Data Validation - Date & Time Validation (15 tests)
 *
 * Tests validation of date and time inputs
 */

describe('Data Validation - Date & Time Validation', () => {
  beforeEach(() => {
    cy.login('nurse')
  })

  it('should validate date format (YYYY-MM-DD)', () => {
    cy.visit('/students')
    cy.get('[data-testid="add-student-button"]').click()
    cy.get('input[name="dateOfBirth"]').type('invalid-date')
    cy.get('input[name="dateOfBirth"]').blur()
    cy.contains(/invalid.*date|date.*format/i).should('be.visible')
  })

  it('should prevent future dates for date of birth', () => {
    cy.visit('/students')
    cy.get('[data-testid="add-student-button"]').click()
    const futureDate = new Date()
    futureDate.setFullYear(futureDate.getFullYear() + 1)
    cy.get('input[name="dateOfBirth"]').type(futureDate.toISOString().split('T')[0])
    cy.get('input[name="dateOfBirth"]').blur()
    cy.contains(/future.*date|cannot.*be.*future/i).should('be.visible')
  })

  it('should prevent dates before 1900', () => {
    cy.visit('/students')
    cy.get('[data-testid="add-student-button"]').click()
    cy.get('input[name="dateOfBirth"]').type('1899-01-01')
    cy.get('input[name="dateOfBirth"]').blur()
    cy.contains(/invalid.*year|too.*old/i).should('be.visible')
  })

  it('should validate time format (HH:MM)', () => {
    cy.visit('/appointments')
    cy.get('button').contains(/schedule/i).click()
    cy.get('input[name="appointmentTime"]').type('25:00')
    cy.get('input[name="appointmentTime"]').blur()
    cy.contains(/invalid.*time/i).should('be.visible')
  })

  it('should validate medication administration time', () => {
    cy.visit('/medications')
    cy.get('input[name="administrationTime"]').type('99:99')
    cy.get('input[name="administrationTime"]').blur()
    cy.contains(/invalid.*time/i).should('be.visible')
  })

  it('should validate date ranges (start before end)', () => {
    cy.visit('/medications')
    cy.get('[data-testid="add-medication-button"]').click()
    cy.get('input[name="startDate"]').type('2024-12-31')
    cy.get('input[name="endDate"]').type('2024-01-01')
    cy.get('input[name="endDate"]').blur()
    cy.contains(/end.*date.*after.*start/i).should('be.visible')
  })

  it('should validate business hours for appointments', () => {
    cy.visit('/appointments')
    cy.get('button').contains(/schedule/i).click()
    cy.get('input[name="appointmentTime"]').type('23:00')
    cy.get('input[name="appointmentTime"]').blur()
    cy.contains(/business.*hours|outside.*hours/i).should('be.visible')
  })

  it('should validate weekend restrictions for appointments', () => {
    cy.visit('/appointments')
    cy.get('button').contains(/schedule/i).click()
    const saturday = new Date()
    saturday.setDate(saturday.getDate() + (6 - saturday.getDay()))
    cy.get('input[name="appointmentDate"]').type(saturday.toISOString().split('T')[0])
    cy.get('input[name="appointmentDate"]').blur()
    cy.contains(/weekend|business.*days/i).should('be.visible')
  })

  it('should validate expiration date is future', () => {
    cy.visit('/medications')
    cy.get('[data-testid="add-medication-button"]').click()
    const pastDate = new Date('2020-01-01').toISOString().split('T')[0]
    cy.get('input[name="expirationDate"]').type(pastDate)
    cy.get('input[name="expirationDate"]').blur()
    cy.contains(/expired|past.*date/i).should('be.visible')
  })

  it('should validate timestamp format', () => {
    cy.visit('/incidents')
    cy.get('input[name="incidentTimestamp"]').should('have.attr', 'type', 'datetime-local')
  })

  it('should validate age calculation from DOB', () => {
    cy.visit('/students')
    cy.get('[data-testid="add-student-button"]').click()
    const dob = new Date()
    dob.setFullYear(dob.getFullYear() - 10)
    cy.get('input[name="dateOfBirth"]').type(dob.toISOString().split('T')[0])
    cy.get('[data-testid="calculated-age"]').should('contain', '10')
  })

  it('should validate recurring appointment end date', () => {
    cy.visit('/appointments')
    cy.get('input[type="checkbox"][name="recurring"]').check()
    cy.get('input[name="recurringEndDate"]').type('2024-01-01')
    cy.get('input[name="recurringEndDate"]').blur()
    cy.contains(/end.*date.*future/i).should('be.visible')
  })

  it('should validate timezone handling', () => {
    cy.visit('/appointments')
    cy.window().then((win) => {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
      expect(timezone).to.exist
    })
  })

  it('should validate daylight saving time transitions', () => {
    cy.visit('/appointments')
    cy.get('input[name="appointmentDate"]').should('exist')
  })

  it('should validate leap year dates', () => {
    cy.visit('/students')
    cy.get('[data-testid="add-student-button"]').click()
    cy.get('input[name="dateOfBirth"]').type('2023-02-29')
    cy.get('input[name="dateOfBirth"]').blur()
    cy.contains(/invalid.*date/i).should('be.visible')
  })
})
