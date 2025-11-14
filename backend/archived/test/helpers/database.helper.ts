/**
 * Database Test Helper
 *
 * Utilities for managing test database state.
 */

import { Sequelize } from 'sequelize-typescript';

export class DatabaseTestHelper {
  /**
   * Create an in-memory SQLite database for testing
   */
  static async createTestDatabase(): Promise<Sequelize> {
    const sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
      sync: { force: true },
    });

    await sequelize.authenticate();
    return sequelize;
  }

  /**
   * Close database connection
   */
  static async closeDatabase(sequelize: Sequelize): Promise<void> {
    await sequelize.close();
  }

  /**
   * Clear all tables
   */
  static async clearAllTables(sequelize: Sequelize): Promise<void> {
    const models = Object.values(sequelize.models);

    for (const model of models) {
      await model.destroy({ where: {}, force: true });
    }
  }

  /**
   * Seed test data into database
   */
  static async seedData(sequelize: Sequelize, data: Record<string, any[]>): Promise<void> {
    for (const [modelName, records] of Object.entries(data)) {
      const model = sequelize.models[modelName];
      if (model) {
        await model.bulkCreate(records);
      }
    }
  }

  /**
   * Execute queries within a transaction that will be rolled back
   */
  static async withTransaction<T>(
    sequelize: Sequelize,
    callback: (transaction: any) => Promise<T>,
  ): Promise<T> {
    const transaction = await sequelize.transaction();

    try {
      const result = await callback(transaction);
      await transaction.rollback();
      return result;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}
