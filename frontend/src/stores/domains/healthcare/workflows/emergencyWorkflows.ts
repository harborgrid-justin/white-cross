/**
 * Phase 3: Emergency Response Workflows
 * 
 * Automated emergency protocols and response coordination including:
 * - Emergency contact cascading
 * - Medical emergency protocols
 * - Incident escalation workflows
 * - Crisis communication management
 */

import { createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from '../../../reduxStore';
import { emergencyContactsActions } from '../../../slices/emergencyContactsSlice';
import { communicationActions } from '../../../slices/communicationSlice';
import { incidentReportsActions } from '../../../slices/incidentReportsSlice';

// Types for emergency workflows
export interface EmergencyAlert {
  id: string;
  type: 'MEDICAL' | 'BEHAVIORAL' | 'ACCIDENT' | 'SEVERE_ALLERGIC_REACTION' | 'NATURAL_DISASTER';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  studentId: string;
  location: string;
  description: string;
  reportedBy: string;
  timestamp: string;
  status: 'ACTIVE' | 'RESPONDING' | 'RESOLVED';
  responseTeam: string[];
  escalationLevel: number;
}

export interface EmergencyResponse {
  alertId: string;
  actions: EmergencyAction[];
  notifications: NotificationLog[];
  timeline: ResponseTimelineEvent[];
  outcome: string;
  lessonsLearned: string[];
}

export interface EmergencyAction {
  id: string;
  type: 'MEDICAL_TREATMENT' | 'CONTACT_EMS' | 'NOTIFY_PARENTS' | 'EVACUATE' | 'ISOLATE' | 'DOCUMENT';
  description: string;
  assignedTo: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  completedAt?: string;
  notes?: string;
}

export interface NotificationLog {
  id: string;
  recipient: string;
  method: 'PHONE' | 'EMAIL' | 'SMS' | 'IN_PERSON' | 'INTERCOM';
  message: string;
  sentAt: string;
  status: 'SENT' | 'DELIVERED' | 'FAILED' | 'ACKNOWLEDGED';
  retryCount: number;
}

export interface ResponseTimelineEvent {
  id: string;
  timestamp: string;
  event: string;
  actor: string;
  details?: string;
}

/**
 * Emergency Alert Creation and Initial Response
 */
export const createEmergencyAlert = createAsyncThunk<
  EmergencyAlert,
  {
    type: EmergencyAlert['type'];
    severity: EmergencyAlert['severity'];
    studentId: string;
    location: string;
    description: string;
    reportedBy: string;
  },
  { state: RootState }
>(
  'workflows/createEmergencyAlert',
  async (params, { dispatch, getState }) => {
    const alertId = `EMRG-${Date.now()}`;
    
    const alert: EmergencyAlert = {
      id: alertId,
      ...params,
      timestamp: new Date().toISOString(),
      status: 'ACTIVE',
      responseTeam: [],
      escalationLevel: 1
    };

    // Determine response team based on emergency type and severity
    const responseTeam = determineResponseTeam(params.type, params.severity);
    alert.responseTeam = responseTeam;

    // Create incident report
    dispatch(incidentReportsActions.create({
      studentId: params.studentId,
      incidentType: mapEmergencyTypeToIncident(params.type),
      severity: params.severity,
      location: params.location,
      description: params.description,
      reportedBy: params.reportedBy,
      status: 'ACTIVE',
      requiresFollowUp: true,
      parentNotified: false
    }));

    // Initiate emergency response workflow
    dispatch(initiateEmergencyResponse({ alert }));

    return alert;
  }
);

/**
 * Emergency Response Workflow Orchestration
 */
export const initiateEmergencyResponse = createAsyncThunk<
  EmergencyResponse,
  { alert: EmergencyAlert },
  { state: RootState }
>(
  'workflows/initiateEmergencyResponse',
  async ({ alert }, { dispatch, getState }) => {
    const response: EmergencyResponse = {
      alertId: alert.id,
      actions: [],
      notifications: [],
      timeline: [{
        id: `timeline-${Date.now()}`,
        timestamp: new Date().toISOString(),
        event: 'Emergency alert created',
        actor: alert.reportedBy,
        details: `${alert.type} emergency at ${alert.location}`
      }],
      outcome: '',
      lessonsLearned: []
    };

    // Generate emergency actions based on type and severity
    const actions = generateEmergencyActions(alert);
    response.actions = actions;

    // Execute immediate actions
    for (const action of actions.filter(a => a.type === 'CONTACT_EMS' || a.type === 'MEDICAL_TREATMENT')) {
      dispatch(executeEmergencyAction({ alert, action }));
    }

    // Start emergency contact cascade
    dispatch(emergencyContactCascade({ 
      studentId: alert.studentId, 
      emergencyType: alert.type,
      severity: alert.severity,
      alertId: alert.id
    }));

    // Schedule automatic escalation if not resolved
    setTimeout(() => {
      dispatch(checkEmergencyEscalation({ alertId: alert.id }));
    }, getEscalationTimeout(alert.severity));

    return response;
  }
);

/**
 * Emergency Contact Cascade Workflow
 */
export const emergencyContactCascade = createAsyncThunk<
  NotificationLog[],
  {
    studentId: string;
    emergencyType: EmergencyAlert['type'];
    severity: EmergencyAlert['severity'];
    alertId: string;
  },
  { state: RootState }
>(
  'workflows/emergencyContactCascade',
  async (params, { dispatch, getState }) => {
    const state = getState();
    const notifications: NotificationLog[] = [];

    // Get emergency contacts for student
    // TODO: Fix type casting when store types are resolved
    const emergencyContacts = Object.values((state as any).emergencyContacts.entities)
      .filter((contact: any) => contact?.studentId === params.studentId && contact?.isActive)
      .sort((a: any, b: any) => {
        const priorityOrder = { 'PRIMARY': 1, 'SECONDARY': 2, 'TERTIARY': 3 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      });

    const message = createEmergencyMessage(params.emergencyType, params.severity);

    // Start with highest priority contacts
    for (const contact of emergencyContacts) {
      const notification = await dispatch(sendEmergencyNotification({
        contactId: contact.id,
        method: getPrimaryContactMethod(contact),
        message,
        alertId: params.alertId,
        urgent: params.severity === 'CRITICAL'
      })).unwrap();

      notifications.push(notification);

      // For critical emergencies, try multiple contact methods
      if (params.severity === 'CRITICAL') {
        // Try secondary contact method after 2 minutes if not acknowledged
        setTimeout(async () => {
          const secondaryMethod = getSecondaryContactMethod(contact);
          if (secondaryMethod) {
            const secondaryNotification = await dispatch(sendEmergencyNotification({
              contactId: contact.id,
              method: secondaryMethod,
              message: message + ' (URGENT - Second attempt)',
              alertId: params.alertId,
              urgent: true
            })).unwrap();
            notifications.push(secondaryNotification);
          }
        }, 2 * 60 * 1000);
      }

      // If primary contact acknowledges, we can stop the cascade for non-critical emergencies
      if (params.severity !== 'CRITICAL') {
        // In a real implementation, we'd wait for acknowledgment
        break;
      }
    }

    // Notify school administration
    dispatch(communicationActions.create({
      type: 'EMERGENCY_ALERT',
      subject: `EMERGENCY: ${params.emergencyType} - Student ID: ${params.studentId}`,
      content: `Emergency situation requires immediate attention. Alert ID: ${params.alertId}`,
      recipientType: 'ADMINISTRATION',
      recipientIds: ['admin-team'],
      priority: 'URGENT'
    }));

    return notifications;
  }
);

/**
 * Send Emergency Notification
 */
export const sendEmergencyNotification = createAsyncThunk<
  NotificationLog,
  {
    contactId: string;
    method: NotificationLog['method'];
    message: string;
    alertId: string;
    urgent: boolean;
  }
>(
  'workflows/sendEmergencyNotification',
  async (params) => {
    const notificationId = `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const notification: NotificationLog = {
      id: notificationId,
      recipient: params.contactId,
      method: params.method,
      message: params.message,
      sentAt: new Date().toISOString(),
      status: 'SENT', // In production, this would be updated based on actual delivery
      retryCount: 0
    };

    // Simulate sending notification (in production, integrate with SMS/email services)
    try {
      await simulateNotificationSend(params.method, params.message, params.urgent);
      notification.status = 'DELIVERED';
    } catch (error) {
      notification.status = 'FAILED';
      console.error('Failed to send emergency notification:', error);
    }

    return notification;
  }
);

/**
 * Execute Emergency Action
 */
export const executeEmergencyAction = createAsyncThunk<
  EmergencyAction,
  { alert: EmergencyAlert; action: EmergencyAction },
  { state: RootState }
>(
  'workflows/executeEmergencyAction',
  async ({ alert, action }, { dispatch }) => {
    const updatedAction = { ...action, status: 'IN_PROGRESS' as const };

    switch (action.type) {
      case 'CONTACT_EMS':
        // Simulate EMS contact
        console.log(`Contacting EMS for ${alert.type} emergency`);
        // In production, integrate with emergency services API
        updatedAction.status = 'COMPLETED';
        updatedAction.completedAt = new Date().toISOString();
        updatedAction.notes = 'EMS contacted and dispatched';
        break;

      case 'MEDICAL_TREATMENT':
        // Log medical treatment action
        console.log(`Administering medical treatment for ${alert.type}`);
        // In production, integrate with medical protocols
        updatedAction.status = 'COMPLETED';
        updatedAction.completedAt = new Date().toISOString();
        break;

      case 'NOTIFY_PARENTS':
        // This is handled by the contact cascade
        updatedAction.status = 'COMPLETED';
        updatedAction.completedAt = new Date().toISOString();
        break;

      case 'EVACUATE':
        // Trigger evacuation protocol
        dispatch(communicationActions.create({
          type: 'EVACUATION_ORDER',
          subject: 'EVACUATION REQUIRED',
          content: `Immediate evacuation required for ${alert.location}. Follow emergency protocols.`,
          recipientType: 'ALL_STAFF',
          recipientIds: ['all-staff'],
          priority: 'URGENT'
        }));
        updatedAction.status = 'COMPLETED';
        updatedAction.completedAt = new Date().toISOString();
        break;

      case 'ISOLATE':
        // Isolation protocol
        updatedAction.status = 'COMPLETED';
        updatedAction.completedAt = new Date().toISOString();
        updatedAction.notes = 'Area isolated and secured';
        break;

      case 'DOCUMENT':
        // Documentation is handled by incident reporting
        updatedAction.status = 'COMPLETED';
        updatedAction.completedAt = new Date().toISOString();
        break;
    }

    return updatedAction;
  }
);

/**
 * Emergency Escalation Check
 */
export const checkEmergencyEscalation = createAsyncThunk<
  void,
  { alertId: string },
  { state: RootState }
>(
  'workflows/checkEmergencyEscalation',
  async ({ alertId }, { dispatch }) => {
    // In a real implementation, check if emergency is still active
    // and escalate if necessary
    
    console.log(`Checking escalation for emergency ${alertId}`);
    
    // Escalate by notifying higher authorities
    dispatch(communicationActions.create({
      type: 'EMERGENCY_ESCALATION',
      subject: `ESCALATION: Emergency ${alertId} requires immediate attention`,
      content: 'Emergency situation has not been resolved within expected timeframe. Immediate intervention required.',
      recipientType: 'EMERGENCY_TEAM',
      recipientIds: ['emergency-coordinator'],
      priority: 'URGENT'
    }));
  }
);

// Helper functions
function determineResponseTeam(type: EmergencyAlert['type'], severity: EmergencyAlert['severity']): string[] {
  const teams = {
    MEDICAL: ['school-nurse', 'principal'],
    BEHAVIORAL: ['counselor', 'principal', 'security'],
    ACCIDENT: ['nurse', 'maintenance', 'principal'],
    SEVERE_ALLERGIC_REACTION: ['nurse', 'principal', 'ems'],
    NATURAL_DISASTER: ['principal', 'security', 'maintenance', 'emergency-coordinator']
  };

  let responseTeam = teams[type] || ['principal'];

  if (severity === 'CRITICAL') {
    responseTeam = [...responseTeam, 'superintendent', 'emergency-coordinator'];
  }

  return responseTeam;
}

function generateEmergencyActions(alert: EmergencyAlert): EmergencyAction[] {
  const actions: EmergencyAction[] = [];
  let actionId = 1;

  // Generate actions based on emergency type
  switch (alert.type) {
    case 'MEDICAL':
    case 'SEVERE_ALLERGIC_REACTION':
      actions.push({
        id: `action-${actionId++}`,
        type: 'MEDICAL_TREATMENT',
        description: 'Provide immediate medical treatment',
        assignedTo: 'school-nurse',
        status: 'PENDING'
      });
      
      if (alert.severity === 'CRITICAL') {
        actions.push({
          id: `action-${actionId++}`,
          type: 'CONTACT_EMS',
          description: 'Contact Emergency Medical Services',
          assignedTo: 'principal',
          status: 'PENDING'
        });
      }
      break;

    case 'BEHAVIORAL':
      actions.push({
        id: `action-${actionId++}`,
        type: 'ISOLATE',
        description: 'Isolate student and ensure safety',
        assignedTo: 'counselor',
        status: 'PENDING'
      });
      break;

    case 'NATURAL_DISASTER':
      actions.push({
        id: `action-${actionId++}`,
        type: 'EVACUATE',
        description: 'Initiate evacuation procedures',
        assignedTo: 'principal',
        status: 'PENDING'
      });
      break;
  }

  // Always notify parents and document
  actions.push(
    {
      id: `action-${actionId++}`,
      type: 'NOTIFY_PARENTS',
      description: 'Notify emergency contacts',
      assignedTo: 'office-staff',
      status: 'PENDING'
    },
    {
      id: `action-${actionId++}`,
      type: 'DOCUMENT',
      description: 'Document incident and response',
      assignedTo: alert.reportedBy,
      status: 'PENDING'
    }
  );

  return actions;
}

function mapEmergencyTypeToIncident(emergencyType: EmergencyAlert['type']): string {
  const mapping = {
    MEDICAL: 'MEDICAL_EMERGENCY',
    BEHAVIORAL: 'BEHAVIORAL_INCIDENT',
    ACCIDENT: 'ACCIDENT',
    SEVERE_ALLERGIC_REACTION: 'ALLERGIC_REACTION',
    NATURAL_DISASTER: 'ENVIRONMENTAL_HAZARD'
  };
  
  return mapping[emergencyType] || 'OTHER';
}

function createEmergencyMessage(type: EmergencyAlert['type'], severity: EmergencyAlert['severity']): string {
  const baseMessage = `SCHOOL EMERGENCY NOTIFICATION: Your child is involved in a ${type.toLowerCase().replace('_', ' ')} situation at school.`;
  
  if (severity === 'CRITICAL') {
    return baseMessage + ' This is a critical situation requiring immediate attention. Please contact the school immediately or come to campus.';
  } else if (severity === 'HIGH') {
    return baseMessage + ' Please contact the school for more information.';
  } else {
    return baseMessage + ' Your child is safe. Please contact the school when convenient for details.';
  }
}

function getPrimaryContactMethod(contact: any): NotificationLog['method'] {
  // Prioritize phone for emergencies
  if (contact.phone) return 'PHONE';
  if (contact.email) return 'EMAIL';
  return 'SMS';
}

function getSecondaryContactMethod(contact: any): NotificationLog['method'] | null {
  // Use different method as secondary
  if (contact.email) return 'EMAIL';
  if (contact.phone) return 'SMS';
  return null;
}

function getEscalationTimeout(severity: EmergencyAlert['severity']): number {
  // Return timeout in milliseconds
  switch (severity) {
    case 'CRITICAL': return 5 * 60 * 1000; // 5 minutes
    case 'HIGH': return 15 * 60 * 1000; // 15 minutes
    case 'MEDIUM': return 30 * 60 * 1000; // 30 minutes
    case 'LOW': return 60 * 60 * 1000; // 1 hour
    default: return 30 * 60 * 1000;
  }
}

async function simulateNotificationSend(method: NotificationLog['method'], message: string, urgent: boolean): Promise<void> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, urgent ? 100 : 500));
  
  // Simulate occasional failures
  if (Math.random() < 0.05) { // 5% failure rate
    throw new Error(`Failed to send ${method} notification`);
  }
  
  console.log(`Sent ${method} notification: ${message.substring(0, 50)}...`);
}