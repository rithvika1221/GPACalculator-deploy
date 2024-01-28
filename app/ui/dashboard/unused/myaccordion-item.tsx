// 'use client'
// import { AccordionData } from "./myaccordion-type";
// import './accordion.css'

// import { useEffect, useRef, useState } from 'react';
// import { Semester } from "@/app/lib/definitions";
// // import {Button} from "@nextui-org/react";
// // import {Card, CardBody} from "@nextui-org/react";
// import React from "react";
// import {Card, CardHeader, CardBody, CardFooter, Avatar, Button, AccordionItem} from "@nextui-org/react";



// export default async function  MyAccordionItem({
//   // data,
//   // isOpen,
//   // btnOnClick,
// }: {
//   // data: Semester;
//   // isOpen: boolean;
//   // btnOnClick: () => void;
// }) {
//   const contentRef = useRef<HTMLDivElement>(null);
//   const [height, setHeight] = useState(0);
//   const [isFollowed, setIsFollowed] = React.useState(false);


//   // useEffect(() => {
//   //   if (isOpen) {
//   //     const contentEl = contentRef.current as HTMLDivElement;

//   //     setHeight(contentEl.scrollHeight);
//   //   } else {
//   //     setHeight(0);
//   //   }
//   // }, [isOpen]);

//   return (
// <AccordionItem>test</AccordionItem>
    
//     // <li className={`accordion-item ${isOpen ? 'active' : ''}`}>
//     //   <h2 className="accordion-item-title">
//     //     <Button onClick={btnOnClick} color="primary">
//     //     {data.semesterName}
//     //     </Button>
//     //     <Card>
//     //   <CardBody>
//     //     <p>{data.semesterWeightedGPA}</p>
//     //   </CardBody>
//     // </Card>
//     //     <button className="accordion-item-btn" onClick={btnOnClick}>
        
//     //     </button>
//     //     <div ref={contentRef} >
          
//     //     </div>
//     //   </h2>
//     //   <div className="accordion-item-container" style={{ height }}>
//     //     <div ref={contentRef} className="accordion-item-content">
//     //       {data.semesterWeightedGPA}
//     //     </div>
//     //   </div>
//     // </li>
//   );
// }

