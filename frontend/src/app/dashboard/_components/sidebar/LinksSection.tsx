'use client';

import { useAssignmentStore } from '@/features/assignment/store/assignment-form.store';
import { Book, ChartPie, FileText, LayoutGrid, UsersRound } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function LinksSection() {
  const pathname = usePathname();
  const { totalAssignments } = useAssignmentStore();
  const links: {
    title: string;
    pattern: RegExp;
    href: string;
    icon: React.JSX.Element;
    endIcon?: React.JSX.Element;
  }[] = [
    {
      title: 'Home',
      href: '/dashboard',
      pattern: /^\/dashboard$/,
      icon: <LayoutGrid />,
    },
    {
      title: 'My Groups',
      href: '/dashboard/groups',
      pattern: /^\/dashboard\/groups(\/[^/]+)?$/,
      icon: <UsersRound />,
    },
    {
      title: 'Assignments',
      href: '/dashboard/assignments',
      pattern: /^\/dashboard\/assignment(\/[^/]+)?$/,
      icon: <FileText />,
      endIcon: (
        <div className="bg-[#FF5623] text-sm px-2 rounded-lg flex items-center font-semibold h-5 text-white">
          {totalAssignments}
        </div>
      ),
    },
    {
      title: 'AI Teacher’s Toolkit',
      href: '/dashboard/toolkit',
      pattern: /^\/dashboard\/toolkit$/,
      icon: <Book />,
    },
    {
      title: 'My Library',
      href: '/dashboard/library',
      pattern: /^\/dashboard\/library$/,
      icon: <ChartPie />,
    },
  ];

  const pageConfig = links.find((route) => route.pattern.test(pathname));

  return (
    <div className="space-y-1">
      {links.map((link, index) => (
        <LinkRender
          key={index}
          href={link.href}
          title={link.title}
          logo={link.icon}
          endIcon={link.endIcon}
          isActive={pageConfig?.title === link.title}
        />
      ))}
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
  logo: React.ReactNode;
  title: string;
  endIcon?: React.ReactNode;
  href: string;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center justify-between px-3 py-2.5 rounded-[8px] transition-colors ${
        isActive ? 'bg-[#F0F0F0]' : 'hover:bg-gray-50'
      }`}
    >
      <div
        className={`flex items-center gap-2 ${
          isActive ? 'text-TWO font-medium' : 'text-ONE font-normal'
        }`}
      >
        {/* Icon automatically inherits text color */}
        <span className="flex items-center">{logo}</span>

        <span className="leading-[140%] text-[16px]">{title}</span>
      </div>

      {endIcon}
    </Link>
  );
}
