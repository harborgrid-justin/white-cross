import { IsArray, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class MergePdfsDto {
  @ApiProperty({
    description: 'Array of base64-encoded PDF buffers to merge',
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  pdfBuffers!: string[];
}
