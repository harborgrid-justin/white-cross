# Migration Guide: useDocumentMutations Refactoring

This guide helps you migrate from the monolithic `useDocumentMutations.ts` (1172 lines) to the new modular structure.

## What Changed?

The original single file has been split into **16 smaller files** organized by functionality:

### Before (1 file, 1172 lines)
```
useDocumentMutations.ts  (everything in one file)
```

### After (16 files, all under 300 lines)
```
mutations/
├── api/                          # API layer
│   ├── bulkAPI.ts               (77 lines)
│   ├── categoryAPI.ts           (36 lines)
│   ├── commentAPI.ts            (66 lines)
│   ├── documentAPI.ts           (235 lines)
│   ├── shareAPI.ts              (116 lines)
│   ├── templateAPI.ts           (86 lines)
│   └── index.ts                 (25 lines)
├── types.ts                     (89 lines)
├── useDocumentCRUDMutations.ts  (163 lines)
├── useDocumentVersionMutations.ts (26 lines)
├── useCategoryMutations.ts      (72 lines)
├── useTemplateMutations.ts      (47 lines)
├── useDocumentSharingMutations.ts (72 lines)
├── useCommentMutations.ts       (90 lines)
├── useBulkOperations.ts         (72 lines)
└── index.ts                     (96 lines)
```

## No Code Changes Required!

**Good news:** All existing imports continue to work thanks to the re-export in `index.ts`.

### Your existing code:
```typescript
import {
  useCreateDocument,
  useUpdateDocument,
  useDeleteDocument,
  useCreateShare,
  // ... any other hooks
} from '@/hooks/domains/documents/mutations/useDocumentMutations';
```

### Will automatically work with:
```typescript
import {
  useCreateDocument,
  useUpdateDocument,
  useDeleteDocument,
  useCreateShare,
  // ... any other hooks
} from '@/hooks/domains/documents/mutations';
// OR
import {
  useCreateDocument,
  useUpdateDocument,
  useDeleteDocument,
  useCreateShare,
} from '@/hooks/domains/documents/mutations/index';
```

## Recommended: Update Imports for Better Tree-Shaking

While not required, updating your imports can improve bundle size through better tree-shaking:

### Before (imports everything)
```typescript
import {
  useCreateDocument,
  useDeleteDocument,
  useCreateShare
} from '@/hooks/domains/documents/mutations';
```

### After (imports only what you need)
```typescript
// Import from specific modules
import { useCreateDocument, useDeleteDocument } from '@/hooks/domains/documents/mutations/useDocumentCRUDMutations';
import { useCreateShare } from '@/hooks/domains/documents/mutations/useDocumentSharingMutations';
```

## Module Organization

Here's where to find each hook in the new structure:

### Document CRUD Operations
**File:** `useDocumentCRUDMutations.ts`
```typescript
import {
  useCreateDocument,
  useUpdateDocument,
  useDeleteDocument,
  useDuplicateDocument,
  useMoveDocument,
  useFavoriteDocument,
  useUnfavoriteDocument,
} from './useDocumentCRUDMutations';
```

### Version Management
**File:** `useDocumentVersionMutations.ts`
```typescript
import {
  useUploadNewVersion,
} from './useDocumentVersionMutations';
```

### Category Management
**File:** `useCategoryMutations.ts`
```typescript
import {
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from './useCategoryMutations';
```

### Template Operations
**File:** `useTemplateMutations.ts`
```typescript
import {
  useCreateTemplate,
  useCreateFromTemplate,
} from './useTemplateMutations';
```

### Sharing Operations
**File:** `useDocumentSharingMutations.ts`
```typescript
import {
  useCreateShare,
  useUpdateShare,
  useDeleteShare,
} from './useDocumentSharingMutations';
```

### Comment Operations
**File:** `useCommentMutations.ts`
```typescript
import {
  useCreateComment,
  useUpdateComment,
  useDeleteComment,
  useResolveComment,
} from './useCommentMutations';
```

### Bulk Operations
**File:** `useBulkOperations.ts`
```typescript
import {
  useBulkDeleteDocuments,
  useBulkMoveDocuments,
  useExportDocuments,
} from './useBulkOperations';
```

## Type Definitions

All input types have been moved to `types.ts`:

```typescript
import type {
  CreateDocumentInput,
  UpdateDocumentInput,
  CreateCategoryInput,
  UpdateCategoryInput,
  CreateTemplateInput,
  UpdateTemplateInput,
  CreateShareInput,
  UpdateShareInput,
  CreateCommentInput,
  UpdateCommentInput,
} from './types';
```

## API Layer Changes

All mock API functions have been moved to the `api/` directory:

```typescript
// Before: Everything in mockDocumentMutationAPI
const mockDocumentMutationAPI = {
  createDocument: ...,
  updateDocument: ...,
  // 700+ lines of API functions
};

// After: Organized by domain
import { documentAPI } from './api/documentAPI';
import { categoryAPI } from './api/categoryAPI';
import { templateAPI } from './api/templateAPI';
import { shareAPI } from './api/shareAPI';
import { commentAPI } from './api/commentAPI';
import { bulkAPI } from './api/bulkAPI';

// Or use the combined export
import { mockDocumentMutationAPI } from './api';
```

## Benefits of the New Structure

### 1. Easier Navigation
- Find hooks by category instead of scrolling through 1172 lines
- Each file has a clear, single responsibility

### 2. Better Maintainability
- Smaller files are easier to understand and modify
- Changes to one operation type don't affect others

### 3. Improved Testing
- Test individual modules in isolation
- Faster test execution for specific functionality

### 4. Better Code Organization
- API layer separated from React hooks
- Types in a dedicated file
- Logical grouping by feature area

### 5. Tree-Shaking Optimization
- Import only the hooks you need
- Smaller bundle sizes in production

### 6. Team Collaboration
- Multiple developers can work on different files without conflicts
- Easier code review with smaller, focused changes

## Troubleshooting

### Issue: Import errors after migration
**Solution:** Make sure you're importing from the correct path:
```typescript
// ✅ Correct
import { useCreateDocument } from '@/hooks/domains/documents/mutations';

// ❌ Wrong (old file removed)
import { useCreateDocument } from '@/hooks/domains/documents/mutations/useDocumentMutations';
```

### Issue: TypeScript errors about missing types
**Solution:** Import types explicitly if needed:
```typescript
import type { CreateDocumentInput } from '@/hooks/domains/documents/mutations/types';
```

### Issue: Hook behavior changed
**Solution:** The hooks have identical behavior. Check:
1. Import path is correct
2. Hook usage is the same as before
3. Clear your node_modules and rebuild if issues persist

## Rollback Plan

If you need to temporarily rollback:

1. The old file is preserved as `useDocumentMutations.ts.old`
2. Rename it back to `useDocumentMutations.ts`
3. Delete the new modular files
4. Restart your dev server

```bash
cd src/hooks/domains/documents/mutations
mv useDocumentMutations.ts.old useDocumentMutations.ts
rm -rf api/
rm types.ts useDocumentCRUDMutations.ts useCategoryMutations.ts \
   useTemplateMutations.ts useDocumentSharingMutations.ts \
   useCommentMutations.ts useBulkOperations.ts \
   useDocumentVersionMutations.ts
```

## Gradual Migration Strategy

If you want to migrate gradually:

### Phase 1: Keep both versions
Keep `useDocumentMutations.ts.old` and the new structure side-by-side.

### Phase 2: Update imports file by file
Update each component one at a time:
```typescript
// Old
import { useCreateDocument } from '../mutations/useDocumentMutations';

// New
import { useCreateDocument } from '../mutations';
```

### Phase 3: Remove old file
Once all imports are updated and tested, remove `useDocumentMutations.ts.old`.

## Next Steps

1. ✅ Review the new file structure
2. ✅ Test existing functionality works correctly
3. ✅ Optionally update imports for better tree-shaking
4. ✅ Update documentation references
5. ✅ Remove `useDocumentMutations.ts.old` when confident

## Questions?

See [README.md](./README.md) for detailed documentation on:
- Usage examples for each hook
- API layer documentation
- Testing strategies
- Performance considerations

---

**Remember:** The migration is backward compatible. Your existing code will continue to work without any changes!
