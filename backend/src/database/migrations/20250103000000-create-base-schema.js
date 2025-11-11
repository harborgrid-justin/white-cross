'use strict';

/**
 * Create Base Schema Migration
 *
 * This migration creates the foundational tables for the White Cross healthcare platform:
 * - districts: School district management
 * - schools: Individual schools within districts
 * - users: System users (nurses, admins, staff)
 * - students: Student demographic information
 * - contacts: Contact management (guardians, providers, emergency contacts)
 *
 * HIPAA Compliance: All PHI fields are marked with comments for audit trail purposes
 * Security: Uses UUID primary keys, paranoid deletes for critical tables
 */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      console.log('Creating base schema tables...');

      // =====================================================
      // STEP 1: Create ENUM Types
      // =====================================================

      await queryInterface.sequelize.query(`
        DO $$ BEGIN
          CREATE TYPE "UserRole" AS ENUM (
            'ADMIN',
            'NURSE',
            'SCHOOL_ADMIN',
            'DISTRICT_ADMIN',
            'VIEWER',
            'COUNSELOR'
          );
        EXCEPTION
          WHEN duplicate_object THEN null;
        END $$;
      `, { transaction });

      await queryInterface.sequelize.query(`
        DO $$ BEGIN
          CREATE TYPE "Gender" AS ENUM (
            'MALE',
            'FEMALE',
            'OTHER',
            'PREFER_NOT_TO_SAY'
          );
        EXCEPTION
          WHEN duplicate_object THEN null;
        END $$;
      `, { transaction });

      await queryInterface.sequelize.query(`
        DO $$ BEGIN
          CREATE TYPE "ContactType" AS ENUM (
            'GUARDIAN',
            'PARENT',
            'EMERGENCY',
            'PROVIDER',
            'VENDOR',
            'STAFF',
            'OTHER'
          );
        EXCEPTION
          WHEN duplicate_object THEN null;
        END $$;
      `, { transaction });

      // =====================================================
      // STEP 2: Create districts Table
      // =====================================================

      await queryInterface.createTable('districts', {
        id: {
          type: Sequelize.UUID,
          primaryKey: true,
          allowNull: false,
          defaultValue: Sequelize.literal('gen_random_uuid()')
        },
        name: {
          type: Sequelize.STRING(200),
          allowNull: false,
          comment: 'Name of the district'
        },
        code: {
          type: Sequelize.STRING(50),
          allowNull: false,
          unique: true,
          comment: 'Unique district code'
        },
        address: {
          type: Sequelize.TEXT,
          allowNull: true,
          comment: 'Physical address of the district'
        },
        city: {
          type: Sequelize.STRING(100),
          allowNull: true,
          comment: 'City where the district is located'
        },
        state: {
          type: Sequelize.STRING(2),
          allowNull: true,
          comment: 'State code (2-letter abbreviation)'
        },
        zipCode: {
          type: Sequelize.STRING(10),
          allowNull: true,
          comment: 'ZIP code of the district'
        },
        phone: {
          type: Sequelize.STRING(20),
          allowNull: true,
          comment: 'Primary phone number for the district'
        },
        email: {
          type: Sequelize.STRING(255),
          allowNull: true,
          comment: 'Primary email address for the district'
        },
        isActive: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: true,
          comment: 'Whether the district is active'
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        }
      }, { transaction });

      // =====================================================
      // STEP 3: Create schools Table
      // =====================================================

      await queryInterface.createTable('schools', {
        id: {
          type: Sequelize.UUID,
          primaryKey: true,
          allowNull: false,
          defaultValue: Sequelize.literal('gen_random_uuid()')
        },
        name: {
          type: Sequelize.STRING(200),
          allowNull: false,
          comment: 'Name of the school'
        },
        code: {
          type: Sequelize.STRING(50),
          allowNull: false,
          unique: true,
          comment: 'Unique school code'
        },
        districtId: {
          type: Sequelize.UUID,
          allowNull: false,
          comment: 'ID of the district this school belongs to',
          references: {
            model: 'districts',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        },
        address: {
          type: Sequelize.TEXT,
          allowNull: true,
          comment: 'Physical address of the school'
        },
        city: {
          type: Sequelize.STRING(100),
          allowNull: true,
          comment: 'City where the school is located'
        },
        state: {
          type: Sequelize.STRING(2),
          allowNull: true,
          comment: 'State code (2-letter abbreviation)'
        },
        zipCode: {
          type: Sequelize.STRING(10),
          allowNull: true,
          comment: 'ZIP code of the school'
        },
        phone: {
          type: Sequelize.STRING(20),
          allowNull: true,
          comment: 'Primary phone number for the school'
        },
        email: {
          type: Sequelize.STRING(255),
          allowNull: true,
          comment: 'Primary email address for the school'
        },
        principal: {
          type: Sequelize.STRING(200),
          allowNull: true,
          comment: 'Name of the school principal'
        },
        totalEnrollment: {
          type: Sequelize.INTEGER,
          allowNull: true,
          comment: 'Total number of enrolled students'
        },
        isActive: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: true,
          comment: 'Whether the school is active'
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        }
      }, { transaction });

      // =====================================================
      // STEP 4: Create users Table
      // =====================================================

      await queryInterface.createTable('users', {
        id: {
          type: Sequelize.UUID,
          primaryKey: true,
          allowNull: false,
          defaultValue: Sequelize.literal('gen_random_uuid()')
        },
        email: {
          type: Sequelize.STRING(255),
          allowNull: false,
          unique: true,
          comment: 'User email address (unique, used for login)'
        },
        password: {
          type: Sequelize.STRING(255),
          allowNull: false,
          comment: 'Hashed password (bcrypt)'
        },
        firstName: {
          type: Sequelize.STRING(100),
          allowNull: false
        },
        lastName: {
          type: Sequelize.STRING(100),
          allowNull: false
        },
        role: {
          type: Sequelize.ENUM('ADMIN', 'NURSE', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN', 'VIEWER', 'COUNSELOR'),
          allowNull: false,
          defaultValue: 'ADMIN',
          comment: 'User role for authorization'
        },
        isActive: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: true
        },
        lastLogin: {
          type: Sequelize.DATE,
          allowNull: true
        },
        schoolId: {
          type: Sequelize.UUID,
          allowNull: true,
          comment: 'ID of the school this user is associated with',
          references: {
            model: 'schools',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL'
        },
        districtId: {
          type: Sequelize.UUID,
          allowNull: true,
          comment: 'ID of the district this user is associated with',
          references: {
            model: 'districts',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL'
        },
        phone: {
          type: Sequelize.STRING(20),
          allowNull: true
        },
        emailVerified: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false
        },
        emailVerificationToken: {
          type: Sequelize.STRING(255),
          allowNull: true
        },
        emailVerificationExpires: {
          type: Sequelize.DATE,
          allowNull: true
        },
        passwordResetToken: {
          type: Sequelize.STRING(255),
          allowNull: true
        },
        passwordResetExpires: {
          type: Sequelize.DATE,
          allowNull: true
        },
        passwordChangedAt: {
          type: Sequelize.DATE,
          allowNull: true,
          comment: 'Timestamp when password was last changed (for token invalidation)'
        },
        twoFactorEnabled: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false
        },
        twoFactorSecret: {
          type: Sequelize.STRING(255),
          allowNull: true
        },
        failedLoginAttempts: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0
        },
        lockoutUntil: {
          type: Sequelize.DATE,
          allowNull: true
        },
        lastPasswordChange: {
          type: Sequelize.DATE,
          allowNull: true,
          comment: 'Timestamp when password was last changed (for password rotation policy)'
        },
        mustChangePassword: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        }
      }, { transaction });

      // =====================================================
      // STEP 5: Create students Table
      // =====================================================

      await queryInterface.createTable('students', {
        id: {
          type: Sequelize.UUID,
          primaryKey: true,
          allowNull: false,
          defaultValue: Sequelize.literal('gen_random_uuid()')
        },
        studentNumber: {
          type: Sequelize.STRING(50),
          allowNull: false,
          unique: true,
          comment: 'School-assigned student ID - PHI'
        },
        firstName: {
          type: Sequelize.STRING(100),
          allowNull: false,
          comment: 'Student first name - PHI'
        },
        lastName: {
          type: Sequelize.STRING(100),
          allowNull: false,
          comment: 'Student last name - PHI'
        },
        dateOfBirth: {
          type: Sequelize.DATEONLY,
          allowNull: false,
          comment: 'Student date of birth - PHI'
        },
        grade: {
          type: Sequelize.STRING(10),
          allowNull: false,
          comment: 'Current grade level (e.g., K, 1, 2, 12)'
        },
        gender: {
          type: Sequelize.ENUM('MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY'),
          allowNull: false
        },
        photo: {
          type: Sequelize.STRING(500),
          allowNull: true,
          comment: 'Profile photo URL - PHI'
        },
        medicalRecordNum: {
          type: Sequelize.STRING(50),
          allowNull: true,
          unique: true,
          comment: 'Medical record number - PHI'
        },
        isActive: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: true
        },
        enrollmentDate: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        },
        nurseId: {
          type: Sequelize.UUID,
          allowNull: true,
          comment: 'Assigned nurse ID',
          references: {
            model: 'users',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL'
        },
        schoolId: {
          type: Sequelize.UUID,
          allowNull: true,
          references: {
            model: 'schools',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        },
        districtId: {
          type: Sequelize.UUID,
          allowNull: true,
          references: {
            model: 'districts',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        },
        createdBy: {
          type: Sequelize.UUID,
          allowNull: true,
          comment: 'User who created this record'
        },
        updatedBy: {
          type: Sequelize.UUID,
          allowNull: true,
          comment: 'User who last updated this record'
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        },
        deletedAt: {
          type: Sequelize.DATE,
          allowNull: true,
          comment: 'Soft delete timestamp for HIPAA compliance'
        }
      }, { transaction });

      // =====================================================
      // STEP 6: Create contacts Table
      // =====================================================

      await queryInterface.createTable('contacts', {
        id: {
          type: Sequelize.UUID,
          primaryKey: true,
          allowNull: false,
          defaultValue: Sequelize.literal('gen_random_uuid()')
        },
        firstName: {
          type: Sequelize.STRING(100),
          allowNull: false
        },
        lastName: {
          type: Sequelize.STRING(100),
          allowNull: false
        },
        email: {
          type: Sequelize.STRING(255),
          allowNull: true
        },
        phone: {
          type: Sequelize.STRING(20),
          allowNull: true
        },
        type: {
          type: Sequelize.ENUM('GUARDIAN', 'PARENT', 'EMERGENCY', 'PROVIDER', 'VENDOR', 'STAFF', 'OTHER'),
          allowNull: false
        },
        organization: {
          type: Sequelize.STRING(200),
          allowNull: true
        },
        title: {
          type: Sequelize.STRING(100),
          allowNull: true
        },
        address: {
          type: Sequelize.STRING(255),
          allowNull: true
        },
        city: {
          type: Sequelize.STRING(100),
          allowNull: true
        },
        state: {
          type: Sequelize.STRING(50),
          allowNull: true
        },
        zip: {
          type: Sequelize.STRING(20),
          allowNull: true
        },
        relationTo: {
          type: Sequelize.UUID,
          allowNull: true,
          comment: 'UUID of related student or user'
        },
        relationshipType: {
          type: Sequelize.STRING(50),
          allowNull: true,
          comment: 'Type of relationship (parent, emergency, etc.)'
        },
        customFields: {
          type: Sequelize.JSONB,
          allowNull: true,
          defaultValue: {},
          comment: 'Custom healthcare-specific fields'
        },
        isActive: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: true
        },
        notes: {
          type: Sequelize.TEXT,
          allowNull: true
        },
        createdBy: {
          type: Sequelize.UUID,
          allowNull: true,
          comment: 'User who created this contact'
        },
        updatedBy: {
          type: Sequelize.UUID,
          allowNull: true,
          comment: 'User who last updated this contact'
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        },
        deletedAt: {
          type: Sequelize.DATE,
          allowNull: true,
          comment: 'Soft delete timestamp'
        }
      }, { transaction });

      // =====================================================
      // STEP 7: Create Basic Indexes
      // =====================================================

      // Districts indexes
      await queryInterface.addIndex('districts', ['code'], {
        unique: true,
        name: 'districts_code_unique',
        transaction
      });

      await queryInterface.addIndex('districts', ['isActive'], {
        name: 'districts_isActive_idx',
        transaction
      });

      // Schools indexes
      await queryInterface.addIndex('schools', ['code'], {
        unique: true,
        name: 'schools_code_unique',
        transaction
      });

      await queryInterface.addIndex('schools', ['districtId'], {
        name: 'schools_districtId_idx',
        transaction
      });

      await queryInterface.addIndex('schools', ['isActive'], {
        name: 'schools_isActive_idx',
        transaction
      });

      // Users indexes
      await queryInterface.addIndex('users', ['email'], {
        unique: true,
        name: 'users_email_unique',
        transaction
      });

      await queryInterface.addIndex('users', ['schoolId'], {
        name: 'users_schoolId_idx',
        transaction
      });

      await queryInterface.addIndex('users', ['districtId'], {
        name: 'users_districtId_idx',
        transaction
      });

      await queryInterface.addIndex('users', ['role'], {
        name: 'users_role_idx',
        transaction
      });

      await queryInterface.addIndex('users', ['isActive'], {
        name: 'users_isActive_idx',
        transaction
      });

      // Students indexes
      await queryInterface.addIndex('students', ['studentNumber'], {
        unique: true,
        name: 'students_studentNumber_unique',
        transaction
      });

      await queryInterface.addIndex('students', ['nurseId'], {
        name: 'students_nurseId_idx',
        transaction
      });

      await queryInterface.addIndex('students', ['schoolId'], {
        name: 'students_schoolId_idx',
        transaction
      });

      await queryInterface.addIndex('students', ['districtId'], {
        name: 'students_districtId_idx',
        transaction
      });

      await queryInterface.addIndex('students', ['isActive'], {
        name: 'students_isActive_idx',
        transaction
      });

      await queryInterface.addIndex('students', ['grade'], {
        name: 'students_grade_idx',
        transaction
      });

      await queryInterface.addIndex('students', ['lastName', 'firstName'], {
        name: 'students_name_idx',
        transaction
      });

      // Contacts indexes
      await queryInterface.addIndex('contacts', ['email'], {
        name: 'contacts_email_idx',
        transaction
      });

      await queryInterface.addIndex('contacts', ['type'], {
        name: 'contacts_type_idx',
        transaction
      });

      await queryInterface.addIndex('contacts', ['relationTo'], {
        name: 'contacts_relationTo_idx',
        transaction
      });

      await queryInterface.addIndex('contacts', ['isActive'], {
        name: 'contacts_isActive_idx',
        transaction
      });

      await queryInterface.addIndex('contacts', ['firstName', 'lastName'], {
        name: 'contacts_name_idx',
        transaction
      });

      await transaction.commit();
      console.log('✓ Base schema migration completed successfully');

    } catch (error) {
      await transaction.rollback();
      console.error('✗ Migration failed:', error);
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      // Drop tables in reverse order of creation (respecting foreign key constraints)
      await queryInterface.dropTable('contacts', { transaction });
      await queryInterface.dropTable('students', { transaction });
      await queryInterface.dropTable('users', { transaction });
      await queryInterface.dropTable('schools', { transaction });
      await queryInterface.dropTable('districts', { transaction });

      // Drop enums
      await queryInterface.sequelize.query('DROP TYPE IF EXISTS "ContactType" CASCADE;', { transaction });
      await queryInterface.sequelize.query('DROP TYPE IF EXISTS "Gender" CASCADE;', { transaction });
      await queryInterface.sequelize.query('DROP TYPE IF EXISTS "UserRole" CASCADE;', { transaction });

      await transaction.commit();
      console.log('✓ Base schema rollback completed successfully');

    } catch (error) {
      await transaction.rollback();
      console.error('✗ Rollback failed:', error);
      throw error;
    }
  }
};
