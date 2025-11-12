# Architecture Notes: documentsApi.ts Refactoring

**Task ID:** DA8K3M
**Agent:** TypeScript Architect

## High-Level Design Decisions

### Modularization Strategy
**Decision:** Break down by functional domain (CRUD, Versions, Actions, Templates, Search, Metadata)
**Rationale:**
- Each module has clear single responsibility
- Natural separation aligns with API endpoint grouping
- Easier to maintain and test independently
- Supports future scaling and team collaboration

**Alternatives Considered:**
- By entity type: Would create artificial boundaries
- By HTTP method: Would mix unrelated operations
- Flat structure: Already proven unmanageable at 1024 LOC

### Module Size Targets
- **CRUD:** ~200 LOC (5 operations)
- **Versions:** ~180 LOC (5 operations)
- **Actions:** ~150 LOC (5 operations)
- **Templates:** ~100 LOC (3 operations)
- **Search:** ~180 LOC (5 operations)
- **Metadata:** ~120 LOC (6 operations)
- **Main Aggregator:** ~100 LOC (composition only)

All modules well under 300 LOC threshold.

## Integration Patterns

### Composition Over Inheritance
**Pattern:** Aggregator pattern for main API
**Implementation:**
```typescript
class DocumentsApiImpl implements DocumentsApi {
  private crud: DocumentsCrudApi;
  private versions: DocumentsVersionsApi;
  private actions: DocumentsActionsApi;
  private templates: DocumentsTemplatesApi;
  private search: DocumentsSearchApi;
  private metadata: DocumentsMetadataApi;

  constructor(client: ApiClient) {
    this.crud = new DocumentsCrudApi(client);
    this.versions = new DocumentsVersionsApi(client);
    // ... etc
  }

  // Delegate to appropriate module
  getDocuments = this.crud.getDocuments;
  getDocumentById = this.crud.getDocumentById;
  // ... etc
}
```

### Dependency Injection
All modules receive `ApiClient` via constructor injection:
- Promotes testability
- Maintains loose coupling
- Supports mocking for unit tests
- Consistent with existing codebase patterns

### Type Safety Strategy
**Zod Validation:** Runtime validation at API boundaries
**TypeScript Types:** Compile-time safety throughout
**UUID Validation:** Regex checks for all ID parameters
**PHI Logging:** Preserved in all operations

## Type System Strategies

### Schema-First Approach
1. Define Zod schemas in `documentSchemas.ts`
2. Infer TypeScript types from schemas
3. Use validated types in API implementations
4. Ensures runtime and compile-time alignment

### Missing Schemas Design

#### versionComparisonSchema
```typescript
const versionComparisonSchema = z.object({
  documentId: z.string().uuid(),
  versionId1: z.string().uuid(),
  versionId2: z.string().uuid(),
  comparisonType: z.enum(['text', 'metadata', 'full']).optional(),
  includeContent: z.boolean().optional().default(false),
});
```

#### searchDocumentsRequestSchema
```typescript
const searchDocumentsRequestSchema = z.object({
  filters: advancedSearchFiltersSchema,
  sort: searchSortOptionsSchema.optional(),
  page: z.number().int().positive().optional().default(1),
  limit: z.number().int().positive().max(100).optional().default(20),
  includeAggregations: z.boolean().optional().default(false),
  includeHighlights: z.boolean().optional().default(true),
});
```

#### bulkDownloadRequestSchema
```typescript
const bulkDownloadRequestSchema = z.object({
  documentIds: z.array(z.string().uuid()).min(1),
  includeVersions: z.boolean().optional().default(false),
  includeMetadata: z.boolean().optional().default(true),
  format: z.enum(['zip', 'tar', 'tar.gz']).optional().default('zip'),
  fileName: z.string().optional(),
  excludeArchived: z.boolean().optional().default(true),
  excludeExpired: z.boolean().optional().default(false),
  maxFileSize: z.number().positive().optional(),
  metadataFormat: z.enum(['json', 'csv', 'xml']).optional().default('json'),
  includeSignatures: z.boolean().optional().default(true),
  includeAuditTrail: z.boolean().optional().default(false),
});
```

### Generic Constraints
- `ApiResponse<T>` envelope pattern maintained
- `extractApiData` utility handles unwrapping
- Type inference preserved through chain

## Performance Considerations

### Code Splitting Benefits
- Smaller module bundles
- Faster initial load (tree-shaking)
- Better caching (unchanged modules stay cached)
- Parallel development possible

### Runtime Performance
- No performance degradation
- Function delegation has negligible overhead
- Same network calls, same validation
- Memory footprint unchanged

## Security Requirements

### PHI Protection
- All PHI logging comments preserved
- UUID validation prevents injection attacks
- Zod schemas sanitize inputs
- Audit trail maintained for HIPAA compliance

### Type Safety for Security
```typescript
// UUID validation prevents SQL injection
if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) {
  throw new Error('Invalid document ID format');
}
```

### Input Validation
- Zod schemas validate all request bodies
- File size limits enforced
- Array length limits on bulk operations
- URL validation for file paths

## Backward Compatibility Strategy

### Export Preservation
```typescript
// Old import still works
import { documentsApi } from '@/services/modules/documentsApi';

// New internal structure invisible to consumers
const { document } = await documentsApi.getDocumentById('id');
```

### Interface Stability
- `DocumentsApi` interface unchanged
- All method signatures preserved
- Return types identical
- Error handling consistent

## Testing Strategy
- Unit tests per module (easier to isolate)
- Integration tests for main aggregator
- Schema validation tests
- Circular dependency checks in CI

## Migration Path
1. Add missing schemas (non-breaking)
2. Create new modules (parallel to existing)
3. Create new main file (replace old)
4. Delete old monolithic file
5. No consumer code changes required

## SOLID Principles Application

### Single Responsibility
Each module handles one aspect of document management:
- CRUD: Basic operations
- Versions: Version control
- Actions: Document interactions
- Templates: Template operations
- Search: Search and bulk
- Metadata: Analytics and metadata

### Open/Closed
- Modules can be extended without modifying core
- New operations added to appropriate module
- Aggregator composition allows new modules

### Liskov Substitution
- All modules implement partial DocumentsApi interface
- Aggregator delegates correctly
- Substitution maintains type safety

### Interface Segregation
- Consumers import only what they need
- Internal modules focused on specific operations
- No forced dependencies on unused code

### Dependency Inversion
- All modules depend on ApiClient abstraction
- No direct HTTP library coupling
- Testable through client mocking
