export interface MessageTemplate {
  id: string;
  name: string;
  category: string;
  subject: string;
  body: string;
  variables: string[];
  language: string;
  createdBy: string;
  createdAt: Date;
  updatedAt?: Date;
  isActive: boolean;
  usageCount: number;
}