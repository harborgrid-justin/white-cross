/**
 * Script to test creating just the students table
 */
const { Sequelize, DataType } = require('sequelize');
require('dotenv').config();

async function testStudentTable() {
  console.log('🔄 Testing student table creation...');
  
  try {
    const databaseUrl = process.env.DATABASE_URL;
    const sequelize = new Sequelize(databaseUrl, {
      dialect: 'postgres',
      logging: console.log,
      dialectOptions: databaseUrl.includes('sslmode=require') ? {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      } : {},
    });

    await sequelize.authenticate();
    console.log('✅ Database connection established.');

    // Try to create the students table manually with proper UUID default
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS "students" (
        "id" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        "studentNumber" VARCHAR(50) NOT NULL UNIQUE,
        "firstName" VARCHAR(100) NOT NULL,
        "lastName" VARCHAR(100) NOT NULL,
        "dateOfBirth" DATE NOT NULL,
        "grade" VARCHAR(10) NOT NULL,
        "gender" "public"."enum_students_gender" NOT NULL,
        "photo" VARCHAR(500),
        "medicalRecordNum" VARCHAR(50) UNIQUE,
        "isActive" BOOLEAN NOT NULL DEFAULT true,
        "enrollmentDate" TIMESTAMP WITH TIME ZONE NOT NULL,
        "nurseId" UUID REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
        "schoolId" UUID REFERENCES "schools" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
        "districtId" UUID REFERENCES "districts" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
        "createdBy" UUID,
        "updatedBy" UUID,
        "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;

    await sequelize.query(createTableSQL);
    console.log('✅ Students table created successfully!');

    await sequelize.close();
    console.log('✅ Test completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  }
}

testStudentTable();