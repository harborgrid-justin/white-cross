import { QueryInterface, DataTypes } from 'sequelize';

/**
 * Migration: Drug Interactions System
 * Feature 48: Drug reference guides and interaction checker
 */

export default {
  async up(queryInterface: QueryInterface): Promise<void> {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      // Create drug catalog table
      await queryInterface.createTable('drug_catalog', {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        rxnormId: {
          type: DataTypes.STRING(50),
          allowNull: true,
          unique: true,
          field: 'rxnorm_id',
        },
        genericName: {
          type: DataTypes.STRING(255),
          allowNull: false,
          field: 'generic_name',
        },
        brandNames: {
          type: DataTypes.ARRAY(DataTypes.STRING),
          allowNull: true,
          field: 'brand_names',
        },
        drugClass: {
          type: DataTypes.STRING(100),
          allowNull: true,
          field: 'drug_class',
        },
        fdaApproved: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: true,
          field: 'fda_approved',
        },
        commonDoses: {
          type: DataTypes.JSONB,
          allowNull: true,
          field: 'common_doses',
        },
        sideEffects: {
          type: DataTypes.ARRAY(DataTypes.TEXT),
          allowNull: true,
          field: 'side_effects',
        },
        contraindications: {
          type: DataTypes.ARRAY(DataTypes.TEXT),
          allowNull: true,
        },
        warnings: {
          type: DataTypes.ARRAY(DataTypes.TEXT),
          allowNull: true,
        },
        isActive: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: true,
          field: 'is_active',
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
          field: 'created_at',
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
          field: 'updated_at',
        },
      }, { transaction });

      // Create drug interactions table
      await queryInterface.createTable('drug_interactions', {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        drug1Id: {
          type: DataTypes.UUID,
          allowNull: false,
          references: { model: 'drug_catalog', key: 'id' },
          field: 'drug1_id',
        },
        drug2Id: {
          type: DataTypes.UUID,
          allowNull: false,
          references: { model: 'drug_catalog', key: 'id' },
          field: 'drug2_id',
        },
        severity: {
          type: DataTypes.ENUM('NONE', 'MINOR', 'MODERATE', 'MAJOR', 'SEVERE', 'UNKNOWN'),
          allowNull: false,
          defaultValue: 'MODERATE',
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        clinicalEffects: {
          type: DataTypes.TEXT,
          allowNull: true,
          field: 'clinical_effects',
        },
        mechanism: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        management: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        evidenceLevel: {
          type: DataTypes.ENUM('THEORETICAL', 'CASE_REPORT', 'STUDY', 'ESTABLISHED'),
          allowNull: false,
          defaultValue: 'STUDY',
          field: 'evidence_level',
        },
        references: {
          type: DataTypes.ARRAY(DataTypes.TEXT),
          allowNull: true,
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
          field: 'created_at',
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
          field: 'updated_at',
        },
      }, { transaction });

      // Create student drug allergies cross-reference table
      await queryInterface.createTable('student_drug_allergies', {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        studentId: {
          type: DataTypes.UUID,
          allowNull: false,
          references: { model: 'students', key: 'id' },
          field: 'student_id',
        },
        drugId: {
          type: DataTypes.UUID,
          allowNull: true,
          references: { model: 'drug_catalog', key: 'id' },
          field: 'drug_id',
        },
        allergyDescription: {
          type: DataTypes.TEXT,
          allowNull: false,
          field: 'allergy_description',
        },
        reaction: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        severity: {
          type: DataTypes.ENUM('MILD', 'MODERATE', 'SEVERE', 'LIFE_THREATENING'),
          allowNull: false,
          defaultValue: 'MODERATE',
        },
        verifiedBy: {
          type: DataTypes.UUID,
          allowNull: true,
          references: { model: 'users', key: 'id' },
          field: 'verified_by',
        },
        verifiedAt: {
          type: DataTypes.DATE,
          allowNull: true,
          field: 'verified_at',
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
          field: 'created_at',
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
          field: 'updated_at',
        },
      }, { transaction });

      // Create indexes
      await queryInterface.addIndex('drug_catalog', ['generic_name'], {
        name: 'idx_drug_catalog_generic',
        transaction,
      });

      await queryInterface.addIndex('drug_catalog', ['rxnorm_id'], {
        name: 'idx_drug_catalog_rxnorm',
        transaction,
      });

      await queryInterface.addIndex('drug_interactions', ['drug1_id', 'drug2_id'], {
        name: 'idx_drug_interactions_pair',
        transaction,
      });

      await queryInterface.addIndex('drug_interactions', ['severity'], {
        name: 'idx_drug_interactions_severity',
        transaction,
      });

      await queryInterface.addIndex('student_drug_allergies', ['student_id'], {
        name: 'idx_student_allergies_student',
        transaction,
      });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  async down(queryInterface: QueryInterface): Promise<void> {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.dropTable('student_drug_allergies', { transaction });
      await queryInterface.dropTable('drug_interactions', { transaction });
      await queryInterface.dropTable('drug_catalog', { transaction });
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
};
