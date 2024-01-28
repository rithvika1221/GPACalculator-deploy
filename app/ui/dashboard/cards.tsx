import { AcademicCapIcon } from '@heroicons/react/24/outline';
import { getStudentData } from '@/app/lib/data';

// Mapping icon types to their respective Heroicons components
const iconMap = {
  weighted: AcademicCapIcon,
  unWeighted: AcademicCapIcon
};

// CardWrapper Component:
// - This is an asynchronous functional component that fetches student data and displays it using Card components.
// - It's designed to showcase GPA information, both weighted and unweighted.
export default async function CardWrapper() {
  // Fetching student data using the getStudentData function.
    var students = await getStudentData("1");

  // Returning a fragment containing two Card components.
  // - Each Card component is passed a title, value, and type prop.
  return (
    <>
      {/* NOTE: This comment suggests that the following code should be revisited or uncommented at a specific point in the learning course. */}
      <Card title="Weighted GPA" value={students.studentWeightedGPA} type="weighted" />
      <Card title="Unweighted GPA" value={students.studentUnweightedGPA} type="unWeighted" />
    </>
  );
}

// Card Component:
// - A functional component that takes in title, value, and type as props.
// - Renders a stylized card displaying the title and value, along with an icon based on the type.
export function Card({
  title,
  value,
  type,
}: {
  title: string;
  value: number | string;
  type: 'weighted' | 'unWeighted';
}) {
  // Selecting an icon from the iconMap based on the 'type' prop.
  const Icon = iconMap[type];

  // Returning a div that contains the icon (if it exists) and the title and value in stylized text.
  return (
    <div className="rounded-xl bg-blue-500 shadow-sm h-20 ">
      <div className="flex p-5 ">
        {/* Conditionally rendering the icon based on whether it's defined in the iconMap */}
        {Icon ? <Icon className="h-5 w-5 text-white" /> : null}

        {/* Displaying the title and value passed to the Card component. The text is stylized to be bold and white. */}
        <h1 className="px-2 text-xl font-bold text-white md:text-xl lg:text-xl">{title}: {value}</h1>
      </div>
    </div>
  );
}
