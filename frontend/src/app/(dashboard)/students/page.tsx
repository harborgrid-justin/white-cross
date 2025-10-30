'use client';

import React, { useState, useEffect } from 'react';
import { StudentList } from '@/components/pages/Students';
import { studentsApi } from '@/services/modules/studentsApi';
import { type Student } from '@/types/student.types';
import { useToast } from '@/hooks/use-toast';

/**
 * Students Main Page
 * 
 * Comprehensive student management dashboard with search, filtering,
 * and quick access to student records and health information.
 */
export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<string>('');
  const [selectedNurse, setSelectedNurse] = useState<string>('');
  const { toast } = useToast();

  /**
   * Load students data from API
   */
  useEffect(() => {
    const loadStudents = async () => {
      setLoading(true);
      
      try {
        const params: Record<string, string> = {};
        
        if (searchTerm.trim()) {
          params.search = searchTerm.trim();
        }
        
        if (selectedGrade) {
          params.grade = selectedGrade;
        }
        
        if (selectedNurse) {
          params.nurseId = selectedNurse;
        }
        
        const response = await studentsApi.getAll(params);
        setStudents(response.students || []);
      } catch (error) {
        console.error('Failed to load students:', error);
        toast({
          title: 'Error',
          description: 'Failed to load students. Please try again.',
          variant: 'destructive',
        });
        setStudents([]);
      } finally {
        setLoading(false);
      }
    };

    loadStudents();
  }, [searchTerm, selectedGrade, selectedNurse, toast]);

  const handleCreateStudent = () => {
    window.location.href = '/dashboard/students/new';
  };

  const handleViewStudent = (student: Student) => {
    window.location.href = `/dashboard/students/${student.id}`;
  };

  const handleEditStudent = (student: Student) => {
    window.location.href = `/dashboard/students/${student.id}/edit`;
  };

  const handleDeleteStudent = async (student: Student) => {
    if (confirm(`Are you sure you want to delete ${student.firstName} ${student.lastName}?`)) {
      try {
        await studentsApi.delete(student.id);
        toast({
          title: 'Success',
          description: `${student.firstName} ${student.lastName} has been deleted.`,
        });
        // Refresh the list
        setSearchTerm(searchTerm); // This will trigger the useEffect
      } catch (error) {
        console.error('Failed to delete student:', error);
        toast({
          title: 'Error',
          description: 'Failed to delete student. Please try again.',
          variant: 'destructive',
        });
      }
    }
  };

  const handleViewHealthRecord = (student: Student) => {
    window.location.href = `/dashboard/students/${student.id}/health-records`;
  };

  const handleViewMedications = (student: Student) => {
    window.location.href = `/dashboard/students/${student.id}/medications`;
  };

  const handleViewAppointments = (student: Student) => {
    window.location.href = `/dashboard/students/${student.id}/appointments`;
  };

  const handleAssignNurse = (student: Student) => {
    // This would open a modal or navigate to assignment page
    console.log('Assign nurse to student:', student.id);
    alert('Nurse assignment functionality would be implemented here.');
  };

  const handleTransferStudent = (student: Student) => {
    // This would open a modal or navigate to transfer page
    console.log('Transfer student:', student.id);
    alert('Student transfer functionality would be implemented here.');
  };

  const handleExportData = () => {
    console.log('Export students data');
    alert('Student data export would be implemented here.');
  };

  const handleBulkActions = (action: string, studentIds: string[]) => {
    console.log('Bulk action:', action, studentIds);
    alert(`Bulk ${action} for ${studentIds.length} student(s) would be implemented here.`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Students</h1>
              <p className="text-gray-600 mt-2">Manage student records and health information</p>
            </div>
            <button
              onClick={handleCreateStudent}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Add New Student
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 bg-white p-4 rounded-lg shadow-sm border">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                Search Students
              </label>
              <input
                id="search"
                type="text"
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                placeholder="Search by name, student number..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="grade" className="block text-sm font-medium text-gray-700 mb-2">
                Grade Level
              </label>
              <select
                id="grade"
                value={selectedGrade}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedGrade(e.target.value)}
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
            <div>
              <label htmlFor="nurse" className="block text-sm font-medium text-gray-700 mb-2">
                Assigned Nurse
              </label>
              <select
                id="nurse"
                value={selectedNurse}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedNurse(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Nurses</option>
                {/* Nurse options would be populated from API */}
              </select>
            </div>
          </div>
        </div>

        {/* Students List */}
        <StudentList
          students={students}
          loading={loading}
        />

        {/* Export Actions */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={handleExportData}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Export Student Data
          </button>
        </div>
      </div>
    </div>
  );
}
