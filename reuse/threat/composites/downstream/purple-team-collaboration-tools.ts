/**
 * LOC: PURPLETEAM001
 * File: /reuse/threat/composites/downstream/purple-team-collaboration-tools.ts
 *
 * UPSTREAM (imports from):
 *   - ../threat-detection-validation-composite
 *   - @nestjs/common
 */

import { Injectable, Controller, Post, Get, Body, Param, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, IsEnum } from 'class-validator';

export class CreateExerciseDto {
  @ApiProperty() @IsString() name: string;
  @ApiProperty() @IsString() scenario: string;
  @ApiProperty() @IsArray() objectives: string[];
  @ApiProperty() @IsEnum(['RED', 'BLUE', 'PURPLE']) teamType: string;
}

export class RecordFindingDto {
  @ApiProperty() @IsString() exerciseId: string;
  @ApiProperty() @IsString() findingType: string;
  @ApiProperty() @IsString() description: string;
  @ApiProperty() @IsString() severity: string;
}

@Injectable()
export class PurpleTeamCollaborationService {
  private readonly logger = new Logger(PurpleTeamCollaborationService.name);

  async createExercise(dto: CreateExerciseDto): Promise<any> {
    this.logger.log(`Creating purple team exercise: ${dto.name}`);

    return {
      exerciseId: `EX-${Date.now()}`,
      name: dto.name,
      scenario: dto.scenario,
      objectives: dto.objectives,
      teamType: dto.teamType,
      status: 'PLANNED',
      createdAt: new Date(),
      participants: [],
    };
  }

  async recordFinding(dto: RecordFindingDto): Promise<any> {
    this.logger.log(`Recording finding for exercise: ${dto.exerciseId}`);

    return {
      findingId: `FIND-${Date.now()}`,
      exerciseId: dto.exerciseId,
      type: dto.findingType,
      description: dto.description,
      severity: dto.severity,
      status: 'OPEN',
      recordedAt: new Date(),
      recommendations: this.generateRecommendations(dto.findingType),
    };
  }

  async generateCollaborationReport(exerciseId: string): Promise<any> {
    this.logger.log(`Generating collaboration report for: ${exerciseId}`);

    return {
      exerciseId,
      summary: 'Purple team exercise completed successfully',
      findingsCount: 12,
      detectionsValidated: 8,
      gapIdentified: 4,
      improvementAreas: ['Detection coverage', 'Response time', 'Tool integration'],
      redTeamEffectiveness: 0.85,
      blueTeamEffectiveness: 0.78,
      recommendations: this.generateExerciseRecommendations(),
      generatedAt: new Date(),
    };
  }

  private generateRecommendations(findingType: string): string[] {
    const recs: Record<string, string[]> = {
      DETECTION_GAP: ['Deploy additional detection rules', 'Enhance log collection'],
      RESPONSE_DELAY: ['Automate response workflow', 'Increase staffing'],
      TOOL_LIMITATION: ['Evaluate alternative tools', 'Request feature enhancements'],
    };
    return recs[findingType] || ['Review and address finding'];
  }

  private generateExerciseRecommendations(): string[] {
    return [
      'Schedule regular purple team exercises',
      'Expand attack scenario coverage',
      'Improve red-blue team communication',
      'Document lessons learned',
    ];
  }
}

@ApiTags('Purple Team Collaboration')
@Controller('api/v1/purple-team')
@ApiBearerAuth()
export class PurpleTeamCollaborationController {
  constructor(private readonly service: PurpleTeamCollaborationService) {}

  @Post('exercises/create')
  @ApiOperation({ summary: 'Create purple team exercise' })
  @ApiResponse({ status: 201, description: 'Exercise created' })
  async createExercise(@Body() dto: CreateExerciseDto) {
    return this.service.createExercise(dto);
  }

  @Post('findings/record')
  @ApiOperation({ summary: 'Record exercise finding' })
  @ApiResponse({ status: 201, description: 'Finding recorded' })
  async recordFinding(@Body() dto: RecordFindingDto) {
    return this.service.recordFinding(dto);
  }

  @Get('reports/:exerciseId')
  @ApiOperation({ summary: 'Generate collaboration report' })
  @ApiResponse({ status: 200, description: 'Report generated' })
  async generateReport(@Param('exerciseId') exerciseId: string) {
    return this.service.generateCollaborationReport(exerciseId);
  }
}

export default { service: PurpleTeamCollaborationService, controller: PurpleTeamCollaborationController };
