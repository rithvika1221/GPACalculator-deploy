'use client'
import React, { useState } from 'react';
import { Semester, Course, Grade, gradePoints } from '@/app/lib/definitions';
import { Button } from '@nextui-org/react';

interface AccordionItemProps {
  semester: Semester;
  semesterNumber: number;
  updateSemester: (updatedSemester: Semester) => void;
  deleteSemester: () => void;// Pass the function here
}

const AccordionItem: React.FC<AccordionItemProps> = ({ semester, semesterNumber, updateSemester, deleteSemester }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [error, setError] = useState("");

  const toggleOpen = () => setIsOpen(!isOpen);
  const semesterDisplayName = `Semester ${semesterNumber}`;

  const getExtraPoints = (courseType: any) => {
    switch(courseType) {
        case 'AP':
            return 1; // 5 - 4 (base points) = 1 extra point
        case 'Honors':
            return 0.5; // 4.5 - 4 (base points) = 0.5 extra point
        default:
            return 0; // Regular courses don't have extra points
    }
};




const calculateGPA = (semester: Semester) => {
  let totalWeightedPoints = 0;
  let totalUnweightedPoints = 0;
  let totalCredits = 0;

  semester.course.forEach(course => {
      const basePoints = gradePoints[course.courseGrade];
      const extraPoints = getExtraPoints(course.courseType);
      const credits = parseInt(course.courseCredit);

      totalUnweightedPoints += basePoints * credits;
      totalWeightedPoints += (basePoints + extraPoints) * credits;
      totalCredits += credits;
  });

  semester.semUnweightedGPA = totalCredits > 0 ? totalUnweightedPoints / totalCredits : 0;
  semester.semWeightedGPA = totalCredits > 0 ? totalWeightedPoints / totalCredits : 0;
};

const gpa = calculateGPA(semester);

  // 
  
  const handleCourseDetailChange = (courseIndex: number, field: keyof Course, value: string) => {
    const updatedCourses = [...semester.course];
    updatedCourses[courseIndex] = { ...updatedCourses[courseIndex], [field]: value };
    updateSemester({ ...semester, course: updatedCourses });
};

  const handleAddCourse = () => {
    if (semester.course.length < 10) { // Check if the number of courses is less than 10
      const newCourse = { courseName: '', courseGrade: 'A', courseCredit: '1', courseType: 'Regular' };
      const updatedSemester = { ...semester, course: [...semester.course, newCourse] };
      updateSemester(updatedSemester);
      setError(""); // Reset any error message
    } else {
      setError('You cannot add more than 10 courses.'); // Set an error message
    }
  };


  const handleCourseDelete = (courseIndex: number) => {
    const updatedCourses = semester.course.filter((_, index) => index !== courseIndex);
    const updatedSemester = { ...semester, course: updatedCourses };
    updateSemester(updatedSemester);
  };


  return (
    <div className="accordion-item">
      <button className="accordion-title" onClick={toggleOpen}>
        <h1 className="mb-4 text-xl font-bold text-white ">
          {semesterDisplayName}
        </h1>
      </button>

<div className="flex justify-between"> {/* This will spread the child divs apart */}
  <div>
    <h1 className="text-xl  text-white md:text-xl lg:text-xl">
      Unweighted GPA: {semester?.semUnweightedGPA ? semester.semUnweightedGPA.toFixed(2) : 'N/A'} 
    </h1>
  </div>
  <div>
    <h1 className="text-xl  text-white md:text-xl lg:text-xl">
      Weighted GPA: {semester?.semWeightedGPA ? semester.semWeightedGPA.toFixed(2) : 'N/A'} 
    </h1>
  </div>
</div>


      {isOpen && (
        <div className="text-xl  text-white md:text-xl lg:text-xl">
          <table>
            <thead>
              <tr className='text-white'>
                <th>Course Name</th>
                <th>Grade</th>
                <th>Credit</th>
                <th>Type</th>
              </tr>
            </thead>
            <tbody className='text-black'>
              {semester.course.map((course, index) => (
                <tr key={index}>
                  <td>
                    <input 
                      type="text" 
                      value={course.courseName} 
                      onChange={(e) => handleCourseDetailChange(index, 'courseName', e.target.value)}
                      className="rounded-xl w-64"
                    />
                  </td>
                  <td>
                  <select className= "rounded-xl w-36" value={course.courseGrade} 
                  onChange={(e) => handleCourseDetailChange(index, 'courseGrade', e.target.value)}>
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
                      <option value="E">E</option>                      
                    </select>

                  </td>
                  <td>
                    <input 
                      type="text" 
                      value={course.courseCredit.toString()} 
                      onChange={(e) => handleCourseDetailChange(index, 'courseCredit', e.target.value)}
                      className="rounded-xl w-36"
                    />
                  </td>
                  <td>
                  <select className= "rounded-xl w-48" value={course.courseType}
                   onChange={(e) => handleCourseDetailChange(index, 'courseType', e.target.value)}>
                      <option value="Honors">Honors</option>
                      <option value="AP">AP</option>
                      <option value="Regular">Regular</option>
                    </select>
                  </td>
                  <td>
                    <button onClick={() => handleCourseDelete(index)}>🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div>  
          <Button className="mt-4 bg-blue-500 text-white border border-white"  onClick={handleAddCourse}>
      Add Course
    </Button>
    <Button className="mt-4 bg-blue-500 text-white border border-white"  onClick={deleteSemester}>
      Delete Semester
    </Button>
          {/* <button type="button" className="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-800 focus:outline-none bg-white rounded-lg border border-gray-200
           hover:bg-blue-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 
          dark:focus:ring-gray-700 dark:bg-blue-500 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-blue-500"
          onClick={handleAddCourse}>
            Add Course</button>
             <button type="button" className="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-800 focus:outline-none bg-white rounded-lg border border-gray-200
           hover:bg-blue-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 
          dark:focus:ring-gray-700 dark:bg-blue-500 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-blue-500"
          onClick={deleteSemester}>
            Delete Semester</button> */}
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

