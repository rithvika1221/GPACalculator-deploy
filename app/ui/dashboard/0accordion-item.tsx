'use client'
import React, { useState } from 'react';
import { Semester,Course } from '@/app/lib/definitions';
import { Input, Select, SelectItem } from '@nextui-org/react';

interface AccordionItemProps {
  semester: Semester;
  semesterNumber: number; 
}

const AccordionItem: React.FC<AccordionItemProps> = ({ semester ,semesterNumber}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => setIsOpen(!isOpen);
  const semesterDisplayName = `Semester ${semesterNumber}`;

  return (
    <div className="accordion-item">
      <button className="accordion-title" onClick={toggleOpen}>
        {semesterDisplayName}
      </button>
      {isOpen && (
        <div className="accordion-content">
          <table>
            <thead>
              <tr>
                <th>Course Name</th>
                <th>Grade</th>
                <th>Credit</th>
                <th>Type</th>
              </tr>
            </thead>
            <tbody>
              {semester.course.map((course, index) => (
                <tr key={index}>
                   <td><input type="text" value={course.courseName} /></td>
                  <td>
                    {/* <select>
                      <option value="A">A</option>
                     
                    </select> */}
                     <Select label="Select an grade" className="max-w-xs w-40" >
                        <SelectItem key={"A+"} value={"A+"}> {"A+"} </SelectItem>
                        <SelectItem key={"A"} value={"A"}> {"A"} </SelectItem>
                        <SelectItem key={"A-"} value={"A-"}> {"A-"} </SelectItem>
                        <SelectItem key={"A+"} value={"A+"}> {"A"} </SelectItem>
                        <SelectItem key={"A+"} value={"A+"}> {"A"} </SelectItem>
                        <SelectItem key={"A+"} value={"A+"}> {"A"} </SelectItem>
                        <SelectItem key={"A+"} value={"A+"}> {"A"} </SelectItem>
                        <SelectItem key={"A+"} value={"A+"}> {"A"} </SelectItem>
                        <SelectItem key={"A+"} value={"A+"}> {"A"} </SelectItem>
                        <SelectItem key={"A+"} value={"A+"}> {"A"} </SelectItem>
                        <SelectItem key={"A+"} value={"A+"}> {"A"} </SelectItem>
                        <SelectItem key={"A+"} value={"A+"}> {"A"} </SelectItem>

                       
                    </Select>
                  </td>
                  {/* <td><input type="text" value={course.courseCredit.toString()} /></td> */}
                  <td> <Input type="decimal"  placeholder="Enter course credit" /></td>

                  <td>
                    {/* Dropdown for selecting the course type */}
                    <Select label="Select an course" className="max-w-xs w-40" >
                        <SelectItem key={"AP"} value={"AP"}>
                            {"AP"}
                        </SelectItem>
                        <SelectItem key={"Honors"} value={"Honors"}>
                            {"Honors"}
                        </SelectItem>
                        <SelectItem key={"Regular"} value={"Regular"}>
                            {"Regular"}
                        </SelectItem>
                    </Select>
                   
                  </td>
                  <td>
                    <button onClick={() => handleCourseDelete(course.courseName)}>🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AccordionItem;
