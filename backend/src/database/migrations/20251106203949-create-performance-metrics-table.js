'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('performance_metrics', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false
      },
      metricType: {
        type: Sequelize.STRING(50),
        allowNull: false,
        comment: 'Type of performance metric being recorded'
      },
      value: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        comment: 'Numerical value of the metric'
      },
      unit: {
        type: Sequelize.STRING(50),
        allowNull: true,
        comment: 'Unit of measurement (e.g., %, ms, GB)'
      },
      tags: {
        type: Sequelize.JSONB,
        allowNull: true,
        comment: 'Additional tags for categorizing the metric'
      },
      recordedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        comment: 'Timestamp when the metric was recorded'
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
        comment: 'Timestamp when the metric record was created'
      }
    });

    // Add indexes
    await queryInterface.addIndex('performance_metrics', ['metricType']);
    await queryInterface.addIndex('performance_metrics', ['recordedAt']);
    await queryInterface.addIndex('performance_metrics', ['createdAt'], {
      name: 'idx_performance_metric_created_at'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('performance_metrics');
  }
};
