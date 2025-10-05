/// <reference types="cypress" />

/**
 * User Management E2E Tests
 * White Cross Healthcare Management System
 *
 * This test suite validates user management functionality including
 * user CRUD operations, role management, permissions, authentication,
 * and access control workflows.
 */

describe('User Management', () => {
  beforeEach(() => {
    cy.login('admin')
    cy.navigateTo('users')
  })

  context('User Overview and Search', () => {
    it('should display users management dashboard', () => {
      cy.get('[data-cy=users-title]').should('be.visible')
      cy.get('[data-cy=users-list]').should('be.visible')
      cy.get('[data-cy=user-stats]').should('be.visible')
      cy.get('[data-cy=add-user-button]').should('be.visible')
      cy.get('[data-cy=user-search]').should('be.visible')
    })

    it('should display user statistics correctly', () => {
      cy.get('[data-cy=total-users-stat]').should('contain', 'Total Users')
      cy.get('[data-cy=active-users-stat]').should('contain', 'Active Users')
      cy.get('[data-cy=inactive-users-stat]').should('contain', 'Inactive Users')
      cy.get('[data-cy=recent-logins-stat]').should('contain', 'Recent Logins')
    })

    it('should allow searching users by name or email', () => {
      cy.get('[data-cy=user-search]').type('nurse')
      cy.get('[data-cy=users-list]').should('contain', 'nurse')

      cy.get('[data-cy=user-search]').clear().type('admin@school.edu')
      cy.get('[data-cy=users-list]').should('contain', 'admin@school.edu')
    })

    it('should allow filtering users by role and status', () => {
      cy.get('[data-cy=role-filter]').select('NURSE')
      cy.get('[data-cy=users-list]').should('contain', 'Nurse')

      cy.get('[data-cy=status-filter]').select('ACTIVE')
      cy.get('[data-cy=users-list]').should('contain', 'Active')
    })
  })

  context('Creating New Users', () => {
    it('should create a new nurse user account', () => {
      cy.get('[data-cy=add-user-button]').click()
      cy.get('[data-cy=user-modal]').should('be.visible')

      cy.get('[data-cy=user-role]').select('NURSE')
      cy.get('[data-cy=first-name]').type('Jane')
      cy.get('[data-cy=last-name]').type('Smith')
      cy.get('[data-cy=email]').type('jane.smith@school.edu')
      cy.get('[data-cy=phone]').type('(555) 123-4567')

      cy.get('[data-cy=assigned-schools]').should('be.visible')
      cy.get('[data-cy=school-select]').select('Lincoln Elementary')

      cy.get('[data-cy=send-invitation]').check()
      cy.get('[data-cy=require-password-change]').check()

      cy.get('[data-cy=save-user-button]').click()
      cy.get('[data-cy=success-message]').should('contain', 'User created successfully')
    })

    it('should create a new admin user account', () => {
      cy.get('[data-cy=add-user-button]').click()

      cy.get('[data-cy=user-role]').select('ADMIN')
      cy.get('[data-cy=first-name]').type('John')
      cy.get('[data-cy=last-name]').type('Administrator')
      cy.get('[data-cy=email]').type('john.admin@school.edu')

      cy.get('[data-cy=admin-permissions]').should('be.visible')
      cy.get('[data-cy=system-admin-access]').check()
      cy.get('[data-cy=user-management-access]').check()
      cy.get('[data-cy=reports-access]').check()

      cy.get('[data-cy=save-user-button]').click()
      cy.get('[data-cy=success-message]').should('contain', 'Admin user created successfully')
    })

    it('should validate required fields when creating users', () => {
      cy.get('[data-cy=add-user-button]').click()

      cy.get('[data-cy=save-user-button]').click()

      cy.get('[data-cy=error-message]').should('contain', 'Role is required')
      cy.get('[data-cy=error-message]').should('contain', 'First name is required')
      cy.get('[data-cy=error-message]').should('contain', 'Last name is required')
      cy.get('[data-cy=error-message]').should('contain', 'Email is required')
    })

    it('should validate email format and uniqueness', () => {
      cy.get('[data-cy=add-user-button]').click()

      cy.get('[data-cy=email]').type('invalid-email')
      cy.get('[data-cy=save-user-button]').click()
      cy.get('[data-cy=error-message]').should('contain', 'Invalid email format')

      cy.get('[data-cy=email]').clear().type('existing@school.edu')
      cy.get('[data-cy=save-user-button]').click()
      cy.get('[data-cy=error-message]').should('contain', 'Email already exists')
    })
  })

  context('Managing Existing Users', () => {
    it('should display user details with complete information', () => {
      cy.get('[data-cy=user-item]').first().click()
      cy.get('[data-cy=user-details]').should('be.visible')

      cy.get('[data-cy=user-profile-header]').should('be.visible')
      cy.get('[data-cy=user-contact-info]').should('be.visible')
      cy.get('[data-cy=user-role-permissions]').should('be.visible')
      cy.get('[data-cy=user-activity-history]').should('be.visible')
    })

    it('should allow editing user information', () => {
      cy.get('[data-cy=user-item]').first().within(() => {
        cy.get('[data-cy=edit-user-button]').click()
      })

      cy.get('[data-cy=user-modal]').should('be.visible')
      cy.get('[data-cy=first-name]').clear().type('Updated Name')
      cy.get('[data-cy=phone]').clear().type('(555) 987-6543')

      cy.get('[data-cy=save-user-button]').click()
      cy.get('[data-cy=success-message]').should('contain', 'User updated successfully')
    })

    it('should allow changing user roles and permissions', () => {
      cy.get('[data-cy=user-item]').first().within(() => {
        cy.get('[data-cy=edit-roles-button]').click()
      })

      cy.get('[data-cy=roles-modal]').should('be.visible')
      cy.get('[data-cy=current-roles]').should('be.visible')
      cy.get('[data-cy=available-roles]').should('be.visible')

      cy.get('[data-cy=assign-additional-role]').click()
      cy.get('[data-cy=role-select]').select('HEALTH_COORDINATOR')

      cy.get('[data-cy=save-roles-button]').click()
      cy.get('[data-cy=success-message]').should('contain', 'User roles updated')
    })

    it('should allow deactivating and reactivating users', () => {
      cy.get('[data-cy=user-item]').first().within(() => {
        cy.get('[data-cy=deactivate-user-button]').click()
      })

      cy.get('[data-cy=confirm-deactivate-modal]').should('be.visible')
      cy.get('[data-cy=deactivation-reason]').type('Temporary leave')
      cy.get('[data-cy=confirm-deactivate-button]').click()

      cy.get('[data-cy=success-message]').should('contain', 'User deactivated')

      // Reactivate the user
      cy.get('[data-cy=user-item]').first().within(() => {
        cy.get('[data-cy=reactivate-user-button]').click()
      })

      cy.get('[data-cy=confirm-reactivate-button]').click()
      cy.get('[data-cy=success-message]').should('contain', 'User reactivated')
    })
  })

  context('Password Management', () => {
    it('should allow resetting user passwords', () => {
      cy.get('[data-cy=user-item]').first().within(() => {
        cy.get('[data-cy=reset-password-button]').click()
      })

      cy.get('[data-cy=password-reset-modal]').should('be.visible')
      cy.get('[data-cy=temporary-password]').should('be.visible')
      cy.get('[data-cy=require-password-change]').check()
      cy.get('[data-cy=send-reset-email]').check()

      cy.get('[data-cy=confirm-reset-button]').click()
      cy.get('[data-cy=success-message]').should('contain', 'Password reset successfully')
    })

    it('should allow users to change their own passwords', () => {
      cy.get('[data-cy=user-menu]').click()
      cy.get('[data-cy=change-password]').click()

      cy.get('[data-cy=password-change-modal]').should('be.visible')
      cy.get('[data-cy=current-password]').type('current-password-123')
      cy.get('[data-cy=new-password]').type('new-password-456')
      cy.get('[data-cy=confirm-password]').type('new-password-456')

      cy.get('[data-cy=save-password-button]').click()
      cy.get('[data-cy=success-message]').should('contain', 'Password changed successfully')
    })

    it('should validate password strength requirements', () => {
      cy.get('[data-cy=user-menu]').click()
      cy.get('[data-cy=change-password]').click()

      cy.get('[data-cy=new-password]').type('weak')
      cy.get('[data-cy=confirm-password]').type('weak')
      cy.get('[data-cy=save-password-button]').click()

      cy.get('[data-cy=error-message]').should('contain', 'Password must be at least 8 characters')
      cy.get('[data-cy=error-message]').should('contain', 'Password must contain uppercase and lowercase letters')
      cy.get('[data-cy=error-message]').should('contain', 'Password must contain numbers and special characters')
    })
  })

  context('Role and Permission Management', () => {
    it('should display roles and permissions matrix', () => {
      cy.get('[data-cy=roles-permissions-tab]').click()
      cy.get('[data-cy=roles-matrix]').should('be.visible')

      cy.get('[data-cy=role-cards]').should('be.visible')
      cy.get('[data-cy=permission-categories]').should('be.visible')
      cy.get('[data-cy=users-by-role]').should('be.visible')
    })

    it('should create custom roles with specific permissions', () => {
      cy.get('[data-cy=roles-permissions-tab]').click()

      cy.get('[data-cy=create-role-button]').click()
      cy.get('[data-cy=role-modal]').should('be.visible')

      cy.get('[data-cy=role-name]').type('Medication Coordinator')
      cy.get('[data-cy=role-description]').type('Manages medication administration and inventory')

      cy.get('[data-cy=permissions-section]').within(() => {
        cy.get('[data-cy=medication-management]').check()
        cy.get('[data-cy=inventory-management]').check()
        cy.get('[data-cy=medication-reports]').check()
        cy.get('[data-cy=student-medication-view]').check()
      })

      cy.get('[data-cy=save-role-button]').click()
      cy.get('[data-cy=success-message]').should('contain', 'Role created successfully')
    })

    it('should edit existing role permissions', () => {
      cy.get('[data-cy=roles-permissions-tab]').click()

      cy.get('[data-cy=role-card]').first().within(() => {
        cy.get('[data-cy=edit-role-button]').click()
      })

      cy.get('[data-cy=role-modal]').should('be.visible')
      cy.get('[data-cy=health-records-permission]').check()
      cy.get('[data-cy=reports-permission]').check()

      cy.get('[data-cy=save-role-button]').click()
      cy.get('[data-cy=success-message]').should('contain', 'Role permissions updated')
    })

    it('should assign multiple roles to users', () => {
      cy.get('[data-cy=user-item]').first().within(() => {
        cy.get('[data-cy=manage-roles-button]').click()
      })

      cy.get('[data-cy=user-roles-modal]').should('be.visible')
      cy.get('[data-cy=assigned-roles]').should('be.visible')
      cy.get('[data-cy=available-roles]').should('be.visible')

      cy.get('[data-cy=assign-role-button]').click()
      cy.get('[data-cy=role-to-assign]').select('EMERGENCY_RESPONDER')

      cy.get('[data-cy=save-user-roles]').click()
      cy.get('[data-cy=success-message]').should('contain', 'User roles updated')
    })
  })

  context('User Activity and Audit', () => {
    it('should display user activity logs', () => {
      cy.get('[data-cy=user-item]').first().click()

      cy.get('[data-cy=activity-tab]').click()
      cy.get('[data-cy=user-activity-logs]').should('be.visible')

      cy.get('[data-cy=activity-entries]').should('be.visible')
      cy.get('[data-cy=login-history]').should('be.visible')
      cy.get('[data-cy=action-history]').should('be.visible')
    })

    it('should filter user activity by date and type', () => {
      cy.get('[data-cy=user-item]').first().click()
      cy.get('[data-cy=activity-tab]').click()

      cy.get('[data-cy=activity-date-filter]').type('2024-10-01')
      cy.get('[data-cy=activity-type-filter]').select('LOGIN')
      cy.get('[data-cy=activity-module-filter]').select('HEALTH_RECORDS')

      cy.get('[data-cy=apply-activity-filters]').click()
      cy.get('[data-cy=filtered-activities]').should('be.visible')
    })

    it('should show detailed audit trail for user actions', () => {
      cy.get('[data-cy=user-item]').first().click()
      cy.get('[data-cy=activity-tab]').click()

      cy.get('[data-cy=activity-entry]').first().click()
      cy.get('[data-cy=activity-details-modal]').should('be.visible')

      cy.get('[data-cy=activity-timestamp]').should('be.visible')
      cy.get('[data-cy=activity-action]').should('be.visible')
      cy.get('[data-cy=activity-module]').should('be.visible')
      cy.get('[data-cy=activity-result]').should('be.visible')
    })
  })

  context('Bulk User Operations', () => {
    it('should allow bulk user import', () => {
      cy.get('[data-cy=bulk-operations-tab]').click()

      cy.get('[data-cy=import-users-button]').click()
      cy.get('[data-cy=import-modal]').should('be.visible')

      cy.get('[data-cy=import-file-upload]').should('be.visible')
      cy.get('[data-cy=import-template-download]').should('be.visible')
      cy.get('[data-cy=import-preview]').should('be.visible')

      cy.get('[data-cy=start-import-button]').click()
      cy.get('[data-cy=import-progress]').should('be.visible')
      cy.get('[data-cy=import-results]').should('be.visible')
    })

    it('should allow bulk role assignment', () => {
      cy.get('[data-cy=bulk-operations-tab]').click()

      cy.get('[data-cy=select-users-for-bulk]').should('be.visible')
      cy.get('[data-cy=bulk-assign-role]').click()

      cy.get('[data-cy=bulk-role-modal]').should('be.visible')
      cy.get('[data-cy=role-to-assign-bulk]').select('NURSE')
      cy.get('[data-cy=send-welcome-emails]').check()

      cy.get('[data-cy=confirm-bulk-assignment]').click()
      cy.get('[data-cy=success-message]').should('contain', 'Bulk role assignment completed')
    })

    it('should allow bulk user deactivation', () => {
      cy.get('[data-cy=bulk-operations-tab]').click()

      cy.get('[data-cy=bulk-deactivate-button]').click()
      cy.get('[data-cy=bulk-deactivate-modal]').should('be.visible')

      cy.get('[data-cy=deactivation-reason-bulk]').type('End of school year')
      cy.get('[data-cy=scheduled-deactivation-date]').type('2024-06-30')

      cy.get('[data-cy=confirm-bulk-deactivate]').click()
      cy.get('[data-cy=success-message]').should('contain', 'Bulk deactivation scheduled')
    })
  })

  context('User Authentication and Security', () => {
    it('should manage two-factor authentication', () => {
      cy.get('[data-cy=user-item]').first().within(() => {
        cy.get('[data-cy=manage-2fa-button]').click()
      })

      cy.get('[data-cy=2fa-modal]').should('be.visible')
      cy.get('[data-cy=2fa-status]').should('be.visible')
      cy.get('[data-cy=enable-2fa-button]').should('be.visible')
      cy.get('[data-cy=disable-2fa-button]').should('be.visible')
    })

    it('should display security settings for users', () => {
      cy.get('[data-cy=user-item]').first().click()

      cy.get('[data-cy=security-tab]').click()
      cy.get('[data-cy=user-security-settings]').should('be.visible')

      cy.get('[data-cy=password-expiry]').should('be.visible')
      cy.get('[data-cy=login-attempts]').should('be.visible')
      cy.get('[data-cy=session-history]').should('be.visible')
    })

    it('should show failed login attempts', () => {
      cy.get('[data-cy=user-item]').first().click()
      cy.get('[data-cy=security-tab]').click()

      cy.get('[data-cy=failed-login-attempts]').should('be.visible')
      cy.get('[data-cy=failed-attempt-dates]').should('be.visible')
      cy.get('[data-cy=failed-attempt-ips]').should('be.visible')
      cy.get('[data-cy=lock-account-button]').should('be.visible')
    })
  })

  context('User Notifications and Communication', () => {
    it('should manage user notification preferences', () => {
      cy.get('[data-cy=user-item]').first().within(() => {
        cy.get('[data-cy=manage-notifications-button]').click()
      })

      cy.get('[data-cy=notifications-modal]').should('be.visible')
      cy.get('[data-cy=email-notifications]').check()
      cy.get('[data-cy=sms-notifications]').check()
      cy.get('[data-cy=emergency-alerts]').check()

      cy.get('[data-cy=notification-schedule-from]').type('08:00')
      cy.get('[data-cy=notification-schedule-to]').type('18:00')

      cy.get('[data-cy=save-notification-preferences]').click()
      cy.get('[data-cy=success-message]').should('contain', 'Notification preferences updated')
    })

    it('should send system announcements to users', () => {
      cy.get('[data-cy=communication-tab]').click()

      cy.get('[data-cy=send-announcement-button]').click()
      cy.get('[data-cy=announcement-modal]').should('be.visible')

      cy.get('[data-cy=announcement-recipients]').should('be.visible')
      cy.get('[data-cy=select-user-roles]').should('be.visible')
      cy.get('[data-cy=announcement-subject]').type('System Maintenance Notice')
      cy.get('[data-cy=announcement-body]').type('Scheduled maintenance will occur this weekend')

      cy.get('[data-cy=send-announcement-button]').click()
      cy.get('[data-cy=success-message]').should('contain', 'Announcement sent')
    })
  })

  context('User Performance and Analytics', () => {
    it('should display user performance metrics', () => {
      cy.get('[data-cy=user-item]').first().click()

      cy.get('[data-cy=performance-tab]').click()
      cy.get('[data-cy=user-performance-metrics]').should('be.visible')

      cy.get('[data-cy=records-created-count]').should('be.visible')
      cy.get('[data-cy=medications-administered-count]').should('be.visible')
      cy.get('[data-cy=appointments-completed-count]').should('be.visible')
      cy.get('[data-cy=response-times-metrics]').should('be.visible')
    })

    it('should show user workload analytics', () => {
      cy.get('[data-cy=user-item]').first().click()
      cy.get('[data-cy=performance-tab]').click()

      cy.get('[data-cy=workload-charts]').should('be.visible')
      cy.get('[data-cy=daily-activity-patterns]').should('be.visible')
      cy.get('[data-cy=productivity-trends]').should('be.visible')
    })
  })

  context('Access Control and Permissions', () => {
    it('should test role-based access control', () => {
      // Test different user roles have appropriate access
      cy.get('[data-cy=user-role-filter]').select('NURSE')
      cy.get('[data-cy=users-list]').should('contain', 'Nurse')

      cy.get('[data-cy=user-role-filter]').select('ADMIN')
      cy.get('[data-cy=users-list]').should('contain', 'Admin')
    })

    it('should validate permission inheritance', () => {
      cy.get('[data-cy=roles-permissions-tab]').click()

      cy.get('[data-cy=role-card]').first().within(() => {
        cy.get('[data-cy=view-permissions-button]').click()
      })

      cy.get('[data-cy=permissions-modal]').should('be.visible')
      cy.get('[data-cy=direct-permissions]').should('be.visible')
      cy.get('[data-cy=inherited-permissions]').should('be.visible')
      cy.get('[data-cy=effective-permissions]').should('be.visible')
    })
  })
})
