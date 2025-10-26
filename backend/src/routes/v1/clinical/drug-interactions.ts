import { ServerRoute } from '@hapi/hapi';
import Joi from 'joi';
import { DrugInteractionService } from '../../../services/clinical/DrugInteractionService';
import { InteractionSeverity } from '../../../database/models/clinical/DrugInteraction';

const drugInteractionService = new DrugInteractionService();

/**
 * Drug Interaction Routes
 * Feature 48: Drug Interaction Checker
 */
const drugInteractionRoutes: ServerRoute[] = [
  {
    method: 'GET',
    path: '/api/v1/clinical/drugs/search',
    options: {
      auth: 'jwt',
      description: 'Search drugs by name',
      notes: 'Returns drugs matching the search query',
      tags: ['api', 'clinical', 'drugs'],
      validate: {
        query: Joi.object({
          query: Joi.string().min(2).required(),
          limit: Joi.number().integer().min(1).max(100).default(20),
        }),
      },
    },
    handler: async (request, h) => {
      try {
        const { query, limit } = request.query;
        const drugs = await drugInteractionService.searchDrugs(query, limit);
        return h.response(drugs).code(200);
      } catch (error) {
        return h.response({ error: error.message }).code(400);
      }
    },
  },

  {
    method: 'GET',
    path: '/api/v1/clinical/drugs/rxnorm/{rxnormCode}',
    options: {
      auth: 'jwt',
      description: 'Search drug by RxNorm code',
      notes: 'Returns drug with specific RxNorm code',
      tags: ['api', 'clinical', 'drugs'],
      validate: {
        params: Joi.object({
          rxnormCode: Joi.string().required(),
        }),
      },
    },
    handler: async (request, h) => {
      try {
        const drug = await drugInteractionService.searchByRxNorm(request.params.rxnormCode);
        if (!drug) {
          return h.response({ error: 'Drug not found' }).code(404);
        }
        return h.response(drug).code(200);
      } catch (error) {
        return h.response({ error: error.message }).code(400);
      }
    },
  },

  {
    method: 'GET',
    path: '/api/v1/clinical/drugs/{id}',
    options: {
      auth: 'jwt',
      description: 'Get drug by ID',
      notes: 'Returns a single drug with full details',
      tags: ['api', 'clinical', 'drugs'],
      validate: {
        params: Joi.object({
          id: Joi.string().uuid().required(),
        }),
      },
    },
    handler: async (request, h) => {
      try {
        const drug = await drugInteractionService.getDrugById(request.params.id);
        if (!drug) {
          return h.response({ error: 'Drug not found' }).code(404);
        }
        return h.response(drug).code(200);
      } catch (error) {
        return h.response({ error: error.message }).code(400);
      }
    },
  },

  {
    method: 'POST',
    path: '/api/v1/clinical/drugs/interactions/check',
    options: {
      auth: 'jwt',
      description: 'Check drug interactions',
      notes: 'Checks for interactions between multiple drugs and allergies',
      tags: ['api', 'clinical', 'interactions'],
      validate: {
        payload: Joi.object({
          drugIds: Joi.array().items(Joi.string().uuid()).min(1).required(),
          studentId: Joi.string().uuid().optional(),
        }),
      },
    },
    handler: async (request, h) => {
      try {
        const result = await drugInteractionService.checkInteractions(request.payload as any);
        return h.response(result).code(200);
      } catch (error) {
        return h.response({ error: error.message }).code(400);
      }
    },
  },

  {
    method: 'POST',
    path: '/api/v1/clinical/drugs',
    options: {
      auth: 'jwt',
      description: 'Add new drug to catalog',
      notes: 'Creates a new drug entry in the catalog',
      tags: ['api', 'clinical', 'drugs'],
      validate: {
        payload: Joi.object({
          genericName: Joi.string().required(),
          brandNames: Joi.array().items(Joi.string()).optional(),
          rxnormCode: Joi.string().optional(),
          ndcCodes: Joi.array().items(Joi.string()).optional(),
          drugClass: Joi.string().optional(),
          description: Joi.string().optional(),
          administrationRoute: Joi.string().optional(),
          controlledSubstanceSchedule: Joi.string().optional(),
        }),
      },
    },
    handler: async (request, h) => {
      try {
        const drug = await drugInteractionService.addDrug(request.payload as any);
        return h.response(drug).code(201);
      } catch (error) {
        return h.response({ error: error.message }).code(400);
      }
    },
  },

  {
    method: 'PUT',
    path: '/api/v1/clinical/drugs/{id}',
    options: {
      auth: 'jwt',
      description: 'Update drug information',
      notes: 'Updates an existing drug in the catalog',
      tags: ['api', 'clinical', 'drugs'],
      validate: {
        params: Joi.object({
          id: Joi.string().uuid().required(),
        }),
        payload: Joi.object({
          genericName: Joi.string().optional(),
          brandNames: Joi.array().items(Joi.string()).optional(),
          rxnormCode: Joi.string().optional(),
          ndcCodes: Joi.array().items(Joi.string()).optional(),
          drugClass: Joi.string().optional(),
          description: Joi.string().optional(),
          administrationRoute: Joi.string().optional(),
          controlledSubstanceSchedule: Joi.string().optional(),
          isActive: Joi.boolean().optional(),
        }),
      },
    },
    handler: async (request, h) => {
      try {
        const drug = await drugInteractionService.updateDrug(request.params.id, request.payload as any);
        return h.response(drug).code(200);
      } catch (error) {
        if (error.message === 'Drug not found') {
          return h.response({ error: error.message }).code(404);
        }
        return h.response({ error: error.message }).code(400);
      }
    },
  },

  {
    method: 'POST',
    path: '/api/v1/clinical/drugs/interactions',
    options: {
      auth: 'jwt',
      description: 'Add drug interaction',
      notes: 'Creates a new drug-drug interaction record',
      tags: ['api', 'clinical', 'interactions'],
      validate: {
        payload: Joi.object({
          drug1Id: Joi.string().uuid().required(),
          drug2Id: Joi.string().uuid().required(),
          severity: Joi.string()
            .valid(...Object.values(InteractionSeverity))
            .required(),
          description: Joi.string().required(),
          clinicalEffects: Joi.string().optional(),
          management: Joi.string().optional(),
          references: Joi.array().items(Joi.string()).optional(),
          evidenceLevel: Joi.string().optional(),
        }),
      },
    },
    handler: async (request, h) => {
      try {
        const interaction = await drugInteractionService.addInteraction(request.payload as any);
        return h.response(interaction).code(201);
      } catch (error) {
        return h.response({ error: error.message }).code(400);
      }
    },
  },

  {
    method: 'PUT',
    path: '/api/v1/clinical/drugs/interactions/{id}',
    options: {
      auth: 'jwt',
      description: 'Update drug interaction',
      notes: 'Updates an existing drug interaction record',
      tags: ['api', 'clinical', 'interactions'],
      validate: {
        params: Joi.object({
          id: Joi.string().uuid().required(),
        }),
        payload: Joi.object({
          severity: Joi.string()
            .valid(...Object.values(InteractionSeverity))
            .optional(),
          description: Joi.string().optional(),
          clinicalEffects: Joi.string().optional(),
          management: Joi.string().optional(),
          references: Joi.array().items(Joi.string()).optional(),
          evidenceLevel: Joi.string().optional(),
        }),
      },
    },
    handler: async (request, h) => {
      try {
        const interaction = await drugInteractionService.updateInteraction(
          request.params.id,
          request.payload as any
        );
        return h.response(interaction).code(200);
      } catch (error) {
        if (error.message === 'Interaction not found') {
          return h.response({ error: error.message }).code(404);
        }
        return h.response({ error: error.message }).code(400);
      }
    },
  },

  {
    method: 'DELETE',
    path: '/api/v1/clinical/drugs/interactions/{id}',
    options: {
      auth: 'jwt',
      description: 'Delete drug interaction',
      notes: 'Deletes a drug interaction record',
      tags: ['api', 'clinical', 'interactions'],
      validate: {
        params: Joi.object({
          id: Joi.string().uuid().required(),
        }),
      },
    },
    handler: async (request, h) => {
      try {
        await drugInteractionService.deleteInteraction(request.params.id);
        return h.response({ message: 'Interaction deleted successfully' }).code(200);
      } catch (error) {
        if (error.message === 'Interaction not found') {
          return h.response({ error: error.message }).code(404);
        }
        return h.response({ error: error.message }).code(400);
      }
    },
  },

  {
    method: 'GET',
    path: '/api/v1/clinical/drugs/{drugId}/interactions',
    options: {
      auth: 'jwt',
      description: 'Get all interactions for a drug',
      notes: 'Returns all known interactions for a specific drug',
      tags: ['api', 'clinical', 'interactions'],
      validate: {
        params: Joi.object({
          drugId: Joi.string().uuid().required(),
        }),
      },
    },
    handler: async (request, h) => {
      try {
        const interactions = await drugInteractionService.getDrugInteractions(request.params.drugId);
        return h.response(interactions).code(200);
      } catch (error) {
        return h.response({ error: error.message }).code(400);
      }
    },
  },

  {
    method: 'POST',
    path: '/api/v1/clinical/drugs/allergies',
    options: {
      auth: 'jwt',
      description: 'Add student drug allergy',
      notes: 'Records a drug allergy for a student',
      tags: ['api', 'clinical', 'allergies'],
      validate: {
        payload: Joi.object({
          studentId: Joi.string().uuid().required(),
          drugId: Joi.string().uuid().required(),
          allergyType: Joi.string().required(),
          reaction: Joi.string().required(),
          severity: Joi.string().required(),
          notes: Joi.string().optional(),
          diagnosedDate: Joi.date().optional(),
          diagnosedBy: Joi.string().optional(),
        }),
      },
    },
    handler: async (request, h) => {
      try {
        const allergy = await drugInteractionService.addAllergy(request.payload as any);
        return h.response(allergy).code(201);
      } catch (error) {
        return h.response({ error: error.message }).code(400);
      }
    },
  },

  {
    method: 'PUT',
    path: '/api/v1/clinical/drugs/allergies/{id}',
    options: {
      auth: 'jwt',
      description: 'Update student drug allergy',
      notes: 'Updates an existing drug allergy record',
      tags: ['api', 'clinical', 'allergies'],
      validate: {
        params: Joi.object({
          id: Joi.string().uuid().required(),
        }),
        payload: Joi.object({
          allergyType: Joi.string().optional(),
          reaction: Joi.string().optional(),
          severity: Joi.string().optional(),
          notes: Joi.string().optional(),
          diagnosedDate: Joi.date().optional(),
          diagnosedBy: Joi.string().optional(),
        }),
      },
    },
    handler: async (request, h) => {
      try {
        const allergy = await drugInteractionService.updateAllergy(
          request.params.id,
          request.payload as any
        );
        return h.response(allergy).code(200);
      } catch (error) {
        if (error.message === 'Allergy not found') {
          return h.response({ error: error.message }).code(404);
        }
        return h.response({ error: error.message }).code(400);
      }
    },
  },

  {
    method: 'DELETE',
    path: '/api/v1/clinical/drugs/allergies/{id}',
    options: {
      auth: 'jwt',
      description: 'Delete student drug allergy',
      notes: 'Deletes a drug allergy record',
      tags: ['api', 'clinical', 'allergies'],
      validate: {
        params: Joi.object({
          id: Joi.string().uuid().required(),
        }),
      },
    },
    handler: async (request, h) => {
      try {
        await drugInteractionService.deleteAllergy(request.params.id);
        return h.response({ message: 'Allergy deleted successfully' }).code(200);
      } catch (error) {
        if (error.message === 'Allergy not found') {
          return h.response({ error: error.message }).code(404);
        }
        return h.response({ error: error.message }).code(400);
      }
    },
  },

  {
    method: 'GET',
    path: '/api/v1/clinical/drugs/allergies/student/{studentId}',
    options: {
      auth: 'jwt',
      description: 'Get student drug allergies',
      notes: 'Returns all drug allergies for a specific student',
      tags: ['api', 'clinical', 'allergies'],
      validate: {
        params: Joi.object({
          studentId: Joi.string().uuid().required(),
        }),
      },
    },
    handler: async (request, h) => {
      try {
        const allergies = await drugInteractionService.getStudentAllergies(request.params.studentId);
        return h.response(allergies).code(200);
      } catch (error) {
        return h.response({ error: error.message }).code(400);
      }
    },
  },

  {
    method: 'GET',
    path: '/api/v1/clinical/drugs/class/{drugClass}',
    options: {
      auth: 'jwt',
      description: 'Get drugs by class',
      notes: 'Returns all drugs in a specific drug class',
      tags: ['api', 'clinical', 'drugs'],
      validate: {
        params: Joi.object({
          drugClass: Joi.string().required(),
        }),
      },
    },
    handler: async (request, h) => {
      try {
        const drugs = await drugInteractionService.getDrugsByClass(request.params.drugClass);
        return h.response(drugs).code(200);
      } catch (error) {
        return h.response({ error: error.message }).code(400);
      }
    },
  },

  {
    method: 'GET',
    path: '/api/v1/clinical/drugs/controlled-substances',
    options: {
      auth: 'jwt',
      description: 'Get controlled substances',
      notes: 'Returns all controlled substances, optionally filtered by schedule',
      tags: ['api', 'clinical', 'drugs'],
      validate: {
        query: Joi.object({
          schedule: Joi.string().optional(),
        }),
      },
    },
    handler: async (request, h) => {
      try {
        const { schedule } = request.query;
        const drugs = await drugInteractionService.getControlledSubstances(schedule);
        return h.response(drugs).code(200);
      } catch (error) {
        return h.response({ error: error.message }).code(400);
      }
    },
  },

  {
    method: 'POST',
    path: '/api/v1/clinical/drugs/bulk-import',
    options: {
      auth: 'jwt',
      description: 'Bulk import drugs from FDA data',
      notes: 'Imports multiple drugs from FDA/RxNorm data',
      tags: ['api', 'clinical', 'drugs', 'admin'],
      validate: {
        payload: Joi.object({
          drugs: Joi.array()
            .items(
              Joi.object({
                genericName: Joi.string().required(),
                brandNames: Joi.array().items(Joi.string()).optional(),
                rxnormCode: Joi.string().optional(),
                ndcCodes: Joi.array().items(Joi.string()).optional(),
                drugClass: Joi.string().optional(),
                description: Joi.string().optional(),
                administrationRoute: Joi.string().optional(),
                controlledSubstanceSchedule: Joi.string().optional(),
              })
            )
            .required(),
        }),
      },
    },
    handler: async (request, h) => {
      try {
        const { drugs } = request.payload as any;
        const result = await drugInteractionService.bulkImportDrugs(drugs);
        return h.response(result).code(200);
      } catch (error) {
        return h.response({ error: error.message }).code(400);
      }
    },
  },

  {
    method: 'GET',
    path: '/api/v1/clinical/drugs/statistics',
    options: {
      auth: 'jwt',
      description: 'Get drug interaction statistics',
      notes: 'Returns statistics about drugs and interactions in the system',
      tags: ['api', 'clinical', 'drugs', 'statistics'],
    },
    handler: async (request, h) => {
      try {
        const stats = await drugInteractionService.getInteractionStatistics();
        return h.response(stats).code(200);
      } catch (error) {
        return h.response({ error: error.message }).code(400);
      }
    },
  },
];

export default drugInteractionRoutes;
