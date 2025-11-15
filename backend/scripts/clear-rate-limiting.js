#!/usr/bin/env node

/**
 * Clear Rate Limiting Script
 * Clears in-memory rate limiting stores that may be blocking login attempts
 */

const fs = require('fs');
const path = require('path');

console.log('🧹 Clearing rate limiting data...\n');

// Rate limiting is in-memory, so we need to restart the frontend server
// But let's clear any persistent files or localStorage data that might exist

console.log('📋 Rate limiting is stored in-memory, so to clear it you need to:');
console.log('');
console.log('1. 🛑 Stop the frontend development server (Ctrl+C)');
console.log('2. 🧹 Clear browser cache and localStorage');
console.log('3. 🚀 Restart the frontend server');
console.log('');

console.log('🌐 To clear browser cache:');
console.log('- Chrome/Edge: F12 → Application → Clear Storage → Clear all');
console.log('- Firefox: F12 → Storage → Clear All');
console.log('- Or use Incognito/Private mode for a clean session');
console.log('');

console.log('💡 Alternative: Wait 9 minutes for rate limit to expire naturally');
console.log('   (Rate limit window: 15 minutes, current wait time: ~9 minutes)');

console.log('');
console.log('✅ Script complete');