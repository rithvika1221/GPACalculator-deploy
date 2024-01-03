'use client'
import React, { useState } from 'react';
import { Student, Semester } from '@/app/lib/definitions';
import dynamic from 'next/dynamic';
import { Divider } from '@nextui-org/react';
const AccordionItem = dynamic(() => import('./0accordion-item'), { ssr: false });
interface AccordionProps {
  student: Student;
  onStudentUpdate: (updatedStudent: Student) => void;
}
const Accordion: React.FC<AccordionProps> = ({ student, onStudentUpdate }) => {
  const [semesters, setSemesters] = useState<Semester[]>(student.semester);
  const [error, setError] = useState(''); // State for error message

  const updateSemester = (index: number, updatedSemester: Semester) => {
    const updatedStudent = { ...student, semester: [...student.semester] };
    updatedStudent.semester[index] = updatedSemester;
    onStudentUpdate(updatedStudent);
    setSemesters(updatedStudent.semester);
};

  const handleAddSemester = () => {
    if (semesters.length < 8) { // Check if the number of semesters is less than 8
      // Define a default course with empty or initial values
      const defaultCourse = { courseName: '', courseGrade: '', courseCredit: '', courseType: '' };
      // Create a new semester with the default course
      const newSemester = { course: [defaultCourse] };
      setSemesters([...semesters, newSemester]);
      setError(''); // Reset any error message
    } else {
      setError('You cannot add more than 8 semesters.'); // Set an error message
    }
  };

  const deleteSemester = (index: number) => {
    // Logic to delete the semester
    console.log(student);
    const updatedSemesters = semesters.filter((_, semesterIndex) => semesterIndex !== index);
    setSemesters(updatedSemesters);
    console.log(student);
  };

  return (
    <div className='rounded-t-lg border border-neutral-200 bg-white dark:border-neutral-600 dark:bg-gray-200 w-2/3'>
      {error && <p className="text-red-500">{error}</p>} {/* Display error message if it exists */}
      {semesters.map((semester, index) => (
        <React.Fragment key={index}>
          <div className="mb-4 border-5 border-gray-300 rounded-lg overflow-hidden">
            <AccordionItem
              semester={semester}
              semesterNumber={index + 1}
              updateSemester={(updatedSemester) => updateSemester(index, updatedSemester)}
              deleteSemester={() => deleteSemester(index)}
            />
          </div>
          {index < semesters.length - 1 && <Divider className="my-4" />}
        </React.Fragment>
      ))}
      <div className='py-6'>
        <div>
          <button
            type="button"
            className="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-800 focus:outline-none bg-white rounded-lg border border-gray-200
             hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 
            dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
            onClick={handleAddSemester}
          >
            Add Semester
          </button>
        </div>
      </div>
    </div>
  );
};
export default Accordion;
