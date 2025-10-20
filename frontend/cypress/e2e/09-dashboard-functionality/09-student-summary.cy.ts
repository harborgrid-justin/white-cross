/// <reference types="cypress" />

/**
 * Dashboard - Student Summary (15 tests)
 *
 * Tests student population statistics and summaries
 */

describe('Dashboard - Student Summary', () => {
  beforeEach(() => {
    cy.login('nurse')
    cy.visit('/dashboard')
  })

  it('should display total student count', () => {
    cy.contains(/total.*students|\d+.*students/i).should('be.visible')
  })

  it('should show students by grade level', () => {
    cy.contains(/grade|k-12|elementary/i).should('exist')
  })

  it('should display active students count', () => {
    cy.contains(/active.*students/i).should('exist')
  })

  it('should show students with active health conditions', () => {
    cy.contains(/health.*conditions|chronic/i).should('exist')
  })

  it('should display students with allergies count', () => {
    cy.contains(/allergies|allergic/i).should('exist')
  })

  it('should show students on medications', () => {
    cy.contains(/on.*medications|taking.*medications/i).should('exist')
  })

  it('should display gender distribution', () => {
    cy.contains(/male|female|gender/i).should('exist')
  })

  it('should show enrollment trends', () => {
    cy.contains(/enrollment|trend/i).should('exist')
  })

  it('should display students requiring screenings', () => {
    cy.contains(/screening.*due|pending.*screenings/i).should('exist')
  })

  it('should show students with special needs', () => {
    cy.contains(/special.*needs|iep|504/i).should('exist')
  })

  it('should display student attendance summary', () => {
    cy.contains(/attendance|absent/i).should('exist')
  })

  it('should show recent student additions', () => {
    cy.contains(/new.*students|recently.*added/i).should('exist')
  })

  it('should display student health risk indicators', () => {
    cy.get('[class*="risk"], [class*="high-risk"]').should('exist')
  })

  it('should have link to full student list', () => {
    cy.get('a, button').contains(/view.*students|all.*students/i).should('exist')
  })

  it('should show student demographics breakdown', () => {
    cy.contains(/demographics|breakdown/i).should('exist')
  })
})
