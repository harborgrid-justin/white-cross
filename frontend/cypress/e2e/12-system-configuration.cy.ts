/// <reference types="cypress" />

/**
 * System Configuration E2E Tests
 * White Cross Healthcare Management System
 *
 * This test suite validates system configuration functionality including
 * settings management, backup/restore operations, maintenance tasks,
 * and system-wide configuration options.
 */

describe('System Configuration', () => {
  beforeEach(() => {
    cy.login('admin')
    cy.navigateTo('system-config')
  })

  context('System Settings Overview', () => {
    it('should display system configuration dashboard', () => {
      cy.get('[data-cy=system-config-title]').should('be.visible')
      cy.get('[data-cy=config-categories]').should('be.visible')
      cy.get('[data-cy=system-status-indicators]').should('be.visible')
      cy.get('[data-cy=config-changes-history]').should('be.visible')
    })

    it('should show system health indicators', () => {
      cy.get('[data-cy=system-health-section]').should('be.visible')
      cy.get('[data-cy=database-status]').should('be.visible')
      cy.get('[data-cy=api-status]').should('be.visible')
      cy.get('[data-cy=storage-status]').should('be.visible')
      cy.get('[data-cy=performance-metrics]').should('be.visible')
    })

    it('should display configuration change history', () => {
      cy.get('[data-cy=config-history-section]').should('be.visible')
      cy.get('[data-cy=recent-changes]').should('be.visible')
      cy.get('[data-cy=change-timestamps]').should('be.visible')
      cy.get('[data-cy=change-authors]').should('be.visible')
    })
  })

  context('General System Settings', () => {
    it('should configure basic system information', () => {
      cy.get('[data-cy=general-settings-tab]').click()

      cy.get('[data-cy=edit-basic-settings]').click()
      cy.get('[data-cy=settings-modal]').should('be.visible')

      cy.get('[data-cy=system-name-input]').clear().type('White Cross Health Management System')
      cy.get('[data-cy=system-description]').type('Comprehensive school health management platform')
      cy.get('[data-cy=timezone-select]').select('America/New_York')
      cy.get('[data-cy=date-format-select]').select('MM/DD/YYYY')
      cy.get('[data-cy=time-format-select]').select('12_HOUR')

      cy.get('[data-cy=save-basic-settings]').click()
      cy.get('[data-cy=success-message]').should('contain', 'Basic settings updated')
    })

    it('should configure organization details', () => {
      cy.get('[data-cy=general-settings-tab]').click()

      cy.get('[data-cy=edit-organization-button]').click()
      cy.get('[data-cy=organization-modal]').should('be.visible')

      cy.get('[data-cy=organization-name]').type('School District Health Services')
      cy.get('[data-cy=organization-address]').type('123 Education Avenue, Learning City, ST 12345')
      cy.get('[data-cy=organization-phone]').type('(555) 123-4567')
      cy.get('[data-cy=organization-email]').type('health@school-district.edu')
      cy.get('[data-cy=organization-website]').type('https://health.school-district.edu')

      cy.get('[data-cy=save-organization-settings]').click()
      cy.get('[data-cy=success-message]').should('contain', 'Organization settings updated')
    })

    it('should configure display and localization settings', () => {
      cy.get('[data-cy=general-settings-tab]').click()

      cy.get('[data-cy=edit-display-button]').click()
      cy.get('[data-cy=display-modal]').should('be.visible')

      cy.get('[data-cy=default-language]').select('en-US')
      cy.get('[data-cy=default-theme]').select('LIGHT')
      cy.get('[data-cy=default-rows-per-page]').select('25')
      cy.get('[data-cy=enable-animations]').check()
      cy.get('[data-cy=compact-mode-default]').uncheck()

      cy.get('[data-cy=save-display-settings]').click()
      cy.get('[data-cy=success-message]').should('contain', 'Display settings updated')
    })
  })

  context('Security Configuration', () => {
    it('should configure password policies', () => {
      cy.get('[data-cy=security-tab]').click()

      cy.get('[data-cy=edit-password-policy]').click()
      cy.get('[data-cy=password-policy-modal]').should('be.visible')

      cy.get('[data-cy=min-password-length]').clear().type('10')
      cy.get('[data-cy=require-uppercase]').check()
      cy.get('[data-cy=require-lowercase]').check()
      cy.get('[data-cy=require-numbers]').check()
      cy.get('[data-cy=require-special-chars]').check()
      cy.get('[data-cy=password-expiry-days]').clear().type('90')
      cy.get('[data-cy=prevent-password-reuse]').clear().type('5')

      cy.get('[data-cy=save-password-policy]').click()
      cy.get('[data-cy=success-message]').should('contain', 'Password policy updated')
    })

    it('should configure session management settings', () => {
      cy.get('[data-cy=security-tab]').click()

      cy.get('[data-cy=edit-session-settings]').click()
      cy.get('[data-cy=session-modal]').should('be.visible')

      cy.get('[data-cy=session-timeout-minutes]').clear().type('120')
      cy.get('[data-cy=enable-concurrent-sessions]').check()
      cy.get('[data-cy=max-concurrent-sessions]').clear().type('3')
      cy.get('[data-cy=enable-session-ip-tracking]').check()
      cy.get('[data-cy=enable-login-notifications]').check()

      cy.get('[data-cy=save-session-settings]').click()
      cy.get('[data-cy=success-message]').should('contain', 'Session settings updated')
    })

    it('should configure two-factor authentication requirements', () => {
      cy.get('[data-cy=security-tab]').click()

      cy.get('[data-cy=edit-2fa-settings]').click()
      cy.get('[data-cy=2fa-modal]').should('be.visible')

      cy.get('[data-cy=2fa-required-roles]').should('be.visible')
      cy.get('[data-cy=require-2fa-admin]').check()
      cy.get('[data-cy=require-2fa-nurse]').uncheck()
      cy.get('[data-cy=2fa-methods-allowed]').should('be.visible')
      cy.get('[data-cy=allow-sms-2fa]').check()
      cy.get('[data-cy=allow-app-2fa]').check()

      cy.get('[data-cy=save-2fa-settings]').click()
      cy.get('[data-cy=success-message]').should('contain', '2FA settings updated')
    })

    it('should manage security certificates and encryption', () => {
      cy.get('[data-cy=security-tab]').click()

      cy.get('[data-cy=edit-certificates-button]').click()
      cy.get('[data-cy=certificates-modal]').should('be.visible')

      cy.get('[data-cy=ssl-certificate-status]').should('be.visible')
      cy.get('[data-cy=encryption-algorithm]').select('AES-256')
      cy.get('[data-cy=key-rotation-days]').clear().type('365')
      cy.get('[data-cy=enable-data-encryption]').check()

      cy.get('[data-cy=save-certificate-settings]').click()
      cy.get('[data-cy=success-message]').should('contain', 'Certificate settings updated')
    })
  })

  context('Notification Settings', () => {
    it('should configure email notification settings', () => {
      cy.get('[data-cy=notifications-tab]').click()

      cy.get('[data-cy=edit-email-settings]').click()
      cy.get('[data-cy=email-modal]').should('be.visible')

      cy.get('[data-cy=smtp-server]').type('smtp.school-district.edu')
      cy.get('[data-cy=smtp-port]').clear().type('587')
      cy.get('[data-cy=smtp-username]').type('system@school-district.edu')
      cy.get('[data-cy=smtp-password]').type('smtp-password-123')
      cy.get('[data-cy=smtp-encryption]').select('TLS')

      cy.get('[data-cy=save-email-settings]').click()
      cy.get('[data-cy=success-message]').should('contain', 'Email settings updated')
    })

    it('should configure SMS notification settings', () => {
      cy.get('[data-cy=notifications-tab]').click()

      cy.get('[data-cy=edit-sms-settings]').click()
      cy.get('[data-cy=sms-modal]').should('be.visible')

      cy.get('[data-cy=sms-provider]').select('TWILIO')
      cy.get('[data-cy=sms-account-sid]').type('twilio-account-sid')
      cy.get('[data-cy=sms-auth-token]').type('twilio-auth-token')
      cy.get('[data-cy=sms-from-number]').type('+15551234567')

      cy.get('[data-cy=save-sms-settings]').click()
      cy.get('[data-cy=success-message]').should('contain', 'SMS settings updated')
    })

    it('should configure notification templates', () => {
      cy.get('[data-cy=notifications-tab]').click()

      cy.get('[data-cy=edit-templates-button]').click()
      cy.get('[data-cy=templates-modal]').should('be.visible')

      cy.get('[data-cy=appointment-reminder-template]').type('Reminder: You have an appointment scheduled for {appointment_time}')
      cy.get('[data-cy=medication-reminder-template]').type('Medication reminder: {medication_name} is due')
      cy.get('[data-cy=emergency-alert-template]').type('EMERGENCY: {emergency_message}')

      cy.get('[data-cy=save-templates-button]').click()
      cy.get('[data-cy=success-message]').should('contain', 'Notification templates updated')
    })

    it('should configure notification schedules and restrictions', () => {
      cy.get('[data-cy=notifications-tab]').click()

      cy.get('[data-cy=edit-schedule-button]').click()
      cy.get('[data-cy=schedule-modal]').should('be.visible')

      cy.get('[data-cy=notification-hours-from]').type('08:00')
      cy.get('[data-cy=notification-hours-to]').type('18:00')
      cy.get('[data-cy=allowed-days]').should('be.visible')
      cy.get('[data-cy=emergency-notifications-always]').check()

      cy.get('[data-cy=save-schedule-settings]').click()
      cy.get('[data-cy=success-message]').should('contain', 'Notification schedule updated')
    })
  })

  context('Backup and Recovery', () => {
    it('should configure automated backup settings', () => {
      cy.get('[data-cy=backup-tab]').click()

      cy.get('[data-cy=edit-backup-settings]').click()
      cy.get('[data-cy=backup-modal]').should('be.visible')

      cy.get('[data-cy=backup-frequency]').select('DAILY')
      cy.get('[data-cy=backup-time]').type('02:00')
      cy.get('[data-cy=backup-retention-days]').clear().type('90')
      cy.get('[data-cy=backup-location]').type('/backup/health-system')
      cy.get('[data-cy=backup-encryption]').check()

      cy.get('[data-cy=save-backup-settings]').click()
      cy.get('[data-cy=success-message]').should('contain', 'Backup settings updated')
    })

    it('should initiate manual backup', () => {
      cy.get('[data-cy=backup-tab]').click()

      cy.get('[data-cy=manual-backup-button]').click()
      cy.get('[data-cy=manual-backup-modal]').should('be.visible')

      cy.get('[data-cy=backup-type]').select('FULL')
      cy.get('[data-cy=include-attachments]').check()
      cy.get('[data-cy=include-audit-logs]').check()
      cy.get('[data-cy=backup-description]').type('Manual backup before system update')

      cy.get('[data-cy=start-backup-button]').click()
      cy.get('[data-cy=backup-progress]').should('be.visible')
      cy.get('[data-cy=backup-complete]').should('be.visible')
    })

    it('should display backup history and status', () => {
      cy.get('[data-cy=backup-tab]').click()

      cy.get('[data-cy=backup-history-section]').should('be.visible')
      cy.get('[data-cy=backup-entries]').should('be.visible')
      cy.get('[data-cy=backup-status]').should('be.visible')
      cy.get('[data-cy=backup-size]').should('be.visible')
      cy.get('[data-cy=backup-duration]').should('be.visible')
    })

    it('should allow restoring from backup', () => {
      cy.get('[data-cy=backup-tab]').click()

      cy.get('[data-cy=backup-entry]').first().within(() => {
        cy.get('[data-cy=restore-button]').click()
      })

      cy.get('[data-cy=restore-modal]').should('be.visible')
      cy.get('[data-cy=restore-point]').should('be.visible')
      cy.get('[data-cy=restore-options]').should('be.visible')
      cy.get('[data-cy=confirm-restore]').should('be.visible')
    })

    it('should configure data retention policies', () => {
      cy.get('[data-cy=backup-tab]').click()

      cy.get('[data-cy=edit-retention-button]').click()
      cy.get('[data-cy=retention-modal]').should('be.visible')

      cy.get('[data-cy=health-records-retention]').clear().type('2555') // 7 years
      cy.get('[data-cy=incident-reports-retention]').clear().type('3650') // 10 years
      cy.get('[data-cy=audit-logs-retention]').clear().type('1825') // 5 years
      cy.get('[data-cy=system-logs-retention]').clear().type('365') // 1 year

      cy.get('[data-cy=save-retention-settings]').click()
      cy.get('[data-cy=success-message]').should('contain', 'Retention policies updated')
    })
  })

  context('System Maintenance', () => {
    it('should perform database maintenance tasks', () => {
      cy.get('[data-cy=maintenance-tab]').click()

      cy.get('[data-cy=database-maintenance-section]').should('be.visible')
      cy.get('[data-cy=optimize-tables-button]').click()
      cy.get('[data-cy=optimization-progress]').should('be.visible')
      cy.get('[data-cy=optimization-complete]').should('be.visible')

      cy.get('[data-cy=rebuild-indexes-button]').click()
      cy.get('[data-cy=index-progress]').should('be.visible')
    })

    it('should clear system caches', () => {
      cy.get('[data-cy=maintenance-tab]').click()

      cy.get('[data-cy=cache-management-section]').should('be.visible')
      cy.get('[data-cy=clear-application-cache]').click()
      cy.get('[data-cy=cache-cleared-message]').should('be.visible')

      cy.get('[data-cy=clear-redis-cache]').click()
      cy.get('[data-cy=redis-cleared-message]').should('be.visible')
    })

    it('should manage system logs', () => {
      cy.get('[data-cy=maintenance-tab]').click()

      cy.get('[data-cy=log-management-section]').should('be.visible')
      cy.get('[data-cy=log-rotation-settings]').should('be.visible')
      cy.get('[data-cy=log-retention-settings]').should('be.visible')
      cy.get('[data-cy=archive-old-logs]').click()
      cy.get('[data-cy=log-archive-progress]').should('be.visible')
    })

    it('should perform system health checks', () => {
      cy.get('[data-cy=maintenance-tab]').click()

      cy.get('[data-cy=run-health-check]').click()
      cy.get('[data-cy=health-check-modal]').should('be.visible')

      cy.get('[data-cy=check-database-connection]').should('be.visible')
      cy.get('[data-cy=check-api-endpoints]').should('be.visible')
      cy.get('[data-cy=check-storage-systems]').should('be.visible')
      cy.get('[data-cy=check-integrations]').should('be.visible')

      cy.get('[data-cy=start-health-check]').click()
      cy.get('[data-cy=health-check-results]').should('be.visible')
    })
  })

  context('Integration Configuration', () => {
    it('should configure external system integrations', () => {
      cy.get('[data-cy=integrations-tab]').click()

      cy.get('[data-cy=add-integration-button]').click()
      cy.get('[data-cy=integration-modal]').should('be.visible')

      cy.get('[data-cy=integration-type]').select('STATE_REPORTING')
      cy.get('[data-cy=integration-name]').type('State Education Department')
      cy.get('[data-cy=integration-endpoint]').type('https://state.edu.gov/api')
      cy.get('[data-cy=integration-api-key]').type('state-api-key-123')

      cy.get('[data-cy=save-integration-button]').click()
      cy.get('[data-cy=success-message]').should('contain', 'Integration configured')
    })

    it('should manage integration schedules', () => {
      cy.get('[data-cy=integrations-tab]').click()

      cy.get('[data-cy=integration-item]').first().within(() => {
        cy.get('[data-cy=configure-schedule]').click()
      })

      cy.get('[data-cy=schedule-modal]').should('be.visible')
      cy.get('[data-cy=sync-frequency]').select('WEEKLY')
      cy.get('[data-cy=sync-day]').select('SUNDAY')
      cy.get('[data-cy=sync-time]').type('03:00')

      cy.get('[data-cy=save-integration-schedule]').click()
      cy.get('[data-cy=success-message]').should('contain', 'Integration schedule updated')
    })
  })

  context('Performance and Monitoring', () => {
    it('should display system performance metrics', () => {
      cy.get('[data-cy=performance-tab]').click()

      cy.get('[data-cy=performance-dashboard]').should('be.visible')
      cy.get('[data-cy=response-time-charts]').should('be.visible')
      cy.get('[data-cy=throughput-metrics]').should('be.visible')
      cy.get('[data-cy=error-rate-charts]').should('be.visible')
    })

    it('should configure performance monitoring', () => {
      cy.get('[data-cy=performance-tab]').click()

      cy.get('[data-cy=edit-monitoring-button]').click()
      cy.get('[data-cy=monitoring-modal]').should('be.visible')

      cy.get('[data-cy=enable-response-time-monitoring]').check()
      cy.get('[data-cy=enable-error-rate-monitoring]').check()
      cy.get('[data-cy=monitoring-interval-minutes]').clear().type('5')
      cy.get('[data-cy=retention-days]').clear().type('30')

      cy.get('[data-cy=save-monitoring-settings]').click()
      cy.get('[data-cy=success-message]').should('contain', 'Monitoring settings updated')
    })

    it('should set up performance alerts', () => {
      cy.get('[data-cy=performance-tab]').click()

      cy.get('[data-cy=configure-alerts-button]').click()
      cy.get('[data-cy=alerts-modal]').should('be.visible')

      cy.get('[data-cy=response-time-threshold]').clear().type('5000') // 5 seconds
      cy.get('[data-cy=error-rate-threshold]').clear().type('5') // 5%
      cy.get('[data-cy=alert-recipients]').type('admin@school.edu,devops@school.edu')

      cy.get('[data-cy=save-performance-alerts]').click()
      cy.get('[data-cy=success-message]').should('contain', 'Performance alerts configured')
    })
  })

  context('Data Management', () => {
    it('should configure data validation rules', () => {
      cy.get('[data-cy=data-management-tab]').click()

      cy.get('[data-cy=edit-validation-button]').click()
      cy.get('[data-cy=validation-modal]').should('be.visible')

      cy.get('[data-cy=enable-strict-validation]').check()
      cy.get('[data-cy=validate-email-format]').check()
      cy.get('[data-cy=validate-phone-format]').check()
      cy.get('[data-cy=validate-date-ranges]').check()

      cy.get('[data-cy=save-validation-rules]').click()
      cy.get('[data-cy=success-message]').should('contain', 'Validation rules updated')
    })

    it('should manage data anonymization settings', () => {
      cy.get('[data-cy=data-management-tab]').click()

      cy.get('[data-cy=edit-anonymization-button]').click()
      cy.get('[data-cy=anonymization-modal]').should('be.visible')

      cy.get('[data-cy=anonymization-enabled]').check()
      cy.get('[data-cy=retention-before-anonymization]').clear().type('2555') // 7 years
      cy.get('[data-cy=fields-to-anonymize]').should('be.visible')

      cy.get('[data-cy=save-anonymization-settings]').click()
      cy.get('[data-cy=success-message]').should('contain', 'Anonymization settings updated')
    })
  })

  context('System Updates and Patching', () => {
    it('should check for system updates', () => {
      cy.get('[data-cy=updates-tab]').click()

      cy.get('[data-cy=check-updates-button]').click()
      cy.get('[data-cy=update-check-progress]').should('be.visible')
      cy.get('[data-cy=available-updates]').should('be.visible')
      cy.get('[data-cy=update-details]').should('be.visible')
    })

    it('should schedule system updates', () => {
      cy.get('[data-cy=updates-tab]').click()

      cy.get('[data-cy=schedule-update-button]').click()
      cy.get('[data-cy=update-schedule-modal]').should('be.visible')

      cy.get('[data-cy=update-window-start]').type('02:00')
      cy.get('[data-cy=update-window-end]').type('04:00')
      cy.get('[data-cy=preferred-update-day]').select('SUNDAY')
      cy.get('[data-cy=auto-reboot-after-update]').check()

      cy.get('[data-cy=save-update-schedule]').click()
      cy.get('[data-cy=success-message]').should('contain', 'Update schedule configured')
    })

    it('should display update history', () => {
      cy.get('[data-cy=updates-tab]').click()

      cy.get('[data-cy=update-history-section]').should('be.visible')
      cy.get('[data-cy=update-entries]').should('be.visible')
      cy.get('[data-cy=update-version]').should('be.visible')
      cy.get('[data-cy=update-date]').should('be.visible')
      cy.get('[data-cy=update-status]').should('be.visible')
    })
  })

  context('Compliance and Audit Settings', () => {
    it('should configure HIPAA compliance settings', () => {
      cy.get('[data-cy=compliance-tab]').click()

      cy.get('[data-cy=edit-hipaa-settings]').click()
      cy.get('[data-cy=hipaa-modal]').should('be.visible')

      cy.get('[data-cy=enable-hipaa-logging]').check()
      cy.get('[data-cy=phi-encryption-required]').check()
      cy.get('[data-cy=access-log-retention]').clear().type('2555') // 7 years
      cy.get('[data-cy=breach-notification-enabled]').check()

      cy.get('[data-cy=save-hipaa-settings]').click()
      cy.get('[data-cy=success-message]').should('contain', 'HIPAA settings updated')
    })

    it('should configure FERPA compliance settings', () => {
      cy.get('[data-cy=compliance-tab]').click()

      cy.get('[data-cy=edit-ferpa-settings]').click()
      cy.get('[data-cy=ferpa-modal]').should('be.visible')

      cy.get('[data-cy=enable-ferpa-logging]').check()
      cy.get('[data-cy=parental-consent-required]').check()
      cy.get('[data-cy=data-disclosure-tracking]').check()
      cy.get('[data-cy=student-directory-restrictions]').check()

      cy.get('[data-cy=save-ferpa-settings]').click()
      cy.get('[data-cy=success-message]').should('contain', 'FERPA settings updated')
    })

    it('should manage audit log settings', () => {
      cy.get('[data-cy=compliance-tab]').click()

      cy.get('[data-cy=edit-audit-settings]').click()
      cy.get('[data-cy=audit-modal]').should('be.visible')

      cy.get('[data-cy=audit-log-enabled]').check()
      cy.get('[data-cy=audit-sensitive-actions]').check()
      cy.get('[data-cy=audit-data-access]').check()
      cy.get('[data-cy=audit-admin-actions]').check()

      cy.get('[data-cy=save-audit-settings]').click()
      cy.get('[data-cy=success-message]').should('contain', 'Audit settings updated')
    })
  })
})
