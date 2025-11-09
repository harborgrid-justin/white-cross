/**
 * LOC: ADVCORRAPI001
 * File: /reuse/threat/composites/downstream/advanced-correlation-api-controllers.ts
 *
 * UPSTREAM (imports from):
 *   - ../advanced-threat-correlation-composite
 *   - @nestjs/common
 *   - @nestjs/swagger
 *
 * DOWNSTREAM (imported by):
 *   - NestJS application modules
 *   - API route handlers
 *   - GraphQL resolvers
 *   - WebSocket gateways
 */

/**
 * File: /reuse/threat/composites/downstream/advanced-correlation-api-controllers.ts
 * Locator: WC-DOWNSTREAM-ADVCORRAPI-001
 * Purpose: Advanced Correlation API Controllers - REST API controllers for threat correlation
 *
 * Upstream: advanced-threat-correlation-composite
 * Downstream: NestJS modules, API routes, GraphQL resolvers
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, @nestjs/swagger
 * Exports: Comprehensive REST API controllers for advanced threat correlation and graph analysis
 *
 * LLM Context: Production-ready REST API controllers for White Cross healthcare threat intelligence platform.
 * Provides comprehensive RESTful endpoints for multi-dimensional correlation, IOC relationship discovery,
 * temporal analysis, spatial correlation, behavioral pattern matching, graph analysis, and attribution analysis.
 * HIPAA-compliant with comprehensive logging, error handling, and audit trails.
 */

import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  HttpStatus,
  HttpException,
  Logger,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';

// Import from advanced threat correlation composite
import {
  apiCorrelateThreatsByAttributes,
  apiCalculateWeightedCorrelation,
  apiCrossReferenceIOCs,
  apiBuildCorrelationMatrix,
  apiFindCorrelationClusters,
  apiScoreCorrelationStrength,
  apiNormalizeCorrelationData,
  apiAggregateCorrelationResults,
  apiDiscoverIOCRelationships,
  apiCalculateRelationshipStrength,
  apiBuildRelationshipGraph,
  apiFindConnectedIOCs,
  apiDetectIOCClusters,
  apiAnalyzeGraphConnectivity,
  apiExtractRelationshipPaths,
  apiScoreRelationshipConfidence,
  apiAnalyzeTemporalPatterns,
  apiCorrelateEventSequences,
  apiDetectTimeBasedClusters,
  apiCalculateTemporalProximity,
  apiBuildTimelineCorrelation,
  apiFindTemporalAnomalies,
  apiAggregateTimeWindows,
  apiScoreTemporalRelevance,
  apiCorrelateByGeoLocation,
  apiCalculateGeoProximity,
  apiClusterByRegion,
  apiDetectGeoAnomalies,
  apiBuildSpatialHeatmap,
  apiScoreGeoCorrelation,
  apiCorrelateBehaviorPatterns,
  apiDetectBehavioralAnomalies,
  apiFingerprintThreatBehavior,
  apiMatchBehaviorSignatures,
  apiScoreBehaviorSimilarity,
  apiClassifyThreatBehavior,
  apiCreateThreatGraph,
  apiAddNode,
  apiAddEdge,
  apiBuildGraphFromIndicators,
  apiMergeGraphs,
  apiFilterGraph,
  apiBreadthFirstSearch,
  apiDepthFirstSearch,
  apiGetNeighbors,
  apiFindAllPaths,
  apiFindShortestPath,
  apiCalculateCentrality,
  apiDetectCommunities,
  apiAnalyzeGraphDensity,
  apiExtractSubgraphs,
  apiCalculateCorrelationConfidence,
  apiWeightEvidenceSources,
  apiAggregateConfidenceScores,
  apiCalculateConfidenceInterval,
  apiNormalizeConfidenceMetrics,
  apiCreateAttributionAnalysis,
  apiCalculateMultiFactorAttribution,
} from '../advanced-threat-correlation-composite';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export class CorrelationRequestDto {
  threats: any[];
  dimensions: string[];
  algorithm?: 'pearson' | 'cosine' | 'jaccard' | 'euclidean';
  threshold?: number;
  normalize?: boolean;
}

export class IOCRelationshipRequestDto {
  iocs: string[];
  depth?: number;
}

export class TemporalAnalysisRequestDto {
  events: any[];
  window: {
    start: Date;
    end: Date;
    duration: number;
    unit: string;
  };
}

export class SpatialCorrelationRequestDto {
  entityLocations: Record<string, any>;
  radiusKm: number;
}

export class BehavioralPatternRequestDto {
  entityBehaviors: Record<string, string[]>;
  threshold?: number;
}

export class GraphAnalysisRequestDto {
  graph: any;
  startNodeId?: string;
  targetNodeId?: string;
}

export class AttributionRequestDto {
  targetId: string;
  targetType: 'campaign' | 'incident' | 'malware' | 'attack' | 'infrastructure';
  analysisMethod?: 'automated' | 'manual' | 'hybrid';
}

// ============================================================================
// NESTJS CONTROLLERS
// ============================================================================

@Controller('api/v1/correlation')
@ApiTags('Multi-Dimensional Correlation')
@ApiSecurity('bearerAuth')
@UsePipes(new ValidationPipe({ transform: true }))
export class CorrelationController {
  private readonly logger = new Logger(CorrelationController.name);

  @Post('multi-dimensional')
  @ApiOperation({ summary: 'Correlate threats across multiple dimensions' })
  @ApiResponse({ status: 200, description: 'Correlation results' })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  async correlateMultiDimensional(@Body() dto: CorrelationRequestDto) {
    try {
      return await apiCorrelateThreatsByAttributes(
        dto.threats,
        dto.dimensions,
        dto.algorithm || 'jaccard',
        dto.threshold || 0.5,
        dto.normalize || false
      );
    } catch (error) {
      this.logger.error(`Multi-dimensional correlation failed: ${error.message}`);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('weighted')
  @ApiOperation({ summary: 'Calculate weighted correlation' })
  @ApiResponse({ status: 200, description: 'Weighted correlation score' })
  async calculateWeighted(@Body() body: { entity1: any; entity2: any; weights: Record<string, number> }) {
    try {
      return await apiCalculateWeightedCorrelation(body.entity1, body.entity2, body.weights);
    } catch (error) {
      this.logger.error(`Weighted correlation failed: ${error.message}`);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('ioc-cross-reference')
  @ApiOperation({ summary: 'Cross-reference IOCs across sources' })
  @ApiResponse({ status: 200, description: 'Cross-reference results' })
  async crossReferenceIOCs(@Body() body: { iocs: string[]; sources: string[] }) {
    try {
      return await apiCrossReferenceIOCs(body.iocs, body.sources);
    } catch (error) {
      this.logger.error(`IOC cross-reference failed: ${error.message}`);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('matrix')
  @ApiOperation({ summary: 'Build correlation matrix' })
  @ApiResponse({ status: 200, description: 'Correlation matrix' })
  async buildMatrix(@Body() body: { entities: any[]; dimensions: string[] }) {
    try {
      return await apiBuildCorrelationMatrix(body.entities, body.dimensions);
    } catch (error) {
      this.logger.error(`Matrix building failed: ${error.message}`);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('clusters')
  @ApiOperation({ summary: 'Find correlation clusters' })
  @ApiResponse({ status: 200, description: 'Correlation clusters' })
  async findClusters(@Body() body: { correlations: any[]; threshold: number }) {
    try {
      return await apiFindCorrelationClusters(body.correlations, body.threshold);
    } catch (error) {
      this.logger.error(`Cluster detection failed: ${error.message}`);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}

@Controller('api/v1/ioc')
@ApiTags('IOC Relationships')
@ApiSecurity('bearerAuth')
export class IOCRelationshipController {
  private readonly logger = new Logger(IOCRelationshipController.name);

  @Post('discover-relationships')
  @ApiOperation({ summary: 'Discover IOC relationships' })
  @ApiResponse({ status: 200, description: 'Discovered relationships' })
  async discoverRelationships(@Body() dto: IOCRelationshipRequestDto) {
    try {
      return await apiDiscoverIOCRelationships(dto.iocs, dto.depth || 2);
    } catch (error) {
      this.logger.error(`Relationship discovery failed: ${error.message}`);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('relationship-strength')
  @ApiOperation({ summary: 'Calculate relationship strength' })
  @ApiResponse({ status: 200, description: 'Relationship strength' })
  async calculateStrength(@Body() body: { ioc1: string; ioc2: string; evidence: any[] }) {
    try {
      return await apiCalculateRelationshipStrength(body.ioc1, body.ioc2, body.evidence);
    } catch (error) {
      this.logger.error(`Strength calculation failed: ${error.message}`);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('relationship-graph')
  @ApiOperation({ summary: 'Build relationship graph' })
  @ApiResponse({ status: 200, description: 'Relationship graph' })
  async buildGraph(@Body() body: { relationships: any[] }) {
    try {
      return await apiBuildRelationshipGraph(body.relationships);
    } catch (error) {
      this.logger.error(`Graph building failed: ${error.message}`);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('connected')
  @ApiOperation({ summary: 'Find connected IOCs' })
  @ApiResponse({ status: 200, description: 'Connected IOCs' })
  @ApiQuery({ name: 'iocId', required: true })
  @ApiQuery({ name: 'maxDistance', required: false })
  async findConnected(@Query('iocId') iocId: string, @Query('maxDistance') maxDistance?: number) {
    try {
      return await apiFindConnectedIOCs(iocId, maxDistance || 1);
    } catch (error) {
      this.logger.error(`Connected IOCs search failed: ${error.message}`);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}

@Controller('api/v1/temporal')
@ApiTags('Temporal Analysis')
@ApiSecurity('bearerAuth')
export class TemporalAnalysisController {
  private readonly logger = new Logger(TemporalAnalysisController.name);

  @Post('analyze-patterns')
  @ApiOperation({ summary: 'Analyze temporal patterns' })
  @ApiResponse({ status: 200, description: 'Temporal analysis results' })
  async analyzePatterns(@Body() dto: TemporalAnalysisRequestDto) {
    try {
      return await apiAnalyzeTemporalPatterns(dto.events, dto.window);
    } catch (error) {
      this.logger.error(`Temporal analysis failed: ${error.message}`);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('correlate-sequences')
  @ApiOperation({ summary: 'Correlate event sequences' })
  @ApiResponse({ status: 200, description: 'Sequence correlations' })
  async correlateSequences(
    @Body() body: { events: any[]; expectedSequence: string[]; maxGap?: number }
  ) {
    try {
      return await apiCorrelateEventSequences(
        body.events,
        body.expectedSequence,
        body.maxGap || 3600000
      );
    } catch (error) {
      this.logger.error(`Sequence correlation failed: ${error.message}`);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('time-clusters')
  @ApiOperation({ summary: 'Detect time-based clusters' })
  @ApiResponse({ status: 200, description: 'Time-based clusters' })
  async detectTimeClusters(@Body() body: { events: any[]; timeThreshold: number }) {
    try {
      return await apiDetectTimeBasedClusters(body.events, body.timeThreshold);
    } catch (error) {
      this.logger.error(`Time cluster detection failed: ${error.message}`);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('anomalies')
  @ApiOperation({ summary: 'Find temporal anomalies' })
  @ApiResponse({ status: 200, description: 'Detected anomalies' })
  async findAnomalies(@Body() body: { events: any[]; threshold?: number }) {
    try {
      return await apiFindTemporalAnomalies(body.events, body.threshold || 2.0);
    } catch (error) {
      this.logger.error(`Anomaly detection failed: ${error.message}`);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}

@Controller('api/v1/spatial')
@ApiTags('Spatial Analysis')
@ApiSecurity('bearerAuth')
export class SpatialAnalysisController {
  private readonly logger = new Logger(SpatialAnalysisController.name);

  @Post('correlate-geolocation')
  @ApiOperation({ summary: 'Correlate by geolocation' })
  @ApiResponse({ status: 200, description: 'Spatial correlation results' })
  async correlateGeoLocation(@Body() dto: SpatialCorrelationRequestDto) {
    try {
      return await apiCorrelateByGeoLocation(dto.entityLocations, dto.radiusKm);
    } catch (error) {
      this.logger.error(`Spatial correlation failed: ${error.message}`);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('geo-proximity')
  @ApiOperation({ summary: 'Calculate geographic proximity' })
  @ApiResponse({ status: 200, description: 'Distance in kilometers' })
  async calculateProximity(@Body() body: { location1: any; location2: any }) {
    try {
      return await apiCalculateGeoProximity(body.location1, body.location2);
    } catch (error) {
      this.logger.error(`Proximity calculation failed: ${error.message}`);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('cluster-by-region')
  @ApiOperation({ summary: 'Cluster by region' })
  @ApiResponse({ status: 200, description: 'Geographic clusters' })
  async clusterRegion(@Body() body: { entityLocations: Record<string, any>; radiusKm: number }) {
    try {
      return await apiClusterByRegion(body.entityLocations, body.radiusKm);
    } catch (error) {
      this.logger.error(`Region clustering failed: ${error.message}`);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('heatmap')
  @ApiOperation({ summary: 'Build spatial heatmap' })
  @ApiResponse({ status: 200, description: 'Heatmap data' })
  async buildHeatmap(@Body() body: { locations: any[]; gridSize?: number }) {
    try {
      return await apiBuildSpatialHeatmap(body.locations, body.gridSize || 100);
    } catch (error) {
      this.logger.error(`Heatmap generation failed: ${error.message}`);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}

@Controller('api/v1/behavioral')
@ApiTags('Behavioral Analysis')
@ApiSecurity('bearerAuth')
export class BehavioralAnalysisController {
  private readonly logger = new Logger(BehavioralAnalysisController.name);

  @Post('correlate-patterns')
  @ApiOperation({ summary: 'Correlate behavior patterns' })
  @ApiResponse({ status: 200, description: 'Behavior patterns' })
  async correlatePatterns(@Body() dto: BehavioralPatternRequestDto) {
    try {
      return await apiCorrelateBehaviorPatterns(dto.entityBehaviors, dto.threshold || 0.7);
    } catch (error) {
      this.logger.error(`Behavioral correlation failed: ${error.message}`);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('detect-anomalies')
  @ApiOperation({ summary: 'Detect behavioral anomalies' })
  @ApiResponse({ status: 200, description: 'Behavioral anomalies' })
  async detectAnomalies(
    @Body() body: { entityId: string; observedBehavior: string[]; baselineBehavior: string[] }
  ) {
    try {
      return await apiDetectBehavioralAnomalies(
        body.entityId,
        body.observedBehavior,
        body.baselineBehavior
      );
    } catch (error) {
      this.logger.error(`Anomaly detection failed: ${error.message}`);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('fingerprint')
  @ApiOperation({ summary: 'Fingerprint threat behavior' })
  @ApiResponse({ status: 200, description: 'Behavior fingerprint' })
  async fingerprintBehavior(@Body() body: { behaviors: string[]; windowSize?: number }) {
    try {
      return await apiFingerprintThreatBehavior(body.behaviors, body.windowSize || 5);
    } catch (error) {
      this.logger.error(`Behavior fingerprinting failed: ${error.message}`);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('classify')
  @ApiOperation({ summary: 'Classify threat behavior' })
  @ApiResponse({ status: 200, description: 'Classification results' })
  async classifyBehavior(
    @Body() body: { behaviors: string[]; categorySignatures: Record<string, string[]> }
  ) {
    try {
      return await apiClassifyThreatBehavior(body.behaviors, body.categorySignatures);
    } catch (error) {
      this.logger.error(`Behavior classification failed: ${error.message}`);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}

@Controller('api/v1/graph')
@ApiTags('Graph Analysis')
@ApiSecurity('bearerAuth')
export class GraphAnalysisController {
  private readonly logger = new Logger(GraphAnalysisController.name);

  @Post('create')
  @ApiOperation({ summary: 'Create threat graph' })
  @ApiResponse({ status: 201, description: 'Graph created' })
  async createGraph() {
    try {
      return await apiCreateThreatGraph();
    } catch (error) {
      this.logger.error(`Graph creation failed: ${error.message}`);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('build-from-indicators')
  @ApiOperation({ summary: 'Build graph from indicators' })
  @ApiResponse({ status: 200, description: 'Graph built from indicators' })
  async buildFromIndicators(@Body() body: { indicators: any[] }) {
    try {
      return await apiBuildGraphFromIndicators(body.indicators);
    } catch (error) {
      this.logger.error(`Graph building failed: ${error.message}`);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('shortest-path')
  @ApiOperation({ summary: 'Find shortest path' })
  @ApiResponse({ status: 200, description: 'Shortest path' })
  async findShortestPath(@Body() body: { sourceId: string; targetId: string; graph: any }) {
    try {
      return await apiFindShortestPath(body.sourceId, body.targetId, body.graph);
    } catch (error) {
      this.logger.error(`Path finding failed: ${error.message}`);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('centrality')
  @ApiOperation({ summary: 'Calculate centrality metrics' })
  @ApiResponse({ status: 200, description: 'Centrality scores' })
  async calculateCentrality(@Body() body: { graph: any }) {
    try {
      return await apiCalculateCentrality(body.graph);
    } catch (error) {
      this.logger.error(`Centrality calculation failed: ${error.message}`);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('communities')
  @ApiOperation({ summary: 'Detect threat communities' })
  @ApiResponse({ status: 200, description: 'Detected communities' })
  async detectCommunities(@Body() body: { graph: any; minCommunitySize?: number }) {
    try {
      return await apiDetectCommunities(body.graph, body.minCommunitySize || 3);
    } catch (error) {
      this.logger.error(`Community detection failed: ${error.message}`);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}

@Controller('api/v1/attribution')
@ApiTags('Attribution Analysis')
@ApiSecurity('bearerAuth')
export class AttributionAnalysisController {
  private readonly logger = new Logger(AttributionAnalysisController.name);

  @Post('create')
  @ApiOperation({ summary: 'Create attribution analysis' })
  @ApiResponse({ status: 201, description: 'Attribution analysis created' })
  async createAnalysis(@Body() dto: AttributionRequestDto) {
    try {
      return await apiCreateAttributionAnalysis(
        dto.targetId,
        dto.targetType,
        dto.analysisMethod || 'automated'
      );
    } catch (error) {
      this.logger.error(`Attribution analysis creation failed: ${error.message}`);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('multi-factor')
  @ApiOperation({ summary: 'Calculate multi-factor attribution' })
  @ApiResponse({ status: 200, description: 'Attribution score and breakdown' })
  async calculateMultiFactor(@Body() body: { factors: any[] }) {
    try {
      return await apiCalculateMultiFactorAttribution(body.factors);
    } catch (error) {
      this.logger.error(`Multi-factor attribution failed: ${error.message}`);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export const CorrelationControllers = [
  CorrelationController,
  IOCRelationshipController,
  TemporalAnalysisController,
  SpatialAnalysisController,
  BehavioralAnalysisController,
  GraphAnalysisController,
  AttributionAnalysisController,
];

export default CorrelationControllers;
