import React from 'react';
import { Student } from '@/app/lib/definitions';
import dynamic from 'next/dynamic';
import { Divider } from '@nextui-org/react';

const AccordionItem = dynamic(() => import('./0accordion-item'), { ssr: false });

interface AccordionProps {
  student: Student;
}

const Accordion: React.FC<AccordionProps> = ({ student }) => {
  return (
    <div className='rounded-t-lg border border-neutral-200 border-width-7 bg-white dark:border-neutral-600 dark:bg-cyan-200'>
      {student.semester.map((semester, index) => (
        <React.Fragment key={index}>
          {/* Enclose each AccordionItem in a div with border and optional padding */}
          <div className="mb-4 border-5 border-gray-300 rounded-lg overflow-hidden">
            <AccordionItem 
              semester={semester} 
              semesterNumber={index + 1}
            />
          </div>

          {/* Add a Divider except after the last item */}
          {index < student.semester.length - 1 && (
            <Divider className="my-4" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default Accordion;
