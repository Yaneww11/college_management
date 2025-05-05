// Core entity types
export interface Department {
  id: string;
  name: string;
  headProfessorId: string | null;
  facultyId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Course {
  id: string;
  name: string;
  code: string;
  credits: number;
  description: string;
  departmentId: string;
  professorId: string | null;
  semester: string;
  createdAt: string;
  updatedAt: string;
}

export interface Professor {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  departmentId: string;
  specialization: string;
  isHeadOfDepartment: boolean;
  joinDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  enrollmentNumber: string;
  dateOfBirth: string;
  joinDate: string;
  graduationYear: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface Faculty {
  id: string;
  name: string;
  dean: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface Enrollment {
  id: string;
  studentId: string;
  courseId: string;
  enrollmentDate: string;
  grade: string | null;
  status: 'ACTIVE' | 'COMPLETED' | 'DROPPED';
  createdAt: string;
  updatedAt: string;
}

// Extended types with relationships
export interface DepartmentWithRelations extends Department {
  headProfessor?: Professor;
  faculty?: Faculty;
  courses?: Course[];
  professors?: Professor[];
}

export interface CourseWithRelations extends Course {
  department?: Department;
  professor?: Professor;
  enrollments?: Enrollment[];
  students?: Student[];
}

export interface ProfessorWithRelations extends Professor {
  department?: Department;
  courses?: Course[];
}

export interface StudentWithRelations extends Student {
  enrollments?: Enrollment[];
  courses?: Course[];
}

export interface FacultyWithRelations extends Faculty {
  departments?: Department[];
}

// Dashboard stats types
export interface DashboardStats {
  totalStudents: number;
  totalProfessors: number;
  totalCourses: number;
  totalDepartments: number;
  studentsByDepartment: {
    departmentName: string;
    count: number;
  }[];
  coursesByFaculty: {
    facultyName: string;
    count: number;
  }[];
  recentEnrollments: Enrollment[];
}