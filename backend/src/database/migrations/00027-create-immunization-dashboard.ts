import { QueryInterface, DataTypes } from 'sequelize';

export default {
  async up(queryInterface: QueryInterface): Promise<void> {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.createTable('immunization_reminders', {
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        studentId: { type: DataTypes.UUID, allowNull: false, references: { model: 'students', key: 'id' }, field: 'student_id' },
        vaccineId: { type: DataTypes.UUID, allowNull: false, references: { model: 'vaccinations', key: 'id' }, field: 'vaccine_id' },
        dueDate: { type: DataTypes.DATE, allowNull: false, field: 'due_date' },
        status: { type: DataTypes.ENUM('PENDING', 'SENT', 'ACKNOWLEDGED', 'COMPLETED', 'OVERDUE'), allowNull: false, defaultValue: 'PENDING' },
        remindersSent: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0, field: 'reminders_sent' },
        lastReminderSentAt: { type: DataTypes.DATE, allowNull: true, field: 'last_reminder_sent_at' },
        completedAt: { type: DataTypes.DATE, allowNull: true, field: 'completed_at' },
        notes: { type: DataTypes.TEXT, allowNull: true },
        createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW, field: 'created_at' },
        updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW, field: 'updated_at' },
      }, { transaction });

      await queryInterface.createTable('vaccination_schedules', {
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        vaccineName: { type: DataTypes.STRING(255), allowNull: false, field: 'vaccine_name' },
        cvxCode: { type: DataTypes.STRING(10), allowNull: true, field: 'cvx_code' },
        requiredDoses: { type: DataTypes.INTEGER, allowNull: false, field: 'required_doses' },
        ageSchedule: { type: DataTypes.JSONB, allowNull: false, comment: 'Schedule by age', field: 'age_schedule' },
        isRequired: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true, field: 'is_required' },
        stateRequirement: { type: DataTypes.STRING(2), allowNull: true, field: 'state_requirement' },
        createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW, field: 'created_at' },
        updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW, field: 'updated_at' },
      }, { transaction });

      await queryInterface.addIndex('immunization_reminders', ['student_id', 'status'], { name: 'idx_imm_reminders_student_status', transaction });
      await queryInterface.addIndex('immunization_reminders', ['due_date'], { name: 'idx_imm_reminders_due_date', transaction });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  async down(queryInterface: QueryInterface): Promise<void> {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.dropTable('vaccination_schedules', { transaction });
      await queryInterface.dropTable('immunization_reminders', { transaction });
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
};
