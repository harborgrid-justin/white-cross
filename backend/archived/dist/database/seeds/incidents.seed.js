"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateIncidents = generateIncidents;
const incident_report_model_1 = require("../models/incident-report.model");
const LOCATIONS = [
    'Playground',
    'Cafeteria',
    'Gymnasium',
    'Classroom 101',
    'Classroom 205',
    'Hallway',
    'Science Lab',
    'Library',
    'Bathroom',
    'Parking Lot',
    'Sports Field',
    'Auditorium',
    'Nurse Office',
    'Stairwell',
    'Main Entrance',
];
const INJURY_DESCRIPTIONS = [
    'Student slipped on wet floor and sustained minor bruising to left knee',
    'Student fell during recess and scraped right elbow',
    'Student bumped head on desk, no loss of consciousness, small bump present',
    'Student twisted ankle during PE class, able to walk with slight limp',
    'Student cut finger on paper, minor bleeding controlled with bandage',
    'Student experienced nosebleed during class, bleeding stopped after 5 minutes',
    'Student complained of headache after falling from swing',
    'Student sustained minor cut on hand from broken glass',
];
const ILLNESS_DESCRIPTIONS = [
    'Student complained of nausea and stomach pain, rested in nurse office',
    'Student has fever of 101.5°F, parents notified to pick up',
    'Student experienced vomiting in classroom, isolated and cleaned',
    'Student reported severe headache and sensitivity to light',
    'Student has persistent cough and runny nose symptoms',
    'Student complained of dizziness and was allowed to rest',
    'Student reported sore throat and difficulty swallowing',
];
const BEHAVIORAL_DESCRIPTIONS = [
    'Student engaged in verbal altercation with peer, separated and counseled',
    'Student refused to follow teacher instructions repeatedly',
    'Student threw objects in classroom during lesson',
    'Student left classroom without permission',
    'Student was disruptive during assembly, removed from event',
    'Student used inappropriate language towards staff member',
    'Student was involved in physical altercation with another student',
];
const MEDICATION_ERROR_DESCRIPTIONS = [
    'Wrong dosage administered - gave 10mg instead of 5mg, physician notified',
    'Medication given 30 minutes late due to scheduling conflict',
    'Student took medication without supervision',
    'Medication administered to wrong student, error caught immediately',
    'Student experienced adverse reaction to prescribed medication',
];
const ALLERGIC_REACTION_DESCRIPTIONS = [
    'Student had mild allergic reaction to peanuts, given antihistamine',
    'Student developed hives after eating lunch, parents notified',
    'Student experienced difficulty breathing, EpiPen administered, 911 called',
    'Student had allergic reaction to bee sting, treated with first aid',
];
const ACTIONS_TAKEN = [
    'Applied first aid, ice pack provided, parent notified',
    'Student rested in nurse office for 20 minutes, returned to class',
    'Cleaned and bandaged wound, parent notified via phone',
    'Called parent for pickup, student isolated from others',
    'Administered over-the-counter pain reliever with parent permission',
    'Documented incident, student returned to class after assessment',
    'Emergency services contacted, parent notified immediately',
    'Student counseled and parent meeting scheduled',
    'Provided emotional support and conflict resolution guidance',
];
const WITNESS_NAMES = [
    'Teacher Johnson',
    'Ms. Rodriguez',
    'Mr. Thompson',
    'Cafeteria Staff',
    'PE Instructor',
    'Playground Monitor',
    'Ms. Williams',
    'Mr. Davis',
    'School Nurse',
    'Principal Anderson',
];
function generateRecentDate() {
    const now = new Date();
    const daysAgo = Math.floor(Math.random() * 90);
    const date = new Date(now);
    date.setDate(date.getDate() - daysAgo);
    date.setHours(7 + Math.floor(Math.random() * 8));
    date.setMinutes(Math.floor(Math.random() * 60));
    return date;
}
function getDescriptionByType(type) {
    switch (type) {
        case incident_report_model_1.IncidentType.INJURY:
            return INJURY_DESCRIPTIONS[Math.floor(Math.random() * INJURY_DESCRIPTIONS.length)];
        case incident_report_model_1.IncidentType.ILLNESS:
            return ILLNESS_DESCRIPTIONS[Math.floor(Math.random() * ILLNESS_DESCRIPTIONS.length)];
        case incident_report_model_1.IncidentType.BEHAVIORAL:
            return BEHAVIORAL_DESCRIPTIONS[Math.floor(Math.random() * BEHAVIORAL_DESCRIPTIONS.length)];
        case incident_report_model_1.IncidentType.MEDICATION_ERROR:
            return MEDICATION_ERROR_DESCRIPTIONS[Math.floor(Math.random() * MEDICATION_ERROR_DESCRIPTIONS.length)];
        case incident_report_model_1.IncidentType.ALLERGIC_REACTION:
            return ALLERGIC_REACTION_DESCRIPTIONS[Math.floor(Math.random() * ALLERGIC_REACTION_DESCRIPTIONS.length)];
        case incident_report_model_1.IncidentType.EMERGENCY:
            return 'Emergency situation requiring immediate medical attention';
        case incident_report_model_1.IncidentType.SAFETY:
            return 'Safety concern identified requiring investigation and corrective action';
        case incident_report_model_1.IncidentType.OTHER:
            return 'Other incident requiring documentation and follow-up';
        default:
            return 'Incident occurred and was documented per school policy';
    }
}
function generateIncidents(studentIds, nurseIds, incidentsPerStudent = 1) {
    const incidents = [];
    const incidentTypes = Object.values(incident_report_model_1.IncidentType);
    const severities = Object.values(incident_report_model_1.IncidentSeverity);
    for (const studentId of studentIds) {
        if (Math.random() > 0.4)
            continue;
        const numIncidents = Math.random() < 0.8
            ? 1
            : Math.floor(Math.random() * incidentsPerStudent) + 1;
        for (let i = 0; i < numIncidents; i++) {
            const type = incidentTypes[Math.floor(Math.random() * incidentTypes.length)];
            const severity = severities[Math.floor(Math.random() * severities.length)];
            const occurredAt = generateRecentDate();
            const reportedById = nurseIds[Math.floor(Math.random() * nurseIds.length)];
            const parentNotified = severity !== incident_report_model_1.IncidentSeverity.LOW ? true : Math.random() > 0.3;
            const numWitnesses = Math.floor(Math.random() * 4);
            const witnesses = [];
            for (let w = 0; w < numWitnesses; w++) {
                const witness = WITNESS_NAMES[Math.floor(Math.random() * WITNESS_NAMES.length)];
                if (!witnesses.includes(witness)) {
                    witnesses.push(witness);
                }
            }
            const followUpRequired = severity === incident_report_model_1.IncidentSeverity.MEDIUM ||
                severity === incident_report_model_1.IncidentSeverity.HIGH ||
                severity === incident_report_model_1.IncidentSeverity.CRITICAL;
            const needsInsuranceClaim = (type === incident_report_model_1.IncidentType.INJURY || type === incident_report_model_1.IncidentType.EMERGENCY) &&
                (severity === incident_report_model_1.IncidentSeverity.HIGH ||
                    severity === incident_report_model_1.IncidentSeverity.CRITICAL);
            const statuses = [
                incident_report_model_1.IncidentStatus.PENDING_REVIEW,
                incident_report_model_1.IncidentStatus.UNDER_INVESTIGATION,
                incident_report_model_1.IncidentStatus.REQUIRES_ACTION,
                incident_report_model_1.IncidentStatus.RESOLVED,
            ];
            const status = severity === incident_report_model_1.IncidentSeverity.CRITICAL ||
                severity === incident_report_model_1.IncidentSeverity.HIGH
                ? statuses[Math.floor(Math.random() * 3)]
                : statuses[Math.floor(Math.random() * statuses.length)];
            const incident = {
                studentId,
                reportedById,
                type,
                severity,
                status,
                description: getDescriptionByType(type),
                location: LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)],
                witnesses,
                actionsTaken: ACTIONS_TAKEN[Math.floor(Math.random() * ACTIONS_TAKEN.length)],
                parentNotified,
                parentNotificationMethod: parentNotified
                    ? Math.random() > 0.5
                        ? 'Phone'
                        : 'Email'
                    : undefined,
                parentNotifiedAt: parentNotified
                    ? new Date(occurredAt.getTime() + 30 * 60000)
                    : undefined,
                parentNotifiedBy: parentNotified ? reportedById : undefined,
                followUpRequired,
                followUpNotes: followUpRequired
                    ? 'Schedule follow-up appointment to assess recovery progress'
                    : undefined,
                attachments: [],
                evidencePhotos: [],
                evidenceVideos: [],
                insuranceClaimNumber: needsInsuranceClaim
                    ? `CLM-${Date.now()}-${Math.floor(Math.random() * 10000)}`
                    : undefined,
                insuranceClaimStatus: needsInsuranceClaim
                    ? incident_report_model_1.InsuranceClaimStatus.FILED
                    : undefined,
                legalComplianceStatus: severity === incident_report_model_1.IncidentSeverity.CRITICAL
                    ? incident_report_model_1.ComplianceStatus.UNDER_REVIEW
                    : incident_report_model_1.ComplianceStatus.COMPLIANT,
                occurredAt,
                createdBy: reportedById,
            };
            incidents.push(incident);
        }
    }
    return incidents;
}
//# sourceMappingURL=incidents.seed.js.map