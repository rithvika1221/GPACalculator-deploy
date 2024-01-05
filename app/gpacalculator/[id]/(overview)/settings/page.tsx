'use client'
import { CircleStackIcon } from '@heroicons/react/24/outline';
import { Divider } from '@nextui-org/react';
import React, { useState, FormEvent } from 'react';
// Define a type for the grade scale
type GradeScale = {
  letter: string;
  percent: string;
  gpa: number;
};
const GpaSettings: React.FC = () => {
    // State for an array of grade scales
    const [gradeScales, setGradeScales] = useState<GradeScale[]>([
        { letter: 'A+', percent: '97–100', gpa: 4.0 },
        { letter: 'A', percent: '93–96', gpa: 4.0 },
        { letter: 'A-', percent: '90–92', gpa: 3.7 },
        { letter: 'B+', percent: '87–89', gpa: 3.3 },
        { letter: 'B', percent: '83–86', gpa: 3.0 },
        { letter: 'B-', percent: '80–82', gpa: 2.7 },
        { letter: 'C+', percent: '77–79', gpa: 2.3 },
        { letter: 'C', percent: '73–76', gpa: 2.0 },
        { letter: 'C-', percent: '70–72', gpa: 1.7 },
        { letter: 'D+', percent: '67–69', gpa: 1.3 },
        { letter: 'D', percent: '65–66', gpa: 1.0 },
        { letter: 'F', percent: 'Below 65', gpa: 0.0 }
     
    ]);
    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        // Handle the form submission logic here
        console.log('Grade Scales:', gradeScales);
    };
    // Function to handle changes to any of the grade scale fields
    const handleGradeChange = (index: number, field: keyof GradeScale, value: string) => {
        const newGradeScales = [...gradeScales];
        newGradeScales[index][field] = value;
        setGradeScales(newGradeScales);
    };
    return (
        <div>
            <h1 className ="mb-4 text-3xl font-extrabold text-gray-900  md:text-5xl lg:text-3xl">GPA Grade Settings</h1>
            <form onSubmit={handleSubmit}>
                <table>
                    <thead>
                        <tr>
                            <th className='w-40'>Grade</th>
                            <th className='w-40'>Percentage </th>
                            <th className='w-64'>GPA Scale</th>
                        </tr>
                    </thead>
                    <tbody>
                        {gradeScales.map((scale, index) => (
                            <tr key={index}>
                                <td><div className='rounded-2xl bg-blue-100 h-10 grid gap-4 content-center text-center'><div>{scale.letter}</div></div></td>
                                
                            
                                <td><div className='rounded-2xl bg-blue-100 h-10 grid gap-4 content-center text-center'><div>{scale.percent}</div></div></td>
                                
                                <td>
                                    <input
                                        type="text"
                                        className="block flex-1 border-1 w-64 rounded-xl bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                        value={scale.gpa}
                                        onChange={(e) => handleGradeChange(index, 'gpa', e.target.value)}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
               
                <div className='pt-6'>
                <button
            type="button"
            className="mt-4 bg-blue-500 text-black border border-black rounded-lg h-10 py-1 px-px w-48">
              <CircleStackIcon className='bg-blue-500 text-black h-5 w-5 -my-3'></CircleStackIcon>
            <p className='-m-5'>Save Data</p>
           
          </button> 
                </div>
            </form>
        </div>
    );
};
export default GpaSettings;
