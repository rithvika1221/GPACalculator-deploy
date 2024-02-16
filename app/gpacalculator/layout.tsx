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
      <div className={`${lusitana.className} flex flex-col items-center justify-top min-h-screen`}>
        <div className="flex flex-col md:flex-row justify-between items-center rounded-md bg-blue-500 text-white p-4 md:p-7 w-full">
          <div className='flex justify-start md:flex-1 py-2 md:py-3'>
            <Logo />
          </div>
          <div className='text-xl py-2 md:py-0 flex justify-center md:flex-1 items-center'>Welcome: {user.name}</div>
          <div className='flex flex-wrap md:flex-nowrap gap-2 md:gap-4 justify-end md:flex-1'>
            <Link
              key='GpaCalculator'
              href={`/gpacalculator/${user.id}`}
              className='flex w-full md:w-auto h-[36px] items-center justify-center gap-2 rounded-md bg-blue-50 p-3 text-sm font-medium hover:bg-blue-100 hover:text-blue-600'>
              <HomeIcon className="w-6" />
              <p>Calculator</p>
            </Link>
            <Link
              key='Settings'
              href={`/gpacalculator/${user.id}/settings`}
              className='flex w-full md:w-auto h-[36px] items-center justify-center gap-2 rounded-md bg-blue-50 p-3 text-sm font-medium hover:bg-blue-100 hover:text-blue-600'>
              <Cog8ToothIcon className="w-6" />
              <p>Settings</p>
            </Link>
            <Link
              key='Help'
              href='/gpacalculator/help'
              className='flex w-full md:w-auto h-[36px] items-center justify-center gap-2 rounded-md bg-blue-50 p-3 text-sm font-medium hover:bg-blue-100 hover:text-blue-600'>
              <InformationCircleIcon className="w-6" />
              <p>Help</p>
            </Link>
            <form
              action={async () => {
                'use server';
                await signOut();
              }}
              className='w-full md:w-auto'>
              <button
                className='flex w-full md:w-auto h-[36px] items-center justify-center gap-2 rounded-md bg-blue-50 p-3 text-sm font-medium hover:bg-blue-100 hover:text-blue-600'>
                <PowerIcon className="w-6" />
                <p>Sign Out</p>
              </button>
            </form>
          </div>
        </div>

        <div className="overflow-y-auto p-4 w-full xl:w-4/5 2xl:w-3/5">
          {children}
        </div>
      </div>
    </>


  );
}
