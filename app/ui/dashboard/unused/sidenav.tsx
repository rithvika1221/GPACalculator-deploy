import Link from 'next/link';
import NavLinks from '@/app/ui/dashboard/unused/nav-links';
import AcmeLogo from '@/app/ui/acme-logo';
import { PowerIcon } from '@heroicons/react/24/outline';
import { signOut } from '@/auth';
import { auth } from "@/auth"
 
export default async function SideNav() {
  const { user } = await auth();
  return (
    <div className="flex h-auto flex-col px-3 py-4 md:px-2">

    
      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <NavLinks param={user?.id}></NavLinks>
        <div className="hidden  w-full grow rounded-md bg-blue-50 md:block"></div>
        <form
          action={async () => {
            'use server';
            await signOut();
          }}
        >
          <button className="flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-blue-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3">
            <PowerIcon className="w-6" />
            <div className="hidden md:block">Sign Out</div>
          </button>
        </form>
      </div>
    </div>
  );
}