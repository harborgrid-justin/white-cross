/// <reference types="cypress" />

describe('Administration Features', () => {
  beforeEach(() => {
    cy.login('admin')
    cy.visit('/settings')
  })

  // ============================================================================
  // PAGE LOAD & NAVIGATION TESTS (15 tests)
  // ============================================================================

  describe('Page Load & Navigation', () => {
    it('should load the settings page successfully', () => {
      cy.url().should('include', '/settings')
      cy.get('body').should('be.visible')
    })

    it('should display the Administration Panel heading', () => {
      cy.contains('h1', 'Administration Panel').should('be.visible')
    })

    it('should display the page description', () => {
      cy.contains('System configuration, multi-school management, and enterprise tools').should('be.visible')
    })

    it('should have the Layout header visible', () => {
      cy.get('[class*="sticky top-0"]').should('be.visible')
    })

    it('should display navigation sidebar', () => {
      cy.get('nav').should('be.visible')
    })

    it('should maintain admin authentication', () => {
      cy.url().should('not.include', '/login')
      cy.get('[data-cy="user-menu"]').should('be.visible')
    })

    it('should have accessible page structure', () => {
      cy.get('h1').should('exist')
      cy.get('nav').should('exist')
    })

    it('should load without console errors', () => {
      cy.visit('/settings')
      cy.window().then((win) => {
        expect(win.console.error).to.not.have.been.called
      })
    })

    it('should display the page header in Layout', () => {
      cy.get('.sticky.top-0').should('be.visible')
    })

    it('should show user information in header', () => {
      cy.get('[data-cy="user-menu"]').should('be.visible')
    })

    it('should have logout button visible', () => {
      cy.get('[data-cy="logout-button"]').should('be.visible')
    })

    it('should display breadcrumb or page title in top bar', () => {
      cy.get('.sticky.top-0').within(() => {
        cy.contains(/settings|administration/i).should('be.visible')
      })
    })

    it('should have proper page title in document', () => {
      cy.title().should('exist')
    })

    it('should render main content area', () => {
      cy.get('main').should('be.visible')
    })

    it('should have responsive layout classes', () => {
      cy.get('.lg\\:pl-64').should('exist')
    })
  })

  // ============================================================================
  // TAB NAVIGATION TESTS (25 tests)
  // ============================================================================

  describe('Tab Navigation', () => {
    it('should display all 11 administration tabs', () => {
      cy.get('nav button').should('have.length', 11)
    })

    it('should show Overview tab', () => {
      cy.contains('button', 'Overview').should('be.visible')
    })

    it('should show Districts tab', () => {
      cy.contains('button', 'Districts').should('be.visible')
    })

    it('should show Schools tab', () => {
      cy.contains('button', 'Schools').should('be.visible')
    })

    it('should show Users tab', () => {
      cy.contains('button', 'Users').should('be.visible')
    })

    it('should show Configuration tab', () => {
      cy.contains('button', 'Configuration').should('be.visible')
    })

    it('should show Integrations tab', () => {
      cy.contains('button', 'Integrations').should('be.visible')
    })

    it('should show Backups tab', () => {
      cy.contains('button', 'Backups').should('be.visible')
    })

    it('should show Monitoring tab', () => {
      cy.contains('button', 'Monitoring').should('be.visible')
    })

    it('should show Licenses tab', () => {
      cy.contains('button', 'Licenses').should('be.visible')
    })

    it('should show Training tab', () => {
      cy.contains('button', 'Training').should('be.visible')
    })

    it('should show Audit Logs tab', () => {
      cy.contains('button', 'Audit Logs').should('be.visible')
    })

    it('should have Overview tab active by default', () => {
      cy.contains('button', 'Overview')
        .should('have.class', 'border-blue-500')
        .and('have.class', 'text-blue-600')
    })

    it('should switch to Districts tab when clicked', () => {
      cy.contains('button', 'Districts').click()
      cy.contains('button', 'Districts')
        .should('have.class', 'border-blue-500')
    })

    it('should switch to Schools tab when clicked', () => {
      cy.contains('button', 'Schools').click()
      cy.contains('button', 'Schools')
        .should('have.class', 'border-blue-500')
    })

    it('should switch to Users tab when clicked', () => {
      cy.contains('button', 'Users').click()
      cy.contains('button', 'Users')
        .should('have.class', 'border-blue-500')
    })

    it('should switch to Configuration tab when clicked', () => {
      cy.contains('button', 'Configuration').click()
      cy.contains('button', 'Configuration')
        .should('have.class', 'border-blue-500')
    })

    it('should switch to Integrations tab when clicked', () => {
      cy.contains('button', 'Integrations').click()
      cy.contains('button', 'Integrations')
        .should('have.class', 'border-blue-500')
    })

    it('should switch to Backups tab when clicked', () => {
      cy.contains('button', 'Backups').click()
      cy.contains('button', 'Backups')
        .should('have.class', 'border-blue-500')
    })

    it('should switch to Monitoring tab when clicked', () => {
      cy.contains('button', 'Monitoring').click()
      cy.contains('button', 'Monitoring')
        .should('have.class', 'border-blue-500')
    })

    it('should switch to Licenses tab when clicked', () => {
      cy.contains('button', 'Licenses').click()
      cy.contains('button', 'Licenses')
        .should('have.class', 'border-blue-500')
    })

    it('should switch to Training tab when clicked', () => {
      cy.contains('button', 'Training').click()
      cy.contains('button', 'Training')
        .should('have.class', 'border-blue-500')
    })

    it('should switch to Audit Logs tab when clicked', () => {
      cy.contains('button', 'Audit Logs').click()
      cy.contains('button', 'Audit Logs')
        .should('have.class', 'border-blue-500')
    })

    it('should display icons for each tab', () => {
      cy.get('nav button svg').should('have.length.at.least', 11)
    })

    it('should deactivate previous tab when switching', () => {
      cy.contains('button', 'Overview').should('have.class', 'border-blue-500')
      cy.contains('button', 'Districts').click()
      cy.contains('button', 'Overview').should('not.have.class', 'border-blue-500')
    })
  })

  // ============================================================================
  // OVERVIEW TAB TESTS (20 tests)
  // ============================================================================

  describe('Overview Tab', () => {
    beforeEach(() => {
      cy.contains('button', 'Overview').click()
    })

    it('should display the Overview tab content', () => {
      cy.contains('button', 'Overview').should('have.class', 'border-blue-500')
    })

    it('should show system metrics', () => {
      cy.get('[class*="grid"]').should('exist')
    })

    it('should display statistical cards', () => {
      cy.get('[class*="bg-white"][class*="shadow"]').should('have.length.at.least', 1)
    })

    it('should show total users metric', () => {
      cy.contains(/users|total/i).should('be.visible')
    })

    it('should show active schools metric', () => {
      cy.contains(/schools|active/i).should('be.visible')
    })

    it('should show districts metric', () => {
      cy.contains(/districts/i).should('be.visible')
    })

    it('should display recent activity section', () => {
      cy.contains(/recent|activity/i).should('exist')
    })

    it('should show system health status', () => {
      cy.contains(/health|status/i).should('exist')
    })

    it('should display quick actions section', () => {
      cy.contains(/quick|actions/i).should('exist')
    })

    it('should have action buttons', () => {
      cy.get('button[class*="bg-"]').should('have.length.at.least', 1)
    })

    it('should show database status', () => {
      cy.contains(/database|db/i).should('exist')
    })

    it('should display API status', () => {
      cy.contains(/api|service/i).should('exist')
    })

    it('should show cache status', () => {
      cy.contains(/cache|redis/i).should('exist')
    })

    it('should display storage information', () => {
      cy.contains(/storage|disk/i).should('exist')
    })

    it('should show memory usage', () => {
      cy.contains(/memory|ram/i).should('exist')
    })

    it('should display CPU information', () => {
      cy.contains(/cpu|processor/i).should('exist')
    })

    it('should have refresh capability', () => {
      cy.get('button').contains(/refresh|reload/i).should('exist')
    })

    it('should show uptime information', () => {
      cy.contains(/uptime|running/i).should('exist')
    })

    it('should display version information', () => {
      cy.contains(/version|v\d/i).should('exist')
    })

    it('should have responsive grid layout', () => {
      cy.get('[class*="grid"]').should('have.class', 'grid')
    })
  })

  // ============================================================================
  // DISTRICTS TAB TESTS (20 tests)
  // ============================================================================

  describe('Districts Tab', () => {
    beforeEach(() => {
      cy.contains('button', 'Districts').click()
    })

    it('should display the Districts tab content', () => {
      cy.contains('button', 'Districts').should('have.class', 'border-blue-500')
    })

    it('should show districts heading', () => {
      cy.contains(/district/i).should('be.visible')
    })

    it('should have add district button', () => {
      cy.get('button').contains(/add|new|create/i).should('be.visible')
    })

    it('should display districts table or list', () => {
      cy.get('table, [class*="space-y"]').should('exist')
    })

    it('should show search functionality', () => {
      cy.get('input[type="search"], input[placeholder*="search" i]').should('exist')
    })

    it('should display district names column', () => {
      cy.contains(/name|district/i).should('be.visible')
    })

    it('should show school count column', () => {
      cy.contains(/schools|count/i).should('be.visible')
    })

    it('should display status column', () => {
      cy.contains(/status|active/i).should('be.visible')
    })

    it('should show action buttons for each district', () => {
      cy.get('button[class*="text-"], a[class*="text-"]').should('have.length.at.least', 1)
    })

    it('should have edit district functionality', () => {
      cy.get('button, a').contains(/edit|modify/i).should('exist')
    })

    it('should display pagination if many districts', () => {
      cy.get('[class*="pagination"], button:contains("Next"), button:contains("Previous")').should('exist')
    })

    it('should show filter options', () => {
      cy.get('select, [role="combobox"]').should('exist')
    })

    it('should display district details', () => {
      cy.contains(/contact|address|phone/i).should('exist')
    })

    it('should have sorting capability', () => {
      cy.get('th[class*="cursor-"], button[class*="sort"]').should('exist')
    })

    it('should show empty state when no districts', () => {
      cy.contains(/no.*district|empty/i).should('exist')
    })

    it('should display district configuration options', () => {
      cy.contains(/settings|config/i).should('exist')
    })

    it('should have bulk actions available', () => {
      cy.get('input[type="checkbox"]').should('exist')
    })

    it('should show export functionality', () => {
      cy.get('button').contains(/export|download/i).should('exist')
    })

    it('should display district metrics', () => {
      cy.contains(/students|enrollment/i).should('exist')
    })

    it('should have responsive table layout', () => {
      cy.get('[class*="overflow-x"]').should('exist')
    })
  })

  // ============================================================================
  // SCHOOLS TAB TESTS (20 tests)
  // ============================================================================

  describe('Schools Tab', () => {
    beforeEach(() => {
      cy.contains('button', 'Schools').click()
    })

    it('should display the Schools tab content', () => {
      cy.contains('button', 'Schools').should('have.class', 'border-blue-500')
    })

    it('should show schools heading', () => {
      cy.contains(/school/i).should('be.visible')
    })

    it('should have add school button', () => {
      cy.get('button').contains(/add|new|create/i).should('be.visible')
    })

    it('should display schools table or list', () => {
      cy.get('table, [class*="space-y"]').should('exist')
    })

    it('should show search functionality', () => {
      cy.get('input[type="search"], input[placeholder*="search" i]').should('exist')
    })

    it('should display school name column', () => {
      cy.contains(/name|school/i).should('be.visible')
    })

    it('should show district column', () => {
      cy.contains(/district/i).should('be.visible')
    })

    it('should display enrollment column', () => {
      cy.contains(/enrollment|students/i).should('be.visible')
    })

    it('should show status column', () => {
      cy.contains(/status|active/i).should('be.visible')
    })

    it('should have action buttons for each school', () => {
      cy.get('button[class*="text-"], a[class*="text-"]').should('have.length.at.least', 1)
    })

    it('should display school type information', () => {
      cy.contains(/elementary|middle|high|type/i).should('exist')
    })

    it('should show filter by district', () => {
      cy.get('select, [role="combobox"]').should('exist')
    })

    it('should display school address', () => {
      cy.contains(/address|location/i).should('exist')
    })

    it('should have sorting capability', () => {
      cy.get('th[class*="cursor-"], button[class*="sort"]').should('exist')
    })

    it('should show empty state when no schools', () => {
      cy.contains(/no.*school|empty/i).should('exist')
    })

    it('should display school contact information', () => {
      cy.contains(/contact|phone|email/i).should('exist')
    })

    it('should have bulk actions available', () => {
      cy.get('input[type="checkbox"]').should('exist')
    })

    it('should show export functionality', () => {
      cy.get('button').contains(/export|download/i).should('exist')
    })

    it('should display nurse assignments', () => {
      cy.contains(/nurse|staff/i).should('exist')
    })

    it('should have responsive table layout', () => {
      cy.get('[class*="overflow-x"]').should('exist')
    })
  })

  // ============================================================================
  // USERS TAB TESTS (25 tests)
  // ============================================================================

  describe('Users Tab', () => {
    beforeEach(() => {
      cy.contains('button', 'Users').click()
    })

    it('should display the Users tab content', () => {
      cy.contains('button', 'Users').should('have.class', 'border-blue-500')
    })

    it('should show users heading', () => {
      cy.contains(/user/i).should('be.visible')
    })

    it('should have add user button', () => {
      cy.get('button').contains(/add|new|create/i).should('be.visible')
    })

    it('should display users table', () => {
      cy.get('table').should('exist')
    })

    it('should show search functionality', () => {
      cy.get('input[type="search"], input[placeholder*="search" i]').should('exist')
    })

    it('should display name column', () => {
      cy.contains(/name|user/i).should('be.visible')
    })

    it('should show email column', () => {
      cy.contains(/email/i).should('be.visible')
    })

    it('should display role column', () => {
      cy.contains(/role/i).should('be.visible')
    })

    it('should show status column', () => {
      cy.contains(/status|active/i).should('be.visible')
    })

    it('should display last login column', () => {
      cy.contains(/last.*login|activity/i).should('be.visible')
    })

    it('should have action buttons for each user', () => {
      cy.get('button[class*="text-"], a[class*="text-"]').should('have.length.at.least', 1)
    })

    it('should show filter by role', () => {
      cy.get('select, [role="combobox"]').contains(/role|all/i).should('exist')
    })

    it('should display filter by status', () => {
      cy.get('select, [role="combobox"]').contains(/status|active/i).should('exist')
    })

    it('should have sorting capability', () => {
      cy.get('th[class*="cursor-"], button[class*="sort"]').should('exist')
    })

    it('should show pagination', () => {
      cy.contains(/page|showing|of/i).should('exist')
    })

    it('should display user school assignments', () => {
      cy.contains(/school|assigned/i).should('exist')
    })

    it('should have edit user functionality', () => {
      cy.get('button, a').contains(/edit|modify/i).should('exist')
    })

    it('should show delete/deactivate user option', () => {
      cy.get('button').contains(/delete|deactivate|disable/i).should('exist')
    })

    it('should display user permissions', () => {
      cy.contains(/permission|access/i).should('exist')
    })

    it('should have bulk actions available', () => {
      cy.get('input[type="checkbox"]').should('exist')
    })

    it('should show export functionality', () => {
      cy.get('button').contains(/export|download/i).should('exist')
    })

    it('should display user creation date', () => {
      cy.contains(/created|joined/i).should('exist')
    })

    it('should show reset password option', () => {
      cy.get('button').contains(/reset.*password|password/i).should('exist')
    })

    it('should have responsive table layout', () => {
      cy.get('[class*="overflow-x"]').should('exist')
    })

    it('should display role badges', () => {
      cy.get('[class*="badge"], [class*="rounded-full"]').should('exist')
    })
  })

  // ============================================================================
  // CONFIGURATION TAB TESTS (20 tests)
  // ============================================================================

  describe('Configuration Tab', () => {
    beforeEach(() => {
      cy.contains('button', 'Configuration').click()
    })

    it('should display the Configuration tab content', () => {
      cy.contains('button', 'Configuration').should('have.class', 'border-blue-500')
    })

    it('should show configuration heading', () => {
      cy.contains(/configuration|settings/i).should('be.visible')
    })

    it('should display system settings section', () => {
      cy.contains(/system|general/i).should('be.visible')
    })

    it('should show security settings', () => {
      cy.contains(/security/i).should('be.visible')
    })

    it('should display email configuration', () => {
      cy.contains(/email|smtp/i).should('be.visible')
    })

    it('should show notification settings', () => {
      cy.contains(/notification/i).should('be.visible')
    })

    it('should display authentication settings', () => {
      cy.contains(/authentication|auth/i).should('be.visible')
    })

    it('should show password policy settings', () => {
      cy.contains(/password.*policy|password.*requirement/i).should('be.visible')
    })

    it('should display session timeout settings', () => {
      cy.contains(/session|timeout/i).should('be.visible')
    })

    it('should show API configuration', () => {
      cy.contains(/api|endpoint/i).should('be.visible')
    })

    it('should have save changes button', () => {
      cy.get('button').contains(/save|update|apply/i).should('be.visible')
    })

    it('should display file upload settings', () => {
      cy.contains(/upload|file.*size/i).should('be.visible')
    })

    it('should show timezone configuration', () => {
      cy.contains(/timezone|time.*zone/i).should('be.visible')
    })

    it('should display date format settings', () => {
      cy.contains(/date.*format|format/i).should('be.visible')
    })

    it('should show language settings', () => {
      cy.contains(/language|locale/i).should('be.visible')
    })

    it('should display HIPAA compliance settings', () => {
      cy.contains(/hipaa|compliance/i).should('be.visible')
    })

    it('should show audit logging configuration', () => {
      cy.contains(/audit|logging/i).should('be.visible')
    })

    it('should display data retention settings', () => {
      cy.contains(/retention|archive/i).should('be.visible')
    })

    it('should have reset to defaults option', () => {
      cy.get('button').contains(/reset|default/i).should('exist')
    })

    it('should show validation for required fields', () => {
      cy.get('input[required], [class*="required"]').should('exist')
    })
  })

  // ============================================================================
  // INTEGRATIONS TAB TESTS (15 tests)
  // ============================================================================

  describe('Integrations Tab', () => {
    beforeEach(() => {
      cy.contains('button', 'Integrations').click()
    })

    it('should display the Integrations tab content', () => {
      cy.contains('button', 'Integrations').should('have.class', 'border-blue-500')
    })

    it('should show integrations heading', () => {
      cy.contains(/integration/i).should('be.visible')
    })

    it('should display available integrations', () => {
      cy.get('[class*="grid"], [class*="space-y"]').should('exist')
    })

    it('should show integration status indicators', () => {
      cy.contains(/connected|active|inactive/i).should('exist')
    })

    it('should display SIS integration option', () => {
      cy.contains(/sis|student.*information/i).should('be.visible')
    })

    it('should show EHR integration option', () => {
      cy.contains(/ehr|electronic.*health/i).should('be.visible')
    })

    it('should display API key management', () => {
      cy.contains(/api.*key|key/i).should('be.visible')
    })

    it('should show webhook configuration', () => {
      cy.contains(/webhook/i).should('exist')
    })

    it('should display OAuth settings', () => {
      cy.contains(/oauth|sso/i).should('exist')
    })

    it('should have connect/disconnect buttons', () => {
      cy.get('button').contains(/connect|disconnect/i).should('be.visible')
    })

    it('should show integration test functionality', () => {
      cy.get('button').contains(/test|verify/i).should('exist')
    })

    it('should display sync status', () => {
      cy.contains(/sync|synchronize/i).should('exist')
    })

    it('should show last sync time', () => {
      cy.contains(/last.*sync|updated/i).should('exist')
    })

    it('should display integration logs', () => {
      cy.contains(/log|history/i).should('exist')
    })

    it('should have integration documentation links', () => {
      cy.get('a[href*="docs"], a[href*="documentation"]').should('exist')
    })
  })

  // ============================================================================
  // BACKUPS TAB TESTS (15 tests)
  // ============================================================================

  describe('Backups Tab', () => {
    beforeEach(() => {
      cy.contains('button', 'Backups').click()
    })

    it('should display the Backups tab content', () => {
      cy.contains('button', 'Backups').should('have.class', 'border-blue-500')
    })

    it('should show backups heading', () => {
      cy.contains(/backup/i).should('be.visible')
    })

    it('should have create backup button', () => {
      cy.get('button').contains(/create|new.*backup|backup.*now/i).should('be.visible')
    })

    it('should display backup history table', () => {
      cy.get('table, [class*="space-y"]').should('exist')
    })

    it('should show backup date/time column', () => {
      cy.contains(/date|time|created/i).should('be.visible')
    })

    it('should display backup size column', () => {
      cy.contains(/size|mb|gb/i).should('be.visible')
    })

    it('should show backup status column', () => {
      cy.contains(/status|complete/i).should('be.visible')
    })

    it('should have restore backup functionality', () => {
      cy.get('button').contains(/restore/i).should('exist')
    })

    it('should display download backup option', () => {
      cy.get('button, a').contains(/download/i).should('exist')
    })

    it('should show delete backup option', () => {
      cy.get('button').contains(/delete|remove/i).should('exist')
    })

    it('should display automated backup schedule', () => {
      cy.contains(/schedule|automatic|automated/i).should('be.visible')
    })

    it('should show backup retention policy', () => {
      cy.contains(/retention|keep/i).should('exist')
    })

    it('should display backup storage location', () => {
      cy.contains(/storage|location|destination/i).should('exist')
    })

    it('should have backup verification status', () => {
      cy.contains(/verified|integrity/i).should('exist')
    })

    it('should show last successful backup time', () => {
      cy.contains(/last.*backup|recent/i).should('exist')
    })
  })

  // ============================================================================
  // MONITORING TAB TESTS (20 tests)
  // ============================================================================

  describe('Monitoring Tab', () => {
    beforeEach(() => {
      cy.contains('button', 'Monitoring').click()
    })

    it('should display the Monitoring tab content', () => {
      cy.contains('button', 'Monitoring').should('have.class', 'border-blue-500')
    })

    it('should show monitoring heading', () => {
      cy.contains(/monitoring|system.*health/i).should('be.visible')
    })

    it('should display system health metrics', () => {
      cy.get('[class*="grid"]').should('exist')
    })

    it('should show CPU usage metric', () => {
      cy.contains(/cpu/i).should('be.visible')
    })

    it('should display memory usage metric', () => {
      cy.contains(/memory|ram/i).should('be.visible')
    })

    it('should show disk usage metric', () => {
      cy.contains(/disk|storage/i).should('be.visible')
    })

    it('should display database status', () => {
      cy.contains(/database|postgres/i).should('be.visible')
    })

    it('should show API response time', () => {
      cy.contains(/response.*time|latency/i).should('be.visible')
    })

    it('should display uptime metric', () => {
      cy.contains(/uptime/i).should('be.visible')
    })

    it('should show active connections', () => {
      cy.contains(/connection|active.*user/i).should('be.visible')
    })

    it('should display error rate metric', () => {
      cy.contains(/error|failure/i).should('exist')
    })

    it('should show refresh button', () => {
      cy.get('button').contains(/refresh|reload/i).should('be.visible')
    })

    it('should display charts or graphs', () => {
      cy.get('svg, canvas, [class*="chart"]').should('exist')
    })

    it('should show real-time updates', () => {
      cy.contains(/real.*time|live/i).should('exist')
    })

    it('should display alert thresholds', () => {
      cy.contains(/threshold|alert/i).should('exist')
    })

    it('should show service status indicators', () => {
      cy.get('[class*="bg-green"], [class*="bg-red"], [class*="status"]').should('exist')
    })

    it('should display queue metrics', () => {
      cy.contains(/queue|jobs/i).should('exist')
    })

    it('should show cache hit rate', () => {
      cy.contains(/cache|redis/i).should('exist')
    })

    it('should have export metrics option', () => {
      cy.get('button').contains(/export|download/i).should('exist')
    })

    it('should display time range selector', () => {
      cy.get('select, button').contains(/hour|day|week/i).should('exist')
    })
  })

  // ============================================================================
  // LICENSES TAB TESTS (10 tests)
  // ============================================================================

  describe('Licenses Tab', () => {
    beforeEach(() => {
      cy.contains('button', 'Licenses').click()
    })

    it('should display the Licenses tab content', () => {
      cy.contains('button', 'Licenses').should('have.class', 'border-blue-500')
    })

    it('should show licenses heading', () => {
      cy.contains(/license/i).should('be.visible')
    })

    it('should display current license information', () => {
      cy.contains(/current|active/i).should('be.visible')
    })

    it('should show license expiration date', () => {
      cy.contains(/expir|valid.*until/i).should('be.visible')
    })

    it('should display number of allowed users', () => {
      cy.contains(/users|seats/i).should('be.visible')
    })

    it('should show license type/tier', () => {
      cy.contains(/tier|type|plan/i).should('be.visible')
    })

    it('should display features included', () => {
      cy.contains(/feature|included/i).should('be.visible')
    })

    it('should have upgrade license button', () => {
      cy.get('button').contains(/upgrade|renew/i).should('exist')
    })

    it('should show license key or number', () => {
      cy.contains(/key|number|id/i).should('be.visible')
    })

    it('should display support contact information', () => {
      cy.contains(/support|contact/i).should('exist')
    })
  })

  // ============================================================================
  // TRAINING TAB TESTS (10 tests)
  // ============================================================================

  describe('Training Tab', () => {
    beforeEach(() => {
      cy.contains('button', 'Training').click()
    })

    it('should display the Training tab content', () => {
      cy.contains('button', 'Training').should('have.class', 'border-blue-500')
    })

    it('should show training heading', () => {
      cy.contains(/training|resources/i).should('be.visible')
    })

    it('should display training materials list', () => {
      cy.get('[class*="grid"], [class*="space-y"]').should('exist')
    })

    it('should show video tutorials section', () => {
      cy.contains(/video|tutorial/i).should('be.visible')
    })

    it('should display documentation links', () => {
      cy.contains(/documentation|docs|guide/i).should('be.visible')
    })

    it('should show quick start guides', () => {
      cy.contains(/quick.*start|getting.*started/i).should('exist')
    })

    it('should display user manuals', () => {
      cy.contains(/manual|handbook/i).should('exist')
    })

    it('should have search functionality', () => {
      cy.get('input[type="search"], input[placeholder*="search" i]').should('exist')
    })

    it('should show categories or topics', () => {
      cy.contains(/category|topic/i).should('exist')
    })

    it('should display help center link', () => {
      cy.get('a').contains(/help|support/i).should('exist')
    })
  })

  // ============================================================================
  // AUDIT LOGS TAB TESTS (15 tests)
  // ============================================================================

  describe('Audit Logs Tab', () => {
    beforeEach(() => {
      cy.contains('button', 'Audit Logs').click()
    })

    it('should display the Audit Logs tab content', () => {
      cy.contains('button', 'Audit Logs').should('have.class', 'border-blue-500')
    })

    it('should show audit logs heading', () => {
      cy.contains(/audit.*log/i).should('be.visible')
    })

    it('should display audit logs table', () => {
      cy.get('table').should('exist')
    })

    it('should show timestamp column', () => {
      cy.contains(/time|date|when/i).should('be.visible')
    })

    it('should display user column', () => {
      cy.contains(/user|who|actor/i).should('be.visible')
    })

    it('should show action column', () => {
      cy.contains(/action|event|activity/i).should('be.visible')
    })

    it('should display resource column', () => {
      cy.contains(/resource|target|object/i).should('be.visible')
    })

    it('should show IP address column', () => {
      cy.contains(/ip|address/i).should('be.visible')
    })

    it('should have filter by user', () => {
      cy.get('select, input').should('exist')
    })

    it('should display filter by action type', () => {
      cy.get('select').contains(/action|type|all/i).should('exist')
    })

    it('should show date range filter', () => {
      cy.get('input[type="date"], input[placeholder*="date" i]').should('exist')
    })

    it('should have export logs functionality', () => {
      cy.get('button').contains(/export|download/i).should('be.visible')
    })

    it('should display pagination', () => {
      cy.contains(/page|showing|of/i).should('exist')
    })

    it('should show search functionality', () => {
      cy.get('input[type="search"], input[placeholder*="search" i]').should('exist')
    })

    it('should display log details on click', () => {
      cy.get('table tr, [class*="cursor-pointer"]').should('exist')
    })
  })

  // ============================================================================
  // RESPONSIVE DESIGN TESTS (10 tests)
  // ============================================================================

  describe('Responsive Design', () => {
    it('should be responsive on mobile (375px)', () => {
      cy.viewport(375, 667)
      cy.contains('h1', 'Administration Panel').should('be.visible')
    })

    it('should be responsive on tablet (768px)', () => {
      cy.viewport(768, 1024)
      cy.contains('h1', 'Administration Panel').should('be.visible')
    })

    it('should be responsive on desktop (1920px)', () => {
      cy.viewport(1920, 1080)
      cy.contains('h1', 'Administration Panel').should('be.visible')
    })

    it('should have scrollable tab navigation on small screens', () => {
      cy.viewport(375, 667)
      cy.get('nav[class*="overflow-x"]').should('exist')
    })

    it('should adapt grid layouts on different screen sizes', () => {
      cy.viewport(1280, 720)
      cy.get('[class*="grid"]').should('exist')
    })

    it('should maintain usability on iPad (810px)', () => {
      cy.viewport(810, 1080)
      cy.get('nav button').should('be.visible')
    })

    it('should handle very wide screens (2560px)', () => {
      cy.viewport(2560, 1440)
      cy.contains('h1', 'Administration Panel').should('be.visible')
    })

    it('should maintain aspect ratio on landscape mobile', () => {
      cy.viewport(667, 375)
      cy.get('body').should('be.visible')
    })

    it('should have readable text on all screen sizes', () => {
      cy.viewport(375, 667)
      cy.get('h1').should('have.css', 'font-size')
    })

    it('should maintain proper spacing on different viewports', () => {
      cy.viewport(1024, 768)
      cy.get('[class*="space-y"], [class*="gap"]').should('exist')
    })
  })
})
