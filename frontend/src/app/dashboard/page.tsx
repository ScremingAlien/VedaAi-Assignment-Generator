'use client';

import { useAssignments } from '@/features/assignment/api/assignment.query';

import AssignmentRender from './_components/AssignmentRender';
import AssignmentNotFound from './_components/assignmentNotfound/AssignmentNofound';

import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function Page() {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useAssignments();

  const assignments = data?.pages.flatMap((page) => page.items) ?? [];

  const handleLoadMore = async () => {
    await fetchNextPage();
  };

  if (!isLoading && assignments.length === 0) {
    return <AssignmentNotFound />;
  }

  return (
    <>
      <AssignmentRender data={assignments} />

      {hasNextPage && (
        <div className="flex justify-center  mt-0 md:mt-6  mb-24 md:mb-20">
          <Button
            className="leading-[140%] font-medium text-white text-[16px]  px-6 md:px-6  py-5 sidebarShadow md:py-5 items-center flex-row justify-center gap-2 rounded-3xl   md:bg-TWO"
            onClick={handleLoadMore}
            disabled={isFetchingNextPage}
          >
            {isFetchingNextPage ? 'Loading...' : 'Load More'}

            <ArrowRight className="size-5" />
          </Button>
        </div>
      )}
    </>
  );
}
