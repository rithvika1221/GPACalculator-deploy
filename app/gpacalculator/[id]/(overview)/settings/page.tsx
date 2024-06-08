'use client'
import { fetchSettings, saveSettings } from '@/app/lib/data';
import { CircleStackIcon } from '@heroicons/react/24/outline';
import React, { useState, FormEvent, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { Settings } from '@/app/lib/definitions';


/**
 * Component for settings page.
 * This page allows users to customize and save GPA grade settings.
 * @param {object} params - Object containing route parameters.
 * @param {string} params.id - Unique identifier for settings.
 */
export default function Page({ params }: { params: { id: string } }) {

    // State for an array of grade scales
    const [gradeScales, setGradeScales] = useState<Settings[]>([]);

    // State for storing error message
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [color, setColor] = useState<string>('bg-red');

    // Fetch data from database
    useEffect(() => {
        const fetchData = async () => {
            const data = await fetchSettings(params.id);
            // If not data is found then set default values
            if (data.length == 0) {
                setGradeScales([
                    { letter: 'A+', gpa: 4.0, settingId: 0 },
                    { letter: 'A', gpa: 4.0, settingId: 0 },
                    { letter: 'A-', gpa: 3.7, settingId: 0 },
                    { letter: 'B+', gpa: 3.3, settingId: 0 },
                    { letter: 'B', gpa: 3.0, settingId: 0 },
                    { letter: 'B-', gpa: 2.7, settingId: 0 },
                    { letter: 'C+', gpa: 2.3, settingId: 0 },
                    { letter: 'C', gpa: 2.0, settingId: 0 },
                    { letter: 'C-', gpa: 1.7, settingId: 0 },
                    { letter: 'D', gpa: 1.3, settingId: 0 },
                    { letter: 'D+', gpa: 1.0, settingId: 0 },
                    { letter: 'F', gpa: 0.0, settingId: 0 }
                ]);
            }
            else {
                setGradeScales(data);
            }
        };
        fetchData();
    }, []);

    // Function for the submit button
    function SubmitButton() {
        const { pending } = useFormStatus()

        return (
            <button type="submit" aria-disabled={pending}
            className="bg-custom-one hover:bg-theme-three text-theme-one border border-theme-one rounded-lg w-1/4 flex items-center justify-center space-x-2" >
        <CircleStackIcon className='text-theme-one h-10     w-5' />
        <span>Save Data</span>
    </button>

            // <button type="submit" aria-disabled={pending}
            // className="bg-custom-one hover:bg-theme-three text-theme-one border border-theme-one py-1 px-3 rounded-lg">
            //     <CircleStackIcon className='bg-blue-500 text-black h-5 w-5 -my-3'></CircleStackIcon>
            //     <p className='-m-5'>Save Data</p>
            // </button>

        )
    }

    // Function for handling gade 
    const handleGradeChange = <K extends keyof Settings>(index: number, field: K, value: Settings[K]) => {
        const newGradeScales = [...gradeScales] ?? [];
        newGradeScales[index][field] = value as any;
        setGradeScales(newGradeScales);
    };

    // Function for handling the form submit
    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();

        // Validate all GPA values before submitting
        const isValid = gradeScales.every(scale => scale.gpa >= 0.0 && scale.gpa <= 4.0);
        if (!isValid) {
            setErrorMessage('Settings, not saved to database. All GPA values must be between 0.0 and 4.0. Please change the values before saving the data.');
            setColor('text-red-600');
            return;
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
        <div className="rounded-t-lg bg-blue-100 dark:border-neutral-600 dark:bg-custom-green text-theme-one w-full flex flex-col items-center justify-center">
        <h1 className="mb-4 text-3xl font-extrabold md:text-5xl text-center">GPA Grade Settings</h1>
        <form onSubmit={handleSubmit} className="w-full">
            <div className="overflow-x-auto w-full bg-theme-five">
                <table className="w-full text-left">
                    <thead>
                        <tr>
                            <th className="w-1/3 md:w-40 text-center">Grade</th>
                            <th className="w-2/3 md:w-64 text-center  w-full flex flex-col items-center justify-center">GPA Scale</th>
                        </tr>
                    </thead>
                    <tbody>
                        {gradeScales.map((scale, index) => (
                            <tr key={index}>
                                <td>
                                    <div className="rounded-2xl h-10 flex justify-center items-center">
                                        <div>{scale.letter}</div>
                                    </div>
                                </td>
                                <td className='w-full flex flex-col items-left justify-center'>
                                    <input
                                        type="number"
                                        id={`gpa-${index}`}
                                        className="rounded-lg w-1/4 text-xs sm:text-sm p-2"
                                        value={scale.gpa}
                                        onChange={(e) => handleGradeChange(index, 'gpa', parseFloat(e.target.value))}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
    
            <div className="pt-10 flex justify-center">
                <SubmitButton />
            </div>
    
            <div>
                {errorMessage && (
                    <label className={`${color}`}>{errorMessage}</label>
                )}
            </div>
        </form>
    </div>    
    

    );
};

