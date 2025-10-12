/**
 * Emergency Contacts Page - Enterprise Implementation
 *
 * Complete emergency contact management system with:
 * - Multi-channel communication support
 * - Contact verification
 * - Emergency notifications
 * - HIPAA-compliant data handling
 * - Filter persistence
 *
 * @module pages/EmergencyContacts
 */

import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { usePersistedFilters } from '@/hooks/useRouteState';
import { useStudents } from '@/hooks/useStudents';
import { useEmergencyContactsData } from './hooks/useEmergencyContactsData';
import { useContactFilters } from './hooks/useContactFilters';
import EmergencyContactsHeader from './components/EmergencyContactsHeader';
import EmergencyContactsStatistics from './components/EmergencyContactsStatistics';
import EmergencyContactsTabs from './components/EmergencyContactsTabs';
import EmergencyContactsOverview from './components/EmergencyContactsOverview';
import EmergencyContactsFilters from './components/EmergencyContactsFilters';
import EmergencyContactsList from './components/EmergencyContactsList';
import EmergencyContactsLoadingState from './components/EmergencyContactsLoadingState';
import EmergencyContactsNotificationForm from './components/EmergencyContactsNotificationForm';
import EmergencyContactModal from './components/EmergencyContactModal';
import type {
  EmergencyContactsTab,
  EmergencyContactFilters,
  Contact,
  ContactFormData,
  NotificationData,
} from './types';

/**
 * Main Emergency Contacts Page Component
 */
export default function EmergencyContacts() {
  // =====================
  // STATE MANAGEMENT
  // =====================
  const [activeTab, setActiveTab] = useState<EmergencyContactsTab>('overview');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);

  // Filter persistence
  const { filters, updateFilter, isRestored } = usePersistedFilters<EmergencyContactFilters>({
    storageKey: 'emergency-contact-filters',
    defaultFilters: {
      searchQuery: '',
      selectedStudent: '',
      priority: 'all',
      verified: 'all',
    },
    syncWithUrl: true,
    debounceMs: 300,
  });

  // Form state
  const [formData, setFormData] = useState<ContactFormData>({
    studentId: '',
    firstName: '',
    lastName: '',
    relationship: '',
    phoneNumber: '',
    email: '',
    address: '',
    priority: 'SECONDARY',
  });

  const [notificationData, setNotificationData] = useState<NotificationData>({
    message: '',
    type: 'general',
    priority: 'medium',
    channels: [],
  });

  // =====================
  // DATA FETCHING
  // =====================

  // Fetch students
  const { students } = useStudents({ page: 1, limit: 100 });

  // Set initial selected student when students load
  useEffect(() => {
    if (students.length > 0 && !filters.selectedStudent) {
      updateFilter('selectedStudent', students[0].id);
    }
  }, [students, filters.selectedStudent, updateFilter]);

  // Fetch emergency contacts data
  const {
    contacts,
    statistics,
    channels,
    notificationTypes,
    priorityLevels,
    contactsLoading,
    isCreating,
    isUpdating,
    isDeleting,
    isNotifying,
    isVerifying,
    createContact,
    updateContact,
    deleteContact,
    notifyContacts,
    verifyContact,
    refetchContacts,
  } = useEmergencyContactsData({
    selectedStudent: filters.selectedStudent,
    isRestored,
  });

  // Filter contacts
  const { filteredContacts } = useContactFilters({
    contacts,
    filters,
  });

  // =====================
  // EVENT HANDLERS
  // =====================

  /**
   * Handle form submission for adding/editing contact
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingContact) {
        await updateContact.mutateAsync({
          id: editingContact.id,
          data: formData,
        });
      } else {
        await createContact.mutateAsync({
          ...formData,
          studentId: filters.selectedStudent,
        });
      }
      setShowAddModal(false);
      resetForm();
      refetchContacts();
    } catch (error) {
      // Error is handled by the hook
    }
  };

  /**
   * Handle contact deletion
   */
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this contact?')) return;

    try {
      await deleteContact.mutateAsync({ id, studentId: filters.selectedStudent });
      refetchContacts();
    } catch (error) {
      // Error is handled by the hook
    }
  };

  /**
   * Handle notification submission
   */
  const handleNotify = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await notifyContacts.mutateAsync({
        studentId: filters.selectedStudent,
        notification: notificationData,
      });
      resetNotificationData();
    } catch (error) {
      // Error is handled by the hook
    }
  };

  /**
   * Handle contact verification
   */
  const handleVerify = async (contactId: string, method: 'sms' | 'email' | 'voice') => {
    try {
      await verifyContact.mutateAsync({
        contactId,
        studentId: filters.selectedStudent,
        method,
      });
      refetchContacts();
    } catch (error) {
      // Error is handled by the hook
    }
  };

  /**
   * Handle edit contact
   */
  const handleEdit = (contact: Contact) => {
    setEditingContact(contact);
    setFormData({
      studentId: contact.student?.id || '',
      firstName: contact.firstName,
      lastName: contact.lastName,
      relationship: contact.relationship,
      phoneNumber: contact.phoneNumber,
      email: contact.email || '',
      address: contact.address || '',
      priority: contact.priority,
    });
    setShowAddModal(true);
  };

  /**
   * Reset form data
   */
  const resetForm = () => {
    setFormData({
      studentId: '',
      firstName: '',
      lastName: '',
      relationship: '',
      phoneNumber: '',
      email: '',
      address: '',
      priority: 'SECONDARY',
    });
    setEditingContact(null);
  };

  /**
   * Reset notification data
   */
  const resetNotificationData = () => {
    setNotificationData({
      message: '',
      type: 'general',
      priority: 'medium',
      channels: [],
    });
  };

  /**
   * Handle modal close
   */
  const handleModalClose = () => {
    setShowAddModal(false);
    resetForm();
  };

  // =====================
  // LOADING STATE
  // =====================
  const isLoadingState = !isRestored || (contactsLoading && contacts.length === 0);

  // =====================
  // RENDER
  // =====================
  return (
    <div className="space-y-6">
      {/* Header */}
      <EmergencyContactsHeader onAddContact={() => setShowAddModal(true)} />

      {/* Statistics Cards */}
      <EmergencyContactsStatistics statistics={statistics} />

      {/* Tabs Navigation */}
      <EmergencyContactsTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Tab Content */}
      {activeTab === 'overview' && <EmergencyContactsOverview />}

      {activeTab === 'contacts' && (
        <div className="space-y-6">
          {/* Student Selector and Search */}
          <EmergencyContactsFilters
            filters={filters}
            students={students}
            onFilterChange={updateFilter}
          />

          {/* Contacts List */}
          {isLoadingState ? (
            <EmergencyContactsLoadingState />
          ) : (
            <EmergencyContactsList
              contacts={filteredContacts}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onVerify={handleVerify}
              onAddContact={() => setShowAddModal(true)}
            />
          )}
        </div>
      )}

      {activeTab === 'notify' && (
        <EmergencyContactsNotificationForm
          notificationData={notificationData}
          filters={filters}
          students={students}
          channels={channels}
          notificationTypes={notificationTypes}
          priorityLevels={priorityLevels}
          onFilterChange={updateFilter}
          onDataChange={setNotificationData}
          onSubmit={handleNotify}
          onReset={resetNotificationData}
        />
      )}

      {/* Add/Edit Modal */}
      <EmergencyContactModal
        isOpen={showAddModal}
        editingContact={editingContact}
        formData={formData}
        onFormChange={setFormData}
        onSubmit={handleSubmit}
        onClose={handleModalClose}
      />
    </div>
  );
}
