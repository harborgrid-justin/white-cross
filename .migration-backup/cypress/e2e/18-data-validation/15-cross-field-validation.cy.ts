/// <reference types="cypress" />

/**
 * Data Validation - Cross-Field & Business Rules Validation (15 tests)
 *
 * Tests validation rules that depend on multiple fields and business logic
 */

describe('Data Validation - Cross-Field & Business Rules Validation', () => {
  beforeEach(() => {
    cy.login('nurse')
  })

  it('should validate end date is after start date', () => {
    cy.visit('/medications')
    cy.get('[data-testid="add-medication-button"]').click()
    cy.get('input[name="startDate"]').type('2024-12-31')
    cy.get('input[name="endDate"]').type('2024-01-01')
    cy.get('button[type="submit"]').click()
    cy.contains(/end.*date.*after.*start/i).should('be.visible')
  })

  it('should validate student age matches grade level', () => {
    cy.visit('/students')
    cy.get('[data-testid="add-student-button"]').click()
    const dob = new Date()
    dob.setFullYear(dob.getFullYear() - 5)
    cy.get('input[name="dateOfBirth"]').type(dob.toISOString().split('T')[0])
    cy.get('select[name="gradeLevel"]').select('12')
    cy.get('button[type="submit"]').click()
    cy.contains(/age.*does.*not.*match.*grade/i).should('be.visible')
  })

  it('should validate appointment duration matches type', () => {
    cy.visit('/appointments')
    cy.get('button').contains(/schedule/i).click()
    cy.get('select[name="appointmentType"]').select('Quick Checkup')
    cy.get('input[name="duration"]').type('120')
    cy.get('button[type="submit"]').click()
    cy.contains(/duration.*too.*long/i).should('be.visible')
  })

  it('should validate medication dosage matches patient weight', () => {
    cy.visit('/medications')
    cy.get('[data-testid="add-medication-button"]').click()
    cy.get('input[name="dosage"]').type('1000')
    cy.get('select[name="unit"]').select('mg')
    cy.contains(/exceeds.*recommended.*dosage/i).should('exist')
  })

  it('should validate vaccination age requirements', () => {
    cy.visit('/health-records')
    cy.get('button').contains(/add.*vaccination/i).click()
    cy.get('select[name="vaccineType"]').select('Senior Vaccine')
    cy.contains(/age.*requirement|too.*young/i).should('exist')
  })

  it('should validate conflicting allergies and medications', () => {
    cy.visit('/medications')
    cy.get('[data-testid="add-medication-button"]').click()
    cy.get('input[name="medicationName"]').type('Penicillin')
    cy.contains(/allergy.*warning|contraindicated/i).should('exist')
  })

  it('should validate incident severity matches description', () => {
    cy.visit('/incidents')
    cy.get('button').contains(/report/i).click()
    cy.get('select[name="severity"]').select('Critical')
    cy.get('input[type="checkbox"][name="medicalAttention"]').should('be.checked')
  })

  it('should validate emergency contact relationship', () => {
    cy.visit('/students')
    cy.get('[data-testid="add-student-button"]').click()
    cy.get('select[name="relationship"]').select('Parent')
    cy.get('input[type="checkbox"][name="isPrimaryContact"]').should('exist')
  })

  it('should validate medication frequency matches schedule', () => {
    cy.visit('/medications')
    cy.get('[data-testid="add-medication-button"]').click()
    cy.get('select[name="frequency"]').select('Daily')
    cy.get('input[name="timesPerDay"]').type('0')
    cy.get('button[type="submit"]').click()
    cy.contains(/times.*per.*day.*required/i).should('be.visible')
  })

  it('should validate appointment time slot availability', () => {
    cy.visit('/appointments')
    cy.get('button').contains(/schedule/i).click()
    cy.get('input[name="appointmentDate"]').type('2024-12-15')
    cy.get('input[name="appointmentTime"]').type('10:00')
    cy.get('input[name="duration"]').type('60')
    cy.contains(/time.*slot.*unavailable|conflict/i).should('exist')
  })

  it('should validate medication expiration before start date', () => {
    cy.visit('/medications')
    cy.get('[data-testid="add-medication-button"]').click()
    cy.get('input[name="startDate"]').type('2024-12-01')
    cy.get('input[name="expirationDate"]').type('2024-11-01')
    cy.get('button[type="submit"]').click()
    cy.contains(/expiration.*before.*start/i).should('be.visible')
  })

  it('should validate health screening results match test type', () => {
    cy.visit('/health-records')
    cy.get('button').contains(/add.*screening/i).click()
    cy.get('select[name="screeningType"]').select('Vision')
    cy.get('input[name="result"]').type('20/20')
    cy.get('input[name="result"]').should('be.visible')
  })

  it('should validate student graduation date matches grade', () => {
    cy.visit('/students')
    cy.get('[data-testid="add-student-button"]').click()
    cy.get('select[name="gradeLevel"]').select('12')
    const nextYear = new Date()
    nextYear.setFullYear(nextYear.getFullYear() + 1)
    cy.get('input[name="graduationDate"]').type(nextYear.toISOString().split('T')[0])
    cy.get('input[name="graduationDate"]').should('be.visible')
  })

  it('should validate recurring appointment end date is set', () => {
    cy.visit('/appointments')
    cy.get('button').contains(/schedule/i).click()
    cy.get('input[type="checkbox"][name="recurring"]').check()
    cy.get('button[type="submit"]').click()
    cy.contains(/end.*date.*required/i).should('be.visible')
  })

  it('should validate total medication quantity matches refills', () => {
    cy.visit('/medications')
    cy.get('[data-testid="add-medication-button"]').click()
    cy.get('input[name="quantity"]').type('30')
    cy.get('input[name="refillsRemaining"]').type('3')
    cy.get('input[name="totalQuantity"]').should('have.value', '120')
  })
})
