'use client';

import React, { useState, useCallback } from 'react';
import { 
  Clock,
  CheckCircle,
  AlertCircle,
  User,
  Calendar,
  MapPin,
  Phone,
  Mail,
  FileText,
  Camera,
  Upload,
  X,
  Check,
  Printer,
  QrCode,
  Clipboard,
  UserCheck,
  AlertTriangle,
  Info
} from 'lucide-react';
import type { Appointment, AppointmentStatus } from './AppointmentCard';

/**
 * Check-in step types
 */
type CheckinStep = 'verification' | 'forms' | 'insurance' | 'payment' | 'confirmation';

/**
 * Form completion status
 */
interface FormStatus {
  id: string;
  name: string;
  required: boolean;
  completed: boolean;
  lastUpdated?: Date;
}

/**
 * Insurance verification data
 */
interface InsuranceInfo {
  provider: string;
  policyNumber: string;
  groupNumber: string;
  copay: number;
  verified: boolean;
  verificationDate?: Date;
}

/**
 * Payment information
 */
interface PaymentInfo {
  amount: number;
  method: 'cash' | 'card' | 'insurance' | 'billing';
  status: 'pending' | 'completed' | 'failed';
  transactionId?: string;
}

/**
 * Props for the AppointmentCheckin component
 */
interface AppointmentCheckinProps {
  /** Appointment data */
  appointment?: Appointment;
  /** Current check-in step */
  currentStep?: CheckinStep;
  /** Forms that need completion */
  requiredForms?: FormStatus[];
  /** Insurance information */
  insuranceInfo?: InsuranceInfo;
  /** Payment information */
  paymentInfo?: PaymentInfo;
  /** Whether to show QR code scanner */
  showQrScanner?: boolean;
  /** Whether check-in is self-service */
  selfService?: boolean;
  /** Custom CSS classes */
  className?: string;
  /** Step change handler */
  onStepChange?: (step: CheckinStep) => void;
  /** Patient verification handler */
  onPatientVerification?: (verified: boolean, method: 'id' | 'demographics' | 'qr') => void;
  /** Form completion handler */
  onFormComplete?: (formId: string, data: unknown) => void;
  /** Insurance verification handler */
  onInsuranceVerification?: (insuranceData: InsuranceInfo) => void;
  /** Payment processing handler */
  onPaymentProcess?: (paymentData: PaymentInfo) => void;
  /** Check-in completion handler */
  onCheckinComplete?: (appointment: Appointment) => void;
  /** Cancel check-in handler */
  onCancel?: () => void;
  /** Print forms handler */
  onPrintForms?: (formIds: string[]) => void;
  /** Upload document handler */
  onUploadDocument?: (file: File, type: string) => void;
}

/**
 * AppointmentCheckin Component
 * 
 * A comprehensive check-in interface for patient appointments with support for
 * patient verification, form completion, insurance verification, payment processing,
 * and final confirmation.
 * 
 * @param props - AppointmentCheckin component props
 * @returns JSX element representing the appointment check-in interface
 */
const AppointmentCheckin = ({
  appointment,
  currentStep = 'verification',
  requiredForms = [],
  insuranceInfo,
  paymentInfo,
  showQrScanner = false,
  selfService = false,
  className = '',
  onStepChange,
  onPatientVerification,
  onFormComplete,
  onInsuranceVerification,
  onPaymentProcess,
  onCheckinComplete,
  onCancel,
  onPrintForms,
  onUploadDocument
}: AppointmentCheckinProps) => {
  // State
  const [activeStep, setActiveStep] = useState<CheckinStep>(() => currentStep);
  const [verificationMethod, setVerificationMethod] = useState<'id' | 'demographics' | 'qr'>('demographics');
  const [patientVerified, setPatientVerified] = useState<boolean>(false);
  const [formsStatus, setFormsStatus] = useState<FormStatus[]>(requiredForms);
  const [loading, setLoading] = useState<boolean>(false);
  const [showCamera, setShowCamera] = useState<boolean>(false);
  const [uploadedDocuments, setUploadedDocuments] = useState<File[]>([]);

  /**
   * Gets the steps for the check-in process
   */
  const getCheckinSteps = (): { key: CheckinStep; label: string; completed: boolean }[] => [
    {
      key: 'verification',
      label: 'Patient Verification',
      completed: patientVerified
    },
    {
      key: 'forms',
      label: 'Forms & Documents',
      completed: formsStatus.filter(f => f.required).every(f => f.completed)
    },
    {
      key: 'insurance',
      label: 'Insurance Verification',
      completed: insuranceInfo?.verified || false
    },
    {
      key: 'payment',
      label: 'Payment',
      completed: paymentInfo?.status === 'completed'
    },
    {
      key: 'confirmation',
      label: 'Confirmation',
      completed: false
    }
  ];

  /**
   * Handles step navigation
   */
  const handleStepChange = useCallback((step: CheckinStep) => {
    setActiveStep(step);
    onStepChange?.(step);
  }, [onStepChange]);

  /**
   * Handles patient verification
   */
  const handlePatientVerification = useCallback((method: 'id' | 'demographics' | 'qr') => {
    setLoading(true);
    setTimeout(() => {
      setPatientVerified(true);
      setLoading(false);
      onPatientVerification?.(true, method);
      handleStepChange('forms');
    }, 1500);
  }, [onPatientVerification, handleStepChange]);

  /**
   * Handles form completion
   */
  const handleFormComplete = useCallback((formId: string) => {
    const updatedForms = formsStatus.map(form =>
      form.id === formId
        ? { ...form, completed: true, lastUpdated: new Date() }
        : form
    );
    setFormsStatus(updatedForms);
    onFormComplete?.(formId, { completed: true, timestamp: new Date() });
  }, [formsStatus, onFormComplete]);

  /**
   * Handles document upload
   */
  const handleDocumentUpload = useCallback((files: FileList) => {
    const newFiles = Array.from(files);
    setUploadedDocuments(prev => [...prev, ...newFiles]);
    newFiles.forEach(file => {
      onUploadDocument?.(file, 'insurance-card');
    });
  }, [onUploadDocument]);

  /**
   * Gets step completion status
   */
  const getStepStatus = (step: CheckinStep): 'completed' | 'current' | 'pending' => {
    const steps = getCheckinSteps();
    const stepData = steps.find(s => s.key === step);
    
    if (stepData?.completed) return 'completed';
    if (step === activeStep) return 'current';
    return 'pending';
  };

  /**
   * Renders the step indicator
   */
  const renderStepIndicator = () => {
    const steps = getCheckinSteps();

    return (
      <div className="flex items-center justify-between mb-8">
        {steps.map((step, index) => {
          const status = getStepStatus(step.key);
          const isLast = index === steps.length - 1;

          return (
            <div key={step.key} className="flex items-center">
              <div className="flex flex-col items-center">
                <button
                  onClick={() => handleStepChange(step.key)}
                  disabled={!step.completed && step.key !== activeStep}
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium
                    border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500
                    ${status === 'completed'
                      ? 'bg-green-600 border-green-600 text-white'
                      : status === 'current'
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'bg-white border-gray-300 text-gray-400'
                    }
                    ${step.completed || step.key === activeStep ? 'cursor-pointer' : 'cursor-not-allowed'}
                  `}
                  aria-label={`Step ${index + 1}: ${step.label}`}
                >
                  {status === 'completed' ? (
                    <Check size={16} />
                  ) : (
                    index + 1
                  )}
                </button>
                <span className={`
                  mt-2 text-xs font-medium text-center max-w-[80px]
                  ${status === 'current' ? 'text-blue-600' : 'text-gray-500'}
                `}>
                  {step.label}
                </span>
              </div>
              
              {!isLast && (
                <div className={`
                  flex-1 h-0.5 mx-4 min-w-[60px]
                  ${status === 'completed' ? 'bg-green-600' : 'bg-gray-300'}
                `} />
              )}
            </div>
          );
        })}
      </div>
    );
  };

  /**
   * Renders patient verification step
   */
  const renderVerificationStep = () => (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <UserCheck className="w-16 h-16 text-blue-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Patient Verification
        </h2>
        <p className="text-gray-600">
          Please verify your identity to continue with check-in
        </p>
      </div>

      {appointment && (
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Appointment Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <User className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Patient</p>
                <p className="font-medium">{appointment.patient.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Calendar className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Date & Time</p>
                <p className="font-medium">
                  {new Date(appointment.dateTime).toLocaleString()}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <MapPin className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="font-medium">
                  {appointment.location.isVirtual ? 'Virtual' : appointment.location.room}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <FileText className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Reason</p>
                <p className="font-medium">{appointment.reason}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Choose Verification Method
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => setVerificationMethod('demographics')}
            className={`
              p-4 border-2 rounded-lg text-left transition-colors
              ${verificationMethod === 'demographics'
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
              }
            `}
          >
            <Clipboard className="w-8 h-8 text-blue-600 mb-2" />
            <h4 className="font-medium text-gray-900">Demographics</h4>
            <p className="text-sm text-gray-600 mt-1">
              Verify using personal information
            </p>
          </button>

          <button
            onClick={() => setVerificationMethod('id')}
            className={`
              p-4 border-2 rounded-lg text-left transition-colors
              ${verificationMethod === 'id'
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
              }
            `}
          >
            <Camera className="w-8 h-8 text-blue-600 mb-2" />
            <h4 className="font-medium text-gray-900">Photo ID</h4>
            <p className="text-sm text-gray-600 mt-1">
              Upload or scan your ID
            </p>
          </button>

          {showQrScanner && (
            <button
              onClick={() => setVerificationMethod('qr')}
              className={`
                p-4 border-2 rounded-lg text-left transition-colors
                ${verificationMethod === 'qr'
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
                }
              `}
            >
              <QrCode className="w-8 h-8 text-blue-600 mb-2" />
              <h4 className="font-medium text-gray-900">QR Code</h4>
              <p className="text-sm text-gray-600 mt-1">
                Scan your appointment QR code
              </p>
            </button>
          )}
        </div>

        <div className="flex justify-center mt-8">
          <button
            onClick={() => handlePatientVerification(verificationMethod)}
            disabled={loading}
            className="inline-flex items-center px-6 py-3 text-base font-medium text-white 
                     bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 
                     focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                     disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Verifying...
              </>
            ) : (
              <>
                <Check className="w-4 h-4 mr-2" />
                Verify Identity
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  /**
   * Renders forms completion step
   */
  const renderFormsStep = () => (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <FileText className="w-16 h-16 text-blue-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Forms & Documents
        </h2>
        <p className="text-gray-600">
          Complete required forms and upload necessary documents
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Required Forms */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Required Forms
          </h3>
          <div className="space-y-4">
            {formsStatus.map((form) => (
              <div
                key={form.id}
                className={`
                  p-4 border rounded-lg transition-colors
                  ${form.completed
                    ? 'border-green-300 bg-green-50'
                    : form.required
                    ? 'border-orange-300 bg-orange-50'
                    : 'border-gray-300 bg-white'
                  }
                `}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {form.completed ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : form.required ? (
                      <AlertTriangle className="w-5 h-5 text-orange-600" />
                    ) : (
                      <Info className="w-5 h-5 text-gray-400" />
                    )}
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {form.name}
                        {form.required && <span className="text-red-500 ml-1">*</span>}
                      </h4>
                      {form.lastUpdated && (
                        <p className="text-sm text-gray-600">
                          Completed {form.lastUpdated.toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {!form.completed && (
                      <button
                        onClick={() => handleFormComplete(form.id)}
                        className="px-3 py-1 text-sm font-medium text-blue-600 bg-blue-100 
                                 rounded-md hover:bg-blue-200 focus:outline-none focus:ring-2 
                                 focus:ring-blue-500"
                      >
                        Complete
                      </button>
                    )}
                    <button
                      onClick={() => onPrintForms?.([form.id])}
                      className="p-1 text-gray-400 hover:text-gray-600"
                      aria-label="Print form"
                    >
                      <Printer size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Document Upload */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Upload Documents
          </h3>
          
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <div className="space-y-2">
              <p className="text-gray-600">
                Drag and drop files here, or click to select
              </p>
              <p className="text-sm text-gray-500">
                Supported formats: PDF, JPG, PNG (max 10MB)
              </p>
            </div>
            
            <input
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => e.target.files && handleDocumentUpload(e.target.files)}
              className="hidden"
              id="document-upload"
            />
            <label
              htmlFor="document-upload"
              className="inline-flex items-center px-4 py-2 mt-4 text-sm font-medium text-blue-600 
                       bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 
                       focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                       cursor-pointer"
            >
              Choose Files
            </label>
          </div>

          {uploadedDocuments.length > 0 && (
            <div className="mt-4 space-y-2">
              <h4 className="font-medium text-gray-900">Uploaded Documents</h4>
              {uploadedDocuments.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm text-gray-700">{file.name}</span>
                  <button
                    onClick={() => setUploadedDocuments(prev => prev.filter((_, i) => i !== index))}
                    className="text-red-600 hover:text-red-800"
                    aria-label="Remove file"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-center mt-8">
        <button
          onClick={() => handleStepChange('insurance')}
          disabled={formsStatus.filter(f => f.required).some(f => !f.completed)}
          className="inline-flex items-center px-6 py-3 text-base font-medium text-white 
                   bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 
                   focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                   disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue to Insurance
          <CheckCircle className="w-4 h-4 ml-2" />
        </button>
      </div>
    </div>
  );

  /**
   * Renders the current step content
   */
  const renderStepContent = () => {
    switch (activeStep) {
      case 'verification':
        return renderVerificationStep();
      case 'forms':
        return renderFormsStep();
      default:
        return (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Step Under Development
            </h3>
            <p className="text-gray-600">
              This step is currently being implemented.
            </p>
          </div>
        );
    }
  };

  if (!appointment) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            No Appointment Found
          </h2>
          <p className="text-gray-600">
            Please verify your appointment information and try again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`max-w-6xl mx-auto p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Appointment Check-in
          </h1>
          <p className="text-gray-600 mt-1">
            Welcome, {appointment.patient.name}
          </p>
        </div>
        
        {!selfService && (
          <button
            onClick={onCancel}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 
                     bg-white border border-gray-300 rounded-md hover:bg-gray-50 
                     focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <X className="w-4 h-4 mr-2" />
            Cancel Check-in
          </button>
        )}
      </div>

      {/* Step Indicator */}
      {renderStepIndicator()}

      {/* Step Content */}
      <div className="bg-white rounded-lg border border-gray-200 p-8">
        {renderStepContent()}
      </div>
    </div>
  );
};

export default AppointmentCheckin;
