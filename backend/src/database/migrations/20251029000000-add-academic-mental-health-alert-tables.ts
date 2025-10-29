import { QueryInterface, DataTypes } from 'sequelize';

/**
 * Migration: Add Academic Transcript, Mental Health Record, and Alert Rule Tables
 *
 * This migration creates three new tables and adds relationships to the students table:
 * 1. academic_transcripts - Stores student academic records
 * 2. mental_health_records - Stores mental health records with enhanced confidentiality
 * 3. alert_rules - Stores alert rule configurations
 */

export async function up(queryInterface: QueryInterface): Promise<void> {
  // Create academic_transcripts table
  await queryInterface.createTable('academic_transcripts', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    student_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'students',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    },
    academic_year: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    semester: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    grade: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    gpa: {
      type: DataTypes.DECIMAL(3, 2),
      allowNull: false,
      defaultValue: 0.0,
    },
    subjects: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
    },
    attendance: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {
        totalDays: 0,
        presentDays: 0,
        absentDays: 0,
        tardyDays: 0,
        attendanceRate: 0,
      },
    },
    behavior: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {
        conductGrade: 'N/A',
        incidents: 0,
        commendations: 0,
      },
    },
    imported_by: {
      type: DataTypes.UUID,
    },
    imported_at: {
      type: DataTypes.DATE,
    },
    import_source: {
      type: DataTypes.STRING(100),
    },
    metadata: {
      type: DataTypes.JSONB,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  });

  // Create indexes for academic_transcripts
  await queryInterface.addIndex('academic_transcripts', ['student_id'], {
    name: 'academic_transcripts_student_id_idx',
  });
  await queryInterface.addIndex('academic_transcripts', ['academic_year'], {
    name: 'academic_transcripts_academic_year_idx',
  });
  await queryInterface.addIndex('academic_transcripts', ['gpa'], {
    name: 'academic_transcripts_gpa_idx',
  });
  await queryInterface.addIndex('academic_transcripts', ['imported_by'], {
    name: 'academic_transcripts_imported_by_idx',
  });
  await queryInterface.addIndex('academic_transcripts', ['student_id', 'academic_year', 'semester'], {
    name: 'academic_transcripts_student_year_semester_unique',
    unique: true,
  });

  // Create mental_health_records table
  await queryInterface.createTable('mental_health_records', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    student_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'students',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    },
    record_type: {
      type: DataTypes.ENUM(
        'ASSESSMENT',
        'COUNSELING_SESSION',
        'CRISIS_INTERVENTION',
        'THERAPY_SESSION',
        'PSYCHIATRIC_EVALUATION',
        'SCREENING',
        'FOLLOW_UP',
        'REFERRAL',
        'PROGRESS_NOTE'
      ),
      allowNull: false,
    },
    record_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    counselor_id: {
      type: DataTypes.UUID,
    },
    therapist_id: {
      type: DataTypes.UUID,
    },
    psychiatrist_id: {
      type: DataTypes.UUID,
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    session_notes: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    assessment: {
      type: DataTypes.TEXT,
    },
    diagnosis: {
      type: DataTypes.TEXT,
    },
    diagnosis_code: {
      type: DataTypes.STRING(20),
    },
    treatment_plan: {
      type: DataTypes.TEXT,
    },
    risk_level: {
      type: DataTypes.ENUM('NONE', 'LOW', 'MODERATE', 'HIGH', 'CRITICAL'),
      allowNull: false,
      defaultValue: 'NONE',
    },
    risk_factors: {
      type: DataTypes.ARRAY(DataTypes.TEXT),
    },
    protective_factors: {
      type: DataTypes.ARRAY(DataTypes.TEXT),
    },
    interventions: {
      type: DataTypes.ARRAY(DataTypes.TEXT),
    },
    follow_up_required: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    follow_up_date: {
      type: DataTypes.DATE,
    },
    follow_up_completed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    referral_to: {
      type: DataTypes.STRING(200),
    },
    referral_reason: {
      type: DataTypes.TEXT,
    },
    confidentiality_level: {
      type: DataTypes.ENUM('STANDARD', 'ENHANCED', 'MAXIMUM'),
      allowNull: false,
      defaultValue: 'STANDARD',
    },
    parent_notified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    parent_notification_date: {
      type: DataTypes.DATE,
    },
    attachments: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
    },
    metadata: {
      type: DataTypes.JSONB,
    },
    created_by: {
      type: DataTypes.UUID,
    },
    updated_by: {
      type: DataTypes.UUID,
    },
    access_log: {
      type: DataTypes.JSONB,
      defaultValue: [],
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  });

  // Create indexes for mental_health_records
  await queryInterface.addIndex('mental_health_records', ['student_id'], {
    name: 'mental_health_records_student_id_idx',
  });
  await queryInterface.addIndex('mental_health_records', ['record_type'], {
    name: 'mental_health_records_record_type_idx',
  });
  await queryInterface.addIndex('mental_health_records', ['risk_level'], {
    name: 'mental_health_records_risk_level_idx',
  });
  await queryInterface.addIndex('mental_health_records', ['counselor_id'], {
    name: 'mental_health_records_counselor_id_idx',
  });
  await queryInterface.addIndex('mental_health_records', ['record_date'], {
    name: 'mental_health_records_record_date_idx',
  });
  await queryInterface.addIndex('mental_health_records', ['follow_up_required', 'follow_up_date'], {
    name: 'mental_health_records_follow_up_idx',
  });
  await queryInterface.addIndex('mental_health_records', ['student_id', 'record_date'], {
    name: 'mental_health_records_student_date_idx',
  });

  // Create alert_rules table
  await queryInterface.createTable('alert_rules', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(200),
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
    },
    category: {
      type: DataTypes.ENUM('HEALTH', 'SAFETY', 'COMPLIANCE', 'SYSTEM', 'MEDICATION', 'APPOINTMENT'),
      allowNull: false,
    },
    severity: {
      type: DataTypes.ENUM('INFO', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL', 'EMERGENCY'),
      allowNull: false,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    priority: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    trigger_conditions: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    notification_channels: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
    },
    target_roles: {
      type: DataTypes.ARRAY(DataTypes.STRING),
    },
    target_users: {
      type: DataTypes.ARRAY(DataTypes.UUID),
    },
    school_id: {
      type: DataTypes.UUID,
    },
    district_id: {
      type: DataTypes.UUID,
    },
    auto_escalate_after: {
      type: DataTypes.INTEGER,
    },
    cooldown_period: {
      type: DataTypes.INTEGER,
    },
    requires_acknowledgment: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    expires_after: {
      type: DataTypes.INTEGER,
    },
    metadata: {
      type: DataTypes.JSONB,
    },
    created_by: {
      type: DataTypes.UUID,
    },
    updated_by: {
      type: DataTypes.UUID,
    },
    last_triggered: {
      type: DataTypes.DATE,
    },
    trigger_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  });

  // Create indexes for alert_rules
  await queryInterface.addIndex('alert_rules', ['category'], {
    name: 'alert_rules_category_idx',
  });
  await queryInterface.addIndex('alert_rules', ['severity'], {
    name: 'alert_rules_severity_idx',
  });
  await queryInterface.addIndex('alert_rules', ['is_active'], {
    name: 'alert_rules_is_active_idx',
  });
  await queryInterface.addIndex('alert_rules', ['priority'], {
    name: 'alert_rules_priority_idx',
  });
  await queryInterface.addIndex('alert_rules', ['school_id'], {
    name: 'alert_rules_school_id_idx',
  });
  await queryInterface.addIndex('alert_rules', ['district_id'], {
    name: 'alert_rules_district_id_idx',
  });
  await queryInterface.addIndex('alert_rules', ['category', 'is_active', 'priority'], {
    name: 'alert_rules_active_category_priority_idx',
  });
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  // Drop tables in reverse order
  await queryInterface.dropTable('alert_rules');
  await queryInterface.dropTable('mental_health_records');
  await queryInterface.dropTable('academic_transcripts');
}
