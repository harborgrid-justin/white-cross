/// <reference types="cypress" />

/**
 * Dashboard Functionality E2E Tests
 * White Cross Healthcare Management System
 *
 * This test suite validates dashboard functionality including
 * widgets, quick stats, recent activities, notifications,
 * and personalized dashboard features.
 */

describe('Dashboard Functionality', () => {
  beforeEach(() => {
    cy.login('nurse')
  })

  context('Dashboard Overview', () => {
    it('should display personalized dashboard for nurse role', () => {
      cy.get('[data-cy=dashboard-title]').should('be.visible')
      cy.get('[data-cy=welcome-message]').should('contain', 'Welcome back')
      cy.get('[data-cy=user-profile-section]').should('be.visible')
      cy.get('[data-cy=quick-actions-panel]').should('be.visible')
    })

    it('should show role-specific dashboard content', () => {
      cy.get('[data-cy=nurse-specific-widgets]').should('be.visible')
      cy.get('[data-cy=health-stats-widget]').should('be.visible')
      cy.get('[data-cy=medication-reminders-widget]').should('be.visible')
      cy.get('[data-cy=appointment-schedule-widget]').should('be.visible')
    })

    it('should display dashboard widgets in correct layout', () => {
      cy.get('[data-cy=dashboard-grid]').should('be.visible')
      cy.get('[data-cy=widget-container]').should('have.length.greaterThan', 3)
      cy.get('[data-cy=widget-resize-handles]').should('be.visible')
      cy.get('[data-cy=widget-collapse-buttons]').should('be.visible')
    })
  })

  context('Quick Stats and Metrics', () => {
    it('should display health statistics widgets', () => {
      cy.get('[data-cy=health-stats-widget]').should('be.visible')
      cy.get('[data-cy=total-students-stat]').should('be.visible')
      cy.get('[data-cy=active-medications-stat]').should('be.visible')
      cy.get('[data-cy=pending-appointments-stat]').should('be.visible')
      cy.get('[data-cy=recent-incidents-stat]').should('be.visible')
    })

    it('should show real-time updates in stats', () => {
      cy.get('[data-cy=total-students-stat]').should('contain', '1,247')
      cy.get('[data-cy=active-medications-stat]').should('contain', '89')
      cy.get('[data-cy=pending-appointments-stat]').should('contain', '12')
      cy.get('[data-cy=recent-incidents-stat]').should('contain', '3')
    })

    it('should allow clicking stats for detailed views', () => {
      cy.get('[data-cy=total-students-stat]').click()
      cy.url().should('include', '/students')
      cy.get('[data-cy=students-title]').should('be.visible')

      cy.visit('/dashboard')
      cy.get('[data-cy=pending-appointments-stat]').click()
      cy.url().should('include', '/appointments')
      cy.get('[data-cy=appointments-title]').should('be.visible')
    })
  })

  context('Recent Activities Feed', () => {
    it('should display recent activities timeline', () => {
      cy.get('[data-cy=recent-activities-widget]').should('be.visible')
      cy.get('[data-cy=activity-timeline]').should('be.visible')
      cy.get('[data-cy=activity-entries]').should('have.length.greaterThan', 0)
    })

    it('should show different types of activities', () => {
      cy.get('[data-cy=activity-entries]').should('contain', 'Health record created')
      cy.get('[data-cy=activity-entries]').should('contain', 'Medication administered')
      cy.get('[data-cy=activity-entries]').should('contain', 'Incident reported')
      cy.get('[data-cy=activity-entries]').should('contain', 'Appointment scheduled')
    })

    it('should allow filtering activities by type', () => {
      cy.get('[data-cy=activity-filter]').select('MEDICATIONS')
      cy.get('[data-cy=activity-entries]').should('contain', 'medication')

      cy.get('[data-cy=activity-filter]').select('INCIDENTS')
      cy.get('[data-cy=activity-entries]').should('contain', 'incident')
    })

    it('should show activity timestamps and user attribution', () => {
      cy.get('[data-cy=activity-entry]').first().within(() => {
        cy.get('[data-cy=activity-timestamp]').should('be.visible')
        cy.get('[data-cy=activity-user]').should('be.visible')
        cy.get('[data-cy=activity-description]').should('be.visible')
      })
    })
  })

  context('Medication Reminders Widget', () => {
    it('should display upcoming medication administrations', () => {
      cy.get('[data-cy=medication-reminders-widget]').should('be.visible')
      cy.get('[data-cy=upcoming-medications]').should('be.visible')
      cy.get('[data-cy=medication-reminder-items]').should('have.length.greaterThan', 0)
    })

    it('should show medication details in reminders', () => {
      cy.get('[data-cy=medication-reminder-item]').first().within(() => {
        cy.get('[data-cy=student-name]').should('be.visible')
        cy.get('[data-cy=medication-name]').should('be.visible')
        cy.get('[data-cy=medication-dosage]').should('be.visible')
        cy.get('[data-cy=scheduled-time]').should('be.visible')
      })
    })

    it('should allow quick medication logging from dashboard', () => {
      cy.get('[data-cy=medication-reminder-item]').first().within(() => {
        cy.get('[data-cy=quick-log-button]').click()
      })

      cy.get('[data-cy=quick-log-modal]').should('be.visible')
      cy.get('[data-cy=medication-given]').check()
      cy.get('[data-cy=administration-notes]').type('Administered on time')
      cy.get('[data-cy=save-quick-log]').click()

      cy.get('[data-cy=success-message]').should('contain', 'Medication logged successfully')
    })

    it('should highlight overdue medications', () => {
      cy.get('[data-cy=overdue-medications]').should('be.visible')
      cy.get('[data-cy=overdue-indicator]').should('have.class', 'overdue-status')
      cy.get('[data-cy=overdue-count]').should('contain', '3')
    })
  })

  context('Appointment Schedule Widget', () => {
    it('should display today\'s appointments', () => {
      cy.get('[data-cy=appointment-schedule-widget]').should('be.visible')
      cy.get('[data-cy=todays-appointments]').should('be.visible')
      cy.get('[data-cy=appointment-list]').should('have.length.greaterThan', 0)
    })

    it('should show appointment details', () => {
      cy.get('[data-cy=appointment-item]').first().within(() => {
        cy.get('[data-cy=appointment-time]').should('be.visible')
        cy.get('[data-cy=student-name]').should('be.visible')
        cy.get('[data-cy=appointment-type]').should('be.visible')
        cy.get('[data-cy=appointment-status]').should('be.visible')
      })
    })

    it('should allow quick appointment status updates', () => {
      cy.get('[data-cy=appointment-item]').first().within(() => {
        cy.get('[data-cy=appointment-status]').select('COMPLETED')
        cy.get('[data-cy=quick-notes]').type('Checkup completed successfully')
      })

      cy.get('[data-cy=update-status-button]').click()
      cy.get('[data-cy=success-message]').should('contain', 'Appointment updated')
    })

    it('should show upcoming appointments preview', () => {
      cy.get('[data-cy=upcoming-appointments-preview]').should('be.visible')
      cy.get('[data-cy=next-appointment]').should('be.visible')
      cy.get('[data-cy=appointment-count-badge]').should('be.visible')
    })
  })

  context('Health Alerts and Notifications', () => {
    it('should display active health alerts', () => {
      cy.get('[data-cy=health-alerts-widget]').should('be.visible')
      cy.get('[data-cy=active-alerts]').should('be.visible')
      cy.get('[data-cy=alert-items]').should('have.length.greaterThan', 0)
    })

    it('should show different alert types and severities', () => {
      cy.get('[data-cy=alert-item]').should('have.class', 'alert-severity-high')
      cy.get('[data-cy=alert-item]').should('have.class', 'alert-severity-medium')
      cy.get('[data-cy=alert-item]').should('have.class', 'alert-severity-low')
    })

    it('should allow acknowledging alerts', () => {
      cy.get('[data-cy=alert-item]').first().within(() => {
        cy.get('[data-cy=acknowledge-alert]').click()
        cy.get('[data-cy=acknowledgment-notes]').type('Reviewed and addressed')
      })

      cy.get('[data-cy=confirm-acknowledgment]').click()
      cy.get('[data-cy=success-message]').should('contain', 'Alert acknowledged')
    })

    it('should show alert details and actions', () => {
      cy.get('[data-cy=alert-item]').first().click()
      cy.get('[data-cy=alert-details-modal]').should('be.visible')

      cy.get('[data-cy=alert-description]').should('be.visible')
      cy.get('[data-cy=alert-student]').should('be.visible')
      cy.get('[data-cy=alert-priority]').should('be.visible')
      cy.get('[data-cy=alert-actions]').should('be.visible')
    })
  })

  context('Quick Actions Panel', () => {
    it('should display relevant quick actions for nurse role', () => {
      cy.get('[data-cy=quick-actions-panel]').should('be.visible')
      cy.get('[data-cy=quick-action-buttons]').should('have.length.greaterThan', 5)
    })

    it('should provide shortcuts to common tasks', () => {
      cy.get('[data-cy=quick-actions-panel]').within(() => {
        cy.get('[data-cy=log-medication-button]').should('be.visible')
        cy.get('[data-cy=schedule-appointment-button]').should('be.visible')
        cy.get('[data-cy=create-health-record-button]').should('be.visible')
        cy.get('[data-cy=report-incident-button]').should('be.visible')
        cy.get('[data-cy=search-student-button]').should('be.visible')
      })
    })

    it('should allow quick medication logging', () => {
      cy.get('[data-cy=log-medication-button]').click()
      cy.get('[data-cy=quick-medication-modal]').should('be.visible')

      cy.get('[data-cy=select-student]').type('John Doe')
      cy.get('[data-cy=select-medication]').type('Ibuprofen')
      cy.get('[data-cy=medication-dosage]').type('200mg')
      cy.get('[data-cy=administration-time]').type('14:30')

      cy.get('[data-cy=save-quick-medication]').click()
      cy.get('[data-cy=success-message]').should('contain', 'Medication logged')
    })

    it('should allow quick appointment scheduling', () => {
      cy.get('[data-cy=schedule-appointment-button]').click()
      cy.get('[data-cy=quick-appointment-modal]').should('be.visible')

      cy.get('[data-cy=appointment-student]').type('Jane Smith')
      cy.get('[data-cy=appointment-type]').select('CHECKUP')
      cy.get('[data-cy=appointment-date]').type('2024-10-15')
      cy.get('[data-cy=appointment-time]').type('10:00')

      cy.get('[data-cy=save-quick-appointment]').click()
      cy.get('[data-cy=success-message]').should('contain', 'Appointment scheduled')
    })
  })

  context('Student Search and Quick Access', () => {
    it('should provide student search functionality', () => {
      cy.get('[data-cy=student-search-widget]').should('be.visible')
      cy.get('[data-cy=student-search-input]').should('be.visible')
      cy.get('[data-cy=search-suggestions]').should('be.visible')
    })

    it('should allow searching students by name', () => {
      cy.get('[data-cy=student-search-input]').type('John')
      cy.get('[data-cy=search-results]').should('contain', 'John')
      cy.get('[data-cy=student-search-results]').should('have.length.greaterThan', 0)
    })

    it('should show student quick info cards', () => {
      cy.get('[data-cy=student-search-input]').type('John Doe')
      cy.get('[data-cy=student-result-card]').first().click()

      cy.get('[data-cy=student-quick-info]').should('be.visible')
      cy.get('[data-cy=student-grade]').should('be.visible')
      cy.get('[data-cy=student-allergies]').should('be.visible')
      cy.get('[data-cy=current-medications]').should('be.visible')
    })

    it('should provide quick access to student records', () => {
      cy.get('[data-cy=student-search-input]').type('John Doe')
      cy.get('[data-cy=student-result-card]').first().within(() => {
        cy.get('[data-cy=view-health-record]').click()
      })

      cy.url().should('include', '/health-records')
      cy.get('[data-cy=student-health-profile]').should('be.visible')
    })
  })

  context('Calendar and Schedule Integration', () => {
    it('should display calendar widget with appointments', () => {
      cy.get('[data-cy=calendar-widget]').should('be.visible')
      cy.get('[data-cy=mini-calendar]').should('be.visible')
      cy.get('[data-cy=calendar-appointments]').should('be.visible')
    })

    it('should show today\'s schedule', () => {
      cy.get('[data-cy=today-schedule]').should('be.visible')
      cy.get('[data-cy=time-slots]').should('be.visible')
      cy.get('[data-cy=scheduled-appointments]').should('be.visible')
    })

    it('should allow navigating calendar dates', () => {
      cy.get('[data-cy=calendar-navigation]').should('be.visible')
      cy.get('[data-cy=previous-day]').click()
      cy.get('[data-cy=next-day]').click()
      cy.get('[data-cy=today-button]').click()
    })

    it('should highlight conflicting appointments', () => {
      cy.get('[data-cy=appointment-conflicts]').should('be.visible')
      cy.get('[data-cy=conflict-indicator]').should('have.class', 'conflict-warning')
      cy.get('[data-cy=resolve-conflicts-button]').should('be.visible')
    })
  })

  context('Communication Center Widget', () => {
    it('should display recent messages and notifications', () => {
      cy.get('[data-cy=communication-widget]').should('be.visible')
      cy.get('[data-cy=recent-messages]').should('be.visible')
      cy.get('[data-cy=unread-count]').should('be.visible')
    })

    it('should show parent communications', () => {
      cy.get('[data-cy=parent-messages]').should('be.visible')
      cy.get('[data-cy=message-preview]').should('be.visible')
      cy.get('[data-cy=reply-buttons]').should('be.visible')
    })

    it('should allow quick message composition', () => {
      cy.get('[data-cy=compose-quick-message]').click()
      cy.get('[data-cy=message-modal]').should('be.visible')

      cy.get('[data-cy=message-recipient]').type('jane.doe@email.com')
      cy.get('[data-cy=message-subject]').type('Health Update')
      cy.get('[data-cy=message-body]').type('Your child has been cleared for return to school')

      cy.get('[data-cy=send-message-button]').click()
      cy.get('[data-cy=success-message]').should('contain', 'Message sent')
    })
  })

  context('Dashboard Customization', () => {
    it('should allow rearranging dashboard widgets', () => {
      cy.get('[data-cy=edit-dashboard-button]').click()
      cy.get('[data-cy=customize-mode]').should('be.visible')

      // Drag and drop widgets
      cy.get('[data-cy=widget-container]').first().drag('[data-cy=widget-container]:last')
      cy.get('[data-cy=save-layout-button]').click()

      cy.get('[data-cy=success-message]').should('contain', 'Dashboard layout saved')
    })

    it('should allow showing/hiding widgets', () => {
      cy.get('[data-cy=edit-dashboard-button]').click()

      cy.get('[data-cy=widget-visibility-controls]').should('be.visible')
      cy.get('[data-cy=medication-reminders-widget]').find('[data-cy=hide-widget]').click()
      cy.get('[data-cy=calendar-widget]').find('[data-cy=show-widget]').click()

      cy.get('[data-cy=save-customization]').click()
      cy.get('[data-cy=success-message]').should('contain', 'Dashboard customized')
    })

    it('should remember dashboard preferences', () => {
      cy.reload()
      cy.get('[data-cy=dashboard-customizations]').should('be.visible')
      cy.get('[data-cy=medication-reminders-widget]').should('not.exist')
      cy.get('[data-cy=calendar-widget]').should('be.visible')
    })
  })

  context('Emergency and Critical Alerts', () => {
    it('should prominently display emergency alerts', () => {
      cy.get('[data-cy=emergency-alerts-section]').should('be.visible')
      cy.get('[data-cy=critical-alert-badge]').should('have.class', 'emergency-status')
      cy.get('[data-cy=emergency-alert-text]').should('be.visible')
    })

    it('should show severe allergy alerts', () => {
      cy.get('[data-cy=severe-allergy-alerts]').should('be.visible')
      cy.get('[data-cy=allergy-alert-student]').should('be.visible')
      cy.get('[data-cy=allergy-alert-details]').should('be.visible')
      cy.get('[data-cy=epipen-required-badge]').should('be.visible')
    })

    it('should display critical medication alerts', () => {
      cy.get('[data-cy=critical-medication-alerts]').should('be.visible')
      cy.get('[data-cy=medication-alert-student]').should('be.visible')
      cy.get('[data-cy=medication-alert-time]').should('be.visible')
      cy.get('[data-cy=immediate-action-required]').should('be.visible')
    })
  })

  context('Performance and Analytics Widgets', () => {
    it('should show weekly health summary', () => {
      cy.get('[data-cy=weekly-summary-widget]').should('be.visible')
      cy.get('[data-cy=health-trends-chart]').should('be.visible')
      cy.get('[data-cy=medication-compliance-rate]').should('be.visible')
      cy.get('[data-cy=appointment-attendance-rate]').should('be.visible')
    })

    it('should display workload metrics', () => {
      cy.get('[data-cy=workload-metrics-widget]').should('be.visible')
      cy.get('[data-cy=students-per-nurse-ratio]').should('be.visible')
      cy.get('[data-cy=average-daily-appointments]').should('be.visible')
      cy.get('[data-cy=medication-administrations-per-day]').should('be.visible')
    })
  })
})
