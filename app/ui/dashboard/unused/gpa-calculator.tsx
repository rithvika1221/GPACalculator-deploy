'use client'
import { Button} from "@nextui-org/button";

import {Input} from "@nextui-org/input";

import {  Navbar,   NavbarBrand,   NavbarContent,   NavbarItem,   NavbarMenuToggle,  NavbarMenu,  NavbarMenuItem} from "@nextui-org/navbar";

import {Accordion, AccordionItem} from "@nextui-org/accordion";
import { Link } from "@nextui-org/react";

import { ArrowPathIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import Image from 'next/image';
import { lusitana } from '@/app/ui/fonts';
import { LatestInvoice } from '@/app/lib/definitions';

import { fetchStudentData } from '@/app/lib/data';
import MyAccordion from "./myacordion";
import MyAccordionApp from "./myaccordion-app";

// export default async function LatestInvoices({
//   latestInvoices,
// }: {
//   latestInvoices: LatestInvoice[];
// }) {
  export default async function GpaCalculator({children}: { children: React.ReactNode }) { // Make component async, remove the props
   // const latestInvoices = await fetchLatestInvoices(); // Fetch data inside the component
    var students = await fetchStudentData();
    const defaultContent =     "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";

    const colors = [
        "default",
        "primary",
        "secondary",
        "success",
        "warning",
        "danger",
      ];
  return (

    
  
    <div className="flex w-full flex-col md:col-span-4">
      
       <Accordion selectionMode="multiple">
      <AccordionItem key="1" aria-label="Accordion 1" title="Accordion 1">
        {defaultContent}
      </AccordionItem>
      <AccordionItem key="2" aria-label="Accordion 2" title="Accordion 2">
        {defaultContent}
      </AccordionItem>
      <AccordionItem key="3" aria-label="Accordion 3" title="Accordion 3">
        {defaultContent}
      </AccordionItem>
    </Accordion> 

    {/* <MyAccordionApp></MyAccordionApp> */}
    
      <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
       Semesters
      </h2>
      <div className="flex grow flex-col justify-between rounded-xl bg-blue-50 p-4">
        {/* NOTE: comment in this code when you get to this point in the course */}
        <div>
        <h1>Student Name: {students.studentName}</h1>
            {/* <h1>Student Name: {students.studentName}</h1>
            <p>Total Weighted GPA: {students.totalWeightedGpa}</p>
            <p>Total Unweighted GPA: {students.totalUnweightedGpa}</p> */}
    </div>
      

      </div>
    </div>
  );
}
