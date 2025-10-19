const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const connectionString = 'postgresql://neondb_owner:npg_CqE9oPepJl8t@ep-young-queen-ad5sfxae.c-2.us-east-1.aws.neon.tech/code_vectors?sslmode=require&channel_binding=require';

// File extensions to scan for code headers
const CODE_EXTENSIONS = ['.js', '.ts', '.jsx', '.tsx', '.py', '.java', '.cs', '.cpp', '.h', '.php', '.rb', '.go', '.rs', '.vue', '.svelte'];

// Header patterns to extract
const HEADER_PATTERNS = {
    function: [
        /(?:export\s+)?(?:async\s+)?function\s+(\w+)/g,
        /(?:const|let|var)\s+(\w+)\s*=\s*(?:async\s+)?\(/g,
        /(\w+)\s*:\s*(?:async\s+)?\(/g
    ],
    class: [
        /(?:export\s+)?class\s+(\w+)/g,
        /interface\s+(\w+)/g
    ],
    component: [
        /(?:export\s+)?(?:const|let|var)\s+(\w+)\s*=\s*(?:React\.)?(?:forwardRef|memo)?\s*\(/g,
        /(?:export\s+default\s+)?function\s+(\w+)\s*\([^)]*\)\s*{/g
    ],
    import: [
        /import\s+.*?from\s+['"]([^'"]+)['"]/g,
        /require\s*\(\s*['"]([^'"]+)['"]\s*\)/g
    ]
};

async function scanDirectory(dirPath, client) {
    const files = [];
    
    function scanRecursive(currentPath) {
        const items = fs.readdirSync(currentPath);
        
        for (const item of items) {
            const fullPath = path.join(currentPath, item);
            const relativePath = path.relative(process.cwd(), fullPath);
            const stat = fs.statSync(fullPath);
            
            if (stat.isDirectory()) {
                // Skip node_modules, .git, and other common ignore directories
                if (!['node_modules', '.git', '.next', 'dist', 'build', '.vscode'].includes(item)) {
                    scanRecursive(fullPath);
                }
            } else if (stat.isFile()) {
                const ext = path.extname(fullPath);
                if (CODE_EXTENSIONS.includes(ext)) {
                    files.push({
                        path: relativePath.replace(/\\/g, '/'), // Normalize path separators
                        fullPath: fullPath,
                        type: ext.substring(1),
                        size: stat.size,
                        modified: stat.mtime
                    });
                }
            }
        }
    }
    
    scanRecursive(dirPath);
    return files;
}

function extractHeaders(content, filePath) {
    const headers = [];
    const lines = content.split('\n');
    
    for (const [headerType, patterns] of Object.entries(HEADER_PATTERNS)) {
        for (const pattern of patterns) {
            let match;
            while ((match = pattern.exec(content)) !== null) {
                const lineNumber = content.substring(0, match.index).split('\n').length;
                const headerName = match[1];
                
                if (headerName && !headerName.startsWith('_') && headerName.length > 1) {
                    // Get context around the match
                    const startLine = Math.max(0, lineNumber - 2);
                    const endLine = Math.min(lines.length - 1, lineNumber + 3);
                    const context = lines.slice(startLine, endLine + 1).join('\n');
                    
                    headers.push({
                        type: headerType,
                        name: headerName,
                        content: context,
                        lineNumber: lineNumber,
                        startLine: startLine + 1,
                        endLine: endLine + 1
                    });
                }
            }
            // Reset regex lastIndex to avoid issues with global flag
            pattern.lastIndex = 0;
        }
    }
    
    return headers;
}

async function populateDatabase() {
    const client = new Client({ connectionString });
    
    try {
        await client.connect();
        console.log('Connected to database');
        
        // Clear existing data
        await client.query('DELETE FROM code_relationships');
        await client.query('DELETE FROM code_embeddings');
        await client.query('DELETE FROM code_headers');
        await client.query('DELETE FROM code_files WHERE file_path != \'_database_metadata\'');
        console.log('Cleared existing data');
        
        // Scan for code files
        const files = await scanDirectory('.', client);
        console.log(`Found ${files.length} code files`);
        
        let totalHeaders = 0;
        
        for (const file of files) {
            try {
                // Insert file record
                const fileResult = await client.query(`
                    INSERT INTO code_files (file_path, file_type, file_size, last_modified)
                    VALUES ($1, $2, $3, $4)
                    RETURNING id
                `, [file.path, file.type, file.size, file.modified]);
                
                const fileId = fileResult.rows[0].id;
                
                // Read file content and extract headers
                const content = fs.readFileSync(file.fullPath, 'utf8');
                const headers = extractHeaders(content, file.path);
                
                // Insert headers
                for (const header of headers) {
                    await client.query(`
                        INSERT INTO code_headers (
                            file_id, header_type, header_name, header_content, 
                            line_number, start_line, end_line
                        )
                        VALUES ($1, $2, $3, $4, $5, $6, $7)
                    `, [
                        fileId, header.type, header.name, header.content,
                        header.lineNumber, header.startLine, header.endLine
                    ]);
                    totalHeaders++;
                }
                
                console.log(`✓ Processed ${file.path}: ${headers.length} headers`);
                
            } catch (err) {
                console.error(`Error processing ${file.path}:`, err.message);
            }
        }
        
        // Get summary statistics
        const stats = await client.query(`
            SELECT 
                COUNT(DISTINCT cf.id) as total_files,
                COUNT(ch.id) as total_headers,
                ch.header_type,
                COUNT(*) as count
            FROM code_files cf
            LEFT JOIN code_headers ch ON cf.id = ch.file_id
            WHERE cf.file_path != '_database_metadata'
            GROUP BY ch.header_type
            ORDER BY count DESC
        `);
        
        console.log('\n📊 Database Population Summary:');
        console.log(`Total files processed: ${files.length}`);
        console.log(`Total headers extracted: ${totalHeaders}`);
        console.log('\nHeaders by type:');
        stats.rows.forEach(row => {
            if (row.header_type) {
                console.log(`  ${row.header_type}: ${row.count}`);
            }
        });
        
        await client.end();
        console.log('\n✅ Database population complete!');
        
    } catch (err) {
        console.error('Error populating database:', err);
        process.exit(1);
    }
}

// Run if called directly
if (require.main === module) {
    populateDatabase();
}

module.exports = { populateDatabase, extractHeaders, scanDirectory };
