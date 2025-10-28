import { QueryInterface, DataTypes } from 'sequelize';

export default {
  async up(queryInterface: QueryInterface): Promise<void> {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.createTable('medicaid_eligibility', {
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        studentId: { type: DataTypes.UUID, allowNull: false, references: { model: 'students', key: 'id' }, field: 'student_id' },
        medicaidId: { type: DataTypes.STRING(50), allowNull: false, field: 'medicaid_id' },
        isEligible: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false, field: 'is_eligible' },
        effectiveDate: { type: DataTypes.DATE, allowNull: false, field: 'effective_date' },
        expirationDate: { type: DataTypes.DATE, allowNull: true, field: 'expiration_date' },
        lastVerifiedAt: { type: DataTypes.DATE, allowNull: true, field: 'last_verified_at' },
        planName: { type: DataTypes.STRING(255), allowNull: true, field: 'plan_name' },
        createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW, field: 'created_at' },
        updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW, field: 'updated_at' },
      }, { transaction });

      await queryInterface.createTable('billing_claims', {
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        claimNumber: { type: DataTypes.STRING(50), allowNull: false, unique: true, field: 'claim_number' },
        studentId: { type: DataTypes.UUID, allowNull: false, references: { model: 'students', key: 'id' }, field: 'student_id' },
        serviceDate: { type: DataTypes.DATE, allowNull: false, field: 'service_date' },
        diagnosisCodes: { type: DataTypes.ARRAY(DataTypes.STRING), allowNull: false, field: 'diagnosis_codes' },
        procedureCodes: { type: DataTypes.ARRAY(DataTypes.STRING), allowNull: false, field: 'procedure_codes' },
        totalAmount: { type: DataTypes.DECIMAL(10, 2), allowNull: false, field: 'total_amount' },
        status: { type: DataTypes.ENUM('DRAFT', 'SUBMITTED', 'PENDING', 'APPROVED', 'DENIED', 'PAID'), allowNull: false, defaultValue: 'DRAFT' },
        submittedAt: { type: DataTypes.DATE, allowNull: true, field: 'submitted_at' },
        submittedBy: { type: DataTypes.UUID, allowNull: true, references: { model: 'users', key: 'id' }, field: 'submitted_by' },
        paidAmount: { type: DataTypes.DECIMAL(10, 2), allowNull: true, field: 'paid_amount' },
        paidAt: { type: DataTypes.DATE, allowNull: true, field: 'paid_at' },
        denialReason: { type: DataTypes.TEXT, allowNull: true, field: 'denial_reason' },
        createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW, field: 'created_at' },
        updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW, field: 'updated_at' },
      }, { transaction });

      await queryInterface.addIndex('medicaid_eligibility', ['student_id'], { name: 'idx_medicaid_student', transaction });
      await queryInterface.addIndex('billing_claims', ['student_id'], { name: 'idx_claims_student', transaction });
      await queryInterface.addIndex('billing_claims', ['status'], { name: 'idx_claims_status', transaction });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  async down(queryInterface: QueryInterface): Promise<void> {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.dropTable('billing_claims', { transaction });
      await queryInterface.dropTable('medicaid_eligibility', { transaction });
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
};
