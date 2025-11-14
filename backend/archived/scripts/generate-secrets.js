#!/usr/bin/env node
/**
 * Generate Strong Secrets Script
 *
 * SECURITY TOOL: Generates cryptographically strong random secrets
 * for use in environment variables and configuration files.
 *
 * Usage:
 *   node scripts/generate-secrets.js
 *   node scripts/generate-secrets.js --all
 *   node scripts/generate-secrets.js --key JWT_SECRET --bytes 32
 *
 * Features:
 * - Generates cryptographically secure random bytes
 * - Multiple encoding options (base64, hex, alphanumeric)
 * - Configurable byte length
 * - Can generate all required secrets at once
 * - Outputs in .env format for easy copying
 *
 * WARNING: Never commit generated secrets to version control!
 */

const crypto = require('crypto');
const readline = require('readline');

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  green: '\x1b[32m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
};

// Parse command line arguments
const args = process.argv.slice(2);
const generateAll = args.includes('--all');
const keyIndex = args.indexOf('--key');
const bytesIndex = args.indexOf('--bytes');

const specificKey = keyIndex !== -1 ? args[keyIndex + 1] : null;
const byteLength = bytesIndex !== -1 ? parseInt(args[bytesIndex + 1], 10) : 32;

/**
 * Generate cryptographically strong random secret
 */
function generateSecret(bytes = 32, encoding = 'base64') {
  const buffer = crypto.randomBytes(bytes);

  switch (encoding) {
    case 'base64':
      return buffer.toString('base64');
    case 'hex':
      return buffer.toString('hex');
    case 'alphanumeric':
      // Generate URL-safe alphanumeric string
      return buffer.toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
    default:
      return buffer.toString('base64');
  }
}

/**
 * Calculate entropy in bits
 */
function calculateEntropy(secret) {
  // Simplified entropy calculation
  return secret.length * Math.log2(256);
}

/**
 * Secret definitions
 */
const secrets = {
  JWT_SECRET: {
    description: 'JWT access token signing secret',
    bytes: 32,
    encoding: 'base64',
    minBits: 256,
  },
  JWT_REFRESH_SECRET: {
    description: 'JWT refresh token signing secret',
    bytes: 32,
    encoding: 'base64',
    minBits: 256,
  },
  CSRF_SECRET: {
    description: 'CSRF token signing secret',
    bytes: 32,
    encoding: 'base64',
    minBits: 256,
  },
  CONFIG_ENCRYPTION_KEY: {
    description: 'Configuration data encryption key',
    bytes: 32,
    encoding: 'hex',
    minBits: 256,
  },
  SESSION_SECRET: {
    description: 'Express session secret',
    bytes: 32,
    encoding: 'base64',
    minBits: 256,
  },
  ENCRYPTION_KEY: {
    description: 'General-purpose encryption key',
    bytes: 32,
    encoding: 'hex',
    minBits: 256,
  },
  API_KEY: {
    description: 'API key for service authentication',
    bytes: 32,
    encoding: 'alphanumeric',
    minBits: 256,
  },
};

console.log(`${colors.cyan}${colors.bold}Strong Secret Generator${colors.reset}\n`);

/**
 * Generate and display single secret
 */
function displaySecret(name, config) {
  const secret = generateSecret(config.bytes, config.encoding);
  const entropy = calculateEntropy(secret);

  console.log(`${colors.bold}${name}${colors.reset}`);
  console.log(`  Description: ${config.description}`);
  console.log(`  Length: ${secret.length} characters`);
  console.log(`  Entropy: ${entropy.toFixed(0)} bits (recommended: ${config.minBits}+ bits)`);
  console.log(`  Encoding: ${config.encoding}`);
  console.log(`  ${colors.green}Value: ${secret}${colors.reset}`);
  console.log('');

  return { name, secret };
}

/**
 * Main execution
 */

if (specificKey) {
  // Generate specific secret
  const config = secrets[specificKey];
  if (!config) {
    console.error(`${colors.red}Error: Unknown secret key "${specificKey}"${colors.reset}`);
    console.log(`\nAvailable keys: ${Object.keys(secrets).join(', ')}`);
    process.exit(1);
  }

  const customConfig = { ...config, bytes: byteLength };
  displaySecret(specificKey, customConfig);

} else if (generateAll) {
  // Generate all secrets
  console.log(`${colors.yellow}Generating all required secrets...${colors.reset}\n`);

  const generated = [];
  for (const [name, config] of Object.entries(secrets)) {
    const result = displaySecret(name, config);
    generated.push(result);
  }

  // Output in .env format
  console.log(`${colors.bold}${colors.cyan}═══════════════════════════════════════════════════${colors.reset}`);
  console.log(`${colors.bold}Copy to .env file:${colors.reset}\n`);

  generated.forEach(({ name, secret }) => {
    console.log(`${name}=${secret}`);
  });

  console.log('');
  console.log(`${colors.bold}${colors.cyan}═══════════════════════════════════════════════════${colors.reset}\n`);

  console.log(`${colors.red}${colors.bold}⚠ SECURITY WARNING:${colors.reset}`);
  console.log(`${colors.red}  • NEVER commit these secrets to version control${colors.reset}`);
  console.log(`${colors.red}  • Store securely in password manager or secrets vault${colors.reset}`);
  console.log(`${colors.red}  • Use different secrets for each environment${colors.reset}`);
  console.log(`${colors.red}  • Rotate secrets regularly (every 90 days)${colors.reset}\n`);

} else {
  // Interactive mode - display menu
  console.log('Select a secret to generate:\n');

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const keyNames = Object.keys(secrets);
  keyNames.forEach((name, index) => {
    console.log(`  ${index + 1}. ${name} - ${secrets[name].description}`);
  });
  console.log(`  ${keyNames.length + 1}. Generate ALL secrets`);
  console.log(`  0. Exit\n`);

  rl.question('Enter your choice: ', (answer) => {
    const choice = parseInt(answer, 10);

    if (choice === 0) {
      console.log('Exiting...');
      rl.close();
      process.exit(0);
    } else if (choice === keyNames.length + 1) {
      rl.close();
      console.log('\n');

      const generated = [];
      for (const [name, config] of Object.entries(secrets)) {
        const result = displaySecret(name, config);
        generated.push(result);
      }

      console.log(`${colors.bold}${colors.cyan}Copy to .env file:${colors.reset}\n`);
      generated.forEach(({ name, secret }) => {
        console.log(`${name}=${secret}`);
      });
      console.log('');

    } else if (choice > 0 && choice <= keyNames.length) {
      const keyName = keyNames[choice - 1];
      const config = secrets[keyName];

      rl.close();
      console.log('\n');
      displaySecret(keyName, config);

      console.log(`${colors.cyan}Copy to .env:${colors.reset}`);
      console.log(`${keyName}=${generateSecret(config.bytes, config.encoding)}\n`);

    } else {
      console.log(`${colors.red}Invalid choice${colors.reset}`);
      rl.close();
      process.exit(1);
    }
  });
}
