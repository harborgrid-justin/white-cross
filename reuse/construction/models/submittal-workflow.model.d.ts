import { Model } from 'sequelize-typescript';
import { WorkflowType, WorkflowStatus } from '../types/submittal.types';
export declare class SubmittalWorkflow extends Model {
    id: string;
    submittalId: string;
    workflowType: WorkflowType;
    steps: any[];
    currentStepIndex: number;
    overallStatus: WorkflowStatus;
    startDate: Date;
    targetCompletionDate: Date;
    actualCompletionDate?: Date;
    escalationRequired: boolean;
    escalatedAt?: Date;
    escalatedTo?: string;
    pausedAt?: Date;
    pauseReason?: string;
    resumedAt?: Date;
    totalDaysActive: number;
    metadata: Record<string, any>;
}
//# sourceMappingURL=submittal-workflow.model.d.ts.map