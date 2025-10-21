/**
 * WF-RPT-001 | ReportsGenerate.tsx - Reports generation interface
 * Purpose: Generate various healthcare reports with filtering and export options
 * Upstream: ../services/modules/health/reportsApi | Dependencies: react, react-hook-form
 * Downstream: Reports system | Called by: React router
 * Related: ScheduledReports.tsx
 * Exports: default ReportsGenerate component
 * Last Updated: 2025-10-21 | File Type: .tsx
 * Critical Path: Select report type → Configure parameters → Generate → Export
 * LLM Context: Healthcare report generation with multiple formats and filters
 */

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuthContext } from '../../contexts/AuthContext';

interface ReportConfig {
  reportType: string;
  dateRange: {
    startDate: string;
    endDate: string;
  };
  format: 'PDF' | 'CSV' | 'XLSX';
  filters?: {
    schoolId?: string;
    gradeLevel?: string;
    category?: string;
  };
}

const ReportsGenerate: React.FC = () => {
  const { user } = useAuthContext();
  const [generating, setGenerating] = useState(false);
  const [generatedReport, setGeneratedReport] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ReportConfig>({
    defaultValues: {
      format: 'PDF',
      dateRange: {
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0],
      },
    },
  });

  const reportType = watch('reportType');

  const reportTypes = [
    { value: 'STUDENT_HEALTH_SUMMARY', label: 'Student Health Summary', description: 'Overview of student health records and medications' },
    { value: 'MEDICATION_ADMINISTRATION', label: 'Medication Administration', description: 'Report on medication given to students' },
    { value: 'INCIDENT_REPORTS', label: 'Incident Reports', description: 'Summary of all incident reports filed' },
    { value: 'ATTENDANCE_HEALTH', label: 'Health-Related Attendance', description: 'Attendance affected by health issues' },
    { value: 'INVENTORY_USAGE', label: 'Inventory Usage', description: 'Medical supplies and medication usage' },
    { value: 'APPOINTMENTS_SUMMARY', label: 'Appointments Summary', description: 'Healthcare appointments and visits' },
  ];

  const onSubmit = async (data: ReportConfig) => {
    try {
      setGenerating(true);
      
      // Mock report generation - replace with actual API call
      console.log('Generating report with config:', data);
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock generated report URL
      setGeneratedReport(`/api/reports/download/${Date.now()}.${data.format.toLowerCase()}`);
    } catch (error) {
      console.error('Failed to generate report:', error);
    } finally {
      setGenerating(false);
    }
  };

  const downloadReport = () => {
    if (generatedReport) {
      // In a real implementation, this would download the file
      console.log('Downloading report:', generatedReport);
      window.open(generatedReport, '_blank');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Generate Reports</h1>
        <p className="mt-1 text-sm text-gray-500">
          Create comprehensive healthcare reports with customizable parameters
        </p>
      </div>

      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Report Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Report Type *
              </label>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {reportTypes.map((type) => (
                  <div key={type.value} className="relative">
                    <label className="flex cursor-pointer rounded-lg border border-gray-300 p-4 hover:bg-gray-50 focus-within:ring-2 focus-within:ring-blue-500">
                      <input
                        {...register('reportType', { required: 'Please select a report type' })}
                        type="radio"
                        value={type.value}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                      />
                      <div className="ml-3">
                        <span className="block text-sm font-medium text-gray-900">
                          {type.label}
                        </span>
                        <span className="block text-sm text-gray-500">
                          {type.description}
                        </span>
                      </div>
                    </label>
                  </div>
                ))}
              </div>
              {errors.reportType && (
                <p className="mt-1 text-sm text-red-600">{errors.reportType.message}</p>
              )}
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date *
                </label>
                <input
                  type="date"
                  {...register('dateRange.startDate', { required: 'Start date is required' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.dateRange?.startDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.dateRange.startDate.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date *
                </label>
                <input
                  type="date"
                  {...register('dateRange.endDate', { required: 'End date is required' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.dateRange?.endDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.dateRange.endDate.message}</p>
                )}
              </div>
            </div>

            {/* Format Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Export Format *
              </label>
              <div className="flex space-x-4">
                {(['PDF', 'CSV', 'XLSX'] as const).map((format) => (
                  <label key={format} className="flex items-center">
                    <input
                      {...register('format', { required: 'Please select a format' })}
                      type="radio"
                      value={format}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{format}</span>
                  </label>
                ))}
              </div>
              {errors.format && (
                <p className="mt-1 text-sm text-red-600">{errors.format.message}</p>
              )}
            </div>

            {/* Conditional Filters */}
            {reportType && (
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Report Filters</h3>
                
                {(reportType === 'STUDENT_HEALTH_SUMMARY' || reportType === 'ATTENDANCE_HEALTH') && (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        School
                      </label>
                      <select
                        {...register('filters.schoolId')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">All Schools</option>
                        <option value="elementary-1">Elementary School #1</option>
                        <option value="middle-1">Middle School #1</option>
                        <option value="high-1">High School #1</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Grade Level
                      </label>
                      <select
                        {...register('filters.gradeLevel')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">All Grades</option>
                        <option value="K">Kindergarten</option>
                        <option value="1">1st Grade</option>
                        <option value="2">2nd Grade</option>
                        <option value="3">3rd Grade</option>
                        <option value="4">4th Grade</option>
                        <option value="5">5th Grade</option>
                        <option value="6">6th Grade</option>
                        <option value="7">7th Grade</option>
                        <option value="8">8th Grade</option>
                        <option value="9">9th Grade</option>
                        <option value="10">10th Grade</option>
                        <option value="11">11th Grade</option>
                        <option value="12">12th Grade</option>
                      </select>
                    </div>
                  </div>
                )}

                {reportType === 'INVENTORY_USAGE' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      {...register('filters.category')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">All Categories</option>
                      <option value="MEDICATION">Medications</option>
                      <option value="SUPPLIES">Medical Supplies</option>
                      <option value="EQUIPMENT">Equipment</option>
                    </select>
                  </div>
                )}
              </div>
            )}

            {/* Generate Button */}
            <div className="flex justify-end space-x-3">
              <button
                type="submit"
                disabled={generating}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {generating ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating Report...
                  </>
                ) : (
                  <>
                    <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Generate Report
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Generated Report */}
          {generatedReport && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="ml-2 text-sm font-medium text-green-800">
                    Report generated successfully!
                  </span>
                </div>
                <button
                  onClick={downloadReport}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <svg className="-ml-1 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Reports */}
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Reports</h3>
          <p className="text-sm text-gray-500 mb-4">
            Generate commonly used reports with default settings
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <button className="flex items-center justify-between p-3 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <span className="text-sm font-medium text-gray-900">Daily Health Summary</span>
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <button className="flex items-center justify-between p-3 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <span className="text-sm font-medium text-gray-900">Weekly Medication Log</span>
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <button className="flex items-center justify-between p-3 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <span className="text-sm font-medium text-gray-900">Monthly Incidents</span>
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsGenerate;
