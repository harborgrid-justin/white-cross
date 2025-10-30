const { Client } = require('pg');
require('dotenv').config();

async function resetDatabase() {
  console.log('🚀 Starting database reset...');
  
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    await client.connect();
    console.log('✅ Connected to Neon database');

    // Drop all tables and types in the public schema
    console.log('🗑️  Dropping all tables and types...');
    
    // First, drop all tables with CASCADE to remove all dependencies
    const dropTablesResult = await client.query(`
      DO $$ 
      DECLARE 
        r RECORD;
      BEGIN
        -- Drop all tables
        FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') 
        LOOP
          EXECUTE 'DROP TABLE IF EXISTS public.' || quote_ident(r.tablename) || ' CASCADE';
        END LOOP;
        
        -- Drop all sequences
        FOR r IN (SELECT sequencename FROM pg_sequences WHERE schemaname = 'public')
        LOOP
          EXECUTE 'DROP SEQUENCE IF EXISTS public.' || quote_ident(r.sequencename) || ' CASCADE';
        END LOOP;
        
        -- Drop all custom types (enums)
        FOR r IN (SELECT typname FROM pg_type t JOIN pg_namespace n ON t.typnamespace = n.oid WHERE n.nspname = 'public' AND t.typtype = 'e')
        LOOP
          EXECUTE 'DROP TYPE IF EXISTS public.' || quote_ident(r.typname) || ' CASCADE';
        END LOOP;
      END $$;
    `);
    
    console.log('✅ Successfully dropped all database objects');

    // Verify the schema is clean
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    
    const typesResult = await client.query(`
      SELECT typname 
      FROM pg_type t 
      JOIN pg_namespace n ON t.typnamespace = n.oid 
      WHERE n.nspname = 'public' AND t.typtype = 'e'
    `);
    
    console.log(`📊 Remaining tables: ${tablesResult.rows.length}`);
    console.log(`📊 Remaining custom types: ${typesResult.rows.length}`);
    
    if (tablesResult.rows.length === 0 && typesResult.rows.length === 0) {
      console.log('🎉 Database successfully reset! Schema is completely clean.');
    } else {
      console.log('⚠️  Some objects may still remain:');
      if (tablesResult.rows.length > 0) {
        console.log('Tables:', tablesResult.rows.map(r => r.table_name));
      }
      if (typesResult.rows.length > 0) {
        console.log('Types:', typesResult.rows.map(r => r.typname));
      }
    }

  } catch (error) {
    console.error('❌ Error resetting database:', error.message);
    throw error;
  } finally {
    await client.end();
    console.log('🔌 Database connection closed');
  }
}

// Run the reset
resetDatabase()
  .then(() => {
    console.log('✨ Database reset completed successfully!');
    console.log('🚀 You can now start the NestJS application for fresh schema creation.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Database reset failed:', error);
    process.exit(1);
  });