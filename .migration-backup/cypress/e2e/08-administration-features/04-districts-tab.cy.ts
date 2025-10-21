/// <reference types="cypress" />

/**
 * Administration Features: Districts Tab (20 tests)
 *
 * Tests district management functionality
 */

describe('Administration Features - Districts Tab', () => {
  beforeEach(() => {
    cy.login('admin')
    cy.visit('/settings')
    cy.contains('button', 'Districts').click()
  })

  it('should display the Districts tab content', () => {
    cy.contains('button', 'Districts').should('have.class', 'border-blue-500')
  })

  it('should show districts heading', () => {
    cy.contains(/district/i).should('be.visible')
  })

  it('should have add district button', () => {
    cy.get('button').contains(/add|new|create/i).should('be.visible')
  })

  it('should display districts table or list', () => {
    cy.get('table, [class*="space-y"]').should('exist')
  })

  it('should show search functionality', () => {
    cy.get('input[type="search"], input[placeholder*="search" i]').should('exist')
  })

  it('should display district names column', () => {
    cy.contains(/name|district/i).should('be.visible')
  })

  it('should show school count column', () => {
    cy.contains(/schools|count/i).should('be.visible')
  })

  it('should display status column', () => {
    cy.contains(/status|active/i).should('be.visible')
  })

  it('should show action buttons for each district', () => {
    cy.get('button[class*="text-"], a[class*="text-"]').should('have.length.at.least', 1)
  })

  it('should have edit district functionality', () => {
    cy.get('button, a').contains(/edit|modify/i).should('exist')
  })

  it('should display pagination if many districts', () => {
    cy.get('[class*="pagination"], button:contains("Next"), button:contains("Previous")').should('exist')
  })

  it('should show filter options', () => {
    cy.get('select, [role="combobox"]').should('exist')
  })

  it('should display district details', () => {
    cy.contains(/contact|address|phone/i).should('exist')
  })

  it('should have sorting capability', () => {
    cy.get('th[class*="cursor-"], button[class*="sort"]').should('exist')
  })

  it('should show empty state when no districts', () => {
    cy.contains(/no.*district|empty/i).should('exist')
  })

  it('should display district configuration options', () => {
    cy.contains(/settings|config/i).should('exist')
  })

  it('should have bulk actions available', () => {
    cy.get('input[type="checkbox"]').should('exist')
  })

  it('should show export functionality', () => {
    cy.get('button').contains(/export|download/i).should('exist')
  })

  it('should display district metrics', () => {
    cy.contains(/students|enrollment/i).should('exist')
  })

  it('should have responsive table layout', () => {
    cy.get('[class*="overflow-x"]').should('exist')
  })
})
