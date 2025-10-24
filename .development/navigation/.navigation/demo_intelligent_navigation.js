const { IntelligentCodeNavigator } = require('./intelligent_code_navigator');

async function demonstrateNavigation() {
    console.log('🎯 Intelligent Code Navigation System Demonstration\n');
    
    const navigator = new IntelligentCodeNavigator();
    
    try {
        await navigator.connect();
        console.log('✅ Connected to navigation system\n');
        
        // Test 1: Show embedding statistics
        console.log('📊 EMBEDDING STATISTICS');
        console.log('=' .repeat(50));
        const stats = await navigator.assistant.client.query(`
            SELECT 
                COUNT(*) as total_embeddings,
                COUNT(CASE WHEN embedding_model LIKE '%openai%' THEN 1 END) as openai_enhanced,
                COUNT(CASE WHEN embedding_model LIKE '%simple%' THEN 1 END) as simple_only,
                COUNT(DISTINCT ch.file_id) as unique_files,
                AVG(ch.line_number) as avg_line_number
            FROM code_embeddings ce
            JOIN code_headers ch ON ce.header_id = ch.id
        `);
        
        const stat = stats.rows[0];
        console.log(`📦 Total Embeddings: ${stat.total_embeddings}`);
        console.log(`🤖 OpenAI Enhanced: ${stat.openai_enhanced} (${Math.round(stat.openai_enhanced/stat.total_embeddings*100)}%)`);
        console.log(`📄 Unique Files: ${stat.unique_files}`);
        console.log(`📍 Average Line: ${Math.round(stat.avg_line_number)}\n`);
        
        // Test 2: Semantic search demonstrations
        console.log('🔍 SEMANTIC SEARCH DEMONSTRATION');
        console.log('=' .repeat(50));
        
        const searchQueries = [
            'health medical patient',
            'React component UI',
            'database repository service',
            'authentication login security'
        ];
        
        for (const query of searchQueries) {
            console.log(`\n🎯 Searching for: "${query}"`);
            const results = await navigator.semanticCodeSearch(query, 3, 0.15);
            
            if (results.length > 0) {
                results.forEach((result, i) => {
                    console.log(`   ${i+1}. 📁 ${result.file_path.split('/').pop()}`);
                    console.log(`      🏷️  ${result.header_type}: ${result.header_name}`);
                    console.log(`      🎯 Score: ${(result.similarity_score * 100).toFixed(1)}%`);
                });
            } else {
                console.log('   No results found above threshold');
            }
        }
        
        // Test 3: Pattern discovery
        console.log('\n\n🔮 CODE PATTERN ANALYSIS');
        console.log('=' .repeat(50));
        
        const patterns = await navigator.discoverPatterns('all', 5);
        if (!patterns.error) {
            console.log(`📊 Analyzed ${patterns.summary.total_analyzed} code elements`);
            console.log(`🏷️  Found ${patterns.summary.unique_types} unique header types`);
            
            console.log('\n🏆 Most Common Code Types:');
            Object.entries(patterns.patterns.type_patterns)
                .sort((a, b) => b[1].length - a[1].length)
                .slice(0, 8)
                .forEach(([type, items], i) => {
                    console.log(`   ${i+1}. ${type.padEnd(20)} ${items.length.toString().padStart(4)} occurrences`);
                });
            
            console.log('\n📁 Code Distribution by Directory:');
            Object.entries(patterns.patterns.file_patterns)
                .sort((a, b) => b[1].length - a[1].length)
                .slice(0, 6)
                .forEach(([dir, types], i) => {
                    const uniqueTypes = [...new Set(types)];
                    console.log(`   ${i+1}. ${dir.padEnd(15)} ${types.length.toString().padStart(3)} headers (${uniqueTypes.length} types)`);
                });
        }
        
        // Test 4: Find actual files for navigation test
        console.log('\n\n🧭 FILE NAVIGATION DEMONSTRATION');
        console.log('=' .repeat(50));
        
        // Find some actual files to test with
        const filesQuery = await navigator.assistant.client.query(`
            SELECT DISTINCT cf.file_path, COUNT(ch.id) as header_count
            FROM code_files cf
            JOIN code_headers ch ON cf.id = ch.file_id
            JOIN code_embeddings ce ON ch.id = ce.header_id
            WHERE cf.file_path LIKE '%.tsx' OR cf.file_path LIKE '%.ts'
            GROUP BY cf.file_path
            HAVING COUNT(ch.id) >= 3
            ORDER BY header_count DESC
            LIMIT 3
        `);
        
        if (filesQuery.rows.length > 0) {
            for (const file of filesQuery.rows) {
                console.log(`\n🎯 Analyzing relationships for: ${file.file_path}`);
                console.log(`   📊 Headers in file: ${file.header_count}`);
                
                const related = await navigator.navigateToRelated(file.file_path, 'all', 5);
                if (!related.error && related.related_files.length > 0) {
                    console.log(`   🔗 Found ${related.related_files.length} related files:`);
                    related.related_files.forEach((rel, i) => {
                        const score = (rel.similarity_score * rel.relevance * 100).toFixed(1);
                        console.log(`      ${i+1}. ${rel.file_path.split('/').pop()} (${score}%)`);
                    });
                } else {
                    console.log('   No strongly related files found');
                }
            }
        }
        
        // Test 5: Advanced search capabilities
        console.log('\n\n🎯 ADVANCED SEARCH CAPABILITIES');
        console.log('=' .repeat(50));
        
        const advancedQueries = [
            { query: 'export function', desc: 'Exported Functions' },
            { query: 'interface type', desc: 'Type Definitions' },
            { query: 'useState useEffect', desc: 'React Hooks' },
            { query: 'class extends', desc: 'Class Inheritance' }
        ];
        
        for (const test of advancedQueries) {
            console.log(`\n🔍 ${test.desc}: "${test.query}"`);
            const results = await navigator.semanticCodeSearch(test.query, 2, 0.2);
            
            results.forEach((result, i) => {
                console.log(`   ${i+1}. ${result.file_path.split('/').pop()}:${result.line_number}`);
                console.log(`      ${result.header_type}: ${result.header_name} (${(result.similarity_score * 100).toFixed(1)}%)`);
            });
            
            if (results.length === 0) {
                console.log('   No matches found above threshold');
            }
        }
        
    } catch (error) {
        console.error('❌ Demo failed:', error.message);
    } finally {
        await navigator.disconnect();
        console.log('\n🎉 Navigation demonstration completed!');
    }
}

demonstrateNavigation();
