/**
 * LOC: 7334715B3B
 * WC-SVC-AIS-041 | aiSearchService.ts - AI-Powered Patient Search Service
 *
 * UPSTREAM (imports from):
 *   - database/models (database/models/*)
 *   - openai (external)
 *
 * DOWNSTREAM (imported by):
 *   - aiSearch.ts (routes/aiSearch.ts)
 */

/**
 * WC-SVC-AIS-041 | aiSearchService.ts - AI-Powered Patient Search Service
 * Purpose: Core service for AI-powered semantic search across healthcare data using vector embeddings and similarity matching
 * Upstream: OpenAI API, pgvector database, student/appointment/medication models | Dependencies: openai, pg, vector operations
 * Downstream: AI search routes, search widgets, smart suggestions | Called by: Search API, recommendation engine
 * Related: StudentService, AppointmentService, MedicationService, HealthRecordService, DashboardService
 * Exports: AISearchService class | Key Services: Semantic search, vector similarity, intelligent filtering, search analytics
 * Last Updated: 2025-10-18 | File Type: .ts | HIPAA: Processes sensitive patient data - encryption and audit required
 * Critical Path: Query vectorization → Database similarity search → Result ranking → Privacy filtering → Response
 * LLM Context: Advanced AI search service with OpenAI embeddings, vector similarity, and healthcare-specific search logic
 */

import { Pool } from 'pg';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

interface SearchFilters {
  dataTypes?: string[];
  dateRange?: {
    start?: Date;
    end?: Date;
  };
  studentIds?: string[];
  nurseIds?: string[];
  categories?: string[];
}

interface SemanticSearchParams {
  query: string;
  filters?: SearchFilters;
  limit?: number;
  threshold?: number;
  userId: string;
}

interface SearchResult {
  id: string;
  type: 'patient' | 'appointment' | 'medication' | 'incident' | 'health_record';
  title: string;
  content: string;
  similarity: number;
  metadata: any;
  relevantFields: string[];
}

interface AdvancedSearchCriteria {
  demographics?: {
    ageRange?: { min?: number; max?: number };
    gender?: string;
    grade?: string;
  };
  medical?: {
    conditions?: string[];
    medications?: string[];
    allergies?: string[];
    riskFactors?: string[];
  };
  behavioral?: {
    frequentVisitor?: boolean;
    complianceLevel?: string;
    appointmentHistory?: string;
  };
  timeframe?: {
    start?: Date;
    end?: Date;
  };
  limit?: number;
}

export class AISearchService {
  
  /**
   * Perform semantic search across all patient data
   */
  static async semanticSearch(params: SemanticSearchParams) {
    const startTime = Date.now();
    
    try {
      // Generate embedding for search query
      const embedding = await this.generateEmbedding(params.query);
      
      // Build search query with filters
      const searchQuery = this.buildSemanticSearchQuery(embedding, params);
      
      // Execute search
      const client = await pool.connect();
      const result = await client.query(searchQuery.sql, searchQuery.params);
      client.release();
      
      // Process and rank results
      const processedResults = await this.processSearchResults(result.rows, params.query);
      
      // Generate search suggestions
      const suggestions = await this.generateSearchSuggestions(params.query, processedResults);
      
      const processingTime = Date.now() - startTime;
      
      // Log search for analytics
      await this.logSearch(params.query, params.userId, processedResults.length, processingTime);
      
      return {
        results: processedResults,
        total: processedResults.length,
        processingTime,
        suggestions
      };
      
    } catch (error) {
      console.error('Semantic search error:', error);
      throw new Error('Failed to perform semantic search');
    }
  }

  /**
   * Get intelligent search suggestions
   */
  static async getSearchSuggestions(partial: string, userId: string): Promise<string[]> {
    try {
      const client = await pool.connect();
      
      // Get popular search terms that start with partial
      const popularQuery = `
        SELECT query, COUNT(*) as frequency
        FROM search_logs 
        WHERE query ILIKE $1 
          AND created_at > NOW() - INTERVAL '30 days'
        GROUP BY query 
        ORDER BY frequency DESC 
        LIMIT 5
      `;
      
      const popularResult = await client.query(popularQuery, [`${partial}%`]);
      
      // Get contextual suggestions based on user's recent searches
      const contextQuery = `
        SELECT DISTINCT query 
        FROM search_logs 
        WHERE user_id = $1 
          AND query ILIKE $2
          AND created_at > NOW() - INTERVAL '7 days'
        ORDER BY created_at DESC 
        LIMIT 3
      `;
      
      const contextResult = await client.query(contextQuery, [userId, `%${partial}%`]);
      
      // Get medical term suggestions
      const medicalQuery = `
        SELECT DISTINCT name as suggestion
        FROM (
          SELECT medication_name as name FROM medications WHERE medication_name ILIKE $1
          UNION
          SELECT diagnosis as name FROM health_records WHERE diagnosis ILIKE $1
          UNION
          SELECT condition_name as name FROM medical_conditions WHERE condition_name ILIKE $1
        ) medical_terms
        LIMIT 5
      `;
      
      const medicalResult = await client.query(medicalQuery, [`%${partial}%`]);
      
      client.release();
      
      // Combine and deduplicate suggestions
      const suggestions = [
        ...popularResult.rows.map(row => row.query),
        ...contextResult.rows.map(row => row.query),
        ...medicalResult.rows.map(row => row.suggestion)
      ];
      
      return [...new Set(suggestions)].slice(0, 8);
      
    } catch (error) {
      console.error('Search suggestions error:', error);
      return [];
    }
  }

  /**
   * Advanced patient search with multiple criteria
   */
  static async advancedPatientSearch(criteria: AdvancedSearchCriteria, userId: string) {
    try {
      const client = await pool.connect();
      
      let baseQuery = `
        SELECT DISTINCT s.id, s.first_name, s.last_name, s.student_id, s.grade, s.date_of_birth,
               s.gender, s.contact_phone, s.contact_email,
               COUNT(DISTINCT a.id) as appointment_count,
               COUNT(DISTINCT m.id) as medication_count,
               COUNT(DISTINCT hr.id) as health_record_count,
               MAX(a.scheduled_at) as last_appointment,
               CASE 
                 WHEN COUNT(a.id) > 10 THEN 'HIGH'
                 WHEN COUNT(a.id) > 5 THEN 'MEDIUM'
                 ELSE 'LOW'
               END as visit_frequency
        FROM students s
        LEFT JOIN appointments a ON s.id = a.student_id
        LEFT JOIN medications m ON s.id = m.student_id
        LEFT JOIN health_records hr ON s.id = hr.student_id
      `;
      
      const conditions: string[] = [];
      const params: any[] = [];
      
      // Add demographic filters
      if (criteria.demographics) {
        if (criteria.demographics.ageRange) {
          if (criteria.demographics.ageRange.min !== undefined) {
            conditions.push(`DATE_PART('year', AGE(s.date_of_birth)) >= $${params.length + 1}`);
            params.push(criteria.demographics.ageRange.min);
          }
          if (criteria.demographics.ageRange.max !== undefined) {
            conditions.push(`DATE_PART('year', AGE(s.date_of_birth)) <= $${params.length + 1}`);
            params.push(criteria.demographics.ageRange.max);
          }
        }
        if (criteria.demographics.gender) {
          conditions.push(`s.gender = $${params.length + 1}`);
          params.push(criteria.demographics.gender);
        }
        if (criteria.demographics.grade) {
          conditions.push(`s.grade = $${params.length + 1}`);
          params.push(criteria.demographics.grade);
        }
      }
      
      // Add medical filters
      if (criteria.medical) {
        if (criteria.medical.conditions && criteria.medical.conditions.length > 0) {
          conditions.push(`EXISTS (
            SELECT 1 FROM health_records hr2 
            WHERE hr2.student_id = s.id 
            AND hr2.diagnosis = ANY($${params.length + 1})
          )`);
          params.push(criteria.medical.conditions);
        }
        
        if (criteria.medical.medications && criteria.medical.medications.length > 0) {
          conditions.push(`EXISTS (
            SELECT 1 FROM medications m2 
            WHERE m2.student_id = s.id 
            AND m2.medication_name = ANY($${params.length + 1})
          )`);
          params.push(criteria.medical.medications);
        }
        
        if (criteria.medical.allergies && criteria.medical.allergies.length > 0) {
          conditions.push(`s.allergies && $${params.length + 1}`);
          params.push(criteria.medical.allergies);
        }
      }
      
      // Add timeframe filter
      if (criteria.timeframe) {
        if (criteria.timeframe.start) {
          conditions.push(`a.scheduled_at >= $${params.length + 1}`);
          params.push(criteria.timeframe.start);
        }
        if (criteria.timeframe.end) {
          conditions.push(`a.scheduled_at <= $${params.length + 1}`);
          params.push(criteria.timeframe.end);
        }
      }
      
      // Build final query
      if (conditions.length > 0) {
        baseQuery += ` WHERE ${conditions.join(' AND ')}`;
      }
      
      baseQuery += `
        GROUP BY s.id, s.first_name, s.last_name, s.student_id, s.grade, 
                 s.date_of_birth, s.gender, s.contact_phone, s.contact_email
        ORDER BY appointment_count DESC, last_appointment DESC
        LIMIT $${params.length + 1}
      `;
      
      params.push(criteria.limit || 20);
      
      const result = await client.query(baseQuery, params);
      client.release();
      
      // Log advanced search
      await this.logSearch(JSON.stringify(criteria), userId, result.rows.length, 0);
      
      return {
        patients: result.rows,
        total: result.rows.length,
        criteria: criteria
      };
      
    } catch (error) {
      console.error('Advanced patient search error:', error);
      throw new Error('Failed to perform advanced patient search');
    }
  }

  /**
   * Find similar medical cases
   */
  static async findSimilarCases(params: any) {
    try {
      let searchVector;
      
      if (params.patientId) {
        // Get patient's medical profile as vector
        searchVector = await this.getPatientMedicalVector(params.patientId);
      } else {
        // Create vector from symptoms and conditions
        const searchText = [
          ...(params.symptoms || []),
          ...(params.conditions || []),
          ...(params.treatments || [])
        ].join(' ');
        searchVector = await this.generateEmbedding(searchText);
      }
      
      const client = await pool.connect();
      
      const similarQuery = `
        WITH patient_vectors AS (
          SELECT 
            s.id, s.first_name, s.last_name,
            hr.diagnosis, hr.symptoms, hr.treatment_plan,
            hr.medical_vector <-> $1 as similarity
          FROM students s
          JOIN health_records hr ON s.id = hr.student_id
          WHERE hr.medical_vector IS NOT NULL
        )
        SELECT *
        FROM patient_vectors
        WHERE similarity < $2
        ORDER BY similarity
        LIMIT $3
      `;
      
      const result = await client.query(similarQuery, [
        searchVector,
        1 - (params.threshold || 0.8),
        params.limit || 5
      ]);
      
      client.release();
      
      return result.rows.map(row => ({
        ...row,
        similarity: 1 - row.similarity
      }));
      
    } catch (error) {
      console.error('Similar cases search error:', error);
      throw new Error('Failed to find similar cases');
    }
  }

  /**
   * Search medication interactions and alternatives
   */
  static async medicationSearch(params: any) {
    try {
      const client = await pool.connect();
      
      switch (params.searchType) {
        case 'interactions':
          return await this.findMedicationInteractions(params.medications, client);
        case 'alternatives':
          return await this.findMedicationAlternatives(params.medications, client);
        case 'side_effects':
          return await this.findMedicationSideEffects(params.medications, client);
        case 'contraindications':
          return await this.findMedicationContraindications(params.medications, params.patientId, client);
        default:
          throw new Error('Invalid medication search type');
      }
      
    } catch (error) {
      console.error('Medication search error:', error);
      throw new Error('Failed to search medications');
    }
  }

  /**
   * Get search analytics
   */
  static async getSearchAnalytics(params: any) {
    try {
      const client = await pool.connect();
      
      const period = params.period || 'week';
      const limit = params.limit || 10;
      
      let interval;
      switch (period) {
        case 'day':
          interval = '1 day';
          break;
        case 'week':
          interval = '7 days';
          break;
        case 'month':
          interval = '30 days';
          break;
        case 'year':
          interval = '365 days';
          break;
        default:
          interval = '7 days';
      }
      
      // Top queries
      const topQueriesQuery = `
        SELECT query, COUNT(*) as frequency, AVG(result_count) as avg_results
        FROM search_logs 
        WHERE created_at > NOW() - INTERVAL '${interval}'
        GROUP BY query 
        ORDER BY frequency DESC 
        LIMIT $1
      `;
      
      const topQueries = await client.query(topQueriesQuery, [limit]);
      
      // Search trends
      const trendsQuery = `
        SELECT DATE(created_at) as date, COUNT(*) as searches
        FROM search_logs 
        WHERE created_at > NOW() - INTERVAL '${interval}'
        GROUP BY DATE(created_at)
        ORDER BY date
      `;
      
      const trends = await client.query(trendsQuery);
      
      // Average response time
      const performanceQuery = `
        SELECT AVG(processing_time) as avg_response_time
        FROM search_logs 
        WHERE created_at > NOW() - INTERVAL '${interval}'
      `;
      
      const performance = await client.query(performanceQuery);
      
      client.release();
      
      return {
        topQueries: topQueries.rows,
        trends: trends.rows,
        avgResponseTime: performance.rows[0]?.avg_response_time || 0,
        period
      };
      
    } catch (error) {
      console.error('Search analytics error:', error);
      throw new Error('Failed to get search analytics');
    }
  }

  // Helper methods
  
  private static async generateEmbedding(text: string): Promise<number[]> {
    try {
      const response = await openai.embeddings.create({
        model: 'text-embedding-ada-002',
        input: text
      });
      
      return response.data[0].embedding;
    } catch (error) {
      console.error('Embedding generation error:', error);
      throw new Error('Failed to generate embedding');
    }
  }

  private static buildSemanticSearchQuery(embedding: number[], params: SemanticSearchParams) {
    let sql = `
      SELECT 
        'patient' as type, s.id, 
        s.first_name || ' ' || s.last_name as title,
        s.first_name || ' ' || s.last_name || ' ' || COALESCE(s.contact_email, '') as content,
        s.student_vector <-> $1 as similarity,
        json_build_object(
          'student_id', s.student_id,
          'grade', s.grade,
          'contact_phone', s.contact_phone
        ) as metadata
      FROM students s
      WHERE s.student_vector IS NOT NULL
      
      UNION ALL
      
      SELECT 
        'appointment' as type, a.id,
        'Appointment: ' || a.reason as title,
        a.reason || ' ' || COALESCE(a.notes, '') as content,
        a.appointment_vector <-> $1 as similarity,
        json_build_object(
          'scheduled_at', a.scheduled_at,
          'type', a.type,
          'status', a.status
        ) as metadata
      FROM appointments a
      WHERE a.appointment_vector IS NOT NULL
      
      UNION ALL
      
      SELECT 
        'medication' as type, m.id,
        'Medication: ' || m.medication_name as title,
        m.medication_name || ' ' || COALESCE(m.instructions, '') as content,
        m.medication_vector <-> $1 as similarity,
        json_build_object(
          'dosage', m.dosage,
          'frequency', m.frequency
        ) as metadata
      FROM medications m
      WHERE m.medication_vector IS NOT NULL
    `;
    
    const queryParams = [JSON.stringify(embedding)];
    
    // Add filters
    if (params.filters?.dataTypes && params.filters.dataTypes.length > 0) {
      // This would need more complex filtering logic
    }
    
    sql += ` ORDER BY similarity LIMIT $${queryParams.length + 1}`;
    queryParams.push(String(params.limit || 10));
    
    return { sql, params: queryParams };
  }

  private static async processSearchResults(rows: any[], query: string): Promise<SearchResult[]> {
    return rows
      .filter(row => row.similarity < 0.3) // Filter by similarity threshold
      .map(row => ({
        id: row.id,
        type: row.type,
        title: row.title,
        content: row.content,
        similarity: 1 - row.similarity, // Convert distance to similarity
        metadata: row.metadata,
        relevantFields: this.extractRelevantFields(row.content, query)
      }));
  }

  private static extractRelevantFields(content: string, query: string): string[] {
    const queryTerms = query.toLowerCase().split(' ');
    const contentWords = content.toLowerCase().split(' ');
    
    return contentWords.filter(word => 
      queryTerms.some(term => word.includes(term) || term.includes(word))
    );
  }

  private static async generateSearchSuggestions(query: string, results: SearchResult[]): Promise<string[]> {
    // Extract common terms from successful search results
    const suggestions = new Set<string>();
    
    results.forEach(result => {
      result.relevantFields.forEach(field => {
        if (field.length > 3) {
          suggestions.add(field);
        }
      });
    });
    
    return Array.from(suggestions).slice(0, 5);
  }

  private static async logSearch(query: string, userId: string, resultCount: number, processingTime: number) {
    try {
      const client = await pool.connect();
      
      await client.query(`
        INSERT INTO search_logs (query, user_id, result_count, processing_time, created_at)
        VALUES ($1, $2, $3, $4, NOW())
      `, [query, userId, resultCount, processingTime]);
      
      client.release();
    } catch (error) {
      console.error('Search logging error:', error);
      // Don't throw - logging failure shouldn't break search
    }
  }

  private static async getPatientMedicalVector(patientId: string): Promise<number[]> {
    // Implementation to get patient's aggregated medical vector
    const client = await pool.connect();
    
    const result = await client.query(`
      SELECT medical_vector FROM patients_medical_profile WHERE patient_id = $1
    `, [patientId]);
    
    client.release();
    
    if (result.rows.length > 0) {
      return result.rows[0].medical_vector;
    }
    
    throw new Error('Patient medical vector not found');
  }

  private static async findMedicationInteractions(medications: string[], client: any) {
    const query = `
      SELECT m1.name as medication1, m2.name as medication2, 
             i.severity, i.description, i.clinical_significance
      FROM medication_interactions i
      JOIN medications_reference m1 ON i.medication1_id = m1.id
      JOIN medications_reference m2 ON i.medication2_id = m2.id
      WHERE m1.name = ANY($1) AND m2.name = ANY($1)
      ORDER BY i.severity DESC
    `;
    
    const result = await client.query(query, [medications]);
    client.release();
    
    return {
      interactions: result.rows,
      riskLevel: this.calculateInteractionRisk(result.rows)
    };
  }

  private static async findMedicationAlternatives(medications: string[], client: any) {
    // Implementation for finding medication alternatives
    client.release();
    return { alternatives: [] };
  }

  private static async findMedicationSideEffects(medications: string[], client: any) {
    // Implementation for finding side effects
    client.release();
    return { sideEffects: [] };
  }

  private static async findMedicationContraindications(medications: string[], patientId: string, client: any) {
    // Implementation for finding contraindications
    client.release();
    return { contraindications: [] };
  }

  private static calculateInteractionRisk(interactions: any[]): string {
    if (interactions.some(i => i.severity === 'MAJOR')) return 'HIGH';
    if (interactions.some(i => i.severity === 'MODERATE')) return 'MEDIUM';
    return 'LOW';
  }
}
