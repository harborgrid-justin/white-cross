/// <reference types="cypress" />

describe('Inventory Management - Supplies', () => {
  beforeEach(() => {
    cy.clearCookies()
    cy.clearLocalStorage()
    
    cy.intercept('GET', '**/api/auth/verify', {
      statusCode: 200,
      body: {
        success: true,
        data: { id: '1', email: 'nurse@school.edu', role: 'NURSE' }
      }
    }).as('verifyAuth')
    
    cy.intercept('GET', '**/api/inventory/supplies*', {
      statusCode: 200,
      body: {
        success: true,
        data: {
          supplies: [
            {
              id: '1',
              name: 'Bandages',
              category: 'FIRST_AID',
              quantity: 150,
              unit: 'pieces',
              reorderLevel: 50,
              location: 'Cabinet A',
              status: 'IN_STOCK'
            },
            {
              id: '2',
              name: 'Thermometers',
              category: 'EQUIPMENT',
              quantity: 5,
              unit: 'units',
              reorderLevel: 10,
              location: 'Drawer B',
              status: 'LOW_STOCK'
            }
          ],
          total: 2
        }
      }
    }).as('getSupplies')
    
    cy.login()
    cy.visit('/inventory')
    cy.wait('@verifyAuth')
  })

  describe('Supplies Display', () => {
    it('should display inventory page', () => {
      cy.contains('Inventory Management').should('be.visible')
    })

    it('should show supplies list', () => {
      cy.wait('@getSupplies')
      cy.contains('Bandages').should('be.visible')
      cy.contains('Thermometers').should('be.visible')
    })

    it('should display quantities', () => {
      cy.wait('@getSupplies')
      cy.contains('150').should('be.visible')
      cy.contains('5').should('be.visible')
    })

    it('should show stock status', () => {
      cy.wait('@getSupplies')
      cy.contains('IN_STOCK').should('be.visible')
      cy.contains('LOW_STOCK').should('be.visible')
    })
  })

  describe('Add Supply Item', () => {
    it('should open add supply modal', () => {
      cy.wait('@getSupplies')
      cy.get('[data-testid="add-supply-button"]').click()
      cy.get('[data-testid="supply-modal"]').should('be.visible')
    })

    it('should validate required fields', () => {
      cy.wait('@getSupplies')
      cy.get('[data-testid="add-supply-button"]').click()
      cy.get('[data-testid="save-supply"]').click()
      
      cy.contains('Name is required').should('be.visible')
      cy.contains('Category is required').should('be.visible')
      cy.contains('Quantity is required').should('be.visible')
    })

    it('should successfully add supply', () => {
      cy.wait('@getSupplies')
      
      cy.intercept('POST', '**/api/inventory/supplies', {
        statusCode: 201,
        body: {
          success: true,
          data: { id: '3', name: 'Gloves' }
        }
      }).as('addSupply')
      
      cy.get('[data-testid="add-supply-button"]').click()
      
      cy.get('[data-testid="supply-name"]').type('Gloves')
      cy.get('[data-testid="category"]').select('FIRST_AID')
      cy.get('[data-testid="quantity"]').type('200')
      cy.get('[data-testid="unit"]').type('pairs')
      cy.get('[data-testid="reorder-level"]').type('50')
      cy.get('[data-testid="location"]').type('Cabinet C')
      
      cy.get('[data-testid="save-supply"]').click()
      
      cy.wait('@addSupply')
      cy.contains('Supply added successfully').should('be.visible')
    })
  })

  describe('Supply Categories', () => {
    it('should display all categories', () => {
      cy.wait('@getSupplies')
      cy.get('[data-testid="add-supply-button"]').click()
      
      const categories = [
        'FIRST_AID',
        'EQUIPMENT',
        'CLEANING',
        'PPE',
        'OFFICE_SUPPLIES'
      ]
      
      categories.forEach(category => {
        cy.get('[data-testid="category"]').should('contain', category)
      })
    })

    it('should filter by category', () => {
      cy.wait('@getSupplies')
      cy.get('[data-testid="category-filter"]').select('FIRST_AID')
      cy.contains('Bandages').should('be.visible')
    })
  })

  describe('Update Supply', () => {
    it('should open edit modal', () => {
      cy.wait('@getSupplies')
      cy.get('[data-testid="edit-supply-1"]').click()
      cy.get('[data-testid="supply-modal"]').should('be.visible')
      cy.get('[data-testid="supply-name"]').should('have.value', 'Bandages')
    })

    it('should successfully update supply', () => {
      cy.wait('@getSupplies')
      
      cy.intercept('PUT', '**/api/inventory/supplies/1', {
        statusCode: 200,
        body: { success: true }
      }).as('updateSupply')
      
      cy.get('[data-testid="edit-supply-1"]').click()
      cy.get('[data-testid="quantity"]').clear().type('175')
      cy.get('[data-testid="save-supply"]').click()
      
      cy.wait('@updateSupply')
      cy.contains('Supply updated').should('be.visible')
    })
  })

  describe('Stock Adjustments', () => {
    it('should adjust stock levels', () => {
      cy.wait('@getSupplies')
      
      cy.intercept('POST', '**/api/inventory/supplies/1/adjust', {
        statusCode: 200,
        body: { success: true }
      }).as('adjustStock')
      
      cy.get('[data-testid="adjust-stock-1"]').click()
      cy.get('[data-testid="adjustment-type"]').select('ADD')
      cy.get('[data-testid="adjustment-amount"]').type('25')
      cy.get('[data-testid="reason"]').type('New shipment received')
      cy.get('[data-testid="save-adjustment"]').click()
      
      cy.wait('@adjustStock')
      cy.contains('Stock adjusted').should('be.visible')
    })

    it('should record adjustment history', () => {
      cy.intercept('GET', '**/api/inventory/supplies/1/history', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            adjustments: [
              {
                date: '2024-01-15',
                type: 'ADD',
                amount: 25,
                reason: 'New shipment'
              }
            ]
          }
        }
      }).as('getHistory')
      
      cy.wait('@getSupplies')
      cy.get('[data-testid="view-history-1"]').click()
      cy.wait('@getHistory')
      
      cy.contains('New shipment').should('be.visible')
    })
  })

  describe('Reorder Management', () => {
    it('should display low stock alerts', () => {
      cy.wait('@getSupplies')
      cy.get('[data-testid="low-stock-alert"]').should('be.visible')
      cy.contains('Thermometers').should('be.visible')
    })

    it('should generate reorder list', () => {
      cy.intercept('GET', '**/api/inventory/supplies/reorder', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            items: [
              { id: '2', name: 'Thermometers', currentStock: 5, recommended: 15 }
            ]
          }
        }
      }).as('getReorder')
      
      cy.wait('@getSupplies')
      cy.get('[data-testid="view-reorder-list"]').click()
      cy.wait('@getReorder')
      
      cy.contains('Thermometers').should('be.visible')
      cy.contains('Recommended: 15').should('be.visible')
    })

    it('should create purchase order', () => {
      cy.intercept('POST', '**/api/inventory/purchase-orders', {
        statusCode: 201,
        body: {
          success: true,
          data: { id: 'PO-001' }
        }
      }).as('createPO')
      
      cy.wait('@getSupplies')
      cy.get('[data-testid="create-purchase-order"]').click()
      
      cy.get('[data-testid="select-item-2"]').check()
      cy.get('[data-testid="vendor"]').select('Vendor A')
      cy.get('[data-testid="submit-po"]').click()
      
      cy.wait('@createPO')
      cy.contains('Purchase order PO-001 created').should('be.visible')
    })
  })

  describe('Vendor Management', () => {
    it('should display vendor list', () => {
      cy.intercept('GET', '**/api/inventory/vendors', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            vendors: [
              { id: '1', name: 'Medical Supplies Inc', contactName: 'John Doe' }
            ]
          }
        }
      }).as('getVendors')
      
      cy.get('[data-testid="vendors-tab"]').click()
      cy.wait('@getVendors')
      
      cy.contains('Medical Supplies Inc').should('be.visible')
    })

    it('should add new vendor', () => {
      cy.intercept('POST', '**/api/inventory/vendors', {
        statusCode: 201,
        body: { success: true }
      }).as('addVendor')
      
      cy.get('[data-testid="vendors-tab"]').click()
      cy.get('[data-testid="add-vendor"]').click()
      
      cy.get('[data-testid="vendor-name"]').type('Healthcare Supplies Co')
      cy.get('[data-testid="contact-name"]').type('Jane Smith')
      cy.get('[data-testid="phone"]').type('555-1234')
      cy.get('[data-testid="email"]').type('vendor@healthcare.com')
      cy.get('[data-testid="save-vendor"]').click()
      
      cy.wait('@addVendor')
      cy.contains('Vendor added').should('be.visible')
    })
  })

  describe('Equipment Maintenance', () => {
    it('should display equipment maintenance schedule', () => {
      cy.intercept('GET', '**/api/inventory/equipment/maintenance', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            schedules: [
              {
                id: '1',
                equipmentName: 'Blood Pressure Monitor',
                lastMaintenance: '2023-12-15',
                nextMaintenance: '2024-06-15'
              }
            ]
          }
        }
      }).as('getMaintenance')
      
      cy.get('[data-testid="equipment-tab"]').click()
      cy.get('[data-testid="maintenance-schedule"]').click()
      cy.wait('@getMaintenance')
      
      cy.contains('Blood Pressure Monitor').should('be.visible')
    })

    it('should record maintenance completion', () => {
      cy.intercept('POST', '**/api/inventory/equipment/1/maintenance', {
        statusCode: 200,
        body: { success: true }
      }).as('completeMaintenance')
      
      cy.get('[data-testid="equipment-tab"]').click()
      cy.get('[data-testid="complete-maintenance-1"]').click()
      
      cy.get('[data-testid="maintenance-notes"]').type('Annual calibration completed')
      cy.get('[data-testid="technician"]').type('Tech Smith')
      cy.get('[data-testid="save-maintenance"]').click()
      
      cy.wait('@completeMaintenance')
      cy.contains('Maintenance recorded').should('be.visible')
    })
  })

  describe('Cost Tracking', () => {
    it('should display cost analysis', () => {
      cy.intercept('GET', '**/api/inventory/cost-analysis', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            totalValue: 15678.90,
            monthlySpending: 1234.56,
            budgetRemaining: 5000.00
          }
        }
      }).as('getCosts')
      
      cy.get('[data-testid="cost-tracking-tab"]').click()
      cy.wait('@getCosts')
      
      cy.contains('$15,678.90').should('be.visible')
      cy.contains('$1,234.56').should('be.visible')
    })

    it('should track spending by category', () => {
      cy.intercept('GET', '**/api/inventory/spending-by-category', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            categories: [
              { category: 'FIRST_AID', amount: 567.89 },
              { category: 'EQUIPMENT', amount: 1234.56 }
            ]
          }
        }
      }).as('getSpending')
      
      cy.get('[data-testid="cost-tracking-tab"]').click()
      cy.wait('@getSpending')
      
      cy.get('[data-testid="spending-chart"]').should('be.visible')
    })
  })

  describe('Usage Analytics', () => {
    it('should display usage trends', () => {
      cy.intercept('GET', '**/api/inventory/usage-analytics', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            trends: [
              { month: 'Jan', usage: 45 },
              { month: 'Feb', usage: 52 }
            ]
          }
        }
      }).as('getUsage')
      
      cy.get('[data-testid="analytics-tab"]').click()
      cy.wait('@getUsage')
      
      cy.get('[data-testid="usage-chart"]').should('be.visible')
    })

    it('should predict future needs', () => {
      cy.intercept('GET', '**/api/inventory/predictions', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            predictions: [
              { item: 'Bandages', predictedNeed: 175, daysUntilReorder: 15 }
            ]
          }
        }
      }).as('getPredictions')
      
      cy.get('[data-testid="analytics-tab"]').click()
      cy.get('[data-testid="predictions"]').click()
      cy.wait('@getPredictions')
      
      cy.contains('15 days').should('be.visible')
    })
  })

  describe('Search and Filter', () => {
    it('should search supplies', () => {
      cy.wait('@getSupplies')
      cy.get('[data-testid="supply-search"]').type('Bandages')
      cy.contains('Bandages').should('be.visible')
      cy.contains('Thermometers').should('not.exist')
    })

    it('should filter by stock status', () => {
      cy.wait('@getSupplies')
      cy.get('[data-testid="status-filter"]').select('LOW_STOCK')
      cy.contains('LOW_STOCK').should('be.visible')
    })

    it('should filter by location', () => {
      cy.wait('@getSupplies')
      cy.get('[data-testid="location-filter"]').select('Cabinet A')
      cy.contains('Cabinet A').should('be.visible')
    })
  })

  describe('Export and Reporting', () => {
    it('should export inventory list', () => {
      cy.wait('@getSupplies')
      
      cy.intercept('GET', '**/api/inventory/export*', {
        statusCode: 200,
        headers: { 'Content-Type': 'text/csv' },
        body: 'Name,Quantity,Status\nBandages,150,IN_STOCK'
      }).as('export')
      
      cy.get('[data-testid="export-inventory"]').click()
      cy.wait('@export')
    })

    it('should generate inventory report', () => {
      cy.wait('@getSupplies')
      
      cy.intercept('GET', '**/api/inventory/report', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            totalItems: 25,
            totalValue: 15678.90,
            lowStockCount: 3
          }
        }
      }).as('getReport')
      
      cy.get('[data-testid="generate-report"]').click()
      cy.wait('@getReport')
      
      cy.contains('25').should('be.visible')
    })
  })

  describe('Error Handling', () => {
    it('should handle API errors', () => {
      cy.intercept('GET', '**/api/inventory/supplies*', {
        statusCode: 500,
        body: { error: 'Server error' }
      }).as('error')
      
      cy.reload()
      cy.wait('@error')
      cy.contains('Failed to load inventory').should('be.visible')
    })
  })

  describe('Responsive Design', () => {
    it('should be mobile responsive', () => {
      cy.viewport('iphone-x')
      cy.contains('Inventory').should('be.visible')
    })
  })
})
