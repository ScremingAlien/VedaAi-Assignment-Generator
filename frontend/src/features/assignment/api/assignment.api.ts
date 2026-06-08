// features/assignment/api/assignment.api.ts

import { api } from '@/lib/axios';

import {
  ApiResponse,
  Assignment,
  CreateDraftDTO,
  PaginatedAssignments,
  UpdateBasicDetailsDTO,
  UpdateConfigurationDTO,
} from './assignment.types';

export async function createDraft(payload: CreateDraftDTO) {
  const { data } = await api.post<ApiResponse<Assignment>>('/assignment/draft', payload);

  return data;
}

export async function getAssignments(page: number) {
  const { data } = await api.get<{
    data: PaginatedAssignments;
  }>(`/assignment?page=${page}&limit=6`);

  return data.data;
}

export async function getAssignment(id: string) {
  const { data } = await api.get<ApiResponse<Assignment>>(`/assignment/${id}`);

  return data.data;
}

export async function updateBasicDetails(id: string, payload: UpdateBasicDetailsDTO) {
  const { data } = await api.patch<ApiResponse<Assignment>>(
    `/assignment/${id}/basic-details`,
    payload,
  );
  return data;
}

export async function updateConfiguration(id: string, payload: UpdateConfigurationDTO) {
  const { data } = await api.patch<ApiResponse<Assignment>>(
    `/assignment/${id}/configuration`,
    payload,
  );

  return data;
}

export async function uploadPdf(id: string, file: File) {
  const formData = new FormData();

  formData.append('pdf', file);

  const { data } = await api.post<ApiResponse<Assignment>>(
    `/assignment/${id}/upload-pdf`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );

  return data;
}

export async function submitAssignment(id: string) {
  const { data } = await api.post<ApiResponse<Assignment>>(`/assignment/${id}/submit`);

  return data;
}

export async function retryGeneration(id: string) {
  const { data } = await api.post(`/assignment/${id}/retry`);

  return data.data;
}

export async function getAssignmentStatus(id: string) {
  const { data } = await api.get(`/assignment/${id}/status`);

  return data.data;
}
export async function deleteAssignment(assignmentId: string) {
  const { data } = await api.delete<ApiResponse<{ message: string }>>(
    `/assignment/${assignmentId}`,
  );

  return data;
}
