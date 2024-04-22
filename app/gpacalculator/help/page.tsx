export default function Page() {
    return (
        <main className="max-w-3xl mx-auto p-8 bg-white rounded-lg shadow-lg mt-10">
            <section className="mb-8">
                <h1 className="text-2xl font-bold mb-5">Understanding GPA (Grade Point Average)</h1>
                <p>
                    GPA, which stands for Grade Point Average, is a standardized method of evaluating academic performance across high schools and universities. It aggregates the grades you earn into a single metric that represents your average achievement. This measure is critical as it plays a pivotal role in college admissions, scholarship committees, and even potential employers.
                </p>
                <p>
                    Typically calculated on a scale from 0 to 4.0, each grade you receive is assigned a numeric value, with higher grades contributing to a higher GPA. Some educational systems extend this scale to accommodate more rigorous courses, thus rewarding students for their additional effort.
                </p>
            </section>
            
            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Why GPA Matters</h2>
                <p>
                    GPA serves as a quick indicator of your academic qualifications and is often a primary criterion for judging your academic success. Colleges use GPA to assess your readiness and suitability for the rigors of post-secondary education, while scholarships use it as a benchmark for financial awards.
                </p>
                <p>
                    Furthermore, a strong GPA can open doors to prestigious internships and career opportunities post-graduation, as many employers consider GPA a reflection of your work ethic and potential.
                </p>
            </section>
            
            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Weighted vs Unweighted GPA</h2>
                <p>
                    Understanding the difference between weighted and unweighted GPA is crucial:
                </p>
                <ul className="list-disc ml-8">
                    <li><strong>Unweighted GPA</strong> - This is the traditional method of calculating GPA, where all classes are considered equal, and grades are assessed on a scale from 0 to 4.0.</li>
                    <li><strong>Weighted GPA</strong> - This approach considers the difficulty of your courses. Advanced Placement (AP), Honors, and International Baccalaureate (IB) courses are graded on a scale that can go up to 5.0, thus reflecting the higher standard expected in these courses.</li>
                </ul>
            </section>
            
            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">How to Use The Calculator</h2>
                <ol className="list-decimal ml-8">
                    <li className="mb-3">Start by entering each course along with the associated grade and credit hours or units.</li>
                    <li className="mb-3">Choose the GPA scale based on your school’s system (weighted or unweighted).</li>
                    <li className="mb-3">Add or remove courses as needed with the interactive buttons provided.</li>
                    <li className="mb-3">Click the ‘Calculate’ button to view your cumulative GPA instantly.</li>
                    <li className="mb-3">Adjust your course details to see potential changes in your GPA if different grades were earned.</li>
                </ol>
                <p>
                    The calculator is designed to be intuitive and user-friendly, ensuring that even those new to GPA calculations can easily navigate and use it effectively.
                </p>
            </section>
            
            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">GPA Bot - Your Personal Academic Assistant</h2>
                <p>
                    Our GPA Bot leverages advanced AI, specifically integrating OpenAI's capabilities, to provide tailored advice on improving your GPA. It’s designed to be conversational, engaging, and incredibly insightful.
                </p>
                <p>
                    Whether you have questions about navigating high school, understanding GPA impacts, or specific academic advice, the GPA Bot is here to assist you 24/7. Just type in your query, and the bot will respond with guidance and resources.
                </p>
            </section>
            
            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Download Your GPA Records</h2>
                <p>
                    For convenience and record-keeping, our platform allows you to download a detailed Excel spreadsheet of your GPA calculation. This document will include all course data, individual grades, and both semester-wise and cumulative GPA figures.
                </p>
                <p>
                    To download, simply click on the 'Download GPA' button within the calculator interface and click on the provided link. The file will automatically be prepared and downloaded to your device, allowing you to keep a personal academic record or share it with advisors and educational institutions as needed.
                </p>
            </section>
        </main>
    );
}
