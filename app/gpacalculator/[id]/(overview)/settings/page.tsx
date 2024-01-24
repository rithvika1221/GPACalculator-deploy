'use client'
import { fetchSettings, saveSettings } from '@/app/lib/data';
import { CircleStackIcon } from '@heroicons/react/24/outline';
import React, { useState, FormEvent, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { Settings } from '@/app/lib/definitions';



export default  function Page({ params }: { params: { id: string } }) {
    // State for an array of grade scales
    const [gradeScales, setGradeScales] = useState<Settings[]>([]);

    // State for storing error message
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [color, setColor] = useState<string>('bg-red');

   

    useEffect(() => {

        const fetchData = async () => {
            const data = await fetchSettings(params.id);
            if(data.length ==0)
            {
                setGradeScales([
                    { letter: 'A+', gpa: 4.0,settingId:0 },
                    { letter: 'A', gpa: 4.0,settingId:0  },
                    { letter: 'A-', gpa: 3.7 ,settingId:0},
                    { letter: 'B+', gpa: 3.3 ,settingId:0},
                    { letter: 'B', gpa: 3.0 ,settingId:0 },
                    { letter: 'B-', gpa: 2.7 ,settingId:0 },
                    { letter: 'C+', gpa: 2.3 ,settingId:0},
                    { letter: 'C', gpa: 2.0 ,settingId:0},
                    { letter: 'C-', gpa: 1.7 ,settingId:0},
                    { letter: 'D+', gpa: 1.3 ,settingId:0},
                    { letter: 'D', gpa: 1.0 ,settingId:0 },
                    { letter: 'F', gpa: 0.0 ,settingId:0 }
            
                ]);
            }
            else
            {
            setGradeScales(data);
            }

        };
        fetchData();
    }, []);

    function SubmitButton() {
        const { pending } = useFormStatus()

        return (
            <button type="submit" aria-disabled={pending}
                className="mt-4 bg-blue-500 text-black border border-black rounded-lg h-10 py-1 px-px w-48">
                <CircleStackIcon className='bg-blue-500 text-black h-5 w-5 -my-3'></CircleStackIcon>
                <p className='-m-5'>Save Data</p>
             </button>

        )
    }

    const handleGradeChange = (index: number, field: keyof Settings, value: string) => {

        
        const newGradeScales = [...gradeScales];
        newGradeScales[index][field] = value;
        setGradeScales(newGradeScales);
    };
    


    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
    
        // Validate all GPA values before submitting
        const isValid = gradeScales.every(scale => scale.gpa >= 0.0 && scale.gpa <= 4.0);
        if (!isValid) {
            setErrorMessage('Settings, not saved to database. All GPA values must be between 0.0 and 4.0. Please change the values before saving the data.');
            setColor('text-red-600');
            return; // Stop the form submission
        }
    
        // Call saveSettings with the current gradeScales state
        const response = await saveSettings(gradeScales, params.id);
    
        if (!response.success) {
            setErrorMessage(response.error || "Something went wrong");
            setColor('text-red-600');
        } else {
            setErrorMessage("Successfully saved to database");
            setColor('text-green-600');
        }
    };


    return (
        <div>
            <h1 className="mb-4 text-3xl font-extrabold text-gray-900  md:text-5xl lg:text-3xl">GPA Grade Settings</h1>
            <form onSubmit={handleSubmit}>
                <table>
                    <thead>
                        <tr>
                            <th className='w-40'>Grade</th>
                            <th className='w-64'>GPA Scale</th>
                        </tr>
                    </thead>
                    <tbody>
                        {gradeScales.map((scale, index) => (
                            <tr key={index}>
                                {/* <td><div className='rounded-2xl bg-blue-100 h-10 grid gap-4 content-center text-center'><div>{scale.settingId}</div></div></td> */}
                                <td><div className='rounded-2xl bg-blue-100 h-10 grid gap-4 content-center text-center'><div>{scale.letter}</div></div></td>

                                <td>
                                    <input
                                        type="number"
                                        id="gpa"
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

                    <SubmitButton>

                    </SubmitButton>
                </div>
                <div>
                    {errorMessage && (
                        <label className={`${color} `}>{errorMessage}</label>
                    )}
                </div>
            </form>
        </div>
    );
};

