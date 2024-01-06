import {
  Settings,
  Student,
  User} from './definitions';


const apiEndpoint = 'http://localhost:8085/students'; 

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
      const existingSetting = existingSettings.find(s => s.settingId === setting.settingId);

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



export async function fetchStudent() {
  try {
    const response = await fetch('http://localhost:8085/students/1');
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
  }
}

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


export async function getServerSideProps() {
  try {
    const students = await fetch('http://localhost:8085/students/8').then((response) => response.json());

    if (!students) {
      return { notFound: true };
    }

    const semesters = await fetch('http://localhost:8085/students/8/semesters').then((response) => response.json());

    const props = { students, semesters };

    return { props };
  } catch (error) {
    console.error('runtime error: ', error);
  }
}
export async function postStudentData(studentData: Student) {
  try {
    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(studentData),
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Post error:', error);
  }
}

export async function updateStudentData(studentId: string, studentData: Student) {
  try {
    const response = await fetch(`${apiEndpoint}/${studentId}`, { // Adjust endpoint as needed
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(studentData),
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Update error:', error);
  }
}

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


// Old code from sample need to delete it
// export async function fetchRevenue() {
//   noStore();
//   // Add noStore() here prevent the response from being cached.
//   // This is equivalent to in fetch(..., {cache: 'no-store'}).

//   try {
//     // Artificially delay a response for demo purposes.
//     // Don't do this in production :)

//     console.log('Fetching revenue data...');
//     //await new Promise((resolve) => setTimeout(resolve, 3000));

//     const data = await sql<Revenue>`SELECT * FROM revenue`;

//     console.log('Data fetch completed after 3 seconds.');

//     return data.rows;
//   } catch (error) {
//     console.error('Database Error:', error);
//     throw new Error('Failed to fetch revenue data.');
//   }
// }

// export async function fetchLatestInvoices() {
//   noStore();
//   try {
//     //await new Promise((resolve) => setTimeout(resolve, 2000));
//     const data = await sql<LatestInvoiceRaw>`
//       SELECT invoices.amount, customers.name, customers.image_url, customers.email, invoices.id
//       FROM invoices
//       JOIN customers ON invoices.customer_id = customers.id
//       ORDER BY invoices.date DESC
//       LIMIT 5`;

//     const latestInvoices = data.rows.map((invoice) => ({
//       ...invoice,
//       amount: formatCurrency(invoice.amount),
//     }));
//     return latestInvoices;
//   } catch (error) {
//     console.error('Database Error:', error);
//     throw new Error('Failed to fetch the latest invoices.');
//   }
// }

// export async function fetchCardData() {
//   noStore();
//   try {
//     await new Promise((resolve) => setTimeout(resolve, 1000));
//     // You can probably combine these into a single SQL query
//     // However, we are intentionally splitting them to demonstrate
//     // how to initialize multiple queries in parallel with JS.
//     const invoiceCountPromise = sql`SELECT COUNT(*) FROM invoices`;
//     const customerCountPromise = sql`SELECT COUNT(*) FROM customers`;
//     const invoiceStatusPromise = sql`SELECT
//          SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS "paid",
//          SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS "pending"
//          FROM invoices`;

//     const data = await Promise.all([
//       invoiceCountPromise,
//       customerCountPromise,
//       invoiceStatusPromise,
//     ]);

//     const numberOfInvoices = Number(data[0].rows[0].count ?? '0');
//     const numberOfCustomers = Number(data[1].rows[0].count ?? '0');
//     const totalPaidInvoices = formatCurrency(data[2].rows[0].paid ?? '0');
//     const totalPendingInvoices = formatCurrency(data[2].rows[0].pending ?? '0');

//     return {
//       numberOfCustomers,
//       numberOfInvoices,
//       totalPaidInvoices,
//       totalPendingInvoices,
//     };
//   } catch (error) {
//     console.error('Database Error:', error);
//     throw new Error('Failed to fetch card data.');
//   }
// }

// const ITEMS_PER_PAGE = 6;
// export async function fetchFilteredInvoices(
  
//   query: string,
//   currentPage: number,
// ) {
//   noStore();
//   const offset = (currentPage - 1) * ITEMS_PER_PAGE;

//   try {
//     const invoices = await sql<InvoicesTable>`
//       SELECT
//         invoices.id,
//         invoices.amount,
//         invoices.date,
//         invoices.status,
//         customers.name,
//         customers.email,
//         customers.image_url
//       FROM invoices
//       JOIN customers ON invoices.customer_id = customers.id
//       WHERE
//         customers.name ILIKE ${`%${query}%`} OR
//         customers.email ILIKE ${`%${query}%`} OR
//         invoices.amount::text ILIKE ${`%${query}%`} OR
//         invoices.date::text ILIKE ${`%${query}%`} OR
//         invoices.status ILIKE ${`%${query}%`}
//       ORDER BY invoices.date DESC
//       LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
//     `;

//     return invoices.rows;
//   } catch (error) {
//     console.error('Database Error:', error);
//     throw new Error('Failed to fetch invoices.');
//   }
// }

// export async function fetchInvoicesPages(query: string) {
//   noStore();
//   try {
//     const count = await sql`SELECT COUNT(*)
//     FROM invoices
//     JOIN customers ON invoices.customer_id = customers.id
//     WHERE
//       customers.name ILIKE ${`%${query}%`} OR
//       customers.email ILIKE ${`%${query}%`} OR
//       invoices.amount::text ILIKE ${`%${query}%`} OR
//       invoices.date::text ILIKE ${`%${query}%`} OR
//       invoices.status ILIKE ${`%${query}%`}
//   `;

//     const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
//     return totalPages;
//   } catch (error) {
//     console.error('Database Error:', error);
//     throw new Error('Failed to fetch total number of invoices.');
//   }
// }

// export async function fetchInvoiceById(id: string) {
//   noStore();
//   try {
//     const data = await sql<InvoiceForm>`
//       SELECT
//         invoices.id,
//         invoices.customer_id,
//         invoices.amount,
//         invoices.status
//       FROM invoices
//       WHERE invoices.id = ${id};
//     `;

//     const invoice = data.rows.map((invoice) => ({
//       ...invoice,
//       // Convert amount from cents to dollars
//       amount: invoice.amount / 100,
//     }));

//     return invoice[0];
//   } catch (error) {
//     console.error('Database Error:', error);
//     throw new Error('Failed to fetch invoice.');
//   }
// }

// export async function fetchCustomers() {
//   noStore();
//   try {
//     const data = await sql<CustomerField>`
//       SELECT
//         id,
//         name
//       FROM customers
//       ORDER BY name ASC
//     `;

//     const customers = data.rows;
//     return customers;
//   } catch (err) {
//     console.error('Database Error:', err);
//     throw new Error('Failed to fetch all customers.');
//   }
// }

// export async function fetchFilteredCustomers(query: string) {
//   noStore();
//   try {
//     const data = await sql<CustomersTableType>`
// 		SELECT
// 		  customers.id,
// 		  customers.name,
// 		  customers.email,
// 		  customers.image_url,
// 		  COUNT(invoices.id) AS total_invoices,
// 		  SUM(CASE WHEN invoices.status = 'pending' THEN invoices.amount ELSE 0 END) AS total_pending,
// 		  SUM(CASE WHEN invoices.status = 'paid' THEN invoices.amount ELSE 0 END) AS total_paid
// 		FROM customers
// 		LEFT JOIN invoices ON customers.id = invoices.customer_id
// 		WHERE
// 		  customers.name ILIKE ${`%${query}%`} OR
//         customers.email ILIKE ${`%${query}%`}
// 		GROUP BY customers.id, customers.name, customers.email, customers.image_url
// 		ORDER BY customers.name ASC
// 	  `;

//     const customers = data.rows.map((customer) => ({
//       ...customer,
//       total_pending: formatCurrency(customer.total_pending),
//       total_paid: formatCurrency(customer.total_paid),
//     }));

//     return customers;
//   } catch (err) {
//     console.error('Database Error:', err);
//     throw new Error('Failed to fetch customer table.');
//   }
// }

// export async function getUser(email: string) {
//   noStore();
//   try {
//     const user = await sql`SELECT * FROM users WHERE email=${email}`;
//     return user.rows[0] as User;
//   } catch (error) {
//     console.error('Failed to fetch user:', error);
//     throw new Error('Failed to fetch user.');
//   }
// }
