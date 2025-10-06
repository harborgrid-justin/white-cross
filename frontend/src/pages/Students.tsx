import React, { useState, useEffect } from 'react'
import { UserPlus, Search, Filter, MoreVertical, AlertTriangle, Pill } from 'lucide-react'
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
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [formData, setFormData] = useState({
    studentNumber: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    grade: '',
    gender: 'MALE' as 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY'
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [searchTerm, setSearchTerm] = useState('')
  const [showFilters, setShowFilters] = useState(false)

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
        }
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

    setErrors(newErrors)

    if (Object.keys(newErrors).length > 0) {
      return
    }

    // Check for duplicate student number
    const existingStudent = students.find(s => s.studentNumber === formData.studentNumber)
    if (existingStudent) {
      toast.error('Student number already exists')
      return
    }

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
    setShowModal(false)
    setFormData({
      studentNumber: '',
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      grade: '',
      gender: 'MALE' as 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY'
    })
  }

  // handleEdit and handleDelete functions kept for future implementation
  // but not currently used in UI
  // const handleEdit = (student: Student) => {
  //   setSelectedStudent(student)
  //   setFormData({
  //     studentNumber: student.studentNumber,
  //     firstName: student.firstName,
  //     lastName: student.lastName,
  //     dateOfBirth: student.dateOfBirth,
  //     grade: student.grade,
  //     gender: student.gender
  //   })
  //   setShowModal(true)
  // }

  // const handleDelete = (studentId: string) => {
  //   if (confirm('Are you sure you want to deactivate this student?')) {
  //     setStudents(students.map(s => 
  //       s.id === studentId ? { ...s, isActive: false } : s
  //     ))
  //     toast.success('Student deactivated successfully')
  //   }
  // }

  const handleViewDetails = (student: Student) => {
    setSelectedStudent(student)
    setShowDetailsModal(true)
  }

  const filteredStudents = students.filter(student =>
    student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.studentNumber.toLowerCase().includes(searchTerm.toLowerCase())
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
          onClick={() => setShowModal(true)}
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
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
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
          <button 
            className="btn-secondary flex items-center" 
            data-testid="filter-button"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </button>
        </div>

        {showFilters && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg" data-testid="filter-dropdown">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Grade</label>
                <select className="input-field" data-testid="grade-filter-select">
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
                <select className="input-field" data-testid="active-status-filter">
                  <option value="">All Students</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div className="flex items-end">
                <button className="btn-primary" data-testid="apply-filters-button">
                  Apply Filters
                </button>
                <button className="btn-secondary ml-2" data-testid="clear-filters-button">
                  Clear
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Student Table */}
      <div className="card p-6">
        <div className="mb-4 flex justify-between items-center">
          <h3 className="text-lg font-semibold">Students ({filteredStudents.length})</h3>
          <div className="flex items-center space-x-2">
            <input type="checkbox" data-testid="select-all-checkbox" className="rounded" />
            <span className="text-sm text-gray-600">Select All</span>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-8" data-testid="loading-spinner">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200" data-testid="student-table">
              <thead className="bg-gray-50">
                <tr>
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
                {filteredStudents.map((student) => (
                  <tr 
                    key={student.id} 
                    className="hover:bg-gray-50 cursor-pointer" 
                    data-testid="student-row"
                    onClick={() => handleViewDetails(student)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                          <span className="text-sm font-medium text-primary-700">
                            {student.firstName[0]}{student.lastName[0]}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {student.firstName} {student.lastName}
                          </div>
                          <div className="text-sm text-gray-500">
                            DOB: {new Date(student.dateOfBirth).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{student.studentNumber}</div>
                      <div className="text-sm text-gray-500">Grade {student.grade}</div>
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
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="relative inline-block">
                        <button 
                          className="text-gray-400 hover:text-gray-600" 
                          data-testid="student-actions"
                          onClick={(e) => {
                            e.stopPropagation()
                            // Toggle dropdown logic would go here
                          }}
                        >
                          <MoreVertical className="h-5 w-5" />
                        </button>
                        {/* Action menu would be implemented here */}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        <div className="mt-6 flex items-center justify-between" data-testid="pagination">
          <div className="text-sm text-gray-700">
            Showing 1 to {filteredStudents.length} of {filteredStudents.length} results
          </div>
          <div className="flex space-x-2">
            <button className="btn-secondary">Previous</button>
            <button className="btn-secondary">Next</button>
          </div>
        </div>
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
                        gender: 'MALE' as 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY'
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
                  ×
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
        </div>
      )}
    </div>
  )
}