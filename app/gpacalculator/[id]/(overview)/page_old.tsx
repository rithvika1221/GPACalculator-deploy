

import { Divider, Link, NextUIProvider } from "@nextui-org/react";
import { Card } from '@/app/ui/dashboard/cards';
import RevenueChart from '@/app/ui/dashboard/unused/revenue-chart';
import LatestInvoices from '@/app/ui/dashboard/unused/latest-invoices';
import GpaCalculator from '@/app/ui/dashboard/unused/gpa-calculator';
import { lusitana } from '@/app/ui/fonts';
import { Suspense } from 'react';
import { InvoiceSkeleton, RevenueChartSkeleton, CardsSkeleton } from '@/app/ui/skeletons';
import CardWrapper from '@/app/ui/dashboard/cards';
import MyNavBar from "@/app/ui/dashboard/unused/navbar";
import AcmeLogo from "@/app/ui/acme-logo";
import MyAccordion from "@/app/ui/dashboard/unused/myacordion";
import { fetchCourseSemesterData, fetchSemesterStudentData, fetchStudentData } from "@/app/lib/data";
import { Student } from "@/app/lib/definitions";
import AAccordion from "@/app/ui/dashboard/0accordion";


export default async function Page() {


  

  return (

    <main>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 h-75">
        <CardWrapper />
        {/* <Suspense fallback={<CardsSkeleton />}>
         
        </Suspense> */}
      </div>
      {/* <Divider className="p-10"></Divider> */}
      <div className="mt-6 py-1 gap-6 md:grid-cols-8 lg:grid-cols-12">

      <div>
     
    </div>

     

      </div>
    </main>
  );
}

