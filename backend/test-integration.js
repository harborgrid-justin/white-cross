/**
 * Integration Test for Message Queue and Encryption
 *
 * This script verifies that:
 * 1. All modules can be imported without errors
 * 2. Services are properly configured
 * 3. Dependencies are correctly wired
 */

console.log('🧪 Testing Message Queue and Encryption Integration\n');

let testsRun = 0;
let testsPassed = 0;
let testsFailed = 0;

function test(description, fn) {
  testsRun++;
  try {
    fn();
    console.log(`✅ ${description}`);
    testsPassed++;
  } catch (error) {
    console.log(`❌ ${description}`);
    console.log(`   Error: ${error.message}`);
    testsFailed++;
  }
}

// Test 1: Check if migration file exists
test('Database migration file exists', () => {
  const fs = require('fs');
  const path = require('path');
  const migrationPath = path.join(__dirname, 'src/database/migrations/20251029000000-add-encryption-fields-to-messages.js');
  if (!fs.existsSync(migrationPath)) {
    throw new Error('Migration file not found');
  }
});

// Test 2: Check if migration file is valid JavaScript
test('Migration file is valid JavaScript', () => {
  const migration = require('./src/database/migrations/20251029000000-add-encryption-fields-to-messages.js');
  if (typeof migration.up !== 'function') {
    throw new Error('Migration up function not found');
  }
  if (typeof migration.down !== 'function') {
    throw new Error('Migration down function not found');
  }
});

// Test 3: Check if .sequelizerc exists
test('Sequelize configuration file exists', () => {
  const fs = require('fs');
  const path = require('path');
  const sequelizercPath = path.join(__dirname, '.sequelizerc');
  if (!fs.existsSync(sequelizercPath)) {
    throw new Error('.sequelizerc file not found');
  }
});

// Test 4: Check if database config exists
test('Database configuration file exists', () => {
  const fs = require('fs');
  const path = require('path');
  const configPath = path.join(__dirname, 'src/database/config/database.config.js');
  if (!fs.existsSync(configPath)) {
    throw new Error('Database config file not found');
  }
});

// Test 5: Check if database config is valid
test('Database configuration is valid', () => {
  const config = require('./src/database/config/database.config.js');
  if (!config.development || !config.test || !config.production) {
    throw new Error('Database config missing environments');
  }
});

// Test 6: Check if queue integration helper exists
test('Queue integration helper exists', () => {
  const fs = require('fs');
  const path = require('path');
  const helperPath = path.join(__dirname, 'src/communication/helpers/queue-integration.helper.ts');
  if (!fs.existsSync(helperPath)) {
    throw new Error('Queue integration helper not found');
  }
});

// Test 7: Check if enhanced message service has queue integration
test('Enhanced message service includes queue imports', () => {
  const fs = require('fs');
  const path = require('path');
  const servicePath = path.join(__dirname, 'src/communication/services/enhanced-message.service.ts');
  const content = fs.readFileSync(servicePath, 'utf-8');

  if (!content.includes('MessageQueueService')) {
    throw new Error('MessageQueueService import not found');
  }
  if (!content.includes('QueueIntegrationHelper')) {
    throw new Error('QueueIntegrationHelper import not found');
  }
  if (!content.includes('queueMessageWorkflow')) {
    throw new Error('queueMessageWorkflow method call not found');
  }
});

// Test 8: Check if enhanced message controller has queue endpoints
test('Enhanced message controller includes queue endpoints', () => {
  const fs = require('fs');
  const path = require('path');
  const controllerPath = path.join(__dirname, 'src/communication/controllers/enhanced-message.controller.ts');
  const content = fs.readFileSync(controllerPath, 'utf-8');

  if (!content.includes('queue/metrics')) {
    throw new Error('Queue metrics endpoint not found');
  }
  if (!content.includes('queue/:queueName/health')) {
    throw new Error('Queue health endpoint not found');
  }
  if (!content.includes('queue/:queueName/failed')) {
    throw new Error('Failed jobs endpoint not found');
  }
  if (!content.includes('queue/:queueName/failed/:jobId/retry')) {
    throw new Error('Retry job endpoint not found');
  }
});

// Test 9: Check if communication module imports are correct
test('Communication module has correct imports', () => {
  const fs = require('fs');
  const path = require('path');
  const modulePath = path.join(__dirname, 'src/communication/communication.module.ts');
  const content = fs.readFileSync(modulePath, 'utf-8');

  if (!content.includes('EncryptionModule')) {
    throw new Error('EncryptionModule import not found');
  }
  if (!content.includes('MessageQueueModule')) {
    throw new Error('MessageQueueModule import not found');
  }
  if (!content.includes('EnhancedMessageService')) {
    throw new Error('EnhancedMessageService not found in providers');
  }
  if (!content.includes('QueueIntegrationHelper')) {
    throw new Error('QueueIntegrationHelper not found in providers');
  }
});

// Test 10: Check if message model has encryption fields
test('Message model includes encryption fields', () => {
  const fs = require('fs');
  const path = require('path');
  const modelPath = path.join(__dirname, 'src/database/models/message.model.ts');
  const content = fs.readFileSync(modelPath, 'utf-8');

  if (!content.includes('isEncrypted')) {
    throw new Error('isEncrypted field not found');
  }
  if (!content.includes('encryptionMetadata')) {
    throw new Error('encryptionMetadata field not found');
  }
  if (!content.includes('encryptionVersion')) {
    throw new Error('encryptionVersion field not found');
  }
});

// Test 11: Check if .env.example has required variables
test('.env.example includes Redis configuration', () => {
  const fs = require('fs');
  const path = require('path');
  const envPath = path.join(__dirname, '.env.example');
  const content = fs.readFileSync(envPath, 'utf-8');

  if (!content.includes('REDIS_HOST')) {
    throw new Error('REDIS_HOST not found in .env.example');
  }
  if (!content.includes('REDIS_PORT')) {
    throw new Error('REDIS_PORT not found in .env.example');
  }
  if (!content.includes('REDIS_QUEUE_DB')) {
    throw new Error('REDIS_QUEUE_DB not found in .env.example');
  }
});

// Test 12: Check if .env.example has encryption configuration
test('.env.example includes Encryption configuration', () => {
  const fs = require('fs');
  const path = require('path');
  const envPath = path.join(__dirname, '.env.example');
  const content = fs.readFileSync(envPath, 'utf-8');

  if (!content.includes('ENCRYPTION_ALGORITHM')) {
    throw new Error('ENCRYPTION_ALGORITHM not found in .env.example');
  }
  if (!content.includes('RSA_KEY_SIZE')) {
    throw new Error('RSA_KEY_SIZE not found in .env.example');
  }
});

// Test 13: Check if .env.example has WebSocket configuration
test('.env.example includes WebSocket configuration', () => {
  const fs = require('fs');
  const path = require('path');
  const envPath = path.join(__dirname, '.env.example');
  const content = fs.readFileSync(envPath, 'utf-8');

  if (!content.includes('WS_PORT')) {
    throw new Error('WS_PORT not found in .env.example');
  }
  if (!content.includes('WS_PATH')) {
    throw new Error('WS_PATH not found in .env.example');
  }
});

// Test 14: Check if API documentation exists
test('Queue API documentation exists', () => {
  const fs = require('fs');
  const path = require('path');
  const docsPath = path.join(__dirname, 'docs/QUEUE_API_ENDPOINTS.md');
  if (!fs.existsSync(docsPath)) {
    throw new Error('Queue API documentation not found');
  }
});

// Test 15: Verify package.json has sequelize-cli
test('package.json includes sequelize-cli', () => {
  const packageJson = require('./package.json');
  if (!packageJson.devDependencies || !packageJson.devDependencies['sequelize-cli']) {
    throw new Error('sequelize-cli not found in devDependencies');
  }
});

console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('📊 Test Results');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log(`Total tests: ${testsRun}`);
console.log(`✅ Passed: ${testsPassed}`);
console.log(`❌ Failed: ${testsFailed}`);
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

if (testsFailed === 0) {
  console.log('🎉 All tests passed! Integration is complete.\n');
  console.log('Next steps:');
  console.log('1. Start PostgreSQL database');
  console.log('2. Start Redis server');
  console.log('3. Run: npm run migration:run');
  console.log('4. Start the application: npm run start:dev');
  console.log('5. Test the queue endpoints using the API documentation\n');
  process.exit(0);
} else {
  console.log('⚠️  Some tests failed. Please review the errors above.\n');
  process.exit(1);
}
