import { Model } from 'sequelize-typescript';
import { ConstructionProject } from './project.model';
export declare class ProjectBaseline extends Model<ProjectBaseline> {
    id: string;
    projectId: string;
    baselineNumber: string;
    baselineType: 'INITIAL' | 'REVISED' | 'RE_BASELINE';
    budget: number;
    schedule: Date;
    scope: string;
    approvedBy: string;
    changeReason?: string;
    project: ConstructionProject;
}
//# sourceMappingURL=project-baseline.model.d.ts.map