'use client';

/**
 * Force dynamic rendering for compliance monitoring - requires current data
 */
export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { fetchComplianceDashboardData } from './data';
import { type ComplianceReport } from '@/types/reports';
import { useToast } from '@/hooks/use-toast';
import { Shield, AlertTriangle, CheckCircle, Search, Filter, FileText, Calendar, TrendingUp } from 'lucide-react';

/**
 * Compliance Main Page
 * 
 * Comprehensive compliance monitoring dashboard for tracking
 * HIPAA, FERPA, and other regulatory compliance requirements.
 */
export default function CompliancePage() {
  const [complianceData, setComplianceData] = useState<ComplianceReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedDateRange, setSelectedDateRange] = useState<string>('30');
  const { toast } = useToast();

  /**
   * Load compliance data from API
   */
  useEffect(() => {
    const loadComplianceData = async () => {
      setLoading(true);
      
      try {
        const filters = {
          dateRange: selectedDateRange
        };
        
        const { complianceData: complianceResponse, error } = 
          await fetchComplianceDashboardData(filters);
        
        setComplianceData(complianceResponse);
        
        if (error) {
          toast({
            title: 'Error',
            description: error,
            variant: 'destructive',
          });
        }
      } catch (error) {
        console.error('Failed to load compliance data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load compliance data. Please try again.',
          variant: 'destructive',
        });
        setComplianceData(null);
      } finally {
        setLoading(false);
      }
    };

    loadComplianceData();
  }, [selectedDateRange, toast]);

  const handleViewComplianceHistory = () => {
    window.location.href = '/dashboard/compliance/history';
  };

  const handleGenerateAudit = () => {
    window.location.href = '/dashboard/compliance/audit';
  };

  const formatDate = (dateString: string | Date) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getComplianceStatusBadge = (status: string) => {
    const statusStyles = {
      'COMPLIANT': 'bg-green-100 text-green-800',
      'WARNING': 'bg-yellow-100 text-yellow-800',
      'NON_COMPLIANT': 'bg-red-100 text-red-800',
    };

    const statusIcons = {
      'COMPLIANT': <CheckCircle className="w-3 h-3 mr-1" />,
      'WARNING': <AlertTriangle className="w-3 h-3 mr-1" />,
      'NON_COMPLIANT': <AlertTriangle className="w-3 h-3 mr-1" />,
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[status as keyof typeof statusStyles] || statusStyles.WARNING}`}>
        {statusIcons[status as keyof typeof statusIcons]}
        {status.replace('_', ' ')}
      </span>
    );
  };

  const getComplianceScore = () => {
    if (!complianceData?.overallScore) return 0;
    return Math.round(complianceData.overallScore);
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const filteredViolations = complianceData?.violations?.filter(violation => {
    const matchesSearch = !searchTerm || 
      violation.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      violation.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !selectedCategory || violation.type === selectedCategory;
    
    return matchesSearch && matchesCategory;
  }) || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Compliance Dashboard</h1>
              <p className="text-gray-600 mt-2">Monitor HIPAA, FERPA, and regulatory compliance</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleViewComplianceHistory}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
              >
                <FileText className="w-4 h-4 mr-2" />
                View History
              </button>
              <button
                onClick={handleGenerateAudit}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
              >
                <Shield className="w-4 h-4 mr-2" />
                Generate Audit
              </button>
            </div>
          </div>
        </div>

        {/* Compliance Score Overview */}
        <div className="mb-8 bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Overall Compliance Score</h2>
              <p className="text-gray-600">Based on HIPAA, FERPA, and internal policy adherence</p>
            </div>
            <div className="text-center">
              <div className={`text-4xl font-bold ${getScoreColor(getComplianceScore())}`}>
                {getComplianceScore()}%
              </div>
              <p className="text-sm text-gray-500 mt-1">Last 30 days</p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <h3 className="text-sm font-medium text-gray-700">HIPAA Logs</h3>
            <p className="text-2xl font-bold text-blue-600">{complianceData?.hipaaLogs?.length || 0}</p>
            <p className="text-xs text-gray-500 mt-1">Access logs recorded</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <h3 className="text-sm font-medium text-gray-700">Medication Compliance</h3>
            <p className="text-2xl font-bold text-green-600">
              {complianceData?.medicationCompliance?.find(m => m.isActive)?.count || 0}
            </p>
            <p className="text-xs text-gray-500 mt-1">Active medications tracked</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <h3 className="text-sm font-medium text-gray-700">Vaccination Records</h3>
            <p className="text-2xl font-bold text-purple-600">{complianceData?.vaccinationRecords || 0}</p>
            <p className="text-xs text-gray-500 mt-1">Records maintained</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <h3 className="text-sm font-medium text-gray-700">Violations</h3>
            <p className="text-2xl font-bold text-red-600">{complianceData?.violations?.length || 0}</p>
            <p className="text-xs text-gray-500 mt-1">Issues to address</p>
          </div>
        </div>

        {/* Compliance Categories */}
        {complianceData?.categoryScores && (
          <div className="mb-8 bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Compliance by Category</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {complianceData.categoryScores.map((category) => (
                <div key={category.category} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">{category.category}</h3>
                    {getComplianceStatusBadge(category.status)}
                  </div>
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${category.status === 'COMPLIANT' ? 'bg-green-500' : category.status === 'WARNING' ? 'bg-yellow-500' : 'bg-red-500'}`}
                        style={{ width: `${category.percentage}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-700">{category.percentage}%</span>
                  </div>
                  <p className="text-xs text-gray-600">
                    {category.score} / {category.maxScore} points
                  </p>
                  {category.issues && category.issues.length > 0 && (
                    <div className="mt-2">
                      <p className="text-xs text-red-600">{category.issues.length} issue(s) found</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Date Range Filter */}
        <div className="mb-6 bg-white p-4 rounded-lg shadow-sm border">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                <Search className="w-4 h-4 inline mr-1" />
                Search Violations
              </label>
              <input
                id="search"
                type="text"
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                placeholder="Search by type or description..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                <Filter className="w-4 h-4 inline mr-1" />
                Category
              </label>
              <select
                id="category"
                value={selectedCategory}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Categories</option>
                <option value="HIPAA">HIPAA</option>
                <option value="FERPA">FERPA</option>
                <option value="DATA_SECURITY">Data Security</option>
                <option value="ACCESS_CONTROL">Access Control</option>
                <option value="DOCUMENTATION">Documentation</option>
              </select>
            </div>
            <div>
              <label htmlFor="dateRange" className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Date Range
              </label>
              <select
                id="dateRange"
                value={selectedDateRange}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedDateRange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 90 days</option>
                <option value="365">Last year</option>
              </select>
            </div>
          </div>
        </div>

        {/* Violations List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredViolations.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <Shield className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              {complianceData?.violations?.length === 0 ? 'No compliance violations found' : 'No violations match your filters'}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {complianceData?.violations?.length === 0 
                ? 'Great job maintaining compliance standards!' 
                : 'Try adjusting your search or filter criteria.'}
            </p>
          </div>
        ) : (
          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Compliance Violations</h2>
              <p className="text-sm text-gray-600">
                {filteredViolations.length} violation(s) found
              </p>
            </div>
            <div className="divide-y divide-gray-200">
              {filteredViolations.map((violation) => (
                <div
                  key={violation.id}
                  className="p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-medium text-gray-900">
                          {violation.type.replace('_', ' ')}
                        </h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          violation.severity === 'HIGH' ? 'bg-red-100 text-red-800' :
                          violation.severity === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {violation.severity}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        {violation.description}
                      </p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          Detected: {formatDate(violation.detectedAt)}
                        </div>
                        {violation.resolvedAt && (
                          <div className="flex items-center">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Resolved: {formatDate(violation.resolvedAt)}
                          </div>
                        )}
                        {violation.affectedEntity && (
                          <div>
                            Entity: {violation.affectedEntity}
                          </div>
                        )}
                      </div>
                      {violation.resolution && (
                        <div className="mt-3 p-3 bg-green-50 rounded-md">
                          <p className="text-sm text-green-800">
                            <strong>Resolution:</strong> {violation.resolution}
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      {!violation.resolvedAt && (
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors">
                          Mark Resolved
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommendations */}
        {complianceData?.recommendations && complianceData.recommendations.length > 0 && (
          <div className="mt-8 bg-blue-50 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Recommendations
            </h2>
            <ul className="space-y-2">
              {complianceData.recommendations.map((recommendation, index) => (
                <li key={index} className="text-sm text-blue-800 flex items-start">
                  <CheckCircle className="w-4 h-4 mr-2 mt-0.5 text-blue-600" />
                  {recommendation}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
