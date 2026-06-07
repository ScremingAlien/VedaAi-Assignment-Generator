'use client';
import { IoGrid } from 'react-icons/io5';
// import { Book, ChartPie, FileText, LayoutGrid, UsersRound } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BsStars } from 'react-icons/bs';
import { HiCalendarDays, HiDocumentPlus } from 'react-icons/hi2';
export default function LinkSectionMobile() {
  const pathname = usePathname();

  const links: { title: string; href: string; pattern: RegExp; icon: React.JSX.Element }[] = [
    {
      title: 'Home',
      pattern: /^\/dashboard$/,
      href: '/dashboard',
      icon: <IoGrid className="size-5" />,
    },

    {
      title: 'Assignments',
      href: '/dashboard',
      pattern: /^\/dashboard\/assignment(\/[^/]+)?$/,
      icon: <HiCalendarDays className="size-6" />,
    },

    {
      title: 'Library',
      href: '/dashboard',
      pattern: /^\/dashboard\/library$/,
      icon: <HiDocumentPlus className="size-5" />,
    },

    {
      title: 'AI Toolkit',
      href: '/dashboard',
      pattern: /^\/dashboard\/toolkit$/,
      icon: <BsStars className="size-5" />,
    },
  ];

  const pageConfig = links.find((route) => route.pattern.test(pathname));

  return (
    <div className="fixed bottom-0  w-full   p-3 z-888 left-0   md:hidden ">
      <div className=" rounded-[24px]  px-3 py-2 flex items-center text-white bg-[#181818]   flex-row justify-between">
        {links.map((link, index) => (
          <LinkRender
            key={index}
            href={link.href}
            title={link.title}
            logo={link.icon}
            isActive={pageConfig?.title === link.title}
          />
        ))}
      </div>
    </div>
  );
}

function LinkRender({
  logo,
  title,
  endIcon,
  href,
  isActive = false,
}: {
  isActive?: boolean;
  logo: React.JSX.Element;
  title: string;
  endIcon?: React.ReactNode;
  href: string;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center justify-between px-3 py-2.5 rounded-[8px] transition-colors `}
    >
      <div
        className={`flex  flex-col items-center gap-2 ${
          isActive ? 'text-TWO font-medium' : 'text-ONE font-normal'
        }`}
      >
        {/* Icon automatically inherits text color */}

        <span className={`flex items-center ${isActive ? 'text-white' : 'text-ONE'} `}>{logo}</span>
        <span
          className={` leading-[140%] font-medium text-[14px]  ${isActive ? 'text-white' : 'text-ONE'} `}
        >
          {title}
        </span>
      </div>

      {endIcon}
    </Link>
  );
}
