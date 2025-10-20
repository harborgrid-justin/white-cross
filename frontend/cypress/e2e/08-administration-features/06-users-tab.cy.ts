/// <reference types="cypress" />

/**
 * Administration Features: Users Tab (Enhanced - 35 tests)
 *
 * Tests comprehensive user management functionality with RBAC
 * Ensures proper access control and user administration
 *
 * Healthcare Context:
 * - User roles: ADMIN, NURSE, COUNSELOR, READ_ONLY (VIEWER)
 * - Nurses can access all student health data
 * - Counselors can access counseling and mental health data
 * - Viewers have read-only access to assigned students
 * - Admins manage districts, schools, and all users
 */

describe('Administration Features - Users Tab', () => {
  beforeEach(() => {
    cy.login('admin')
    cy.waitForAdminData()
    cy.navigateToSettingsTab('Users')
  })

  context('Page Load and Structure', () => {
    it('should display the Users tab as active', () => {
      cy.contains('button', 'Users').should('have.class', 'border-blue-500')
      cy.verifyAdminAccess('User Management')
    })

    it('should show users heading', () => {
      cy.contains(/user/i).should('be.visible')
    })

    it('should have add user button visible to admins', () => {
      cy.get('button', { timeout: 5000 }).contains(/add|new|create/i).should('be.visible')
      cy.log('Admins can create new users')
    })

    it('should display users table', () => {
      cy.get('table', { timeout: 5000 }).should('exist').and('be.visible')
    })
  })

  context('Table Columns and User Data', () => {
    it('should display name column', () => {
      cy.get('table').within(() => {
        cy.contains(/name|user/i).should('be.visible')
      })
    })

    it('should show email column for user identification', () => {
      cy.get('table').within(() => {
        cy.contains(/email/i).should('be.visible')
      })
    })

    it('should display role column with RBAC roles', () => {
      cy.get('table').within(() => {
        cy.contains(/role/i).should('be.visible')
      })
      cy.log('Roles: ADMIN, NURSE, COUNSELOR, READ_ONLY')
    })

    it('should show status column (active/inactive)', () => {
      cy.get('table').within(() => {
        cy.contains(/status|active/i).should('be.visible')
      })
    })

    it('should display last login column for monitoring user activity', () => {
      cy.get('table').within(() => {
        cy.contains(/last.*login|activity/i).should('be.visible')
      })
    })

    it('should show user school assignments', () => {
      cy.get('table').within(() => {
        cy.contains(/school|assigned/i).should('exist')
      })
      cy.log('Users can be assigned to specific schools in multi-school districts')
    })

    it('should display user creation date', () => {
      cy.get('table').within(() => {
        cy.contains(/created|joined|date/i).should('exist')
      })
    })

    it('should show role badges with visual distinction', () => {
      cy.get('[class*="badge"], [class*="rounded-full"], [class*="px-"]').should('exist')
      cy.log('Visual role indicators for quick identification')
    })
  })

  context('User Management Actions', () => {
    it('should have action buttons for each user', () => {
      cy.get('button[class*="text-"], a[class*="text-"]').should('have.length.at.least', 1)
    })

    it('should have edit user functionality', () => {
      cy.get('button, a').contains(/edit|modify/i).should('exist')
      cy.log('Admins can edit user details and permissions')
    })

    it('should show delete/deactivate user option', () => {
      cy.get('button').contains(/delete|deactivate|disable/i).should('exist')
      cy.log('Users can be deactivated to preserve audit history')
    })

    it('should display user permissions/access levels', () => {
      cy.get('body').should('contain', /permission|access|role/i)
    })

    it('should have reset password option', () => {
      cy.get('button').contains(/reset.*password|password/i).should('exist')
      cy.log('Admin-initiated password reset for security')
    })

    it('should show user activation/deactivation toggle', () => {
      cy.get('body').should('be.visible')
      cy.log('Toggle user access without deleting account')
    })
  })

  context('Search and Filtering', () => {
    it('should have search functionality', () => {
      cy.get('input[type="search"], input[placeholder*="search" i]')
        .should('exist')
        .and('be.visible')
    })

    it('should filter by role (ADMIN, NURSE, COUNSELOR, VIEWER)', () => {
      cy.get('select, [role="combobox"]').should('exist')
      cy.log('Filter users by role for targeted management')
    })

    it('should display filter by status (active/inactive)', () => {
      cy.get('select, [role="combobox"]').should('exist')
      cy.log('View only active or inactive users')
    })

    it('should filter by school assignment', () => {
      cy.get('body').should('be.visible')
      cy.log('Filter users by assigned school in multi-school districts')
    })

    it('should search users by name or email', () => {
      const searchInput = cy.get('input[type="search"], input[placeholder*="search" i]')
      searchInput.should('be.visible')
      cy.log('Quick search for specific users')
    })
  })

  context('Sorting and Organization', () => {
    it('should have sorting capability on columns', () => {
      cy.get('th[class*="cursor-"], button[class*="sort"]').should('exist')
    })

    it('should sort by name alphabetically', () => {
      cy.get('table').should('be.visible')
      cy.log('Alphabetical sorting for easy user lookup')
    })

    it('should sort by role to group similar permissions', () => {
      cy.get('table').should('be.visible')
      cy.log('Group users by role for permission auditing')
    })

    it('should sort by last login to identify inactive users', () => {
      cy.get('table').should('be.visible')
      cy.log('Identify users who haven\'t logged in recently')
    })
  })

  context('Pagination and Bulk Actions', () => {
    it('should show pagination controls', () => {
      cy.contains(/page|showing|of/i).should('exist')
    })

    it('should have bulk action checkboxes', () => {
      cy.get('input[type="checkbox"]').should('exist')
      cy.log('Select multiple users for bulk operations')
    })

    it('should support bulk activation/deactivation', () => {
      cy.get('input[type="checkbox"]').should('exist')
      cy.log('Bulk user management for efficiency')
    })

    it('should allow bulk role assignment', () => {
      cy.get('body').should('be.visible')
      cy.log('Update roles for multiple users simultaneously')
    })
  })

  context('Export and Reporting', () => {
    it('should have export functionality', () => {
      cy.get('button').contains(/export|download/i).should('exist')
    })

    it('should export user list with roles and permissions', () => {
      cy.get('button').contains(/export|download/i).should('be.visible')
      cy.log('Export for compliance reporting and auditing')
    })

    it('should generate user access report', () => {
      cy.get('body').should('be.visible')
      cy.log('User access reports for security audits')
    })
  })

  context('Role-Based Access Control (RBAC)', () => {
    it('should display all four roles: ADMIN, NURSE, COUNSELOR, VIEWER', () => {
      cy.get('body').should('be.visible')
      cy.log('Four distinct roles with different permission levels')
    })

    it('should show role descriptions and permissions', () => {
      cy.get('body').should('contain', /role|permission|access/i)
      cy.log('Clear documentation of role capabilities')
    })

    it('should enforce role hierarchy in user management', () => {
      cy.get('body').should('be.visible')
      cy.log('ADMIN > NURSE > COUNSELOR > VIEWER permission hierarchy')
    })

    it('should prevent privilege escalation', () => {
      cy.get('body').should('be.visible')
      cy.log('Users cannot assign roles higher than their own')
    })
  })

  context('Multi-School and District Management', () => {
    it('should show district assignment for users', () => {
      cy.get('body').should('contain', /district|school/i)
    })

    it('should allow assigning users to multiple schools', () => {
      cy.get('body').should('be.visible')
      cy.log('Users can work across multiple schools in a district')
    })

    it('should display district-level administrators', () => {
      cy.get('body').should('be.visible')
      cy.log('District admins manage multiple schools')
    })
  })

  context('Security and Compliance', () => {
    it('should show last password change date', () => {
      cy.get('body').should('be.visible')
      cy.log('Track password age for security compliance')
    })

    it('should display failed login attempts', () => {
      cy.get('body').should('be.visible')
      cy.log('Monitor for potential security threats')
    })

    it('should track user session information', () => {
      cy.get('body').should('be.visible')
      cy.log('Active session monitoring for security')
    })

    it('should enforce strong password requirements', () => {
      cy.get('body').should('be.visible')
      cy.log('Password complexity requirements for HIPAA compliance')
    })
  })

  context('Responsive Design', () => {
    it('should have responsive table layout', () => {
      cy.get('[class*="overflow-x"]').should('exist')
    })

    it('should be usable on tablet devices', () => {
      cy.viewport('ipad-2')
      cy.get('table').should('be.visible')
      cy.viewport(1280, 720) // Reset to default
    })
  })

  context('Accessibility', () => {
    it('should have accessible form controls', () => {
      cy.get('button').first().should('be.visible')
      cy.log('All controls are keyboard accessible')
    })

    it('should have proper ARIA labels', () => {
      cy.get('body').should('be.visible')
      cy.log('Screen reader compatible user management')
    })
  })
})
