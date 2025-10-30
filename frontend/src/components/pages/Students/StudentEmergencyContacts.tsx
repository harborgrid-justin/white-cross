/**
 * @fileoverview Student Emergency Contacts Component
 * 
 * Component for managing and displaying student emergency contact information.
 * 
 * @module components/pages/Students/StudentEmergencyContacts
 * @since 1.0.0
 */

'use client';

import { useState } from 'react';
import { Phone, Mail, MapPin, User, Edit, Plus, Trash2, AlertCircle } from 'lucide-react';

interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  alternatePhone?: string;
  email?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  priority: number;
  canPickup: boolean;
  medicalAuthorization: boolean;
  notes?: string;
}

interface StudentEmergencyContactsProps {
  studentId: string;
  studentName: string;
  contacts: EmergencyContact[];
  onAddContact?: () => void;
  onEditContact?: (contactId: string) => void;
  onDeleteContact?: (contactId: string) => void;
  canEdit?: boolean;
}

/**
 * Student Emergency Contacts Component
 * 
 * Displays and manages emergency contact information with priority ordering,
 * authorization levels, and contact details.
 */
export function StudentEmergencyContacts({
  studentId,
  studentName,
  contacts,
  onAddContact,
  onEditContact,
  onDeleteContact,
  canEdit = true
}: StudentEmergencyContactsProps) {
  const [expandedContact, setExpandedContact] = useState<string | null>(null);

  const sortedContacts = [...contacts].sort((a, b) => a.priority - b.priority);

  const getPriorityBadge = (priority: number) => {
    const badges = {
      1: { label: 'Primary', color: 'bg-blue-100 text-blue-800 border-blue-200' },
      2: { label: 'Secondary', color: 'bg-green-100 text-green-800 border-green-200' },
      3: { label: 'Tertiary', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' }
    };
    
    return badges[priority as keyof typeof badges] || 
           { label: `Priority ${priority}`, color: 'bg-gray-100 text-gray-800 border-gray-200' };
  };

  const formatPhoneNumber = (phone: string) => {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    return phone;
  };

  const toggleExpanded = (contactId: string) => {
    setExpandedContact(expandedContact === contactId ? null : contactId);
  };

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-medium text-gray-900">Emergency Contacts</h2>
            <p className="text-sm text-gray-600">{studentName}</p>
          </div>
          {canEdit && (
            <button
              onClick={onAddContact}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Contact
            </button>
          )}
        </div>
      </div>

      {/* Contact List */}
      <div className="divide-y divide-gray-200">
        {sortedContacts.length > 0 ? (
          sortedContacts.map((contact) => {
            const priorityBadge = getPriorityBadge(contact.priority);
            const isExpanded = expandedContact === contact.id;

            return (
              <div key={contact.id} className="px-6 py-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* Contact Header */}
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <div className="bg-gray-100 rounded-full p-2">
                          <User className="h-5 w-5 text-gray-600" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <h3 className="text-lg font-medium text-gray-900">{contact.name}</h3>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${priorityBadge.color}`}>
                            {priorityBadge.label}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{contact.relationship}</p>
                        
                        {/* Primary Contact Info */}
                        <div className="mt-2 space-y-1">
                          <div className="flex items-center text-sm text-gray-600">
                            <Phone className="h-4 w-4 mr-2 text-gray-400" />
                            <a href={`tel:${contact.phone}`} className="hover:text-blue-600">
                              {formatPhoneNumber(contact.phone)}
                            </a>
                          </div>
                          {contact.email && (
                            <div className="flex items-center text-sm text-gray-600">
                              <Mail className="h-4 w-4 mr-2 text-gray-400" />
                              <a href={`mailto:${contact.email}`} className="hover:text-blue-600">
                                {contact.email}
                              </a>
                            </div>
                          )}
                        </div>

                        {/* Authorization Badges */}
                        <div className="mt-3 flex flex-wrap gap-2">
                          {contact.canPickup && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Authorized for Pickup
                            </span>
                          )}
                          {contact.medicalAuthorization && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              Medical Authorization
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {isExpanded && (
                      <div className="mt-4 pl-11 space-y-4">
                        {/* Alternate Phone */}
                        {contact.alternatePhone && (
                          <div>
                            <label className="text-sm font-medium text-gray-700">Alternate Phone</label>
                            <div className="mt-1 flex items-center text-sm text-gray-600">
                              <Phone className="h-4 w-4 mr-2 text-gray-400" />
                              <a href={`tel:${contact.alternatePhone}`} className="hover:text-blue-600">
                                {formatPhoneNumber(contact.alternatePhone)}
                              </a>
                            </div>
                          </div>
                        )}

                        {/* Address */}
                        {contact.address && (
                          <div>
                            <label className="text-sm font-medium text-gray-700">Address</label>
                            <div className="mt-1 flex items-start text-sm text-gray-600">
                              <MapPin className="h-4 w-4 mr-2 text-gray-400 mt-0.5" />
                              <div>
                                <p>{contact.address.street}</p>
                                <p>{contact.address.city}, {contact.address.state} {contact.address.zipCode}</p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Notes */}
                        {contact.notes && (
                          <div>
                            <label className="text-sm font-medium text-gray-700">Notes</label>
                            <div className="mt-1 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                              <div className="flex">
                                <AlertCircle className="h-4 w-4 text-yellow-600 mr-2 mt-0.5" />
                                <p className="text-sm text-yellow-800">{contact.notes}</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => toggleExpanded(contact.id)}
                      className="text-gray-400 hover:text-gray-600 text-sm"
                    >
                      {isExpanded ? 'Less' : 'More'}
                    </button>
                    {canEdit && (
                      <>
                        <button
                          onClick={() => onEditContact?.(contact.id)}
                          className="text-blue-600 hover:text-blue-800"
                          aria-label={`Edit ${contact.name}`}
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onDeleteContact?.(contact.id)}
                          className="text-red-600 hover:text-red-800"
                          aria-label={`Delete ${contact.name}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="px-6 py-8 text-center">
            <User className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No emergency contacts</h3>
            <p className="mt-1 text-sm text-gray-500">
              Add emergency contacts to ensure we can reach the right people in case of an emergency.
            </p>
            {canEdit && (
              <div className="mt-6">
                <button
                  onClick={onAddContact}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Contact
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Important Notice */}
      {contacts.length > 0 && (
        <div className="px-6 py-4 bg-blue-50 border-t border-gray-200">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-blue-900">Emergency Contact Information</h4>
              <p className="mt-1 text-sm text-blue-700">
                Please ensure all contact information is current and accurate. 
                Contacts are called in priority order during emergencies. 
                Only contacts with &ldquo;Authorized for Pickup&rdquo; can collect the student during school hours.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
