# Integration Hub - Quick Reference Guide

## API Endpoints

### Base URL
```
/integrations
```

### Endpoints Overview

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/integrations` | List all integrations | ADMIN |
| GET | `/integrations/{id}` | Get single integration | ADMIN |
| POST | `/integrations` | Create integration | ADMIN |
| PUT | `/integrations/{id}` | Update integration | ADMIN |
| DELETE | `/integrations/{id}` | Delete integration | ADMIN |
| POST | `/integrations/{id}/test` | Test connection | ADMIN |
| POST | `/integrations/{id}/sync` | Trigger sync | ADMIN |
| GET | `/integrations/{id}/logs` | Get logs for integration | ADMIN |
| GET | `/integrations/logs/all` | Get all logs | ADMIN |
| GET | `/integrations/statistics/overview` | Get statistics | ADMIN |

## Integration Types

```typescript
type IntegrationType =
  | 'SIS'                    // Student Information System
  | 'EHR'                    // Electronic Health Records
  | 'PHARMACY'               // Pharmacy Management
  | 'LABORATORY'             // Laboratory Information
  | 'INSURANCE'              // Insurance Verification
  | 'PARENT_PORTAL'          // Parent Portal
  | 'HEALTH_APP'             // Health Application
  | 'GOVERNMENT_REPORTING'   // Government Systems
```

## Frontend Usage

### Import
```typescript
import { integrationApi } from '@/services';
```

### Common Operations

#### 1. List All Integrations
```typescript
const { integrations } = await integrationApi.getAll();
```

#### 2. Filter by Type
```typescript
const { integrations } = await integrationApi.getAll('SIS');
```

#### 3. Get Single Integration
```typescript
const { integration } = await integrationApi.getById(id);
```

#### 4. Create Integration
```typescript
const { integration } = await integrationApi.create({
  name: 'District SIS',
  type: 'SIS',
  endpoint: 'https://api.example.com',
  apiKey: 'your-key',
  syncFrequency: 60
});
```

#### 5. Update Integration
```typescript
const { integration } = await integrationApi.update(id, {
  isActive: true,
  syncFrequency: 30
});
```

#### 6. Test Connection
```typescript
const { result } = await integrationApi.testConnection(id);
console.log(result.success, result.responseTime);
```

#### 7. Trigger Sync
```typescript
const { result } = await integrationApi.sync(id);
console.log(`Processed: ${result.recordsProcessed}`);
```

#### 8. Get Statistics
```typescript
const { statistics } = await integrationApi.getStatistics();
console.log(`Success Rate: ${statistics.syncStatistics.successRate}%`);
```

#### 9. Check Health
```typescript
const health = await integrationApi.getHealthStatus();
console.log(`Status: ${health.overall}`);
```

## Request/Response Examples

### Create Integration Request
```json
{
  "name": "District Student System",
  "type": "SIS",
  "endpoint": "https://sis.district.edu/api/v1",
  "apiKey": "sk_live_xxxxxxxxxxxx",
  "settings": {
    "districtId": "12345",
    "syncStudents": true,
    "syncGrades": true,
    "syncAttendance": false
  },
  "syncFrequency": 60
}
```

### Integration Response
```json
{
  "success": true,
  "data": {
    "integration": {
      "id": "int_xxxxx",
      "name": "District Student System",
      "type": "SIS",
      "status": "INACTIVE",
      "endpoint": "https://sis.district.edu/api/v1",
      "apiKey": "***MASKED***",
      "settings": { ... },
      "isActive": true,
      "syncFrequency": 60,
      "lastSyncAt": null,
      "lastSyncStatus": null,
      "createdAt": "2025-10-10T...",
      "updatedAt": "2025-10-10T..."
    }
  }
}
```

### Connection Test Response
```json
{
  "success": true,
  "data": {
    "result": {
      "success": true,
      "message": "Successfully connected to Student Information System",
      "responseTime": 156,
      "details": {
        "version": "2.1.0",
        "studentCount": 1542,
        "lastSync": "2025-10-10T..."
      }
    }
  }
}
```

### Sync Result Response
```json
{
  "success": true,
  "data": {
    "result": {
      "success": true,
      "recordsProcessed": 87,
      "recordsSucceeded": 85,
      "recordsFailed": 2,
      "duration": 2340,
      "errors": [
        "Record 12: Missing required field 'grade'",
        "Record 45: Invalid date format"
      ]
    }
  }
}
```

### Statistics Response
```json
{
  "success": true,
  "data": {
    "statistics": {
      "totalIntegrations": 5,
      "activeIntegrations": 4,
      "inactiveIntegrations": 1,
      "syncStatistics": {
        "totalSyncs": 127,
        "successfulSyncs": 119,
        "failedSyncs": 8,
        "successRate": 93.7,
        "totalRecordsProcessed": 15420,
        "totalRecordsSucceeded": 15302,
        "totalRecordsFailed": 118
      },
      "statsByType": {
        "SIS": {
          "success": 45,
          "failed": 2,
          "total": 47
        },
        "EHR": {
          "success": 38,
          "failed": 3,
          "total": 41
        }
      }
    }
  }
}
```

## Error Handling

### Error Response Format
```json
{
  "success": false,
  "error": {
    "message": "Integration not found"
  }
}
```

### Common Errors

| Status Code | Error Message | Cause |
|-------------|---------------|-------|
| 400 | Validation error: ... | Invalid request data |
| 403 | Access denied | Not admin user |
| 404 | Integration not found | Invalid integration ID |
| 500 | Failed to fetch integrations | Server error |

### Error Handling Example
```typescript
try {
  const { integration } = await integrationApi.create(data);
  console.log('Created:', integration.id);
} catch (error) {
  if (error.message.includes('Validation error')) {
    // Handle validation error
    console.error('Invalid data:', error.message);
  } else if (error.message.includes('Access denied')) {
    // Handle permission error
    console.error('Not authorized');
  } else {
    // Handle other errors
    console.error('Error:', error.message);
  }
}
```

## Best Practices

### 1. Test Before Sync
```typescript
// Always test connection before syncing
const testResult = await integrationApi.testConnection(id);
if (testResult.result.success) {
  await integrationApi.sync(id);
}
```

### 2. Handle Async Operations
```typescript
// Use async/await for better error handling
const syncIntegration = async (id: string) => {
  try {
    const result = await integrationApi.sync(id);
    return result;
  } catch (error) {
    console.error('Sync failed:', error);
    throw error;
  }
};
```

### 3. Monitor Health
```typescript
// Regularly check integration health
const monitorHealth = async () => {
  const health = await integrationApi.getHealthStatus();

  if (health.overall === 'critical') {
    // Send alert
    console.error('Critical: Integrations failing!');
  }
};

// Run every 5 minutes
setInterval(monitorHealth, 5 * 60 * 1000);
```

### 4. Batch Operations
```typescript
// Enable multiple integrations efficiently
const ids = ['int_1', 'int_2', 'int_3'];
const result = await integrationApi.batchEnable(ids);
console.log(`Enabled: ${result.success}, Failed: ${result.failed}`);
```

### 5. Pagination
```typescript
// Handle pagination for logs
const getLogs = async (integrationId: string) => {
  let page = 1;
  const allLogs = [];

  while (true) {
    const result = await integrationApi.getLogs(integrationId, { page, limit: 50 });
    allLogs.push(...result.logs);

    if (page >= result.pagination.totalPages) break;
    page++;
  }

  return allLogs;
};
```

## Security Notes

1. **Credentials**: API keys and passwords are automatically masked in responses
2. **Authentication**: All endpoints require JWT authentication
3. **Authorization**: Only ADMIN and DISTRICT_ADMIN roles can access
4. **Audit Trail**: All operations are logged with user tracking
5. **HTTPS**: Always use HTTPS in production

## File Locations

### Frontend
- **API Service**: `frontend/src/services/modules/integrationApi.ts`
- **Type Definitions**: Exported from service file
- **API Endpoints**: `frontend/src/constants/api.ts`

### Backend
- **Routes**: `backend/src/routes/integrations.ts`
- **Service**: `backend/src/services/integrationService.ts`
- **Database Schema**: `backend/prisma/schema.prisma`

## Support

For issues or questions:
1. Check error messages in browser console
2. Review server logs for backend errors
3. Verify user has admin permissions
4. Ensure integration configuration is correct
5. Test network connectivity to external services

---

**Last Updated**: October 10, 2025
**Version**: 1.0.0
