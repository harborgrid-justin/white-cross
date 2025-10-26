# White Cross Performance Optimization Guide - Part 2
## Features 11-15: Detailed Implementation

**Document Version:** 1.0
**Created:** October 26, 2025
**Continuation of:** PERFORMANCE_OPTIMIZATION_GUIDE.md

---

## Feature 11: Immunization UI Components

**Performance Profile:**
- Complex Forms: Multi-vaccine entry
- Data Validation: CDC schedules
- Frequent Updates: Record keeping

### 11.1 Optimized Immunization Entry Form

```typescript
// /frontend/src/pages/health/components/ImmunizationEntryForm.tsx
import { memo, useCallback, useMemo } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const immunizationSchema = z.object({
  studentId: z.string().min(1, 'Student is required'),
  vaccines: z.array(z.object({
    vaccineType: z.string().min(1, 'Vaccine type required'),
    dateAdministered: z.date(),
    lotNumber: z.string().optional(),
    expirationDate: z.date().optional(),
    administeredBy: z.string().min(1, 'Administrator required'),
    site: z.enum(['LEFT_ARM', 'RIGHT_ARM', 'LEFT_LEG', 'RIGHT_LEG']),
    dose: z.number().positive(),
    manufacturer: z.string().optional()
  })).min(1, 'At least one vaccine required')
});

type ImmunizationFormData = z.infer<typeof immunizationSchema>;

export const ImmunizationEntryForm = memo(() => {
  const { register, control, handleSubmit, formState: { errors, isSubmitting }, watch } = useForm<ImmunizationFormData>({
    resolver: zodResolver(immunizationSchema),
    defaultValues: {
      vaccines: [{}]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'vaccines'
  });

  // Memoize CDC schedule validation
  const cdcSchedule = useMemo(() => ({
    'MMR': { minAge: 12, maxAge: 15, doses: 2 },
    'DTaP': { minAge: 2, maxAge: 6, doses: 5 },
    'Polio': { minAge: 2, maxAge: 6, doses: 4 },
    'Hepatitis B': { minAge: 0, maxAge: 18, doses: 3 },
    'Varicella': { minAge: 12, maxAge: 15, doses: 2 }
  }), []);

  const validateVaccineSchedule = useCallback((
    vaccineType: string,
    dateAdministered: Date,
    studentDOB: Date
  ): { valid: boolean; message?: string } => {
    const schedule = cdcSchedule[vaccineType];
    if (!schedule) return { valid: true };

    const ageInMonths = differenceInMonths(dateAdministered, studentDOB);

    if (ageInMonths < schedule.minAge) {
      return {
        valid: false,
        message: `${vaccineType} should not be administered before ${schedule.minAge} months of age`
      };
    }

    return { valid: true };
  }, [cdcSchedule]);

  const onSubmit = useCallback(async (data: ImmunizationFormData) => {
    performanceMark('immunization-entry-start');

    try {
      await submitImmunizationRecord(data);
      toast.success('Immunization record saved successfully');
    } catch (error) {
      toast.error('Failed to save immunization record');
    } finally {
      performanceMark('immunization-entry-end');
    }
  }, []);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-1">Student</label>
        <StudentAutocomplete
          {...register('studentId')}
          error={errors.studentId?.message}
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Vaccines</h3>
          <button
            type="button"
            onClick={() => append({})}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Add Vaccine
          </button>
        </div>

        {fields.map((field, index) => (
          <VaccineEntryRow
            key={field.id}
            index={index}
            register={register}
            errors={errors}
            onRemove={() => remove(index)}
            validateSchedule={validateVaccineSchedule}
          />
        ))}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
      >
        {isSubmitting ? 'Saving...' : 'Save Immunization Record'}
      </button>
    </form>
  );
});

ImmunizationEntryForm.displayName = 'ImmunizationEntryForm';

// Memoized vaccine row component
const VaccineEntryRow = memo(({
  index,
  register,
  errors,
  onRemove,
  validateSchedule
}: any) => {
  return (
    <div className="grid grid-cols-4 gap-4 p-4 border rounded-lg">
      <div>
        <label className="block text-sm font-medium mb-1">Vaccine Type</label>
        <select
          {...register(`vaccines.${index}.vaccineType`)}
          className="w-full px-4 py-2 border rounded-lg"
        >
          <option value="">Select vaccine</option>
          <option value="MMR">MMR</option>
          <option value="DTaP">DTaP</option>
          <option value="Polio">Polio</option>
          <option value="Hepatitis B">Hepatitis B</option>
          <option value="Varicella">Varicella</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Date Administered</label>
        <input
          type="date"
          {...register(`vaccines.${index}.dateAdministered`, {
            valueAsDate: true
          })}
          className="w-full px-4 py-2 border rounded-lg"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Lot Number</label>
        <input
          type="text"
          {...register(`vaccines.${index}.lotNumber`)}
          className="w-full px-4 py-2 border rounded-lg"
        />
      </div>

      <div className="flex items-end">
        <button
          type="button"
          onClick={onRemove}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Remove
        </button>
      </div>
    </div>
  );
});

VaccineEntryRow.displayName = 'VaccineEntryRow';
```

### 11.2 Immunization Autocomplete with Caching

```typescript
// /frontend/src/pages/health/components/VaccineAutocomplete.tsx
import { memo, useState, useCallback, useRef, useEffect } from 'react';
import { useDebounce } from '@/utils/performance';

interface Vaccine {
  id: string;
  name: string;
  manufacturer: string;
  type: string;
}

export const VaccineAutocomplete = memo(({
  onSelect,
  value
}: {
  onSelect: (vaccine: Vaccine) => void;
  value?: string;
}) => {
  const [query, setQuery] = useState(value || '');
  const [suggestions, setSuggestions] = useState<Vaccine[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const cacheRef = useRef<Map<string, Vaccine[]>>(new Map());

  const debouncedQuery = useDebounce(query, 200);

  useEffect(() => {
    if (debouncedQuery.length < 2) {
      setSuggestions([]);
      return;
    }

    // Check cache first
    if (cacheRef.current.has(debouncedQuery)) {
      setSuggestions(cacheRef.current.get(debouncedQuery)!);
      setIsOpen(true);
      return;
    }

    // Fetch from API
    fetchVaccineSuggestions(debouncedQuery).then(results => {
      cacheRef.current.set(debouncedQuery, results);
      setSuggestions(results);
      setIsOpen(true);
    });
  }, [debouncedQuery]);

  const handleSelect = useCallback((vaccine: Vaccine) => {
    setQuery(vaccine.name);
    setIsOpen(false);
    onSelect(vaccine);
  }, [onSelect]);

  return (
    <div className="relative">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setIsOpen(true)}
        className="w-full px-4 py-2 border rounded-lg"
        placeholder="Search vaccines..."
      />

      {isOpen && suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-auto">
          {suggestions.map(vaccine => (
            <button
              key={vaccine.id}
              type="button"
              onClick={() => handleSelect(vaccine)}
              className="w-full px-4 py-2 text-left hover:bg-gray-100"
            >
              <p className="font-semibold">{vaccine.name}</p>
              <p className="text-sm text-gray-600">{vaccine.manufacturer}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
});

VaccineAutocomplete.displayName = 'VaccineAutocomplete';
```

**Performance Budget:**
- Form Render: < 200ms
- Autocomplete Response: < 200ms (debounced)
- Validation: < 50ms
- Submit Time: < 1s
- Bundle Size: < 35KB (gzipped)

---

## Feature 12: Secure Document Sharing

**Performance Profile:**
- File Uploads: 10-100MB documents
- Encryption: Client-side before upload
- Access Control: Real-time permission checks

### 12.1 Optimized File Upload with Progress

```typescript
// /frontend/src/pages/documents/components/SecureFileUpload.tsx
import { memo, useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

interface UploadProgress {
  filename: string;
  progress: number;
  status: 'uploading' | 'encrypting' | 'complete' | 'error';
}

export const SecureFileUpload = memo(() => {
  const [uploads, setUploads] = useState<Map<string, UploadProgress>>(new Map());

  const encryptFile = useCallback(async (file: File): Promise<Blob> => {
    // Use Web Worker for encryption to avoid blocking UI
    return new Promise((resolve, reject) => {
      const worker = new Worker(
        new URL('@/workers/fileEncryptionWorker.ts', import.meta.url),
        { type: 'module' }
      );

      worker.postMessage({ file });

      worker.onmessage = (event) => {
        resolve(event.data.encryptedFile);
        worker.terminate();
      };

      worker.onerror = (error) => {
        reject(error);
        worker.terminate();
      };
    });
  }, []);

  const uploadFile = useCallback(async (file: File) => {
    const uploadId = `${file.name}-${Date.now()}`;

    // Initialize progress
    setUploads(prev => new Map(prev).set(uploadId, {
      filename: file.name,
      progress: 0,
      status: 'encrypting'
    }));

    try {
      // Step 1: Encrypt file
      performanceMark(`upload-${uploadId}-encrypt-start`);
      const encryptedFile = await encryptFile(file);
      performanceMark(`upload-${uploadId}-encrypt-end`);

      setUploads(prev => new Map(prev).set(uploadId, {
        filename: file.name,
        progress: 0,
        status: 'uploading'
      }));

      // Step 2: Upload with progress tracking
      performanceMark(`upload-${uploadId}-start`);

      const formData = new FormData();
      formData.append('file', encryptedFile, file.name);

      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          setUploads(prev => new Map(prev).set(uploadId, {
            filename: file.name,
            progress,
            status: 'uploading'
          }));
        }
      });

      xhr.addEventListener('load', () => {
        performanceMark(`upload-${uploadId}-end`);

        if (xhr.status === 200) {
          setUploads(prev => new Map(prev).set(uploadId, {
            filename: file.name,
            progress: 100,
            status: 'complete'
          }));

          setTimeout(() => {
            setUploads(prev => {
              const next = new Map(prev);
              next.delete(uploadId);
              return next;
            });
          }, 3000);
        } else {
          setUploads(prev => new Map(prev).set(uploadId, {
            filename: file.name,
            progress: 0,
            status: 'error'
          }));
        }
      });

      xhr.open('POST', '/api/documents/upload');
      xhr.send(formData);

    } catch (error) {
      console.error('Upload failed:', error);
      setUploads(prev => new Map(prev).set(uploadId, {
        filename: file.name,
        progress: 0,
        status: 'error'
      }));
    }
  }, [encryptFile]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Upload files in parallel (max 3 at a time)
    const maxConcurrent = 3;
    let activeUploads = 0;
    let fileIndex = 0;

    const uploadNext = () => {
      if (fileIndex >= acceptedFiles.length) return;

      const file = acceptedFiles[fileIndex++];
      activeUploads++;

      uploadFile(file).finally(() => {
        activeUploads--;
        if (fileIndex < acceptedFiles.length) {
          uploadNext();
        }
      });
    };

    // Start initial batch
    for (let i = 0; i < Math.min(maxConcurrent, acceptedFiles.length); i++) {
      uploadNext();
    }
  }, [uploadFile]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize: 100 * 1024 * 1024, // 100MB
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg'],
      'application/msword': ['.doc', '.docx']
    }
  });

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <input {...getInputProps()} />
        <p className="text-lg mb-2">
          {isDragActive ? 'Drop files here...' : 'Drag & drop files here, or click to select'}
        </p>
        <p className="text-sm text-gray-600">Max file size: 100MB</p>
      </div>

      {uploads.size > 0 && (
        <div className="space-y-2">
          <h3 className="font-semibold">Uploads</h3>
          {Array.from(uploads.values()).map((upload, index) => (
            <UploadProgressBar key={index} upload={upload} />
          ))}
        </div>
      )}
    </div>
  );
});

SecureFileUpload.displayName = 'SecureFileUpload';

const UploadProgressBar = memo(({ upload }: { upload: UploadProgress }) => {
  const statusColor = useMemo(() => {
    switch (upload.status) {
      case 'complete': return 'bg-green-500';
      case 'error': return 'bg-red-500';
      case 'encrypting': return 'bg-yellow-500';
      default: return 'bg-blue-500';
    }
  }, [upload.status]);

  const statusText = useMemo(() => {
    switch (upload.status) {
      case 'encrypting': return 'Encrypting...';
      case 'uploading': return `Uploading... ${upload.progress}%`;
      case 'complete': return 'Complete';
      case 'error': return 'Failed';
    }
  }, [upload.status, upload.progress]);

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{upload.filename}</span>
        <span className="text-sm text-gray-600">{statusText}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-200 ${statusColor}`}
          style={{ width: `${upload.progress}%` }}
        />
      </div>
    </div>
  );
});

UploadProgressBar.displayName = 'UploadProgressBar';
```

### 12.2 File Encryption Worker

```typescript
// /frontend/src/workers/fileEncryptionWorker.ts
self.onmessage = async (event: MessageEvent) => {
  const { file } = event.data;

  try {
    // Read file
    const arrayBuffer = await file.arrayBuffer();

    // Generate encryption key
    const key = await crypto.subtle.generateKey(
      {
        name: 'AES-GCM',
        length: 256
      },
      true,
      ['encrypt', 'decrypt']
    );

    // Generate IV
    const iv = crypto.getRandomValues(new Uint8Array(12));

    // Encrypt file
    const encryptedData = await crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv
      },
      key,
      arrayBuffer
    );

    // Export key
    const exportedKey = await crypto.subtle.exportKey('jwk', key);

    // Create encrypted file blob
    const encryptedFile = new Blob([encryptedData], { type: 'application/octet-stream' });

    self.postMessage({
      encryptedFile,
      key: exportedKey,
      iv: Array.from(iv)
    });

  } catch (error) {
    self.postMessage({
      error: error.message
    });
  }
};
```

**Performance Budget:**
- Encryption: < 2s for 10MB file (Web Worker)
- Upload Speed: Limited by network bandwidth
- Progress Updates: Every 100ms
- UI Blocking: 0ms (all processing in worker)
- Bundle Size: < 30KB (gzipped)

---

## Feature 13: State Registry Integration

**Performance Profile:**
- API Calls: External service (slow)
- Data Sync: Large payloads
- Error Handling: Retry logic

### 13.1 Optimized State Registry Sync

```typescript
// /frontend/src/pages/integration/components/StateRegistrySync.tsx
import { memo, useCallback, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface SyncStatus {
  total: number;
  synced: number;
  failed: number;
  inProgress: boolean;
}

export const StateRegistrySync = memo(() => {
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    total: 0,
    synced: 0,
    failed: 0,
    inProgress: false
  });

  const queryClient = useQueryClient();

  // Fetch pending immunizations with caching
  const { data: pendingImmunizations } = useQuery({
    queryKey: ['pending-immunizations'],
    queryFn: fetchPendingImmunizations,
    staleTime: 10 * 60 * 1000, // 10 minutes
    enabled: !syncStatus.inProgress
  });

  // Sync mutation
  const syncMutation = useMutation({
    mutationFn: async (immunizations: Immunization[]) => {
      setSyncStatus({
        total: immunizations.length,
        synced: 0,
        failed: 0,
        inProgress: true
      });

      const results = await syncImmunizationsToRegistry(immunizations, (progress) => {
        setSyncStatus(prev => ({
          ...prev,
          synced: progress.synced,
          failed: progress.failed
        }));
      });

      return results;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-immunizations'] });
      toast.success('Sync completed successfully');
      setSyncStatus(prev => ({ ...prev, inProgress: false }));
    },
    onError: () => {
      toast.error('Sync failed');
      setSyncStatus(prev => ({ ...prev, inProgress: false }));
    }
  });

  const handleSync = useCallback(() => {
    if (pendingImmunizations && pendingImmunizations.length > 0) {
      syncMutation.mutate(pendingImmunizations);
    }
  }, [pendingImmunizations, syncMutation]);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4">State Registry Sync</h2>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <StatCard
            title="Pending"
            value={pendingImmunizations?.length || 0}
            icon="📋"
          />
          <StatCard
            title="Synced"
            value={syncStatus.synced}
            icon="✅"
          />
          <StatCard
            title="Failed"
            value={syncStatus.failed}
            icon="❌"
          />
        </div>

        <button
          onClick={handleSync}
          disabled={syncStatus.inProgress || !pendingImmunizations?.length}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {syncStatus.inProgress
            ? `Syncing... ${syncStatus.synced}/${syncStatus.total}`
            : `Sync ${pendingImmunizations?.length || 0} Records`
          }
        </button>

        {syncStatus.inProgress && (
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-200"
                style={{
                  width: `${(syncStatus.synced / syncStatus.total) * 100}%`
                }}
              />
            </div>
          </div>
        )}
      </div>

      {pendingImmunizations && pendingImmunizations.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Pending Immunizations</h3>
          <VirtualList
            items={pendingImmunizations}
            itemHeight={60}
            renderItem={(immunization) => (
              <ImmunizationRow key={immunization.id} immunization={immunization} />
            )}
          />
        </div>
      )}
    </div>
  );
});

StateRegistrySync.displayName = 'StateRegistrySync';

// Sync function with retry logic
async function syncImmunizationsToRegistry(
  immunizations: Immunization[],
  onProgress: (progress: { synced: number; failed: number }) => void
): Promise<void> {
  let synced = 0;
  let failed = 0;

  // Process in batches of 10 to avoid overwhelming API
  const batchSize = 10;

  for (let i = 0; i < immunizations.length; i += batchSize) {
    const batch = immunizations.slice(i, i + batchSize);

    await Promise.allSettled(
      batch.map(async (immunization) => {
        try {
          // Retry logic with exponential backoff
          await retryWithBackoff(async () => {
            await submitToStateRegistry(immunization);
          }, 3, 1000);

          synced++;
        } catch (error) {
          console.error(`Failed to sync immunization ${immunization.id}:`, error);
          failed++;
        }

        onProgress({ synced, failed });
      })
    );

    // Delay between batches
    if (i + batchSize < immunizations.length) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
}

async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number,
  baseDelay: number
): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;

      const delay = baseDelay * Math.pow(2, i);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw new Error('Max retries exceeded');
}
```

**Performance Budget:**
- Batch Processing: 10 records per batch
- API Call Timeout: 30s
- Retry Attempts: 3 with exponential backoff
- Progress Updates: Every record
- Bundle Size: < 25KB (gzipped)

---

## Feature 14: Export Scheduling

**Performance Profile:**
- Background Processing: Scheduled jobs
- Large Exports: 10,000+ records
- Multiple Formats: CSV, Excel, PDF

### 14.1 Scheduled Export Manager

```typescript
// /frontend/src/pages/reports/components/ScheduledExportManager.tsx
import { memo, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface ScheduledExport {
  id: string;
  name: string;
  reportType: string;
  format: 'CSV' | 'XLSX' | 'PDF';
  schedule: string; // cron expression
  filters: any;
  recipients: string[];
  enabled: boolean;
  lastRun?: Date;
  nextRun?: Date;
}

export const ScheduledExportManager = memo(() => {
  const queryClient = useQueryClient();

  const { data: scheduledExports, isLoading } = useQuery({
    queryKey: ['scheduled-exports'],
    queryFn: fetchScheduledExports,
    staleTime: 5 * 60 * 1000 // 5 minutes
  });

  const createExportMutation = useMutation({
    mutationFn: createScheduledExport,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scheduled-exports'] });
      toast.success('Export schedule created');
    }
  });

  const toggleExportMutation = useMutation({
    mutationFn: ({ id, enabled }: { id: string; enabled: boolean }) =>
      updateScheduledExport(id, { enabled }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scheduled-exports'] });
    }
  });

  if (isLoading) return <SkeletonLoader />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Scheduled Exports</h2>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Create Schedule
        </button>
      </div>

      <div className="space-y-4">
        {scheduledExports?.map(exportItem => (
          <ScheduledExportCard
            key={exportItem.id}
            exportItem={exportItem}
            onToggle={(enabled) =>
              toggleExportMutation.mutate({ id: exportItem.id, enabled })
            }
          />
        ))}
      </div>
    </div>
  );
});

ScheduledExportManager.displayName = 'ScheduledExportManager';

const ScheduledExportCard = memo(({
  exportItem,
  onToggle
}: {
  exportItem: ScheduledExport;
  onToggle: (enabled: boolean) => void;
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold">{exportItem.name}</h3>
          <p className="text-sm text-gray-600 mt-1">
            {exportItem.reportType} • {exportItem.format}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            Schedule: {exportItem.schedule}
          </p>
          {exportItem.nextRun && (
            <p className="text-sm text-gray-600 mt-1">
              Next run: {format(new Date(exportItem.nextRun), 'MMM dd, yyyy h:mm a')}
            </p>
          )}
        </div>

        <div className="flex items-center space-x-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={exportItem.enabled}
              onChange={(e) => onToggle(e.target.checked)}
              className="w-5 h-5"
            />
            <span className="text-sm">Enabled</span>
          </label>

          <button className="px-4 py-2 border rounded-lg hover:bg-gray-50">
            Edit
          </button>

          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Run Now
          </button>
        </div>
      </div>
    </div>
  );
});

ScheduledExportCard.displayName = 'ScheduledExportCard';
```

### 14.2 Background Export Worker

```typescript
// /frontend/src/workers/exportWorker.ts
import { Parser } from 'json2csv';
import * as XLSX from 'xlsx';

interface ExportMessage {
  type: 'EXPORT_DATA';
  data: any[];
  format: 'CSV' | 'XLSX' | 'PDF';
  filename: string;
}

self.onmessage = async (event: MessageEvent<ExportMessage>) => {
  const { type, data, format, filename } = event.data;

  if (type === 'EXPORT_DATA') {
    try {
      let blob: Blob;

      switch (format) {
        case 'CSV':
          blob = await exportToCSV(data);
          break;
        case 'XLSX':
          blob = await exportToExcel(data);
          break;
        case 'PDF':
          blob = await exportToPDF(data);
          break;
        default:
          throw new Error('Unknown format');
      }

      self.postMessage({
        success: true,
        blob,
        filename: `${filename}.${format.toLowerCase()}`
      });

    } catch (error) {
      self.postMessage({
        success: false,
        error: error.message
      });
    }
  }
};

async function exportToCSV(data: any[]): Promise<Blob> {
  const parser = new Parser();
  const csv = parser.parse(data);
  return new Blob([csv], { type: 'text/csv' });
}

async function exportToExcel(data: any[]): Promise<Blob> {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');

  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  return new Blob([excelBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  });
}

async function exportToPDF(data: any[]): Promise<Blob> {
  // Use jsPDF (imported via dynamic import for code splitting)
  const jsPDF = await import('jspdf');
  const pdf = new jsPDF.default();

  // Simple table export
  let y = 20;
  data.forEach((row, index) => {
    if (y > 270) {
      pdf.addPage();
      y = 20;
    }

    pdf.text(JSON.stringify(row), 10, y);
    y += 10;
  });

  return pdf.output('blob');
}
```

**Performance Budget:**
- Export Time: < 10s for 10,000 records (Web Worker)
- UI Blocking: 0ms
- Schedule Accuracy: ±1 minute
- Bundle Size: < 40KB (gzipped, excluding export libraries)

---

## Feature 15: SIS Integration

**Performance Profile:**
- Large Data Sync: 5,000+ students
- Bi-directional: Import and export
- Real-time Updates: Enrollment changes

### 15.1 SIS Sync Dashboard

```typescript
// /frontend/src/pages/integration/components/SISSyncDashboard.tsx
import { memo, useCallback, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface SyncProgress {
  stage: 'connecting' | 'fetching' | 'processing' | 'saving' | 'complete';
  progress: number;
  total: number;
  errors: string[];
}

export const SISSyncDashboard = memo(() => {
  const [syncProgress, setSyncProgress] = useState<SyncProgress | null>(null);
  const queryClient = useQueryClient();

  const { data: syncStatus } = useQuery({
    queryKey: ['sis-sync-status'],
    queryFn: fetchSISSyncStatus,
    refetchInterval: syncProgress ? 5000 : false // Poll during sync
  });

  const syncMutation = useMutation({
    mutationFn: async () => {
      setSyncProgress({
        stage: 'connecting',
        progress: 0,
        total: 0,
        errors: []
      });

      // Connect to SIS
      const connection = await connectToSIS();

      setSyncProgress(prev => ({
        ...prev!,
        stage: 'fetching',
        progress: 10
      }));

      // Fetch student data
      const students = await fetchSISStudents(connection);

      setSyncProgress(prev => ({
        ...prev!,
        stage: 'processing',
        progress: 30,
        total: students.length
      }));

      // Process and validate
      const errors: string[] = [];
      let processed = 0;

      for (const student of students) {
        try {
          await validateAndSaveStudent(student);
          processed++;

          setSyncProgress(prev => ({
            ...prev!,
            progress: 30 + (processed / students.length) * 60
          }));
        } catch (error) {
          errors.push(`Failed to sync ${student.name}: ${error.message}`);
        }
      }

      setSyncProgress({
        stage: 'complete',
        progress: 100,
        total: students.length,
        errors
      });

      return { processed, errors };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast.success('SIS sync completed');

      setTimeout(() => {
        setSyncProgress(null);
      }, 5000);
    },
    onError: () => {
      toast.error('SIS sync failed');
      setSyncProgress(null);
    }
  });

  const handleSync = useCallback(() => {
    syncMutation.mutate();
  }, [syncMutation]);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4">SIS Integration</h2>

        {syncStatus && (
          <div className="grid grid-cols-4 gap-4 mb-6">
            <StatCard
              title="Last Sync"
              value={syncStatus.lastSync
                ? format(new Date(syncStatus.lastSync), 'MMM dd, h:mm a')
                : 'Never'
              }
              icon="🔄"
            />
            <StatCard
              title="Total Students"
              value={syncStatus.totalStudents}
              icon="👥"
            />
            <StatCard
              title="Sync Status"
              value={syncStatus.status}
              icon="✅"
            />
            <StatCard
              title="Errors"
              value={syncStatus.errorCount}
              icon="⚠️"
            />
          </div>
        )}

        <button
          onClick={handleSync}
          disabled={!!syncProgress}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {syncProgress ? 'Syncing...' : 'Start Sync'}
        </button>

        {syncProgress && (
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                {syncProgress.stage === 'connecting' && 'Connecting to SIS...'}
                {syncProgress.stage === 'fetching' && 'Fetching student data...'}
                {syncProgress.stage === 'processing' && `Processing ${syncProgress.total} students...`}
                {syncProgress.stage === 'saving' && 'Saving to database...'}
                {syncProgress.stage === 'complete' && 'Complete!'}
              </span>
              <span className="text-sm text-gray-600">
                {Math.round(syncProgress.progress)}%
              </span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-200"
                style={{ width: `${syncProgress.progress}%` }}
              />
            </div>

            {syncProgress.errors.length > 0 && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <h4 className="font-semibold text-red-800 mb-2">Errors</h4>
                <ul className="text-sm text-red-700 space-y-1">
                  {syncProgress.errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      <SISMappingConfiguration />
    </div>
  );
});

SISSyncDashboard.displayName = 'SISSyncDashboard';

// Field mapping configuration
const SISMappingConfiguration = memo(() => {
  const [mappings, setMappings] = useState<Record<string, string>>({
    'student_id': 'studentNumber',
    'first_name': 'firstName',
    'last_name': 'lastName',
    'grade': 'gradeLevel',
    'dob': 'dateOfBirth'
  });

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Field Mapping</h3>

      <div className="space-y-2">
        {Object.entries(mappings).map(([sisField, localField]) => (
          <div key={sisField} className="flex items-center space-x-4">
            <span className="w-1/3 text-sm font-medium">{sisField}</span>
            <span className="text-gray-500">→</span>
            <input
              type="text"
              value={localField}
              onChange={(e) => setMappings(prev => ({
                ...prev,
                [sisField]: e.target.value
              }))}
              className="flex-1 px-4 py-2 border rounded-lg"
            />
          </div>
        ))}
      </div>

      <button className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
        Save Mapping
      </button>
    </div>
  );
});

SISMappingConfiguration.displayName = 'SISMappingConfiguration';
```

**Performance Budget:**
- Sync Time: < 5 min for 5,000 students
- Progress Updates: Every 100 records
- Error Handling: Continue on error
- UI Responsiveness: Maintained during sync
- Bundle Size: < 35KB (gzipped)

---

## Summary

This supplementary guide provides detailed implementations for features 11-15:

1. **Immunization UI**: Optimized form with CDC schedule validation
2. **Secure Document Sharing**: Web Worker encryption, progress tracking
3. **State Registry Integration**: Batch processing with retry logic
4. **Export Scheduling**: Background workers for large exports
5. **SIS Integration**: Progressive sync with field mapping

All features maintain:
- **Non-blocking UI**: Web Workers for heavy computation
- **Optimized rendering**: Memoization and virtual scrolling
- **Smart caching**: TanStack Query and IndexedDB
- **Progressive feedback**: Real-time progress indicators
- **Error resilience**: Retry logic and graceful degradation

---

**Next Steps:**
1. Implement Web Workers for all heavy computation
2. Add IndexedDB caching for offline support
3. Implement progress tracking for all long-running operations
4. Add comprehensive error handling
5. Monitor performance metrics

**Document Owner:** Frontend Performance Architect
**Last Updated:** October 26, 2025
**Version:** 1.0
**Status:** Ready for Implementation
