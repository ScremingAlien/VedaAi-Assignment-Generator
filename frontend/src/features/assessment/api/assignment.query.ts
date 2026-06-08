'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  deleteAssessment,
  getAssessment,
  getAssessmentByAssignment,
  getAssessments,
} from '../api/assessment.api';

import type { Assessment } from '../api/assessment.types';

export function useAssessments() {
  return useQuery<Assessment[]>({
    queryKey: ['assessments'],
    queryFn: getAssessments,
  });
}

export function useAssessment(id: string) {
  return useQuery<Assessment>({
    queryKey: ['assessment', id],

    queryFn: () => getAssessment(id),

    enabled: !!id,
  });
}

export function useAssessmentByAssignment(assignmentId: string) {
  return useQuery<Assessment>({
    queryKey: ['assessment-by-assignment', assignmentId],

    queryFn: () => getAssessmentByAssignment(assignmentId),

    enabled: !!assignmentId,
  });
}

export function useDeleteAssessment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAssessment,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['assessments'],
      });
    },
  });
}
