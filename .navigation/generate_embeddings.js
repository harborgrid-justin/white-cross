#!/usr/bin/env node

/**
 * Generate Vector Embeddings for Code Headers
 * 
 * This script connects to the Neon vector database and generates embeddings
 * for all indexed code headers using OpenAI's text-embedding-ada-002 model.
 */

const { Client } = require('pg');

// Database configuration
const DB_CONFIG = {
  host: 'ep-damp-king-88790039.us-east-2.aws.neon.tech',
  database: 'code_vectors',
  user: 'code_vectors_owner',
  password: 'napi_9swdk3jnr10d5so8yxkgt9mf33aygbc71oopp63evsvh12ne7y8yddkslnn0u5z8',
  port: 5432,
  ssl: { rejectUnauthorized: false }
};

// OpenAI configuration (you'll need to set this)
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

class EmbeddingGenerator {
  constructor() {
    this.client = new Client(DB_CONFIG);
    this.batchSize = 100; // Process in batches to avoid rate limits
    this.delay = 1000; // 1 second delay between batches
  }

  async connect() {
    try {
      await this.client.connect();
      console.log('🔌 Connected to Neon vector database');
    } catch (error) {
      console.error('❌ Failed to connect to database:', error.message);
      throw error;
    }
  }

  async disconnect() {
    await this.client.end();
    console.log('🔌 Disconnected from database');
  }

  async generateEmbedding(text) {
    if (!OPENAI_API_KEY) {
      // Fallback: generate a simple hash-based embedding for demo purposes
      return this.generateSimpleEmbedding(text);
    }

    try {
      const response = await fetch('https://api.openai.com/v1/embeddings', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: text,
          model: 'text-embedding-ada-002'
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(`OpenAI API error: ${data.error?.message || 'Unknown error'}`);
      }

      return data.data[0].embedding;
    } catch (error) {
      console.warn(`⚠️  Failed to generate OpenAI embedding for "${text.substring(0, 50)}...": ${error.message}`);
      return this.generateSimpleEmbedding(text);
    }
  }

  generateSimpleEmbedding(text) {
    // Generate a simple 384-dimensional embedding based on text characteristics
    const embedding = new Array(384).fill(0);
    
    // Use text characteristics to create pseudo-embeddings
    const words = text.toLowerCase().split(/\W+/).filter(w => w.length > 0);
    
    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      for (let j = 0; j < word.length; j++) {
        const charCode = word.charCodeAt(j);
        const index = (charCode + i * j) % 384;
        embedding[index] += Math.sin(charCode + i) * 0.1;
      }
    }

    // Normalize the embedding
    const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
    if (magnitude > 0) {
      for (let i = 0; i < embedding.length; i++) {
        embedding[i] /= magnitude;
      }
    }

    return embedding;
  }

  async getCodeHeaders() {
    const query = `
      SELECT ch.id, ch.file_path, ch.header_name, ch.header_type, ch.line_number, ch.code_snippet
      FROM code_headers ch
      LEFT JOIN code_embeddings ce ON ch.id = ce.header_id
      WHERE ce.header_id IS NULL
      ORDER BY ch.file_path, ch.line_number
    `;

    const result = await this.client.query(query);
    return result.rows;
  }

  async saveEmbedding(headerId, embedding) {
    const query = `
      INSERT INTO code_embeddings (header_id, embedding_vector, model_name, created_at)
      VALUES ($1, $2, $3, NOW())
      ON CONFLICT (header_id) DO UPDATE SET
        embedding_vector = $2,
        model_name = $3,
        updated_at = NOW()
    `;

    const modelName = OPENAI_API_KEY ? 'text-embedding-ada-002' : 'simple-hash-embedding';
    await this.client.query(query, [headerId, JSON.stringify(embedding), modelName]);
  }

  async generateAllEmbeddings() {
    console.log('🔍 Fetching code headers without embeddings...');
    const headers = await this.getCodeHeaders();
    
    if (headers.length === 0) {
      console.log('✅ All code headers already have embeddings!');
      return;
    }

    console.log(`📊 Found ${headers.length} code headers to process`);
    
    if (!OPENAI_API_KEY) {
      console.log('⚠️  No OpenAI API key found. Using simple hash-based embeddings for demo.');
      console.log('💡 Set OPENAI_API_KEY environment variable for real embeddings.');
    }

    let processed = 0;
    const total = headers.length;

    for (let i = 0; i < headers.length; i += this.batchSize) {
      const batch = headers.slice(i, i + this.batchSize);
      
      console.log(`\n🔄 Processing batch ${Math.floor(i / this.batchSize) + 1}/${Math.ceil(total / this.batchSize)} (${batch.length} items)`);

      for (const header of batch) {
        try {
          // Create embedding text from header information
          const embeddingText = this.createEmbeddingText(header);
          
          // Generate embedding
          const embedding = await this.generateEmbedding(embeddingText);
          
          // Save to database
          await this.saveEmbedding(header.id, embedding);
          
          processed++;
          
          if (processed % 10 === 0) {
            console.log(`✅ Processed ${processed}/${total} embeddings (${Math.round(processed/total*100)}%)`);
          }
          
          // Small delay to avoid overwhelming the API
          if (OPENAI_API_KEY) {
            await new Promise(resolve => setTimeout(resolve, 50));
          }
          
        } catch (error) {
          console.error(`❌ Failed to process header ${header.id}: ${error.message}`);
        }
      }

      // Delay between batches
      if (i + this.batchSize < headers.length && OPENAI_API_KEY) {
        console.log(`⏱️  Waiting ${this.delay}ms before next batch...`);
        await new Promise(resolve => setTimeout(resolve, this.delay));
      }
    }

    console.log(`\n🎉 Successfully generated embeddings for ${processed}/${total} code headers!`);
  }

  createEmbeddingText(header) {
    // Create meaningful text for embedding generation
    const parts = [];
    
    // Add file context
    const fileName = header.file_path.split('/').pop();
    const directory = header.file_path.split('/').slice(-2, -1)[0] || '';
    parts.push(`file: ${fileName}`);
    if (directory) parts.push(`directory: ${directory}`);
    
    // Add header information
    parts.push(`type: ${header.header_type}`);
    parts.push(`name: ${header.header_name}`);
    
    // Add code snippet if available
    if (header.code_snippet && header.code_snippet.trim()) {
      parts.push(`code: ${header.code_snippet.trim()}`);
    }
    
    return parts.join(' | ');
  }

  async getEmbeddingStats() {
    const query = `
      SELECT 
        COUNT(*) as total_embeddings,
        COUNT(DISTINCT model_name) as model_count,
        model_name,
        COUNT(*) as count_per_model
      FROM code_embeddings 
      GROUP BY model_name
    `;
    
    const result = await this.client.query(query);
    return result.rows;
  }

  async showStats() {
    console.log('\n📊 Embedding Statistics:');
    
    const stats = await this.getEmbeddingStats();
    if (stats.length === 0) {
      console.log('   No embeddings found.');
      return;
    }

    const totalQuery = 'SELECT COUNT(*) as total FROM code_headers';
    const totalResult = await this.client.query(totalQuery);
    const totalHeaders = parseInt(totalResult.rows[0].total);
    
    const totalEmbeddings = stats.reduce((sum, stat) => sum + parseInt(stat.count_per_model), 0);
    
    console.log(`   📦 Total Code Headers: ${totalHeaders.toLocaleString()}`);
    console.log(`   🔢 Total Embeddings: ${totalEmbeddings.toLocaleString()}`);
    console.log(`   📈 Coverage: ${Math.round(totalEmbeddings/totalHeaders*100)}%`);
    console.log('\n   📋 By Model:');
    
    stats.forEach(stat => {
      console.log(`   • ${stat.model_name}: ${parseInt(stat.count_per_model).toLocaleString()} embeddings`);
    });
  }
}

async function main() {
  console.log('🚀 White Cross Code Embedding Generator');
  console.log('=====================================\n');

  const generator = new EmbeddingGenerator();
  
  try {
    await generator.connect();
    await generator.showStats();
    await generator.generateAllEmbeddings();
    await generator.showStats();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await generator.disconnect();
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { EmbeddingGenerator };
