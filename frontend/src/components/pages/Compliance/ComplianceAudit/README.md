# ComplianceAudit Module

A comprehensive, modular audit management system for tracking compliance audits, findings, and follow-up actions.

## Overview

The ComplianceAudit module provides a complete interface for managing compliance audits including:
- Multiple view modes (grid, list, calendar)
- Advanced filtering and search
- Audit statistics dashboard
- Finding management
- Document tracking
- Follow-up action tracking

## Module Structure

```
ComplianceAudit/
├── types.ts                 # Type definitions and interfaces
├── configs.ts               # Configuration functions for UI rendering
├── AuditCard.tsx           # Individual audit card component
├── AuditStats.tsx          # Statistics dashboard component
├── AuditHeader.tsx         # Header with search and controls
├── FilterPanel.tsx         # Filter modal component
├── ComplianceAudit.tsx     # Main orchestrator component
├── index.ts                # Barrel exports
└── README.md               # This file
```

## Usage

### Basic Usage

```typescript
import ComplianceAudit from '@/components/pages/Compliance/ComplianceAudit';
import type { ComplianceAudit as AuditData } from '@/components/pages/Compliance/ComplianceAudit';

function AuditPage() {
  const [audits, setAudits] = useState<AuditData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'calendar'>('grid');

  return (
    <ComplianceAudit
      audits={audits}
      searchTerm={searchTerm}
      viewMode={viewMode}
      onSearchChange={setSearchTerm}
      onViewModeChange={setViewMode}
      onCreateAudit={() => console.log('Create audit')}
      onAuditClick={(audit) => console.log('Clicked:', audit)}
    />
  );
}
```

### Using Subcomponents

```typescript
import { AuditCard, AuditStats } from '@/components/pages/Compliance/ComplianceAudit';

function CustomAuditView({ audits }) {
  return (
    <div>
      <AuditStats audits={audits} />
      <div className="grid grid-cols-3 gap-4">
        {audits.map(audit => (
          <AuditCard
            key={audit.id}
            audit={audit}
            onClick={handleClick}
            onViewDetails={handleViewDetails}
          />
        ))}
      </div>
    </div>
  );
}
```

### Using Configuration Functions

```typescript
import { getStatusConfig, getTypeConfig } from '@/components/pages/Compliance/ComplianceAudit';

function AuditBadge({ status, type }) {
  const statusConfig = getStatusConfig(status);
  const typeConfig = getTypeConfig(type);
  const StatusIcon = statusConfig.icon;

  return (
    <div>
      <span className={statusConfig.color}>
        <StatusIcon /> {statusConfig.label}
      </span>
      <span className={typeConfig.color}>
        {typeConfig.label}
      </span>
    </div>
  );
}
```

## Props

### ComplianceAuditProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `audits` | `ComplianceAudit[]` | `[]` | Array of audit records |
| `auditors` | `Auditor[]` | `[]` | Array of available auditors |
| `departments` | `Department[]` | `[]` | Array of departments |
| `loading` | `boolean` | `false` | Loading state |
| `viewMode` | `'list' \| 'grid' \| 'calendar'` | `'grid'` | Current view mode |
| `searchTerm` | `string` | `''` | Search term |
| `activeFilters` | `AuditFilters` | `{}` | Active filters |
| `className` | `string` | `''` | Custom CSS classes |
| `onAuditClick` | `(audit) => void` | - | Audit click handler |
| `onCreateAudit` | `() => void` | - | Create audit handler |
| `onViewDetails` | `(audit) => void` | - | View details handler |
| `onDownloadReport` | `(audit) => void` | - | Download report handler |
| `onSearchChange` | `(term) => void` | - | Search change handler |
| `onFilterChange` | `(filters) => void` | - | Filter change handler |
| `onViewModeChange` | `(mode) => void` | - | View mode change handler |

## Types

### Core Types

```typescript
type AuditStatus = 'scheduled' | 'in-progress' | 'completed' | 'cancelled' | 'overdue';
type AuditType = 'internal' | 'external' | 'regulatory' | 'certification' | 'compliance' | 'risk';
type AuditPriority = 'low' | 'medium' | 'high' | 'critical';
type FindingSeverity = 'critical' | 'major' | 'minor' | 'observation';
```

### Main Interfaces

See `types.ts` for complete type definitions including:
- `ComplianceAudit` - Main audit data structure
- `AuditFinding` - Finding/issue discovered during audit
- `Auditor` - Auditor information
- `FollowUpAction` - Corrective actions
- `AuditFilters` - Filter configuration

## Features

### View Modes
- **Grid**: Card-based grid layout (default)
- **List**: Vertical list layout
- **Calendar**: Calendar view (coming soon)

### Filtering
Filter audits by:
- Status (scheduled, in-progress, completed, etc.)
- Type (internal, external, regulatory, etc.)
- Priority (low, medium, high, critical)
- Auditor
- Department

### Search
Full-text search across audit titles and descriptions.

### Statistics
Automatic calculation of:
- Total audits
- In-progress count
- Open findings count
- Average audit score

### Audit Cards
Each card displays:
- Audit title and description
- Status and type badges
- Priority indicator
- Auditor information
- Progress bar (for in-progress audits)
- Finding counts
- Critical finding alerts
- Audit score
- Action buttons (View, Download Report)

## Accessibility

- Full keyboard navigation support
- ARIA labels on all interactive elements
- Screen reader friendly
- Semantic HTML structure
- Focus management in modals

## Performance

- Memoized statistics calculation
- Efficient re-renders with proper key usage
- Conditional rendering of filter panel
- Optimized for lists up to 100 audits

For larger datasets, consider:
- Virtual scrolling
- Pagination
- Server-side filtering

## Browser Support

Modern browsers with ES2020+ support:
- Chrome 80+
- Firefox 75+
- Safari 14+
- Edge 80+

## Dependencies

- React 18+
- lucide-react (icons)
- TypeScript 4.9+

## Contributing

When modifying this module:
1. Keep files under 400 lines
2. Maintain TypeScript strict mode compliance
3. Add JSDoc comments for public APIs
4. Update this README if adding features
5. Follow existing patterns and naming conventions

## Migration Guide

If you were using the old monolithic ComplianceAudit.tsx:

**No changes required!** The refactored version maintains 100% backward compatibility.

```typescript
// This still works exactly as before
import ComplianceAudit from './ComplianceAudit';
import type { AuditStatus } from './ComplianceAudit';
```

If you want to use the new modular structure:

```typescript
// New way (optional)
import { ComplianceAudit, AuditCard } from './ComplianceAudit';
import type { AuditStatus } from './ComplianceAudit/types';
```

## License

Proprietary - Part of White Cross Healthcare System
