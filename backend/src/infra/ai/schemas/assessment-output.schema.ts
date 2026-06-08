import { z } from 'zod';

export const QuestionSchema = z.object({
  question: z.string(),

  difficulty: z.enum(['easy', 'medium', 'hard', 'mixed']),

  marks: z.number(),

  options: z.array(z.string()).optional(),
  answer: z.string(),
});
export const SectionSchema = z.object({
  title: z.string(),

  instruction: z.string(),

  questions: z.array(QuestionSchema),
});

export const AssessmentSchema = z.object({
  title: z.string(),
  sections: z.array(SectionSchema),
});

export type Assessment = z.infer<typeof AssessmentSchema>;

export interface Question {
  question: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'mixed';
  marks: number;
  options?: string[];
  answer: string;
}

export interface Section {
  title: string;
  instruction: string;
  questions: Question[];
}
