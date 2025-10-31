# Notification TypeScript Fix Checklist
**Task ID**: N8T4F6

## Phase 1: Schema Extensions
- [ ] Analyze Notification schema gaps
- [ ] Create NotificationExtended type with backward-compatible properties
- [ ] Add NotificationPreferences type helpers
- [ ] Test schema compatibility

## Phase 2: NotificationSettings.tsx
- [ ] Fix import: updateNotificationPreferencesAction → updateNotificationPreferences
- [ ] Fix line 68: typePreferences indexing type error
- [ ] Fix line 132: 'health-alert' → 'health_alert'
- [ ] Fix lines 170-190: Remove explicit Element types from CardContent
- [ ] Fix all implicit any types in handlers

## Phase 3: NotificationCard.tsx
- [ ] Fix line 46: 'health-alert' → 'health_alert' in icons object
- [ ] Fix line 76: type comparison 'health-alert' vs union
- [ ] Fix lines 103-106: Adapt to use status/actions instead of isRead/actionText/actionUrl
- [ ] Fix line 163: Badge variant type
- [ ] Fix line 178: Button variant type
- [ ] Fix lines 119-224: CardContent children types

## Phase 4: NotificationsContent.tsx
- [ ] Fix line 55: getNotifications filter parameters
- [ ] Fix line 170: Button type issue
- [ ] Fix line 182: Select missing options prop
- [ ] Fix line 182: onValueChange parameter type
- [ ] Fix lines 202-212: Button variant types
- [ ] Fix line 226: Skeleton props
- [ ] Fix line 281: Button variant type
- [ ] Fix line 283: onClick event parameter type

## Phase 5: NotificationSettingsContent.tsx
- [ ] Fix line 97: size="icon" → valid size type
- [ ] Fix line 109: Button type issue
- [ ] Fix lines 117-141: Remove explicit Element types
- [ ] Fix all Label htmlFor prop types
- [ ] Fix all Switch onCheckedChange parameter types

## Phase 6: Other Notification Files
- [ ] Fix src/app/notifications/page.tsx errors
- [ ] Fix src/app/notifications/history/page.tsx errors
- [ ] Fix src/components/layouts/NotificationCenter.tsx context error
- [ ] Fix src/components/layouts/Header.tsx component type

## Phase 7: Validation
- [ ] Run npm run type-check for notification files
- [ ] Verify zero errors
- [ ] Confirm no code removal
- [ ] Update all tracking documents
