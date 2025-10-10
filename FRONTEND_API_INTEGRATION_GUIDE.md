# Frontend API Integration Guide

Quick reference for integrating the new backend API endpoints into the frontend application.

## New Endpoints Overview

| Endpoint | Method | Purpose | Authentication |
|----------|--------|---------|----------------|
| `/api/health-records/statistics` | GET | Health records dashboard stats | Required |
| `/api/medications/stats` | GET | Medication dashboard stats | Required |
| `/api/medications/alerts` | GET | Medication alerts & warnings | Required |
| `/api/medications/form-options` | GET | Form dropdown options | Required |
| `/api/inventory/alerts` | GET | Inventory alerts & warnings | Required |
| `/api/documents/categories` | GET | Document category options | Required |

---

## 1. Health Records Statistics

### Endpoint
```typescript
GET /api/health-records/statistics
```

### Usage Example
```typescript
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/services/api';

interface HealthRecordStats {
  totalRecords: number;
  activeAllergies: number;
  chronicConditions: number;
  vaccinationsDue: number;
  recentRecords: number;
}

export const useHealthRecordStats = () => {
  return useQuery<HealthRecordStats>({
    queryKey: ['health-records', 'statistics'],
    queryFn: async () => {
      const { data } = await apiClient.get('/api/health-records/statistics');
      return data.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
```

### Component Example
```tsx
const HealthRecordsDashboard = () => {
  const { data: stats, isLoading } = useHealthRecordStats();

  if (isLoading) return <Spinner />;

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      <StatCard title="Total Records" value={stats?.totalRecords} />
      <StatCard title="Active Allergies" value={stats?.activeAllergies} variant="warning" />
      <StatCard title="Chronic Conditions" value={stats?.chronicConditions} />
      <StatCard title="Vaccinations Due" value={stats?.vaccinationsDue} variant="info" />
      <StatCard title="Recent Records" value={stats?.recentRecords} />
    </div>
  );
};
```

---

## 2. Medication Statistics

### Endpoint
```typescript
GET /api/medications/stats
```

### Usage Example
```typescript
interface MedicationStats {
  totalMedications: number;
  activePrescriptions: number;
  administeredToday: number;
  adverseReactions: number;
  lowStockCount: number;
  expiringCount: number;
}

export const useMedicationStats = () => {
  return useQuery<MedicationStats>({
    queryKey: ['medications', 'stats'],
    queryFn: async () => {
      const { data } = await apiClient.get('/api/medications/stats');
      return data.data;
    },
    refetchInterval: 60 * 1000, // Refresh every minute
  });
};
```

### Component Example
```tsx
const MedicationDashboard = () => {
  const { data: stats } = useMedicationStats();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <MetricCard
          label="Total Medications"
          value={stats?.totalMedications}
          icon={<PillIcon />}
        />
        <MetricCard
          label="Active Prescriptions"
          value={stats?.activePrescriptions}
          icon={<ClipboardIcon />}
        />
        <MetricCard
          label="Administered Today"
          value={stats?.administeredToday}
          icon={<CheckIcon />}
        />
      </div>

      {(stats?.lowStockCount > 0 || stats?.expiringCount > 0) && (
        <AlertBanner>
          <AlertItem count={stats.lowStockCount} type="low-stock" />
          <AlertItem count={stats.expiringCount} type="expiring" />
        </AlertBanner>
      )}
    </div>
  );
};
```

---

## 3. Medication Alerts

### Endpoint
```typescript
GET /api/medications/alerts
```

### Response Structure
```typescript
interface MedicationAlert {
  id: string;
  type: 'LOW_STOCK' | 'EXPIRING' | 'MISSED_DOSE';
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  message: string;
  medicationId?: string;
  medicationName?: string;
  currentQuantity?: number;
  reorderLevel?: number;
  expirationDate?: string;
  daysUntilExpiry?: number;
  studentName?: string;
  dosage?: string;
  scheduledTime?: string;
}

interface MedicationAlerts {
  lowStock: MedicationAlert[];
  expiring: MedicationAlert[];
  missedDoses: MedicationAlert[];
}
```

### Usage Example
```typescript
export const useMedicationAlerts = () => {
  return useQuery<MedicationAlerts>({
    queryKey: ['medications', 'alerts'],
    queryFn: async () => {
      const { data } = await apiClient.get('/api/medications/alerts');
      return data.data;
    },
    refetchInterval: 2 * 60 * 1000, // Refresh every 2 minutes
  });
};
```

### Component Example
```tsx
const MedicationAlerts = () => {
  const { data: alerts } = useMedicationAlerts();

  const allAlerts = [
    ...(alerts?.lowStock || []),
    ...(alerts?.expiring || []),
    ...(alerts?.missedDoses || [])
  ];

  return (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold">Medication Alerts</h3>
      {allAlerts.map((alert) => (
        <Alert
          key={alert.id}
          severity={alert.severity}
          icon={getAlertIcon(alert.type)}
          className={getSeverityClass(alert.severity)}
        >
          <AlertTitle>{alert.type.replace('_', ' ')}</AlertTitle>
          <AlertDescription>{alert.message}</AlertDescription>
        </Alert>
      ))}
    </div>
  );
};

const getSeverityClass = (severity: string) => {
  const classes = {
    CRITICAL: 'bg-red-50 border-red-500',
    HIGH: 'bg-orange-50 border-orange-500',
    MEDIUM: 'bg-yellow-50 border-yellow-500',
    LOW: 'bg-blue-50 border-blue-500',
  };
  return classes[severity as keyof typeof classes];
};
```

---

## 4. Medication Form Options

### Endpoint
```typescript
GET /api/medications/form-options
```

### Response Structure
```typescript
interface MedicationFormOptions {
  dosageForms: string[];
  categories: string[];
  strengthUnits: string[];
  routes: string[];
  frequencies: string[];
}
```

### Usage Example
```typescript
export const useMedicationFormOptions = () => {
  return useQuery<MedicationFormOptions>({
    queryKey: ['medications', 'form-options'],
    queryFn: async () => {
      const { data } = await apiClient.get('/api/medications/form-options');
      return data.data;
    },
    staleTime: 30 * 60 * 1000, // 30 minutes (static data)
  });
};
```

### Form Component Example
```tsx
import { useForm } from 'react-hook-form';

const MedicationForm = () => {
  const { data: options, isLoading } = useMedicationFormOptions();
  const { register, handleSubmit } = useForm();

  if (isLoading) return <Spinner />;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-2 gap-4">
        <Select label="Dosage Form" {...register('dosageForm')} required>
          <option value="">Select form...</option>
          {options?.dosageForms.map((form) => (
            <option key={form} value={form}>{form}</option>
          ))}
        </Select>

        <Select label="Category" {...register('category')}>
          <option value="">Select category...</option>
          {options?.categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </Select>

        <Select label="Route" {...register('route')} required>
          <option value="">Select route...</option>
          {options?.routes.map((route) => (
            <option key={route} value={route}>{route}</option>
          ))}
        </Select>

        <Select label="Frequency" {...register('frequency')} required>
          <option value="">Select frequency...</option>
          {options?.frequencies.map((freq) => (
            <option key={freq} value={freq}>{freq}</option>
          ))}
        </Select>

        <div className="flex items-end space-x-2">
          <Input label="Strength" {...register('strengthValue')} type="number" />
          <Select {...register('strengthUnit')} className="w-24">
            {options?.strengthUnits.map((unit) => (
              <option key={unit} value={unit}>{unit}</option>
            ))}
          </Select>
        </div>
      </div>

      <Button type="submit">Add Medication</Button>
    </form>
  );
};
```

---

## 5. Inventory Alerts

### Endpoint
```typescript
GET /api/inventory/alerts
```

### Response Structure
```typescript
interface InventoryAlert {
  id: string;
  type: 'LOW_STOCK' | 'OUT_OF_STOCK' | 'EXPIRED' | 'NEAR_EXPIRY' | 'MAINTENANCE_DUE';
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  message: string;
  itemId: string;
  itemName: string;
  daysUntilAction?: number;
}
```

### Usage Example
```typescript
export const useInventoryAlerts = () => {
  return useQuery<{ alerts: InventoryAlert[] }>({
    queryKey: ['inventory', 'alerts'],
    queryFn: async () => {
      const { data } = await apiClient.get('/api/inventory/alerts');
      return data.data;
    },
    refetchInterval: 5 * 60 * 1000, // Refresh every 5 minutes
  });
};
```

### Component Example
```tsx
const InventoryAlertPanel = () => {
  const { data } = useInventoryAlerts();

  const criticalAlerts = data?.alerts.filter(a => a.severity === 'CRITICAL') || [];
  const highAlerts = data?.alerts.filter(a => a.severity === 'HIGH') || [];

  return (
    <Card>
      <CardHeader>
        <h3 className="flex items-center gap-2">
          <AlertTriangleIcon className="h-5 w-5 text-orange-500" />
          Inventory Alerts
          {criticalAlerts.length > 0 && (
            <Badge variant="destructive">{criticalAlerts.length} Critical</Badge>
          )}
        </h3>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {criticalAlerts.map((alert) => (
            <AlertItem key={alert.id} alert={alert} />
          ))}
          {highAlerts.map((alert) => (
            <AlertItem key={alert.id} alert={alert} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
```

---

## 6. Document Categories

### Endpoint
```typescript
GET /api/documents/categories
```

### Response Structure
```typescript
interface DocumentCategory {
  value: string;
  label: string;
  description: string;
  requiresSignature: boolean;
  retentionYears: number;
  documentCount: number;
}
```

### Usage Example
```typescript
export const useDocumentCategories = () => {
  return useQuery<{ categories: DocumentCategory[] }>({
    queryKey: ['documents', 'categories'],
    queryFn: async () => {
      const { data } = await apiClient.get('/api/documents/categories');
      return data.data;
    },
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
};
```

### Form Component Example
```tsx
const DocumentUploadForm = () => {
  const { data } = useDocumentCategories();
  const [selectedCategory, setSelectedCategory] = useState<DocumentCategory | null>(null);

  return (
    <form>
      <Select
        label="Document Category"
        onChange={(e) => {
          const category = data?.categories.find(c => c.value === e.target.value);
          setSelectedCategory(category || null);
        }}
      >
        <option value="">Select category...</option>
        {data?.categories.map((category) => (
          <option key={category.value} value={category.value}>
            {category.label} ({category.documentCount})
          </option>
        ))}
      </Select>

      {selectedCategory && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded">
          <p className="text-sm text-gray-700">{selectedCategory.description}</p>
          <div className="mt-2 flex gap-4 text-xs text-gray-600">
            <span>
              {selectedCategory.requiresSignature ? '✓ Requires signature' : '○ No signature needed'}
            </span>
            <span>Retention: {selectedCategory.retentionYears} years</span>
          </div>
        </div>
      )}

      {selectedCategory?.requiresSignature && (
        <div className="mt-4">
          <SignaturePad />
        </div>
      )}
    </form>
  );
};
```

---

## Error Handling Pattern

### Global Error Handler
```typescript
import { AxiosError } from 'axios';

export const handleApiError = (error: unknown) => {
  if (error instanceof AxiosError) {
    const message = error.response?.data?.error?.message || 'An error occurred';
    const status = error.response?.status;

    switch (status) {
      case 401:
        // Redirect to login
        window.location.href = '/login';
        break;
      case 403:
        toast.error('You do not have permission to perform this action');
        break;
      case 404:
        toast.error('Resource not found');
        break;
      case 500:
        toast.error('Server error. Please try again later');
        break;
      default:
        toast.error(message);
    }
  } else {
    toast.error('An unexpected error occurred');
  }
};
```

### Query Error Handling
```typescript
export const useMedicationStats = () => {
  return useQuery<MedicationStats>({
    queryKey: ['medications', 'stats'],
    queryFn: async () => {
      const { data } = await apiClient.get('/api/medications/stats');
      return data.data;
    },
    onError: (error) => {
      handleApiError(error);
    },
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};
```

---

## Best Practices

### 1. Query Key Management
```typescript
// Define query keys in a central location
export const queryKeys = {
  healthRecords: {
    all: ['health-records'] as const,
    statistics: () => [...queryKeys.healthRecords.all, 'statistics'] as const,
  },
  medications: {
    all: ['medications'] as const,
    stats: () => [...queryKeys.medications.all, 'stats'] as const,
    alerts: () => [...queryKeys.medications.all, 'alerts'] as const,
    formOptions: () => [...queryKeys.medications.all, 'form-options'] as const,
  },
  // ... more keys
};
```

### 2. Type Safety
```typescript
// Create type-safe API client
import axios from 'axios';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token interceptor
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### 3. Caching Strategy
```typescript
// Configure default cache times
const CACHE_TIMES = {
  SHORT: 1 * 60 * 1000,      // 1 minute - for frequently changing data
  MEDIUM: 5 * 60 * 1000,     // 5 minutes - for stats and alerts
  LONG: 30 * 60 * 1000,      // 30 minutes - for static data like form options
};

// Use in queries
useQuery({
  queryKey: ['medications', 'form-options'],
  queryFn: fetchFormOptions,
  staleTime: CACHE_TIMES.LONG,
  cacheTime: CACHE_TIMES.LONG * 2,
});
```

### 4. Loading States
```typescript
const Dashboard = () => {
  const statsQuery = useHealthRecordStats();
  const alertsQuery = useMedicationAlerts();

  const isLoading = statsQuery.isLoading || alertsQuery.isLoading;
  const isError = statsQuery.isError || alertsQuery.isError;

  if (isLoading) return <DashboardSkeleton />;
  if (isError) return <ErrorFallback onRetry={() => {
    statsQuery.refetch();
    alertsQuery.refetch();
  }} />;

  return <DashboardContent stats={statsQuery.data} alerts={alertsQuery.data} />;
};
```

---

## Testing Examples

### Unit Test (Vitest)
```typescript
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useMedicationStats } from './useMedicationStats';

describe('useMedicationStats', () => {
  it('should fetch medication statistics', async () => {
    const queryClient = new QueryClient();
    const wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useMedicationStats(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual({
      totalMedications: expect.any(Number),
      activePrescriptions: expect.any(Number),
      administeredToday: expect.any(Number),
    });
  });
});
```

### E2E Test (Cypress)
```typescript
describe('Medication Dashboard', () => {
  beforeEach(() => {
    cy.login();
    cy.intercept('GET', '/api/medications/stats', {
      fixture: 'medication-stats.json'
    }).as('getStats');
  });

  it('displays medication statistics', () => {
    cy.visit('/medications/dashboard');
    cy.wait('@getStats');

    cy.contains('Total Medications').parent().should('contain', '150');
    cy.contains('Active Prescriptions').parent().should('contain', '89');
  });

  it('shows alerts when there are low stock items', () => {
    cy.intercept('GET', '/api/medications/alerts', {
      fixture: 'medication-alerts.json'
    }).as('getAlerts');

    cy.visit('/medications/dashboard');
    cy.wait('@getAlerts');

    cy.get('[data-testid="alert-panel"]').should('be.visible');
    cy.contains('Ibuprofen 200mg is low in stock');
  });
});
```

---

## Related Documentation
- [Backend API Endpoints Summary](./BACKEND_API_ENDPOINTS_SUMMARY.md)
- [API Authentication Guide](./docs/api/authentication.md)
- [HIPAA Compliance Documentation](./docs/compliance/hipaa.md)
