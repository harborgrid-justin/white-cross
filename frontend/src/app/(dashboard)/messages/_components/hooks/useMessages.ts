/**
 * Custom hook for managing healthcare messages state and loading
 */

import { useState, useEffect, useMemo } from 'react';
import { HealthcareMessage, MessageStats } from '../types/message.types';

/**
 * Hook for managing message data and statistics
 * @param initialMessages - Optional initial messages array
 * @returns Message data, loading state, and statistics
 */
export const useMessages = (initialMessages: HealthcareMessage[] = []) => {
  const [messages, setMessages] = useState<HealthcareMessage[]>(initialMessages);
  const [loading, setLoading] = useState(true);

  // Load healthcare messages with realistic mock data
  useEffect(() => {
    const loadMessages = async () => {
      setLoading(true);

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock healthcare messages data
      const mockMessages: HealthcareMessage[] = [
        {
          id: 'msg-001',
          subject: 'EMERGENCY: Student Allergic Reaction - Room 204',
          content: 'Emergency alert: Student Sarah Johnson experiencing allergic reaction in classroom 204. EpiPen administered. Parent contacted. Ambulance requested.',
          type: 'emergency',
          priority: 'emergency',
          status: 'unread',
          from: { id: 'user-001', name: 'Mary Wilson', role: 'Teacher', avatar: '/avatars/teacher.jpg' },
          to: [
            { id: 'user-002', name: 'Jennifer Smith', role: 'School Nurse' },
            { id: 'user-003', name: 'Principal Davis', role: 'Principal' }
          ],
          timestamp: new Date('2024-10-31T10:15:00'),
          attachments: [],
          isEncrypted: true,
          requiresAcknowledgment: true,
          relatedStudent: { id: 'student-001', name: 'Sarah Johnson' },
          tags: ['emergency', 'allergy', 'epipen', 'ambulance']
        },
        {
          id: 'msg-002',
          subject: 'Medication Administration - Daily Report',
          content: 'Daily medication report for October 31st. 15 students received scheduled medications. 2 PRN medications administered. All documented in health records.',
          type: 'medical',
          priority: 'normal',
          status: 'read',
          from: { id: 'user-002', name: 'Jennifer Smith', role: 'School Nurse' },
          to: [{ id: 'user-004', name: 'Health Supervisor', role: 'Health Services Director' }],
          timestamp: new Date('2024-10-31T09:30:00'),
          readAt: new Date('2024-10-31T09:45:00'),
          attachments: [
            { id: 'att-001', name: 'medication-report-10-31.pdf', size: 245760, type: 'application/pdf', isEncrypted: true }
          ],
          isEncrypted: true,
          requiresAcknowledgment: false,
          tags: ['medication', 'daily-report', 'administration']
        },
        {
          id: 'msg-003',
          subject: 'Parent Conference Request - Tommy Martinez',
          content: 'Mrs. Martinez requesting conference to discuss Tommy\'s recent health concerns and medication management plan. Available next week.',
          type: 'parent_communication',
          priority: 'normal',
          status: 'unread',
          from: { id: 'parent-001', name: 'Maria Martinez', role: 'Parent' },
          to: [{ id: 'user-002', name: 'Jennifer Smith', role: 'School Nurse' }],
          timestamp: new Date('2024-10-31T08:20:00'),
          attachments: [],
          isEncrypted: false,
          requiresAcknowledgment: true,
          relatedStudent: { id: 'student-002', name: 'Tommy Martinez' },
          tags: ['parent-communication', 'conference', 'health-concerns']
        },
        {
          id: 'msg-004',
          subject: 'Appointment Reminder: Health Screening Schedule',
          content: 'Reminder: Annual health screenings scheduled for grades K-2 next week. Vision and hearing tests. Please prepare screening forms.',
          type: 'appointment',
          priority: 'normal',
          status: 'read',
          from: { id: 'system', name: 'Health System', role: 'System' },
          to: [
            { id: 'user-002', name: 'Jennifer Smith', role: 'School Nurse' },
            { id: 'user-005', name: 'Health Assistant', role: 'Health Aide' }
          ],
          timestamp: new Date('2024-10-30T16:00:00'),
          readAt: new Date('2024-10-30T16:15:00'),
          attachments: [
            { id: 'att-002', name: 'screening-schedule.pdf', size: 156432, type: 'application/pdf', isEncrypted: false }
          ],
          isEncrypted: false,
          requiresAcknowledgment: true,
          acknowledgedAt: new Date('2024-10-30T16:15:00'),
          tags: ['appointment', 'screening', 'vision', 'hearing']
        },
        {
          id: 'msg-005',
          subject: 'Incident Report: Playground Injury',
          content: 'Student Alex Chen sustained minor scrape on playground equipment. First aid administered. Parent contacted and picked up student. No further medical attention needed.',
          type: 'incident',
          priority: 'normal',
          status: 'replied',
          from: { id: 'user-006', name: 'Coach Thompson', role: 'PE Teacher' },
          to: [
            { id: 'user-002', name: 'Jennifer Smith', role: 'School Nurse' },
            { id: 'user-003', name: 'Principal Davis', role: 'Principal' }
          ],
          timestamp: new Date('2024-10-30T14:30:00'),
          readAt: new Date('2024-10-30T14:45:00'),
          repliedAt: new Date('2024-10-30T15:00:00'),
          attachments: [
            { id: 'att-003', name: 'incident-photos.jpg', size: 524288, type: 'image/jpeg', isEncrypted: true }
          ],
          isEncrypted: true,
          requiresAcknowledgment: true,
          acknowledgedAt: new Date('2024-10-30T15:00:00'),
          relatedStudent: { id: 'student-003', name: 'Alex Chen' },
          tags: ['incident', 'playground', 'first-aid', 'parent-contact']
        },
        {
          id: 'msg-006',
          subject: 'Medication Refill Needed - Inhaler Supply',
          content: 'Running low on albuterol inhalers. Current stock: 3 units. Need to reorder before next week. Emergency supply protocols in place.',
          type: 'medical',
          priority: 'high',
          status: 'starred',
          from: { id: 'user-005', name: 'Health Assistant', role: 'Health Aide' },
          to: [
            { id: 'user-002', name: 'Jennifer Smith', role: 'School Nurse' },
            { id: 'user-004', name: 'Health Supervisor', role: 'Health Services Director' }
          ],
          timestamp: new Date('2024-10-30T13:15:00'),
          readAt: new Date('2024-10-30T13:20:00'),
          attachments: [],
          isEncrypted: false,
          requiresAcknowledgment: true,
          acknowledgedAt: new Date('2024-10-30T13:25:00'),
          tags: ['medication', 'inhaler', 'supply', 'reorder']
        },
        {
          id: 'msg-007',
          subject: 'Staff Training: Updated Emergency Protocols',
          content: 'Mandatory training session on updated emergency response protocols scheduled for November 5th at 3:30 PM in the main conference room.',
          type: 'staff_notification',
          priority: 'normal',
          status: 'read',
          from: { id: 'user-003', name: 'Principal Davis', role: 'Principal' },
          to: [
            { id: 'user-002', name: 'Jennifer Smith', role: 'School Nurse' },
            { id: 'user-001', name: 'Mary Wilson', role: 'Teacher' },
            { id: 'user-006', name: 'Coach Thompson', role: 'PE Teacher' }
          ],
          timestamp: new Date('2024-10-29T11:00:00'),
          readAt: new Date('2024-10-29T11:15:00'),
          attachments: [
            { id: 'att-004', name: 'emergency-protocols-2024.pdf', size: 1048576, type: 'application/pdf', isEncrypted: false }
          ],
          isEncrypted: false,
          requiresAcknowledgment: true,
          acknowledgedAt: new Date('2024-10-29T11:20:00'),
          tags: ['training', 'emergency', 'protocols', 'mandatory']
        }
      ];

      setMessages(mockMessages);
      setLoading(false);
    };

    loadMessages();
  }, []);

  // Calculate message statistics
  const stats: MessageStats = useMemo(() => {
    return {
      unread: messages.filter(msg => msg.status === 'unread').length,
      total: messages.length,
      starred: messages.filter(msg => msg.status === 'starred').length,
      archived: messages.filter(msg => msg.status === 'archived').length,
      emergency: messages.filter(msg => msg.type === 'emergency' || msg.priority === 'emergency').length,
      medical: messages.filter(msg => msg.type === 'medical').length,
      appointments: messages.filter(msg => msg.type === 'appointment').length,
      parentCommunications: messages.filter(msg => msg.type === 'parent_communication').length,
      requiresAcknowledgment: messages.filter(msg => msg.requiresAcknowledgment && !msg.acknowledgedAt).length
    };
  }, [messages]);

  return {
    messages,
    setMessages,
    loading,
    stats
  };
};
