// lib/query-keys.ts

export const queryKeys = {
  assignments: ['assignments'],

  assignment: (id: string) => ['assignment', id],

  assignmentStatus: (id: string) => ['assignment-status', id],

  assessments: ['assessments'],

  assessment: (id: string) => ['assessment', id],

  assessmentByAssignment: (assignmentId: string) => ['assessment-by-assignment', assignmentId],
};
