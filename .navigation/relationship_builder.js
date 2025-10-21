#!/usr/bin/env node

/**
 * Advanced Code Relationship Builder
 * 
 * Builds intelligent relationships between code components:
 * - Import/Export relationships
 * - Function call relationships  
 * - Semantic similarity relationships
 * - Cross-component dependencies
 * - Interface implementations
 */

const { AICodeAssistant } = require('./ai_code_assistant.js');
const fs = require('fs').promises;
const path = require('path');

class RelationshipBuilder {
  constructor() {
    this.assistant = new AICodeAssistant();
    this.relationships = new Map();
    this.processedFiles = new Set();
  }

  async connect() {
    await this.assistant.connect();
  }

  async disconnect() {
    await this.assistant.disconnect();
  }

  // Extract import relationships from code content
  extractImportRelationships(filePath, content) {
    const relationships = [];
    
    // ES6 imports
    const importRegex = /import\s+.*?from\s+['"`]([^'"`]+)['"`]/g;
    let match;
    while ((match = importRegex.exec(content)) !== null) {
      relationships.push({
        type: 'imports',
        source: filePath,
        target: this.resolveImportPath(filePath, match[1]),
        confidence: 0.9
      });
    }
    
    // CommonJS requires
    const requireRegex = /require\s*\(\s*['"`]([^'"`]+)['"`]\s*\)/g;
    while ((match = requireRegex.exec(content)) !== null) {
      relationships.push({
        type: 'requires',
        source: filePath,
        target: this.resolveImportPath(filePath, match[1]),
        confidence: 0.9
      });
    }
    
    return relationships;
  }

  // Extract function call relationships
  extractFunctionCallRelationships(filePath, content, headers) {
    const relationships = [];
    
    headers.forEach(header => {
      if (header.header_type === 'function' || header.header_type === 'method') {
        // Find calls to this function in other files
        const functionName = header.header_name;
        const callRegex = new RegExp(`\\b${functionName}\\s*\\(`, 'g');
        
        if (callRegex.test(content)) {
          relationships.push({
            type: 'calls',
            source: filePath,
            target: `${filePath}:${functionName}`,
            confidence: 0.8,
            line_number: header.line_number
          });
        }
      }
    });
    
    return relationships;
  }

  // Extract interface/class relationships
  extractInterfaceRelationships(filePath, content) {
    const relationships = [];
    
    // Class extends
    const extendsRegex = /class\s+(\w+)\s+extends\s+(\w+)/g;
    let match;
    while ((match = extendsRegex.exec(content)) !== null) {
      relationships.push({
        type: 'extends',
        source: `${filePath}:${match[1]}`,
        target: `${filePath}:${match[2]}`,
        confidence: 0.95
      });
    }
    
    // Interface implements
    const implementsRegex = /class\s+(\w+)\s+implements\s+(\w+)/g;
    while ((match = implementsRegex.exec(content)) !== null) {
      relationships.push({
        type: 'implements',
        source: `${filePath}:${match[1]}`,
        target: `${filePath}:${match[2]}`,
        confidence: 0.95
      });
    }
    
    return relationships;
  }

  // Build semantic relationships using embeddings (optimized for memory)
  async buildSemanticRelationships(threshold = 0.4) {
    console.log('🔗 Building semantic relationships...');
    
    const semanticRelationships = [];
    const batchSize = 500;
    
    // Get total count first
    const countResult = await this.assistant.client.query(
      'SELECT COUNT(*) as total FROM code_embeddings'
    );
    const totalEmbeddings = parseInt(countResult.rows[0].total);
    
    console.log(`   Processing ${totalEmbeddings} embeddings in batches of ${batchSize}...`);
    
    // Process in smaller batches to avoid memory issues
    for (let offset = 0; offset < totalEmbeddings; offset += batchSize) {
      console.log(`   Batch ${Math.floor(offset/batchSize) + 1}/${Math.ceil(totalEmbeddings/batchSize)}`);
      
      const query = `
        SELECT 
          ch.id as header_id,
          cf.file_path,
          ch.header_name,
          ch.header_type,
          ce.embedding
        FROM code_embeddings ce
        JOIN code_headers ch ON ce.header_id = ch.id
        JOIN code_files cf ON ch.file_id = cf.id
        ORDER BY ch.id
        LIMIT $1 OFFSET $2
      `;
      
      const batch = await this.assistant.client.query(query, [batchSize, offset]);
      
      // Compare each item with a smaller subset for relationships
      for (let i = 0; i < batch.rows.length; i++) {
        const source = batch.rows[i];
        const sourceEmbedding = JSON.parse(source.embedding);
        
        // Only compare with next few items to limit combinations
        for (let j = i + 1; j < Math.min(i + 50, batch.rows.length); j++) {
          const target = batch.rows[j];
          
          if (source.file_path !== target.file_path) {
            const targetEmbedding = JSON.parse(target.embedding);
            const similarity = this.calculateCosineSimilarity(sourceEmbedding, targetEmbedding);
            
            if (similarity >= threshold) {
              semanticRelationships.push({
                source_header_id: source.header_id,
                target_header_id: target.header_id,
                relationship_type: 'semantic_similarity',
                similarity_score: similarity,
                confidence_score: similarity * 0.8
              });
            }
          }
        }
      }
      
      // Force garbage collection if available
      if (global.gc) {
        global.gc();
      }
    }
    
    return semanticRelationships;
  }

  // Build domain-specific relationships (optimized)
  async buildDomainRelationships() {
    console.log('🏥 Building domain-specific relationships...');
    
    const domainPatterns = {
      health: {
        keywords: ['patient', 'medical', 'health', 'record', 'medication', 'allergy'],
        relationship: 'health_domain'
      },
      react: {
        keywords: ['component', 'hook', 'useState', 'useEffect', 'props'],
        relationship: 'react_component'
      },
      database: {
        keywords: ['repository', 'model', 'sequelize', 'database'],
        relationship: 'data_layer'
      }
    };
    
    const domainRelationships = [];
    
    for (const [domain, config] of Object.entries(domainPatterns)) {
      console.log(`   Processing ${domain} domain...`);
      
      const query = `
        SELECT ch.id, cf.file_path, ch.header_name
        FROM code_headers ch
        JOIN code_files cf ON ch.file_id = cf.id
        WHERE LOWER(ch.header_content) ~ $1
        OR LOWER(cf.file_path) ~ $1
        LIMIT 200
      `;
      
      const keywordPattern = config.keywords.join('|');
      const result = await this.assistant.client.query(query, [keywordPattern]);
      
      // Limit combinations to prevent memory issues
      const maxCombinations = Math.min(result.rows.length, 50);
      
      for (let i = 0; i < maxCombinations - 1; i++) {
        for (let j = i + 1; j < maxCombinations; j++) {
          domainRelationships.push({
            source_header_id: result.rows[i].id,
            target_header_id: result.rows[j].id,
            relationship_type: config.relationship,
            similarity_score: 0.7,
            confidence_score: 0.6
          });
        }
      }
    }
    
    return domainRelationships;
  }

  // Build file structure relationships
  async buildStructuralRelationships() {
    console.log('📁 Building structural relationships...');
    
    const query = `
      SELECT DISTINCT cf.file_path, ch.id, ch.header_name, ch.header_type
      FROM code_files cf
      JOIN code_headers ch ON cf.id = ch.file_id
      ORDER BY cf.file_path
    `;
    
    const result = await this.assistant.client.query(query);
    const structuralRelationships = [];
    
    // Group files by directory
    const filesByDirectory = new Map();
    
    result.rows.forEach(row => {
      const directory = path.dirname(row.file_path);
      if (!filesByDirectory.has(directory)) {
        filesByDirectory.set(directory, []);
      }
      filesByDirectory.get(directory).push(row);
    });
    
    // Create relationships within directories
    for (const [directory, files] of filesByDirectory.entries()) {
      if (files.length > 1) {
        for (let i = 0; i < files.length - 1; i++) {
          for (let j = i + 1; j < files.length; j++) {
            structuralRelationships.push({
              source_header_id: files[i].id,
              target_header_id: files[j].id,
              relationship_type: 'same_directory',
              similarity_score: 0.5,
              confidence_score: 0.8,
              metadata: {
                directory: directory,
                source_file: files[i].file_path,
                target_file: files[j].file_path
              }
            });
          }
        }
      }
    }
    
    return structuralRelationships;
  }

  // Calculate cosine similarity
  calculateCosineSimilarity(embedding1, embedding2) {
    if (embedding1.length !== embedding2.length) return 0;
    
    let dotProduct = 0;
    let magnitude1 = 0;
    let magnitude2 = 0;
    
    for (let i = 0; i < embedding1.length; i++) {
      dotProduct += embedding1[i] * embedding2[i];
      magnitude1 += embedding1[i] * embedding1[i];
      magnitude2 += embedding2[i] * embedding2[i];
    }
    
    magnitude1 = Math.sqrt(magnitude1);
    magnitude2 = Math.sqrt(magnitude2);
    
    if (magnitude1 === 0 || magnitude2 === 0) return 0;
    
    return dotProduct / (magnitude1 * magnitude2);
  }

  // Resolve import path to actual file
  resolveImportPath(currentFile, importPath) {
    if (importPath.startsWith('./') || importPath.startsWith('../')) {
      return path.resolve(path.dirname(currentFile), importPath);
    }
    return importPath; // External module or absolute path
  }

  // Save relationships to database
  async saveRelationships(relationships) {
    console.log(`💾 Saving ${relationships.length} relationships...`);
    
    for (const rel of relationships) {
      try {
        const query = `
          INSERT INTO code_relationships 
          (source_header_id, target_header_id, relationship_type, similarity_score, confidence_score, created_at)
          VALUES ($1, $2, $3, $4, $5, NOW())
          ON CONFLICT (source_header_id, target_header_id, relationship_type) 
          DO UPDATE SET
            similarity_score = $4,
            confidence_score = $5
        `;
        
        await this.assistant.client.query(query, [
          rel.source_header_id,
          rel.target_header_id,
          rel.relationship_type,
          rel.similarity_score || 0.5,
          rel.confidence_score || 0.5
        ]);
      } catch (error) {
        console.warn(`Warning: Failed to save relationship: ${error.message}`);
      }
    }
  }

  // Build all types of relationships
  async buildAllRelationships() {
    console.log('🚀 Advanced Relationship Builder Started');
    console.log('=========================================\n');

    try {
      await this.connect();
      
      // Clear existing relationships to rebuild fresh
      console.log('🧹 Clearing existing relationships...');
      await this.assistant.client.query('DELETE FROM code_relationships');
      
      const allRelationships = [];
      
      // 1. Build semantic relationships
      console.log('\n1️⃣ Building semantic similarity relationships...');
      const semanticRels = await this.buildSemanticRelationships(0.3);
      allRelationships.push(...semanticRels);
      console.log(`   ✅ Found ${semanticRels.length} semantic relationships`);
      
      // 2. Build domain relationships
      console.log('\n2️⃣ Building domain-specific relationships...');
      const domainRels = await this.buildDomainRelationships();
      allRelationships.push(...domainRels);
      console.log(`   ✅ Found ${domainRels.length} domain relationships`);
      
      // 3. Build structural relationships
      console.log('\n3️⃣ Building structural relationships...');
      const structuralRels = await this.buildStructuralRelationships();
      allRelationships.push(...structuralRels);
      console.log(`   ✅ Found ${structuralRels.length} structural relationships`);
      
      // 4. Save all relationships
      console.log('\n4️⃣ Saving relationships to database...');
      await this.saveRelationships(allRelationships);
      
      // 5. Generate relationship statistics
      console.log('\n📊 Relationship Statistics:');
      const stats = await this.assistant.client.query(`
        SELECT 
          relationship_type,
          COUNT(*) as count,
          AVG(similarity_score) as avg_similarity,
          AVG(confidence_score) as avg_confidence
        FROM code_relationships
        GROUP BY relationship_type
        ORDER BY count DESC
      `);
      
      stats.rows.forEach(stat => {
        console.log(`   🔗 ${stat.relationship_type}: ${stat.count} relationships`);
        console.log(`      📊 Avg Similarity: ${parseFloat(stat.avg_similarity).toFixed(3)}`);
        console.log(`      🎯 Avg Confidence: ${parseFloat(stat.avg_confidence).toFixed(3)}`);
      });
      
      console.log(`\n🎉 Relationship building completed!`);
      console.log(`   📈 Total relationships created: ${allRelationships.length}`);
      
    } catch (error) {
      console.error('❌ Error building relationships:', error.message);
      throw error;
    } finally {
      await this.disconnect();
    }
  }
}

async function main() {
  const builder = new RelationshipBuilder();
  
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

module.exports = { RelationshipBuilder };
