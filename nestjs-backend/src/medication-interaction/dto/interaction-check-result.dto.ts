import { IsBoolean, IsArray, IsNumber, Min, Max, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { DrugInteractionDto } from './drug-interaction.dto';

export class InteractionCheckResultDto {
  @IsBoolean()
  hasInteractions: boolean;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DrugInteractionDto)
  interactions: DrugInteractionDto[];

  @IsNumber()
  @Min(0)
  @Max(100)
  safetyScore: number;
}
