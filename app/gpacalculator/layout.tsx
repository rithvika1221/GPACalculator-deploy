import SideNav from '@/app/ui/dashboard/sidenav';
import AcmeLogo from '../ui/acme-logo';
import { auth } from '@/auth';
import { StudentProvider } from './studentContext';
export default async function Layout({ children }: { children: React.ReactNode }) {
  const { user } = await auth();

  return (
    <>
      <div className="mb-2 h-14 flex items-center justify-between rounded-md bg-blue-500 text-white p-7">
  <div><AcmeLogo /></div>
  <div className='text-xm'>Welcome: {user.name}</div>
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
