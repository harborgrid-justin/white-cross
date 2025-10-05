/// <reference types="cypress" />

/**
 * Administration Features E2E Tests
 * White Cross Healthcare Management System
 *
 * This test suite validates administrative functionality including
 * district and school management, system configuration, user roles,
 * and administrative workflows.
 */

describe('Administration Features', () => {
  beforeEach(() => {
    cy.login('admin')
    cy.navigateTo('administration')
  })

  context('District Management', () => {
    it('should display district information and settings', () => {
      cy.get('[data-cy=administration-title]').should('be.visible')
      cy.get('[data-cy=district-info-card]').should('be.visible')
      cy.get('[data-cy=district-name]').should('be.visible')
      cy.get('[data-cy=district-address]').should('be.visible')
      cy.get('[data-cy=district-contact]').should('be.visible')
    })

    it('should allow editing district information', () => {
      cy.get('[data-cy=edit-district-button]').click()
      cy.get('[data-cy=district-modal]').should('be.visible')

      cy.get('[data-cy=district-name-input]').clear().type('Updated School District')
      cy.get('[data-cy=district-address-input]').clear().type('123 Education Ave, Learning City, ST 12345')
      cy.get('[data-cy=district-phone-input]').clear().type('(555) 123-4567')
      cy.get('[data-cy=district-email-input]').clear().type('admin@school-district.edu')

      cy.get('[data-cy=save-district-button]').click()
      cy.get('[data-cy=success-message]').should('contain', 'District information updated')
    })

    it('should manage district policies and settings', () => {
      cy.get('[data-cy=district-policies-tab]').click()
      cy.get('[data-cy=policies-section]').should('be.visible')

      cy.get('[data-cy=edit-health-policies]').click()
      cy.get('[data-cy=medication-policy]').type('Students may carry inhalers with parental consent')
      cy.get('[data-cy=emergency-policy]').type('Emergency protocols follow state guidelines')

      cy.get('[data-cy=save-policies-button]').click()
      cy.get('[data-cy=success-message]').should('contain', 'District policies updated')
    })
  })

  context('School Management', () => {
    it('should display schools in the district', () => {
      cy.get('[data-cy=schools-tab]').click()
      cy.get('[data-cy=schools-list]').should('be.visible')
      cy.get('[data-cy=school-cards]').should('have.length.greaterThan', 0)
    })

    it('should add a new school', () => {
      cy.get('[data-cy=schools-tab]').click()

      cy.get('[data-cy=add-school-button]').click()
      cy.get('[data-cy=school-modal]').should('be.visible')

      cy.get('[data-cy=school-name-input]').type('New Elementary School')
      cy.get('[data-cy=school-type-select]').select('ELEMENTARY')
      cy.get('[data-cy=school-address-input]').type('456 Learning Lane, Education City, ST 12346')
      cy.get('[data-cy=school-phone-input]').type('(555) 987-6543')
      cy.get('[data-cy=school-principal-input]').type('Dr. Principal Smith')

      cy.get('[data-cy=school-grade-range]').within(() => {
        cy.get('[data-cy=min-grade]').select('K')
        cy.get('[data-cy=max-grade]').select('5')
      })

      cy.get('[data-cy=save-school-button]').click()
      cy.get('[data-cy=success-message]').should('contain', 'School added successfully')
    })

    it('should edit existing school information', () => {
      cy.get('[data-cy=schools-tab]').click()

      cy.get('[data-cy=school-card]').first().within(() => {
        cy.get('[data-cy=edit-school-button]').click()
      })

      cy.get('[data-cy=school-modal]').should('be.visible')
      cy.get('[data-cy=school-name-input]').clear().type('Updated School Name')
      cy.get('[data-cy=school-enrollment-input]').clear().type('450')

      cy.get('[data-cy=save-school-button]').click()
      cy.get('[data-cy=success-message]').should('contain', 'School updated successfully')
    })

    it('should manage school health staff', () => {
      cy.get('[data-cy=schools-tab]').click()

      cy.get('[data-cy=school-card]').first().within(() => {
        cy.get('[data-cy=manage-staff-button]').click()
      })

      cy.get('[data-cy=school-staff-modal]').should('be.visible')
      cy.get('[data-cy=assigned-nurses]').should('be.visible')
      cy.get('[data-cy=assign-nurse-button]').should('be.visible')

      cy.get('[data-cy=assign-nurse-button]').click()
      cy.get('[data-cy=nurse-select]').select('Nurse Johnson')
      cy.get('[data-cy=assignment-type]').select('FULL_TIME')

      cy.get('[data-cy=save-assignment-button]').click()
      cy.get('[data-cy=success-message]').should('contain', 'Nurse assigned successfully')
    })
  })

  context('System Configuration', () => {
    it('should display system configuration options', () => {
      cy.get('[data-cy=system-config-tab]').click()
      cy.get('[data-cy=config-sections]').should('be.visible')
      cy.get('[data-cy=general-settings]').should('be.visible')
      cy.get('[data-cy=security-settings]').should('be.visible')
      cy.get('[data-cy=notification-settings]').should('be.visible')
    })

    it('should configure general system settings', () => {
      cy.get('[data-cy=system-config-tab]').click()

      cy.get('[data-cy=edit-general-settings]').click()
      cy.get('[data-cy=settings-modal]').should('be.visible')

      cy.get('[data-cy=system-name-input]').clear().type('White Cross Health Management System')
      cy.get('[data-cy=timezone-select]').select('America/New_York')
      cy.get('[data-cy=date-format-select]').select('MM/DD/YYYY')
      cy.get('[data-cy=default-language]').select('en-US')

      cy.get('[data-cy=save-settings-button]').click()
      cy.get('[data-cy=success-message]').should('contain', 'System settings updated')
    })

    it('should configure security settings', () => {
      cy.get('[data-cy=system-config-tab]').click()

      cy.get('[data-cy=security-settings-section]').within(() => {
        cy.get('[data-cy=edit-security-button]').click()
      })

      cy.get('[data-cy=password-policy-minlength]').clear().type('8')
      cy.get('[data-cy=password-policy-require-special]').check()
      cy.get('[data-cy=password-policy-require-numbers]').check()
      cy.get('[data-cy=session-timeout-minutes]').clear().type('60')
      cy.get('[data-cy=two-factor-required]').check()

      cy.get('[data-cy=save-security-button]').click()
      cy.get('[data-cy=success-message]').should('contain', 'Security settings updated')
    })

    it('should configure notification settings', () => {
      cy.get('[data-cy=system-config-tab]').click()

      cy.get('[data-cy=notification-settings-section]').within(() => {
        cy.get('[data-cy=edit-notifications-button]').click()
      })

      cy.get('[data-cy=email-notifications-enabled]').check()
      cy.get('[data-cy=sms-notifications-enabled]').check()
      cy.get('[data-cy=emergency-alerts-enabled]').check()

      cy.get('[data-cy=notification-schedule-from]').type('08:00')
      cy.get('[data-cy=notification-schedule-to]').type('18:00')

      cy.get('[data-cy=save-notifications-button]').click()
      cy.get('[data-cy=success-message]').should('contain', 'Notification settings updated')
    })
  })

  context('User Role Management', () => {
    it('should display user roles and permissions', () => {
      cy.get('[data-cy=user-management-tab]').click()
      cy.get('[data-cy=roles-permissions-section]').should('be.visible')
      cy.get('[data-cy=role-cards]').should('be.visible')
      cy.get('[data-cy=permissions-matrix]').should('be.visible')
    })

    it('should create custom user roles', () => {
      cy.get('[data-cy=user-management-tab]').click()

      cy.get('[data-cy=create-role-button]').click()
      cy.get('[data-cy=role-modal]').should('be.visible')

      cy.get('[data-cy=role-name-input]').type('Health Coordinator')
      cy.get('[data-cy=role-description]').type('Coordinates health services across schools')

      cy.get('[data-cy=role-permissions]').within(() => {
        cy.get('[data-cy=health-records-permission]').check()
        cy.get('[data-cy=reports-permission]').check()
        cy.get('[data-cy=student-management-permission]').check()
        cy.get('[data-cy=communication-permission]').check()
      })

      cy.get('[data-cy=save-role-button]').click()
      cy.get('[data-cy=success-message]').should('contain', 'Role created successfully')
    })

    it('should edit role permissions', () => {
      cy.get('[data-cy=user-management-tab]').click()

      cy.get('[data-cy=role-card]').first().within(() => {
        cy.get('[data-cy=edit-role-button]').click()
      })

      cy.get('[data-cy=role-modal]').should('be.visible')
      cy.get('[data-cy=medication-management-permission]').check()
      cy.get('[data-cy=emergency-response-permission]').check()

      cy.get('[data-cy=save-role-button]').click()
      cy.get('[data-cy=success-message]').should('contain', 'Role permissions updated')
    })

    it('should assign roles to users', () => {
      cy.get('[data-cy=user-management-tab]').click()

      cy.get('[data-cy=users-list]').should('be.visible')
      cy.get('[data-cy=user-item]').first().within(() => {
        cy.get('[data-cy=edit-user-roles]').click()
      })

      cy.get('[data-cy=user-roles-modal]').should('be.visible')
      cy.get('[data-cy=available-roles]').should('be.visible')
      cy.get('[data-cy=assign-role-button]').click()

      cy.get('[data-cy=save-user-roles]').click()
      cy.get('[data-cy=success-message]').should('contain', 'User roles updated')
    })
  })

  context('System Health and Monitoring', () => {
    it('should display system health dashboard', () => {
      cy.get('[data-cy=system-health-tab]').click()
      cy.get('[data-cy=health-dashboard]').should('be.visible')

      cy.get('[data-cy=system-status-indicators]').should('be.visible')
      cy.get('[data-cy=performance-metrics]').should('be.visible')
      cy.get('[data-cy=error-rates]').should('be.visible')
      cy.get('[data-cy=uptime-statistics]').should('be.visible')
    })

    it('should show detailed performance metrics', () => {
      cy.get('[data-cy=system-health-tab]').click()

      cy.get('[data-cy=performance-metrics-section]').within(() => {
        cy.get('[data-cy=response-time-chart]').should('be.visible')
        cy.get('[data-cy=memory-usage-chart]').should('be.visible')
        cy.get('[data-cy=cpu-usage-chart]').should('be.visible')
        cy.get('[data-cy=database-performance]').should('be.visible')
      })
    })

    it('should display error logs and alerts', () => {
      cy.get('[data-cy=system-health-tab]').click()

      cy.get('[data-cy=error-logs-section]').should('be.visible')
      cy.get('[data-cy=recent-errors]').should('be.visible')
      cy.get('[data-cy=error-trends]').should('be.visible')
      cy.get('[data-cy=critical-alerts]').should('be.visible')
    })
  })

  context('Data Management and Backup', () => {
    it('should configure backup settings', () => {
      cy.get('[data-cy=data-management-tab]').click()

      cy.get('[data-cy=backup-settings-section]').within(() => {
        cy.get('[data-cy=configure-backup]').click()
      })

      cy.get('[data-cy=backup-modal]').should('be.visible')
      cy.get('[data-cy=backup-frequency]').select('DAILY')
      cy.get('[data-cy=backup-time]').type('02:00')
      cy.get('[data-cy=backup-retention-days]').clear().type('90')
      cy.get('[data-cy=backup-encryption]').check()

      cy.get('[data-cy=save-backup-settings]').click()
      cy.get('[data-cy=success-message]').should('contain', 'Backup settings updated')
    })

    it('should initiate manual backup', () => {
      cy.get('[data-cy=data-management-tab]').click()

      cy.get('[data-cy=manual-backup-button]').click()
      cy.get('[data-cy=backup-modal]').should('be.visible')

      cy.get('[data-cy=backup-type]').select('FULL')
      cy.get('[data-cy=include-attachments]').check()
      cy.get('[data-cy=backup-description]').type('Manual backup before system update')

      cy.get('[data-cy=start-backup-button]').click()
      cy.get('[data-cy=backup-progress]').should('be.visible')
      cy.get('[data-cy=backup-complete]').should('be.visible')
    })

    it('should manage data retention policies', () => {
      cy.get('[data-cy=data-management-tab]').click()

      cy.get('[data-cy=retention-policies-section]').within(() => {
        cy.get('[data-cy=edit-retention-button]').click()
      })

      cy.get('[data-cy=retention-modal]').should('be.visible')
      cy.get('[data-cy=health-records-retention]').clear().type('7')
      cy.get('[data-cy=incident-reports-retention]').clear().type('10')
      cy.get('[data-cy=audit-logs-retention]').clear().type('5')

      cy.get('[data-cy=save-retention-button]').click()
      cy.get('[data-cy=success-message]').should('contain', 'Retention policies updated')
    })
  })

  context('License and Subscription Management', () => {
    it('should display license information', () => {
      cy.get('[data-cy=license-tab]').click()
      cy.get('[data-cy=license-info-card]').should('be.visible')

      cy.get('[data-cy=license-type]').should('be.visible')
      cy.get('[data-cy=license-status]').should('be.visible')
      cy.get('[data-cy=expiration-date]').should('be.visible')
      cy.get('[data-cy=licensed-users]').should('be.visible')
    })

    it('should manage license settings', () => {
      cy.get('[data-cy=license-tab]').click()

      cy.get('[data-cy=manage-license-button]').click()
      cy.get('[data-cy=license-modal]').should('be.visible')

      cy.get('[data-cy=max-users-input]').clear().type('150')
      cy.get('[data-cy=max-schools-input]').clear().type('5')
      cy.get('[data-cy=enable-advanced-features]').check()

      cy.get('[data-cy=save-license-button]').click()
      cy.get('[data-cy=success-message]').should('contain', 'License settings updated')
    })

    it('should display license usage statistics', () => {
      cy.get('[data-cy=license-tab]').click()

      cy.get('[data-cy=usage-statistics]').should('be.visible')
      cy.get('[data-cy=current-users-count]').should('be.visible')
      cy.get('[data-cy=schools-count]').should('be.visible')
      cy.get('[data-cy=storage-usage]').should('be.visible')
      cy.get('[data-cy=api-calls-count]').should('be.visible')
    })
  })

  context('Audit and Compliance', () => {
    it('should display audit logs', () => {
      cy.get('[data-cy=audit-tab]').click()
      cy.get('[data-cy=audit-logs-section]').should('be.visible')

      cy.get('[data-cy=audit-entries]').should('be.visible')
      cy.get('[data-cy=audit-filters]').should('be.visible')
      cy.get('[data-cy=audit-search]').should('be.visible')
    })

    it('should filter audit logs by criteria', () => {
      cy.get('[data-cy=audit-tab]').click()

      cy.get('[data-cy=audit-date-filter]').type('2024-10-01')
      cy.get('[data-cy=audit-user-filter]').select('All Users')
      cy.get('[data-cy=audit-action-filter]').select('LOGIN')
      cy.get('[data-cy=audit-module-filter]').select('HEALTH_RECORDS')

      cy.get('[data-cy=apply-audit-filters]').click()
      cy.get('[data-cy=filtered-audit-entries]').should('be.visible')
    })

    it('should export audit logs', () => {
      cy.get('[data-cy=audit-tab]').click()

      cy.get('[data-cy=export-audit-button]').click()
      cy.get('[data-cy=export-modal]').should('be.visible')

      cy.get('[data-cy=export-format]').select('PDF')
      cy.get('[data-cy=include-sensitive-data]').check()
      cy.get('[data-cy=audit-export-date-range]').should('be.visible')

      cy.get('[data-cy=generate-audit-export]').click()
      cy.get('[data-cy=download-link]').should('be.visible')
    })

    it('should display compliance status', () => {
      cy.get('[data-cy=compliance-tab]').click()
      cy.get('[data-cy=compliance-dashboard]').should('be.visible')

      cy.get('[data-cy=hipaa-compliance-status]').should('be.visible')
      cy.get('[data-cy=ferpa-compliance-status]').should('be.visible')
      cy.get('[data-cy=state-regulations-status]').should('be.visible')
      cy.get('[data-cy=audit-readiness-status]').should('be.visible')
    })
  })

  context('System Maintenance', () => {
    it('should perform system maintenance tasks', () => {
      cy.get('[data-cy=maintenance-tab]').click()
      cy.get('[data-cy=maintenance-tasks]').should('be.visible')

      cy.get('[data-cy=clear-cache-button]').click()
      cy.get('[data-cy=cache-cleared-message]').should('be.visible')

      cy.get('[data-cy=optimize-database-button]').click()
      cy.get('[data-cy=database-optimization-progress]').should('be.visible')
      cy.get('[data-cy=optimization-complete]').should('be.visible')
    })

    it('should manage system updates', () => {
      cy.get('[data-cy=maintenance-tab]').click()

      cy.get('[data-cy=check-updates-button]').click()
      cy.get('[data-cy=update-check-results]').should('be.visible')

      cy.get('[data-cy=available-updates]').should('be.visible')
      cy.get('[data-cy=install-update-button]').should('be.visible')
    })

    it('should monitor system resources', () => {
      cy.get('[data-cy=maintenance-tab]').click()

      cy.get('[data-cy=resource-monitoring]').should('be.visible')
      cy.get('[data-cy=memory-usage]').should('be.visible')
      cy.get('[data-cy=disk-usage]').should('be.visible')
      cy.get('[data-cy=cpu-usage]').should('be.visible')
      cy.get('[data-cy=network-usage]').should('be.visible')
    })
  })

  context('Integration with External Systems', () => {
    it('should manage external system integrations', () => {
      cy.get('[data-cy=external-integrations-tab]').click()
      cy.get('[data-cy=integrations-list]').should('be.visible')

      cy.get('[data-cy=state-reporting-system]').should('be.visible')
      cy.get('[data-cy=federal-reporting-system]').should('be.visible')
      cy.get('[data-cy=insurance-billing-system]').should('be.visible')
    })

    it('should configure state reporting integration', () => {
      cy.get('[data-cy=external-integrations-tab]').click()

      cy.get('[data-cy=state-reporting-card]').within(() => {
        cy.get('[data-cy=configure-integration]').click()
      })

      cy.get('[data-cy=state-integration-modal]').should('be.visible')
      cy.get('[data-cy=state-api-endpoint]').type('https://state.edu.gov/api')
      cy.get('[data-cy=state-api-key]').type('state-api-key-123')
      cy.get('[data-cy=report-frequency]').select('MONTHLY')

      cy.get('[data-cy=save-state-integration]').click()
      cy.get('[data-cy=success-message]').should('contain', 'State reporting integration configured')
    })
  })
})
