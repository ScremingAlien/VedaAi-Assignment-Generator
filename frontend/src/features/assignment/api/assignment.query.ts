// features/assignment/hooks/useAssignment.ts

'use client';

import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  createDraft,
  deleteAssignment,
  getAssignment,
  getAssignments,
  getAssignmentStatus,
  retryGeneration,
  submitAssignment,
  updateBasicDetails,
  updateConfiguration,
  uploadPdf,
} from '../api/assignment.api';

import type {
  CreateDraftDTO,
  UpdateBasicDetailsDTO,
  UpdateConfigurationDTO,
} from '../api/assignment.types';
import { useAssignmentStore } from '../store/assignment-form.store';

export const assignmentKeys = {
  all: ['assignments'] as const,

  detail: (id: string) => ['assignment', id] as const,

  status: (id: string) => ['assignment-status', id] as const,
};

/* -------------------------------- */
/* Queries */
/* -------------------------------- */
import { toast } from 'sonner';

export function useRetryGeneration() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: retryGeneration,

    onSuccess: () => {
      toast.success('Generation restarted');

      queryClient.invalidateQueries({
        queryKey: ['assignments'],
      });
    },

    onError: (error: any) => {
      toast.error(error?.response?.data?.message ?? 'Failed to retry generation');
    },
  });
}
export function useAssignments() {
  const { setTotal } = useAssignmentStore();
  return useInfiniteQuery({
    queryKey: ['assignments'],
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      let data = await getAssignments(pageParam);
      setTotal(data.total);

      return data;
    },
    getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.page + 1 : undefined),
  });
}

export function useAssignment(id: string) {
  return useQuery({
    queryKey: assignmentKeys.detail(id),
    queryFn: () => getAssignment(id),
    enabled: !!id,
  });
}

export function useAssignmentStatus(id: string) {
  return useQuery({
    queryKey: assignmentKeys.status(id),

    queryFn: () => getAssignmentStatus(id),

    enabled: !!id,

    refetchInterval: (query) => {
      const status = query.state.data?.generationStatus;

      if (status === 'COMPLETED' || status === 'FAILED') {
        return false;
      }

      return 2000;
    },
  });
}

/* -------------------------------- */
/* Mutations */
/* -------------------------------- */

export function useCreateDraft() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateDraftDTO) => createDraft(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: assignmentKeys.all,
      });
    },
  });
}

export function useUpdateBasicDetails() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;

      payload: UpdateBasicDetailsDTO;
    }) => updateBasicDetails(id, payload),

    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({
        queryKey: assignmentKeys.detail(vars.id),
      });

      queryClient.invalidateQueries({
        queryKey: assignmentKeys.all,
      });
    },
  });
}
export function useDeleteAssignment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: { id: string }) => deleteAssignment(id),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({
        queryKey: assignmentKeys.all,
      });
    },
  });
}

export function useUpdateConfiguration() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;

      payload: UpdateConfigurationDTO;
    }) => updateConfiguration(id, payload),

    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({
        queryKey: assignmentKeys.detail(vars.id),
      });

      queryClient.invalidateQueries({
        queryKey: assignmentKeys.all,
      });
    },
  });
}

export function useUploadPdf() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      file,
    }: {
      id: string;

      file: File;
    }) => uploadPdf(id, file),

    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({
        queryKey: assignmentKeys.detail(vars.id),
      });
    },
  });
}

export function useSubmitAssignment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => submitAssignment(id),

    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: assignmentKeys.detail(id),
      });

      queryClient.invalidateQueries({
        queryKey: assignmentKeys.status(id),
      });

      queryClient.invalidateQueries({
        queryKey: assignmentKeys.all,
      });
    },
  });
}

/* export function useRetryGeneration() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => retryGeneration(id),

    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: assignmentKeys.detail(id),
      });

      queryClient.invalidateQueries({
        queryKey: assignmentKeys.status(id),
      });

      queryClient.invalidateQueries({
        queryKey: assignmentKeys.all,
      });
    },
  });
}
 */
