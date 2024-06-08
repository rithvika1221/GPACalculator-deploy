'use client' // Ensures this code runs on the client-side in Next.js

import React, { useState } from 'react';
import { Student, Semester, Settings } from '@/app/lib/definitions';
import dynamic from 'next/dynamic';
import { Divider } from '@nextui-org/react';
import { PlusIcon, CircleStackIcon, ArrowDownOnSquareIcon } from '@heroicons/react/24/outline';
import ChatbotModal from './chatbot';
import * as XLSX from 'xlsx';

// Dynamically import AccordionItem for better performance (SSR disabled)
const AccordionItem = dynamic(() => import('./accordionItem'), { ssr: false });

// AccordionProps interface defines the props structure for the Accordion component
interface AccordionProps {
  student: Student;
  onStudentUpdate: (updatedStudent: Student) => void;
  saveStudentUpdate: (updatedStudent: Student) => void;
  gradeScales: Settings[];
}

// Accordion component to manage and display semesters and courses
const Accordion: React.FC<AccordionProps> = ({ student, onStudentUpdate, saveStudentUpdate, gradeScales }) => {

  // State management for semesters, error messages, and chatbot minimization
  const [semesters, setSemesters] = useState<Semester[]>(student.semester);
  const [error, setError] = useState(''); // State for error message
  const [isMinimized, setIsMinimized] = useState(false);
  const toggleMinimize = () => setIsMinimized(!isMinimized);

  // Function to update a semester
  const updateSemester = (index: number, updatedSemester: Semester) => {
    const updatedStudent = { ...student, semester: [...student.semester] };
    updatedStudent.semester[index] = updatedSemester;
    onStudentUpdate(updatedStudent);
    setSemesters(updatedStudent.semester);
  };

  // Function to save student data
  const saveStudent = () => {
    const updatedStudent = { ...student, semester: [...student.semester] };
    saveStudentUpdate(updatedStudent);

  };

  //Function to add a semester
  const handleAddSemester = () => {
    if (semesters.length < 8) { // Check if the number of semesters is less than 8
      // Define a default course with empty or initial values
      const defaultCourse = { courseName: '', courseGrade: '', courseCredit: '', courseType: '' };
      const newCourse = { courseName: '', courseGrade: 'A', courseCredit: '0.5', courseType: 'Regular' };
      // Create a new semester with the default course
      const newSemester = { semesterName: "", semUnweightedGPA: 0, semWeightedGPA: 0, course: [newCourse] };
      setSemesters([...semesters, newSemester]);
      setError(''); // Reset any error message
    } else {
      setError('You cannot add more than 8 semesters.'); // Set an error message
    }
  };

  // Function to delete semester
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

  

function downloadGPAData() {
  // Create a new workbook
  const wb = XLSX.utils.book_new();
  var semesterCount = 1;

  student.semester.forEach(semester => {
    // Each semester as a sheet
    const ws_data = [
      ['Course Name', 'Course Grade', 'Course Credit', 'Course Type']
    ];

    semester.course.forEach(course => {
      ws_data.push([course.courseName, course.courseGrade, course.courseCredit.toString(), course.courseType]);
    });

    // Add weighted and unweighted GPA at the end of the sheet
    ws_data.push(['', '', '', '']);
    ws_data.push(['Semester Weighted GPA', semester.semWeightedGPA.toString()]);
    ws_data.push(['Semester Unweighted GPA', semester.semUnweightedGPA.toString()]);

    // Create worksheet
    const ws = XLSX.utils.aoa_to_sheet(ws_data);

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, `Semester ${semesterCount}`);
    semesterCount++;
  });

  // Add overall GPA as a separate sheet
  const gpaSheetData = [
    ['Overall Weighted GPA', student.studentWeightedGPA],
    ['Overall Unweighted GPA', student.studentUnweightedGPA]
  ];
  const gpaWs = XLSX.utils.aoa_to_sheet(gpaSheetData);
  XLSX.utils.book_append_sheet(wb, gpaWs, 'Overall GPA');

  // Generate Excel file and trigger download
  XLSX.writeFile(wb, `${student.studentName}'s GPA Record.xlsx`);
}


  return (
    <div className='rounded-t-lg bg-blue-100 dark:border-neutral-600 dark:bg-custom-green text-black w-full'>
      {error && <p className="text-red-500">{error}</p>} {/* Display error message if it exists */}

      {semesters.map((semester, index) => (
        <React.Fragment key={index}>
          <div className="mb-2 rounded-lg overflow-hidden">
            <AccordionItem
              settings={gradeScales}
              semester={semester}
              semesterNumber={index + 1}
              updateSemester={(updatedSemester) => updateSemester(index, updatedSemester)}
              deleteSemester={() => deleteSemester(index)}
            />
          </div>
          {index < semesters.length - 1 && <Divider className="my-1" />}
        </React.Fragment>
      ))}
      <div>
        <div className="flex flex-wrap justify-center gap-3">
          <button
            type="button"
            className="bg-custom-one hover:bg-theme-three text-theme-one border border-theme-one py-1 px-4 rounded-lg"
            onClick={handleAddSemester}>
            <div className="flex justify-center items-center">
              <PlusIcon className='text-black h-5 w-5'></PlusIcon>
              <p>Add Semester</p>
            </div>
          </button>
          <button
            type="button"
            className="bg-custom-one hover:bg-theme-three text-theme-one border border-theme-one py-1 px-4 rounded-lg"
            onClick={saveStudent}>
            <div className="flex justify-center items-center">
              <CircleStackIcon className='text-black h-5 w-5'></CircleStackIcon>
              <p>Save Data</p>
            </div>
          </button>
          <button
            type="button"
            className="bg-custom-one hover:bg-theme-three text-theme-one border border-theme-one py-1 px-4 rounded-lg"
            onClick={downloadGPAData}>
            <div className="flex justify-center items-center">
              <ArrowDownOnSquareIcon className='text-black h-5 w-5'></ArrowDownOnSquareIcon>
              <p>Download Data</p>
            </div>
          </button>
        </div>
        <ChatbotModal isMinimized={isMinimized} toggleMinimize={toggleMinimize} studentData={student} />
      </div>
    </div>

  );
};
export default Accordion;
