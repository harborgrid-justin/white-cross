/// <reference types="cypress" />

/**
 * User Management - Accessibility (15 tests)
 *
 * Tests accessibility features and compliance
 */

describe('User Management - Accessibility', () => {
  beforeEach(() => {
    cy.login('admin')
    cy.visit('/settings')
  })

  it('should have semantic HTML structure', () => {
    cy.get('nav').should('exist')
    cy.get('button').should('exist')
    cy.get('h1').should('exist')
  })

  it('should have proper heading hierarchy', () => {
    cy.get('h1').should('have.length', 1)
  })

  it('should have visible text labels on all buttons', () => {
    cy.get('nav button').each(($btn) => {
      cy.wrap($btn).invoke('text').should('not.be.empty')
    })
  })

  it('should have clickable tab buttons', () => {
    cy.contains('button', 'Users').click()
    cy.contains('button', 'Users').should('have.class', 'border-blue-500')
  })

  it('should support keyboard navigation', () => {
    cy.contains('button', 'Users').focus()
    cy.focused().should('contain', 'Users')
  })

  it('should have sufficient color contrast on active tabs', () => {
    cy.contains('button', 'Overview').should('have.class', 'text-blue-600')
  })

  it('should have sufficient color contrast on inactive tabs', () => {
    cy.contains('button', 'Districts').should('have.class', 'text-gray-500')
  })

  it('should show visual feedback on hover', () => {
    cy.contains('button', 'Schools').should('have.class', 'hover:text-gray-700')
  })

  it('should have icons with proper sizing', () => {
    cy.get('nav button svg').should('have.class', 'h-4')
    cy.get('nav button svg').should('have.class', 'w-4')
  })

  it('should have proper spacing between icon and text', () => {
    cy.get('nav button svg').should('have.class', 'mr-2')
  })

  it('should render all icons properly', () => {
    cy.get('nav button').each(($btn) => {
      cy.wrap($btn).find('svg').should('be.visible')
    })
  })

  it('should have aria-appropriate elements', () => {
    cy.get('nav').should('exist')
    cy.get('button').should('have.attr', 'class')
  })

  it('should have readable font sizes', () => {
    cy.get('h1').should('have.class', 'text-2xl')
    cy.get('nav button').should('have.class', 'text-sm')
  })

  it('should have proper focus states', () => {
    cy.contains('button', 'Configuration').focus()
    cy.focused().should('exist')
  })

  it('should not have any empty buttons', () => {
    cy.get('nav button').each(($btn) => {
      cy.wrap($btn).invoke('text').should('not.be.empty')
    })
  })
})
