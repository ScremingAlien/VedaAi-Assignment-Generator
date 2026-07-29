import { z } from 'zod';

export const BasicDetailsAssignmentSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title cannot exceed 100 characters'),

  className: z.string().trim().min(1, 'Class is required').max(50, 'Class name is too long'),

  subject: z.string().trim().min(1, 'Subject is required').max(50, 'Subject name is too long'),

  timeAllowedMinutes: z
    .number({
      error: 'Time allowed is required',
    })
    .int('Time must be a whole number')
    .min(1, 'Time must be at least 1 minute')
    .max(600, 'Time cannot exceed 10 hours'),
});

export type BasicDetailsAssignmentForm = z.infer<typeof BasicDetailsAssignmentSchema>;

// -----------------------------------

export const QuestionRequirementSchema = z.object({
  type: z.string(),

  count: z.number().int().min(1),

  marksPerQuestion: z.number().int().min(1),
});

export const AssignmentConfigurationSchema = z.object({
  assignmentDate: z.date({
    error: 'Assignment date is required',
  }),
  dueDate: z.date({
    error: 'Assignment date is required',
  }),
  
  sourceContent: z.string().optional(),
  additionalInstructions: z.string().optional(),
  questionRequirements: z.array(QuestionRequirementSchema),
});

export type AssignmentConfigurationForm = z.infer<typeof AssignmentConfigurationSchema>;
