/**
 * Metadata Utilities Test
 *
 * Comprehensive test to verify backward compatibility and proper exports
 * after refactoring metadata.ts into multiple modules.
 */

import {
  // Types
  type PageMetadataConfig,
  type StructuredDataConfig,

  // Base configuration
  baseMetadata,
  viewport,

  // Core functions
  generateMetadata,
  generateStructuredData,

  // Templates
  structuredDataTemplates,

  // Healthcare metadata
  healthcareMetadata,
} from './metadata';

// Test that all exports are available
console.log('✓ All exports are available from metadata.ts');

// Test baseMetadata
if (!baseMetadata.title) {
  throw new Error('baseMetadata.title is missing');
}
console.log('✓ baseMetadata is properly exported');

// Test viewport
if (!viewport.width) {
  throw new Error('viewport.width is missing');
}
console.log('✓ viewport is properly exported');

// Test generateMetadata function
const testMetadata = generateMetadata({
  title: 'Test Page',
  description: 'Test description',
  path: '/test',
});
if (!testMetadata.title) {
  throw new Error('generateMetadata did not return valid metadata');
}
console.log('✓ generateMetadata function works correctly');

// Test generateStructuredData function
const testStructuredData = generateStructuredData({
  type: 'Organization',
  name: 'Test Organization',
});
if (!testStructuredData.includes('schema.org')) {
  throw new Error('generateStructuredData did not return valid JSON-LD');
}
console.log('✓ generateStructuredData function works correctly');

// Test structuredDataTemplates
const orgTemplate = structuredDataTemplates.organization();
if (orgTemplate.type !== 'MedicalOrganization') {
  throw new Error('organization template is invalid');
}
console.log('✓ structuredDataTemplates are properly exported');

// Test healthcareMetadata
const studentMetadata = healthcareMetadata.students();
if (!studentMetadata.title) {
  throw new Error('healthcareMetadata.students() is invalid');
}
console.log('✓ healthcareMetadata functions work correctly');

// Test that all healthcare metadata generators work
const allHealthcareMetadata = [
  healthcareMetadata.students(),
  healthcareMetadata.medications(),
  healthcareMetadata.healthRecords(),
  healthcareMetadata.appointments(),
  healthcareMetadata.incidents(),
  healthcareMetadata.compliance(),
  healthcareMetadata.dashboard(),
];

for (const metadata of allHealthcareMetadata) {
  if (!metadata.title || !metadata.description) {
    throw new Error('Invalid healthcare metadata');
  }
}
console.log('✓ All healthcare metadata generators work correctly');

console.log('\n✅ All backward compatibility tests passed!');
