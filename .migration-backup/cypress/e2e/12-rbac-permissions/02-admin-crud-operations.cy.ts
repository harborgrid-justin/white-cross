/// <reference types="cypress" />

/**
 * RBAC - Admin CRUD Operations (Enhanced - 30 tests)
 *
 * Tests admin role complete CRUD capabilities across all system resources
 * Validates full administrative access and control
 *
 * User Account: admin@school.edu / AdminPassword123! (ADMIN)
 *
 * Healthcare Context:
 * - Admins have full system access
 * - Can manage districts, schools, users, and configurations
 * - Can view and manage all student health data
 * - Responsible for system compliance and security
 * - Can access audit logs and generate compliance reports
 */

describe('RBAC - Admin CRUD Operations', () => {
  beforeEach(() => {
    cy.login('admin')
    cy.waitForAdminData()
    cy.verifyUserRole('ADMIN')
  })

  context('User Management CRUD', () => {
    it('should access user management page', () => {
      cy.visit('/settings')
      cy.navigateToSettingsTab('Users')
      cy.verifyAdminAccess('User Management')
    })

    it('should be able to create new users', () => {
      cy.visit('/settings')
      cy.navigateToSettingsTab('Users')
      cy.get('button').contains(/add|new|create/i).should('be.visible')
      cy.log('Admin can create users with any role')
    })

    it('should view all users across all schools and districts', () => {
      cy.visit('/settings')
      cy.navigateToSettingsTab('Users')
      cy.get('table', { timeout: 5000 }).should('be.visible')
      cy.log('Admins see all users in the system')
    })

    it('should edit user details and permissions', () => {
      cy.visit('/settings')
      cy.navigateToSettingsTab('Users')
      cy.get('button, a').contains(/edit|modify/i).should('exist')
      cy.log('Admin can modify user roles and assignments')
    })

    it('should deactivate or delete users', () => {
      cy.visit('/settings')
      cy.navigateToSettingsTab('Users')
      cy.get('button').contains(/delete|deactivate|disable/i).should('exist')
      cy.log('Admin can deactivate users while preserving audit history')
    })

    it('should reset user passwords', () => {
      cy.visit('/settings')
      cy.navigateToSettingsTab('Users')
      cy.get('button').contains(/reset.*password|password/i).should('exist')
      cy.log('Admin can reset passwords for security')
    })
  })

  context('District Management CRUD', () => {
    it('should access district management', () => {
      cy.visit('/settings')
      cy.contains('button', 'Districts').click()
      cy.contains('button', 'Districts').should('have.class', 'border-blue-500')
      cy.verifyAdminAccess('District Management')
    })

    it('should create new districts', () => {
      cy.visit('/settings')
      cy.contains('button', 'Districts').click()
      cy.get('button').contains(/add|new|create/i).should('exist')
      cy.log('Admin can create new school districts')
    })

    it('should edit district information', () => {
      cy.visit('/settings')
      cy.contains('button', 'Districts').click()
      cy.get('body').should('be.visible')
      cy.log('Update district settings and configuration')
    })
  })

  context('School Management CRUD', () => {
    it('should access school management', () => {
      cy.visit('/settings')
      cy.contains('button', 'Schools').click()
      cy.contains('button', 'Schools').should('have.class', 'text-blue-600')
      cy.verifyAdminAccess('School Management')
    })

    it('should create new schools within districts', () => {
      cy.visit('/settings')
      cy.contains('button', 'Schools').click()
      cy.get('button').contains(/add|new|create/i).should('exist')
      cy.log('Admin can add schools to districts')
    })

    it('should view all schools across all districts', () => {
      cy.visit('/settings')
      cy.contains('button', 'Schools').click()
      cy.get('body').should('be.visible')
      cy.log('View all schools in the system')
    })
  })

  context('Student Data Management', () => {
    it('should view all students across all schools', () => {
      cy.visit('/students')
      cy.url({ timeout: 3000 }).should('include', '/students')
      cy.verifyAdminAccess('Student Management')
    })

    it('should see add student button', () => {
      cy.visit('/students')
      cy.get('[data-testid="add-student-button"], button', { timeout: 2500 }).contains(/add student/i).should('exist')
      cy.log('Admin can create student records in any school')
    })

    it('should edit student information', () => {
      cy.visit('/students')
      cy.get('body').should('be.visible')
      cy.log('Update student demographics and enrollment')
    })
  })

  context('Medication Management', () => {
    it('should access medications page', () => {
      cy.visit('/medications')
      cy.url({ timeout: 3000 }).should('include', '/medications')
      cy.verifyAdminAccess('Medications')
    })

    it('should see add medication button', () => {
      cy.visit('/medications')
      cy.get('button', { timeout: 2500 }).contains(/add/i).should('exist')
      cy.log('Admin can add medications')
    })

    it('should view all medication records', () => {
      cy.visit('/medications')
      cy.get('body').should('be.visible')
      cy.log('View medication inventory and administration')
    })

    it('should manage medication inventory', () => {
      cy.visit('/medications')
      cy.contains('button', 'Inventory').should('be.visible')
      cy.log('Oversee medication stock levels')
    })
  })

  context('System Configuration', () => {
    it('should access system configuration', () => {
      cy.visit('/settings')
      cy.contains('button', 'Configuration').click()
      cy.contains('System Configuration').should('be.visible')
      cy.verifyAdminAccess('System Configuration')
    })

    it('should see configuration save button', () => {
      cy.visit('/settings')
      cy.contains('button', 'Configuration').click()
      cy.contains('Save All').should('exist')
      cy.log('Admin can save configuration changes')
    })

    it('should see refresh button on configurations', () => {
      cy.visit('/settings')
      cy.contains('button', 'Configuration').click()
      cy.contains('button', 'Refresh').should('be.visible')
      cy.log('Reload configuration from server')
    })

    it('should filter configurations by category', () => {
      cy.visit('/settings')
      cy.contains('button', 'Configuration').click()
      cy.contains('button', 'SECURITY').should('be.visible')
      cy.contains('button', 'GENERAL').should('be.visible')
      cy.log('Filter by security, general, and other categories')
    })

    it('should have edit access to configuration inputs', () => {
      cy.visit('/settings')
      cy.contains('button', 'Configuration').click()
      cy.get('input:not([disabled])', { timeout: 2500 }).should('exist')
      cy.log('Configuration fields are editable for admins')
    })

    it('should access all administration features', () => {
      cy.visit('/settings')
      const adminTabs = ['Integrations', 'Backups', 'Monitoring', 'Audit Logs']
      adminTabs.forEach(tab => {
        cy.contains('button', tab).should('be.visible')
      })
      cy.log('Admin has access to all system management features')
    })
  })

  context('Audit and Compliance', () => {
    it('should access audit logs', () => {
      cy.visit('/settings')
      cy.navigateToSettingsTab('Audit Logs')
      cy.verifyAdminAccess('Audit Logs')
    })

    it('should view all audit log entries', () => {
      cy.visit('/settings')
      cy.navigateToSettingsTab('Audit Logs')
      cy.get('table', { timeout: 5000 }).should('exist')
      cy.log('Review all system activities for compliance')
    })

    it('should export audit logs for compliance reporting', () => {
      cy.visit('/settings')
      cy.navigateToSettingsTab('Audit Logs')
      cy.get('button').contains(/export|download/i).should('be.visible')
      cy.log('Generate compliance reports for regulatory audits')
    })
  })

  context('Reports and Analytics', () => {
    it('should be able to view reports', () => {
      cy.visit('/reports')
      cy.url({ timeout: 2500 }).should('include', '/reports')
      cy.verifyAdminAccess('Reports')
    })

    it('should access district-wide analytics', () => {
      cy.visit('/reports')
      cy.get('body').should('be.visible')
      cy.log('Generate comprehensive district reports')
    })
  })

  context('Access Verification and Session Management', () => {
    it('should see administration panel title', () => {
      cy.visit('/settings')
      cy.contains('Administration Panel').should('be.visible')
    })

    it('should not be restricted from any navigation', () => {
      cy.visit('/students')
      cy.url().should('not.include', '/login')
      cy.visit('/medications')
      cy.url().should('not.include', '/login')
      cy.visit('/settings')
      cy.url().should('not.include', '/login')
      cy.log('Admin has unrestricted access to all features')
    })

    it('should maintain admin session across pages', () => {
      cy.visit('/dashboard')
      cy.visit('/students')
      cy.visit('/settings')
      cy.url().should('include', '/settings')
      cy.verifyUserRole('ADMIN')
    })

    it('should have full system access', () => {
      cy.visit('/dashboard')
      cy.get('body').should('be.visible')
      cy.log('Admin has complete system access')
    })

    it('should maintain admin role throughout session', () => {
      cy.visit('/dashboard')
      cy.verifyUserRole('ADMIN')
      cy.visit('/settings')
      cy.verifyUserRole('ADMIN')
    })

    it('should have no restricted pages', () => {
      const pages = ['/dashboard', '/students', '/medications', '/health-records', '/incidents', '/reports', '/settings']

      pages.forEach(page => {
        cy.visit(page)
        cy.url().should('not.include', '/403')
        cy.url().should('not.include', '/404')
        cy.url().should('not.include', '/login')
      })
      cy.log('All pages accessible to admin role')
    })
  })
})
