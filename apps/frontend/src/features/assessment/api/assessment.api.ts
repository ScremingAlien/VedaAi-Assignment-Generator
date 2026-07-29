// features/assessment/api/assessment.api.ts

import { api } from '@/lib/axios';
import { Assessment } from './assessment.types';

export async function getAssessments() {
  const { data } = await api.get<{
    data: Assessment[];
  }>('/assessments');

  return data.data;
}

export async function getAssessment(id: string) {
  const { data } = await api.get<{
    data: Assessment;
  }>(`/assessments/${id}`);

  return data.data;
}

export async function getAssessmentByAssignment(assignmentId: string) {
  const { data } = await api.get<{
    data: Assessment;
  }>(`/assessment/assignment/${assignmentId}`);

  return data.data;
}

export async function deleteAssessment(id: string) {
  const { data } = await api.delete(`/assessment/${id}`);

  return data.data;
}
