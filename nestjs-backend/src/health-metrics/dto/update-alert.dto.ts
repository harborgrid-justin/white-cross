import { IsString, IsOptional, IsNumber, IsIn } from 'class-validator';

export class UpdateAlertDto {
  @IsString()
  @IsIn(['active', 'acknowledged', 'resolved'])
  status: 'active' | 'acknowledged' | 'resolved';

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsNumber()
  acknowledgedBy?: number;
}
