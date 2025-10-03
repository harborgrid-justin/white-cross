// Medications Management - Overview Tab (Tests 1-20)
describe('Medications - Overview Tab', () => {
  beforeEach(() => {
    cy.loginAsNurse()
    cy.interceptMedicationAPI()
    cy.visit('/medications')
  })

  // Test 1: Display medications overview page
  it('should display the medications overview page correctly', () => {
    cy.get('[data-testid="medications-title"]').should('contain.text', 'Medication Management')
    cy.get('[data-testid="medications-subtitle"]').should('contain.text', 'Comprehensive medication tracking')
    cy.get('[data-testid="overview-tab"]').should('have.class', 'border-blue-500')
    cy.get('[data-testid="overview-tab"]').should('contain.text', 'Overview')
  })

  // Test 2: Display overview cards
  it('should display all four overview cards with correct information', () => {
    cy.get('[data-testid="prescription-card"]').should('be.visible')
    cy.get('[data-testid="prescription-card"]').should('contain.text', 'Prescription Management')
    cy.get('[data-testid="prescription-card"]').should('contain.text', 'Digital prescription tracking')
    
    cy.get('[data-testid="inventory-card"]').should('be.visible')
    cy.get('[data-testid="inventory-card"]').should('contain.text', 'Inventory Tracking')
    cy.get('[data-testid="inventory-card"]').should('contain.text', 'Stock level monitoring')
    
    cy.get('[data-testid="safety-card"]').should('be.visible')
    cy.get('[data-testid="safety-card"]').should('contain.text', 'Safety & Compliance')
    cy.get('[data-testid="safety-card"]').should('contain.text', 'Controlled substance tracking')
    
    cy.get('[data-testid="reminders-card"]').should('be.visible')
    cy.get('[data-testid="reminders-card"]').should('contain.text', 'Automated Reminders')
    cy.get('[data-testid="reminders-card"]').should('contain.text', 'Time-stamped records')
  })

  // Test 3: Display overview card icons
  it('should display appropriate icons for each overview card', () => {
    cy.get('[data-testid="prescription-card"] svg').should('be.visible')
    cy.get('[data-testid="inventory-card"] svg').should('be.visible')
    cy.get('[data-testid="safety-card"] svg').should('be.visible')
    cy.get('[data-testid="reminders-card"] svg').should('be.visible')
  })

  // Test 4: Display quick actions section
  it('should display the quick actions section with three buttons', () => {
    cy.get('[data-testid="quick-actions"]').should('be.visible')
    cy.get('[data-testid="quick-actions"]').should('contain.text', 'Quick Actions')
    
    cy.get('[data-testid="view-medications-action"]').should('be.visible')
    cy.get('[data-testid="view-medications-action"]').should('contain.text', 'View Medications')
    cy.get('[data-testid="view-medications-action"]').should('contain.text', 'Browse medication database')
    
    cy.get('[data-testid="todays-reminders-action"]').should('be.visible')
    cy.get('[data-testid="todays-reminders-action"]').should('contain.text', "Today's Reminders")
    cy.get('[data-testid="todays-reminders-action"]').should('contain.text', 'View scheduled medications')
    
    cy.get('[data-testid="check-inventory-action"]').should('be.visible')
    cy.get('[data-testid="check-inventory-action"]').should('contain.text', 'Check Inventory')
    cy.get('[data-testid="check-inventory-action"]').should('contain.text', 'Monitor stock levels')
  })

  // Test 5: Navigate to medications tab via quick action
  it('should navigate to medications tab when clicking view medications action', () => {
    cy.get('[data-testid="view-medications-action"]').click()
    cy.get('[data-testid="medications-tab"]').should('have.class', 'border-blue-500')
    cy.get('[data-testid="medications-search"]').should('be.visible')
  })

  // Test 6: Navigate to reminders tab via quick action
  it('should navigate to reminders tab when clicking todays reminders action', () => {
    cy.get('[data-testid="todays-reminders-action"]').click()
    cy.get('[data-testid="reminders-tab"]').should('have.class', 'border-blue-500')
    cy.get('[data-testid="todays-schedule"]').should('be.visible')
  })

  // Test 7: Navigate to inventory tab via quick action
  it('should navigate to inventory tab when clicking check inventory action', () => {
    cy.get('[data-testid="check-inventory-action"]').click()
    cy.get('[data-testid="inventory-tab"]').should('have.class', 'border-blue-500')
    cy.get('[data-testid="inventory-table"]').should('be.visible')
  })

  // Test 8: Display tab navigation
  it('should display all five tabs in the navigation', () => {
    cy.get('[data-testid="overview-tab"]').should('be.visible').should('contain.text', 'Overview')
    cy.get('[data-testid="medications-tab"]').should('be.visible').should('contain.text', 'Medications')
    cy.get('[data-testid="inventory-tab"]').should('be.visible').should('contain.text', 'Inventory')
    cy.get('[data-testid="reminders-tab"]').should('be.visible').should('contain.text', 'Reminders')
    cy.get('[data-testid="adverse-reactions-tab"]').should('be.visible').should('contain.text', 'Adverse Reactions')
  })

  // Test 9: Tab icons display correctly
  it('should display correct icons for each tab', () => {
    cy.get('[data-testid="overview-tab"] svg').should('be.visible')
    cy.get('[data-testid="medications-tab"] svg').should('be.visible')
    cy.get('[data-testid="inventory-tab"] svg').should('be.visible')
    cy.get('[data-testid="reminders-tab"] svg').should('be.visible')
    cy.get('[data-testid="adverse-reactions-tab"] svg').should('be.visible')
  })

  // Test 10: Tab switching functionality
  it('should switch between tabs correctly', () => {
    // Start on overview
    cy.get('[data-testid="overview-tab"]').should('have.class', 'border-blue-500')
    
    // Switch to medications
    cy.get('[data-testid="medications-tab"]').click()
    cy.get('[data-testid="medications-tab"]').should('have.class', 'border-blue-500')
    cy.get('[data-testid="overview-tab"]').should('not.have.class', 'border-blue-500')
    
    // Switch back to overview
    cy.get('[data-testid="overview-tab"]').click()
    cy.get('[data-testid="overview-tab"]').should('have.class', 'border-blue-500')
    cy.get('[data-testid="medications-tab"]').should('not.have.class', 'border-blue-500')
  })

  // Test 11: Overview card hover effects
  it('should show hover effects on overview cards', () => {
    cy.get('[data-testid="prescription-card"]').trigger('mouseover')
    cy.get('[data-testid="prescription-card"]').should('have.class', 'hover:shadow-lg')
    
    cy.get('[data-testid="inventory-card"]').trigger('mouseover')
    cy.get('[data-testid="inventory-card"]').should('have.class', 'hover:shadow-lg')
  })

  // Test 12: Quick action button hover effects
  it('should show hover effects on quick action buttons', () => {
    cy.get('[data-testid="view-medications-action"]').trigger('mouseover')
    cy.get('[data-testid="view-medications-action"]').should('have.class', 'hover:border-blue-500')
    
    cy.get('[data-testid="todays-reminders-action"]').trigger('mouseover')
    cy.get('[data-testid="todays-reminders-action"]').should('have.class', 'hover:border-blue-500')
  })

  // Test 13: Responsive layout on mobile
  it('should display correctly on mobile viewport', () => {
    cy.viewport(375, 667)
    cy.get('[data-testid="overview-cards"]').should('be.visible')
    cy.get('[data-testid="quick-actions"]').should('be.visible')
    
    // Cards should stack vertically on mobile
    cy.get('[data-testid="prescription-card"]').should('be.visible')
    cy.get('[data-testid="inventory-card"]').should('be.visible')
  })

  // Test 14: Responsive layout on tablet
  it('should display correctly on tablet viewport', () => {
    cy.viewport(768, 1024)
    cy.get('[data-testid="overview-cards"]').should('be.visible')
    cy.get('[data-testid="quick-actions"]').should('be.visible')
  })

  // Test 15: Page title and breadcrumbs
  it('should display correct page title and meta information', () => {
    cy.title().should('contain', 'Medications')
    cy.get('[data-testid="medications-title"]').should('contain.text', 'Medication Management')
    cy.get('[data-testid="medications-subtitle"]').should('contain.text', 'medication tracking, administration, and inventory management')
  })

  // Test 16: Overview content accessibility
  it('should have proper accessibility attributes', () => {
    cy.get('[data-testid="medications-title"]').should('have.attr', 'role', 'heading')
    cy.get('[data-testid="overview-tab"]').should('have.attr', 'role', 'tab')
    cy.get('[data-testid="prescription-card"]').should('have.attr', 'role', 'article')
  })

  // Test 17: Overview statistics display
  it('should display medication statistics in overview cards', () => {
    cy.get('[data-testid="prescription-card"]').within(() => {
      cy.get('[data-testid="prescription-features"]').should('contain.text', 'Digital prescription tracking')
      cy.get('[data-testid="prescription-features"]').should('contain.text', 'Dosage scheduling')
      cy.get('[data-testid="prescription-features"]').should('contain.text', 'Administration logging')
      cy.get('[data-testid="prescription-features"]').should('contain.text', 'Compliance monitoring')
    })
  })

  // Test 18: Inventory features display
  it('should display inventory features correctly', () => {
    cy.get('[data-testid="inventory-card"]').within(() => {
      cy.get('[data-testid="inventory-features"]').should('contain.text', 'Stock level monitoring')
      cy.get('[data-testid="inventory-features"]').should('contain.text', 'Expiration date alerts')
      cy.get('[data-testid="inventory-features"]').should('contain.text', 'Automated reorder points')
      cy.get('[data-testid="inventory-features"]').should('contain.text', 'Supplier management')
    })
  })

  // Test 19: Safety features display
  it('should display safety and compliance features', () => {
    cy.get('[data-testid="safety-card"]').within(() => {
      cy.get('[data-testid="safety-features"]').should('contain.text', 'Controlled substance tracking')
      cy.get('[data-testid="safety-features"]').should('contain.text', 'Side effect monitoring')
      cy.get('[data-testid="safety-features"]').should('contain.text', 'Drug interaction alerts')
      cy.get('[data-testid="safety-features"]').should('contain.text', 'Regulatory compliance')
    })
  })

  // Test 20: Reminder features display
  it('should display reminder and notification features', () => {
    cy.get('[data-testid="reminders-card"]').within(() => {
      cy.get('[data-testid="reminder-features"]').should('contain.text', 'Time-stamped records')
      cy.get('[data-testid="reminder-features"]').should('contain.text', 'Nurse verification')
      cy.get('[data-testid="reminder-features"]').should('contain.text', 'Student response tracking')
      cy.get('[data-testid="reminder-features"]').should('contain.text', 'Dosage reminders')
    })
  })
})