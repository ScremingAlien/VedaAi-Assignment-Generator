import { z } from 'zod';

export const QuestionDTO = z.object({
  question: z.string(),

  difficulty: z.enum(['easy', 'medium', 'hard', 'mixed']),

  marks: z.number(),

  answer: z.string().optional(),

  solution: z.string().optional(),
});

export const SectionDTO = z.object({
  title: z.string(),

  instruction: z.string(),

  totalMarks: z.number(),

  questions: z.array(QuestionDTO),
});

export const CreateAssessmentDTO = z.object({
  assignmentId: z.string(),

  title: z.string(),

  totalMarks: z.number(),

  version: z.number().default(1),

  sections: z.array(SectionDTO),
});

export type CreateAssessmentDTOType = z.infer<typeof CreateAssessmentDTO>;
