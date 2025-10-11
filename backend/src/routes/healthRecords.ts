import { ServerRoute } from '@hapi/hapi';
import { HealthRecordService } from '../services/healthRecordService';
import Joi from 'joi';

// ==========================================
// MAIN HEALTH RECORDS HANDLERS
// ==========================================

// Get health records for a student
const getStudentHealthRecordsHandler = async (request: any, h: any) => {
  try {
    const { studentId } = request.params;
    const page = parseInt(request.query.page) || 1;
    const limit = parseInt(request.query.limit) || 20;

    const filters: any = {};
    if (request.query.type) filters.type = request.query.type;
    if (request.query.dateFrom) filters.dateFrom = new Date(request.query.dateFrom);
    if (request.query.dateTo) filters.dateTo = new Date(request.query.dateTo);
    if (request.query.provider) filters.provider = request.query.provider;

    const result = await HealthRecordService.getStudentHealthRecords(studentId, page, limit, filters);

    return h.response({
      success: true,
      data: result
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(500);
  }
};

// Get single health record by ID
const getHealthRecordByIdHandler = async (request: any, h: any) => {
  try {
    const { id } = request.params;
    const record = await HealthRecordService.getHealthRecordById(id);

    return h.response({
      success: true,
      data: { record }
    });
  } catch (error) {
    const errorMessage = (error as Error).message;
    if (errorMessage.includes('not found')) {
      return h.response({
        success: false,
        error: { message: errorMessage }
      }).code(404);
    }

    return h.response({
      success: false,
      error: { message: errorMessage }
    }).code(500);
  }
};

// Create new health record
const createHealthRecordHandler = async (request: any, h: any) => {
  try {
    const healthRecord = await HealthRecordService.createHealthRecord({
      ...request.payload,
      date: new Date(request.payload.date)
    });

    return h.response({
      success: true,
      data: { healthRecord }
    }).code(201);
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(400);
  }
};

// Update health record
const updateHealthRecordHandler = async (request: any, h: any) => {
  try {
    const { id } = request.params;
    const updateData = { ...request.payload };

    if (updateData.date) {
      updateData.date = new Date(updateData.date);
    }

    const healthRecord = await HealthRecordService.updateHealthRecord(id, updateData);

    return h.response({
      success: true,
      data: { healthRecord }
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(400);
  }
};

// Delete health record
const deleteHealthRecordHandler = async (request: any, h: any) => {
  try {
    const { id } = request.params;
    await HealthRecordService.deleteHealthRecord(id);

    return h.response({
      success: true,
      message: 'Health record deleted successfully'
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(400);
  }
};

// Get student health timeline
const getHealthTimelineHandler = async (request: any, h: any) => {
  try {
    const { studentId } = request.params;
    const startDate = request.query.startDate ? new Date(request.query.startDate) : undefined;
    const endDate = request.query.endDate ? new Date(request.query.endDate) : undefined;

    const timeline = await HealthRecordService.getHealthTimeline(studentId, startDate, endDate);

    return h.response({
      success: true,
      data: { timeline }
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(500);
  }
};

// Get health summary
const getHealthSummaryHandler = async (request: any, h: any) => {
  try {
    const { studentId } = request.params;
    const summary = await HealthRecordService.getHealthSummary(studentId);

    return h.response({
      success: true,
      data: summary
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(500);
  }
};

// Export health records
const exportHealthRecordsHandler = async (request: any, h: any) => {
  try {
    const { studentId } = request.params;
    const format = request.query.format || 'json';
    const exportData = await HealthRecordService.exportHealthHistory(studentId);

    if (format === 'pdf') {
      // TODO: Implement PDF generation
      return h.response({
        success: false,
        error: { message: 'PDF export not yet implemented' }
      }).code(501);
    }

    return h.response({
      success: true,
      data: exportData
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(500);
  }
};

// Get health records statistics
const getHealthRecordStatisticsHandler = async (request: any, h: any) => {
  try {
    const statistics = await HealthRecordService.getHealthRecordStatistics();

    return h.response({
      success: true,
      data: statistics
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(500);
  }
};

// ==========================================
// ALLERGIES SUB-MODULE HANDLERS
// ==========================================

// Get student allergies
const getStudentAllergiesHandler = async (request: any, h: any) => {
  try {
    const { studentId } = request.params;
    const allergies = await HealthRecordService.getStudentAllergies(studentId);

    return h.response({
      success: true,
      data: { allergies }
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(500);
  }
};

// Get single allergy by ID
const getAllergyByIdHandler = async (request: any, h: any) => {
  try {
    const { id } = request.params;
    const allergy = await HealthRecordService.getAllergyById(id);

    return h.response({
      success: true,
      data: { allergy }
    });
  } catch (error) {
    const errorMessage = (error as Error).message;
    if (errorMessage.includes('not found')) {
      return h.response({
        success: false,
        error: { message: errorMessage }
      }).code(404);
    }

    return h.response({
      success: false,
      error: { message: errorMessage }
    }).code(500);
  }
};

// Add allergy to student
const addAllergyHandler = async (request: any, h: any) => {
  try {
    const allergy = await HealthRecordService.addAllergy(request.payload);

    return h.response({
      success: true,
      data: { allergy }
    }).code(201);
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(400);
  }
};

// Update allergy
const updateAllergyHandler = async (request: any, h: any) => {
  try {
    const { id } = request.params;
    const allergy = await HealthRecordService.updateAllergy(id, request.payload);

    return h.response({
      success: true,
      data: { allergy }
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(400);
  }
};

// Delete allergy
const deleteAllergyHandler = async (request: any, h: any) => {
  try {
    const { id } = request.params;
    await HealthRecordService.deleteAllergy(id);

    return h.response({
      success: true,
      message: 'Allergy deleted successfully'
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(400);
  }
};

// Verify allergy
const verifyAllergyHandler = async (request: any, h: any) => {
  try {
    const { id } = request.params;
    const verifiedBy = request.auth.credentials?.userId;
    const allergy = await HealthRecordService.verifyAllergy(id, verifiedBy);

    return h.response({
      success: true,
      data: { allergy }
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(400);
  }
};

// Get critical allergies for student
const getCriticalAllergiesHandler = async (request: any, h: any) => {
  try {
    const { studentId } = request.params;
    const allergies = await HealthRecordService.getCriticalAllergies(studentId);

    return h.response({
      success: true,
      data: { allergies }
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(500);
  }
};

// Check medication contraindications
const checkContraindicationsHandler = async (request: any, h: any) => {
  try {
    const { studentId, medicationId } = request.payload;
    const contraindications = await HealthRecordService.checkMedicationContraindications(studentId, medicationId);

    return h.response({
      success: true,
      data: { contraindications }
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(500);
  }
};

// ==========================================
// CHRONIC CONDITIONS SUB-MODULE HANDLERS
// ==========================================

// Get student chronic conditions
const getStudentChronicConditionsHandler = async (request: any, h: any) => {
  try {
    const { studentId } = request.params;
    const conditions = await HealthRecordService.getStudentChronicConditions(studentId);

    return h.response({
      success: true,
      data: { conditions }
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(500);
  }
};

// Get single chronic condition by ID
const getChronicConditionByIdHandler = async (request: any, h: any) => {
  try {
    const { id } = request.params;
    const condition = await HealthRecordService.getChronicConditionById(id);

    return h.response({
      success: true,
      data: { condition }
    });
  } catch (error) {
    const errorMessage = (error as Error).message;
    if (errorMessage.includes('not found')) {
      return h.response({
        success: false,
        error: { message: errorMessage }
      }).code(404);
    }

    return h.response({
      success: false,
      error: { message: errorMessage }
    }).code(500);
  }
};

// Add chronic condition to student
const addChronicConditionHandler = async (request: any, h: any) => {
  try {
    const condition = await HealthRecordService.addChronicCondition({
      ...request.payload,
      diagnosedDate: new Date(request.payload.diagnosedDate),
      lastReviewDate: request.payload.lastReviewDate ? new Date(request.payload.lastReviewDate) : undefined,
      nextReviewDate: request.payload.nextReviewDate ? new Date(request.payload.nextReviewDate) : undefined
    });

    return h.response({
      success: true,
      data: { condition }
    }).code(201);
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(400);
  }
};

// Update chronic condition
const updateChronicConditionHandler = async (request: any, h: any) => {
  try {
    const { id } = request.params;
    const updateData: any = { ...request.payload };

    if (updateData.diagnosedDate) {
      updateData.diagnosedDate = new Date(updateData.diagnosedDate);
    }
    if (updateData.lastReviewDate) {
      updateData.lastReviewDate = new Date(updateData.lastReviewDate);
    }
    if (updateData.nextReviewDate) {
      updateData.nextReviewDate = new Date(updateData.nextReviewDate);
    }

    const condition = await HealthRecordService.updateChronicCondition(id, updateData);

    return h.response({
      success: true,
      data: { condition }
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(400);
  }
};

// Delete chronic condition
const deleteChronicConditionHandler = async (request: any, h: any) => {
  try {
    const { id } = request.params;
    await HealthRecordService.deleteChronicCondition(id);

    return h.response({
      success: true,
      message: 'Chronic condition deleted successfully'
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(400);
  }
};

// Update chronic condition status
const updateChronicConditionStatusHandler = async (request: any, h: any) => {
  try {
    const { id } = request.params;
    const { status } = request.payload;
    const condition = await HealthRecordService.updateChronicConditionStatus(id, status);

    return h.response({
      success: true,
      data: { condition }
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(400);
  }
};

// Get chronic conditions due for review
const getConditionsDueForReviewHandler = async (request: any, h: any) => {
  try {
    const daysAhead = parseInt(request.query.daysAhead) || 30;
    const conditions = await HealthRecordService.getConditionsDueForReview(daysAhead);

    return h.response({
      success: true,
      data: { conditions }
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(500);
  }
};

// Get chronic conditions statistics
const getChronicConditionsStatsHandler = async (request: any, h: any) => {
  try {
    const schoolId = request.query.schoolId;
    const statistics = await HealthRecordService.getChronicConditionsStatistics(schoolId);

    return h.response({
      success: true,
      data: statistics
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(500);
  }
};

// ==========================================
// VACCINATIONS SUB-MODULE HANDLERS
// ==========================================

// Get vaccination records for student
const getVaccinationRecordsHandler = async (request: any, h: any) => {
  try {
    const { studentId } = request.params;
    const vaccinations = await HealthRecordService.getVaccinationRecords(studentId);

    return h.response({
      success: true,
      data: { vaccinations }
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(500);
  }
};

// Get single vaccination by ID
const getVaccinationByIdHandler = async (request: any, h: any) => {
  try {
    const { id } = request.params;
    const vaccination = await HealthRecordService.getVaccinationById(id);

    return h.response({
      success: true,
      data: { vaccination }
    });
  } catch (error) {
    const errorMessage = (error as Error).message;
    if (errorMessage.includes('not found')) {
      return h.response({
        success: false,
        error: { message: errorMessage }
      }).code(404);
    }

    return h.response({
      success: false,
      error: { message: errorMessage }
    }).code(500);
  }
};

// Create vaccination record
const createVaccinationHandler = async (request: any, h: any) => {
  try {
    const vaccination = await HealthRecordService.createVaccination({
      ...request.payload,
      administeredDate: new Date(request.payload.administeredDate),
      expirationDate: request.payload.expirationDate ? new Date(request.payload.expirationDate) : undefined
    });

    return h.response({
      success: true,
      data: { vaccination }
    }).code(201);
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(400);
  }
};

// Update vaccination record
const updateVaccinationHandler = async (request: any, h: any) => {
  try {
    const { id } = request.params;
    const updateData: any = { ...request.payload };

    if (updateData.administeredDate) {
      updateData.administeredDate = new Date(updateData.administeredDate);
    }
    if (updateData.expirationDate) {
      updateData.expirationDate = new Date(updateData.expirationDate);
    }

    const vaccination = await HealthRecordService.updateVaccination(id, updateData);

    return h.response({
      success: true,
      data: { vaccination }
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(400);
  }
};

// Delete vaccination record
const deleteVaccinationHandler = async (request: any, h: any) => {
  try {
    const { id } = request.params;
    await HealthRecordService.deleteVaccination(id);

    return h.response({
      success: true,
      message: 'Vaccination record deleted successfully'
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(400);
  }
};

// Check vaccination compliance
const checkVaccinationComplianceHandler = async (request: any, h: any) => {
  try {
    const { studentId } = request.params;
    const compliance = await HealthRecordService.checkVaccinationCompliance(studentId);

    return h.response({
      success: true,
      data: compliance
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(500);
  }
};

// Get upcoming vaccinations
const getUpcomingVaccinationsHandler = async (request: any, h: any) => {
  try {
    const { studentId } = request.params;
    const daysAhead = parseInt(request.query.daysAhead) || 90;
    const vaccinations = await HealthRecordService.getUpcomingVaccinations(studentId, daysAhead);

    return h.response({
      success: true,
      data: { vaccinations }
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(500);
  }
};

// Get vaccination report for student
const getVaccinationReportHandler = async (request: any, h: any) => {
  try {
    const { studentId } = request.params;
    const format = request.query.format || 'json';
    const report = await HealthRecordService.getVaccinationReport(studentId);

    if (format === 'pdf') {
      // TODO: Implement PDF generation
      return h.response({
        success: false,
        error: { message: 'PDF report generation not yet implemented' }
      }).code(501);
    }

    return h.response({
      success: true,
      data: report
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(500);
  }
};

// Get vaccination statistics for school
const getVaccinationStatsHandler = async (request: any, h: any) => {
  try {
    const { schoolId } = request.params;
    const statistics = await HealthRecordService.getVaccinationStatistics(schoolId);

    return h.response({
      success: true,
      data: statistics
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(500);
  }
};

// ==========================================
// SCREENINGS SUB-MODULE HANDLERS
// ==========================================

// Get screenings for student
const getStudentScreeningsHandler = async (request: any, h: any) => {
  try {
    const { studentId } = request.params;
    const type = request.query.type;
    const screenings = await HealthRecordService.getStudentScreenings(studentId, type);

    return h.response({
      success: true,
      data: { screenings }
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(500);
  }
};

// Get single screening by ID
const getScreeningByIdHandler = async (request: any, h: any) => {
  try {
    const { id } = request.params;
    const screening = await HealthRecordService.getScreeningById(id);

    return h.response({
      success: true,
      data: { screening }
    });
  } catch (error) {
    const errorMessage = (error as Error).message;
    if (errorMessage.includes('not found')) {
      return h.response({
        success: false,
        error: { message: errorMessage }
      }).code(404);
    }

    return h.response({
      success: false,
      error: { message: errorMessage }
    }).code(500);
  }
};

// Create screening record
const createScreeningHandler = async (request: any, h: any) => {
  try {
    const screening = await HealthRecordService.createScreening({
      ...request.payload,
      screeningDate: new Date(request.payload.screeningDate),
      followUpDate: request.payload.followUpDate ? new Date(request.payload.followUpDate) : undefined
    });

    return h.response({
      success: true,
      data: { screening }
    }).code(201);
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(400);
  }
};

// Update screening record
const updateScreeningHandler = async (request: any, h: any) => {
  try {
    const { id } = request.params;
    const updateData: any = { ...request.payload };

    if (updateData.screeningDate) {
      updateData.screeningDate = new Date(updateData.screeningDate);
    }
    if (updateData.followUpDate) {
      updateData.followUpDate = new Date(updateData.followUpDate);
    }

    const screening = await HealthRecordService.updateScreening(id, updateData);

    return h.response({
      success: true,
      data: { screening }
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(400);
  }
};

// Delete screening record
const deleteScreeningHandler = async (request: any, h: any) => {
  try {
    const { id } = request.params;
    await HealthRecordService.deleteScreening(id);

    return h.response({
      success: true,
      message: 'Screening record deleted successfully'
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(400);
  }
};

// Get screenings due for follow-up
const getScreeningsDueHandler = async (request: any, h: any) => {
  try {
    const daysAhead = parseInt(request.query.daysAhead) || 30;
    const schoolId = request.query.schoolId;
    const screenings = await HealthRecordService.getScreeningsDue(daysAhead, schoolId);

    return h.response({
      success: true,
      data: { screenings }
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(500);
  }
};

// Get screening statistics
const getScreeningStatsHandler = async (request: any, h: any) => {
  try {
    const schoolId = request.query.schoolId;
    const statistics = await HealthRecordService.getScreeningStatistics(schoolId);

    return h.response({
      success: true,
      data: statistics
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(500);
  }
};

// ==========================================
// GROWTH MEASUREMENTS SUB-MODULE HANDLERS
// ==========================================

// Get growth measurements for student
const getGrowthMeasurementsHandler = async (request: any, h: any) => {
  try {
    const { studentId } = request.params;
    const measurements = await HealthRecordService.getGrowthChartData(studentId);

    return h.response({
      success: true,
      data: { measurements }
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(500);
  }
};

// Get single growth measurement by ID
const getGrowthMeasurementByIdHandler = async (request: any, h: any) => {
  try {
    const { id } = request.params;
    const measurement = await HealthRecordService.getGrowthMeasurementById(id);

    return h.response({
      success: true,
      data: { measurement }
    });
  } catch (error) {
    const errorMessage = (error as Error).message;
    if (errorMessage.includes('not found')) {
      return h.response({
        success: false,
        error: { message: errorMessage }
      }).code(404);
    }

    return h.response({
      success: false,
      error: { message: errorMessage }
    }).code(500);
  }
};

// Create growth measurement
const createGrowthMeasurementHandler = async (request: any, h: any) => {
  try {
    const measurement = await HealthRecordService.createGrowthMeasurement({
      ...request.payload,
      measurementDate: new Date(request.payload.measurementDate)
    });

    return h.response({
      success: true,
      data: { measurement }
    }).code(201);
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(400);
  }
};

// Update growth measurement
const updateGrowthMeasurementHandler = async (request: any, h: any) => {
  try {
    const { id } = request.params;
    const updateData: any = { ...request.payload };

    if (updateData.measurementDate) {
      updateData.measurementDate = new Date(updateData.measurementDate);
    }

    const measurement = await HealthRecordService.updateGrowthMeasurement(id, updateData);

    return h.response({
      success: true,
      data: { measurement }
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(400);
  }
};

// Delete growth measurement
const deleteGrowthMeasurementHandler = async (request: any, h: any) => {
  try {
    const { id } = request.params;
    await HealthRecordService.deleteGrowthMeasurement(id);

    return h.response({
      success: true,
      message: 'Growth measurement deleted successfully'
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(400);
  }
};

// Get growth trends for student
const getGrowthTrendsHandler = async (request: any, h: any) => {
  try {
    const { studentId } = request.params;
    const startDate = request.query.startDate ? new Date(request.query.startDate) : undefined;
    const endDate = request.query.endDate ? new Date(request.query.endDate) : undefined;
    const trends = await HealthRecordService.getGrowthTrends(studentId, startDate, endDate);

    return h.response({
      success: true,
      data: trends
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(500);
  }
};

// Get growth concerns for student
const getGrowthConcernsHandler = async (request: any, h: any) => {
  try {
    const { studentId } = request.params;
    const concerns = await HealthRecordService.getGrowthConcerns(studentId);

    return h.response({
      success: true,
      data: { concerns }
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(500);
  }
};

// ==========================================
// VITAL SIGNS SUB-MODULE HANDLERS
// ==========================================

// Get vital signs for student
const getVitalSignsHandler = async (request: any, h: any) => {
  try {
    const { studentId } = request.params;
    const limit = parseInt(request.query.limit) || 10;
    const vitals = await HealthRecordService.getRecentVitals(studentId, limit);

    return h.response({
      success: true,
      data: { vitals }
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(500);
  }
};

// Get single vital signs record by ID
const getVitalSignsByIdHandler = async (request: any, h: any) => {
  try {
    const { id } = request.params;
    const vitals = await HealthRecordService.getVitalSignsById(id);

    return h.response({
      success: true,
      data: { vitals }
    });
  } catch (error) {
    const errorMessage = (error as Error).message;
    if (errorMessage.includes('not found')) {
      return h.response({
        success: false,
        error: { message: errorMessage }
      }).code(404);
    }

    return h.response({
      success: false,
      error: { message: errorMessage }
    }).code(500);
  }
};

// Create vital signs record
const createVitalSignsHandler = async (request: any, h: any) => {
  try {
    const vitals = await HealthRecordService.createVitalSigns({
      ...request.payload,
      recordedAt: new Date(request.payload.recordedAt)
    });

    return h.response({
      success: true,
      data: { vitals }
    }).code(201);
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(400);
  }
};

// Get latest vital signs for student
const getLatestVitalsHandler = async (request: any, h: any) => {
  try {
    const { studentId } = request.params;
    const vitals = await HealthRecordService.getLatestVitals(studentId);

    return h.response({
      success: true,
      data: { vitals }
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(500);
  }
};

// Get vital signs trends
const getVitalTrendsHandler = async (request: any, h: any) => {
  try {
    const { studentId } = request.params;
    const startDate = request.query.startDate ? new Date(request.query.startDate) : undefined;
    const endDate = request.query.endDate ? new Date(request.query.endDate) : undefined;
    const trends = await HealthRecordService.getVitalTrends(studentId, startDate, endDate);

    return h.response({
      success: true,
      data: trends
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(500);
  }
};

// ==========================================
// SEARCH AND UTILITY HANDLERS
// ==========================================

// Search health records
const searchHealthRecordsHandler = async (request: any, h: any) => {
  try {
    const query = request.query.q;
    const type = request.query.type;
    const page = parseInt(request.query.page) || 1;
    const limit = parseInt(request.query.limit) || 20;

    if (!query) {
      return h.response({
        success: false,
        error: { message: 'Search query is required' }
      }).code(400);
    }

    const result = await HealthRecordService.searchHealthRecords(query, type, page, limit);

    return h.response({
      success: true,
      data: result
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(500);
  }
};

// Bulk delete health records
const bulkDeleteHealthRecordsHandler = async (request: any, h: any) => {
  try {
    const user = request.auth.credentials;

    // Check user permissions - only admin and nurse roles can bulk delete
    if (!user || !['ADMIN', 'NURSE'].includes(user.role)) {
      return h.response({
        success: false,
        error: 'Insufficient permissions'
      }).code(403);
    }

    const { recordIds } = request.payload;
    const results = await HealthRecordService.bulkDeleteHealthRecords(recordIds);

    return h.response({
      success: true,
      data: results
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(500);
  }
};

// Import health records
const importHealthRecordsHandler = async (request: any, h: any) => {
  try {
    const { studentId } = request.params;
    const importData = request.payload;

    if (!importData || typeof importData !== 'object') {
      return h.response({
        success: false,
        error: { message: 'Invalid import data' }
      }).code(400);
    }

    const results = await HealthRecordService.importHealthRecords(studentId, importData);

    return h.response({
      success: true,
      data: results
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(400);
  }
};

// ==========================================
// ROUTE DEFINITIONS
// ==========================================

export const healthRecordRoutes: ServerRoute[] = [
  // ==========================================
  // MAIN HEALTH RECORDS ROUTES
  // ==========================================
  {
    method: 'GET',
    path: '/api/health-records/student/{studentId}',
    handler: getStudentHealthRecordsHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'Health Records'],
      description: 'List all health records for a student',
      notes: '**HIGHLY SENSITIVE PHI ENDPOINT** - Returns all health records for a student with filtering and pagination. All access is logged and audited.',
      validate: {
        params: Joi.object({
          studentId: Joi.string().required().description('Student ID')
        }),
        query: Joi.object({
          page: Joi.number().integer().min(1).default(1).description('Page number'),
          limit: Joi.number().integer().min(1).max(100).default(20).description('Records per page'),
          type: Joi.string().valid('CHECKUP', 'VACCINATION', 'ILLNESS', 'INJURY', 'SCREENING', 'PHYSICAL_EXAM', 'MENTAL_HEALTH', 'DENTAL', 'VISION', 'HEARING').optional().description('Filter by record type'),
          dateFrom: Joi.date().iso().optional().description('Filter from date (ISO 8601)'),
          dateTo: Joi.date().iso().optional().description('Filter to date (ISO 8601)'),
          provider: Joi.string().optional().description('Filter by healthcare provider')
        })
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': { description: 'Health records retrieved successfully' },
            '401': { description: 'Authentication required' },
            '403': { description: 'Insufficient permissions' },
            '500': { description: 'Internal server error' }
          },
          security: [{ jwt: [] }]
        }
      }
    }
  },
  {
    method: 'GET',
    path: '/api/health-records/{id}',
    handler: getHealthRecordByIdHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'Health Records'],
      description: 'Get single health record by ID',
      notes: '**PHI PROTECTED ENDPOINT** - Retrieves a specific health record. Access is logged.',
      validate: {
        params: Joi.object({
          id: Joi.string().required().description('Health record ID')
        })
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': { description: 'Health record retrieved successfully' },
            '404': { description: 'Health record not found' },
            '401': { description: 'Authentication required' },
            '500': { description: 'Internal server error' }
          },
          security: [{ jwt: [] }]
        }
      }
    }
  },
  {
    method: 'POST',
    path: '/api/health-records',
    handler: createHealthRecordHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'Health Records'],
      description: 'Create new health record',
      notes: '**PHI PROTECTED ENDPOINT** - Creates a new health record. Requires NURSE or ADMIN role. All creations are audited.',
      validate: {
        payload: Joi.object({
          studentId: Joi.string().required().description('Student ID'),
          type: Joi.string().valid('CHECKUP', 'VACCINATION', 'ILLNESS', 'INJURY', 'SCREENING', 'PHYSICAL_EXAM', 'MENTAL_HEALTH', 'DENTAL', 'VISION', 'HEARING').required().description('Type of health record'),
          date: Joi.date().iso().required().description('Date of record (ISO 8601)'),
          description: Joi.string().trim().required().description('Record description'),
          provider: Joi.string().trim().optional().description('Healthcare provider name'),
          notes: Joi.string().optional().description('Additional notes'),
          attachments: Joi.array().items(Joi.string()).optional().description('Attachment IDs')
        })
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '201': { description: 'Health record created successfully' },
            '400': { description: 'Invalid input data' },
            '401': { description: 'Authentication required' },
            '403': { description: 'Insufficient permissions' }
          },
          security: [{ jwt: [] }]
        }
      }
    }
  },
  {
    method: 'PUT',
    path: '/api/health-records/{id}',
    handler: updateHealthRecordHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'Health Records'],
      description: 'Update health record',
      notes: '**PHI PROTECTED ENDPOINT** - Updates an existing health record. All modifications are audited.',
      validate: {
        params: Joi.object({
          id: Joi.string().required().description('Health record ID')
        }),
        payload: Joi.object({
          type: Joi.string().valid('CHECKUP', 'VACCINATION', 'ILLNESS', 'INJURY', 'SCREENING', 'PHYSICAL_EXAM', 'MENTAL_HEALTH', 'DENTAL', 'VISION', 'HEARING').optional(),
          date: Joi.date().iso().optional(),
          description: Joi.string().trim().optional(),
          provider: Joi.string().trim().optional(),
          notes: Joi.string().optional(),
          attachments: Joi.array().items(Joi.string()).optional()
        })
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': { description: 'Health record updated successfully' },
            '400': { description: 'Invalid input data' },
            '401': { description: 'Authentication required' },
            '404': { description: 'Health record not found' }
          },
          security: [{ jwt: [] }]
        }
      }
    }
  },
  {
    method: 'DELETE',
    path: '/api/health-records/{id}',
    handler: deleteHealthRecordHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'Health Records'],
      description: 'Delete health record',
      notes: '**PHI PROTECTED ENDPOINT** - Soft deletes a health record. Requires ADMIN or NURSE role. All deletions are audited.',
      validate: {
        params: Joi.object({
          id: Joi.string().required().description('Health record ID')
        })
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': { description: 'Health record deleted successfully' },
            '400': { description: 'Delete operation failed' },
            '401': { description: 'Authentication required' },
            '403': { description: 'Insufficient permissions' }
          },
          security: [{ jwt: [] }]
        }
      }
    }
  },
  {
    method: 'GET',
    path: '/api/health-records/student/{studentId}/timeline',
    handler: getHealthTimelineHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'Health Records'],
      description: 'Get health record timeline for student',
      notes: '**PHI PROTECTED ENDPOINT** - Returns chronological timeline of all health events for a student.',
      validate: {
        params: Joi.object({
          studentId: Joi.string().required().description('Student ID')
        }),
        query: Joi.object({
          startDate: Joi.date().iso().optional().description('Timeline start date'),
          endDate: Joi.date().iso().optional().description('Timeline end date')
        })
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': { description: 'Timeline retrieved successfully' },
            '401': { description: 'Authentication required' },
            '500': { description: 'Internal server error' }
          },
          security: [{ jwt: [] }]
        }
      }
    }
  },
  {
    method: 'GET',
    path: '/api/health-records/student/{studentId}/summary',
    handler: getHealthSummaryHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'Health Records'],
      description: 'Get comprehensive health summary for student',
      notes: '**PHI PROTECTED ENDPOINT** - Returns comprehensive health summary including allergies, conditions, vaccinations, and recent visits.',
      validate: {
        params: Joi.object({
          studentId: Joi.string().required().description('Student ID')
        })
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': { description: 'Health summary retrieved successfully' },
            '401': { description: 'Authentication required' },
            '500': { description: 'Internal server error' }
          },
          security: [{ jwt: [] }]
        }
      }
    }
  },
  {
    method: 'GET',
    path: '/api/health-records/student/{studentId}/export',
    handler: exportHealthRecordsHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'Health Records'],
      description: 'Export student health records',
      notes: '**PHI PROTECTED ENDPOINT** - Exports complete health record. Rate limited. All exports are audited.',
      validate: {
        params: Joi.object({
          studentId: Joi.string().required().description('Student ID')
        }),
        query: Joi.object({
          format: Joi.string().valid('json', 'pdf').default('json').description('Export format')
        })
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': { description: 'Export completed successfully' },
            '401': { description: 'Authentication required' },
            '501': { description: 'Format not yet implemented' },
            '500': { description: 'Internal server error' }
          },
          security: [{ jwt: [] }]
        }
      }
    }
  },
  {
    method: 'GET',
    path: '/api/health-records/statistics',
    handler: getHealthRecordStatisticsHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'Health Records'],
      description: 'Get health records statistics',
      notes: 'Returns overall statistics including total records, active allergies, chronic conditions, and vaccinations due. **PHI Protected Endpoint**',
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': { description: 'Statistics retrieved successfully' },
            '401': { description: 'Authentication required' },
            '500': { description: 'Internal server error' }
          },
          security: [{ jwt: [] }]
        }
      }
    }
  },

  // ==========================================
  // ALLERGIES SUB-ROUTES
  // ==========================================
  {
    method: 'GET',
    path: '/api/health-records/allergies/student/{studentId}',
    handler: getStudentAllergiesHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'Health Records', 'Allergies'],
      description: 'List all allergies for a student',
      notes: '**HIGHLY SENSITIVE PHI ENDPOINT** - Returns all documented allergies for a student. Critical for medication safety.',
      validate: {
        params: Joi.object({
          studentId: Joi.string().required().description('Student ID')
        })
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': { description: 'Allergies retrieved successfully' },
            '401': { description: 'Authentication required' },
            '500': { description: 'Internal server error' }
          },
          security: [{ jwt: [] }]
        }
      }
    }
  },
  {
    method: 'GET',
    path: '/api/health-records/allergies/{id}',
    handler: getAllergyByIdHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'Health Records', 'Allergies'],
      description: 'Get single allergy record',
      notes: '**PHI PROTECTED ENDPOINT** - Retrieves details of a specific allergy.',
      validate: {
        params: Joi.object({
          id: Joi.string().required().description('Allergy ID')
        })
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': { description: 'Allergy retrieved successfully' },
            '404': { description: 'Allergy not found' },
            '401': { description: 'Authentication required' }
          },
          security: [{ jwt: [] }]
        }
      }
    }
  },
  {
    method: 'POST',
    path: '/api/health-records/allergies',
    handler: addAllergyHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'Health Records', 'Allergies'],
      description: 'Create allergy record',
      notes: '**HIGHLY SENSITIVE PHI ENDPOINT** - Documents a new allergy. Triggers medication contraindication checks. Requires NURSE or ADMIN role.',
      validate: {
        payload: Joi.object({
          studentId: Joi.string().required().description('Student ID'),
          allergen: Joi.string().trim().required().description('Allergen name'),
          allergyType: Joi.string().valid('FOOD', 'MEDICATION', 'ENVIRONMENTAL', 'INSECT', 'OTHER').required().description('Type of allergy'),
          severity: Joi.string().valid('MILD', 'MODERATE', 'SEVERE', 'LIFE_THREATENING').required().description('Severity level'),
          reaction: Joi.string().trim().required().description('Reaction symptoms'),
          verified: Joi.boolean().default(false).description('Medical verification status'),
          notes: Joi.string().optional().description('Additional notes')
        })
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '201': { description: 'Allergy created successfully' },
            '400': { description: 'Invalid input data' },
            '401': { description: 'Authentication required' }
          },
          security: [{ jwt: [] }]
        }
      }
    }
  },
  {
    method: 'PUT',
    path: '/api/health-records/allergies/{id}',
    handler: updateAllergyHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'Health Records', 'Allergies'],
      description: 'Update allergy record',
      notes: '**PHI PROTECTED ENDPOINT** - Updates allergy information. All changes are audited.',
      validate: {
        params: Joi.object({
          id: Joi.string().required().description('Allergy ID')
        }),
        payload: Joi.object({
          allergen: Joi.string().trim().optional(),
          allergyType: Joi.string().valid('FOOD', 'MEDICATION', 'ENVIRONMENTAL', 'INSECT', 'OTHER').optional(),
          severity: Joi.string().valid('MILD', 'MODERATE', 'SEVERE', 'LIFE_THREATENING').optional(),
          reaction: Joi.string().trim().optional(),
          verified: Joi.boolean().optional(),
          notes: Joi.string().optional()
        })
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': { description: 'Allergy updated successfully' },
            '400': { description: 'Invalid input data' },
            '404': { description: 'Allergy not found' }
          },
          security: [{ jwt: [] }]
        }
      }
    }
  },
  {
    method: 'DELETE',
    path: '/api/health-records/allergies/{id}',
    handler: deleteAllergyHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'Health Records', 'Allergies'],
      description: 'Delete allergy record',
      notes: '**PHI PROTECTED ENDPOINT** - Removes allergy record. Requires ADMIN or NURSE role. All deletions are audited.',
      validate: {
        params: Joi.object({
          id: Joi.string().required().description('Allergy ID')
        })
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': { description: 'Allergy deleted successfully' },
            '400': { description: 'Delete operation failed' },
            '401': { description: 'Authentication required' }
          },
          security: [{ jwt: [] }]
        }
      }
    }
  },
  {
    method: 'POST',
    path: '/api/health-records/allergies/{id}/verify',
    handler: verifyAllergyHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'Health Records', 'Allergies'],
      description: 'Verify allergy with medical documentation',
      notes: '**PHI PROTECTED ENDPOINT** - Marks an allergy as medically verified. Requires NURSE or ADMIN role.',
      validate: {
        params: Joi.object({
          id: Joi.string().required().description('Allergy ID')
        })
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': { description: 'Allergy verified successfully' },
            '400': { description: 'Verification failed' },
            '401': { description: 'Authentication required' }
          },
          security: [{ jwt: [] }]
        }
      }
    }
  },
  {
    method: 'GET',
    path: '/api/health-records/allergies/student/{studentId}/critical',
    handler: getCriticalAllergiesHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'Health Records', 'Allergies'],
      description: 'Get life-threatening allergies only',
      notes: '**CRITICAL PHI ENDPOINT** - Returns only SEVERE and LIFE_THREATENING allergies. Used for emergency response.',
      validate: {
        params: Joi.object({
          studentId: Joi.string().required().description('Student ID')
        })
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': { description: 'Critical allergies retrieved successfully' },
            '401': { description: 'Authentication required' },
            '500': { description: 'Internal server error' }
          },
          security: [{ jwt: [] }]
        }
      }
    }
  },
  {
    method: 'POST',
    path: '/api/health-records/allergies/check-contraindications',
    handler: checkContraindicationsHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'Health Records', 'Allergies'],
      description: 'Check medication contraindications against allergies',
      notes: '**CRITICAL SAFETY ENDPOINT** - Checks if a medication conflicts with documented allergies. Must be called before administering new medications.',
      validate: {
        payload: Joi.object({
          studentId: Joi.string().required().description('Student ID'),
          medicationId: Joi.string().required().description('Medication ID to check')
        })
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': { description: 'Contraindication check completed' },
            '400': { description: 'Invalid input' },
            '401': { description: 'Authentication required' }
          },
          security: [{ jwt: [] }]
        }
      }
    }
  },

  // ==========================================
  // CHRONIC CONDITIONS SUB-ROUTES
  // ==========================================
  {
    method: 'GET',
    path: '/api/health-records/chronic-conditions/student/{studentId}',
    handler: getStudentChronicConditionsHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'Health Records', 'Chronic Conditions'],
      description: 'List chronic conditions for a student',
      notes: '**PHI PROTECTED ENDPOINT** - Returns all documented chronic conditions for ongoing health management.',
      validate: {
        params: Joi.object({
          studentId: Joi.string().required().description('Student ID')
        })
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': { description: 'Chronic conditions retrieved successfully' },
            '401': { description: 'Authentication required' },
            '500': { description: 'Internal server error' }
          },
          security: [{ jwt: [] }]
        }
      }
    }
  },
  {
    method: 'GET',
    path: '/api/health-records/chronic-conditions/{id}',
    handler: getChronicConditionByIdHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'Health Records', 'Chronic Conditions'],
      description: 'Get single chronic condition',
      notes: '**PHI PROTECTED ENDPOINT** - Retrieves detailed information about a specific chronic condition.',
      validate: {
        params: Joi.object({
          id: Joi.string().required().description('Chronic condition ID')
        })
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': { description: 'Chronic condition retrieved successfully' },
            '404': { description: 'Chronic condition not found' },
            '401': { description: 'Authentication required' }
          },
          security: [{ jwt: [] }]
        }
      }
    }
  },
  {
    method: 'POST',
    path: '/api/health-records/chronic-conditions',
    handler: addChronicConditionHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'Health Records', 'Chronic Conditions'],
      description: 'Create chronic condition record',
      notes: '**PHI PROTECTED ENDPOINT** - Documents a new chronic condition. Requires NURSE or ADMIN role.',
      validate: {
        payload: Joi.object({
          studentId: Joi.string().required().description('Student ID'),
          condition: Joi.string().trim().required().description('Condition name'),
          diagnosedDate: Joi.date().iso().required().description('Diagnosis date (ISO 8601)'),
          status: Joi.string().valid('ACTIVE', 'MANAGED', 'RESOLVED', 'MONITORING').default('ACTIVE').description('Current status'),
          severity: Joi.string().valid('MILD', 'MODERATE', 'SEVERE').optional().description('Severity level'),
          managementPlan: Joi.string().optional().description('Care management plan'),
          lastReviewDate: Joi.date().iso().optional().description('Last review date'),
          nextReviewDate: Joi.date().iso().optional().description('Next scheduled review'),
          notes: Joi.string().optional().description('Additional notes')
        })
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '201': { description: 'Chronic condition created successfully' },
            '400': { description: 'Invalid input data' },
            '401': { description: 'Authentication required' }
          },
          security: [{ jwt: [] }]
        }
      }
    }
  },
  {
    method: 'PUT',
    path: '/api/health-records/chronic-conditions/{id}',
    handler: updateChronicConditionHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'Health Records', 'Chronic Conditions'],
      description: 'Update chronic condition',
      notes: '**PHI PROTECTED ENDPOINT** - Updates chronic condition information. All changes are audited.',
      validate: {
        params: Joi.object({
          id: Joi.string().required().description('Chronic condition ID')
        }),
        payload: Joi.object({
          condition: Joi.string().trim().optional(),
          diagnosedDate: Joi.date().iso().optional(),
          status: Joi.string().valid('ACTIVE', 'MANAGED', 'RESOLVED', 'MONITORING').optional(),
          severity: Joi.string().valid('MILD', 'MODERATE', 'SEVERE').optional(),
          managementPlan: Joi.string().optional(),
          lastReviewDate: Joi.date().iso().optional(),
          nextReviewDate: Joi.date().iso().optional(),
          notes: Joi.string().optional()
        })
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': { description: 'Chronic condition updated successfully' },
            '400': { description: 'Invalid input data' },
            '404': { description: 'Chronic condition not found' }
          },
          security: [{ jwt: [] }]
        }
      }
    }
  },
  {
    method: 'DELETE',
    path: '/api/health-records/chronic-conditions/{id}',
    handler: deleteChronicConditionHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'Health Records', 'Chronic Conditions'],
      description: 'Delete chronic condition record',
      notes: '**PHI PROTECTED ENDPOINT** - Removes chronic condition record. Requires ADMIN or NURSE role.',
      validate: {
        params: Joi.object({
          id: Joi.string().required().description('Chronic condition ID')
        })
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': { description: 'Chronic condition deleted successfully' },
            '400': { description: 'Delete operation failed' },
            '401': { description: 'Authentication required' }
          },
          security: [{ jwt: [] }]
        }
      }
    }
  },
  {
    method: 'PUT',
    path: '/api/health-records/chronic-conditions/{id}/status',
    handler: updateChronicConditionStatusHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'Health Records', 'Chronic Conditions'],
      description: 'Update chronic condition status',
      notes: '**PHI PROTECTED ENDPOINT** - Updates the status of a chronic condition (e.g., ACTIVE to RESOLVED).',
      validate: {
        params: Joi.object({
          id: Joi.string().required().description('Chronic condition ID')
        }),
        payload: Joi.object({
          status: Joi.string().valid('ACTIVE', 'MANAGED', 'RESOLVED', 'MONITORING').required().description('New status')
        })
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': { description: 'Status updated successfully' },
            '400': { description: 'Invalid status' },
            '404': { description: 'Chronic condition not found' }
          },
          security: [{ jwt: [] }]
        }
      }
    }
  },
  {
    method: 'GET',
    path: '/api/health-records/chronic-conditions/review-due',
    handler: getConditionsDueForReviewHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'Health Records', 'Chronic Conditions'],
      description: 'Get conditions needing review',
      notes: '**PHI PROTECTED ENDPOINT** - Returns chronic conditions that are due or overdue for review.',
      validate: {
        query: Joi.object({
          daysAhead: Joi.number().integer().min(1).max(365).default(30).description('Look ahead days')
        })
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': { description: 'Review due conditions retrieved successfully' },
            '401': { description: 'Authentication required' },
            '500': { description: 'Internal server error' }
          },
          security: [{ jwt: [] }]
        }
      }
    }
  },
  {
    method: 'GET',
    path: '/api/health-records/chronic-conditions/statistics',
    handler: getChronicConditionsStatsHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'Health Records', 'Chronic Conditions'],
      description: 'Get chronic conditions statistics',
      notes: 'Returns statistics on chronic conditions by type, severity, and status.',
      validate: {
        query: Joi.object({
          schoolId: Joi.string().optional().description('Filter by school ID')
        })
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': { description: 'Statistics retrieved successfully' },
            '401': { description: 'Authentication required' },
            '500': { description: 'Internal server error' }
          },
          security: [{ jwt: [] }]
        }
      }
    }
  },

  // ==========================================
  // VACCINATIONS SUB-ROUTES
  // ==========================================
  {
    method: 'GET',
    path: '/api/health-records/vaccinations/student/{studentId}',
    handler: getVaccinationRecordsHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'Health Records', 'Vaccinations'],
      description: 'List vaccination records for student',
      notes: '**PHI PROTECTED ENDPOINT** - Returns complete vaccination history for compliance tracking.',
      validate: {
        params: Joi.object({
          studentId: Joi.string().required().description('Student ID')
        })
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': { description: 'Vaccination records retrieved successfully' },
            '401': { description: 'Authentication required' },
            '500': { description: 'Internal server error' }
          },
          security: [{ jwt: [] }]
        }
      }
    }
  },
  {
    method: 'GET',
    path: '/api/health-records/vaccinations/{id}',
    handler: getVaccinationByIdHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'Health Records', 'Vaccinations'],
      description: 'Get single vaccination record',
      notes: '**PHI PROTECTED ENDPOINT** - Retrieves details of a specific vaccination.',
      validate: {
        params: Joi.object({
          id: Joi.string().required().description('Vaccination ID')
        })
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': { description: 'Vaccination retrieved successfully' },
            '404': { description: 'Vaccination not found' },
            '401': { description: 'Authentication required' }
          },
          security: [{ jwt: [] }]
        }
      }
    }
  },
  {
    method: 'POST',
    path: '/api/health-records/vaccinations',
    handler: createVaccinationHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'Health Records', 'Vaccinations'],
      description: 'Create vaccination record',
      notes: '**PHI PROTECTED ENDPOINT** - Documents a vaccination. Requires NURSE or ADMIN role.',
      validate: {
        payload: Joi.object({
          studentId: Joi.string().required().description('Student ID'),
          vaccineName: Joi.string().trim().required().description('Vaccine name'),
          vaccineType: Joi.string().trim().optional().description('Vaccine type/category'),
          administeredDate: Joi.date().iso().required().description('Administration date (ISO 8601)'),
          dose: Joi.string().trim().optional().description('Dose information'),
          lotNumber: Joi.string().trim().optional().description('Vaccine lot number'),
          manufacturer: Joi.string().trim().optional().description('Manufacturer name'),
          expirationDate: Joi.date().iso().optional().description('Vaccine expiration date'),
          administeredBy: Joi.string().trim().optional().description('Who administered'),
          site: Joi.string().trim().optional().description('Injection site'),
          notes: Joi.string().optional().description('Additional notes')
        })
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '201': { description: 'Vaccination created successfully' },
            '400': { description: 'Invalid input data' },
            '401': { description: 'Authentication required' }
          },
          security: [{ jwt: [] }]
        }
      }
    }
  },
  {
    method: 'PUT',
    path: '/api/health-records/vaccinations/{id}',
    handler: updateVaccinationHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'Health Records', 'Vaccinations'],
      description: 'Update vaccination record',
      notes: '**PHI PROTECTED ENDPOINT** - Updates vaccination information. All changes are audited.',
      validate: {
        params: Joi.object({
          id: Joi.string().required().description('Vaccination ID')
        }),
        payload: Joi.object({
          vaccineName: Joi.string().trim().optional(),
          vaccineType: Joi.string().trim().optional(),
          administeredDate: Joi.date().iso().optional(),
          dose: Joi.string().trim().optional(),
          lotNumber: Joi.string().trim().optional(),
          manufacturer: Joi.string().trim().optional(),
          expirationDate: Joi.date().iso().optional(),
          administeredBy: Joi.string().trim().optional(),
          site: Joi.string().trim().optional(),
          notes: Joi.string().optional()
        })
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': { description: 'Vaccination updated successfully' },
            '400': { description: 'Invalid input data' },
            '404': { description: 'Vaccination not found' }
          },
          security: [{ jwt: [] }]
        }
      }
    }
  },
  {
    method: 'DELETE',
    path: '/api/health-records/vaccinations/{id}',
    handler: deleteVaccinationHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'Health Records', 'Vaccinations'],
      description: 'Delete vaccination record',
      notes: '**PHI PROTECTED ENDPOINT** - Removes vaccination record. Requires ADMIN or NURSE role.',
      validate: {
        params: Joi.object({
          id: Joi.string().required().description('Vaccination ID')
        })
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': { description: 'Vaccination deleted successfully' },
            '400': { description: 'Delete operation failed' },
            '401': { description: 'Authentication required' }
          },
          security: [{ jwt: [] }]
        }
      }
    }
  },
  {
    method: 'GET',
    path: '/api/health-records/vaccinations/student/{studentId}/compliance',
    handler: checkVaccinationComplianceHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'Health Records', 'Vaccinations'],
      description: 'Check vaccination compliance status',
      notes: '**PHI PROTECTED ENDPOINT** - Checks if student meets vaccination requirements for school enrollment.',
      validate: {
        params: Joi.object({
          studentId: Joi.string().required().description('Student ID')
        })
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': { description: 'Compliance check completed' },
            '401': { description: 'Authentication required' },
            '500': { description: 'Internal server error' }
          },
          security: [{ jwt: [] }]
        }
      }
    }
  },
  {
    method: 'GET',
    path: '/api/health-records/vaccinations/student/{studentId}/upcoming',
    handler: getUpcomingVaccinationsHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'Health Records', 'Vaccinations'],
      description: 'Get upcoming/due vaccinations',
      notes: '**PHI PROTECTED ENDPOINT** - Returns vaccinations that are due or upcoming for a student.',
      validate: {
        params: Joi.object({
          studentId: Joi.string().required().description('Student ID')
        }),
        query: Joi.object({
          daysAhead: Joi.number().integer().min(1).max(365).default(90).description('Look ahead days')
        })
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': { description: 'Upcoming vaccinations retrieved successfully' },
            '401': { description: 'Authentication required' },
            '500': { description: 'Internal server error' }
          },
          security: [{ jwt: [] }]
        }
      }
    }
  },
  {
    method: 'GET',
    path: '/api/health-records/vaccinations/student/{studentId}/report',
    handler: getVaccinationReportHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'Health Records', 'Vaccinations'],
      description: 'Get official vaccination report',
      notes: '**PHI PROTECTED ENDPOINT** - Generates official vaccination report for school compliance or transfer.',
      validate: {
        params: Joi.object({
          studentId: Joi.string().required().description('Student ID')
        }),
        query: Joi.object({
          format: Joi.string().valid('json', 'pdf').default('json').description('Report format')
        })
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': { description: 'Report generated successfully' },
            '401': { description: 'Authentication required' },
            '501': { description: 'Format not yet implemented' },
            '500': { description: 'Internal server error' }
          },
          security: [{ jwt: [] }]
        }
      }
    }
  },
  {
    method: 'GET',
    path: '/api/health-records/vaccinations/school/{schoolId}/statistics',
    handler: getVaccinationStatsHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'Health Records', 'Vaccinations'],
      description: 'Get vaccination statistics for school',
      notes: 'Returns vaccination compliance statistics, coverage rates, and trends for a school.',
      validate: {
        params: Joi.object({
          schoolId: Joi.string().required().description('School ID')
        })
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': { description: 'Statistics retrieved successfully' },
            '401': { description: 'Authentication required' },
            '500': { description: 'Internal server error' }
          },
          security: [{ jwt: [] }]
        }
      }
    }
  },

  // ==========================================
  // SCREENINGS SUB-ROUTES
  // ==========================================
  {
    method: 'GET',
    path: '/api/health-records/screenings/student/{studentId}',
    handler: getStudentScreeningsHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'Health Records', 'Screenings'],
      description: 'List screening records for student',
      notes: '**PHI PROTECTED ENDPOINT** - Returns health screening history (vision, hearing, dental, etc.).',
      validate: {
        params: Joi.object({
          studentId: Joi.string().required().description('Student ID')
        }),
        query: Joi.object({
          type: Joi.string().valid('VISION', 'HEARING', 'DENTAL', 'SCOLIOSIS', 'BMI', 'DEVELOPMENTAL').optional().description('Filter by screening type')
        })
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': { description: 'Screenings retrieved successfully' },
            '401': { description: 'Authentication required' },
            '500': { description: 'Internal server error' }
          },
          security: [{ jwt: [] }]
        }
      }
    }
  },
  {
    method: 'GET',
    path: '/api/health-records/screenings/{id}',
    handler: getScreeningByIdHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'Health Records', 'Screenings'],
      description: 'Get single screening record',
      notes: '**PHI PROTECTED ENDPOINT** - Retrieves details of a specific screening.',
      validate: {
        params: Joi.object({
          id: Joi.string().required().description('Screening ID')
        })
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': { description: 'Screening retrieved successfully' },
            '404': { description: 'Screening not found' },
            '401': { description: 'Authentication required' }
          },
          security: [{ jwt: [] }]
        }
      }
    }
  },
  {
    method: 'POST',
    path: '/api/health-records/screenings',
    handler: createScreeningHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'Health Records', 'Screenings'],
      description: 'Create screening record',
      notes: '**PHI PROTECTED ENDPOINT** - Documents a health screening. Requires NURSE or ADMIN role.',
      validate: {
        payload: Joi.object({
          studentId: Joi.string().required().description('Student ID'),
          screeningType: Joi.string().valid('VISION', 'HEARING', 'DENTAL', 'SCOLIOSIS', 'BMI', 'DEVELOPMENTAL').required().description('Type of screening'),
          screeningDate: Joi.date().iso().required().description('Screening date (ISO 8601)'),
          result: Joi.string().valid('PASS', 'FAIL', 'REFER', 'INCONCLUSIVE').required().description('Screening result'),
          findings: Joi.string().optional().description('Detailed findings'),
          referralNeeded: Joi.boolean().default(false).description('Referral to specialist needed'),
          followUpDate: Joi.date().iso().optional().description('Follow-up date if needed'),
          performedBy: Joi.string().trim().optional().description('Who performed the screening'),
          notes: Joi.string().optional().description('Additional notes')
        })
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '201': { description: 'Screening created successfully' },
            '400': { description: 'Invalid input data' },
            '401': { description: 'Authentication required' }
          },
          security: [{ jwt: [] }]
        }
      }
    }
  },
  {
    method: 'PUT',
    path: '/api/health-records/screenings/{id}',
    handler: updateScreeningHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'Health Records', 'Screenings'],
      description: 'Update screening record',
      notes: '**PHI PROTECTED ENDPOINT** - Updates screening information. All changes are audited.',
      validate: {
        params: Joi.object({
          id: Joi.string().required().description('Screening ID')
        }),
        payload: Joi.object({
          screeningType: Joi.string().valid('VISION', 'HEARING', 'DENTAL', 'SCOLIOSIS', 'BMI', 'DEVELOPMENTAL').optional(),
          screeningDate: Joi.date().iso().optional(),
          result: Joi.string().valid('PASS', 'FAIL', 'REFER', 'INCONCLUSIVE').optional(),
          findings: Joi.string().optional(),
          referralNeeded: Joi.boolean().optional(),
          followUpDate: Joi.date().iso().optional(),
          performedBy: Joi.string().trim().optional(),
          notes: Joi.string().optional()
        })
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': { description: 'Screening updated successfully' },
            '400': { description: 'Invalid input data' },
            '404': { description: 'Screening not found' }
          },
          security: [{ jwt: [] }]
        }
      }
    }
  },
  {
    method: 'DELETE',
    path: '/api/health-records/screenings/{id}',
    handler: deleteScreeningHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'Health Records', 'Screenings'],
      description: 'Delete screening record',
      notes: '**PHI PROTECTED ENDPOINT** - Removes screening record. Requires ADMIN or NURSE role.',
      validate: {
        params: Joi.object({
          id: Joi.string().required().description('Screening ID')
        })
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': { description: 'Screening deleted successfully' },
            '400': { description: 'Delete operation failed' },
            '401': { description: 'Authentication required' }
          },
          security: [{ jwt: [] }]
        }
      }
    }
  },
  {
    method: 'GET',
    path: '/api/health-records/screenings/due',
    handler: getScreeningsDueHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'Health Records', 'Screenings'],
      description: 'Get screenings due for follow-up',
      notes: '**PHI PROTECTED ENDPOINT** - Returns screenings requiring follow-up or re-screening.',
      validate: {
        query: Joi.object({
          daysAhead: Joi.number().integer().min(1).max(365).default(30).description('Look ahead days'),
          schoolId: Joi.string().optional().description('Filter by school ID')
        })
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': { description: 'Due screenings retrieved successfully' },
            '401': { description: 'Authentication required' },
            '500': { description: 'Internal server error' }
          },
          security: [{ jwt: [] }]
        }
      }
    }
  },
  {
    method: 'GET',
    path: '/api/health-records/screenings/statistics',
    handler: getScreeningStatsHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'Health Records', 'Screenings'],
      description: 'Get screening statistics',
      notes: 'Returns screening completion rates, pass/fail ratios, and referral statistics.',
      validate: {
        query: Joi.object({
          schoolId: Joi.string().optional().description('Filter by school ID')
        })
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': { description: 'Statistics retrieved successfully' },
            '401': { description: 'Authentication required' },
            '500': { description: 'Internal server error' }
          },
          security: [{ jwt: [] }]
        }
      }
    }
  },

  // ==========================================
  // GROWTH MEASUREMENTS SUB-ROUTES
  // ==========================================
  {
    method: 'GET',
    path: '/api/health-records/growth/student/{studentId}',
    handler: getGrowthMeasurementsHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'Health Records', 'Growth'],
      description: 'List growth measurements for student',
      notes: '**PHI PROTECTED ENDPOINT** - Returns growth chart data (height, weight, BMI) for tracking development.',
      validate: {
        params: Joi.object({
          studentId: Joi.string().required().description('Student ID')
        })
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': { description: 'Growth measurements retrieved successfully' },
            '401': { description: 'Authentication required' },
            '500': { description: 'Internal server error' }
          },
          security: [{ jwt: [] }]
        }
      }
    }
  },
  {
    method: 'GET',
    path: '/api/health-records/growth/{id}',
    handler: getGrowthMeasurementByIdHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'Health Records', 'Growth'],
      description: 'Get single growth measurement',
      notes: '**PHI PROTECTED ENDPOINT** - Retrieves details of a specific growth measurement.',
      validate: {
        params: Joi.object({
          id: Joi.string().required().description('Growth measurement ID')
        })
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': { description: 'Growth measurement retrieved successfully' },
            '404': { description: 'Growth measurement not found' },
            '401': { description: 'Authentication required' }
          },
          security: [{ jwt: [] }]
        }
      }
    }
  },
  {
    method: 'POST',
    path: '/api/health-records/growth',
    handler: createGrowthMeasurementHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'Health Records', 'Growth'],
      description: 'Create growth measurement',
      notes: '**PHI PROTECTED ENDPOINT** - Records a new growth measurement. Requires NURSE or ADMIN role.',
      validate: {
        payload: Joi.object({
          studentId: Joi.string().required().description('Student ID'),
          measurementDate: Joi.date().iso().required().description('Measurement date (ISO 8601)'),
          height: Joi.number().positive().optional().description('Height in cm'),
          weight: Joi.number().positive().optional().description('Weight in kg'),
          headCircumference: Joi.number().positive().optional().description('Head circumference in cm (for young children)'),
          bmi: Joi.number().positive().optional().description('Calculated BMI'),
          bmiPercentile: Joi.number().min(0).max(100).optional().description('BMI percentile'),
          notes: Joi.string().optional().description('Additional notes')
        })
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '201': { description: 'Growth measurement created successfully' },
            '400': { description: 'Invalid input data' },
            '401': { description: 'Authentication required' }
          },
          security: [{ jwt: [] }]
        }
      }
    }
  },
  {
    method: 'PUT',
    path: '/api/health-records/growth/{id}',
    handler: updateGrowthMeasurementHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'Health Records', 'Growth'],
      description: 'Update growth measurement',
      notes: '**PHI PROTECTED ENDPOINT** - Updates growth measurement data. All changes are audited.',
      validate: {
        params: Joi.object({
          id: Joi.string().required().description('Growth measurement ID')
        }),
        payload: Joi.object({
          measurementDate: Joi.date().iso().optional(),
          height: Joi.number().positive().optional(),
          weight: Joi.number().positive().optional(),
          headCircumference: Joi.number().positive().optional(),
          bmi: Joi.number().positive().optional(),
          bmiPercentile: Joi.number().min(0).max(100).optional(),
          notes: Joi.string().optional()
        })
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': { description: 'Growth measurement updated successfully' },
            '400': { description: 'Invalid input data' },
            '404': { description: 'Growth measurement not found' }
          },
          security: [{ jwt: [] }]
        }
      }
    }
  },
  {
    method: 'DELETE',
    path: '/api/health-records/growth/{id}',
    handler: deleteGrowthMeasurementHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'Health Records', 'Growth'],
      description: 'Delete growth measurement',
      notes: '**PHI PROTECTED ENDPOINT** - Removes growth measurement. Requires ADMIN or NURSE role.',
      validate: {
        params: Joi.object({
          id: Joi.string().required().description('Growth measurement ID')
        })
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': { description: 'Growth measurement deleted successfully' },
            '400': { description: 'Delete operation failed' },
            '401': { description: 'Authentication required' }
          },
          security: [{ jwt: [] }]
        }
      }
    }
  },
  {
    method: 'GET',
    path: '/api/health-records/growth/student/{studentId}/trends',
    handler: getGrowthTrendsHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'Health Records', 'Growth'],
      description: 'Get growth trends for student',
      notes: '**PHI PROTECTED ENDPOINT** - Returns growth trends and percentile tracking over time.',
      validate: {
        params: Joi.object({
          studentId: Joi.string().required().description('Student ID')
        }),
        query: Joi.object({
          startDate: Joi.date().iso().optional().description('Trend start date'),
          endDate: Joi.date().iso().optional().description('Trend end date')
        })
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': { description: 'Growth trends retrieved successfully' },
            '401': { description: 'Authentication required' },
            '500': { description: 'Internal server error' }
          },
          security: [{ jwt: [] }]
        }
      }
    }
  },
  {
    method: 'GET',
    path: '/api/health-records/growth/student/{studentId}/concerns',
    handler: getGrowthConcernsHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'Health Records', 'Growth'],
      description: 'Flag growth concerns for student',
      notes: '**PHI PROTECTED ENDPOINT** - Identifies potential growth concerns (e.g., obesity, underweight, growth delays).',
      validate: {
        params: Joi.object({
          studentId: Joi.string().required().description('Student ID')
        })
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': { description: 'Growth concerns retrieved successfully' },
            '401': { description: 'Authentication required' },
            '500': { description: 'Internal server error' }
          },
          security: [{ jwt: [] }]
        }
      }
    }
  },

  // ==========================================
  // VITAL SIGNS SUB-ROUTES
  // ==========================================
  {
    method: 'GET',
    path: '/api/health-records/vitals/student/{studentId}',
    handler: getVitalSignsHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'Health Records', 'Vital Signs'],
      description: 'List vital signs for student',
      notes: '**PHI PROTECTED ENDPOINT** - Returns vital signs history (blood pressure, heart rate, temperature, etc.).',
      validate: {
        params: Joi.object({
          studentId: Joi.string().required().description('Student ID')
        }),
        query: Joi.object({
          limit: Joi.number().integer().min(1).max(100).default(10).description('Number of records to return')
        })
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': { description: 'Vital signs retrieved successfully' },
            '401': { description: 'Authentication required' },
            '500': { description: 'Internal server error' }
          },
          security: [{ jwt: [] }]
        }
      }
    }
  },
  {
    method: 'GET',
    path: '/api/health-records/vitals/{id}',
    handler: getVitalSignsByIdHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'Health Records', 'Vital Signs'],
      description: 'Get single vital signs record',
      notes: '**PHI PROTECTED ENDPOINT** - Retrieves details of a specific vital signs reading.',
      validate: {
        params: Joi.object({
          id: Joi.string().required().description('Vital signs ID')
        })
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': { description: 'Vital signs retrieved successfully' },
            '404': { description: 'Vital signs not found' },
            '401': { description: 'Authentication required' }
          },
          security: [{ jwt: [] }]
        }
      }
    }
  },
  {
    method: 'POST',
    path: '/api/health-records/vitals',
    handler: createVitalSignsHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'Health Records', 'Vital Signs'],
      description: 'Create vital signs record',
      notes: '**PHI PROTECTED ENDPOINT** - Records new vital signs. Requires NURSE or ADMIN role.',
      validate: {
        payload: Joi.object({
          studentId: Joi.string().required().description('Student ID'),
          recordedAt: Joi.date().iso().required().description('Time recorded (ISO 8601)'),
          temperature: Joi.number().positive().optional().description('Temperature in Celsius'),
          heartRate: Joi.number().integer().positive().optional().description('Heart rate in bpm'),
          bloodPressureSystolic: Joi.number().integer().positive().optional().description('Systolic blood pressure'),
          bloodPressureDiastolic: Joi.number().integer().positive().optional().description('Diastolic blood pressure'),
          respiratoryRate: Joi.number().integer().positive().optional().description('Respiratory rate per minute'),
          oxygenSaturation: Joi.number().min(0).max(100).optional().description('Oxygen saturation percentage'),
          notes: Joi.string().optional().description('Additional notes')
        })
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '201': { description: 'Vital signs created successfully' },
            '400': { description: 'Invalid input data' },
            '401': { description: 'Authentication required' }
          },
          security: [{ jwt: [] }]
        }
      }
    }
  },
  {
    method: 'GET',
    path: '/api/health-records/vitals/student/{studentId}/latest',
    handler: getLatestVitalsHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'Health Records', 'Vital Signs'],
      description: 'Get latest vital signs for student',
      notes: '**PHI PROTECTED ENDPOINT** - Returns the most recent vital signs reading.',
      validate: {
        params: Joi.object({
          studentId: Joi.string().required().description('Student ID')
        })
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': { description: 'Latest vitals retrieved successfully' },
            '401': { description: 'Authentication required' },
            '500': { description: 'Internal server error' }
          },
          security: [{ jwt: [] }]
        }
      }
    }
  },
  {
    method: 'GET',
    path: '/api/health-records/vitals/student/{studentId}/trends',
    handler: getVitalTrendsHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'Health Records', 'Vital Signs'],
      description: 'Get vital signs trends',
      notes: '**PHI PROTECTED ENDPOINT** - Returns vital signs trends over time for pattern analysis.',
      validate: {
        params: Joi.object({
          studentId: Joi.string().required().description('Student ID')
        }),
        query: Joi.object({
          startDate: Joi.date().iso().optional().description('Trend start date'),
          endDate: Joi.date().iso().optional().description('Trend end date')
        })
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': { description: 'Vital trends retrieved successfully' },
            '401': { description: 'Authentication required' },
            '500': { description: 'Internal server error' }
          },
          security: [{ jwt: [] }]
        }
      }
    }
  },

  // ==========================================
  // UTILITY ROUTES
  // ==========================================
  {
    method: 'GET',
    path: '/api/health-records/search',
    handler: searchHealthRecordsHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'Health Records'],
      description: 'Search health records',
      notes: '**PHI PROTECTED ENDPOINT** - Full-text search across health records. All searches are logged.',
      validate: {
        query: Joi.object({
          q: Joi.string().required().description('Search query'),
          type: Joi.string().optional().description('Filter by record type'),
          page: Joi.number().integer().min(1).default(1).description('Page number'),
          limit: Joi.number().integer().min(1).max(100).default(20).description('Records per page')
        })
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': { description: 'Search completed successfully' },
            '400': { description: 'Search query required' },
            '401': { description: 'Authentication required' }
          },
          security: [{ jwt: [] }]
        }
      }
    }
  },
  {
    method: 'POST',
    path: '/api/health-records/bulk-delete',
    handler: bulkDeleteHealthRecordsHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'Health Records'],
      description: 'Bulk delete health records',
      notes: '**PHI PROTECTED ENDPOINT** - Deletes multiple records. Requires ADMIN or NURSE role. All deletions are audited.',
      validate: {
        payload: Joi.object({
          recordIds: Joi.array().items(Joi.string()).min(1).required().description('Array of record IDs to delete')
        })
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': { description: 'Bulk delete completed' },
            '403': { description: 'Insufficient permissions' },
            '401': { description: 'Authentication required' }
          },
          security: [{ jwt: [] }]
        }
      }
    }
  },
  {
    method: 'POST',
    path: '/api/health-records/import/{studentId}',
    handler: importHealthRecordsHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'Health Records'],
      description: 'Import health records',
      notes: '**PHI PROTECTED ENDPOINT** - Imports health records from external source. Requires ADMIN or NURSE role.',
      validate: {
        params: Joi.object({
          studentId: Joi.string().required().description('Student ID')
        })
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': { description: 'Import completed successfully' },
            '400': { description: 'Invalid import data' },
            '401': { description: 'Authentication required' }
          },
          security: [{ jwt: [] }]
        }
      }
    }
  }
];
