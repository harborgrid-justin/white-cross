/**
 * StudentConsentHistory Component
 * Display consent history for a student
 */

import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../hooks/shared/store-hooks-index';
import { fetchStudentConsents, selectConsentForms } from '../store';

const StudentConsentHistory: React.FC = () => {
  const dispatch = useAppDispatch();
  const { studentId } = useParams<{ studentId: string }>();
  const consents = useAppSelector(selectConsentForms);

  useEffect(() => {
    if (studentId) {
      dispatch(fetchStudentConsents(studentId));
    }
  }, [studentId, dispatch]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Student Consent History</h1>
        <p className="text-gray-600 mt-1">View all consent forms for student {studentId}</p>
      </div>

      <div className="card">
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Form Name</th>
                <th>Type</th>
                <th>Signed Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {consents.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-8 text-gray-500">
                    No consent history found for this student.
                  </td>
                </tr>
              ) : (
                consents.map((consent) => (
                  <tr key={consent.id}>
                    <td>{consent.formName}</td>
                    <td>{consent.formType}</td>
                    <td>{new Date(consent.createdAt).toLocaleDateString()}</td>
                    <td>
                      <span className="badge badge-success">Signed</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentConsentHistory;
