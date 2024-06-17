'use client'
import React, { useEffect, useState } from 'react';
import { Semester, Course, Settings } from '@/app/lib/definitions';
import { Grade, fetchSettings, gradePoints } from '@/app/lib/data';
import { Button, Switch } from '@nextui-org/react';
import { z } from 'zod';


interface AccordionItemProps {
  // Array of settings, like grade-to-GPA mappings
  settings: Settings[];
  // Data for the current semester, including courses and GPA
  semester: Semester;
  // Numeric identifier for the semester
  semesterNumber: number;
  // Function to update semester data
  updateSemester: (updatedSemester: Semester) => void;
  // Function to delete the current semester
  deleteSemester: () => void;
}


// Accordion item component to manage each course
const AccordionItem: React.FC<AccordionItemProps> = ({ settings, semester, semesterNumber, updateSemester, deleteSemester }) => {

  // state for isOpen
  const [isOpen, setIsOpen] = useState(true);
  // state of error
  const [error, setError] = useState("");
  // state for toggleOpen
  const toggleOpen = () => setIsOpen(!isOpen);
  // state for semesterDisplayName
  const semesterDisplayName = `Semester ${semesterNumber}`;

  // state for 
  const findGPAByLetter = (letter: string): number | undefined => {
    const setting = settings.find(s => s.letter === letter);
    return setting?.gpa ?? 0;
  };

  const getExtraPoints = (courseType: any) => {
    switch (courseType) {
      case 'AP':
        return 1; // 5 - 4 (base points) = 1 extra point
      case 'Honors':
        return 0.5; // 4.5 - 4 (base points) = 0.5 extra point
      default:
        return 0; // Regular courses don't have extra points
    }
  };

  // Function to calculate the Semester GPA
  const calculateGPA = (semester: Semester) => {
    let totalWeightedPoints = 0;
    let totalUnweightedPoints = 0;
    let totalCredits = 0;

    semester.course.forEach(course => {
      const basePoints = findGPAByLetter(course.courseGrade) ?? 0;
      const extraPoints = getExtraPoints(course.courseType);
      const credits = parseFloat(course.courseCredit.toString());

      totalUnweightedPoints += basePoints * credits;
      totalWeightedPoints += (basePoints + extraPoints) * credits;
      totalCredits += credits;
    });

    semester.semUnweightedGPA = totalCredits > 0 ? totalUnweightedPoints / totalCredits : 0;
    semester.semWeightedGPA = totalCredits > 0 ? totalWeightedPoints / totalCredits : 0;
  };

  const gpa = calculateGPA(semester);

  // Define the schema for a course
  const courseSchema = z.object({
    courseName: z.string().min(1, "Course name cannot be empty"),
    courseGrade: z.enum(['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'F']),
    courseCredit: z.number().min(0, "Credits must be a non-negative number"),
    courseType: z.enum(['Honors', 'AP', 'Regular']),
  });


  // Function to validate a course
  const validateCourse = (course: Course) => {
    try {
      courseSchema.parse(course);
      return true; // Valid
    } catch (error) {
      console.error(error);
      return false; // Invalid
    }
  };

  // Function to handle course detail change
  const handleCourseDetailChange = (courseIndex: number, field: keyof Course, value: string) => {
    const updatedCourses = [...semester.course];
    updatedCourses[courseIndex] = { ...updatedCourses[courseIndex], [field]: value };
    updateSemester({ ...semester, course: updatedCourses });
  };

  // function to handle Course Details Blur
  const handleCourseDetailBlur = (courseIndex: number, field: keyof Course, value: string) => {
    if (field === 'courseCredit') {
      const creditValue = parseFloat(value);
      // Validate credit value
      if (!isNaN(creditValue) && creditValue >= 0.0 && creditValue <= 5.0) {
        // If valid, update the state
        const updatedCourses = [...semester.course];
        updatedCourses[courseIndex] = { ...updatedCourses[courseIndex], [field]: creditValue };
        updateSemester({ ...semester, course: updatedCourses });
        setError(""); // Reset any error message
      } else {
        setError('CreditValue should be between 0.0 and 5.0');
      }
    }
  };

  // Fumctoin to handle add course
  const handleAddCourse = () => {
    if (semester.course.length < 10) { // Check if the number of courses is less than 10
      const newCourse = { courseName: '', courseGrade: 'A', courseCredit: '0.5', courseType: 'Regular' };
      const updatedSemester = { ...semester, course: [...semester.course, newCourse] };
      updateSemester(updatedSemester);
      setError(""); // Reset any error message
    } else {
      setError('You cannot add more than 10 courses.'); // Set an error message
    }
  };

  // Function to handle couse delete
  const handleCourseDelete = (courseIndex: number) => {
    const updatedCourses = semester.course.filter((_, index) => index !== courseIndex);
    const updatedSemester = { ...semester, course: updatedCourses };
    updateSemester(updatedSemester);
  };


  return (
    <div className="accordion-item mx-2 sm:mx-5 my-2 border-line:2px ">
      {error && <p className="text-red-500">{error}</p>}

      <div className="flex justify-between items-center border-b-2 border-gray-200 py-0">
        <button className="accordion-title flex items-center space-x-2" onClick={toggleOpen}>
          <h1 className="text-lg sm:text-xl font-semibold text-theme-one">
            {semesterDisplayName}
          </h1>
          <span className="text-gray-500 text-sm sm:text-base font-bold">
            {isOpen ? <span className='font-bold'>&#8744;</span> : <span>&#60;</span>}
          </span>
        </button>

        <div className="flex items-center space-x-4">
          <h2 className="text-sm sm:text-base text-theme-one font-bold">
            Unweighted GPA: {semester?.semUnweightedGPA ? semester.semUnweightedGPA.toFixed(2) : 'N/A'}
          </h2>
          <h2 className="text-sm sm:text-base text-theme-one font-bold">
            Weighted GPA: {semester?.semWeightedGPA ? semester.semWeightedGPA.toFixed(2) : 'N/A'}
          </h2>
        </div>
      </div>

      {isOpen && (
        <div className="overflow-x-auto mt-4">
          <table className="w-full text-xs sm:text-sm text-theme-one">
            <thead>
              <tr className='border-b'>
                <th className='text-left '>Course Name</th>
                <th className='text-left'>Grade</th>
                <th className='text-left'>Credit</th>
                <th className='text-left'>Type</th>
                <th className='text-left'></th>
              </tr>
            </thead>
            <tbody>
              {semester.course.map((course, index) => (
                <tr key={index} className="hover:bg-gray-100">
                  <td className='py-1'>
                    <input
                      type="text"
                      value={course.courseName}
                      maxLength={50}
                      onChange={(e) => handleCourseDetailChange(index, 'courseName', e.target.value)}
                      className="rounded-lg w-full text-xs sm:text-sm p-2"
                    />
                  </td>
                  <td>
                    <select
                      className="rounded-lg w-full p-2 pr-8 text-xs sm:text-sm appearance-none"
                      value={course.courseGrade}
                      onChange={(e) => handleCourseDetailChange(index, 'courseGrade', e.target.value)}
                    >
                      <option value="A+">A+</option>
                      <option value="A">A</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B">B</option>
                      <option value="B-">B-</option>
                      <option value="C+">C+</option>
                      <option value="C">C</option>
                      <option value="C-">C-</option>
                      <option value="D+">D+</option>
                      <option value="D">D</option>
                      <option value="F">F</option>
                    </select>
                  </td>
                  <td>
                    <input
                      type="number"
                      value={course.courseCredit.toString()}
                      onChange={(e) => handleCourseDetailChange(index, 'courseCredit', e.target.value)}
                      onBlur={(e) => handleCourseDetailBlur(index, 'courseCredit', e.target.value)}
                      className="rounded-lg w-full p-2 text-xs sm:text-sm"
                    />
                  </td>
                  <td>
                    <select
                      className="rounded-lg w-full p-2 pr-8 text-xs sm:text-sm appearance-none"
                      value={course.courseType}
                      onChange={(e) => handleCourseDetailChange(index, 'courseType', e.target.value)}
                    >
                      <option value="Honors">Honors</option>
                      <option value="AP">AP</option>
                      <option value="Regular">Regular</option>
                    </select>
                  </td>
                  <td>
                    <button onClick={() => handleCourseDelete(index)} className="text-red-500 hover:text-red-700">
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex space-x-2 mt-1">
            <button className="bg-custom-one hover:bg-theme-three text-theme-one border border-theme-one py-1 px-3 rounded-lg" onClick={handleAddCourse}>
              Add Course
            </button>
            <button className="bg-custom-one hover:bg-theme-three text-theme-one border border-theme-one py-1 px-3 rounded-lg" onClick={deleteSemester}>
              Delete Semester
            </button>
          </div>
        </div>
      )}
    </div>

  );
};

export default AccordionItem;
function setError(arg0: string) {
  throw new Error('Function not implemented.');
}

