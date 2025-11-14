import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, Request, Version } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ChronicConditionService } from './chronic-condition.service';
import { CreateChronicConditionDto } from './dto/create-chronic-condition.dto';
import { UpdateChronicConditionDto } from './dto/update-chronic-condition.dto';
import { ChronicCondition   } from '@/database/models';

import { BaseController } from '@/common/base';
@ApiTags('chronic-conditions')
@ApiBearerAuth()

@Version('1')
@Controller('chronic-conditions')
export class HealthRecordChronicConditionController extends BaseController {
  constructor(
    private readonly chronicConditionService: ChronicConditionService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new chronic condition record' })
  @ApiResponse({
    status: 201,
    description: 'Chronic condition created successfully',
    type: ChronicCondition,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  async create(
    @Body() createDto: CreateChronicConditionDto,
    @Request() req: any,
  ): Promise<ChronicCondition> {
    return this.chronicConditionService.create(createDto, req.user);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all chronic conditions with optional filtering',
  })
  @ApiResponse({
    status: 200,
    description: 'List of chronic conditions',
    type: [ChronicCondition],
  })
  @ApiQuery({ name: 'studentId', required: false, type: String })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ['ACTIVE', 'MANAGED', 'RESOLVED', 'MONITORING'],
  })
  async findAll(
    @Request() req: any,
    @Query('studentId') studentId?: string,
    @Query('status') status?: string,
  ): Promise<ChronicCondition[]> {
    if (studentId) {
      return this.chronicConditionService.findByStudent(studentId, req.user);
    }
    return this.chronicConditionService.getChronicConditions();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get chronic condition by ID' })
  @ApiParam({ name: 'id', description: 'Chronic condition UUID' })
  @ApiResponse({
    status: 200,
    description: 'Chronic condition details',
    type: ChronicCondition,
  })
  @ApiResponse({ status: 404, description: 'Chronic condition not found' })
  async findById(
    @Param('id') id: string,
    @Request() req: any,
  ): Promise<ChronicCondition> {
    return this.chronicConditionService.findOne(id, req.user);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update chronic condition' })
  @ApiParam({ name: 'id', description: 'Chronic condition UUID' })
  @ApiResponse({
    status: 200,
    description: 'Chronic condition updated successfully',
    type: ChronicCondition,
  })
  @ApiResponse({ status: 404, description: 'Chronic condition not found' })
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateChronicConditionDto,
    @Request() req: any,
  ): Promise<ChronicCondition> {
    return this.chronicConditionService.update(id, updateDto, req.user);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete chronic condition' })
  @ApiParam({ name: 'id', description: 'Chronic condition UUID' })
  @ApiResponse({
    status: 204,
    description: 'Chronic condition deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Chronic condition not found' })
  async remove(@Param('id') id: string, @Request() req: any): Promise<void> {
    return this.chronicConditionService.remove(id, req.user);
  }

  @Get('student/:studentId')
  @ApiOperation({ summary: 'Get chronic conditions for a specific student' })
  @ApiParam({ name: 'studentId', description: 'Student UUID' })
  @ApiResponse({
    status: 200,
    description: 'List of student chronic conditions',
    type: [ChronicCondition],
  })
  async findByStudent(
    @Param('studentId') studentId: string,
    @Request() req: any,
  ): Promise<ChronicCondition[]> {
    return this.chronicConditionService.findByStudent(studentId, req.user);
  }
}
