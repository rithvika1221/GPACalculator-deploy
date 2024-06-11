import Logo from '@/app/ui/acme-logo';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';
import Link from 'next/link';
import Image from 'next/image';

// Component for the root layout of the GPA Calculator
export default function Page({}) {
  return (
    <main className="flex min-h-screen flex-col p-6">
      <div className="flex h-20 rounded-lg bg-gradient-to-r p-4 md:h-40 -p-10 items-center">
        <Logo />
      </div>
      <div className="mt-4 flex grow flex-col gap-4 md:flex-row">
        <div className="flex flex-col justify-center gap-6 rounded-lg bg-custom-green px-6 py-10 md:w-2/5 md:px-20">
          <p
            className={`${lusitana.className} text-xl text-gray-800 md:text-3xl md:leading-normal`}
          >
            <strong>Welcome to GPA Calculator</strong> 
          </p>
        
          <Link
            href="/signup"
            className="flex items-center gap-5 self-start text-blue-600 rounded-lg bg-gradient-to-b px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-300 md:text-base"
          >
            <span>Sign up</span> <ArrowRightIcon className="w-5 md:w-6" />
          </Link>
        </div>
        <div className="flex justify-center items-center md:w-3/5">
          <Image
            src="/images/Landing.jpg"
            alt="Descriptive Alt Text"
            width={1500} // Set the width according to your image dimensions
            height={1500} // Set the height according to your image dimensions
            className="rounded-lg"
          />
        </div>
      </div>
    </main>
  );
}
