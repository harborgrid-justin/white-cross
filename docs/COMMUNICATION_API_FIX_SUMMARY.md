# Communication API Centralization Fix Summary

## Status: PARTIALLY COMPLETE

### Issue Identified
- communicationApi.ts has 11 hardcoded `/communication` paths
- API_ENDPOINTS.COMMUNICATION exists in frontend/src/constants/api.ts but is incomplete
- Service not using the centralized constants

### Changes Required

#### 1. Expand COMMUNICATION section in `frontend/src/constants/api.ts`

Add these constants to the COMMUNICATION object (lines 129-137):

```typescript
COMMUNICATION: {
  BASE: '/communication',
  MESSAGES: '/communication/messages',
  NOTIFICATIONS: '/communication/notifications',
  TEMPLATES: '/communication/templates',
  CHANNELS: '/communication/channels',
  SEND: '/communication/send',
  BULK: '/communication/bulk',
  // ADD THESE NEW CONSTANTS:
  TEMPLATE_BY_ID: (id: string) => \`/communication/templates/\${id}\`,
  BROADCAST: '/communication/broadcast',
  MESSAGE_BY_ID: (id: string) => \`/communication/messages/\${id}\`,
  MESSAGE_DELIVERY: (messageId: string) => \`/communication/messages/\${messageId}/delivery\`,
  EMERGENCY_ALERT: '/communication/emergency-alert',
  PROCESS_SCHEDULED: '/communication/process-scheduled',
  STATISTICS: '/communication/statistics',
  TRANSLATE: '/communication/translate',
  OPTIONS: '/communication/options',
},
```

#### 2. Update `frontend/src/services/modules/communicationApi.ts`

**Import Change (Line 34):**
```typescript
// BEFORE:
import { apiInstance } from '../config/apiConfig'

// AFTER:
import { apiInstance, API_ENDPOINTS } from '../config/apiConfig'
```

**Path Replacements:**

| Line | Old Path | New Constant |
|------|----------|--------------|
| 57 | \`/communication/templates?\${params.toString()}\` | \`\${API_ENDPOINTS.COMMUNICATION.TEMPLATES}?\${params.toString()}\` |
| 69 | \`/communication/templates/\${id}\` | API_ENDPOINTS.COMMUNICATION.TEMPLATE_BY_ID(id) |
| 81 | '/communication/templates' | API_ENDPOINTS.COMMUNICATION.TEMPLATES |
| 93 | \`/communication/templates/\${id}\` | API_ENDPOINTS.COMMUNICATION.TEMPLATE_BY_ID(id) |
| 105 | \`/communication/templates/\${id}\` | API_ENDPOINTS.COMMUNICATION.TEMPLATE_BY_ID(id) |
| 121 | '/communication/send' | API_ENDPOINTS.COMMUNICATION.SEND |
| 133 | '/communication/broadcast' | API_ENDPOINTS.COMMUNICATION.BROADCAST |
| 156 | \`/communication/messages?\${params.toString()}\` | \`\${API_ENDPOINTS.COMMUNICATION.MESSAGES}?\${params.toString()}\` |
| 168 | \`/communication/messages/\${id}\` | API_ENDPOINTS.COMMUNICATION.MESSAGE_BY_ID(id) |
| 180 | \`/communication/messages/\${messageId}/delivery\` | API_ENDPOINTS.COMMUNICATION.MESSAGE_DELIVERY(messageId) |
| 196 | '/communication/emergency-alert' | API_ENDPOINTS.COMMUNICATION.EMERGENCY_ALERT |
| 212 | '/communication/process-scheduled' | API_ENDPOINTS.COMMUNICATION.PROCESS_SCHEDULED |
| 233 | \`/communication/statistics?\${params.toString()}\` | \`\${API_ENDPOINTS.COMMUNICATION.STATISTICS}?\${params.toString()}\` |
| 249 | '/communication/translate' | API_ENDPOINTS.COMMUNICATION.TRANSLATE |
| 265 | '/communication/options' | API_ENDPOINTS.COMMUNICATION.OPTIONS |

### Verification

Run this command to verify all hardcoded paths are replaced:
```bash
grep -n "/communication" frontend/src/services/modules/communicationApi.ts
```

Expected output: No results (all paths should use API_ENDPOINTS)

### Benefits
- Centralized endpoint management
- Easier to update API versions
- Type-safe endpoint access
- Consistent with other service files
