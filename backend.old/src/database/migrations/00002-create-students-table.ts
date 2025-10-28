/**
 * @fileoverview Students Table Migration - Core Student Records and Demographics
 * @module database/migrations/00002
 * @description Creates the students table for managing student information in the White Cross
 *              Healthcare Platform. This table stores Protected Health Information (PHI) and
 *              must comply with HIPAA regulations for student health records.
 *
 * Tables Created:
 * - students: Student demographic and enrollment information
 *
 * Dependencies:
 * - 00001-create-users-table.ts: Required for nurseId foreign key
 *
 * Referenced By:
 * - 00003: healthcare tables (studentId foreign key for health records, allergies, etc.)
 * - 00004: medications (studentId for student_medications)
 * - 00007: incidents (studentId for incident_reports, emergency_contacts)
 *
 * HIPAA Compliance:
 * - Student records contain PHI (name, DOB, medical record number)
 * - All access must be audited via audit_logs table
 * - medicalRecordNum must be unique and protected
 * - Photo URLs must point to encrypted storage
 * - Nurse assignment (nurseId) creates care relationship requiring audit trail
 *
 * LOC: 0C923F6B94
 * WC-MIG-002 | Student Information Management Migration
 *
 * @see {@link ../models/administration/Student} For Student model definition
 * @see {@link ./00001-create-users-table.ts} For users table dependency
 * @see {@link ./00003-create-healthcare-extended.ts} For related health tables
 */

import { QueryInterface, DataTypes } from 'sequelize';

/**
 * Apply migration - Create students table with demographic and enrollment fields
 *
 * @async
 * @function up
 * @param {QueryInterface} queryInterface - Sequelize QueryInterface for database operations
 * @returns {Promise<void>} Resolves when migration completes successfully
 *
 * @description Creates the students table with the following schema:
 * - **id** (UUID, PK): Unique student identifier
 * - **studentNumber** (STRING, UNIQUE, NOT NULL): School-assigned student ID
 * - **firstName** (STRING, NOT NULL): Student's first name (PHI)
 * - **lastName** (STRING, NOT NULL): Student's last name (PHI)
 * - **dateOfBirth** (DATEONLY, NOT NULL): Student's birth date (PHI)
 * - **grade** (STRING, NOT NULL): Current grade level
 * - **gender** (ENUM, NOT NULL): Gender (MALE, FEMALE, OTHER, PREFER_NOT_TO_SAY)
 * - **photo** (STRING, NULLABLE): Profile photo URL (encrypted storage)
 * - **medicalRecordNum** (STRING, UNIQUE, NULLABLE): Medical record number (PHI)
 * - **isActive** (BOOLEAN, NOT NULL, DEFAULT true): Enrollment status
 * - **enrollmentDate** (DATE, NOT NULL): School enrollment date
 * - **nurseId** (STRING, FK, NULLABLE): Assigned nurse (references users table)
 * - **createdBy** (STRING, NULLABLE): User who created record
 * - **updatedBy** (STRING, NULLABLE): User who last updated record
 * - **createdAt** (DATE, NOT NULL): Record creation timestamp
 * - **updatedAt** (DATE, NOT NULL): Last update timestamp
 *
 * Indexes Created:
 * - students_studentNumber_idx: Unique index on studentNumber for fast lookups
 * - students_nurseId_idx: Index on nurseId for filtering by assigned nurse
 * - students_isActive_idx: Index on isActive for filtering active students
 * - students_grade_idx: Index on grade for filtering by grade level
 * - students_lastName_firstName_idx: Composite index for name-based searches
 * - students_createdBy_idx: Index on createdBy for audit trail queries
 *
 * Foreign Key Constraints:
 * - nurseId → users.id (CASCADE update, SET NULL on delete)
 *
 * @example
 * // Creates students table with nurse relationship
 * await queryInterface.createTable('students', {...});
 *
 * @throws {Error} When users table does not exist (dependency violation)
 * @throws {Error} When table creation or index creation fails
 * @security Photo URLs must point to encrypted storage with access controls
 * @hipaa All student data is PHI and requires audit logging on access
 * @performance Indexes optimize searches by student number, name, grade, and nurse
 */
export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.createTable('students', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    studentNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dateOfBirth: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    grade: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    gender: {
      type: DataTypes.ENUM('MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY'),
      allowNull: false,
    },
    photo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    medicalRecordNum: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    enrollmentDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    nurseId: {
      type: DataTypes.STRING,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
    createdBy: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    updatedBy: {
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

  await queryInterface.addIndex('students', ['studentNumber'], { unique: true });
  await queryInterface.addIndex('students', ['nurseId']);
  await queryInterface.addIndex('students', ['isActive']);
  await queryInterface.addIndex('students', ['grade']);
  await queryInterface.addIndex('students', ['lastName', 'firstName']);
  await queryInterface.addIndex('students', ['createdBy']);
}

/**
 * Rollback migration - Drop students table and all associated indexes
 *
 * @async
 * @function down
 * @param {QueryInterface} queryInterface - Sequelize QueryInterface for database operations
 * @returns {Promise<void>} Resolves when rollback completes successfully
 *
 * @description Drops the students table, which will:
 * - Remove all student records and PHI data
 * - Remove all indexes (studentNumber, nurseId, name, grade, etc.)
 * - **WARNING**: This will fail if foreign key constraints exist from health tables
 *
 * Cascade Effects:
 * - Will prevent rollback if health_records references students (studentId)
 * - Will prevent rollback if allergies references students (studentId)
 * - Will prevent rollback if medications references students (studentId)
 * - Will prevent rollback if incident_reports references students (studentId)
 * - Will prevent rollback if emergency_contacts references students (studentId)
 *
 * HIPAA Compliance:
 * - Dropping this table permanently deletes all student PHI
 * - Ensure backup exists before running rollback
 * - Audit log should record this destructive operation
 *
 * @example
 * // Rollback this migration
 * await queryInterface.dropTable('students');
 *
 * @throws {Error} When foreign key constraints prevent table deletion
 * @throws {Error} When table does not exist
 * @warning This operation cannot be undone - all student data will be permanently deleted
 * @requires All dependent migrations (00003+) must be rolled back first
 * @hipaa Permanent deletion of PHI requires proper authorization and audit trail
 */
export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.dropTable('students');
}
