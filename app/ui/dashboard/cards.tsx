
import {
  AcademicCapIcon
} from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';
import { fetchStudentData } from '@/app/lib/data';
import { Divider } from '@nextui-org/react';

const iconMap = {
  weighted: AcademicCapIcon,
  unWeighted: AcademicCapIcon
};

export default async function CardWrapper() {


  var students = await fetchStudentData();



  return (
    <>
      {/* NOTE: comment in this code when you get to this point in the course */}
      <Card title="Weighted GPA" value={students.studentWeightedGPA} type="weighted" />
      <Card title="Unweighted GPA" value={students.studentUnweightedGPA} type="unWeighted" />
    </>
  );
}

export function Card({
  title,
  value,
  type,
}: {
  title: string;
  value: number | string;
  type: 'weighted' | 'unWeighted';
}) {
  const Icon = iconMap[type];

  return (
    <div className="rounded-xl bg-cyan-500  shadow-sm h-20">
      <div className="flex p-4 h-10">
        {Icon ? <Icon className="h-5 w-5 text-gray-700" /> : null}
        <h3 className="ml-2 text-sm font-medium">{title}</h3>
      </div>


      <div className='h-10'>
        <p
          className={`${lusitana.className}
          truncate rounded-xl bg-gray-100 px-4 py-4 text-center text-3xl`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}
