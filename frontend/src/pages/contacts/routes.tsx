import React from 'react';
import { RouteObject } from 'react-router-dom';
import { ProtectedRoute } from '../../routes';

// Placeholder components - will be replaced with actual components
const ContactsOverview = () => <div>Contacts Overview</div>
const ContactsList = () => <div>Contacts List</div>
const ContactDetails = () => <div>Contact Details</div>
const ContactsStatistics = () => <div>Contacts Statistics</div>
const ContactsVerification = () => <div>Contacts Verification</div>
const ContactsNotifications = () => <div>Contacts Notifications</div>

export const contactsRoutes: RouteObject[] = [
  {
    path: 'contacts',
    children: [
      {
        path: '',
        element: (
          <ProtectedRoute allowedRoles={['ADMIN', 'STAFF']}>
            <ContactsOverview />
          </ProtectedRoute>
        ),
      },
      {
        path: 'list',
        element: (
          <ProtectedRoute allowedRoles={['ADMIN', 'STAFF']}>
            <ContactsList />
          </ProtectedRoute>
        ),
      },
      {
        path: 'details/:id',
        element: (
          <ProtectedRoute allowedRoles={['ADMIN', 'STAFF']}>
            <ContactDetails />
          </ProtectedRoute>
        ),
      },
      {
        path: 'statistics',
        element: (
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <ContactsStatistics />
          </ProtectedRoute>
        ),
      },
      {
        path: 'verification',
        element: (
          <ProtectedRoute allowedRoles={['ADMIN', 'STAFF']}>
            <ContactsVerification />
          </ProtectedRoute>
        ),
      },
      {
        path: 'notifications',
        element: (
          <ProtectedRoute allowedRoles={['ADMIN', 'STAFF']}>
            <ContactsNotifications />
          </ProtectedRoute>
        ),
      },
    ],
  },
];
