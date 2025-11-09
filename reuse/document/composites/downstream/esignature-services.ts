/**
 * LOC: ESIG001
 * File: /reuse/document/composites/downstream/esignature-services.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - crypto (Node.js built-in)
 *   - ../document-security-encryption-composite
 *   - digital-signature-services
 *
 * DOWNSTREAM (imported by):
 *   - Workflow services
 *   - Document controllers
 *   - Signing workflow handlers
 */

import { Injectable, BadRequestException, ForbiddenException, Logger } from '@nestjs/common';
import * as crypto from 'crypto';

/**
 * Signature workflow status
 */
export enum SignatureWorkflowStatus {
  DRAFT = 'DRAFT',
  PENDING_SIGNATURE = 'PENDING_SIGNATURE',
  IN_PROGRESS = 'IN_PROGRESS',
  AWAITING_COUNTER_SIGNATURE = 'AWAITING_COUNTER_SIGNATURE',
  SIGNED = 'SIGNED',
  COMPLETED = 'COMPLETED',
  REJECTED = 'REJECTED',
  EXPIRED = 'EXPIRED',
  CANCELLED = 'CANCELLED',
}

/**
 * Signer status
 */
export enum SignerStatus {
  PENDING = 'PENDING',
  VIEWED = 'VIEWED',
  SIGNED = 'SIGNED',
  DECLINED = 'DECLINED',
  EXPIRED = 'EXPIRED',
}

/**
 * E-signature workflow participant
 */
export interface SignatureParticipant {
  participantId: string;
  email: string;
  name: string;
  order: number;
  status: SignerStatus;
  signedAt?: Date;
  signature?: string;
  declineReason?: string;
  lastReminderAt?: Date;
  metadata?: Record<string, any>;
}

/**
 * E-signature workflow
 */
export interface SignatureWorkflow {
  workflowId: string;
  documentId: string;
  createdBy: string;
  createdAt: Date;
  expiresAt: Date;
  status: SignatureWorkflowStatus;
  participants: SignatureParticipant[];
  cc: string[];
  message: string;
  signingOrder: 'PARALLEL' | 'SEQUENTIAL';
  requireCounterSignature: boolean;
  metadata?: Record<string, any>;
}

/**
 * E-signature envelope
 */
export interface SignatureEnvelope {
  envelopeId: string;
  workflowId: string;
  documentId: string;
  status: SignatureWorkflowStatus;
  completedAt?: Date;
  signatures: { participantId: string; signature: string; timestamp: Date }[];
  auditTrail: { event: string; actor: string; timestamp: Date }[];
}

/**
 * E-signature service
 * Manages e-signature workflows, document signing, and participant management
 */
@Injectable()
export class ESignatureService {
  private readonly logger = new Logger(ESignatureService.name);
  private workflows: Map<string, SignatureWorkflow> = new Map();
  private envelopes: Map<string, SignatureEnvelope> = new Map();
  private signingLinks: Map<string, { workflowId: string; participantId: string; expiresAt: Date }> = new Map();

  /**
   * Creates e-signature workflow
   * @param documentId - Document to sign
   * @param createdBy - Creator user ID
   * @param participants - Signature participants
   * @param expirationDays - Workflow expiration in days
   * @returns Created workflow
   */
  async createSignatureWorkflow(
    documentId: string,
    createdBy: string,
    participants: Omit<SignatureParticipant, 'participantId' | 'status'>[],
    expirationDays: number = 30
  ): Promise<SignatureWorkflow> {
    try {
      const workflowId = crypto.randomUUID();
      const createdAt = new Date();
      const expiresAt = new Date(createdAt.getTime() + expirationDays * 24 * 60 * 60 * 1000);

      const workflowParticipants: SignatureParticipant[] = participants.map((p, index) => ({
        participantId: crypto.randomUUID(),
        email: p.email,
        name: p.name,
        order: index + 1,
        status: SignerStatus.PENDING,
        metadata: p.metadata
      }));

      const workflow: SignatureWorkflow = {
        workflowId,
        documentId,
        createdBy,
        createdAt,
        expiresAt,
        status: SignatureWorkflowStatus.DRAFT,
        participants: workflowParticipants,
        cc: [],
        message: '',
        signingOrder: 'SEQUENTIAL',
        requireCounterSignature: false
      };

      this.workflows.set(workflowId, workflow);

      // Create envelope
      const envelope: SignatureEnvelope = {
        envelopeId: crypto.randomUUID(),
        workflowId,
        documentId,
        status: SignatureWorkflowStatus.DRAFT,
        signatures: [],
        auditTrail: [
          {
            event: 'WORKFLOW_CREATED',
            actor: createdBy,
            timestamp: createdAt
          }
        ]
      };

      this.envelopes.set(envelope.envelopeId, envelope);

      this.logger.log(`Signature workflow created: ${workflowId}`);

      return workflow;
    } catch (error) {
      this.logger.error(`Failed to create workflow: ${error.message}`);
      throw new BadRequestException('Failed to create signature workflow');
    }
  }

  /**
   * Sends signature request to participants
   * @param workflowId - Workflow identifier
   * @param message - Message to include
   * @returns Updated workflow
   */
  async sendSignatureRequest(workflowId: string, message: string): Promise<SignatureWorkflow> {
    const workflow = this.workflows.get(workflowId);
    if (!workflow) {
      throw new BadRequestException('Workflow not found');
    }

    // Update workflow
    workflow.message = message;
    workflow.status = SignatureWorkflowStatus.PENDING_SIGNATURE;

    // Generate signing links
    for (const participant of workflow.participants) {
      const linkToken = crypto.randomBytes(32).toString('hex');
      const expiresAt = workflow.expiresAt;

      this.signingLinks.set(linkToken, {
        workflowId,
        participantId: participant.participantId,
        expiresAt
      });

      // In production, send email with signing link
      this.logger.log(`Signing link generated for: ${participant.email}`);
    }

    const envelope = Array.from(this.envelopes.values()).find(e => e.workflowId === workflowId);
    if (envelope) {
      envelope.auditTrail.push({
        event: 'SIGNATURE_REQUEST_SENT',
        actor: 'system',
        timestamp: new Date()
      });
    }

    this.logger.log(`Signature requests sent: ${workflowId}`);

    return workflow;
  }

  /**
   * Records participant signature
   * @param workflowId - Workflow identifier
   * @param participantId - Participant identifier
   * @param signature - Signature data
   * @returns Updated workflow
   */
  async signDocument(
    workflowId: string,
    participantId: string,
    signature: string
  ): Promise<SignatureWorkflow> {
    const workflow = this.workflows.get(workflowId);
    if (!workflow) {
      throw new BadRequestException('Workflow not found');
    }

    // Find participant
    const participant = workflow.participants.find(p => p.participantId === participantId);
    if (!participant) {
      throw new BadRequestException('Participant not found');
    }

    if (new Date() > workflow.expiresAt) {
      workflow.status = SignatureWorkflowStatus.EXPIRED;
      throw new ForbiddenException('Workflow has expired');
    }

    // Update participant status
    participant.status = SignerStatus.SIGNED;
    participant.signature = signature;
    participant.signedAt = new Date();

    // Update workflow status
    const allSigned = workflow.participants.every(p => p.status === SignerStatus.SIGNED);
    if (allSigned) {
      workflow.status = SignatureWorkflowStatus.SIGNED;
    } else if (workflow.signingOrder === 'SEQUENTIAL') {
      const nextUnsigned = workflow.participants.find(p => p.status === SignerStatus.PENDING);
      if (nextUnsigned) {
        workflow.status = SignatureWorkflowStatus.IN_PROGRESS;
      }
    }

    // Update envelope
    const envelope = Array.from(this.envelopes.values()).find(e => e.workflowId === workflowId);
    if (envelope) {
      envelope.signatures.push({
        participantId,
        signature,
        timestamp: new Date()
      });

      envelope.auditTrail.push({
        event: 'DOCUMENT_SIGNED',
        actor: participantId,
        timestamp: new Date()
      });

      if (allSigned) {
        envelope.completedAt = new Date();
        envelope.status = SignatureWorkflowStatus.COMPLETED;
      }
    }

    this.logger.log(`Document signed by participant: ${participantId}`);

    return workflow;
  }

  /**
   * Declines signature request
   * @param workflowId - Workflow identifier
   * @param participantId - Participant identifier
   * @param reason - Decline reason
   * @returns Updated workflow
   */
  async declineSignature(
    workflowId: string,
    participantId: string,
    reason: string
  ): Promise<SignatureWorkflow> {
    const workflow = this.workflows.get(workflowId);
    if (!workflow) {
      throw new BadRequestException('Workflow not found');
    }

    const participant = workflow.participants.find(p => p.participantId === participantId);
    if (!participant) {
      throw new BadRequestException('Participant not found');
    }

    participant.status = SignerStatus.DECLINED;
    participant.declineReason = reason;
    workflow.status = SignatureWorkflowStatus.REJECTED;

    const envelope = Array.from(this.envelopes.values()).find(e => e.workflowId === workflowId);
    if (envelope) {
      envelope.status = SignatureWorkflowStatus.REJECTED;
      envelope.auditTrail.push({
        event: 'SIGNATURE_DECLINED',
        actor: participantId,
        timestamp: new Date()
      });
    }

    this.logger.log(`Signature declined: ${workflowId} - ${reason}`);

    return workflow;
  }

  /**
   * Sends reminder to unsigned participants
   * @param workflowId - Workflow identifier
   * @returns Count of reminders sent
   */
  async sendReminder(workflowId: string): Promise<{ remindersSent: number; timestamp: Date }> {
    const workflow = this.workflows.get(workflowId);
    if (!workflow) {
      throw new BadRequestException('Workflow not found');
    }

    const pendingParticipants = workflow.participants.filter(p => p.status === SignerStatus.PENDING);
    let remindersSent = 0;

    for (const participant of pendingParticipants) {
      participant.lastReminderAt = new Date();
      remindersSent++;
      // In production, send email reminder
    }

    const envelope = Array.from(this.envelopes.values()).find(e => e.workflowId === workflowId);
    if (envelope) {
      envelope.auditTrail.push({
        event: 'REMINDER_SENT',
        actor: 'system',
        timestamp: new Date()
      });
    }

    this.logger.log(`Reminders sent: ${remindersSent} participants`);

    return {
      remindersSent,
      timestamp: new Date()
    };
  }

  /**
   * Cancels signature workflow
   * @param workflowId - Workflow identifier
   * @param reason - Cancellation reason
   * @returns Cancellation result
   */
  async cancelWorkflow(workflowId: string, reason: string): Promise<{ cancelled: boolean; timestamp: Date }> {
    const workflow = this.workflows.get(workflowId);
    if (!workflow) {
      throw new BadRequestException('Workflow not found');
    }

    workflow.status = SignatureWorkflowStatus.CANCELLED;

    const envelope = Array.from(this.envelopes.values()).find(e => e.workflowId === workflowId);
    if (envelope) {
      envelope.status = SignatureWorkflowStatus.CANCELLED;
      envelope.auditTrail.push({
        event: 'WORKFLOW_CANCELLED',
        actor: 'system',
        timestamp: new Date()
      });
    }

    this.logger.log(`Workflow cancelled: ${workflowId} - ${reason}`);

    return {
      cancelled: true,
      timestamp: new Date()
    };
  }

  /**
   * Gets workflow status
   * @param workflowId - Workflow identifier
   * @returns Workflow with status
   */
  async getWorkflowStatus(workflowId: string): Promise<SignatureWorkflow | null> {
    return this.workflows.get(workflowId) || null;
  }

  /**
   * Gets signing envelope
   * @param workflowId - Workflow identifier
   * @returns Signature envelope
   */
  async getSignatureEnvelope(workflowId: string): Promise<SignatureEnvelope | null> {
    return Array.from(this.envelopes.values()).find(e => e.workflowId === workflowId) || null;
  }

  /**
   * Downloads signed document
   * @param workflowId - Workflow identifier
   * @returns Signed document with all signatures
   */
  async downloadSignedDocument(workflowId: string): Promise<{
    documentId: string;
    workflowId: string;
    signatures: any[];
    completedAt: Date;
  }> {
    const workflow = this.workflows.get(workflowId);
    if (!workflow) {
      throw new BadRequestException('Workflow not found');
    }

    if (workflow.status !== SignatureWorkflowStatus.COMPLETED) {
      throw new ForbiddenException('Workflow is not yet completed');
    }

    const signatures = workflow.participants
      .filter(p => p.status === SignerStatus.SIGNED)
      .map(p => ({
        participantId: p.participantId,
        name: p.name,
        email: p.email,
        signedAt: p.signedAt,
        signature: p.signature
      }));

    const envelope = Array.from(this.envelopes.values()).find(e => e.workflowId === workflowId);

    return {
      documentId: workflow.documentId,
      workflowId,
      signatures,
      completedAt: envelope?.completedAt || new Date()
    };
  }

  /**
   * Gets workflow audit trail
   * @param workflowId - Workflow identifier
   * @returns Audit trail events
   */
  async getAuditTrail(workflowId: string): Promise<any[]> {
    const envelope = Array.from(this.envelopes.values()).find(e => e.workflowId === workflowId);
    return envelope ? [...envelope.auditTrail] : [];
  }

  /**
   * Validates signing link
   * @param linkToken - Link token
   * @returns Link validity
   */
  async validateSigningLink(linkToken: string): Promise<{
    valid: boolean;
    workflowId?: string;
    participantId?: string;
  }> {
    const linkInfo = this.signingLinks.get(linkToken);
    if (!linkInfo) {
      return { valid: false };
    }

    if (new Date() > linkInfo.expiresAt) {
      return { valid: false };
    }

    return {
      valid: true,
      workflowId: linkInfo.workflowId,
      participantId: linkInfo.participantId
    };
  }
}

export default ESignatureService;
