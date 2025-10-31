/**
 * ExportContent Component - White Cross Healthcare Platform
 * 
 * Healthcare data export management featuring:
 * - Student health records export
 * - Medication logs and compliance reports
 * - HIPAA-compliant data export formats
 * - Audit trail and activity logging
 * - Custom report generation
 * 
 * @component ExportContent
 */

'use client';

import React, { useState } from 'react';
import { 
  Download,
  FileText,
  Calendar,
  Pill,
  Shield,
  Eye,
  Settings,
  Clock,
  AlertTriangle,
  Search,
  MoreVertical,
  FileSpreadsheet,
  Archive,
  Lock
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/navigation/Tabs';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';

interface ExportJob {
  id: string;
  name: string;
  type: 'health-records' | 'medications' | 'appointments' | 'incidents' | 'compliance';
  format: 'csv' | 'xlsx' | 'pdf' | 'json';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  created: string;
  completed?: string;
  fileSize?: string;
  recordCount: number;
  requestedBy: string;
  hipaaApproved: boolean;
}

interface ExportTemplate {
  id: string;
  name: string;
  description: string;
  type: 'health-records' | 'medications' | 'appointments' | 'incidents' | 'compliance';
  fields: string[];
  lastUsed: string;
  usage: number;
}

export default function ExportContent() {
  const [selectedTab, setSelectedTab] = useState('create');
  const [exportType, setExportType] = useState('health-records');
  const [exportFormat, setExportFormat] = useState('csv');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Mock data - In real implementation, this would come from API
  const exportJobs: ExportJob[] = [
    {
      id: '1',
      name: 'Student Health Records Q1 2024',
      type: 'health-records',
      format: 'xlsx',
      status: 'completed',
      created: '2024-01-15 14:30:00',
      completed: '2024-01-15 14:35:00',
      fileSize: '2.4 MB',
      recordCount: 847,
      requestedBy: 'Nurse Johnson',
      hipaaApproved: true
    },
    {
      id: '2',
      name: 'Medication Administration Log',
      type: 'medications',
      format: 'pdf',
      status: 'processing',
      created: '2024-01-15 13:45:00',
      recordCount: 1247,
      requestedBy: 'Dr. Martinez',
      hipaaApproved: true
    },
    {
      id: '3',
      name: 'Immunization Compliance Report',
      type: 'compliance',
      format: 'csv',
      status: 'pending',
      created: '2024-01-15 12:20:00',
      recordCount: 823,
      requestedBy: 'Admin Wilson',
      hipaaApproved: false
    },
    {
      id: '4',
      name: 'Emergency Incidents Summary',
      type: 'incidents',
      format: 'pdf',
      status: 'failed',
      created: '2024-01-15 10:15:00',
      recordCount: 23,
      requestedBy: 'Nurse Davis',
      hipaaApproved: true
    }
  ];

  const exportTemplates: ExportTemplate[] = [
    {
      id: '1',
      name: 'Standard Health Records',
      description: 'Complete student health information including medical history, allergies, and current conditions',
      type: 'health-records',
      fields: ['Student ID', 'Name', 'DOB', 'Grade', 'Medical History', 'Allergies', 'Current Medications'],
      lastUsed: '2024-01-15',
      usage: 25
    },
    {
      id: '2',
      name: 'Medication Log Export',
      description: 'Detailed medication administration records with timestamps and nurse signatures',
      type: 'medications',
      fields: ['Date/Time', 'Student', 'Medication', 'Dose', 'Route', 'Administered By', 'Notes'],
      lastUsed: '2024-01-14',
      usage: 18
    },
    {
      id: '3',
      name: 'Immunization Status Report',
      description: 'Vaccination records and compliance status for all enrolled students',
      type: 'compliance',
      fields: ['Student Name', 'Grade', 'Required Vaccines', 'Completed Vaccines', 'Missing Vaccines', 'Exemptions'],
      lastUsed: '2024-01-12',
      usage: 12
    }
  ];





  const getTypeIcon = (type: ExportJob['type']) => {
    switch (type) {
      case 'health-records': return FileText;
      case 'medications': return Pill;
      case 'appointments': return Calendar;
      case 'incidents': return AlertTriangle;
      case 'compliance': return Shield;
      default: return FileText;
    }
  };

  const getFormatIcon = (format: ExportJob['format']) => {
    switch (format) {
      case 'xlsx': return FileSpreadsheet;
      case 'csv': return FileSpreadsheet;
      case 'pdf': return FileText;
      case 'json': return FileText;
      default: return FileText;
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Data Export</h1>
          <p className="text-gray-600 mt-1">Export healthcare data with HIPAA compliance and audit tracking</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Export Settings
          </Button>
          <Button size="sm">
            <Download className="h-4 w-4 mr-2" />
            New Export
          </Button>
        </div>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="create">Create Export</TabsTrigger>
          <TabsTrigger value="jobs">Export Jobs</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        {/* Create Export Tab */}
        <TabsContent value="create" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Export Configuration */}
            <Card>
              <CardHeader>
                <CardTitle>Export Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Data Type
                  </label>
                  <Select
                    value={exportType}
                    onChange={(value) => setExportType(value as string)}
                    options={[
                      { value: 'health-records', label: 'Student Health Records' },
                      { value: 'medications', label: 'Medication Logs' },
                      { value: 'appointments', label: 'Appointment History' },
                      { value: 'incidents', label: 'Incident Reports' },
                      { value: 'compliance', label: 'Compliance Reports' }
                    ]}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Export Format
                  </label>
                  <Select
                    value={exportFormat}
                    onChange={(value) => setExportFormat(value as string)}
                    options={[
                      { value: 'csv', label: 'CSV (Comma Separated)' },
                      { value: 'xlsx', label: 'Excel Spreadsheet' },
                      { value: 'pdf', label: 'PDF Report' },
                      { value: 'json', label: 'JSON Data' }
                    ]}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date Range
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input type="date" placeholder="Start Date" />
                    <Input type="date" placeholder="End Date" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Export Name
                  </label>
                  <Input placeholder="Enter export job name..." />
                </div>

                <div className="flex items-center space-x-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <Shield className="h-5 w-5 text-yellow-600" />
                  <div>
                    <p className="text-sm font-medium text-yellow-800">HIPAA Compliance Required</p>
                    <p className="text-xs text-yellow-700">This export contains PHI and requires administrative approval</p>
                  </div>
                </div>

                <Button className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Create Export Job
                </Button>
              </CardContent>
            </Card>

            {/* Export Preview */}
            <Card>
              <CardHeader>
                <CardTitle>Export Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Data Summary</h4>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>Estimated Records:</span>
                        <span className="font-medium">847 students</span>
                      </div>
                      <div className="flex justify-between">
                        <span>File Size (approx.):</span>
                        <span className="font-medium">2.1 MB</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Processing Time:</span>
                        <span className="font-medium">~3-5 minutes</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Fields to Export</h4>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {[
                        'Student ID', 'Full Name', 'Date of Birth', 'Grade Level',
                        'Medical History', 'Known Allergies', 'Current Medications',
                        'Emergency Contacts', 'Insurance Information', 'Immunization Records'
                      ].map((field, index) => (
                        <label key={index} className="flex items-center space-x-2 cursor-pointer">
                          <input type="checkbox" defaultChecked className="rounded" />
                          <span className="text-sm text-gray-700">{field}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Lock className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-800">Secure Export</span>
                    </div>
                    <p className="text-xs text-blue-700 mt-1">
                      Export will be encrypted and access logged for audit compliance
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Export Jobs Tab */}
        <TabsContent value="jobs" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Export Jobs</CardTitle>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input 
                      placeholder="Search exports..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 w-64"
                    />
                  </div>
                  <Select
                    value={statusFilter}
                    onChange={(value) => setStatusFilter(value as string)}
                    options={[
                      { value: 'all', label: 'All Status' },
                      { value: 'completed', label: 'Completed' },
                      { value: 'processing', label: 'Processing' },
                      { value: 'pending', label: 'Pending' },
                      { value: 'failed', label: 'Failed' }
                    ]}
                    className="w-32"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {exportJobs.map((job) => {
                  const TypeIcon = getTypeIcon(job.type);
                  const FormatIcon = getFormatIcon(job.format);
                  
                  return (
                    <div key={job.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                      <div className="flex-shrink-0">
                        <TypeIcon className="h-8 w-8 text-gray-600" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium text-gray-900 truncate">{job.name}</h4>
                          <div className="flex items-center space-x-2">
                            {job.hipaaApproved && (
                              <Shield className="h-4 w-4 text-green-600" />
                            )}
                            <Badge variant={
                              job.status === 'completed' ? 'success' :
                              job.status === 'processing' ? 'info' :
                              job.status === 'pending' ? 'warning' : 'error'
                            }>
                              {job.status}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <FormatIcon className="h-4 w-4" />
                            <span>{job.format.toUpperCase()}</span>
                          </div>
                          <span>{job.recordCount} records</span>
                          {job.fileSize && <span>{job.fileSize}</span>}
                          <span>by {job.requestedBy}</span>
                        </div>
                        
                        <div className="mt-2 text-xs text-gray-400">
                          Created: {new Date(job.created).toLocaleString()}
                          {job.completed && (
                            <> • Completed: {new Date(job.completed).toLocaleString()}</>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex-shrink-0 flex items-center space-x-1">
                        {job.status === 'completed' && (
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        )}
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="mt-4 pt-4 border-t">
                <Button variant="outline" className="w-full">
                  Load More Export Jobs
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Export Templates</CardTitle>
                <Button size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Create Template
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {exportTemplates.map((template) => {
                  const TypeIcon = getTypeIcon(template.type);
                  return (
                    <Card key={template.id} className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <TypeIcon className="h-6 w-6 text-blue-600" />
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <h4 className="font-medium text-gray-900 mb-2">{template.name}</h4>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{template.description}</p>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>{template.fields.length} fields</span>
                            <span>Used {template.usage} times</span>
                          </div>
                          <div className="text-xs text-gray-400">
                            Last used: {new Date(template.lastUsed).toLocaleDateString()}
                          </div>
                        </div>
                        
                        <div className="mt-4 flex items-center space-x-2">
                          <Button variant="outline" size="sm" className="flex-1">
                            <Eye className="h-4 w-4 mr-1" />
                            Preview
                          </Button>
                          <Button size="sm" className="flex-1">
                            <Download className="h-4 w-4 mr-1" />
                            Use
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Export History & Audit Trail</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Archive className="h-5 w-5 text-blue-600" />
                    <span className="font-medium text-blue-900">Audit Compliance</span>
                  </div>
                  <Badge variant="info">HIPAA Compliant</Badge>
                </div>

                <div className="space-y-3">
                  {[
                    {
                      action: 'Export downloaded',
                      details: 'Student Health Records Q1 2024.xlsx',
                      user: 'Nurse Johnson',
                      timestamp: '2024-01-15 15:45:00',
                      ip: '192.168.1.100'
                    },
                    {
                      action: 'Export created',
                      details: 'Medication Administration Log.pdf',
                      user: 'Dr. Martinez', 
                      timestamp: '2024-01-15 13:45:00',
                      ip: '192.168.1.105'
                    },
                    {
                      action: 'Template modified',
                      details: 'Standard Health Records template updated',
                      user: 'Admin Wilson',
                      timestamp: '2024-01-15 10:30:00',
                      ip: '192.168.1.110'
                    },
                    {
                      action: 'Export deleted',
                      details: 'Outdated compliance report removed',
                      user: 'System Admin',
                      timestamp: '2024-01-14 16:20:00',
                      ip: '192.168.1.1'
                    }
                  ].map((entry, index) => (
                    <div key={index} className="flex items-center space-x-4 p-3 border border-gray-200 rounded-lg">
                      <div className="flex-shrink-0">
                        <Clock className="h-5 w-5 text-gray-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-900">{entry.action}</span>
                          <span className="text-xs text-gray-500">{new Date(entry.timestamp).toLocaleString()}</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{entry.details}</p>
                        <div className="flex items-center space-x-4 mt-1 text-xs text-gray-400">
                          <span>User: {entry.user}</span>
                          <span>IP: {entry.ip}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t">
                  <Button variant="outline" className="w-full">
                    View Full Audit Log
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}