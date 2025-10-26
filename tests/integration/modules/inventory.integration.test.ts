/**
 * Inventory Module Integration Tests
 * Tests complete inventory management and tracking workflows
 */

import { test, expect } from '../helpers/test-client';
import { TEST_INVENTORY_ITEMS, getFutureDate, getPastDate } from '../helpers/test-data';

test.describe('Inventory Module Integration', () => {
  test.describe('Inventory Item CRUD Operations', () => {
    test('should create inventory item', async ({ authenticatedContext }) => {
      const itemData = {
        ...TEST_INVENTORY_ITEMS.bandages,
        expirationDate: getFutureDate(365),
      };

      const response = await authenticatedContext.post('/api/v1/inventory', {
        data: itemData,
      });

      expect(response.ok()).toBeTruthy();
      const item = await response.json();

      expect(item.id).toBeDefined();
      expect(item.itemName).toBe('Adhesive Bandages');
      expect(item.category).toBe('first_aid');
      expect(item.quantity).toBe(100);
    });

    test('should retrieve inventory item by ID', async ({ authenticatedContext }) => {
      // Create item
      const createResponse = await authenticatedContext.post('/api/v1/inventory', {
        data: {
          ...TEST_INVENTORY_ITEMS.gloves,
        },
      });
      const created = await createResponse.json();

      // Retrieve item
      const response = await authenticatedContext.get(`/api/v1/inventory/${created.id}`);

      expect(response.ok()).toBeTruthy();
      const item = await response.json();

      expect(item.id).toBe(created.id);
      expect(item.itemName).toBe('Nitrile Gloves');
    });

    test('should update inventory quantity', async ({ authenticatedContext }) => {
      // Create item
      const createResponse = await authenticatedContext.post('/api/v1/inventory', {
        data: TEST_INVENTORY_ITEMS.bandages,
      });
      const created = await createResponse.json();

      // Update quantity
      const updateData = {
        quantity: 75,
      };

      const response = await authenticatedContext.put(`/api/v1/inventory/${created.id}`, {
        data: updateData,
      });

      expect(response.ok()).toBeTruthy();
      const updated = await response.json();

      expect(updated.quantity).toBe(75);
    });

    test('should list all inventory items with pagination', async ({
      authenticatedContext,
    }) => {
      const response = await authenticatedContext.get('/api/v1/inventory', {
        params: {
          page: 1,
          limit: 20,
        },
      });

      expect(response.ok()).toBeTruthy();
      const data = await response.json();

      expect(data.items).toBeDefined();
      expect(Array.isArray(data.items)).toBeTruthy();
      expect(data.pagination).toBeDefined();
    });

    test('should filter inventory by category', async ({ authenticatedContext }) => {
      const response = await authenticatedContext.get('/api/v1/inventory', {
        params: {
          category: 'first_aid',
        },
      });

      expect(response.ok()).toBeTruthy();
      const data = await response.json();

      data.items.forEach((item: any) => {
        expect(item.category).toBe('first_aid');
      });
    });

    test('should search inventory items', async ({ authenticatedContext }) => {
      const response = await authenticatedContext.get('/api/v1/inventory/search', {
        params: {
          query: 'bandage',
        },
      });

      expect(response.ok()).toBeTruthy();
      const data = await response.json();

      expect(data.items.length).toBeGreaterThan(0);
    });
  });

  test.describe('Stock Management', () => {
    test('should track stock adjustments', async ({ authenticatedContext }) => {
      // Create item
      const createResponse = await authenticatedContext.post('/api/v1/inventory', {
        data: { ...TEST_INVENTORY_ITEMS.bandages, quantity: 100 },
      });
      const item = await createResponse.json();

      // Record usage
      const adjustmentData = {
        itemId: item.id,
        adjustmentType: 'usage',
        quantity: -10,
        reason: 'Used for student treatment',
        adjustedBy: 'School Nurse',
      };

      const response = await authenticatedContext.post('/api/v1/inventory/adjustments', {
        data: adjustmentData,
      });

      expect(response.ok()).toBeTruthy();
      const adjustment = await response.json();

      expect(adjustment.itemId).toBe(item.id);
      expect(adjustment.quantity).toBe(-10);
      expect(adjustment.adjustmentType).toBe('usage');
    });

    test('should track stock replenishment', async ({ authenticatedContext }) => {
      // Create item
      const createResponse = await authenticatedContext.post('/api/v1/inventory', {
        data: { ...TEST_INVENTORY_ITEMS.gloves, quantity: 50 },
      });
      const item = await createResponse.json();

      // Record replenishment
      const adjustmentData = {
        itemId: item.id,
        adjustmentType: 'purchase',
        quantity: 200,
        reason: 'Stock replenishment',
        adjustedBy: 'Admin',
      };

      const response = await authenticatedContext.post('/api/v1/inventory/adjustments', {
        data: adjustmentData,
      });

      expect(response.ok()).toBeTruthy();
      const adjustment = await response.json();

      expect(adjustment.quantity).toBe(200);
      expect(adjustment.adjustmentType).toBe('purchase');
    });

    test('should retrieve adjustment history', async ({ authenticatedContext }) => {
      // Create item
      const createResponse = await authenticatedContext.post('/api/v1/inventory', {
        data: TEST_INVENTORY_ITEMS.thermometer,
      });
      const item = await createResponse.json();

      // Create adjustments
      await authenticatedContext.post('/api/v1/inventory/adjustments', {
        data: {
          itemId: item.id,
          adjustmentType: 'usage',
          quantity: -1,
          reason: 'Used',
        },
      });

      // Get history
      const response = await authenticatedContext.get(
        `/api/v1/inventory/${item.id}/adjustments`
      );

      expect(response.ok()).toBeTruthy();
      const history = await response.json();

      expect(Array.isArray(history)).toBeTruthy();
      expect(history.length).toBeGreaterThan(0);
    });
  });

  test.describe('Low Stock Alerts', () => {
    test('should identify low stock items', async ({ authenticatedContext }) => {
      // Create item with low stock
      await authenticatedContext.post('/api/v1/inventory', {
        data: {
          ...TEST_INVENTORY_ITEMS.bandages,
          quantity: 15,
          reorderLevel: 20,
        },
      });

      // Get low stock items
      const response = await authenticatedContext.get('/api/v1/inventory/low-stock');

      expect(response.ok()).toBeTruthy();
      const lowStockItems = await response.json();

      expect(Array.isArray(lowStockItems)).toBeTruthy();
      expect(lowStockItems.length).toBeGreaterThan(0);

      lowStockItems.forEach((item: any) => {
        expect(item.quantity).toBeLessThanOrEqual(item.reorderLevel);
      });
    });

    test('should create reorder alert', async ({ authenticatedContext }) => {
      // Create low stock item
      const createResponse = await authenticatedContext.post('/api/v1/inventory', {
        data: {
          ...TEST_INVENTORY_ITEMS.gloves,
          quantity: 50,
          reorderLevel: 100,
        },
      });
      const item = await createResponse.json();

      // Create reorder
      const reorderData = {
        itemId: item.id,
        quantityRequested: 500,
        urgency: 'normal',
        notes: 'Regular restock',
      };

      const response = await authenticatedContext.post('/api/v1/inventory/reorders', {
        data: reorderData,
      });

      expect(response.ok()).toBeTruthy();
      const reorder = await response.json();

      expect(reorder.itemId).toBe(item.id);
      expect(reorder.quantityRequested).toBe(500);
      expect(reorder.status).toBe('pending');
    });

    test('should complete reorder', async ({ authenticatedContext }) => {
      // Create item and reorder
      const itemResponse = await authenticatedContext.post('/api/v1/inventory', {
        data: { ...TEST_INVENTORY_ITEMS.bandages, quantity: 10 },
      });
      const item = await itemResponse.json();

      const reorderResponse = await authenticatedContext.post('/api/v1/inventory/reorders', {
        data: {
          itemId: item.id,
          quantityRequested: 100,
        },
      });
      const reorder = await reorderResponse.json();

      // Complete reorder
      const response = await authenticatedContext.put(
        `/api/v1/inventory/reorders/${reorder.id}`,
        {
          data: {
            status: 'completed',
            quantityReceived: 100,
            receivedDate: new Date().toISOString(),
          },
        }
      );

      expect(response.ok()).toBeTruthy();
      const updated = await response.json();

      expect(updated.status).toBe('completed');
      expect(updated.quantityReceived).toBe(100);
    });
  });

  test.describe('Expiration Tracking', () => {
    test('should identify expiring items', async ({ authenticatedContext }) => {
      // Create item expiring soon
      await authenticatedContext.post('/api/v1/inventory', {
        data: {
          ...TEST_INVENTORY_ITEMS.bandages,
          expirationDate: getFutureDate(20), // 20 days
        },
      });

      // Get expiring items (within 30 days)
      const response = await authenticatedContext.get('/api/v1/inventory/expiring', {
        params: {
          days: 30,
        },
      });

      expect(response.ok()).toBeTruthy();
      const expiringItems = await response.json();

      expect(Array.isArray(expiringItems)).toBeTruthy();
      expect(expiringItems.length).toBeGreaterThan(0);
    });

    test('should identify expired items', async ({ authenticatedContext }) => {
      // Create expired item
      await authenticatedContext.post('/api/v1/inventory', {
        data: {
          ...TEST_INVENTORY_ITEMS.bandages,
          expirationDate: getPastDate(10),
        },
      });

      // Get expired items
      const response = await authenticatedContext.get('/api/v1/inventory/expired');

      expect(response.ok()).toBeTruthy();
      const expiredItems = await response.json();

      expect(Array.isArray(expiredItems)).toBeTruthy();
      expiredItems.forEach((item: any) => {
        const expDate = new Date(item.expirationDate);
        const now = new Date();
        expect(expDate.getTime()).toBeLessThan(now.getTime());
      });
    });

    test('should dispose expired item', async ({ authenticatedContext }) => {
      // Create expired item
      const createResponse = await authenticatedContext.post('/api/v1/inventory', {
        data: {
          ...TEST_INVENTORY_ITEMS.bandages,
          expirationDate: getPastDate(10),
        },
      });
      const item = await createResponse.json();

      // Dispose item
      const disposeData = {
        itemId: item.id,
        disposalReason: 'expired',
        disposalDate: new Date().toISOString(),
        disposedBy: 'School Nurse',
        quantity: item.quantity,
      };

      const response = await authenticatedContext.post('/api/v1/inventory/disposals', {
        data: disposeData,
      });

      expect(response.ok()).toBeTruthy();
      const disposal = await response.json();

      expect(disposal.itemId).toBe(item.id);
      expect(disposal.disposalReason).toBe('expired');
    });
  });

  test.describe('Reporting', () => {
    test('should generate inventory valuation report', async ({ authenticatedContext }) => {
      const response = await authenticatedContext.get('/api/v1/inventory/reports/valuation');

      expect(response.ok()).toBeTruthy();
      const report = await response.json();

      expect(report.totalValue).toBeDefined();
      expect(report.itemsByCategory).toBeDefined();
    });

    test('should generate usage report', async ({ authenticatedContext }) => {
      const response = await authenticatedContext.get('/api/v1/inventory/reports/usage', {
        params: {
          startDate: getPastDate(30),
          endDate: new Date().toISOString(),
        },
      });

      expect(response.ok()).toBeTruthy();
      const report = await response.json();

      expect(report.totalUsage).toBeDefined();
      expect(report.usageByCategory).toBeDefined();
    });
  });

  test.describe('Validation and Error Handling', () => {
    test('should reject item with missing required fields', async ({
      authenticatedContext,
    }) => {
      const invalidData = {
        itemName: 'Test Item',
        // Missing category, quantity, etc.
      };

      const response = await authenticatedContext.post('/api/v1/inventory', {
        data: invalidData,
      });

      expect(response.ok()).toBeFalsy();
      expect(response.status()).toBe(400);
    });

    test('should reject negative quantity', async ({ authenticatedContext }) => {
      const invalidData = {
        ...TEST_INVENTORY_ITEMS.bandages,
        quantity: -10,
      };

      const response = await authenticatedContext.post('/api/v1/inventory', {
        data: invalidData,
      });

      expect(response.ok()).toBeFalsy();
      expect(response.status()).toBe(400);
    });

    test('should return 404 for non-existent item', async ({ authenticatedContext }) => {
      const response = await authenticatedContext.get(
        '/api/v1/inventory/00000000-0000-0000-0000-000000000000'
      );

      expect(response.status()).toBe(404);
    });
  });
});
