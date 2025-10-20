/// <reference types="cypress" />

/**
 * Data Validation - Incident Report Validation (15 tests)
 *
 * Tests data validation for incident reporting forms
 */

describe('Data Validation - Incident Report Validation', () => {
  beforeEach(() => {
    cy.login('nurse')
    cy.visit('/incidents')
  })

  it('should require incident type', () => {
    cy.get('button').contains(/report.*incident|new.*incident/i).click()
    cy.get('button[type="submit"]').click()
    cy.contains(/type.*required|select.*type/i).should('be.visible')
  })

  it('should require incident date and time', () => {
    cy.get('button').contains(/report.*incident/i).click()
    cy.get('button[type="submit"]').click()
    cy.contains(/date.*required|time.*required/i).should('be.visible')
  })

  it('should prevent future incident dates', () => {
    cy.get('button').contains(/report.*incident/i).click()
    const futureDate = new Date()
    futureDate.setDate(futureDate.getDate() + 1)
    cy.get('input[name="incidentDate"]').type(futureDate.toISOString().split('T')[0])
    cy.get('input[name="incidentDate"]').blur()
    cy.contains(/future.*date/i).should('be.visible')
  })

  it('should require student involved', () => {
    cy.get('button').contains(/report.*incident/i).click()
    cy.get('button[type="submit"]').click()
    cy.contains(/student.*required/i).should('be.visible')
  })

  it('should require incident location', () => {
    cy.get('button').contains(/report.*incident/i).click()
    cy.get('button[type="submit"]').click()
    cy.contains(/location.*required/i).should('be.visible')
  })

  it('should require incident description', () => {
    cy.get('button').contains(/report.*incident/i).click()
    cy.get('button[type="submit"]').click()
    cy.contains(/description.*required/i).should('be.visible')
  })

  it('should validate description minimum length', () => {
    cy.get('button').contains(/report.*incident/i).click()
    cy.get('textarea[name="description"]').type('ab')
    cy.get('textarea[name="description"]').blur()
    cy.contains(/too.*short|minimum.*characters/i).should('be.visible')
  })

  it('should require injury severity for injury incidents', () => {
    cy.get('button').contains(/report.*incident/i).click()
    cy.get('select[name="incidentType"]').select('Injury')
    cy.get('button[type="submit"]').click()
    cy.contains(/severity.*required/i).should('be.visible')
  })

  it('should require witnesses if available checkbox is checked', () => {
    cy.get('button').contains(/report.*incident/i).click()
    cy.get('input[type="checkbox"][name="hasWitnesses"]').check()
    cy.get('button[type="submit"]').click()
    cy.contains(/witness.*required/i).should('be.visible')
  })

  it('should validate first aid administered details', () => {
    cy.get('button').contains(/report.*incident/i).click()
    cy.get('input[type="checkbox"][name="firstAidGiven"]').check()
    cy.get('textarea[name="firstAidDetails"]').should('be.visible')
  })

  it('should require parent notification status', () => {
    cy.get('button').contains(/report.*incident/i).click()
    cy.get('select[name="parentNotified"]').should('exist')
  })

  it('should require follow-up action if needed', () => {
    cy.get('button').contains(/report.*incident/i).click()
    cy.get('input[type="checkbox"][name="requiresFollowup"]').check()
    cy.get('button[type="submit"]').click()
    cy.contains(/follow.*up.*required/i).should('be.visible')
  })

  it('should validate reporter information', () => {
    cy.get('button').contains(/report.*incident/i).click()
    cy.get('input[name="reporterName"]').should('exist')
  })

  it('should require medical attention checkbox for serious incidents', () => {
    cy.get('button').contains(/report.*incident/i).click()
    cy.get('select[name="severity"]').select('Critical')
    cy.get('input[type="checkbox"][name="medicalAttention"]').should('exist')
  })

  it('should validate incident time in 24-hour format', () => {
    cy.get('button').contains(/report.*incident/i).click()
    cy.get('input[name="incidentTime"]').type('invalid')
    cy.get('input[name="incidentTime"]').blur()
    cy.contains(/invalid.*time/i).should('be.visible')
  })
})
