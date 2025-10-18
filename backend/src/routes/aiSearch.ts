/**
 * LOC: 7334715B3A
 * WC-RTE-AIS-040 | aiSearch.ts - AI-Powered Patient Search API Routes
 *
 * UPSTREAM (imports from):
 *   - aiSearchService.ts (services/aiSearchService.ts)
 *
 * DOWNSTREAM (imported by):
 *   - index.ts (index.ts)
 */

/**
 * WC-RTE-AIS-040 | aiSearch.ts - AI-Powered Patient Search API Routes
 * Purpose: Advanced semantic search across patient records, medications, appointments, and health data using vector embeddings
 * Upstream: ../services/aiSearchService | Dependencies: @hapi/hapi, joi, openai, pgvector
 * Downstream: Frontend search components, AI assistant widgets | Called by: Search interface, mobile app
 * Related: students.ts, healthRecords.ts, medications.ts, appointments.ts, incidentReports.ts
 * Exports: aiSearchRoutes | Key Services: Semantic search, similarity matching, intelligent filtering, search suggestions
 * Last Updated: 2025-10-18 | File Type: .ts | HIPAA: Contains sensitive patient data - secure search required
 * Critical Path: Search query → Vector embedding → Similarity search → Results ranking → Response formatting
 * LLM Context: AI-powered search system for healthcare records with natural language queries and semantic understanding
 */

import { ServerRoute } from '@hapi/hapi';
import { AISearchService } from '../services/aiSearchService';
import Joi from 'joi';

// Semantic search across all patient data
const semanticSearchHandler = async (request: any, h: any) => {
  try {
    const { query, filters, limit, threshold } = request.payload;
    const userId = request.auth.credentials?.userId;

    const results = await AISearchService.semanticSearch({
      query,
      filters,
      limit: limit || 10,
      threshold: threshold || 0.7,
      userId
    });

    return h.response({
      success: true,
      data: {
        results: results.results,
        total: results.total,
        query,
        processingTime: results.processingTime,
        suggestions: results.suggestions
      }
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(500);
  }
};

// Get search suggestions
const getSearchSuggestionsHandler = async (request: any, h: any) => {
  try {
    const { partial } = request.query;
    const userId = request.auth.credentials?.userId;

    const suggestions = await AISearchService.getSearchSuggestions(partial, userId);

    return h.response({
      success: true,
      data: { suggestions }
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(500);
  }
};

// Advanced patient finder with multiple criteria
const advancedPatientSearchHandler = async (request: any, h: any) => {
  try {
    const searchCriteria = request.payload;
    const userId = request.auth.credentials?.userId;

    const results = await AISearchService.advancedPatientSearch(searchCriteria, userId);

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

// Search similar cases based on symptoms or conditions
const findSimilarCasesHandler = async (request: any, h: any) => {
  try {
    const { patientId, symptoms, conditions, limit } = request.payload;
    const userId = request.auth.credentials?.userId;

    const similarCases = await AISearchService.findSimilarCases({
      patientId,
      symptoms,
      conditions,
      limit: limit || 5,
      userId
    });

    return h.response({
      success: true,
      data: { similarCases }
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(500);
  }
};

// Search medication interactions and alternatives
const medicationSearchHandler = async (request: any, h: any) => {
  try {
    const { medications, patientId, searchType } = request.payload;
    const userId = request.auth.credentials?.userId;

    const results = await AISearchService.medicationSearch({
      medications,
      patientId,
      searchType, // 'interactions', 'alternatives', 'side_effects'
      userId
    });

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

// Get search analytics and popular queries
const getSearchAnalyticsHandler = async (request: any, h: any) => {
  try {
    const { period, limit } = request.query;
    const userId = request.auth.credentials?.userId;

    const analytics = await AISearchService.getSearchAnalytics({
      period: period || 'week',
      limit: limit || 10,
      userId
    });

    return h.response({
      success: true,
      data: analytics
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(500);
  }
};

// Define AI search routes for Hapi
export const aiSearchRoutes: ServerRoute[] = [
  {
    method: 'POST',
    path: '/api/search/semantic',
    handler: semanticSearchHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'AI Search'],
      description: 'Semantic search across patient data',
      notes: 'Advanced AI-powered search using natural language queries across all patient records, medications, appointments, and health data.',
      validate: {
        payload: Joi.object({
          query: Joi.string().min(2).max(500).required().description('Natural language search query'),
          filters: Joi.object({
            dataTypes: Joi.array().items(Joi.string().valid('patients', 'appointments', 'medications', 'incidents', 'health_records')).optional(),
            dateRange: Joi.object({
              start: Joi.date().iso().optional(),
              end: Joi.date().iso().optional()
            }).optional(),
            studentIds: Joi.array().items(Joi.string()).optional(),
            nurseIds: Joi.array().items(Joi.string()).optional(),
            categories: Joi.array().items(Joi.string()).optional()
          }).optional(),
          limit: Joi.number().integer().min(1).max(50).default(10).description('Maximum number of results'),
          threshold: Joi.number().min(0).max(1).default(0.7).description('Similarity threshold for results')
        })
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': {
              description: 'Search results retrieved successfully',
              schema: Joi.object({
                success: Joi.boolean(),
                data: Joi.object({
                  results: Joi.array(),
                  total: Joi.number(),
                  query: Joi.string(),
                  processingTime: Joi.number(),
                  suggestions: Joi.array()
                })
              })
            },
            '400': { description: 'Invalid search parameters' },
            '401': { description: 'Authentication required' },
            '500': { description: 'Search service error' }
          }
        }
      }
    }
  },
  {
    method: 'GET',
    path: '/api/search/suggestions',
    handler: getSearchSuggestionsHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'AI Search'],
      description: 'Get search suggestions',
      notes: 'Returns intelligent search suggestions based on partial input and user context.',
      validate: {
        query: Joi.object({
          partial: Joi.string().min(1).max(100).required().description('Partial search term')
        })
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': { description: 'Search suggestions retrieved successfully' },
            '401': { description: 'Authentication required' },
            '500': { description: 'Suggestion service error' }
          }
        }
      }
    }
  },
  {
    method: 'POST',
    path: '/api/search/patients/advanced',
    handler: advancedPatientSearchHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'AI Search'],
      description: 'Advanced patient search with multiple criteria',
      notes: 'Complex patient search with demographic, medical, and behavioral criteria using AI matching.',
      validate: {
        payload: Joi.object({
          demographics: Joi.object({
            ageRange: Joi.object({
              min: Joi.number().integer().min(0).optional(),
              max: Joi.number().integer().max(100).optional()
            }).optional(),
            gender: Joi.string().valid('M', 'F', 'Other').optional(),
            grade: Joi.string().optional()
          }).optional(),
          medical: Joi.object({
            conditions: Joi.array().items(Joi.string()).optional(),
            medications: Joi.array().items(Joi.string()).optional(),
            allergies: Joi.array().items(Joi.string()).optional(),
            riskFactors: Joi.array().items(Joi.string()).optional()
          }).optional(),
          behavioral: Joi.object({
            frequentVisitor: Joi.boolean().optional(),
            complianceLevel: Joi.string().valid('HIGH', 'MEDIUM', 'LOW').optional(),
            appointmentHistory: Joi.string().valid('REGULAR', 'IRREGULAR', 'NEW').optional()
          }).optional(),
          timeframe: Joi.object({
            start: Joi.date().iso().optional(),
            end: Joi.date().iso().optional()
          }).optional(),
          limit: Joi.number().integer().min(1).max(100).default(20)
        })
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': { description: 'Advanced search results retrieved successfully' },
            '400': { description: 'Invalid search criteria' },
            '401': { description: 'Authentication required' },
            '500': { description: 'Search service error' }
          }
        }
      }
    }
  },
  {
    method: 'POST',
    path: '/api/search/similar-cases',
    handler: findSimilarCasesHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'AI Search'],
      description: 'Find similar medical cases',
      notes: 'Uses AI to find patients with similar symptoms, conditions, or treatment patterns for clinical insights.',
      validate: {
        payload: Joi.object({
          patientId: Joi.string().optional().description('Base patient for similarity comparison'),
          symptoms: Joi.array().items(Joi.string()).optional().description('List of symptoms to match'),
          conditions: Joi.array().items(Joi.string()).optional().description('Medical conditions to match'),
          treatments: Joi.array().items(Joi.string()).optional().description('Treatment patterns to match'),
          limit: Joi.number().integer().min(1).max(20).default(5).description('Maximum similar cases to return'),
          threshold: Joi.number().min(0).max(1).default(0.8).description('Similarity threshold')
        })
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': { description: 'Similar cases found successfully' },
            '400': { description: 'Invalid search parameters' },
            '401': { description: 'Authentication required' },
            '500': { description: 'Similarity search error' }
          }
        }
      }
    }
  },
  {
    method: 'POST',
    path: '/api/search/medications',
    handler: medicationSearchHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'AI Search'],
      description: 'Search medication interactions and alternatives',
      notes: 'AI-powered medication search for drug interactions, alternatives, and side effect analysis.',
      validate: {
        payload: Joi.object({
          medications: Joi.array().items(Joi.string()).required().description('List of medications to analyze'),
          patientId: Joi.string().optional().description('Patient context for personalized results'),
          searchType: Joi.string().valid('interactions', 'alternatives', 'side_effects', 'contraindications').required(),
          severity: Joi.string().valid('ALL', 'MAJOR', 'MODERATE', 'MINOR').default('ALL').optional()
        })
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': { description: 'Medication analysis completed successfully' },
            '400': { description: 'Invalid medication search parameters' },
            '401': { description: 'Authentication required' },
            '500': { description: 'Medication search service error' }
          }
        }
      }
    }
  },
  {
    method: 'GET',
    path: '/api/search/analytics',
    handler: getSearchAnalyticsHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'AI Search'],
      description: 'Get search analytics and trends',
      notes: 'Returns analytics on search patterns, popular queries, and usage trends for system optimization.',
      validate: {
        query: Joi.object({
          period: Joi.string().valid('day', 'week', 'month', 'year').default('week').description('Analytics time period'),
          limit: Joi.number().integer().min(1).max(50).default(10).description('Number of top queries to return')
        })
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': { description: 'Search analytics retrieved successfully' },
            '401': { description: 'Authentication required' },
            '500': { description: 'Analytics service error' }
          }
        }
      }
    }
  }
];
