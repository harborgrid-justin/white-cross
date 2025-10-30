'use client'

import React, { useState, useMemo } from 'react'
import { 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown, 
  Shield, 
  Eye, 
  Calendar, 
  Filter, 
  Search, 
  MoreHorizontal, 
  Download,
  Bell,
  Target,
  Activity,
  BarChart3,
  PieChart,
  AlertCircle,
  CheckCircle2,
  Clock,
  Users
} from 'lucide-react'

/**
 * Risk severity levels for compliance risks
 */
export type RiskSeverity = 'critical' | 'high' | 'medium' | 'low'

/**
 * Risk status indicating current state
 */
export type RiskStatus = 'active' | 'mitigated' | 'monitoring' | 'closed'

/**
 * Risk category for classification
 */
export type RiskCategory = 
  | 'regulatory' 
  | 'operational' 
  | 'financial' 
  | 'reputational' 
  | 'technical' 
  | 'legal'

/**
 * Risk likelihood assessment
 */
export type RiskLikelihood = 'very-low' | 'low' | 'medium' | 'high' | 'very-high'

/**
 * Mitigation strategy for addressing risks
 */
export interface MitigationStrategy {
  id: string
  title: string
  description: string
  assignedTo: string
  dueDate: string
  status: 'pending' | 'in-progress' | 'completed'
  effectiveness: number
}

/**
 * Impact assessment for a compliance risk
 */
export interface RiskImpact {
  financial: number
  operational: number
  regulatory: number
  reputational: number
}

/**
 * Comprehensive compliance risk interface
 */
export interface ComplianceRisk {
  id: string
  title: string
  description: string
  category: RiskCategory
  severity: RiskSeverity
  likelihood: RiskLikelihood
  status: RiskStatus
  impact: RiskImpact
  riskScore: number
  identifiedDate: string
  lastAssessed: string
  nextReview: string
  owner: string
  mitigationStrategies: MitigationStrategy[]
  residualRisk: number
  inherentRisk: number
  controlEffectiveness: number
  relatedCompliance: string[]
  tags: string[]
}

/**
 * Props for the ComplianceRisk component
 */
export interface ComplianceRiskProps {
  /** Array of compliance risks to display */
  risks?: ComplianceRisk[]
  /** Callback when a risk is selected */
  onRiskSelect?: (risk: ComplianceRisk) => void
  /** Callback when creating a new risk assessment */
  onCreateRisk?: () => void
  /** Loading state */
  loading?: boolean
  /** Error state */
  error?: string | null
  /** Additional CSS classes */
  className?: string
}

/**
 * ComplianceRisk component for managing and displaying compliance risk assessments
 * 
 * Features:
 * - Risk dashboard with key metrics
 * - Risk matrix visualization
 * - Filtering and search capabilities
 * - Detailed risk cards with mitigation tracking
 * - Risk trend analysis
 * - Mitigation strategy management
 * - Risk scoring and prioritization
 * 
 * @param props - Component props
 * @returns JSX element
 */
export default function ComplianceRisk({
  risks = [],
  onRiskSelect,
  onCreateRisk,
  loading = false,
  error = null,
  className = ''
}: ComplianceRiskProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState<RiskCategory | 'all'>('all')
  const [filterSeverity, setFilterSeverity] = useState<RiskSeverity | 'all'>('all')
  const [filterStatus, setFilterStatus] = useState<RiskStatus | 'all'>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'matrix' | 'list'>('grid')
  const [sortBy, setSortBy] = useState<'riskScore' | 'lastAssessed' | 'nextReview'>('riskScore')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  // Filter and sort risks
  const filteredRisks = useMemo(() => {
    return risks
      .filter(risk => {
        const matchesSearch = risk.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          risk.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          risk.owner.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesCategory = filterCategory === 'all' || risk.category === filterCategory
        const matchesSeverity = filterSeverity === 'all' || risk.severity === filterSeverity
        const matchesStatus = filterStatus === 'all' || risk.status === filterStatus
        
        return matchesSearch && matchesCategory && matchesSeverity && matchesStatus
      })
      .sort((a, b) => {
        const multiplier = sortOrder === 'asc' ? 1 : -1
        
        if (sortBy === 'riskScore') {
          return (a.riskScore - b.riskScore) * multiplier
        } else if (sortBy === 'lastAssessed') {
          return (new Date(a.lastAssessed).getTime() - new Date(b.lastAssessed).getTime()) * multiplier
        } else {
          return (new Date(a.nextReview).getTime() - new Date(b.nextReview).getTime()) * multiplier
        }
      })
  }, [risks, searchTerm, filterCategory, filterSeverity, filterStatus, sortBy, sortOrder])

  // Calculate risk metrics
  const riskMetrics = useMemo(() => {
    const total = risks.length
    const critical = risks.filter(r => r.severity === 'critical').length
    const high = risks.filter(r => r.severity === 'high').length
    const medium = risks.filter(r => r.severity === 'medium').length
    const low = risks.filter(r => r.severity === 'low').length
    const active = risks.filter(r => r.status === 'active').length
    const avgRiskScore = risks.length > 0 ? risks.reduce((sum, r) => sum + r.riskScore, 0) / risks.length : 0
    const overdue = risks.filter(r => new Date(r.nextReview) < new Date()).length

    return { total, critical, high, medium, low, active, avgRiskScore, overdue }
  }, [risks])

  const getSeverityColor = (severity: RiskSeverity): string => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200'
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200'
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'low': return 'text-green-600 bg-green-50 border-green-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getStatusColor = (status: RiskStatus): string => {
    switch (status) {
      case 'active': return 'text-red-600 bg-red-50'
      case 'mitigated': return 'text-green-600 bg-green-50'
      case 'monitoring': return 'text-blue-600 bg-blue-50'
      case 'closed': return 'text-gray-600 bg-gray-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const formatRiskScore = (score: number): string => {
    return score.toFixed(1)
  }

  if (loading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}>
        <div className="flex items-center">
          <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
          <span className="text-red-800">Error loading risks: {error}</span>
        </div>
      </div>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Risk Management</h2>
          <p className="text-gray-600 mt-1">Monitor and manage compliance risks</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onCreateRisk}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            aria-label="Create new risk assessment"
          >
            <AlertTriangle className="h-4 w-4" />
            New Risk Assessment
          </button>
        </div>
      </div>

      {/* Risk Metrics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Risks</p>
              <p className="text-2xl font-bold text-gray-900">{riskMetrics.total}</p>
            </div>
            <Shield className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Critical/High</p>
              <p className="text-2xl font-bold text-red-600">{riskMetrics.critical + riskMetrics.high}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Risk Score</p>
              <p className="text-2xl font-bold text-orange-600">{formatRiskScore(riskMetrics.avgRiskScore)}</p>
            </div>
            <BarChart3 className="h-8 w-8 text-orange-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Overdue Reviews</p>
              <p className="text-2xl font-bold text-red-600">{riskMetrics.overdue}</p>
            </div>
            <Clock className="h-8 w-8 text-red-600" />
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col lg:flex-row gap-4 bg-white p-4 rounded-lg border">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search risks..."
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            aria-label="Search risks"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          <select
            value={filterCategory}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilterCategory(e.target.value as RiskCategory | 'all')}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            aria-label="Filter by category"
          >
            <option value="all">All Categories</option>
            <option value="regulatory">Regulatory</option>
            <option value="operational">Operational</option>
            <option value="financial">Financial</option>
            <option value="reputational">Reputational</option>
            <option value="technical">Technical</option>
            <option value="legal">Legal</option>
          </select>

          <select
            value={filterSeverity}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilterSeverity(e.target.value as RiskSeverity | 'all')}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            aria-label="Filter by severity"
          >
            <option value="all">All Severities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilterStatus(e.target.value as RiskStatus | 'all')}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            aria-label="Filter by status"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="mitigated">Mitigated</option>
            <option value="monitoring">Monitoring</option>
            <option value="closed">Closed</option>
          </select>

          <select
            value={viewMode}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setViewMode(e.target.value as 'grid' | 'matrix' | 'list')}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            aria-label="Change view mode"
          >
            <option value="grid">Grid View</option>
            <option value="matrix">Risk Matrix</option>
            <option value="list">List View</option>
          </select>
        </div>
      </div>

      {/* Risk Content */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRisks.map((risk) => (
            <div
              key={risk.id}
              className="bg-white p-6 rounded-lg border hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => onRiskSelect?.(risk)}
              role="button"
              tabIndex={0}
              onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  onRiskSelect?.(risk)
                }
              }}
              aria-label={`View details for ${risk.title}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{risk.title}</h3>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(risk.severity)}`}>
                    {risk.severity.charAt(0).toUpperCase() + risk.severity.slice(1)}
                  </span>
                </div>
                <button
                  onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                    e.stopPropagation()
                    // Handle menu actions
                  }}
                  className="text-gray-400 hover:text-gray-600"
                  aria-label="More options"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </div>

              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{risk.description}</p>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Risk Score:</span>
                  <span className="font-medium text-gray-900">{formatRiskScore(risk.riskScore)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Status:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(risk.status)}`}>
                    {risk.status.charAt(0).toUpperCase() + risk.status.slice(1)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Next Review:</span>
                  <span className="font-medium text-gray-900">
                    {new Date(risk.nextReview).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Owner:</span>
                  <span className="font-medium text-gray-900">{risk.owner}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Mitigation Progress:</span>
                  <span className="font-medium text-gray-900">
                    {risk.mitigationStrategies.filter(s => s.status === 'completed').length}/{risk.mitigationStrategies.length}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {viewMode === 'list' && (
        <div className="bg-white rounded-lg border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Risk
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Severity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Risk Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Owner
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Next Review
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRisks.map((risk) => (
                  <tr
                    key={risk.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => onRiskSelect?.(risk)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e: React.KeyboardEvent<HTMLTableRowElement>) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        onRiskSelect?.(risk)
                      }
                    }}
                    aria-label={`View details for ${risk.title}`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{risk.title}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">{risk.description}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900 capitalize">{risk.category}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(risk.severity)}`}>
                        {risk.severity.charAt(0).toUpperCase() + risk.severity.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(risk.status)}`}>
                        {risk.status.charAt(0).toUpperCase() + risk.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatRiskScore(risk.riskScore)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {risk.owner}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(risk.nextReview).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                          e.stopPropagation()
                          onRiskSelect?.(risk)
                        }}
                        className="text-blue-600 hover:text-blue-900"
                        aria-label={`View ${risk.title}`}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {filteredRisks.length === 0 && (
        <div className="text-center py-12">
          <Shield className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No risks found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || filterCategory !== 'all' || filterSeverity !== 'all' || filterStatus !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Get started by creating your first risk assessment'}
          </p>
          {(!searchTerm && filterCategory === 'all' && filterSeverity === 'all' && filterStatus === 'all') && (
            <div className="mt-6">
              <button
                onClick={onCreateRisk}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Risk Assessment
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
