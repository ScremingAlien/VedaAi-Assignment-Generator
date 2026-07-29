'use client';
import { CreateAssignmentField } from '@/components/common/create-assignment-form/FormField';
import { Button } from '@/components/ui/button';
import { createDraft } from '@/features/assignment/api/assignment.api';
import { useAssignmentStore } from '@/features/assignment/store/assignment-form.store';
import {
  BasicDetailsAssignmentForm,
  BasicDetailsAssignmentSchema,
} from '@/features/assignment/utils/assignment.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

export default function Page() {
  const [pageLoading, setPageLoading] = useState(true);
  const router = useRouter();
  const { setAssignmentId } = useAssignmentStore();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BasicDetailsAssignmentForm>({
    resolver: zodResolver(BasicDetailsAssignmentSchema),

    defaultValues: {
      title: '',
      className: '',
      subject: '',
      timeAllowedMinutes: 0,
    },
  });

  async function onSubmit(data: BasicDetailsAssignmentForm) {
    try {
      const assignment = await createDraft(data);

      if (assignment.success === true) {
        toast.success('Saved!');

        setAssignmentId(assignment.data?._id || '');
        router.push('/dashboard/assignment/create/configuration/' + assignment.data?._id);
      } else {
        toast.error(assignment.message || 'Failed to create assignment');
      }
    } catch (error: any) {
      toast.error(error?.message || 'Failed to create assignment');
    } finally {
      reset();
      setPageLoading(false);
    }
  }

  return (
    <>
      <div className="  rounded-[32px] bg-[#FFFFFF80] border px-4  md:px-8 py-8 flex flex-col gap-8 border-white">
        <div>
          <h2 className=" text-[20px] font-bold text-TWO">Create Assignment</h2>
          <p className=" text-[14px]  text-[#5E5E5ECC]">Basic information about your assignment</p>
        </div>

        <form className="space-y-4  ">
          <CreateAssignmentField.Input
            label="Assignment Title"
            placeholder="e.g Assignment 01"
            error={errors.title}
            {...register('title')}
          />

          <CreateAssignmentField.Input
            label="Class"
            placeholder="e.g 5th"
            error={errors.className}
            {...register('className')}
          />

          <CreateAssignmentField.Input
            label="Subject"
            placeholder="e.g English, Hindi"
            error={errors.subject}
            {...register('subject')}
          />

          <CreateAssignmentField.Input
            type="number"
            label="Time Allowed"
            error={errors.timeAllowedMinutes}
            {...register('timeAllowedMinutes', {
              valueAsNumber: true,
            })}
          />
        </form>
      </div>

      {/* Buttons */}
      <div className=" flex flex-row justify-between gap-4  mb-16 md:mb-8">
        <Button
          onClick={() => router.push('/dashboard')}
          className=" px-4 text-[16px]  hover:bg-white bg-white text-TWO font-medium h-11 rounded-full   flex justify-center items-center gap-2"
        >
          <ArrowRight className=" size-5 rotate-180" /> Previous
        </Button>

        <Button
          disabled={isSubmitting}
          onClick={handleSubmit(onSubmit)}
          className=" px-4 text-[16px]  font-medium h-11 rounded-full   flex justify-center items-center gap-2"
        >
          {isSubmitting ? (
            'Saving...'
          ) : (
            <>
              Next
              <ArrowRight className=" size-5  " />
            </>
          )}
        </Button>
      </div>
    </>
  );
}
