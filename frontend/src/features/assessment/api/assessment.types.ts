// features/assessment/api/assessment.types.ts
import { Assignment } from '@/features/assignment/api/assignment.types';
export interface Question {
  question: string;
  answer?: string;
  difficulty: 'easy' | 'medium' | 'hard';

  marks: number;
}

export interface Section {
  title: string;

  instruction: string;

  questions: Question[];
}

export interface Assessment {
  _id: string;

  assignmentId: Assignment;

  title: string;

  totalMarks: number;

  version: number;

  sections: Section[];

  createdAt: string;

  updatedAt: string;
}
