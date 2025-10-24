const { Client } = require('pg');
const readline = require('readline');

const connectionString = 'postgresql://neondb_owner:npg_CqE9oPepJl8t@ep-young-queen-ad5sfxae.c-2.us-east-1.aws.neon.tech/code_vectors?sslmode=require&channel_binding=require';

class AICodeAssistant {
    constructor() {
        this.client = new Client({ connectionString });
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
    }

    async connect() {
        await this.client.connect();
        console.log('🤖 AI Code Assistant Connected to White Cross Vector Database\n');
    }

    async disconnect() {
        await this.client.end();
        this.rl.close();
    }

    // 1. Smart Code Search
    async searchCode(query, limit = 10) {
        console.log(`🔍 Searching for: "${query}"\n`);
        
        const results = await this.client.query(`
            SELECT 
                cf.file_path,
                ch.header_name,
                ch.header_type,
                ch.header_content,
                ch.line_number,
                cf.file_type,
                CASE 
                    WHEN ch.header_name ILIKE $1 THEN 1
                    WHEN ch.header_content ILIKE $1 THEN 2
                    ELSE 3
                END as relevance_score
            FROM code_headers ch
            JOIN code_files cf ON ch.file_id = cf.id
            WHERE ch.header_name ILIKE $1 
               OR ch.header_content ILIKE $1
               OR cf.file_path ILIKE $1
            ORDER BY 
                relevance_score,
                cf.file_path,
                ch.line_number
            LIMIT $2
        `, [`%${query}%`, limit]);

        if (results.rows.length === 0) {
            console.log('❌ No results found for your search.\n');
            return [];
        }

        console.log(`📊 Found ${results.rows.length} results:\n`);
        results.rows.forEach((row, index) => {
            console.log(`${index + 1}. 📁 ${row.file_path}:${row.line_number}`);
            console.log(`   🏷️  ${row.header_type}: ${row.header_name}`);
            console.log(`   📝 ${row.header_content.split('\n')[0].trim()}...\n`);
        });

        return results.rows;
    }

    // 2. Code Tracing - Find Dependencies
    async traceCodeDependencies(fileName) {
        console.log(`🔗 Tracing dependencies for: ${fileName}\n`);

        // Find all imports in the file
        const imports = await this.client.query(`
            SELECT DISTINCT
                ch.header_name as import_path,
                ch.header_content,
                ch.line_number
            FROM code_headers ch
            JOIN code_files cf ON ch.file_id = cf.id
            WHERE cf.file_path ILIKE $1
               AND ch.header_type = 'import'
            ORDER BY ch.line_number
        `, [`%${fileName}%`]);

        console.log(`📦 Import Dependencies (${imports.rows.length}):`);
        imports.rows.forEach((row, index) => {
            console.log(`  ${index + 1}. Line ${row.line_number}: ${row.import_path}`);
        });

        // Find files that import this file
        console.log(`\n📥 Files that import this module:`);
        const reverseImports = await this.client.query(`
            SELECT DISTINCT
                cf.file_path,
                ch.header_content,
                ch.line_number
            FROM code_headers ch
            JOIN code_files cf ON ch.file_id = cf.id
            WHERE ch.header_type = 'import'
               AND ch.header_name ILIKE $1
            ORDER BY cf.file_path
        `, [`%${fileName.replace('.tsx', '').replace('.ts', '').replace('.js', '')}%`]);

        reverseImports.rows.forEach((row, index) => {
            console.log(`  ${index + 1}. ${row.file_path}:${row.line_number}`);
        });

        return { imports: imports.rows, reverseImports: reverseImports.rows };
    }

    // 3. Component Analysis
    async analyzeComponent(componentName) {
        console.log(`⚛️  Analyzing component: ${componentName}\n`);

        const component = await this.client.query(`
            SELECT 
                cf.file_path,
                ch.header_name,
                ch.header_content,
                ch.line_number,
                cf.file_size
            FROM code_headers ch
            JOIN code_files cf ON ch.file_id = cf.id
            WHERE ch.header_name ILIKE $1
               AND ch.header_type IN ('component', 'function')
            ORDER BY cf.file_path
        `, [`%${componentName}%`]);

        if (component.rows.length === 0) {
            console.log('❌ Component not found.\n');
            return null;
        }

        const mainComponent = component.rows[0];
        console.log(`📍 Component Location: ${mainComponent.file_path}:${mainComponent.line_number}`);
        console.log(`📏 File Size: ${mainComponent.file_size} bytes\n`);

        // Find all functions in the same file
        const functions = await this.client.query(`
            SELECT 
                ch.header_name,
                ch.header_type,
                ch.line_number
            FROM code_headers ch
            JOIN code_files cf ON ch.file_id = cf.id
            WHERE cf.file_path = $1
               AND ch.header_type IN ('function', 'component')
            ORDER BY ch.line_number
        `, [mainComponent.file_path]);

        console.log(`🔧 Functions in component file (${functions.rows.length}):`);
        functions.rows.forEach((row, index) => {
            const marker = row.header_name === componentName ? '👉' : '  ';
            console.log(`${marker} ${index + 1}. Line ${row.line_number}: ${row.header_name} (${row.header_type})`);
        });

        return mainComponent;
    }

    // 4. Find Similar Code Patterns
    async findSimilarPatterns(pattern, context = 'any') {
        console.log(`🎯 Finding similar patterns for: "${pattern}" in context: ${context}\n`);

        let whereClause = `ch.header_content ILIKE $1 OR ch.header_name ILIKE $1`;
        let params = [`%${pattern}%`];

        if (context !== 'any') {
            whereClause += ` AND ch.header_type = $2`;
            params.push(context);
        }

        const similar = await this.client.query(`
            SELECT 
                cf.file_path,
                ch.header_name,
                ch.header_type,
                ch.header_content,
                ch.line_number
            FROM code_headers ch
            JOIN code_files cf ON ch.file_id = cf.id
            WHERE ${whereClause}
            ORDER BY 
                ch.header_type,
                cf.file_path,
                ch.line_number
            LIMIT 20
        `, params);

        console.log(`🔍 Found ${similar.rows.length} similar patterns:\n`);
        
        const groupedByType = {};
        similar.rows.forEach(row => {
            if (!groupedByType[row.header_type]) {
                groupedByType[row.header_type] = [];
            }
            groupedByType[row.header_type].push(row);
        });

        Object.entries(groupedByType).forEach(([type, items]) => {
            console.log(`📂 ${type.toUpperCase()} (${items.length}):`);
            items.forEach((row, index) => {
                console.log(`  ${index + 1}. ${row.file_path}:${row.line_number} - ${row.header_name}`);
            });
            console.log('');
        });

        return similar.rows;
    }

    // 5. Code Complexity Analysis
    async analyzeComplexity(filePath = null) {
        console.log(`📊 Analyzing code complexity${filePath ? ` for: ${filePath}` : ' (top files)'}\n`);

        let query = `
            SELECT 
                cf.file_path,
                cf.file_type,
                COUNT(ch.id) as header_count,
                COUNT(CASE WHEN ch.header_type = 'function' THEN 1 END) as function_count,
                COUNT(CASE WHEN ch.header_type = 'class' THEN 1 END) as class_count,
                COUNT(CASE WHEN ch.header_type = 'component' THEN 1 END) as component_count,
                COUNT(CASE WHEN ch.header_type = 'import' THEN 1 END) as import_count,
                cf.file_size
            FROM code_files cf
            LEFT JOIN code_headers ch ON cf.id = ch.file_id
            WHERE cf.file_path != '_database_metadata'
        `;

        let params = [];
        if (filePath) {
            query += ` AND cf.file_path ILIKE $1`;
            params.push(`%${filePath}%`);
        }

        query += `
            GROUP BY cf.id, cf.file_path, cf.file_type, cf.file_size
            ORDER BY header_count DESC
            LIMIT 15
        `;

        const complexity = await this.client.query(query, params);

        console.log('🏆 Complexity Rankings:\n');
        complexity.rows.forEach((row, index) => {
            const complexityScore = row.header_count + (row.function_count * 2) + (row.class_count * 3);
            console.log(`${index + 1}. ${row.file_path}`);
            console.log(`   📈 Complexity Score: ${complexityScore}`);
            console.log(`   📊 Headers: ${row.header_count} | Functions: ${row.function_count} | Classes: ${row.class_count} | Components: ${row.component_count}`);
            console.log(`   📦 Imports: ${row.import_count} | Size: ${row.file_size} bytes\n`);
        });

        return complexity.rows;
    }

    // 6. Architecture Overview
    async getArchitectureOverview() {
        console.log('🏗️  White Cross Architecture Overview\n');

        // Backend vs Frontend distribution
        const distribution = await this.client.query(`
            SELECT 
                CASE 
                    WHEN cf.file_path LIKE 'backend/%' THEN 'Backend'
                    WHEN cf.file_path LIKE 'frontend/%' THEN 'Frontend'
                    WHEN cf.file_path LIKE 'scripts/%' THEN 'Scripts'
                    ELSE 'Other'
                END as layer,
                COUNT(DISTINCT cf.id) as file_count,
                COUNT(ch.id) as header_count,
                cf.file_type
            FROM code_files cf
            LEFT JOIN code_headers ch ON cf.id = ch.file_id
            WHERE cf.file_path != '_database_metadata'
            GROUP BY layer, cf.file_type
            ORDER BY layer, header_count DESC
        `);

        const layers = {};
        distribution.rows.forEach(row => {
            if (!layers[row.layer]) {
                layers[row.layer] = { files: 0, headers: 0, types: {} };
            }
            layers[row.layer].files += parseInt(row.file_count);
            layers[row.layer].headers += parseInt(row.header_count);
            layers[row.layer].types[row.file_type] = parseInt(row.header_count);
        });

        Object.entries(layers).forEach(([layer, data]) => {
            console.log(`📁 ${layer}:`);
            console.log(`   Files: ${data.files} | Headers: ${data.headers}`);
            console.log(`   Types: ${Object.entries(data.types).map(([type, count]) => `${type}: ${count}`).join(', ')}\n`);
        });

        // Top modules by interconnectedness
        const modules = await this.client.query(`
            SELECT 
                SPLIT_PART(cf.file_path, '/', 1) as root_module,
                SPLIT_PART(cf.file_path, '/', 2) as sub_module,
                COUNT(DISTINCT cf.id) as file_count,
                COUNT(ch.id) as header_count
            FROM code_files cf
            LEFT JOIN code_headers ch ON cf.id = ch.file_id
            WHERE cf.file_path != '_database_metadata'
               AND cf.file_path LIKE '%/%'
            GROUP BY root_module, sub_module
            HAVING COUNT(ch.id) > 50
            ORDER BY header_count DESC
            LIMIT 10
        `);

        console.log('🎯 Key Modules (by code density):\n');
        modules.rows.forEach((row, index) => {
            console.log(`${index + 1}. ${row.root_module}/${row.sub_module || 'root'}`);
            console.log(`   📊 ${row.file_count} files, ${row.header_count} headers\n`);
        });
    }

    // 7. Interactive Menu
    async showMenu() {
        console.log('🎮 AI Code Assistant Menu:');
        console.log('1. 🔍 Search Code');
        console.log('2. 🔗 Trace Dependencies');
        console.log('3. ⚛️  Analyze Component');
        console.log('4. 🎯 Find Similar Patterns');
        console.log('5. 📊 Complexity Analysis');
        console.log('6. 🏗️  Architecture Overview');
        console.log('7. ❌ Exit\n');

        return new Promise((resolve) => {
            this.rl.question('Choose an option (1-7): ', resolve);
        });
    }

    async getInput(prompt) {
        return new Promise((resolve) => {
            this.rl.question(prompt, resolve);
        });
    }

    async run() {
        await this.connect();
        
        console.log('🚀 Welcome to White Cross AI Code Assistant!');
        console.log('🎯 Your codebase has been fully indexed with 10,319 code headers across 956 files.\n');

        while (true) {
            try {
                const choice = await this.showMenu();
                console.log(''); // Add spacing

                switch (choice) {
                    case '1':
                        const searchQuery = await this.getInput('🔍 Enter search term: ');
                        await this.searchCode(searchQuery);
                        break;

                    case '2':
                        const fileName = await this.getInput('📁 Enter file name or path: ');
                        await this.traceCodeDependencies(fileName);
                        break;

                    case '3':
                        const componentName = await this.getInput('⚛️  Enter component name: ');
                        await this.analyzeComponent(componentName);
                        break;

                    case '4':
                        const pattern = await this.getInput('🎯 Enter pattern to find: ');
                        const context = await this.getInput('📂 Context (function/class/component/any): ');
                        await this.findSimilarPatterns(pattern, context || 'any');
                        break;

                    case '5':
                        const filePath = await this.getInput('📊 Enter file path (or press Enter for top files): ');
                        await this.analyzeComplexity(filePath || null);
                        break;

                    case '6':
                        await this.getArchitectureOverview();
                        break;

                    case '7':
                        console.log('👋 Goodbye! Happy coding!');
                        await this.disconnect();
                        return;

                    default:
                        console.log('❌ Invalid option. Please choose 1-7.\n');
                }

                console.log('\n' + '='.repeat(80) + '\n');
            } catch (error) {
                console.error('❌ Error:', error.message);
                console.log('\n' + '='.repeat(80) + '\n');
            }
        }
    }
}

// Quick search function for command line usage
async function quickSearch(query) {
    const assistant = new AICodeAssistant();
    await assistant.connect();
    await assistant.searchCode(query);
    await assistant.disconnect();
}

// Export for use as module
module.exports = { AICodeAssistant, quickSearch };

// Run interactive mode if called directly
if (require.main === module) {
    const assistant = new AICodeAssistant();
    assistant.run().catch(console.error);
}
