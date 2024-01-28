import { Navbar } from "@nextui-org/react"; // Navbar component from Next UI library
import Calculator from "./calculator"; // Calculator component from the local file

// Async function component 'Page' that takes 'params' as a prop
export default async function Page({ params }: { params: { id: string } }) {
    return (
        <div>
            {/* The Calculator component user id is passed as params */}
            <Calculator params={params.id}></Calculator>
        </div>
    );
}
