/// <reference types="cypress" />

/**
 * Reports and Analytics E2E Tests
 * White Cross Healthcare Management System
 *
 * This test suite validates report generation, data visualization,
 * analytics dashboards, and export functionality for healthcare
 * compliance and operational insights.
 */

describe('Reports and Analytics', () => {
  beforeEach(() => {
    cy.login('admin')
    cy.navigateTo('reports')
  })

  context('Reports Dashboard', () => {
    it('should display reports and analytics dashboard', () => {
      cy.get('[data-cy=reports-title]').should('be.visible')
      cy.get('[data-cy=reports-categories]').should('be.visible')
      cy.get('[data-cy=recent-reports]').should('be.visible')
      cy.get('[data-cy=scheduled-reports]').should('be.visible')
      cy.get('[data-cy=analytics-overview]').should('be.visible')
    })

    it('should show report categories and templates', () => {
      cy.get('[data-cy=report-categories]').should('be.visible')
      cy.get('[data-cy=health-records-category]').should('be.visible')
      cy.get('[data-cy=medication-category]').should('be.visible')
      cy.get('[data-cy=incidents-category]').should('be.visible')
      cy.get('[data-cy=compliance-category]').should('be.visible')
    })

    it('should display analytics overview widgets', () => {
      cy.get('[data-cy=analytics-overview]').should('be.visible')
      cy.get('[data-cy=key-metrics-cards]').should('be.visible')
      cy.get('[data-cy=trend-indicators]').should('be.visible')
      cy.get('[data-cy=comparative-analytics]').should('be.visible')
    })
  })

  context('Health Records Reports', () => {
    it('should generate student health summary reports', () => {
      cy.get('[data-cy=health-records-category]').click()
      cy.get('[data-cy=student-health-summary]').click()

      cy.get('[data-cy=report-config-modal]').should('be.visible')
      cy.get('[data-cy=report-date-range]').should('be.visible')
      cy.get('[data-cy=select-students]').should('be.visible')
      cy.get('[data-cy=include-sections]').should('be.visible')

      cy.get('[data-cy=include-vitals]').check()
      cy.get('[data-cy=include-allergies]').check()
      cy.get('[data-cy=include-medications]').check()
      cy.get('[data-cy=include-immunizations]').check()

      cy.get('[data-cy=generate-report-button]').click()
      cy.get('[data-cy=report-generation-progress]').should('be.visible')
      cy.get('[data-cy=report-complete]').should('be.visible')
    })

    it('should create immunization compliance reports', () => {
      cy.get('[data-cy=health-records-category]').click()
      cy.get('[data-cy=immunization-compliance]').click()

      cy.get('[data-cy=report-config-modal]').should('be.visible')
      cy.get('[data-cy=school-year-select]').select('2024-2025')
      cy.get('[data-cy=grade-level-filter]').should('be.visible')
      cy.get('[data-cy=vaccine-type-filter]').should('be.visible')

      cy.get('[data-cy=include-exemptions]').check()
      cy.get('[data-cy=include-missing-vaccines]').check()

      cy.get('[data-cy=generate-report-button]').click()
      cy.get('[data-cy=compliance-report-results]').should('be.visible')
    })

    it('should generate growth and development reports', () => {
      cy.get('[data-cy=health-records-category]').click()
      cy.get('[data-cy=growth-development]').click()

      cy.get('[data-cy=report-config-modal]').should('be.visible')
      cy.get('[data-cy=age-group-filter]').should('be.visible')
      cy.get('[data-cy=measurement-period]').should('be.visible')
      cy.get('[data-cy=chart-type-select]').should('be.visible')

      cy.get('[data-cy=include-bmi-trends]').check()
      cy.get('[data-cy=include-percentiles]').check()

      cy.get('[data-cy=generate-report-button]').click()
      cy.get('[data-cy=growth-charts]').should('be.visible')
    })
  })

  context('Medication Reports', () => {
    it('should generate medication administration reports', () => {
      cy.get('[data-cy=medication-category]').click()
      cy.get('[data-cy=medication-administration]').click()

      cy.get('[data-cy=report-config-modal]').should('be.visible')
      cy.get('[data-cy=medication-date-range]').should('be.visible')
      cy.get('[data-cy=medication-type-filter]').should('be.visible')
      cy.get('[data-cy=nurse-filter]').should('be.visible')

      cy.get('[data-cy=include-controlled-substances]').check()
      cy.get('[data-cy=include-missed-doses]').check()

      cy.get('[data-cy=generate-report-button]').click()
      cy.get('[data-cy=medication-report-table]').should('be.visible')
    })

    it('should create medication inventory reports', () => {
      cy.get('[data-cy=medication-category]').click()
      cy.get('[data-cy=inventory-report]').click()

      cy.get('[data-cy=report-config-modal]').should('be.visible')
      cy.get('[data-cy=inventory-status-filter]').select('LOW_STOCK')
      cy.get('[data-cy=expiration-date-filter]').should('be.visible')
      cy.get('[data-cy=medication-category-filter]').should('be.visible')

      cy.get('[data-cy=include-expiring-soon]').check()
      cy.get('[data-cy=include-reorder-suggestions]').check()

      cy.get('[data-cy=generate-report-button]').click()
      cy.get('[data-cy=inventory-alerts]').should('be.visible')
    })

    it('should generate controlled substance logs', () => {
      cy.get('[data-cy=medication-category]').click()
      cy.get('[data-cy=controlled-substance-log]').click()

      cy.get('[data-cy=report-config-modal]').should('be.visible')
      cy.get('[data-cy=controlled-substance-period]').should('be.visible')
      cy.get('[data-cy=nurse-responsible-filter]').should('be.visible')

      cy.get('[data-cy=include-receipts]').check()
      cy.get('[data-cy=include-disposals]').check()
      cy.get('[data-cy=include-waste-logs]').check()

      cy.get('[data-cy=generate-report-button]').click()
      cy.get('[data-cy=controlled-substance-records]').should('be.visible')
    })
  })

  context('Incident Reports and Analytics', () => {
    it('should generate incident summary reports', () => {
      cy.get('[data-cy=incidents-category]').click()
      cy.get('[data-cy=incident-summary]').click()

      cy.get('[data-cy=report-config-modal]').should('be.visible')
      cy.get('[data-cy=incident-date-range]').should('be.visible')
      cy.get('[data-cy=incident-type-filter]').should('be.visible')
      cy.get('[data-cy=severity-filter]').should('be.visible')

      cy.get('[data-cy=include-witness-statements]').check()
      cy.get('[data-cy=include-followup-actions]').check()

      cy.get('[data-cy=generate-report-button]').click()
      cy.get('[data-cy=incident-summary-table]').should('be.visible')
    })

    it('should create incident trend analysis', () => {
      cy.get('[data-cy=incidents-category]').click()
      cy.get('[data-cy=incident-trends]').click()

      cy.get('[data-cy=report-config-modal]').should('be.visible')
      cy.get('[data-cy=trend-period]').select('MONTHLY')
      cy.get('[data-cy=compare-periods]').should('be.visible')
      cy.get('[data-cy=trend-chart-type]').should('be.visible')

      cy.get('[data-cy=include-seasonal-analysis]').check()
      cy.get('[data-cy=include-location-analysis]').check()

      cy.get('[data-cy=generate-report-button]').click()
      cy.get('[data-cy=trend-charts]').should('be.visible')
    })

    it('should generate OSHA compliance reports', () => {
      cy.get('[data-cy=incidents-category]').click()
      cy.get('[data-cy=osha-compliance]').click()

      cy.get('[data-cy=report-config-modal]').should('be.visible')
      cy.get('[data-cy=osha-year-select]').select('2024')
      cy.get('[data-cy=osha-form-type]').should('be.visible')

      cy.get('[data-cy=include-form-300]').check()
      cy.get('[data-cy=include-form-301]').check()

      cy.get('[data-cy=generate-report-button]').click()
      cy.get('[data-cy=osha-forms]').should('be.visible')
    })
  })

  context('Compliance and Regulatory Reports', () => {
    it('should generate HIPAA compliance reports', () => {
      cy.get('[data-cy=compliance-category]').click()
      cy.get('[data-cy=hipaa-compliance]').click()

      cy.get('[data-cy=report-config-modal]').should('be.visible')
      cy.get('[data-cy=hipaa-period]').should('be.visible')
      cy.get('[data-cy=access-log-analysis]').should('be.visible')

      cy.get('[data-cy=include-privacy-breaches]').check()
      cy.get('[data-cy=include-security-incidents]').check()

      cy.get('[data-cy=generate-report-button]').click()
      cy.get('[data-cy=hipaa-compliance-results]').should('be.visible')
    })

    it('should create FERPA compliance reports', () => {
      cy.get('[data-cy=compliance-category]').click()
      cy.get('[data-cy=ferpa-compliance]').click()

      cy.get('[data-cy=report-config-modal]').should('be.visible')
      cy.get('[data-cy=ferpa-period]').should('be.visible')
      cy.get('[data-cy=data-disclosure-analysis]').should('be.visible')

      cy.get('[data-cy=include-parental-consents]').check()
      cy.get('[data-cy=include-data-requests]').check()

      cy.get('[data-cy=generate-report-button]').click()
      cy.get('[data-cy=ferpa-compliance-results]').should('be.visible')
    })

    it('should generate state reporting requirements', () => {
      cy.get('[data-cy=compliance-category]').click()
      cy.get('[data-cy=state-reporting]').click()

      cy.get('[data-cy=report-config-modal]').should('be.visible')
      cy.get('[data-cy=state-select]').select('CALIFORNIA')
      cy.get('[data-cy=reporting-period]').should('be.visible')

      cy.get('[data-cy=include-mandated-exams]').check()
      cy.get('[data-cy=include-screening-results]').check()

      cy.get('[data-cy=generate-report-button]').click()
      cy.get('[data-cy=state-report-results]').should('be.visible')
    })
  })

  context('Analytics and Data Visualization', () => {
    it('should display health trends analytics', () => {
      cy.get('[data-cy=analytics-tab]').click()
      cy.get('[data-cy=health-trends-section]').should('be.visible')

      cy.get('[data-cy=health-metrics-charts]').should('be.visible')
      cy.get('[data-cy=population-health-indicators]').should('be.visible')
      cy.get('[data-cy=trend-comparisons]').should('be.visible')
    })

    it('should show medication compliance analytics', () => {
      cy.get('[data-cy=analytics-tab]').click()
      cy.get('[data-cy=medication-analytics]').should('be.visible')

      cy.get('[data-cy=compliance-rate-charts]').should('be.visible')
      cy.get('[data-cy=adherence-patterns]').should('be.visible')
      cy.get('[data-cy=missed-dose-analysis]').should('be.visible')
    })

    it('should display utilization analytics', () => {
      cy.get('[data-cy=analytics-tab]').click()
      cy.get('[data-cy=utilization-analytics]').should('be.visible')

      cy.get('[data-cy=appointment-utilization]').should('be.visible')
      cy.get('[data-cy=resource-utilization]').should('be.visible')
      cy.get('[data-cy=staff-workload-analysis]').should('be.visible')
    })

    it('should allow customizing analytics views', () => {
      cy.get('[data-cy=analytics-tab]').click()

      cy.get('[data-cy=customize-analytics]').click()
      cy.get('[data-cy=analytics-customization-modal]').should('be.visible')

      cy.get('[data-cy=select-metrics]').should('be.visible')
      cy.get('[data-cy=chart-type-options]').should('be.visible')
      cy.get('[data-cy=date-range-selector]').should('be.visible')

      cy.get('[data-cy=save-analytics-view]').click()
      cy.get('[data-cy=success-message]').should('contain', 'Analytics view saved')
    })
  })

  context('Report Generation and Export', () => {
    it('should support multiple export formats', () => {
      cy.get('[data-cy=health-records-category]').click()
      cy.get('[data-cy=student-health-summary]').click()

      cy.get('[data-cy=generate-report-button]').click()
      cy.get('[data-cy=report-complete]').should('be.visible')

      cy.get('[data-cy=export-options]').should('be.visible')
      cy.get('[data-cy=export-pdf]').should('be.visible')
      cy.get('[data-cy=export-excel]').should('be.visible')
      cy.get('[data-cy=export-csv]').should('be.visible')
      cy.get('[data-cy=export-word]').should('be.visible')
    })

    it('should allow scheduling automated reports', () => {
      cy.get('[data-cy=schedule-report-button]').click()
      cy.get('[data-cy=schedule-modal]').should('be.visible')

      cy.get('[data-cy=report-frequency]').select('WEEKLY')
      cy.get('[data-cy=report-day]').select('MONDAY')
      cy.get('[data-cy=report-time]').type('08:00')
      cy.get('[data-cy=report-recipients]').type('admin@school.edu,nurse@school.edu')

      cy.get('[data-cy=save-schedule-button]').click()
      cy.get('[data-cy=success-message]').should('contain', 'Report schedule created')
    })

    it('should show report generation history', () => {
      cy.get('[data-cy=report-history-tab]').click()
      cy.get('[data-cy=report-history-list]').should('be.visible')

      cy.get('[data-cy=history-entries]').should('have.length.greaterThan', 0)
      cy.get('[data-cy=report-generation-date]').should('be.visible')
      cy.get('[data-cy=report-status]').should('be.visible')
      cy.get('[data-cy=download-history-report]').should('be.visible')
    })
  })

  context('Interactive Dashboards', () => {
    it('should display interactive health dashboard', () => {
      cy.get('[data-cy=interactive-dashboard-tab]').click()
      cy.get('[data-cy=health-dashboard]').should('be.visible')

      cy.get('[data-cy=dashboard-filters]').should('be.visible')
      cy.get('[data-cy=interactive-charts]').should('be.visible')
      cy.get('[data-cy=drill-down-capabilities]').should('be.visible')
    })

    it('should allow drilling down into data', () => {
      cy.get('[data-cy=interactive-dashboard-tab]').click()

      cy.get('[data-cy=health-metrics-chart]').click()
      cy.get('[data-cy=drill-down-menu]').should('be.visible')
      cy.get('[data-cy=drill-down-by-school]').click()

      cy.get('[data-cy=detailed-breakdown]').should('be.visible')
      cy.get('[data-cy=school-level-metrics]').should('be.visible')
    })

    it('should support real-time data updates', () => {
      cy.get('[data-cy=interactive-dashboard-tab]').click()

      cy.get('[data-cy=real-time-toggle]').should('be.visible')
      cy.get('[data-cy=auto-refresh-settings]').should('be.visible')
      cy.get('[data-cy=refresh-interval]').should('be.visible')

      cy.get('[data-cy=enable-real-time]').check()
      cy.get('[data-cy=live-data-indicator]').should('be.visible')
    })
  })

  context('Custom Report Builder', () => {
    it('should provide drag-and-drop report builder', () => {
      cy.get('[data-cy=custom-reports-tab]').click()
      cy.get('[data-cy=report-builder]').should('be.visible')

      cy.get('[data-cy=available-fields]').should('be.visible')
      cy.get('[data-cy=report-canvas]').should('be.visible')
      cy.get('[data-cy=field-palette]').should('be.visible')
    })

    it('should allow adding fields to reports', () => {
      cy.get('[data-cy=custom-reports-tab]').click()

      cy.get('[data-cy=field-palette]').within(() => {
        cy.get('[data-cy=student-name-field]').drag('[data-cy=report-canvas]')
        cy.get('[data-cy=medication-field]').drag('[data-cy=report-canvas]')
        cy.get('[data-cy=date-field]').drag('[data-cy=report-canvas]')
      })

      cy.get('[data-cy=report-canvas]').should('contain', 'Student Name')
      cy.get('[data-cy=report-canvas]').should('contain', 'Medication')
      cy.get('[data-cy=report-canvas]').should('contain', 'Date')
    })

    it('should allow configuring field properties', () => {
      cy.get('[data-cy=custom-reports-tab]').click()

      cy.get('[data-cy=report-field]').first().click()
      cy.get('[data-cy=field-properties-panel]').should('be.visible')

      cy.get('[data-cy=field-format]').should('be.visible')
      cy.get('[data-cy=field-filters]').should('be.visible')
      cy.get('[data-cy=field-sorting]').should('be.visible')
    })

    it('should preview custom reports', () => {
      cy.get('[data-cy=custom-reports-tab]').click()

      cy.get('[data-cy=preview-report-button]').click()
      cy.get('[data-cy=report-preview-modal]').should('be.visible')

      cy.get('[data-cy=preview-data]').should('be.visible')
      cy.get('[data-cy=preview-formatting]').should('be.visible')
      cy.get('[data-cy=preview-pagination]').should('be.visible')
    })
  })

  context('Data Export and Integration', () => {
    it('should export reports in multiple formats', () => {
      cy.get('[data-cy=health-records-category]').click()
      cy.get('[data-cy=student-health-summary]').click()

      cy.get('[data-cy=generate-report-button]').click()
      cy.get('[data-cy=report-complete]').should('be.visible')

      cy.get('[data-cy=export-pdf]').click()
      cy.get('[data-cy=pdf-download-link]').should('be.visible')

      cy.visit('/reports')
      cy.get('[data-cy=export-excel]').click()
      cy.get('[data-cy=excel-download-link]').should('be.visible')
    })

    it('should support scheduled report delivery', () => {
      cy.get('[data-cy=schedule-delivery-button]').click()
      cy.get('[data-cy=delivery-modal]').should('be.visible')

      cy.get('[data-cy=delivery-method]').select('EMAIL')
      cy.get('[data-cy=delivery-recipients]').type('principal@school.edu')
      cy.get('[data-cy=delivery-frequency]').select('MONTHLY')
      cy.get('[data-cy=delivery-format]').select('PDF')

      cy.get('[data-cy=save-delivery-settings]').click()
      cy.get('[data-cy=success-message]').should('contain', 'Delivery schedule configured')
    })
  })

  context('Analytics Insights and Alerts', () => {
    it('should display actionable insights', () => {
      cy.get('[data-cy=insights-tab]').click()
      cy.get('[data-cy=actionable-insights]').should('be.visible')

      cy.get('[data-cy=insight-cards]').should('be.visible')
      cy.get('[data-cy=insight-priority]').should('be.visible')
      cy.get('[data-cy=insight-actions]').should('be.visible')
    })

    it('should show predictive analytics', () => {
      cy.get('[data-cy=insights-tab]').click()
      cy.get('[data-cy=predictive-analytics]').should('be.visible')

      cy.get('[data-cy=trend-predictions]').should('be.visible')
      cy.get('[data-cy=risk-assessments]').should('be.visible')
      cy.get('[data-cy=resource-planning]').should('be.visible')
    })

    it('should generate automated alerts based on analytics', () => {
      cy.get('[data-cy=insights-tab]').click()

      cy.get('[data-cy=analytics-alerts]').should('be.visible')
      cy.get('[data-cy=alert-thresholds]').should('be.visible')
      cy.get('[data-cy=configure-alert-rules]').should('be.visible')
    })
  })
})
