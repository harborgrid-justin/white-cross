const { Client } = require('pg');
const fs = require('fs');

const connectionString = 'postgresql://neondb_owner:npg_CqE9oPepJl8t@ep-young-queen-ad5sfxae.c-2.us-east-1.aws.neon.tech/code_vectors?sslmode=require&channel_binding=require';

async function setupDatabase() {
    const client = new Client({
        connectionString: connectionString,
    });

    try {
        await client.connect();
        console.log('Connected to Neon database');

        // Read and execute the SQL file
        const sql = fs.readFileSync('setup_vector_db.sql', 'utf8');
        
        // Split by double newlines to get individual statements
        const statements = sql.split(';').filter(stmt => stmt.trim().length > 0);
        
        for (const statement of statements) {
            if (statement.trim()) {
                try {
                    await client.query(statement.trim());
                    console.log('✓ Executed statement successfully');
                } catch (err) {
                    if (err.message.includes('already exists') || err.message.includes('does not exist')) {
                        console.log('~ Statement skipped (already exists)');
                    } else {
                        console.error('Error executing statement:', err.message);
                        console.error('Statement:', statement.trim().substring(0, 100) + '...');
                    }
                }
            }
        }

        // Test the setup by querying the tables
        const result = await client.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name LIKE 'code_%'
            ORDER BY table_name
        `);

        console.log('\n✅ Database setup complete!');
        console.log('Created tables:', result.rows.map(row => row.table_name).join(', '));

        // Test vector extension
        const vectorTest = await client.query("SELECT version()");
        console.log('Database version:', vectorTest.rows[0].version);

        await client.end();
        console.log('Database connection closed');

    } catch (err) {
        console.error('Database setup error:', err);
        process.exit(1);
    }
}

setupDatabase();
