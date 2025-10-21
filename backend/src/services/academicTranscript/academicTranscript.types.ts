
export interface AcademicRecord {
  id: string;
  studentId: string;
  academicYear: string;
  semester: string;
  grade: string;
  gpa: number;
  subjects: SubjectGrade[];
  attendance: AttendanceRecord;
  behavior: BehaviorRecord;
  createdAt: Date;
  updatedAt: Date;
}

export interface SubjectGrade {
  subjectName: string;
  subjectCode: string;
  grade: string;
  percentage: number;
  credits: number;
  teacher: string;
}

export interface AttendanceRecord {
  totalDays: number;
  presentDays: number;
  absentDays: number;
  tardyDays: number;
  attendanceRate: number;
}

export interface BehaviorRecord {
  conductGrade: string;
  incidents: number;
  commendations: number;
  notes?: string;
}

export interface TranscriptImportData {
  studentId: string;
  academicYear: string;
  semester: string;
  subjects: SubjectGrade[];
  attendance: AttendanceRecord;
  behavior?: BehaviorRecord;
  importedBy: string;
}
