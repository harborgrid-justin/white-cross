import express from 'express';
import { ReportService } from '../services/reportService';
import { logger } from '../utils/logger';

const router = express.Router();

// Health Trend Analysis
router.get('/health-trends', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const start = startDate ? new Date(startDate as string) : undefined;
    const end = endDate ? new Date(endDate as string) : undefined;
    
    const data = await ReportService.getHealthTrends(start, end);
    
    res.json({
      success: true,
      data
    });
  } catch (error) {
    logger.error('Error getting health trends:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to get health trends' }
    });
  }
});

// Medication Usage & Compliance
router.get('/medication-usage', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const start = startDate ? new Date(startDate as string) : undefined;
    const end = endDate ? new Date(endDate as string) : undefined;
    
    const data = await ReportService.getMedicationUsageReport(start, end);
    
    res.json({
      success: true,
      data
    });
  } catch (error) {
    logger.error('Error getting medication usage report:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to get medication usage report' }
    });
  }
});

// Incident Statistics
router.get('/incident-statistics', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const start = startDate ? new Date(startDate as string) : undefined;
    const end = endDate ? new Date(endDate as string) : undefined;
    
    const data = await ReportService.getIncidentStatistics(start, end);
    
    res.json({
      success: true,
      data
    });
  } catch (error) {
    logger.error('Error getting incident statistics:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to get incident statistics' }
    });
  }
});

// Attendance Correlation
router.get('/attendance-correlation', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const start = startDate ? new Date(startDate as string) : undefined;
    const end = endDate ? new Date(endDate as string) : undefined;
    
    const data = await ReportService.getAttendanceCorrelation(start, end);
    
    res.json({
      success: true,
      data
    });
  } catch (error) {
    logger.error('Error getting attendance correlation:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to get attendance correlation' }
    });
  }
});

// Performance Metrics
router.get('/performance-metrics', async (req, res) => {
  try {
    const { metricType, startDate, endDate } = req.query;
    
    const start = startDate ? new Date(startDate as string) : undefined;
    const end = endDate ? new Date(endDate as string) : undefined;
    
    const data = await ReportService.getPerformanceMetrics(
      metricType as any,
      start,
      end
    );
    
    res.json({
      success: true,
      data
    });
  } catch (error) {
    logger.error('Error getting performance metrics:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to get performance metrics' }
    });
  }
});

// Real-time Dashboard
router.get('/dashboard', async (req, res) => {
  try {
    const data = await ReportService.getRealTimeDashboard();
    
    res.json({
      success: true,
      data
    });
  } catch (error) {
    logger.error('Error getting dashboard data:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to get dashboard data' }
    });
  }
});

// Compliance Report
router.get('/compliance', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const start = startDate ? new Date(startDate as string) : undefined;
    const end = endDate ? new Date(endDate as string) : undefined;
    
    const data = await ReportService.getComplianceReport(start, end);
    
    res.json({
      success: true,
      data
    });
  } catch (error) {
    logger.error('Error getting compliance report:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to get compliance report' }
    });
  }
});

// Custom Report Builder
router.post('/custom', async (req, res) => {
  try {
    const { reportType, filters } = req.body;
    
    if (!reportType) {
      return res.status(400).json({
        success: false,
        error: { message: 'Report type is required' }
      });
    }
    
    const data = await ReportService.getCustomReportData(reportType, filters || {});
    
    res.json({
      success: true,
      data
    });
  } catch (error) {
    logger.error('Error generating custom report:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to generate custom report' }
    });
  }
});

// Export Report
router.post('/export', async (req, res) => {
  try {
    const { reportType, format, filters } = req.body;
    
    if (!reportType || !format) {
      return res.status(400).json({
        success: false,
        error: { message: 'Report type and format are required' }
      });
    }
    
    // Get the data for export
    const data = await ReportService.getCustomReportData(reportType, filters || {});
    
    // For now, just return the data - in production, you'd convert to CSV/PDF/Excel
    res.json({
      success: true,
      data: {
        format,
        reportType,
        generatedAt: new Date(),
        records: data
      }
    });
  } catch (error) {
    logger.error('Error exporting report:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to export report' }
    });
  }
});

export default router;
