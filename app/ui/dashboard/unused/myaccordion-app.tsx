
import Accordion from "../myacordion";
import { fetchSemesterStudentData, fetchStudentData } from '@/app/lib/data';
import { Course, Semester, StudentData } from "@/app/lib/definitions";
import clsx from "clsx";


//{ items }: { items: Array<AccordionData> }
  export default async function MyAccordionApp() { // Make component async, remove the props
  
    var students = await fetchStudentData();
    var semesters = await fetchSemesterStudentData();
    
    // const semesterDetails = students.semester.map((semester: { course: any[]; }) => {
    //   //  const courses = semester.course.map(course => {
    //   //    <div>  Course: ${course.course_name}, Grade: ${course.course_grade}</div>
    //   //  });
    //   });
    const items = [];
    semesters.map((item: { semesterName: any; semesterId: any; semesterStudent: { studentName: any; }; }) => ({
     
  }));





  
    const accordionItems = [
        {
          title: 'Semester1',
          content: (
            <div>
              <strong>This is the first item's accordion body.</strong> It is hidden
              by default, but shown when the title is clicked. It will also be
              hidden if the title is clicked again or when another item is clicked.
              You can pass HTML tags in the content such as <u>underline tag</u>,{' '}
              <i>italic</i>, or even another list like this:
              <ul>
                <li>Bread</li>
                <li>Eggs</li>
                <li>Milk</li>
              </ul>
            </div>
          ),
        },
        {
          title: 'Accordion Item #2',
          content: (
            <div>
              <strong>This is the second item's accordion body.</strong> It is
              hidden by default, but shown when the title is clicked. It will also
              be hidden if the title is clicked again or when another item is
              clicked. You can pass HTML tags in the content such as{' '}
              <u>underline tag</u>, <i>italic</i>, or even another list like this:
              <ul>
                <li>Bread</li>
                <li>Eggs</li>
                <li>Milk</li>
              </ul>
            </div>
          ),
        },
        {
          title: 'Accordion Item #3',
          content: (
            <div>
              <strong>This is the third item's accordion body.</strong> It is hidden
              by default, but shown when the title is clicked. It will also be
              hidden if the title is clicked again or when another item is clicked.
              You can pass HTML tags in the content such as <u>underline tag</u>,{' '}
              <i>italic</i>, or even another list like this:
              <ul>
                <li>Bread</li>
                <li>Eggs</li>
                <li>Milk</li>
              </ul>
            </div>
          ),
        },
      ];

  return (

    
  
    <div className="container">
    <Accordion items={semesters} />
  </div>
      


  );
}
