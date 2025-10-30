/**
 * Script to verify that the foreign key constraint between students.nurseId and users.id is working
 */
const { Sequelize } = require('sequelize');
require('dotenv').config();

async function verifyForeignKeyFix() {
  console.log('🔍 Verifying foreign key constraint fix...');
  
  try {
    const databaseUrl = process.env.DATABASE_URL;
    const sequelize = new Sequelize(databaseUrl, {
      dialect: 'postgres',
      logging: false,
      dialectOptions: databaseUrl.includes('sslmode=require') ? {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      } : {},
    });

    await sequelize.authenticate();
    console.log('✅ Database connection established.');

    // Check users table id column type
    const [usersColumns] = await sequelize.query(`
      SELECT column_name, data_type, udt_name
      FROM information_schema.columns 
      WHERE table_name = 'users' AND column_name = 'id'
    `);
    
    if (usersColumns[0]?.udt_name === 'uuid') {
      console.log('✅ Users table id column is UUID type');
    } else {
      console.log('❌ Users table id column is not UUID type:', usersColumns[0]);
    }

    // Check students table nurseId column type
    const [studentsColumns] = await sequelize.query(`
      SELECT column_name, data_type, udt_name
      FROM information_schema.columns 
      WHERE table_name = 'students' AND column_name = 'nurseId'
    `);
    
    if (studentsColumns[0]?.udt_name === 'uuid') {
      console.log('✅ Students table nurseId column is UUID type');
    } else {
      console.log('❌ Students table nurseId column is not UUID type:', studentsColumns[0]);
    }

    // Check if foreign key constraint exists
    const [foreignKeys] = await sequelize.query(`
      SELECT 
        tc.constraint_name,
        kcu.column_name,
        ccu.table_name AS referenced_table_name,
        ccu.column_name AS referenced_column_name
      FROM 
        information_schema.table_constraints AS tc 
        JOIN information_schema.key_column_usage AS kcu
          ON tc.constraint_name = kcu.constraint_name
        JOIN information_schema.constraint_column_usage AS ccu
          ON ccu.constraint_name = tc.constraint_name
      WHERE tc.constraint_type = 'FOREIGN KEY' 
        AND tc.table_name = 'students' 
        AND kcu.column_name = 'nurseId'
        AND ccu.table_name = 'users'
        AND ccu.column_name = 'id';
    `);
    
    if (foreignKeys.length > 0) {
      console.log('✅ Foreign key constraint exists:', foreignKeys[0].constraint_name);
    } else {
      console.log('❌ Foreign key constraint not found');
    }

    await sequelize.close();
    console.log('🎉 Foreign key constraint verification completed successfully!');
    
  } catch (error) {
    console.error('❌ Verification failed:', error.message);
    process.exit(1);
  }
}

verifyForeignKeyFix().catch(console.error);
