// Medications Management - Medications Tab (Tests 21-40)
describe('Medications - Medications Tab', () => {
  beforeEach(() => {
    cy.loginAsNurse()
    cy.interceptMedicationAPI()
    cy.visit('/medications')
    cy.get('[data-testid="medications-tab"]').click()
  })

  // Test 21: Display medications tab
  it('should display the medications tab correctly', () => {
    cy.get('[data-testid="medications-tab"]').should('have.class', 'border-blue-500')
    cy.get('[data-testid="medications-search"]').should('be.visible')
    cy.get('[data-testid="add-medication-button"]').should('be.visible')
    cy.get('[data-testid="add-medication-button"]').should('contain.text', 'Add Medication')
  })

  // Test 22: Search medications functionality
  it('should search medications by name', () => {
    cy.get('[data-testid="medications-search"]').type('aspirin')
    cy.get('[data-testid="medications-table"]').should('be.visible')
    cy.get('[data-testid="medication-row"]').should('contain.text', 'Aspirin')
  })

  // Test 23: Search medications by generic name
  it('should search medications by generic name', () => {
    cy.get('[data-testid="medications-search"]').type('acetylsalicylic')
    cy.get('[data-testid="medication-row"]').should('contain.text', 'acetylsalicylic')
  })

  // Test 24: Search medications by manufacturer
  it('should search medications by manufacturer', () => {
    cy.get('[data-testid="medications-search"]').type('Johnson & Johnson')
    cy.get('[data-testid="medication-row"]').should('contain.text', 'Johnson & Johnson')
  })

  // Test 25: Display medications table
  it('should display medications table with correct columns', () => {
    cy.get('[data-testid="medications-table"]').should('be.visible')
    cy.get('[data-testid="medication-name-column"]').should('contain.text', 'Medication')
    cy.get('[data-testid="dosage-form-column"]').should('contain.text', 'Dosage Form')
    cy.get('[data-testid="strength-column"]').should('contain.text', 'Strength')
    cy.get('[data-testid="stock-column"]').should('contain.text', 'Stock')
    cy.get('[data-testid="status-column"]').should('contain.text', 'Status')
    cy.get('[data-testid="prescriptions-column"]').should('contain.text', 'Active Prescriptions')
  })

  // Test 26: Display medication rows
  it('should display medication rows with correct information', () => {
    cy.get('[data-testid="medication-row"]:first').should('be.visible')
    cy.get('[data-testid="medication-row"]:first').within(() => {
      cy.get('[data-testid="medication-name"]').should('be.visible')
      cy.get('[data-testid="medication-generic"]').should('be.visible')
      cy.get('[data-testid="dosage-form"]').should('be.visible')
      cy.get('[data-testid="strength"]').should('be.visible')
      cy.get('[data-testid="stock-amount"]').should('be.visible')
      cy.get('[data-testid="medication-status"]').should('be.visible')
      cy.get('[data-testid="active-prescriptions"]').should('be.visible')
    })
  })

  // Test 27: Display controlled substance badge
  it('should display controlled substance badges correctly', () => {
    cy.get('[data-testid="medication-row"]').contains('[data-testid="medication-status"]', 'Controlled').should('be.visible')
    cy.get('[data-testid="controlled-badge"]').should('have.class', 'bg-red-100')
    cy.get('[data-testid="controlled-badge"]').should('have.class', 'text-red-800')
  })

  // Test 28: Display standard medication badge
  it('should display standard medication badges correctly', () => {
    cy.get('[data-testid="medication-row"]').contains('[data-testid="medication-status"]', 'Standard').should('be.visible')
    cy.get('[data-testid="standard-badge"]').should('have.class', 'bg-green-100')
    cy.get('[data-testid="standard-badge"]').should('have.class', 'text-green-800')
  })

  // Test 29: Display low stock warning
  it('should highlight medications with low stock', () => {
    cy.get('[data-testid="low-stock-indicator"]').should('be.visible')
    cy.get('[data-testid="low-stock-indicator"]').should('have.class', 'text-red-600')
    cy.get('[data-testid="low-stock-indicator"]').should('have.class', 'font-semibold')
  })

  // Test 30: Open add medication modal
  it('should open add medication modal when clicking add button', () => {
    cy.get('[data-testid="add-medication-button"]').click()
    cy.get('[data-testid="add-medication-modal"]').should('be.visible')
    cy.get('[data-testid="modal-title"]').should('contain.text', 'Add New Medication')
  })

  // Test 31: Add medication form fields
  it('should display all required fields in add medication form', () => {
    cy.get('[data-testid="add-medication-button"]').click()
    cy.get('[data-testid="add-medication-modal"]').within(() => {
      cy.get('[data-testid="medication-name-input"]').should('be.visible')
      cy.get('[data-testid="generic-name-input"]').should('be.visible')
      cy.get('[data-testid="dosage-form-select"]').should('be.visible')
      cy.get('[data-testid="strength-input"]').should('be.visible')
      cy.get('[data-testid="manufacturer-input"]').should('be.visible')
      cy.get('[data-testid="controlled-substance-checkbox"]').should('be.visible')
      cy.get('[data-testid="save-medication-button"]').should('be.visible')
      cy.get('[data-testid="cancel-button"]').should('be.visible')
    })
  })

  // Test 32: Fill and submit add medication form
  it('should successfully add a new medication', () => {
    cy.get('[data-testid="add-medication-button"]').click()
    cy.get('[data-testid="add-medication-modal"]').within(() => {
      cy.get('[data-testid="medication-name-input"]').type('Test Medication')
      cy.get('[data-testid="generic-name-input"]').type('test-generic')
      cy.get('[data-testid="dosage-form-select"]').select('Tablet')
      cy.get('[data-testid="strength-input"]').type('500mg')
      cy.get('[data-testid="manufacturer-input"]').type('Test Pharma')
      cy.get('[data-testid="save-medication-button"]').click()
    })
    cy.get('[data-testid="success-toast"]').should('contain.text', 'Medication added successfully')
  })

  // Test 33: Cancel add medication
  it('should close modal when clicking cancel', () => {
    cy.get('[data-testid="add-medication-button"]').click()
    cy.get('[data-testid="add-medication-modal"]').should('be.visible')
    cy.get('[data-testid="cancel-button"]').click()
    cy.get('[data-testid="add-medication-modal"]').should('not.exist')
  })

  // Test 34: Medication row hover effect
  it('should show hover effect on medication rows', () => {
    cy.get('[data-testid="medication-row"]:first').trigger('mouseover')
    cy.get('[data-testid="medication-row"]:first').should('have.class', 'hover:bg-gray-50')
  })

  // Test 35: View medication details
  it('should open medication details when clicking on a row', () => {
    cy.get('[data-testid="medication-row"]:first').click()
    cy.get('[data-testid="medication-details-modal"]').should('be.visible')
    cy.get('[data-testid="medication-details-title"]').should('be.visible')
  })

  // Test 36: Loading state
  it('should display loading state while fetching medications', () => {
    // Clear existing session and set up delayed intercept before visiting
    cy.clearCookies()
    cy.clearLocalStorage()
    cy.interceptMedicationAPIDelayed()
    
    // Login and navigate to trigger loading
    cy.loginAsNurse()
    cy.visit('/medications')
    cy.get('[data-testid="medications-tab"]').click()
    
    // Check for loading state
    cy.get('[data-testid="loading-spinner"]').should('be.visible')
    cy.get('[data-testid="loading-text"]').should('contain.text', 'Loading medications...')
    cy.wait('@getMedicationsDelayed')
    cy.get('[data-testid="loading-spinner"]').should('not.exist')
  })

  // Test 37: Empty state
  it('should display empty state when no medications found', () => {
    cy.intercept('GET', '**/medications*', { body: { success: true, data: { medications: [], pagination: { page: 1, limit: 20, total: 0, pages: 0 } } } }).as('getEmptyMedications')
    // Trigger a re-fetch by switching tabs
    cy.get('[data-testid="overview-tab"]').click()
    cy.get('[data-testid="medications-tab"]').click()
    cy.wait('@getEmptyMedications')
    cy.get('[data-testid="empty-state"]').should('be.visible')
    cy.get('[data-testid="empty-state"]').should('contain.text', 'No medications found')
  })

  // Test 38: Search with no results
  it('should display no results message when search returns empty', () => {
    // Intercept search with empty results
    cy.intercept('GET', '**/medications*search=nonexistentmedication*', { 
      body: { 
        success: true, 
        data: { 
          medications: [], 
          pagination: { page: 1, limit: 20, total: 0, pages: 0 } 
        } 
      } 
    }).as('getEmptySearchResults')
    
    cy.get('[data-testid="medications-search"]').type('nonexistentmedication')
    cy.wait('@getEmptySearchResults')
    cy.get('[data-testid="no-results"]').should('be.visible')
    cy.get('[data-testid="no-results"]').should('contain.text', 'No medications match your search')
  })

  // Test 39: Clear search
  it('should clear search and show all medications', () => {
    cy.get('[data-testid="medications-search"]').type('aspirin')
    cy.get('[data-testid="medication-row"]').should('have.length.lessThan', 10)
    cy.get('[data-testid="medications-search"]').clear()
    cy.get('[data-testid="medication-row"]').should('have.length', 5) // Updated to match our mock data
  })

  // Test 40: Form validation
  it('should validate required fields in add medication form', () => {
    cy.get('[data-testid="add-medication-button"]').click()
    cy.get('[data-testid="add-medication-modal"]').within(() => {
      cy.get('[data-testid="save-medication-button"]').click()
      cy.get('[data-testid="name-error"]').should('contain.text', 'Medication name is required')
      cy.get('[data-testid="dosage-form-error"]').should('contain.text', 'Dosage form is required')
      cy.get('[data-testid="strength-error"]').should('contain.text', 'Strength is required')
    })
  })
})