/**
 * Check students table structure and data types
 */
const { Sequelize } = require('sequelize');
require('dotenv').config();

async function checkStudentsTable() {
  const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: false,
    dialectOptions: process.env.DATABASE_URL.includes('sslmode=require') ? {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    } : {},
  });

  try {
    console.log('🔍 Checking students table structure...');
    
    // Check if table exists
    const [tables] = await sequelize.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_name = 'students' AND table_schema = 'public'
    `);
    
    if (tables.length === 0) {
      console.log('❌ students table does not exist');
      return;
    }
    
    console.log('✅ students table exists');
    
    // Check columns, especially the id column
    const [columns] = await sequelize.query(`
      SELECT column_name, data_type, is_nullable, column_default, udt_name
      FROM information_schema.columns 
      WHERE table_name = 'students' AND table_schema = 'public'
      ORDER BY ordinal_position
    `);
    
    console.log('\n📋 Current columns:');
    columns.forEach(col => {
      console.log(`  - ${col.column_name}: ${col.data_type} (${col.udt_name}) ${col.is_nullable === 'NO' ? 'NOT NULL' : 'NULL'}`);
    });
    
    // Check the id column specifically
    const idColumn = columns.find(col => col.column_name === 'id');
    if (idColumn) {
      console.log(`\n🔍 ID Column Details:`);
      console.log(`  Type: ${idColumn.data_type}`);
      console.log(`  UDT Name: ${idColumn.udt_name}`);
      console.log(`  Default: ${idColumn.column_default}`);
    }

    // Also check academic_transcripts table if it exists
    const [academicTables] = await sequelize.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_name = 'academic_transcripts' AND table_schema = 'public'
    `);
    
    if (academicTables.length > 0) {
      console.log('\n📚 academic_transcripts table exists');
      
      const [academicColumns] = await sequelize.query(`
        SELECT column_name, data_type, udt_name
        FROM information_schema.columns 
        WHERE table_name = 'academic_transcripts' AND table_schema = 'public'
        AND column_name IN ('id', 'student_id')
        ORDER BY ordinal_position
      `);
      
      console.log('\n📋 Academic transcripts ID columns:');
      academicColumns.forEach(col => {
        console.log(`  - ${col.column_name}: ${col.data_type} (${col.udt_name})`);
      });
    } else {
      console.log('\n📚 academic_transcripts table does not exist yet');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await sequelize.close();
  }
}

checkStudentsTable();