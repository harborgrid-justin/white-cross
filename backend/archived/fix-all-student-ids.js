/**
 * Comprehensive fix for all student-related UUID columns
 */
const { Sequelize } = require('sequelize');
require('dotenv').config();

async function fixAllStudentIdTypes() {
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
    console.log('🔧 Starting comprehensive student ID type fix...');
    
    await sequelize.transaction(async (t) => {
      // Get all tables that reference students
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
      
      console.log(`🔍 Found ${foreignKeys.length} tables referencing students.id`);
      
      // Step 1: Drop all foreign key constraints
      console.log('🔗 Step 1: Dropping all foreign key constraints...');
      for (const fk of foreignKeys) {
        console.log(`  - Dropping ${fk.constraint_name} from ${fk.table_name}`);
        await sequelize.query(`
          ALTER TABLE "${fk.table_name}" DROP CONSTRAINT IF EXISTS "${fk.constraint_name}"
        `, { transaction: t });
      }
      
      // Step 2: Fix students.id column
      console.log('🏫 Step 2: Converting students.id to UUID...');
      await sequelize.query(`
        ALTER TABLE students ALTER COLUMN id TYPE UUID USING id::UUID
      `, { transaction: t });
      
      // Step 3: Fix all referencing columns
      console.log('🔄 Step 3: Converting all foreign key columns to UUID...');
      const uniqueTables = [...new Set(foreignKeys.map(fk => ({ table: fk.table_name, column: fk.column_name })))];
      
      for (const ref of uniqueTables) {
        console.log(`  - Converting ${ref.table}.${ref.column} to UUID`);
        
        try {
          await sequelize.query(`
            ALTER TABLE "${ref.table}" 
            ALTER COLUMN "${ref.column}" TYPE UUID USING "${ref.column}"::UUID
          `, { transaction: t });
        } catch (error) {
          console.log(`    ⚠️  Could not convert ${ref.table}.${ref.column} directly, trying alternative approach...`);
          
          // Check if there are any non-null values that aren't UUIDs
          const [invalidValues] = await sequelize.query(`
            SELECT COUNT(*) as count FROM "${ref.table}" 
            WHERE "${ref.column}" IS NOT NULL 
            AND "${ref.column}" !~ '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
          `, { transaction: t });
          
          if (invalidValues[0].count > 0) {
            console.log(`    ❌ Found ${invalidValues[0].count} invalid UUID values in ${ref.table}.${ref.column}`);
            console.log(`    🗑️  Setting invalid values to NULL...`);
            
            await sequelize.query(`
              UPDATE "${ref.table}" 
              SET "${ref.column}" = NULL 
              WHERE "${ref.column}" IS NOT NULL 
              AND "${ref.column}" !~ '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
            `, { transaction: t });
          }
          
          // Try conversion again
          await sequelize.query(`
            ALTER TABLE "${ref.table}" 
            ALTER COLUMN "${ref.column}" TYPE UUID USING 
            CASE 
              WHEN "${ref.column}" IS NULL THEN NULL
              WHEN "${ref.column}" ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$' 
              THEN "${ref.column}"::UUID
              ELSE NULL
            END
          `, { transaction: t });
        }
      }
      
      // Step 4: Recreate foreign key constraints
      console.log('🔗 Step 4: Recreating foreign key constraints...');
      for (const fk of foreignKeys) {
        console.log(`  - Recreating ${fk.constraint_name} on ${fk.table_name}`);
        await sequelize.query(`
          ALTER TABLE "${fk.table_name}" 
          ADD CONSTRAINT "${fk.constraint_name}" 
          FOREIGN KEY ("${fk.column_name}") 
          REFERENCES students(id) 
          ON DELETE CASCADE ON UPDATE CASCADE
        `, { transaction: t });
      }
      
      console.log('✅ Step 5: Verifying changes...');
      
      // Verify students table
      const [studentsCol] = await sequelize.query(`
        SELECT data_type, udt_name FROM information_schema.columns 
        WHERE table_name = 'students' AND column_name = 'id'
      `, { transaction: t });
      
      console.log(`  - students.id: ${studentsCol[0].data_type} (${studentsCol[0].udt_name})`);
      
      // Verify foreign key tables
      for (const ref of uniqueTables) {
        const [refCol] = await sequelize.query(`
          SELECT data_type, udt_name FROM information_schema.columns 
          WHERE table_name = '${ref.table}' AND column_name = '${ref.column}'
        `, { transaction: t });
        console.log(`  - ${ref.table}.${ref.column}: ${refCol[0].data_type} (${refCol[0].udt_name})`);
      }
    });
    
    console.log('🎉 Comprehensive student ID type fix completed successfully!');
    
  } catch (error) {
    console.error('❌ Error fixing student ID types:', error.message);
    console.error('Stack:', error.stack);
    throw error;
  } finally {
    await sequelize.close();
  }
}

fixAllStudentIdTypes().catch(console.error);