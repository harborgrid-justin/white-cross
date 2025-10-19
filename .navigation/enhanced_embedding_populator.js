#!/usr/bin/env node#!/usr/bin/env node



/**/**

 * Enhanced Vector Embedding Populator with OpenAI Integration * Enhanced Vector Embedding Populator with OpenAI Integration

 * *

 * This script generates embeddings for all code headers using: * This script generates embeddings for all code headers using:

 * 1. Simple hash-based embeddings (primary) * 1. Simple hash-based embeddings (primary)

 * 2. OpenAI embeddings (secondary, for enhanced semantic search) * 2. OpenAI embeddings (secondary, for enhanced semantic search)

 */ */



const { AICodeAssistant } = require('./ai_code_assistant.js');const { AICodeAssistant } = require('./ai_code_assistant.js');



class EnhancedEmbeddingPopulator {class EnhancedEmbeddingPopulator {

  constructor() {  constructor() {

    this.assistant = new AICodeAssistant();    this.assistant = new AICodeAssistant();

    this.batchSize = 100;    this.batchSize = 100;

    this.processed = 0;    this.processed = 0;

    this.errors = 0;    this.errors = 0;

    this.openaiProcessed = 0;    this.openaiProcessed = 0;

    this.openaiErrors = 0;    this.openaiErrors = 0;



    // OpenAI API configuration    // OpenAI API configuration

    this.openaiApiKey = process.env.OPENAI_API_KEY;    this.openaiApiKey = process.env.OPENAI_API_KEY;

    this.openaiEnabled = !!this.openaiApiKey;    this.openaiEnabled = !!this.openaiApiKey;



    console.log(`🤖 OpenAI Integration: ${this.openaiEnabled ? 'ENABLED' : 'DISABLED'}`);    console.log(`🤖 OpenAI Integration: ${this.openaiEnabled ? 'ENABLED' : 'DISABLED'}`);

  }  }



  generateSimpleEmbedding(text) {  generateSimpleEmbedding(text) {

    // Generate a simple 1536-dimensional embedding based on text characteristics    // Generate a simple 1536-dimensional embedding based on text characteristics

    const embedding = new Array(1536).fill(0);    const embedding = new Array(1536).fill(0);



    // Use text characteristics to create pseudo-embeddings    // Use text characteristics to create pseudo-embeddings

    const words = text    const words = text

      .toLowerCase()      .toLowerCase()

      .split(/\W+/)      .split(/\W+/)

      .filter(w => w.length > 0);      .filter(w => w.length > 0);



    for (let i = 0; i < words.length; i++) {    for (let i = 0; i < words.length; i++) {

      const word = words[i];      const word = words[i];

      for (let j = 0; j < word.length; j++) {      for (let j = 0; j < word.length; j++) {

        const charCode = word.charCodeAt(j);        const charCode = word.charCodeAt(j);

        const index = (charCode + i * j) % 1536;        const index = (charCode + i * j) % 1536;

        embedding[index] += Math.sin(charCode + i) * 0.1;        embedding[index] += Math.sin(charCode + i) * 0.1;

      }      }

    }    }



    // Enhanced domain-specific features    // Enhanced domain-specific features

    const domainTerms = {    const domainTerms = {

      health: [      health: [

        'health',        'health',

        'medical',        'medical',

        'patient',        'patient',

        'record',        'record',

        'medication',        'medication',

        'allergy',        'allergy',

        'appointment',        'appointment',

        'diagnosis',        'diagnosis',

        'treatment',        'treatment',

        'vital',        'vital',

      ],      ],

      react: [      react: [

        'component',        'component',

        'hook',        'hook',

        'useState',        'useState',

        'useEffect',        'useEffect',

        'props',        'props',

        'jsx',        'jsx',

        'tsx',        'tsx',

        'state',        'state',

        'dispatch',        'dispatch',

        'context',        'context',

      ],      ],

      backend: [      backend: [

        'service',        'service',

        'repository',        'repository',

        'model',        'model',

        'controller',        'controller',

        'api',        'api',

        'database',        'database',

        'migration',        'migration',

        'schema',        'schema',

        'sequelize',        'sequelize',

      ],      ],

      ui: [      ui: [

        'button',        'button',

        'modal',        'modal',

        'form',        'form',

        'input',        'input',

        'navigation',        'navigation',

        'layout',        'layout',

        'style',        'style',

        'theme',        'theme',

        'responsive',        'responsive',

      ],      ],

      business: [      business: [

        'student',        'student',

        'school',        'school',

        'enrollment',        'enrollment',

        'grade',        'grade',

        'class',        'class',

        'teacher',        'teacher',

        'admin',        'admin',

        'parent',        'parent',

        'guardian',        'guardian',

      ],      ],

    };    };



    let termIndex = 0;    let termIndex = 0;

    Object.entries(domainTerms).forEach(([domain, terms]) => {    Object.entries(domainTerms).forEach(([domain, terms]) => {

      terms.forEach((term, idx) => {      terms.forEach((term, idx) => {

        if (text.toLowerCase().includes(term)) {        if (text.toLowerCase().includes(term)) {

          const baseIndex = (termIndex * 50 + idx * 10) % 1536;          const baseIndex = (termIndex * 50 + idx * 10) % 1536;

          embedding[baseIndex] += 0.4;          embedding[baseIndex] += 0.4;

          // Add some neighboring context          // Add some neighboring context

          for (let k = 1; k <= 3; k++) {          for (let k = 1; k <= 3; k++) {

            if (baseIndex + k < 1536) embedding[baseIndex + k] += 0.2 / k;            if (baseIndex + k < 1536) embedding[baseIndex + k] += 0.2 / k;

            if (baseIndex - k >= 0) embedding[baseIndex - k] += 0.2 / k;            if (baseIndex - k >= 0) embedding[baseIndex - k] += 0.2 / k;

          }          }

        }        }

      });      });

      termIndex++;      termIndex++;

    });    });



    // Normalize the embedding    // Normalize the embedding

    const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));    const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));

    if (magnitude > 0) {    if (magnitude > 0) {

      for (let i = 0; i < embedding.length; i++) {      for (let i = 0; i < embedding.length; i++) {

        embedding[i] /= magnitude;        embedding[i] /= magnitude;

      }      }

    }    }



    return embedding;    return embedding;

  }  }



  async generateOpenAIEmbedding(text) {  async generateOpenAIEmbedding(text) {

    if (!this.openaiEnabled) return null;    if (!this.openaiEnabled) return null;



    try {    try {

      const response = await fetch('https://api.openai.com/v1/embeddings', {      const response = await fetch('https://api.openai.com/v1/embeddings', {

        method: 'POST',        method: 'POST',

        headers: {        headers: {

          Authorization: `Bearer ${this.openaiApiKey}`,          Authorization: `Bearer ${this.openaiApiKey}`,

          'Content-Type': 'application/json',          'Content-Type': 'application/json',

        },        },

        body: JSON.stringify({        body: JSON.stringify({

          input: text,          input: text,

          model: 'text-embedding-ada-002',          model: 'text-embedding-ada-002',

        }),        }),

      });      });



      if (!response.ok) {      if (!response.ok) {

        const errorData = await response.json();        const errorData = await response.json();

        throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);        throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);

      }      }



      const data = await response.json();      const data = await response.json();

      return data.data[0].embedding;      return data.data[0].embedding;

    } catch (error) {    } catch (error) {

      console.warn(`⚠️  OpenAI embedding failed: ${error.message}`);      console.warn(`⚠️  OpenAI embedding failed: ${error.message}`);

      return null;      return null;

    }    }

  }  }



  createEmbeddingText(header) {  createEmbeddingText(header) {

    const parts = [];    const parts = [];



    // Add file context    // Add file context

    if (header.file_path) {    if (header.file_path) {

      const fileName = header.file_path.split('/').pop();      const fileName = header.file_path.split('/').pop();

      const directory = header.file_path.split('/').slice(-2, -1)[0] || '';      const directory = header.file_path.split('/').slice(-2, -1)[0] || '';

      parts.push(`file: ${fileName}`);      parts.push(`file: ${fileName}`);

      if (directory) parts.push(`directory: ${directory}`);      if (directory) parts.push(`directory: ${directory}`);

    }    }



    // Add header information    // Add header information

    if (header.header_type) parts.push(`type: ${header.header_type}`);    if (header.header_type) parts.push(`type: ${header.header_type}`);

    if (header.header_name) parts.push(`name: ${header.header_name}`);    if (header.header_name) parts.push(`name: ${header.header_name}`);



    // Add code content if available    // Add code content if available

    if (header.header_content && header.header_content.trim()) {    if (header.header_content && header.header_content.trim()) {

      parts.push(`code: ${header.header_content.trim()}`);      parts.push(`code: ${header.header_content.trim()}`);

    }    }



    return parts.join(' | ');    return parts.join(' | ');

  }  }



  async getAllHeadersWithoutEmbeddings() {  async getAllHeadersWithoutEmbeddings() {

    try {    try {

      const query = `      const query = `

        SELECT ch.id, cf.file_path, ch.header_name, ch.header_type,        SELECT ch.id, cf.file_path, ch.header_name, ch.header_type,

               ch.line_number, ch.header_content               ch.line_number, ch.header_content

        FROM code_headers ch        FROM code_headers ch

        JOIN code_files cf ON ch.file_id = cf.id        JOIN code_files cf ON ch.file_id = cf.id

        LEFT JOIN code_embeddings ce ON ch.id = ce.header_id        LEFT JOIN code_embeddings ce ON ch.id = ce.header_id

        WHERE ce.header_id IS NULL        WHERE ce.header_id IS NULL

        ORDER BY cf.file_path, ch.line_number        ORDER BY cf.file_path, ch.line_number

      `;      `;



      const result = await this.assistant.client.query(query);      const result = await this.assistant.client.query(query);

      return result.rows;      return result.rows;

    } catch (error) {    } catch (error) {

      console.error('Error fetching headers:', error.message);      console.error('Error fetching headers:', error.message);

      return [];      return [];

    }    }

  }  }



  async saveEmbedding(headerId, simpleEmbedding, openaiEmbedding = null) {  async saveEmbedding(headerId, simpleEmbedding, openaiEmbedding = null) {

    try {    try {

      const query = `      const query = `

        INSERT INTO code_embeddings (header_id, embedding, embedding_model, created_at)        INSERT INTO code_embeddings (header_id, embedding, embedding_model, created_at)

        VALUES ($1, $2, $3, NOW())        VALUES ($1, $2, $3, NOW())

        ON CONFLICT (header_id) DO UPDATE SET        ON CONFLICT (header_id) DO UPDATE SET

          embedding = $2,          embedding = $2,

          embedding_model = $3          embedding_model = $3

      `;      `;



      const modelName = openaiEmbedding ? 'hybrid-openai-simple' : 'simple-hash-embedding-v3';      const modelName = openaiEmbedding ? 'hybrid-openai-simple' : 'simple-hash-embedding-v3';

      const embeddingToStore = openaiEmbedding || simpleEmbedding;      const embeddingToStore = openaiEmbedding || simpleEmbedding;



      await this.assistant.client.query(query, [      await this.assistant.client.query(query, [

        headerId,        headerId,

        `[${embeddingToStore.join(',')}]`,        `[${embeddingToStore.join(',')}]`,

        modelName,        modelName,

      ]);      ]);



      return true;      return true;

    } catch (error) {    } catch (error) {

      console.error(`Error saving embedding for header ${headerId}:`, error.message);      console.error(`Error saving embedding for header ${headerId}:`, error.message);

      return false;      return false;

    }    }

  }  }



  async getEmbeddingStats() {  async getEmbeddingStats() {

    try {    try {

      const query = `      const query = `

        SELECT        SELECT

          (SELECT COUNT(*) FROM code_headers) as total_headers,          (SELECT COUNT(*) FROM code_headers) as total_headers,

          (SELECT COUNT(*) FROM code_embeddings) as total_embeddings,          (SELECT COUNT(*) FROM code_embeddings) as total_embeddings,

          COUNT(DISTINCT embedding_model) as model_count          COUNT(DISTINCT embedding_model) as model_count

        FROM code_embeddings        FROM code_embeddings

      `;      `;



      const result = await this.assistant.client.query(query);      const result = await this.assistant.client.query(query);

      return result.rows[0];      return result.rows[0];

    } catch (error) {    } catch (error) {

      console.error('Error getting stats:', error.message);      console.error('Error getting stats:', error.message);

      return { total_headers: 0, total_embeddings: 0, model_count: 0 };      return { total_headers: 0, total_embeddings: 0, model_count: 0 };

    }    }

  }  }



  async populateAllEmbeddings() {  async populateAllEmbeddings() {

    console.log('🚀 Enhanced White Cross Vector Embedding Populator');    console.log('🚀 Enhanced White Cross Vector Embedding Populator');

    console.log('==================================================\n');    console.log('==================================================\n');



    try {    try {

      // Connect to database      // Connect to database

      await this.assistant.connect();      await this.assistant.connect();

      console.log('🔌 Connected to vector database');      console.log('🔌 Connected to vector database');



      // Show initial stats      // Show initial stats

      let stats = await this.getEmbeddingStats();      let stats = await this.getEmbeddingStats();

      console.log(`\n📊 Initial Statistics:`);      console.log(`\n📊 Initial Statistics:`);

      console.log(`   📦 Total Code Headers: ${parseInt(stats.total_headers).toLocaleString()}`);      console.log(`   📦 Total Code Headers: ${parseInt(stats.total_headers).toLocaleString()}`);

      console.log(      console.log(

        `   🔢 Existing Embeddings: ${parseInt(stats.total_embeddings).toLocaleString()}`        `   🔢 Existing Embeddings: ${parseInt(stats.total_embeddings).toLocaleString()}`

      );      );

      console.log(      console.log(

        `   📈 Coverage: ${Math.round((stats.total_embeddings / stats.total_headers) * 100)}%`        `   📈 Coverage: ${Math.round((stats.total_embeddings / stats.total_headers) * 100)}%`

      );      );



      // Get all headers that need embeddings      // Get all headers that need embeddings

      console.log('\n🔍 Fetching all headers without embeddings...');      console.log('\n🔍 Fetching all headers without embeddings...');

      const headers = await this.getAllHeadersWithoutEmbeddings();      const headers = await this.getAllHeadersWithoutEmbeddings();



      if (headers.length === 0) {      if (headers.length === 0) {

        console.log('✅ All headers already have embeddings!');        console.log('✅ All headers already have embeddings!');

        return;        return;

      }      }



      console.log(`📦 Found ${headers.length.toLocaleString()} headers to process\n`);      console.log(`📦 Found ${headers.length.toLocaleString()} headers to process\n`);



      // Process in batches      // Process in batches

      const totalBatches = Math.ceil(headers.length / this.batchSize);      const totalBatches = Math.ceil(headers.length / this.batchSize);



      for (let i = 0; i < headers.length; i += this.batchSize) {      for (let i = 0; i < headers.length; i += this.batchSize) {

        const batch = headers.slice(i, i + this.batchSize);        const batch = headers.slice(i, i + this.batchSize);



        console.log(        console.log(

          `🔄 Processing batch ${Math.floor(i / this.batchSize) + 1}/${totalBatches} (${          `🔄 Processing batch ${Math.floor(i / this.batchSize) + 1}/${totalBatches} (${

            batch.length            batch.length

          } items)`          } items)`

        );        );



        for (const header of batch) {        for (const header of batch) {

          try {          try {

            // Create embedding text            // Create embedding text

            const embeddingText = this.createEmbeddingText(header);            const embeddingText = this.createEmbeddingText(header);



            // Generate simple embedding (always)            // Generate simple embedding (always)

            const simpleEmbedding = this.generateSimpleEmbedding(embeddingText);            const simpleEmbedding = this.generateSimpleEmbedding(embeddingText);



            // Generate OpenAI embedding (if enabled and for selected items)            // Generate OpenAI embedding (if enabled and for selected items)

            let openaiEmbedding = null;            let openaiEmbedding = null;

            const shouldUseOpenAI =            const shouldUseOpenAI =

              this.openaiEnabled &&              this.openaiEnabled &&

              (embeddingText.includes('health') ||              (embeddingText.includes('health') ||

                embeddingText.includes('medication') ||                embeddingText.includes('medication') ||

                embeddingText.includes('patient') ||                embeddingText.includes('patient') ||

                embeddingText.includes('component') ||                embeddingText.includes('component') ||

                embeddingText.includes('service') ||                embeddingText.includes('service') ||

                this.processed % 10 === 0); // Every 10th item                this.processed % 10 === 0); // Every 10th item



            if (shouldUseOpenAI) {            if (shouldUseOpenAI) {

              openaiEmbedding = await this.generateOpenAIEmbedding(embeddingText);              openaiEmbedding = await this.generateOpenAIEmbedding(embeddingText);

              if (openaiEmbedding) {              if (openaiEmbedding) {

                this.openaiProcessed++;                this.openaiProcessed++;

              } else {              } else {

                this.openaiErrors++;                this.openaiErrors++;

              }              }



              // Rate limiting for OpenAI              // Rate limiting for OpenAI

              await new Promise(resolve => setTimeout(resolve, 100));              await new Promise(resolve => setTimeout(resolve, 100));

            }            }



            // Save to database            // Save to database

            const success = await this.saveEmbedding(header.id, simpleEmbedding, openaiEmbedding);            const success = await this.saveEmbedding(header.id, simpleEmbedding, openaiEmbedding);



            if (success) {            if (success) {

              this.processed++;              this.processed++;

            } else {            } else {

              this.errors++;              this.errors++;

            }            }



            if (this.processed % 100 === 0) {            if (this.processed % 100 === 0) {

              console.log(              console.log(

                `   ✅ Processed ${this.processed.toLocaleString()} embeddings (${                `   ✅ Processed ${this.processed.toLocaleString()} embeddings (${

                  this.openaiProcessed                  this.openaiProcessed

                } with OpenAI)...`                } with OpenAI)...`

              );              );

            }            }

          } catch (error) {          } catch (error) {

            console.error(`   ❌ Failed to process header ${header.id}: ${error.message}`);            console.error(`   ❌ Failed to process header ${header.id}: ${error.message}`);

            this.errors++;            this.errors++;

          }          }

        }        }



        // Progress update        // Progress update

        const progressPercent = Math.round(((i + batch.length) / headers.length) * 100);        const progressPercent = Math.round(((i + batch.length) / headers.length) * 100);

        console.log(`   📈 Progress: ${progressPercent}% (${i + batch.length}/${headers.length})`);        console.log(`   📈 Progress: ${progressPercent}% (${i + batch.length}/${headers.length})`);



        // Small delay between batches        // Small delay between batches

        if (i + this.batchSize < headers.length) {        if (i + this.batchSize < headers.length) {

          await new Promise(resolve => setTimeout(resolve, 200));          await new Promise(resolve => setTimeout(resolve, 200));

        }        }

      }      }



      // Show final stats      // Show final stats

      stats = await this.getEmbeddingStats();      stats = await this.getEmbeddingStats();

      console.log(`\n🎉 Enhanced embedding population completed!`);      console.log(`\n🎉 Enhanced embedding population completed!`);

      console.log(`\n📈 Final Statistics:`);      console.log(`\n📈 Final Statistics:`);

      console.log(`   📦 Total Code Headers: ${parseInt(stats.total_headers).toLocaleString()}`);      console.log(`   📦 Total Code Headers: ${parseInt(stats.total_headers).toLocaleString()}`);

      console.log(`   🔢 Total Embeddings: ${parseInt(stats.total_embeddings).toLocaleString()}`);      console.log(`   🔢 Total Embeddings: ${parseInt(stats.total_embeddings).toLocaleString()}`);

      console.log(      console.log(

        `   📈 Coverage: ${Math.round((stats.total_embeddings / stats.total_headers) * 100)}%`        `   📈 Coverage: ${Math.round((stats.total_embeddings / stats.total_headers) * 100)}%`

      );      );

      console.log(`   ✅ Successfully processed: ${this.processed.toLocaleString()}`);      console.log(`   ✅ Successfully processed: ${this.processed.toLocaleString()}`);

      console.log(`   🤖 OpenAI enhanced: ${this.openaiProcessed.toLocaleString()}`);      console.log(`   🤖 OpenAI enhanced: ${this.openaiProcessed.toLocaleString()}`);

      console.log(`   ❌ Errors: ${this.errors} (OpenAI: ${this.openaiErrors})`);      console.log(`   ❌ Errors: ${this.errors} (OpenAI: ${this.openaiErrors})`);

    } catch (error) {    } catch (error) {

      console.error('❌ Fatal error:', error.message);      console.error('❌ Fatal error:', error.message);

      throw error;      throw error;

    } finally {    } finally {

      await this.assistant.disconnect();      await this.assistant.disconnect();

    }    }

  }  }

}}



async function main() {async function main() {

  const populator = new EnhancedEmbeddingPopulator();  const populator = new EnhancedEmbeddingPopulator();



  try {  try {

    await populator.populateAllEmbeddings();    await populator.populateAllEmbeddings();

  } catch (error) {  } catch (error) {

    console.error('❌ Error:', error.message);    console.error('❌ Error:', error.message);

    process.exit(1);    process.exit(1);

  }  }

}}



// Run if called directly// Run if called directly

if (require.main === module) {if (require.main === module) {

  main().catch(console.error);  main().catch(console.error);

}}



module.exports = { EnhancedEmbeddingPopulator };module.exports = { EnhancedEmbeddingPopulator };
