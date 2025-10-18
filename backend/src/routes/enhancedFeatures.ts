import { Router, Request, Response } from 'express';
import { authenticate } from '../middleware/auth';
import { logger } from '../utils/logger';

// Import all feature services
import { StudentPhotoService } from '../services/studentPhotoService';
import { AcademicTranscriptService } from '../services/academicTranscriptService';
import { GradeTransitionService } from '../services/gradeTransitionService';
import { HealthRiskAssessmentService } from '../services/healthRiskAssessmentService';
import { MultiLanguageService } from '../services/multiLanguageService';
import { MedicationInteractionService } from '../services/medicationInteractionService';
import * as AdvancedFeatures from '../services/advancedFeatures';
import * as EnterpriseFeatures from '../services/enterpriseFeatures';
import * as AdvancedEnterpriseFeatures from '../services/advancedEnterpriseFeatures';

const router = Router();

// ============================================
// Student Photo Management Routes
// ============================================

router.post('/students/:studentId/photo', authenticate, async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;
    const { imageData, metadata } = req.body;
    const uploadedBy = (req as any).user.id;

    const result = await StudentPhotoService.uploadPhoto({
      studentId,
      imageData,
      uploadedBy,
      metadata
    });

    res.json({ success: true, data: result });
  } catch (error) {
    logger.error('Error uploading photo', { error });
    res.status(500).json({ success: false, error: 'Failed to upload photo' });
  }
});

router.post('/students/photo-search', authenticate, async (req: Request, res: Response) => {
  try {
    const { imageData, threshold } = req.body;
    const matches = await StudentPhotoService.searchByPhoto(imageData, threshold);
    res.json({ success: true, data: matches });
  } catch (error) {
    logger.error('Error in photo search', { error });
    res.status(500).json({ success: false, error: 'Failed to search by photo' });
  }
});

// ============================================
// Academic Transcript Routes
// ============================================

router.post('/students/:studentId/transcript/import', authenticate, async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;
    const transcriptData = {
      ...req.body,
      studentId,
      importedBy: (req as any).user.id
    };

    const result = await AcademicTranscriptService.importTranscript(transcriptData);
    res.json({ success: true, data: result });
  } catch (error) {
    logger.error('Error importing transcript', { error });
    res.status(500).json({ success: false, error: 'Failed to import transcript' });
  }
});

router.get('/students/:studentId/transcript/history', authenticate, async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;
    const history = await AcademicTranscriptService.getAcademicHistory(studentId);
    res.json({ success: true, data: history });
  } catch (error) {
    logger.error('Error fetching academic history', { error });
    res.status(500).json({ success: false, error: 'Failed to fetch academic history' });
  }
});

router.get('/students/:studentId/transcript/trends', authenticate, async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;
    const trends = await AcademicTranscriptService.analyzePerformanceTrends(studentId);
    res.json({ success: true, data: trends });
  } catch (error) {
    logger.error('Error analyzing trends', { error });
    res.status(500).json({ success: false, error: 'Failed to analyze performance trends' });
  }
});

// ============================================
// Grade Transition Routes
// ============================================

router.post('/admin/grade-transition/bulk', authenticate, async (req: Request, res: Response) => {
  try {
    const { effectiveDate, dryRun } = req.body;
    const result = await GradeTransitionService.performBulkTransition(effectiveDate, dryRun);
    res.json({ success: true, data: result });
  } catch (error) {
    logger.error('Error performing grade transition', { error });
    res.status(500).json({ success: false, error: 'Failed to perform grade transition' });
  }
});

router.get('/admin/graduating-students', authenticate, async (req: Request, res: Response) => {
  try {
    const students = await GradeTransitionService.getGraduatingStudents();
    res.json({ success: true, data: students });
  } catch (error) {
    logger.error('Error fetching graduating students', { error });
    res.status(500).json({ success: false, error: 'Failed to fetch graduating students' });
  }
});

// ============================================
// Health Risk Assessment Routes
// ============================================

router.get('/students/:studentId/health-risk', authenticate, async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;
    const assessment = await HealthRiskAssessmentService.calculateRiskScore(studentId);
    res.json({ success: true, data: assessment });
  } catch (error) {
    logger.error('Error calculating risk score', { error });
    res.status(500).json({ success: false, error: 'Failed to calculate health risk score' });
  }
});

router.get('/admin/high-risk-students', authenticate, async (req: Request, res: Response) => {
  try {
    const { minScore } = req.query;
    const students = await HealthRiskAssessmentService.getHighRiskStudents(Number(minScore) || 50);
    res.json({ success: true, data: students });
  } catch (error) {
    logger.error('Error fetching high-risk students', { error });
    res.status(500).json({ success: false, error: 'Failed to fetch high-risk students' });
  }
});

// ============================================
// Medication Interaction Routes
// ============================================

router.get('/students/:studentId/medication-interactions', authenticate, async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;
    const result = await MedicationInteractionService.checkStudentMedications(studentId);
    res.json({ success: true, data: result });
  } catch (error) {
    logger.error('Error checking medication interactions', { error });
    res.status(500).json({ success: false, error: 'Failed to check medication interactions' });
  }
});

router.post('/students/:studentId/medication-interactions/check-new', authenticate, async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;
    const { medicationName } = req.body;
    const result = await MedicationInteractionService.checkNewMedication(studentId, medicationName);
    res.json({ success: true, data: result });
  } catch (error) {
    logger.error('Error checking new medication', { error });
    res.status(500).json({ success: false, error: 'Failed to check new medication' });
  }
});

// ============================================
// Medication Refill Routes
// ============================================

router.post('/medications/refill-request', authenticate, async (req: Request, res: Response) => {
  try {
    const requestData = {
      ...req.body,
      requestedBy: (req as any).user.id
    };
    const result = await AdvancedFeatures.MedicationRefillService.createRefillRequest(requestData);
    res.json({ success: true, data: result });
  } catch (error) {
    logger.error('Error creating refill request', { error });
    res.status(500).json({ success: false, error: 'Failed to create refill request' });
  }
});

// ============================================
// Barcode Scanning Routes
// ============================================

router.post('/barcode/scan', authenticate, async (req: Request, res: Response) => {
  try {
    const { barcodeString } = req.body;
    const result = await AdvancedFeatures.BarcodeScanningService.scanBarcode(barcodeString);
    res.json({ success: true, data: result });
  } catch (error) {
    logger.error('Error scanning barcode', { error });
    res.status(500).json({ success: false, error: 'Failed to scan barcode' });
  }
});

router.post('/barcode/verify-medication', authenticate, async (req: Request, res: Response) => {
  try {
    const { studentBarcode, medicationBarcode, nurseBarcode } = req.body;
    const result = await AdvancedFeatures.BarcodeScanningService.verifyMedicationAdministration(
      studentBarcode,
      medicationBarcode,
      nurseBarcode
    );
    res.json({ success: true, data: result });
  } catch (error) {
    logger.error('Error verifying medication', { error });
    res.status(500).json({ success: false, error: 'Failed to verify medication administration' });
  }
});

// ============================================
// Immunization Forecast Routes
// ============================================

router.get('/students/:studentId/immunization-forecast', authenticate, async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;
    const forecast = await AdvancedFeatures.ImmunizationForecastService.getForecast(studentId);
    res.json({ success: true, data: forecast });
  } catch (error) {
    logger.error('Error generating immunization forecast', { error });
    res.status(500).json({ success: false, error: 'Failed to generate forecast' });
  }
});

// ============================================
// Growth Chart Routes
// ============================================

router.post('/students/:studentId/growth-measurement', authenticate, async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;
    const measurementData = {
      ...req.body,
      studentId,
      measuredBy: (req as any).user.id
    };
    const result = await AdvancedFeatures.GrowthChartService.recordMeasurement(measurementData);
    res.json({ success: true, data: result });
  } catch (error) {
    logger.error('Error recording growth measurement', { error });
    res.status(500).json({ success: false, error: 'Failed to record measurement' });
  }
});

router.get('/students/:studentId/growth-analysis', authenticate, async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;
    const analysis = await AdvancedFeatures.GrowthChartService.analyzeGrowthTrend(studentId);
    res.json({ success: true, data: analysis });
  } catch (error) {
    logger.error('Error analyzing growth trend', { error });
    res.status(500).json({ success: false, error: 'Failed to analyze growth trend' });
  }
});

// ============================================
// Screening Routes
// ============================================

router.post('/screenings/record', authenticate, async (req: Request, res: Response) => {
  try {
    const screeningData = {
      ...req.body,
      screenedBy: (req as any).user.id
    };
    const result = await AdvancedFeatures.ScreeningService.recordScreening(screeningData);
    res.json({ success: true, data: result });
  } catch (error) {
    logger.error('Error recording screening', { error });
    res.status(500).json({ success: false, error: 'Failed to record screening' });
  }
});

// ============================================
// Emergency Notification Routes
// ============================================

router.post('/emergency/notify', authenticate, async (req: Request, res: Response) => {
  try {
    const notificationData = {
      ...req.body,
      sentBy: (req as any).user.id
    };
    const result = await AdvancedFeatures.EmergencyNotificationService.sendEmergencyNotification(notificationData);
    res.json({ success: true, data: result });
  } catch (error) {
    logger.error('Error sending emergency notification', { error });
    res.status(500).json({ success: false, error: 'Failed to send emergency notification' });
  }
});

// ============================================
// Waitlist Management Routes
// ============================================

router.post('/appointments/waitlist/add', authenticate, async (req: Request, res: Response) => {
  try {
    const { studentId, appointmentType, priority } = req.body;
    const result = await EnterpriseFeatures.WaitlistManagementService.addToWaitlist(studentId, appointmentType, priority);
    res.json({ success: true, data: result });
  } catch (error) {
    logger.error('Error adding to waitlist', { error });
    res.status(500).json({ success: false, error: 'Failed to add to waitlist' });
  }
});

// ============================================
// Bulk Messaging Routes
// ============================================

router.post('/communication/bulk-message', authenticate, async (req: Request, res: Response) => {
  try {
    const messageData = {
      ...req.body,
      sentBy: (req as any).user.id
    };
    const result = await EnterpriseFeatures.BulkMessagingService.sendBulkMessage(messageData);
    res.json({ success: true, data: result });
  } catch (error) {
    logger.error('Error sending bulk message', { error });
    res.status(500).json({ success: false, error: 'Failed to send bulk message' });
  }
});

// ============================================
// Custom Report Routes
// ============================================

router.post('/reports/custom/create', authenticate, async (req: Request, res: Response) => {
  try {
    const reportDef = await EnterpriseFeatures.CustomReportService.createReportDefinition(req.body);
    res.json({ success: true, data: reportDef });
  } catch (error) {
    logger.error('Error creating custom report', { error });
    res.status(500).json({ success: false, error: 'Failed to create custom report' });
  }
});

router.get('/reports/custom/:reportId/execute', authenticate, async (req: Request, res: Response) => {
  try {
    const { reportId } = req.params;
    const result = await EnterpriseFeatures.CustomReportService.executeReport(reportId);
    res.json({ success: true, data: result });
  } catch (error) {
    logger.error('Error executing report', { error });
    res.status(500).json({ success: false, error: 'Failed to execute report' });
  }
});

// ============================================
// Analytics Dashboard Routes
// ============================================

router.get('/analytics/real-time', authenticate, async (req: Request, res: Response) => {
  try {
    const metrics = await EnterpriseFeatures.AnalyticsDashboardService.getRealtimeMetrics();
    res.json({ success: true, data: metrics });
  } catch (error) {
    logger.error('Error fetching real-time metrics', { error });
    res.status(500).json({ success: false, error: 'Failed to fetch real-time metrics' });
  }
});

// ============================================
// MFA Routes
// ============================================

router.post('/auth/mfa/setup', authenticate, async (req: Request, res: Response) => {
  try {
    const { method } = req.body;
    const userId = (req as any).user.id;
    const setup = await AdvancedEnterpriseFeatures.MFAService.setupMFA(userId, method);
    res.json({ success: true, data: setup });
  } catch (error) {
    logger.error('Error setting up MFA', { error });
    res.status(500).json({ success: false, error: 'Failed to setup MFA' });
  }
});

router.post('/auth/mfa/verify', authenticate, async (req: Request, res: Response) => {
  try {
    const { code } = req.body;
    const userId = (req as any).user.id;
    const verified = await AdvancedEnterpriseFeatures.MFAService.verifyMFACode(userId, code);
    res.json({ success: true, data: { verified } });
  } catch (error) {
    logger.error('Error verifying MFA code', { error });
    res.status(500).json({ success: false, error: 'Failed to verify MFA code' });
  }
});

// ============================================
// System Monitoring Routes
// ============================================

router.get('/admin/system/health', authenticate, async (req: Request, res: Response) => {
  try {
    const health = await AdvancedEnterpriseFeatures.SystemMonitoringService.getSystemHealth();
    res.json({ success: true, data: health });
  } catch (error) {
    logger.error('Error checking system health', { error });
    res.status(500).json({ success: false, error: 'Failed to check system health' });
  }
});

// ============================================
// Feature Integration Status
// ============================================

router.get('/admin/features/status', authenticate, async (req: Request, res: Response) => {
  try {
    const status = await AdvancedEnterpriseFeatures.FeatureIntegrationService.getAllFeatureStatus();
    res.json({ success: true, data: status });
  } catch (error) {
    logger.error('Error fetching feature status', { error });
    res.status(500).json({ success: false, error: 'Failed to fetch feature status' });
  }
});

router.get('/admin/features/report', authenticate, async (req: Request, res: Response) => {
  try {
    const report = await AdvancedEnterpriseFeatures.FeatureIntegrationService.generateFeatureReport();
    res.json({ success: true, data: report });
  } catch (error) {
    logger.error('Error generating feature report', { error });
    res.status(500).json({ success: false, error: 'Failed to generate feature report' });
  }
});

export default router;
