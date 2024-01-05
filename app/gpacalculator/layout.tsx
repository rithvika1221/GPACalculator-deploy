import SideNav from '@/app/ui/dashboard/sidenav';
import { Providers } from "@/app/providers";
import { User } from '@nextui-org/react';
import AcmeLogo from '../ui/acme-logo';
import { auth } from '@/auth';
import { getSession, useSession } from 'next-auth/react';
import Page from '../page';
import { StudentProvider } from './studentContext';


export default async function Layout({ children}: { children: React.ReactNode }) {

  const { user } = await auth();

 

    const userData = {
      name: "John Doe",
      age: 30,
    };

  return (

    <>


      <div> <div className="mb-2 flex h-14 items-end justify-start rounded-md bg-blue-500 md:0"   >

        <div className="w-32 text-white md:w-80 md:h-0 absolute left-0 p-7">
          <AcmeLogo />
        </div >
       

      </div>

      </div>
      <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
        <div className="w-full flex-none md:w-64 ">
          <SideNav />
        </div>
        <div className="flex-grow  md:overflow-y-auto md:p-4">
       
  <StudentProvider>{children}</StudentProvider>
         

       
        </div>
      </div>
    </>
  );
}
