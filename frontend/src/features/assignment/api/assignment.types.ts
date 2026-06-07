// features/assignment/api/assignment.types.ts
export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: any;
  message: string;
  timestamp: string;
};
export interface PaginatedAssignments {
  items: Assignment[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}
export type Difficulty = 'easy' | 'medium' | 'hard' | 'mixed';

export interface QuestionRequirement {
  type: string;

  count: number;

  marksPerQuestion: number;

  difficulty?: Difficulty;
}

export interface UploadedPdf {
  fileName: string;

  fileUrl: string;

  fileSize: number;
}

export interface Assignment {
  _id: string;

  title: string;

  className: string;

  subject: string;

  timeAllowedMinutes: number;

  assignmentDate?: string;

  dueDate?: string;

  additionalInstructions?: string;

  sourceContent?: string;

  uploadedPdf?: UploadedPdf;

  questionRequirements: QuestionRequirement[];

  generationStatus: 'DRAFT' | 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';

  errorMessage?: string;

  createdAt: string;
  generationAttempts?: number;
  maxAttempts?: number;
  currentAttempt?: number;
  retrying?: boolean;
  progress?: number;
  currentStep?: string;
  updatedAt: string;
}

export interface CreateDraftDTO {
  title: string;

  className: string;

  subject: string;

  timeAllowedMinutes: number;
}

export interface UpdateBasicDetailsDTO {
  title?: string;

  className?: string;

  subject?: string;

  timeAllowedMinutes?: number;
}

export interface UpdateConfigurationDTO {
  assignmentDate: string | Date;

  dueDate: string | Date;

  additionalInstructions?: string;

  sourceContent?: string;
  questionRequirements: QuestionRequirement[];
}
