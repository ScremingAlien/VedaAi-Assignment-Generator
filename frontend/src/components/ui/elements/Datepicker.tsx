'use client';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Field } from '@/components/ui/field';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { Calendar1 } from 'lucide-react';

type Props = {
  value?: Date;
  onChange: (date?: Date) => void;
};

export function Datepicker({ value, onChange }: Props) {
  return (
    <Field className="w-full">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className=" flex  justify-between   items-center h-11   font-normal w-full rounded-3xl    bg-[#FFFFFF40] font-bricolage   border-2 text-[16px] px-4  border-[#A9A9A9]"
          >
            {value ? format(value, 'PPP') : 'DD-MM-YYYY'}
            <Calendar1 className=" size-5 text-TWO" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-auto p-0" align="start">
          <Calendar mode="single" selected={value} onSelect={onChange} defaultMonth={value} />
        </PopoverContent>
      </Popover>
    </Field>
  );
}
