/**
 * @fileoverview Incident Status Controller
 * @module incident-report/controllers/incident-status.controller
 * @description HTTP endpoints for incident report status updates
 */

import { Body, Controller, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { IncidentStatusService } from '../services/incident-status.service';

/**
 * Incident Status Controller
 *
 * Handles status update operations for incident reports:
 * - Add follow-up notes
 * - Mark parent notified
 * - Add evidence
 * - Update insurance claim status
 * - Update compliance status
 * - Notify emergency contacts
 * - Notify parent
 */
@ApiTags('incident-reports-status')
@ApiBearerAuth()
@Controller('incident-reports')
export class IncidentStatusController {
  constructor(private readonly statusService: IncidentStatusService) {}

  @Post(':id/follow-up-notes')
  @ApiOperation({ summary: 'Add follow-up notes to incident report' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        notes: { type: 'string', description: 'Follow-up notes to add' },
      },
      required: ['notes'],
    },
  })
  @ApiResponse({ status: 200, description: 'Follow-up notes added successfully' })
  @ApiResponse({ status: 404, description: 'Incident report not found' })
  async addFollowUpNotes(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('notes') notes: string,
  ) {
    return this.statusService.addFollowUpNotes(id, notes);
  }

  @Post(':id/parent-notified')
  @ApiOperation({ summary: 'Mark parent as notified' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Parent marked as notified' })
  @ApiResponse({ status: 404, description: 'Incident report not found' })
  async markParentNotified(@Param('id', ParseUUIDPipe) id: string) {
    return this.statusService.markParentNotified(id);
  }

  @Post(':id/evidence')
  @ApiOperation({ summary: 'Add evidence to incident report' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        evidence: {
          type: 'array',
          items: { type: 'string' },
          description: 'Evidence items to add',
        },
      },
      required: ['evidence'],
    },
  })
  @ApiResponse({ status: 200, description: 'Evidence added successfully' })
  @ApiResponse({ status: 404, description: 'Incident report not found' })
  async addEvidence(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('evidence') evidence: string[],
  ) {
    return this.statusService.addEvidence(id, evidence);
  }

  @Patch(':id/insurance-claim')
  @ApiOperation({ summary: 'Update insurance claim status' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          enum: ['not_required', 'pending', 'submitted', 'approved', 'denied'],
          description: 'Insurance claim status',
        },
        claimNumber: { type: 'string', description: 'Insurance claim number' },
      },
      required: ['status'],
    },
  })
  @ApiResponse({ status: 200, description: 'Insurance claim status updated' })
  @ApiResponse({ status: 404, description: 'Incident report not found' })
  async updateInsuranceClaim(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: { status: string; claimNumber?: string },
  ) {
    return this.statusService.updateInsuranceClaim(id, data.status, data.claimNumber);
  }

  @Patch(':id/compliance')
  @ApiOperation({ summary: 'Update compliance status' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          enum: ['pending', 'in_progress', 'completed', 'overdue'],
          description: 'Compliance status',
        },
        notes: { type: 'string', description: 'Compliance notes' },
      },
      required: ['status'],
    },
  })
  @ApiResponse({ status: 200, description: 'Compliance status updated' })
  @ApiResponse({ status: 404, description: 'Incident report not found' })
  async updateComplianceStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: { status: string; notes?: string },
  ) {
    return this.statusService.updateComplianceStatus(id, data.status, data.notes);
  }

  @Post(':id/notify-emergency-contacts')
  @ApiOperation({ summary: 'Notify emergency contacts' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Emergency contacts notified' })
  @ApiResponse({ status: 404, description: 'Incident report not found' })
  async notifyEmergencyContacts(@Param('id', ParseUUIDPipe) id: string) {
    return this.statusService.notifyEmergencyContacts(id);
  }

  @Post(':id/notify-parent')
  @ApiOperation({ summary: 'Notify parent' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', description: 'Custom notification message' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Parent notified' })
  @ApiResponse({ status: 404, description: 'Incident report not found' })
  async notifyParent(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('message') message?: string,
  ) {
    return this.statusService.notifyParent(id, message);
  }
}