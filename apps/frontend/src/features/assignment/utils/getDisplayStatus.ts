// features/assignment/utils/getDisplayStatus.ts

import { Assignment } from '../api/assignment.types';

interface Progress {
  percent?: number;
}

export function getDisplayStatus(assignment: Assignment, progress?: Progress) {
  const maxAttemptsReached =
    assignment.generationStatus === 'FAILED' &&
    (assignment.currentAttempt ?? 0) >= (assignment.maxAttempts ?? 3);
  switch (assignment.generationStatus) {
    case 'DRAFT':
      return {
        label: 'Draft',
        color: ' bg-gray-200 md:bg-gray-100 text-gray-700',
      };
    case 'PENDING':
      return {
        label: 'Queued',
        color: 'bg-yellow-100 text-yellow-700',
      };

    case 'PROCESSING':
      return {
        label: assignment.currentStep || `Generating ${progress?.percent ?? 0}%`,
        color: 'bg-blue-100 text-blue-700 animate-pulse',
      };

    case 'COMPLETED':
      return {
        label: 'Completed',
        color: 'bg-green-100 text-green-700',
      };

    case 'FAILED':
      return {
        label: maxAttemptsReached ? 'Failed - Max Attempts Reached' : 'Failed',
        color: 'bg-red-100 text-red-700',
      };
    default:
      return {
        label: 'Unknown',
        color: 'bg-gray-100 text-gray-700',
      };
  }
}
