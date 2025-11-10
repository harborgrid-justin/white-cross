/**
 * @fileoverview Database & ORM Barrel Export
 * @module core/database
 *
 * Comprehensive database and ORM utilities including Sequelize models, queries,
 * associations, transactions, migrations, and CRUD operations.
 *
 * @example Sequelize model creation
 * ```typescript
 * import { createModel, defineAssociations } from '@reuse/core/database';
 *
 * const User = createModel(sequelize, {
 *   tableName: 'users',
 *   fields: {
 *     id: { type: DataTypes.INTEGER, primaryKey: true },
 *     email: { type: DataTypes.STRING, unique: true },
 *     name: { type: DataTypes.STRING }
 *   }
 * });
 * ```
 *
 * @example Transaction management
 * ```typescript
 * import { withTransaction } from '@reuse/core/database';
 *
 * await withTransaction(sequelize, async (transaction) => {
 *   await User.create({ email: 'user@example.com' }, { transaction });
 *   await Profile.create({ userId: user.id }, { transaction });
 * });
 * ```
 */
export * from './sequelize';
export * from './migrations';
export * from './connection-kit';
export * from './orm-kit';
export * from './schema-design-kit';
export * from './crud-kit';
export { default as ConnectionKit } from './connection-kit';
export { default as OrmKit } from './orm-kit';
export { default as SchemaDesignKit } from './schema-design-kit';
export { default as CrudKit } from './crud-kit';
//# sourceMappingURL=index.d.ts.map