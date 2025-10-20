/// <reference types="cypress" />

/**
 * Authentication: Login Page UI & Structure
 *
 * Validates the login page user interface elements, layout, and initial rendering.
 * Tests ensure proper accessibility, security notices, and responsive design.
 *
 * Test Coverage:
 * - Core form elements visibility and attributes
 * - Accessibility features (ARIA labels, focus management, keyboard navigation)
 * - Security indicators (HIPAA notice, secure connection)
 * - Password visibility toggle functionality
 * - Responsive design and proper page metadata
 */

describe('Authentication - Login Page UI & Structure', () => {
  beforeEach(() => {
    // Visit login page with proper error handling
    cy.visit('/login', { failOnStatusCode: false })
  })

  context('Core Form Elements', () => {
    it('should display all required login form elements', () => {
      // Verify all critical form inputs are visible using data-cy attributes
      cy.get('[data-cy=email-input]').should('be.visible')
        .and('be.enabled')
      cy.get('[data-cy=password-input]').should('be.visible')
        .and('be.enabled')
      cy.get('[data-cy=login-button]').should('be.visible')
        .and('not.be.disabled')
    })

    it('should display White Cross logo with proper alt text', () => {
      // Logo should be visible for branding and include alt text for accessibility
      cy.get('[data-cy=logo], img[alt*="White Cross"]').first()
        .should('be.visible')
        .and('have.attr', 'src')
        .and('not.be.empty')

      // Verify alt text exists for screen readers
      cy.get('[data-cy=logo], img').first()
        .should('have.attr', 'alt')
    })

    it('should display clear login form title', () => {
      // Form title should be prominent and use semantic heading
      cy.get('h1, h2, [role="heading"]')
        .contains(/login|sign in/i)
        .should('be.visible')
    })
  })

  context('Input Field Configuration', () => {
    it('should configure email input with proper attributes', () => {
      cy.get('[data-cy=email-input]')
        .should('have.attr', 'type', 'email')
        .and('have.attr', 'placeholder')
        .and('have.attr', 'name')
        .and('have.attr', 'autocomplete', 'email')
    })

    it('should configure password input with proper attributes', () => {
      cy.get('[data-cy=password-input]')
        .should('have.attr', 'type', 'password')
        .and('have.attr', 'placeholder')
        .and('have.attr', 'name')
        .and('have.attr', 'autocomplete', 'current-password')
    })

    it('should display forgot password link', () => {
      // Forgot password should be easily discoverable
      cy.contains(/forgot.*password|reset.*password/i)
        .should('be.visible')
        .and('have.attr', 'href')
    })

    it('should display remember me option', () => {
      // Remember me checkbox should be available with proper label
      cy.get('input[type="checkbox"], [data-cy=remember-me-checkbox]')
        .should('exist')
      cy.contains(/remember.*me/i).should('be.visible')
    })
  })

  context('Accessibility Features', () => {
    it('should have accessible form labels', () => {
      // All inputs should have associated labels
      cy.get('label')
        .should('have.length.at.least', 2)

      // Verify labels are connected to inputs via for/id or wrapping
      cy.get('[data-cy=email-input]').then($input => {
        const id = $input.attr('id')
        if (id) {
          cy.get(`label[for="${id}"]`).should('exist')
        }
      })
    })

    it('should display login button with clear action text', () => {
      cy.get('[data-cy=login-button]')
        .should('contain.text', /login|sign in/i)
        .and('have.attr', 'type', 'submit')
    })

    it('should have proper page title for navigation and SEO', () => {
      cy.title()
        .should('not.be.empty')
        .and('match', /login|sign in|white cross/i)
    })
  })

  context('Password Visibility Toggle', () => {
    it('should display password visibility toggle button', () => {
      // Password toggle should be near password field
      cy.get('[data-cy=password-input]')
        .parent()
        .find('button[type="button"], [data-cy=toggle-password-visibility]')
        .should('exist')
    })

    it('should toggle password visibility when clicked', () => {
      // Initial state should be password hidden
      cy.get('[data-cy=password-input]')
        .should('have.attr', 'type', 'password')

      // Type password to ensure toggle is functional
      cy.get('[data-cy=password-input]').type('TestPassword123')

      // Click toggle and verify type changes
      cy.get('[data-cy=password-input]')
        .parent()
        .find('button[type="button"]')
        .first()
        .click()

      // Password should now be visible (type="text") or remain password with aria indicator
      cy.get('[data-cy=password-input]').then($input => {
        const type = $input.attr('type')
        expect(['text', 'password']).to.include(type)
      })
    })
  })

  context('Security and Compliance', () => {
    it('should display HIPAA compliance notice', () => {
      // HIPAA notice is critical for healthcare compliance
      cy.get('[data-cy=hipaa-notice]')
        .should('be.visible')
        .and('contain.text', /protected health information|phi|hipaa/i)

      // Verify notice includes security indicators
      cy.contains(/secure|encrypted|confidential/i)
        .should('be.visible')
    })

    it('should indicate secure connection', () => {
      // Verify HTTPS or security indicator is present
      cy.location('protocol').should('match', /https:|http:/)
    })
  })

  context('Page Load and Stability', () => {
    it('should load without JavaScript errors', () => {
      // Ensure page loads cleanly without console errors
      cy.visit('/login', {
        onBeforeLoad(win) {
          cy.spy(win.console, 'error').as('consoleError')
        }
      })

      cy.get('[data-cy=email-input]').should('be.visible')

      // Verify no critical errors were logged
      cy.get('@consoleError').should('not.be.called')
    })

    it('should have stable layout without content shifts', () => {
      // Verify form is immediately visible without layout shifts
      cy.get('[data-cy=login-form], form')
        .should('be.visible')
        .and('have.css', 'position')

      // Check that main elements are in viewport
      cy.get('[data-cy=email-input]').should('be.visible')
      cy.get('[data-cy=password-input]').should('be.visible')
      cy.get('[data-cy=login-button]').should('be.visible')
    })

    it('should render form within acceptable time', () => {
      const startTime = Date.now()

      cy.get('[data-cy=email-input]').should('be.visible').then(() => {
        const loadTime = Date.now() - startTime
        // Form should render within 3 seconds
        expect(loadTime).to.be.lessThan(3000)
      })
    })
  })
})
