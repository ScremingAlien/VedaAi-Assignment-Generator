'use client';

import { memo } from 'react';

import { EllipsisVertical } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { cn, formatDate } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useDeleteAssignment, useRetryGeneration } from '../../api/assignment.query';
import type { Assignment } from '../../api/assignment.types';

interface Props {
  assignment: Assignment;
  statusConfig: {
    label: string;
    color: string;
  };
}

function AssignmentCardUI({ assignment, statusConfig }: Props) {
  const router = useRouter();
  const { mutate, isPending } = useDeleteAssignment();
  const { mutate: retryGenerationMutation, isPending: isRetrying } = useRetryGeneration();
  const canRetry =
    assignment.generationStatus === 'FAILED' &&
    (assignment.currentAttempt ?? 0) < (assignment.maxAttempts ?? 3);
  const maxAttemptsReached =
    assignment.generationStatus === 'FAILED' &&
    (assignment.currentAttempt ?? 0) >= (assignment.maxAttempts ?? 3);

  return (
    <div className=" h-38 md:h-40 w-full rounded-[24px]  bg-[#FFFFFFBF] md:bg-white p-6 flex justify-between">
      <div className="flex flex-col flex-1 justify-between">
        <h4 className=" text-[20px] md:text-2xl font-extrabold leading-[120%] tracking-[-4%] text-TWO">
          {assignment.title}
        </h4>
        <div>
          <div
            className={cn(
              '  rounded-full  w-fit mb-1  px-2 md:px-3  py-0.5 md:py-1  text-[12px] md:text-sm font-medium',
              statusConfig.color,
            )}
          >
            {statusConfig.label}
          </div>

          <p className=" space-x-1 md:space-x-2">
            <span className=" text-[14px] md:text-[16px] font-extrabold text-TWO">Assigned On</span>

            <span className=" text-[14px] md:text-[16px]">
              : {assignment.assignmentDate ? formatDate(assignment.assignmentDate) : '-'}
            </span>
          </p>
        </div>
      </div>

      <div className="flex flex-col justify-between items-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="rounded-md p-1 hover:bg-muted" onClick={(e) => e.stopPropagation()}>
              <EllipsisVertical className="h-5 w-5" />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="sidebarShadow p-2 w-52"
            onClick={(e) => e.stopPropagation()}
          >
            {assignment.generationStatus === 'COMPLETED' && (
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();

                  router.push(`/dashboard/assignment/${assignment._id}`);
                }}
              >
                View Assignment
              </DropdownMenuItem>
            )}

            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();

                router.push(`/dashboard/assignment/edit/${assignment._id}`);
              }}
            >
              Edit Assignment
            </DropdownMenuItem>
            {canRetry && (
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();

                  retryGenerationMutation(assignment._id);
                }}
              >
                {isRetrying ? 'Retrying...' : 'Retry Generation'}
              </DropdownMenuItem>
            )}
            {maxAttemptsReached && (
              <DropdownMenuItem disabled>Max Retry Limit Reached</DropdownMenuItem>
            )}
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                mutate({ id: assignment._id });
              }}
              className="text-red-600 focus:text-red-600"
            >
              {isPending ? 'Deleting...' : 'Delete'}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <p className=" space-x-1 md:space-x-2">
          <span className=" text-[14px] md:text-[16px] font-extrabold text-TWO">Due</span>

          <span className="text-[16px]">
            : {assignment.dueDate ? formatDate(assignment.dueDate) : '-'}
          </span>
        </p>
      </div>
    </div>
  );
}

export default memo(AssignmentCardUI);
