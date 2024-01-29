import Logo from '../ui/acme-logo';
import { auth, signOut } from '@/auth'; // Authentication utilities
import { Link } from '@nextui-org/react'; // Next UI Link component
import { HomeIcon, InformationCircleIcon, Cog8ToothIcon, PowerIcon } from '@heroicons/react/24/outline'; // Heroicons for UI elements
import { lusitana } from '../ui/fonts'; // Custom font

// Layout component with children props for nested content
// This component define all the navigation links
export default async function Layout({ children }: { children: React.ReactNode }) {
  const { user } = await auth(); // Fetch user data using auth

  return (
    <>
    <div className={`${lusitana.className} flex flex-col items-center justify-center`}>
        <div className="flex justify-between  rounded-md bg-blue-500 text-white p-7  w-full md:w-3/5">
          <div className='flex-1 py-3'><Logo /></div>
          <div className='text-xl flex-1'>Welcome: {user.name}</div>
          <div className='flex-1 flex items-strech'>
            <div className='flex-1'>
              <Link
                key='GpaCaclculator'
                href={`/gpacalculator/${user.id}`}
                className='flex h-[36px]  items-center justify-center gap-2 rounded-md bg-blue-50 p-3 text-sm font-medium hover:bg-blue-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3'>
                <HomeIcon className="w-6" />
                <p className="hidden md:block">Calculator</p>
              </Link>
            </div>
            <div className='flex-1'>
              <Link
                key='Settings'
                href={`/gpacalculator/${user.id}/settings`}
                className='flex h-[36px]  items-center justify-center gap-2 rounded-md bg-blue-50 p-3 text-sm font-medium hover:bg-blue-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3'>
                <Cog8ToothIcon className="w-6" />
                <p className="hidden md:block">Settings</p>
              </Link>
            </div>
            <div className='flex-1'>
              <Link
                key='Help'
                href='\gpacalculator\help'
                className='flex h-[36px]  items-center justify-center gap-2 rounded-md bg-blue-50 p-3 text-sm font-medium hover:bg-blue-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3'>
                <InformationCircleIcon className="w-6" />
                <p className="hidden md:block">Help</p>
              </Link>
            </div>
            <div className='flex-1'>
              <form
                action={async () => {
                  'use server';
                  await signOut();
                }}
              >
                <button 
                // className="flex h-[36px] grow items-center justify-center gap-2 rounded-md bg-blue-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3">
                className='flex h-[36px] text-blue-500 items-center justify-center gap-2 rounded-md bg-blue-50 p-3 text-sm font-medium hover:bg-blue-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3'>
                  <PowerIcon className="w-6" />
                  <div className="hidden md:block">Sign Out</div>
                </button>
              </form>
            </div>
          </div>

        </div>

        <div className="md:overflow-y-auto md:p-4 w-full md:w-3/5 ">
            
            {children}
        </div>
      </div>
    </>
  );
}
