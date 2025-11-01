'use client';

/**
 * Force dynamic rendering for real-time form data - healthcare forms require current state
 */


import React, { useState, useEffect, useMemo } from 'react';
import { 
  FileText, 
  Plus, 
  Filter,
  Upload,
  Edit,
  Eye,
  Copy,
  Trash2,
  Archive,
  Share,
  BarChart3,
  AlertCircle,
  Pause,
  Play,
  Users,
  FileCheck,
  Shield,
  Lock,
  ExternalLink,
  TrendingUp,
  X,
  Phone
} from 'lucide-react';
import Link from 'next/link';
import { Card } from '@/components/ui/layout/Card';
import { Button } from '@/components/ui/Button';
import { SearchInput } from '@/components/ui/SearchInput';
import { Badge } from '@/components/ui/Badge';

// Import server actions
import { 
  getForms, 
  getFormsDashboardData,
  getFormStats,
  type FormDefinition 
} from '@/app/forms/actions';

// Healthcare form types and categories
type FormType = 'enrollment' | 'health_screening' | 'incident_report' | 'permission_slip' | 'medical_consent' | 'emergency_contact' | 'allergy_form' | 'medication_authorization' | 'assessment' | 'survey' | 'other';
type FormStatus = 'draft' | 'published' | 'paused' | 'archived';
type FormPriority = 'low' | 'normal' | 'high' | 'critical';

interface FormField {
  id: string;
  type: 'text' | 'textarea' | 'number' | 'email' | 'phone' | 'date' | 'time' | 'select' | 'radio' | 'checkbox' | 'file' | 'signature' | 'section_header' | 'paragraph';
  label: string;
  placeholder?: string;
  required: boolean;
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    customMessage?: string;
  };
  options?: string[];
  conditionalLogic?: {
    dependsOn: string;
    condition: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than';
    value: string;
  };
}



interface HealthcareForm {
  id: string;
  title: string;
  description: string;
  type: FormType;
  status: FormStatus;
  priority: FormPriority;
  version: number;
  createdBy: {
    id: string;
    name: string;
    role: string;
  };
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
  fields: FormField[];
  settings: {
    allowAnonymous: boolean;
    requireAuthentication: boolean;
    multipleSubmissions: boolean;
    autoSave: boolean;
    progressBar: boolean;
    thankYouMessage: string;
    redirectUrl?: string;
    emailNotifications: string[];
    dataRetentionDays?: number;
    requiresHIPAAConsent: boolean;
  };
  analytics: {
    views: number;
    submissions: number;
    completionRate: number;
    averageCompletionTime: number;
    lastSubmission?: Date;
    dropOffPoints: Array<{ fieldId: string; dropOffRate: number }>;
  };
  sharing: {
    isPublic: boolean;
    publicUrl?: string;
    qrCodeUrl?: string;
    password?: string;
    expiresAt?: Date;
  };
  tags: string[];
}

interface FormStats {
  totalForms: number;
  activeForms: number;
  draftForms: number;
  totalResponses: number;
  todayResponses: number;
  averageCompletionRate: number;
  criticalForms: number;
  expiringSoon: number;
}

interface FormsContentProps {
  initialForms?: HealthcareForm[];
  userRole?: string;
}

const FormsContent: React.FC<FormsContentProps> = ({ 
  initialForms = []
}) => {
  const [forms, setForms] = useState<HealthcareForm[]>(initialForms);
  const [loading, setLoading] = useState(true);
  const [selectedForm, setSelectedForm] = useState<HealthcareForm | null>(null);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [statusFilter, setStatusFilter] = useState<FormStatus | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<FormType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedForms, setSelectedForms] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<'title' | 'created' | 'updated' | 'responses' | 'completion_rate'>('updated');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Simulate loading healthcare forms with realistic data
  useEffect(() => {
    const loadForms = async () => {
      try {
        setLoading(true);
        
        // Load forms from server actions
        const formDefinitions = await getForms();
        
        // Transform FormDefinition[] to HealthcareForm[] for UI compatibility
        const transformedForms: HealthcareForm[] = formDefinitions.map((form: FormDefinition) => ({
          id: form.id,
          title: form.name || 'Untitled Form',
          description: form.description || 'No description available',
          type: (form.category?.toLowerCase() || 'other') as FormType,
          status: (form.status?.toLowerCase() || 'draft') as FormStatus,
          priority: 'normal' as FormPriority, // Default priority
          version: 1, // Default version
          createdBy: { 
            id: form.createdBy, 
            name: 'Unknown User', 
            role: 'Administrator' 
          },
          createdAt: new Date(form.createdAt),
          updatedAt: new Date(form.updatedAt),
          publishedAt: form.status === 'PUBLISHED' ? new Date(form.updatedAt) : undefined,
          fields: (form.fields || []).map((field: FormDefinition['fields'][number]) => ({
            ...field,
            type: field.type === 'ssn' ? 'text' : field.type === 'medical' ? 'textarea' : field.type,
            options: field.options ? field.options.map((opt: {label: string; value: string} | string) => typeof opt === 'string' ? opt : opt.label || opt.value) : undefined
          } as FormField)),
          settings: {
            allowAnonymous: false,
            requireAuthentication: true,
            multipleSubmissions: false,
            autoSave: true,
            progressBar: true,
            thankYouMessage: 'Thank you for your submission.',
            emailNotifications: [],
            dataRetentionDays: 365,
            requiresHIPAAConsent: true
          },
          analytics: {
            views: 0,
            submissions: 0,
            completionRate: 85.0,
            averageCompletionTime: 3.5,
            lastSubmission: undefined,
            dropOffPoints: []
          },
          sharing: {
            isPublic: false,
            publicUrl: `https://forms.whitecross.edu/${form.id}`,
            qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://forms.whitecross.edu/${form.id}`
          },
          tags: []
        }));
        
        setForms(transformedForms);
      } catch (error) {
        console.error('Failed to load forms:', error);
        
        // Fallback to mock data if server actions fail
        const mockForms: HealthcareForm[] = [
        {
          id: 'form-001',
          title: 'Daily Health Screening',
          description: 'COVID-19 health screening form for daily student and staff check-in',
          type: 'health_screening',
          status: 'published',
          priority: 'high',
          version: 3,
          createdBy: { id: 'user-001', name: 'Jennifer Smith', role: 'School Nurse' },
          createdAt: new Date('2024-09-01T08:00:00'),
          updatedAt: new Date('2024-10-30T14:30:00'),
          publishedAt: new Date('2024-09-05T09:00:00'),
          fields: [
            { id: 'temp', type: 'number', label: 'Temperature (°F)', required: true, validation: { minLength: 2, maxLength: 5 } },
            { id: 'symptoms', type: 'checkbox', label: 'Symptoms', required: true, options: ['Fever', 'Cough', 'Sore throat', 'Headache', 'None'] },
            { id: 'exposure', type: 'radio', label: 'Close contact with COVID-19?', required: true, options: ['Yes', 'No', 'Unsure'] }
          ],
          settings: {
            allowAnonymous: false,
            requireAuthentication: true,
            multipleSubmissions: true,
            autoSave: true,
            progressBar: true,
            thankYouMessage: 'Thank you for completing the daily health screening.',
            emailNotifications: ['nurse@school.edu'],
            dataRetentionDays: 30,
            requiresHIPAAConsent: true
          },
          analytics: {
            views: 2847,
            submissions: 2456,
            completionRate: 86.3,
            averageCompletionTime: 2.1,
            lastSubmission: new Date('2024-10-31T08:45:00'),
            dropOffPoints: [
              { fieldId: 'symptoms', dropOffRate: 8.2 },
              { fieldId: 'exposure', dropOffRate: 5.5 }
            ]
          },
          sharing: {
            isPublic: true,
            publicUrl: 'https://forms.whitecross.edu/health-screening',
            qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://forms.whitecross.edu/health-screening'
          },
          tags: ['covid', 'daily', 'screening', 'required']
        },
        {
          id: 'form-002',
          title: 'Student Enrollment Form',
          description: 'Comprehensive enrollment form for new students including health information and emergency contacts',
          type: 'enrollment',
          status: 'published',
          priority: 'critical',
          version: 5,
          createdBy: { id: 'user-002', name: 'Administrator Davis', role: 'Principal' },
          createdAt: new Date('2024-08-01T10:00:00'),
          updatedAt: new Date('2024-10-25T16:00:00'),
          publishedAt: new Date('2024-08-15T09:00:00'),
          fields: [
            { id: 'student_name', type: 'text', label: 'Student Full Name', required: true },
            { id: 'dob', type: 'date', label: 'Date of Birth', required: true },
            { id: 'grade', type: 'select', label: 'Grade Level', required: true, options: ['K', '1', '2', '3', '4', '5'] },
            { id: 'allergies', type: 'textarea', label: 'Known Allergies', required: false },
            { id: 'emergency_contact', type: 'text', label: 'Emergency Contact Name', required: true },
            { id: 'emergency_phone', type: 'phone', label: 'Emergency Contact Phone', required: true }
          ],
          settings: {
            allowAnonymous: false,
            requireAuthentication: false,
            multipleSubmissions: false,
            autoSave: true,
            progressBar: true,
            thankYouMessage: 'Thank you for enrolling your student. We will review your application within 2 business days.',
            emailNotifications: ['enrollment@school.edu', 'nurse@school.edu'],
            requiresHIPAAConsent: true
          },
          analytics: {
            views: 456,
            submissions: 387,
            completionRate: 84.9,
            averageCompletionTime: 12.3,
            lastSubmission: new Date('2024-10-30T15:20:00'),
            dropOffPoints: [
              { fieldId: 'allergies', dropOffRate: 12.1 },
              { fieldId: 'emergency_phone', dropOffRate: 3.2 }
            ]
          },
          sharing: {
            isPublic: true,
            publicUrl: 'https://forms.whitecross.edu/enrollment'
          },
          tags: ['enrollment', 'new-student', 'required', 'health-info']
        },
        {
          id: 'form-003',
          title: 'Incident Report Form',
          description: 'Report accidents, injuries, or behavioral incidents that occur during school hours',
          type: 'incident_report',
          status: 'published',
          priority: 'high',
          version: 2,
          createdBy: { id: 'user-001', name: 'Jennifer Smith', role: 'School Nurse' },
          createdAt: new Date('2024-09-15T11:00:00'),
          updatedAt: new Date('2024-10-20T09:30:00'),
          publishedAt: new Date('2024-09-20T08:00:00'),
          fields: [
            { id: 'student_name', type: 'text', label: 'Student Name', required: true },
            { id: 'incident_date', type: 'date', label: 'Date of Incident', required: true },
            { id: 'incident_time', type: 'time', label: 'Time of Incident', required: true },
            { id: 'location', type: 'select', label: 'Location', required: true, options: ['Classroom', 'Playground', 'Cafeteria', 'Hallway', 'Gymnasium', 'Other'] },
            { id: 'description', type: 'textarea', label: 'Incident Description', required: true },
            { id: 'injury_type', type: 'checkbox', label: 'Type of Injury', required: false, options: ['Bruise', 'Cut', 'Scrape', 'Sprain', 'No injury', 'Other'] },
            { id: 'first_aid', type: 'radio', label: 'First aid provided?', required: true, options: ['Yes', 'No'] },
            { id: 'parent_contacted', type: 'radio', label: 'Parent contacted?', required: true, options: ['Yes', 'No'] }
          ],
          settings: {
            allowAnonymous: false,
            requireAuthentication: true,
            multipleSubmissions: true,
            autoSave: true,
            progressBar: false,
            thankYouMessage: 'Incident report submitted. The nurse will follow up as needed.',
            emailNotifications: ['nurse@school.edu', 'principal@school.edu'],
            requiresHIPAAConsent: true
          },
          analytics: {
            views: 189,
            submissions: 156,
            completionRate: 82.5,
            averageCompletionTime: 7.8,
            lastSubmission: new Date('2024-10-29T14:15:00'),
            dropOffPoints: [
              { fieldId: 'description', dropOffRate: 15.3 },
              { fieldId: 'first_aid', dropOffRate: 2.1 }
            ]
          },
          sharing: {
            isPublic: false,
            password: 'incident2024'
          },
          tags: ['incident', 'safety', 'injury', 'required']
        },
        {
          id: 'form-004',
          title: 'Medication Authorization Form',
          description: 'Authorization for school staff to administer medication to students',
          type: 'medical_consent',
          status: 'published',
          priority: 'critical',
          version: 1,
          createdBy: { id: 'user-001', name: 'Jennifer Smith', role: 'School Nurse' },
          createdAt: new Date('2024-10-01T09:00:00'),
          updatedAt: new Date('2024-10-15T13:45:00'),
          publishedAt: new Date('2024-10-05T08:00:00'),
          fields: [
            { id: 'student_name', type: 'text', label: 'Student Name', required: true },
            { id: 'medication_name', type: 'text', label: 'Medication Name', required: true },
            { id: 'dosage', type: 'text', label: 'Dosage', required: true },
            { id: 'administration_time', type: 'select', label: 'Administration Time', required: true, options: ['Morning', 'Lunch', 'Afternoon', 'As needed'] },
            { id: 'prescribing_doctor', type: 'text', label: 'Prescribing Doctor', required: true },
            { id: 'parent_signature', type: 'signature', label: 'Parent/Guardian Signature', required: true },
            { id: 'special_instructions', type: 'textarea', label: 'Special Instructions', required: false }
          ],
          settings: {
            allowAnonymous: false,
            requireAuthentication: false,
            multipleSubmissions: false,
            autoSave: true,
            progressBar: true,
            thankYouMessage: 'Medication authorization received. Please bring the medication to the school nurse.',
            emailNotifications: ['nurse@school.edu'],
            requiresHIPAAConsent: true
          },
          analytics: {
            views: 234,
            submissions: 198,
            completionRate: 84.6,
            averageCompletionTime: 9.2,
            lastSubmission: new Date('2024-10-28T11:30:00'),
            dropOffPoints: [
              { fieldId: 'parent_signature', dropOffRate: 11.5 },
              { fieldId: 'special_instructions', dropOffRate: 4.3 }
            ]
          },
          sharing: {
            isPublic: true,
            publicUrl: 'https://forms.whitecross.edu/medication-auth'
          },
          tags: ['medication', 'authorization', 'signature', 'required']
        },
        {
          id: 'form-005',
          title: 'Field Trip Permission Slip',
          description: 'Permission form for student participation in field trips and off-campus activities',
          type: 'permission_slip',
          status: 'draft',
          priority: 'normal',
          version: 1,
          createdBy: { id: 'user-003', name: 'Teacher Wilson', role: 'Teacher' },
          createdAt: new Date('2024-10-25T14:00:00'),
          updatedAt: new Date('2024-10-30T10:15:00'),
          fields: [
            { id: 'student_name', type: 'text', label: 'Student Name', required: true },
            { id: 'trip_destination', type: 'text', label: 'Trip Destination', required: true },
            { id: 'trip_date', type: 'date', label: 'Trip Date', required: true },
            { id: 'permission_granted', type: 'radio', label: 'Permission Granted', required: true, options: ['Yes, my child may participate', 'No, my child may not participate'] },
            { id: 'emergency_contact', type: 'phone', label: 'Emergency Contact Phone', required: true },
            { id: 'special_needs', type: 'textarea', label: 'Special Needs/Medical Conditions', required: false }
          ],
          settings: {
            allowAnonymous: false,
            requireAuthentication: false,
            multipleSubmissions: false,
            autoSave: true,
            progressBar: false,
            thankYouMessage: 'Permission slip received. Thank you!',
            emailNotifications: ['teacher@school.edu'],
            requiresHIPAAConsent: false
          },
          analytics: {
            views: 45,
            submissions: 0,
            completionRate: 0,
            averageCompletionTime: 0,
            dropOffPoints: []
          },
          sharing: {
            isPublic: false
          },
          tags: ['field-trip', 'permission', 'draft']
        },
        {
          id: 'form-006',
          title: 'Annual Health Assessment',
          description: 'Comprehensive health assessment form for annual student health evaluations',
          type: 'assessment',
          status: 'paused',
          priority: 'normal',
          version: 2,
          createdBy: { id: 'user-001', name: 'Jennifer Smith', role: 'School Nurse' },
          createdAt: new Date('2024-08-15T09:00:00'),
          updatedAt: new Date('2024-10-01T16:00:00'),
          publishedAt: new Date('2024-09-01T08:00:00'),
          fields: [
            { id: 'student_info', type: 'section_header', label: 'Student Information', required: false },
            { id: 'height', type: 'number', label: 'Height (inches)', required: true },
            { id: 'weight', type: 'number', label: 'Weight (pounds)', required: true },
            { id: 'vision_screening', type: 'radio', label: 'Vision Screening Result', required: true, options: ['Pass', 'Refer', 'Not tested'] },
            { id: 'hearing_screening', type: 'radio', label: 'Hearing Screening Result', required: true, options: ['Pass', 'Refer', 'Not tested'] },
            { id: 'immunizations', type: 'checkbox', label: 'Immunizations Up to Date', required: true, options: ['Yes', 'No - needs updates'] }
          ],
          settings: {
            allowAnonymous: false,
            requireAuthentication: true,
            multipleSubmissions: false,
            autoSave: true,
            progressBar: true,
            thankYouMessage: 'Health assessment completed. Thank you!',
            emailNotifications: ['nurse@school.edu'],
            requiresHIPAAConsent: true
          },
          analytics: {
            views: 567,
            submissions: 423,
            completionRate: 74.6,
            averageCompletionTime: 8.5,
            lastSubmission: new Date('2024-09-30T15:45:00'),
            dropOffPoints: [
              { fieldId: 'immunizations', dropOffRate: 18.2 },
              { fieldId: 'hearing_screening', dropOffRate: 7.2 }
            ]
          },
          sharing: {
            isPublic: false,
            expiresAt: new Date('2025-01-31T23:59:59')
          },
          tags: ['health', 'assessment', 'annual', 'paused']
        }
      ];

        setForms(mockForms);
      } finally {
        setLoading(false);
      }
    };

    loadForms();
  }, []);

  // Calculate form statistics
  const stats: FormStats = useMemo(() => {
    const oneWeekFromNow = new Date();
    oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7);
    
    return {
      totalForms: forms.length,
      activeForms: forms.filter(form => form.status === 'published').length,
      draftForms: forms.filter(form => form.status === 'draft').length,
      totalResponses: forms.reduce((sum, form) => sum + form.analytics.submissions, 0),
      todayResponses: forms.filter(form => 
        form.analytics.lastSubmission && 
        form.analytics.lastSubmission.toDateString() === new Date().toDateString()
      ).length,
      averageCompletionRate: forms.length > 0 
        ? forms.reduce((sum, form) => sum + form.analytics.completionRate, 0) / forms.length 
        : 0,
      criticalForms: forms.filter(form => form.priority === 'critical').length,
      expiringSoon: forms.filter(form => 
        form.sharing.expiresAt && 
        form.sharing.expiresAt < oneWeekFromNow
      ).length
    };
  }, [forms]);

  // Filter and sort forms
  const filteredForms = useMemo(() => {
    let filtered = forms;

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(form => form.status === statusFilter);
    }

    // Apply type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(form => form.type === typeFilter);
    }

    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(form =>
        form.title.toLowerCase().includes(query) ||
        form.description.toLowerCase().includes(query) ||
        form.tags.some(tag => tag.toLowerCase().includes(query)) ||
        form.createdBy.name.toLowerCase().includes(query)
      );
    }

    // Sort forms
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'created':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case 'updated':
          comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
          break;
        case 'responses':
          comparison = a.analytics.submissions - b.analytics.submissions;
          break;
        case 'completion_rate':
          comparison = a.analytics.completionRate - b.analytics.completionRate;
          break;
        default:
          comparison = new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [forms, statusFilter, typeFilter, searchQuery, sortBy, sortOrder]);

  // Form action handlers
  const handleDuplicateForm = (formId: string) => {
    const formToDuplicate = forms.find(f => f.id === formId);
    if (formToDuplicate) {
      const newForm: HealthcareForm = {
        ...formToDuplicate,
        id: `form-${Date.now()}`,
        title: `${formToDuplicate.title} (Copy)`,
        status: 'draft',
        version: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        publishedAt: undefined,
        analytics: {
          views: 0,
          submissions: 0,
          completionRate: 0,
          averageCompletionTime: 0,
          dropOffPoints: []
        }
      };
      setForms(prev => [newForm, ...prev]);
    }
  };

  const handleToggleStatus = (formId: string) => {
    setForms(prev => prev.map(form => {
      if (form.id === formId) {
        let newStatus: FormStatus;
        switch (form.status) {
          case 'draft':
            newStatus = 'published';
            break;
          case 'published':
            newStatus = 'paused';
            break;
          case 'paused':
            newStatus = 'published';
            break;
          case 'archived':
            newStatus = 'published';
            break;
          default:
            newStatus = form.status;
        }
        return {
          ...form,
          status: newStatus,
          updatedAt: new Date(),
          publishedAt: newStatus === 'published' ? new Date() : form.publishedAt
        };
      }
      return form;
    }));
  };

  const handleArchiveForm = (formId: string) => {
    if (window.confirm('Are you sure you want to archive this form? It will stop accepting responses.')) {
      setForms(prev => prev.map(form =>
        form.id === formId
          ? { ...form, status: 'archived' as FormStatus, updatedAt: new Date() }
          : form
      ));
    }
  };



  const handleBulkAction = (action: 'publish' | 'archive' | 'delete') => {
    const formIds = Array.from(selectedForms);
    
    if (action === 'delete' && !window.confirm(`Are you sure you want to delete ${formIds.length} forms? This action cannot be undone.`)) {
      return;
    }

    if (action === 'archive' && !window.confirm(`Are you sure you want to archive ${formIds.length} forms?`)) {
      return;
    }

    setForms(prev => {
      if (action === 'delete') {
        return prev.filter(form => !formIds.includes(form.id));
      }
      
      return prev.map(form => {
        if (!formIds.includes(form.id)) return form;
        
        switch (action) {
          case 'publish':
            return { ...form, status: 'published' as FormStatus, updatedAt: new Date(), publishedAt: new Date() };
          case 'archive':
            return { ...form, status: 'archived' as FormStatus, updatedAt: new Date() };
          default:
            return form;
        }
      });
    });

    setSelectedForms(new Set());
  };

  const getStatusBadge = (status: FormStatus) => {
    switch (status) {
      case 'published':
        return <Badge className="bg-green-100 text-green-800">Published</Badge>;
      case 'draft':
        return <Badge className="bg-gray-100 text-gray-800">Draft</Badge>;
      case 'paused':
        return <Badge className="bg-yellow-100 text-yellow-800">Paused</Badge>;
      case 'archived':
        return <Badge className="bg-red-100 text-red-800">Archived</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>;
    }
  };

  const getPriorityBadge = (priority: FormPriority) => {
    switch (priority) {
      case 'critical':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Critical</Badge>;
      case 'high':
        return <Badge className="bg-orange-100 text-orange-800 border-orange-200">High</Badge>;
      case 'normal':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Normal</Badge>;
      case 'low':
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Low</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Normal</Badge>;
    }
  };

  const getTypeIcon = (type: FormType) => {
    switch (type) {
      case 'enrollment':
        return <Users className="h-4 w-4 text-blue-500" />;
      case 'health_screening':
        return <Shield className="h-4 w-4 text-green-500" />;
      case 'incident_report':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'permission_slip':
        return <FileCheck className="h-4 w-4 text-indigo-500" />;
      case 'medical_consent':
        return <Lock className="h-4 w-4 text-purple-500" />;
      case 'emergency_contact':
        return <Phone className="h-4 w-4 text-orange-500" />;
      case 'assessment':
        return <BarChart3 className="h-4 w-4 text-cyan-500" />;
      case 'survey':
        return <TrendingUp className="h-4 w-4 text-pink-500" />;
      default:
        return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCompletionRate = (rate: number): string => {
    return `${rate.toFixed(1)}%`;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Loading skeleton */}
        <div className="grid gap-4 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <div className="p-4 animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
            </Card>
          ))}
        </div>
        <Card>
          <div className="p-6 animate-pulse">
            <div className="h-6 bg-gray-200 rounded mb-4"></div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-48 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Healthcare Form Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="hover:shadow-md transition-shadow">
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Forms</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalForms}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {stats.activeForms} active, {stats.draftForms} drafts
                </p>
              </div>
              <FileText className="h-8 w-8 text-blue-500" />
            </div>
          </div>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Responses</p>
                <p className="text-2xl font-bold text-green-600 mt-1">{stats.totalResponses}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {stats.todayResponses} today
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-green-500" />
            </div>
          </div>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Completion</p>
                <p className="text-2xl font-bold text-purple-600 mt-1">
                  {formatCompletionRate(stats.averageCompletionRate)}
                </p>
                <p className="text-xs text-gray-500 mt-1">Across all forms</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-500" />
            </div>
          </div>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Critical Forms</p>
                <p className="text-2xl font-bold text-red-600 mt-1">{stats.criticalForms}</p>
                {stats.expiringSoon > 0 && (
                  <p className="text-xs text-orange-600 mt-1">
                    {stats.expiringSoon} expiring soon
                  </p>
                )}
              </div>
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
          </div>
        </Card>
      </div>

      {/* Form Management Actions and Filters */}
      <Card>
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Primary Actions */}
            <div className="flex items-center gap-3">
              <Link href="/forms/new">
                <Button variant="primary">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Form
                </Button>
              </Link>
              
              <Button variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Import Form
              </Button>

              {selectedForms.size > 0 && (
                <div className="flex items-center gap-2 border-l border-gray-200 pl-3">
                  <span className="text-sm text-gray-600">
                    {selectedForms.size} selected
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkAction('publish')}
                  >
                    <Play className="h-4 w-4 mr-1" />
                    Publish
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkAction('archive')}
                  >
                    <Archive className="h-4 w-4 mr-1" />
                    Archive
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkAction('delete')}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              )}
            </div>

            {/* Search, Filter, and View Controls */}
            <div className="flex items-center gap-3">
              <div className="w-64">
                <SearchInput
                  value={searchQuery}
                  onChange={setSearchQuery}
                  placeholder="Search forms, descriptions, or tags..."
                />
              </div>
              
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className={showFilters ? 'bg-gray-100' : ''}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>

              <div className="flex rounded-lg border border-gray-300">
                <button
                  onClick={() => setView('grid')}
                  className={`px-3 py-2 text-sm ${
                    view === 'grid'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setView('list')}
                  className={`px-3 py-2 text-sm border-l border-gray-300 ${
                    view === 'list'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  List
                </button>
              </div>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid gap-4 md:grid-cols-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as FormStatus | 'all')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Filter by status"
                  >
                    <option value="all">All Statuses</option>
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                    <option value="paused">Paused</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Form Type
                  </label>
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value as FormType | 'all')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Filter by form type"
                  >
                    <option value="all">All Types</option>
                    <option value="enrollment">Enrollment</option>
                    <option value="health_screening">Health Screening</option>
                    <option value="incident_report">Incident Report</option>
                    <option value="permission_slip">Permission Slip</option>
                    <option value="medical_consent">Medical Consent</option>
                    <option value="emergency_contact">Emergency Contact</option>
                    <option value="assessment">Assessment</option>
                    <option value="survey">Survey</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sort By
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Sort by"
                  >
                    <option value="updated">Last Updated</option>
                    <option value="title">Title</option>
                    <option value="created">Created Date</option>
                    <option value="responses">Response Count</option>
                    <option value="completion_rate">Completion Rate</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setStatusFilter('all');
                      setTypeFilter('all');
                      setSearchQuery('');
                      setSortBy('updated');
                      setSortOrder('desc');
                    }}
                    className="w-full"
                  >
                    Clear Filters
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Forms Display */}
      <Card>
        <div className="p-6">
          {filteredForms.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 font-medium mb-2">
                {searchQuery || statusFilter !== 'all' || typeFilter !== 'all'
                  ? 'No forms match your criteria'
                  : 'No forms created yet'}
              </p>
              <p className="text-sm text-gray-400 mb-4">
                {searchQuery || statusFilter !== 'all' || typeFilter !== 'all'
                  ? 'Try adjusting your search terms or filters'
                  : 'Create your first healthcare form to get started.'}
              </p>
              <Link href="/forms/new">
                <Button variant="primary">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Form
                </Button>
              </Link>
            </div>
          ) : (
            <div className={view === 'grid' ? 'grid gap-6 md:grid-cols-2 lg:grid-cols-3' : 'space-y-4'}>
              {filteredForms.map((form) => (
                <div
                  key={form.id}
                  className={`border border-gray-200 rounded-lg hover:shadow-md transition-shadow ${
                    view === 'list' ? 'p-4' : 'p-6'
                  }`}
                >
                  {view === 'grid' ? (
                    /* Grid View */
                    <div>
                      {/* Form Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            {getTypeIcon(form.type)}
                            <input
                              type="checkbox"
                              checked={selectedForms.has(form.id)}
                              onChange={(e) => {
                                const newSelected = new Set(selectedForms);
                                if (e.target.checked) {
                                  newSelected.add(form.id);
                                } else {
                                  newSelected.delete(form.id);
                                }
                                setSelectedForms(newSelected);
                              }}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              aria-label={`Select form: ${form.title}`}
                            />
                          </div>
                          <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
                            {form.title}
                          </h3>
                          <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                            {form.description}
                          </p>
                        </div>
                      </div>

                      {/* Status and Priority Badges */}
                      <div className="flex items-center gap-2 mb-4">
                        {getStatusBadge(form.status)}
                        {getPriorityBadge(form.priority)}
                        {form.settings.requiresHIPAAConsent && (
                          <Badge className="bg-purple-100 text-purple-800">
                            <Shield className="h-3 w-3 mr-1" />
                            HIPAA
                          </Badge>
                        )}
                      </div>

                      {/* Form Statistics */}
                      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                        <div className="text-center p-2 bg-gray-50 rounded">
                          <div className="font-semibold text-gray-900">{form.analytics.submissions}</div>
                          <div className="text-gray-600">Responses</div>
                        </div>
                        <div className="text-center p-2 bg-gray-50 rounded">
                          <div className="font-semibold text-gray-900">
                            {formatCompletionRate(form.analytics.completionRate)}
                          </div>
                          <div className="text-gray-600">Completion</div>
                        </div>
                      </div>

                      {/* Form Metadata */}
                      <div className="text-xs text-gray-500 mb-4 space-y-1">
                        <div>Created: {formatDate(form.createdAt)}</div>
                        <div>Updated: {formatDate(form.updatedAt)}</div>
                        <div>By: {form.createdBy.name}</div>
                        <div>Fields: {form.fields.length}</div>
                      </div>

                      {/* Tags */}
                      {form.tags.length > 0 && (
                        <div className="mb-4">
                          <div className="flex flex-wrap gap-1">
                            {form.tags.slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded"
                              >
                                {tag}
                              </span>
                            ))}
                            {form.tags.length > 3 && (
                              <span className="text-xs text-gray-500">
                                +{form.tags.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Form Actions */}
                      <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                        <div className="flex items-center gap-2">
                          <Link href={`/forms/${form.id}/edit`}>
                            <Button variant="ghost" size="sm" title="Edit form">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          
                          <Link href={`/forms/${form.id}/responses`}>
                            <Button variant="ghost" size="sm" title="View responses">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDuplicateForm(form.id)}
                            title="Duplicate form"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>

                          {form.sharing.isPublic && (
                            <Button variant="ghost" size="sm" title="Share form">
                              <Share className="h-4 w-4" />
                            </Button>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleStatus(form.id)}
                            title={form.status === 'published' ? 'Pause form' : 'Publish form'}
                          >
                            {form.status === 'published' ? (
                              <Pause className="h-4 w-4" />
                            ) : (
                              <Play className="h-4 w-4" />
                            )}
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleArchiveForm(form.id)}
                            title="Archive form"
                          >
                            <Archive className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* List View */
                    <div className="flex items-center gap-4">
                      {/* Selection and Type */}
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={selectedForms.has(form.id)}
                          onChange={(e) => {
                            const newSelected = new Set(selectedForms);
                            if (e.target.checked) {
                              newSelected.add(form.id);
                            } else {
                              newSelected.delete(form.id);
                            }
                            setSelectedForms(newSelected);
                          }}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          aria-label={`Select form: ${form.title}`}
                        />
                        {getTypeIcon(form.type)}
                      </div>

                      {/* Form Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900 truncate">
                            {form.title}
                          </h3>
                          {getStatusBadge(form.status)}
                          {getPriorityBadge(form.priority)}
                        </div>
                        <p className="text-sm text-gray-600 truncate">
                          {form.description}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                          <span>By {form.createdBy.name}</span>
                          <span>Updated {formatDate(form.updatedAt)}</span>
                          <span>{form.fields.length} fields</span>
                        </div>
                      </div>

                      {/* Statistics */}
                      <div className="text-right">
                        <div className="text-sm font-semibold text-gray-900">
                          {form.analytics.submissions} responses
                        </div>
                        <div className="text-xs text-gray-500">
                          {formatCompletionRate(form.analytics.completionRate)} completion
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1">
                        <Link href={`/forms/${form.id}/edit`}>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link href={`/forms/${form.id}/responses`}>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDuplicateForm(form.id)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* Form Detail Modal */}
      {selectedForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getTypeIcon(selectedForm.type)}
                <div>
                  <h2 className="font-semibold text-gray-900">{selectedForm.title}</h2>
                  <p className="text-sm text-gray-600">{selectedForm.description}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                onClick={() => setSelectedForm(null)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {/* Form Analytics */}
              <div className="grid gap-4 md:grid-cols-3 mb-6">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">{selectedForm.analytics.views}</div>
                  <div className="text-sm text-gray-600">Views</div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">{selectedForm.analytics.submissions}</div>
                  <div className="text-sm text-gray-600">Submissions</div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">
                    {formatCompletionRate(selectedForm.analytics.completionRate)}
                  </div>
                  <div className="text-sm text-gray-600">Completion Rate</div>
                </div>
              </div>

              {/* Form Fields Preview */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-3">Form Fields ({selectedForm.fields.length})</h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {selectedForm.fields.map((field) => (
                    <div
                      key={field.id}
                      className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-900">{field.label}</span>
                        <Badge className="bg-gray-100 text-gray-800 text-xs">{field.type}</Badge>
                        {field.required && (
                          <Badge className="bg-red-100 text-red-800 text-xs">Required</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Form Settings */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-3">Settings</h3>
                <div className="grid gap-2 md:grid-cols-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Authentication Required:</span>
                    <span className="font-medium">
                      {selectedForm.settings.requireAuthentication ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Multiple Submissions:</span>
                    <span className="font-medium">
                      {selectedForm.settings.multipleSubmissions ? 'Allowed' : 'Not Allowed'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">HIPAA Consent:</span>
                    <span className="font-medium">
                      {selectedForm.settings.requiresHIPAAConsent ? 'Required' : 'Not Required'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Auto-save:</span>
                    <span className="font-medium">
                      {selectedForm.settings.autoSave ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-gray-200 flex justify-between">
              <div className="flex gap-2">
                <Link href={`/forms/${selectedForm.id}/edit`}>
                  <Button variant="outline">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Form
                  </Button>
                </Link>
                <Link href={`/forms/${selectedForm.id}/responses`}>
                  <Button variant="outline">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    View Responses
                  </Button>
                </Link>
              </div>
              <div className="flex gap-2">
                {selectedForm.sharing.isPublic && (
                  <Button variant="outline">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open Form
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={() => handleDuplicateForm(selectedForm.id)}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Duplicate
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default FormsContent;