/**
 * Health Records Reports Page
 * 
 * Route: /health-records/reports
 * Generate and view health record reports
 */

'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/layouts/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/layout/Card';
import { Button } from '@/components/ui/Button';
import { FileText, Download, Calendar, Heart, BarChart3, AlertTriangle, Pill, Shield } from 'lucide-react';

export default function HealthRecordsReportsPage() {
  const [selectedReport, setSelectedReport] = useState('');
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });

  const reportTypes = [
    {
      id: 'medical-summary',
      title: 'Medical Summary Report',
      description: 'Comprehensive medical overview for students',
      icon: Heart
    },
    {
      id: 'medication-tracking',
      title: 'Medication Tracking Report',
      description: 'Active medications and administration schedules',
      icon: Pill
    },
    {
      id: 'allergy-alerts',
      title: 'Allergy Alerts Report',
      description: 'Students with allergies and emergency protocols',
      icon: AlertTriangle
    },
    {
      id: 'immunization-status',
      title: 'Immunization Status Report',
      description: 'Vaccination records and compliance tracking',
      icon: Shield
    },
    {
      id: 'incident-tracking',
      title: 'Incident Tracking Report',
      description: 'Health incidents and nurse visit logs',
      icon: FileText
    },
    {
      id: 'health-trends',
      title: 'Health Trends Report',
      description: 'Statistical analysis of health patterns',
      icon: BarChart3
    }
  ];

  return (
    <div className="container mx-auto px-4 py-6">
      <PageHeader 
        title="Health Records Reports"
      />
      <p className="text-gray-600 mb-6">Generate comprehensive reports about student health data</p>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Report Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Select Report Type
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reportTypes.map((report) => {
                const IconComponent = report.icon;
                return (
                  <div
                    key={report.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedReport === report.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedReport(report.id)}
                  >
                    <div className="flex items-start space-x-3">
                      <IconComponent className="h-5 w-5 text-gray-600 mt-1" />
                      <div>
                        <h3 className="font-medium text-gray-900">{report.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{report.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Report Configuration */}
        {selectedReport && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Report Configuration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Date Range */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Date Range</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Start Date
                      </label>
                      <input
                        type="date"
                        value={dateRange.startDate}
                        onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        End Date
                      </label>
                      <input
                        type="date"
                        value={dateRange.endDate}
                        onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Report-specific filters */}
                {selectedReport === 'allergy-alerts' && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-3">Allergy Filters</h3>
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">Life-threatening allergies only</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">EpiPen required students</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">Food allergies</span>
                      </label>
                    </div>
                  </div>
                )}

                {selectedReport === 'medication-tracking' && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-3">Medication Filters</h3>
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">School-administered only</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">Emergency medications</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">Include medication schedules</span>
                      </label>
                    </div>
                  </div>
                )}

                {/* Student Selection */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Student Selection</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Grade Level
                      </label>
                      <select 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        aria-label="Filter by grade level"
                      >
                        <option value="">All Grades</option>
                        {['K', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'].map(grade => (
                          <option key={grade} value={grade}>Grade {grade}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        School
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter school name (optional)"
                      />
                    </div>
                  </div>
                </div>

                {/* Format Selection */}
                <fieldset>
                  <legend className="text-sm font-medium text-gray-900 mb-3">Export Format</legend>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="format"
                        value="pdf"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        defaultChecked
                      />
                      <span className="ml-2 text-sm text-gray-700">PDF</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="format"
                        value="excel"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700">Excel</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="format"
                        value="csv"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700">CSV</span>
                    </label>
                  </div>
                </fieldset>

                {/* Generate Button */}
                <div className="flex space-x-4 pt-4 border-t">
                  <Button className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Generate Report
                  </Button>
                  <Button variant="secondary">
                    Preview Report
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent Reports */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Recent Health Reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500">
              <Heart className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No recent health reports available</p>
              <p className="text-sm mt-2">Generated reports will appear here for download</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}