const { Client } = require('pg');
const config = require('dotenv').config();

async function fixTableSchema(client, tableName, requiredColumns) {
  console.log(`\n=== Checking ${tableName} table ===`);
  
  const tableCheck = await client.query(`
    SELECT EXISTS (
      SELECT FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = $1
    );
  `, [tableName]);

  if (tableCheck.rows[0].exists) {
    console.log(`${tableName} table exists, checking columns...`);
    
    // Check existing columns
    const columnsResult = await client.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_name = $1 
      AND table_schema = 'public'
      ORDER BY ordinal_position;
    `, [tableName]);
    
    console.log('Existing columns:');
    columnsResult.rows.forEach(row => {
      console.log(`  ${row.column_name}: ${row.data_type} (nullable: ${row.is_nullable})`);
    });

    const existingColumns = columnsResult.rows.map(row => row.column_name);
    const missingColumns = Object.keys(requiredColumns).filter(col => !existingColumns.includes(col));
    
    if (missingColumns.length > 0) {
      console.log('\nMissing columns:', missingColumns);
      console.log('Adding missing columns...');

      for (const column of missingColumns) {
        const alterQuery = requiredColumns[column];
        if (alterQuery) {
          await client.query(alterQuery);
          console.log(`  Added column: ${column}`);
        }
      }
    } else {
      console.log('All required columns exist.');
    }
  } else {
    console.log(`${tableName} table does not exist - will be created by Sequelize`);
  }
}

async function fixAppointmentsSchema() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false
  });

  try {
    await client.connect();
    console.log('Connected to database');

    // Define required columns for each table
    const appointmentColumns = {
      'recurringGroupId': 'ALTER TABLE appointments ADD COLUMN "recurringGroupId" UUID',
      'recurringFrequency': 'ALTER TABLE appointments ADD COLUMN "recurringFrequency" VARCHAR(50)',
      'recurringEndDate': 'ALTER TABLE appointments ADD COLUMN "recurringEndDate" TIMESTAMP WITH TIME ZONE'
    };

    const vitalSignsColumns = {
      'isAbnormal': 'ALTER TABLE vital_signs ADD COLUMN "isAbnormal" BOOLEAN DEFAULT false',
      'abnormalFlags': 'ALTER TABLE vital_signs ADD COLUMN "abnormalFlags" JSON',
      'measuredBy': 'ALTER TABLE vital_signs ADD COLUMN "measuredBy" VARCHAR(255)',
      'bmi': 'ALTER TABLE vital_signs ADD COLUMN "bmi" FLOAT',
      'pain': 'ALTER TABLE vital_signs ADD COLUMN "pain" INTEGER CHECK (pain >= 0 AND pain <= 10)'
    };

    const followUpActionsColumns = {
      'incident_report_id': 'ALTER TABLE follow_up_actions ADD COLUMN "incident_report_id" UUID',
      'due_date': 'ALTER TABLE follow_up_actions ADD COLUMN "due_date" TIMESTAMP WITH TIME ZONE',
      'assigned_to': 'ALTER TABLE follow_up_actions ADD COLUMN "assigned_to" UUID',
      'completed_at': 'ALTER TABLE follow_up_actions ADD COLUMN "completed_at" TIMESTAMP WITH TIME ZONE',
      'completed_by': 'ALTER TABLE follow_up_actions ADD COLUMN "completed_by" UUID',
      'created_at': 'ALTER TABLE follow_up_actions ADD COLUMN "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW()',
      'updated_at': 'ALTER TABLE follow_up_actions ADD COLUMN "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW()',
      'status': `ALTER TABLE follow_up_actions ADD COLUMN "status" VARCHAR(20) DEFAULT 'PENDING'`,
      'priority': `ALTER TABLE follow_up_actions ADD COLUMN "priority" VARCHAR(20) DEFAULT 'MEDIUM'`
    };

    // Fix all tables
    await fixTableSchema(client, 'appointments', appointmentColumns);
    await fixTableSchema(client, 'vital_signs', vitalSignsColumns);
    await fixTableSchema(client, 'follow_up_actions', followUpActionsColumns);

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await client.end();
  }
}

fixAppointmentsSchema();