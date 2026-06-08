import { useQuery } from '@tanstack/react-query';

import { getAssignmentStatus } from '../api/assignment.api';

export function useAssignmentStatus(assignmentId: string) {
  return useQuery({
    queryKey: ['assignment-status', assignmentId],

    queryFn: () => getAssignmentStatus(assignmentId),

    refetchInterval: (query) => {
      const status = query.state.data?.generationStatus;

      return status === 'COMPLETED' || status === 'FAILED' ? false : 2000;
    },
  });
}
