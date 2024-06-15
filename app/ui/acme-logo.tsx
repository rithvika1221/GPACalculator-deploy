import { CalculatorIcon } from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';

// Component for logo
export default function Logo() {
  return (
    <div className={`${lusitana.className} flex items-center justify-center text-theme-five`}>
      <CalculatorIcon className="h-12 w-12 rotate-[15deg]" />
      <p className="text-[28px] ml-2">GPA Calculator</p>
    </div>
  );
}
