import { Navbar } from "@nextui-org/react";
import Calculator from "./calculator";
import MyNavBar from "@/app/ui/dashboard/unused/navbar";
export default async function Page({ params }: { params: { id: string } }) {
    return (
        <div >
            <Calculator params={params.id}></Calculator>
        </div>
    );
}
