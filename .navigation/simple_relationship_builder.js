#!/usr/bin/env node

/**
 * Simplified Relationship Builder
 * 
 * Builds essential code relationships efficiently:
 * - High-similarity semantic relationships
 * - Domain-specific groupings
 * - Directory-based relationships
 */

const { AICodeAssistant } = require('./ai_code_assistant.js');

class SimpleRelationshipBuilder {
  constructor() {
    this.assistant = new AICodeAssistant();
  }

  async connect() {
    await this.assistant.connect();
  }

  async disconnect() {
    await this.assistant.disconnect();
  }

  // Build high-confidence semantic relationships using database functions
  async buildHighConfidenceSemanticRelationships() {
    console.log('🔗 Building high-confidence semantic relationships...');
    
    const query = `
      WITH similarity_pairs AS (
        SELECT 
          ce1.header_id as source_id,
          ce2.header_id as target_id,
          1 - (ce1.embedding <=> ce2.embedding) as similarity
        FROM code_embeddings ce1
        CROSS JOIN code_embeddings ce2
        WHERE ce1.header_id < ce2.header_id
        AND 1 - (ce1.embedding <=> ce2.embedding) > 0.5
        LIMIT 1000
      )
      INSERT INTO code_relationships 
      (source_header_id, target_header_id, relationship_type, similarity_score, confidence_score)
      SELECT 
        source_id,
        target_id,
        'semantic_similarity',
        similarity,
        similarity * 0.9
      FROM similarity_pairs
      ON CONFLICT (source_header_id, target_header_id, relationship_type) DO NOTHING;
    `;
    
    const result = await this.assistant.client.query(query);
    const insertedCount = result.rowCount || 0;
    
    console.log(`   ✅ Created ${insertedCount} high-confidence semantic relationships`);
    return insertedCount;
  }

  // Build domain relationships using simple keyword matching
  async buildDomainRelationships() {
    console.log('🏥 Building domain relationships...');
    
    const domains = [
      { name: 'health_domain', keywords: ['patient', 'medical', 'health'] },
      { name: 'react_component', keywords: ['component', 'hook', 'useState'] },
      { name: 'data_layer', keywords: ['repository', 'model', 'database'] }
    ];
    
    let totalRelationships = 0;
    
    for (const domain of domains) {
      console.log(`   Processing ${domain.name}...`);
      
      // Find headers matching domain keywords
      const findHeaders = `
        SELECT ch.id
        FROM code_headers ch
        JOIN code_files cf ON ch.file_id = cf.id
        WHERE LOWER(ch.header_content || ' ' || cf.file_path) ~ $1
        LIMIT 100
      `;
      
      const pattern = domain.keywords.join('|');
      const headers = await this.assistant.client.query(findHeaders, [pattern]);
      
      if (headers.rows.length > 1) {
        // Create relationships between domain-related headers
        const headerIds = headers.rows.map(row => row.id);
        
        // Insert relationships in a simpler way
        for (let i = 0; i < headerIds.length - 1; i++) {
          for (let j = i + 1; j < Math.min(i + 10, headerIds.length); j++) {
            try {
              await this.assistant.client.query(`
                INSERT INTO code_relationships 
                (source_header_id, target_header_id, relationship_type, similarity_score, confidence_score)
                VALUES ($1, $2, $3, 0.7, 0.6)
                ON CONFLICT (source_header_id, target_header_id, relationship_type) DO NOTHING
              `, [headerIds[i], headerIds[j], domain.name]);
              totalRelationships++;
            } catch (error) {
              // Skip conflicts silently
            }
          }
        }
        console.log(`     ✅ Created relationships for ${domain.name}`);
      }
    }
    
    return totalRelationships;
  }

  // Build directory-based structural relationships
  async buildStructuralRelationships() {
    console.log('📁 Building structural relationships...');
    
    const query = `
      WITH directory_headers AS (
        SELECT 
          ch.id,
          SUBSTRING(cf.file_path FROM '^[^/]+/[^/]+') as directory_group
        FROM code_headers ch
        JOIN code_files cf ON ch.file_id = cf.id
        WHERE cf.file_path LIKE '%/%'
      )
      INSERT INTO code_relationships 
      (source_header_id, target_header_id, relationship_type, similarity_score, confidence_score)
      SELECT 
        h1.id as source_id,
        h2.id as target_id,
        'same_directory' as relationship_type,
        0.5 as similarity_score,
        0.8 as confidence_score
      FROM directory_headers h1
      JOIN directory_headers h2 ON h1.directory_group = h2.directory_group
      WHERE h1.id < h2.id
      AND h1.directory_group IS NOT NULL
      ON CONFLICT (source_header_id, target_header_id, relationship_type) DO NOTHING
    `;
    
    const result = await this.assistant.client.query(query);
    const count = result.rowCount || 0;
    
    console.log(`   ✅ Created ${count} structural relationships`);
    return count;
  }

  // Build file-type relationships
  async buildFileTypeRelationships() {
    console.log('📄 Building file-type relationships...');
    
    const query = `
      WITH file_type_headers AS (
        SELECT 
          ch.id,
          CASE 
            WHEN cf.file_path LIKE '%.tsx' THEN 'react_tsx'
            WHEN cf.file_path LIKE '%.ts' THEN 'typescript'
            WHEN cf.file_path LIKE '%.js' THEN 'javascript'
            WHEN cf.file_path LIKE '%.sql' THEN 'database'
            ELSE 'other'
          END as file_type_group
        FROM code_headers ch
        JOIN code_files cf ON ch.file_id = cf.id
      )
      INSERT INTO code_relationships 
      (source_header_id, target_header_id, relationship_type, similarity_score, confidence_score)
      SELECT 
        h1.id as source_id,
        h2.id as target_id,
        CONCAT('same_filetype_', h1.file_type_group) as relationship_type,
        0.4 as similarity_score,
        0.7 as confidence_score
      FROM file_type_headers h1
      JOIN file_type_headers h2 ON h1.file_type_group = h2.file_type_group
      WHERE h1.id < h2.id
      AND h1.file_type_group != 'other'
      AND random() < 0.1  -- Sample only 10% to avoid too many relationships
      ON CONFLICT (source_header_id, target_header_id, relationship_type) DO NOTHING
    `;
    
    const result = await this.assistant.client.query(query);
    const count = result.rowCount || 0;
    
    console.log(`   ✅ Created ${count} file-type relationships`);
    return count;
  }

  // Main execution
  async buildAllRelationships() {
    console.log('🚀 Simple Relationship Builder Started');
    console.log('======================================\n');

    try {
      await this.connect();
      
      // Clear existing relationships
      console.log('🧹 Clearing existing relationships...');
      await this.assistant.client.query('DELETE FROM code_relationships');
      
      let totalRelationships = 0;
      
      // 1. Build high-confidence semantic relationships
      console.log('\n1️⃣ Building semantic relationships...');
      totalRelationships += await this.buildHighConfidenceSemanticRelationships();
      
      // 2. Build domain relationships
      console.log('\n2️⃣ Building domain relationships...');
      totalRelationships += await this.buildDomainRelationships();
      
      // 3. Build structural relationships
      console.log('\n3️⃣ Building structural relationships...');
      totalRelationships += await this.buildStructuralRelationships();
      
      // 4. Build file-type relationships
      console.log('\n4️⃣ Building file-type relationships...');
      totalRelationships += await this.buildFileTypeRelationships();
      
      // 5. Generate final statistics
      console.log('\n📊 Final Relationship Statistics:');
      const stats = await this.assistant.client.query(`
        SELECT 
          relationship_type,
          COUNT(*) as count,
          ROUND(AVG(similarity_score), 3) as avg_similarity,
          ROUND(AVG(confidence_score), 3) as avg_confidence
        FROM code_relationships
        GROUP BY relationship_type
        ORDER BY count DESC
      `);
      
      stats.rows.forEach(stat => {
        console.log(`   🔗 ${stat.relationship_type}: ${stat.count} relationships`);
        console.log(`      📊 Avg Similarity: ${stat.avg_similarity}`);
        console.log(`      🎯 Avg Confidence: ${stat.avg_confidence}`);
      });
      
      console.log(`\n🎉 Relationship building completed successfully!`);
      console.log(`   📈 Total relationships created: ${totalRelationships}`);
      
      return totalRelationships;
      
    } catch (error) {
      console.error('❌ Error building relationships:', error.message);
      throw error;
    } finally {
      await this.disconnect();
    }
  }
}

async function main() {
  const builder = new SimpleRelationshipBuilder();
  
  try {
    await builder.buildAllRelationships();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { SimpleRelationshipBuilder };
