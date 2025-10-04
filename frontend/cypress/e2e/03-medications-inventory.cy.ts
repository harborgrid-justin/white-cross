/// <reference types="cypress" />

describe('Medication Management - Inventory', () => {
  beforeEach(() => {
    cy.clearCookies()
    cy.clearLocalStorage()
    
    // Mock authentication
    cy.intercept('GET', '**/api/auth/verify', {
      statusCode: 200,
      body: {
        success: true,
        data: {
          id: '1',
          email: 'nurse@school.edu',
          role: 'NURSE',
          firstName: 'Test',
          lastName: 'Nurse'
        }
      }
    }).as('verifyAuth')
    
    // Mock inventory API
    cy.intercept('GET', '**/api/medications/inventory*', {
      statusCode: 200,
      body: {
        success: true,
        data: {
          items: [
            {
              id: '1',
              name: 'Albuterol Inhaler',
              quantity: 15,
              unitOfMeasure: 'units',
              expirationDate: '2025-12-31',
              location: 'Cabinet A',
              reorderLevel: 5,
              status: 'IN_STOCK'
            },
            {
              id: '2',
              name: 'EpiPen 0.3mg',
              quantity: 3,
              unitOfMeasure: 'units',
              expirationDate: '2024-06-30',
              location: 'Emergency Kit',
              reorderLevel: 5,
              status: 'LOW_STOCK'
            },
            {
              id: '3',
              name: 'Acetaminophen 500mg',
              quantity: 0,
              unitOfMeasure: 'tablets',
              expirationDate: '2025-03-15',
              location: 'Cabinet B',
              reorderLevel: 50,
              status: 'OUT_OF_STOCK'
            }
          ],
          total: 3,
          lowStock: 1,
          expired: 0
        }
      }
    }).as('getInventory')
    
    cy.setupAuthenticationForTests()
    cy.visit('/medications')
    cy.wait('@verifyAuth')
    
    // Navigate to inventory tab
    cy.contains('button', 'Inventory').click()
  })

  describe('Inventory Display', () => {
    it('should display inventory list', () => {
      cy.wait('@getInventory')
      cy.contains('Albuterol Inhaler').should('be.visible')
      cy.contains('EpiPen 0.3mg').should('be.visible')
    })

    it('should show medication quantities', () => {
      cy.wait('@getInventory')
      cy.contains('15').should('be.visible')
      cy.contains('3').should('be.visible')
    })

    it('should display expiration dates', () => {
      cy.wait('@getInventory')
      cy.contains('2025-12-31').should('be.visible')
      cy.contains('2024-06-30').should('be.visible')
    })

    it('should show storage locations', () => {
      cy.wait('@getInventory')
      cy.contains('Cabinet A').should('be.visible')
      cy.contains('Emergency Kit').should('be.visible')
    })

    it('should highlight low stock items', () => {
      cy.wait('@getInventory')
      cy.contains('LOW_STOCK').should('be.visible')
    })

    it('should highlight out of stock items', () => {
      cy.wait('@getInventory')
      cy.contains('OUT_OF_STOCK').should('be.visible')
    })
  })

  describe('Stock Level Management', () => {
    it('should display stock level warnings', () => {
      cy.wait('@getInventory')
      
      // Low stock warning
      cy.contains('EpiPen').parent().within(() => {
        cy.contains('LOW_STOCK').should('be.visible')
      })
    })

    it('should show reorder recommendations', () => {
      cy.wait('@getInventory')
      
      // Items below reorder level
      cy.contains('Acetaminophen').parent().within(() => {
        cy.contains('OUT_OF_STOCK').should('be.visible')
      })
    })

    it('should allow filtering by stock status', () => {
      cy.wait('@getInventory')
      
      // Filter for low stock items
      cy.get('[data-testid="stock-status-filter"]').select('LOW_STOCK')
      
      cy.contains('EpiPen').should('be.visible')
      cy.contains('Albuterol').should('not.exist')
    })

    it('should calculate total inventory value', () => {
      cy.intercept('GET', '**/api/medications/inventory/statistics', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            totalValue: 4567.89,
            totalItems: 18,
            lowStockCount: 1,
            expiringSoon: 2
          }
        }
      }).as('getStats')
      
      cy.wait('@getStats')
      cy.contains('$4,567.89').should('be.visible')
    })
  })

  describe('Expiration Date Tracking', () => {
    it('should show expiration warnings', () => {
      // Mock item expiring soon
      cy.intercept('GET', '**/api/medications/inventory*', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            items: [
              {
                id: '1',
                name: 'Ibuprofen',
                quantity: 50,
                expirationDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                status: 'EXPIRING_SOON'
              }
            ]
          }
        }
      }).as('getExpiring')
      
      cy.reload()
      cy.contains('button', 'Inventory').click()
      cy.wait('@getExpiring')
      
      cy.contains('EXPIRING_SOON').should('be.visible')
    })

    it('should filter medications expiring soon', () => {
      cy.wait('@getInventory')
      
      cy.get('[data-testid="expiration-filter"]').select('EXPIRING_SOON')
      
      // Should show only expiring items
      cy.get('[data-testid="inventory-table"]').within(() => {
        cy.get('tr').should('have.length.lessThan', 4)
      })
    })

    it('should allow sorting by expiration date', () => {
      cy.wait('@getInventory')
      
      cy.get('[data-testid="sort-expiration"]').click()
      
      // Should sort ascending
      cy.get('[data-testid="inventory-table"] tbody tr').first()
        .should('contain', '2024-06-30')
    })

    it('should display expired medications separately', () => {
      cy.intercept('GET', '**/api/medications/inventory*', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            items: [
              {
                id: '1',
                name: 'Expired Med',
                quantity: 10,
                expirationDate: '2023-01-01',
                status: 'EXPIRED'
              }
            ]
          }
        }
      }).as('getExpired')
      
      cy.reload()
      cy.contains('button', 'Inventory').click()
      cy.wait('@getExpired')
      
      cy.contains('EXPIRED').should('be.visible')
      cy.contains('Expired Med').parent().should('have.class', 'bg-red-50')
    })
  })

  describe('Add Inventory Item', () => {
    it('should open add item modal', () => {
      cy.wait('@getInventory')
      
      cy.get('[data-testid="add-inventory-button"]').click()
      cy.get('[data-testid="inventory-modal"]').should('be.visible')
    })

    it('should validate required fields', () => {
      cy.wait('@getInventory')
      
      cy.get('[data-testid="add-inventory-button"]').click()
      cy.get('[data-testid="save-inventory-button"]').click()
      
      cy.contains('Name is required').should('be.visible')
      cy.contains('Quantity is required').should('be.visible')
    })

    it('should successfully add new inventory item', () => {
      cy.wait('@getInventory')
      
      cy.intercept('POST', '**/api/medications/inventory', {
        statusCode: 201,
        body: {
          success: true,
          data: {
            id: '4',
            name: 'Aspirin 81mg',
            quantity: 100,
            expirationDate: '2026-01-01'
          }
        }
      }).as('addItem')
      
      cy.get('[data-testid="add-inventory-button"]').click()
      
      cy.get('[data-testid="medication-name"]').type('Aspirin 81mg')
      cy.get('[data-testid="quantity"]').type('100')
      cy.get('[data-testid="expiration-date"]').type('2026-01-01')
      cy.get('[data-testid="location"]').type('Cabinet C')
      
      cy.get('[data-testid="save-inventory-button"]').click()
      
      cy.wait('@addItem')
      cy.contains('Inventory item added successfully').should('be.visible')
    })

    it('should validate expiration date is in future', () => {
      cy.wait('@getInventory')
      
      cy.get('[data-testid="add-inventory-button"]').click()
      
      cy.get('[data-testid="medication-name"]').type('Test Med')
      cy.get('[data-testid="quantity"]').type('10')
      cy.get('[data-testid="expiration-date"]').type('2020-01-01')
      
      cy.get('[data-testid="save-inventory-button"]').click()
      
      cy.contains('Expiration date must be in the future').should('be.visible')
    })
  })

  describe('Update Inventory', () => {
    it('should open edit modal for inventory item', () => {
      cy.wait('@getInventory')
      
      cy.get('[data-testid="edit-inventory-1"]').click()
      cy.get('[data-testid="inventory-modal"]').should('be.visible')
      cy.get('[data-testid="medication-name"]').should('have.value', 'Albuterol Inhaler')
    })

    it('should update inventory quantity', () => {
      cy.wait('@getInventory')
      
      cy.intercept('PUT', '**/api/medications/inventory/1', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            id: '1',
            name: 'Albuterol Inhaler',
            quantity: 20
          }
        }
      }).as('updateItem')
      
      cy.get('[data-testid="edit-inventory-1"]').click()
      
      cy.get('[data-testid="quantity"]').clear().type('20')
      cy.get('[data-testid="save-inventory-button"]').click()
      
      cy.wait('@updateItem')
      cy.contains('Inventory updated successfully').should('be.visible')
    })

    it('should adjust stock levels', () => {
      cy.wait('@getInventory')
      
      cy.get('[data-testid="adjust-stock-1"]').click()
      
      cy.get('[data-testid="adjustment-type"]').select('ADD')
      cy.get('[data-testid="adjustment-amount"]').type('5')
      cy.get('[data-testid="adjustment-reason"]').type('Received shipment')
      
      cy.intercept('POST', '**/api/medications/inventory/1/adjust', {
        statusCode: 200,
        body: { success: true }
      }).as('adjustStock')
      
      cy.get('[data-testid="save-adjustment"]').click()
      
      cy.wait('@adjustStock')
      cy.contains('Stock adjusted successfully').should('be.visible')
    })
  })

  describe('Reorder Management', () => {
    it('should generate reorder report', () => {
      cy.wait('@getInventory')
      
      cy.get('[data-testid="generate-reorder-report"]').click()
      
      cy.intercept('GET', '**/api/medications/inventory/reorder-report', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            items: [
              { name: 'EpiPen', currentStock: 3, reorderLevel: 5, recommended: 10 },
              { name: 'Acetaminophen', currentStock: 0, reorderLevel: 50, recommended: 100 }
            ]
          }
        }
      }).as('reorderReport')
      
      cy.wait('@reorderReport')
      cy.get('[data-testid="reorder-modal"]').should('be.visible')
      cy.contains('EpiPen').should('be.visible')
      cy.contains('Acetaminophen').should('be.visible')
    })

    it('should create purchase order from reorder list', () => {
      cy.wait('@getInventory')
      
      cy.get('[data-testid="generate-reorder-report"]').click()
      
      cy.get('[data-testid="select-item-2"]').check()
      cy.get('[data-testid="select-item-3"]').check()
      
      cy.intercept('POST', '**/api/medications/purchase-orders', {
        statusCode: 201,
        body: {
          success: true,
          data: { id: 'PO-001' }
        }
      }).as('createPO')
      
      cy.get('[data-testid="create-purchase-order"]').click()
      
      cy.wait('@createPO')
      cy.contains('Purchase order created').should('be.visible')
    })
  })

  describe('Search and Filter', () => {
    it('should search inventory by name', () => {
      cy.wait('@getInventory')
      
      cy.get('[data-testid="inventory-search"]').type('EpiPen')
      
      cy.contains('EpiPen').should('be.visible')
      cy.contains('Albuterol').should('not.exist')
    })

    it('should filter by location', () => {
      cy.wait('@getInventory')
      
      cy.get('[data-testid="location-filter"]').select('Cabinet A')
      
      cy.contains('Albuterol').should('be.visible')
      cy.contains('EpiPen').should('not.exist')
    })

    it('should filter by stock status', () => {
      cy.wait('@getInventory')
      
      cy.get('[data-testid="stock-filter"]').select('LOW_STOCK')
      
      cy.contains('EpiPen').should('be.visible')
      cy.contains('Albuterol').should('not.exist')
    })

    it('should combine multiple filters', () => {
      cy.wait('@getInventory')
      
      cy.get('[data-testid="inventory-search"]').type('EpiPen')
      cy.get('[data-testid="stock-filter"]').select('LOW_STOCK')
      
      cy.contains('EpiPen').should('be.visible')
    })

    it('should clear all filters', () => {
      cy.wait('@getInventory')
      
      cy.get('[data-testid="inventory-search"]').type('EpiPen')
      cy.get('[data-testid="clear-filters"]').click()
      
      cy.get('[data-testid="inventory-search"]').should('have.value', '')
      cy.contains('Albuterol').should('be.visible')
    })
  })

  describe('Delete Inventory Item', () => {
    it('should show confirmation dialog before deletion', () => {
      cy.wait('@getInventory')
      
      cy.get('[data-testid="delete-inventory-1"]').click()
      cy.get('[data-testid="confirm-dialog"]').should('be.visible')
      cy.contains('Are you sure you want to delete this item?').should('be.visible')
    })

    it('should cancel deletion', () => {
      cy.wait('@getInventory')
      
      cy.get('[data-testid="delete-inventory-1"]').click()
      cy.get('[data-testid="cancel-delete"]').click()
      
      cy.contains('Albuterol').should('be.visible')
    })

    it('should successfully delete inventory item', () => {
      cy.wait('@getInventory')
      
      cy.intercept('DELETE', '**/api/medications/inventory/1', {
        statusCode: 200,
        body: { success: true }
      }).as('deleteItem')
      
      cy.get('[data-testid="delete-inventory-1"]').click()
      cy.get('[data-testid="confirm-delete"]').click()
      
      cy.wait('@deleteItem')
      cy.contains('Inventory item deleted successfully').should('be.visible')
    })
  })

  describe('Export and Reporting', () => {
    it('should export inventory to CSV', () => {
      cy.wait('@getInventory')
      
      cy.get('[data-testid="export-inventory"]').click()
      cy.get('[data-testid="export-format"]').select('CSV')
      
      cy.intercept('GET', '**/api/medications/inventory/export*', {
        statusCode: 200,
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename=inventory.csv'
        },
        body: 'Name,Quantity,Expiration\nAlbuterol,15,2025-12-31'
      }).as('exportCSV')
      
      cy.get('[data-testid="download-export"]').click()
      cy.wait('@exportCSV')
    })

    it('should generate inventory report', () => {
      cy.wait('@getInventory')
      
      cy.get('[data-testid="generate-report"]').click()
      
      cy.intercept('GET', '**/api/medications/inventory/report', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            totalItems: 18,
            totalValue: 4567.89,
            lowStock: 1,
            expired: 0
          }
        }
      }).as('getReport')
      
      cy.wait('@getReport')
      cy.get('[data-testid="report-modal"]').should('be.visible')
    })
  })

  describe('Error Handling', () => {
    it('should handle inventory load errors', () => {
      cy.intercept('GET', '**/api/medications/inventory*', {
        statusCode: 500,
        body: { error: 'Server error' }
      }).as('inventoryError')
      
      cy.reload()
      cy.contains('button', 'Inventory').click()
      cy.wait('@inventoryError')
      
      cy.contains('Failed to load inventory').should('be.visible')
    })

    it('should handle add item errors', () => {
      cy.wait('@getInventory')
      
      cy.intercept('POST', '**/api/medications/inventory', {
        statusCode: 400,
        body: { error: 'Invalid data' }
      }).as('addError')
      
      cy.get('[data-testid="add-inventory-button"]').click()
      cy.get('[data-testid="medication-name"]').type('Test')
      cy.get('[data-testid="quantity"]').type('10')
      cy.get('[data-testid="save-inventory-button"]').click()
      
      cy.wait('@addError')
      cy.contains('Failed to add inventory item').should('be.visible')
    })
  })

  describe('Healthcare Compliance', () => {
    it('should track inventory changes for audit trail', () => {
      cy.wait('@getInventory')
      
      cy.intercept('POST', '**/api/audit-logs', (req) => {
        expect(req.body).to.have.property('action', 'INVENTORY_VIEW')
        req.reply({ statusCode: 200, body: { success: true } })
      }).as('auditLog')
      
      cy.wait('@auditLog')
    })

    it('should require authorization for inventory modifications', () => {
      cy.intercept('POST', '**/api/medications/inventory', {
        statusCode: 403,
        body: { error: 'Insufficient permissions' }
      }).as('unauthorized')
      
      cy.wait('@getInventory')
      cy.get('[data-testid="add-inventory-button"]').click()
      cy.get('[data-testid="medication-name"]').type('Test')
      cy.get('[data-testid="quantity"]').type('10')
      cy.get('[data-testid="save-inventory-button"]').click()
      
      cy.wait('@unauthorized')
      cy.contains('Insufficient permissions').should('be.visible')
    })
  })
})
