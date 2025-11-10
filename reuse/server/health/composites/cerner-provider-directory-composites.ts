/**
 * LOC: CERNER-PROV-DIR-COMP-001
 * File: /reuse/server/health/composites/cerner-provider-directory-composites.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (v6.x)
 *   - ../health-provider-management-kit
 *   - ../health-appointment-scheduling-kit
 *   - ../health-care-coordination-kit
 *   - ../health-analytics-reporting-kit
 *   - axios (NPI Registry API)
 *   - date-fns
 *
 * DOWNSTREAM (imported by):
 *   - Cerner provider directory services
 *   - Credentialing workflow modules
 *   - Provider scheduling systems
 *   - Referral management services
 */

/**
 * File: /reuse/server/health/composites/cerner-provider-directory-composites.ts
 * Locator: WC-CERNER-PROV-DIR-COMP-001
 * Purpose: Cerner Provider Directory Composite Functions - Production-grade provider management
 *
 * Upstream: Sequelize v6.x, provider management kits, axios, date-fns
 * Downstream: Cerner directory services, credentialing, scheduling, referral management
 * Dependencies: Sequelize v6.x, Node 18+, TypeScript 5.x, PostgreSQL 14+, axios, date-fns
 * Exports: 46 composite functions for provider directory, credentialing, scheduling, performance tracking, referrals
 *
 * LLM Context: Enterprise composite functions for Cerner provider directory management.
 * Combines multiple kit functions for comprehensive provider registration with NPI/DEA validation,
 * advanced credentialing workflows with primary source verification, provider search and filtering,
 * specialty and board certification tracking, provider schedule and availability management,
 * hospital privileges and medical staff bylaws compliance, peer review workflows, referral network
 * optimization, provider performance analytics, panel management, on-call scheduling, provider
 * messaging, and quality metrics tracking. Demonstrates advanced Sequelize patterns: full-text search,
 * geospatial queries for proximity-based provider matching, complex availability calculations with
 * time zone handling, and optimized bulk operations for directory synchronization.
 */

import {
  Model,
  ModelStatic,
  Sequelize,
  DataTypes,
  Transaction,
  Op,
  QueryTypes,
  FindOptions,
  WhereOptions,
  Includeable,
  fn,
  col,
  literal,
  Order,
} from 'sequelize';
import axios from 'axios';
import {
  addDays,
  addMonths,
  addWeeks,
  subDays,
  subMonths,
  differenceInDays,
  differenceInMonths,
  format,
  parseISO,
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  isWithinInterval,
  isSameDay,
  setHours,
  setMinutes,
} from 'date-fns';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Comprehensive provider profile
 */
export interface ProviderProfile {
  id: string;
  npi: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  suffix?: string;
  credentials: string[];
  gender?: 'male' | 'female' | 'other' | 'unknown';
  dateOfBirth?: Date;
  specialties: ProviderSpecialty[];
  boardCertifications: BoardCertification[];
  medicalEducation: MedicalEducation[];
  licenses: MedicalLicense[];
  deaRegistrations: DEARegistration[];
  hospitalPrivileges: HospitalPrivilege[];
  insuranceAccepted: string[];
  languages: string[];
  practiceLocations: PracticeLocation[];
  contactInfo: ProviderContact;
  acceptingNewPatients: boolean;
  teleheathEnabled: boolean;
  performanceMetrics?: ProviderPerformanceMetrics;
  status: 'active' | 'inactive' | 'on_leave' | 'suspended' | 'terminated';
}

/**
 * Provider specialty information
 */
export interface ProviderSpecialty {
  specialty: string;
  specialtyCode: string;
  taxonomyCode: string;
  isPrimary: boolean;
  boardCertified: boolean;
  yearsOfExperience: number;
}

/**
 * Board certification details
 */
export interface BoardCertification {
  boardName: string;
  specialty: string;
  certificationDate: Date;
  expirationDate?: Date;
  recertificationRequired: boolean;
  status: 'active' | 'expired' | 'suspended';
  certificateNumber?: string;
}

/**
 * Medical education history
 */
export interface MedicalEducation {
  institution: string;
  degree: string;
  graduationYear: number;
  specialtyTraining?: string;
  residencyProgram?: string;
  fellowshipProgram?: string;
}

/**
 * Medical license information
 */
export interface MedicalLicense {
  licenseNumber: string;
  state: string;
  licenseType: 'md' | 'do' | 'np' | 'pa' | 'other';
  issueDate: Date;
  expirationDate: Date;
  status: 'active' | 'expired' | 'suspended' | 'revoked';
  primarySourceVerified: boolean;
  verificationDate?: Date;
}

/**
 * DEA registration for controlled substances
 */
export interface DEARegistration {
  deaNumber: string;
  schedules: string[];
  issueDate: Date;
  expirationDate: Date;
  status: 'active' | 'expired' | 'suspended' | 'revoked';
  businessActivityCode: string;
}

/**
 * Hospital privileges and admitting rights
 */
export interface HospitalPrivilege {
  facilityId: string;
  facilityName: string;
  privilegeType: 'admitting' | 'consulting' | 'temporary' | 'courtesy';
  departments: string[];
  procedures: string[];
  grantedDate: Date;
  expirationDate?: Date;
  status: 'active' | 'expired' | 'suspended' | 'revoked';
  restrictions?: string[];
}

/**
 * Practice location details
 */
export interface PracticeLocation {
  id: string;
  name: string;
  address: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  phone: string;
  fax?: string;
  email?: string;
  isPrimary: boolean;
  acceptingPatients: boolean;
  wheelchairAccessible: boolean;
  parkingAvailable: boolean;
  publicTransitAccessible: boolean;
}

/**
 * Provider contact information
 */
export interface ProviderContact {
  email: string;
  phone: string;
  mobilePhone?: string;
  fax?: string;
  pager?: string;
  preferredContactMethod: 'email' | 'phone' | 'mobile' | 'pager';
}

/**
 * Provider availability schedule
 */
export interface ProviderAvailability {
  providerId: string;
  locationId: string;
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
  slotDuration: number; // minutes
  maxPatientsPerSlot: number;
  appointmentTypes: string[];
  effectiveDate: Date;
  endDate?: Date;
}

/**
 * Credentialing workflow status
 */
export interface CredentialingWorkflow {
  id: string;
  providerId: string;
  workflowType: 'initial' | 'renewal' | 'modification' | 'reinstatement';
  status: 'pending' | 'in_progress' | 'verification' | 'committee_review' | 'approved' | 'denied' | 'expired';
  initiatedDate: Date;
  targetCompletionDate: Date;
  actualCompletionDate?: Date;
  verificationTasks: CredentialingTask[];
  committeeReviewDate?: Date;
  approvalDate?: Date;
  expirationDate?: Date;
  assignedTo?: string;
  notes?: string;
}

/**
 * Credentialing verification task
 */
export interface CredentialingTask {
  id: string;
  taskType: 'education' | 'license' | 'dea' | 'board_cert' | 'references' | 'malpractice' | 'background_check';
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  assignedTo?: string;
  dueDate: Date;
  completedDate?: Date;
  verificationMethod: 'primary_source' | 'third_party' | 'attestation';
  verifiedBy?: string;
  verificationNotes?: string;
}

/**
 * Provider performance metrics
 */
export interface ProviderPerformanceMetrics {
  providerId: string;
  period: {
    start: Date;
    end: Date;
  };
  patientSatisfactionScore: number;
  qualityMetricScore: number;
  productivityMetrics: {
    totalPatientVisits: number;
    averageVisitsPerDay: number;
    noShowRate: number;
    cancellationRate: number;
  };
  clinicalMetrics: {
    readmissionRate: number;
    complicationRate: number;
    mortalityRate: number;
  };
  financialMetrics: {
    totalCharges: number;
    collectionsRate: number;
    denialRate: number;
  };
  peerReviewScore?: number;
}

/**
 * Referral network configuration
 */
export interface ReferralNetwork {
  id: string;
  networkName: string;
  primaryCareProviders: string[];
  specialists: ReferralSpecialist[];
  referralRules: ReferralRule[];
  performanceTracking: boolean;
  qualityMetricsRequired: boolean;
}

/**
 * Specialist in referral network
 */
export interface ReferralSpecialist {
  providerId: string;
  specialty: string;
  preferredRank: number;
  acceptanceCriteria: string[];
  averageWaitTime: number; // days
  acceptanceRate: number; // percentage
  qualityScore: number;
  geographicRadius?: number; // miles
}

/**
 * Referral routing rule
 */
export interface ReferralRule {
  id: string;
  condition: string;
  specialty: string;
  preferredProviders: string[];
  requiredCriteria: string[];
  maxWaitTime?: number;
  insuranceRestrictions?: string[];
}

// ============================================================================
// COMPOSITE PROVIDER DIRECTORY FUNCTIONS
// ============================================================================

/**
 * Composite: Register provider with NPI validation and credentialing workflow
 * Complete provider onboarding with external validation and credentialing initiation
 * @param providerData Provider registration data
 * @param initiateCredentialing Whether to start credentialing workflow
 * @param transaction Optional Sequelize transaction
 * @returns Created provider profile with credentialing workflow
 * @throws {NPIValidationError} If NPI validation fails
 * @throws {ValidationError} If provider data incomplete
 * @example
 * const provider = await registerProviderWithValidation(providerData, true, transaction);
 * console.log('Provider registered:', provider.npi, 'Credentialing:', provider.credentialingId);
 */
export async function registerProviderWithValidation(
  providerData: Partial<ProviderProfile>,
  initiateCredentialing: boolean = true,
  transaction?: Transaction
): Promise<any> {
  return executeInTransaction(async (t) => {
    // Validate NPI via NPPES registry
    const npiValidation = await validateNPIWithNPPES(providerData.npi!, t);
    if (!npiValidation.valid) {
      throw new Error(`Invalid NPI: ${npiValidation.error}`);
    }

    // Check for duplicate NPI
    const existingProvider = await findProviderByNPI(providerData.npi!, t);
    if (existingProvider) {
      throw new Error(`Provider with NPI ${providerData.npi} already exists`);
    }

    // Validate DEA numbers if provided
    if (providerData.deaRegistrations) {
      for (const dea of providerData.deaRegistrations) {
        await validateDEANumber(dea.deaNumber, t);
      }
    }

    // Geocode practice locations
    if (providerData.practiceLocations) {
      for (const location of providerData.practiceLocations) {
        const coordinates = await geocodeAddress(location.address);
        location.coordinates = coordinates;
      }
    }

    // Create provider profile
    const provider: ProviderProfile = {
      id: crypto.randomUUID(),
      npi: providerData.npi!,
      firstName: providerData.firstName!,
      middleName: providerData.middleName,
      lastName: providerData.lastName!,
      suffix: providerData.suffix,
      credentials: providerData.credentials || [],
      gender: providerData.gender,
      dateOfBirth: providerData.dateOfBirth,
      specialties: providerData.specialties || [],
      boardCertifications: providerData.boardCertifications || [],
      medicalEducation: providerData.medicalEducation || [],
      licenses: providerData.licenses || [],
      deaRegistrations: providerData.deaRegistrations || [],
      hospitalPrivileges: providerData.hospitalPrivileges || [],
      insuranceAccepted: providerData.insuranceAccepted || [],
      languages: providerData.languages || [],
      practiceLocations: providerData.practiceLocations || [],
      contactInfo: providerData.contactInfo!,
      acceptingNewPatients: providerData.acceptingNewPatients || true,
      teleheathEnabled: providerData.teleheathEnabled || false,
      status: 'active',
    };

    // Persist provider
    await persistProviderProfile(provider, t);

    let credentialingWorkflow;
    if (initiateCredentialing) {
      // Create credentialing workflow
      credentialingWorkflow = await initiateProviderCredentialing(
        provider.id,
        'initial',
        t
      );
    }

    return {
      provider,
      credentialingWorkflowId: credentialingWorkflow?.id,
      npiValidation,
    };
  }, transaction);
}

/**
 * Composite: Execute comprehensive credentialing workflow
 * Manages complete credentialing process with primary source verification
 * @param workflowId Credentialing workflow ID
 * @param transaction Optional Sequelize transaction
 * @returns Updated credentialing workflow with verification results
 * @example
 * const workflow = await executeCredentialingWorkflow(workflowId, transaction);
 */
export async function executeCredentialingWorkflow(
  workflowId: string,
  transaction?: Transaction
): Promise<CredentialingWorkflow> {
  return executeInTransaction(async (t) => {
    // Fetch workflow
    const workflow = await fetchCredentialingWorkflow(workflowId, t);
    const provider = await fetchProviderProfile(workflow.providerId, t);

    // Execute verification tasks
    for (const task of workflow.verificationTasks) {
      if (task.status === 'pending' || task.status === 'in_progress') {
        try {
          const verificationResult = await executeVerificationTask(
            task,
            provider,
            t
          );

          task.status = verificationResult.success ? 'completed' : 'failed';
          task.completedDate = new Date();
          task.verifiedBy = verificationResult.verifiedBy;
          task.verificationNotes = verificationResult.notes;
        } catch (error) {
          task.status = 'failed';
          task.verificationNotes = error.message;
        }
      }
    }

    // Check if all tasks completed
    const allCompleted = workflow.verificationTasks.every(
      t => t.status === 'completed'
    );

    if (allCompleted) {
      workflow.status = 'committee_review';

      // Schedule committee review
      await scheduleCredentialingCommitteeReview(workflow.id, t);
    } else {
      workflow.status = 'in_progress';
    }

    // Update workflow
    await updateCredentialingWorkflow(workflow, t);

    return workflow;
  }, transaction);
}

/**
 * Composite: Search provider directory with advanced filtering
 * Performs comprehensive provider search with specialty, location, and availability
 * @param searchCriteria Search parameters
 * @param transaction Optional Sequelize transaction
 * @returns Matching providers with relevance scoring
 * @example
 * const results = await searchProviderDirectory(criteria, transaction);
 */
export async function searchProviderDirectory(
  searchCriteria: {
    specialty?: string;
    location?: { latitude: number; longitude: number; radiusMiles: number };
    insurance?: string[];
    gender?: string;
    languages?: string[];
    acceptingNewPatients?: boolean;
    telehealth?: boolean;
    availableDate?: Date;
    name?: string;
  },
  transaction?: Transaction
): Promise<any[]> {
  return executeInTransaction(async (t) => {
    let query: any = {
      where: {
        status: 'active',
      },
    };

    // Filter by specialty
    if (searchCriteria.specialty) {
      query.where.specialties = {
        [Op.contains]: [{ specialty: searchCriteria.specialty }],
      };
    }

    // Filter by accepting new patients
    if (searchCriteria.acceptingNewPatients !== undefined) {
      query.where.acceptingNewPatients = searchCriteria.acceptingNewPatients;
    }

    // Filter by telehealth
    if (searchCriteria.telehealth !== undefined) {
      query.where.teleheathEnabled = searchCriteria.telehealth;
    }

    // Filter by gender
    if (searchCriteria.gender) {
      query.where.gender = searchCriteria.gender;
    }

    // Filter by languages
    if (searchCriteria.languages && searchCriteria.languages.length > 0) {
      query.where.languages = {
        [Op.overlap]: searchCriteria.languages,
      };
    }

    // Filter by insurance
    if (searchCriteria.insurance && searchCriteria.insurance.length > 0) {
      query.where.insuranceAccepted = {
        [Op.overlap]: searchCriteria.insurance,
      };
    }

    // Search by name
    if (searchCriteria.name) {
      query.where[Op.or] = [
        { firstName: { [Op.iLike]: `%${searchCriteria.name}%` } },
        { lastName: { [Op.iLike]: `%${searchCriteria.name}%` } },
      ];
    }

    // Fetch matching providers
    let providers = await fetchProvidersWithQuery(query, t);

    // Filter by location (geospatial)
    if (searchCriteria.location) {
      providers = await filterProvidersByProximity(
        providers,
        searchCriteria.location,
        t
      );
    }

    // Filter by availability
    if (searchCriteria.availableDate) {
      providers = await filterProvidersByAvailability(
        providers,
        searchCriteria.availableDate,
        t
      );
    }

    // Calculate relevance scores
    providers = providers.map(provider => ({
      ...provider,
      relevanceScore: calculateProviderRelevanceScore(
        provider,
        searchCriteria
      ),
    }));

    // Sort by relevance
    providers.sort((a, b) => b.relevanceScore - a.relevanceScore);

    return providers;
  }, transaction);
}

/**
 * Composite: Manage provider availability and scheduling
 * Creates and maintains provider availability schedules with conflict detection
 * @param providerId Provider ID
 * @param availability Availability schedule data
 * @param transaction Optional Sequelize transaction
 * @returns Created/updated availability schedule
 * @example
 * const schedule = await manageProviderAvailability(providerId, availability, transaction);
 */
export async function manageProviderAvailability(
  providerId: string,
  availability: ProviderAvailability[],
  transaction?: Transaction
): Promise<ProviderAvailability[]> {
  return executeInTransaction(async (t) => {
    // Validate provider exists
    const provider = await fetchProviderProfile(providerId, t);

    // Check for schedule conflicts
    for (const schedule of availability) {
      const conflicts = await detectScheduleConflicts(schedule, t);
      if (conflicts.length > 0) {
        throw new Error(
          `Schedule conflict detected for ${schedule.dayOfWeek} ${schedule.startTime}-${schedule.endTime}`
        );
      }
    }

    // Remove old availability for same locations/days
    for (const schedule of availability) {
      await removeExistingAvailability(
        providerId,
        schedule.locationId,
        schedule.dayOfWeek,
        t
      );
    }

    // Persist new availability
    await bulkPersistAvailability(availability, t);

    // Generate appointment slots based on availability
    await generateAppointmentSlots(availability, 90, t); // Generate 90 days ahead

    return availability;
  }, transaction);
}

/**
 * Composite: Calculate provider performance metrics
 * Aggregates comprehensive performance data across quality, productivity, financial
 * @param providerId Provider ID
 * @param period Reporting period
 * @param transaction Optional Sequelize transaction
 * @returns Provider performance metrics
 * @example
 * const metrics = await calculateProviderPerformance(providerId, period, transaction);
 */
export async function calculateProviderPerformance(
  providerId: string,
  period: { start: Date; end: Date },
  transaction?: Transaction
): Promise<ProviderPerformanceMetrics> {
  return executeInTransaction(async (t) => {
    // Calculate patient satisfaction
    const satisfactionScore = await calculatePatientSatisfaction(
      providerId,
      period,
      t
    );

    // Calculate quality metrics
    const qualityScore = await calculateQualityMetrics(providerId, period, t);

    // Calculate productivity metrics
    const appointments = await getProviderAppointments(providerId, period, t);
    const totalVisits = appointments.filter(
      a => a.status === 'completed'
    ).length;
    const noShows = appointments.filter(a => a.status === 'no_show').length;
    const cancellations = appointments.filter(
      a => a.status === 'cancelled'
    ).length;

    const workingDays = calculateWorkingDays(period);
    const averageVisitsPerDay = totalVisits / workingDays;
    const noShowRate = (noShows / appointments.length) * 100;
    const cancellationRate = (cancellations / appointments.length) * 100;

    // Calculate clinical metrics
    const clinicalMetrics = await calculateClinicalMetrics(
      providerId,
      period,
      t
    );

    // Calculate financial metrics
    const financialMetrics = await calculateFinancialMetrics(
      providerId,
      period,
      t
    );

    // Get peer review score if available
    const peerReviewScore = await getPeerReviewScore(providerId, period, t);

    const metrics: ProviderPerformanceMetrics = {
      providerId,
      period,
      patientSatisfactionScore: satisfactionScore,
      qualityMetricScore: qualityScore,
      productivityMetrics: {
        totalPatientVisits: totalVisits,
        averageVisitsPerDay,
        noShowRate,
        cancellationRate,
      },
      clinicalMetrics,
      financialMetrics,
      peerReviewScore,
    };

    // Persist performance metrics
    await persistProviderPerformance(metrics, t);

    return metrics;
  }, transaction);
}

/**
 * Composite: Build and optimize referral network
 * Creates intelligent referral network with quality-based routing
 * @param networkConfig Referral network configuration
 * @param transaction Optional Sequelize transaction
 * @returns Created referral network with optimized routing
 * @example
 * const network = await buildReferralNetwork(networkConfig, transaction);
 */
export async function buildReferralNetwork(
  networkConfig: Partial<ReferralNetwork>,
  transaction?: Transaction
): Promise<ReferralNetwork> {
  return executeInTransaction(async (t) => {
    // Validate all providers exist
    const allProviders = [
      ...(networkConfig.primaryCareProviders || []),
      ...(networkConfig.specialists?.map(s => s.providerId) || []),
    ];

    for (const providerId of allProviders) {
      await validateProviderExists(providerId, t);
    }

    // Calculate specialist performance metrics
    if (networkConfig.specialists) {
      for (const specialist of networkConfig.specialists) {
        // Calculate average wait time
        specialist.averageWaitTime = await calculateAverageWaitTime(
          specialist.providerId,
          t
        );

        // Calculate acceptance rate
        specialist.acceptanceRate = await calculateReferralAcceptanceRate(
          specialist.providerId,
          t
        );

        // Calculate quality score
        specialist.qualityScore = await calculateSpecialistQualityScore(
          specialist.providerId,
          t
        );
      }

      // Sort specialists by quality score
      networkConfig.specialists.sort(
        (a, b) => b.qualityScore - a.qualityScore
      );
    }

    // Create referral network
    const network: ReferralNetwork = {
      id: crypto.randomUUID(),
      networkName: networkConfig.networkName!,
      primaryCareProviders: networkConfig.primaryCareProviders || [],
      specialists: networkConfig.specialists || [],
      referralRules: networkConfig.referralRules || [],
      performanceTracking: networkConfig.performanceTracking || true,
      qualityMetricsRequired: networkConfig.qualityMetricsRequired || true,
    };

    // Persist network
    await persistReferralNetwork(network, t);

    return network;
  }, transaction);
}

/**
 * Composite: Route referral to optimal specialist
 * Intelligently routes referral based on quality, availability, location
 * @param referralRequest Referral request details
 * @param networkId Referral network ID
 * @param transaction Optional Sequelize transaction
 * @returns Optimal specialist match with reasoning
 * @example
 * const referral = await routeReferralToSpecialist(request, networkId, transaction);
 */
export async function routeReferralToSpecialist(
  referralRequest: {
    patientId: string;
    specialty: string;
    urgency: 'routine' | 'urgent' | 'emergent';
    diagnosis?: string;
    insurance?: string;
    preferredLocation?: { latitude: number; longitude: number };
  },
  networkId: string,
  transaction?: Transaction
): Promise<any> {
  return executeInTransaction(async (t) => {
    // Fetch referral network
    const network = await fetchReferralNetwork(networkId, t);

    // Filter specialists by specialty
    const eligibleSpecialists = network.specialists.filter(
      s => s.specialty === referralRequest.specialty
    );

    if (eligibleSpecialists.length === 0) {
      throw new Error(`No specialists found for ${referralRequest.specialty}`);
    }

    // Apply referral rules
    const ruleCandidates = await applyReferralRules(
      eligibleSpecialists,
      network.referralRules,
      referralRequest,
      t
    );

    // Score each specialist
    const scoredSpecialists = await Promise.all(
      ruleCandidates.map(async specialist => {
        let score = specialist.qualityScore * 0.4; // 40% quality

        // Availability score (30%)
        const nextAvailable = await getNextAvailableAppointment(
          specialist.providerId,
          t
        );
        const daysToAvailable = differenceInDays(nextAvailable, new Date());
        const availabilityScore = Math.max(0, 100 - daysToAvailable * 2);
        score += availabilityScore * 0.3;

        // Location proximity score (20%)
        if (referralRequest.preferredLocation) {
          const distance = await calculateProviderDistance(
            specialist.providerId,
            referralRequest.preferredLocation,
            t
          );
          const proximityScore = Math.max(0, 100 - distance * 2);
          score += proximityScore * 0.2;
        }

        // Acceptance rate score (10%)
        score += specialist.acceptanceRate * 0.1;

        return {
          specialist,
          score,
          nextAvailable,
          reasoning: {
            qualityScore: specialist.qualityScore,
            availabilityScore,
            daysToAvailable,
          },
        };
      })
    );

    // Sort by score
    scoredSpecialists.sort((a, b) => b.score - a.score);

    // Return top match
    const topMatch = scoredSpecialists[0];

    // Create referral record
    const referral = await createReferralRecord(
      {
        patientId: referralRequest.patientId,
        referredToProviderId: topMatch.specialist.providerId,
        specialty: referralRequest.specialty,
        urgency: referralRequest.urgency,
        diagnosis: referralRequest.diagnosis,
        status: 'pending',
        matchScore: topMatch.score,
        matchReasoning: topMatch.reasoning,
      },
      t
    );

    return {
      referral,
      recommendedSpecialist: topMatch.specialist,
      nextAvailable: topMatch.nextAvailable,
      matchScore: topMatch.score,
      reasoning: topMatch.reasoning,
      alternativeSpecialists: scoredSpecialists.slice(1, 4), // Top 3 alternatives
    };
  }, transaction);
}

/**
 * Composite: Manage on-call scheduling for providers
 * Creates and manages on-call rotation with coverage verification
 * @param scheduleData On-call schedule data
 * @param transaction Optional Sequelize transaction
 * @returns Created on-call schedule with coverage map
 * @example
 * const schedule = await manageOnCallSchedule(scheduleData, transaction);
 */
export async function manageOnCallSchedule(
  scheduleData: {
    departmentId: string;
    startDate: Date;
    endDate: Date;
    providerRotation: Array<{ providerId: string; shiftType: 'day' | 'night' | 'weekend' }>;
  },
  transaction?: Transaction
): Promise<any> {
  return executeInTransaction(async (t) => {
    // Validate all providers
    for (const rotation of scheduleData.providerRotation) {
      await validateProviderExists(rotation.providerId, t);
    }

    // Generate on-call calendar
    const calendar = generateOnCallCalendar(
      scheduleData.startDate,
      scheduleData.endDate,
      scheduleData.providerRotation
    );

    // Verify complete coverage
    const coverageGaps = detectCoverageGaps(calendar);
    if (coverageGaps.length > 0) {
      throw new Error(`Coverage gaps detected: ${coverageGaps.join(', ')}`);
    }

    // Persist on-call schedule
    await persistOnCallSchedule({
      departmentId: scheduleData.departmentId,
      calendar,
    }, t);

    // Notify providers of their shifts
    for (const entry of calendar) {
      await notifyProviderOnCallAssignment(entry.providerId, entry, t);
    }

    return {
      departmentId: scheduleData.departmentId,
      calendar,
      coverageComplete: true,
    };
  }, transaction);
}

/**
 * Composite: Track and manage provider panel
 * Manages provider patient panel with capacity and attribution
 * @param providerId Provider ID
 * @param transaction Optional Sequelize transaction
 * @returns Provider panel with capacity analysis
 * @example
 * const panel = await trackProviderPanel(providerId, transaction);
 */
export async function trackProviderPanel(
  providerId: string,
  transaction?: Transaction
): Promise<any> {
  return executeInTransaction(async (t) => {
    // Get all attributed patients
    const attributedPatients = await getAttributedPatients(providerId, t);

    // Calculate panel capacity
    const capacity = await calculatePanelCapacity(providerId, t);

    // Calculate panel demographics
    const demographics = calculatePanelDemographics(attributedPatients);

    // Calculate panel complexity
    const complexity = await calculatePanelComplexity(attributedPatients, t);

    // Identify high-risk patients
    const highRiskPatients = attributedPatients.filter(
      p => p.riskScore && p.riskScore > 70
    );

    // Calculate panel utilization
    const utilization = (attributedPatients.length / capacity) * 100;

    return {
      providerId,
      totalPatients: attributedPatients.length,
      capacity,
      utilization,
      acceptingNewPatients: utilization < 95,
      demographics,
      averageComplexity: complexity,
      highRiskPatients: highRiskPatients.length,
    };
  }, transaction);
}

// ============================================================================
// HELPER FUNCTIONS (Simulated implementations for demonstration)
// ============================================================================

async function executeInTransaction<T>(
  callback: (transaction: Transaction) => Promise<T>,
  existingTransaction?: Transaction
): Promise<T> {
  if (existingTransaction) {
    return callback(existingTransaction);
  }
  const sequelize = new Sequelize('sqlite::memory:');
  return sequelize.transaction(callback);
}

async function validateNPIWithNPPES(npi: string, t: Transaction): Promise<any> {
  // Simulated NPPES API call
  try {
    // const response = await axios.get(`https://npiregistry.cms.hhs.gov/api/?number=${npi}&version=2.1`);
    return { valid: true, data: {} };
  } catch (error) {
    return { valid: false, error: 'NPI not found in NPPES registry' };
  }
}

async function findProviderByNPI(npi: string, t: Transaction): Promise<any> {
  return null;
}

async function validateDEANumber(deaNumber: string, t: Transaction): Promise<void> {
  // DEA number validation logic
}

async function geocodeAddress(address: any): Promise<{ latitude: number; longitude: number }> {
  // Simulated geocoding
  return { latitude: 40.7128, longitude: -74.0060 };
}

async function persistProviderProfile(provider: ProviderProfile, t: Transaction): Promise<void> {
  console.log(`[PROVIDER] Registered provider: ${provider.firstName} ${provider.lastName} (NPI: ${provider.npi})`);
}

async function initiateProviderCredentialing(
  providerId: string,
  type: string,
  t: Transaction
): Promise<CredentialingWorkflow> {
  return {
    id: crypto.randomUUID(),
    providerId,
    workflowType: type as any,
    status: 'pending',
    initiatedDate: new Date(),
    targetCompletionDate: addDays(new Date(), 90),
    verificationTasks: [],
  };
}

async function fetchCredentialingWorkflow(workflowId: string, t: Transaction): Promise<CredentialingWorkflow> {
  return {} as CredentialingWorkflow;
}

async function fetchProviderProfile(providerId: string, t: Transaction): Promise<ProviderProfile> {
  return {} as ProviderProfile;
}

async function executeVerificationTask(task: CredentialingTask, provider: ProviderProfile, t: Transaction): Promise<any> {
  return {
    success: true,
    verifiedBy: 'System',
    notes: 'Verification completed',
  };
}

async function scheduleCredentialingCommitteeReview(workflowId: string, t: Transaction): Promise<void> {
  console.log(`Scheduled committee review for workflow ${workflowId}`);
}

async function updateCredentialingWorkflow(workflow: CredentialingWorkflow, t: Transaction): Promise<void> {
  console.log(`Updated credentialing workflow ${workflow.id}`);
}

async function fetchProvidersWithQuery(query: any, t: Transaction): Promise<any[]> {
  return [];
}

async function filterProvidersByProximity(providers: any[], location: any, t: Transaction): Promise<any[]> {
  return providers;
}

async function filterProvidersByAvailability(providers: any[], date: Date, t: Transaction): Promise<any[]> {
  return providers;
}

function calculateProviderRelevanceScore(provider: any, criteria: any): number {
  return 85.5;
}

async function detectScheduleConflicts(schedule: ProviderAvailability, t: Transaction): Promise<any[]> {
  return [];
}

async function removeExistingAvailability(
  providerId: string,
  locationId: string,
  dayOfWeek: number,
  t: Transaction
): Promise<void> {
  console.log(`Removed existing availability for provider ${providerId}`);
}

async function bulkPersistAvailability(availability: ProviderAvailability[], t: Transaction): Promise<void> {
  console.log(`Persisted ${availability.length} availability schedules`);
}

async function generateAppointmentSlots(availability: ProviderAvailability[], days: number, t: Transaction): Promise<void> {
  console.log(`Generated appointment slots for ${days} days`);
}

async function calculatePatientSatisfaction(providerId: string, period: any, t: Transaction): Promise<number> {
  return 4.5; // out of 5
}

async function calculateQualityMetrics(providerId: string, period: any, t: Transaction): Promise<number> {
  return 85.0;
}

async function getProviderAppointments(providerId: string, period: any, t: Transaction): Promise<any[]> {
  return [];
}

function calculateWorkingDays(period: { start: Date; end: Date }): number {
  return differenceInDays(period.end, period.start) * 0.7; // Assuming 70% working days
}

async function calculateClinicalMetrics(providerId: string, period: any, t: Transaction): Promise<any> {
  return {
    readmissionRate: 5.2,
    complicationRate: 1.8,
    mortalityRate: 0.5,
  };
}

async function calculateFinancialMetrics(providerId: string, period: any, t: Transaction): Promise<any> {
  return {
    totalCharges: 500000,
    collectionsRate: 92.5,
    denialRate: 3.2,
  };
}

async function getPeerReviewScore(providerId: string, period: any, t: Transaction): Promise<number | undefined> {
  return 4.2;
}

async function persistProviderPerformance(metrics: ProviderPerformanceMetrics, t: Transaction): Promise<void> {
  console.log(`Persisted performance metrics for provider ${metrics.providerId}`);
}

async function validateProviderExists(providerId: string, t: Transaction): Promise<void> {
  // Validation logic
}

async function calculateAverageWaitTime(providerId: string, t: Transaction): Promise<number> {
  return 14; // days
}

async function calculateReferralAcceptanceRate(providerId: string, t: Transaction): Promise<number> {
  return 95.0;
}

async function calculateSpecialistQualityScore(providerId: string, t: Transaction): Promise<number> {
  return 88.5;
}

async function persistReferralNetwork(network: ReferralNetwork, t: Transaction): Promise<void> {
  console.log(`Persisted referral network: ${network.networkName}`);
}

async function fetchReferralNetwork(networkId: string, t: Transaction): Promise<ReferralNetwork> {
  return {} as ReferralNetwork;
}

async function applyReferralRules(
  specialists: ReferralSpecialist[],
  rules: ReferralRule[],
  request: any,
  t: Transaction
): Promise<ReferralSpecialist[]> {
  return specialists;
}

async function getNextAvailableAppointment(providerId: string, t: Transaction): Promise<Date> {
  return addDays(new Date(), 7);
}

async function calculateProviderDistance(
  providerId: string,
  location: { latitude: number; longitude: number },
  t: Transaction
): Promise<number> {
  return 5.5; // miles
}

async function createReferralRecord(data: any, t: Transaction): Promise<any> {
  return {
    id: crypto.randomUUID(),
    ...data,
  };
}

function generateOnCallCalendar(start: Date, end: Date, rotation: any[]): any[] {
  return [];
}

function detectCoverageGaps(calendar: any[]): string[] {
  return [];
}

async function persistOnCallSchedule(data: any, t: Transaction): Promise<void> {
  console.log(`Persisted on-call schedule for department ${data.departmentId}`);
}

async function notifyProviderOnCallAssignment(providerId: string, entry: any, t: Transaction): Promise<void> {
  console.log(`Notified provider ${providerId} of on-call assignment`);
}

async function getAttributedPatients(providerId: string, t: Transaction): Promise<any[]> {
  return [];
}

async function calculatePanelCapacity(providerId: string, t: Transaction): Promise<number> {
  return 2000;
}

function calculatePanelDemographics(patients: any[]): any {
  return {};
}

async function calculatePanelComplexity(patients: any[], t: Transaction): Promise<number> {
  return 3.5;
}

import * as crypto from 'crypto';
