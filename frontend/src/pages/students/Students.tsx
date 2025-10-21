/**
 * Students Page - White Cross Healthcare Platform
 * Student management and overview
 * 
 * @fileoverview Students management page component
 * @module pages/students/Students
 * @version 1.0.0
 */

import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  Search, 
  Plus, 
  Filter, 
  Download, 
  Users, 
  Edit, 
  Eye,
  FileText,
  Calendar,
  Phone
} from 'lucide-react'
import { useAuthContext } from '../../contexts/AuthContext'

/**
 * Student Interface
 */
interface Student {
  id: string
  firstName: string
  lastName: string
  studentNumber: string
  grade: string
  dateOfBirth: string
  guardianName: string
  guardianPhone: string
  emergencyContact: string
  medicalConditions: string[]
  allergies: string[]
  isActive: boolean
  lastVisit?: string
}

/**
 * Students Page Component
 * 
 * Features:
 * - Student search and filtering
 * - Student list with pagination
 * - Quick actions (add, edit, view)
 * - Export functionality
 * - Role-based permissions
 */
const Students: React.FC = () => {
  const { user } = useAuthContext()
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedGrade, setSelectedGrade] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(20)

  // Mock data - replace with actual API calls
  const mockStudents: Student[] = [
    {
      id: '1',
      firstName: 'John',
      lastName: 'Smith',
      studentNumber: 'ST001',
      grade: '9th',
      dateOfBirth: '2008-05-15',
      guardianName: 'Sarah Smith',
      guardianPhone: '(555) 123-4567',
      emergencyContact: '(555) 987-6543',
      medicalConditions: ['Asthma'],
      allergies: ['Peanuts'],
      isActive: true,
      lastVisit: '2024-10-15'
    },
    {
      id: '2',
      firstName: 'Emily',
      lastName: 'Johnson',
      studentNumber: 'ST002',
      grade: '10th',
      dateOfBirth: '2007-08-22',
      guardianName: 'Michael Johnson',
      guardianPhone: '(555) 234-5678',
      emergencyContact: '(555) 876-5432',
      medicalConditions: [],
      allergies: ['Tree Nuts'],
      isActive: true,
      lastVisit: '2024-10-18'
    },
    {
      id: '3',
      firstName: 'David',
      lastName: 'Brown',
      studentNumber: 'ST003',
      grade: '11th',
      dateOfBirth: '2006-12-03',
      guardianName: 'Lisa Brown',
      guardianPhone: '(555) 345-6789',
      emergencyContact: '(555) 765-4321',
      medicalConditions: ['Diabetes Type 1'],
      allergies: [],
      isActive: true,
      lastVisit: '2024-10-10'
    }
  ]

  const grades = ['9th', '10th', '11th', '12th']

  // Load students data
  useEffect(() => {
    const loadStudents = async () => {
      try {
        setLoading(true)
        // TODO: Replace with actual API call
        // const data = await studentsApi.getAll()
        
        // Simulate API delay
        setTimeout(() => {
          setStudents(mockStudents)
          setLoading(false)
        }, 1000)
      } catch (error) {
        console.error('Error loading students:', error)
        setLoading(false)
      }
    }

    loadStudents()
  }, [])

  // Filter students based on search and grade
  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.studentNumber.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesGrade = selectedGrade === 'all' || student.grade === selectedGrade
    
    return matchesSearch && matchesGrade && student.isActive
  })

  // Pagination
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedStudents = filteredStudents.slice(startIndex, startIndex + itemsPerPage)

  // Check permissions
  const canCreate = user?.role === 'ADMIN' || user?.role === 'NURSE'
  const canEdit = user?.role === 'ADMIN' || user?.role === 'NURSE'
  const canViewHealth = user?.role === 'ADMIN' || user?.role === 'NURSE' || user?.role === 'COUNSELOR'

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log('Exporting students data...')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading students...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Students</h1>
          <p className="mt-1 text-gray-600">
            Manage student records and information
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleExport}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
          {canCreate && (
            <Link
              to="/students/new"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Student
            </Link>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search students..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Grade Filter */}
          <div>
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Grades</option>
              {grades.map(grade => (
                <option key={grade} value={grade}>{grade} Grade</option>
              ))}
            </select>
          </div>

          {/* Results Count */}
          <div className="flex items-center text-sm text-gray-500">
            <Users className="h-4 w-4 mr-2" />
            {filteredStudents.length} student{filteredStudents.length !== 1 ? 's' : ''} found
          </div>
        </div>
      </div>

      {/* Students List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Grade
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Guardian
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Medical Info
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Visit
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {student.firstName} {student.lastName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {student.studentNumber}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {student.grade}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm text-gray-900">{student.guardianName}</div>
                      <div className="text-sm text-gray-500">{student.guardianPhone}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1">
                      {student.medicalConditions.map((condition, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800"
                        >
                          {condition}
                        </span>
                      ))}
                      {student.allergies.map((allergy, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800"
                        >
                          {allergy}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {student.lastVisit ? new Date(student.lastVisit).toLocaleDateString() : 'Never'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <Link
                        to={`/students/${student.id}`}
                        className="text-blue-600 hover:text-blue-900"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      {canViewHealth && (
                        <Link
                          to={`/health-records/student/${student.id}`}
                          className="text-purple-600 hover:text-purple-900"
                          title="Health Records"
                        >
                          <FileText className="h-4 w-4" />
                        </Link>
                      )}
                      <Link
                        to={`/appointments/schedule?studentId=${student.id}`}
                        className="text-green-600 hover:text-green-900"
                        title="Schedule Appointment"
                      >
                        <Calendar className="h-4 w-4" />
                      </Link>
                      <Link
                        to={`/emergency-contacts/student/${student.id}`}
                        className="text-orange-600 hover:text-orange-900"
                        title="Emergency Contacts"
                      >
                        <Phone className="h-4 w-4" />
                      </Link>
                      {canEdit && (
                        <Link
                          to={`/students/${student.id}/edit`}
                          className="text-gray-600 hover:text-gray-900"
                          title="Edit Student"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                  <span className="font-medium">
                    {Math.min(startIndex + itemsPerPage, filteredStudents.length)}
                  </span>{' '}
                  of <span className="font-medium">{filteredStudents.length}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const page = i + 1
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === page
                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    )
                  })}
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Students
