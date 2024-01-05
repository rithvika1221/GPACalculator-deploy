'use client';
import { Card } from '@/app/ui/dashboard/cards';
import { getStudentData, saveStudentData } from "@/app/lib/data";
import { Semester, Student, gradePoints, User } from "@/app/lib/definitions";
import AAccordion from "@/app/ui/dashboard/0accordion";
import { useSession } from 'next-auth/react';
import React, { useState, useEffect } from 'react';
import { auth } from '@/auth';
import { CircleStackIcon } from '@heroicons/react/24/outline';
export default function Calculator({ params }: { params: string }) {
    //const studentData: Student = await getStudentData();
    const [stu, setData] = useState(null);
    const [studentData, setStudentData] = useState<Student | null>(null);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {

                const response = await fetch('/api/userdetails');
                const data = await response.json();
                setMessage(data.message);
            } catch (error) {

                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);
 

    useEffect(() => {

        const fetchData = async () => {
            const data = await getStudentData(params);
            setStudentData(data);

        };
        fetchData();
    }, []);

    const saveStudentT0DB = async (updatedStudent: Student) => {
            // Function to calculate weighted and unweighted GPA for a semester
              // Variables to keep track of total points and credits
              let ftotalUnweightedPoints = 0;
              let ftotalWeightedPoints = 0;
              let ftotalCredits = 0;
   
   
           // Function to calculate weighted and unweighted GPA for a semester
           const calculateGPA = (semester: Semester) => {
               let totalWeightedPoints = 0;
               let totalUnweightedPoints = 0;
               let totalCredits = 0;
               semester.course.forEach(course => {
                   const basePoints = gradePoints[course.courseGrade];
                   const extraPoints = getExtraPoints(course.courseType);
                   const credits = parseFloat(course.courseCredit);
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
            
            await saveStudentData(updatedStudent);
            window.location.reload();
       
    };

    const updateStudentData = async (updatedStudent: Student) => {

           // Variables to keep track of total points and credits
           let ftotalUnweightedPoints = 0;
           let ftotalWeightedPoints = 0;
           let ftotalCredits = 0;


        // Function to calculate weighted and unweighted GPA for a semester
        const calculateGPA = (semester: Semester) => {
            let totalWeightedPoints = 0;
            let totalUnweightedPoints = 0;
            let totalCredits = 0;
            semester.course.forEach(course => {
                const basePoints = gradePoints[course.courseGrade];
                const extraPoints = getExtraPoints(course.courseType);
                const credits = parseFloat(course.courseCredit);
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
    };
    

    return (
        <main>
          
            <div className="grid  sm:grid-cols-2 lg:grid-cols-4 ">
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
            <div className=" py-1  md:grid-cols-8 lg:grid-cols-12">
                <div className="mt-2 py-1  md:grid-cols-8 lg:grid-cols-12">
                    {studentData ? <AAccordion student={studentData} onStudentUpdate={updateStudentData} saveStudentUpdate={saveStudentT0DB} /> : <p>Loading student data...</p>}
                </div>
               
            </div>
        </main>
    )
}
