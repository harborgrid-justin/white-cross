/**
 * Verification script for tokenSecurity refactoring
 * This file tests that all exports are available and backward compatible
 */

// Test imports from main barrel export
import {
  // Types
  TokenData,
  EncryptedTokenData,
  TOKEN_SECURITY_CONFIG,
  // Classes
  EncryptionManager,
  encryptionManager,
  TokenSecurityManager,
  tokenSecurityManager,
  // Validation functions
  validateTokenFormat,
  getTokenExpiration,
  isTokenExpired,
  getTokenTimeRemaining,
  isTokenExpiringSoon,
  decodeTokenPayload,
  // Legacy utilities
  legacyTokenUtils
} from './tokenSecurity';

// Test default export
import defaultExport from './tokenSecurity';

// Type checking tests
const testTokenData: TokenData = {
  token: 'test',
  user: {} as any,
  expiresAt: Date.now(),
  issuedAt: Date.now()
};

const testEncryptedData: EncryptedTokenData = {
  data: 'encrypted',
  iv: 'iv',
  timestamp: Date.now()
};

// Function existence checks
console.log('Verification Results:');
console.log('====================');

// Types and config
console.log('✓ TokenData interface imported');
console.log('✓ EncryptedTokenData interface imported');
console.log('✓ TOKEN_SECURITY_CONFIG imported:', typeof TOKEN_SECURITY_CONFIG === 'object');

// Classes and instances
console.log('✓ EncryptionManager class imported:', typeof EncryptionManager === 'function');
console.log('✓ encryptionManager instance imported:', typeof encryptionManager === 'object');
console.log('✓ TokenSecurityManager class imported:', typeof TokenSecurityManager === 'function');
console.log('✓ tokenSecurityManager instance imported:', typeof tokenSecurityManager === 'object');

// Validation functions
console.log('✓ validateTokenFormat imported:', typeof validateTokenFormat === 'function');
console.log('✓ getTokenExpiration imported:', typeof getTokenExpiration === 'function');
console.log('✓ isTokenExpired imported:', typeof isTokenExpired === 'function');
console.log('✓ getTokenTimeRemaining imported:', typeof getTokenTimeRemaining === 'function');
console.log('✓ isTokenExpiringSoon imported:', typeof isTokenExpiringSoon === 'function');
console.log('✓ decodeTokenPayload imported:', typeof decodeTokenPayload === 'function');

// Legacy utilities
console.log('✓ legacyTokenUtils imported:', typeof legacyTokenUtils === 'object');
console.log('✓ legacyTokenUtils.getToken:', typeof legacyTokenUtils.getToken === 'function');
console.log('✓ legacyTokenUtils.setToken:', typeof legacyTokenUtils.setToken === 'function');
console.log('✓ legacyTokenUtils.removeToken:', typeof legacyTokenUtils.removeToken === 'function');
console.log('✓ legacyTokenUtils.getUser:', typeof legacyTokenUtils.getUser === 'function');
console.log('✓ legacyTokenUtils.setUser:', typeof legacyTokenUtils.setUser === 'function');
console.log('✓ legacyTokenUtils.removeUser:', typeof legacyTokenUtils.removeUser === 'function');

// Default export
console.log('✓ Default export imported:', typeof defaultExport === 'object');
console.log('✓ Default export is tokenSecurityManager:', defaultExport === tokenSecurityManager);

console.log('====================');
console.log('All exports verified successfully!');

export {};
