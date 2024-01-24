
import {
  AcademicCapIcon
} from '@heroicons/react/24/outline';
import { getStudentData } from '@/app/lib/data';

const iconMap = {
  weighted: AcademicCapIcon,
  unWeighted: AcademicCapIcon
};

export default async function CardWrapper() {
  var students = await getStudentData("1");
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
    <div className="rounded-xl bg-blue-500  shadow-sm h-20 ">
      <div className="flex p-5 ">
        {Icon ? <Icon className="h-5 w-5 text-white" /> : null}

        <h1 className="px-2 text-xl font-bold text-white md:text-xl lg:text-xl">{title}: {value}</h1>
      </div>
    </div>
  );
}
