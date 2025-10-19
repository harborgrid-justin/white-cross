# Migration Guide: Monolithic to Modular Document Service

## Overview

This guide helps you migrate from the monolithic `documentService.ts` to the new modular architecture at `services/document/`.

## Quick Start

### Option 1: Update Import Path (Recommended)

Change your import from:
```typescript
import { DocumentService } from '../services/documentService';
```

To:
```typescript
import { DocumentService } from '../services/document';
```

That's it! The API is 100% backward compatible.

### Option 2: Keep Old Import (Temporary)

The old `documentService.ts` file still exists and will continue to work. However, we recommend migrating to the new modular structure for better maintainability.

## Files to Update

Based on current codebase scan, these files import the document service:

### 1. **C:\temp\white-cross\backend\src\routes\documents.ts** (Line 27)
**Current:**
```typescript
import { DocumentService } from '../services/documentService';
```

**Updated:**
```typescript
import { DocumentService } from '../services/document';
```

### 2. **C:\temp\white-cross\backend\src\services\incidentReport\index.ts**
Check if this file imports document service and update if needed.

## Import Type Definitions

### Before (if importing types separately)
```typescript
import {
  DocumentService,
  CreateDocumentData,
  UpdateDocumentData,
  DocumentFilters
} from '../services/documentService';
```

### After
```typescript
import { DocumentService } from '../services/document';
import type {
  CreateDocumentData,
  UpdateDocumentData,
  DocumentFilters
} from '../services/document';
```

Or in a single import:
```typescript
import {
  DocumentService,
  type CreateDocumentData,
  type UpdateDocumentData,
  type DocumentFilters
} from '../services/document';
```

## No Code Changes Required

The following code patterns continue to work exactly as before:

### Document Creation
```typescript
const document = await DocumentService.createDocument({
  title: 'Patient Consent Form',
  category: DocumentCategory.CONSENT_FORM,
  fileType: 'pdf',
  fileName: 'consent-form.pdf',
  fileSize: 1024000,
  fileUrl: 's3://bucket/consent-form.pdf',
  uploadedBy: 'user-id-123',
  studentId: 'student-id-456'
});
```

### Document Retrieval
```typescript
const { documents, pagination } = await DocumentService.getDocuments(
  1, // page
  20, // limit
  { category: DocumentCategory.MEDICAL_RECORD } // filters
);
```

### Document Search
```typescript
const results = await DocumentService.searchDocuments('consent', {
  status: DocumentStatus.APPROVED
});
```

### All Other Methods
All 20 static methods on `DocumentService` work identically to before.

## Breaking Changes

**None.** This is a pure refactoring with no API changes.

## Benefits of Migration

### 1. Better Error Messages
Modular structure provides clearer stack traces showing which module failed.

### 2. Future Updates
New features will be added to the modular structure first.

### 3. Better IDE Support
Smaller files mean faster IDE performance and better intellisense.

### 4. Team Collaboration
Multiple developers can work on different modules without conflicts.

## Step-by-Step Migration

### Step 1: Identify Import Locations
```bash
# Search for all imports
grep -r "from.*documentService" backend/src
```

### Step 2: Update Import Paths
For each file found:
1. Open the file
2. Find the import line
3. Change `'../services/documentService'` to `'../services/document'`
4. Save the file

### Step 3: Verify Type Imports
If you're importing types, consider using TypeScript's `type` keyword:
```typescript
import { DocumentService, type CreateDocumentData } from '../services/document';
```

### Step 4: Run Tests
```bash
npm run test:backend
```

### Step 5: Run Linter
```bash
npm run lint
```

### Step 6: Build
```bash
npm run build
```

## Rollback Plan

If you encounter any issues:

### Option 1: Revert Import Changes
Simply change imports back to `'../services/documentService'`

### Option 2: Use Old Service
The original file at `C:\temp\white-cross\backend\src\services\documentService.ts` remains unchanged and functional.

## Common Issues

### Issue 1: Import Path Errors

**Error:**
```
Cannot find module '../services/document'
```

**Solution:**
Ensure you're using the correct relative path based on your file location:
- From `routes/`: `'../services/document'`
- From `controllers/`: `'../services/document'`
- From `services/`: `'./document'`

### Issue 2: Type Import Errors

**Error:**
```
Cannot find type 'CreateDocumentData'
```

**Solution:**
Import types explicitly:
```typescript
import type { CreateDocumentData } from '../services/document';
```

### Issue 3: Circular Dependency

**Error:**
```
Circular dependency detected
```

**Solution:**
This shouldn't happen with the new architecture, but if it does:
1. Check your import paths
2. Ensure you're not importing individual modules directly
3. Always import from `services/document` (the index)

## Advanced Usage

### Importing Specific Modules (Not Recommended)

While possible, we don't recommend importing individual modules:

```typescript
// ❌ Don't do this
import { getDocuments } from '../services/document/crud.operations';

// ✅ Do this instead
import { DocumentService } from '../services/document';
const result = await DocumentService.getDocuments();
```

**Reason:** The facade pattern ensures proper abstraction and future flexibility.

### Custom Extensions

If you need to extend the document service:

```typescript
import { DocumentService } from '../services/document';

export class ExtendedDocumentService extends DocumentService {
  static async customOperation() {
    // Your custom logic
  }
}
```

## Testing After Migration

### Unit Tests
No changes needed to existing tests. The API is identical.

### Integration Tests
Run your existing integration tests to verify functionality:
```bash
npm run test:backend
```

### Manual Testing Checklist

- [ ] Document creation
- [ ] Document retrieval
- [ ] Document update
- [ ] Document deletion
- [ ] Document search
- [ ] Document download
- [ ] Document versioning
- [ ] Document signing
- [ ] Audit trail retrieval
- [ ] Statistics retrieval

## Performance Notes

### Build Time
Slightly improved due to better tree-shaking with modular code.

### Runtime Performance
Identical to the original implementation. No performance changes.

### Bundle Size
Potentially smaller in production due to better tree-shaking opportunities.

## Timeline Recommendations

### Immediate (Week 1)
1. Update `routes/documents.ts` import
2. Run tests to verify
3. Deploy to development environment

### Short-term (Weeks 2-4)
1. Update all other imports in codebase
2. Add integration tests
3. Update documentation

### Long-term (Month 2+)
1. Consider deprecating `documentService.ts`
2. Add migration warning to old file
3. Eventually remove old file (after full migration)

## Deprecation Plan (Future)

The old `documentService.ts` file will remain for at least one release cycle. After migration is complete:

### Phase 1: Deprecation Notice
Add deprecation notice to the top of the old file:
```typescript
/**
 * @deprecated This file has been replaced by services/document/
 * Please update your imports to use the new modular structure.
 * This file will be removed in version X.X.X
 */
```

### Phase 2: Console Warnings
Add runtime warnings when old import is used:
```typescript
console.warn('documentService.ts is deprecated. Use services/document/ instead.');
```

### Phase 3: Removal
After ensuring all imports are updated, remove the old file.

## Support

### Questions?
- Review the [README.md](./README.md) for architecture details
- Check [MODULE_OVERVIEW.md](./MODULE_OVERVIEW.md) for visual diagrams
- See [REFACTORING_SUMMARY.md](./REFACTORING_SUMMARY.md) for technical details

### Issues?
If you encounter problems during migration:
1. Document the issue
2. Check if it's related to import paths
3. Verify your TypeScript version compatibility
4. Test with the original `documentService.ts` to isolate the issue

## Checklist

Use this checklist to track your migration progress:

- [ ] Identified all files importing document service
- [ ] Updated import paths in all files
- [ ] Verified type imports are correct
- [ ] Ran linter successfully
- [ ] Ran all tests successfully
- [ ] Built project successfully
- [ ] Deployed to development environment
- [ ] Performed manual testing
- [ ] Updated team documentation
- [ ] Notified team members of changes

## Example Migration Session

Here's a complete example of migrating one file:

### Before: routes/documents.ts
```typescript
import { Router } from 'express';
import { DocumentService } from '../services/documentService';

const router = Router();

router.get('/documents', async (req, res) => {
  const documents = await DocumentService.getDocuments();
  res.json(documents);
});

export default router;
```

### After: routes/documents.ts
```typescript
import { Router } from 'express';
import { DocumentService } from '../services/document'; // ← Only change

const router = Router();

router.get('/documents', async (req, res) => {
  const documents = await DocumentService.getDocuments(); // ← No change
  res.json(documents);
});

export default router;
```

**Changes:** 1 line
**Time required:** < 1 minute
**Risk:** Minimal (100% backward compatible)

## Conclusion

Migration to the new modular document service is straightforward:
1. Update import paths
2. Run tests
3. Deploy

The new architecture provides significant benefits with zero API changes, making this a low-risk, high-reward migration.

---

**Last Updated:** 2025-10-18
**Migration Difficulty:** Easy
**Estimated Time:** 30 minutes for entire codebase
**Risk Level:** Low
