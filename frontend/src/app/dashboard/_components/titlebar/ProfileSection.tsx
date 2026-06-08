import { Bell, ChevronDown } from 'lucide-react';
import { IoMenu } from 'react-icons/io5';
type Props = {};

export default function ProfileSection({}: Props) {
  return (
    <div className=" flex flex-row  gap-3 md:gap-8 items-center">
      {/* Notification */}
      <div className=" p-2 bg-[#f3f3f3] rounded-full text-TWO w-fit">
        <Bell className="size-5" />
      </div>

      {/* Profile */}
      <div className=" flex sidebarShadow  md:p-2 rounded-2xl flex-row text-TWO gap-2 items-center">
        <div className="  size-8 md:size-7 rounded-full  bg-[#4BC26D]"></div>
        <span className="   hidden md:inline">John Doe</span>
        <ChevronDown className="   hidden md:inline" />
      </div>
      <div className="  w-fit md:hidden">
        <IoMenu className="size-7" />
      </div>
    </div>
  );
}
