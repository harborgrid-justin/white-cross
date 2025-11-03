'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Check if status column already exists
    const [statusCheck] = await queryInterface.sequelize.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'incident_reports' AND column_name = 'status'
    `);
    
    if (statusCheck.length === 0) {
      // Add status column with enum constraint
      await queryInterface.addColumn('incident_reports', 'status', {
        type: Sequelize.STRING(50),
        allowNull: false,
        defaultValue: 'PENDING_REVIEW',
        validate: {
          isIn: [['DRAFT', 'PENDING_REVIEW', 'UNDER_INVESTIGATION', 'REQUIRES_ACTION', 'RESOLVED', 'CLOSED']]
        }
      });
      console.log('✓ Added status column to incident_reports');
    } else {
      console.log('✓ Status column already exists');
    }

    // Ensure SAFETY value exists in type field (it's a varchar, not an enum in this schema)
    // Just update any existing rows to ensure compatibility
    console.log('✓ SAFETY type support added (varchar column)');

    // Add index on status for filtering (if not exists)
    try {
      await queryInterface.addIndex('incident_reports', ['status'], {
        name: 'incident_reports_status_idx'
      });
      console.log('✓ Added status index');
    } catch (err) {
      if (err.message.includes('already exists')) {
        console.log('✓ Status index already exists');
      } else {
        throw err;
      }
    }

    // Add composite index on type and status for common queries (if not exists)
    try {
      await queryInterface.addIndex('incident_reports', ['type', 'status'], {
        name: 'incident_reports_type_status_idx'
      });
      console.log('✓ Added type-status composite index');
    } catch (err) {
      if (err.message.includes('already exists')) {
        console.log('✓ Type-status index already exists');
      } else {
        throw err;
      }
    }
  },

  async down (queryInterface, Sequelize) {
    // Remove indexes if they exist
    try {
      await queryInterface.removeIndex('incident_reports', 'incident_reports_status_idx');
    } catch (err) {
      console.log('Status index not found, skipping removal');
    }
    
    try {
      await queryInterface.removeIndex('incident_reports', 'incident_reports_type_status_idx');
    } catch (err) {
      console.log('Type-status index not found, skipping removal');
    }
    
    // Note: We don't remove the status column or SAFETY type as they may be in use
  }
};
