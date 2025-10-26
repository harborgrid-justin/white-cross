import React from 'react';
import { RouteObject } from 'react-router-dom';
import { ProtectedRoute } from '../../routes';
import ContactsDashboard from './components/ContactsDashboard';
import ContactsList from './components/ContactsList';

// Placeholder components for routes not yet implemented
const ContactDetails = () => <div>Contact Details</div>
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
            <ContactsDashboard />
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
            <ContactsDashboard />
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
