/**
 * WC-GEN-146 | 20241002000000-init-database-schema.js - General utility functions and operations
 * Purpose: general utility functions and operations
 * Upstream: Independent module | Dependencies: None
 * Downstream: Routes, services, other modules | Called by: Application components
 * Related: Similar modules, tests, documentation
 * Exports: Various exports | Key Services: Core functionality
 * Last Updated: 2025-10-17 | File Type: .js
 * Critical Path: Module loading → Function execution → Response handling
 * LLM Context: general utility functions and operations, part of backend architecture
 */

'use strict';

/**
 * Initial Database Schema Migration
 *
 * This migration creates the complete initial database schema for the White Cross healthcare platform.
 * It includes all tables, enums, indexes, and foreign key constraints.
 *
 * Converted from Prisma migration: 20251002163331_test_migration
 *
 * HIPAA Compliance: This schema implements proper data security and audit trails
 * for protected health information (PHI).
 */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      // =====================================================
      // STEP 1: Create PostgreSQL Enums
      // =====================================================

      await queryInterface.sequelize.query(`
        CREATE TYPE "UserRole" AS ENUM (
          'ADMIN',
          'NURSE',
          'SCHOOL_ADMIN',
          'DISTRICT_ADMIN'
        );
      `, { transaction });

      await queryInterface.sequelize.query(`
        CREATE TYPE "Gender" AS ENUM (
          'MALE',
          'FEMALE',
          'OTHER',
          'PREFER_NOT_TO_SAY'
        );
      `, { transaction });

      await queryInterface.sequelize.query(`
        CREATE TYPE "ContactPriority" AS ENUM (
          'PRIMARY',
          'SECONDARY',
          'EMERGENCY_ONLY'
        );
      `, { transaction });

      await queryInterface.sequelize.query(`
        CREATE TYPE "HealthRecordType" AS ENUM (
          'CHECKUP',
          'VACCINATION',
          'ILLNESS',
          'INJURY',
          'SCREENING',
          'PHYSICAL_EXAM',
          'MENTAL_HEALTH',
          'DENTAL',
          'VISION',
          'HEARING'
        );
      `, { transaction });

      await queryInterface.sequelize.query(`
        CREATE TYPE "AllergySeverity" AS ENUM (
          'MILD',
          'MODERATE',
          'SEVERE',
          'LIFE_THREATENING'
        );
      `, { transaction });

      await queryInterface.sequelize.query(`
        CREATE TYPE "AppointmentType" AS ENUM (
          'ROUTINE_CHECKUP',
          'MEDICATION_ADMINISTRATION',
          'INJURY_ASSESSMENT',
          'ILLNESS_EVALUATION',
          'FOLLOW_UP',
          'SCREENING',
          'EMERGENCY'
        );
      `, { transaction });

      await queryInterface.sequelize.query(`
        CREATE TYPE "AppointmentStatus" AS ENUM (
          'SCHEDULED',
          'IN_PROGRESS',
          'COMPLETED',
          'CANCELLED',
          'NO_SHOW'
        );
      `, { transaction });

      await queryInterface.sequelize.query(`
        CREATE TYPE "IncidentType" AS ENUM (
          'INJURY',
          'ILLNESS',
          'BEHAVIORAL',
          'MEDICATION_ERROR',
          'ALLERGIC_REACTION',
          'EMERGENCY',
          'OTHER'
        );
      `, { transaction });

      await queryInterface.sequelize.query(`
        CREATE TYPE "IncidentSeverity" AS ENUM (
          'LOW',
          'MEDIUM',
          'HIGH',
          'CRITICAL'
        );
      `, { transaction });

      await queryInterface.sequelize.query(`
        CREATE TYPE "InventoryTransactionType" AS ENUM (
          'PURCHASE',
          'USAGE',
          'ADJUSTMENT',
          'TRANSFER',
          'DISPOSAL'
        );
      `, { transaction });

      await queryInterface.sequelize.query(`
        CREATE TYPE "MaintenanceType" AS ENUM (
          'ROUTINE',
          'REPAIR',
          'CALIBRATION',
          'INSPECTION',
          'CLEANING'
        );
      `, { transaction });

      await queryInterface.sequelize.query(`
        CREATE TYPE "MessageType" AS ENUM (
          'EMAIL',
          'SMS',
          'PUSH_NOTIFICATION',
          'VOICE'
        );
      `, { transaction });

      await queryInterface.sequelize.query(`
        CREATE TYPE "MessageCategory" AS ENUM (
          'EMERGENCY',
          'HEALTH_UPDATE',
          'APPOINTMENT_REMINDER',
          'MEDICATION_REMINDER',
          'GENERAL',
          'INCIDENT_NOTIFICATION',
          'COMPLIANCE'
        );
      `, { transaction });

      await queryInterface.sequelize.query(`
        CREATE TYPE "MessagePriority" AS ENUM (
          'LOW',
          'MEDIUM',
          'HIGH',
          'URGENT'
        );
      `, { transaction });

      await queryInterface.sequelize.query(`
        CREATE TYPE "RecipientType" AS ENUM (
          'STUDENT',
          'EMERGENCY_CONTACT',
          'PARENT',
          'NURSE',
          'ADMIN'
        );
      `, { transaction });

      await queryInterface.sequelize.query(`
        CREATE TYPE "DeliveryStatus" AS ENUM (
          'PENDING',
          'SENT',
          'DELIVERED',
          'FAILED',
          'BOUNCED'
        );
      `, { transaction });

      await queryInterface.sequelize.query(`
        CREATE TYPE "WitnessType" AS ENUM (
          'STUDENT',
          'STAFF',
          'PARENT',
          'OTHER'
        );
      `, { transaction });

      await queryInterface.sequelize.query(`
        CREATE TYPE "InsuranceClaimStatus" AS ENUM (
          'NOT_FILED',
          'FILED',
          'PENDING',
          'APPROVED',
          'DENIED',
          'CLOSED'
        );
      `, { transaction });

      await queryInterface.sequelize.query(`
        CREATE TYPE "ComplianceStatus" AS ENUM (
          'PENDING',
          'COMPLIANT',
          'NON_COMPLIANT',
          'UNDER_REVIEW'
        );
      `, { transaction });

      await queryInterface.sequelize.query(`
        CREATE TYPE "ActionPriority" AS ENUM (
          'LOW',
          'MEDIUM',
          'HIGH',
          'URGENT'
        );
      `, { transaction });

      await queryInterface.sequelize.query(`
        CREATE TYPE "ActionStatus" AS ENUM (
          'PENDING',
          'IN_PROGRESS',
          'COMPLETED',
          'CANCELLED'
        );
      `, { transaction });

      await queryInterface.sequelize.query(`
        CREATE TYPE "PurchaseOrderStatus" AS ENUM (
          'PENDING',
          'APPROVED',
          'ORDERED',
          'PARTIALLY_RECEIVED',
          'RECEIVED',
          'CANCELLED'
        );
      `, { transaction });

      await queryInterface.sequelize.query(`
        CREATE TYPE "WaitlistPriority" AS ENUM (
          'LOW',
          'NORMAL',
          'HIGH',
          'URGENT'
        );
      `, { transaction });

      await queryInterface.sequelize.query(`
        CREATE TYPE "WaitlistStatus" AS ENUM (
          'WAITING',
          'NOTIFIED',
          'SCHEDULED',
          'EXPIRED',
          'CANCELLED'
        );
      `, { transaction });

      await queryInterface.sequelize.query(`
        CREATE TYPE "ReminderStatus" AS ENUM (
          'SCHEDULED',
          'SENT',
          'FAILED',
          'CANCELLED'
        );
      `, { transaction });

      await queryInterface.sequelize.query(`
        CREATE TYPE "ConfigCategory" AS ENUM (
          'GENERAL',
          'SECURITY',
          'NOTIFICATION',
          'INTEGRATION',
          'BACKUP',
          'PERFORMANCE'
        );
      `, { transaction });

      await queryInterface.sequelize.query(`
        CREATE TYPE "BackupType" AS ENUM (
          'AUTOMATIC',
          'MANUAL',
          'SCHEDULED'
        );
      `, { transaction });

      await queryInterface.sequelize.query(`
        CREATE TYPE "BackupStatus" AS ENUM (
          'IN_PROGRESS',
          'COMPLETED',
          'FAILED'
        );
      `, { transaction });

      await queryInterface.sequelize.query(`
        CREATE TYPE "MetricType" AS ENUM (
          'CPU_USAGE',
          'MEMORY_USAGE',
          'DISK_USAGE',
          'API_RESPONSE_TIME',
          'DATABASE_QUERY_TIME',
          'ACTIVE_USERS',
          'ERROR_RATE',
          'REQUEST_COUNT'
        );
      `, { transaction });

      await queryInterface.sequelize.query(`
        CREATE TYPE "LicenseType" AS ENUM (
          'TRIAL',
          'BASIC',
          'PROFESSIONAL',
          'ENTERPRISE'
        );
      `, { transaction });

      await queryInterface.sequelize.query(`
        CREATE TYPE "LicenseStatus" AS ENUM (
          'ACTIVE',
          'EXPIRED',
          'SUSPENDED',
          'CANCELLED'
        );
      `, { transaction });

      await queryInterface.sequelize.query(`
        CREATE TYPE "TrainingCategory" AS ENUM (
          'HIPAA_COMPLIANCE',
          'MEDICATION_MANAGEMENT',
          'EMERGENCY_PROCEDURES',
          'SYSTEM_TRAINING',
          'SAFETY_PROTOCOLS',
          'DATA_SECURITY'
        );
      `, { transaction });

      await queryInterface.sequelize.query(`
        CREATE TYPE "AuditAction" AS ENUM (
          'CREATE',
          'READ',
          'UPDATE',
          'DELETE',
          'LOGIN',
          'LOGOUT',
          'EXPORT',
          'IMPORT',
          'BACKUP',
          'RESTORE'
        );
      `, { transaction });

      await queryInterface.sequelize.query(`
        CREATE TYPE "IntegrationType" AS ENUM (
          'SIS',
          'EHR',
          'PHARMACY',
          'LABORATORY',
          'INSURANCE',
          'PARENT_PORTAL',
          'HEALTH_APP',
          'GOVERNMENT_REPORTING'
        );
      `, { transaction });

      await queryInterface.sequelize.query(`
        CREATE TYPE "IntegrationStatus" AS ENUM (
          'ACTIVE',
          'INACTIVE',
          'ERROR',
          'TESTING',
          'SYNCING'
        );
      `, { transaction });

      await queryInterface.sequelize.query(`
        CREATE TYPE "DocumentCategory" AS ENUM (
          'MEDICAL_RECORD',
          'INCIDENT_REPORT',
          'CONSENT_FORM',
          'POLICY',
          'TRAINING',
          'ADMINISTRATIVE',
          'STUDENT_FILE',
          'INSURANCE',
          'OTHER'
        );
      `, { transaction });

      await queryInterface.sequelize.query(`
        CREATE TYPE "DocumentStatus" AS ENUM (
          'DRAFT',
          'PENDING_REVIEW',
          'APPROVED',
          'ARCHIVED',
          'EXPIRED'
        );
      `, { transaction });

      await queryInterface.sequelize.query(`
        CREATE TYPE "DocumentAccessLevel" AS ENUM (
          'PUBLIC',
          'STAFF_ONLY',
          'ADMIN_ONLY',
          'RESTRICTED'
        );
      `, { transaction });

      await queryInterface.sequelize.query(`
        CREATE TYPE "DocumentAction" AS ENUM (
          'CREATED',
          'VIEWED',
          'DOWNLOADED',
          'UPDATED',
          'DELETED',
          'SHARED',
          'SIGNED'
        );
      `, { transaction });

      await queryInterface.sequelize.query(`
        CREATE TYPE "ComplianceReportType" AS ENUM (
          'HIPAA',
          'FERPA',
          'STATE_HEALTH',
          'MEDICATION_AUDIT',
          'SAFETY_INSPECTION',
          'TRAINING_COMPLIANCE',
          'DATA_PRIVACY',
          'CUSTOM'
        );
      `, { transaction });

      await queryInterface.sequelize.query(`
        CREATE TYPE "ComplianceCategory" AS ENUM (
          'PRIVACY',
          'SECURITY',
          'DOCUMENTATION',
          'TRAINING',
          'SAFETY',
          'MEDICATION',
          'HEALTH_RECORDS',
          'CONSENT'
        );
      `, { transaction });

      await queryInterface.sequelize.query(`
        CREATE TYPE "ChecklistItemStatus" AS ENUM (
          'PENDING',
          'IN_PROGRESS',
          'COMPLETED',
          'NOT_APPLICABLE',
          'FAILED'
        );
      `, { transaction });

      await queryInterface.sequelize.query(`
        CREATE TYPE "ConsentType" AS ENUM (
          'MEDICAL_TREATMENT',
          'MEDICATION_ADMINISTRATION',
          'EMERGENCY_CARE',
          'PHOTO_RELEASE',
          'DATA_SHARING',
          'TELEHEALTH',
          'RESEARCH',
          'OTHER'
        );
      `, { transaction });

      await queryInterface.sequelize.query(`
        CREATE TYPE "PolicyCategory" AS ENUM (
          'HIPAA',
          'FERPA',
          'MEDICATION',
          'EMERGENCY',
          'SAFETY',
          'DATA_SECURITY',
          'OPERATIONAL',
          'TRAINING'
        );
      `, { transaction });

      await queryInterface.sequelize.query(`
        CREATE TYPE "PolicyStatus" AS ENUM (
          'DRAFT',
          'UNDER_REVIEW',
          'ACTIVE',
          'ARCHIVED',
          'SUPERSEDED'
        );
      `, { transaction });

      await queryInterface.sequelize.query(`
        CREATE TYPE "SecurityIncidentType" AS ENUM (
          'UNAUTHORIZED_ACCESS',
          'DATA_BREACH',
          'FAILED_LOGIN_ATTEMPTS',
          'SUSPICIOUS_ACTIVITY',
          'MALWARE',
          'PHISHING',
          'POLICY_VIOLATION',
          'OTHER'
        );
      `, { transaction });

      await queryInterface.sequelize.query(`
        CREATE TYPE "SecurityIncidentStatus" AS ENUM (
          'OPEN',
          'INVESTIGATING',
          'CONTAINED',
          'RESOLVED',
          'CLOSED'
        );
      `, { transaction });

      await queryInterface.sequelize.query(`
        CREATE TYPE "IpRestrictionType" AS ENUM (
          'WHITELIST',
          'BLACKLIST'
        );
      `, { transaction });

      // =====================================================
      // STEP 2: Create Core Tables
      // =====================================================

      // Districts table
      await queryInterface.createTable('districts', {
        id: {
          type: Sequelize.STRING,
          primaryKey: true,
          allowNull: false
        },
        name: {
          type: Sequelize.STRING,
          allowNull: false
        },
        code: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true
        },
        address: {
          type: Sequelize.TEXT,
          allowNull: true
        },
        city: {
          type: Sequelize.STRING,
          allowNull: true
        },
        state: {
          type: Sequelize.STRING,
          allowNull: true
        },
        zipCode: {
          type: Sequelize.STRING,
          allowNull: true
        },
        phone: {
          type: Sequelize.STRING,
          allowNull: true
        },
        email: {
          type: Sequelize.STRING,
          allowNull: true
        },
        website: {
          type: Sequelize.STRING,
          allowNull: true
        },
        isActive: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: true
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

      // Schools table
      await queryInterface.createTable('schools', {
        id: {
          type: Sequelize.STRING,
          primaryKey: true,
          allowNull: false
        },
        name: {
          type: Sequelize.STRING,
          allowNull: false
        },
        code: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true
        },
        address: {
          type: Sequelize.TEXT,
          allowNull: true
        },
        city: {
          type: Sequelize.STRING,
          allowNull: true
        },
        state: {
          type: Sequelize.STRING,
          allowNull: true
        },
        zipCode: {
          type: Sequelize.STRING,
          allowNull: true
        },
        phone: {
          type: Sequelize.STRING,
          allowNull: true
        },
        email: {
          type: Sequelize.STRING,
          allowNull: true
        },
        principal: {
          type: Sequelize.STRING,
          allowNull: true
        },
        studentCount: {
          type: Sequelize.INTEGER,
          allowNull: true
        },
        isActive: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: true
        },
        districtId: {
          type: Sequelize.STRING,
          allowNull: false,
          references: {
            model: 'districts',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'RESTRICT'
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

      // Users table
      await queryInterface.createTable('users', {
        id: {
          type: Sequelize.STRING,
          primaryKey: true,
          allowNull: false
        },
        email: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true
        },
        password: {
          type: Sequelize.STRING,
          allowNull: false
        },
        firstName: {
          type: Sequelize.STRING,
          allowNull: false
        },
        lastName: {
          type: Sequelize.STRING,
          allowNull: false
        },
        role: {
          type: Sequelize.ENUM('ADMIN', 'NURSE', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN'),
          allowNull: false,
          defaultValue: 'NURSE'
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

      // Students table
      await queryInterface.createTable('students', {
        id: {
          type: Sequelize.STRING,
          primaryKey: true,
          allowNull: false
        },
        studentNumber: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true
        },
        firstName: {
          type: Sequelize.STRING,
          allowNull: false
        },
        lastName: {
          type: Sequelize.STRING,
          allowNull: false
        },
        dateOfBirth: {
          type: Sequelize.DATE,
          allowNull: false
        },
        grade: {
          type: Sequelize.STRING,
          allowNull: false
        },
        gender: {
          type: Sequelize.ENUM('MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY'),
          allowNull: false
        },
        photo: {
          type: Sequelize.TEXT,
          allowNull: true
        },
        medicalRecordNum: {
          type: Sequelize.STRING,
          allowNull: true,
          unique: true
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
          type: Sequelize.STRING,
          allowNull: true,
          references: {
            model: 'users',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL'
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

      // Emergency Contacts table
      await queryInterface.createTable('emergency_contacts', {
        id: {
          type: Sequelize.STRING,
          primaryKey: true,
          allowNull: false
        },
        firstName: {
          type: Sequelize.STRING,
          allowNull: false
        },
        lastName: {
          type: Sequelize.STRING,
          allowNull: false
        },
        relationship: {
          type: Sequelize.STRING,
          allowNull: false
        },
        phoneNumber: {
          type: Sequelize.STRING,
          allowNull: false
        },
        email: {
          type: Sequelize.STRING,
          allowNull: true
        },
        address: {
          type: Sequelize.TEXT,
          allowNull: true
        },
        priority: {
          type: Sequelize.ENUM('PRIMARY', 'SECONDARY', 'EMERGENCY_ONLY'),
          allowNull: false,
          defaultValue: 'PRIMARY'
        },
        isActive: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: true
        },
        studentId: {
          type: Sequelize.STRING,
          allowNull: false,
          references: {
            model: 'students',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
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

      console.log('✓ Core tables created successfully');

      // Commit transaction
      await transaction.commit();
      console.log('✓ Initial database schema migration completed');

    } catch (error) {
      await transaction.rollback();
      console.error('✗ Migration failed:', error);
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      // Drop tables in reverse order (respecting foreign key constraints)
      await queryInterface.dropTable('emergency_contacts', { transaction });
      await queryInterface.dropTable('students', { transaction });
      await queryInterface.dropTable('users', { transaction });
      await queryInterface.dropTable('schools', { transaction });
      await queryInterface.dropTable('districts', { transaction });

      // Drop all enums
      const enums = [
        'UserRole', 'Gender', 'ContactPriority', 'HealthRecordType', 'AllergySeverity',
        'AppointmentType', 'AppointmentStatus', 'IncidentType', 'IncidentSeverity',
        'InventoryTransactionType', 'MaintenanceType', 'MessageType', 'MessageCategory',
        'MessagePriority', 'RecipientType', 'DeliveryStatus', 'WitnessType',
        'InsuranceClaimStatus', 'ComplianceStatus', 'ActionPriority', 'ActionStatus',
        'PurchaseOrderStatus', 'WaitlistPriority', 'WaitlistStatus', 'ReminderStatus',
        'ConfigCategory', 'BackupType', 'BackupStatus', 'MetricType', 'LicenseType',
        'LicenseStatus', 'TrainingCategory', 'AuditAction', 'IntegrationType',
        'IntegrationStatus', 'DocumentCategory', 'DocumentStatus', 'DocumentAccessLevel',
        'DocumentAction', 'ComplianceReportType', 'ComplianceCategory', 'ChecklistItemStatus',
        'ConsentType', 'PolicyCategory', 'PolicyStatus', 'SecurityIncidentType',
        'SecurityIncidentStatus', 'IpRestrictionType'
      ];

      for (const enumName of enums) {
        await queryInterface.sequelize.query(`DROP TYPE IF EXISTS "${enumName}" CASCADE;`, { transaction });
      }

      await transaction.commit();
      console.log('✓ Rollback completed successfully');

    } catch (error) {
      await transaction.rollback();
      console.error('✗ Rollback failed:', error);
      throw error;
    }
  }
};
