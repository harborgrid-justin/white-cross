import { BillingNotifications } from '@/components/pages/Billing';

/**
 * Billing Notifications Page
 * 
 * Notification management system for billing-related communications
 * including payment reminders, invoice notifications, and system alerts.
 */
export default function BillingNotificationsPage() {
  return (
    <BillingNotifications
      unreadCount={5}
      onNotificationClick={(notification) => {
        console.log('Notification clicked:', notification.id);
        // Handle notification click - mark as read, show details, etc.
      }}
      onMarkAsRead={(notificationIds) => {
        console.log('Mark as read:', notificationIds);
        // Handle mark as read
      }}
      onMarkAsUnread={(notificationIds) => {
        console.log('Mark as unread:', notificationIds);
        // Handle mark as unread
      }}
      onStarNotification={(notificationId) => {
        console.log('Star notification:', notificationId);
        // Handle star/unstar notification
      }}
      onArchiveNotification={(notificationIds) => {
        console.log('Archive notifications:', notificationIds);
        // Handle archive notifications
      }}
      onDeleteNotification={(notificationIds) => {
        if (confirm('Are you sure you want to delete the selected notifications?')) {
          console.log('Delete notifications:', notificationIds);
          // Handle delete notifications
        }
      }}
      onSendNotification={(templateId, recipientId) => {
        console.log('Send notification:', templateId, recipientId);
        // Handle send notification
      }}
      onSearchChange={(term) => {
        console.log('Search notifications:', term);
        // Handle search
      }}
      onFilterChange={(filters) => {
        console.log('Filter change:', filters);
        // Handle filter change
      }}
      onRefresh={() => {
        console.log('Refresh notifications');
        window.location.reload();
      }}
      onSettings={() => {
        window.location.href = '/dashboard/billing/settings?tab=notifications';
      }}
    />
  );
}
