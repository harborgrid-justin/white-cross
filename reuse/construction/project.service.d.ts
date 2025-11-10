import { Sequelize } from 'sequelize-typescript';
import { ConstructionProject } from './models/project.model';
import { ProjectBaseline } from './models/project-baseline.model';
import { ChangeOrder } from './models/change-order.model';
import { CreateConstructionProjectDto } from './dto/create-project.dto';
import { UpdateProjectProgressDto } from './dto/update-project.dto';
import { CreateBaselineDto } from './dto/create-baseline.dto';
import { CreateChangeOrderDto } from './dto/create-change-order.dto';
import { ProjectPerformanceMetrics } from './types/project.types';
export declare class ProjectService {
    private sequelize;
    private projectModel;
    private baselineModel;
    private changeOrderModel;
    private readonly logger;
    constructor(sequelize: Sequelize, projectModel: typeof ConstructionProject, baselineModel: typeof ProjectBaseline, changeOrderModel: typeof ChangeOrder);
    /**
     * Generates a unique, human-readable project number.
     * @param districtCode - The district code for the project.
     * @returns A project number string.
     */
    private generateConstructionProjectNumber;
    /**
     * Creates a new construction project.
     * @param createDto - Data for creating the project.
     * @param userId - The ID of the user creating the project.
     * @returns The created project instance.
     */
    createProject(createDto: CreateConstructionProjectDto, userId: string): Promise<ConstructionProject>;
    /**
     * Retrieves a single project by its ID.
     * @param id - The UUID of the project.
     * @returns The project instance.
     * @throws NotFoundException if the project does not exist.
     */
    getProjectById(id: string): Promise<ConstructionProject>;
    /**
     * Updates a project's progress and recalculates earned value.
     * @param id - The project's ID.
     * @param updateDto - The progress data.
     * @param userId - The ID of the user updating the project.
     * @returns The updated project instance.
     */
    updateProjectProgress(id: string, updateDto: UpdateProjectProgressDto, userId: string): Promise<ConstructionProject>;
    /**
     * Creates a new baseline for a project.
     * @param createDto - Data for the new baseline.
     * @param userId - The ID of the user creating the baseline.
     * @returns The created baseline instance.
     */
    createProjectBaseline(createDto: CreateBaselineDto, userId: string): Promise<ProjectBaseline>;
    /**
     * Creates a new change order for a project.
     * @param createDto - Data for the new change order.
     * @param userId - The ID of the user creating the change order.
     * @returns The created change order instance.
     */
    createChangeOrder(createDto: CreateChangeOrderDto, userId: string): Promise<ChangeOrder>;
    /**
     * Calculates and returns key EVM metrics for a project.
     * @param projectId - The ID of the project to analyze.
     * @returns An object containing the project's performance metrics.
     */
    calculateProjectEVM(projectId: string): Promise<ProjectPerformanceMetrics>;
    /**
     * Generates a comprehensive status report for a project.
     * @param projectId - The ID of the project.
     * @returns A detailed status report object.
     */
    generateProjectStatusReport(projectId: string): Promise<any>;
}
//# sourceMappingURL=project.service.d.ts.map