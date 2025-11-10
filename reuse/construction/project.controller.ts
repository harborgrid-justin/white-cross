
import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
  UsePipes,
  ValidationPipe,
  Logger,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ProjectService } from './project.service';
import { CreateConstructionProjectDto } from './dto/create-project.dto';
import { UpdateProjectProgressDto } from './dto/update-project.dto';
import { CreateBaselineDto } from './dto/create-baseline.dto';
import { CreateChangeOrderDto } from './dto/create-change-order.dto';
import { ConstructionProject } from './models/project.model';

@ApiTags('Construction Projects')
@ApiBearerAuth()
@Controller('construction/projects')
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class ProjectController {
  private readonly logger = new Logger(ProjectController.name);

  constructor(private readonly projectService: ProjectService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new construction project' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The project has been successfully created.',
    type: ConstructionProject,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input data.' })
  async createProject(@Body() createProjectDto: CreateConstructionProjectDto): Promise<ConstructionProject> {
    const userId = 'temp-user-id'; // Replace with actual user from token
    this.logger.log(`User ${userId} creating project: ${createProjectDto.projectName}`);
    return this.projectService.createProject(createProjectDto, userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a construction project by ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'The project.', type: ConstructionProject })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Project not found.' })
  async getProjectById(@Param('id', ParseUUIDPipe) id: string): Promise<ConstructionProject> {
    return this.projectService.getProjectById(id);
  }
  
  @Patch(':id/progress')
  @ApiOperation({ summary: 'Update project progress and calculate EVM' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Progress updated.', type: ConstructionProject })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Project not found.' })
  async updateProjectProgress(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateProjectProgressDto,
  ): Promise<ConstructionProject> {
    const userId = 'temp-user-id';
    this.logger.log(`User ${userId} updating progress for project ${id}`);
    return this.projectService.updateProjectProgress(id, updateDto, userId);
  }

  @Post(':id/baselines')
  @ApiOperation({ summary: 'Create a new baseline for a project' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Baseline created.' })
  async createBaseline(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() createBaselineDto: CreateBaselineDto,
  ) {
    const userId = 'temp-user-id';
    // Ensure the DTO's projectId matches the param for consistency
    createBaselineDto.projectId = id;
    return this.projectService.createProjectBaseline(createBaselineDto, userId);
  }

  @Post(':id/change-orders')
  @ApiOperation({ summary: 'Create a new change order for a project' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Change order created.' })
  async createChangeOrder(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() createChangeOrderDto: CreateChangeOrderDto,
  ) {
    const userId = 'temp-user-id';
    createChangeOrderDto.projectId = id;
    return this.projectService.createChangeOrder(createChangeOrderDto, userId);
  }

  @Get(':id/evm')
  @ApiOperation({ summary: 'Calculate and retrieve EVM metrics for a project' })
  @ApiResponse({ status: HttpStatus.OK, description: 'EVM metrics calculated.' })
  async getProjectEVM(@Param('id', ParseUUIDPipe) id: string) {
    return this.projectService.calculateProjectEVM(id);
  }

  @Get(':id/status-report')
  @ApiOperation({ summary: 'Generate a comprehensive project status report' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Status report generated.' })
  async getStatusReport(@Param('id', ParseUUIDPipe) id: string) {
    return this.projectService.generateProjectStatusReport(id);
  }
}
