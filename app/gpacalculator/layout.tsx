import SideNav from '@/app/ui/dashboard/sidenav';
import { Providers } from "@/app/providers";
import { Link, User } from '@nextui-org/react';
import AcmeLogo from '../ui/acme-logo';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div> <div className="mb-2 flex h-14 items-end justify-start rounded-md bg-gray-700  md:0"   >

        <div className="w-32 text-white md:w-80 md:h-0 absolute left-0 p-7">
          <AcmeLogo />
        </div >
        <div className='absolute right-0'>
          <User
          name="Jane Doe"
          description="Product Designer"
          avatarProps={{
            src: "https://i.pravatar.cc/150?u=a04258114e29026702d"
          }}
        />
        </div>

      </div>

      </div>
      <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
        <div className="w-full flex-none md:w-64 ">
          <SideNav />
        </div>
        <div className="flex-grow p-6 md:overflow-y-auto md:p-4">
          <Providers>{children}</Providers>
        </div>
      </div>
    </>
  );
}