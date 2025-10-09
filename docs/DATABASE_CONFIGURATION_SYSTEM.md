# Database-Driven Configuration System

## Overview

This document describes the comprehensive database-driven configuration system implemented for the White Cross healthcare platform. The system allows administrators to manage system settings dynamically without code changes, with full audit trails and validation.

## Architecture

### Database Schema

#### SystemConfiguration Model
Located in `backend/prisma/schema.prisma`

**Key Features:**
- **Multi-type support**: STRING, NUMBER, BOOLEAN, JSON, ARRAY, DATE, TIME, DATETIME, EMAIL, URL, COLOR, ENUM
- **Validation**: Min/max values, valid values array, type-specific validation
- **Scopes**: SYSTEM, DISTRICT, SCHOOL, USER level configurations
- **Security**: Public/private, editable/read-only flags
- **Metadata**: Categories, subcategories, tags, sort order
- **Change tracking**: Requires restart flag, default values

#### ConfigurationHistory Model
**Audit Trail Features:**
- Tracks all configuration changes
- Captures old and new values
- Records who made the change and when
- Stores change reason, IP address, and user agent
- Cascading delete with parent configuration

### Backend Implementation

#### Service Layer
**File**: `backend/src/services/configurationService.ts`

**Key Methods:**
- `getConfigByKey()` - Retrieve single configuration
- `getConfigurations()` - Get multiple configs with filtering
- `updateConfiguration()` - Update with validation and history
- `bulkUpdateConfigurations()` - Update multiple configs at once
- `resetToDefault()` - Reset to default value
- `getConfigHistory()` - Retrieve change history
- `exportConfigurations()` - Export as JSON
- `importConfigurations()` - Import from JSON

**Validation Features:**
- Type-specific validation (number ranges, email format, URL format, hex color)
- Valid values constraint checking
- Min/max value enforcement
- Editable flag enforcement
- JSON parsing validation

#### API Routes
**File**: `backend/src/routes/configuration.ts`

**Endpoints:**
- `GET /api/configurations` - List all configurations with filtering
- `GET /api/configurations/public` - Public configs (no auth)
- `GET /api/configurations/{key}` - Get single config
- `GET /api/configurations/category/{category}` - Get by category
- `PUT /api/configurations/{key}` - Update config (admin only)
- `PUT /api/configurations/bulk` - Bulk update (admin only)
- `POST /api/configurations` - Create new config (admin only)
- `DELETE /api/configurations/{key}` - Delete config (admin only)
- `POST /api/configurations/{key}/reset` - Reset to default (admin only)
- `GET /api/configurations/{key}/history` - Get change history
- `GET /api/configurations/history/recent` - Recent changes
- `GET /api/configurations/history/user/{userId}` - Changes by user
- `GET /api/configurations/export` - Export configs (admin only)
- `POST /api/configurations/import` - Import configs (admin only)

**Security:**
- All modification endpoints require ADMIN or SUPER_ADMIN role
- JWT authentication on all endpoints except `/public`
- Audit trail captures IP address and user agent

#### Server Registration
**File**: `backend/src/index.ts`

Configuration routes are registered after authentication setup:
```typescript
configurationRoutes(server);
```

### Frontend Implementation

#### API Client
**File**: `frontend/src/services/configurationApi.ts`

**TypeScript Interfaces:**
- `SystemConfiguration` - Main configuration type
- `ConfigurationHistory` - History entry type
- `ConfigurationFilter` - Filter options
- `ConfigurationUpdate` - Update payload
- `BulkUpdatePayload` - Bulk update payload

**API Methods:**
- `getAll()` - Fetch all configurations
- `getPublic()` - Fetch public configs
- `getByKey()` - Get single config
- `getByCategory()` - Get by category
- `update()` - Update single config
- `bulkUpdate()` - Update multiple configs
- `resetToDefault()` - Reset to default
- `getHistory()` - Get change history
- `export()` / `import()` - Import/export configs

#### Configuration UI
**File**: `frontend/src/components/settings/tabs/ConfigurationTab.tsx`

**Features:**
- **Category Filtering**: Filter by GENERAL, SECURITY, HEALTHCARE, NOTIFICATION, UI, PERFORMANCE
- **Dynamic Input Rendering**: Automatically renders appropriate input based on value type
  - Checkbox for BOOLEAN
  - Number input with min/max for NUMBER
  - Select dropdown for ENUM
  - Color picker for COLOR
  - Email input for EMAIL
  - URL input for URL
  - Textarea for JSON/ARRAY
  - Text input for STRING
- **Change Tracking**: Highlights unsaved changes in yellow
- **Bulk Save**: Save all changes at once with single API call
- **Reset to Default**: Individual config reset with confirmation
- **History Viewer**: Modal showing change history per configuration
- **Validation**: Client-side validation based on type, min/max, valid values
- **Read-only Support**: Displays non-editable configs with disabled inputs
- **Restart Warnings**: Shows which configs require application restart
- **Real-time Feedback**: Toast notifications for all operations

**UI Components:**
- Category filter buttons
- Grouped configurations by category
- Configuration cards with icons
- Input fields with validation
- History modal with change timeline
- Bulk action buttons

### Seeded Configurations

#### Default Configurations (29 total)
Located in `backend/prisma/seed.ts`

**Categories:**
1. **GENERAL** (3 configs)
   - Application name
   - Application tagline
   - File upload size limit

2. **SECURITY** (6 configs)
   - Max login attempts
   - Account lockout duration
   - Password minimum length
   - Password expiration days
   - Session timeout minutes
   - JWT token expiration hours

3. **RATE_LIMITING** (2 configs)
   - Rate limit window minutes
   - Max requests per window

4. **NOTIFICATION** (4 configs)
   - Email notifications enabled
   - SMS notifications enabled
   - Email from address
   - Email from name

5. **HEALTHCARE/MEDICATION** (3 configs)
   - Medication stock alert threshold
   - Medication expiration warning days
   - Controlled substance double check required

6. **APPOINTMENTS** (3 configs)
   - Default appointment duration minutes
   - Appointment reminder hours before
   - Student self-scheduling enabled

7. **UI** (3 configs)
   - Default page size
   - Toast notification duration seconds
   - Theme primary color

8. **QUERY/PERFORMANCE** (3 configs)
   - Dashboard refresh interval seconds
   - Medication reminders refresh seconds
   - API timeout seconds

9. **BACKUP** (2 configs)
   - Backup frequency hours
   - Backup retention days

## Usage Examples

### Backend: Getting a Configuration Value

```typescript
import configurationService from './services/configurationService';

// Get single config
const config = await configurationService.getConfigByKey('max_login_attempts');
console.log(config.value); // "5"

// Get configs by category
const securityConfigs = await configurationService.getConfigsByCategory('SECURITY');

// Update config with validation
await configurationService.updateConfiguration(
  'max_login_attempts',
  {
    value: '10',
    changedBy: userId,
    changeReason: 'Increased for testing'
  }
);
```

### Frontend: Using Configurations

```typescript
import { useQuery } from '@tanstack/react-query';
import { configurationApi } from './services/configurationApi';

// Fetch all configs
const { data } = useQuery({
  queryKey: ['configurations'],
  queryFn: () => configurationApi.getAll()
});

// Fetch public configs (no auth)
const { data: publicConfigs } = useQuery({
  queryKey: ['public-configurations'],
  queryFn: () => configurationApi.getPublic()
});

// Update a config
const mutation = useMutation({
  mutationFn: (data) => configurationApi.update('theme_primary_color', {
    value: '#3b82f6',
    changeReason: 'Rebranding'
  })
});
```

## Migration from Hardcoded Constants

### Before (Hardcoded)
```typescript
// frontend/src/pages/Reports.tsx
const [dateRange, setDateRange] = useState({
  startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Hardcoded
  endDate: new Date()
});
```

### After (Using Constants)
```typescript
// frontend/src/pages/Reports.tsx
import { DATE_CALCULATIONS } from '../constants';

const [dateRange, setDateRange] = useState({
  startDate: new Date(Date.now() - DATE_CALCULATIONS.ONE_MONTH),
  endDate: new Date()
});
```

### Future (Using Database Config)
```typescript
// Future implementation using database config
const { data: config } = useQuery({
  queryKey: ['config', 'default_date_range_days'],
  queryFn: () => configurationApi.getByKey('default_date_range_days')
});

const days = parseInt(config?.data?.value || '30');
const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
```

## Security Considerations

### Access Control
- Configuration viewing: Authenticated users only
- Configuration modification: ADMIN and SUPER_ADMIN only
- Public configs: Accessible without authentication (marked with `isPublic: true`)

### Audit Trail
All configuration changes are tracked with:
- User ID and name
- Timestamp
- Old and new values
- Change reason
- IP address
- User agent

### Validation
- Type-safe validation on backend
- Read-only configs cannot be modified
- Min/max value enforcement
- Valid values constraint checking
- Email and URL format validation
- Hex color format validation

## Benefits

1. **Dynamic Configuration**: Change settings without code deployment
2. **Multi-tenancy Support**: Different configs for districts, schools, users
3. **Audit Compliance**: Full change history for regulatory requirements
4. **Type Safety**: Strong typing and validation prevent errors
5. **User-Friendly UI**: Non-technical admins can manage settings
6. **Import/Export**: Easy backup and migration of configurations
7. **Categorization**: Organized by functional areas
8. **Default Values**: Safe fallback values always available
9. **Scope-Based**: System, district, school, or user level configs
10. **Real-time Updates**: Changes take effect immediately (or after restart)

## Future Enhancements

1. **Environment-Specific Configs**: Development, staging, production overrides
2. **Feature Flags**: Toggle features on/off per school or district
3. **A/B Testing Support**: Different config values for different user groups
4. **Config Templates**: Pre-defined configuration sets for quick setup
5. **Validation Rules**: Custom validation logic per configuration
6. **Notification on Change**: Alert users when critical configs change
7. **Rollback Feature**: Quick revert to previous config state
8. **Config Comparison**: Compare configs across environments
9. **Scheduled Changes**: Auto-apply config changes at specific times
10. **Config Documentation**: Built-in help text and examples per config

## Files Modified/Created

### Backend
- ✅ `backend/prisma/schema.prisma` - Enhanced SystemConfiguration model
- ✅ `backend/prisma/migrations/...` - Database migration
- ✅ `backend/prisma/seed.ts` - 29 default configurations
- ✅ `backend/src/services/configurationService.ts` - Configuration service
- ✅ `backend/src/routes/configuration.ts` - API routes
- ✅ `backend/src/index.ts` - Route registration
- ✅ `backend/src/constants/index.ts` - Centralized constants

### Frontend
- ✅ `frontend/src/services/configurationApi.ts` - API client
- ✅ `frontend/src/components/settings/tabs/ConfigurationTab.tsx` - Settings UI
- ✅ `frontend/src/constants/config.ts` - Frontend constants
- ✅ `frontend/src/constants/index.ts` - Constant exports

### Documentation
- ✅ `DATABASE_CONFIGURATION_SYSTEM.md` - This document

## Testing

### Manual Testing Checklist
- [ ] Login as admin user
- [ ] Navigate to Settings > Configuration tab
- [ ] View all configurations
- [ ] Filter by category (GENERAL, SECURITY, etc.)
- [ ] Modify a configuration value
- [ ] Save changes and verify success
- [ ] Reset a config to default value
- [ ] View configuration history
- [ ] Test bulk update functionality
- [ ] Verify read-only configs cannot be edited
- [ ] Test type-specific inputs (color picker, number input, etc.)
- [ ] Verify validation (min/max, valid values)
- [ ] Test export/import functionality

### API Testing
```bash
# Get all configurations
curl http://localhost:3001/api/configurations \
  -H "Authorization: Bearer YOUR_TOKEN"

# Get public configurations
curl http://localhost:3001/api/configurations/public

# Update a configuration
curl -X PUT http://localhost:3001/api/configurations/theme_primary_color \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"value": "#3b82f6", "changeReason": "Rebranding"}'

# Get configuration history
curl http://localhost:3001/api/configurations/theme_primary_color/history \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Conclusion

The database-driven configuration system provides a robust, secure, and user-friendly way to manage system settings across the White Cross platform. It supports multi-tenancy, maintains comprehensive audit trails, and enables non-technical administrators to configure the system without code changes.
