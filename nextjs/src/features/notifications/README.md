# Notification & Reminder System

Comprehensive notification and reminder system for the White Cross healthcare platform with multi-channel delivery, real-time updates, and HIPAA-compliant handling.

## Features

### Notifications
- **Multi-channel delivery**: In-app, email, SMS, push notifications, voice (emergency)
- **Real-time updates**: WebSocket integration for instant notifications
- **Notification types**: Medication reminders, appointments, immunizations, incidents, documents, compliance, emergencies
- **Priority levels**: Low, medium, high, urgent, emergency
- **Smart grouping**: Group related notifications by type or time
- **Offline queue**: Retry failed deliveries with exponential backoff
- **User preferences**: Per-channel, per-type notification settings
- **Quiet hours**: Silence notifications during specified times
- **HIPAA compliant**: No PHI data in notifications

### Reminders
- **Flexible scheduling**: One-time and recurring reminders
- **Recurrence patterns**: Daily, weekly, monthly with custom intervals
- **Reminder types**: Medication, appointment, immunization, follow-up, document, custom
- **Snooze functionality**: Postpone reminders temporarily
- **Escalation rules**: Multi-level escalation with additional channels
- **Status management**: Active, paused, completed, cancelled, expired

## Directory Structure

```
src/features/notifications/
├── types/
│   ├── notification.ts       # Notification types and enums
│   ├── reminder.ts           # Reminder types and recurrence patterns
│   ├── preferences.ts        # User preference types
│   └── index.ts
├── services/
│   ├── NotificationService.ts    # Core notification operations
│   ├── ReminderService.ts        # Reminder scheduling and management
│   ├── DeliveryService.ts        # Multi-channel delivery with offline queue
│   ├── PreferenceService.ts      # User preference management
│   ├── TemplateService.ts        # Notification templates
│   └── index.ts
├── hooks/
│   ├── useNotifications.ts       # Notification fetching and management
│   ├── useReminders.ts           # Reminder CRUD operations
│   ├── useNotificationPreferences.ts  # Preference management
│   ├── useNotificationSound.ts   # Sound playback
│   └── index.ts
├── components/
│   ├── NotificationBadge.tsx     # Unread count badge
│   ├── NotificationItem.tsx      # Single notification display
│   ├── NotificationList.tsx      # Notification list with grouping
│   ├── NotificationCenter.tsx    # Dropdown notification center
│   ├── NotificationToast.tsx     # Real-time toast notifications
│   ├── NotificationSettings.tsx  # Preference management UI
│   ├── ReminderScheduler.tsx     # Reminder creation form
│   ├── ReminderList.tsx          # Reminder list display
│   └── index.ts
└── README.md
```

## Usage

### Basic Notification Fetching

```typescript
import { useNotifications } from '@/features/notifications/hooks';

function MyComponent() {
  const {
    notifications,
    isLoading,
    markAsRead,
    markAllAsRead
  } = useNotifications(userId);

  return (
    <div>
      {notifications.map(notification => (
        <div key={notification.id}>
          {notification.title}
          <button onClick={() => markAsRead(notification.id)}>
            Mark as read
          </button>
        </div>
      ))}
    </div>
  );
}
```

### Notification Center Integration

```typescript
import { NotificationCenter } from '@/features/notifications/components';

function Header() {
  return (
    <header>
      {/* Other header content */}
      <NotificationCenter userId={currentUserId} />
    </header>
  );
}
```

### Creating Reminders

```typescript
import { useReminders } from '@/features/notifications/hooks';
import { ReminderType, ReminderFrequency } from '@/features/notifications/types';

function CreateReminder() {
  const { create } = useReminders(userId);

  const handleCreate = () => {
    create({
      type: ReminderType.MEDICATION,
      priority: NotificationPriority.HIGH,
      title: 'Administer medication',
      message: 'Give insulin to John Doe',
      userId,
      scheduledAt: new Date('2025-10-27T08:00:00'),
      channels: [DeliveryChannel.IN_APP, DeliveryChannel.SMS],
      recurrence: {
        frequency: ReminderFrequency.DAILY,
        interval: 1,
      },
    });
  };

  return <button onClick={handleCreate}>Create Reminder</button>;
}
```

### Notification Settings

```typescript
import { NotificationSettings } from '@/features/notifications/components';

function SettingsPage() {
  return (
    <div>
      <h1>Notification Preferences</h1>
      <NotificationSettings userId={currentUserId} />
    </div>
  );
}
```

### Real-time Notifications

```typescript
import { useNotificationRealtime } from '@/features/notifications/hooks';
import { NotificationToast } from '@/features/notifications/components';

function App() {
  const [toastNotifications, setToastNotifications] = useState([]);

  useNotificationRealtime(userId, (notification) => {
    // Add to toast queue
    setToastNotifications(prev => [...prev, notification]);
  });

  return (
    <>
      {/* App content */}
      <NotificationToastContainer
        userId={userId}
        notifications={toastNotifications}
        onDismiss={(id) => {
          setToastNotifications(prev =>
            prev.filter(n => n.id !== id)
          );
        }}
      />
    </>
  );
}
```

## Notification Types

### Healthcare-Specific Types
- `MEDICATION_REMINDER` - Time to administer medication
- `MEDICATION_DUE` - Medication administration due
- `MEDICATION_OVERDUE` - Medication administration overdue
- `MEDICATION_INTERACTION` - Drug interaction alert
- `APPOINTMENT_REMINDER` - Upcoming appointment
- `IMMUNIZATION_DUE` - Immunization due date
- `IMMUNIZATION_OVERDUE` - Overdue immunization
- `INCIDENT_FOLLOW_UP` - Incident requires follow-up
- `DOCUMENT_EXPIRING` - Document expiration warning
- `DOCUMENT_EXPIRED` - Document has expired
- `COMPLIANCE_ALERT` - Compliance issue detected
- `EMERGENCY_ALERT` - Emergency situation
- `EMERGENCY_BROADCAST` - System-wide emergency broadcast

## Delivery Channels

- **IN_APP** - In-app notification (always available)
- **EMAIL** - Email notification
- **SMS** - Text message notification
- **PUSH** - Browser push notification
- **VOICE** - Voice call (emergency only)

## Priority Levels

1. **LOW** - Informational, no urgency
2. **MEDIUM** - Standard priority
3. **HIGH** - Important, requires attention
4. **URGENT** - Very important, immediate attention needed
5. **EMERGENCY** - Critical, cannot be ignored

## User Preferences

Users can customize:
- Enable/disable notifications globally
- Per-channel preferences
- Per-notification-type preferences
- Minimum priority per channel
- Quiet hours with emergency override
- Sound preferences (enabled, volume, custom sounds)
- Grouping preferences
- Email digest settings
- Desktop/push notification settings

## HIPAA Compliance

- **No PHI in notifications**: Notifications contain minimal information
- **Related entity references**: Link to full records without exposing PHI
- **Audit logging**: All notification access is logged
- **Secure delivery**: All channels use encrypted transmission
- **User consent**: Delivery channels require explicit opt-in

## Offline Support

The delivery service includes an offline queue with:
- Automatic retry with exponential backoff
- Maximum 5 retry attempts
- LocalStorage persistence
- Automatic queue processing every 60 seconds

## Template System

Pre-configured templates for common notification scenarios:
- Medication reminders
- Appointment reminders
- Immunization due notices
- Incident follow-ups
- Document expiration warnings
- Emergency alerts

Templates support variable substitution with validation.

## WebSocket Integration

Real-time notifications are delivered via WebSocket:
1. Backend publishes notification to WebSocket
2. Frontend receives via custom event
3. Notification added to React Query cache
4. Toast displayed automatically
5. Unread count updated

## API Integration

All services use the backend API:
- `GET /api/v1/notifications` - Fetch notifications
- `POST /api/v1/notifications` - Create notification
- `PUT /api/v1/notifications/:id/read` - Mark as read
- `PUT /api/v1/notifications/:id/snooze` - Snooze notification
- `GET /api/v1/reminders` - Fetch reminders
- `POST /api/v1/reminders` - Create reminder
- `PUT /api/v1/reminders/:id` - Update reminder
- `GET /api/v1/notifications/preferences` - Get preferences
- `PUT /api/v1/notifications/preferences` - Update preferences

## Testing

```typescript
// Test notification creation
const notification = await notificationService.create({
  type: NotificationType.MEDICATION_REMINDER,
  priority: NotificationPriority.HIGH,
  title: 'Test notification',
  message: 'This is a test',
  userId: 'test-user',
  channels: [DeliveryChannel.IN_APP],
});

// Test reminder scheduling
const reminder = await reminderService.create({
  type: ReminderType.MEDICATION,
  priority: NotificationPriority.HIGH,
  title: 'Test reminder',
  message: 'This is a test',
  userId: 'test-user',
  scheduledAt: new Date(),
  channels: [DeliveryChannel.IN_APP],
});

// Test preference management
const preferences = await preferenceService.getPreferences('test-user');
await preferenceService.updatePreferences('test-user', {
  soundEnabled: false,
});
```

## Performance Considerations

- **React Query caching**: 5-minute stale time for preferences
- **Memoization**: Notification grouping is memoized
- **Lazy loading**: Pages use code splitting
- **Optimistic updates**: Immediate UI feedback for mutations
- **Debounced refetch**: Notification list refetches on 30s interval

## Accessibility

- ARIA labels on all interactive elements
- Screen reader announcements for new notifications
- Keyboard navigation support
- Focus management in modals
- High contrast mode support

## Future Enhancements

- [ ] Machine learning for optimal notification timing
- [ ] Batch notification digest (daily/weekly summaries)
- [ ] Advanced escalation workflows
- [ ] Notification analytics dashboard
- [ ] A/B testing for notification effectiveness
- [ ] Smart notification suppression
- [ ] Integration with calendar systems
- [ ] Voice-activated notification management
