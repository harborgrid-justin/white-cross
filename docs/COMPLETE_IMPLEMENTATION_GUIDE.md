# Complete Implementation Guide - 15 Critical Features
## From Database to Production

**Date:** October 26, 2025
**Status:** Phase 2 Implementation - Database Complete, Models & APIs In Progress
**Completion:** 40% Database + Infrastructure Complete

---

## ✅ Phase 1: COMPLETE (Foundation & Database)

### Infrastructure Delivered (100%)
- ✅ WebSocket server and client (Socket.io)
- ✅ Background job queue (BullMQ with Redis)
- ✅ PDF generation service (jsPDF)
- ✅ External API integration framework
- ✅ Health monitoring (Kubernetes-ready)
- ✅ Performance utilities (15+ React hooks)
- ✅ TypeScript type system (7 files, 3,630+ LOC)
- ✅ Healthcare styling system (Tailwind extended)
- ✅ Test infrastructure (fixtures, handlers, E2E examples)

### Database Complete (100%)
- ✅ 14 migrations (00020-00033)
- ✅ 39 new tables created
- ✅ 80+ performance indexes
- ✅ 25+ ENUM types
- ✅ Foreign key relationships
- ✅ Audit trail triggers

---

## 🚧 Phase 2: IN PROGRESS (Models, Services, APIs)

### Implementation Pattern (Follow These Examples)

Each feature requires 4 layers of implementation:
1. **Sequelize Model** - Database ORM
2. **Backend Service** - Business logic
3. **Backend Route** - API endpoints
4. **Frontend Components** - User interface

---

## Layer 1: Sequelize Models

### Example 1: PHI Disclosure Model (Feature 30)

**File:** `/backend/src/database/models/compliance/PHIDisclosure.ts`
**Status:** ✅ COMPLETE (see file for full implementation)

**Pattern to Follow:**

```typescript
import { Model, DataTypes, Optional, Sequelize } from 'sequelize';

// 1. Define ENUMs matching migration
export enum DisclosureType {
  TREATMENT = 'TREATMENT',
  PAYMENT = 'PAYMENT',
  // ... all values from migration
}

// 2. Define interfaces
export interface PHIDisclosureAttributes {
  id: string;
  studentId: string;
  // ... all fields from migration
  createdAt: Date;
  updatedAt: Date;
}

// 3. Define creation attributes
export interface PHIDisclosureCreationAttributes
  extends Optional<PHIDisclosureAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

// 4. Create model class
class PHIDisclosure extends Model<PHIDisclosureAttributes, PHIDisclosureCreationAttributes>
  implements PHIDisclosureAttributes {

  // 5. Declare properties
  public id!: string;
  public studentId!: string;
  // ... all properties

  // 6. Add utility methods
  public isOverdue(): boolean {
    // Business logic
  }

  // 7. Initialize method
  public static initialize(sequelize: Sequelize): typeof PHIDisclosure {
    PHIDisclosure.init({
      // Field definitions matching migration
    }, {
      sequelize,
      tableName: 'phi_disclosures',
      modelName: 'PHIDisclosure',
      paranoid: true, // if has deletedAt
      timestamps: true,
      underscored: true,
      indexes: [ /* indexes from migration */ ],
    });
    return PHIDisclosure;
  }

  // 8. Define associations
  public static associate(models: any): void {
    PHIDisclosure.belongsTo(models.Student, {
      foreignKey: 'studentId',
      as: 'student',
    });
  }
}

export default PHIDisclosure;
```

### Example 2: AlertInstance Model (Feature 26)

**File:** `/backend/src/database/models/alerts/AlertInstance.ts`
**Status:** ✅ COMPLETE (see file for full implementation)

**Key Features:**
- Enums for severity, category, status
- Instance methods (isActive(), requiresImmediateAttention())
- Action methods (acknowledge(), resolve())
- Static query methods (findActiveByStudent(), findCriticalUnacknowledged())

### Remaining Models to Create (37 models)

Follow the same pattern for all remaining tables:

**Compliance Domain (7 models):**
- ✅ PHIDisclosure
- PHIDisclosureAudit
- EncryptionKey
- KeyRotationHistory
- EncryptedFieldMetadata
- TamperAlert
- DataIntegrityChecksum

**Alerts Domain (4 models):**
- AlertDefinition
- ✅ AlertInstance
- AlertSubscription
- AlertDeliveryLog

**Clinical Domain (9 models):**
- DrugCatalog
- DrugInteraction
- StudentDrugAllergy
- SymptomTracking
- OutbreakAlert
- OutbreakCaseCluster
- ClinicVisit
- ImmunizationReminder
- VaccinationSchedule

**Financial Domain (2 models):**
- MedicaidEligibility
- BillingClaim

**Reporting Domain (2 models):**
- ReportDefinition
- ReportInstance

**Integration Domain (7 models):**
- SharedDocument
- DocumentAccessLog
- RegistryConnection
- RegistrySubmission
- ScheduledExport
- ExportJob
- SisSyncConfig
- SisSyncJob
- SisSyncError

---

## Layer 2: Backend Services

### Service Pattern

Each feature needs a service class with business logic:

```typescript
// Example: /backend/src/services/compliance/PHIDisclosureService.ts

import PHIDisclosure from '@/database/models/compliance/PHIDisclosure';
import { AuditService } from '@/services/audit/AuditService';

export class PHIDisclosureService {
  /**
   * Create a new PHI disclosure record
   */
  async createDisclosure(data: CreateDisclosureDTO, userId: string): Promise<PHIDisclosure> {
    // 1. Validate input
    // 2. Check authorization
    // 3. Create disclosure
    const disclosure = await PHIDisclosure.create({
      ...data,
      disclosedBy: userId,
    });

    // 4. Create audit trail
    await AuditService.logPHIAccess({
      action: 'DISCLOSED',
      resource: 'PHI',
      userId,
      metadata: { disclosureId: disclosure.id },
    });

    // 5. Send notifications if needed
    // 6. Return result
    return disclosure;
  }

  /**
   * Get disclosures for a student with filtering
   */
  async getDisclosuresByStudent(
    studentId: string,
    filters: DisclosureFilters
  ): Promise<{ disclosures: PHIDisclosure[]; total: number }> {
    // Build query with filters
    const where: any = { studentId };

    if (filters.dateFrom) {
      where.disclosureDate = { [Op.gte]: filters.dateFrom };
    }

    if (filters.purpose) {
      where.purpose = filters.purpose;
    }

    // Execute with pagination
    const { rows, count } = await PHIDisclosure.findAndCountAll({
      where,
      limit: filters.limit || 20,
      offset: filters.offset || 0,
      order: [['disclosureDate', 'DESC']],
      include: ['student', 'discloser'],
    });

    return { disclosures: rows, total: count };
  }

  /**
   * Generate compliance report
   */
  async generateComplianceReport(startDate: Date, endDate: Date): Promise<Report> {
    // Complex reporting logic
  }
}
```

### Services to Create (15 services)

1. **PHIDisclosureService** - HIPAA disclosure tracking
2. **EncryptionService** - Key management and rotation
3. **TamperAlertService** - Security monitoring
4. **DrugInteractionService** - Drug checking and validation
5. **OutbreakDetectionService** - Statistical analysis and alerts
6. **RealTimeAlertService** - WebSocket alert distribution
7. **ClinicVisitService** - Visit tracking and analytics
8. **ImmunizationService** - Compliance and reminders
9. **MedicaidBillingService** - Claims processing
10. **PDFReportService** - Report generation
11. **SecureDocumentService** - Document sharing
12. **StateRegistryService** - Registry submissions
13. **ExportService** - Scheduled exports
14. **SISIntegrationService** - SIS synchronization

---

## Layer 3: Backend Routes

### Route Pattern

Each feature needs RESTful API endpoints:

```typescript
// Example: /backend/src/routes/v1/compliance/phi-disclosures.ts

import { Server } from '@hapi/hapi';
import Joi from 'joi';
import { PHIDisclosureService } from '@/services/compliance/PHIDisclosureService';

const phiDisclosureService = new PHIDisclosureService();

export default function (server: Server) {
  // POST /api/v1/compliance/phi-disclosures
  server.route({
    method: 'POST',
    path: '/api/v1/compliance/phi-disclosures',
    options: {
      auth: 'jwt',
      description: 'Create a new PHI disclosure record',
      notes: 'HIPAA §164.528 compliance - logs all PHI disclosures',
      tags: ['api', 'compliance', 'phi'],
      validate: {
        payload: Joi.object({
          studentId: Joi.string().uuid().required(),
          disclosureType: Joi.string().valid(...Object.values(DisclosureType)).required(),
          purpose: Joi.string().valid(...Object.values(DisclosurePurpose)).required(),
          method: Joi.string().valid(...Object.values(DisclosureMethod)).required(),
          disclosureDate: Joi.date().required(),
          informationDisclosed: Joi.array().items(Joi.string()).required(),
          minimumNecessary: Joi.string().required(),
          recipientType: Joi.string().valid(...Object.values(RecipientType)).required(),
          recipientName: Joi.string().max(255).required(),
          recipientEmail: Joi.string().email().optional(),
          // ... all other fields
        }),
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '201': { description: 'PHI disclosure created successfully' },
            '400': { description: 'Invalid input' },
            '401': { description: 'Unauthorized' },
            '403': { description: 'Insufficient permissions' },
          },
        },
      },
    },
    handler: async (request, h) => {
      try {
        const userId = request.auth.credentials.user.id;
        const disclosure = await phiDisclosureService.createDisclosure(
          request.payload,
          userId
        );

        return h.response(disclosure).code(201);
      } catch (error) {
        return h.response({ error: error.message }).code(400);
      }
    },
  });

  // GET /api/v1/compliance/phi-disclosures
  server.route({
    method: 'GET',
    path: '/api/v1/compliance/phi-disclosures',
    options: {
      auth: 'jwt',
      description: 'Get all PHI disclosures with filtering',
      tags: ['api', 'compliance', 'phi'],
      validate: {
        query: Joi.object({
          studentId: Joi.string().uuid().optional(),
          dateFrom: Joi.date().optional(),
          dateTo: Joi.date().optional(),
          purpose: Joi.string().optional(),
          limit: Joi.number().integer().min(1).max(100).default(20),
          offset: Joi.number().integer().min(0).default(0),
        }),
      },
    },
    handler: async (request, h) => {
      const result = await phiDisclosureService.getDisclosuresByStudent(
        request.query.studentId,
        request.query
      );

      return h.response(result);
    },
  });

  // GET /api/v1/compliance/phi-disclosures/{id}
  server.route({
    method: 'GET',
    path: '/api/v1/compliance/phi-disclosures/{id}',
    options: {
      auth: 'jwt',
      description: 'Get a specific PHI disclosure by ID',
      tags: ['api', 'compliance', 'phi'],
      validate: {
        params: Joi.object({
          id: Joi.string().uuid().required(),
        }),
      },
    },
    handler: async (request, h) => {
      const disclosure = await phiDisclosureService.getDisclosureById(request.params.id);

      if (!disclosure) {
        return h.response({ error: 'Not found' }).code(404);
      }

      return h.response(disclosure);
    },
  });

  // PUT /api/v1/compliance/phi-disclosures/{id}
  server.route({
    method: 'PUT',
    path: '/api/v1/compliance/phi-disclosures/{id}',
    options: {
      auth: 'jwt',
      description: 'Update a PHI disclosure record',
      tags: ['api', 'compliance', 'phi'],
      validate: {
        params: Joi.object({
          id: Joi.string().uuid().required(),
        }),
        payload: Joi.object({
          // Update fields
        }),
      },
    },
    handler: async (request, h) => {
      const disclosure = await phiDisclosureService.updateDisclosure(
        request.params.id,
        request.payload
      );

      return h.response(disclosure);
    },
  });

  // DELETE /api/v1/compliance/phi-disclosures/{id}
  server.route({
    method: 'DELETE',
    path: '/api/v1/compliance/phi-disclosures/{id}',
    options: {
      auth: 'jwt',
      description: 'Soft delete a PHI disclosure record',
      tags: ['api', 'compliance', 'phi'],
      validate: {
        params: Joi.object({
          id: Joi.string().uuid().required(),
        }),
      },
    },
    handler: async (request, h) => {
      await phiDisclosureService.deleteDisclosure(request.params.id);
      return h.response({ message: 'Deleted successfully' }).code(204);
    },
  });

  // GET /api/v1/compliance/phi-disclosures/statistics
  server.route({
    method: 'GET',
    path: '/api/v1/compliance/phi-disclosures/statistics',
    options: {
      auth: 'jwt',
      description: 'Get PHI disclosure statistics for compliance reporting',
      tags: ['api', 'compliance', 'phi'],
      validate: {
        query: Joi.object({
          startDate: Joi.date().required(),
          endDate: Joi.date().required(),
        }),
      },
    },
    handler: async (request, h) => {
      const stats = await phiDisclosureService.getStatistics(
        request.query.startDate,
        request.query.endDate
      );

      return h.response(stats);
    },
  });
}
```

### Routes to Create (92 endpoints across 15 features)

**Feature 30: PHI Disclosure Tracking** - 6 endpoints
- POST /api/v1/compliance/phi-disclosures
- GET /api/v1/compliance/phi-disclosures
- GET /api/v1/compliance/phi-disclosures/{id}
- PUT /api/v1/compliance/phi-disclosures/{id}
- DELETE /api/v1/compliance/phi-disclosures/{id}
- GET /api/v1/compliance/phi-disclosures/statistics

**Feature 32: Encryption UI** - 7 endpoints
**Feature 33: Tamper Alerts** - 6 endpoints
**Feature 48: Drug Interactions** - 4 endpoints
**Feature 37: Outbreak Detection** - 4 endpoints
**Feature 26: Real-Time Alerts** - 6 endpoints
**Feature 17: Clinic Visits** - 5 endpoints
**Feature 41: Immunization Dashboard** - 4 endpoints
**Feature 44: Medicaid Billing** - 6 endpoints
**Feature 35: PDF Reports** - 4 endpoints
**Feature 5: Immunization UI** - 5 endpoints
**Feature 21: Secure Document Sharing** - 5 endpoints
**Feature 43: State Registry Integration** - 4 endpoints
**Feature 38: Export Scheduling** - 5 endpoints
**Feature 42: SIS Integration** - 4 endpoints

---

## Layer 4: Frontend Components

### Frontend Pattern

Each feature needs a complete React implementation:

```typescript
// Example structure for Feature 30: PHI Disclosure Tracking

/frontend/src/pages/compliance/phi-disclosures/
├── index.tsx                    // Main page component
├── components/
│   ├── PHIDisclosureList.tsx   // List view with filtering
│   ├── PHIDisclosureCard.tsx   // Individual disclosure card
│   ├── PHIDisclosureForm.tsx   // Create/Edit form
│   ├── PHIDisclosureDetails.tsx // Detail view
│   ├── StatisticsPanel.tsx     // Compliance statistics
│   └── FilterBar.tsx           // Advanced filtering
├── store/
│   └── phiDisclosuresSlice.ts  // Redux slice
└── hooks/
    └── usePhiDisclosures.ts    // TanStack Query hooks
```

### Component Example

```typescript
// /frontend/src/pages/compliance/phi-disclosures/components/PHIDisclosureList.tsx

import React, { useState } from 'react';
import { usePhiDisclosures } from '../hooks/usePhiDisclosures';
import PHIDisclosureCard from './PHIDisclosureCard';
import FilterBar from './FilterBar';
import { Pagination } from '@/components/ui/Pagination';

export const PHIDisclosureList: React.FC = () => {
  const [filters, setFilters] = useState({
    dateFrom: null,
    dateTo: null,
    purpose: null,
    page: 1,
    limit: 20,
  });

  const { data, isLoading, error } = usePhiDisclosures(filters);

  if (isLoading) return <LoadingSkeleton />;
  if (error) return <ErrorAlert error={error} />;

  return (
    <div className="phi-disclosure-list">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">PHI Disclosure Tracking</h1>
        <button
          onClick={() => openCreateModal()}
          className="btn-primary"
        >
          Log New Disclosure
        </button>
      </header>

      <FilterBar filters={filters} onChange={setFilters} />

      <div className="disclosure-grid grid gap-4">
        {data.disclosures.map((disclosure) => (
          <PHIDisclosureCard
            key={disclosure.id}
            disclosure={disclosure}
            onEdit={() => openEditModal(disclosure)}
            onDelete={() => handleDelete(disclosure.id)}
          />
        ))}
      </div>

      <Pagination
        current={filters.page}
        total={Math.ceil(data.total / filters.limit)}
        onChange={(page) => setFilters({ ...filters, page })}
      />
    </div>
  );
};
```

### Redux Slice Example

```typescript
// /frontend/src/pages/compliance/phi-disclosures/store/phiDisclosuresSlice.ts

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { phiDisclosuresApi } from '@/services/api/compliance/phiDisclosuresApi';

export const fetchPhiDisclosures = createAsyncThunk(
  'phiDisclosures/fetchAll',
  async (filters: DisclosureFilters) => {
    const response = await phiDisclosuresApi.getAll(filters);
    return response.data;
  }
);

export const createPhiDisclosure = createAsyncThunk(
  'phiDisclosures/create',
  async (data: CreateDisclosureDTO) => {
    const response = await phiDisclosuresApi.create(data);
    return response.data;
  }
);

const phiDisclosuresSlice = createSlice({
  name: 'phiDisclosures',
  initialState: {
    items: [],
    selectedId: null,
    loading: false,
    error: null,
  },
  reducers: {
    selectDisclosure: (state, action) => {
      state.selectedId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPhiDisclosures.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPhiDisclosures.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.disclosures;
      })
      .addCase(fetchPhiDisclosures.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default phiDisclosuresSlice.reducer;
```

### TanStack Query Hook Example

```typescript
// /frontend/src/pages/compliance/phi-disclosures/hooks/usePhiDisclosures.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { phiDisclosuresApi } from '@/services/api/compliance/phiDisclosuresApi';

export const usePhiDisclosures = (filters: DisclosureFilters) => {
  return useQuery({
    queryKey: ['phiDisclosures', filters],
    queryFn: () => phiDisclosuresApi.getAll(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useCreatePhiDisclosure = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: phiDisclosuresApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['phiDisclosures'] });
    },
  });
};

export const useUpdatePhiDisclosure = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateDisclosureDTO }) =>
      phiDisclosuresApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['phiDisclosures'] });
    },
  });
};
```

---

## Testing Pattern

Each feature needs comprehensive tests:

```typescript
// Backend unit test example
describe('PHIDisclosureService', () => {
  describe('createDisclosure', () => {
    it('should create a disclosure and log audit trail', async () => {
      const data = {
        studentId: 'student-123',
        disclosureType: 'TREATMENT',
        // ... rest of data
      };

      const disclosure = await phiDisclosureService.createDisclosure(data, 'user-123');

      expect(disclosure).toBeDefined();
      expect(disclosure.disclosedBy).toBe('user-123');
      expect(AuditService.logPHIAccess).toHaveBeenCalled();
    });

    it('should validate minimum necessary justification', async () => {
      const data = {
        minimumNecessary: '', // Invalid
      };

      await expect(
        phiDisclosureService.createDisclosure(data, 'user-123')
      ).rejects.toThrow('Minimum necessary justification required');
    });
  });
});

// Frontend component test example
describe('PHIDisclosureList', () => {
  it('should render disclosures', async () => {
    const mockDisclosures = [
      { id: '1', recipientName: 'Dr. Smith', purpose: 'TREATMENT' },
    ];

    render(<PHIDisclosureList />);

    await waitFor(() => {
      expect(screen.getByText('Dr. Smith')).toBeInTheDocument();
    });
  });

  it('should open create modal when button clicked', () => {
    render(<PHIDisclosureList />);

    const createButton = screen.getByText('Log New Disclosure');
    fireEvent.click(createButton);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
});

// E2E test example
test('Complete PHI disclosure workflow', async ({ page }) => {
  await page.goto('/compliance/phi-disclosures');

  // Click create button
  await page.click('text=Log New Disclosure');

  // Fill form
  await page.fill('[name="recipientName"]', 'Dr. Smith');
  await page.selectOption('[name="purpose"]', 'TREATMENT');
  await page.fill('[name="minimumNecessary"]', 'Medical treatment coordination');

  // Submit
  await page.click('text=Create Disclosure');

  // Verify
  await expect(page.locator('text=Disclosure created successfully')).toBeVisible();
});
```

---

## Implementation Checklist

### Per Feature Checklist

For each of the 15 features, complete all layers:

**Backend:**
- [ ] Create Sequelize models with associations
- [ ] Create service class with business logic
- [ ] Create route handlers with Joi validation
- [ ] Add Swagger documentation
- [ ] Write unit tests for service (95% coverage)
- [ ] Write integration tests for API endpoints

**Frontend:**
- [ ] Create Redux slice with async thunks
- [ ] Create TanStack Query hooks
- [ ] Create page component
- [ ] Create list/grid component
- [ ] Create form component (Create/Edit)
- [ ] Create detail view component
- [ ] Add accessibility (WCAG 2.1 AA)
- [ ] Write component tests (React Testing Library)
- [ ] Write E2E tests (Playwright)

**Integration:**
- [ ] Test full workflow end-to-end
- [ ] Verify HIPAA compliance
- [ ] Check RBAC authorization
- [ ] Test error handling
- [ ] Verify audit logging
- [ ] Performance test with realistic data

---

## Timeline Estimate

### With Team of 5-6 Developers

**Weeks 1-4: Foundation (COMPLETE)**
- ✅ Infrastructure setup
- ✅ Database migrations
- ✅ Documentation

**Weeks 5-8: Critical Features (4 features)**
- Feature 30: PHI Disclosure Tracking
- Feature 32: Encryption UI
- Feature 26: Real-Time Alerts
- Feature 48: Drug Interaction Checker

**Weeks 9-12: Safety Features (3 features)**
- Feature 37: Outbreak Detection
- Feature 33: Tamper Alerts
- Feature 17: Clinic Visit Tracking

**Weeks 13-16: Operations (4 features)**
- Feature 41: Immunization Dashboard
- Feature 5: Immunization UI
- Feature 44: Medicaid Billing
- Feature 35: PDF Reports

**Weeks 17-20: Integration (4 features)**
- Feature 21: Secure Document Sharing
- Feature 43: State Registry Integration
- Feature 38: Export Scheduling
- Feature 42: SIS Integration

**Weeks 21-24: Testing & Deployment**
- Comprehensive testing
- Performance optimization
- Security audit
- Production deployment

---

## Quick Start Commands

```bash
# Run migrations
npm run db:migrate

# Start development servers
npm run dev

# Run tests
npm test
npm run test:coverage

# Build for production
npm run build

# Deploy
npm run deploy
```

---

**Status:** Implementation guide complete
**Next Action:** Create remaining Sequelize models, then implement services and routes
**Estimated Completion:** 100% implementation in 16-20 weeks with full team
