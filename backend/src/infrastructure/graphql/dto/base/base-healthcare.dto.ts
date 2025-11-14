import { Field, InputType } from '@nestjs/graphql';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

/**
 * Base DTO class providing common validation patterns for healthcare entities
 */
export abstract class BaseHealthcareDto {
  // Common string field validations
  protected static createRequiredStringField(
    fieldName: string,
    maxLength: number,
    minLength = 1,
  ): PropertyDecorator[] {
    return [
      IsString(),
      MinLength(minLength, { message: `${fieldName} must not be empty` }),
      MaxLength(maxLength, {
        message: `${fieldName} must not exceed ${maxLength} characters`,
      }),
    ];
  }

  protected static createOptionalStringField(
    fieldName: string,
    maxLength: number,
    minLength = 1,
  ): PropertyDecorator[] {
    return [
      IsOptional(),
      IsString(),
      MinLength(minLength, { message: `${fieldName} must not be empty` }),
      MaxLength(maxLength, {
        message: `${fieldName} must not exceed ${maxLength} characters`,
      }),
    ];
  }

  protected static createDateField(fieldName: string): PropertyDecorator[] {
    return [IsDateString({}, { message: `Invalid date format for ${fieldName}` })];
  }

  protected static createOptionalDateField(fieldName: string): PropertyDecorator[] {
    return [IsOptional(), IsDateString({}, { message: `Invalid date format for ${fieldName}` })];
  }

  protected static createEnumField<T>(enumType: T, fieldName: string): PropertyDecorator[] {
    return [IsEnum(enumType as object, { message: `Invalid ${fieldName} value` })];
  }

  protected static createOptionalEnumField<T>(enumType: T, fieldName: string): PropertyDecorator[] {
    return [IsOptional(), IsEnum(enumType as object, { message: `Invalid ${fieldName} value` })];
  }

  protected static createIdField(): PropertyDecorator[] {
    return [IsString()];
  }

  protected static createOptionalIdField(): PropertyDecorator[] {
    return [IsOptional(), IsString()];
  }

  protected static createOptionalBooleanField(): PropertyDecorator[] {
    return [IsOptional(), IsBoolean()];
  }
}

/**
 * Base input DTO for creating healthcare entities
 */
@InputType()
export abstract class BaseHealthcareInputDto extends BaseHealthcareDto {
  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  dateOfBirth: Date;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'Photo URL must not exceed 500 characters' })
  photo?: string;

  @Field({ nullable: true, defaultValue: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

/**
 * Base update input DTO for updating healthcare entities
 */
@InputType()
export abstract class BaseHealthcareUpdateInputDto extends BaseHealthcareDto {
  @Field({ nullable: true })
  firstName?: string;

  @Field({ nullable: true })
  lastName?: string;

  @Field({ nullable: true })
  dateOfBirth?: Date;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'Photo URL must not exceed 500 characters' })
  photo?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

/**
 * Base filter input DTO for querying healthcare entities
 */
@InputType()
export abstract class BaseHealthcareFilterInputDto extends BaseHealthcareDto {
  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  search?: string;
}
