const { Client } = require('pg');

const connectionString = 'postgresql://neondb_owner:npg_CqE9oPepJl8t@ep-young-queen-ad5sfxae.c-2.us-east-1.aws.neon.tech/code_vectors?sslmode=require&channel_binding=require';

async function queryCodeDatabase() {
    const client = new Client({ connectionString });
    
    try {
        await client.connect();
        console.log('🔍 Querying White Cross Code Vector Database\n');
        
        // 1. Overall statistics
        const statsQuery = `
            SELECT 
                COUNT(DISTINCT cf.id) as total_files,
                COUNT(ch.id) as total_headers,
                cf.file_type,
                COUNT(*) as file_count
            FROM code_files cf
            LEFT JOIN code_headers ch ON cf.id = ch.file_id
            WHERE cf.file_path != '_database_metadata'
            GROUP BY cf.file_type
            ORDER BY file_count DESC
        `;
        
        const stats = await client.query(statsQuery);
        console.log('📊 File Type Distribution:');
        stats.rows.forEach(row => {
            if (row.file_type) {
                console.log(`  ${row.file_type}: ${row.file_count} files`);
            }
        });
        
        // 2. Header type distribution
        const headerStats = await client.query(`
            SELECT header_type, COUNT(*) as count
            FROM code_headers
            GROUP BY header_type
            ORDER BY count DESC
        `);
        
        console.log('\n🏷️  Code Header Type Distribution:');
        headerStats.rows.forEach(row => {
            console.log(`  ${row.header_type}: ${row.count} headers`);
        });
        
        // 3. Top files by header count
        const topFiles = await client.query(`
            SELECT 
                cf.file_path,
                cf.file_type,
                COUNT(ch.id) as header_count
            FROM code_files cf
            JOIN code_headers ch ON cf.id = ch.file_id
            GROUP BY cf.id, cf.file_path, cf.file_type
            ORDER BY header_count DESC
            LIMIT 10
        `);
        
        console.log('\n📁 Files with Most Code Headers:');
        topFiles.rows.forEach((row, index) => {
            console.log(`  ${index + 1}. ${row.file_path} (${row.file_type}) - ${row.header_count} headers`);
        });
        
        // 4. Recent health record related headers
        const healthRecordHeaders = await client.query(`
            SELECT DISTINCT
                cf.file_path,
                ch.header_name,
                ch.header_type
            FROM code_headers ch
            JOIN code_files cf ON ch.file_id = cf.id
            WHERE ch.header_name ILIKE '%health%' 
               OR ch.header_name ILIKE '%medical%'
               OR ch.header_name ILIKE '%patient%'
               OR ch.header_name ILIKE '%record%'
               OR cf.file_path ILIKE '%health%'
            ORDER BY cf.file_path, ch.header_name
            LIMIT 20
        `);
        
        console.log('\n🏥 Health Records Related Code Headers:');
        healthRecordHeaders.rows.forEach(row => {
            console.log(`  ${row.header_type}: ${row.header_name} (${row.file_path})`);
        });
        
        // 5. Medication related headers
        const medicationHeaders = await client.query(`
            SELECT DISTINCT
                cf.file_path,
                ch.header_name,
                ch.header_type
            FROM code_headers ch
            JOIN code_files cf ON ch.file_id = cf.id
            WHERE ch.header_name ILIKE '%medication%' 
               OR ch.header_name ILIKE '%drug%'
               OR ch.header_name ILIKE '%prescription%'
               OR ch.header_name ILIKE '%dose%'
               OR cf.file_path ILIKE '%medication%'
            ORDER BY cf.file_path, ch.header_name
            LIMIT 15
        `);
        
        console.log('\n💊 Medication Related Code Headers:');
        medicationHeaders.rows.forEach(row => {
            console.log(`  ${row.header_type}: ${row.header_name} (${row.file_path})`);
        });
        
        // 6. Student management headers
        const studentHeaders = await client.query(`
            SELECT DISTINCT
                cf.file_path,
                ch.header_name,
                ch.header_type
            FROM code_headers ch
            JOIN code_files cf ON ch.file_id = cf.id
            WHERE ch.header_name ILIKE '%student%' 
               OR cf.file_path ILIKE '%student%'
            ORDER BY cf.file_path, ch.header_name
            LIMIT 15
        `);
        
        console.log('\n🎓 Student Management Code Headers:');
        studentHeaders.rows.forEach(row => {
            console.log(`  ${row.header_type}: ${row.header_name} (${row.file_path})`);
        });
        
        // 7. Component analysis (React components)
        const componentStats = await client.query(`
            SELECT 
                cf.file_path,
                ch.header_name
            FROM code_headers ch
            JOIN code_files cf ON ch.file_id = cf.id
            WHERE ch.header_type = 'component'
               AND cf.file_type IN ('tsx', 'jsx')
            ORDER BY cf.file_path
            LIMIT 20
        `);
        
        console.log('\n⚛️  React Components:');
        componentStats.rows.forEach(row => {
            console.log(`  ${row.header_name} (${row.file_path})`);
        });
        
        // 8. Database structure summary
        const tableInfo = await client.query(`
            SELECT 
                table_name,
                (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
            FROM information_schema.tables t
            WHERE table_schema = 'public' 
            AND table_name LIKE 'code_%'
            ORDER BY table_name
        `);
        
        console.log('\n🗄️  Vector Database Structure:');
        tableInfo.rows.forEach(row => {
            console.log(`  ${row.table_name}: ${row.column_count} columns`);
        });
        
        console.log('\n✅ Vector database is ready for embedding generation and semantic search!');
        console.log('\n🚀 Next Steps:');
        console.log('   • Generate embeddings for code headers using OpenAI API');
        console.log('   • Implement semantic similarity search');
        console.log('   • Build relationship mappings between code components');
        console.log('   • Create AI-powered code navigation features');
        
        await client.end();
        
    } catch (err) {
        console.error('Query error:', err);
        process.exit(1);
    }
}

queryCodeDatabase();
