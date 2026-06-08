'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useTransition } from 'react';

import AssignmentCardUI from './AssignmentCardUI';

import type { Assignment } from '../../api/assignment.types';
import { useAssignmentProgress } from '../../hooks/useAssignmentProgress';
import { useAssignmentSocket } from '../../hooks/useAssignmentSocket';
import { getDisplayStatus } from '../../utils/getDisplayStatus';

interface AssignmentCardProps {
  assignment: Assignment;
}

export default function AssignmentCard({ assignment }: AssignmentCardProps) {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();
  useAssignmentSocket(assignment._id);

  const { data: progress } = useAssignmentProgress(assignment._id);

  const canNavigate =
    assignment.generationStatus === 'COMPLETED' ||
    assignment.generationStatus === 'FAILED' ||
    assignment.generationStatus === 'DRAFT';

  const href =
    assignment.generationStatus === 'COMPLETED'
      ? `/dashboard/assignment/${assignment._id}`
      : `/dashboard/assignment/edit/${assignment._id}`;

  const openAssignment = useCallback(() => {
    if (!canNavigate) {
      return;
    }

    startTransition(() => {
      router.push(href);
    });
  }, [canNavigate, href, router]);

  const statusConfig = getDisplayStatus(assignment, progress);
  return (
    <div
      onMouseEnter={() => router.prefetch(href)}
      onClick={openAssignment}
      className="relative cursor-pointer"
    >
      {isPending && (
        <div className="absolute inset-0 z-20 flex items-center justify-center font-medium text-lg text-TWO">
          Opening...
        </div>
      )}

      <div className={isPending ? 'blur-[6px]' : ''}>
        <AssignmentCardUI statusConfig={statusConfig} assignment={assignment} />
      </div>
    </div>
  );
}
