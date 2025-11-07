import {
  IsString,
  IsArray,
  ValidateNested,
  IsOptional,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';

export class SubjectGradeDto {
  @IsString()
  subjectName: string;

  @IsString()
  subjectCode: string;

  @IsString()
  grade: string;

  @IsNumber()
  percentage: number;

  @IsNumber()
  credits: number;

  @IsString()
  teacher: string;
}

export class AttendanceRecordDto {
  @IsNumber()
  totalDays: number;

  @IsNumber()
  presentDays: number;

  @IsNumber()
  absentDays: number;

  @IsNumber()
  tardyDays: number;

  @IsNumber()
  attendanceRate: number;
}

export class BehaviorRecordDto {
  @IsString()
  conductGrade: string;

  @IsNumber()
  incidents: number;

  @IsNumber()
  commendations: number;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class TranscriptImportDto {
  @IsString()
  studentId: string;

  @IsString()
  academicYear: string;

  @IsString()
  semester: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SubjectGradeDto)
  subjects: SubjectGradeDto[];

  @ValidateNested()
  @Type(() => AttendanceRecordDto)
  attendance: AttendanceRecordDto;

  @ValidateNested()
  @Type(() => BehaviorRecordDto)
  @IsOptional()
  behavior?: BehaviorRecordDto;

  @IsString()
  importedBy: string;
}
