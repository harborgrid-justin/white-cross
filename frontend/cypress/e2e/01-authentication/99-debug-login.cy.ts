/// <reference types="cypress" />

/**
 * Debug Login Test
 * Simple test to debug login issues
 */

describe('Debug - Login Test', () => {
  it('should attempt login and show what happens', () => {
    cy.visit('/login')
    
    // Fill in credentials
    cy.get('[data-cy=email-input]').type('admin@school.edu')
    cy.get('[data-cy=password-input]').type('AdminPassword123!')
    
    // Intercept the login request
    cy.intercept('POST', '**/api/auth/login').as('loginRequest')
    
    // Click login button
    cy.get('[data-cy=login-button]').click()
    
    // Wait for request and log response
    cy.wait('@loginRequest').then((interception) => {
      cy.log('Login Request:', JSON.stringify(interception.request.body))
      cy.log('Login Response:', JSON.stringify(interception.response?.body))
      cy.log('Status Code:', interception.response?.statusCode?.toString() || 'undefined')
      
      // Check if there's an error message on page
      cy.get('body').then(($body) => {
        if ($body.find('[data-cy=error-message]').length > 0) {
          cy.get('[data-cy=error-message]').invoke('text').then((errorText) => {
            cy.log('Error Message:', errorText)
          })
        }
      })
      
      // Check current URL
      cy.url().then((url) => {
        cy.log('Current URL:', url)
      })
      
      // Check localStorage
      cy.window().then((win) => {
        const token = win.localStorage.getItem('token')
        const user = win.localStorage.getItem('user')
        cy.log('Token in localStorage:', token ? 'EXISTS' : 'NULL')
        cy.log('User in localStorage:', user ? 'EXISTS' : 'NULL')
      })
    })
  })
})
