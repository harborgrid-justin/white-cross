/**
 * Custom hook for managing forms data fetching and state
 *
 * This hook handles loading forms from the server, managing the forms state,
 * and providing fallback mock data if the server request fails.
 */

import { useState, useEffect } from 'react';
import { getForms, type FormDefinition } from '@/lib/actions/forms.actions';
import { HealthcareForm, FormType, FormStatus, FormPriority, FormField } from '../types/formTypes';

/**
 * Return type for useFormsData hook
 */
export interface UseFormsDataReturn {
  /** Array of healthcare forms */
  forms: HealthcareForm[];

  /** Function to update forms state */
  setForms: React.Dispatch<React.SetStateAction<HealthcareForm[]>>;

  /** Loading state indicator */
  loading: boolean;

  /** Error state if data loading fails */
  error: Error | null;
}

/**
 * Transforms server FormDefinition to UI HealthcareForm format
 */
function transformFormDefinition(form: FormDefinition): HealthcareForm {
  return {
    id: form.id,
    title: form.name || 'Untitled Form',
    description: form.description || 'No description available',
    type: (form.category?.toLowerCase() || 'other') as FormType,
    status: (form.status?.toLowerCase() || 'draft') as FormStatus,
    priority: 'normal' as FormPriority,
    version: 1,
    createdBy: {
      id: form.createdBy,
      name: 'Unknown User',
      role: 'Administrator',
    },
    createdAt: new Date(form.createdAt),
    updatedAt: new Date(form.updatedAt),
    publishedAt: form.status === 'PUBLISHED' ? new Date(form.updatedAt) : undefined,
    fields: (form.fields || []).map((field: FormDefinition['fields'][number]) => ({
      ...field,
      type: field.type === 'ssn' ? 'text' : field.type === 'medical' ? 'textarea' : field.type,
      options: field.options
        ? field.options.map((opt: { label: string; value: string } | string) =>
            typeof opt === 'string' ? opt : opt.label || opt.value
          )
        : undefined,
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
      requiresHIPAAConsent: true,
    },
    analytics: {
      views: 0,
      submissions: 0,
      completionRate: 85.0,
      averageCompletionTime: 3.5,
      lastSubmission: undefined,
      dropOffPoints: [],
    },
    sharing: {
      isPublic: false,
      publicUrl: `https://forms.whitecross.edu/${form.id}`,
      qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://forms.whitecross.edu/${form.id}`,
    },
    tags: [],
  };
}

/**
 * Generates mock healthcare forms data for development/fallback
 */
function getMockFormsData(): HealthcareForm[] {
  return [
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
        {
          id: 'temp',
          type: 'number',
          label: 'Temperature (°F)',
          required: true,
          validation: { minLength: 2, maxLength: 5 },
        },
        {
          id: 'symptoms',
          type: 'checkbox',
          label: 'Symptoms',
          required: true,
          options: ['Fever', 'Cough', 'Sore throat', 'Headache', 'None'],
        },
        {
          id: 'exposure',
          type: 'radio',
          label: 'Close contact with COVID-19?',
          required: true,
          options: ['Yes', 'No', 'Unsure'],
        },
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
        requiresHIPAAConsent: true,
      },
      analytics: {
        views: 2847,
        submissions: 2456,
        completionRate: 86.3,
        averageCompletionTime: 2.1,
        lastSubmission: new Date('2024-10-31T08:45:00'),
        dropOffPoints: [
          { fieldId: 'symptoms', dropOffRate: 8.2 },
          { fieldId: 'exposure', dropOffRate: 5.5 },
        ],
      },
      sharing: {
        isPublic: true,
        publicUrl: 'https://forms.whitecross.edu/health-screening',
        qrCodeUrl:
          'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://forms.whitecross.edu/health-screening',
      },
      tags: ['covid', 'daily', 'screening', 'required'],
    },
    {
      id: 'form-002',
      title: 'Student Enrollment Form',
      description:
        'Comprehensive enrollment form for new students including health information and emergency contacts',
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
        {
          id: 'grade',
          type: 'select',
          label: 'Grade Level',
          required: true,
          options: ['K', '1', '2', '3', '4', '5'],
        },
        { id: 'allergies', type: 'textarea', label: 'Known Allergies', required: false },
        { id: 'emergency_contact', type: 'text', label: 'Emergency Contact Name', required: true },
        { id: 'emergency_phone', type: 'phone', label: 'Emergency Contact Phone', required: true },
      ],
      settings: {
        allowAnonymous: false,
        requireAuthentication: false,
        multipleSubmissions: false,
        autoSave: true,
        progressBar: true,
        thankYouMessage:
          'Thank you for enrolling your student. We will review your application within 2 business days.',
        emailNotifications: ['enrollment@school.edu', 'nurse@school.edu'],
        requiresHIPAAConsent: true,
      },
      analytics: {
        views: 456,
        submissions: 387,
        completionRate: 84.9,
        averageCompletionTime: 12.3,
        lastSubmission: new Date('2024-10-30T15:20:00'),
        dropOffPoints: [
          { fieldId: 'allergies', dropOffRate: 12.1 },
          { fieldId: 'emergency_phone', dropOffRate: 3.2 },
        ],
      },
      sharing: {
        isPublic: true,
        publicUrl: 'https://forms.whitecross.edu/enrollment',
      },
      tags: ['enrollment', 'new-student', 'required', 'health-info'],
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
        {
          id: 'location',
          type: 'select',
          label: 'Location',
          required: true,
          options: ['Classroom', 'Playground', 'Cafeteria', 'Hallway', 'Gymnasium', 'Other'],
        },
        { id: 'description', type: 'textarea', label: 'Incident Description', required: true },
        {
          id: 'injury_type',
          type: 'checkbox',
          label: 'Type of Injury',
          required: false,
          options: ['Bruise', 'Cut', 'Scrape', 'Sprain', 'No injury', 'Other'],
        },
        {
          id: 'first_aid',
          type: 'radio',
          label: 'First aid provided?',
          required: true,
          options: ['Yes', 'No'],
        },
        {
          id: 'parent_contacted',
          type: 'radio',
          label: 'Parent contacted?',
          required: true,
          options: ['Yes', 'No'],
        },
      ],
      settings: {
        allowAnonymous: false,
        requireAuthentication: true,
        multipleSubmissions: true,
        autoSave: true,
        progressBar: false,
        thankYouMessage: 'Incident report submitted. The nurse will follow up as needed.',
        emailNotifications: ['nurse@school.edu', 'principal@school.edu'],
        requiresHIPAAConsent: true,
      },
      analytics: {
        views: 189,
        submissions: 156,
        completionRate: 82.5,
        averageCompletionTime: 7.8,
        lastSubmission: new Date('2024-10-29T14:15:00'),
        dropOffPoints: [
          { fieldId: 'description', dropOffRate: 15.3 },
          { fieldId: 'first_aid', dropOffRate: 2.1 },
        ],
      },
      sharing: {
        isPublic: false,
        password: 'incident2024',
      },
      tags: ['incident', 'safety', 'injury', 'required'],
    },
  ];
}

/**
 * Custom hook for loading and managing forms data
 *
 * @param initialForms - Optional initial forms data
 * @returns Object containing forms, setForms, loading state, and error
 */
export function useFormsData(initialForms: HealthcareForm[] = []): UseFormsDataReturn {
  const [forms, setForms] = useState<HealthcareForm[]>(initialForms);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadForms = async () => {
      try {
        setLoading(true);
        setError(null);

        // Load forms from server actions
        const formDefinitions = await getForms();

        // Transform FormDefinition[] to HealthcareForm[] for UI compatibility
        const transformedForms: HealthcareForm[] = formDefinitions.map(transformFormDefinition);

        setForms(transformedForms);
      } catch (err) {
        console.error('Failed to load forms:', err);
        setError(err instanceof Error ? err : new Error('Failed to load forms'));

        // Fallback to mock data if server actions fail
        setForms(getMockFormsData());
      } finally {
        setLoading(false);
      }
    };

    loadForms();
  }, []);

  return {
    forms,
    setForms,
    loading,
    error,
  };
}
