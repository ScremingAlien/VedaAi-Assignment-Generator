'use client';

import { Assignment } from '@/features/assignment/api/assignment.types';
import AssignmentCard from '@/features/assignment/ui/assignment-card/AssignmentCard';

export default function AssignmentList({ data }: { data: Assignment[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-2.5 mt-4 md:mt-3">
      {data.map((assignment) => (
        <AssignmentCard key={assignment._id} assignment={assignment} />
      ))}
    </div>
  );
}
