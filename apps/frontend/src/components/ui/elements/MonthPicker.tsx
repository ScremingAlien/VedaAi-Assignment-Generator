'use client';

import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { useState } from 'react';

type Props = {
  value?: Date;
  onChange: (date?: Date) => void;
};

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function MonthPicker({ value, onChange }: Props) {
  // 👇 control visible year (not just selected year)
  const [year, setYear] = useState(value?.getFullYear() || new Date().getFullYear());

  const handleSelect = (monthIndex: number) => {
    const newDate = new Date(year, monthIndex, 1);
    onChange(newDate);
  };

  return (
    <Field className=" w-fit">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="justify-start font-normal w-full">
            {value ? format(value, 'MMM yyyy') : 'Pick a month'}
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-64 p-3 space-y-3">
          {/* 🔹 Year Navigation */}
          <div className="flex items-center justify-between">
            <Button variant="outline" size="sm" onClick={() => setYear((prev) => prev - 1)}>
              ←
            </Button>

            <span className="font-medium">{year}</span>

            <Button variant="outline" size="sm" onClick={() => setYear((prev) => prev + 1)}>
              →
            </Button>
          </div>

          {/* 🔹 Month Grid */}
          <div className="grid grid-cols-3 gap-2">
            {months.map((month, index) => {
              const isSelected =
                value && value.getMonth() === index && value.getFullYear() === year;

              return (
                <Button
                  key={month}
                  variant={isSelected ? 'default' : 'outline'}
                  onClick={() => handleSelect(index)}
                >
                  {month}
                </Button>
              );
            })}
          </div>
        </PopoverContent>
      </Popover>
    </Field>
  );
}
