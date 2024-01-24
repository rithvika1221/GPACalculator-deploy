'use client';
import clsx from 'clsx';
import {
  UserGroupIcon,
  HomeIcon,
  Cog8ToothIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link'
import { usePathname } from 'next/navigation';

import { Console } from 'console';
import { auth } from '@/auth';
import { SessionProvider, useSession } from 'next-auth/react';






export default async function NavLinks({param} : {param:string }) {

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = [
  {
    name: 'GPA Calculator', href: `/gpacalculator/${param}`, icon: HomeIcon
  },
  // {
  //   name: 'Settings', href: `/gpacalculator/${param}/settings`, icon: Cog8ToothIcon,
  // },
  {
    name: 'Help', href: '/gpacalculator/help', icon: InformationCircleIcon,
  }
];




  const pathname = usePathname();
  return (
    <>
 
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              'flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-blue-50 p-3 text-sm font-medium hover:bg-blue-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3',
              {
                'bg-blue-100 text-blue-600': pathname === link.href,
              },
            )}

          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
   
    </>
  );
}
