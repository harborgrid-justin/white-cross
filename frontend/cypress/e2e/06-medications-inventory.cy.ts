// Medications Management - Inventory Tab (Tests 41-60)
describe('Medications - Inventory Tab', () => {
  beforeEach(() => {
    cy.loginAsNurse()
    cy.interceptMedicationAPI()
    cy.visit('/medications')
    cy.get('[data-testid="inventory-tab"]').click()
  })

  // Test 41: Display inventory tab
  it('should display the inventory tab correctly', () => {
    cy.get('[data-testid="inventory-tab"]').should('have.class', 'border-blue-500')
    cy.get('[data-testid="inventory-table"]').should('be.visible')
  })

  // Test 42: Display inventory alerts section
  it('should display inventory alerts when present', () => {
    cy.get('[data-testid="inventory-alerts"]').should('be.visible')
    cy.get('[data-testid="low-stock-alert"]').should('be.visible')
    cy.get('[data-testid="low-stock-alert"]').should('contain.text', 'Low Stock')
    cy.get('[data-testid="low-stock-alert"]').should('contain.text', 'below reorder level')
  })

  // Test 43: Display near expiry alerts
  it('should display near expiry alerts', () => {
    cy.get('[data-testid="near-expiry-alert"]').should('be.visible')
    cy.get('[data-testid="near-expiry-alert"]').should('contain.text', 'Near Expiry')
    cy.get('[data-testid="near-expiry-alert"]').should('contain.text', 'expiring within 30 days')
    cy.get('[data-testid="near-expiry-alert"]').should('have.class', 'bg-yellow-50')
  })

  // Test 44: Display expired medication alerts
  it('should display expired medication alerts when present', () => {
    cy.intercept('GET', '**/api/medications/inventory*', {
      body: {
        success: true,
        data: {
          inventory: [],
          alerts: {
            expired: [{ id: '1', medicationName: 'Old Medicine' }],
            nearExpiry: [],
            lowStock: []
          }
        }
      }
    }).as('getExpiredInventory')
    
    cy.reload()
    cy.get('[data-testid="inventory-tab"]').click()
    cy.wait('@getExpiredInventory')
    
    cy.get('[data-testid="expired-alert"]').should('be.visible')
    cy.get('[data-testid="expired-alert"]').should('contain.text', 'Expired Medications')
    cy.get('[data-testid="expired-alert"]').should('contain.text', 'should be disposed of')
    cy.get('[data-testid="expired-alert"]').should('have.class', 'bg-red-50')
  })

  // Test 45: Display inventory table headers
  it('should display inventory table with correct column headers', () => {
    cy.get('[data-testid="inventory-table"]').within(() => {
      cy.get('[data-testid="medication-column"]').should('contain.text', 'Medication')
      cy.get('[data-testid="batch-column"]').should('contain.text', 'Batch')
      cy.get('[data-testid="quantity-column"]').should('contain.text', 'Quantity')
      cy.get('[data-testid="expiration-column"]').should('contain.text', 'Expiration')
      cy.get('[data-testid="supplier-column"]').should('contain.text', 'Supplier')
      cy.get('[data-testid="status-column"]').should('contain.text', 'Status')
    })
  })

  // Test 46: Display inventory item rows
  it('should display inventory items with correct information', () => {
    cy.get('[data-testid="inventory-row"]:first').should('be.visible')
    cy.get('[data-testid="inventory-row"]:first').within(() => {
      cy.get('[data-testid="medication-name"]').should('contain.text', 'Aspirin')
      cy.get('[data-testid="medication-strength"]').should('contain.text', '325mg')
      cy.get('[data-testid="batch-number"]').should('contain.text', 'BATCH001')
      cy.get('[data-testid="quantity-current"]').should('be.visible')
      cy.get('[data-testid="expiration-date"]').should('be.visible')
      cy.get('[data-testid="supplier-name"]').should('be.visible')
      cy.get('[data-testid="item-status"]').should('be.visible')
    })
  })

  // Test 47: Display good status badge
  it('should display good status badge for healthy inventory items', () => {
    cy.get('[data-testid="inventory-row"]:first').within(() => {
      cy.get('[data-testid="good-status-badge"]').should('be.visible')
      cy.get('[data-testid="good-status-badge"]').should('contain.text', 'Good')
      cy.get('[data-testid="good-status-badge"]').should('have.class', 'bg-green-100')
      cy.get('[data-testid="good-status-badge"]').should('have.class', 'text-green-800')
    })
  })

  // Test 48: Display low stock badge
  it('should display low stock badge for items below reorder level', () => {
    cy.get('[data-testid="inventory-row"]').contains('Methylphenidate').parent().within(() => {
      cy.get('[data-testid="low-stock-badge"]').should('be.visible')
      cy.get('[data-testid="low-stock-badge"]').should('contain.text', 'Low Stock')
      cy.get('[data-testid="low-stock-badge"]').should('have.class', 'bg-orange-100')
      cy.get('[data-testid="low-stock-badge"]').should('have.class', 'text-orange-800')
    })
  })

  // Test 49: Display near expiry badge
  it('should display near expiry badge for items expiring soon', () => {
    cy.get('[data-testid="inventory-row"]').contains('Methylphenidate').parent().within(() => {
      cy.get('[data-testid="near-expiry-badge"]').should('be.visible')
      cy.get('[data-testid="near-expiry-badge"]').should('contain.text', 'Near Expiry')
      cy.get('[data-testid="near-expiry-badge"]').should('have.class', 'bg-yellow-100')
      cy.get('[data-testid="near-expiry-badge"]').should('have.class', 'text-yellow-800')
    })
  })

  // Test 50: Display expired badge
  it('should display expired badge for expired items', () => {
    cy.intercept('GET', '**/api/medications/inventory*', {
      body: {
        success: true,
        data: {
          inventory: [{
            id: '1',
            quantity: 50,
            reorderLevel: 20,
            expirationDate: '2024-01-01',
            batchNumber: 'EXPIRED001',
            supplier: 'OldSupplier',
            medication: { name: 'Expired Med', strength: '100mg' },
            alerts: { expired: true }
          }],
          alerts: { expired: [], nearExpiry: [], lowStock: [] }
        }
      }
    }).as('getExpiredItem')
    
    cy.reload()
    cy.get('[data-testid="inventory-tab"]').click()
    cy.wait('@getExpiredItem')
    
    cy.get('[data-testid="expired-badge"]').should('be.visible')
    cy.get('[data-testid="expired-badge"]').should('contain.text', 'Expired')
    cy.get('[data-testid="expired-badge"]').should('have.class', 'bg-red-100')
    cy.get('[data-testid="expired-badge"]').should('have.class', 'text-red-800')
  })

  // Test 51: Display quantity with reorder level
  it('should display current quantity vs reorder level', () => {
    cy.get('[data-testid="inventory-row"]:first').within(() => {
      cy.get('[data-testid="quantity-display"]').should('contain.text', '100 / 20')
      cy.get('[data-testid="quantity-display"]').should('not.have.class', 'text-red-600')
    })
  })

  // Test 52: Highlight low stock quantity
  it('should highlight quantity in red when below reorder level', () => {
    cy.get('[data-testid="inventory-row"]').contains('Methylphenidate').parent().within(() => {
      cy.get('[data-testid="quantity-display"]').should('have.class', 'text-red-600')
      cy.get('[data-testid="quantity-display"]').should('have.class', 'font-semibold')
    })
  })

  // Test 53: Display expiration date with days countdown
  it('should display expiration date with days until expiry', () => {
    cy.get('[data-testid="inventory-row"]:first').within(() => {
      cy.get('[data-testid="expiration-date"]').should('be.visible')
      cy.get('[data-testid="days-until-expiry"]').should('be.visible')
      cy.get('[data-testid="days-until-expiry"]').should('contain.text', 'days')
    })
  })

  // Test 54: Highlight near expiry dates
  it('should highlight expiration dates that are near expiry', () => {
    cy.get('[data-testid="inventory-row"]').contains('Methylphenidate').parent().within(() => {
      cy.get('[data-testid="expiration-date"]').should('have.class', 'text-yellow-600')
      cy.get('[data-testid="expiration-date"]').should('have.class', 'font-semibold')
    })
  })

  // Test 55: Display supplier information
  it('should display supplier information or dash for missing', () => {
    cy.get('[data-testid="inventory-row"]:first').within(() => {
      cy.get('[data-testid="supplier-name"]').should('contain.text', 'MedSupply Co')
    })
    
    // Test item with no supplier
    cy.get('[data-testid="inventory-row"]').should('contain.text', '-')
  })

  // Test 56: Loading state for inventory
  it('should display loading state while fetching inventory', () => {
    cy.intercept('GET', '**/api/medications/inventory*', { delay: 2000, fixture: 'inventory.json' }).as('getInventoryDelay')
    cy.visit('/medications')
    cy.get('[data-testid="inventory-tab"]').click()
    cy.get('[data-testid="loading-spinner"]').should('be.visible')
    cy.get('[data-testid="loading-text"]').should('contain.text', 'Loading inventory...')
    cy.wait('@getInventoryDelay')
    cy.get('[data-testid="loading-spinner"]').should('not.exist')
  })

  // Test 57: Empty inventory state
  it('should display empty state when no inventory items exist', () => {
    cy.intercept('GET', '**/api/medications/inventory*', {
      body: {
        success: true,
        data: {
          inventory: [],
          alerts: { expired: [], nearExpiry: [], lowStock: [] }
        }
      }
    }).as('getEmptyInventory')
    
    cy.visit('/medications')
    cy.get('[data-testid="inventory-tab"]').click()
    cy.wait('@getEmptyInventory')
    
    cy.get('[data-testid="empty-inventory"]').should('be.visible')
    cy.get('[data-testid="empty-inventory"]').should('contain.text', 'No inventory items found')
  })

  // Test 58: Multiple status badges
  it('should display multiple status badges when applicable', () => {
    cy.get('[data-testid="inventory-row"]').contains('Methylphenidate').parent().within(() => {
      cy.get('[data-testid="near-expiry-badge"]').should('be.visible')
      cy.get('[data-testid="low-stock-badge"]').should('be.visible')
      // Both badges should be present for this item
      cy.get('.rounded-full').should('have.length', 2)
    })
  })

  // Test 59: Inventory row hover effect
  it('should show hover effect on inventory rows', () => {
    cy.get('[data-testid="inventory-row"]:first').trigger('mouseover')
    cy.get('[data-testid="inventory-row"]:first').should('have.class', 'hover:bg-gray-50')
  })

  // Test 60: Alert count accuracy
  it('should display accurate alert counts in alert banners', () => {
    cy.get('[data-testid="low-stock-alert"]').should('contain.text', '1 medication(s) below reorder level')
    cy.get('[data-testid="near-expiry-alert"]').should('contain.text', '1 medication(s) expiring within 30 days')
  })
})