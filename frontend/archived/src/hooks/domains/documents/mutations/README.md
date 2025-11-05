# Document Mutations

This directory contains React Query mutation hooks for document management operations. The original 1172-line `useDocumentMutations.ts` file has been refactored into smaller, more maintainable modules.

## Directory Structure

```
mutations/
├── api/                          # API layer - mock functions (replace with real API calls)
│   ├── bulkAPI.ts               # Bulk operations (77 lines)
│   ├── categoryAPI.ts           # Category CRUD operations (36 lines)
│   ├── commentAPI.ts            # Comment operations (66 lines)
│   ├── documentAPI.ts           # Document CRUD operations (235 lines)
│   ├── shareAPI.ts              # Sharing operations (116 lines)
│   ├── templateAPI.ts           # Template operations (86 lines)
│   └── index.ts                 # Central API exports (25 lines)
├── types.ts                     # TypeScript type definitions (89 lines)
├── useDocumentCRUDMutations.ts  # Document CRUD hooks (163 lines)
├── useDocumentVersionMutations.ts # Version management hooks (26 lines)
├── useCategoryMutations.ts      # Category management hooks (72 lines)
├── useTemplateMutations.ts      # Template management hooks (47 lines)
├── useDocumentSharingMutations.ts # Sharing hooks (72 lines)
├── useCommentMutations.ts       # Comment hooks (90 lines)
├── useBulkOperations.ts         # Bulk operation hooks (72 lines)
├── index.ts                     # Main exports (96 lines)
└── README.md                    # This file

Total: 1368 lines (vs. original 1172 lines)
```

## Usage

### Importing Hooks

All hooks can be imported from the main index file for backward compatibility:

```typescript
import {
  useCreateDocument,
  useUpdateDocument,
  useDeleteDocument,
  useFavoriteDocument,
  // ... all other hooks
} from '@/hooks/domains/documents/mutations';
```

Or import from specific files for better tree-shaking:

```typescript
import { useCreateDocument } from '@/hooks/domains/documents/mutations/useDocumentCRUDMutations';
import { useCreateShare } from '@/hooks/domains/documents/mutations/useDocumentSharingMutations';
```

### Available Hooks

#### Document CRUD Operations (`useDocumentCRUDMutations.ts`)
- `useCreateDocument` - Upload and create a new document
- `useUpdateDocument` - Update document metadata
- `useDeleteDocument` - Delete a document
- `useDuplicateDocument` - Create a copy of a document
- `useMoveDocument` - Move document to different category
- `useFavoriteDocument` - Add document to favorites
- `useUnfavoriteDocument` - Remove document from favorites

#### Document Versioning (`useDocumentVersionMutations.ts`)
- `useUploadNewVersion` - Upload a new version of a document

#### Category Management (`useCategoryMutations.ts`)
- `useCreateCategory` - Create a new category
- `useUpdateCategory` - Update category details
- `useDeleteCategory` - Delete a category

#### Template Operations (`useTemplateMutations.ts`)
- `useCreateTemplate` - Create a new document template
- `useCreateFromTemplate` - Create a document from a template

#### Sharing Operations (`useDocumentSharingMutations.ts`)
- `useCreateShare` - Create a share link or send to recipients
- `useUpdateShare` - Update share permissions and settings
- `useDeleteShare` - Revoke a share

#### Comment Operations (`useCommentMutations.ts`)
- `useCreateComment` - Add a comment to a document
- `useUpdateComment` - Edit an existing comment
- `useDeleteComment` - Delete a comment
- `useResolveComment` - Mark a comment as resolved

#### Bulk Operations (`useBulkOperations.ts`)
- `useBulkDeleteDocuments` - Delete multiple documents
- `useBulkMoveDocuments` - Move multiple documents to a category
- `useExportDocuments` - Export documents as PDF or ZIP

## Examples

### Creating a Document

```typescript
import { useCreateDocument } from '@/hooks/domains/documents/mutations';

function UploadDocumentForm() {
  const createDocument = useCreateDocument();

  const handleSubmit = async (file: File) => {
    await createDocument.mutateAsync({
      title: 'My Document',
      description: 'Document description',
      categoryId: 'category-123',
      file: file,
      tags: ['important', 'draft'],
      visibility: 'PRIVATE',
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
    </form>
  );
}
```

### Sharing a Document

```typescript
import { useCreateShare } from '@/hooks/domains/documents/mutations';

function ShareDocumentDialog({ documentId }: { documentId: string }) {
  const createShare = useCreateShare();

  const shareViaEmail = async (emails: string[]) => {
    await createShare.mutateAsync({
      documentId,
      shareType: 'EMAIL',
      recipients: emails.map(email => ({ email })),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      allowDownload: true,
      allowComments: true,
    });
  };

  // UI implementation
}
```

### Bulk Operations

```typescript
import { useBulkMoveDocuments, useBulkDeleteDocuments } from '@/hooks/domains/documents/mutations';

function BulkActionsToolbar({ selectedDocIds }: { selectedDocIds: string[] }) {
  const bulkMove = useBulkMoveDocuments();
  const bulkDelete = useBulkDeleteDocuments();

  const handleMoveToCategory = async (categoryId: string) => {
    await bulkMove.mutateAsync({
      docIds: selectedDocIds,
      categoryId,
    });
  };

  const handleDelete = async () => {
    if (confirm('Delete selected documents?')) {
      await bulkDelete.mutateAsync(selectedDocIds);
    }
  };

  // UI implementation
}
```

## Type Definitions

All input types are defined in `types.ts`:

- `CreateDocumentInput` - Document creation data
- `UpdateDocumentInput` - Document update data
- `CreateCategoryInput` - Category creation data
- `UpdateCategoryInput` - Category update data
- `CreateTemplateInput` - Template creation data
- `UpdateTemplateInput` - Template update data
- `CreateShareInput` - Share creation data
- `UpdateShareInput` - Share update data
- `CreateCommentInput` - Comment creation data
- `UpdateCommentInput` - Comment update data

## API Layer

The `api/` directory contains mock API functions that simulate server responses. **Replace these with real API calls in production.**

Example of replacing mock API with real implementation:

```typescript
// Before (mock):
export const documentAPI = {
  createDocument: async (data: CreateDocumentInput): Promise<Document> => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    return { /* mock data */ };
  },
};

// After (real API):
export const documentAPI = {
  createDocument: async (data: CreateDocumentInput): Promise<Document> => {
    const formData = new FormData();
    formData.append('file', data.file);
    formData.append('title', data.title);
    // ... append other fields

    const response = await fetch('/api/documents', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to create document');
    }

    return response.json();
  },
};
```

## Cache Invalidation

All hooks automatically invalidate relevant React Query caches on success:

- Document mutations → invalidate document lists and details
- Category mutations → invalidate category lists
- Template mutations → invalidate template lists
- Share mutations → invalidate share lists
- Comment mutations → invalidate comment lists

This is handled through utility functions from `../config`:
- `invalidateDocumentQueries(queryClient)`
- `invalidateCategoryQueries(queryClient)`
- `invalidateTemplateQueries(queryClient)`
- `invalidateShareQueries(queryClient)`

## Error Handling

All hooks include:
- Automatic error toast notifications
- Success toast notifications
- TypeScript error types
- React Query error states

```typescript
const mutation = useCreateDocument();

if (mutation.isError) {
  console.error(mutation.error); // Error object with message
}

if (mutation.isSuccess) {
  console.log(mutation.data); // Created document
}
```

## Custom Options

All hooks accept custom React Query options:

```typescript
const createDocument = useCreateDocument({
  onSuccess: (document) => {
    console.log('Document created:', document);
    navigate(`/documents/${document.id}`);
  },
  onError: (error) => {
    console.error('Failed to create document:', error);
    // Custom error handling
  },
  // Override default behavior
  retry: 3,
  retryDelay: 1000,
});
```

## Migration from Old File

If you're migrating from the old `useDocumentMutations.ts`:

### Before
```typescript
import { useCreateDocument, useDeleteDocument } from './useDocumentMutations';
```

### After (no changes needed!)
```typescript
import { useCreateDocument, useDeleteDocument } from './mutations';
// OR
import { useCreateDocument, useDeleteDocument } from './mutations/index';
```

The main `index.ts` file maintains full backward compatibility.

## Testing

Each hook can be tested independently:

```typescript
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useCreateDocument } from './useDocumentCRUDMutations';

test('creates a document', async () => {
  const queryClient = new QueryClient();
  const wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );

  const { result } = renderHook(() => useCreateDocument(), { wrapper });

  await waitFor(() => {
    result.current.mutate({
      title: 'Test Doc',
      categoryId: 'cat-1',
      file: new File(['content'], 'test.pdf'),
    });
  });

  expect(result.current.isSuccess).toBe(true);
});
```

## Performance Considerations

- All hooks use React Query's built-in caching
- Mutations automatically update related queries
- Optimistic updates can be implemented via `onMutate`
- Individual file imports enable better tree-shaking

## Future Improvements

1. Replace mock API functions with real API calls
2. Add optimistic updates for better UX
3. Implement retry logic for failed uploads
4. Add progress tracking for file uploads
5. Implement request cancellation for large files
6. Add offline support with mutation queuing
