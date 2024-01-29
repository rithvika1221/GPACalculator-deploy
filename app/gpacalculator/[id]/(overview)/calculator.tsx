'use client';
import { Card } from '@/app/ui/dashboard/cards';
import { fetchSettings, getStudentData, saveStudentData } from "@/app/lib/data";
import { Semester, Settings, Student } from "@/app/lib/definitions";
import AAccordion from "@/app/ui/dashboard/accordion";
import React, { useState, useEffect } from 'react';

/**
 * Main Component for GPA Calculator 
 * Overall GPA is calculated in this component and saved to the DB
  * @param {string} params  - this parameter represents the student id
 */
export default function Calculator({ params }: { params: string }) {

    // state for teh student data.    
    const [studentData, setStudentData] = useState<Student | null>(null);

    // State for storing error message
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [color, setColor] = useState<string>('text-green-500');

    // State for an array of grade scales
    const [gradeScales, setGradeScales] = useState<Settings[]>([]);

    // Fetch grade settings from database
    useEffect(() => {
        const fetchData = async () => {
            const data = await fetchSettings(params);
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
                    { letter: 'D+', gpa: 1.3, settingId: 0 },
                    { letter: 'D', gpa: 1.0, settingId: 0 },
                    { letter: 'F', gpa: 0.0, settingId: 0 }

                ]);
            }
            else {
                setGradeScales(data);
            }
        };
        fetchData();
    }, []);

    // Function to fetch user data
    useEffect(() => {
        const fetchData = async () => {
            const data = await getStudentData(params);
            setStudentData(data);
        };
        fetchData();
    }, []);

    // Function to identify the GPA by letter 
    const findGPAByLetter = (letter: string): number | undefined => {
        const setting = gradeScales.find(s => s.letter === letter);
        return setting?.gpa ?? 0;
    };

    // function to calculate the GPA logic and save it to db
    const saveStudentT0DB = async (updatedStudent: Student) => {
        // Function to calculate weighted and unweighted GPA for a semester
        // Variables to keep track of total points and credits
        let ftotalUnweightedPoints = 0;
        let ftotalWeightedPoints = 0;
        let ftotalCredits = 0;
        let isValid = true;


        // Function to calculate weighted and unweighted GPA for a semester
        const calculateGPA = (semester: Semester) => {
            let totalWeightedPoints = 0;
            let totalUnweightedPoints = 0;
            let totalCredits = 0;
    
            for (const course of semester.course) {
                const credits = parseFloat(course.courseCredit.toString());
    
                // Check if the course credit is within the valid range
                if (credits < 0.0 || credits > 5.0) {
                    isValid = false;
                    setErrorMessage('Settings not saved to database. Credit must be a value between 0.0 and 5.0. Please change the values before saving the data.');
                    setColor('text-red-600');
                    return; // Exit the calculateGPA function if invalid data is found
                }

                if (course.courseName == '') {
                    isValid = false;
                    setErrorMessage('Course name cannot be blank. Please change the values before saving the data.');
                    setColor('text-red-600');
                    return; // Exit the calculateGPA function if invalid data is found
                }
    
                const basePoints = findGPAByLetter(course.courseGrade) ?? 0;
                const extraPoints = getExtraPoints(course.courseType);
                
                totalUnweightedPoints += basePoints * credits;
                totalWeightedPoints += (basePoints + extraPoints) * credits;
                totalCredits += credits;
            }
    
            if (isValid) {
                ftotalUnweightedPoints += totalUnweightedPoints;
                ftotalWeightedPoints += totalWeightedPoints;
                ftotalCredits += totalCredits;
                semester.semUnweightedGPA = totalCredits > 0 ? totalUnweightedPoints / totalCredits : 0;
                semester.semWeightedGPA = totalCredits > 0 ? totalWeightedPoints / totalCredits : 0;
            }
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

        // Calculate GPA for each semester
        updatedStudent.semester.forEach(semester => {
            calculateGPA(semester);
        });
       
        if(isValid)
        {
            // Calculate cumulative GPA
            updatedStudent.studentWeightedGPA = ftotalCredits > 0 ? ftotalWeightedPoints / ftotalCredits : 0;
            updatedStudent.studentUnweightedGPA = ftotalCredits > 0 ? ftotalUnweightedPoints / ftotalCredits : 0;
            await saveStudentData(updatedStudent);
            updateStudentData(updatedStudent);
            console.log(updatedStudent)
            //window.location.reload();
            setErrorMessage("GPA Information saved to database.");
            setColor('text-green-600');
        }

    };

    //function to calculate fresh gpa when a user changes the courses
    const updateStudentData = (updatedStudent: Student) => {

        // Variables to keep track of total points and credits
        let ftotalUnweightedPoints = 0;
        let ftotalWeightedPoints = 0;
        let ftotalCredits = 0;

        // function to calculate each semester GPA
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
                ftotalUnweightedPoints += basePoints * credits;
                ftotalWeightedPoints += (basePoints + extraPoints) * credits;
                ftotalCredits += credits;
            });
            semester.semUnweightedGPA = totalCredits > 0 ? totalUnweightedPoints / totalCredits : 0;
            semester.semWeightedGPA = totalCredits > 0 ? totalWeightedPoints / totalCredits : 0;
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

        // Calculate GPA for each semester
        updatedStudent.semester.forEach(semester => {
            calculateGPA(semester);
        });

        // Calculate cumulative GPA
        updatedStudent.studentWeightedGPA = ftotalCredits > 0 ? ftotalWeightedPoints / ftotalCredits : 0;
        updatedStudent.studentUnweightedGPA = ftotalCredits > 0 ? ftotalUnweightedPoints / ftotalCredits : 0;

        // Set the student data in state (this does not update the database)
        setStudentData(updatedStudent);
        setErrorMessage('');
    };


    return (
        <main>
            <div className="flex justify-between ">
                <div>
                    <Card
                        title="Unweighted GPA"
                        value={studentData?.studentUnweightedGPA ? studentData.studentUnweightedGPA.toFixed(2) : 'N/A'}
                        type="unWeighted"
                    />
                </div>
                <div>
                    <Card
                        title="Weighted GPA"
                        value={studentData?.studentWeightedGPA ? studentData.studentWeightedGPA.toFixed(2) : 'N/A'}
                        type="weighted"
                    />
                </div>
            </div>
            <div className="flex justify-left py-1 ">
                {studentData ? <AAccordion student={studentData} onStudentUpdate={updateStudentData} saveStudentUpdate={saveStudentT0DB} gradeScales={gradeScales} /> : <p>Loading student data...</p>}
            </div>
            <div>
                {errorMessage && (
                    <label className={`${color} `}>{errorMessage}</label>
                )}
            </div>
        </main>
    )
}
