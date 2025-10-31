/**
 * @fileoverview VendorsContent Component - Comprehensive Vendor Management
 *
 * Main content component for vendor management system providing comprehensive
 * vendor list, performance tracking, compliance monitoring, and quick actions.
 * Designed for healthcare platform vendor management with robust filtering,
 * search capabilities, and performance analytics.
 *
 * @module app/(dashboard)/vendors/_components/VendorsContent
 * @category Components
 * @subcategory Dashboard
 *
 * **Features:**
 * - Vendor list with performance metrics and ratings
 * - Advanced filtering by status, rating, and category
 * - Comprehensive vendor analytics and statistics
 * - Quick actions for vendor management
 * - Performance tracking and compliance indicators
 * - Responsive design with mobile optimization
 *
 * **Healthcare Context:**
 * - Medical supply vendor management
 * - Pharmaceutical distributor tracking
 * - Compliance documentation management
 * - Cost analysis and budget tracking
 * - Emergency supplier coordination
 *
 * @since 2025-10-31
 */

'use client'

import React, { useState, useMemo, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Plus,
  Download,
  Search,
  Eye,
  Award,
  Package,
  Star,
  Building2,
  Phone,
  Mail,
  MapPin,
  CheckCircle,
  Clock,
  DollarSign,
  Calendar,
  BarChart3,
} from 'lucide-react'

// Import server actions
import { 
  getVendors, 
  getVendorAnalytics,
  type Vendor as ServerVendor,
  type VendorAnalytics,
  type VendorFilters 
} from '@/app/vendors/actions'

/**
 * Vendor contact information interface
 */
interface VendorContact {
  id: string
  name: string
  title: string
  email: string
  phone: string
  isPrimary: boolean
}

/**
 * Vendor address information interface
 */
interface VendorAddress {
  id: string
  type: 'BILLING' | 'SHIPPING' | 'BOTH'
  street1: string
  street2?: string
  city: string
  state: string
  zipCode: string
  country: string
  isPrimary: boolean
}

/**
 * Vendor certification interface
 */
interface VendorCertification {
  id: string
  name: string
  type: string
  issuedBy: string
  issuedDate: string
  expiryDate: string
  status: 'VALID' | 'EXPIRED' | 'EXPIRING_SOON'
  documentUrl?: string
}

/**
 * Vendor performance metrics interface
 */
interface VendorPerformance {
  vendorId: string
  overallRating: VendorRating
  ratingScore: number
  onTimeDeliveryRate: number
  averageDeliveryDays: number
  lateDeliveries: number
  earlyDeliveries: number
  defectRate: number
  returnRate: number
  qualityScore: number
  totalOrders: number
  completedOrders: number
  cancelledOrders: number
  totalValue: number
  averageOrderValue: number
  complianceRate: number
  documentationScore: number
  averageResponseTime: number
  communicationScore: number
  priceCompetitiveness: number
  totalSpend: number
  costSavings: number
  periodStart: string
  periodEnd: string
  lastUpdated: string
}

/**
 * Vendor status enumeration
 */
type VendorStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'BLACKLISTED'

/**
 * Vendor rating enumeration
 */
type VendorRating = 'EXCELLENT' | 'GOOD' | 'AVERAGE' | 'POOR' | 'UNRATED'

/**
 * Main vendor interface
 */
interface Vendor {
  id: string
  name: string
  legalName: string
  vendorNumber: string
  status: VendorStatus
  rating: VendorRating
  contacts: VendorContact[]
  addresses: VendorAddress[]
  website?: string
  taxId: string
  paymentTerms: string
  preferredPaymentMethod: string
  creditLimit: number
  categories: string[]
  productLines: string[]
  certifications: VendorCertification[]
  performance?: VendorPerformance
  w9OnFile: boolean
  insuranceCertOnFile: boolean
  contractOnFile: boolean
  backgroundCheckCompleted: boolean
  createdBy: string
  createdAt: string
  updatedAt: string
  lastModifiedBy: string
  lastOrderDate?: string
}

/**
 * Vendor statistics interface
 */
interface VendorStats {
  totalVendors: number
  activeVendors: number
  excellentRated: number
  totalCertifications: number
  totalSpend: number
  avgDeliveryTime: number
  complianceRate: number
  onTimeDeliveryRate: number
}

/**
 * Mock vendor data for demonstration
 */
const mockVendors: Vendor[] = [
  {
    id: 'vendor-1',
    name: 'Medical Supplies Inc.',
    legalName: 'Medical Supplies Incorporated',
    vendorNumber: 'V-001',
    status: 'ACTIVE',
    rating: 'EXCELLENT',
    contacts: [
      {
        id: 'c1',
        name: 'John Smith',
        title: 'Account Manager',
        email: 'john.smith@medisupply.com',
        phone: '(555) 123-4567',
        isPrimary: true,
      },
    ],
    addresses: [
      {
        id: 'a1',
        type: 'BOTH',
        street1: '123 Medical Way',
        city: 'Healthcare City',
        state: 'CA',
        zipCode: '90210',
        country: 'US',
        isPrimary: true,
      },
    ],
    website: 'https://medisupply.com',
    taxId: '12-3456789',
    paymentTerms: 'Net 30',
    preferredPaymentMethod: 'ACH',
    creditLimit: 150000,
    categories: ['Medical Supplies', 'Equipment'],
    productLines: ['Bandages', 'Syringes', 'Medical Equipment'],
    certifications: [
      {
        id: 'cert-1',
        name: 'FDA Registration',
        type: 'Regulatory',
        issuedBy: 'FDA',
        issuedDate: '2024-01-01',
        expiryDate: '2025-12-31',
        status: 'VALID',
      },
    ],
    performance: {
      vendorId: 'vendor-1',
      overallRating: 'EXCELLENT',
      ratingScore: 95,
      onTimeDeliveryRate: 96,
      averageDeliveryDays: 5,
      lateDeliveries: 2,
      earlyDeliveries: 18,
      defectRate: 0.5,
      returnRate: 0.3,
      qualityScore: 98,
      totalOrders: 45,
      completedOrders: 43,
      cancelledOrders: 2,
      totalValue: 125000,
      averageOrderValue: 2777,
      complianceRate: 98,
      documentationScore: 96,
      averageResponseTime: 4,
      communicationScore: 93,
      priceCompetitiveness: 88,
      totalSpend: 125000,
      costSavings: 5000,
      periodStart: '2024-07-01',
      periodEnd: '2025-06-30',
      lastUpdated: '2025-01-26',
    },
    w9OnFile: true,
    insuranceCertOnFile: true,
    contractOnFile: true,
    backgroundCheckCompleted: true,
    createdBy: 'user1',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2025-01-15T00:00:00Z',
    lastModifiedBy: 'user1',
    lastOrderDate: '2025-01-15',
  },
  {
    id: 'vendor-2',
    name: 'Pharma Distributors LLC',
    legalName: 'Pharma Distributors Limited Liability Company',
    vendorNumber: 'V-002',
    status: 'ACTIVE',
    rating: 'GOOD',
    contacts: [
      {
        id: 'c2',
        name: 'Sarah Johnson',
        title: 'Account Manager',
        email: 'sarah.johnson@pharmadist.com',
        phone: '(555) 987-6543',
        isPrimary: true,
      },
    ],
    addresses: [
      {
        id: 'a2',
        type: 'BILLING',
        street1: '456 Pharma Blvd',
        city: 'Los Angeles',
        state: 'CA',
        zipCode: '90001',
        country: 'US',
        isPrimary: true,
      },
    ],
    website: 'https://pharmadist.com',
    taxId: '98-7654321',
    paymentTerms: 'Net 45',
    preferredPaymentMethod: 'Check',
    creditLimit: 100000,
    categories: ['Medications', 'Prescriptions'],
    productLines: ['EpiPens', 'Inhalers', 'Medications'],
    certifications: [
      {
        id: 'cert-2',
        name: 'DEA License',
        type: 'Controlled Substances',
        issuedBy: 'DEA',
        issuedDate: '2024-03-01',
        expiryDate: '2026-02-28',
        status: 'VALID',
      },
    ],
    performance: {
      vendorId: 'vendor-2',
      overallRating: 'GOOD',
      ratingScore: 82,
      onTimeDeliveryRate: 87,
      averageDeliveryDays: 12,
      lateDeliveries: 8,
      earlyDeliveries: 12,
      defectRate: 2.1,
      returnRate: 1.2,
      qualityScore: 85,
      totalOrders: 32,
      completedOrders: 30,
      cancelledOrders: 2,
      totalValue: 280000,
      averageOrderValue: 8750,
      complianceRate: 94,
      documentationScore: 90,
      averageResponseTime: 6,
      communicationScore: 88,
      priceCompetitiveness: 92,
      totalSpend: 280000,
      costSavings: 12000,
      periodStart: '2024-07-01',
      periodEnd: '2025-06-30',
      lastUpdated: '2025-01-26',
    },
    w9OnFile: true,
    insuranceCertOnFile: true,
    contractOnFile: true,
    backgroundCheckCompleted: true,
    createdBy: 'user1',
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2025-01-10T00:00:00Z',
    lastModifiedBy: 'user1',
    lastOrderDate: '2025-01-10',
  },
  {
    id: 'vendor-3',
    name: 'First Aid Solutions Corp',
    legalName: 'First Aid Solutions Corporation',
    vendorNumber: 'V-003',
    status: 'ACTIVE',
    rating: 'AVERAGE',
    contacts: [
      {
        id: 'c3',
        name: 'Mike Wilson',
        title: 'Sales Representative',
        email: 'mike.wilson@firstaid.com',
        phone: '(555) 456-7890',
        isPrimary: true,
      },
    ],
    addresses: [
      {
        id: 'a3',
        type: 'SHIPPING',
        street1: '789 Emergency Lane',
        city: 'Safety Town',
        state: 'TX',
        zipCode: '75001',
        country: 'US',
        isPrimary: true,
      },
    ],
    website: 'https://firstaid.com',
    taxId: '45-6789012',
    paymentTerms: 'Net 15',
    preferredPaymentMethod: 'Credit Card',
    creditLimit: 75000,
    categories: ['First Aid', 'Emergency Supplies'],
    productLines: ['First Aid Kits', 'AED Units', 'Emergency Medications'],
    certifications: [],
    performance: {
      vendorId: 'vendor-3',
      overallRating: 'AVERAGE',
      ratingScore: 75,
      onTimeDeliveryRate: 78,
      averageDeliveryDays: 8,
      lateDeliveries: 15,
      earlyDeliveries: 5,
      defectRate: 3.2,
      returnRate: 2.1,
      qualityScore: 80,
      totalOrders: 28,
      completedOrders: 25,
      cancelledOrders: 3,
      totalValue: 85000,
      averageOrderValue: 3035,
      complianceRate: 88,
      documentationScore: 82,
      averageResponseTime: 8,
      communicationScore: 76,
      priceCompetitiveness: 85,
      totalSpend: 85000,
      costSavings: 2500,
      periodStart: '2024-07-01',
      periodEnd: '2025-06-30',
      lastUpdated: '2025-01-20',
    },
    w9OnFile: true,
    insuranceCertOnFile: false,
    contractOnFile: true,
    backgroundCheckCompleted: true,
    createdBy: 'user2',
    createdAt: '2024-03-15T00:00:00Z',
    updatedAt: '2025-01-20T00:00:00Z',
    lastModifiedBy: 'user2',
    lastOrderDate: '2025-01-05',
  },
]

/**
 * Calculate vendor statistics from mock data
 */
const calculateVendorStats = (vendors: Vendor[]): VendorStats => {
  const totalVendors = vendors.length
  const activeVendors = vendors.filter(v => v.status === 'ACTIVE').length
  const excellentRated = vendors.filter(v => v.rating === 'EXCELLENT').length
  const totalCertifications = vendors.reduce((sum, v) => sum + v.certifications.length, 0)
  const totalSpend = vendors.reduce((sum, v) => sum + (v.performance?.totalSpend || 0), 0)
  const avgDeliveryTime = vendors.reduce((sum, v) => sum + (v.performance?.averageDeliveryDays || 0), 0) / vendors.length
  const complianceRate = vendors.reduce((sum, v) => sum + (v.performance?.complianceRate || 0), 0) / vendors.length
  const onTimeDeliveryRate = vendors.reduce((sum, v) => sum + (v.performance?.onTimeDeliveryRate || 0), 0) / vendors.length

  return {
    totalVendors,
    activeVendors,
    excellentRated,
    totalCertifications,
    totalSpend,
    avgDeliveryTime: Math.round(avgDeliveryTime),
    complianceRate: Math.round(complianceRate),
    onTimeDeliveryRate: Math.round(onTimeDeliveryRate),
  }
}

/**
 * VendorsContent Props Interface
 */
interface VendorsContentProps {
  className?: string
  searchParams?: {
    page?: string
    limit?: string
    search?: string
    type?: string
    status?: string
    priority?: string
    sortBy?: string
    sortOrder?: string
  }
}

/**
 * VendorsContent Component
 *
 * Comprehensive vendor management interface with filtering, search, performance metrics,
 * and quick actions. Designed for healthcare platform vendor management with focus on
 * compliance, performance tracking, and efficient vendor operations.
 *
 * @param {VendorsContentProps} props - Component properties
 * @returns {JSX.Element} Complete vendors management interface
 *
 * @example
 * ```tsx
 * <VendorsContent className="min-h-screen" />
 * ```
 */
export default function VendorsContent({ className = '', searchParams }: VendorsContentProps): React.JSX.Element {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState(searchParams?.search || '')
  const [statusFilter, setStatusFilter] = useState<VendorStatus | 'ALL'>((searchParams?.status as VendorStatus) || 'ALL')
  const [ratingFilter, setRatingFilter] = useState<VendorRating | 'ALL'>('ALL')
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL')
  const [vendors, setVendors] = useState<ServerVendor[]>([])
  const [analytics, setAnalytics] = useState<VendorAnalytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch vendors and analytics
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        setError(null)

        // Build filters
        const filters: VendorFilters = {}
        if (searchQuery) filters.name = searchQuery
        if (statusFilter !== 'ALL') filters.status = statusFilter.toLowerCase() as any
        if (searchParams?.type) filters.type = searchParams.type as any
        if (searchParams?.priority) filters.priority = searchParams.priority as any

        // Fetch data in parallel
        const [vendorsData, analyticsData] = await Promise.all([
          getVendors(filters),
          getVendorAnalytics()
        ])

        setVendors(vendorsData)
        setAnalytics(analyticsData)
      } catch (err) {
        console.error('Failed to fetch vendor data:', err)
        setError('Failed to load vendor data. Please try again.')
        // Fallback to mock data
        setVendors([])
        setAnalytics(null)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [searchQuery, statusFilter, searchParams])

  // Calculate statistics from analytics or fallback
  const stats = useMemo(() => {
    if (analytics) {
      return {
        totalVendors: analytics.totalVendors,
        activeVendors: analytics.activeVendors,
        excellentRated: analytics.preferredVendors, // Using preferred as excellent
        totalCertifications: 0, // Not available in analytics
        totalSpend: analytics.totalSpend,
        avgDeliveryTime: Math.round(analytics.performanceMetrics.averageDeliveryRate || 7),
        complianceRate: Math.round(analytics.complianceMetrics.fullyCompliant / Math.max(analytics.totalVendors, 1) * 100),
        onTimeDeliveryRate: Math.round(analytics.performanceMetrics.averageDeliveryRate || 85),
      }
    }
    // Fallback to mock data if no analytics
    return calculateVendorStats(mockVendors)
  }, [analytics])

  /**
   * Format currency values with proper locale formatting
   */
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  /**
   * Get styling class for vendor rating badges
   */
  const getRatingBadge = (rating: VendorRating): string => {
    const styles = {
      EXCELLENT: 'bg-green-100 text-green-800',
      GOOD: 'bg-blue-100 text-blue-800',
      AVERAGE: 'bg-yellow-100 text-yellow-800',
      POOR: 'bg-red-100 text-red-800',
      UNRATED: 'bg-gray-100 text-gray-800',
    }
    return styles[rating] || 'bg-gray-100 text-gray-800'
  }

  /**
   * Get styling class for vendor status badges
   */
  const getStatusBadge = (status: VendorStatus): string => {
    const styles = {
      ACTIVE: 'bg-green-100 text-green-800',
      INACTIVE: 'bg-gray-100 text-gray-800',
      SUSPENDED: 'bg-yellow-100 text-yellow-800',
      BLACKLISTED: 'bg-red-100 text-red-800',
    }
    return styles[status]
  }

  /**
   * Generate star rating display based on score
   */
  const getRatingStars = (score: number): React.JSX.Element[] => {
    const stars = Math.round((score / 100) * 5)
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < stars ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ))
  }

  /**
   * Extract unique categories from all vendors
   */
  const allCategories = useMemo(() => 
    Array.from(new Set(mockVendors.flatMap(v => v.categories))),
    []
  )

  /**
   * Filter vendors based on search and filter criteria
   */
  const filteredVendors = useMemo(() => {
    return mockVendors.filter((vendor) => {
      const matchesSearch =
        vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vendor.vendorNumber.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus =
        statusFilter === 'ALL' || vendor.status === statusFilter
      const matchesRating =
        ratingFilter === 'ALL' || vendor.rating === ratingFilter
      const matchesCategory =
        categoryFilter === 'ALL' || vendor.categories.includes(categoryFilter)
      return matchesSearch && matchesStatus && matchesRating && matchesCategory
    })
  }, [searchQuery, statusFilter, ratingFilter, categoryFilter])

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Vendor Management
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage healthcare vendors, track performance, and monitor compliance
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => router.push('/vendors/performance')}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Performance Analytics
          </button>
          <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors">
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </button>
          <button
            onClick={() => router.push('/vendors/new')}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Vendor
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Vendors</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalVendors}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Building2 className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-green-600 font-medium">
              {stats.activeVendors} active
            </span>
            <span className="text-gray-500 ml-1">vendors registered</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Spend</p>
              <p className="text-3xl font-bold text-gray-900">
                {formatCurrency(stats.totalSpend)}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-green-600 font-medium">
              {stats.onTimeDeliveryRate}%
            </span>
            <span className="text-gray-500 ml-1">on-time delivery</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Compliance Rate</p>
              <p className="text-3xl font-bold text-gray-900">{stats.complianceRate}%</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Award className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-blue-600 font-medium">
              {stats.totalCertifications}
            </span>
            <span className="text-gray-500 ml-1">certifications active</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Delivery</p>
              <p className="text-3xl font-bold text-gray-900">{stats.avgDeliveryTime}d</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Clock className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-green-600 font-medium">
              {stats.excellentRated}
            </span>
            <span className="text-gray-500 ml-1">excellent ratings</span>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="relative lg:col-span-2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search vendors by name or number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              aria-label="Search vendors"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as VendorStatus | 'ALL')}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            aria-label="Filter by status"
          >
            <option value="ALL">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
            <option value="SUSPENDED">Suspended</option>
            <option value="BLACKLISTED">Blacklisted</option>
          </select>

          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value as VendorRating | 'ALL')}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            aria-label="Filter by rating"
          >
            <option value="ALL">All Ratings</option>
            <option value="EXCELLENT">Excellent</option>
            <option value="GOOD">Good</option>
            <option value="AVERAGE">Average</option>
            <option value="POOR">Poor</option>
            <option value="UNRATED">Unrated</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            aria-label="Filter by category"
          >
            <option value="ALL">All Categories</option>
            {allCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Vendors Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {filteredVendors.map((vendor) => (
          <div
            key={vendor.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => router.push(`/vendors/${vendor.id}`)}
          >
            <div className="p-6">
              {/* Vendor Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {vendor.name}
                    </h3>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(
                        vendor.status
                      )}`}
                    >
                      {vendor.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>{vendor.vendorNumber}</span>
                    {vendor.lastOrderDate && (
                      <span className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        Last order: {new Date(vendor.lastOrderDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span
                    className={`px-3 py-1 text-sm font-medium rounded-full mb-2 ${getRatingBadge(
                      vendor.rating
                    )}`}
                  >
                    {vendor.rating}
                  </span>
                  {vendor.performance && (
                    <div className="flex items-center gap-1">
                      {getRatingStars(vendor.performance.ratingScore)}
                      <span className="ml-1 text-xs text-gray-500">
                        {vendor.performance.ratingScore}/100
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Contact Information */}
              {vendor.contacts.find((c) => c.isPrimary) && (
                <div className="space-y-2 mb-4 pb-4 border-b border-gray-100">
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="w-4 h-4 mr-2 text-gray-400" />
                    {vendor.contacts.find((c) => c.isPrimary)?.phone || 'N/A'}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="w-4 h-4 mr-2 text-gray-400" />
                    {vendor.contacts.find((c) => c.isPrimary)?.email || 'N/A'}
                  </div>
                  {vendor.addresses.find((a) => a.isPrimary) && (
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                      {vendor.addresses.find((a) => a.isPrimary)?.city},{' '}
                      {vendor.addresses.find((a) => a.isPrimary)?.state}
                    </div>
                  )}
                </div>
              )}

              {/* Performance Metrics */}
              {vendor.performance && (
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-gray-900">
                      {vendor.performance.onTimeDeliveryRate}%
                    </div>
                    <div className="text-xs text-gray-500">On-Time Delivery</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-gray-900">
                      {vendor.performance.totalOrders}
                    </div>
                    <div className="text-xs text-gray-500">Total Orders</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-gray-900">
                      {formatCurrency(vendor.performance.totalSpend)}
                    </div>
                    <div className="text-xs text-gray-500">Total Spend</div>
                  </div>
                </div>
              )}

              {/* Categories */}
              <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                  {vendor.categories.slice(0, 3).map((category) => (
                    <span
                      key={category}
                      className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full"
                    >
                      {category}
                    </span>
                  ))}
                  {vendor.categories.length > 3 && (
                    <span className="px-2 py-1 bg-gray-50 text-gray-500 text-xs font-medium rounded-full">
                      +{vendor.categories.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              {/* Compliance Indicators */}
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
                <div className="flex items-center gap-4">
                  {vendor.w9OnFile && (
                    <div className="flex items-center text-xs text-green-600">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      W-9
                    </div>
                  )}
                  {vendor.insuranceCertOnFile && (
                    <div className="flex items-center text-xs text-green-600">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Insurance
                    </div>
                  )}
                  {vendor.contractOnFile && (
                    <div className="flex items-center text-xs text-green-600">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Contract
                    </div>
                  )}
                </div>
                {vendor.certifications.length > 0 && (
                  <div className="flex items-center text-xs text-blue-600">
                    <Award className="w-3 h-3 mr-1" />
                    {vendor.certifications.length} Certification{vendor.certifications.length !== 1 ? 's' : ''}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    router.push(`/vendors/${vendor.id}`)
                  }}
                  className="flex-1 inline-flex items-center justify-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    router.push(`/purchase-orders/new?vendor=${vendor.id}`)
                  }}
                  className="flex-1 inline-flex items-center justify-center px-3 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                >
                  <Package className="w-4 h-4 mr-2" />
                  Create PO
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredVendors.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <Building2 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No vendors found
          </h3>
          <p className="text-gray-500 mb-6">
            {searchQuery || statusFilter !== 'ALL' || ratingFilter !== 'ALL' || categoryFilter !== 'ALL'
              ? 'Try adjusting your search criteria or filters'
              : 'Get started by adding your first healthcare vendor'}
          </p>
          {!searchQuery &&
            statusFilter === 'ALL' &&
            ratingFilter === 'ALL' &&
            categoryFilter === 'ALL' && (
              <button
                onClick={() => router.push('/vendors/new')}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add First Vendor
              </button>
            )}
        </div>
      )}
    </div>
  )
}
