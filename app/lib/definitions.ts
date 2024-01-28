// Course Interface: Represents the structure of a course entity
export interface Course {
  courseId:number;
  courseName: string;
  courseGrade: string;
  courseCredit: number;
  courseType: string;
  courseSemester:Semester| null;
}

// Semester Interface: Defines the structure for a semester entity
export interface Semester {
  semesterName: string;
  semesterId: number;
  semUnweightedGPA: number;
  semWeightedGPA: number;
  course: Course[];
  semesterStudent: Student | null;
}

// Student Interface: Describes the structure for a student entity
export interface Student {
  studentId:number;
  studentName: string;
  studentEmail:string;
  studentPassword: string;
  studentWeightedGPA: number;
  studentUnweightedGPA: number;
  semester: Semester[];
}

// Settings Interface: Represents configuration settings, such as grade-to-GPA mapping
export interface Settings {
  gpa:number;
  letter: string;
  settingId:number;
}

