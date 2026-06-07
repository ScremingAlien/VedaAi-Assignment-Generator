export interface UploadedPdfDTO {
  fileName: string;
  fileUrl: string;
  fileSize: number;
}

export interface QuestionRequirementDTO {
  type: string;

  count: number;

  marksPerQuestion: number;

  difficulty: 'easy' | 'medium' | 'hard' | 'mixed';
}

export interface CreateAssignmentDTO {
  title: string;
  generationStatus?: string;
  className: string;

  subject: string;

  timeAllowedMinutes: number;

  assignmentDate?: Date;

  dueDate?: Date;

  additionalInstructions?: string;

  sourceContent?: string;

  uploadedPdf?: UploadedPdfDTO;

  questionRequirements?: QuestionRequirementDTO[];
}
