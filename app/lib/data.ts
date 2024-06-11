// This component contains all the function for database connectivity

// Importing types from definitions file
import { Settings, Student } from './definitions';

// API endpoint 
const apiEndpoint = 'http://localhost:8085/students'; 

// Type definition for student grades
export type Grade = 'A+' | 'A' | 'A-' | 'B+' | 'B' | 'B-' | 'C+' | 'C' | 'C-' | 'D' | 'D+' | 'F';

// Mapping of grades to their respective grade points
export const gradePoints: { [key in Grade]: number } = {
    'A+': 4.0, 'A': 4.0, 'A-': 3.7, 'B+': 3.3, 'B': 3.0, 'B-': 2.7,
    'C+': 2.3, 'C': 2.0, 'C-': 1.7, 'D': 1.3, 'D+': 1.0,  'F': 0.0,
};

// Assuming you have the username and password
const username = 'rithvika';
const password = 'seattle@123';
// Encode the username and password into a base64 string
const base64 = Buffer.from(`${username}:${password}`).toString('base64');
// Prepare the headers object including the Authorization header for Basic Auth
const authHeaders = {
    'Authorization': `Basic ${base64}`,
    'Content-Type': 'application/json'
};

// Function to sign up a student
export async function signupStudent(formData: FormData) {
  try {
    // Constructing student data from form data
    const studentData: Student = {
      studentEmail: formData.get('email') as string,
      studentPassword: formData.get('password') as string,
      studentId: 0,
      studentName: formData.get('name') as string,
      studentWeightedGPA: 0,
      studentUnweightedGPA: 0,
      semester: []
    };

    // Sending POST request to create a new student
    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify(studentData),
    });
    
    // Parsing the JSON response
    const result = await response.json();

    // Checking if response was successful
    if (!response.ok) {
      console.error('Response error:', result);
      return { success: false, error: result };
    }
    
    return { success: true, data: result };
  } catch (error) {
    // Error handling for request failure
    console.error('Post error:', error);
    return { success: false, error: 'Error occurred while signing up student.' };
  }
}

// Function to save settings for a student
export async function saveSettings(settings: Settings[], studentId: string) {
  try {
    // An array to store responses for each setting update/create
    const responses = [];
    const settingsUrl = `${apiEndpoint}/${studentId}/settings`;

    // Fetch existing settings once, outside the loop
    const existingSettingsResponse = await fetch(settingsUrl, {   headers: authHeaders});
    let existingSettings = [];

    if (existingSettingsResponse.ok) {
      existingSettings = await existingSettingsResponse.json();
    }

    // Looping through each setting to save
    for (const setting of settings) {
      let method = 'POST'; // Default method
      let url = settingsUrl;

      // Check if the setting already exists to decide between POST and PUT
      const existingSetting = existingSettings.find((s: Settings) => s.settingId === setting.settingId);

      if (existingSetting) {
        method = 'PUT'; // Change to PUT if setting exists
        url = `${settingsUrl}/${setting.settingId}`;
      }

      // Sending request to update or create the setting
      const settingResponse = await fetch(url, {
        method: method,
        headers: authHeaders,
        body: JSON.stringify(setting)
      });

      // Handling responses
      if (!settingResponse.ok) {
        const errorData = await settingResponse.json();
        responses.push({ success: false, error: errorData });
        continue;
      }

      const responseData = await settingResponse.json();
      responses.push({ success: true, data: responseData });
    }

    return { success: true, responses: responses };
  } catch (error) {
    // Error handling for fetch failure
    console.error('Fetch error:', error);
    return { success: false, error: 'Fetch error' };
  }
}

import { Student, Semester, Course } from './interfaces'; // Update the path as needed

export async function getStudentData(id: string): Promise<Student> {
  try {
    // Mock data for a student
    const studentData: Student = {
      studentId: Number(id),
      studentName: "John Doe",
      studentEmail: "john.doe@example.com",
      studentPassword: "securepassword",
      studentWeightedGPA: 3.8,
      studentUnweightedGPA: 3.5,
      semester: [
        {
          semesterId: 1,
          semesterName: "Fall 2023",
          semUnweightedGPA: 3.6,
          semWeightedGPA: 3.9,
          course: [
            { 
              courseId: 1, 
              courseName: "Mathematics 101", 
              courseGrade: "A", 
              courseCredit: 3, 
              courseType: "Core", 
              courseSemester: null 
            },
            { 
              courseId: 2, 
              courseName: "Physics 101", 
              courseGrade: "B", 
              courseCredit: 3, 
              courseType: "Core", 
              courseSemester: null 
            },
            { 
              courseId: 3, 
              courseName: "Chemistry 101", 
              courseGrade: "A", 
              courseCredit: 3, 
              courseType: "Core", 
              courseSemester: null 
            }
          ],
          semesterStudent: null
        },
        {
          semesterId: 2,
          semesterName: "Spring 2024",
          semUnweightedGPA: 3.7,
          semWeightedGPA: 4.0,
          course: [
            { 
              courseId: 4, 
              courseName: "Biology 102", 
              courseGrade: "A", 
              courseCredit: 3, 
              courseType: "Core", 
              courseSemester: null 
            },
            { 
              courseId: 5, 
              courseName: "English 102", 
              courseGrade: "B", 
              courseCredit: 3, 
              courseType: "Core", 
              courseSemester: null 
            },
            { 
              courseId: 6, 
              courseName: "History 102", 
              courseGrade: "A", 
              courseCredit: 3, 
              courseType: "Core", 
              courseSemester: null 
            }
          ],
          semesterStudent: null
        }
      ]
    };

    // Link courses to their respective semesters
    studentData.semester.forEach(semester => {
      semester.course.forEach(course => {
        course.courseSemester = semester;
      });
      semester.semesterStudent = studentData;
    });

    return studentData;
  } catch (error) {
    // Error handling for mock data fetch failure
    console.error('Mock data fetch error:', error);
    throw error;
  }
}



// Function to get a student's data including semesters and courses
// export async function getStudentData(id: string) {
//   try {
//     // Fetching student's basic data
//     const studentResponse = await fetch(`${apiEndpoint}/${id}`, {   headers: authHeaders});
//     if (!studentResponse.ok) {
//       throw new Error(`Error: ${studentResponse.status}`);
//     }
//     const studentData = await studentResponse.json();

//     // Fetching semesters for the student
//     const semesterResponse = await fetch(`${apiEndpoint}/${id}/semesters`, {   headers: authHeaders});
//     if (!semesterResponse.ok) {
//       throw new Error(`Error: ${semesterResponse.status}`);
//     }
//     const semesterData = await semesterResponse.json();
//     studentData.semester = semesterData;

//     // Fetching courses for each semester
//     for (const semester of semesterData) {
//       const courseResponse = await fetch(`${apiEndpoint}/${id}/semesters/${semester.semesterId}/courses`, {   headers: authHeaders});
//       if (!courseResponse.ok) {
//         throw new Error(`Error: ${courseResponse.status}`);
//       }
//       semester.course = await courseResponse.json();
//     }

//     return studentData;
//   } catch (error) {
//     // Error handling for fetch failure
//     console.error('Fetch error:', error);
//   }
// }

// Function to save a student's data including semesters and courses
export async function saveStudentData(student: Student) {
  try {
    // Determining if it's a new student or updating existing one
    const studentMethod = student.studentId ? 'PUT' : 'POST';
    const studentUrl = student.studentId 
        ? `${apiEndpoint}/${student.studentId}` 
        : apiEndpoint;

    // Sending request to save or update student
    const studentResponse = await fetch(studentUrl, {
        method: studentMethod,
        headers: authHeaders,
        body: JSON.stringify(student)
    });

    if (!studentResponse.ok) {
        throw new Error(`Error: ${studentResponse.status}`);
    }

    const savedStudent = await studentResponse.json();

    // Fetching existing semesters for the student
    const existingSemesters = await fetch(`${apiEndpoint}/${savedStudent.studentId}/semesters`, {   headers: authHeaders}).then((response) => response.json());

    // Deleting semesters that no longer exist
    for (const existingSemester of existingSemesters) {
        if (!student.semester.some(s => s.semesterId === existingSemester.semesterId)) {

          const responseCoursses =  await fetch(`${apiEndpoint}/${savedStudent.studentId}/semesters/${existingSemester.semesterId}/courses`, 
          {
            method: 'DELETE',
            headers: authHeaders
        });
            const response =  await fetch(`${apiEndpoint}/${savedStudent.studentId}/semesters/${existingSemester.semesterId}`, {
                method: 'DELETE',
                headers: authHeaders
            });
        }
    }

    // Saving or updating semesters
    for (const semester of student.semester) {
        const semesterMethod = semester.semesterId ? 'PUT' : 'POST';
        const semesterUrl = semester.semesterId 
            ? `${apiEndpoint}/${savedStudent.studentId}/semesters/${semester.semesterId}` 
            : `${apiEndpoint}/${savedStudent.studentId}/semesters`;

        const semesterResponse = await fetch(semesterUrl, {
            method: semesterMethod,
            headers: authHeaders,
            body: JSON.stringify(semester)
        });

        if (!semesterResponse.ok) {
            throw new Error(`Error: ${semesterResponse.status}`);
        }

        const savedSemester = await semesterResponse.json();

        // Fetching existing courses for the semester
        const existingCourses = await fetch(`${apiEndpoint}/${savedStudent.studentId}/semesters/${savedSemester.semesterId}/courses`, {   headers: authHeaders}).then((response) => response.json());

        // Deleting courses that no longer exist
        for (const existingCourse of existingCourses) {
            if (!semester.course.some(c => c.courseId === existingCourse.courseId)) {
                await fetch(`${apiEndpoint}/${savedStudent.studentId}/semesters/${savedSemester.semesterId}/courses/${existingCourse.courseId}`, {
                    method: 'DELETE',
                    headers: authHeaders
                });
            }
        }

        // Saving or updating courses
        for (const course of semester.course) {
            const courseMethod = course.courseId ? 'PUT' : 'POST';
            const courseUrl = course.courseId 
                ? `${apiEndpoint}/${savedStudent.studentId}/semesters/${savedSemester.semesterId}/courses/${course.courseId}` 
                : `${apiEndpoint}/${savedStudent.studentId}/semesters/${savedSemester.semesterId}/courses`;

            const courseResponse = await fetch(courseUrl, {
                method: courseMethod,
                headers: authHeaders,
                body: JSON.stringify(course)
            });

            if (!courseResponse.ok) {
                throw new Error(`Error: ${courseResponse.status}`);
            }

            await courseResponse.json(); // Optionally handle this response
        }
    }

    return savedStudent; // Returning the saved student data
  } catch (error) {
    // Error handling for fetch failure
    console.error('Fetch error:', error);
    throw error;
  }
}

// Function to fetch settings for a student
export async function fetchSettings(id:string) {
  try {
    const response = await fetch(`http://localhost:8085/students/${id}/settings`, {   headers: authHeaders});
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
  }
}

// Function to fetch sutendt by email this is used in authentication.
export async function fetchStudentByEamil(email: string): Promise<User | undefined> {
  try {
    const response = await fetch(`http://localhost:8085/students?$filter=email eq '${email}'`, {   headers: authHeaders});
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    const studentData: Student[]= await response.json();

    if (!studentData || studentData.length === 0) {
      console.error('Student data array is empty or undefined');
      return;
  }
  
  const firstStudent = studentData[0]; // Accessing the first element of the array
  
  const userData: User = {
      id: firstStudent.studentId.toString(),
      name: firstStudent.studentName,
      email: firstStudent.studentEmail,
      password: firstStudent.studentPassword,
      // Map other fields as necessary
  };


    return userData;
  } catch (error) {
    console.error('Fetch error:', error);
  }
}

// Function to delete a student
export async function deleteStudentData(studentId: string) {
  try {
    const response = await fetch(`${apiEndpoint}/${studentId}`, { // Adjust endpoint as needed
      method: 'DELETE',
      headers: authHeaders
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Delete error:', error);
  }
}

// Function to get semesters of a student
export async function fetchSemesterStudentData() {
  try {
    const response = await fetch('http://localhost:8085/students/8/semesters', {   headers: authHeaders});
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
  }
}

// function get the courses for the semsester
export async function fetchCourseSemesterData() {
  try {
    const response = await fetch('http://localhost:8085/students/8/semesters/16/courses', {   headers: authHeaders});
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
  }
}
