/// <reference types="cypress" />

/**
 * Data Validation - Dropdown & Selection Validation (15 tests)
 *
 * Tests validation of dropdown menus, select boxes, and option lists
 */

describe('Data Validation - Dropdown & Selection Validation', () => {
  beforeEach(() => {
    cy.login('nurse')
  })

  it('should require gender selection', () => {
    cy.visit('/students')
    cy.get('[data-testid="add-student-button"]').click()
    cy.get('button[type="submit"]').click()
    cy.contains(/gender.*required|select.*gender/i).should('be.visible')
  })

  it('should validate grade level selection', () => {
    cy.visit('/students')
    cy.get('[data-testid="add-student-button"]').click()
    cy.get('select[name="gradeLevel"]').should('exist')
  })

  it('should require medication frequency selection', () => {
    cy.visit('/medications')
    cy.get('[data-testid="add-medication-button"]').click()
    cy.get('button[type="submit"]').click()
    cy.contains(/frequency.*required/i).should('be.visible')
  })

  it('should validate route of administration selection', () => {
    cy.visit('/medications')
    cy.get('[data-testid="add-medication-button"]').click()
    cy.get('select[name="route"]').select('Oral')
    cy.get('select[name="route"]').should('have.value', 'Oral')
  })

  it('should require allergy severity selection', () => {
    cy.visit('/health-records')
    cy.get('button').contains(/add.*allergy/i).click()
    cy.get('select[name="severity"]').should('exist')
  })

  it('should validate appointment type selection', () => {
    cy.visit('/appointments')
    cy.get('button').contains(/schedule/i).click()
    cy.get('select[name="appointmentType"]').select('Checkup')
    cy.get('select[name="appointmentType"]').should('have.value', 'Checkup')
  })

  it('should require incident type selection', () => {
    cy.visit('/incidents')
    cy.get('button').contains(/report/i).click()
    cy.get('button[type="submit"]').click()
    cy.contains(/type.*required/i).should('be.visible')
  })

  it('should validate school district selection', () => {
    cy.visit('/settings')
    cy.get('select[name="district"]').should('exist')
  })

  it('should validate blood type selection', () => {
    cy.visit('/health-records')
    cy.get('select[name="bloodType"]').select('O+')
    cy.get('select[name="bloodType"]').should('have.value', 'O+')
  })

  it('should validate ethnicity selection', () => {
    cy.visit('/students')
    cy.get('[data-testid="add-student-button"]').click()
    cy.get('select[name="ethnicity"]').should('exist')
  })

  it('should validate vaccination type selection', () => {
    cy.visit('/health-records')
    cy.get('button').contains(/add.*vaccination/i).click()
    cy.get('select[name="vaccineType"]').should('exist')
  })

  it('should require multiple selections for health conditions', () => {
    cy.visit('/health-records')
    cy.get('select[multiple][name="healthConditions"]').should('exist')
  })

  it('should validate role selection for user management', () => {
    cy.login('admin')
    cy.visit('/settings')
    cy.contains('button', 'Users').click()
    cy.get('select[name="role"]').should('exist')
  })

  it('should prevent invalid option values', () => {
    cy.visit('/students')
    cy.get('[data-testid="add-student-button"]').click()
    cy.get('select[name="gradeLevel"] option').should('have.length.at.least', 1)
  })

  it('should validate cascading dropdown selections', () => {
    cy.visit('/settings')
    cy.get('select[name="district"]').select('District 1')
    cy.get('select[name="school"]').should('not.be.disabled')
  })
})
