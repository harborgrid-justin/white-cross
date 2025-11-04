/**
 * Custom Hook: useSidebarData
 * Manages sidebar data fetching and mock data generation
 */

import React from 'react';
import {
  RecentDocument,
  DocumentActivity,
  DocumentAlert,
  QuickStats,
  SidebarData
} from './sidebar.types';

export const useSidebarData = (): SidebarData => {
  // Mock data for recent documents
  const recentDocuments: RecentDocument[] = React.useMemo(() => {
    const now = new Date();
    return [
      {
        id: 'doc-001',
        title: 'Annual Medical Record',
        fileName: 'emily_johnson_medical_record_2024.pdf',
        documentType: 'medical_record',
        studentName: 'Emily Johnson',
        uploadedBy: 'Nurse Williams',
        uploadedAt: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
        fileSize: 2.5 * 1024 * 1024,
        status: 'active',
        accessLevel: 'nurse_only',
        isStarred: true,
        isEncrypted: true
      },
      {
        id: 'doc-002',
        title: 'COVID-19 Vaccination Record',
        fileName: 'covid_vaccine_card.jpg',
        documentType: 'immunization_record',
        studentName: 'Michael Chen',
        uploadedBy: 'Parent - Lisa Chen',
        uploadedAt: new Date(now.getTime() - 4 * 60 * 60 * 1000).toISOString(),
        fileSize: 1.2 * 1024 * 1024,
        status: 'active',
        accessLevel: 'staff_only',
        isStarred: false,
        isEncrypted: true
      },
      {
        id: 'doc-003',
        title: 'Severe Allergy Action Plan',
        fileName: 'allergy_action_plan.pdf',
        documentType: 'allergy_record',
        studentName: 'Sarah Martinez',
        uploadedBy: 'Dr. Rodriguez',
        uploadedAt: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(),
        fileSize: 800 * 1024,
        status: 'active',
        accessLevel: 'staff_only',
        isStarred: true,
        isEncrypted: true
      },
      {
        id: 'doc-004',
        title: 'Individual Education Plan (IEP)',
        fileName: 'iep_plan_2024_2025.pdf',
        documentType: 'iep_504',
        studentName: 'Jessica Lee',
        uploadedBy: 'Special Ed Coordinator',
        uploadedAt: new Date(now.getTime() - 48 * 60 * 60 * 1000).toISOString(),
        fileSize: 3.2 * 1024 * 1024,
        status: 'pending_review',
        accessLevel: 'restricted',
        isStarred: true,
        isEncrypted: true
      },
      {
        id: 'doc-005',
        title: 'School Health Policies',
        fileName: 'school_health_policies_2024.pdf',
        documentType: 'other',
        uploadedBy: 'Principal Davis',
        uploadedAt: new Date(now.getTime() - 72 * 60 * 60 * 1000).toISOString(),
        fileSize: 5.1 * 1024 * 1024,
        status: 'active',
        accessLevel: 'public',
        isStarred: false,
        isEncrypted: false
      }
    ];
  }, []);

  // Mock data for recent activity
  const recentActivity: DocumentActivity[] = React.useMemo(() => {
    const now = new Date();
    return [
      {
        id: 'activity-001',
        type: 'uploaded',
        documentTitle: 'Annual Medical Record',
        studentName: 'Emily Johnson',
        user: 'Nurse Williams',
        timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
        description: 'New medical record uploaded with current health assessment'
      },
      {
        id: 'activity-002',
        type: 'reviewed',
        documentTitle: 'Severe Allergy Action Plan',
        studentName: 'Sarah Martinez',
        user: 'Nurse Johnson',
        timestamp: new Date(now.getTime() - 6 * 60 * 60 * 1000).toISOString(),
        description: 'Allergy plan reviewed and approved for emergency use'
      },
      {
        id: 'activity-003',
        type: 'downloaded',
        documentTitle: 'COVID-19 Vaccination Record',
        studentName: 'Michael Chen',
        user: 'Teacher Smith',
        timestamp: new Date(now.getTime() - 12 * 60 * 60 * 1000).toISOString(),
        description: 'Vaccination record accessed for field trip approval'
      },
      {
        id: 'activity-004',
        type: 'modified',
        documentTitle: 'Individual Education Plan (IEP)',
        studentName: 'Jessica Lee',
        user: 'Special Ed Coordinator',
        timestamp: new Date(now.getTime() - 18 * 60 * 60 * 1000).toISOString(),
        description: 'IEP document updated with new accommodations'
      },
      {
        id: 'activity-005',
        type: 'shared',
        documentTitle: 'School Health Policies',
        user: 'Principal Davis',
        timestamp: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(),
        description: 'Health policies shared with all staff members'
      }
    ];
  }, []);

  // Mock data for document alerts
  const documentAlerts: DocumentAlert[] = React.useMemo(() => {
    const now = new Date();
    return [
      {
        id: 'alert-001',
        type: 'pending_review',
        title: 'Pending Reviews',
        description: '5 documents require immediate review and approval',
        count: 5,
        severity: 'urgent',
        timestamp: now.toISOString()
      },
      {
        id: 'alert-002',
        type: 'expiring_soon',
        title: 'Expiring Documents',
        description: '8 documents will expire within the next 7 days',
        count: 8,
        severity: 'high',
        timestamp: new Date(now.getTime() - 30 * 60 * 1000).toISOString()
      },
      {
        id: 'alert-003',
        type: 'storage_warning',
        title: 'Storage Space',
        description: 'Document storage is approaching 85% capacity',
        severity: 'medium',
        timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'alert-004',
        type: 'access_violation',
        title: 'Access Attempt',
        description: 'Unauthorized access attempt to restricted documents',
        severity: 'high',
        timestamp: new Date(now.getTime() - 4 * 60 * 60 * 1000).toISOString()
      }
    ];
  }, []);

  // Calculate quick statistics
  const quickStats: QuickStats = React.useMemo(() => {
    const now = new Date();
    const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    return {
      recentUploads: recentDocuments.filter(doc => {
        const uploadTime = new Date(doc.uploadedAt);
        return uploadTime >= dayAgo;
      }).length,
      pendingReview: recentDocuments.filter(doc => doc.status === 'pending_review').length,
      encryptedDocs: recentDocuments.filter(doc => doc.isEncrypted).length,
      starredDocs: recentDocuments.filter(doc => doc.isStarred).length
    };
  }, [recentDocuments]);

  return {
    recentDocuments,
    recentActivity,
    documentAlerts,
    quickStats
  };
};
