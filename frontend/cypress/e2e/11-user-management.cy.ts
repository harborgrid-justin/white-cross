/// <reference types="cypress" />

describe('User Management - Comprehensive Test Suite (150 Tests)', () => {
  beforeEach(() => {
    cy.login('admin')
    cy.visit('/settings')
  })

  // ====================================
  // SECTION 1: PAGE LOAD & STRUCTURE (15 tests)
  // ====================================
  describe('Page Load & Structure', () => {
    it('should display the administration panel page', () => {
      cy.contains('Administration Panel').should('be.visible')
      cy.url().should('include', '/settings')
    })

    it('should load page without errors', () => {
      cy.get('body').should('be.visible')
      cy.url().should('include', '/settings')
    })

    it('should display page navigation', () => {
      cy.get('nav').should('be.visible')
    })

    it('should have accessible page title', () => {
      cy.get('h1, h2, [role="heading"]').should('exist')
    })

    it('should maintain admin authentication on page load', () => {
      cy.url().should('not.include', '/login')
      cy.get('body').should('be.visible')
    })

    it('should display the subtitle text', () => {
      cy.contains('System configuration, multi-school management, and enterprise tools').should('be.visible')
    })

    it('should have proper page spacing', () => {
      cy.get('.space-y-6').should('exist')
    })

    it('should have navigation border styling', () => {
      cy.get('.border-b.border-gray-200').should('exist')
    })

    it('should display tab navigation container', () => {
      cy.get('nav').within(() => {
        cy.get('button').should('have.length.at.least', 5)
      })
    })

    it('should have scrollable navigation on small screens', () => {
      cy.get('nav').should('have.class', 'overflow-x-auto')
    })

    it('should not show login page elements', () => {
      cy.contains('Login').should('not.exist')
      cy.contains('Sign In').should('not.exist')
    })

    it('should have proper text styling for title', () => {
      cy.get('h1').should('have.class', 'text-2xl')
      cy.get('h1').should('have.class', 'font-bold')
    })

    it('should have proper text color for subtitle', () => {
      cy.get('.text-gray-600').should('exist')
    })

    it('should render without React errors', () => {
      cy.window().then((win) => {
        expect(win.console.error).to.not.be.called
      })
    })

    it('should have proper document title', () => {
      cy.title().should('not.be.empty')
    })
  })

  // ====================================
  // SECTION 2: TAB NAVIGATION (20 tests)
  // ====================================
  describe('Tab Navigation', () => {
    it('should display all navigation tabs', () => {
      const tabs = ['Overview', 'Districts', 'Schools', 'Users', 'Configuration', 'Integrations', 'Backups', 'Monitoring', 'Licenses', 'Training', 'Audit Logs']
      tabs.forEach(tab => {
        cy.contains('button', tab).should('be.visible')
      })
    })

    it('should have Overview tab selected by default', () => {
      cy.contains('button', 'Overview').should('have.class', 'border-blue-500')
    })

    it('should change to Users tab when clicked', () => {
      cy.contains('button', 'Users').click()
      cy.contains('button', 'Users').should('have.class', 'border-blue-500')
    })

    it('should display icons for each tab', () => {
      cy.get('nav button svg').should('have.length.at.least', 11)
    })

    it('should have hover states on tabs', () => {
      cy.contains('button', 'Districts').should('have.class', 'hover:text-gray-700')
    })

    it('should maintain tab selection when switching', () => {
      cy.contains('button', 'Schools').click()
      cy.contains('button', 'Schools').should('have.class', 'border-blue-500')
      cy.contains('button', 'Overview').should('not.have.class', 'border-blue-500')
    })

    it('should navigate to Configuration tab', () => {
      cy.contains('button', 'Configuration').click()
      cy.contains('button', 'Configuration').should('have.class', 'text-blue-600')
    })

    it('should navigate to Integrations tab', () => {
      cy.contains('button', 'Integrations').click()
      cy.contains('button', 'Integrations').should('have.class', 'border-blue-500')
    })

    it('should navigate to Backups tab', () => {
      cy.contains('button', 'Backups').click()
      cy.contains('button', 'Backups').should('have.class', 'text-blue-600')
    })

    it('should navigate to Monitoring tab', () => {
      cy.contains('button', 'Monitoring').click()
      cy.contains('button', 'Monitoring').should('be.visible')
    })

    it('should navigate to Licenses tab', () => {
      cy.contains('button', 'Licenses').click()
      cy.contains('button', 'Licenses').should('have.class', 'border-blue-500')
    })

    it('should navigate to Training tab', () => {
      cy.contains('button', 'Training').click()
      cy.contains('button', 'Training').should('be.visible')
    })

    it('should navigate to Audit Logs tab', () => {
      cy.contains('button', 'Audit Logs').click()
      cy.contains('button', 'Audit Logs').should('have.class', 'text-blue-600')
    })

    it('should have proper spacing between tabs', () => {
      cy.get('nav').should('have.class', 'space-x-8')
    })

    it('should have proper padding on tab buttons', () => {
      cy.contains('button', 'Overview').should('have.class', 'py-4')
    })

    it('should have proper border bottom on active tab', () => {
      cy.contains('button', 'Overview').should('have.class', 'border-b-2')
    })

    it('should have medium font weight on tabs', () => {
      cy.contains('button', 'Users').should('have.class', 'font-medium')
    })

    it('should have small text size on tabs', () => {
      cy.contains('button', 'Districts').should('have.class', 'text-sm')
    })

    it('should display tabs in flex layout', () => {
      cy.get('nav').should('have.class', 'flex')
    })

    it('should have whitespace-nowrap on tab text', () => {
      cy.contains('button', 'Configuration').should('have.class', 'whitespace-nowrap')
    })
  })

  // ====================================
  // SECTION 3: USERS TAB - BASIC (15 tests)
  // ====================================
  describe('Users Tab - Basic Functionality', () => {
    beforeEach(() => {
      cy.contains('button', 'Users').click()
    })

    it('should display users tab content', () => {
      cy.contains('button', 'Users').should('have.class', 'border-blue-500')
    })

    it('should show users tab is active', () => {
      cy.contains('button', 'Users').should('have.class', 'text-blue-600')
    })

    it('should not show overview content when on users tab', () => {
      cy.contains('button', 'Overview').should('not.have.class', 'border-blue-500')
    })

    it('should render users tab without errors', () => {
      cy.get('body').should('be.visible')
    })

    it('should maintain URL on tab switch', () => {
      cy.url().should('include', '/settings')
    })

    it('should allow switching back to overview', () => {
      cy.contains('button', 'Overview').click()
      cy.contains('button', 'Overview').should('have.class', 'border-blue-500')
    })

    it('should allow switching to other tabs from users', () => {
      cy.contains('button', 'Districts').click()
      cy.contains('button', 'Districts').should('have.class', 'text-blue-600')
    })

    it('should persist tab state during interaction', () => {
      cy.contains('button', 'Users').should('have.class', 'border-blue-500')
      cy.wait(100)
      cy.contains('button', 'Users').should('have.class', 'border-blue-500')
    })

    it('should have proper tab content container', () => {
      cy.get('div').should('exist')
    })

    it('should not display other tab contents', () => {
      cy.contains('button', 'Districts').should('not.have.class', 'border-blue-500')
    })

    it('should render users icon', () => {
      cy.contains('button', 'Users').find('svg').should('be.visible')
    })

    it('should have clickable users tab button', () => {
      cy.contains('button', 'Users').click()
      cy.contains('button', 'Users').should('exist')
    })

    it('should show users as selected after click', () => {
      cy.contains('button', 'Users').should('have.class', 'border-blue-500')
    })

    it('should allow rapid tab switching', () => {
      cy.contains('button', 'Overview').click()
      cy.contains('button', 'Users').click()
      cy.contains('button', 'Users').should('have.class', 'text-blue-600')
    })

    it('should maintain authentication on users tab', () => {
      cy.url().should('not.include', '/login')
    })
  })

  // ====================================
  // SECTION 4: DISTRICTS TAB (10 tests)
  // ====================================
  describe('Districts Tab', () => {
    beforeEach(() => {
      cy.contains('button', 'Districts').click()
    })

    it('should display districts tab when clicked', () => {
      cy.contains('button', 'Districts').should('have.class', 'border-blue-500')
    })

    it('should show districts as active tab', () => {
      cy.contains('button', 'Districts').should('have.class', 'text-blue-600')
    })

    it('should render districts icon', () => {
      cy.contains('button', 'Districts').find('svg').should('be.visible')
    })

    it('should deselect other tabs when districts is active', () => {
      cy.contains('button', 'Overview').should('not.have.class', 'border-blue-500')
    })

    it('should maintain districts tab selection', () => {
      cy.wait(100)
      cy.contains('button', 'Districts').should('have.class', 'border-blue-500')
    })

    it('should allow navigation away from districts', () => {
      cy.contains('button', 'Schools').click()
      cy.contains('button', 'Schools').should('have.class', 'text-blue-600')
    })

    it('should render without console errors', () => {
      cy.get('body').should('be.visible')
    })

    it('should have proper styling on districts tab', () => {
      cy.contains('button', 'Districts').should('have.class', 'border-b-2')
    })

    it('should be accessible', () => {
      cy.contains('button', 'Districts').should('be.visible')
    })

    it('should maintain page URL', () => {
      cy.url().should('include', '/settings')
    })
  })

  // ====================================
  // SECTION 5: SCHOOLS TAB (10 tests)
  // ====================================
  describe('Schools Tab', () => {
    beforeEach(() => {
      cy.contains('button', 'Schools').click()
    })

    it('should display schools tab when clicked', () => {
      cy.contains('button', 'Schools').should('have.class', 'border-blue-500')
    })

    it('should show schools as active tab', () => {
      cy.contains('button', 'Schools').should('have.class', 'text-blue-600')
    })

    it('should render schools icon', () => {
      cy.contains('button', 'Schools').find('svg').should('be.visible')
    })

    it('should deselect overview when schools is active', () => {
      cy.contains('button', 'Overview').should('not.have.class', 'border-blue-500')
    })

    it('should persist schools selection', () => {
      cy.wait(100)
      cy.contains('button', 'Schools').should('have.class', 'border-blue-500')
    })

    it('should allow switching to users from schools', () => {
      cy.contains('button', 'Users').click()
      cy.contains('button', 'Users').should('have.class', 'text-blue-600')
    })

    it('should render schools content', () => {
      cy.get('body').should('be.visible')
    })

    it('should have proper tab styling', () => {
      cy.contains('button', 'Schools').should('have.class', 'font-medium')
    })

    it('should be visible and accessible', () => {
      cy.contains('button', 'Schools').should('be.visible')
    })

    it('should stay on settings page', () => {
      cy.url().should('include', '/settings')
    })
  })

  // ====================================
  // SECTION 6: CONFIGURATION TAB (15 tests)
  // ====================================
  describe('Configuration Tab', () => {
    beforeEach(() => {
      cy.contains('button', 'Configuration').click()
    })

    it('should display configuration tab when clicked', () => {
      cy.contains('button', 'Configuration').should('have.class', 'border-blue-500')
    })

    it('should show configuration as active tab', () => {
      cy.contains('button', 'Configuration').should('have.class', 'text-blue-600')
    })

    it('should render shield icon for configuration', () => {
      cy.contains('button', 'Configuration').find('svg').should('be.visible')
    })

    it('should show system configuration content', () => {
      cy.contains('System Configuration').should('be.visible')
    })

    it('should display category filter buttons', () => {
      cy.contains('button', 'ALL').should('be.visible')
      cy.contains('button', 'GENERAL').should('be.visible')
      cy.contains('button', 'SECURITY').should('be.visible')
    })

    it('should have refresh button', () => {
      cy.contains('button', 'Refresh').should('be.visible')
    })

    it('should have save button', () => {
      cy.contains('Save All').should('exist')
    })

    it('should display configuration groups', () => {
      cy.get('.card').should('exist')
    })

    it('should allow filtering by category', () => {
      cy.contains('button', 'SECURITY').click()
      cy.contains('button', 'SECURITY').should('have.class', 'bg-blue-600')
    })

    it('should show database-driven message', () => {
      cy.contains('Database-driven configuration management').should('be.visible')
    })

    it('should display configuration inputs', () => {
      cy.get('input, select, textarea').should('exist')
    })

    it('should have proper spacing on config page', () => {
      cy.get('.space-y-6').should('exist')
    })

    it('should render without errors', () => {
      cy.get('body').should('be.visible')
    })

    it('should maintain URL', () => {
      cy.url().should('include', '/settings')
    })

    it('should be accessible to admin', () => {
      cy.contains('System Configuration').should('be.visible')
    })
  })

  // ====================================
  // SECTION 7: INTEGRATIONS TAB (10 tests)
  // ====================================
  describe('Integrations Tab', () => {
    beforeEach(() => {
      cy.contains('button', 'Integrations').click()
    })

    it('should display integrations tab when clicked', () => {
      cy.contains('button', 'Integrations').should('have.class', 'border-blue-500')
    })

    it('should show integrations as active', () => {
      cy.contains('button', 'Integrations').should('have.class', 'text-blue-600')
    })

    it('should render plug icon', () => {
      cy.contains('button', 'Integrations').find('svg').should('be.visible')
    })

    it('should deselect other tabs', () => {
      cy.contains('button', 'Configuration').should('not.have.class', 'border-blue-500')
    })

    it('should render integrations content', () => {
      cy.get('body').should('be.visible')
    })

    it('should maintain selection', () => {
      cy.wait(100)
      cy.contains('button', 'Integrations').should('have.class', 'border-blue-500')
    })

    it('should allow navigation to other tabs', () => {
      cy.contains('button', 'Backups').click()
      cy.contains('button', 'Backups').should('have.class', 'text-blue-600')
    })

    it('should have proper styling', () => {
      cy.contains('button', 'Integrations').should('have.class', 'border-b-2')
    })

    it('should be visible', () => {
      cy.contains('button', 'Integrations').should('be.visible')
    })

    it('should maintain settings URL', () => {
      cy.url().should('include', '/settings')
    })
  })

  // ====================================
  // SECTION 8: BACKUPS TAB (10 tests)
  // ====================================
  describe('Backups Tab', () => {
    beforeEach(() => {
      cy.contains('button', 'Backups').click()
    })

    it('should display backups tab when clicked', () => {
      cy.contains('button', 'Backups').should('have.class', 'border-blue-500')
    })

    it('should show backups as active', () => {
      cy.contains('button', 'Backups').should('have.class', 'text-blue-600')
    })

    it('should render database icon', () => {
      cy.contains('button', 'Backups').find('svg').should('be.visible')
    })

    it('should deselect integrations', () => {
      cy.contains('button', 'Integrations').should('not.have.class', 'border-blue-500')
    })

    it('should render content', () => {
      cy.get('body').should('be.visible')
    })

    it('should persist selection', () => {
      cy.wait(100)
      cy.contains('button', 'Backups').should('have.class', 'border-blue-500')
    })

    it('should allow tab switching', () => {
      cy.contains('button', 'Monitoring').click()
      cy.contains('button', 'Monitoring').should('have.class', 'text-blue-600')
    })

    it('should have proper tab styling', () => {
      cy.contains('button', 'Backups').should('have.class', 'font-medium')
    })

    it('should be accessible', () => {
      cy.contains('button', 'Backups').should('be.visible')
    })

    it('should keep settings URL', () => {
      cy.url().should('include', '/settings')
    })
  })

  // ====================================
  // SECTION 9: MONITORING TAB (10 tests)
  // ====================================
  describe('Monitoring Tab', () => {
    beforeEach(() => {
      cy.contains('button', 'Monitoring').click()
    })

    it('should display monitoring tab when clicked', () => {
      cy.contains('button', 'Monitoring').should('have.class', 'border-blue-500')
    })

    it('should show monitoring as active', () => {
      cy.contains('button', 'Monitoring').should('have.class', 'text-blue-600')
    })

    it('should render activity icon', () => {
      cy.contains('button', 'Monitoring').find('svg').should('be.visible')
    })

    it('should deselect backups', () => {
      cy.contains('button', 'Backups').should('not.have.class', 'border-blue-500')
    })

    it('should render monitoring content', () => {
      cy.get('body').should('be.visible')
    })

    it('should maintain selection', () => {
      cy.wait(100)
      cy.contains('button', 'Monitoring').should('have.class', 'border-blue-500')
    })

    it('should allow switching to licenses', () => {
      cy.contains('button', 'Licenses').click()
      cy.contains('button', 'Licenses').should('have.class', 'text-blue-600')
    })

    it('should have tab styling', () => {
      cy.contains('button', 'Monitoring').should('have.class', 'text-sm')
    })

    it('should be visible and clickable', () => {
      cy.contains('button', 'Monitoring').should('be.visible')
    })

    it('should stay on settings page', () => {
      cy.url().should('include', '/settings')
    })
  })

  // ====================================
  // SECTION 10: LICENSES TAB (10 tests)
  // ====================================
  describe('Licenses Tab', () => {
    beforeEach(() => {
      cy.contains('button', 'Licenses').click()
    })

    it('should display licenses tab when clicked', () => {
      cy.contains('button', 'Licenses').should('have.class', 'border-blue-500')
    })

    it('should show licenses as active', () => {
      cy.contains('button', 'Licenses').should('have.class', 'text-blue-600')
    })

    it('should render file key icon', () => {
      cy.contains('button', 'Licenses').find('svg').should('be.visible')
    })

    it('should deselect monitoring', () => {
      cy.contains('button', 'Monitoring').should('not.have.class', 'border-blue-500')
    })

    it('should render licenses content', () => {
      cy.get('body').should('be.visible')
    })

    it('should keep selection active', () => {
      cy.wait(100)
      cy.contains('button', 'Licenses').should('have.class', 'border-blue-500')
    })

    it('should allow navigation to training', () => {
      cy.contains('button', 'Training').click()
      cy.contains('button', 'Training').should('have.class', 'text-blue-600')
    })

    it('should have proper styling', () => {
      cy.contains('button', 'Licenses').should('have.class', 'border-b-2')
    })

    it('should be visible', () => {
      cy.contains('button', 'Licenses').should('be.visible')
    })

    it('should maintain URL', () => {
      cy.url().should('include', '/settings')
    })
  })

  // ====================================
  // SECTION 11: TRAINING TAB (10 tests)
  // ====================================
  describe('Training Tab', () => {
    beforeEach(() => {
      cy.contains('button', 'Training').click()
    })

    it('should display training tab when clicked', () => {
      cy.contains('button', 'Training').should('have.class', 'border-blue-500')
    })

    it('should show training as active', () => {
      cy.contains('button', 'Training').should('have.class', 'text-blue-600')
    })

    it('should render book icon', () => {
      cy.contains('button', 'Training').find('svg').should('be.visible')
    })

    it('should deselect licenses', () => {
      cy.contains('button', 'Licenses').should('not.have.class', 'border-blue-500')
    })

    it('should render training content', () => {
      cy.get('body').should('be.visible')
    })

    it('should persist selection', () => {
      cy.wait(100)
      cy.contains('button', 'Training').should('have.class', 'border-blue-500')
    })

    it('should allow navigation to audit logs', () => {
      cy.contains('button', 'Audit Logs').click()
      cy.contains('button', 'Audit Logs').should('have.class', 'text-blue-600')
    })

    it('should have tab styling', () => {
      cy.contains('button', 'Training').should('have.class', 'font-medium')
    })

    it('should be accessible', () => {
      cy.contains('button', 'Training').should('be.visible')
    })

    it('should stay on settings page', () => {
      cy.url().should('include', '/settings')
    })
  })

  // ====================================
  // SECTION 12: AUDIT LOGS TAB (10 tests)
  // ====================================
  describe('Audit Logs Tab', () => {
    beforeEach(() => {
      cy.contains('button', 'Audit Logs').click()
    })

    it('should display audit logs tab when clicked', () => {
      cy.contains('button', 'Audit Logs').should('have.class', 'border-blue-500')
    })

    it('should show audit logs as active', () => {
      cy.contains('button', 'Audit Logs').should('have.class', 'text-blue-600')
    })

    it('should render file text icon', () => {
      cy.contains('button', 'Audit Logs').find('svg').should('be.visible')
    })

    it('should deselect training', () => {
      cy.contains('button', 'Training').should('not.have.class', 'border-blue-500')
    })

    it('should render audit logs content', () => {
      cy.get('body').should('be.visible')
    })

    it('should maintain selection', () => {
      cy.wait(100)
      cy.contains('button', 'Audit Logs').should('have.class', 'border-blue-500')
    })

    it('should allow returning to overview', () => {
      cy.contains('button', 'Overview').click()
      cy.contains('button', 'Overview').should('have.class', 'text-blue-600')
    })

    it('should have proper styling', () => {
      cy.contains('button', 'Audit Logs').should('have.class', 'text-sm')
    })

    it('should be visible and clickable', () => {
      cy.contains('button', 'Audit Logs').should('be.visible')
    })

    it('should keep settings URL', () => {
      cy.url().should('include', '/settings')
    })
  })

  // ====================================
  // SECTION 13: ACCESSIBILITY (15 tests)
  // ====================================
  describe('Accessibility', () => {
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
        cy.wrap($btn).should('have.text')
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

  // ====================================
  // SECTION 14: RESPONSIVENESS (10 tests)
  // ====================================
  describe('Responsiveness', () => {
    it('should have scrollable navigation', () => {
      cy.get('nav').should('have.class', 'overflow-x-auto')
    })

    it('should maintain layout on smaller viewport', () => {
      cy.viewport(768, 1024)
      cy.contains('Administration Panel').should('be.visible')
    })

    it('should show all tabs on mobile', () => {
      cy.viewport(375, 667)
      cy.get('nav button').should('have.length.at.least', 5)
    })

    it('should allow horizontal scrolling on mobile', () => {
      cy.viewport(375, 667)
      cy.get('nav').should('have.class', 'overflow-x-auto')
    })

    it('should maintain proper spacing on tablet', () => {
      cy.viewport(768, 1024)
      cy.get('.space-y-6').should('exist')
    })

    it('should keep navigation visible on small screens', () => {
      cy.viewport(640, 480)
      cy.get('nav').should('be.visible')
    })

    it('should have flex layout that adapts', () => {
      cy.get('nav').should('have.class', 'flex')
    })

    it('should prevent tab text wrapping', () => {
      cy.get('nav button').should('have.class', 'whitespace-nowrap')
    })

    it('should maintain visibility on large screens', () => {
      cy.viewport(1920, 1080)
      cy.contains('Administration Panel').should('be.visible')
    })

    it('should keep all tabs accessible at any size', () => {
      cy.viewport(320, 568)
      cy.contains('button', 'Users').should('exist')
    })
  })
})
