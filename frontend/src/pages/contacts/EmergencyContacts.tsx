import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Plus,
  Edit,
  Phone,
  Mail,
  MapPin,
  User,
  Users,
  Shield,
  AlertTriangle,
  Calendar,
  Clock,
  Trash2
} from 'lucide-react';
import toast from 'react-hot-toast';
import { contactsApi } from '../../services';

interface EmergencyContact {
  id: string;
  studentId: string;
  studentName: string;
  contactName: string;
  relationship: string;
  primaryPhone: string;
  secondaryPhone?: string;
  email?: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  isPrimary: boolean;
  canPickup: boolean;
  notes?: string;
  lastUpdated: string;
  updatedBy: string;
  emergencyOnly?: boolean;
}

interface ContactFilters {
  relationship: string;
  canPickup: string;
  isPrimary: string;
  emergencyOnly: string;
}

const EmergencyContacts: React.FC = () => {
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<EmergencyContact[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<ContactFilters>({
    relationship: '',
    canPickup: '',
    isPrimary: '',
    emergencyOnly: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState<EmergencyContact | null>(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    fetchContacts();
  }, []);

  useEffect(() => {
    filterContacts();
  }, [contacts, searchTerm, filters]);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      const mockContacts: EmergencyContact[] = [
        {
          id: '1',
          studentId: 'STU001',
          studentName: 'John Smith',
          contactName: 'Sarah Smith',
          relationship: 'Mother',
          primaryPhone: '(555) 123-4567',
          secondaryPhone: '(555) 987-6543',
          email: 'sarah.smith@email.com',
          address: {
            street: '123 Main Street',
            city: 'Springfield',
            state: 'IL',
            zipCode: '62701'
          },
          isPrimary: true,
          canPickup: true,
          notes: 'Works from home, available during school hours',
          lastUpdated: '2024-01-15T10:30:00Z',
          updatedBy: 'Admin User',
          emergencyOnly: false
        },
        {
          id: '2',
          studentId: 'STU001',
          studentName: 'John Smith',
          contactName: 'Michael Smith',
          relationship: 'Father',
          primaryPhone: '(555) 234-5678',
          email: 'michael.smith@email.com',
          address: {
            street: '123 Main Street',
            city: 'Springfield',
            state: 'IL',
            zipCode: '62701'
          },
          isPrimary: false,
          canPickup: true,
          notes: 'Travel frequently, check availability before calling',
          lastUpdated: '2024-01-10T14:20:00Z',
          updatedBy: 'School Nurse',
          emergencyOnly: false
        }
      ];
      setContacts(mockContacts);
    } catch (error) {
      console.error('Error fetching emergency contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterContacts = () => {
    let filtered = contacts;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(contact =>
        contact.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.relationship.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.primaryPhone.includes(searchTerm) ||
        (contact.email && contact.email.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Relationship filter
    if (filters.relationship) {
      filtered = filtered.filter(contact => contact.relationship === filters.relationship);
    }

    // Can pickup filter
    if (filters.canPickup) {
      const canPickup = filters.canPickup === 'true';
      filtered = filtered.filter(contact => contact.canPickup === canPickup);
    }

    // Primary contact filter
    if (filters.isPrimary) {
      const isPrimary = filters.isPrimary === 'true';
      filtered = filtered.filter(contact => contact.isPrimary === isPrimary);
    }

    // Emergency only filter
    if (filters.emergencyOnly) {
      const emergencyOnly = filters.emergencyOnly === 'true';
      filtered = filtered.filter(contact => contact.emergencyOnly === emergencyOnly);
    }

    setFilteredContacts(filtered);
  };

  const handleEditContact = (contact: EmergencyContact) => {
    setSelectedContact(contact)
    setEditFormData({
      contactName: contact.contactName,
      relationship: contact.relationship,
      primaryPhone: contact.primaryPhone,
      secondaryPhone: contact.secondaryPhone || '',
      email: contact.email || '',
      street: contact.address?.street || '',
      city: contact.address?.city || '',
      state: contact.address?.state || '',
      zipCode: contact.address?.zipCode || '',
      isPrimary: contact.isPrimary,
      canPickup: contact.canPickup,
      emergencyOnly: contact.emergencyOnly || false,
      notes: contact.notes || ''
    })
    setShowEditModal(true)
  }

  const [showEditModal, setShowEditModal] = useState(false)
  const [editLoading, setEditLoading] = useState(false)
  const [editFormData, setEditFormData] = useState({
    contactName: '',
    relationship: '',
    primaryPhone: '',
    secondaryPhone: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    isPrimary: false,
    canPickup: false,
    emergencyOnly: false,
    notes: ''
  })

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^(\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/
    return phoneRegex.test(phone)
  }

  const validateEmail = (email: string): boolean => {
    if (!email) return true // Email is optional
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleUpdateContact = async () => {
    if (!selectedContact) return

    // Validate required fields
    if (!editFormData.contactName.trim()) {
      toast.error('Contact name is required')
      return
    }
    if (!editFormData.relationship.trim()) {
      toast.error('Relationship is required')
      return
    }
    if (!editFormData.primaryPhone.trim()) {
      toast.error('Primary phone is required')
      return
    }

    // Validate phone format
    if (!validatePhone(editFormData.primaryPhone)) {
      toast.error('Primary phone number format is invalid')
      return
    }
    if (editFormData.secondaryPhone && !validatePhone(editFormData.secondaryPhone)) {
      toast.error('Secondary phone number format is invalid')
      return
    }

    // Validate email format
    if (!validateEmail(editFormData.email)) {
      toast.error('Email format is invalid')
      return
    }

    try {
      setEditLoading(true)

      // Prepare update data matching backend API expectations
      const updateData = {
        contactName: editFormData.contactName.trim(),
        relationship: editFormData.relationship.trim(),
        primaryPhone: editFormData.primaryPhone.trim(),
        secondaryPhone: editFormData.secondaryPhone.trim() || undefined,
        email: editFormData.email.trim() || undefined,
        address: {
          street: editFormData.street.trim(),
          city: editFormData.city.trim(),
          state: editFormData.state.trim(),
          zipCode: editFormData.zipCode.trim()
        },
        isPrimary: editFormData.isPrimary,
        canPickup: editFormData.canPickup,
        emergencyOnly: editFormData.emergencyOnly,
        notes: editFormData.notes.trim() || undefined
      }

      await contactsApi.update(selectedContact.id, updateData)

      // Update local state
      setContacts(prevContacts =>
        prevContacts.map(c =>
          c.id === selectedContact.id
            ? {
                ...c,
                contactName: updateData.contactName,
                relationship: updateData.relationship,
                primaryPhone: updateData.primaryPhone,
                secondaryPhone: updateData.secondaryPhone,
                email: updateData.email,
                address: updateData.address,
                isPrimary: updateData.isPrimary,
                canPickup: updateData.canPickup,
                emergencyOnly: updateData.emergencyOnly,
                notes: updateData.notes,
                lastUpdated: new Date().toISOString()
              }
            : c
        )
      )

      toast.success('Contact updated successfully')
      setShowEditModal(false)
      setSelectedContact(null)
    } catch (err) {
      console.error('Failed to update contact:', err)
      toast.error(err instanceof Error ? err.message : 'Failed to update contact. Please try again.')
    } finally {
      setEditLoading(false)
    }
  }

  const handleAddContact = () => {
    setSelectedContact(null);
    setShowContactModal(true);
  };

  const handleDeleteClick = (contact: EmergencyContact, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setSelectedContact(contact);
    setShowDeleteModal(true);
  };

  const handleDeleteContact = async () => {
    if (!selectedContact) return;

    try {
      setDeleteLoading(true);
      await contactsApi.delete(selectedContact.id);

      // Remove from local state
      setContacts(prevContacts => prevContacts.filter(c => c.id !== selectedContact.id));
      toast.success('Contact deleted successfully');
    } catch (err) {
      console.error('Failed to delete contact:', err);
      toast.error('Failed to delete contact. Please try again.');
    } finally {
      setDeleteLoading(false);
      setShowDeleteModal(false);
      setSelectedContact(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRelationshipIcon = (relationship: string) => {
    switch (relationship.toLowerCase()) {
      case 'mother':
      case 'father':
      case 'parent':
      case 'guardian':
        return <Users className="w-4 h-4 text-blue-500" />;
      case 'grandparent':
      case 'grandmother':
      case 'grandfather':
        return <User className="w-4 h-4 text-purple-500" />;
      case 'sibling':
      case 'brother':
      case 'sister':
        return <Users className="w-4 h-4 text-green-500" />;
      default:
        return <User className="w-4 h-4 text-gray-500" />;
    }
  };

  const getContactBadges = (contact: EmergencyContact) => {
    const badges = [];
    
    if (contact.isPrimary) {
      badges.push(
        <span key="primary" className="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
          <Shield className="w-3 h-3 mr-1" />
          Primary
        </span>
      );
    }
    
    if (contact.canPickup) {
      badges.push(
        <span key="pickup" className="inline-flex items-center px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
          <User className="w-3 h-3 mr-1" />
          Can Pickup
        </span>
      );
    }
    
    if (contact.emergencyOnly) {
      badges.push(
        <span key="emergency" className="inline-flex items-center px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
          <AlertTriangle className="w-3 h-3 mr-1" />
          Emergency Only
        </span>
      );
    }

    return badges;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Emergency Contacts</h1>
              <p className="mt-2 text-sm text-gray-600">
                Manage student emergency contact information for safety and communication
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <button
                onClick={handleAddContact}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Contact
              </button>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search by student name, contact name, relationship, phone, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </button>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Relationship
                  </label>
                  <select
                    value={filters.relationship}
                    onChange={(e) => setFilters({ ...filters, relationship: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    aria-label="Filter by relationship"
                  >
                    <option value="">All Relationships</option>
                    <option value="Mother">Mother</option>
                    <option value="Father">Father</option>
                    <option value="Guardian">Guardian</option>
                    <option value="Grandparent">Grandparent</option>
                    <option value="Sibling">Sibling</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pickup Authorization
                  </label>
                  <select
                    value={filters.canPickup}
                    onChange={(e) => setFilters({ ...filters, canPickup: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    aria-label="Filter by pickup authorization"
                  >
                    <option value="">All Contacts</option>
                    <option value="true">Can Pick Up</option>
                    <option value="false">Cannot Pick Up</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Primary Contact
                  </label>
                  <select
                    value={filters.isPrimary}
                    onChange={(e) => setFilters({ ...filters, isPrimary: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    aria-label="Filter by primary contact status"
                  >
                    <option value="">All Contacts</option>
                    <option value="true">Primary Contacts</option>
                    <option value="false">Secondary Contacts</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Emergency Only
                  </label>
                  <select
                    value={filters.emergencyOnly}
                    onChange={(e) => setFilters({ ...filters, emergencyOnly: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    aria-label="Filter by emergency only status"
                  >
                    <option value="">All Contacts</option>
                    <option value="true">Emergency Only</option>
                    <option value="false">Regular Contacts</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={() => setFilters({
                      relationship: '',
                      canPickup: '',
                      isPrimary: '',
                      emergencyOnly: ''
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Contacts List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              Emergency Contacts ({filteredContacts.length})
            </h2>
          </div>
          <div className="divide-y divide-gray-200">
            {filteredContacts.map((contact) => (
              <div key={contact.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        {getRelationshipIcon(contact.relationship)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-lg font-medium text-gray-900">
                            {contact.contactName}
                          </h3>
                          <span className="text-sm text-gray-500">
                            ({contact.relationship})
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">
                          Student: <span className="font-medium">{contact.studentName}</span>
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                          <div className="space-y-2">
                            <div className="flex items-center text-sm text-gray-600">
                              <Phone className="w-4 h-4 mr-2 text-gray-400" />
                              <span className="font-medium">Primary:</span>
                              <a href={`tel:${contact.primaryPhone}`} className="ml-1 text-blue-600 hover:text-blue-800">
                                {contact.primaryPhone}
                              </a>
                            </div>
                            {contact.secondaryPhone && (
                              <div className="flex items-center text-sm text-gray-600">
                                <Phone className="w-4 h-4 mr-2 text-gray-400" />
                                <span className="font-medium">Secondary:</span>
                                <a href={`tel:${contact.secondaryPhone}`} className="ml-1 text-blue-600 hover:text-blue-800">
                                  {contact.secondaryPhone}
                                </a>
                              </div>
                            )}
                            {contact.email && (
                              <div className="flex items-center text-sm text-gray-600">
                                <Mail className="w-4 h-4 mr-2 text-gray-400" />
                                <a href={`mailto:${contact.email}`} className="text-blue-600 hover:text-blue-800">
                                  {contact.email}
                                </a>
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="flex items-start text-sm text-gray-600">
                              <MapPin className="w-4 h-4 mr-2 mt-0.5 text-gray-400" />
                              <div>
                                <div>{contact.address.street}</div>
                                <div>{contact.address.city}, {contact.address.state} {contact.address.zipCode}</div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-3">
                          {getContactBadges(contact).map((badge, index) => (
                            <span key={index}>{badge}</span>
                          ))}
                        </div>

                        {contact.notes && (
                          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-3">
                            <p className="text-sm text-yellow-800">
                              <strong>Notes:</strong> {contact.notes}
                            </p>
                          </div>
                        )}

                        <div className="flex items-center text-xs text-gray-500">
                          <Clock className="w-3 h-3 mr-1" />
                          Last updated {formatDate(contact.lastUpdated)} by {contact.updatedBy}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex-shrink-0 ml-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditContact(contact)}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </button>
                      <button
                        onClick={(e) => handleDeleteClick(contact, e)}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        title="Delete Contact"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {filteredContacts.length === 0 && (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No emergency contacts found</h3>
                <p className="text-gray-500">
                  {searchTerm || Object.values(filters).some(f => f)
                    ? 'Try adjusting your search criteria or filters'
                    : 'Add the first emergency contact to get started'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedContact && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div 
              className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
              onClick={() => {
                if (!deleteLoading) {
                  setShowDeleteModal(false);
                  setSelectedContact(null);
                }
              }}
            ></div>

            {/* Center modal */}
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

            {/* Modal panel */}
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left flex-1">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Delete Emergency Contact
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Are you sure you want to delete <strong>{selectedContact.contactName}</strong> ({selectedContact.relationship}) for student <strong>{selectedContact.studentName}</strong>?
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      This action cannot be undone.
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleDeleteContact}
                  disabled={deleteLoading}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                >
                  {deleteLoading ? 'Deleting...' : 'Delete Contact'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedContact(null);
                  }}
                  disabled={deleteLoading}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Contact Modal */}
      {showEditModal && selectedContact && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div
              className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
              onClick={() => {
                if (!editLoading) {
                  setShowEditModal(false);
                  setSelectedContact(null);
                }
              }}
            ></div>

            {/* Center modal */}
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

            {/* Modal panel */}
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full sm:p-6">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                  <Edit className="h-6 w-6 text-blue-600" />
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left flex-1">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Edit Emergency Contact
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Update contact information for {selectedContact.studentName}
                  </p>
                </div>
              </div>

              <div className="mt-5">
                <form className="space-y-4">
                  {/* Contact Name and Relationship */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="edit-contact-name" className="block text-sm font-medium text-gray-700">
                        Contact Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="edit-contact-name"
                        value={editFormData.contactName}
                        onChange={(e) => setEditFormData({ ...editFormData, contactName: e.target.value })}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="Full name"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="edit-relationship" className="block text-sm font-medium text-gray-700">
                        Relationship <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="edit-relationship"
                        value={editFormData.relationship}
                        onChange={(e) => setEditFormData({ ...editFormData, relationship: e.target.value })}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        required
                      >
                        <option value="">Select Relationship</option>
                        <option value="Mother">Mother</option>
                        <option value="Father">Father</option>
                        <option value="Guardian">Guardian</option>
                        <option value="Grandparent">Grandparent</option>
                        <option value="Grandmother">Grandmother</option>
                        <option value="Grandfather">Grandfather</option>
                        <option value="Sibling">Sibling</option>
                        <option value="Brother">Brother</option>
                        <option value="Sister">Sister</option>
                        <option value="Aunt">Aunt</option>
                        <option value="Uncle">Uncle</option>
                        <option value="Family Friend">Family Friend</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  {/* Phone Numbers */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="edit-primary-phone" className="block text-sm font-medium text-gray-700">
                        Primary Phone <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        id="edit-primary-phone"
                        value={editFormData.primaryPhone}
                        onChange={(e) => setEditFormData({ ...editFormData, primaryPhone: e.target.value })}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="(555) 123-4567"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="edit-secondary-phone" className="block text-sm font-medium text-gray-700">
                        Secondary Phone
                      </label>
                      <input
                        type="tel"
                        id="edit-secondary-phone"
                        value={editFormData.secondaryPhone}
                        onChange={(e) => setEditFormData({ ...editFormData, secondaryPhone: e.target.value })}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="(555) 987-6543"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="edit-email" className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      id="edit-email"
                      value={editFormData.email}
                      onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="contact@example.com"
                    />
                  </div>

                  {/* Address */}
                  <div>
                    <label htmlFor="edit-street" className="block text-sm font-medium text-gray-700">
                      Street Address
                    </label>
                    <input
                      type="text"
                      id="edit-street"
                      value={editFormData.street}
                      onChange={(e) => setEditFormData({ ...editFormData, street: e.target.value })}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="123 Main Street"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="edit-city" className="block text-sm font-medium text-gray-700">
                        City
                      </label>
                      <input
                        type="text"
                        id="edit-city"
                        value={editFormData.city}
                        onChange={(e) => setEditFormData({ ...editFormData, city: e.target.value })}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="Springfield"
                      />
                    </div>
                    <div>
                      <label htmlFor="edit-state" className="block text-sm font-medium text-gray-700">
                        State
                      </label>
                      <input
                        type="text"
                        id="edit-state"
                        value={editFormData.state}
                        onChange={(e) => setEditFormData({ ...editFormData, state: e.target.value })}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="IL"
                        maxLength={2}
                      />
                    </div>
                    <div>
                      <label htmlFor="edit-zip" className="block text-sm font-medium text-gray-700">
                        ZIP Code
                      </label>
                      <input
                        type="text"
                        id="edit-zip"
                        value={editFormData.zipCode}
                        onChange={(e) => setEditFormData({ ...editFormData, zipCode: e.target.value })}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="62701"
                        maxLength={10}
                      />
                    </div>
                  </div>

                  {/* Checkboxes */}
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={editFormData.isPrimary}
                        onChange={(e) => setEditFormData({ ...editFormData, isPrimary: e.target.checked })}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">Primary Contact</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={editFormData.canPickup}
                        onChange={(e) => setEditFormData({ ...editFormData, canPickup: e.target.checked })}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">Authorized to Pick Up Student</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={editFormData.emergencyOnly}
                        onChange={(e) => setEditFormData({ ...editFormData, emergencyOnly: e.target.checked })}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">Emergency Contact Only</span>
                    </label>
                  </div>

                  {/* Notes */}
                  <div>
                    <label htmlFor="edit-notes" className="block text-sm font-medium text-gray-700">
                      Notes
                    </label>
                    <textarea
                      id="edit-notes"
                      rows={3}
                      value={editFormData.notes}
                      onChange={(e) => setEditFormData({ ...editFormData, notes: e.target.value })}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Additional notes about availability, restrictions, etc."
                    />
                  </div>
                </form>
              </div>

              <div className="mt-5 sm:mt-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleUpdateContact}
                  disabled={editLoading || !editFormData.contactName.trim() || !editFormData.relationship || !editFormData.primaryPhone.trim()}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {editLoading ? 'Updating...' : 'Update Contact'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedContact(null);
                  }}
                  disabled={editLoading}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmergencyContacts;
