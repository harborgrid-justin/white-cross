const { Client } = require('pg');
require('dotenv').config();

async function debugForeignKeys() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });
  
  try {
    await client.connect();
    console.log('🔌 Connected to database');
    
    // Check if the users table has UUID id
    console.log('\n📊 Checking users table structure:');
    const usersStructure = await client.query(`
      SELECT column_name, data_type, is_nullable, column_default 
      FROM information_schema.columns 
      WHERE table_name = 'users' AND table_schema = 'public'
      ORDER BY ordinal_position;
    `);
    
    if (usersStructure.rows.length > 0) {
      usersStructure.rows.forEach(row => {
        if (row.column_name === 'id') {
          console.log(`  ✅ users.id: ${row.data_type} (default: ${row.column_default})`);
        }
      });
    } else {
      console.log('  ❌ users table does not exist');
    }
    
    // Check if the schools table has UUID id
    console.log('\n📊 Checking schools table structure:');
    const schoolsStructure = await client.query(`
      SELECT column_name, data_type, is_nullable, column_default 
      FROM information_schema.columns 
      WHERE table_name = 'schools' AND table_schema = 'public'
      ORDER BY ordinal_position;
    `);
    
    if (schoolsStructure.rows.length > 0) {
      schoolsStructure.rows.forEach(row => {
        if (row.column_name === 'id') {
          console.log(`  ✅ schools.id: ${row.data_type} (default: ${row.column_default})`);
        }
      });
    } else {
      console.log('  ❌ schools table does not exist');
    }
    
    // Check if the districts table has UUID id
    console.log('\n📊 Checking districts table structure:');
    const districtsStructure = await client.query(`
      SELECT column_name, data_type, is_nullable, column_default 
      FROM information_schema.columns 
      WHERE table_name = 'districts' AND table_schema = 'public'
      ORDER BY ordinal_position;
    `);
    
    if (districtsStructure.rows.length > 0) {
      districtsStructure.rows.forEach(row => {
        if (row.column_name === 'id') {
          console.log(`  ✅ districts.id: ${row.data_type} (default: ${row.column_default})`);
        }
      });
    } else {
      console.log('  ❌ districts table does not exist');
    }
    
    // Try to create the students table manually to see the exact error
    console.log('\n🧪 Testing students table creation manually:');
    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS test_students (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          "studentNumber" VARCHAR(50) NOT NULL UNIQUE,
          "firstName" VARCHAR(100) NOT NULL,
          "lastName" VARCHAR(100) NOT NULL,
          "dateOfBirth" DATE NOT NULL,
          grade VARCHAR(10) NOT NULL,
          gender VARCHAR(50) NOT NULL,
          photo VARCHAR(500),
          "medicalRecordNum" VARCHAR(50) UNIQUE,
          "isActive" BOOLEAN NOT NULL DEFAULT true,
          "enrollmentDate" TIMESTAMP WITH TIME ZONE NOT NULL,
          "nurseId" UUID REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE,
          "schoolId" UUID REFERENCES schools(id) ON DELETE SET NULL ON UPDATE CASCADE,
          "districtId" UUID REFERENCES districts(id) ON DELETE SET NULL ON UPDATE CASCADE,
          "createdBy" UUID,
          "updatedBy" UUID,
          "createdAt" TIMESTAMP WITH TIME ZONE,
          "updatedAt" TIMESTAMP WITH TIME ZONE
        );
      `);
      console.log('  ✅ Manual students table creation succeeded');
      
      // Clean up test table
      await client.query('DROP TABLE IF EXISTS test_students;');
      console.log('  🧹 Test table cleaned up');
    } catch (error) {
      console.log('  ❌ Manual students table creation failed:');
      console.log(`     Error: ${error.message}`);
      console.log(`     Code: ${error.code}`);
    }
    
  } catch (error) {
    console.error('❌ Database connection or query error:', error);
  } finally {
    await client.end();
    console.log('\n🔌 Database connection closed');
  }
}

debugForeignKeys().catch(console.error);