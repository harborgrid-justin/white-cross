# Document Management & E-Signature System Implementation Guide

## Overview

This document provides a comprehensive guide to the document management and e-signature system implemented for the White Cross healthcare platform.

## System Architecture

### Core Components

```
Document Management System
├── Types & Schemas (Validation Layer)
│   ├── Core document types
│   ├── E-signature types
│   ├── Template types
│   ├── Version control types
│   └── Zod validation schemas
│
├── Services (Business Logic Layer)
│   ├── Upload service (chunked, resumable)
│   ├── File utilities
│   └── Document helpers
│
├── Hooks (Data Layer)
│   ├── useDocuments (list, filter, manage)
│   ├── useDocumentUpload (single/bulk upload)
│   └── useSignatureWorkflow (e-signatures)
│
├── Components (Presentation Layer)
│   ├── DocumentsList (grid/list view)
│   ├── DocumentUploader (drag-drop)
│   └── SignatureCanvas (digital signatures)
│
└── Pages (Application Layer)
    ├── /documents - Main library
    ├── /documents/upload - Upload interface
    ├── /documents/[id] - Document details
    └── /documents/signatures - Signature workflows
```

## Quick Start

### 1. Import Types

```typescript
import type {
  Document,
  DocumentMetadata,
  DocumentFilters,
  SignatureWorkflow
} from '@/types/documents';
```

### 2. Use Document Hooks

```typescript
import { useDocuments, useDocumentUpload } from '@/hooks/documents';

// In your component
const { documents, isLoading, filters, setSearchQuery } = useDocuments();

const { upload, progress, isUploading } = useDocumentUpload({
  token: authToken,
  maxFileSize: 100 * 1024 * 1024 // 100MB
});
```

### 3. Render Components

```typescript
import { DocumentsList, DocumentUploader } from '@/components/documents';

<DocumentsList
  documents={documents}
  viewMode="grid"
  onDocumentClick={(doc) => router.push(`/documents/${doc.id}`)}
/>

<DocumentUploader
  defaultMetadata={{ category: 'medical_record', isPHI: true }}
  onUploadSuccess={(id) => console.log('Uploaded:', id)}
/>
```

## Features

### Document Management

#### Upload Documents
- **Single file upload**: Drag-and-drop or file picker
- **Bulk upload**: Multiple files at once
- **Large file support**: Chunked uploads for files > 50MB
- **Progress tracking**: Real-time upload progress
- **Resume capability**: Resume interrupted uploads
- **File validation**: Type and size restrictions

#### Organize Documents
- **Folders**: Hierarchical folder structure
- **Categories**: Consent forms, medical records, immunizations, etc.
- **Tags**: Custom tagging for easy search
- **Access levels**: PUBLIC, INTERNAL, CONFIDENTIAL, PHI, RESTRICTED

#### Search & Filter
- **Full-text search**: Search across document content
- **Metadata filters**: Filter by category, status, access level
- **Date range**: Filter by upload or modified date
- **Student filter**: View documents for specific student
- **PHI filter**: Quick access to PHI documents

### E-Signature Workflows

#### Create Workflows
```typescript
const { createWorkflow } = useCreateSignatureWorkflow(token);

await createWorkflow({
  title: 'Parental Consent Form',
  documentId: 'doc-123',
  parties: [
    {
      name: 'John Doe',
      email: 'john@example.com',
      role: 'parent',
      order: 0,
      required: true
    }
  ],
  sequentialSigning: false,
  requireAllSignatures: true,
  expiresAt: new Date('2025-12-31')
});
```

#### Sign Documents
```typescript
const { sign } = useSignatureWorkflow(workflowId, token);

await sign({
  type: 'drawn',
  signatureData: 'data:image/png;base64,...',
  reason: 'Parent consent for medical treatment',
  location: 'Online'
});
```

#### Track Signatures
- **Pending signatures**: View all pending signature requests
- **Completed workflows**: Track completed signatures
- **Audit trail**: Complete signature history
- **Reminders**: Automated reminder system

### Version Control

- **Automatic versioning**: Every save creates new version
- **Version history**: View all document versions
- **Version comparison**: Compare versions (diff)
- **Version restore**: Rollback to previous version

### Security & Compliance

#### HIPAA Compliance
- **PHI flagging**: Mark documents containing PHI
- **Access control**: Role-based access to documents
- **Audit logging**: Track all document access
- **Retention policies**: Automatic document retention
- **Secure deletion**: Verified deletion process

#### E-Signature Legal Compliance
- **Audit trail**: Complete signature history
- **IP tracking**: Record signer IP address
- **Timestamp**: Verified timestamp for signatures
- **Witness support**: Witness signature capability
- **Revocation**: Signature revocation support

## API Integration

### Required Backend Endpoints

#### Document Endpoints
```
POST   /api/documents/upload
POST   /api/documents/upload/chunked/init
POST   /api/documents/upload/chunked/upload
POST   /api/documents/upload/chunked/finalize
GET    /api/documents/upload/chunked/status/:sessionId
GET    /api/documents
GET    /api/documents/:id
PUT    /api/documents/:id
DELETE /api/documents/:id
PUT    /api/documents/:id/move
POST   /api/documents/:id/share
GET    /api/documents/search
```

#### Signature Endpoints
```
POST   /api/signatures/workflows
GET    /api/signatures/workflows/:id
POST   /api/signatures/workflows/:id/cancel
POST   /api/signatures/workflows/:id/remind/:partyId
POST   /api/signatures/:id/sign
POST   /api/signatures/:id/decline
GET    /api/signatures/pending
```

### Request/Response Examples

#### Upload Document
```typescript
POST /api/documents/upload
Content-Type: multipart/form-data

{
  file: File,
  metadata: {
    title: "Patient Consent Form",
    category: "consent_form",
    accessLevel: "phi",
    isPHI: true,
    studentId: "student-123"
  }
}

Response: {
  document: Document,
  uploadId: string,
  processingStatus: "complete",
  virusScanResult: { status: "clean" }
}
```

#### Create Signature Workflow
```typescript
POST /api/signatures/workflows

{
  title: "Parental Consent",
  documentId: "doc-123",
  parties: [
    {
      name: "John Doe",
      email: "john@example.com",
      role: "parent",
      order: 0,
      required: true
    }
  ],
  sequentialSigning: false,
  expiresAt: "2025-12-31T23:59:59Z"
}

Response: SignatureWorkflow
```

## Configuration

### Environment Variables
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_MAX_FILE_SIZE=104857600  # 100MB
NEXT_PUBLIC_CHUNK_SIZE=5242880        # 5MB
```

### Upload Configuration
```typescript
const uploadService = createUploadService({
  endpoint: '/api/documents/upload',
  chunkSize: 5 * 1024 * 1024,      // 5MB
  maxFileSize: 500 * 1024 * 1024,  // 500MB
  allowedTypes: ['.pdf', '.jpg', '.png', '.docx'],
  enableRetry: true,
  maxRetries: 3,
  token: authToken
});
```

## Advanced Usage

### Custom Document Filters
```typescript
const { documents } = useDocuments({
  category: ['consent_form', 'medical_record'],
  isPHI: true,
  dateFrom: new Date('2025-01-01'),
  dateTo: new Date('2025-12-31'),
  studentId: 'student-123',
  sortBy: 'date',
  sortDirection: 'desc',
  page: 1,
  pageSize: 20
});
```

### Bulk Operations
```typescript
const { uploadMultiple } = useBulkDocumentUpload({ token });

const results = await uploadMultiple(files, {
  category: 'medical_record',
  accessLevel: 'phi',
  isPHI: true,
  schoolId: 'school-123'
});

results.forEach(result => {
  if (result.success) {
    console.log('Uploaded:', result.document.id);
  } else {
    console.error('Failed:', result.error);
  }
});
```

### Signature with Witness
```typescript
const workflow = await createWorkflow({
  title: 'Medical Consent',
  documentId: 'doc-123',
  parties: [
    {
      name: 'Parent',
      email: 'parent@example.com',
      role: 'parent',
      order: 0,
      required: true
    },
    {
      name: 'Witness',
      email: 'witness@example.com',
      role: 'witness',
      order: 1,
      required: true
    }
  ],
  sequentialSigning: true,
  requireWitness: true
});
```

## Validation

All forms use Zod schemas for validation:

```typescript
import { fileUploadSchema, signatureWorkflowSchema } from '@/schemas/documents';

// Validate upload data
const result = fileUploadSchema.safeParse(formData);
if (!result.success) {
  console.error(result.error.errors);
}

// Validate signature workflow
const workflowResult = signatureWorkflowSchema.safeParse(workflowData);
```

## Error Handling

```typescript
const { documents, error, isError } = useDocuments();

if (isError) {
  return (
    <div className="error">
      {error instanceof Error ? error.message : 'Unknown error'}
    </div>
  );
}
```

## Performance Optimization

### Caching Strategy
- Documents list cached for 30 seconds
- Document details cached for 5 minutes
- Automatic cache invalidation on mutations

### Query Keys
```typescript
import { documentsKeys } from '@/hooks/documents';

// Invalidate all documents
queryClient.invalidateQueries({ queryKey: documentsKeys.all });

// Invalidate specific document
queryClient.invalidateQueries({ queryKey: documentsKeys.detail(id) });

// Prefetch document
queryClient.prefetchQuery({
  queryKey: documentsKeys.detail(id),
  queryFn: () => fetchDocument(id)
});
```

## Testing

### Unit Tests
```typescript
import { renderHook } from '@testing-library/react';
import { useDocuments } from '@/hooks/documents';

test('useDocuments returns documents', async () => {
  const { result } = renderHook(() => useDocuments());

  await waitFor(() => {
    expect(result.current.documents).toBeDefined();
  });
});
```

### Component Tests
```typescript
import { render, screen } from '@testing-library/react';
import { DocumentsList } from '@/components/documents';

test('renders documents list', () => {
  const documents = [
    { id: '1', metadata: { title: 'Test Doc' } }
  ];

  render(<DocumentsList documents={documents} />);
  expect(screen.getByText('Test Doc')).toBeInTheDocument();
});
```

## Deployment Checklist

- [ ] Configure backend API endpoints
- [ ] Set up file storage (S3/Azure/Local)
- [ ] Configure virus scanning service
- [ ] Set up OCR processing (optional)
- [ ] Configure search indexing
- [ ] Set up email service for notifications
- [ ] Configure SSL certificates
- [ ] Set up CDN for file delivery
- [ ] Configure backup strategy
- [ ] Set up monitoring and logging
- [ ] Test HIPAA compliance
- [ ] Test signature legal compliance

## Troubleshooting

### Upload Fails
1. Check file size limits
2. Verify file type is allowed
3. Check network connectivity
4. Verify backend endpoint is accessible
5. Check authentication token

### Chunked Upload Issues
1. Verify chunk size configuration
2. Check session timeout settings
3. Verify resume capability
4. Check backend chunk processing

### Signature Workflow Issues
1. Verify all required fields
2. Check party email addresses
3. Verify sequential order (if enabled)
4. Check expiration dates
5. Verify witness requirements

## Support

For issues or questions:
1. Check this documentation
2. Review type definitions in `src/types/documents/`
3. Check Zod schemas in `src/schemas/documents.ts`
4. Review example usage in pages
5. Check backend API documentation

## Future Enhancements

Planned features:
- Advanced PDF annotation
- Document collaboration
- Real-time document preview
- AI-powered document classification
- Automated form filling
- Document templates with logic
- Advanced search with filters
- Document analytics dashboard
- Mobile-optimized signature capture
- Offline document access

---

**Version**: 1.0.0
**Last Updated**: 2025-10-26
**Author**: TypeScript Architect
