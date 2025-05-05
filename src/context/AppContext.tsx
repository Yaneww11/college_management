import React, { createContext, useContext, useState, ReactNode, useMemo } from 'react';
import {
  Department,
  Course,
  Professor,
  Student,
  Faculty,
  Enrollment,
  DashboardStats,
} from '../types';
import {
  departments,
  courses,
  professors,
  students,
  faculties,
  enrollments,
  dashboardStats,
  getDepartmentsWithRelations,
  getCoursesWithRelations,
  getProfessorsWithRelations,
  getStudentsWithRelations,
  getFacultiesWithRelations,
} from '../data/mockData';

interface AppContextType {
  // Raw data
  departments: Department[];
  courses: Course[];
  professors: Professor[];
  students: Student[];
  faculties: Faculty[];
  enrollments: Enrollment[];
  dashboardStats: DashboardStats;

  // Methods to get data with relationships
  getDepartmentsWithRelations: () => any[];
  getCoursesWithRelations: () => any[];
  getProfessorsWithRelations: () => any[];
  getStudentsWithRelations: () => any[];
  getFacultiesWithRelations: () => any[];

  // CRUD operations
  addDepartment: (department: Omit<Department, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateDepartment: (id: string, department: Partial<Department>) => void;
  deleteDepartment: (id: string) => void;

  addCourse: (course: Omit<Course, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateCourse: (id: string, course: Partial<Course>) => void;
  deleteCourse: (id: string) => void;

  addProfessor: (professor: Omit<Professor, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProfessor: (id: string, professor: Partial<Professor>) => void;
  deleteProfessor: (id: string) => void;

  addStudent: (student: Omit<Student, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateStudent: (id: string, student: Partial<Student>) => void;
  deleteStudent: (id: string) => void;

  addFaculty: (faculty: Omit<Faculty, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateFaculty: (id: string, faculty: Partial<Faculty>) => void;
  deleteFaculty: (id: string) => void;

  addEnrollment: (enrollment: Omit<Enrollment, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateEnrollment: (id: string, enrollment: Partial<Enrollment>) => void;
  deleteEnrollment: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
  const [departmentsState, setDepartments] = useState<Department[]>(departments);
  const [coursesState, setCourses] = useState<Course[]>(courses);
  const [professorsState, setProfessors] = useState<Professor[]>(professors);
  const [studentsState, setStudents] = useState<Student[]>(students);
  const [facultiesState, setFaculties] = useState<Faculty[]>(faculties);
  const [enrollmentsState, setEnrollments] = useState<Enrollment[]>(enrollments);
  const [statsState] = useState<DashboardStats>(dashboardStats);

  // CRUD operations for departments
  const addDepartment = (department: Omit<Department, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newDepartment: Department = {
      ...department,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setDepartments([...departmentsState, newDepartment]);
  };

  const updateDepartment = (id: string, department: Partial<Department>) => {
    setDepartments(
      departmentsState.map((d) =>
        d.id === id
          ? { ...d, ...department, updatedAt: new Date().toISOString() }
          : d
      )
    );
  };

  const deleteDepartment = (id: string) => {
    setDepartments(departmentsState.filter((d) => d.id !== id));
  };

  // CRUD operations for courses
  const addCourse = (course: Omit<Course, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newCourse: Course = {
      ...course,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setCourses([...coursesState, newCourse]);
  };

  const updateCourse = (id: string, course: Partial<Course>) => {
    setCourses(
      coursesState.map((c) =>
        c.id === id
          ? { ...c, ...course, updatedAt: new Date().toISOString() }
          : c
      )
    );
  };

  const deleteCourse = (id: string) => {
    setCourses(coursesState.filter((c) => c.id !== id));
  };

  // CRUD operations for professors
  const addProfessor = (professor: Omit<Professor, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newProfessor: Professor = {
      ...professor,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setProfessors([...professorsState, newProfessor]);
  };

  const updateProfessor = (id: string, professor: Partial<Professor>) => {
    setProfessors(
      professorsState.map((p) =>
        p.id === id
          ? { ...p, ...professor, updatedAt: new Date().toISOString() }
          : p
      )
    );
  };

  const deleteProfessor = (id: string) => {
    setProfessors(professorsState.filter((p) => p.id !== id));
  };

  // CRUD operations for students
  const addStudent = (student: Omit<Student, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newStudent: Student = {
      ...student,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setStudents([...studentsState, newStudent]);
  };

  const updateStudent = (id: string, student: Partial<Student>) => {
    setStudents(
      studentsState.map((s) =>
        s.id === id
          ? { ...s, ...student, updatedAt: new Date().toISOString() }
          : s
      )
    );
  };

  const deleteStudent = (id: string) => {
    setStudents(studentsState.filter((s) => s.id !== id));
  };

  // CRUD operations for faculties
  const addFaculty = (faculty: Omit<Faculty, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newFaculty: Faculty = {
      ...faculty,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setFaculties([...facultiesState, newFaculty]);
  };

  const updateFaculty = (id: string, faculty: Partial<Faculty>) => {
    setFaculties(
      facultiesState.map((f) =>
        f.id === id
          ? { ...f, ...faculty, updatedAt: new Date().toISOString() }
          : f
      )
    );
  };

  const deleteFaculty = (id: string) => {
    setFaculties(facultiesState.filter((f) => f.id !== id));
  };

  // CRUD operations for enrollments
  const addEnrollment = (enrollment: Omit<Enrollment, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newEnrollment: Enrollment = {
      ...enrollment,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setEnrollments([...enrollmentsState, newEnrollment]);
  };

  const updateEnrollment = (id: string, enrollment: Partial<Enrollment>) => {
    setEnrollments(
      enrollmentsState.map((e) =>
        e.id === id
          ? { ...e, ...enrollment, updatedAt: new Date().toISOString() }
          : e
      )
    );
  };

  const deleteEnrollment = (id: string) => {
    setEnrollments(enrollmentsState.filter((e) => e.id !== id));
  };

  // Custom methods to get entities with relationships
  const getDepartmentsWithRelationsCustom = () => {
    return departmentsState.map(department => {
      const headProfessor = professorsState.find(p => p.id === department.headProfessorId) || undefined;
      const faculty = facultiesState.find(f => f.id === department.facultyId) || undefined;
      const departmentCourses = coursesState.filter(c => c.departmentId === department.id);
      const departmentProfessors = professorsState.filter(p => p.departmentId === department.id);
      
      return {
        ...department,
        headProfessor,
        faculty,
        courses: departmentCourses,
        professors: departmentProfessors,
      };
    });
  };

  const getCoursesWithRelationsCustom = () => {
    return coursesState.map(course => {
      const department = departmentsState.find(d => d.id === course.departmentId) || undefined;
      const professor = professorsState.find(p => p.id === course.professorId) || undefined;
      const courseEnrollments = enrollmentsState.filter(e => e.courseId === course.id);
      const courseStudents = courseEnrollments
        .map(enrollment => studentsState.find(s => s.id === enrollment.studentId))
        .filter(Boolean) as Student[];
      
      return {
        ...course,
        department,
        professor,
        enrollments: courseEnrollments,
        students: courseStudents,
      };
    });
  };

  const getProfessorsWithRelationsCustom = () => {
    return professorsState.map(professor => {
      const department = departmentsState.find(d => d.id === professor.departmentId) || undefined;
      const professorCourses = coursesState.filter(c => c.professorId === professor.id);
      
      return {
        ...professor,
        department,
        courses: professorCourses,
      };
    });
  };

  const getStudentsWithRelationsCustom = () => {
    return studentsState.map(student => {
      const studentEnrollments = enrollmentsState.filter(e => e.studentId === student.id);
      const studentCourses = studentEnrollments
        .map(enrollment => coursesState.find(c => c.id === enrollment.courseId))
        .filter(Boolean) as Course[];
      
      return {
        ...student,
        enrollments: studentEnrollments,
        courses: studentCourses,
      };
    });
  };

  const getFacultiesWithRelationsCustom = () => {
    return facultiesState.map(faculty => {
      const facultyDepartments = departmentsState.filter(d => d.facultyId === faculty.id);
      
      return {
        ...faculty,
        departments: facultyDepartments,
      };
    });
  };

  const value = useMemo(() => ({
    // Raw data
    departments: departmentsState,
    courses: coursesState,
    professors: professorsState,
    students: studentsState,
    faculties: facultiesState,
    enrollments: enrollmentsState,
    dashboardStats: statsState,

    // Methods to get data with relationships
    getDepartmentsWithRelations: getDepartmentsWithRelationsCustom,
    getCoursesWithRelations: getCoursesWithRelationsCustom,
    getProfessorsWithRelations: getProfessorsWithRelationsCustom,
    getStudentsWithRelations: getStudentsWithRelationsCustom,
    getFacultiesWithRelations: getFacultiesWithRelationsCustom,

    // CRUD operations
    addDepartment,
    updateDepartment,
    deleteDepartment,
    addCourse,
    updateCourse,
    deleteCourse,
    addProfessor,
    updateProfessor,
    deleteProfessor,
    addStudent,
    updateStudent,
    deleteStudent,
    addFaculty,
    updateFaculty,
    deleteFaculty,
    addEnrollment,
    updateEnrollment,
    deleteEnrollment,
  }), [
    departmentsState,
    coursesState,
    professorsState,
    studentsState,
    facultiesState,
    enrollmentsState,
    statsState,
  ]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};