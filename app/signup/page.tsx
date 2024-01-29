import Logo from '@/app/ui/acme-logo';
import SignUpForm from '@/app/ui/signup-form';

 // Component for Login page
export default function LoginPage() {
  return (
    <main className="flex items-center justify-center md:h-screen">
      <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
        <div className="flex h-20 w-full items-end rounded-lg bg-blue-500 p-3 md:h-36">
          <div className="w-48 text-white md:w-64 my-8">
            <Logo />
          </div>
        </div>
        <SignUpForm />
      </div>
    </main>
  );
}