import { ProjectService } from './project.service';
import { CreateConstructionProjectDto } from './dto/create-project.dto';
import { UpdateProjectProgressDto } from './dto/update-project.dto';
import { CreateBaselineDto } from './dto/create-baseline.dto';
import { CreateChangeOrderDto } from './dto/create-change-order.dto';
import { ConstructionProject } from './models/project.model';
export declare class ProjectController {
    private readonly projectService;
    private readonly logger;
    constructor(projectService: ProjectService);
    createProject(createProjectDto: CreateConstructionProjectDto): Promise<ConstructionProject>;
    getProjectById(id: string): Promise<ConstructionProject>;
    updateProjectProgress(id: string, updateDto: UpdateProjectProgressDto): Promise<ConstructionProject>;
    createBaseline(id: string, createBaselineDto: CreateBaselineDto): Promise<import(".").ProjectBaseline>;
    createChangeOrder(id: string, createChangeOrderDto: CreateChangeOrderDto): Promise<import(".").ChangeOrder>;
    getProjectEVM(id: string): Promise<import(".").ProjectPerformanceMetrics>;
    getStatusReport(id: string): Promise<any>;
}
//# sourceMappingURL=project.controller.d.ts.map