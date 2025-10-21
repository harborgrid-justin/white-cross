#!/usr/bin/env node

/**
 * Intelligent Code Navigation and Pattern Matching System
 * 
 * Advanced AI-powered code exploration using vector embeddings for:
 * - Semantic code navigation
 * - Pattern matching and discovery
 * - Cross-component relationship mapping
 * - Intelligent code suggestions
 */

const { AICodeAssistant } = require('./ai_code_assistant.js');

class IntelligentCodeNavigator {
  constructor() {
    this.assistant = new AICodeAssistant();
  }

  async connect() {
    await this.assistant.connect();
  }

  async disconnect() {
    await this.assistant.disconnect();
  }

  // Generate embedding for query text to find similar code
  generateQueryEmbedding(queryText) {
    const embedding = new Array(1536).fill(0);
    const words = queryText.toLowerCase().split(/\W+/).filter(w => w.length > 0);
    
    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      for (let j = 0; j < word.length; j++) {
        const charCode = word.charCodeAt(j);
        const index = (charCode + i * j) % 1536;
        embedding[index] += Math.sin(charCode + i) * 0.1;
      }
    }

    // Enhanced domain-specific features for better matching
    const domainTerms = {
      health: ['health', 'medical', 'patient', 'record', 'medication', 'allergy', 'appointment'],
      react: ['component', 'hook', 'useState', 'useEffect', 'props', 'jsx', 'tsx'],
      backend: ['service', 'repository', 'model', 'controller', 'api', 'database'],
      ui: ['button', 'modal', 'form', 'input', 'navigation', 'layout'],
      business: ['student', 'school', 'enrollment', 'grade', 'class']
    };
    
    let termIndex = 0;
    Object.entries(domainTerms).forEach(([domain, terms]) => {
      terms.forEach((term, idx) => {
        if (queryText.toLowerCase().includes(term)) {
          const baseIndex = (termIndex * 50 + idx * 10) % 1536;
          embedding[baseIndex] += 0.4;
          for (let k = 1; k <= 3; k++) {
            if (baseIndex + k < 1536) embedding[baseIndex + k] += 0.2 / k;
            if (baseIndex - k >= 0) embedding[baseIndex - k] += 0.2 / k;
          }
        }
      });
      termIndex++;
    });

    // Normalize
    const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
    if (magnitude > 0) {
      for (let i = 0; i < embedding.length; i++) {
        embedding[i] /= magnitude;
      }
    }

    return embedding;
  }

  // Calculate cosine similarity between two embeddings
  calculateSimilarity(embedding1, embedding2) {
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

  // Semantic code search using embeddings
  async semanticCodeSearch(query, limit = 15, threshold = 0.1) {
    try {
      const queryEmbedding = this.generateQueryEmbedding(query);
      
      const searchQuery = `
        SELECT 
          ch.id,
          cf.file_path,
          ch.header_name,
          ch.header_type,
          ch.line_number,
          ch.header_content,
          ce.embedding,
          ce.embedding_model
        FROM code_embeddings ce
        JOIN code_headers ch ON ce.header_id = ch.id
        JOIN code_files cf ON ch.file_id = cf.id
        ORDER BY ch.id
        LIMIT 1000
      `;
      
      const result = await this.assistant.client.query(searchQuery);
      
      // Calculate similarities and rank results
      const similarities = result.rows.map(row => {
        const embedding = JSON.parse(row.embedding);
        const similarity = this.calculateSimilarity(queryEmbedding, embedding);
        
        return {
          ...row,
          similarity_score: similarity
        };
      }).filter(item => item.similarity_score >= threshold)
        .sort((a, b) => b.similarity_score - a.similarity_score)
        .slice(0, limit);

      return similarities;
    } catch (error) {
      console.error('Semantic search error:', error.message);
      return [];
    }
  }

  // Find similar code patterns
  async findSimilarPatterns(referenceFile, referenceHeader, limit = 10) {
    try {
      // Get the reference embedding
      const refQuery = `
        SELECT ce.embedding, ch.header_content, cf.file_path
        FROM code_embeddings ce
        JOIN code_headers ch ON ce.header_id = ch.id
        JOIN code_files cf ON ch.file_id = cf.id
        WHERE cf.file_path LIKE $1 AND ch.header_name = $2
        LIMIT 1
      `;
      
      const refResult = await this.assistant.client.query(refQuery, [`%${referenceFile}%`, referenceHeader]);
      
      if (refResult.rows.length === 0) {
        return { error: 'Reference code not found' };
      }
      
      const referenceEmbedding = JSON.parse(refResult.rows[0].embedding);
      
      // Find similar patterns
      const allQuery = `
        SELECT 
          ch.id,
          cf.file_path,
          ch.header_name,
          ch.header_type,
          ch.line_number,
          ch.header_content,
          ce.embedding
        FROM code_embeddings ce
        JOIN code_headers ch ON ce.header_id = ch.id
        JOIN code_files cf ON ch.file_id = cf.id
        WHERE cf.file_path NOT LIKE $1 OR ch.header_name != $2
        ORDER BY ch.id
        LIMIT 2000
      `;
      
      const allResult = await this.assistant.client.query(allQuery, [`%${referenceFile}%`, referenceHeader]);
      
      const similarities = allResult.rows.map(row => {
        const embedding = JSON.parse(row.embedding);
        const similarity = this.calculateSimilarity(referenceEmbedding, embedding);
        
        return {
          ...row,
          similarity_score: similarity
        };
      }).filter(item => item.similarity_score >= 0.3)
        .sort((a, b) => b.similarity_score - a.similarity_score)
        .slice(0, limit);

      return {
        reference: {
          file: refResult.rows[0].file_path,
          header: referenceHeader,
          content: refResult.rows[0].header_content.substring(0, 100) + '...'
        },
        similar_patterns: similarities
      };
    } catch (error) {
      console.error('Pattern matching error:', error.message);
      return { error: error.message };
    }
  }

  // Navigate to related code components
  async navigateToRelated(currentFile, context = 'all', limit = 12) {
    try {
      const query = `
        SELECT 
          ch.id,
          cf.file_path,
          ch.header_name,
          ch.header_type,
          ch.line_number,
          ch.header_content,
          ce.embedding,
          ce.embedding_model
        FROM code_embeddings ce
        JOIN code_headers ch ON ce.header_id = ch.id
        JOIN code_files cf ON ch.file_id = cf.id
        WHERE cf.file_path LIKE $1
        ORDER BY ch.line_number
      `;
      
      const currentResult = await this.assistant.client.query(query, [`%${currentFile}%`]);
      
      if (currentResult.rows.length === 0) {
        return { error: 'Current file not found in embeddings' };
      }
      
      // Create composite embedding from current file
      const fileEmbeddings = currentResult.rows.map(row => JSON.parse(row.embedding));
      const compositeEmbedding = new Array(1536).fill(0);
      
      fileEmbeddings.forEach(embedding => {
        for (let i = 0; i < embedding.length; i++) {
          compositeEmbedding[i] += embedding[i] / fileEmbeddings.length;
        }
      });
      
      // Find related files
      const allQuery = `
        SELECT DISTINCT
          cf.file_path,
          cf.file_type,
          COUNT(ch.id) as header_count,
          ARRAY_AGG(ch.header_type) as header_types,
          ARRAY_AGG(ce.embedding) as embeddings
        FROM code_embeddings ce
        JOIN code_headers ch ON ce.header_id = ch.id
        JOIN code_files cf ON ch.file_id = cf.id
        WHERE cf.file_path NOT LIKE $1
        GROUP BY cf.file_path, cf.file_type
        HAVING COUNT(ch.id) > 0
        LIMIT 500
      `;
      
      const allResult = await this.assistant.client.query(allQuery, [`%${currentFile}%`]);
      
      const related = allResult.rows.map(row => {
        // Calculate average similarity with the file
        let embeddings;
        try {
          embeddings = Array.isArray(row.embeddings) ? 
            row.embeddings.map(e => typeof e === 'string' ? JSON.parse(e) : e) :
            [JSON.parse(row.embeddings)];
        } catch (error) {
          console.warn('Navigation warning: Invalid embedding format');
          return null;
        }
        
        let totalSimilarity = 0;
        
        embeddings.forEach(embedding => {
          totalSimilarity += this.calculateSimilarity(compositeEmbedding, embedding);
        });
        
        const avgSimilarity = totalSimilarity / embeddings.length;
        
        return {
          file_path: row.file_path,
          file_type: row.file_type,
          header_count: parseInt(row.header_count),
          header_types: [...new Set(row.header_types)], // Remove duplicates
          similarity_score: avgSimilarity,
          relevance: this.calculateRelevance(row.file_path, row.header_types, context)
        };
      }).filter(item => item && item.similarity_score >= 0.1)
        .sort((a, b) => (b.similarity_score * b.relevance) - (a.similarity_score * a.relevance))
        .slice(0, limit);

      return {
        current_file: currentFile,
        file_info: {
          header_count: currentResult.rows.length,
          header_types: [...new Set(currentResult.rows.map(r => r.header_type))],
          model_types: [...new Set(currentResult.rows.map(r => r.embedding_model))]
        },
        related_files: related
      };
    } catch (error) {
      console.error('Navigation error:', error.message);
      return { error: error.message };
    }
  }

  calculateRelevance(filePath, headerTypes, context) {
    let relevance = 1.0;
    
    // Boost relevance based on context
    switch (context) {
      case 'health':
        if (filePath.includes('health') || filePath.includes('medical') || 
            headerTypes.some(t => t.includes('Health') || t.includes('Medical'))) {
          relevance *= 2.0;
        }
        break;
      case 'components':
        if (filePath.includes('components') || headerTypes.includes('component')) {
          relevance *= 2.0;
        }
        break;
      case 'services':
        if (filePath.includes('services') || headerTypes.includes('service')) {
          relevance *= 2.0;
        }
        break;
      case 'models':
        if (filePath.includes('models') || headerTypes.includes('class')) {
          relevance *= 2.0;
        }
        break;
    }
    
    // Boost for same directory
    if (filePath.includes('/')) {
      relevance *= 1.2;
    }
    
    return relevance;
  }

  // Discover code patterns and insights
  async discoverPatterns(domain = 'all', minOccurrence = 3) {
    try {
      const query = `
        SELECT 
          ch.header_type,
          ch.header_name,
          cf.file_path,
          ch.header_content,
          ce.embedding_model,
          COUNT(*) OVER (PARTITION BY ch.header_type) as type_count,
          COUNT(*) OVER (PARTITION BY SUBSTRING(ch.header_name, 1, 10)) as name_pattern_count
        FROM code_embeddings ce
        JOIN code_headers ch ON ce.header_id = ch.id
        JOIN code_files cf ON ch.file_id = cf.id
        ORDER BY type_count DESC, name_pattern_count DESC
        LIMIT 1000
      `;
      
      const result = await this.assistant.client.query(query);
      
      // Analyze patterns
      const patterns = {
        type_patterns: {},
        naming_patterns: {},
        file_patterns: {},
        domain_insights: {}
      };
      
      result.rows.forEach(row => {
        // Type patterns
        if (!patterns.type_patterns[row.header_type]) {
          patterns.type_patterns[row.header_type] = [];
        }
        patterns.type_patterns[row.header_type].push({
          name: row.header_name,
          file: row.file_path,
          model: row.embedding_model
        });
        
        // Naming patterns
        const namePrefix = row.header_name.substring(0, 8);
        if (!patterns.naming_patterns[namePrefix]) {
          patterns.naming_patterns[namePrefix] = 0;
        }
        patterns.naming_patterns[namePrefix]++;
        
        // File patterns
        const directory = row.file_path.split('/').slice(-2, -1)[0] || 'root';
        if (!patterns.file_patterns[directory]) {
          patterns.file_patterns[directory] = [];
        }
        patterns.file_patterns[directory].push(row.header_type);
      });
      
      // Filter and sort patterns
      Object.keys(patterns.naming_patterns).forEach(key => {
        if (patterns.naming_patterns[key] < minOccurrence) {
          delete patterns.naming_patterns[key];
        }
      });
      
      return {
        summary: {
          total_analyzed: result.rows.length,
          unique_types: Object.keys(patterns.type_patterns).length,
          common_patterns: Object.keys(patterns.naming_patterns).length
        },
        patterns: patterns
      };
    } catch (error) {
      console.error('Pattern discovery error:', error.message);
      return { error: error.message };
    }
  }

  // Interactive exploration interface
  async explore(command, ...args) {
    console.log(`🔍 Executing: ${command} ${args.join(' ')}`);
    
    switch (command) {
      case 'search':
        const searchResults = await this.semanticCodeSearch(args[0], parseInt(args[1]) || 10);
        console.log(`\n📊 Found ${searchResults.length} semantic matches for "${args[0]}":\n`);
        searchResults.forEach((result, idx) => {
          console.log(`${idx + 1}. 📁 ${result.file_path}:${result.line_number}`);
          console.log(`   🏷️  ${result.header_type}: ${result.header_name}`);
          console.log(`   🎯 Similarity: ${(result.similarity_score * 100).toFixed(1)}%`);
          console.log(`   📝 ${result.header_content.substring(0, 80)}...\n`);
        });
        break;
        
      case 'similar':
        const similarResults = await this.findSimilarPatterns(args[0], args[1]);
        if (similarResults.error) {
          console.log(`❌ ${similarResults.error}`);
          return;
        }
        console.log(`\n🔍 Similar patterns to ${similarResults.reference.header} in ${similarResults.reference.file}:\n`);
        similarResults.similar_patterns.forEach((result, idx) => {
          console.log(`${idx + 1}. 📁 ${result.file_path}:${result.line_number}`);
          console.log(`   🏷️  ${result.header_type}: ${result.header_name}`);
          console.log(`   🎯 Similarity: ${(result.similarity_score * 100).toFixed(1)}%\n`);
        });
        break;
        
      case 'navigate':
        const navResults = await this.navigateToRelated(args[0], args[1] || 'all');
        if (navResults.error) {
          console.log(`❌ ${navResults.error}`);
          return;
        }
        console.log(`\n🧭 Related files to ${navResults.current_file}:\n`);
        navResults.related_files.forEach((result, idx) => {
          console.log(`${idx + 1}. 📁 ${result.file_path}`);
          console.log(`   📊 Headers: ${result.header_count} (${result.header_types.join(', ')})`);
          console.log(`   🎯 Relevance: ${(result.similarity_score * result.relevance * 100).toFixed(1)}%\n`);
        });
        break;
        
      case 'patterns':
        const patternResults = await this.discoverPatterns(args[0] || 'all');
        if (patternResults.error) {
          console.log(`❌ ${patternResults.error}`);
          return;
        }
        console.log(`\n🎯 Code Pattern Analysis:`);
        console.log(`   📊 Total analyzed: ${patternResults.summary.total_analyzed}`);
        console.log(`   🏷️  Unique types: ${patternResults.summary.unique_types}`);
        console.log(`   📝 Common patterns: ${patternResults.summary.common_patterns}\n`);
        
        console.log('🏆 Top Code Types:');
        Object.entries(patternResults.patterns.type_patterns)
          .sort((a, b) => b[1].length - a[1].length)
          .slice(0, 10)
          .forEach(([type, items]) => {
            console.log(`   ${type}: ${items.length} occurrences`);
          });
        break;
        
      default:
        console.log(`\n🤖 Intelligent Code Navigator Commands:`);
        console.log(`   search <query> [limit]     - Semantic code search`);
        console.log(`   similar <file> <header>    - Find similar patterns`);
        console.log(`   navigate <file> [context]  - Find related files`);
        console.log(`   patterns [domain]          - Discover code patterns`);
        console.log(`\nContext options: health, components, services, models, all`);
    }
  }
}

async function main() {
  const navigator = new IntelligentCodeNavigator();
  
  try {
    await navigator.connect();
    
    const args = process.argv.slice(2);
    if (args.length === 0) {
      await navigator.explore('help');
    } else {
      await navigator.explore(args[0], ...args.slice(1));
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await navigator.disconnect();
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { IntelligentCodeNavigator };
