/**
 * LOC: EHR001
 * File: /reuse/document/composites/downstream/ehr-integration-services.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - crypto (Node.js built-in)
 *   - ../document-security-encryption-composite
 *
 * DOWNSTREAM (imported by):
 *   - EHR synchronization services
 *   - Medical record controllers
 *   - Integration adapters
 */

import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import * as crypto from 'crypto';

/**
 * EHR integration status
 */
export enum EHRIntegrationStatus {
  CONNECTED = 'CONNECTED',
  DISCONNECTED = 'DISCONNECTED',
  SYNCING = 'SYNCING',
  ERROR = 'ERROR',
  PENDING_AUTH = 'PENDING_AUTH',
}

/**
 * Clinical document type
 */
export enum ClinicalDocumentType {
  PROGRESS_NOTE = 'PROGRESS_NOTE',
  DISCHARGE_SUMMARY = 'DISCHARGE_SUMMARY',
  PRESCRIPTION = 'PRESCRIPTION',
  LAB_RESULT = 'LAB_RESULT',
  IMAGING_REPORT = 'IMAGING_REPORT',
  MEDICATION_LIST = 'MEDICATION_LIST',
  ALLERGY_LIST = 'ALLERGY_LIST',
  PROBLEM_LIST = 'PROBLEM_LIST',
  VITAL_SIGNS = 'VITAL_SIGNS',
}

/**
 * Clinical document
 */
export interface ClinicalDocument {
  documentId: string;
  mrn: string;
  documentType: ClinicalDocumentType;
  createdAt: Date;
  authoredAt: Date;
  content: string;
  createdBy: string;
  facility: string;
  status: 'ACTIVE' | 'ARCHIVED' | 'VOIDED';
  metadata?: Record<string, any>;
}

/**
 * EHR synchronization record
 */
export interface EHRSyncRecord {
  syncId: string;
  documentId: string;
  ehrSystem: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
  syncDirection: 'PUSH' | 'PULL';
  startedAt: Date;
  completedAt?: Date;
  error?: string;
  recordsSynced: number;
}

/**
 * EHR connection
 */
export interface EHRConnection {
  connectionId: string;
  systemName: string;
  endpoint: string;
  apiKey: string;
  status: EHRIntegrationStatus;
  lastSyncAt?: Date;
  nextSyncAt?: Date;
  failureCount: number;
  metadata?: Record<string, any>;
}

/**
 * EHR integration service
 * Manages integration with Electronic Health Records systems
 */
@Injectable()
export class EHRIntegrationService {
  private readonly logger = new Logger(EHRIntegrationService.name);
  private connections: Map<string, EHRConnection> = new Map();
  private documents: Map<string, ClinicalDocument> = new Map();
  private syncRecords: EHRSyncRecord[] = [];

  /**
   * Establishes connection to EHR system
   * @param systemName - EHR system name
   * @param endpoint - EHR endpoint URL
   * @param apiKey - API key for authentication
   * @returns Connection record
   */
  async establishEHRConnection(
    systemName: string,
    endpoint: string,
    apiKey: string
  ): Promise<EHRConnection> {
    try {
      const connectionId = crypto.randomUUID();

      const connection: EHRConnection = {
        connectionId,
        systemName,
        endpoint,
        apiKey: crypto.createHash('sha256').update(apiKey).digest('hex'),
        status: EHRIntegrationStatus.PENDING_AUTH,
        failureCount: 0
      };

      this.connections.set(connectionId, connection);

      // Simulate connection verification
      await this.verifyConnection(connectionId);

      this.logger.log(`EHR connection established: ${systemName}`);

      return connection;
    } catch (error) {
      this.logger.error(`Failed to establish EHR connection: ${error.message}`);
      throw new BadRequestException('Failed to establish EHR connection');
    }
  }

  /**
   * Verifies EHR connection
   * @param connectionId - Connection identifier
   * @returns Verification result
   */
  async verifyConnection(connectionId: string): Promise<{ verified: boolean; status: EHRIntegrationStatus }> {
    const connection = this.connections.get(connectionId);
    if (!connection) {
      throw new BadRequestException('Connection not found');
    }

    try {
      // In production, make actual API call to verify
      connection.status = EHRIntegrationStatus.CONNECTED;
      connection.failureCount = 0;

      this.logger.log(`EHR connection verified: ${connectionId}`);

      return { verified: true, status: connection.status };
    } catch (error) {
      connection.status = EHRIntegrationStatus.ERROR;
      connection.failureCount++;

      return { verified: false, status: connection.status };
    }
  }

  /**
   * Pushes clinical document to EHR
   * @param connectionId - Connection identifier
   * @param document - Clinical document
   * @returns Sync record
   */
  async pushDocumentToEHR(
    connectionId: string,
    document: ClinicalDocument
  ): Promise<EHRSyncRecord> {
    try {
      const connection = this.connections.get(connectionId);
      if (!connection) {
        throw new BadRequestException('Connection not found');
      }

      if (connection.status !== EHRIntegrationStatus.CONNECTED) {
        throw new BadRequestException('Connection not available');
      }

      const syncId = crypto.randomUUID();
      const startedAt = new Date();

      const syncRecord: EHRSyncRecord = {
        syncId,
        documentId: document.documentId,
        ehrSystem: connection.systemName,
        status: 'IN_PROGRESS',
        syncDirection: 'PUSH',
        startedAt,
        recordsSynced: 0
      };

      this.syncRecords.push(syncRecord);

      // Simulate push operation
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Store document
      this.documents.set(document.documentId, document);

      // Update sync record
      syncRecord.status = 'COMPLETED';
      syncRecord.completedAt = new Date();
      syncRecord.recordsSynced = 1;

      // Update connection
      connection.lastSyncAt = new Date();
      connection.nextSyncAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      this.logger.log(`Document pushed to EHR: ${document.documentId}`);

      return syncRecord;
    } catch (error) {
      this.logger.error(`Failed to push document to EHR: ${error.message}`);

      const syncRecord: EHRSyncRecord = {
        syncId: crypto.randomUUID(),
        documentId: document.documentId,
        ehrSystem: this.connections.get(connectionId)?.systemName || 'UNKNOWN',
        status: 'FAILED',
        syncDirection: 'PUSH',
        startedAt: new Date(),
        error: error.message,
        recordsSynced: 0
      };

      this.syncRecords.push(syncRecord);
      throw new BadRequestException('Failed to push document to EHR');
    }
  }

  /**
   * Pulls clinical documents from EHR
   * @param connectionId - Connection identifier
   * @param mrn - Patient MRN
   * @param documentTypes - Document types to pull
   * @returns Pulled documents
   */
  async pullDocumentsFromEHR(
    connectionId: string,
    mrn: string,
    documentTypes?: ClinicalDocumentType[]
  ): Promise<{ documents: ClinicalDocument[]; syncRecord: EHRSyncRecord }> {
    try {
      const connection = this.connections.get(connectionId);
      if (!connection) {
        throw new BadRequestException('Connection not found');
      }

      const syncId = crypto.randomUUID();
      const startedAt = new Date();

      const syncRecord: EHRSyncRecord = {
        syncId,
        documentId: mrn,
        ehrSystem: connection.systemName,
        status: 'IN_PROGRESS',
        syncDirection: 'PULL',
        startedAt,
        recordsSynced: 0
      };

      this.syncRecords.push(syncRecord);

      // Simulate pull operation
      await new Promise(resolve => setTimeout(resolve, 1000));

      // In production, fetch actual documents from EHR
      const pulledDocuments: ClinicalDocument[] = [];

      syncRecord.status = 'COMPLETED';
      syncRecord.completedAt = new Date();
      syncRecord.recordsSynced = pulledDocuments.length;

      connection.lastSyncAt = new Date();

      this.logger.log(`Documents pulled from EHR: ${pulledDocuments.length} records`);

      return { documents: pulledDocuments, syncRecord };
    } catch (error) {
      this.logger.error(`Failed to pull documents from EHR: ${error.message}`);

      const syncRecord: EHRSyncRecord = {
        syncId: crypto.randomUUID(),
        documentId: mrn,
        ehrSystem: this.connections.get(connectionId)?.systemName || 'UNKNOWN',
        status: 'FAILED',
        syncDirection: 'PULL',
        startedAt: new Date(),
        error: error.message,
        recordsSynced: 0
      };

      this.syncRecords.push(syncRecord);
      throw new BadRequestException('Failed to pull documents from EHR');
    }
  }

  /**
   * Synchronizes patient record between systems
   * @param mrn - Patient MRN
   * @param connectionId - Primary connection ID
   * @returns Synchronization result
   */
  async synchronizePatientRecord(
    mrn: string,
    connectionId: string
  ): Promise<{ synchronized: boolean; recordsProcessed: number; timestamp: Date }> {
    try {
      const connection = this.connections.get(connectionId);
      if (!connection) {
        throw new BadRequestException('Connection not found');
      }

      let totalRecords = 0;

      // Pull from EHR
      const pullResult = await this.pullDocumentsFromEHR(connectionId, mrn);
      totalRecords += pullResult.documents.length;

      // Store pulled documents
      pullResult.documents.forEach(doc => {
        this.documents.set(doc.documentId, doc);
      });

      this.logger.log(`Patient record synchronized: ${mrn}`);

      return {
        synchronized: true,
        recordsProcessed: totalRecords,
        timestamp: new Date()
      };
    } catch (error) {
      this.logger.error(`Patient synchronization failed: ${error.message}`);
      throw new BadRequestException('Failed to synchronize patient record');
    }
  }

  /**
   * Searches clinical documents
   * @param mrn - Patient MRN
   * @param documentType - Document type filter
   * @param dateRange - Date range filter
   * @returns Found documents
   */
  async searchDocuments(
    mrn: string,
    documentType?: ClinicalDocumentType,
    dateRange?: { startDate: Date; endDate: Date }
  ): Promise<ClinicalDocument[]> {
    let results = Array.from(this.documents.values()).filter(d => d.mrn === mrn);

    if (documentType) {
      results = results.filter(d => d.documentType === documentType);
    }

    if (dateRange) {
      results = results.filter(d =>
        d.createdAt >= dateRange.startDate && d.createdAt <= dateRange.endDate
      );
    }

    return results;
  }

  /**
   * Gets clinical document
   * @param documentId - Document identifier
   * @returns Clinical document or null
   */
  async getDocument(documentId: string): Promise<ClinicalDocument | null> {
    return this.documents.get(documentId) || null;
  }

  /**
   * Gets synchronization status
   * @param connectionId - Connection identifier
   * @returns Connection status with sync history
   */
  async getSyncStatus(connectionId: string): Promise<{
    connection: EHRConnection;
    lastSync?: EHRSyncRecord;
    syncHistory: EHRSyncRecord[];
  }> {
    const connection = this.connections.get(connectionId);
    if (!connection) {
      throw new BadRequestException('Connection not found');
    }

    const syncHistory = this.syncRecords.filter(r => r.ehrSystem === connection.systemName);
    const lastSync = syncHistory.length > 0 ? syncHistory[syncHistory.length - 1] : undefined;

    return { connection, lastSync, syncHistory };
  }

  /**
   * Monitors EHR integration health
   * @returns Health status of all connections
   */
  async monitorIntegrationHealth(): Promise<{
    totalConnections: number;
    connectedSystems: number;
    failedConnections: number;
    successRate: number;
    timestamp: Date;
  }> {
    const connections = Array.from(this.connections.values());
    const connectedSystems = connections.filter(c => c.status === EHRIntegrationStatus.CONNECTED).length;
    const failedConnections = connections.filter(c => c.status === EHRIntegrationStatus.ERROR).length;

    const totalSyncs = this.syncRecords.length;
    const successfulSyncs = this.syncRecords.filter(r => r.status === 'COMPLETED').length;
    const successRate = totalSyncs > 0 ? (successfulSyncs / totalSyncs) * 100 : 0;

    return {
      totalConnections: connections.length,
      connectedSystems,
      failedConnections,
      successRate: Math.round(successRate),
      timestamp: new Date()
    };
  }

  /**
   * Handles EHR connection error
   * @param connectionId - Connection identifier
   * @param error - Error details
   */
  async handleConnectionError(connectionId: string, error: string): Promise<void> {
    const connection = this.connections.get(connectionId);
    if (connection) {
      connection.status = EHRIntegrationStatus.ERROR;
      connection.failureCount++;

      // Attempt reconnection if below threshold
      if (connection.failureCount < 3) {
        setTimeout(() => this.verifyConnection(connectionId), 5000);
      }

      this.logger.error(`EHR connection error: ${connectionId} - ${error}`);
    }
  }
}

export default EHRIntegrationService;
