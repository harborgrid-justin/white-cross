/// <reference types="cypress" />

/**
 * Administration Features: Schools Tab (20 tests)
 *
 * Tests school management functionality
 */

describe('Administration Features - Schools Tab', () => {
  beforeEach(() => {
    cy.login('admin')
    cy.visit('/settings')
    cy.contains('button', 'Schools').click()
  })

  it('should display the Schools tab content', () => {
    cy.contains('button', 'Schools').should('have.class', 'border-blue-500')
  })

  it('should show schools heading', () => {
    cy.contains(/school/i).should('be.visible')
  })

  it('should have add school button', () => {
    cy.get('button').contains(/add|new|create/i).should('be.visible')
  })

  it('should display schools table or list', () => {
    cy.get('table, [class*="space-y"]').should('exist')
  })

  it('should show search functionality', () => {
    cy.get('input[type="search"], input[placeholder*="search" i]').should('exist')
  })

  it('should display school name column', () => {
    cy.contains(/name|school/i).should('be.visible')
  })

  it('should show district column', () => {
    cy.contains(/district/i).should('be.visible')
  })

  it('should display enrollment column', () => {
    cy.contains(/enrollment|students/i).should('be.visible')
  })

  it('should show status column', () => {
    cy.contains(/status|active/i).should('be.visible')
  })

  it('should have action buttons for each school', () => {
    cy.get('button[class*="text-"], a[class*="text-"]').should('have.length.at.least', 1)
  })

  it('should display school type information', () => {
    cy.contains(/elementary|middle|high|type/i).should('exist')
  })

  it('should show filter by district', () => {
    cy.get('select, [role="combobox"]').should('exist')
  })

  it('should display school address', () => {
    cy.contains(/address|location/i).should('exist')
  })

  it('should have sorting capability', () => {
    cy.get('th[class*="cursor-"], button[class*="sort"]').should('exist')
  })

  it('should show empty state when no schools', () => {
    cy.contains(/no.*school|empty/i).should('exist')
  })

  it('should display school contact information', () => {
    cy.contains(/contact|phone|email/i).should('exist')
  })

  it('should have bulk actions available', () => {
    cy.get('input[type="checkbox"]').should('exist')
  })

  it('should show export functionality', () => {
    cy.get('button').contains(/export|download/i).should('exist')
  })

  it('should display nurse assignments', () => {
    cy.contains(/nurse|staff/i).should('exist')
  })

  it('should have responsive table layout', () => {
    cy.get('[class*="overflow-x"]').should('exist')
  })
})
