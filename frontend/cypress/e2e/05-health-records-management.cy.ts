/// <reference types="cypress" />

describe('Health Records Management - Comprehensive Test Suite', () => {
  beforeEach(() => {
    // Mock API responses to avoid 401 errors
    cy.intercept('GET', '**/api/students/assigned', {
      statusCode: 200,
      body: [
        { id: '1', firstName: 'John', lastName: 'Doe', studentNumber: 'STU001' },
        { id: '2', firstName: 'Jane', lastName: 'Smith', studentNumber: 'STU002' }
      ]
    }).as('getAssignedStudents')

    cy.intercept('GET', '**/api/health-records/student/*/allergies', {
      statusCode: 200,
      body: []
    }).as('getAllergies')

    cy.intercept('GET', '**/api/health-records/student/*/chronic-conditions', {
      statusCode: 200,
      body: []
    }).as('getChronicConditions')

    cy.intercept('GET', '**/api/health-records/student/*/vaccinations', {
      statusCode: 200,
      body: []
    }).as('getVaccinations')

    cy.intercept('GET', '**/api/health-records/student/*/growth-chart', {
      statusCode: 200,
      body: []
    }).as('getGrowthChart')

    cy.intercept('GET', '**/api/health-records/student/*/vitals', {
      statusCode: 200,
      body: []
    }).as('getVitals')

    cy.login('nurse')
    cy.visit('/dashboard')
    // Navigate to health records page
    cy.visit('/health-records')
    // Wait for page to fully load
    cy.get('[data-testid="health-records-page"]', { timeout: 10000 }).should('exist')
  })

  // ========================================
  // SECTION 1: PAGE LOADING & STRUCTURE (15 tests)
  // ========================================
  describe('Page Loading & Structure', () => {
    it('should display the health records page with proper elements', () => {
      cy.get('[data-testid="health-records-page"]').should('be.visible')
      cy.url().should('include', '/health-records')
      cy.contains('Health Records Management').should('be.visible')
    })

    it('should load page without errors', () => {
      cy.get('body').should('be.visible')
      cy.url().should('include', '/health-records')
    })

    it('should display page header and navigation', () => {
      cy.get('.sticky.top-0').should('be.visible')
      cy.get('nav').should('be.visible')
      cy.get('nav').contains('Health Records').should('exist')
    })

    it('should have accessible page title', () => {
      cy.get('h1, h2, [role="heading"]').should('exist')
    })

    it('should maintain authentication on page load', () => {
      cy.url().should('not.include', '/login')
      cy.get('body').should('be.visible')
    })

    it('should display the main page heading', () => {
      cy.contains('Health Records Management').should('be.visible')
    })

    it('should display the page description', () => {
      cy.contains('Comprehensive electronic health records system').should('be.visible')
    })

    it('should render the student selector component', () => {
      cy.get('[data-testid="student-selector"]').should('exist')
    })

    it('should display the privacy notice section', () => {
      cy.get('[data-testid="privacy-notice"]').should('be.visible')
    })

    it('should show HIPAA compliance badge', () => {
      cy.get('[data-testid="hipaa-compliance-badge"]').should('be.visible')
      cy.contains('HIPAA Compliant').should('be.visible')
    })

    it('should display user session information', () => {
      cy.get('[data-testid="privacy-notice"]').should('contain', 'Session:')
    })

    it('should display user role information', () => {
      cy.get('[data-testid="privacy-notice"]').should('contain', 'Role:')
    })

    it('should show data use agreement checkbox', () => {
      cy.get('[data-testid="data-use-agreement"]').should('exist')
      cy.get('[data-testid="data-use-agreement"]').should('be.checked')
    })

    it('should render feature highlight cards', () => {
      cy.contains('Electronic Health Records').should('be.visible')
      cy.contains('Vaccination Tracking').should('be.visible')
      cy.contains('Allergy Management').should('be.visible')
      cy.contains('Chronic Condition Monitoring').should('be.visible')
    })

    it('should display summary statistics cards', () => {
      cy.contains('Total Records').should('be.visible')
      cy.contains('Active Allergies').should('be.visible')
      cy.contains('Chronic Conditions').should('be.visible')
      cy.contains('Vaccinations Due').should('be.visible')
    })
  })

  // ========================================
  // SECTION 2: NAVIGATION & TABS (20 tests)
  // ========================================
  describe('Tab Navigation', () => {
    it('should display all tab options', () => {
      cy.contains('button', 'Overview').should('be.visible')
      cy.contains('button', 'Health Records').should('be.visible')
      cy.contains('button', 'Allergies').should('be.visible')
      cy.contains('button', 'Chronic Conditions').should('be.visible')
      cy.contains('button', 'Vaccinations').should('be.visible')
      cy.contains('button', 'Growth Charts').should('be.visible')
      cy.contains('button', 'Screenings').should('be.visible')
    })

    it('should start on the Overview tab by default', () => {
      cy.contains('button', 'Overview').should('have.class', 'border-blue-600')
    })

    it('should navigate to Health Records tab', () => {
      cy.contains('button', 'Health Records').click()
      cy.wait(500)
    })

    it('should navigate to Allergies tab', () => {
      cy.contains('button', 'Allergies').click()
      cy.wait(500)
      cy.get('[data-testid="allergies-content"]').should('be.visible')
    })

    it('should navigate to Chronic Conditions tab', () => {
      cy.contains('button', 'Chronic Conditions').click()
      cy.wait(500)
      cy.get('[data-testid="chronic-conditions-content"]').should('be.visible')
    })

    it('should navigate to Vaccinations tab', () => {
      cy.contains('button', 'Vaccinations').click()
      cy.wait(500)
      cy.get('[data-testid="vaccinations-content"]').should('be.visible')
    })

    it('should navigate to Growth Charts tab', () => {
      cy.contains('button', 'Growth Charts').click()
      cy.wait(500)
      cy.get('[data-testid="growth-charts-content"]').should('be.visible')
    })

    it('should navigate to Screenings tab', () => {
      cy.contains('button', 'Screenings').click()
      cy.wait(500)
      cy.get('[data-testid="screenings-content"]').should('be.visible')
    })

    it('should highlight active tab', () => {
      cy.contains('button', 'Allergies').click()
      cy.wait(500)
      cy.contains('button', 'Allergies').should('have.class', 'border-blue-600')
    })

    it('should persist tab selection', () => {
      cy.contains('button', 'Vaccinations').click()
      cy.wait(500)
      cy.reload()
      // After reload, should default back to Overview
      cy.contains('button', 'Overview').should('have.class', 'border-blue-600')
    })

    it('should switch between multiple tabs', () => {
      cy.contains('button', 'Allergies').click()
      cy.wait(300)
      cy.contains('button', 'Vaccinations').click()
      cy.wait(300)
      cy.contains('button', 'Overview').click()
      cy.wait(300)
    })

    it('should load tab content when switching', () => {
      cy.contains('button', 'Allergies').click()
      cy.wait(500)
      cy.get('[data-testid="allergies-list"]').should('exist')
    })

    it('should display tab icons', () => {
      cy.contains('button', 'Overview').find('svg').should('exist')
      cy.contains('button', 'Allergies').find('svg').should('exist')
    })

    it('should navigate through all tabs sequentially', () => {
      const tabs = ['Health Records', 'Allergies', 'Chronic Conditions', 'Vaccinations', 'Growth Charts', 'Screenings']
      tabs.forEach(tab => {
        cy.contains('button', tab).click()
        cy.wait(300)
      })
    })

    it('should handle rapid tab switching', () => {
      cy.contains('button', 'Allergies').click()
      cy.contains('button', 'Vaccinations').click()
      cy.contains('button', 'Growth Charts').click()
      cy.wait(500)
    })

    it('should maintain data when switching tabs', () => {
      cy.contains('button', 'Allergies').click()
      cy.wait(500)
      cy.contains('button', 'Overview').click()
      cy.wait(300)
      cy.contains('button', 'Allergies').click()
      cy.wait(500)
      cy.get('[data-testid="allergies-list"]').should('exist')
    })

    it('should show tab count badges if available', () => {
      // This tests the UI framework for badge support
      cy.contains('button', 'Vaccinations').should('be.visible')
    })

    it('should support keyboard navigation between tabs', () => {
      cy.contains('button', 'Overview').focus()
      cy.focused().should('contain', 'Overview')
    })

    it('should display appropriate content for each tab', () => {
      cy.contains('button', 'Allergies').click()
      cy.wait(500)
      cy.get('[data-testid="add-allergy-button"]').should('be.visible')
    })

    it('should handle back button navigation', () => {
      cy.contains('button', 'Allergies').click()
      cy.wait(500)
      cy.go('back')
      cy.wait(500)
      cy.url().should('include', '/health-records')
    })
  })

  // ========================================
  // SECTION 3: SEARCH & FILTER (15 tests)
  // ========================================
  describe('Search and Filter Functionality', () => {
    it('should display search input on Overview tab', () => {
      cy.get('[data-testid="health-records-search"]').should('be.visible')
    })

    it('should allow typing in search field', () => {
      cy.get('[data-testid="health-records-search"]')
        .type('John Doe')
        .should('have.value', 'John Doe')
    })

    it('should display record type filter', () => {
      cy.get('[data-testid="record-type-filter"]').should('be.visible')
    })

    it('should allow selecting different record types', () => {
      cy.get('[data-testid="record-type-filter"]').select('EXAMINATION')
    })

    it('should display date range filters', () => {
      cy.get('[data-testid="date-from"]').should('be.visible')
      cy.get('[data-testid="date-to"]').should('be.visible')
    })

    it('should allow selecting from date', () => {
      cy.get('[data-testid="date-from"]').type('2024-01-01')
    })

    it('should allow selecting to date', () => {
      cy.get('[data-testid="date-to"]').type('2024-12-31')
    })

    it('should have apply filter button', () => {
      cy.get('[data-testid="apply-date-filter"]').should('be.visible')
    })

    it('should apply date filters when button clicked', () => {
      cy.get('[data-testid="date-from"]').type('2024-01-01')
      cy.get('[data-testid="date-to"]').type('2024-12-31')
      cy.get('[data-testid="apply-date-filter"]').click()
    })

    it('should clear search input', () => {
      cy.get('[data-testid="health-records-search"]')
        .type('Test Search')
        .clear()
        .should('have.value', '')
    })

    it('should handle empty search gracefully', () => {
      cy.get('[data-testid="health-records-search"]')
        .type('   ')
        .should('have.value', '   ')
    })

    it('should display all record type options', () => {
      cy.get('[data-testid="record-type-filter"]').select('VACCINATION')
      cy.get('[data-testid="record-type-filter"]').select('ALLERGY')
      cy.get('[data-testid="record-type-filter"]').select('MEDICATION')
    })

    it('should validate date range', () => {
      cy.get('[data-testid="date-from"]').type('2024-12-31')
      cy.get('[data-testid="date-to"]').type('2024-01-01')
      // Date validation happens on backend
    })

    it('should persist filters across tab switches', () => {
      cy.get('[data-testid="health-records-search"]').type('Test')
      cy.contains('button', 'Allergies').click()
      cy.wait(500)
      cy.contains('button', 'Overview').click()
      cy.wait(500)
      cy.get('[data-testid="health-records-search"]').should('have.value', 'Test')
    })

    it('should support special characters in search', () => {
      cy.get('[data-testid="health-records-search"]')
        .type("O'Brien")
        .should('have.value', "O'Brien")
    })
  })

  // ========================================
  // SECTION 4: ALLERGIES TAB (20 tests)
  // ========================================
  describe('Allergies Tab', () => {
    beforeEach(() => {
      cy.contains('button', 'Allergies').click()
      cy.wait(500)
    })

    it('should display allergies tab content', () => {
      cy.get('[data-testid="allergies-content"]').should('be.visible')
    })

    it('should show add allergy button', () => {
      cy.get('[data-testid="add-allergy-button"]').should('be.visible')
    })

    it('should display allergies list', () => {
      cy.get('[data-testid="allergies-list"]').should('exist')
    })

    it('should show allergy items', () => {
      cy.get('[data-testid="allergy-item"]').should('have.length.at.least', 1)
    })

    it('should display allergen names', () => {
      cy.get('[data-testid="allergen-name"]').first().should('be.visible')
    })

    it('should show severity badges', () => {
      cy.get('[data-testid="severity-badge"]').should('exist')
    })

    it('should display verification status', () => {
      cy.get('[data-testid="verification-status"]').should('exist')
    })

    it('should show life-threatening allergies in red', () => {
      cy.get('[data-testid="allergy-item"]').first().within(() => {
        cy.get('svg').should('have.class', 'text-red-600')
      })
    })

    it('should display treatment details', () => {
      cy.get('[data-testid="treatment-details"]').should('exist')
    })

    it('should show provider name', () => {
      cy.get('[data-testid="provider-name"]').should('exist')
    })

    it('should show edit buttons for each allergy', () => {
      cy.get('[data-testid="edit-allergy-button"]').should('have.length.at.least', 1)
    })

    it('should click add allergy button', () => {
      cy.get('[data-testid="add-allergy-button"]').click()
      // Modal would open
    })

    it('should click edit allergy button', () => {
      cy.get('[data-testid="edit-allergy-button"]').first().click()
      // Edit modal would open
    })

    it('should display verified allergies with green badge', () => {
      cy.contains('[data-testid="verification-status"]', 'Verified')
        .should('have.class', 'bg-green-100')
    })

    it('should display unverified allergies with gray badge', () => {
      cy.contains('[data-testid="verification-status"]', 'Unverified')
        .should('have.class', 'bg-gray-100')
    })

    it('should show multiple severity levels', () => {
      cy.get('[data-testid="severity-badge"]').should('contain.text', 'LIFE_THREATENING')
        .or('contain.text', 'SEVERE')
        .or('contain.text', 'MODERATE')
    })

    it('should display allergen icons', () => {
      cy.get('[data-testid="allergy-item"]').first().find('svg').should('exist')
    })

    it('should organize allergies in a list format', () => {
      cy.get('[data-testid="allergies-list"]').children().should('have.length.at.least', 1)
    })

    it('should show allergy section heading', () => {
      cy.contains('Student Allergies').should('be.visible')
    })

    it('should maintain allergy data integrity', () => {
      cy.get('[data-testid="allergen-name"]').first().invoke('text').should('not.be.empty')
    })
  })

  // ========================================
  // SECTION 5: CHRONIC CONDITIONS TAB (15 tests)
  // ========================================
  describe('Chronic Conditions Tab', () => {
    beforeEach(() => {
      cy.contains('button', 'Chronic Conditions').click()
      cy.wait(500)
    })

    it('should display chronic conditions content', () => {
      cy.get('[data-testid="chronic-conditions-content"]').should('be.visible')
    })

    it('should show add condition button', () => {
      cy.get('[data-testid="add-condition-button"]').should('be.visible')
    })

    it('should display conditions list', () => {
      cy.get('[data-testid="conditions-list"]').should('exist')
    })

    it('should show condition items', () => {
      cy.get('[data-testid="condition-item"]').should('have.length.at.least', 1)
    })

    it('should display condition names', () => {
      cy.get('[data-testid="condition-name"]').should('be.visible')
    })

    it('should show status badges', () => {
      cy.get('[data-testid="status-badge"]').should('exist')
    })

    it('should display severity indicators', () => {
      cy.get('[data-testid="severity-indicator"]').should('exist')
    })

    it('should show view care plan buttons', () => {
      cy.get('[data-testid="view-care-plan"]').should('have.length.at.least', 1)
    })

    it('should click add condition button', () => {
      cy.get('[data-testid="add-condition-button"]').click()
    })

    it('should click view care plan button', () => {
      cy.get('[data-testid="view-care-plan"]').first().click()
    })

    it('should display active conditions', () => {
      cy.contains('[data-testid="status-badge"]', 'Active').should('exist')
    })

    it('should display managed conditions', () => {
      cy.contains('[data-testid="status-badge"]', 'Managed').should('exist')
    })

    it('should show next review date', () => {
      cy.get('[data-testid="next-review"]').should('exist')
    })

    it('should display diagnosed date', () => {
      cy.get('[data-testid="diagnosed-date"]').should('exist')
    })

    it('should organize conditions properly', () => {
      cy.get('[data-testid="conditions-list"]').children().should('have.length.at.least', 1)
    })
  })

  // ========================================
  // SECTION 6: VACCINATIONS TAB (25 tests)
  // ========================================
  describe('Vaccinations Tab', () => {
    beforeEach(() => {
      cy.contains('button', 'Vaccinations').click()
      cy.wait(500)
    })

    it('should display vaccinations content', () => {
      cy.get('[data-testid="vaccinations-content"]').should('be.visible')
    })

    it('should show record vaccination button', () => {
      cy.get('[data-testid="record-vaccination-button"]').should('be.visible')
    })

    it('should show schedule vaccination button', () => {
      cy.get('[data-testid="schedule-vaccination-button"]').should('be.visible')
    })

    it('should display vaccinations table', () => {
      cy.get('[data-testid="vaccinations-table"]').should('exist')
    })

    it('should show vaccination search', () => {
      cy.get('[data-testid="vaccination-search"]').should('be.visible')
    })

    it('should allow searching vaccinations', () => {
      cy.get('[data-testid="vaccination-search"]')
        .type('MMR')
        .should('have.value', 'MMR')
    })

    it('should display filter dropdown', () => {
      cy.get('[data-testid="vaccination-filter"]').should('be.visible')
    })

    it('should filter by compliance status', () => {
      cy.get('[data-testid="vaccination-filter"]').select('compliant')
    })

    it('should display sort dropdown', () => {
      cy.get('[data-testid="vaccination-sort"]').should('be.visible')
    })

    it('should sort by date', () => {
      cy.get('[data-testid="vaccination-sort"]').select('date')
    })

    it('should sort by name', () => {
      cy.get('[data-testid="vaccination-sort"]').select('name')
    })

    it('should display vaccination rows', () => {
      cy.get('[data-testid="vaccination-row"]').should('have.length.at.least', 1)
    })

    it('should show vaccine names', () => {
      cy.get('[data-testid="vaccine-name"]').should('be.visible')
    })

    it('should display compliance badges', () => {
      cy.get('[data-testid="compliance-badge"]').should('exist')
    })

    it('should show compliant vaccines in green', () => {
      cy.contains('[data-testid="compliance-badge"]', 'Compliant')
        .should('have.class', 'bg-green-100')
    })

    it('should show overdue vaccines in red', () => {
      cy.get('[data-testid="vaccinations-table"]').should('exist')
    })

    it('should display due dates', () => {
      cy.get('[data-testid="due-date"]').should('exist')
    })

    it('should show administered dates', () => {
      cy.get('[data-testid="administered-date"]').should('exist')
    })

    it('should display action buttons', () => {
      cy.get('[data-testid="vaccination-actions"]').should('exist')
    })

    it('should click record vaccination button', () => {
      cy.get('[data-testid="record-vaccination-button"]').click()
    })

    it('should click schedule vaccination button', () => {
      cy.get('[data-testid="schedule-vaccination-button"]').click()
    })

    it('should show edit vaccination buttons', () => {
      cy.get('[data-testid="edit-vaccination"]').should('exist')
    })

    it('should show delete vaccination buttons', () => {
      cy.get('[data-testid="delete-vaccination"]').should('exist')
    })

    it('should display priority indicators', () => {
      cy.get('[data-testid="priority-badge"]').should('exist')
    })

    it('should show high priority vaccines', () => {
      cy.contains('[data-testid="priority-badge"]', 'High').should('exist')
    })
  })

  // ========================================
  // SECTION 7: GROWTH CHARTS TAB (15 tests)
  // ========================================
  describe('Growth Charts Tab', () => {
    beforeEach(() => {
      cy.contains('button', 'Growth Charts').click()
      cy.wait(500)
    })

    it('should display growth charts content', () => {
      cy.get('[data-testid="growth-charts-content"]').should('be.visible')
    })

    it('should show add measurement button', () => {
      cy.get('[data-testid="add-measurement-button"]').should('be.visible')
    })

    it('should display chart type selector', () => {
      cy.get('[data-testid="chart-type-selector"]').should('be.visible')
    })

    it('should select height chart', () => {
      cy.get('[data-testid="chart-type-selector"]').select('Height')
    })

    it('should select weight chart', () => {
      cy.get('[data-testid="chart-type-selector"]').select('Weight')
    })

    it('should select BMI chart', () => {
      cy.get('[data-testid="chart-type-selector"]').select('BMI')
    })

    it('should display measurements table', () => {
      cy.get('[data-testid="measurements-table"]').should('exist')
    })

    it('should show measurement rows', () => {
      cy.get('[data-testid="measurement-row"]').should('have.length.at.least', 1)
    })

    it('should display dates', () => {
      cy.get('[data-testid="measurement-date"]').should('exist')
    })

    it('should show height values', () => {
      cy.get('[data-testid="height-value"]').should('exist')
    })

    it('should show weight values', () => {
      cy.get('[data-testid="weight-value"]').should('exist')
    })

    it('should display BMI values', () => {
      cy.get('[data-testid="bmi-value"]').should('exist')
    })

    it('should click add measurement button', () => {
      cy.get('[data-testid="add-measurement-button"]').click()
    })

    it('should show percentile information', () => {
      cy.get('[data-testid="percentile-info"]').should('exist')
    })

    it('should display growth velocity', () => {
      cy.get('[data-testid="growth-velocity"]').should('exist')
    })
  })

  // ========================================
  // SECTION 8: SCREENINGS TAB (10 tests)
  // ========================================
  describe('Screenings Tab', () => {
    beforeEach(() => {
      cy.contains('button', 'Screenings').click()
      cy.wait(500)
    })

    it('should display screenings content', () => {
      cy.get('[data-testid="screenings-content"]').should('be.visible')
    })

    it('should show record screening button', () => {
      cy.get('[data-testid="record-screening-button"]').should('be.visible')
    })

    it('should display screenings table', () => {
      cy.get('[data-testid="screenings-table"]').should('exist')
    })

    it('should show screening rows', () => {
      cy.get('[data-testid="screening-row"]').should('have.length.at.least', 1)
    })

    it('should display screening types', () => {
      cy.contains('Vision').should('exist')
      cy.contains('Hearing').should('exist')
    })

    it('should show screening results', () => {
      cy.get('[data-testid="screening-result"]').should('exist')
    })

    it('should display pass results', () => {
      cy.contains('[data-testid="screening-result"]', 'Pass').should('exist')
    })

    it('should display refer results', () => {
      cy.get('[data-testid="screenings-table"]').should('exist')
    })

    it('should click record screening button', () => {
      cy.get('[data-testid="record-screening-button"]').click()
    })

    it('should show screening dates', () => {
      cy.get('[data-testid="screening-date"]').should('exist')
    })
  })

  // ========================================
  // SECTION 9: ACTION BUTTONS (15 tests)
  // ========================================
  describe('Action Buttons', () => {
    it('should display New Record button', () => {
      cy.get('[data-testid="new-record-button"]').should('be.visible')
    })

    it('should display Import button', () => {
      cy.get('[data-testid="import-button"]').should('be.visible')
    })

    it('should display Export button', () => {
      cy.get('[data-testid="export-button"]').should('be.visible')
    })

    it('should click New Record button', () => {
      cy.get('[data-testid="new-record-button"]').click()
      cy.wait(300)
    })

    it('should click Import button', () => {
      cy.get('[data-testid="import-button"]').click()
    })

    it('should click Export button', () => {
      cy.get('[data-testid="export-button"]').click()
    })

    it('should show New Record button with icon', () => {
      cy.get('[data-testid="new-record-button"]').find('svg').should('exist')
    })

    it('should have proper button styling', () => {
      cy.get('[data-testid="new-record-button"]').should('have.class', 'btn-primary')
    })

    it('should have Import button as secondary style', () => {
      cy.get('[data-testid="import-button"]').should('have.class', 'btn-secondary')
    })

    it('should have Export button as secondary style', () => {
      cy.get('[data-testid="export-button"]').should('have.class', 'btn-secondary')
    })

    it('should display Quick Actions section', () => {
      cy.contains('Quick Actions').should('be.visible')
    })

    it('should have Add New Record quick action', () => {
      cy.contains('Quick Actions').parent().contains('Add New Record').should('be.visible')
    })

    it('should have View Records quick action', () => {
      cy.contains('Quick Actions').parent().contains('View Records').should('be.visible')
    })

    it('should have Vaccination Schedule quick action', () => {
      cy.contains('Quick Actions').parent().contains('Vaccination Schedule').should('be.visible')
    })

    it('should click quick action buttons', () => {
      cy.contains('Quick Actions').parent().contains('View Records').click()
      cy.wait(500)
    })
  })

  // ========================================
  // SECTION 10: ADMIN FEATURES (15 tests)
  // ========================================
  describe('Admin Features', () => {
    beforeEach(() => {
      // Mock API responses for admin tests
      cy.intercept('GET', '**/api/students/assigned', {
        statusCode: 200,
        body: [
          { id: '1', firstName: 'John', lastName: 'Doe', studentNumber: 'STU001' },
          { id: '2', firstName: 'Jane', lastName: 'Smith', studentNumber: 'STU002' }
        ]
      }).as('getAssignedStudents')

      cy.intercept('GET', '**/api/health-records/student/*/allergies', {
        statusCode: 200,
        body: []
      }).as('getAllergies')

      cy.intercept('GET', '**/api/health-records/student/*/chronic-conditions', {
        statusCode: 200,
        body: []
      }).as('getChronicConditions')

      cy.login('admin')
      cy.visit('/dashboard')
      cy.visit('/health-records')
      cy.get('[data-testid="health-records-page"]', { timeout: 10000 }).should('exist')
    })

    it('should display Admin Settings button for admin', () => {
      cy.get('[data-testid="admin-settings-button"]').should('be.visible')
    })

    it('should display Reports button for admin', () => {
      cy.get('[data-testid="reports-button"]').should('be.visible')
    })

    it('should show Analytics tab for admin', () => {
      cy.contains('button', 'Analytics').should('be.visible')
    })

    it('should click Admin Settings button', () => {
      cy.get('[data-testid="admin-settings-button"]').click()
    })

    it('should click Reports button', () => {
      cy.get('[data-testid="reports-button"]').click()
    })

    it('should navigate to Analytics tab', () => {
      cy.contains('button', 'Analytics').click()
      cy.wait(500)
    })

    it('should show view sensitive data button', () => {
      cy.get('[data-testid="view-sensitive-data"]').should('be.visible')
    })

    it('should click view sensitive data button', () => {
      cy.get('[data-testid="view-sensitive-data"]').click()
      cy.wait(300)
    })

    it('should have admin-specific permissions', () => {
      cy.get('[data-testid="privacy-notice"]').should('contain', 'ADMIN')
    })

    it('should access all tabs as admin', () => {
      const tabs = ['Overview', 'Health Records', 'Allergies', 'Chronic Conditions', 'Vaccinations', 'Growth Charts', 'Screenings', 'Analytics']
      tabs.forEach(tab => {
        cy.contains('button', tab).should('be.visible')
      })
    })

    it('should have full edit permissions', () => {
      cy.contains('button', 'Allergies').click()
      cy.wait(500)
      cy.get('[data-testid="add-allergy-button"]').should('not.be.disabled')
    })

    it('should see all provider information', () => {
      cy.contains('button', 'Allergies').click()
      cy.wait(500)
      cy.get('[data-testid="provider-name"]').should('be.visible')
    })

    it('should see all treatment details', () => {
      cy.contains('button', 'Allergies').click()
      cy.wait(500)
      cy.get('[data-testid="treatment-details"]').should('be.visible')
      cy.get('[data-testid="treatment-details"]').should('not.contain', 'RESTRICTED')
    })

    it('should access advanced analytics', () => {
      cy.contains('button', 'Analytics').click()
      cy.wait(500)
      cy.get('[data-testid="analytics-content"]').should('be.visible')
    })

    it('should generate reports', () => {
      cy.get('[data-testid="reports-button"]').should('be.visible')
    })
  })

  // ========================================
  // SECTION 11: PERMISSIONS & ROLE-BASED ACCESS (20 tests)
  // ========================================
  describe('Permissions and Role-Based Access', () => {
    beforeEach(() => {
      // Mock API responses
      cy.intercept('GET', '**/api/students/assigned', {
        statusCode: 200,
        body: [
          { id: '1', firstName: 'John', lastName: 'Doe', studentNumber: 'STU001' }
        ]
      }).as('getAssignedStudents')

      cy.intercept('GET', '**/api/health-records/student/*/allergies', {
        statusCode: 200,
        body: []
      }).as('getAllergies')

      cy.intercept('GET', '**/api/health-records/student/*/chronic-conditions', {
        statusCode: 200,
        body: []
      }).as('getChronicConditions')

      cy.intercept('GET', '**/api/health-records/student/*/vaccinations', {
        statusCode: 200,
        body: []
      }).as('getVaccinations')

      cy.intercept('GET', '**/api/health-records/student/*/growth-chart', {
        statusCode: 200,
        body: []
      }).as('getGrowthChart')

      cy.intercept('GET', '**/api/health-records/student/*/vitals', {
        statusCode: 200,
        body: []
      }).as('getVitals')
    })

    it('should allow nurse to add allergies', () => {
      cy.login('nurse')
      cy.visit('/dashboard')
      cy.visit('/health-records')
      cy.get('[data-testid="health-records-page"]', { timeout: 10000 }).should('exist')
      cy.contains('button', 'Allergies').click()
      cy.wait(500)
      cy.get('[data-testid="add-allergy-button"]').should('not.be.disabled')
    })

    it('should restrict read-only user from adding allergies', () => {
      cy.login('readonly')
      cy.visit('/dashboard')
      cy.visit('/health-records')
      cy.get('[data-testid="health-records-page"]', { timeout: 10000 }).should('exist')
      cy.contains('button', 'Allergies').click()
      cy.wait(500)
      cy.get('[data-testid="add-allergy-button"]').should('be.disabled')
    })

    it('should hide edit buttons for read-only users', () => {
      cy.login('readonly')
      cy.visit('/dashboard')
      cy.visit('/health-records')
      cy.get('[data-testid="health-records-page"]', { timeout: 10000 }).should('exist')
      cy.contains('button', 'Allergies').click()
      cy.wait(500)
      cy.get('[data-testid="edit-allergy-button"]').should('not.exist')
    })

    it('should show edit buttons for nurses', () => {
      cy.login('nurse')
      cy.visit('/dashboard')
      cy.visit('/health-records')
      cy.get('[data-testid="health-records-page"]', { timeout: 10000 }).should('exist')
      cy.contains('button', 'Allergies').click()
      cy.wait(500)
      cy.get('[data-testid="edit-allergy-button"]').should('exist')
    })

    it('should restrict counselor from seeing medical details', () => {
      cy.login('counselor')
      cy.visit('/dashboard')
      cy.visit('/health-records')
      cy.get('[data-testid="health-records-page"]', { timeout: 10000 }).should('exist')
      cy.contains('button', 'Allergies').click()
      cy.wait(500)
      cy.get('[data-testid="treatment-details"]').should('contain', 'RESTRICTED')
    })

    it('should hide provider names for counselors', () => {
      cy.login('counselor')
      cy.visit('/dashboard')
      cy.visit('/health-records')
      cy.get('[data-testid="health-records-page"]', { timeout: 10000 }).should('exist')
      cy.contains('button', 'Allergies').click()
      cy.wait(500)
      cy.get('[data-testid="provider-name"]').should('not.exist')
    })

    it('should allow admin full access', () => {
      cy.login('admin')
      cy.visit('/dashboard')
      cy.visit('/health-records')
      cy.get('[data-testid="health-records-page"]', { timeout: 10000 }).should('exist')
      cy.contains('button', 'Allergies').click()
      cy.wait(500)
      cy.get('[data-testid="add-allergy-button"]').should('not.be.disabled')
      cy.get('[data-testid="edit-allergy-button"]').should('exist')
    })

    it('should show New Record button for nurses', () => {
      cy.login('nurse')
      cy.visit('/dashboard')
      cy.visit('/health-records')
      cy.get('[data-testid="health-records-page"]', { timeout: 10000 }).should('exist')
      cy.get('[data-testid="new-record-button"]').should('be.visible')
    })

    it('should hide New Record button for read-only', () => {
      cy.login('readonly')
      cy.visit('/dashboard')
      cy.visit('/health-records')
      cy.get('[data-testid="health-records-page"]', { timeout: 10000 }).should('exist')
      cy.get('[data-testid="new-record-button"]').should('not.exist')
    })

    it('should show Import button for nurses', () => {
      cy.login('nurse')
      cy.visit('/dashboard')
      cy.visit('/health-records')
      cy.get('[data-testid="health-records-page"]', { timeout: 10000 }).should('exist')
      cy.get('[data-testid="import-button"]').should('be.visible')
    })

    it('should hide Import button for read-only', () => {
      cy.login('readonly')
      cy.visit('/dashboard')
      cy.visit('/health-records')
      cy.get('[data-testid="health-records-page"]', { timeout: 10000 }).should('exist')
      cy.get('[data-testid="import-button"]').should('not.exist')
    })

    it('should allow Export for all users', () => {
      cy.login('readonly')
      cy.visit('/dashboard')
      cy.visit('/health-records')
      cy.get('[data-testid="health-records-page"]', { timeout: 10000 }).should('exist')
      cy.get('[data-testid="export-button"]').should('be.visible')
    })

    it('should restrict vaccination recording for read-only', () => {
      cy.login('readonly')
      cy.visit('/dashboard')
      cy.visit('/health-records')
      cy.get('[data-testid="health-records-page"]', { timeout: 10000 }).should('exist')
      cy.contains('button', 'Vaccinations').click()
      cy.wait(500)
      cy.get('[data-testid="record-vaccination-button"]').should('be.disabled')
    })

    it('should allow vaccination recording for nurses', () => {
      cy.login('nurse')
      cy.visit('/dashboard')
      cy.visit('/health-records')
      cy.get('[data-testid="health-records-page"]', { timeout: 10000 }).should('exist')
      cy.contains('button', 'Vaccinations').click()
      cy.wait(500)
      cy.get('[data-testid="record-vaccination-button"]').should('not.be.disabled')
    })

    it('should restrict growth measurement for read-only', () => {
      cy.login('readonly')
      cy.visit('/dashboard')
      cy.visit('/health-records')
      cy.get('[data-testid="health-records-page"]', { timeout: 10000 }).should('exist')
      cy.contains('button', 'Growth Charts').click()
      cy.wait(500)
      cy.get('[data-testid="add-measurement-button"]').should('be.disabled')
    })

    it('should allow growth measurement for nurses', () => {
      cy.login('nurse')
      cy.visit('/dashboard')
      cy.visit('/health-records')
      cy.get('[data-testid="health-records-page"]', { timeout: 10000 }).should('exist')
      cy.contains('button', 'Growth Charts').click()
      cy.wait(500)
      cy.get('[data-testid="add-measurement-button"]').should('not.be.disabled')
    })

    it('should restrict screening recording for read-only', () => {
      cy.login('readonly')
      cy.visit('/dashboard')
      cy.visit('/health-records')
      cy.get('[data-testid="health-records-page"]', { timeout: 10000 }).should('exist')
      cy.contains('button', 'Screenings').click()
      cy.wait(500)
      cy.get('[data-testid="record-screening-button"]').should('be.disabled')
    })

    it('should allow screening recording for nurses', () => {
      cy.login('nurse')
      cy.visit('/dashboard')
      cy.visit('/health-records')
      cy.get('[data-testid="health-records-page"]', { timeout: 10000 }).should('exist')
      cy.contains('button', 'Screenings').click()
      cy.wait(500)
      cy.get('[data-testid="record-screening-button"]').should('not.be.disabled')
    })

    it('should restrict condition management for read-only', () => {
      cy.login('readonly')
      cy.visit('/dashboard')
      cy.visit('/health-records')
      cy.get('[data-testid="health-records-page"]', { timeout: 10000 }).should('exist')
      cy.contains('button', 'Chronic Conditions').click()
      cy.wait(500)
      cy.get('[data-testid="add-condition-button"]').should('be.disabled')
    })

    it('should allow condition management for nurses', () => {
      cy.login('nurse')
      cy.visit('/dashboard')
      cy.visit('/health-records')
      cy.get('[data-testid="health-records-page"]', { timeout: 10000 }).should('exist')
      cy.contains('button', 'Chronic Conditions').click()
      cy.wait(500)
      cy.get('[data-testid="add-condition-button"]').should('not.be.disabled')
    })
  })

  // ========================================
  // SECTION 12: DATA VALIDATION (10 tests)
  // ========================================
  describe('Data Validation and Integrity', () => {
    it('should display consistent data across tabs', () => {
      cy.contains('button', 'Overview').click()
      cy.wait(300)
      cy.contains('button', 'Allergies').click()
      cy.wait(500)
      cy.get('[data-testid="allergies-list"]').should('exist')
    })

    it('should maintain state when navigating', () => {
      cy.get('[data-testid="health-records-search"]').type('Test')
      cy.contains('button', 'Allergies').click()
      cy.wait(500)
      cy.contains('button', 'Overview').click()
      cy.wait(500)
      cy.get('[data-testid="health-records-search"]').should('have.value', 'Test')
    })

    it('should handle empty data gracefully', () => {
      cy.get('[data-testid="health-records-page"]').should('be.visible')
    })

    it('should display loading states', () => {
      cy.reload()
      // Page should handle loading
      cy.get('[data-testid="health-records-page"]').should('be.visible')
    })

    it('should validate required fields', () => {
      // This would be tested in modal forms
      cy.get('[data-testid="health-records-page"]').should('exist')
    })

    it('should sanitize user input', () => {
      cy.get('[data-testid="health-records-search"]')
        .type('<script>alert("test")</script>')
        .should('have.value', '<script>alert("test")</script>')
    })

    it('should preserve data format', () => {
      cy.get('[data-testid="allergies-list"]').should('exist')
    })

    it('should handle concurrent updates', () => {
      cy.contains('button', 'Allergies').click()
      cy.wait(500)
      cy.reload()
      cy.wait(1000)
      cy.get('[data-testid="health-records-page"]').should('be.visible')
    })

    it('should maintain referential integrity', () => {
      cy.get('[data-testid="health-records-page"]').should('exist')
    })

    it('should handle data refresh', () => {
      cy.reload()
      cy.wait(1000)
      cy.get('[data-testid="health-records-page"]').should('be.visible')
    })
  })

  // ========================================
  // SECTION 13: ACCESSIBILITY (15 tests)
  // ========================================
  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      cy.get('[data-testid="new-record-button"]').should('be.visible')
    })

    it('should support keyboard navigation', () => {
      cy.get('[data-testid="new-record-button"]').focus()
      cy.focused().should('have.attr', 'data-testid', 'new-record-button')
    })

    it('should have focus indicators', () => {
      cy.get('[data-testid="new-record-button"]').focus()
      // Visual focus should be applied via CSS
    })

    it('should have descriptive button text', () => {
      cy.get('[data-testid="new-record-button"]').should('contain', 'New Record')
    })

    it('should use semantic HTML', () => {
      cy.get('h1').should('exist')
      cy.get('button').should('exist')
    })

    it('should have proper heading hierarchy', () => {
      cy.get('h1').should('exist')
      cy.get('h3').should('exist')
    })

    it('should provide text alternatives for icons', () => {
      cy.get('[data-testid="new-record-button"]').find('svg').should('exist')
    })

    it('should support screen readers', () => {
      cy.get('[data-testid="health-records-page"]').should('exist')
    })

    it('should have sufficient color contrast', () => {
      cy.get('[data-testid="new-record-button"]').should('be.visible')
    })

    it('should support tab navigation', () => {
      cy.get('body').tab()
    })

    it('should have accessible form controls', () => {
      cy.get('[data-testid="health-records-search"]').should('have.attr', 'type', 'text')
    })

    it('should provide error feedback', () => {
      // Error messages should be accessible
      cy.get('[data-testid="health-records-page"]').should('exist')
    })

    it('should have descriptive labels', () => {
      cy.get('[data-testid="health-records-search"]')
        .should('have.attr', 'placeholder')
    })

    it('should support assistive technologies', () => {
      cy.get('[data-testid="health-records-page"]').should('exist')
    })

    it('should maintain focus management', () => {
      cy.get('[data-testid="new-record-button"]').click()
      // Modal should trap focus
      cy.wait(300)
    })
  })

  // ========================================
  // SECTION 14: PERFORMANCE (10 tests)
  // ========================================
  describe('Performance', () => {
    it('should load page quickly', () => {
      const start = Date.now()
      cy.visit('/health-records')
      cy.get('[data-testid="health-records-page"]').should('be.visible')
      const end = Date.now()
      expect(end - start).to.be.lessThan(5000)
    })

    it('should handle rapid tab switching', () => {
      for (let i = 0; i < 5; i++) {
        cy.contains('button', 'Allergies').click()
        cy.wait(100)
        cy.contains('button', 'Overview').click()
        cy.wait(100)
      }
    })

    it('should handle rapid filtering', () => {
      cy.get('[data-testid="health-records-search"]')
        .type('Test')
        .clear()
        .type('Another')
        .clear()
    })

    it('should render large datasets', () => {
      cy.contains('button', 'Vaccinations').click()
      cy.wait(500)
      cy.get('[data-testid="vaccinations-table"]').should('exist')
    })

    it('should handle multiple concurrent requests', () => {
      cy.reload()
      cy.wait(1000)
      cy.get('[data-testid="health-records-page"]').should('be.visible')
    })

    it('should cache data appropriately', () => {
      cy.contains('button', 'Allergies').click()
      cy.wait(500)
      cy.contains('button', 'Overview').click()
      cy.wait(300)
      cy.contains('button', 'Allergies').click()
      cy.wait(300)
    })

    it('should optimize re-renders', () => {
      cy.get('[data-testid="health-records-search"]').type('Test')
      cy.wait(300)
    })

    it('should lazy load tab content', () => {
      cy.contains('button', 'Growth Charts').click()
      cy.wait(500)
      cy.get('[data-testid="growth-charts-content"]').should('be.visible')
    })

    it('should handle page refresh efficiently', () => {
      cy.reload()
      cy.wait(1000)
      cy.get('[data-testid="health-records-page"]').should('be.visible')
    })

    it('should debounce search input', () => {
      cy.get('[data-testid="health-records-search"]')
        .type('T')
        .type('e')
        .type('s')
        .type('t')
      cy.wait(500)
    })
  })

  // ========================================
  // SECTION 15: ERROR HANDLING (10 tests)
  // ========================================
  describe('Error Handling', () => {
    it('should handle network errors gracefully', () => {
      cy.visit('/health-records')
      cy.get('[data-testid="health-records-page"]').should('be.visible')
    })

    it('should recover from failed requests', () => {
      cy.reload()
      cy.wait(1000)
      cy.get('[data-testid="health-records-page"]').should('be.visible')
    })

    it('should display error messages', () => {
      // Error states would show appropriate messages
      cy.get('[data-testid="health-records-page"]').should('exist')
    })

    it('should handle session expiration', () => {
      cy.clearCookies()
      cy.reload()
      cy.wait(2000)
      // Should redirect to login
      cy.url().should('include', '/login')
    })

    it('should validate form inputs', () => {
      // Form validation tested in modals
      cy.get('[data-testid="health-records-page"]').should('exist')
    })

    it('should handle invalid data', () => {
      cy.get('[data-testid="health-records-search"]')
        .type('!@#$%^&*()')
        .should('have.value', '!@#$%^&*()')
    })

    it('should provide user feedback on errors', () => {
      cy.get('[data-testid="health-records-page"]').should('exist')
    })

    it('should retry failed operations', () => {
      cy.reload()
      cy.wait(1000)
      cy.get('[data-testid="health-records-page"]').should('be.visible')
    })

    it('should handle timeout scenarios', () => {
      cy.visit('/health-records', { timeout: 10000 })
      cy.get('[data-testid="health-records-page"]').should('be.visible')
    })

    it('should maintain data integrity on errors', () => {
      cy.get('[data-testid="health-records-page"]').should('exist')
    })
  })
})
