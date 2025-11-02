'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { createHealthRecordAction } from '@/lib/actions/health-records.actions';

export default function NewHealthRecordPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [formData, setFormData] = useState({
    studentId: '',
    recordType: 'MEDICAL_HISTORY',
    title: '',
    description: '',
    recordDate: new Date().toISOString().split('T')[0],
    provider: '',
    providerNpi: '',
    facility: '',
    facilityNpi: '',
    diagnosis: '',
    diagnosisCode: '',
    treatment: '',
    followUpRequired: false,
    followUpDate: '',
    followUpCompleted: false,
    isConfidential: false,
    notes: '',
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      const formDataObj = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          formDataObj.append(key, String(value));
        }
      });

      const result = await createHealthRecordAction({}, formDataObj);

      if (result.success) {
        router.push('/health-records');
        router.refresh();
      } else if (result.errors) {
        setErrors(result.errors);
      }
    } catch (error) {
      console.error('Failed to create health record:', error);
      setErrors({ _form: ['Failed to create health record. Please try again.'] });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <Link href="/health-records">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Health Records
            </Button>
          </Link>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Create New Health Record</h1>
        <p className="text-gray-600 mt-2">
          Add a new health record to the system with detailed medical information
        </p>
      </div>

      {errors._form && (
        <Card className="mb-6 p-4 bg-red-50 border-red-200">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-red-900">Error</h3>
              {errors._form.map((error, i) => (
                <p key={i} className="text-sm text-red-700">{error}</p>
              ))}
            </div>
          </div>
        </Card>
      )}

      <form onSubmit={handleSubmit}>
        <Card className="p-6 space-y-6">
          {/* Student Information */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">Student Information</h2>
            
            <div>
              <label htmlFor="studentId" className="block text-sm font-medium text-gray-700 mb-2">
                Student ID <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                id="studentId"
                name="studentId"
                value={formData.studentId}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter student UUID"
              />
              {errors.studentId && (
                <p className="mt-1 text-sm text-red-600">{errors.studentId[0]}</p>
              )}
            </div>
          </div>

          {/* Record Details */}
          <div className="space-y-4 border-t pt-6">
            <h2 className="text-xl font-semibold text-gray-900">Record Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="recordType" className="block text-sm font-medium text-gray-700 mb-2">
                  Record Type <span className="text-red-600">*</span>
                </label>
                <select
                  id="recordType"
                  name="recordType"
                  value={formData.recordType}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="MEDICAL_HISTORY">Medical History</option>
                  <option value="PHYSICAL_EXAM">Physical Exam</option>
                  <option value="IMMUNIZATION">Immunization</option>
                  <option value="ALLERGY">Allergy</option>
                  <option value="MEDICATION">Medication</option>
                  <option value="VITAL_SIGNS">Vital Signs</option>
                  <option value="GROWTH_CHART">Growth Chart</option>
                  <option value="SCREENING">Screening</option>
                </select>
                {errors.recordType && (
                  <p className="mt-1 text-sm text-red-600">{errors.recordType[0]}</p>
                )}
              </div>

              <div>
                <label htmlFor="recordDate" className="block text-sm font-medium text-gray-700 mb-2">
                  Record Date <span className="text-red-600">*</span>
                </label>
                <input
                  type="date"
                  id="recordDate"
                  name="recordDate"
                  value={formData.recordDate}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.recordDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.recordDate[0]}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Title <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Annual Physical Examination"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title[0]}</p>
              )}
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description <span className="text-red-600">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Detailed description of the health record"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description[0]}</p>
              )}
            </div>
          </div>

          {/* Provider Information */}
          <div className="space-y-4 border-t pt-6">
            <h2 className="text-xl font-semibold text-gray-900">Provider Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="provider" className="block text-sm font-medium text-gray-700 mb-2">
                  Provider Name
                </label>
                <input
                  type="text"
                  id="provider"
                  name="provider"
                  value={formData.provider}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Dr. John Smith"
                />
              </div>

              <div>
                <label htmlFor="providerNpi" className="block text-sm font-medium text-gray-700 mb-2">
                  Provider NPI
                </label>
                <input
                  type="text"
                  id="providerNpi"
                  name="providerNpi"
                  value={formData.providerNpi}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="1234567890"
                />
              </div>

              <div>
                <label htmlFor="facility" className="block text-sm font-medium text-gray-700 mb-2">
                  Facility Name
                </label>
                <input
                  type="text"
                  id="facility"
                  name="facility"
                  value={formData.facility}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="General Hospital"
                />
              </div>

              <div>
                <label htmlFor="facilityNpi" className="block text-sm font-medium text-gray-700 mb-2">
                  Facility NPI
                </label>
                <input
                  type="text"
                  id="facilityNpi"
                  name="facilityNpi"
                  value={formData.facilityNpi}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="1234567890"
                />
              </div>
            </div>
          </div>

          {/* Medical Information */}
          <div className="space-y-4 border-t pt-6">
            <h2 className="text-xl font-semibold text-gray-900">Medical Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="diagnosis" className="block text-sm font-medium text-gray-700 mb-2">
                  Diagnosis
                </label>
                <input
                  type="text"
                  id="diagnosis"
                  name="diagnosis"
                  value={formData.diagnosis}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Seasonal Allergies"
                />
              </div>

              <div>
                <label htmlFor="diagnosisCode" className="block text-sm font-medium text-gray-700 mb-2">
                  Diagnosis Code (ICD-10)
                </label>
                <input
                  type="text"
                  id="diagnosisCode"
                  name="diagnosisCode"
                  value={formData.diagnosisCode}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="J30.1"
                />
              </div>
            </div>

            <div>
              <label htmlFor="treatment" className="block text-sm font-medium text-gray-700 mb-2">
                Treatment
              </label>
              <textarea
                id="treatment"
                name="treatment"
                value={formData.treatment}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Treatment plan and medications prescribed"
              />
            </div>
          </div>

          {/* Follow-up Information */}
          <div className="space-y-4 border-t pt-6">
            <h2 className="text-xl font-semibold text-gray-900">Follow-up</h2>
            
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="followUpRequired"
                name="followUpRequired"
                checked={formData.followUpRequired}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="followUpRequired" className="text-sm font-medium text-gray-700">
                Follow-up Required
              </label>
            </div>

            {formData.followUpRequired && (
              <div>
                <label htmlFor="followUpDate" className="block text-sm font-medium text-gray-700 mb-2">
                  Follow-up Date
                </label>
                <input
                  type="date"
                  id="followUpDate"
                  name="followUpDate"
                  value={formData.followUpDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}
          </div>

          {/* Additional Information */}
          <div className="space-y-4 border-t pt-6">
            <h2 className="text-xl font-semibold text-gray-900">Additional Information</h2>
            
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isConfidential"
                name="isConfidential"
                checked={formData.isConfidential}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="isConfidential" className="text-sm font-medium text-gray-700">
                Mark as Confidential
              </label>
            </div>

            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                Additional Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Any additional notes or observations"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-4 pt-6 border-t">
            <Link href="/health-records">
              <Button type="button" variant="ghost" disabled={isSubmitting}>
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>Creating...</>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Create Health Record
                </>
              )}
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
}


