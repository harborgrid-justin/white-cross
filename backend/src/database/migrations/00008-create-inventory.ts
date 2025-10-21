/**
 * LOC: DF391D8FC2
 * WC-GEN-023 | 00008-create-inventory.ts - General utility functions and operations
 *
 * UPSTREAM (imports from):
 *   - None (leaf node)
 *
 * DOWNSTREAM (imported by):
 *   - None (not imported)
 */

/**
 * WC-GEN-023 | 00008-create-inventory.ts - General utility functions and operations
 * Purpose: general utility functions and operations
 * Upstream: Independent module | Dependencies: sequelize
 * Downstream: Routes, services, other modules | Called by: Application components
 * Related: Similar modules, tests, documentation
 * Exports: Various exports | Key Services: Core functionality
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Module loading → Function execution → Response handling
 * LLM Context: general utility functions and operations, part of backend architecture
 */

import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  // Create inventory_items table
  await queryInterface.createTable('inventory_items', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    sku: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    supplier: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    unitCost: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    reorderLevel: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 10,
    },
    reorderQuantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 50,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  });

  // Create inventory_transactions table
  await queryInterface.createTable('inventory_transactions', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    inventoryItemId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'inventory_items',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    },
    performedById: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    },
    type: {
      type: DataTypes.ENUM('PURCHASE', 'USAGE', 'ADJUSTMENT', 'TRANSFER', 'DISPOSAL'),
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    unitCost: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    reason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    batchNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    expirationDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  });

  // Create maintenance_logs table
  await queryInterface.createTable('maintenance_logs', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    inventoryItemId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'inventory_items',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    },
    performedById: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    },
    type: {
      type: DataTypes.ENUM('ROUTINE', 'REPAIR', 'CALIBRATION', 'INSPECTION', 'CLEANING'),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    cost: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    nextMaintenanceDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    vendor: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  });

  // Create vendors table
  await queryInterface.createTable('vendors', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    contactName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    website: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    taxId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    paymentTerms: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  });

  // Create purchase_orders table
  await queryInterface.createTable('purchase_orders', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    vendorId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'vendors',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    },
    orderNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    status: {
      type: DataTypes.ENUM('PENDING', 'APPROVED', 'ORDERED', 'PARTIALLY_RECEIVED', 'RECEIVED', 'CANCELLED'),
      allowNull: false,
      defaultValue: 'PENDING',
    },
    orderDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    expectedDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    receivedDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    subtotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    tax: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    shipping: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    approvedBy: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    approvedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  });

  // Create purchase_order_items table
  await queryInterface.createTable('purchase_order_items', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    purchaseOrderId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'purchase_orders',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    inventoryItemId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    unitCost: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    totalCost: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    receivedQty: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  });

  // Create budget_categories table
  await queryInterface.createTable('budget_categories', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    fiscalYear: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    allocatedAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    spentAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  });

  // Create budget_transactions table
  await queryInterface.createTable('budget_transactions', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    categoryId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'budget_categories',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    transactionDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    referenceId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    referenceType: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  });

  // Add indexes
  await queryInterface.addIndex('inventory_items', ['sku'], { unique: true });
  await queryInterface.addIndex('inventory_items', ['category']);
  await queryInterface.addIndex('inventory_items', ['isActive']);

  await queryInterface.addIndex('inventory_transactions', ['inventoryItemId']);
  await queryInterface.addIndex('inventory_transactions', ['performedById']);
  await queryInterface.addIndex('inventory_transactions', ['type']);
  await queryInterface.addIndex('inventory_transactions', ['createdAt']);

  await queryInterface.addIndex('maintenance_logs', ['inventoryItemId']);
  await queryInterface.addIndex('maintenance_logs', ['performedById']);
  await queryInterface.addIndex('maintenance_logs', ['nextMaintenanceDate']);

  await queryInterface.addIndex('vendors', ['name']);
  await queryInterface.addIndex('vendors', ['isActive']);

  await queryInterface.addIndex('purchase_orders', ['orderNumber'], { unique: true });
  await queryInterface.addIndex('purchase_orders', ['vendorId']);
  await queryInterface.addIndex('purchase_orders', ['status']);
  await queryInterface.addIndex('purchase_orders', ['orderDate']);

  await queryInterface.addIndex('purchase_order_items', ['purchaseOrderId']);
  await queryInterface.addIndex('purchase_order_items', ['inventoryItemId']);

  await queryInterface.addIndex('budget_categories', ['fiscalYear']);
  await queryInterface.addIndex('budget_categories', ['isActive']);

  await queryInterface.addIndex('budget_transactions', ['categoryId']);
  await queryInterface.addIndex('budget_transactions', ['transactionDate']);
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.dropTable('budget_transactions');
  await queryInterface.dropTable('budget_categories');
  await queryInterface.dropTable('purchase_order_items');
  await queryInterface.dropTable('purchase_orders');
  await queryInterface.dropTable('vendors');
  await queryInterface.dropTable('maintenance_logs');
  await queryInterface.dropTable('inventory_transactions');
  await queryInterface.dropTable('inventory_items');
}
