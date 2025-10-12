/**
 * Student Health Records Page - Enterprise Implementation
 *
 * Complete health records management system with:
 * - Route parameter validation
 * - HIPAA-compliant access control
 * - Sensitive record warnings
 * - Audit logging
 * - Role-based access
 *
 * @module pages/StudentHealthRecords
 */

import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useValidatedParams, StudentHealthRecordParamSchema } from '@/utils/routeValidation';
import { useHealthRecordAccess } from './hooks/useHealthRecordAccess';
import HealthRecordHeader from './components/HealthRecordHeader';
import HealthRecordContent from './components/HealthRecordContent';
import HealthRecordLoadingState from './components/HealthRecordLoadingState';
import HealthRecordErrorState from './components/HealthRecordErrorState';
import AccessDeniedPage from '@/components/AccessDeniedPage';
import SensitiveRecordWarning from '@/components/SensitiveRecordWarning';

export interface StudentHealthRecordsPageProps {}

/**
 * Main Student Health Records Page Component
 */
export const StudentHealthRecordsPage: React.FC<StudentHealthRecordsPageProps> = () => {
  const navigate = useNavigate();

  // =====================
  // ROUTE VALIDATION
  // =====================
  const {
    data: params,
    loading: paramsLoading,
    error: paramsError,
  } = useValidatedParams(StudentHealthRecordParamSchema, {
    fallbackRoute: '/health-records',
  });

  const studentId = params?.studentId;

  // =====================
  // ACCESS CONTROL
  // =====================
  const {
    loading: accessLoading,
    hasAccess,
    showSensitiveWarning,
    healthRecords,
    handleSensitiveAccessConfirm,
    setShowSensitiveWarning,
  } = useHealthRecordAccess({
    studentId,
  });

  // =====================
  // EVENT HANDLERS
  // =====================

  /**
   * Navigate back to health records list
   */
  const handleBackToRecords = useCallback(() => {
    navigate('/health-records');
  }, [navigate]);

  /**
   * Handle sensitive record access confirmation
   * HIPAA Compliance: Explicit user confirmation for sensitive data
   */
  const handleSensitiveConfirm = useCallback(async () => {
    await handleSensitiveAccessConfirm();
  }, [handleSensitiveAccessConfirm]);

  /**
   * Handle sensitive record access cancellation
   */
  const handleSensitiveCancel = useCallback(() => {
    navigate('/health-records');
  }, [navigate]);

  // =====================
  // RENDER: LOADING STATE
  // =====================
  if (paramsLoading || accessLoading) {
    return <HealthRecordLoadingState />;
  }

  // =====================
  // RENDER: VALIDATION ERROR
  // =====================
  if (paramsError) {
    return (
      <HealthRecordErrorState
        errorMessage={paramsError.userMessage}
        onBack={handleBackToRecords}
      />
    );
  }

  // =====================
  // RENDER: ACCESS DENIED
  // =====================
  if (!hasAccess) {
    return (
      <AccessDeniedPage
        message="You do not have permission to view this student's records"
        onBack={handleBackToRecords}
      />
    );
  }

  // =====================
  // RENDER: SENSITIVE WARNING
  // =====================
  if (showSensitiveWarning) {
    return (
      <SensitiveRecordWarning
        isOpen={true}
        onConfirm={handleSensitiveConfirm}
        onCancel={handleSensitiveCancel}
        studentName={`Student ${studentId}`}
      />
    );
  }

  // =====================
  // RENDER: MAIN CONTENT
  // =====================
  return (
    <div className="space-y-6">
      <HealthRecordHeader
        studentName={healthRecords?.student?.name || 'Unknown Student'}
        studentId={studentId || ''}
        onBack={handleBackToRecords}
      />
      <HealthRecordContent
        studentName={healthRecords?.student?.name || 'Unknown Student'}
        studentId={studentId || ''}
      />
    </div>
  );
};

export default StudentHealthRecordsPage;
