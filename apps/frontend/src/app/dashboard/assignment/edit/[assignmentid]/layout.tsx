'use client';
import { usePathname } from 'next/navigation';
import React from 'react';
import PageHeadingSection from '../../../_components/PageHeadingSection';
type Props = { children: React.ReactNode };
export default function layout({ children }: Props) {
  const pathname = usePathname();
  const isConfigPage = pathname.includes('/configuration');

  return (
    <div>
      <div className=" mt-2 pr-3  h-full  w-full  relative">
        {/* create assignment heading - hide on mobile*/}
        <div className="   hidden md:block">
          <PageHeadingSection />
        </div>
      </div>

      <div className="  w-full md:w-205 mx-auto   mt-7 space-y-5">
        <div className=" flex flex-row justify-between gap-4">
          <div
            className=" w-1/2 h-1.25   rounded-2xl"
            style={{ backgroundColor: isConfigPage ? '#DADADA' : '#5E5E5E' }}
          ></div>
          <div
            className=" w-1/2 h-1.25   rounded-2xl"
            style={{ backgroundColor: isConfigPage ? '#5E5E5E' : '#DADADA' }}
          ></div>
        </div>
        {children}
      </div>
    </div>
  );
}
