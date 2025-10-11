# Document Module CRUD Operations and Validation

## Overview

This document provides comprehensive documentation for the Document Management module's CRUD operations, validation logic, and business rules. The module implements enterprise-grade validation for healthcare document management with full HIPAA compliance.

## Table of Contents

1. [Validation Architecture](#validation-architecture)
2. [File Upload Validation](#file-upload-validation)
3. [Document Metadata Validation](#document-metadata-validation)
4. [Document Lifecycle Validation](#document-lifecycle-validation)
5. [Operation-Specific Validation](#operation-specific-validation)
6. [Error Handling](#error-handling)
7. [Frontend-Backend Alignment](#frontend-backend-alignment)

---

## Validation Architecture

### Backend Validation
**Location:** `backend/src/utils/documentValidation.ts`

The backend implements comprehensive server-side validation that:
- Prevents malicious data from entering the system
- Enforces business rules and compliance requirements
- Validates data integrity before database operations
- Provides detailed error messages for API consumers

### Frontend Validation
**Location:** `frontend/src/utils/documentValidation.ts`

The frontend implements matching client-side validation that:
- Provides immediate user feedback
- Prevents unnecessary API calls
- Mirrors backend validation logic exactly
- Improves user experience with real-time validation

### Validation Error Structure

```typescript
interface ValidationError {
  field: string;        // Field that failed validation
  message: string;      // Human-readable error message
  code: string;         // Machine-readable error code
  value?: any;          // Optional: the invalid value
}
```

---

## File Upload Validation

### 1. File Size Validation

**Rules:**
- **Minimum size:** 1 KB (prevents empty files)
- **Maximum size:** 50 MB (MAX_FILE_SIZE constant)

**Error Codes:**
- `FILE_TOO_SMALL`: File is smaller than minimum size
- `FILE_TOO_LARGE`: File exceeds maximum size

**Implementation:**
```typescript
validateFileSize(fileSize: number): ValidationError | null
```

### 2. File Type Validation

**Allowed MIME Types:**

**Documents:**
- `application/pdf`
- `application/msword` (DOC)
- `application/vnd.openxmlformats-officedocument.wordprocessingml.document` (DOCX)
- `application/vnd.ms-excel` (XLS)
- `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet` (XLSX)
- `text/plain` (TXT)
- `text/csv` (CSV)

**Images:**
- `image/jpeg` / `image/jpg`
- `image/png`
- `image/gif`
- `image/webp`

**Error Codes:**
- `MISSING_FILE_TYPE`: File type not provided
- `INVALID_FILE_TYPE`: File type not in allowed list

**Implementation:**
```typescript
validateFileType(fileType: string, allowedTypes?: string[]): ValidationError | null
```

### 3. File Extension Validation

**Rules:**
- File extension must match the MIME type
- Prevents file type spoofing attacks
- Case-insensitive comparison

**Error Codes:**
- `UNSUPPORTED_FILE_EXTENSION`: Extension not in supported list
- `FILE_TYPE_EXTENSION_MISMATCH`: Extension doesn't match MIME type

**Example:**
```
✓ Valid: document.pdf with application/pdf
✗ Invalid: malware.pdf with text/plain
```

**Implementation:**
```typescript
validateFileExtensionMatchesMimeType(fileName: string, fileType: string): ValidationError | null
```

### 4. File Name Validation

**Rules:**
- Required field
- Maximum 255 characters
- Only alphanumeric, spaces, dots, hyphens, and underscores
- Pattern: `/^[a-zA-Z0-9._\-\s]+$/`

**Error Codes:**
- `MISSING_FILE_NAME`: File name not provided
- `FILE_NAME_TOO_LONG`: Exceeds 255 characters
- `INVALID_FILE_NAME_CHARACTERS`: Contains forbidden characters

---

## Document Metadata Validation

### 1. Title Validation

**Rules:**
- Required field
- Minimum length: 3 characters
- Maximum length: 255 characters
- XSS protection: Rejects `<script>`, `<iframe>`, `javascript:`
- Trimmed before storage

**Error Codes:**
- `MISSING_TITLE`: Title not provided
- `TITLE_TOO_SHORT`: Less than 3 characters
- `TITLE_TOO_LONG`: Exceeds 255 characters
- `INVALID_TITLE_CONTENT`: Contains potentially malicious content

**Implementation:**
```typescript
validateDocumentTitle(title: string): ValidationError | null
```

### 2. Description Validation

**Rules:**
- Optional field
- Maximum length: 5,000 characters
- XSS protection applied
- Trimmed before storage

**Error Codes:**
- `DESCRIPTION_TOO_LONG`: Exceeds 5,000 characters
- `INVALID_DESCRIPTION_CONTENT`: Contains potentially malicious content

**Implementation:**
```typescript
validateDocumentDescription(description?: string): ValidationError | null
```

### 3. Category Validation

**Valid Categories:**
```typescript
enum DocumentCategory {
  MEDICAL_RECORD       // 7-year retention
  INCIDENT_REPORT      // 7-year retention
  CONSENT_FORM         // 7-year retention
  POLICY               // 5-year retention
  TRAINING             // 5-year retention
  ADMINISTRATIVE       // 3-year retention
  STUDENT_FILE         // 7-year retention
  INSURANCE            // 7-year retention
  OTHER                // 3-year retention
}
```

**Rules:**
- Required field
- Must be valid enum value
- Determines default retention period

**Error Codes:**
- `MISSING_CATEGORY`: Category not provided
- `INVALID_CATEGORY`: Not a valid category enum value

**Implementation:**
```typescript
validateDocumentCategory(category: string): ValidationError | null
```

### 4. Access Level Validation

**Valid Access Levels:**
```typescript
enum DocumentAccessLevel {
  PUBLIC          // Accessible to all users
  STAFF_ONLY      // School staff only
  ADMIN_ONLY      // Administrators only
  RESTRICTED      // Specific user permissions required
}
```

**Rules:**
- Required field (defaults to STAFF_ONLY)
- Must be valid enum value
- Controls document visibility

**Error Codes:**
- `MISSING_ACCESS_LEVEL`: Access level not provided
- `INVALID_ACCESS_LEVEL`: Not a valid access level enum value

**Implementation:**
```typescript
validateAccessLevel(accessLevel: string): ValidationError | null
```

### 5. Tags Validation

**Rules:**
- Optional field
- Maximum 10 tags per document
- Each tag: 2-50 characters
- Only alphanumeric, spaces, hyphens, underscores
- No duplicate tags (case-insensitive)
- Trimmed before storage

**Error Codes:**
- `TOO_MANY_TAGS`: More than 10 tags
- `TAG_TOO_SHORT`: Tag less than 2 characters
- `TAG_TOO_LONG`: Tag exceeds 50 characters
- `INVALID_TAG_CHARACTERS`: Contains forbidden characters
- `DUPLICATE_TAGS`: Same tag appears multiple times

**Implementation:**
```typescript
validateDocumentTags(tags?: string[]): ValidationError[]
```

---

## Document Lifecycle Validation

### 1. Status Validation

**Valid Statuses:**
```typescript
enum DocumentStatus {
  DRAFT            // Initial state, editable
  PENDING_REVIEW   // Awaiting review, editable
  APPROVED         // Approved, limited changes
  ARCHIVED         // Archived, read-only
  EXPIRED          // Past retention date
}
```

**Error Codes:**
- `MISSING_STATUS`: Status not provided
- `INVALID_STATUS`: Not a valid status enum value

**Implementation:**
```typescript
validateDocumentStatus(status: string): ValidationError | null
```

### 2. Status Transition Validation

**Valid Transitions:**

| From | To (Allowed) |
|------|-------------|
| DRAFT | PENDING_REVIEW, APPROVED, ARCHIVED |
| PENDING_REVIEW | DRAFT, APPROVED, ARCHIVED |
| APPROVED | ARCHIVED, EXPIRED |
| ARCHIVED | (none - terminal state) |
| EXPIRED | ARCHIVED |

**Business Rules:**
- Documents cannot move out of ARCHIVED status
- Only specific transitions are allowed
- Maintains document integrity and audit trail

**Error Codes:**
- `INVALID_STATUS_TRANSITION`: Requested transition not allowed

**Implementation:**
```typescript
validateStatusTransition(currentStatus: DocumentStatus, newStatus: DocumentStatus): ValidationError | null
```

### 3. Retention Date Validation

**Rules:**
- Optional field (calculated if not provided)
- Must be future date
- Should align with category retention period
- Warning if exceeds recommended retention + 1 year

**Retention Periods by Category:**
- MEDICAL_RECORD: 7 years
- INCIDENT_REPORT: 7 years
- CONSENT_FORM: 7 years
- POLICY: 5 years
- TRAINING: 5 years
- ADMINISTRATIVE: 3 years
- STUDENT_FILE: 7 years
- INSURANCE: 7 years
- OTHER: 3 years

**Error Codes:**
- `INVALID_RETENTION_DATE`: Invalid date format
- `RETENTION_DATE_IN_PAST`: Date is in the past
- `RETENTION_DATE_TOO_FAR`: Exceeds recommended retention period

**Implementation:**
```typescript
validateRetentionDate(retentionDate: Date | string, category: DocumentCategory): ValidationError | null
calculateDefaultRetentionDate(category: DocumentCategory, createdAt?: Date): Date
```

---

## Operation-Specific Validation

### 1. Document Creation

**Validation Flow:**
1. Validate title (required, length, content)
2. Validate description (optional, length, content)
3. Validate category (required, valid enum)
4. Validate file upload (name, type, size, extension)
5. Validate tags (count, length, characters, duplicates)
6. Validate access level (required, valid enum)
7. Calculate default retention date from category

**Special Rules:**
- New documents start as DRAFT status
- Version starts at 1
- Retention date automatically calculated if not provided
- Tags are trimmed and deduplicated

**Implementation:**
```typescript
// Backend
validateDocumentCreation(data: CreateDocumentData): ValidationError[]

// Frontend
validateDocumentCreation(data: {
  title: string;
  description?: string;
  category: string;
  file: File;
  tags?: string[];
  accessLevel?: string;
}): ValidationResult
```

### 2. Document Update

**Validation Flow:**
1. Check if document is editable (DRAFT or PENDING_REVIEW)
2. Validate updated title (if provided)
3. Validate updated description (if provided)
4. Validate status transition (if status changed)
5. Validate updated tags (if provided)
6. Validate retention date (if provided)
7. Validate access level (if provided)

**Special Rules:**
- Only DRAFT and PENDING_REVIEW documents can have content edited
- Status can be changed to ARCHIVED from any state
- Approved documents have limited editability

**Error Codes:**
- `DOCUMENT_NOT_EDITABLE`: Document status prevents editing

**Implementation:**
```typescript
// Backend
validateDocumentUpdate(
  currentStatus: DocumentStatus,
  updateData: UpdateDocumentData,
  category: DocumentCategory
): ValidationError[]

// Frontend
validateDocumentUpdate(
  currentStatus: DocumentStatus,
  category: DocumentCategory,
  updateData: UpdateDocumentRequest
): ValidationResult
```

### 3. Document Signing

**Validation Flow:**
1. Check document status (cannot be ARCHIVED or EXPIRED)
2. Check retention date (document not expired)
3. Validate signer ID (required)
4. Validate signer role (required, max 100 chars)
5. Validate signature data (optional, max 10,000 chars)

**Business Rules:**
- Archived documents cannot be signed
- Expired documents cannot be signed
- Documents past retention date cannot be signed
- Signing automatically changes status to APPROVED

**Signature-Required Categories:**
- MEDICAL_RECORD
- CONSENT_FORM
- INCIDENT_REPORT

**Error Codes:**
- `DOCUMENT_NOT_SIGNABLE`: Status prevents signing
- `DOCUMENT_EXPIRED`: Document past retention date
- `MISSING_SIGNER`: Signer ID not provided
- `MISSING_SIGNER_ROLE`: Signer role not provided
- `SIGNER_ROLE_TOO_LONG`: Role exceeds 100 characters
- `SIGNATURE_DATA_TOO_LONG`: Signature data exceeds 10,000 characters

**Implementation:**
```typescript
validateDocumentCanBeSigned(status: DocumentStatus, retentionDate?: Date | string): ValidationError | null
validateSignatureData(signedBy: string, signedByRole: string, signatureData?: string): ValidationError[]
```

### 4. Document Deletion

**Validation Flow:**
1. Check document status and category
2. Prevent deletion of critical approved documents

**Business Rules:**
- APPROVED MEDICAL_RECORD documents cannot be deleted (must archive)
- APPROVED INCIDENT_REPORT documents cannot be deleted (must archive)
- Other documents can be deleted regardless of status
- Deletion creates audit trail entry before removal

**Error Codes:**
- `DOCUMENT_NOT_DELETABLE`: Document cannot be deleted due to status/category

**Implementation:**
```typescript
validateDocumentCanBeDeleted(status: DocumentStatus, category: DocumentCategory): ValidationError | null
```

### 5. Document Sharing

**Validation Flow:**
1. Validate share recipient list (non-empty, max 50 users)
2. Check for duplicate user IDs
3. Validate document is not ARCHIVED or EXPIRED
4. Create audit trail entry

**Business Rules:**
- Must share with at least 1 user
- Maximum 50 users per share operation
- No duplicate user IDs
- Cannot share archived or expired documents

**Error Codes:**
- `MISSING_SHARE_RECIPIENTS`: No users specified
- `TOO_MANY_SHARE_RECIPIENTS`: More than 50 users
- `DUPLICATE_SHARE_RECIPIENTS`: Duplicate user IDs
- `DOCUMENT_NOT_SHAREABLE`: Document status prevents sharing

**Implementation:**
```typescript
validateSharePermissions(sharedWith: string[]): ValidationError[]
```

### 6. Version Creation

**Validation Flow:**
1. Check parent document exists
2. Validate parent is not ARCHIVED
3. Check version count (max 100 versions)
4. Validate file upload for new version
5. Increment version number

**Business Rules:**
- Maximum 100 versions per document
- Cannot create version of archived document
- New version inherits parent's category and access level
- Version number auto-increments
- New version starts as DRAFT

**Error Codes:**
- `PARENT_ARCHIVED`: Cannot version archived document
- `MAX_VERSIONS_REACHED`: Too many versions (100+)

**Implementation:**
```typescript
validateVersionCreation(parentStatus: DocumentStatus, parentVersionCount: number): ValidationError | null
```

---

## Error Handling

### Backend Error Response

When validation fails, the backend throws `DocumentValidationError`:

```typescript
class DocumentValidationError extends Error {
  errors: ValidationError[];

  constructor(errors: ValidationError[]) {
    super('Document validation failed');
    this.name = 'DocumentValidationError';
    this.errors = errors;
  }
}
```

**API Response Format:**
```json
{
  "success": false,
  "error": "Document validation failed",
  "validationErrors": [
    {
      "field": "title",
      "message": "Title must be at least 3 characters",
      "code": "TITLE_TOO_SHORT",
      "value": "AB"
    }
  ]
}
```

### Frontend Error Handling

The frontend validation returns a `ValidationResult`:

```typescript
interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}
```

**Usage Example:**
```typescript
const result = validateDocumentCreation(formData);

if (!result.isValid) {
  // Display errors to user
  const errorMessage = formatValidationErrors(result.errors);
  showErrorToast(errorMessage);
  return;
}

// Proceed with API call
await documentsApi.createDocument(formData);
```

---

## Frontend-Backend Alignment

### Validation Parity

The frontend and backend validation logic is intentionally identical to ensure:
1. **Consistent User Experience:** Users get the same validation on client and server
2. **Reduced Round Trips:** Invalid data caught before API calls
3. **Security:** Server-side validation always enforced regardless of client
4. **Maintainability:** Changes to validation rules update both sides

### Shared Constants

Both frontend and backend use the same validation constants:

```typescript
// File Validation
MAX_FILE_SIZE = 50 * 1024 * 1024;  // 50MB
MIN_FILE_SIZE = 1024;               // 1KB

// Text Fields
MAX_TITLE_LENGTH = 255;
MIN_TITLE_LENGTH = 3;
MAX_DESCRIPTION_LENGTH = 5000;

// Tags
MAX_TAGS_COUNT = 10;
MAX_TAG_LENGTH = 50;
MIN_TAG_LENGTH = 2;

// Sharing
MAX_SHARE_RECIPIENTS = 50;
```

### Validation Functions Mapping

| Operation | Backend Function | Frontend Function |
|-----------|-----------------|-------------------|
| File Upload | `validateFileUpload()` | `validateFile()` |
| Document Creation | `validateDocumentCreation()` | `validateDocumentCreation()` |
| Document Update | `validateDocumentUpdate()` | `validateDocumentUpdate()` |
| Title | `validateDocumentTitle()` | `validateDocumentTitle()` |
| Description | `validateDocumentDescription()` | `validateDocumentDescription()` |
| Category | `validateDocumentCategory()` | `validateDocumentCategory()` |
| Tags | `validateDocumentTags()` | `validateDocumentTags()` |
| Status | `validateDocumentStatus()` | `validateDocumentStatus()` |
| Status Transition | `validateStatusTransition()` | `validateStatusTransition()` |
| Retention Date | `validateRetentionDate()` | `validateRetentionDate()` |
| Can Edit | `validateDocumentCanBeEdited()` | `validateDocumentCanBeEdited()` |
| Can Sign | `validateDocumentCanBeSigned()` | `validateDocumentCanBeSigned()` |
| Can Delete | `validateDocumentCanBeDeleted()` | `validateDocumentCanBeDeleted()` |
| Signature Data | `validateSignatureData()` | `validateSignatureData()` |
| Share Permissions | `validateSharePermissions()` | `validateSharePermissions()` |

---

## Testing Validation

### Backend Testing

Test validation functions in isolation:

```typescript
import {
  validateDocumentTitle,
  validateFileSize,
  validateDocumentCreation,
} from '../utils/documentValidation';

describe('Document Validation', () => {
  describe('validateDocumentTitle', () => {
    it('should reject empty title', () => {
      const error = validateDocumentTitle('');
      expect(error).toBeTruthy();
      expect(error?.code).toBe('MISSING_TITLE');
    });

    it('should reject title under 3 characters', () => {
      const error = validateDocumentTitle('AB');
      expect(error).toBeTruthy();
      expect(error?.code).toBe('TITLE_TOO_SHORT');
    });

    it('should accept valid title', () => {
      const error = validateDocumentTitle('Valid Document Title');
      expect(error).toBeNull();
    });
  });
});
```

### Frontend Testing

Test validation with actual file objects:

```typescript
import { validateFile, validateDocumentCreation } from '../utils/documentValidation';

describe('Document Validation', () => {
  describe('validateFile', () => {
    it('should accept valid PDF file', () => {
      const file = new File(['content'], 'document.pdf', { type: 'application/pdf' });
      const result = validateFile(file);
      expect(result.isValid).toBe(true);
    });

    it('should reject file over 50MB', () => {
      const largeContent = new ArrayBuffer(51 * 1024 * 1024);
      const file = new File([largeContent], 'large.pdf', { type: 'application/pdf' });
      const result = validateFile(file);
      expect(result.isValid).toBe(false);
      expect(result.errors[0].code).toBe('FILE_TOO_LARGE');
    });
  });
});
```

---

## Security Considerations

### XSS Prevention
- Title and description checked for `<script>`, `<iframe>`, `javascript:` patterns
- Content sanitized before storage
- HTML encoding applied on display

### File Upload Security
- File type validation prevents malicious uploads
- Extension-MIME type matching prevents spoofing
- File size limits prevent DoS attacks
- Filename sanitization prevents path traversal

### HIPAA Compliance
- Audit trail for all document operations
- Retention date enforcement
- Access level controls
- Cannot delete approved medical records
- Signature validation for consent forms

### Data Integrity
- Status transition rules prevent invalid state changes
- Version control validation maintains document history
- Duplicate prevention (tags, share recipients)
- Foreign key validation (student, user references)

---

## Summary of Validation Gaps Fixed

### 1. File Upload Validation
✅ **Added:** MIME type validation with whitelist
✅ **Added:** File size validation (1KB - 50MB)
✅ **Added:** Extension-MIME type matching
✅ **Added:** Filename sanitization and character validation

### 2. Document Metadata Validation
✅ **Added:** Title length validation (3-255 chars)
✅ **Added:** XSS prevention in title and description
✅ **Added:** Tag validation (max 10, length 2-50, no duplicates)
✅ **Added:** Category enum validation
✅ **Added:** Access level enum validation

### 3. Document Lifecycle Validation
✅ **Added:** Status transition matrix validation
✅ **Added:** Retention date validation with category-based rules
✅ **Added:** Document expiration checking
✅ **Added:** Edit permission validation based on status

### 4. Operation-Specific Validation
✅ **Added:** Signature validation (expired/archived documents)
✅ **Added:** Share validation (max 50 users, no duplicates)
✅ **Added:** Delete validation (prevent deletion of approved medical records)
✅ **Added:** Version creation validation (max 100 versions)

### 5. Frontend-Backend Alignment
✅ **Added:** Matching validation utilities on frontend
✅ **Added:** Identical validation constants
✅ **Added:** Consistent error codes and messages
✅ **Added:** Same validation result structures

---

## Conclusion

The Document Management module now implements comprehensive, enterprise-grade validation that ensures:
- **Data Integrity:** Invalid data cannot enter the system
- **HIPAA Compliance:** Healthcare regulations enforced through validation
- **User Experience:** Immediate feedback on frontend, consistent with backend
- **Security:** XSS prevention, file upload security, audit trails
- **Maintainability:** Well-structured validation utilities, easy to extend

All validation gaps between frontend and backend have been addressed, and the module is production-ready for healthcare document management.
