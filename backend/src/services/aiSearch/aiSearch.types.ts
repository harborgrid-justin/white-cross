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

export {
  SearchFilters,
  SemanticSearchParams,
  SearchResult,
  AdvancedSearchCriteria,
};