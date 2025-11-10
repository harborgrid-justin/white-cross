import { Model } from 'sequelize-typescript';
import { RelationshipType, DurationType } from '../types/schedule.types';
export declare class ActivityRelationship extends Model {
    id: string;
    projectId: string;
    predecessorActivityId: string;
    successorActivityId: string;
    relationshipType: RelationshipType;
    lagDays: number;
    lagType: DurationType;
    isDriving: boolean;
    metadata: Record<string, any>;
}
//# sourceMappingURL=activity-relationship.model.d.ts.map