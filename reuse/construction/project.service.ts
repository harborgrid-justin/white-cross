
import { Injectable, NotFoundException, Logger, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { ConstructionProject } from './models/project.model';
import { ProjectBaseline } from './models/project-baseline.model';
import { ChangeOrder } from './models/change-order.model';
import { CreateConstructionProjectDto } from './dto/create-project.dto';
import { UpdateProjectProgressDto } from './dto/update-project.dto';
import { CreateBaselineDto } from './dto/create-baseline.dto';
import { CreateChangeOrderDto } from './dto/create-change-order.dto';
import { ConstructionProjectStatus, ProjectPhase, ProjectPerformanceMetrics } from './types/project.types';
import { v4 as generateUUID } from 'uuid';

@Injectable()
export class ProjectService {
  private readonly logger = new Logger(ProjectService.name);

  constructor(
    private sequelize: Sequelize,
    @InjectModel(ConstructionProject)
    private projectModel: typeof ConstructionProject,
    @InjectModel(ProjectBaseline)
    private baselineModel: typeof ProjectBaseline,
    @InjectModel(ChangeOrder)
    private changeOrderModel: typeof ChangeOrder,
  ) {}

  /**
   * Generates a unique, human-readable project number.
   * @param districtCode - The district code for the project.
   * @returns A project number string.
   */
  private generateConstructionProjectNumber(districtCode: string): string {
    const year = new Date().getFullYear();
    const sequence = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `${districtCode.toUpperCase()}-${year}-C-${sequence}`;
  }

  /**
   * Creates a new construction project.
   * @param createDto - Data for creating the project.
   * @param userId - The ID of the user creating the project.
   * @returns The created project instance.
   */
  async createProject(createDto: CreateConstructionProjectDto, userId: string): Promise<ConstructionProject> {
    const projectNumber = this.generateConstructionProjectNumber(createDto.districtCode || 'GEN');
    
    const forecastedCost = createDto.totalBudget;
    const contingencyReserve = createDto.totalBudget * 0.1; // 10% default
    const managementReserve = createDto.totalBudget * 0.05; // 5% default

    this.logger.log(`Creating project ${projectNumber}: ${createDto.projectName}`);

    const project = await this.projectModel.create({
      ...createDto,
      projectNumber,
      status: ConstructionProjectStatus.PRE_PLANNING,
      currentPhase: ProjectPhase.INITIATION,
      forecastedCost,
      contingencyReserve,
      managementReserve,
      createdBy: userId,
      updatedBy: userId,
    });

    return project;
  }

  /**
   * Retrieves a single project by its ID.
   * @param id - The UUID of the project.
   * @returns The project instance.
   * @throws NotFoundException if the project does not exist.
   */
  async getProjectById(id: string): Promise<ConstructionProject> {
    const project = await this.projectModel.findByPk(id, {
      include: [ProjectBaseline, ChangeOrder],
    });
    if (!project) {
      this.logger.warn(`Project with ID ${id} not found.`);
      throw new NotFoundException(`Project with ID ${id} not found`);
    }
    return project;
  }

  /**
   * Updates a project's progress and recalculates earned value.
   * @param id - The project's ID.
   * @param updateDto - The progress data.
   * @param userId - The ID of the user updating the project.
   * @returns The updated project instance.
   */
  async updateProjectProgress(id: string, updateDto: UpdateProjectProgressDto, userId: string): Promise<ConstructionProject> {
    const project = await this.getProjectById(id);

    const earnedValue = (project.totalBudget * updateDto.progressPercentage) / 100;
    // Note: A real plannedValue calculation would be more complex, likely based on schedule.
    const plannedValue = project.plannedValue; 

    project.progressPercentage = updateDto.progressPercentage;
    project.actualCost = updateDto.actualCost;
    project.earnedValue = earnedValue;
    project.plannedValue = plannedValue; // Placeholder for now
    project.updatedBy = userId;

    await project.save();
    this.logger.log(`Updated progress for project ${id}. New percentage: ${project.progressPercentage}%`);
    return project;
  }

  /**
   * Creates a new baseline for a project.
   * @param createDto - Data for the new baseline.
   * @param userId - The ID of the user creating the baseline.
   * @returns The created baseline instance.
   */
  async createProjectBaseline(createDto: CreateBaselineDto, userId: string): Promise<ProjectBaseline> {
    // Ensure project exists
    await this.getProjectById(createDto.projectId);

    const baselineNumber = `BL-${createDto.projectId.substring(0, 4)}-${Date.now()}`;

    const baseline = await this.baselineModel.create({
      ...createDto,
      baselineNumber,
      approvedBy: userId,
    });
    
    this.logger.log(`Created baseline ${baselineNumber} for project ${createDto.projectId}`);
    return baseline;
  }

  /**
   * Creates a new change order for a project.
   * @param createDto - Data for the new change order.
   * @param userId - The ID of the user creating the change order.
   * @returns The created change order instance.
   */
  async createChangeOrder(createDto: CreateChangeOrderDto, userId: string): Promise<ChangeOrder> {
    await this.getProjectById(createDto.projectId);

    const changeOrderNumber = `CO-${createDto.projectId.substring(0, 4)}-${Date.now()}`;

    const changeOrder = await this.changeOrderModel.create({
      ...createDto,
      changeOrderNumber,
      requestedBy: userId,
    });

    this.logger.log(`Created change order ${changeOrderNumber} for project ${createDto.projectId}`);
    return changeOrder;
  }

  /**
   * Calculates and returns key EVM metrics for a project.
   * @param projectId - The ID of the project to analyze.
   * @returns An object containing the project's performance metrics.
   */
  async calculateProjectEVM(projectId: string): Promise<ProjectPerformanceMetrics> {
    const project = await this.getProjectById(projectId);

    const { earnedValue, plannedValue, actualCost, totalBudget: budgetAtCompletion } = project;

    const scheduleVariance = earnedValue - plannedValue;
    const costVariance = earnedValue - actualCost;
    const schedulePerformanceIndex = plannedValue > 0 ? earnedValue / plannedValue : 1;
    const costPerformanceIndex = actualCost > 0 ? earnedValue / actualCost : 1;

    const estimateAtCompletion = costPerformanceIndex > 0 ? budgetAtCompletion / costPerformanceIndex : budgetAtCompletion;
    const estimateToComplete = estimateAtCompletion - actualCost;
    const varianceAtCompletion = budgetAtCompletion - estimateAtCompletion;
    
    const toCompletePerformanceIndex = (budgetAtCompletion - earnedValue) / (estimateAtCompletion - actualCost);

    return {
      projectId,
      schedulePerformanceIndex,
      costPerformanceIndex,
      scheduleVariance,
      costVariance,
      estimateAtCompletion,
      estimateToComplete,
      varianceAtCompletion,
      toCompletePerformanceIndex,
      earnedValue,
      plannedValue,
      actualCost,
      budgetAtCompletion,
    };
  }

  /**
   * Generates a comprehensive status report for a project.
   * @param projectId - The ID of the project.
   * @returns A detailed status report object.
   */
  async generateProjectStatusReport(projectId: string): Promise<any> {
    const project = await this.getProjectById(projectId);
    const performanceMetrics = await this.calculateProjectEVM(projectId);
    
    const changeOrders = await this.changeOrderModel.findAll({ where: { projectId } });

    return {
      project: project.toJSON(),
      performanceMetrics,
      changeOrderSummary: {
        totalChangeOrders: changeOrders.length,
        approvedChangeOrders: changeOrders.filter((co) => co.status === 'APPROVED').length,
        totalCostImpact: changeOrders.reduce((sum, co) => sum + co.costImpact, 0),
        totalScheduleImpact: changeOrders.reduce((sum, co) => sum + co.scheduleImpact, 0),
      },
      reportDate: new Date(),
    };
  }
}
