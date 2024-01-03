
'use client';
import { Divider, Link, NextUIProvider } from "@nextui-org/react";
import { Card } from '@/app/ui/dashboard/cards';
import RevenueChart from '@/app/ui/dashboard/revenue-chart';
import LatestInvoices from '@/app/ui/dashboard/latest-invoices';
import GpaCalculator from '@/app/ui/dashboard/gpa-calculator';
import { lusitana } from '@/app/ui/fonts';
import { Suspense } from 'react';
import { InvoiceSkeleton, RevenueChartSkeleton, CardsSkeleton } from '@/app/ui/skeletons';
import CardWrapper from '@/app/ui/dashboard/cards';
import MyNavBar from "@/app/ui/dashboard/navbar";
import AcmeLogo from "@/app/ui/acme-logo";
import MyAccordion from "@/app/ui/dashboard/myacordion";
import { fetchCourseSemesterData, fetchSemesterStudentData, fetchStudentData, getStudentData, saveStudentData } from "@/app/lib/data";
import { Semester, Student } from "@/app/lib/definitions";
import AAccordion from "@/app/ui/dashboard/0accordion";

import React, { useState, useEffect } from 'react';


export default  function Page() {
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
        const calculateSemesterGPA = (semester: Semester) => {
            let totalWeightedPoints = 0;
            let totalUnweightedPoints = 0;
            let totalCredits = 0;
    
            semester.course.forEach(course => {
                let baseGradePoint = getGradePoint(course.courseGrade); // Implement this function based on your grading scale
                let extraPoint = getExtraPoint(course.courseType); // AP: 5, Honors: 4.5, Regular: 4
                totalWeightedPoints += (baseGradePoint + extraPoint) * course.courseCredit;
                totalUnweightedPoints += baseGradePoint * course.courseCredit;
                totalCredits += course.courseCredit;
            });
    
            semester.semWeightedGPA = totalCredits > 0 ? totalWeightedPoints / totalCredits : 0;
            semester.semUnweightedGPA = totalCredits > 0 ? totalUnweightedPoints / totalCredits : 0;
        };
    
        // Function to get extra grade points based on course type
        const getExtraPoint = (courseType: string) => {
            switch (courseType) {
                case "AP":
                    return 5;
                case "Honors":
                    return 4.5;
                default:
                    return 4; // Assuming "Regular" and other types
            }
        };
    
        // Implement getGradePoint based on your grading scale
        const getGradePoint = (grade: string) => {
            // Example: Convert letter grade to grade point
            switch (grade) {
                case "A":
                    return 4;
                case "B":
                    return 3;
                // ... other cases ...
                default:
                    return 0;
            }
        };
    
        // Calculate GPA for each semester and overall GPA
        let cumulativeWeightedGPA = 0;
        let cumulativeUnweightedGPA = 0;
    
        updatedStudent.semester.forEach(semester => {
            //calculateSemesterGPA(semester);
            cumulativeWeightedGPA += semester.semWeightedGPA;
            cumulativeUnweightedGPA += semester.semUnweightedGPA;
        });
    
        updatedStudent.studentWeightedGPA = cumulativeWeightedGPA / updatedStudent.semester.length;
        updatedStudent.studentUnweightedGPA = cumulativeUnweightedGPA / updatedStudent.semester.length;
    
        // Update the student data in state and database
        setStudentData(updatedStudent);
       // await saveStudentData(updatedStudent);
    };
    


    return (

        <main>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 h-75">
                {/* <CardWrapper /> */}
                {/* <Suspense fallback={<CardsSkeleton />}>
         
        </Suspense> */}
         <Card title="Weighted GPA" value={studentData?.studentWeightedGPA.toString()} type="weighted" />
      <Card title="Unweighted GPA" value={studentData?.studentUnweightedGPA.toString()} type="unWeighted" />
            </div>
            {/* <Divider className="p-10"></Divider> */}
            <div className="mt-6 py-1 gap-6 md:grid-cols-8 lg:grid-cols-12">

            <div className="mt-6 py-1 gap-6 md:grid-cols-8 lg:grid-cols-12">
        {studentData ? <AAccordion student={studentData} onStudentUpdate={updateStudentData}  /> : <p>Loading student data...</p>}
      </div>



            </div>
        </main>
    );
}

