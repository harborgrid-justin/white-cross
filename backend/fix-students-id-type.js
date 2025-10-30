/**
 * Fix students table ID column type from VARCHAR to UUID
 */
const { Sequelize } = require('sequelize');
require('dotenv').config();

async function fixStudentsIdType() {
  const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: console.log,
    dialectOptions: process.env.DATABASE_URL.includes('sslmode=require') ? {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    } : {},
  });

  try {
    console.log('🔧 Starting students table ID column type fix...');
    
    await sequelize.transaction(async (t) => {
      // First, check if there's any existing data
      const [existingData] = await sequelize.query(`
        SELECT COUNT(*) as count FROM students
      `, { transaction: t });
      
      const recordCount = existingData[0].count;
      console.log(`📊 Found ${recordCount} existing records in students table`);
      
      if (recordCount > 0) {
        console.log('⚠️  Warning: Table has existing data. This operation may be destructive.');
        
        // Check if any existing IDs are already valid UUIDs
        const [validUuids] = await sequelize.query(`
          SELECT COUNT(*) as count FROM students 
          WHERE id ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
        `, { transaction: t });
        
        console.log(`📊 ${validUuids[0].count} records have valid UUID format`);
        
        if (validUuids[0].count < recordCount) {
          console.log('❌ Some records do not have valid UUID IDs. Manual data migration required.');
          console.log('💡 Consider backing up data and updating IDs to UUID format first.');
          return;
        }
      }
      
      console.log('🔄 Altering students table ID column to UUID...');
      
      // Drop any dependent constraints first
      console.log('🔗 Checking for dependent foreign keys...');
      const [foreignKeys] = await sequelize.query(`
        SELECT 
          tc.table_name, 
          kcu.column_name,
          ccu.table_name AS foreign_table_name,
          ccu.column_name AS foreign_column_name,
          tc.constraint_name
        FROM 
          information_schema.table_constraints AS tc 
          JOIN information_schema.key_column_usage AS kcu
            ON tc.constraint_name = kcu.constraint_name
          JOIN information_schema.constraint_column_usage AS ccu
            ON ccu.constraint_name = tc.constraint_name
        WHERE tc.constraint_type = 'FOREIGN KEY' 
          AND ccu.table_name = 'students' 
          AND ccu.column_name = 'id';
      `, { transaction: t });
      
      // Drop foreign key constraints temporarily
      for (const fk of foreignKeys) {
        console.log(`🔗 Dropping foreign key: ${fk.constraint_name} from ${fk.table_name}`);
        await sequelize.query(`
          ALTER TABLE "${fk.table_name}" DROP CONSTRAINT IF EXISTS "${fk.constraint_name}"
        `, { transaction: t });
      }
      
      // Now alter the column type
      await sequelize.query(`
        ALTER TABLE students 
        ALTER COLUMN id TYPE UUID USING id::UUID
      `, { transaction: t });
      
      console.log('✅ Successfully changed students.id to UUID type');
      
      // Recreate foreign key constraints
      for (const fk of foreignKeys) {
        console.log(`🔗 Recreating foreign key: ${fk.constraint_name} on ${fk.table_name}`);
        await sequelize.query(`
          ALTER TABLE "${fk.table_name}" 
          ADD CONSTRAINT "${fk.constraint_name}" 
          FOREIGN KEY ("${fk.column_name}") 
          REFERENCES students(id) 
          ON DELETE CASCADE ON UPDATE CASCADE
        `, { transaction: t });
      }
      
      console.log('✅ All foreign key constraints restored');
      
      // Verify the change
      const [columns] = await sequelize.query(`
        SELECT column_name, data_type, udt_name
        FROM information_schema.columns 
        WHERE table_name = 'students' AND column_name = 'id'
      `, { transaction: t });
      
      if (columns[0]?.udt_name === 'uuid') {
        console.log('✅ Verification successful: students.id is now UUID type');
      } else {
        throw new Error('Verification failed: Column type was not changed correctly');
      }
    });
    
    console.log('🎉 Students table ID column type fix completed successfully!');
    
  } catch (error) {
    console.error('❌ Error fixing students table:', error.message);
    console.error('Stack:', error.stack);
    throw error;
  } finally {
    await sequelize.close();
  }
}

fixStudentsIdType().catch(console.error);