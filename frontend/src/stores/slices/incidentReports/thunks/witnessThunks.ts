/**
 * Incident Reports Store - Witness Statement Thunks
 *
 * Redux async thunks for witness statement operations
 *
 * @module stores/slices/incidentReports/thunks/witnessThunks
 */

import { createAsyncThunk } from '@reduxjs/toolkit';
import * as witnessActions from '@/lib/actions/incidents.witnesses';
import type { CreateWitnessStatementRequest } from '@/types/domain/incidents';
import type { WitnessStatement } from '@/lib/actions/incidents.types';
import toast from 'react-hot-toast';
import debug from 'debug';

const log = debug('whitecross:incident-reports-thunks:witnesses');

/**
 * Fetch witness statements for incident.
 *
 * Retrieves all witness statements associated with the specified incident report.
 * Includes statement content, witness information, timestamps, and verification status.
 *
 * @async
 * @function fetchWitnessStatements
 *
 * @param {string} incidentReportId - Incident report unique identifier
 *
 * @returns {Promise<WitnessStatement[]>} Array of witness statements
 *
 * @throws {Error} When incident not found or user lacks permissions
 *
 * @remarks
 * Witness statements are immutable once marked as verified. This ensures
 * audit trail integrity and prevents tampering with evidence.
 *
 * @example
 * ```typescript
 * // Load witness statements for incident detail view
 * dispatch(fetchWitnessStatements('incident-123'));
 * ```
 */
export const fetchWitnessStatements = createAsyncThunk(
  'incidentReports/fetchWitnessStatements',
  async (incidentReportId: string, { rejectWithValue }) => {
    try {
      log('Fetching witness statements for incident:', incidentReportId);
      const statements = await witnessActions.getWitnessStatements(incidentReportId);
      return statements;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch witness statements';
      log('Error fetching witness statements:', error);
      return rejectWithValue(errorMessage);
    }
  }
);

/**
 * Create witness statement.
 *
 * Records statement from student, staff member, parent, or other witness.
 * Captures statement content, witness information, and contact details.
 *
 * @async
 * @function createWitnessStatement
 *
 * @param {CreateWitnessStatementRequest} data - Witness statement data
 * @param {string} data.incidentReportId - Related incident ID
 * @param {string} data.witnessName - Name of witness providing statement
 * @param {('STUDENT'|'STAFF'|'PARENT'|'OTHER')} data.witnessType - Type of witness
 * @param {string} data.statement - Statement content
 * @param {string} [data.contactInfo] - Witness contact information
 *
 * @returns {Promise<WitnessStatement>} Created witness statement
 *
 * @throws {Error} When validation fails or API request fails
 *
 * @remarks
 * ## Verification Workflow
 *
 * 1. Statement is created in PENDING status
 * 2. Administrator reviews statement for completeness
 * 3. Administrator marks statement as VERIFIED
 * 4. Verified statements become immutable (audit trail preservation)
 *
 * ## Digital Signatures
 *
 * For legal compliance, witness statements can include digital signatures.
 * This provides non-repudiation and authenticity verification.
 *
 * @example
 * ```typescript
 * // Add teacher witness statement
 * dispatch(createWitnessStatement({
 *   incidentReportId: 'incident-123',
 *   witnessName: 'Jane Doe',
 *   witnessType: 'STAFF',
 *   statement: 'I observed the student fall from the swing...',
 *   contactInfo: 'jane.doe@school.edu'
 * }));
 * ```
 */
export const createWitnessStatement = createAsyncThunk(
  'incidentReports/createWitnessStatement',
  async (data: CreateWitnessStatementRequest, { rejectWithValue }) => {
    try {
      log('Creating witness statement:', data);
      const result = await witnessActions.addWitnessStatement(
        data.incidentReportId,
        data as Partial<WitnessStatement>
      );
      if (!result.success) {
        toast.error(result.error || 'Failed to add witness statement');
        return rejectWithValue(result.error || 'Failed to add witness statement');
      }
      toast.success('Witness statement added successfully');
      // Fetch the created statement if we have an ID
      if (result.id) {
        const statements = await witnessActions.getWitnessStatements(data.incidentReportId);
        const createdStatement = statements.find(s => s.id === result.id);
        if (createdStatement) {
          return createdStatement;
        }
      }
      return rejectWithValue('Failed to retrieve created witness statement');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to add witness statement';
      log('Error creating witness statement:', error);
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);
