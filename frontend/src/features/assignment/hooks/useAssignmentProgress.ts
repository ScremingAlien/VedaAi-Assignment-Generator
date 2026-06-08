// features/assignment/hooks/useAssignmentProgress.ts

import { useQuery } from '@tanstack/react-query';

export function useAssignmentProgress(assignmentId: string) {
  return useQuery({
    queryKey: ['assignment-progress', assignmentId],

    queryFn: async () => ({
      percent: 0,
      step: 'Waiting',
    }),

    staleTime: Infinity,
  });
}
