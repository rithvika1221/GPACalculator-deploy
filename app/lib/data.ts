import {
  Settings,
  Student,
  User} from './definitions';


const apiEndpoint = 'http://localhost:8085/students'; 

export type Grade = 'A+' | 'A' | 'A-' | 'B+' | 'B' | 'B-' | 'C+' | 'C' | 'C-' | 'D' | 'D+' | 'F';

export const gradePoints: { [key in Grade]: number } = {
    'A+': 4.0, 'A': 4.0, 'A-': 3.7, 'B+': 3.3, 'B': 3.0, 'B-': 2.7,
    'C+': 2.3, 'C': 2.0, 'C-': 1.7, 'D': 1.3, 'D+': 1.0,  'F': 0.0,
};


export async function signupStudent(formData: FormData) {
  try {
    // Assuming you have fields like 'email', 'password', etc. in your FormData
    const studentData: Student = {
      studentEmail: formData.get('email') as string,
      studentPassword: formData.get('password') as string,
      studentId: 0,
      studentName: formData.get('name') as string,
      studentWeightedGPA: 0,
      studentUnweightedGPA: 0,
      semester: []
    };

    const response = await fetch('http://localhost:8085/students', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(studentData),
    });
    
    const result = await response.json(); // Parse the response (assuming it's JSON)

    if (!response.ok) {
      console.error('Response error:', result);
      return { success: false, error: result };
    }
    
    return { success: true, data: result };
  } catch (error) {
    console.error('Post error:', error);
    return { success: false, error: 'Error occurred while signing up student.' };
  }
}

export async function saveSettings(settings: Settings[], studentId: string) {
  try {
    const responses = [];
    const settingsUrl = `http://localhost:8085/students/${studentId}/settings`;

    // Fetch existing settings once, outside the loop
    const existingSettingsResponse = await fetch(settingsUrl);
    let existingSettings = [];

    if (existingSettingsResponse.ok) {
      existingSettings = await existingSettingsResponse.json();
    }

    for (const setting of settings) {
      let method = 'POST';
      let url = settingsUrl;

      // Check if the setting already exists
      const existingSetting = existingSettings.find((s: Settings) => s.settingId === setting.settingId);

      if (existingSetting) {
        method = 'PUT';
        url = `${settingsUrl}/${setting.settingId}`;
      }

      // Now, either update or create the setting
      const settingResponse = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(setting)
      });

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
    console.error('Fetch error:', error);
    return { success: false, error: 'Fetch error' };
  }
}


export async function getStudentData(id: string) {
  try {
    const studentResponse = await fetch(`http://localhost:8085/students/${id}`);
    if (!studentResponse.ok) {
      throw new Error(`Error: ${studentResponse.status}`);
    }
    const studentData = await studentResponse.json();

    const semesterResponse = await fetch(`http://localhost:8085/students/${id}/semesters`);
    if (!semesterResponse.ok) {
      throw new Error(`Error: ${semesterResponse.status}`);
    }
    const semesterData = await semesterResponse.json();
    studentData.semester = semesterData;

    // For each semester, fetch its courses
    for (const semester of semesterData) {
      const courseResponse = await fetch(`http://localhost:8085/students/${id}/semesters/${semester.semesterId}/courses`);
      if (!courseResponse.ok) {
        throw new Error(`Error: ${courseResponse.status}`);
      }
      semester.course = await courseResponse.json();
    }

    return studentData;
  } catch (error) {
    console.error('Fetch error:', error);
  }
}

export async function saveStudentData(student:Student) {
  try {
      // Determine if the student already exists
      const studentMethod = student.studentId ? 'PUT' : 'POST';
      const studentUrl = student.studentId 
          ? `http://localhost:8085/students/${student.studentId}` 
          : 'http://localhost:8085/students';

      const studentResponse = await fetch(studentUrl, {
          method: studentMethod,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(student)
      });

      if (!studentResponse.ok) {
          throw new Error(`Error: ${studentResponse.status}`);
      }

      const savedStudent = await studentResponse.json();

      // Fetch existing semesters for the student
      const existingSemesters = await fetch(`http://localhost:8085/students/${savedStudent.studentId}/semesters`).then((response) => response.json());
      

      // Delete semesters that no longer exist
      for (const existingSemester of existingSemesters) {
          if (!student.semester.some(s => s.semesterId === existingSemester.semesterId)) {

            const responseCoursses =  await fetch(`http://localhost:8085/students/${savedStudent.studentId}/semesters/${existingSemester.semesterId}/courses`, {
              method: 'DELETE'
          });
              const response =  await fetch(`http://localhost:8085/students/${savedStudent.studentId}/semesters/${existingSemester.semesterId}`, {
                  method: 'DELETE'
              });
          }
      }



      for (const semester of student.semester) {
          const semesterMethod = semester.semesterId ? 'PUT' : 'POST';
          const semesterUrl = semester.semesterId 
              ? `http://localhost:8085/students/${savedStudent.studentId}/semesters/${semester.semesterId}` 
              : `http://localhost:8085/students/${savedStudent.studentId}/semesters`;

          const semesterResponse = await fetch(semesterUrl, {
              method: semesterMethod,
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(semester)
          });

          if (!semesterResponse.ok) {
              throw new Error(`Error: ${semesterResponse.status}`);
          }

          const savedSemester = await semesterResponse.json();

          // Fetch existing courses for the semester
          const existingCourses = await fetch(`http://localhost:8085/students/${savedStudent.studentId}/semesters/${savedSemester.semesterId}/courses`).then((response) => response.json());
      

          // Delete courses that no longer exist
          for (const existingCourse of existingCourses) {
              if (!semester.course.some(c => c.courseId === existingCourse.courseId)) {
                  await fetch(`http://localhost:8085/students/${savedStudent.studentId}/semesters/${savedSemester.semesterId}/courses/${existingCourse.courseId}`, {
                      method: 'DELETE'
                  });
              }
          }

          for (const course of semester.course) {
              const courseMethod = course.courseId ? 'PUT' : 'POST';
              const courseUrl = course.courseId 
                  ? `http://localhost:8085/students/${savedStudent.studentId}/semesters/${savedSemester.semesterId}/courses/${course.courseId}` 
                  : `http://localhost:8085/students/${savedStudent.studentId}/semesters/${savedSemester.semesterId}/courses`;

              const courseResponse = await fetch(courseUrl, {
                  method: courseMethod,
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(course)
              });

              if (!courseResponse.ok) {
                  throw new Error(`Error: ${courseResponse.status}`);
              }

              await courseResponse.json(); // Optionally handle this response
          }
      }

      return savedStudent; // or some other response as needed
  } catch (error) {
      console.error('Fetch error:', error);
      throw error;
  }
}


// export async function fetchStudent() {
//   try {
//     const response = await fetch('http://localhost:8085/students/1');
//     if (!response.ok) {
//       throw new Error(`Error: ${response.status}`);
//     }
//     const data = await response.json();
//     return data;
//   } catch (error) {
//     console.error('Fetch error:', error);
//   }
// }

export async function fetchSettings(id:string) {
  try {
    const response = await fetch(`http://localhost:8085/students/${id}/settings`);
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
  }
}

export async function fetchStudentByEamil(email: string): Promise<User | undefined> {
  try {
    const response = await fetch(`http://localhost:8085/students?$filter=email eq '${email}'`);
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


// export async function getServerSideProps() {
//   try {
//     const students = await fetch('http://localhost:8085/students/8').then((response) => response.json());

//     if (!students) {
//       return { notFound: true };
//     }

//     const semesters = await fetch('http://localhost:8085/students/8/semesters').then((response) => response.json());

//     const props = { students, semesters };

//     return { props };
//   } catch (error) {
//     console.error('runtime error: ', error);
//   }
// }
// export async function postStudentData(studentData: Student) {
//   try {
//     const response = await fetch(apiEndpoint, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(studentData),
//     });
//     if (!response.ok) {
//       throw new Error(`Error: ${response.status}`);
//     }
//     return await response.json();
//   } catch (error) {
//     console.error('Post error:', error);
//   }
// }

// export async function updateStudentData(studentId: string, studentData: Student) {
//   try {
//     const response = await fetch(`${apiEndpoint}/${studentId}`, { // Adjust endpoint as needed
//       method: 'PUT',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(studentData),
//     });
//     if (!response.ok) {
//       throw new Error(`Error: ${response.status}`);
//     }
//     return await response.json();
//   } catch (error) {
//     console.error('Update error:', error);
//   }
// }

export async function deleteStudentData(studentId: string) {
  try {
    const response = await fetch(`${apiEndpoint}/${studentId}`, { // Adjust endpoint as needed
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Delete error:', error);
  }
}

export async function fetchSemesterStudentData() {
  try {
    const response = await fetch('http://localhost:8085/students/8/semesters');
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
  }
}

export async function fetchCourseSemesterData() {
  try {
    const response = await fetch('http://localhost:8085/students/8/semesters/16/courses');
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
  }
}
