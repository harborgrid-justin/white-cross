import { IsString, IsOptional, IsEnum, IsEmail, Matches } from 'class-validator';
import { RecipientType } from '../enums';

export class RecipientDto {
  @IsEnum(RecipientType)
  type: RecipientType;

  @IsString()
  id: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @Matches(/^\+?[1-9]\d{1,14}$/, { message: 'Phone number must be in E.164 format' })
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  pushToken?: string;

  @IsOptional()
  @IsString()
  preferredLanguage?: string;
}
