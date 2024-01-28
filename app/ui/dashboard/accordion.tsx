'use client'
import React, { useState } from 'react';
import { Student, Semester, Settings } from '@/app/lib/definitions';
import dynamic from 'next/dynamic';
import { Divider } from '@nextui-org/react';
import { PlusIcon, CircleStackIcon } from '@heroicons/react/24/outline';
import ChatbotModal from './chatbot';

const AccordionItem = dynamic(() => import('./accordionItem'), { ssr: false });

interface AccordionProps {
  student: Student;
  onStudentUpdate: (updatedStudent: Student) => void;
  saveStudentUpdate: (updatedStudent: Student) => void;
  gradeScales : Settings[];
}

const Accordion: React.FC<AccordionProps> = ({ student, onStudentUpdate, saveStudentUpdate , gradeScales}) => {
  const [semesters, setSemesters] = useState<Semester[]>(student.semester);
  const [error, setError] = useState(''); // State for error message
  const [isMinimized, setIsMinimized] = useState(false);
  const toggleMinimize = () => setIsMinimized(!isMinimized);
    

  const updateSemester = (index: number, updatedSemester: Semester) => {
    const updatedStudent = { ...student, semester: [...student.semester] };
    updatedStudent.semester[index] = updatedSemester;
    onStudentUpdate(updatedStudent);
    setSemesters(updatedStudent.semester);
};

const saveStudent = () => {
  const updatedStudent = { ...student, semester: [...student.semester] };
  saveStudentUpdate(updatedStudent);

};

  const handleAddSemester = () => {
    if (semesters.length < 8) { // Check if the number of semesters is less than 8
      // Define a default course with empty or initial values
      const defaultCourse = { courseName: '', courseGrade: '', courseCredit: '', courseType: '' };
      const newCourse = { courseName: '', courseGrade: 'A', courseCredit: '0.5', courseType: 'Regular' };
      // Create a new semester with the default course
      const newSemester = { semesterName:"", semUnweightedGPA:0, semWeightedGPA:0, course: [newCourse] };
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
    const updatedStudent = { ...student, semester: updatedSemesters };
    onStudentUpdate(updatedStudent);
    console.log(student);
    setError('');

  };

  return (
    <div className='rounded-t-lg bg-blue-100 dark:border-neutral-600 dark:bg-blue-100  text-black w-full'>
      {error && <p className="text-red-500">{error}</p>} {/* Display error message if it exists */}
    
      {semesters.map((semester, index) => (
        <React.Fragment key={index}>
          
          <div className="mb-4  rounded-lg overflow-hidden">
            <AccordionItem
              settings={gradeScales}
              semester={semester}
              semesterNumber={index + 1}
              updateSemester={(updatedSemester) => updateSemester(index, updatedSemester)}
              deleteSemester={() => deleteSemester(index)}
            />
          </div>
          {index < semesters.length - 1 && <Divider className="my-4" />}
        </React.Fragment>
      ))}
        <div >
        <div >
        
           <button
            type="button"
            className="mt-4 bg-blue-100 text-black border border-black rounded-lg h-10 py-1 px-px w-48"
            onClick={handleAddSemester}>
              <PlusIcon className='bg-blue-100 text-black h-5 w-5 -my-3'></PlusIcon>
            <p className='-m-5'>Add Semester</p>
           
          </button> 
          <button
            type="button"
            className="mt-4 bg-blue-100 text-black border border-black rounded-lg h-10 py-1 px-px w-48"
            onClick={saveStudent}>
              <CircleStackIcon className='bg-blue-100 text-black h-5 w-5 -my-3'></CircleStackIcon>
            <p className='-m-5'>Save Data</p>
          </button> 
      <ChatbotModal isMinimized={isMinimized} toggleMinimize={toggleMinimize} studentData={student} />
        </div>
      </div>
    </div>
  );
};
export default Accordion;
