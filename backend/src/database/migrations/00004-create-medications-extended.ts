import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  // Create medications table
  await queryInterface.createTable('medications', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    genericName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    dosageForm: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    strength: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    manufacturer: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    ndc: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    isControlled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
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

  // Create student_medications table
  await queryInterface.createTable('student_medications', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    studentId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'students',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    medicationId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'medications',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    },
    dosage: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    frequency: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    route: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    instructions: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    prescribedBy: {
      type: DataTypes.STRING,
      allowNull: false,
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

  // Create medication_logs table
  await queryInterface.createTable('medication_logs', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    studentMedicationId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'student_medications',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    },
    nurseId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    },
    dosageGiven: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    timeGiven: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    administeredBy: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    sideEffects: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  });

  // Create medication_inventory table
  await queryInterface.createTable('medication_inventory', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    medicationId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'medications',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    },
    batchNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    expirationDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    reorderLevel: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 10,
    },
    costPerUnit: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    supplier: {
      type: DataTypes.STRING,
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

  // Add indexes
  await queryInterface.addIndex('medications', ['ndc'], { unique: true });
  await queryInterface.addIndex('medications', ['name']);
  await queryInterface.addIndex('medications', ['isControlled']);

  await queryInterface.addIndex('student_medications', ['studentId']);
  await queryInterface.addIndex('student_medications', ['medicationId']);
  await queryInterface.addIndex('student_medications', ['isActive']);
  await queryInterface.addIndex('student_medications', ['startDate', 'endDate']);

  await queryInterface.addIndex('medication_logs', ['studentMedicationId']);
  await queryInterface.addIndex('medication_logs', ['nurseId']);
  await queryInterface.addIndex('medication_logs', ['timeGiven']);

  await queryInterface.addIndex('medication_inventory', ['medicationId']);
  await queryInterface.addIndex('medication_inventory', ['expirationDate']);
  await queryInterface.addIndex('medication_inventory', ['quantity']);
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.dropTable('medication_inventory');
  await queryInterface.dropTable('medication_logs');
  await queryInterface.dropTable('student_medications');
  await queryInterface.dropTable('medications');
}
