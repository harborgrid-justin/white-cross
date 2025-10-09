import React, { useState, useEffect } from 'react'
import { UserPlus, Search, Filter, MoreVertical, AlertTriangle, Pill, Edit, Trash2, X } from 'lucide-react'
import toast from 'react-hot-toast'

interface Student {
  id: string
  studentNumber: string
  firstName: string
  lastName: string
  dateOfBirth: string
  grade: string
  gender: 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY'
  isActive: boolean
  emergencyContacts: EmergencyContact[]
  allergies: Allergy[]
  medications: any[]
}

interface EmergencyContact {
  id: string
  firstName: string
  lastName: string
  relationship: string
  phoneNumber: string
  isPrimary: boolean
}

interface Allergy {
  id: string
  allergen: string
  severity: 'MILD' | 'MODERATE' | 'SEVERE' | 'LIFE_THREATENING'
}

export default function Students() {
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showEditEmergencyContact, setShowEditEmergencyContact] = useState(false)
  const [studentToDelete, setStudentToDelete] = useState<string | null>(null)
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [formData, setFormData] = useState({
    studentNumber: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    grade: '',
    gender: 'MALE' as 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY',
    emergencyContactPhone: ''
  })
  const [emergencyContactData, setEmergencyContactData] = useState({
    firstName: '',
    phoneNumber: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [searchTerm, setSearchTerm] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [gradeFilter, setGradeFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [sortBy, setSortBy] = useState('')
  const [showArchived, setShowArchived] = useState(false)
  const [selectedStudents, setSelectedStudents] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null)
  const [showExportModal, setShowExportModal] = useState(false)

  // Mock API call
  useEffect(() => {
    loadStudents()
  }, [])

  const loadStudents = async () => {
    setLoading(true)
    // Simulate API delay
    setTimeout(() => {
      const mockStudents: Student[] = [
        {
          id: '1',
          studentNumber: 'STU001',
          firstName: 'Emma',
          lastName: 'Wilson',
          dateOfBirth: '2010-03-15',
          grade: '8',
          gender: 'FEMALE',
          isActive: true,
          emergencyContacts: [
            {
              id: '1',
              firstName: 'Jennifer',
              lastName: 'Wilson',
              relationship: 'Mother',
              phoneNumber: '(555) 123-4567',
              isPrimary: true
            }
          ],
          allergies: [
            {
              id: '1',
              allergen: 'Peanuts',
              severity: 'LIFE_THREATENING'
            }
          ],
          medications: [
            { id: '1', name: 'EpiPen', dosage: '0.3mg' }
          ]
        },
        {
          id: '2',
          studentNumber: 'STU002',
          firstName: 'Liam',
          lastName: 'Davis',
          dateOfBirth: '2011-07-22',
          grade: '7',
          gender: 'MALE',
          isActive: true,
          emergencyContacts: [
            {
              id: '2',
              firstName: 'Michael',
              lastName: 'Davis',
              relationship: 'Father',
              phoneNumber: '(555) 234-5678',
              isPrimary: true
            }
          ],
          allergies: [],
          medications: [
            { id: '2', name: 'Albuterol Inhaler', dosage: '90mcg' }
          ]
        },
        {
          id: '3',
          studentNumber: 'STU003',
          firstName: 'Sophia',
          lastName: 'Miller',
          dateOfBirth: '2009-11-08',
          grade: '9',
          gender: 'FEMALE',
          isActive: true,
          emergencyContacts: [
            {
              id: '3',
              firstName: 'Lisa',
              lastName: 'Miller',
              relationship: 'Mother',
              phoneNumber: '(555) 345-6789',
              isPrimary: true
            }
          ],
          allergies: [],
          medications: []
        },
        ...Array.from({ length: 32 }, (_, i) => ({
          id: String(i + 4),
          studentNumber: `STU${String(i + 4).padStart(3, '0')}`,
          firstName: ['Oliver', 'Charlotte', 'William', 'Amelia', 'James', 'Ava', 'Benjamin', 'Isabella'][i % 8],
          lastName: ['Brown', 'Garcia', 'Rodriguez', 'Martinez', 'Anderson', 'Taylor', 'Thomas', 'Moore'][i % 8],
          dateOfBirth: `20${String(Math.floor(Math.random() * 5) + 8).padStart(2, '0')}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-15`,
          grade: String(Math.floor(Math.random() * 12) + 1),
          gender: ['MALE', 'FEMALE'][i % 2] as 'MALE' | 'FEMALE',
          isActive: true,
          emergencyContacts: [{
            id: String(i + 4),
            firstName: 'Parent',
            lastName: ['Brown', 'Garcia', 'Rodriguez', 'Martinez', 'Anderson', 'Taylor', 'Thomas', 'Moore'][i % 8],
            relationship: 'Parent',
            phoneNumber: `(555) ${String(Math.floor(Math.random() * 900) + 100)}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
            isPrimary: true
          }],
          allergies: [],
          medications: []
        }))
      ]
      setStudents(mockStudents)
      setLoading(false)
    }, 500)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    const newErrors: Record<string, string> = {}
    if (!formData.studentNumber) newErrors.studentNumber = 'Student number is required'
    if (!formData.firstName) newErrors.firstName = 'First name is required'
    if (!formData.lastName) newErrors.lastName = 'Last name is required'
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required'
    if (!formData.grade) newErrors.grade = 'Grade is required'

    // Validate date of birth is not in the future
    if (formData.dateOfBirth) {
      const dob = new Date(formData.dateOfBirth)
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      if (dob > today) {
        newErrors.dateOfBirth = 'Date of birth cannot be in the future'
      } else {
        // Validate student age is within acceptable school range (4-19 years old)
        const age = Math.floor((today.getTime() - dob.getTime()) / (365.25 * 24 * 60 * 60 * 1000))
        if (age < 4 || age > 19) {
          newErrors.dateOfBirth = 'Student must be between 4 and 19 years old'
        }
      }
    }

    // Validate emergency contact phone format
    if (formData.emergencyContactPhone && formData.emergencyContactPhone.trim() !== '') {
      const phoneRegex = /^[\d\s\-\(\)]+$/
      if (!phoneRegex.test(formData.emergencyContactPhone) || formData.emergencyContactPhone.length < 7) {
        newErrors.emergencyContactPhone = 'Invalid phone number format'
      }
    }

    setErrors(newErrors)

    if (Object.keys(newErrors).length > 0) {
      return
    }

    // Check for duplicate student number (exclude current student if editing)
    const existingStudent = students.find(s =>
      s.studentNumber === formData.studentNumber && s.id !== selectedStudent?.id
    )
    if (existingStudent) {
      const duplicateError = { studentNumber: 'Student number already exists' }
      setErrors(duplicateError)
      toast.error('Student number already exists')
      return
    }

    if (selectedStudent) {
      // Update existing student
      setStudents(students.map(s =>
        s.id === selectedStudent.id
          ? { ...s, ...formData }
          : s
      ))
      toast.success('Student updated successfully')
    } else {
      // Create new student
      const newStudent: Student = {
        id: String(students.length + 1),
        ...formData,
        isActive: true,
        emergencyContacts: [],
        allergies: [],
        medications: []
      }
      setStudents([...students, newStudent])
      toast.success('Student created successfully')
    }

    setShowModal(false)
    setSelectedStudent(null)
    setFormData({
      studentNumber: '',
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      grade: '',
      gender: 'MALE' as 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY',
      emergencyContactPhone: ''
    })
    setErrors({})
  }

  const handleEdit = (student: Student, e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedStudent(student)
    setFormData({
      studentNumber: student.studentNumber,
      firstName: student.firstName,
      lastName: student.lastName,
      dateOfBirth: student.dateOfBirth,
      grade: student.grade,
      gender: student.gender,
      emergencyContactPhone: student.emergencyContacts.find(c => c.isPrimary)?.phoneNumber || ''
    })
    setShowModal(true)
    setShowActionMenu(null)
  }

  const handleDeleteClick = (studentId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setStudentToDelete(studentId)
    setShowDeleteConfirm(true)
    setShowActionMenu(null)
  }

  const handleDeleteConfirm = () => {
    if (studentToDelete) {
      setStudents(students.map(s =>
        s.id === studentToDelete ? { ...s, isActive: false } : s
      ))
      toast.success('Student archived successfully')
      setShowDeleteConfirm(false)
      setStudentToDelete(null)
    }
  }

  const handleRestore = (studentId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setStudents(students.map(s =>
      s.id === studentId ? { ...s, isActive: true } : s
    ))
    toast.success('Student restored successfully')
  }

  const handleViewDetails = async (student: Student) => {
    setSelectedStudent(student)
    setShowDetailsModal(true)

    // Log audit trail for viewing student details
    try {
      await fetch('/api/audit-log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'VIEW_STUDENT',
          resourceType: 'STUDENT',
          resourceId: student.id,
          timestamp: new Date().toISOString()
        })
      })
    } catch (error) {
      // Silently fail - don't interrupt user experience for audit logging
      console.error('Failed to log audit trail:', error)
    }
  }

  const handleSaveEmergencyContact = () => {
    if (selectedStudent) {
      const updatedStudent = {
        ...selectedStudent,
        emergencyContacts: [
          {
            id: String(Date.now()),
            firstName: emergencyContactData.firstName,
            lastName: '',
            relationship: 'Guardian',
            phoneNumber: emergencyContactData.phoneNumber,
            isPrimary: true
          }
        ]
      }
      setStudents(students.map(s => s.id === selectedStudent.id ? updatedStudent : s))
      setSelectedStudent(updatedStudent)
      setShowEditEmergencyContact(false)
      setEmergencyContactData({ firstName: '', phoneNumber: '' })
      toast.success('Emergency contact updated successfully')
    }
  }

  const handleSelectStudent = (studentId: string) => {
    if (selectedStudents.includes(studentId)) {
      setSelectedStudents(selectedStudents.filter(id => id !== studentId))
    } else {
      setSelectedStudents([...selectedStudents, studentId])
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedStudents(paginatedStudents.map(s => s.id))
    } else {
      setSelectedStudents([])
    }
  }

  const handleExportCSV = () => {
    const studentsToExport = students.filter(s => selectedStudents.includes(s.id))

    // Create CSV content
    const headers = ['Student Number', 'First Name', 'Last Name', 'Date of Birth', 'Grade', 'Gender', 'Status']
    const rows = studentsToExport.map(s => [
      s.studentNumber,
      s.firstName,
      s.lastName,
      s.dateOfBirth,
      s.grade,
      s.gender,
      s.isActive ? 'Active' : 'Inactive'
    ])

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n')

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'students.csv'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    toast.success('CSV export complete')
    setShowExportModal(false)
  }

  const applyFilters = () => {
    // Don't close filters so reset button remains visible
    toast.success('Filters applied')
  }

  const resetFilters = () => {
    setGradeFilter('')
    setStatusFilter('')
    setSortBy('')
    setShowFilters(false)
    toast.success('Filters cleared')
  }

  let filteredStudents = students.filter(student => {
    const matchesSearch = student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentNumber.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesGrade = !gradeFilter || student.grade === gradeFilter
    const matchesStatus = !statusFilter ||
      (statusFilter === 'active' && student.isActive) ||
      (statusFilter === 'inactive' && !student.isActive)
    const matchesArchived = showArchived ? !student.isActive : student.isActive

    return matchesSearch && matchesGrade && matchesStatus && matchesArchived
  })

  // Apply sorting
  if (sortBy === 'lastName-asc') {
    filteredStudents = [...filteredStudents].sort((a, b) =>
      a.lastName.localeCompare(b.lastName)
    )
  } else if (sortBy === 'grade-asc') {
    filteredStudents = [...filteredStudents].sort((a, b) =>
      parseInt(a.grade) - parseInt(b.grade)
    )
  }

  // Pagination
  const totalPages = Math.ceil(filteredStudents.length / perPage)
  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900" data-testid="page-title">Student Management</h1>
          <p className="text-gray-600" data-testid="page-description">Manage student profiles, medical records, and emergency contacts</p>
        </div>
        <button
          className="btn-primary flex items-center"
          data-testid="add-student-button"
          onClick={() => {
            setSelectedStudent(null)
            setShowModal(true)
          }}
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Add Student
        </button>
      </div>

      {/* Search and Filters */}
      <div className="card p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search students by name, ID, or grade..."
                className="input-field pl-10"
                data-testid="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <select
            className="input-field"
            data-testid="sort-by-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="">Sort By</option>
            <option value="lastName-asc">Last Name (A-Z)</option>
            <option value="grade-asc">Grade (Low to High)</option>
          </select>
          <button
            className="btn-secondary flex items-center"
            data-testid="filter-button"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </button>
          {!showArchived ? (
            <button
              className="btn-secondary"
              data-testid="view-archived-button"
              onClick={() => setShowArchived(true)}
            >
              View Archived
            </button>
          ) : (
            <button
              className="btn-secondary"
              data-testid="view-active-button"
              onClick={() => setShowArchived(false)}
            >
              View Active
            </button>
          )}
        </div>

        {showFilters && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg" data-testid="filter-dropdown">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Grade</label>
                <select
                  className="input-field"
                  data-testid="grade-filter-select"
                  value={gradeFilter}
                  onChange={(e) => setGradeFilter(e.target.value)}
                >
                  <option value="">All Grades</option>
                  <option value="K">Kindergarten</option>
                  <option value="1">Grade 1</option>
                  <option value="2">Grade 2</option>
                  <option value="3">Grade 3</option>
                  <option value="4">Grade 4</option>
                  <option value="5">Grade 5</option>
                  <option value="6">Grade 6</option>
                  <option value="7">Grade 7</option>
                  <option value="8">Grade 8</option>
                  <option value="9">Grade 9</option>
                  <option value="10">Grade 10</option>
                  <option value="11">Grade 11</option>
                  <option value="12">Grade 12</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  className="input-field"
                  data-testid="active-status-filter"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="">All Students</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div className="flex items-end gap-2">
                <button
                  className="btn-primary"
                  data-testid="apply-filters-button"
                  onClick={applyFilters}
                >
                  Apply Filters
                </button>
                <button
                  className="btn-secondary"
                  data-testid="reset-filters-button"
                  onClick={resetFilters}
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Student Table */}
      <div className="card p-6">
        <div className="mb-4 flex justify-between items-center">
          <h3 className="text-lg font-semibold">
            {showArchived ? 'Archived Students' : 'Students'} ({filteredStudents.length})
          </h3>
          <div className="flex items-center space-x-4">
            {selectedStudents.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600" data-testid="selected-count">
                  {selectedStudents.length} selected
                </span>
                <button
                  className="btn-secondary text-sm"
                  data-testid="bulk-export-button"
                  onClick={() => setShowExportModal(true)}
                >
                  Export Selected
                </button>
              </div>
            )}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                data-testid="select-all-checkbox"
                className="rounded"
                checked={selectedStudents.length === filteredStudents.length && filteredStudents.length > 0}
                onChange={(e) => handleSelectAll(e.target.checked)}
              />
              <span className="text-sm text-gray-600">Select All</span>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-8" data-testid="loading-spinner">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="text-center py-8" data-testid="no-results-message">
            <p className="text-gray-500">No students found</p>
          </div>
        ) : (
          <div data-testid={showArchived ? "archived-students-list" : undefined}>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200" data-testid="student-table">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Select
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID/Grade
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Medical Alerts
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Emergency Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedStudents.map((student) => (
                    <tr
                      key={student.id}
                      className="hover:bg-gray-50 cursor-pointer"
                      data-testid={showArchived ? "archived-student-row" : "student-row"}
                      onClick={() => handleViewDetails(student)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          data-testid="student-checkbox"
                          className="rounded"
                          checked={selectedStudents.includes(student.id)}
                          onChange={() => handleSelectStudent(student.id)}
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                            <span className="text-sm font-medium text-primary-700">
                              {student.firstName[0]}{student.lastName[0]}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900" data-testid="student-name">
                              <span data-testid="student-firstName">{student.firstName}</span> <span data-testid="student-lastName">{student.lastName}</span>
                            </div>
                            <div className="text-sm text-gray-500">
                              DOB: {new Date(student.dateOfBirth).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{student.studentNumber}</div>
                        <div className="text-sm text-gray-500" data-testid="student-grade">Grade {student.grade}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                          {student.allergies.length > 0 && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800" data-testid="allergy-indicator">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              Allergies
                            </span>
                          )}
                          {student.medications.length > 0 && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800" data-testid="medication-indicator">
                              <Pill className="h-3 w-3 mr-1" />
                              Medications
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {student.emergencyContacts.find(c => c.isPrimary) && (
                          <div className="text-sm text-gray-900">
                            {student.emergencyContacts.find(c => c.isPrimary)?.firstName} {student.emergencyContacts.find(c => c.isPrimary)?.lastName}
                            <div className="text-xs text-gray-500">
                              {student.emergencyContacts.find(c => c.isPrimary)?.phoneNumber}
                            </div>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          student.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {student.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium" onClick={(e) => e.stopPropagation()}>
                        {showArchived ? (
                          <button
                            className="text-green-600 hover:text-green-900"
                            data-testid="restore-student-button"
                            onClick={(e) => handleRestore(student.id, e)}
                          >
                            Restore
                          </button>
                        ) : (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              className="text-blue-600 hover:text-blue-900"
                              data-testid="edit-student-button"
                              onClick={(e) => handleEdit(student, e)}
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              className="text-red-600 hover:text-red-900"
                              data-testid="delete-student-button"
                              onClick={(e) => handleDeleteClick(student.id, e)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {filteredStudents.length > 0 && (
              <div className="mt-6 flex items-center justify-between" data-testid="pagination-controls">
                <div className="text-sm text-gray-700">
                  Showing {((currentPage - 1) * perPage) + 1} to {Math.min(currentPage * perPage, filteredStudents.length)} of {filteredStudents.length} results
                </div>
                <div className="flex items-center space-x-2">
                  <select
                    className="input-field text-sm"
                    data-testid="per-page-select"
                    value={perPage}
                    onChange={(e) => {
                      setPerPage(parseInt(e.target.value))
                      setCurrentPage(1)
                    }}
                  >
                    <option value="10">10 per page</option>
                    <option value="25">25 per page</option>
                    <option value="50">50 per page</option>
                  </select>
                  <button
                    className="btn-secondary"
                    data-testid="previous-page-button"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                  >
                    Previous
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i + 1}
                      className={`px-3 py-1 rounded ${currentPage === i + 1 ? 'bg-primary-600 text-white' : 'bg-gray-200'}`}
                      data-testid={`page-number-${i + 1}`}
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    className="btn-secondary"
                    data-testid="next-page-button"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                  >
                    Next
                  </button>
                  <span className="text-sm text-gray-600" data-testid="page-indicator">
                    Page {currentPage} of {totalPages}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add/Edit Student Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white" data-testid="student-form-modal">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {selectedStudent ? 'Edit Student' : 'Add New Student'}
              </h3>
              <form onSubmit={handleSubmit} data-testid="student-form">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Student Number</label>
                    <input
                      type="text"
                      className="input-field"
                      data-testid="studentNumber-input"
                      value={formData.studentNumber}
                      onChange={(e) => setFormData({...formData, studentNumber: e.target.value})}
                    />
                    {errors.studentNumber && (
                      <p className="text-red-600 text-sm mt-1" data-testid="studentNumber-error">
                        {errors.studentNumber}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">First Name</label>
                    <input
                      type="text"
                      className="input-field"
                      data-testid="firstName-input"
                      value={formData.firstName}
                      onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    />
                    {errors.firstName && (
                      <p className="text-red-600 text-sm mt-1" data-testid="firstName-error">
                        {errors.firstName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Last Name</label>
                    <input
                      type="text"
                      className="input-field"
                      data-testid="lastName-input"
                      value={formData.lastName}
                      onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    />
                    {errors.lastName && (
                      <p className="text-red-600 text-sm mt-1" data-testid="lastName-error">
                        {errors.lastName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                    <input
                      type="date"
                      className="input-field"
                      data-testid="dateOfBirth-input"
                      value={formData.dateOfBirth}
                      onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
                    />
                    {errors.dateOfBirth && (
                      <p className="text-red-600 text-sm mt-1" data-testid="dateOfBirth-error">
                        {errors.dateOfBirth}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Grade</label>
                    <select
                      className="input-field"
                      data-testid="grade-select"
                      value={formData.grade}
                      onChange={(e) => setFormData({...formData, grade: e.target.value})}
                    >
                      <option value="">Select Grade</option>
                      <option value="K">Kindergarten</option>
                      <option value="1">Grade 1</option>
                      <option value="2">Grade 2</option>
                      <option value="3">Grade 3</option>
                      <option value="4">Grade 4</option>
                      <option value="5">Grade 5</option>
                      <option value="6">Grade 6</option>
                      <option value="7">Grade 7</option>
                      <option value="8">Grade 8</option>
                      <option value="9">Grade 9</option>
                      <option value="10">Grade 10</option>
                      <option value="11">Grade 11</option>
                      <option value="12">Grade 12</option>
                    </select>
                    {errors.grade && (
                      <p className="text-red-600 text-sm mt-1" data-testid="grade-error">
                        {errors.grade}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Gender</label>
                    <select
                      className="input-field"
                      data-testid="gender-select"
                      value={formData.gender}
                      onChange={(e) => setFormData({...formData, gender: e.target.value as 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY'})}
                    >
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                      <option value="OTHER">Other</option>
                      <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Emergency Contact Phone</label>
                    <input
                      type="text"
                      className="input-field"
                      data-testid="emergency-contact-phone"
                      value={formData.emergencyContactPhone}
                      onChange={(e) => setFormData({...formData, emergencyContactPhone: e.target.value})}
                      placeholder="555-1234"
                    />
                    {errors.emergencyContactPhone && (
                      <p className="text-red-600 text-sm mt-1" data-testid="emergency-contact-phone-error">
                        {errors.emergencyContactPhone}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    className="btn-secondary"
                    data-testid="cancel-button"
                    onClick={() => {
                      setShowModal(false)
                      setSelectedStudent(null)
                      setFormData({
                        studentNumber: '',
                        firstName: '',
                        lastName: '',
                        dateOfBirth: '',
                        grade: '',
                        gender: 'MALE' as 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY',
                        emergencyContactPhone: ''
                      })
                      setErrors({})
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                    data-testid="save-student-button"
                  >
                    {selectedStudent ? 'Update Student' : 'Save Student'}
                  </button>
                </div>
              </form>
              {errors.studentNumber === 'Student number already exists' && (
                <p className="text-red-600 text-sm mt-4" data-testid="error-message">
                  {errors.studentNumber}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white" data-testid="confirm-delete-modal">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Archive</h3>
              <p className="text-gray-600 mb-6" data-testid="confirm-delete-message">
                Are you sure you want to archive this student? They will be moved to the archived students list.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  className="btn-secondary"
                  data-testid="cancel-delete-button"
                  onClick={() => {
                    setShowDeleteConfirm(false)
                    setStudentToDelete(null)
                  }}
                >
                  Cancel
                </button>
                <button
                  className="btn-primary bg-red-600 hover:bg-red-700"
                  data-testid="confirm-delete-button"
                  onClick={handleDeleteConfirm}
                >
                  Archive Student
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Student Details Modal */}
      {showDetailsModal && selectedStudent && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-2/3 shadow-lg rounded-md bg-white" data-testid="student-details-modal">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900" data-testid="student-name">
                  {selectedStudent.firstName} {selectedStudent.lastName}
                </h3>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-2">Basic Information</h4>
                  <div className="space-y-2 text-sm">
                    <div data-testid="student-id">ID: {selectedStudent.studentNumber}</div>
                    <div data-testid="student-grade">Grade: {selectedStudent.grade}</div>
                    <div>DOB: {new Date(selectedStudent.dateOfBirth).toLocaleDateString()}</div>
                    <div>Gender: {selectedStudent.gender}</div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium">Emergency Contact</h4>
                    <button
                      className="text-blue-600 hover:text-blue-800 text-sm"
                      data-testid="edit-emergency-contact-button"
                      onClick={() => {
                        const primaryContact = selectedStudent.emergencyContacts.find(c => c.isPrimary)
                        if (primaryContact) {
                          setEmergencyContactData({
                            firstName: primaryContact.firstName,
                            phoneNumber: primaryContact.phoneNumber
                          })
                        }
                        setShowEditEmergencyContact(true)
                      }}
                    >
                      Edit
                    </button>
                  </div>
                  {selectedStudent.emergencyContacts.find(c => c.isPrimary) && (
                    <div className="text-sm" data-testid="emergency-contact-name">
                      {selectedStudent.emergencyContacts.find(c => c.isPrimary)?.firstName} {selectedStudent.emergencyContacts.find(c => c.isPrimary)?.lastName}
                      <div className="text-gray-500">
                        {selectedStudent.emergencyContacts.find(c => c.isPrimary)?.phoneNumber}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6">
                <h4 className="font-medium mb-2">Medical Information</h4>
                <div className="space-y-2 text-sm">
                  {selectedStudent.allergies.length > 0 && (
                    <div className="bg-red-50 p-2 rounded" data-testid="critical-allergy-alert">
                      <div className="font-medium text-red-800">Critical Allergies:</div>
                      {selectedStudent.allergies.map(allergy => (
                        <div key={allergy.id} className="text-red-700">
                          {allergy.allergen} ({allergy.severity})
                        </div>
                      ))}
                    </div>
                  )}

                  {selectedStudent.medications.length > 0 && (
                    <div className="bg-blue-50 p-2 rounded" data-testid="medication-alert">
                      <div className="font-medium text-blue-800">Medications:</div>
                      {selectedStudent.medications.map(med => (
                        <div key={med.id} className="text-blue-700">
                          {med.name} - {med.dosage}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Emergency Contact Modal */}
      {showEditEmergencyContact && selectedStudent && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Emergency Contact</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">First Name</label>
                  <input
                    type="text"
                    className="input-field"
                    data-testid="emergency-contact-firstName"
                    value={emergencyContactData.firstName}
                    onChange={(e) => setEmergencyContactData({...emergencyContactData, firstName: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                  <input
                    type="text"
                    className="input-field"
                    data-testid="emergency-contact-phone"
                    value={emergencyContactData.phoneNumber}
                    onChange={(e) => setEmergencyContactData({...emergencyContactData, phoneNumber: e.target.value})}
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  className="btn-secondary"
                  onClick={() => {
                    setShowEditEmergencyContact(false)
                    setEmergencyContactData({ firstName: '', phoneNumber: '' })
                  }}
                >
                  Cancel
                </button>
                <button
                  className="btn-primary"
                  data-testid="save-emergency-contact-button"
                  onClick={handleSaveEmergencyContact}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Export Format Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white" data-testid="export-format-modal">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Export Students</h3>
              <p className="text-gray-600 mb-6">Choose export format for {selectedStudents.length} selected student(s):</p>
              <div className="flex flex-col gap-3">
                <button
                  className="btn-primary"
                  data-testid="export-csv-button"
                  onClick={handleExportCSV}
                >
                  Export as CSV
                </button>
                <button
                  className="btn-secondary"
                  onClick={() => setShowExportModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
