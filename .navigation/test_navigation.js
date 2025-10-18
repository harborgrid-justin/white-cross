const { IntelligentCodeNavigator } = require('./intelligent_code_navigator');

async function testNavigation() {
    console.log('🧪 Testing Intelligent Code Navigation System\n');
    
    const navigator = new IntelligentCodeNavigator();
    
    try {
        // Initialize connection
        await navigator.connect();
        console.log('✅ Connected to navigation system\n');
        
        // Test 1: Check database connection and embeddings count
        console.log('📊 Checking embeddings status...');
        const countResult = await navigator.assistant.client.query(`
            SELECT 
                COUNT(*) as total,
                COUNT(CASE WHEN embedding_model LIKE '%openai%' THEN 1 END) as openai_count,
                COUNT(CASE WHEN embedding_model LIKE '%simple%' THEN 1 END) as simple_count
            FROM code_embeddings
        `);
        console.log(`   Total embeddings: ${countResult.rows[0].total}`);
        console.log(`   OpenAI embeddings: ${countResult.rows[0].openai_count}`);
        console.log(`   Simple embeddings: ${countResult.rows[0].simple_count}`);
        
        // Test 2: Basic semantic search
        console.log('\n🔍 Testing semantic search for "patient"...');
        const searchResults = await navigator.semanticCodeSearch('patient', 5, 0.1);
        console.log(`   Found ${searchResults.length} results`);
        if (searchResults.length > 0) {
            searchResults.forEach((result, i) => {
                console.log(`   ${i+1}. ${result.file_path}:${result.header_name} (score: ${result.similarity_score.toFixed(3)})`);
            });
        }
        
        // Test 3: Search for specific terms that should exist
        console.log('\n🔍 Testing search for "component"...');
        const componentResults = await navigator.semanticCodeSearch('component', 3);
        console.log(`   Found ${componentResults.length} results`);
        componentResults.forEach((result, i) => {
            console.log(`   ${i+1}. ${result.file_path}:${result.header_name} (score: ${result.similarity_score.toFixed(3)})`);
        });
        
        // Test 4: Search for "function" which should be common
        console.log('\n🔍 Testing search for "function"...');
        const functionResults = await navigator.semanticCodeSearch('function', 3);
        console.log(`   Found ${functionResults.length} results`);
        functionResults.forEach((result, i) => {
            console.log(`   ${i+1}. ${result.file_path}:${result.header_name} (score: ${result.similarity_score.toFixed(3)})`);
        });
        
        // Test 5: Pattern discovery
        console.log('\n🔮 Testing pattern discovery...');
        const patterns = await navigator.discoverPatterns('react', 2);
        if (patterns.error) {
            console.log(`   ❌ ${patterns.error}`);
        } else {
            console.log(`   📊 Summary: ${patterns.summary.total_analyzed} analyzed, ${patterns.summary.unique_types} types`);
            console.log(`   🏆 Top patterns:`);
            Object.entries(patterns.patterns.type_patterns)
                .sort((a, b) => b[1].length - a[1].length)
                .slice(0, 3)
                .forEach(([type, items], i) => {
                    console.log(`      ${i+1}. ${type}: ${items.length} occurrences`);
                });
        }
        
        // Test 6: Check a specific file for navigation
        console.log('\n🧭 Testing navigation from a React component...');
        const relatedFiles = await navigator.navigateToRelated('PatientCard.tsx', 'react', 5);
        if (relatedFiles.error) {
            console.log(`   ❌ ${relatedFiles.error}`);
        } else {
            console.log(`   📊 Current file has ${relatedFiles.file_info.header_count} headers`);
            console.log(`   🔗 Found ${relatedFiles.related_files.length} related files`);
            relatedFiles.related_files.forEach((file, i) => {
                console.log(`   ${i+1}. ${file.file_path} (score: ${(file.similarity_score * file.relevance).toFixed(3)})`);
            });
        }
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
        console.error('   Stack:', error.stack);
    } finally {
        await navigator.disconnect();
        console.log('\n✅ Navigation tests completed');
    }
}

testNavigation();
