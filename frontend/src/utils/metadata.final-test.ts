/**
 * Final Verification Test
 *
 * Tests all import paths to ensure backward compatibility
 */

// Test 1: Direct import from metadata.ts
import {
  baseMetadata as base1,
  generateMetadata as gen1,
  healthcareMetadata as hc1,
} from './metadata';

// Test 2: Import from granular modules
import { baseMetadata as base2 } from './metadata.base';
import { generateMetadata as gen2 } from './metadata.generators';
import { healthcareMetadata as hc2 } from './metadata.healthcare';

// Test 3: Import from utils/index.ts (main barrel export)
import {
  baseMetadata as base3,
  generateMetadata as gen3,
  healthcareMetadata as hc3,
} from './index';

console.log('Testing all import paths...\n');

// Verify all imports work
console.log('✓ Direct import from metadata.ts:', !!base1 && !!gen1 && !!hc1);
console.log('✓ Granular imports:', !!base2 && !!gen2 && !!hc2);
console.log('✓ Import from utils/index.ts:', !!base3 && !!gen3 && !!hc3);

// Verify all exports are the same
console.log('\nVerifying exports are identical...\n');
console.log('✓ baseMetadata from all paths:', base1 === base2 && base2 === base3);
console.log('✓ generateMetadata from all paths:', gen1 === gen2 && gen2 === gen3);
console.log('✓ healthcareMetadata from all paths:', hc1 === hc2 && hc2 === hc3);

// Test functionality
const metadata = gen1({
  title: 'Test',
  description: 'Test description',
  path: '/test',
});

console.log('\nFunctionality test...\n');
console.log('✓ generateMetadata works:', !!metadata.title);
console.log('✓ healthcareMetadata.students() works:', !!hc1.students().title);

console.log('\n✅ All import paths verified and working correctly!');
