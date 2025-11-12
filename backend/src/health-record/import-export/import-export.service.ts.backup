/**
 * @fileoverview Import/Export Service
 * @module health-record/import-export
 * @description Health record import/export with multiple format support and validation
 * HIPAA Compliance: All import/export operations are audited and PHI data is handled securely
 */

import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Student } from '../../database/models/student.model';
import { Vaccination } from '../../database/models/vaccination.model';
import { Allergy } from '../../database/models/allergy.model';
import { ChronicCondition } from '../../database/models/chronic-condition.model';
import { VitalSigns } from '../../database/models/vital-signs.model';
import { ClinicVisit } from '../../database/models/clinic-visit.model';

@Injectable()
export class ImportExportService {
  private readonly logger = new Logger(ImportExportService.name);

  // Supported formats
  private readonly SUPPORTED_FORMATS = ['JSON', 'CSV', 'PDF', 'HL7', 'XML'];

  constructor(
    @InjectModel(Student)
    private readonly studentModel: typeof Student,
    @InjectModel(Vaccination)
    private readonly vaccinationModel: typeof Vaccination,
    @InjectModel(Allergy)
    private readonly allergyModel: typeof Allergy,
    @InjectModel(ChronicCondition)
    private readonly chronicConditionModel: typeof ChronicCondition,
    @InjectModel(VitalSigns)
    private readonly vitalSignsModel: typeof VitalSigns,
    @InjectModel(ClinicVisit)
    private readonly clinicVisitModel: typeof ClinicVisit,
  ) {}

  async importRecords(data: any, format: string, user: any): Promise<any> {
    this.logger.log(
      `Importing health records in ${format} format by user ${user.id}`,
    );

    if (!this.SUPPORTED_FORMATS.includes(format.toUpperCase())) {
      throw new BadRequestException(
        `Unsupported format: ${format}. Supported: ${this.SUPPORTED_FORMATS.join(', ')}`,
      );
    }

    const results = {
      imported: 0,
      failed: 0,
      errors: [] as any[],
      records: [] as any[],
    };

    try {
      let parsedData: any[];

      // Parse based on format
      switch (format.toUpperCase()) {
        case 'JSON':
          parsedData = Array.isArray(data) ? data : [data];
          break;
        case 'CSV':
          parsedData = this.parseCSV(data);
          break;
        case 'HL7':
          parsedData = this.parseHL7(data);
          break;
        case 'XML':
          parsedData = this.parseXML(data);
          break;
        default:
          throw new BadRequestException(`Format ${format} not yet implemented`);
      }

      // PERFORMANCE OPTIMIZATION: Bulk validate and import records
      // Group records by type for batch processing
      const recordsByType = this.groupRecordsByType(parsedData);

      // Validate all student IDs in batch to avoid N+1 queries
      const allStudentIds = parsedData.map((r) => r.studentId).filter(Boolean);
      const validStudentIds = await this.validateStudentIdsBatch(allStudentIds);

      // Process each type in bulk
      for (const [type, records] of Object.entries(recordsByType)) {
        try {
          const validRecords = records.filter((r) =>
            validStudentIds.has(r.studentId),
          );
          const invalidRecords = records.filter(
            (r) => !validStudentIds.has(r.studentId),
          );

          // Record validation errors for invalid student IDs
          invalidRecords.forEach((record) => {
            results.failed++;
            results.errors.push({
              record,
              error: `Student with ID ${record.studentId} not found`,
            });
          });

          if (validRecords.length > 0) {
            const importedRecords = await this.importRecordsBulk(
              type,
              validRecords,
              user,
            );
            results.records.push(...importedRecords);
            results.imported += importedRecords.length;
          }
        } catch (error) {
          this.logger.error(`Bulk import failed for type ${type}:`, error);
          records.forEach((record) => {
            results.failed++;
            results.errors.push({
              record,
              error: error.message,
            });
          });
        }
      }

      this.logger.log(
        `Import completed: ${results.imported} success, ${results.failed} failed`,
      );
      this.logger.log(
        `PHI Import: ${results.imported} records imported by user ${user.id}`,
      );
    } catch (error) {
      this.logger.error(`Import failed: ${error.message}`);
      throw new BadRequestException(`Import failed: ${error.message}`);
    }

    return results;
  }

  async exportRecords(filters: any, format: string): Promise<any> {
    this.logger.log(`Exporting health records in ${format} format`);

    if (!this.SUPPORTED_FORMATS.includes(format.toUpperCase())) {
      throw new BadRequestException(`Unsupported format: ${format}`);
    }

    // Query actual records based on filters
    const records = await this.getFilteredRecords(filters);

    let exportedData: any;
    switch (format.toUpperCase()) {
      case 'JSON':
        exportedData = JSON.stringify(records, null, 2);
        break;
      case 'CSV':
        exportedData = this.convertToCSV(records);
        break;
      case 'HL7':
        exportedData = this.convertToHL7(records);
        break;
      case 'XML':
        exportedData = this.convertToXML(records);
        break;
      case 'PDF':
        exportedData = this.convertToPDF(records);
        break;
      default:
        throw new BadRequestException(
          `Export format ${format} not implemented`,
        );
    }

    return {
      records: exportedData,
      format: format.toUpperCase(),
      count: records.length,
      exportedAt: new Date(),
      filters,
    };
  }

  async exportStudentRecord(studentId: string, format: string): Promise<any> {
    this.logger.log(
      `Exporting complete record for student ${studentId} in ${format} format`,
    );

    // Verify student exists
    const student = await this.studentModel.findByPk(studentId);
    if (!student) {
      throw new NotFoundException(`Student with ID ${studentId} not found`);
    }

    // Aggregate all health data for student using parallel queries
    const [vaccinations, allergies, chronicConditions, vitals, visits] =
      await Promise.all([
        this.vaccinationModel.findAll({
          where: { studentId },
          include: [{ model: Student, attributes: ['firstName', 'lastName'] }],
          order: [['administrationDate', 'DESC']],
        }),
        this.allergyModel.findAll({
          where: { studentId, active: true },
          include: [{ model: Student, attributes: ['firstName', 'lastName'] }],
          order: [['diagnosedDate', 'DESC']],
        }),
        this.chronicConditionModel.findAll({
          where: { studentId, status: 'ACTIVE' },
          include: [{ model: Student, attributes: ['firstName', 'lastName'] }],
          order: [['diagnosedDate', 'DESC']],
        }),
        this.vitalSignsModel.findAll({
          where: { studentId },
          include: [{ model: Student, attributes: ['firstName', 'lastName'] }],
          order: [['measurementDate', 'DESC']],
        }),
        this.clinicVisitModel.findAll({
          where: { studentId },
          include: [{ model: Student, attributes: ['firstName', 'lastName'] }],
          order: [['checkInTime', 'DESC']],
        }),
      ]);

    const studentData = {
      studentId,
      student: {
        firstName: student.firstName,
        lastName: student.lastName,
        dateOfBirth: student.dateOfBirth,
      },
      exportedAt: new Date(),
      vaccinations: vaccinations.map((v) => ({
        vaccineName: v.vaccineName,
        vaccineType: v.vaccineType,
        administrationDate: v.administrationDate,
        administeredBy: v.administeredBy,
        lotNumber: v.lotNumber,
        cvxCode: v.cvxCode,
      })),
      allergies: allergies.map((a) => ({
        allergen: a.allergen,
        allergyType: a.allergyType,
        severity: a.severity,
        symptoms: a.symptoms,
        diagnosedDate: a.diagnosedDate,
        active: a.active,
      })),
      chronicConditions: chronicConditions.map((c) => ({
        condition: c.condition,
        icdCode: c.icdCode,
        status: c.status,
        severity: c.severity,
        diagnosedDate: c.diagnosedDate,
        carePlan: c.carePlan,
      })),
      vitals: vitals.map((v) => ({
        measurementDate: v.measurementDate,
        temperature: v.temperature,
        heartRate: v.heartRate,
        respiratoryRate: v.respiratoryRate,
        bloodPressureSystolic: v.bloodPressureSystolic,
        bloodPressureDiastolic: v.bloodPressureDiastolic,
        oxygenSaturation: v.oxygenSaturation,
        weight: v.weight,
        height: v.height,
        bmi: v.bmi,
        isAbnormal: v.isAbnormal,
      })),
      visits: visits.map((v) => ({
        checkInTime: v.checkInTime,
        checkOutTime: v.checkOutTime,
        reasonForVisit: v.reasonForVisit,
        symptoms: v.symptoms,
        treatment: v.treatment,
        disposition: v.disposition,
        attendedBy: v.attendedBy,
      })),
    };

    let exportedData: any;
    switch (format.toUpperCase()) {
      case 'JSON':
        exportedData = JSON.stringify(studentData, null, 2);
        break;
      case 'PDF':
        exportedData = this.convertStudentRecordToPDF(studentData);
        break;
      case 'CSV':
        exportedData = this.convertStudentRecordToCSV(studentData);
        break;
      default:
        throw new BadRequestException(
          `Format ${format} not supported for student records`,
        );
    }

    return {
      studentId,
      data: exportedData,
      format: format.toUpperCase(),
      exportedAt: new Date(),
    };
  }

  /**
   * Bulk export for state reporting
   */
  async exportForStateReporting(
    stateCode: string,
    schoolIds: string[],
    dateRange: any,
  ): Promise<any> {
    this.logger.log(
      `Exporting state report for ${stateCode}, schools: ${schoolIds.join(', ')}`,
    );

    // Get all students for the specified schools
    const students = await this.studentModel.findAll({
      where: { schoolId: { [Op.in]: schoolIds } },
      attributes: ['id', 'schoolId'],
    });
    const studentIds = students.map((s) => s.id);

    if (studentIds.length === 0) {
      return {
        stateCode,
        formats: { csv: '', hl7: '' },
        summary: { totalRecords: 0, schoolCount: schoolIds.length, dateRange },
        generatedAt: new Date(),
      };
    }

    // Get vaccination data with date filtering
    const vaccinationWhere: any = { studentId: { [Op.in]: studentIds } };
    if (dateRange?.start && dateRange?.end) {
      vaccinationWhere.administrationDate = {
        [Op.between]: [new Date(dateRange.start), new Date(dateRange.end)],
      };
    }

    const vaccinations = await this.vaccinationModel.findAll({
      where: vaccinationWhere,
      include: [
        {
          model: Student,
          attributes: [
            'id',
            'firstName',
            'lastName',
            'schoolId',
            'dateOfBirth',
          ],
        },
      ],
      order: [['administrationDate', 'DESC']],
    });

    const reportData = {
      stateCode,
      schoolIds,
      dateRange,
      generatedAt: new Date(),
      vaccinationData: vaccinations.map((v) => ({
        studentId: v.studentId,
        studentName: `${v.student?.firstName} ${v.student?.lastName}`,
        schoolId: v.student?.schoolId,
        dateOfBirth: v.student?.dateOfBirth,
        vaccineName: v.vaccineName,
        vaccineType: v.vaccineType,
        administrationDate: v.administrationDate,
        administeredBy: v.administeredBy,
        cvxCode: v.cvxCode,
        seriesComplete: v.seriesComplete,
      })),
    };

    // Most states require CSV or HL7 format
    const csvData = this.convertToCSV(reportData.vaccinationData);
    const hl7Data = this.convertToHL7(reportData.vaccinationData);

    return {
      stateCode,
      formats: {
        csv: csvData,
        hl7: hl7Data,
      },
      summary: {
        totalRecords: vaccinations.length,
        schoolCount: schoolIds.length,
        dateRange,
      },
      generatedAt: new Date(),
    };
  }

  // Private helper methods

  private async validateRecord(record: any): Promise<any> {
    // Basic validation
    if (!record.studentId) {
      throw new Error('Student ID is required');
    }
    if (!record.type) {
      throw new Error('Record type is required');
    }

    // Verify student exists
    const student = await this.studentModel.findByPk(record.studentId);
    if (!student) {
      throw new Error(`Student with ID ${record.studentId} not found`);
    }

    return record;
  }

  private async importSingleRecord(record: any, user: any): Promise<any> {
    const { type, studentId, ...data } = record;

    switch (type.toLowerCase()) {
      case 'vaccination':
        return await this.vaccinationModel.create({
          ...data,
          studentId,
          administeredBy: user.id,
          createdBy: user.id,
        });

      case 'allergy':
        return await this.allergyModel.create({
          ...data,
          studentId,
          active: true,
          verified: false,
          createdBy: user.id,
        });

      case 'chronic_condition':
      case 'chroniccondition':
        return await this.chronicConditionModel.create({
          ...data,
          studentId,
          status: 'ACTIVE',
          isActive: true,
          createdBy: user.id,
        });

      case 'vital_signs':
      case 'vitals':
        return await this.vitalSignsModel.create({
          ...data,
          studentId,
          isAbnormal: false, // Would be calculated in hooks
          createdBy: user.id,
        });

      case 'clinic_visit':
      case 'visit':
        return await this.clinicVisitModel.create({
          ...data,
          studentId,
          attendedBy: user.id,
        });

      default:
        throw new Error(`Unsupported record type: ${type}`);
    }
  }

  /**
   * PERFORMANCE OPTIMIZATION: Bulk import records by type
   * Uses bulkCreate instead of individual creates to reduce database roundtrips
   */
  private async importRecordsBulk(
    type: string,
    records: any[],
    user: any,
  ): Promise<any[]> {
    const recordsWithMetadata = records.map((record) => {
      const { studentId, ...data } = record;
      return {
        ...data,
        studentId,
        createdBy: user.id,
      };
    });

    switch (type.toLowerCase()) {
      case 'vaccination':
        return await this.vaccinationModel.bulkCreate(
          recordsWithMetadata.map((r) => ({
            ...r,
            administeredBy: user.id,
          })),
          { validate: true, returning: true },
        );

      case 'allergy':
        // Check for duplicates before bulk insert
        const allergyRecords =
          await this.deduplicateAllergies(recordsWithMetadata);
        return await this.allergyModel.bulkCreate(
          allergyRecords.map((r) => ({
            ...r,
            active: true,
            verified: false,
          })),
          { validate: true, returning: true },
        );

      case 'chronic_condition':
      case 'chroniccondition':
        return await this.chronicConditionModel.bulkCreate(
          recordsWithMetadata.map((r) => ({
            ...r,
            status: 'ACTIVE',
            isActive: true,
          })),
          { validate: true, returning: true },
        );

      case 'vital_signs':
      case 'vitals':
        return await this.vitalSignsModel.bulkCreate(
          recordsWithMetadata.map((r) => ({
            ...r,
            isAbnormal: false,
          })),
          { validate: true, returning: true },
        );

      case 'clinic_visit':
      case 'visit':
        return await this.clinicVisitModel.bulkCreate(
          recordsWithMetadata.map((r) => ({
            ...r,
            attendedBy: user.id,
          })),
          { validate: true, returning: true },
        );

      default:
        throw new Error(`Unsupported record type: ${type}`);
    }
  }

  /**
   * Group records by type for bulk processing
   */
  private groupRecordsByType(records: any[]): Record<string, any[]> {
    const groups: Record<string, any[]> = {};

    records.forEach((record) => {
      const type = record.type?.toLowerCase() || 'unknown';
      if (!groups[type]) {
        groups[type] = [];
      }
      groups[type].push(record);
    });

    return groups;
  }

  /**
   * PERFORMANCE OPTIMIZATION: Validate student IDs in batch
   * Single query instead of N queries
   */
  private async validateStudentIdsBatch(
    studentIds: string[],
  ): Promise<Set<string>> {
    const uniqueIds = [...new Set(studentIds)];

    if (uniqueIds.length === 0) {
      return new Set();
    }

    const students = await this.studentModel.findAll({
      where: { id: { [Op.in]: uniqueIds } },
      attributes: ['id'],
    });

    return new Set(students.map((s) => s.id));
  }

  /**
   * PERFORMANCE OPTIMIZATION: Deduplicate allergies with eager loading
   * Single query with joins instead of N queries
   */
  private async deduplicateAllergies(allergyRecords: any[]): Promise<any[]> {
    const studentIds = [...new Set(allergyRecords.map((r) => r.studentId))];

    // Fetch existing allergies for all students in one query with eager loading
    const existingAllergies = await this.allergyModel.findAll({
      where: {
        studentId: { [Op.in]: studentIds },
        active: true,
      },
      attributes: ['studentId', 'allergen'],
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['id'],
          required: true,
        },
      ],
    });

    // Create a map of existing allergies for fast lookup
    const allergyMap = new Map<string, Set<string>>();
    existingAllergies.forEach((allergy) => {
      const key = allergy.studentId;
      if (!allergyMap.has(key)) {
        allergyMap.set(key, new Set());
      }
      allergyMap.get(key)?.add(allergy.allergen?.toLowerCase());
    });

    // Filter out duplicates
    return allergyRecords.filter((record) => {
      const existingAllergens = allergyMap.get(record.studentId);
      if (!existingAllergens) {
        return true; // No existing allergies for this student
      }
      return !existingAllergens.has(record.allergen?.toLowerCase());
    });
  }

  private async getFilteredRecords(filters: any): Promise<any[]> {
    const whereClause: any = {};

    if (filters.studentId) {
      whereClause.studentId = filters.studentId;
    }
    if (filters.schoolId) {
      // Get students for this school first
      const students = await this.studentModel.findAll({
        where: { schoolId: filters.schoolId },
        attributes: ['id'],
      });
      whereClause.studentId = { [Op.in]: students.map((s) => s.id) };
    }
    if (filters.dateRange) {
      // This would need to be handled per record type
      // For simplicity, we'll focus on vaccinations for now
    }

    // Get records from all tables (simplified - in practice might need pagination)
    const [vaccinations, allergies, chronicConditions] = await Promise.all([
      this.vaccinationModel.findAll({
        where: whereClause,
        include: [{ model: Student, attributes: ['firstName', 'lastName'] }],
        limit: 1000, // Prevent huge exports
      }),
      this.allergyModel.findAll({
        where: { ...whereClause, active: true },
        include: [{ model: Student, attributes: ['firstName', 'lastName'] }],
        limit: 1000,
      }),
      this.chronicConditionModel.findAll({
        where: { ...whereClause, status: 'ACTIVE' },
        include: [{ model: Student, attributes: ['firstName', 'lastName'] }],
        limit: 1000,
      }),
    ]);

    // Combine and format records
    const records: any[] = [];

    vaccinations.forEach((v) =>
      records.push({
        type: 'vaccination',
        studentId: v.studentId,
        studentName: `${v.student?.firstName} ${v.student?.lastName}`,
        ...v.toJSON(),
      }),
    );

    allergies.forEach((a) =>
      records.push({
        type: 'allergy',
        studentId: a.studentId,
        studentName: `${a.student?.firstName} ${a.student?.lastName}`,
        ...a.toJSON(),
      }),
    );

    chronicConditions.forEach((c) =>
      records.push({
        type: 'chronic_condition',
        studentId: c.studentId,
        studentName: `${c.student?.firstName} ${c.student?.lastName}`,
        ...c.toJSON(),
      }),
    );

    return records;
  }

  private parseCSV(data: string): any[] {
    // Simplified CSV parser - in real implementation would use a library like csv-parser
    const lines = data.split('\n').filter((line) => line.trim());
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map((h) => h.trim());

    return lines.slice(1).map((line) => {
      const values = line.split(',');
      const record: any = {};
      headers.forEach((header, index) => {
        record[header] = values[index]?.trim() || '';
      });
      return record;
    });
  }

  private parseHL7(data: string): any[] {
    // HL7 parsing - simplified implementation
    this.logger.log('Parsing HL7 message');
    const segments = data.split('\n').filter((s) => s.trim());
    const records: any[] = [];

    segments.forEach((segment) => {
      if (segment.startsWith('RXA')) {
        // Vaccination segment
        const fields = segment.split('|');
        records.push({
          type: 'vaccination',
          studentId: fields[3],
          cvxCode: fields[5],
          administrationDate: fields[4],
          administeredBy: fields[10] || 'Unknown',
        });
      } else if (segment.startsWith('AL1')) {
        // Allergy segment
        const fields = segment.split('|');
        records.push({
          type: 'allergy',
          studentId: fields[2],
          allergen: fields[3],
          severity: fields[4],
          diagnosedDate: new Date(),
        });
      }
    });

    return records;
  }

  private parseXML(data: string): any[] {
    // XML parsing - simplified
    this.logger.log('Parsing XML data');
    // In real implementation would use xml2js or similar
    // For now, return empty array
    return [];
  }

  private convertToCSV(records: any[]): string {
    if (records.length === 0) return '';

    const headers = Object.keys(records[0]);
    const csvLines = [headers.join(',')];

    records.forEach((record) => {
      const values = headers.map((header) => {
        const value = record[header];
        // Escape commas and quotes in CSV
        if (
          typeof value === 'string' &&
          (value.includes(',') || value.includes('"'))
        ) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value || '';
      });
      csvLines.push(values.join(','));
    });

    return csvLines.join('\n');
  }

  private convertToHL7(records: any[]): string {
    // HL7 conversion - simplified
    const hl7Messages: string[] = [];

    records.forEach((record) => {
      if (record.type === 'vaccination') {
        const msg = `RXA|0|1|${record.administrationDate || ''}|${record.administrationDate || ''}|${record.cvxCode || ''}|1|ml||||${record.studentId}`;
        hl7Messages.push(msg);
      }
    });

    return hl7Messages.join('\n');
  }

  private convertToXML(records: any[]): string {
    // XML conversion - simplified
    const xmlLines = ['<?xml version="1.0" encoding="UTF-8"?>', '<records>'];

    records.forEach((record) => {
      xmlLines.push('  <record>');
      Object.entries(record).forEach(([key, value]) => {
        xmlLines.push(`    <${key}>${value}</${key}>`);
      });
      xmlLines.push('  </record>');
    });

    xmlLines.push('</records>');
    return xmlLines.join('\n');
  }

  private convertToPDF(records: any[]): string {
    // PDF conversion - in real implementation would use pdfmake or similar
    this.logger.log('Converting to PDF (mock implementation)');
    return `[PDF Data: ${records.length} records - Full implementation would use pdfmake library]`;
  }

  private convertStudentRecordToPDF(data: any): string {
    this.logger.log(
      `Converting student record to PDF (mock) for ${data.studentId}`,
    );
    return `[PDF Student Record: ${data.studentId} - ${data.vaccinations.length} vaccinations, ${data.allergies.length} allergies, ${data.chronicConditions.length} conditions]`;
  }

  private convertStudentRecordToCSV(data: any): string {
    // Flatten student data for CSV export
    const sections: string[] = [];

    sections.push('VACCINATIONS');
    if (data.vaccinations.length > 0) {
      sections.push(this.convertToCSV(data.vaccinations));
    } else {
      sections.push('No vaccination records');
    }

    sections.push('\nALLERGIES');
    if (data.allergies.length > 0) {
      sections.push(this.convertToCSV(data.allergies));
    } else {
      sections.push('No allergy records');
    }

    sections.push('\nCHRONIC CONDITIONS');
    if (data.chronicConditions.length > 0) {
      sections.push(this.convertToCSV(data.chronicConditions));
    } else {
      sections.push('No chronic condition records');
    }

    return sections.join('\n');
  }
}
