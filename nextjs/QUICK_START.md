# Quick Start Guide - Communication & Incidents

## 🚀 Getting Started

The communication and incident reporting features are now fully integrated into the Next.js 15 app using App Router.

### Access URLs

#### Communication
- **Main Hub**: `http://localhost:5173/communication`
- **Message History**: `http://localhost:5173/communication/history`
- **Templates**: `http://localhost:5173/communication/templates`

#### Incidents
- **List**: `http://localhost:5173/incidents`
- **Create New**: `http://localhost:5173/incidents/new`
- **View Details**: `http://localhost:5173/incidents/[id]`
- **Witness Statements**: `http://localhost:5173/incidents/[id]/witnesses`

---

## 📁 File Structure

```
nextjs/src/
├── app/
│   ├── communication/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── history/page.tsx
│   │   └── templates/page.tsx
│   ├── incidents/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── new/page.tsx
│   │   └── [id]/
│   │       ├── page.tsx
│   │       └── witnesses/page.tsx
│   └── actions/
│       ├── communication.ts
│       └── incidents.ts
└── components/
    └── features/
        ├── communication/
        │   ├── CommunicationHub.tsx
        │   ├── MessageHistory.tsx
        │   ├── MessageTemplates.tsx
        │   └── tabs/
        │       ├── CommunicationComposeTab.tsx
        │       ├── CommunicationHistoryTab.tsx
        │       ├── CommunicationTemplatesTab.tsx
        │       ├── CommunicationBroadcastTab.tsx
        │       └── CommunicationEmergencyTab.tsx
        └── incidents/
            ├── IncidentReportsList.tsx
            ├── CreateIncidentReport.tsx
            ├── IncidentReportDetails.tsx
            └── WitnessStatements.tsx
```

---

## 🔧 Development Workflow

### Running the Application

```bash
# From project root
npm run dev

# Frontend will run on http://localhost:5173
# Backend will run on http://localhost:3001
```

### Making Changes

1. **Edit Client Components** (in `components/features/`)
   - Add `'use client'` directive at the top
   - Use React hooks and state
   - Handle user interactions

2. **Edit Server Actions** (in `app/actions/`)
   - Add `'use server'` directive at the top
   - Handle form submissions
   - Call backend APIs
   - Use `revalidatePath()` to refresh data

3. **Edit Page Routes** (in `app/`)
   - Server Components by default
   - Use async/await for data fetching
   - Import and render Client Components

---

## 📝 Common Tasks

### Adding a New Communication Channel

1. Update the channels array in `CommunicationComposeTab.tsx`
2. Add icon mapping in `getChannelIcon()` function
3. Update backend API to support new channel
4. Test message sending with new channel

### Adding a New Incident Type

1. Update the type dropdown in `CreateIncidentReport.tsx`
2. Update type badges in `IncidentReportsList.tsx`
3. Ensure backend supports the new type
4. Add appropriate severity mapping

### Implementing File Upload

```typescript
// In CreateIncidentReport.tsx
const [files, setFiles] = useState<File[]>([])

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()

  // Create incident first
  const incident = await createIncidentReport(formData)

  // Then upload files
  if (files.length > 0) {
    const uploadFormData = new FormData()
    files.forEach(file => uploadFormData.append('files', file))

    await fetch(`/api/proxy/v1/incidents/${incident.id}/attachments`, {
      method: 'POST',
      body: uploadFormData
    })
  }
}
```

---

## 🔌 WebSocket Integration for Emergency Alerts

### Required Setup

```typescript
// In CommunicationEmergencyTab.tsx
import { useEffect, useState } from 'react'

export default function CommunicationEmergencyTab() {
  const [deliveryStatus, setDeliveryStatus] = useState({})
  const [ws, setWs] = useState<WebSocket | null>(null)

  useEffect(() => {
    // Connect to WebSocket
    const websocket = new WebSocket(process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001')

    websocket.onopen = () => {
      console.log('WebSocket connected')
    }

    websocket.onmessage = (event) => {
      const { type, payload } = JSON.parse(event.data)

      if (type === 'EMERGENCY_DELIVERY_STATUS') {
        setDeliveryStatus(prev => ({
          ...prev,
          [payload.recipientId]: payload.status
        }))
      }
    }

    websocket.onerror = (error) => {
      console.error('WebSocket error:', error)
    }

    setWs(websocket)

    return () => {
      websocket.close()
    }
  }, [])

  // Rest of component...
}
```

### Backend WebSocket Event

```typescript
// Backend emits this when emergency message is delivered
{
  type: 'EMERGENCY_DELIVERY_STATUS',
  payload: {
    messageId: 'msg-123',
    recipientId: 'user-456',
    status: 'delivered' | 'read' | 'failed',
    timestamp: '2025-10-26T10:30:00Z'
  }
}
```

---

## 🧪 Testing

### Unit Tests

```bash
# Test a specific component
npm test -- components/features/communication/CommunicationHub.test.tsx

# Test with coverage
npm run test:coverage
```

### E2E Tests

```bash
# Run all E2E tests
npm run test:e2e

# Run specific test
npx playwright test tests/e2e/communication/send-message.spec.ts
```

---

## 🐛 Troubleshooting

### Issue: "Cannot find module '@/components/features/...'"

**Solution**: Ensure TypeScript path aliases are configured in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Issue: "Server Action failed to execute"

**Solution**: Check:
1. Backend API is running on port 3001
2. API proxy route exists at `/api/proxy/[...path]/route.ts`
3. Environment variables are set correctly
4. Authentication token is included in request headers

### Issue: "WebSocket connection failed"

**Solution**:
1. Ensure backend WebSocket service is running
2. Check `NEXT_PUBLIC_WS_URL` environment variable
3. Verify CORS settings on backend
4. Check browser console for connection errors

---

## 📚 Additional Resources

- [Next.js 15 Documentation](https://nextjs.org/docs)
- [Server Actions Guide](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
- [App Router Guide](https://nextjs.org/docs/app)
- [White Cross Project CLAUDE.md](../CLAUDE.md)
- [Migration Report](./MIGRATION_REPORT.md)

---

## ✅ Pre-Deployment Checklist

- [ ] All Server Actions have authentication
- [ ] WebSocket integration for emergency alerts is complete
- [ ] File upload is fully implemented and tested
- [ ] All forms have proper validation
- [ ] Error boundaries are in place
- [ ] Loading states are implemented
- [ ] HIPAA compliance requirements are met
- [ ] Audit logging is enabled
- [ ] Unit tests pass with >90% coverage
- [ ] E2E tests pass for critical workflows
- [ ] Performance testing completed
- [ ] Security review completed

---

**Last Updated**: October 26, 2025
**Maintained By**: Development Team
