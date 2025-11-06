# Refactoring Plan: documentsApi.ts Modularization

**Task ID:** DA8K3M
**Agent:** TypeScript Architect
**Started:** 2025-11-04

## Objective
Refactor documentsApi.ts (1024 lines) into modular, focused components organized by document operation categories.

## Current State Analysis
- **File:** `F:\temp\white-cross\frontend\src\services\modules\documentsApi.ts`
- **Lines of Code:** 1024 (340% over 300 LOC threshold)
- **Missing Schemas:** versionComparisonSchema, searchDocumentsRequestSchema, bulkDownloadRequestSchema
- **Schema Issues:** Lines 186-189, 496, 723, 787 reference non-existent schemas

## Breakdown Strategy

### Phase 1: Complete Missing Schemas (30 min)
Add missing Zod validation schemas to `documentSchemas.ts`:
1. `versionComparisonSchema` - for compareVersions operation
2. `searchDocumentsRequestSchema` - for advancedSearch operation
3. `bulkDownloadRequestSchema` - for bulkDownload operation
4. Export corresponding TypeScript types

### Phase 2: Module Decomposition (90 min)
Break down into 6 focused modules:

1. **documents-crud.api.ts** (~200 LOC)
   - getDocuments, getDocumentById, createDocument, updateDocument, deleteDocument
   - Basic CRUD operations

2. **documents-versions.api.ts** (~180 LOC)
   - getDocumentVersions, createDocumentVersion, getDocumentVersion
   - downloadVersion, compareVersions
   - Version control operations

3. **documents-actions.api.ts** (~150 LOC)
   - signDocument, verifySignature, downloadDocument
   - viewDocument, shareDocument
   - Document interaction operations

4. **documents-templates.api.ts** (~100 LOC)
   - getTemplates, getTemplateById, createFromTemplate
   - Template management operations

5. **documents-search.api.ts** (~180 LOC)
   - searchDocuments, advancedSearch, getExpiringDocuments
   - bulkDeleteDocuments, bulkDownload
   - Search and bulk operations

6. **documents-metadata.api.ts** (~120 LOC)
   - getDocumentAuditTrail, getDocumentSignatures
   - getDocumentCategories, getStatistics
   - getStudentDocuments, archiveExpiredDocuments
   - Metadata and analytics operations

### Phase 3: Main API Aggregator (60 min)
Create new `documentsApi.ts` as aggregator:
- Import all modular APIs
- Combine into single DocumentsApiImpl class
- Maintain backward compatibility
- Export unified interface

### Phase 4: Import/Export Resolution (30 min)
1. Update all import statements across modules
2. Verify type exports are complete
3. Check for circular dependencies
4. Ensure proper re-exports in main file

### Phase 5: Validation (30 min)
1. Verify TypeScript compilation
2. Check import paths are correct
3. Validate schema references work
4. Ensure backward compatibility maintained

## File Structure After Refactoring

```
src/
├── schemas/
│   └── documentSchemas.ts (enhanced with missing schemas)
└── services/
    └── modules/
        ├── documents/
        │   ├── documents-crud.api.ts
        │   ├── documents-versions.api.ts
        │   ├── documents-actions.api.ts
        │   ├── documents-templates.api.ts
        │   ├── documents-search.api.ts
        │   └── documents-metadata.api.ts
        └── documentsApi.ts (main aggregator)
```

## Type Safety Guarantees
- All schemas use Zod validation
- Strict UUID validation maintained
- PHI access logging preserved
- Error handling consistent across modules

## Backward Compatibility
- Main export `documentsApi` unchanged
- All public interfaces preserved
- Existing imports continue to work
- No breaking changes to API consumers

## Timeline
- **Phase 1:** 30 minutes
- **Phase 2:** 90 minutes
- **Phase 3:** 60 minutes
- **Phase 4:** 30 minutes
- **Phase 5:** 30 minutes
- **Total:** ~4 hours

## Success Criteria
1. All modules < 300 LOC
2. No compilation errors
3. No circular dependencies
4. All schemas properly defined
5. Backward compatibility maintained
6. Type safety preserved throughout
