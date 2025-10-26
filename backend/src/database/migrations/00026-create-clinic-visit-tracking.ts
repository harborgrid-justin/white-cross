import { QueryInterface, DataTypes } from 'sequelize';

export default {
  async up(queryInterface: QueryInterface): Promise<void> {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.createTable('clinic_visits', {
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        studentId: { type: DataTypes.UUID, allowNull: false, references: { model: 'students', key: 'id' }, field: 'student_id' },
        checkInTime: { type: DataTypes.DATE, allowNull: false, field: 'check_in_time' },
        checkOutTime: { type: DataTypes.DATE, allowNull: true, field: 'check_out_time' },
        reasonForVisit: { type: DataTypes.ARRAY(DataTypes.STRING), allowNull: false, field: 'reason_for_visit' },
        symptoms: { type: DataTypes.ARRAY(DataTypes.STRING), allowNull: true },
        treatment: { type: DataTypes.TEXT, allowNull: true },
        disposition: { type: DataTypes.ENUM('RETURN_TO_CLASS', 'SENT_HOME', 'EMERGENCY_TRANSPORT', 'OTHER'), allowNull: false },
        classesMissed: { type: DataTypes.ARRAY(DataTypes.STRING), allowNull: true, field: 'classes_missed' },
        minutesMissed: { type: DataTypes.INTEGER, allowNull: true, field: 'minutes_missed' },
        attendedBy: { type: DataTypes.UUID, allowNull: false, references: { model: 'users', key: 'id' }, field: 'attended_by' },
        notes: { type: DataTypes.TEXT, allowNull: true },
        createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW, field: 'created_at' },
        updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW, field: 'updated_at' },
      }, { transaction });

      await queryInterface.addIndex('clinic_visits', ['student_id'], { name: 'idx_clinic_visits_student', transaction });
      await queryInterface.addIndex('clinic_visits', ['check_in_time'], { name: 'idx_clinic_visits_checkin', transaction });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  async down(queryInterface: QueryInterface): Promise<void> {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.dropTable('clinic_visits', { transaction });
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
};
