import { Model } from 'sequelize-typescript';
import { ReviewAction } from '../types/submittal.types';
export declare class SubmittalReview extends Model {
    id: string;
    submittalId: string;
    reviewerId: string;
    reviewerName: string;
    reviewerEmail: string;
    reviewerRole: string;
    reviewDate: Date;
    action: ReviewAction;
    comments: string;
    privateNotes?: string;
    markupUrls: string[];
    deficiencies: string[];
    nextAction?: string;
    daysToReview: number;
    signature?: string;
    isLatest: boolean;
    reviewStepNumber: number;
    metadata: Record<string, any>;
}
//# sourceMappingURL=submittal-review.model.d.ts.map