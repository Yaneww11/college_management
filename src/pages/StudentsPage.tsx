import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, Mail, Phone, Book, PlusCircle } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Table from '../components/common/Table';
import Modal from '../components/common/Modal';
import Badge from '../components/common/Badge';
import Select from '../components/common/Select';
import { useAppContext } from '../context/AppContext';
import { Student, Enrollment } from '../types';

const StudentsPage: React.FC = () => {
  const {
    getStudentsWithRelations,
    courses,
    addStudent,
    updateStudent,
    deleteStudent,
    addEnrollment,
  } = useAppContext();

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    enrollmentNumber: '',
    dateOfBirth: '',
    joinDate: '',
    graduationYear: 0,
  });

  const [enrollmentData, setEnrollmentData] = useState({
    courseId: '',
    status: 'ACTIVE' as const,
  });

  const students = getStudentsWithRelations();

  const filteredStudents = students.filter(
    (student) =>
      `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.enrollmentNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'graduationYear' ? (value ? parseInt(value) : null) : value,
    }));
  };

  const handleEnrollmentInputChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEnrollmentData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddStudent = () => {
    setEditingStudent(null);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      enrollmentNumber: `S${new Date().getFullYear()}${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
      dateOfBirth: '',
      joinDate: new Date().toISOString().split('T')[0],
      graduationYear: new Date().getFullYear() + 4,
    });
    setIsModalOpen(true);
  };

  const handleEditStudent = (student: Student) => {
    setEditingStudent(student);
    setFormData({
      firstName: student.firstName,
      lastName: student.lastName,
      email: student.email,
      phone: student.phone,
      enrollmentNumber: student.enrollmentNumber,
      dateOfBirth: new Date(student.dateOfBirth).toISOString().split('T')[0],
      joinDate: new Date(student.joinDate).toISOString().split('T')[0],
      graduationYear: student.graduationYear || 0,
    });
    setIsModalOpen(true);
  };

  const handleDeleteClick = (student: Student) => {
    setSelectedStudent(student);
    setIsDeleteModalOpen(true);
  };

  const handleEnrollClick = (student: Student) => {
    setSelectedStudent(student);
    setEnrollmentData({
      courseId: '',
      status: 'ACTIVE',
    });
    setIsEnrollModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingStudent) {
      updateStudent(editingStudent.id, formData);
    } else {
      addStudent(formData);
    }

    setIsModalOpen(false);
  };

  const handleEnrollmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedStudent) {
      const newEnrollment: Omit<Enrollment, 'id' | 'createdAt' | 'updatedAt'> = {
        studentId: selectedStudent.id,
        courseId: enrollmentData.courseId,
        enrollmentDate: new Date().toISOString(),
        grade: null,
        status: enrollmentData.status,
      };

      addEnrollment(newEnrollment);
      setIsEnrollModalOpen(false);
    }
  };

  const confirmDelete = () => {
    if (selectedStudent) {
      deleteStudent(selectedStudent.id);
      setIsDeleteModalOpen(false);
    }
  };

  const getAvailableCourses = (student: Student) => {
    // Get courses the student is not already enrolled in
    const enrolledCourseIds = (student.enrollments || []).map(e => e.courseId);
    return courses.filter(course => !enrolledCourseIds.includes(course.id));
  };

  const columns = [
    {
      header: 'Student',
      accessor: (student: any) => (
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
            <span className="text-primary-800 font-semibold">
              {student.firstName.charAt(0)}
              {student.lastName.charAt(0)}
            </span>
          </div>
          <div className="ml-4">
            <div className="font-medium text-gray-900">{`${student.firstName} ${student.lastName}`}</div>
            <div className="text-gray-500 text-sm">{student.enrollmentNumber}</div>
          </div>
        </div>
      ),
    },
    {
      header: 'Contact',
      accessor: (student: any) => (
        <div className="space-y-1">
          <div className="flex items-center text-sm text-gray-600">
            <Mail className="w-4 h-4 mr-1" />
            <span>{student.email}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Phone className="w-4 h-4 mr-1" />
            <span>{student.phone}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Courses',
      accessor: (student: any) => (
        <div className="flex items-center">
          <Badge variant="primary" className="mr-2">{student.courses?.length || 0}</Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleEnrollClick(student);
            }}
            icon={<PlusCircle className="w-4 h-4" />}
          >
            Enroll
          </Button>
        </div>
      ),
    },
    {
      header: 'Enrolled Courses',
      accessor: (student: any) => (
        <div className="flex flex-wrap gap-1">
          {student.courses?.slice(0, 3).map((course: any) => (
            <Badge key={course.id} variant="secondary" className="mr-1">
              {course.code}
            </Badge>
          ))}
          {student.courses?.length > 3 && <Badge variant="default">+{student.courses.length - 3}</Badge>}
        </div>
      ),
    },
    {
      header: 'Join Date',
      accessor: (student: any) => new Date(student.joinDate).toLocaleDateString(),
    },
    {
      header: 'Graduation Year',
      accessor: (student: any) => student.graduationYear || 'N/A',
    },
    {
      header: 'Actions',
      accessor: (student: any) => (
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleEditStudent(student);
            }}
            icon={<Edit className="w-4 h-4" />}
          >
            Edit
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteClick(student);
            }}
            icon={<Trash2 className="w-4 h-4" />}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Students</h1>
        <Button
          variant="primary"
          onClick={handleAddStudent}
          icon={<Plus className="w-5 h-5" />}
        >
          Add Student
        </Button>
      </div>

      <Card>
        <div className="mb-4">
          <Input
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon={<Search className="w-5 h-5" />}
            fullWidth
          />
        </div>

        <Table
          columns={columns}
          data={filteredStudents}
          keyExtractor={(student) => student.id}
          emptyMessage="No students found"
        />
      </Card>

      {/* Add/Edit Student Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingStudent ? 'Edit Student' : 'Add Student'}
        footer={
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleFormSubmit}>
              {editingStudent ? 'Update' : 'Add'}
            </Button>
          </div>
        }
        size="lg"
      >
        <form onSubmit={handleFormSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              required
              fullWidth
            />

            <Input
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              required
              fullWidth
            />

            <Input
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              fullWidth
            />

            <Input
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="(555) 123-4567"
              required
              fullWidth
            />

            <Input
              label="Enrollment Number"
              name="enrollmentNumber"
              value={formData.enrollmentNumber}
              onChange={handleInputChange}
              required
              fullWidth
            />

            <Input
              label="Date of Birth"
              name="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={handleInputChange}
              required
              fullWidth
            />

            <Input
              label="Join Date"
              name="joinDate"
              type="date"
              value={formData.joinDate}
              onChange={handleInputChange}
              required
              fullWidth
            />

            <Input
              label="Graduation Year"
              name="graduationYear"
              type="number"
              min={new Date().getFullYear()}
              max={new Date().getFullYear() + 10}
              value={formData.graduationYear.toString()}
              onChange={handleInputChange}
              fullWidth
            />
          </div>
        </form>
      </Modal>

      {/* Enroll in Course Modal */}
      <Modal
        isOpen={isEnrollModalOpen}
        onClose={() => setIsEnrollModalOpen(false)}
        title="Enroll in Course"
        footer={
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsEnrollModalOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="primary" 
              onClick={handleEnrollmentSubmit}
              disabled={!enrollmentData.courseId}
            >
              Enroll
            </Button>
          </div>
        }
      >
        <p className="mb-4">
          Enrolling <span className="font-semibold">
          {selectedStudent?.firstName} {selectedStudent?.lastName}</span> in a new course.
        </p>
        
        <form onSubmit={handleEnrollmentSubmit} className="space-y-4">
          <Select
            label="Course"
            name="courseId"
            value={enrollmentData.courseId}
            onChange={handleEnrollmentInputChange}
            options={selectedStudent ? getAvailableCourses(selectedStudent).map(course => ({
              value: course.id,
              label: `${course.code} - ${course.name}`,
            })) : []}
            required
            fullWidth
            helperText={
              selectedStudent && getAvailableCourses(selectedStudent).length === 0 
                ? "Student is enrolled in all available courses" 
                : undefined
            }
            error={
              selectedStudent && getAvailableCourses(selectedStudent).length === 0 
                ? "No available courses for enrollment" 
                : undefined
            }
          />

          <Select
            label="Status"
            name="status"
            value={enrollmentData.status}
            onChange={handleEnrollmentInputChange}
            options={[
              { value: 'ACTIVE', label: 'Active' },
              { value: 'COMPLETED', label: 'Completed' },
              { value: 'DROPPED', label: 'Dropped' },
            ]}
            required
            fullWidth
          />
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Delete"
        footer={
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={confirmDelete}>
              Delete
            </Button>
          </div>
        }
      >
        <p>
          Are you sure you want to delete the student{' '}
          <span className="font-semibold">
            {selectedStudent?.firstName} {selectedStudent?.lastName}
          </span>?
        </p>
        <p className="mt-2 text-sm text-gray-500">
          This action cannot be undone. This will permanently delete the student's
          record and remove all course enrollments.
        </p>
      </Modal>
    </div>
  );
};

export default StudentsPage;