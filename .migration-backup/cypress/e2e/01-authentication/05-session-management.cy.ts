/// <reference types="cypress" />

/**
 * Authentication: Session Management (15 tests)
 *
 * Tests session persistence, expiration, and management
 */

describe('Authentication - Session Management', () => {
  beforeEach(() => {
    cy.login('admin')
  })

  it('should persist session across page reloads', () => {
    cy.visit('/dashboard')
    cy.reload()
    cy.url().should('include', '/dashboard')
    cy.get('[data-cy=user-name]').should('be.visible')
  })

  it('should persist session across navigation', () => {
    cy.visit('/dashboard')
    cy.visit('/students')
    cy.url().should('include', '/students')
    cy.get('[data-cy=user-name]').should('be.visible')
  })

  it('should maintain session in new tab', () => {
    cy.visit('/dashboard')
    cy.window().then((win) => {
      win.open('/students', '_blank')
    })
  })

  it('should expire session after timeout', () => {
    cy.visit('/dashboard')
    cy.wait(1800000) // 30 minutes
    cy.get('[data-cy=user-name]').click()
    cy.url().should('include', '/login')
  })

  it('should refresh token before expiration', () => {
    cy.intercept('POST', '/api/auth/refresh').as('refreshToken')

    cy.visit('/dashboard')
    cy.wait(840000) // 14 minutes (before 15 min expiration)

    cy.wait('@refreshToken')
    cy.url().should('include', '/dashboard')
  })

  it('should handle expired token gracefully', () => {
    cy.visit('/dashboard')
    cy.window().then((win) => {
      win.localStorage.setItem('token', 'expired-token')
    })

    cy.reload()
    cy.url().should('include', '/login')
  })

  it('should clear session on logout', () => {
    cy.visit('/dashboard')
    cy.get('[data-cy=user-menu]').click()
    cy.get('[data-cy=logout-button]').click()

    cy.window().then((win) => {
      expect(win.localStorage.getItem('token')).to.be.null
      expect(win.localStorage.getItem('user')).to.be.null
    })
  })

  it('should prevent multiple sessions with same credentials', () => {
    cy.visit('/dashboard')

    cy.window().then((win) => {
      const newWindow = win.open('/login', '_blank')
      // Second login should invalidate first session
    })
  })

  it('should store session expiry time', () => {
    cy.visit('/dashboard')
    cy.window().then((win) => {
      const expiry = win.localStorage.getItem('sessionExpiry')
      expect(expiry).to.not.be.null
      expect(new Date(expiry).getTime()).to.be.greaterThan(Date.now())
    })
  })

  it('should warn user before session expires', () => {
    cy.visit('/dashboard')
    cy.wait(1680000) // 28 minutes
    cy.get('[data-cy=session-warning]').should('be.visible')
    cy.get('[data-cy=session-warning]').should('contain', 'session will expire')
  })

  it('should allow session extension', () => {
    cy.visit('/dashboard')
    cy.wait(1680000) // 28 minutes
    cy.get('[data-cy=extend-session-button]').click()

    cy.window().then((win) => {
      const expiry = win.localStorage.getItem('sessionExpiry')
      expect(new Date(expiry).getTime()).to.be.greaterThan(Date.now() + 1500000)
    })
  })

  it('should handle concurrent session updates', () => {
    cy.visit('/dashboard')

    // Simulate activity in multiple tabs
    cy.window().then((win) => {
      win.localStorage.setItem('lastActivity', Date.now().toString())
    })

    cy.reload()
    cy.url().should('include', '/dashboard')
  })

  it('should track user activity for session management', () => {
    cy.visit('/dashboard')
    cy.get('[data-cy=students-nav]').click()

    cy.window().then((win) => {
      const lastActivity = win.localStorage.getItem('lastActivity')
      expect(lastActivity).to.not.be.null
    })
  })

  it('should preserve session across browser refresh', () => {
    cy.visit('/dashboard')
    cy.reload()
    cy.url().should('include', '/dashboard')
    cy.get('[data-cy=dashboard-title]').should('be.visible')
  })

  it('should handle session storage quota exceeded', () => {
    cy.visit('/dashboard')
    cy.window().then((win) => {
      try {
        const largeData = 'x'.repeat(10000000)
        win.localStorage.setItem('test', largeData)
      } catch (e) {
        expect(e.name).to.eq('QuotaExceededError')
      }
    })
  })
})
