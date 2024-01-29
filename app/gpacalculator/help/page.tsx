// html page for help content

export default  function Page() {
    
    return (
        <main className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
        <section className="mb-6">
            <h1 className="text-xl font-bold mb-4">What is GPA?</h1>
            <p>
                GPA, which stands for Grade Point Average, is a way to determine a student’s academic performance by averaging their grade in each course taken.
                It typically ranges from 0.0 to 4.0, where each letter grade corresponds to a numerical value. For instance, an A or A+ is generally equivalent to 4.0, an A- to 3.7. The scale can extend beyond 4.0 in some cases, like an A+ being valued at 4.3 in certain school districts.
            </p>
        </section>
        <section className="mb-6">
            <h2 className="text-lg font-semibold mb-3">Why is GPA Important?</h2>
            <p>
                GPA serves as an indicator of a student's academic performance, often influencing a student’s college admissions, scholarship eligibility, and future employment.
            </p>
        </section>
        <section className="mb-6">
            <h2 className="text-lg font-semibold mb-3">Weighted vs Unweighted</h2>
            <p>
                Weighted GPA factors in the difficulty of courses, giving higher values to grades earned in advanced classes like AP or Honors, on a scale up to 5.0. An unweighted GPA treats all courses equally, regardless of difficulty, and is measured on a standard 4.0 scale.
            </p>
        </section>
        <section>
            <h2 className="text-lg font-semibold mb-3">How to Use The Calculator</h2>
            <ol className="list-decimal ml-4">
                <li className="mb-2">Enter Your Course Details: Begin by entering the name of each course you've taken. This helps in organizing and tracking your grades for each subject.</li>
                <li className="mb-2">Input Your Grades: For each course, select or input the grade you received. Ensure to use the format that your school follows (e.g., letter grades, percentages).</li>
                <li className="mb-2">Specify Credit Hours or Units: Enter the credit hours or units for each course. This is typically found in your course catalog or class syllabus.</li>
                <li className="mb-2">Choose the GPA Scale: Select the appropriate GPA scale (weighted or unweighted) based on your school’s system.</li>
                <li className="mb-2">Add or Remove Courses: If you need to adjust your course list, use the ‘Add Course’ button to include more courses or the delete icon to remove a course.</li>
                <li className="mb-2">Calculate Your GPA: Once all your courses, grades, and credits are correctly entered, click on the ‘Calculate’ button. The calculator will compute your cumulative GPA.</li>
                <li>Review and Adjust: After getting your result, you can adjust your entries to see how different grades could potentially impact your overall GPA.</li>
            </ol>
        </section>
    </main>
    );
}
