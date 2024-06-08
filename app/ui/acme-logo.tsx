import { CalculatorIcon } from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';

// Component for logo
export default function Logo() {
  return (<div className={`${lusitana.className} flex flex-row items-center leading-none text-theme-five h-0 w-120`}    >
    <CalculatorIcon className="h-12 w-12 rotate-[15deg]" />
    <p className="text-[28px] w-64 ">GPA Calculator </p>
  </div>
  );
}
