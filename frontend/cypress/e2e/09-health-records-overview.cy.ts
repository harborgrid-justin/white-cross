/// <reference types="cypress" />

describe('Health Records Portal - Overview Tab', () => {
  beforeEach(() => {
    cy.clearCookies()
    cy.clearLocalStorage()
    cy.loginAsNurse()
    cy.visit('/health-records')
    cy.intercept('GET', '**/api/health-records/**', { fixture: 'healthRecords.json' }).as('getHealthRecords')
    cy.intercept('GET', '**/api/health-records/allergies/**', { fixture: 'allergies.json' }).as('getAllergies')
    cy.intercept('GET', '**/api/health-records/chronic-conditions/**', { fixture: 'chronicConditions.json' }).as('getChronicConditions')
    cy.intercept('GET', '**/api/health-records/vaccinations/**', { fixture: 'vaccinations.json' }).as('getVaccinations')
    cy.intercept('GET', '**/api/health-records/growth/**', { fixture: 'growthData.json' }).as('getGrowthData')
    cy.intercept('GET', '**/api/health-records/vitals/**', { fixture: 'vitals.json' }).as('getVitals')
  })

  // Tests 1-10: Basic Page Rendering and Navigation
  it('1. should load health records page successfully', () => {
    cy.get('[data-testid="health-records-page"]').should('be.visible')
    cy.get('h1').should('contain.text', 'Health Records Management')
    cy.get('p').should('contain.text', 'Comprehensive electronic health records system')
  })

  it('2. should display main navigation tabs', () => {
    cy.get('[data-testid="tab-overview"]').should('be.visible').and('contain.text', 'Overview')
    cy.get('[data-testid="tab-records"]').should('be.visible').and('contain.text', 'Health Records')
    cy.get('[data-testid="tab-allergies"]').should('be.visible').and('contain.text', 'Allergies')
    cy.get('[data-testid="tab-chronic"]').should('be.visible').and('contain.text', 'Chronic Conditions')
    cy.get('[data-testid="tab-vaccinations"]').should('be.visible').and('contain.text', 'Vaccinations')
    cy.get('[data-testid="tab-growth"]').should('be.visible').and('contain.text', 'Growth Charts')
    cy.get('[data-testid="tab-screenings"]').should('be.visible').and('contain.text', 'Screenings')
  })

  it('3. should display action buttons in header', () => {
    cy.get('[data-testid="import-button"]').should('be.visible').and('contain.text', 'Import')
    cy.get('[data-testid="export-button"]').should('be.visible').and('contain.text', 'Export')
    cy.get('[data-testid="new-record-button"]').should('be.visible').and('contain.text', 'New Record')
  })

  it('4. should display statistics cards with correct data', () => {
    cy.get('[data-testid="stats-total-records"]').should('be.visible')
    cy.get('[data-testid="stats-total-records"]').within(() => {
      cy.get('[data-testid="stat-label"]').should('contain.text', 'Total Records')
      cy.get('[data-testid="stat-value"]').should('be.visible')
    })
    
    cy.get('[data-testid="stats-active-allergies"]').should('be.visible')
    cy.get('[data-testid="stats-chronic-conditions"]').should('be.visible')
    cy.get('[data-testid="stats-vaccinations-due"]').should('be.visible')
  })

  it('5. should display overview tab content by default', () => {
    cy.get('[data-testid="tab-overview"]').should('have.class', 'border-blue-600')
    cy.get('[data-testid="overview-content"]').should('be.visible')
    cy.get('h3').should('contain.text', 'Electronic Health Records (EHR)')
    cy.get('h3').should('contain.text', 'Vaccination Tracking')
    cy.get('h3').should('contain.text', 'Allergy Management')
    cy.get('h3').should('contain.text', 'Chronic Conditions')
  })

  it('6. should display feature descriptions correctly', () => {
    cy.get('[data-testid="overview-content"]').within(() => {
      cy.contains('Complete digital health record system with comprehensive medical history')
      cy.contains('Complete immunization records with compliance monitoring')
      cy.contains('Comprehensive allergy tracking with severity levels')
      cy.contains('Chronic condition monitoring with care plans')
    })
  })

  it('7. should display import/export section in overview', () => {
    cy.get('[data-testid="import-export-section"]').should('be.visible')
    cy.get('h3').should('contain.text', 'Import/Export Capabilities')
    cy.get('[data-testid="overview-import-button"]').should('contain.text', 'Import Health History (JSON/CSV)')
    cy.get('[data-testid="overview-export-button"]').should('contain.text', 'Export Health Records')
  })

  it('8. should have proper responsive layout', () => {
    cy.viewport('iphone-6')
    cy.get('[data-testid="health-records-page"]').should('be.visible')
    cy.get('[data-testid="stats-cards"]').should('be.visible')
    
    cy.viewport('macbook-13')
    cy.get('[data-testid="stats-cards"]').should('have.class', 'md:grid-cols-2')
    
    cy.viewport('macbook-15')
    cy.get('[data-testid="stats-cards"]').should('have.class', 'lg:grid-cols-4')
  })

  it('9. should display proper icons for each feature section', () => {
    cy.get('[data-testid="overview-content"]').within(() => {
      cy.get('[data-testid="ehr-icon"]').should('be.visible')
      cy.get('[data-testid="vaccination-icon"]').should('be.visible')
      cy.get('[data-testid="allergy-icon"]').should('be.visible')
      cy.get('[data-testid="chronic-icon"]').should('be.visible')
    })
  })

  it('10. should handle click events on action buttons', () => {
    cy.get('[data-testid="import-button"]').click()
    cy.get('[data-testid="export-button"]').click()
    cy.get('[data-testid="new-record-button"]').click()
    // Should not cause page errors
    cy.get('[data-testid="health-records-page"]').should('be.visible')
  })

  // Tests 11-20: Tab Navigation Functionality
  it('11. should switch to health records tab correctly', () => {
    cy.get('[data-testid="tab-records"]').click()
    cy.get('[data-testid="tab-records"]').should('have.class', 'border-blue-600')
    cy.get('[data-testid="records-content"]').should('be.visible')
    cy.get('[data-testid="search-records-input"]').should('be.visible')
  })

  it('12. should switch to allergies tab correctly', () => {
    cy.get('[data-testid="tab-allergies"]').click()
    cy.get('[data-testid="tab-allergies"]').should('have.class', 'border-blue-600')
    cy.get('[data-testid="allergies-content"]').should('be.visible')
    cy.get('h3').should('contain.text', 'Student Allergies')
    cy.get('[data-testid="add-allergy-button"]').should('be.visible')
  })

  it('13. should switch to chronic conditions tab correctly', () => {
    cy.get('[data-testid="tab-chronic"]').click()
    cy.get('[data-testid="tab-chronic"]').should('have.class', 'border-blue-600')
    cy.get('[data-testid="chronic-content"]').should('be.visible')
    cy.get('[data-testid="add-condition-button"]').should('be.visible')
  })

  it('14. should switch to vaccinations tab correctly', () => {
    cy.get('[data-testid="tab-vaccinations"]').click()
    cy.get('[data-testid="tab-vaccinations"]').should('have.class', 'border-blue-600')
    cy.get('[data-testid="vaccinations-content"]').should('be.visible')
    cy.get('h3').should('contain.text', 'Vaccination Records')
    cy.get('[data-testid="record-vaccination-button"]').should('be.visible')
  })

  it('15. should switch to growth charts tab correctly', () => {
    cy.get('[data-testid="tab-growth"]').click()
    cy.get('[data-testid="tab-growth"]').should('have.class', 'border-blue-600')
    cy.get('[data-testid="growth-content"]').should('be.visible')
    cy.get('h3').should('contain.text', 'Growth Chart Analysis')
  })

  it('16. should switch to screenings tab correctly', () => {
    cy.get('[data-testid="tab-screenings"]').click()
    cy.get('[data-testid="tab-screenings"]').should('have.class', 'border-blue-600')
    cy.get('[data-testid="screenings-content"]').should('be.visible')
    cy.get('h3').should('contain.text', 'Vision & Hearing Screenings')
    cy.get('[data-testid="schedule-screening-button"]').should('be.visible')
  })

  it('17. should maintain tab state when switching back and forth', () => {
    cy.get('[data-testid="tab-allergies"]').click()
    cy.get('[data-testid="allergies-content"]').should('be.visible')
    
    cy.get('[data-testid="tab-overview"]').click()
    cy.get('[data-testid="overview-content"]').should('be.visible')
    
    cy.get('[data-testid="tab-allergies"]').click()
    cy.get('[data-testid="allergies-content"]').should('be.visible')
  })

  it('18. should highlight only active tab', () => {
    cy.get('[data-testid="tab-overview"]').should('have.class', 'border-blue-600')
    
    cy.get('[data-testid="tab-records"]').click()
    cy.get('[data-testid="tab-records"]').should('have.class', 'border-blue-600')
    cy.get('[data-testid="tab-overview"]').should('have.class', 'border-transparent')
  })

  it('19. should display proper content for each tab', () => {
    const tabs = [
      { id: 'tab-records', content: 'records-content' },
      { id: 'tab-allergies', content: 'allergies-content' },
      { id: 'tab-chronic', content: 'chronic-content' },
      { id: 'tab-vaccinations', content: 'vaccinations-content' },
      { id: 'tab-growth', content: 'growth-content' },
      { id: 'tab-screenings', content: 'screenings-content' }
    ]
    
    tabs.forEach(tab => {
      cy.get(`[data-testid="${tab.id}"]`).click()
      cy.get(`[data-testid="${tab.content}"]`).should('be.visible')
    })
  })

  it('20. should handle tab clicks without JavaScript errors', () => {
    cy.window().then((win) => {
      cy.stub(win.console, 'error').as('consoleError')
    })
    
    cy.get('[data-testid="tab-records"]').click()
    cy.get('[data-testid="tab-allergies"]').click()
    cy.get('[data-testid="tab-chronic"]').click()
    cy.get('[data-testid="tab-vaccinations"]').click()
    cy.get('[data-testid="tab-growth"]').click()
    cy.get('[data-testid="tab-screenings"]').click()
    
    cy.get('@consoleError').should('not.have.been.called')
  })

  // Tests 21-30: Health Records Tab Functionality
  it('21. should display search and filter controls in records tab', () => {
    cy.get('[data-testid="tab-records"]').click()
    cy.get('[data-testid="search-records-input"]').should('be.visible')
    cy.get('[data-testid="filter-button"]').should('be.visible')
    cy.get('[data-testid="search-records-input"]').should('have.attr', 'placeholder', 'Search health records...')
  })

  it('22. should display health records list', () => {
    cy.get('[data-testid="tab-records"]').click()
    cy.wait('@getHealthRecords')
    cy.get('[data-testid="health-records-list"]').should('be.visible')
    cy.get('[data-testid="health-record-item"]').should('have.length.greaterThan', 0)
  })

  it('23. should display health record information correctly', () => {
    cy.get('[data-testid="tab-records"]').click()
    cy.wait('@getHealthRecords')
    cy.get('[data-testid="health-record-item"]').first().within(() => {
      cy.get('[data-testid="record-title"]').should('be.visible')
      cy.get('[data-testid="record-provider"]').should('be.visible')
      cy.get('[data-testid="record-date"]').should('be.visible')
      cy.get('[data-testid="record-description"]').should('be.visible')
      cy.get('[data-testid="view-details-button"]').should('be.visible')
    })
  })

  it('24. should handle search input in health records', () => {
    cy.get('[data-testid="tab-records"]').click()
    cy.get('[data-testid="search-records-input"]').type('physical exam')
    cy.get('[data-testid="search-records-input"]').should('have.value', 'physical exam')
  })

  it('25. should filter records based on search query', () => {
    cy.get('[data-testid="tab-records"]').click()
    cy.intercept('GET', '**/api/health-records/**?*search=physical*', { 
      fixture: 'healthRecordsFiltered.json' 
    }).as('getFilteredRecords')
    
    cy.get('[data-testid="search-records-input"]').type('physical')
    cy.wait('@getFilteredRecords')
    cy.get('[data-testid="health-record-item"]').should('have.length.lessThan', 10)
  })

  it('26. should open record details when clicking view details', () => {
    cy.get('[data-testid="tab-records"]').click()
    cy.wait('@getHealthRecords')
    cy.get('[data-testid="health-record-item"]').first().within(() => {
      cy.get('[data-testid="view-details-button"]').click()
    })
    cy.get('[data-testid="record-details-modal"]').should('be.visible')
  })

  it('27. should display proper icons for different record types', () => {
    cy.get('[data-testid="tab-records"]').click()
    cy.wait('@getHealthRecords')
    cy.get('[data-testid="health-record-item"]').each(($item) => {
      cy.wrap($item).find('[data-testid="record-type-icon"]').should('be.visible')
    })
  })

  it('28. should show hover effects on record items', () => {
    cy.get('[data-testid="tab-records"]').click()
    cy.wait('@getHealthRecords')
    cy.get('[data-testid="health-record-item"]').first().should('have.class', 'hover:bg-gray-50')
  })

  it('29. should handle empty search results', () => {
    cy.get('[data-testid="tab-records"]').click()
    cy.intercept('GET', '**/api/health-records/**?*search=nonexistent*', { 
      body: { success: true, data: { records: [], pagination: { total: 0 } } }
    }).as('getEmptyResults')
    
    cy.get('[data-testid="search-records-input"]').type('nonexistent')
    cy.wait('@getEmptyResults')
    cy.get('[data-testid="no-records-message"]').should('be.visible')
  })

  it('30. should clear search and show all records', () => {
    cy.get('[data-testid="tab-records"]').click()
    cy.get('[data-testid="search-records-input"]').type('search term')
    cy.get('[data-testid="search-records-input"]').clear()
    cy.wait('@getHealthRecords')
    cy.get('[data-testid="health-record-item"]').should('have.length.greaterThan', 0)
  })

  // Tests 31-40: Allergies Tab Functionality
  it('31. should display allergies list in allergies tab', () => {
    cy.get('[data-testid="tab-allergies"]').click()
    cy.wait('@getAllergies')
    cy.get('[data-testid="allergies-list"]').should('be.visible')
    cy.get('[data-testid="allergy-item"]').should('have.length.greaterThan', 0)
  })

  it('32. should display allergy information correctly', () => {
    cy.get('[data-testid="tab-allergies"]').click()
    cy.wait('@getAllergies')
    cy.get('[data-testid="allergy-item"]').first().within(() => {
      cy.get('[data-testid="allergen-name"]').should('be.visible')
      cy.get('[data-testid="severity-badge"]').should('be.visible')
      cy.get('[data-testid="verification-status"]').should('be.visible')
      cy.get('[data-testid="edit-allergy-button"]').should('be.visible')
    })
  })

  it('33. should display severity badges with correct colors', () => {
    cy.get('[data-testid="tab-allergies"]').click()
    cy.wait('@getAllergies')
    cy.get('[data-testid="severity-badge"]').each(($badge) => {
      const text = $badge.text()
      if (text === 'LIFE_THREATENING') {
        cy.wrap($badge).should('have.class', 'bg-red-100')
      } else if (text === 'SEVERE') {
        cy.wrap($badge).should('have.class', 'bg-orange-100')
      } else if (text === 'MODERATE') {
        cy.wrap($badge).should('have.class', 'bg-yellow-100')
      } else if (text === 'MILD') {
        cy.wrap($badge).should('have.class', 'bg-green-100')
      }
    })
  })

  it('34. should show verification status correctly', () => {
    cy.get('[data-testid="tab-allergies"]').click()
    cy.wait('@getAllergies')
    cy.get('[data-testid="allergy-item"]').each(($item) => {
      cy.wrap($item).find('[data-testid="verification-status"]').should('be.visible')
      cy.wrap($item).find('[data-testid="verification-status"]').should('contain.text', /Verified|Unverified/)
    })
  })

  it('35. should open add allergy modal when clicking add button', () => {
    cy.get('[data-testid="tab-allergies"]').click()
    cy.get('[data-testid="add-allergy-button"]').click()
    cy.get('[data-testid="add-allergy-modal"]').should('be.visible')
    cy.get('[data-testid="modal-title"]').should('contain.text', 'Add New Allergy')
  })

  it('36. should display allergy form fields in modal', () => {
    cy.get('[data-testid="tab-allergies"]').click()
    cy.get('[data-testid="add-allergy-button"]').click()
    cy.get('[data-testid="add-allergy-modal"]').within(() => {
      cy.get('[data-testid="allergen-input"]').should('be.visible')
      cy.get('[data-testid="severity-select"]').should('be.visible')
      cy.get('[data-testid="reaction-input"]').should('be.visible')
      cy.get('[data-testid="treatment-input"]').should('be.visible')
      cy.get('[data-testid="save-allergy-button"]').should('be.visible')
      cy.get('[data-testid="cancel-button"]').should('be.visible')
    })
  })

  it('37. should validate required fields in allergy form', () => {
    cy.get('[data-testid="tab-allergies"]').click()
    cy.get('[data-testid="add-allergy-button"]').click()
    cy.get('[data-testid="add-allergy-modal"]').within(() => {
      cy.get('[data-testid="save-allergy-button"]').click()
      cy.get('[data-testid="allergen-error"]').should('contain.text', 'Allergen is required')
      cy.get('[data-testid="severity-error"]').should('contain.text', 'Severity is required')
    })
  })

  it('38. should successfully add new allergy', () => {
    cy.intercept('POST', '**/api/health-records/allergies', {
      statusCode: 201,
      body: { success: true, data: { allergy: { id: 'new-1', allergen: 'Shellfish' } }}
    }).as('createAllergy')
    
    cy.get('[data-testid="tab-allergies"]').click()
    cy.get('[data-testid="add-allergy-button"]').click()
    cy.get('[data-testid="add-allergy-modal"]').within(() => {
      cy.get('[data-testid="allergen-input"]').type('Shellfish')
      cy.get('[data-testid="severity-select"]').select('SEVERE')
      cy.get('[data-testid="reaction-input"]').type('Hives and swelling')
      cy.get('[data-testid="save-allergy-button"]').click()
    })
    
    cy.wait('@createAllergy')
    cy.get('[data-testid="success-message"]').should('be.visible')
    cy.get('[data-testid="add-allergy-modal"]').should('not.exist')
  })

  it('39. should edit existing allergy', () => {
    cy.get('[data-testid="tab-allergies"]').click()
    cy.wait('@getAllergies')
    cy.get('[data-testid="allergy-item"]').first().within(() => {
      cy.get('[data-testid="edit-allergy-button"]').click()
    })
    cy.get('[data-testid="edit-allergy-modal"]').should('be.visible')
  })

  it('40. should close modal when clicking cancel', () => {
    cy.get('[data-testid="tab-allergies"]').click()
    cy.get('[data-testid="add-allergy-button"]').click()
    cy.get('[data-testid="add-allergy-modal"]').within(() => {
      cy.get('[data-testid="cancel-button"]').click()
    })
    cy.get('[data-testid="add-allergy-modal"]').should('not.exist')
  })

  // Tests 41-50: Chronic Conditions Tab Functionality
  it('41. should display chronic conditions list', () => {
    cy.get('[data-testid="tab-chronic"]').click()
    cy.wait('@getChronicConditions')
    cy.get('[data-testid="chronic-conditions-list"]').should('be.visible')
    cy.get('[data-testid="condition-item"]').should('have.length.greaterThan', 0)
  })

  it('42. should display condition information correctly', () => {
    cy.get('[data-testid="tab-chronic"]').click()
    cy.wait('@getChronicConditions')
    cy.get('[data-testid="condition-item"]').first().within(() => {
      cy.get('[data-testid="condition-name"]').should('be.visible')
      cy.get('[data-testid="condition-status"]').should('be.visible')
      cy.get('[data-testid="condition-severity"]').should('be.visible')
      cy.get('[data-testid="view-care-plan-button"]').should('be.visible')
    })
  })

  it('43. should display status badges with correct colors', () => {
    cy.get('[data-testid="tab-chronic"]').click()
    cy.wait('@getChronicConditions')
    cy.get('[data-testid="condition-status"]').each(($status) => {
      const text = $status.text()
      if (text === 'ACTIVE') {
        cy.wrap($status).should('have.class', 'bg-green-100')
      } else if (text === 'MANAGED') {
        cy.wrap($status).should('have.class', 'bg-blue-100')
      } else if (text === 'RESOLVED') {
        cy.wrap($status).should('have.class', 'bg-gray-100')
      }
    })
  })

  it('44. should display severity with proper styling', () => {
    cy.get('[data-testid="tab-chronic"]').click()
    cy.wait('@getChronicConditions')
    cy.get('[data-testid="condition-severity"]').each(($severity) => {
      const text = $severity.text()
      if (text === 'SEVERE') {
        cy.wrap($severity).should('have.class', 'bg-red-100')
      } else if (text === 'MODERATE') {
        cy.wrap($severity).should('have.class', 'bg-yellow-100')
      } else if (text === 'MILD') {
        cy.wrap($severity).should('have.class', 'bg-green-100')
      }
    })
  })

  it('45. should open care plan when clicking view care plan', () => {
    cy.get('[data-testid="tab-chronic"]').click()
    cy.wait('@getChronicConditions')
    cy.get('[data-testid="condition-item"]').first().within(() => {
      cy.get('[data-testid="view-care-plan-button"]').click()
    })
    cy.get('[data-testid="care-plan-modal"]').should('be.visible')
  })

  it('46. should open add condition modal', () => {
    cy.get('[data-testid="tab-chronic"]').click()
    cy.get('[data-testid="add-condition-button"]').click()
    cy.get('[data-testid="add-condition-modal"]').should('be.visible')
    cy.get('[data-testid="modal-title"]').should('contain.text', 'Add Chronic Condition')
  })

  it('47. should display condition form fields', () => {
    cy.get('[data-testid="tab-chronic"]').click()
    cy.get('[data-testid="add-condition-button"]').click()
    cy.get('[data-testid="add-condition-modal"]').within(() => {
      cy.get('[data-testid="condition-input"]').should('be.visible')
      cy.get('[data-testid="diagnosed-date-input"]').should('be.visible')
      cy.get('[data-testid="status-select"]').should('be.visible')
      cy.get('[data-testid="severity-select"]').should('be.visible')
      cy.get('[data-testid="care-plan-textarea"]').should('be.visible')
      cy.get('[data-testid="save-condition-button"]').should('be.visible')
    })
  })

  it('48. should validate condition form fields', () => {
    cy.get('[data-testid="tab-chronic"]').click()
    cy.get('[data-testid="add-condition-button"]').click()
    cy.get('[data-testid="add-condition-modal"]').within(() => {
      cy.get('[data-testid="save-condition-button"]').click()
      cy.get('[data-testid="condition-error"]').should('contain.text', 'Condition name is required')
      cy.get('[data-testid="diagnosed-date-error"]').should('contain.text', 'Diagnosed date is required')
    })
  })

  it('49. should successfully add new chronic condition', () => {
    cy.intercept('POST', '**/api/health-records/chronic-conditions', {
      statusCode: 201,
      body: { success: true, data: { condition: { id: 'new-1', condition: 'Diabetes Type 1' } }}
    }).as('createCondition')
    
    cy.get('[data-testid="tab-chronic"]').click()
    cy.get('[data-testid="add-condition-button"]').click()
    cy.get('[data-testid="add-condition-modal"]').within(() => {
      cy.get('[data-testid="condition-input"]').type('Diabetes Type 1')
      cy.get('[data-testid="diagnosed-date-input"]').type('2024-01-15')
      cy.get('[data-testid="status-select"]').select('ACTIVE')
      cy.get('[data-testid="severity-select"]').select('SEVERE')
      cy.get('[data-testid="care-plan-textarea"]').type('Daily insulin monitoring required')
      cy.get('[data-testid="save-condition-button"]').click()
    })
    
    cy.wait('@createCondition')
    cy.get('[data-testid="success-message"]').should('be.visible')
    cy.get('[data-testid="add-condition-modal"]').should('not.exist')
  })

  it('50. should display condition icons correctly', () => {
    cy.get('[data-testid="tab-chronic"]').click()
    cy.wait('@getChronicConditions')
    cy.get('[data-testid="condition-item"]').each(($item) => {
      cy.wrap($item).find('[data-testid="condition-icon"]').should('be.visible')
    })
  })
})
