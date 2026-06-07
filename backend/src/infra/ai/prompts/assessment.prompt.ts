import type { CreateAssignmentDTO } from '../../../services/assignment/dto/create-assignment.dto.js';

function getQuestionTypeGuide(type: string, marksPerQuestion: number): string {
  switch (type) {
    case 'MCQ':
      return 'Exactly 4 options. One correct answer.';

    case 'TRUE_FALSE':
      return 'Answer must be True or False.';

    case 'FILL_IN_THE_BLANK':
      return 'Answer contains missing word or phrase.';

    case 'ONE_WORD':
      return 'Answer must be one word or short term.';

    case 'SHORT_ANSWER':
      return 'Provide concise explanation.';

    case 'LONG_ANSWER':
      return 'Provide detailed exam-style answer.';

    case 'ESSAY':
      return 'Use introduction, explanation and conclusion.';

    case 'NUMERICAL_PROBLEM':
      return `
- Generate calculation-based questions only if supported by study material.
- Include working/steps whenever possible.
`;

    case 'DIAGRAM_BASED':
      return `
- Generate diagram-based questions only if supported by study material.
- Provide explanation in answer field.
`;

    default:
      return '';
  }
}

function getAnswerLengthGuide(marks: number): string {
  if (marks <= 1) {
    return 'Answer should be concise (1 sentence).';
  }

  if (marks === 2) {
    return 'Answer should contain 2-3 meaningful sentences.';
  }

  if (marks === 3) {
    return 'Answer should contain 3-5 meaningful sentences.';
  }

  if (marks === 4) {
    return 'Answer should contain 4-6 detailed sentences.';
  }

  if (marks === 5) {
    return `
- Answer must contain at least 5 substantial points
  OR
- A detailed paragraph of equivalent depth.
- Never answer in less than 100 words.
`;
  }

  return `
- Answer must be detailed.
- Include explanation, important points, examples (if available in source).
- Never answer briefly.
- Target 150+ words when appropriate.
`;
}

export function buildAssessmentPrompt(
  assignment: Pick<
    CreateAssignmentDTO,
    | 'title'
    | 'className'
    | 'subject'
    | 'timeAllowedMinutes'
    | 'additionalInstructions'
    | 'sourceContent'
    | 'questionRequirements'
  >,
) {
  const sections = assignment.questionRequirements
    ?.map(
      (section, index) => `
Section ${index + 1}

Type: ${section.type}
Questions: ${section.count}
Marks: ${section.marksPerQuestion}
Difficulty: ${section.difficulty}
      
Rules:
${getQuestionTypeGuide(section.type, section.marksPerQuestion)}
${getAnswerLengthGuide(section.marksPerQuestion)}
`,
    )
    .join('\n');
  return `
# ASSESSMENT_REQUEST

Assignment Metadata:

${JSON.stringify(
  {
    title: assignment.title,
    className: assignment.className,
    subject: assignment.subject,
    durationMinutes: assignment.timeAllowedMinutes,
  },
  null,
  2,
)}

Study Material:
"""
${assignment.sourceContent}
"""

Question Requirements:
${JSON.stringify(assignment.questionRequirements, null, 2)}

Assignment Instructions:
${assignment.additionalInstructions}


`;
}
