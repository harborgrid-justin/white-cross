/**
 * @fileoverview Users Table Migration - Foundation for Authentication and User Management
 * @module database/migrations/00001
 * @description Creates the foundational users table for the White Cross Healthcare Platform.
 *              This table stores all system users including nurses, administrators, counselors,
 *              and district administrators with role-based access control.
 *
 * Tables Created:
 * - users: Core user authentication and profile information
 *
 * Dependencies:
 * - None (foundational migration, must run first)
 *
 * Referenced By:
 * - 00002: students table (nurseId foreign key)
 * - 00003: healthcare tables (createdBy, updatedBy)
 * - 00004: medications (prescribedBy, administeredBy)
 * - 00006: security tables (user_role_assignments)
 * - 00007: incidents (reportedById)
 * - 00008: inventory (performedById)
 * - 00009: communication (senderId, createdById)
 *
 * HIPAA Compliance:
 * - User email and authentication data is PHI when linked to patient care
 * - All user activities must be audited for compliance
 * - lastLogin tracking supports access audit requirements
 *
 * LOC: F574093447
 * WC-MIG-001 | User Authentication Foundation Migration
 *
 * @see {@link ../models/core/User} For User model definition
 * @see {@link ./00006-create-security.ts} For RBAC tables
 */

import { QueryInterface, DataTypes } from 'sequelize';

/**
 * Apply migration - Create users table with authentication and profile fields
 *
 * @async
 * @function up
 * @param {QueryInterface} queryInterface - Sequelize QueryInterface for database operations
 * @returns {Promise<void>} Resolves when migration completes successfully
 *
 * @description Creates the users table with the following schema:
 * - **id** (UUID, PK): Unique user identifier
 * - **email** (STRING, UNIQUE, NOT NULL): User email for authentication
 * - **password** (STRING, NOT NULL): Hashed password (bcrypt)
 * - **firstName** (STRING, NOT NULL): User's first name
 * - **lastName** (STRING, NOT NULL): User's last name
 * - **role** (ENUM, NOT NULL): User role (ADMIN, NURSE, SCHOOL_ADMIN, DISTRICT_ADMIN, VIEWER, COUNSELOR)
 * - **isActive** (BOOLEAN, NOT NULL, DEFAULT true): Account active status
 * - **lastLogin** (DATE, NULLABLE): Last successful login timestamp
 * - **schoolId** (STRING, NULLABLE): Associated school identifier
 * - **districtId** (STRING, NULLABLE): Associated district identifier
 * - **createdAt** (DATE, NOT NULL): Record creation timestamp
 * - **updatedAt** (DATE, NOT NULL): Last update timestamp
 *
 * Indexes Created:
 * - users_email_idx: Unique index on email for fast authentication lookups
 * - users_role_idx: Index on role for filtering users by role
 * - users_isActive_idx: Index on isActive for filtering active users
 *
 * @example
 * // Run migration
 * await queryInterface.sequelize.query('CREATE TABLE users...');
 *
 * @throws {Error} When table creation fails or indexes cannot be created
 * @security Stores hashed passwords only, never plaintext
 * @performance Indexes on email, role, and isActive optimize query performance
 */
export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.createTable('users', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('ADMIN', 'NURSE', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN', 'VIEWER', 'COUNSELOR'),
      allowNull: false,
      defaultValue: 'NURSE',
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    lastLogin: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    schoolId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    districtId: {
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

  await queryInterface.addIndex('users', ['email'], { unique: true });
  await queryInterface.addIndex('users', ['role']);
  await queryInterface.addIndex('users', ['isActive']);
}

/**
 * Rollback migration - Drop users table and all associated indexes
 *
 * @async
 * @function down
 * @param {QueryInterface} queryInterface - Sequelize QueryInterface for database operations
 * @returns {Promise<void>} Resolves when rollback completes successfully
 *
 * @description Drops the users table, which will:
 * - Remove all user records
 * - Remove all indexes (email, role, isActive)
 * - **WARNING**: This will fail if foreign key constraints exist from other tables
 *
 * Cascade Effects:
 * - Will prevent rollback if students table references users (nurseId)
 * - Will prevent rollback if any healthcare tables reference users (createdBy, updatedBy)
 * - Will prevent rollback if security tables reference users (user_role_assignments)
 *
 * @example
 * // Rollback this migration
 * await queryInterface.dropTable('users');
 *
 * @throws {Error} When foreign key constraints prevent table deletion
 * @throws {Error} When table does not exist
 * @warning This operation cannot be undone - all user data will be permanently deleted
 * @requires All dependent migrations must be rolled back first
 */
export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.dropTable('users');
}
