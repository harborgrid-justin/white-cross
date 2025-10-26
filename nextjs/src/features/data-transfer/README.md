# Data Import/Export System

Comprehensive data import/export utilities for healthcare data with HIPAA compliance, streaming support, and robust validation.

## Features

### Import Capabilities
- **Multi-format Support**: CSV, Excel (XLSX), JSON
- **Streaming**: Handle large files (100MB+) with memory efficiency
- **Field Mapping**: Flexible field mapping with transformations
- **Validation**: Multi-layer validation (schema, business rules, HIPAA)
- **Duplicate Detection**: Configurable strategies (skip, update, error, prompt)
- **Error Recovery**: Checkpoint-based recovery for failed imports
- **Progress Tracking**: Real-time progress with throughput metrics
- **Batch Processing**: Configurable batch sizes for optimal performance

### Export Capabilities
- **Multi-format Output**: CSV, Excel (XLSX), JSON, PDF
- **Data Sanitization**: Remove or mask PHI for compliance
- **Compression**: ZIP compression for large exports
- **Field Selection**: Choose specific fields to export
- **Scheduled Exports**: Set up recurring exports with email delivery
- **Custom Templates**: Save and reuse export configurations

## Architecture

### Directory Structure
```
src/features/data-transfer/
├── types/                  # TypeScript type definitions
│   └── index.ts           # All import/export types
├── validation/            # Validation engine
│   ├── schemas.ts        # Zod validation schemas
│   └── validator.ts      # Validation engine and healthcare validators
├── services/              # Business logic
│   ├── import/           # Import services
│   │   ├── csv-parser.ts # CSV parser with streaming
│   │   └── index.ts      # Main import service
│   └── export/           # Export services
│       └── index.ts      # Main export service and scheduled exports
├── components/            # React components
│   ├── FileDropzone.tsx  # Drag-and-drop file upload
│   ├── ImportProgress.tsx # Real-time progress indicator
│   └── index.ts          # Component exports
├── hooks/                 # Custom React hooks
│   ├── useImport.ts      # Import hook with state management
│   ├── useExport.ts      # Export hook with state management
│   └── index.ts          # Hook exports
└── index.ts              # Main feature exports
```

### Type System

#### Core Types
```typescript
// Entity types that can be imported/exported
type EntityType =
  | 'students'
  | 'medications'
  | 'health-records'
  | 'immunizations'
  | 'allergies'
  | 'appointments'
  | 'emergency-contacts'
  | 'incidents'
  | 'documents';

// Import configuration
interface ImportConfig<T extends EntityType> {
  entityType: T;
  format: ImportFormatConfig;
  mapping: FieldMapping<T>;
  options: ImportOptions;
}

// Export configuration
interface ExportConfig<T extends EntityType> {
  entityType: T;
  format: ExportFormatConfig;
  fields: FieldSelection<T>;
  filters?: ExportFilters;
  options: ExportOptions;
}
```

## Usage Examples

### Basic Import

```typescript
import { useImport } from '@/features/data-transfer/hooks';
import type { ImportConfig } from '@/features/data-transfer/types';

function ImportComponent() {
  const { import: performImport, progress, result } = useImport({
    onComplete: (result) => {
      console.log('Import completed:', result);
    },
  });

  const handleImport = async (file: File) => {
    const config: ImportConfig = {
      entityType: 'students',
      format: {
        type: 'csv',
        delimiter: ',',
        hasHeader: true,
        encoding: 'utf-8',
      },
      mapping: {
        entityType: 'students',
        mappings: [
          { sourceField: 'Student ID', targetField: 'studentId' },
          { sourceField: 'First Name', targetField: 'firstName' },
          { sourceField: 'Last Name', targetField: 'lastName' },
        ],
      },
      options: {
        batchSize: 1000,
        skipErrors: false,
        errorThreshold: 100,
        duplicateStrategy: 'error',
        validateOnly: false,
        createCheckpoints: true,
        notifyOnComplete: true,
      },
    };

    await performImport(file, config);
  };

  return <div>...</div>;
}
```

### Basic Export

```typescript
import { useExport } from '@/features/data-transfer/hooks';
import type { ExportConfig } from '@/features/data-transfer/types';

function ExportComponent() {
  const { exportData, result } = useExport({
    autoDownload: true,
    onComplete: (result) => {
      console.log('Export completed:', result);
    },
  });

  const handleExport = async (data: Array<Record<string, unknown>>) => {
    const config: ExportConfig = {
      entityType: 'students',
      format: {
        type: 'csv',
        delimiter: ',',
        includeHeader: true,
      },
      fields: {
        entityType: 'students',
        fields: [
          { field: 'studentId', label: 'Student ID' },
          { field: 'firstName', label: 'First Name' },
          { field: 'lastName', label: 'Last Name' },
        ],
      },
      options: {
        compress: false,
        sanitize: true, // Remove PHI
        includeMetadata: true,
      },
    };

    await exportData(data, config);
  };

  return <div>...</div>;
}
```

### Field Transformations

```typescript
const mapping: FieldMapping = {
  entityType: 'students',
  mappings: [
    {
      sourceField: 'DOB',
      targetField: 'dateOfBirth',
      transform: {
        type: 'date',
        format: 'MM/DD/YYYY',
      },
    },
    {
      sourceField: 'Name',
      targetField: 'fullName',
      transform: {
        type: 'trim',
      },
    },
    {
      sourceField: 'Grade',
      targetField: 'gradeLevel',
      transform: {
        type: 'number',
        decimals: 0,
      },
    },
  ],
};
```

### Custom Validation

```typescript
import { DataValidator } from '@/features/data-transfer/validation/validator';

const validator = new DataValidator({
  entityType: 'students',
  rules: [
    {
      field: 'email',
      validators: [
        { type: 'required' },
        { type: 'email' },
      ],
      required: true,
    },
    {
      field: 'age',
      validators: [
        {
          type: 'number',
          min: 5,
          max: 18,
        },
      ],
    },
    {
      field: 'ssn',
      validators: [
        {
          type: 'custom',
          fn: (value) => validateSSN(String(value)),
          message: 'Invalid SSN format',
        },
      ],
    },
  ],
});

const result = validator.validate(record);
if (!result.valid) {
  console.error('Validation errors:', result.errors);
}
```

### Scheduled Exports

```typescript
import { ScheduledExportService } from '@/features/data-transfer/services/export';

const scheduledExportService = new ScheduledExportService();

scheduledExportService.scheduleExport(
  'daily-student-export',
  {
    entityType: 'students',
    format: { type: 'csv', delimiter: ',', includeHeader: true },
    fields: { entityType: 'students', fields: [...] },
    options: {
      compress: true,
      sanitize: true,
      emailTo: ['admin@school.edu'],
      schedule: {
        frequency: 'daily',
        time: '02:00',
        enabled: true,
      },
    },
  },
  async () => {
    // Fetch data
    return await fetchStudents();
  }
);
```

## Validation

### Built-in Validators
- `required` - Field must have a value
- `email` - Valid email format
- `phone` - Valid phone number (US format)
- `date` - Valid date with optional format
- `number` - Numeric value with min/max
- `length` - String length constraints
- `regex` - Pattern matching
- `enum` - Value from list
- `custom` - Custom validation function

### Healthcare-Specific Validators
- `validateSSN` - Social Security Number with checksum
- `validateNPI` - National Provider Identifier with Luhn check
- `validateICD10` - ICD-10 diagnosis code format
- `validateDosage` - Medication dosage format
- `validateDOB` - Date of birth (not in future, reasonable past)

## HIPAA Compliance

### Data Sanitization
The export system includes built-in PHI sanitization:

```typescript
const config: ExportConfig = {
  // ...
  options: {
    sanitize: true, // Enable sanitization
    // ...
  },
};
```

Sanitization features:
- Mask SSN (XXX-XX-1234 → ***-**-1234)
- Mask DOB (keeps only year)
- Remove medical record numbers
- Remove insurance numbers
- Optional removal of notes and diagnostic codes

### Audit Logging
All import/export operations should be logged for HIPAA compliance:

```typescript
// Log import operation
auditLog.log({
  action: 'DATA_IMPORT',
  userId: currentUser.id,
  entityType: config.entityType,
  recordCount: result.successfulRows,
  timestamp: new Date(),
  metadata: {
    fileName: file.name,
    fileSize: file.size,
    importId: result.importId,
  },
});
```

## Performance Considerations

### Large File Handling
- Use streaming parser for files >10MB
- Process in batches (default: 1000 rows)
- Create checkpoints every 5000 rows
- Use Web Workers for CPU-intensive parsing (future)

### Memory Management
```typescript
// Streaming CSV parser for very large files
const streamingParser = new StreamingCSVParser({
  batchSize: 1000,
});

for await (const batch of streamingParser.parseFileStream(file, mapping)) {
  // Process batch
  await processBatch(batch);
}
```

### Optimization Tips
1. **Batch Size**: Adjust based on record complexity (500-2000)
2. **Validation**: Use `validateOnly: true` for dry runs
3. **Checkpoints**: Enable for imports >5000 rows
4. **Compression**: Enable for exports >10MB

## Error Handling

### Import Errors
```typescript
interface ImportError {
  row: number;
  field?: string;
  code: string;
  message: string;
  severity: 'error' | 'critical';
  data?: unknown;
}
```

Common error codes:
- `PARSE_ERROR` - File parsing failed
- `VALIDATION_ERROR` - Data validation failed
- `DUPLICATE_RECORD` - Duplicate detected
- `REQUIRED_FIELD` - Required field missing
- `INVALID_FORMAT` - Data format invalid

### Error Recovery
```typescript
const config: ImportConfig = {
  // ...
  options: {
    skipErrors: true, // Continue on error
    errorThreshold: 100, // Abort after 100 errors
    createCheckpoints: true, // Enable recovery
  },
};
```

## Testing

### Unit Tests
```typescript
import { DataValidator } from '@/features/data-transfer/validation/validator';

describe('DataValidator', () => {
  it('should validate required fields', () => {
    const validator = new DataValidator({
      entityType: 'students',
      rules: [
        {
          field: 'studentId',
          validators: [{ type: 'required' }],
          required: true,
        },
      ],
    });

    const result = validator.validate({ studentId: '' });
    expect(result.valid).toBe(false);
    expect(result.errors).toHaveLength(1);
  });
});
```

### Integration Tests
```typescript
import { ImportService } from '@/features/data-transfer/services/import';

describe('ImportService', () => {
  it('should import CSV file successfully', async () => {
    const file = new File(['header1,header2\nvalue1,value2'], 'test.csv');
    const config = createTestConfig();
    const service = new ImportService(config);

    const result = await service.import(file);

    expect(result.status).toBe('completed');
    expect(result.successfulRows).toBe(1);
  });
});
```

## Future Enhancements

### Planned Features
- [ ] Excel parser implementation
- [ ] JSON parser implementation
- [ ] PDF generator implementation
- [ ] Web Workers for parallel processing
- [ ] Real-time WebSocket progress updates
- [ ] Advanced field mapping UI
- [ ] Template marketplace
- [ ] Data transformation preview
- [ ] Conflict resolution UI
- [ ] Rollback capability

### API Integration
```typescript
// Future: Backend API endpoints
POST /api/v1/imports
GET /api/v1/imports/:id
GET /api/v1/imports/history
POST /api/v1/exports
GET /api/v1/exports/:id
GET /api/v1/exports/history
```

## Troubleshooting

### Common Issues

**Import fails with "File too large"**
- Use streaming parser for files >100MB
- Increase max file size in configuration

**Validation errors on all rows**
- Check field mapping configuration
- Verify source field names match file headers
- Review validation rules

**Poor performance on large files**
- Reduce batch size
- Enable streaming parser
- Disable unnecessary validation

**Export downloads empty file**
- Check data fetching logic
- Verify field selection
- Review browser console for errors

## Contributing

When adding new features:
1. Add types to `types/index.ts`
2. Add validation schemas to `validation/schemas.ts`
3. Implement service logic
4. Create UI components
5. Add custom hooks
6. Write tests
7. Update documentation

## License

Internal use only. HIPAA-compliant healthcare data handling.
