const { IntelligentCodeNavigator } = require('./intelligent_code_navigator');

async function testEnhancedNavigation() {
    console.log('🎯 Testing Enhanced Intelligent Code Navigation with Relationships\n');
    
    const navigator = new IntelligentCodeNavigator();
    
    try {
        await navigator.connect();
        console.log('✅ Connected to enhanced navigation system\n');
        
        // Test 1: Check system status
        console.log('📊 SYSTEM STATUS');
        console.log('=' .repeat(50));
        
        const systemStats = await navigator.assistant.client.query(`
            SELECT 
                (SELECT COUNT(*) FROM code_embeddings) as total_embeddings,
                (SELECT COUNT(*) FROM code_relationships) as total_relationships,
                (SELECT COUNT(DISTINCT relationship_type) FROM code_relationships) as relationship_types,
                (SELECT COUNT(*) FROM code_files) as total_files,
                (SELECT COUNT(*) FROM code_headers) as total_headers
        `);
        
        const stats = systemStats.rows[0];
        console.log(`📦 Total Embeddings: ${stats.total_embeddings}`);
        console.log(`🔗 Total Relationships: ${stats.total_relationships}`);
        console.log(`🏷️  Relationship Types: ${stats.relationship_types}`);
        console.log(`📄 Total Files: ${stats.total_files}`);
        console.log(`🎯 Total Headers: ${stats.total_headers}\n`);
        
        // Test 2: Relationship analysis
        console.log('🔗 RELATIONSHIP ANALYSIS');
        console.log('=' .repeat(50));
        
        const relationshipStats = await navigator.assistant.client.query(`
            SELECT 
                relationship_type,
                COUNT(*) as count,
                ROUND(AVG(similarity_score), 3) as avg_similarity,
                ROUND(AVG(confidence_score), 3) as avg_confidence
            FROM code_relationships
            GROUP BY relationship_type
            ORDER BY count DESC
        `);
        
        relationshipStats.rows.forEach(rel => {
            console.log(`🔗 ${rel.relationship_type}: ${rel.count} relationships`);
            console.log(`   📊 Avg Similarity: ${rel.avg_similarity} | Confidence: ${rel.avg_confidence}`);
        });
        
        // Test 3: Enhanced semantic search with relationship context
        console.log('\n\n🔍 ENHANCED SEMANTIC SEARCH TESTS');
        console.log('=' .repeat(50));
        
        const searchQueries = [
            'patient health medical',
            'React component UI',
            'database repository service',
            'authentication security'
        ];
        
        for (const query of searchQueries) {
            console.log(`\n🎯 Enhanced Search: "${query}"`);
            const results = await navigator.semanticCodeSearch(query, 5, 0.2);
            
            if (results.length > 0) {
                for (const result of results) {
                    console.log(`   📁 ${result.file_path.split('/').pop()}:${result.line_number}`);
                    console.log(`      🏷️  ${result.header_type}: ${result.header_name}`);
                    console.log(`      🎯 Score: ${(result.similarity_score * 100).toFixed(1)}%`);
                    
                    // Find related code through relationships
                    const relatedQuery = await navigator.assistant.client.query(`
                        SELECT COUNT(*) as related_count,
                               STRING_AGG(DISTINCT cr.relationship_type, ', ') as relationship_types
                        FROM code_relationships cr
                        WHERE cr.source_header_id = $1 OR cr.target_header_id = $1
                    `, [result.id]);
                    
                    if (relatedQuery.rows[0].related_count > 0) {
                        console.log(`      🔗 ${relatedQuery.rows[0].related_count} relationships: ${relatedQuery.rows[0].relationship_types}`);
                    }
                }
            } else {
                console.log('   No results found');
            }
        }
        
        // Test 4: Relationship-enhanced navigation
        console.log('\n\n🧭 RELATIONSHIP-ENHANCED NAVIGATION');
        console.log('=' .repeat(50));
        
        // Find a file with good relationship coverage
        const fileWithRelationships = await navigator.assistant.client.query(`
            SELECT 
                cf.file_path,
                COUNT(DISTINCT cr.id) as relationship_count,
                COUNT(DISTINCT ch.id) as header_count
            FROM code_files cf
            JOIN code_headers ch ON cf.id = ch.file_id
            LEFT JOIN code_relationships cr ON (cr.source_header_id = ch.id OR cr.target_header_id = ch.id)
            WHERE cf.file_path LIKE '%.ts' OR cf.file_path LIKE '%.tsx'
            GROUP BY cf.file_path
            HAVING COUNT(DISTINCT cr.id) > 10
            ORDER BY relationship_count DESC
            LIMIT 3
        `);
        
        for (const file of fileWithRelationships.rows) {
            console.log(`\n🎯 Navigation Test: ${file.file_path}`);
            console.log(`   📊 ${file.header_count} headers, ${file.relationship_count} relationships`);
            
            // Test enhanced navigation
            const navigation = await navigator.navigateToRelated(file.file_path, 'all', 5);
            
            if (!navigation.error && navigation.related_files.length > 0) {
                console.log(`   🔗 Related files found:`);
                navigation.related_files.forEach((rel, i) => {
                    const score = (rel.similarity_score * rel.relevance * 100).toFixed(1);
                    console.log(`      ${i+1}. ${rel.file_path.split('/').pop()} (${score}%)`);
                });
                
                // Show relationship types for the first related file
                const firstRelated = navigation.related_files[0];
                const relationshipTypes = await navigator.assistant.client.query(`
                    SELECT DISTINCT cr.relationship_type, COUNT(*) as count
                    FROM code_relationships cr
                    JOIN code_headers ch1 ON cr.source_header_id = ch1.id
                    JOIN code_headers ch2 ON cr.target_header_id = ch2.id
                    JOIN code_files cf1 ON ch1.file_id = cf1.id
                    JOIN code_files cf2 ON ch2.file_id = cf2.id
                    WHERE (cf1.file_path = $1 AND cf2.file_path = $2)
                       OR (cf1.file_path = $2 AND cf2.file_path = $1)
                    GROUP BY cr.relationship_type
                    ORDER BY count DESC
                `, [file.file_path, firstRelated.file_path]);
                
                if (relationshipTypes.rows.length > 0) {
                    console.log(`   🔗 Relationship types with ${firstRelated.file_path.split('/').pop()}:`);
                    relationshipTypes.rows.forEach(type => {
                        console.log(`      - ${type.relationship_type}: ${type.count} connections`);
                    });
                }
            }
        }
        
        // Test 5: Pattern discovery with relationships
        console.log('\n\n🔮 ENHANCED PATTERN DISCOVERY');
        console.log('=' .repeat(50));
        
        const patternAnalysis = await navigator.assistant.client.query(`
            SELECT 
                cr.relationship_type,
                ch1.header_type as source_type,
                ch2.header_type as target_type,
                COUNT(*) as pattern_frequency
            FROM code_relationships cr
            JOIN code_headers ch1 ON cr.source_header_id = ch1.id
            JOIN code_headers ch2 ON cr.target_header_id = ch2.id
            GROUP BY cr.relationship_type, ch1.header_type, ch2.header_type
            HAVING COUNT(*) >= 5
            ORDER BY pattern_frequency DESC
            LIMIT 10
        `);
        
        console.log('🏆 Most Common Code Relationship Patterns:');
        patternAnalysis.rows.forEach((pattern, i) => {
            console.log(`   ${i+1}. ${pattern.source_type} → ${pattern.target_type}`);
            console.log(`      🔗 Via: ${pattern.relationship_type}`);
            console.log(`      📊 Frequency: ${pattern.pattern_frequency} occurrences`);
        });
        
    } catch (error) {
        console.error('❌ Enhanced navigation test failed:', error.message);
        console.error('   Stack:', error.stack);
    } finally {
        await navigator.disconnect();
        console.log('\n🎉 Enhanced navigation testing completed!');
    }
}

testEnhancedNavigation();
