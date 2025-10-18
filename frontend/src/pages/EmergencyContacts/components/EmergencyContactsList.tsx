/**
 * WF-COMP-177 | EmergencyContactsList.tsx - React component or utility module
 * Purpose: react component or utility module
 * Upstream: React, external libs | Dependencies: react, lucide-react
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: default export | Key Features: component, arrow component
 * Last Updated: 2025-10-17 | File Type: .tsx
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

/**
 * Emergency Contacts List Component
 *
 * Displays a grid of contact cards
 *
 * @module components/EmergencyContactsList
 */

import React from 'react';
import { Phone, Mail, CheckCircle, Edit, Trash2, Plus } from 'lucide-react';
import type { Contact } from '../types';

interface EmergencyContactsListProps {
  contacts: Contact[];
  onEdit: (contact: Contact) => void;
  onDelete: (contactId: string) => void;
  onVerify: (contactId: string, method: 'sms' | 'email' | 'voice') => void;
  onAddContact: () => void;
}

/**
 * Contacts list component with cards
 */
export default function EmergencyContactsList({
  contacts,
  onEdit,
  onDelete,
  onVerify,
  onAddContact,
}: EmergencyContactsListProps) {
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'PRIMARY':
        return 'bg-blue-100 text-blue-800';
      case 'SECONDARY':
        return 'bg-gray-100 text-gray-800';
      case 'EMERGENCY_ONLY':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (contacts.length === 0) {
    return (
      <div className="card p-12 text-center text-gray-500">
        <p>No emergency contacts found for this student</p>
        <button
          onClick={onAddContact}
          className="mt-4 btn-primary flex items-center mx-auto"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Contact
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {contacts.map((contact) => (
        <div key={contact.id} className="card p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">
                {contact.firstName} {contact.lastName}
              </h3>
              <p className="text-sm text-gray-600">{contact.relationship}</p>
            </div>
            <span
              className={`px-2 py-1 text-xs font-semibold rounded ${getPriorityBadge(
                contact.priority
              )}`}
            >
              {contact.priority}
            </span>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex items-center text-gray-600">
              <Phone className="h-4 w-4 mr-2" />
              {contact.phoneNumber}
            </div>
            {contact.email && (
              <div className="flex items-center text-gray-600">
                <Mail className="h-4 w-4 mr-2" />
                {contact.email}
              </div>
            )}
            {contact.verified && (
              <div className="flex items-center text-green-600">
                <CheckCircle className="h-4 w-4 mr-2" />
                Verified
              </div>
            )}
          </div>

          <div className="mt-4 flex gap-2">
            <button
              onClick={() => onEdit(contact)}
              className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <Edit className="h-4 w-4 inline mr-1" />
              Edit
            </button>
            <button
              onClick={() => onDelete(contact.id)}
              className="flex-1 px-3 py-2 text-sm border border-red-300 text-red-600 rounded-md hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4 inline mr-1" />
              Delete
            </button>
          </div>

          {!contact.verified && (
            <div className="mt-2">
              <button
                onClick={() => onVerify(contact.id, 'sms')}
                className="w-full px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Send Verification
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
