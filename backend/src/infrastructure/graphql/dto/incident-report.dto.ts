import { Field, ObjectType, ID } from '@nestjs/graphql';

/**
 * Incident Report GraphQL DTO
 *
 * Represents an incident report for a student in GraphQL responses
 */
@ObjectType('IncidentReport')
export class IncidentReportDto {
  @Field(() => ID, { description: 'Unique identifier for the incident report' })
  id!: string;

  @Field({ description: 'Type of incident' })
  incidentType!: string;

  @Field({ description: 'Date and time when the incident occurred' })
  incidentDateTime!: Date;

  @Field({ description: 'Location where the incident occurred' })
  location!: string;

  @Field({ description: 'Detailed description of the incident' })
  description!: string;

  @Field({ nullable: true, description: 'Severity level of the incident' })
  severity?: string;

  @Field({ nullable: true, description: 'Actions taken in response to the incident' })
  actionsTaken?: string;

  @Field({ nullable: true, description: 'Staff member who reported the incident' })
  reportedBy?: string;

  @Field({ nullable: true, description: 'Follow-up actions required' })
  followUpRequired?: boolean;

  @Field({ nullable: true, description: 'Date when follow-up was completed' })
  followUpDate?: Date;

  @Field({ description: 'Current status of the incident' })
  status!: string;

  @Field({ description: 'Date when the report was created' })
  createdAt!: Date;

  @Field({ description: 'Date when the report was last updated' })
  updatedAt!: Date;
}
