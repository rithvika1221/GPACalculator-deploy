
'use client';
import { Card } from '@/app/ui/dashboard/cards';
import { getStudentData } from "@/app/lib/data";
import { Semester, Student, gradePoints } from "@/app/lib/definitions";
import AAccordion from "@/app/ui/dashboard/0accordion";

import React, { useState, useEffect } from 'react';


export default function Page({ params }: { params: { id: string } }) {
    //const studentData: Student = await getStudentData();

    const [studentData, setStudentData] = useState<Student | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            const data = await getStudentData("1");
            setStudentData(data);
        };
        fetchData();
    }, []);

    // const updateStudentData = async (updatedStudent: Student) => {
    //     setStudentData(updatedStudent);
    //     // Make API call to update the database
    //    // await updateStudentDataInDatabase(updatedStudent);
    //     await saveStudentData(updatedStudent);
    // };

    const updateStudentData = async (updatedStudent: Student) => {
        // Function to calculate weighted and unweighted GPA for a semester
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

        // Calculate GPA for each semester and overall GPA
        let cumulativeWeightedGPA = 0;
        let cumulativeUnweightedGPA = 0;
        let totalSemesters = 0;
        updatedStudent.semester.forEach(semester => {
            calculateGPA(semester);
            if (semester.semWeightedGPA > 0) {
                totalSemesters = totalSemesters + 1;
            }
            cumulativeWeightedGPA += semester.semWeightedGPA;
            cumulativeUnweightedGPA += semester.semUnweightedGPA;
        });

        updatedStudent.studentWeightedGPA = cumulativeWeightedGPA / totalSemesters;
        updatedStudent.studentUnweightedGPA = cumulativeUnweightedGPA / totalSemesters;

        // Update the student data in state and database
        setStudentData(updatedStudent);
        // await saveStudentData(updatedStudent);
    };



    return (

        <main>

            <div className="grid gap-1 sm:grid-cols-2 lg:grid-cols-4 h-75">
                {/* <CardWrapper /> */}
                {/* <Suspense fallback={<CardsSkeleton />}>
         
        </Suspense> */}
        <Card 
  title="Unweighted GPA" 
  value={studentData?.studentUnweightedGPA ? studentData.studentUnweightedGPA.toFixed(2) : 'N/A'} 
  type="unWeighted" 
/>
                <Card 
  title="Weighted GPA" 
  value={studentData?.studentWeightedGPA ? studentData.studentWeightedGPA.toFixed(2) : 'N/A'} 
  type="weighted" 
/>

            </div>
            {/* <Divider className="p-10"></Divider> */}
            <div className="mt-6 py-1 gap-6 md:grid-cols-8 lg:grid-cols-12">

                <div className="mt-6 py-1 gap-6 md:grid-cols-8 lg:grid-cols-12">
                    {studentData ? <AAccordion student={studentData} onStudentUpdate={updateStudentData} /> : <p>Loading student data...</p>}
                </div>



            </div>
        </main>
    );
}

