import { buildAssessmentPrompt } from '../ai/prompts/assessment.prompt.js';
import { Model } from './llm.client.js';
import { AssessmentSchema } from './schemas/assessment-output.schema.js';

const structuredModel = Model.Google().withStructuredOutput(AssessmentSchema);

interface QuestionRequirement {
  type: string;
  count: number;
  marksPerQuestion: number;
  difficulty: 'easy' | 'medium' | 'hard' | 'mixed';
}

export interface GenerateAssessmentInput {
  title: string;
  className: string;
  subject: string;
  timeAllowedMinutes: number;
  additionalInstructions?: string;
  sourceContent: string;
  questionRequirements: QuestionRequirement[];
}

export async function generateAssessment(input: GenerateAssessmentInput) {
  const prompt = buildAssessmentPrompt(input);
  const SYSTEM_PROMPT = `
You are an expert academic assessment designer.

Generate assessments strictly from the provided study material.

Requirements:

1. Use only facts from the study material.
2. Do not invent information.
3. Follow every section requirement exactly.
4. Generate exactly the requested number of questions.
5. Avoid duplicate questions.
6. Questions must be grammatically correct.
7. Every question must contain:
   - question
   - answer
   - difficulty
   - marks
8. MCQ questions must contain:
   - options
   - exactly 4 options
   - exactly 1 correct answer
9. Fill-in-the-blank questions should not contain options.
10. Difficulty must be one of:
   - easy
   - medium
   - hard
   - mixed


IMPORTANT:

- Every section must contain exactly the requested number of questions.
- Every question must include:
  - question
  - answer
  - marks
- MCQ questions must include:
  - options (exactly 4)
- Never omit required fields.
- Return valid structured data only.

`;

  return structuredModel.invoke([
    ['system', SYSTEM_PROMPT],
    ['human', prompt],
  ]);
}
