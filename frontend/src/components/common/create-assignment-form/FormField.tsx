'use client';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FieldError } from 'react-hook-form';

export const QUESTION_TYPE_LABELS: Record<string, string> = {
  MCQ: 'Multiple Choice Questions',
  TRUE_FALSE: 'True / False',
  FILL_IN_THE_BLANK: 'Fill in the Blanks',
  ONE_WORD: 'One Word Answers',
  VERY_SHORT_ANSWER: 'Very Short Answers',
  SHORT_ANSWER: 'Short Answer Questions',
  SHORT_NOTE: 'Short Notes',
  LONG_ANSWER: 'Long Answer Questions',
  ESSAY: 'Essay Questions',
  NUMERICAL_PROBLEM: 'Numerical Problems',
  DIAGRAM_BASED: 'Diagram / Graph Based Questions',
} as const;

type BaseProps = {
  label?: string;
  error?: FieldError;
};

type InputProps = BaseProps & React.InputHTMLAttributes<HTMLInputElement>;

type TextareaProps = BaseProps & React.TextareaHTMLAttributes<HTMLTextAreaElement>;

function InputField({ label, error, ...props }: InputProps) {
  return (
    <div className="space-y-2">
      {label && (
        <Label className="text-[16px] font-bold font-bricolage leading-[140%] tracking-[-4%] text-TWO">
          {label}
        </Label>
      )}

      <Input
        className=" rounded-3xl  h-11   bg-[#FFFFFF40] font-bricolage  border-2 text-[16px]   border-[#A9A9A9]"
        {...props}
      />

      {error && <p className="text-sm text-red-500">{error.message}</p>}
    </div>
  );
}

function TextareaField({ label, error, ...props }: TextareaProps) {
  return (
    <div className="space-y-1">
      {label && <Label>{label}</Label>}
      <Textarea
        className=" rounded-[16px]  outline-dashed outline-2  bg-[#FFFFFF40] outline-[#DADADA]  border-0"
        {...props}
      />

      {error && <p className="text-sm text-red-500">{error.message}</p>}
    </div>
  );
}

function Heading({ title }: { title: string }) {
  return (
    <p className="text-[16px] font-bold font-bricolage leading-[140%] tracking-[-4%] text-TWO">
      {title}
    </p>
  );
}

//  custom select
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface QuestionTypeFieldProps {
  value?: string;
  onValueChange?: (value: string) => void;
  options: string[];
  placeholder?: string;
}
export function QuestionTypeField({
  value,
  onValueChange,
  options,
  placeholder,
}: QuestionTypeFieldProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className=" rounded-full border-0 bg-white  md:px-5  md:py-6   md:w-[85%] text-[16px] font-medium  shadow-none">
        <SelectValue placeholder={placeholder}>
          {value ? QUESTION_TYPE_LABELS[value] : 'Select Question Type'}
        </SelectValue>
      </SelectTrigger>

      <SelectContent className=" rounded-3xl  sidebarShadow font-bricolage  p-3  text-[16px]  bg-[#FFFFFF]  ">
        {options.map((option) => (
          <SelectItem key={option} value={option}>
            {QUESTION_TYPE_LABELS[option]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

/* @ts-ignore */

import { Button } from '@/components/ui/button';
import { Minus, Plus } from 'lucide-react';

interface StepperFieldProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

export function StepperField({ value, onChange, min = 1, max = 100 }: StepperFieldProps) {
  return (
    <div
      className="
        h-13
        w-full
         md:min-w-22
        rounded-full
        bg-white
        px-3
        flex
        gap-2
        items-center
        justify-between
      "
    >
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-6 w-6  text-[#b6b6b6] rounded-full"
        onClick={() => onChange(Math.max(min, value - 1))}
      >
        <Minus size={14} />
      </Button>

      <span className="font-medium">{value}</span>

      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-6 text-[#b6b6b6]  w-6 rounded-full"
        onClick={() => onChange(Math.min(max, value + 1))}
      >
        <Plus size={14} />
      </Button>
    </div>
  );
}

/* Remove Button */
import { X } from 'lucide-react';

interface RemoveButtonProps {
  onClick?: () => void;
}

export function RemoveButton({ onClick }: RemoveButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="h-10 w-10 flex items-center justify-center text-[#444]"
    >
      <X size={18} />
    </button>
  );
}

/* Stepper Field */
import { Control, Controller } from 'react-hook-form';

import { AssignmentConfigurationForm } from '@/features/assignment/utils/assignment.schema';

interface QuestionRequirementRowProps {
  index: number;
  control: Control<AssignmentConfigurationForm>;
  remove: () => void;
}

export function QuestionRequirementRow({ index, control, remove }: QuestionRequirementRowProps) {
  const options = Object.keys(QUESTION_TYPE_LABELS) as string[];

  return (
    <div className="flex  flex-col bg-white md:bg-transparent   p-1  rounded-[32px] md:rounded-none md:flex-row gap-3 w-full items-center justify-between">
      {/* Question Type */}
      <div className="flex flex-row w-full   md:justify-start justify-between flex-1 items-center">
        <Controller
          control={control}
          name={`questionRequirements.${index}.type`}
          render={({ field }) => (
            <QuestionTypeField
              value={field.value}
              onValueChange={field.onChange}
              options={options}
            />
          )}
        />

        {/* Remove */}

        <RemoveButton onClick={remove} />
      </div>

      <div className=" hidden md:flex   w-auto bg-[#F0F0F0] md:bg-transparent flex-row items-center gap-6">
        {/* Count */}
        <Controller
          control={control}
          name={`questionRequirements.${index}.count`}
          render={({ field }) => <StepperField value={field.value} onChange={field.onChange} />}
        />

        {/* Marks */}

        <Controller
          control={control}
          name={`questionRequirements.${index}.marksPerQuestion`}
          render={({ field }) => <StepperField value={field.value} onChange={field.onChange} />}
        />
      </div>

      {/* For mobile */}
      <div className=" flex md:hidden   w-full  p-2  ">
        <div className=" flex md:hidden w-full   p-2  rounded-4xl   bg-[#F0F0F0]   flex-row items-center gap-4">
          <div className="flex flex-col w-1/2 items-center gap-2">
            <p className=" font-bricolage text-[14px] font-medium  ">No. of Questions</p>
            {/* Count */}
            <Controller
              control={control}
              name={`questionRequirements.${index}.count`}
              render={({ field }) => <StepperField value={field.value} onChange={field.onChange} />}
            />
          </div>
          {/* Marks */}
          <div className="flex flex-col w-1/2 items-center gap-2">
            <p className=" font-bricolage text-[14px] font-medium  ">Marks</p>
            {/* Count */}
            <Controller
              control={control}
              name={`questionRequirements.${index}.marksPerQuestion`}
              render={({ field }) => <StepperField value={field.value} onChange={field.onChange} />}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
export const CreateAssignmentField = {
  Input: InputField,
  Textarea: TextareaField,
  Heading,
  QuestionType: QuestionTypeField,
  Stepper: StepperField,
  RemoveButton,
  QuestionRequirementRow,
};
