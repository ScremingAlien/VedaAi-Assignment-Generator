import Logo from '@/components/layout/public/Logo';

import ProfileSection from '../titlebar/ProfileSection';
import LinksSection from './LinksSection';
import SchoolInfo, { AiToolKitButton } from './SchoolInfo';

type Props = {};

export default function SideBar({}: Props) {
  return (
    <div className=" relative  z-999 w-full  md:w-75 p-3  h-fit md:h-full">
      <div className=" w-full  flex h-full  flex-row md:flex-col items-center md:items-start justify-between rounded-[24px] md:rounded-[16px] bg-[rgba(255,255,255,1)]   px-4 md:px-6  py-4 md:py-6 sidebarShadow">
        <div className="  md:space-y-12  md:w-full">
          <Logo />

          {/* Links and ToolKit button -> Only Desktop */}
          <div className="  hidden md:block">
            <AiToolKitButton />
            <LinksSection />
          </div>
        </div>

        <div className="   md:w-full">
          {/* Profile Section -> Only Mobile */}
          <div className=" md:hidden">
            <ProfileSection />
          </div>
          {/* SchoolInfo -> Only Desktop */}
          <div className="  hidden md:block">
            <SchoolInfo />
          </div>
        </div>
      </div>
    </div>
  );
}
