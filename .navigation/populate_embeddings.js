#!/usr/bin/env node

/**
 * Populate Vector Embeddings for All Code Headers
 * 
 * This script uses the existing AI code assistant to generate and store
 * embeddings for all code headers in the database.
 */

const { AICodeAssistant } = require('./ai_code_assistant.js');

class EmbeddingPopulator {
  constructor() {
    this.assistant = new AICodeAssistant();
    this.batchSize = 50;
    this.processed = 0;
    this.errors = 0;
  }

  generateSimpleEmbedding(text) {
    // Generate a simple 1536-dimensional embedding based on text characteristics
    const embedding = new Array(1536).fill(0);
    
    // Use text characteristics to create pseudo-embeddings
    const words = text.toLowerCase().split(/\W+/).filter(w => w.length > 0);
    
    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      for (let j = 0; j < word.length; j++) {
        const charCode = word.charCodeAt(j);
        const index = (charCode + i * j) % 1536;
        embedding[index] += Math.sin(charCode + i) * 0.1;
      }
    }

    // Add some domain-specific features
    const healthTerms = ['health', 'medical', 'patient', 'record', 'medication', 'allergy'];
    const reactTerms = ['component', 'hook', 'useState', 'useEffect', 'props', 'jsx', 'tsx'];
    const backendTerms = ['service', 'repository', 'model', 'controller', 'api', 'database'];
    
    healthTerms.forEach((term, idx) => {
      if (text.toLowerCase().includes(term)) {
        embedding[idx * 40 % 1536] += 0.3;
      }
    });
    
    reactTerms.forEach((term, idx) => {
      if (text.toLowerCase().includes(term)) {
        embedding[(idx * 50 + 400) % 1536] += 0.25;
      }
    });
    
    backendTerms.forEach((term, idx) => {
      if (text.toLowerCase().includes(term)) {
        embedding[(idx * 60 + 800) % 1536] += 0.2;
      }
    });

    // Normalize the embedding
    const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
    if (magnitude > 0) {
      for (let i = 0; i < embedding.length; i++) {
        embedding[i] /= magnitude;
      }
    }

    return embedding;
  }

  createEmbeddingText(header) {
    const parts = [];
    
    // Add file context
    if (header.file_path) {
      const fileName = header.file_path.split('/').pop();
      const directory = header.file_path.split('/').slice(-2, -1)[0] || '';
      parts.push(`file: ${fileName}`);
      if (directory) parts.push(`directory: ${directory}`);
    }
    
    // Add header information
    if (header.header_type) parts.push(`type: ${header.header_type}`);
    if (header.header_name) parts.push(`name: ${header.header_name}`);
    
    // Add code content if available
    if (header.header_content && header.header_content.trim()) {
      parts.push(`code: ${header.header_content.trim()}`);
    }
    
    return parts.join(' | ');
  }

  async getHeadersWithoutEmbeddings() {
    try {
      const query = `
        SELECT ch.id, cf.file_path, ch.header_name, ch.header_type, 
               ch.line_number, ch.header_content
        FROM code_headers ch
        JOIN code_files cf ON ch.file_id = cf.id
        LEFT JOIN code_embeddings ce ON ch.id = ce.header_id
        WHERE ce.header_id IS NULL
        ORDER BY cf.file_path, ch.line_number
        LIMIT 1000
      `;
      
      const result = await this.assistant.client.query(query);
      return result.rows;
    } catch (error) {
      console.error('Error fetching headers:', error.message);
      return [];
    }
  }

  async saveEmbedding(headerId, embedding) {
    try {
      const query = `
        INSERT INTO code_embeddings (header_id, embedding, embedding_model, created_at)
        VALUES ($1, $2, $3, NOW())
        ON CONFLICT (header_id) DO UPDATE SET
          embedding = $2,
          embedding_model = $3
      `;

      await this.assistant.client.query(query, [
        headerId, 
        `[${embedding.join(',')}]`, 
        'simple-hash-embedding-v2'
      ]);
      
      return true;
    } catch (error) {
      console.error(`Error saving embedding for header ${headerId}:`, error.message);
      return false;
    }
  }

  async getEmbeddingStats() {
    try {
      const query = `
        SELECT 
          (SELECT COUNT(*) FROM code_headers) as total_headers,
          (SELECT COUNT(*) FROM code_embeddings) as total_embeddings,
          COUNT(DISTINCT embedding_model) as model_count
        FROM code_embeddings
      `;
      
      const result = await this.assistant.client.query(query);
      return result.rows[0];
    } catch (error) {
      console.error('Error getting stats:', error.message);
      return { total_headers: 0, total_embeddings: 0, model_count: 0 };
    }
  }

  async populateEmbeddings() {
    console.log('🚀 White Cross Vector Embedding Populator');
    console.log('=========================================\n');

    try {
      // Connect to database
      await this.assistant.connect();
      console.log('🔌 Connected to vector database');

      // Show initial stats
      let stats = await this.getEmbeddingStats();
      console.log(`\n📊 Initial Statistics:`);
      console.log(`   📦 Total Code Headers: ${parseInt(stats.total_headers).toLocaleString()}`);
      console.log(`   🔢 Existing Embeddings: ${parseInt(stats.total_embeddings).toLocaleString()}`);
      console.log(`   📈 Coverage: ${Math.round(stats.total_embeddings/stats.total_headers*100)}%`);

      // Get headers that need embeddings
      console.log('\n🔍 Fetching headers without embeddings...');
      const headers = await this.getHeadersWithoutEmbeddings();
      
      if (headers.length === 0) {
        console.log('✅ All headers already have embeddings!');
        return;
      }

      console.log(`📦 Found ${headers.length} headers to process\n`);

      // Process in batches
      for (let i = 0; i < headers.length; i += this.batchSize) {
        const batch = headers.slice(i, i + this.batchSize);
        
        console.log(`🔄 Processing batch ${Math.floor(i / this.batchSize) + 1}/${Math.ceil(headers.length / this.batchSize)} (${batch.length} items)`);

        for (const header of batch) {
          try {
            // Create embedding text
            const embeddingText = this.createEmbeddingText(header);
            
            // Generate embedding
            const embedding = this.generateSimpleEmbedding(embeddingText);
            
            // Save to database
            const success = await this.saveEmbedding(header.id, embedding);
            
            if (success) {
              this.processed++;
            } else {
              this.errors++;
            }
            
            if (this.processed % 25 === 0) {
              console.log(`   ✅ Processed ${this.processed} embeddings...`);
            }
            
          } catch (error) {
            console.error(`   ❌ Failed to process header ${header.id}: ${error.message}`);
            this.errors++;
          }
        }

        // Small delay between batches
        if (i + this.batchSize < headers.length) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }

      // Show final stats
      stats = await this.getEmbeddingStats();
      console.log(`\n🎉 Embedding population completed!`);
      console.log(`\n📈 Final Statistics:`);
      console.log(`   📦 Total Code Headers: ${parseInt(stats.total_headers).toLocaleString()}`);
      console.log(`   🔢 Total Embeddings: ${parseInt(stats.total_embeddings).toLocaleString()}`);
      console.log(`   📈 Coverage: ${Math.round(stats.total_embeddings/stats.total_headers*100)}%`);
      console.log(`   ✅ Successfully processed: ${this.processed}`);
      console.log(`   ❌ Errors: ${this.errors}`);

    } catch (error) {
      console.error('❌ Fatal error:', error.message);
      throw error;
    } finally {
      await this.assistant.disconnect();
    }
  }
}

async function main() {
  const populator = new EmbeddingPopulator();
  
  try {
    await populator.populateEmbeddings();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { EmbeddingPopulator };
