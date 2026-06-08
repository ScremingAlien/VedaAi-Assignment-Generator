'use client';

import { CreateAssignmentField } from '@/components/common/create-assignment-form/FormField';
import { Button } from '@/components/ui/button';
import { useParams } from 'next/navigation';

import {
  AssignmentConfigurationForm,
  AssignmentConfigurationSchema,
} from '@/features/assignment/utils/assignment.schema';

import { Datepicker } from '@/components/ui/elements/Datepicker';
import { FileUploadBox } from '@/components/ui/elements/FileUploadBox';
import { submitAssignment } from '@/features/assignment/api/assignment.api';
import { useAssignment, useUpdateConfiguration } from '@/features/assignment/api/assignment.query';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Controller, useFieldArray, useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';

export default function ConfigurationPage() {
  const router = useRouter();

  const { assignmentid } = useParams();
  const { data, isLoading, isError } = useAssignment(String(assignmentid));

  const { mutateAsync, isSuccess } = useUpdateConfiguration();
  const [hasUploadedPdf, setHasUploadedPdf] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AssignmentConfigurationForm>({
    resolver: zodResolver(AssignmentConfigurationSchema),

    defaultValues: {
      assignmentDate: new Date(),
      dueDate: new Date(),
      additionalInstructions: '',
      sourceContent: '',
      questionRequirements: [
        {
          type: 'MCQ',
          count: 5,
          marksPerQuestion: 1,
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'questionRequirements',
  });
  const questionRequirements = useWatch({
    control,
    name: 'questionRequirements',
  });
  const totalQuestions = questionRequirements?.reduce((acc, q) => acc + (q.count || 0), 0) || 0;

  const totalMarks =
    questionRequirements?.reduce((acc, q) => acc + (q.count || 0) * (q.marksPerQuestion || 0), 0) ||
    0;

  async function onSubmit(data: AssignmentConfigurationForm) {
    try {
      const payload = {
        ...data,
      };

      if (data.sourceContent?.trim()) {
        payload.sourceContent = data.sourceContent;
      }

      const response = await mutateAsync({
        id: String(assignmentid),
        payload,
      });
      if (response.success === true) {
        if (!response.data?._id) {
          toast.error(response.message || 'Failed to update assignment');
          return;
        }

        const submit = await submitAssignment(response.data?._id);
        if (!submit.success) {
          toast.error(submit.message || 'Failed to submit assignment');
          return;
        }
        toast.success('Generating Updated Assignment!');
        router.push('/dashboard');
      } else {
        toast.error(response.message || 'Failed to update assignment');
      }
    } catch (error: any) {
      toast.error(error?.message || 'Something went wrong');
    }
  }

  useEffect(() => {
    if (!data) return;

    reset({
      assignmentDate: data.assignmentDate ? new Date(data.assignmentDate) : new Date(),

      dueDate: data.dueDate ? new Date(data.dueDate) : new Date(),

      additionalInstructions: data.additionalInstructions ?? '',

      sourceContent: data.sourceContent ?? '',

      questionRequirements: data.questionRequirements?.length
        ? data.questionRequirements
        : [
            {
              type: 'MCQ',
              count: 5,
              marksPerQuestion: 1,
            },
          ],
    });
  }, [data, reset]);
  if (isError)
    return (
      <div className="rounded-[32px] bg-[#FFFFFF80] border px-4  md:px-8 py-8  flex-col gap-8 border-white flex justify-center items-center w-full  h-96">
        Something went wrong. . .
      </div>
    );

  if (isLoading)
    return (
      <div className="rounded-[32px] bg-[#FFFFFF80] border px-4  md:px-8 py-8  flex-col gap-8 border-white flex justify-center items-center w-full  h-96">
        Loading...
      </div>
    );

  return (
    <>
      <div className="  w-full rounded-[32px] bg-[#FFFFFF80] border px-4  md:px-8 py-8 flex flex-col gap-8 border-white">
        <div>
          <h2 className=" text-[20px] font-bold text-TWO">Assignment Details</h2>
          <p className=" text-[14px]  text-[#5E5E5ECC]">Basic information about your assignment</p>
        </div>

        <FileUploadBox
          id={String(assignmentid)}
          onUpload={async (file) => {}}
          onSuccess={(data: any) => {
            setHasUploadedPdf(true);
            toast.success('File uploaded successfully');
          }}
          onFail={() => {
            toast.error('Failed to upload file');
          }}
        />
        <form className="space-y-8 w-full">
          {/* Dates */}

          <div className="grid  grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <CreateAssignmentField.Heading title="Assignment Date" />
              {/* Assignment Date */}
              <Controller
                control={control}
                name="assignmentDate"
                render={({ field }) => (
                  <Datepicker value={field.value} onChange={(date) => field.onChange(date)} />
                )}
              />
            </div>

            <div className="space-y-2">
              <CreateAssignmentField.Heading title="Due Date" />

              {/* Due Date */}
              <Controller
                control={control}
                name="dueDate"
                render={({ field }) => (
                  <Datepicker value={field.value} onChange={(date) => field.onChange(date)} />
                )}
              />
            </div>
          </div>

          {/* Question Requirements */}
          <div className="space-y-2">
            <div className="flex flex-row justify-between">
              <CreateAssignmentField.Heading title="Question Types" />
              <div className="hidden md:flex flex-row gap-8 pr-7">
                <CreateAssignmentField.Heading title="No. Of Questions" />
                <CreateAssignmentField.Heading title="Marks" />
              </div>
            </div>

            <div className="space-y-4 w-full">
              {fields.map((field, index) => (
                <CreateAssignmentField.QuestionRequirementRow
                  key={field.id}
                  index={index}
                  control={control}
                  remove={() => remove(index)}
                />
              ))}

              <Button
                type="button"
                className=" bg-transparent -translate-x-3 flex flex-row items-center   text-black  hover:bg-transparent"
                onClick={() =>
                  append({
                    type: 'MCQ',
                    count: 1,
                    marksPerQuestion: 1,
                  })
                }
              >
                <div className=" bg-TWO p-2   rounded-full">
                  <Plus className="  size-6" color="#FFF" />
                </div>{' '}
                Add Question Type
              </Button>

              <div className="flex text-black flex-col gap-2  items-end   font-medium ">
                <div className="  ">
                  Total Questions: <span className="">{totalQuestions}</span>
                </div>

                <div className=" not-open: ">
                  Total Marks: <span className=" ">{totalMarks}</span>
                </div>
              </div>
            </div>
          </div>
          {/* Instructions */}
          <div className="space-y-2">
            <CreateAssignmentField.Heading title="Material Content" />
            <CreateAssignmentField.Textarea
              placeholder="Give your assignment material content..."
              error={errors.sourceContent}
              {...register('sourceContent')}
            />
          </div>
          {/* Instructions */}
          <div className="space-y-2">
            <CreateAssignmentField.Heading title="Additional Instructions" />
            <CreateAssignmentField.Textarea
              placeholder="Any special instructions..."
              error={errors.additionalInstructions}
              rows={6}
              {...register('additionalInstructions')}
            />
          </div>
        </form>
      </div>
      {/* Buttons */}
      <div className=" flex flex-row justify-between gap-4  mb-16 md:mb-8">
        <Button
          onClick={() => router.push('/dashboard/assignment/edit/' + String(assignmentid))}
          className=" px-4 text-[16px]  hover:bg-white bg-white text-TWO font-medium h-11 rounded-full   flex justify-center items-center gap-2"
        >
          <ArrowRight className=" size-5 rotate-180" /> Previous
        </Button>

        <Button
          onClick={handleSubmit(onSubmit)}
          disabled={isSubmitting}
          className=" px-4 text-[16px]  font-medium h-11 rounded-full   flex justify-center items-center gap-2"
        >
          {isSubmitting ? 'Saving...' : 'Save & Continue'} <ArrowRight className=" size-5  " />
        </Button>
      </div>
    </>
  );
}
