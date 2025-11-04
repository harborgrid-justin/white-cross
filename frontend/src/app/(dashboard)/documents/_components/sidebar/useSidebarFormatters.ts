/**
 * Custom Hook: useSidebarFormatters
 * Provides utility functions for formatting sidebar data
 */

import React from 'react';
import {
  FileText,
  AlertTriangle,
  Upload,
  Download,
  Shield,
  Users,
  Activity,
  Edit,
  Eye,
  File,
  BarChart3,
  FileImage
} from 'lucide-react';
import { DocumentType } from '../types/document.types';

interface SidebarFormatters {
  formatRelativeTime: (timestamp: string) => string;
  formatFileSize: (bytes: number) => string;
  getSeverityColor: (severity: string) => string;
  getActivityIcon: (type: string) => React.ComponentType<{ className?: string }>;
  getDocumentTypeIcon: (type: DocumentType) => React.ComponentType<{ className?: string }>;
}

export const useSidebarFormatters = (): SidebarFormatters => {
  const formatRelativeTime = React.useCallback((timestamp: string): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      const minutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      return `${minutes}m ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      const days = Math.floor(diffInHours / 24);
      return `${days}d ago`;
    }
  }, []);

  const formatFileSize = React.useCallback((bytes: number): string => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  }, []);

  const getSeverityColor = React.useCallback((severity: string): string => {
    const colors = {
      low: 'bg-gray-100 text-gray-800',
      medium: 'bg-blue-100 text-blue-800',
      high: 'bg-orange-100 text-orange-800',
      urgent: 'bg-red-100 text-red-800'
    };
    return colors[severity as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  }, []);

  const getActivityIcon = React.useCallback((type: string) => {
    const icons = {
      uploaded: Upload,
      downloaded: Download,
      shared: Users,
      modified: Edit,
      reviewed: Eye,
      expired: AlertTriangle
    };
    return icons[type as keyof typeof icons] || Activity;
  }, []);

  const getDocumentTypeIcon = React.useCallback((type: DocumentType) => {
    const icons: Record<DocumentType, React.ComponentType<{ className?: string }>> = {
      medical_record: Shield,
      immunization_record: Shield,
      medication_record: Shield,
      incident_report: AlertTriangle,
      emergency_contact: Users,
      consent_form: FileText,
      allergy_record: AlertTriangle,
      insurance_card: FileText,
      iep_504: FileText,
      health_plan: Shield,
      prescription: FileText,
      lab_result: BarChart3,
      x_ray: FileImage,
      photo: FileImage,
      video: FileImage,
      other: File
    };
    return icons[type] || FileText;
  }, []);

  return {
    formatRelativeTime,
    formatFileSize,
    getSeverityColor,
    getActivityIcon,
    getDocumentTypeIcon
  };
};
