import Calculator from "./calculator";
export default async function Page({ params }: { params: { id: string } }) {
    return (
        <div>
            <Calculator params={params.id}></Calculator>
        </div>
    );
}
