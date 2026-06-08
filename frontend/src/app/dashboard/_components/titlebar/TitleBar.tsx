'use client';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import PageHeadingSection from '../PageHeadingSection';
import ProfileSection from './ProfileSection';
import TitleBarHeadingSection from './TitleBarHeadingSection';

type Props = {};

export default function TitleBar({}: Props) {
  const router = useRouter();
  return (
    <div className="w-full  relative z-800  md:pt-3 md:pr-3">
      <div className="w-full flex   md:border border-white  flex-row items-center justify-between rounded-[16px]   bg-transparent md:bg-[#FFFFFFBF]  px-3 md:px-6 py-2   md:sidebarShadow  ">
        {/* Left */}
        <div className=" flex   w-full  md:w-auto relative flex-row gap-2 items-center">
          {/* Back button */}
          <div
            onClick={() => router.back()}
            className=" cursor-pointer p-2 bg-white rounded-full text-TWO w-fit"
          >
            <ArrowLeft />
          </div>

          {/* Title Bar Heading - Only Desktop*/}
          <div className=" md:inline hidden">
            <TitleBarHeadingSection />
          </div>

          {/* Page Heading - Only Mobile*/}
          <div className="  md:hidden absolute  top-3 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <PageHeadingSection />
          </div>
        </div>

        {/* Right */}
        <div className="  hidden md:flex  flex-row gap-4 items-center">
          <ProfileSection />
        </div>
      </div>
    </div>
  );
}
