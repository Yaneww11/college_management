import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Table from '../components/common/Table';
import Modal from '../components/common/Modal';
import Select from '../components/common/Select';
import Badge from '../components/common/Badge';
import { useAppContext } from '../context/AppContext';
import { Course } from '../types';

const CoursesPage: React.FC = () => {
  const {
    getCoursesWithRelations,
    departments,
    professors,
    addCourse,
    updateCourse,
    deleteCourse,
  } = useAppContext();

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    credits: 3,
    description: '',
    departmentId: '',
    professorId: '',
    semester: '',
  });

  const courses = getCoursesWithRelations();

  const filteredCourses = courses.filter(
    (course) =>
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.department?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (course.professor &&
        `${course.professor.firstName} ${course.professor.lastName}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase()))
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: name === 'credits' ? parseInt(value) : value }));
  };

  const handleAddCourse = () => {
    setEditingCourse(null);
    setFormData({
      name: '',
      code: '',
      credits: 3,
      description: '',
      departmentId: '',
      professorId: '',
      semester: '',
    });
    setIsModalOpen(true);
  };

  const handleEditCourse = (course: Course) => {
    setEditingCourse(course);
    setFormData({
      name: course.name,
      code: course.code,
      credits: course.credits,
      description: course.description,
      departmentId: course.departmentId,
      professorId: course.professorId || '',
      semester: course.semester,
    });
    setIsModalOpen(true);
  };

  const handleDeleteClick = (course: Course) => {
    setSelectedCourse(course);
    setIsDeleteModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingCourse) {
      updateCourse(editingCourse.id, formData);
    } else {
      addCourse(formData);
    }

    setIsModalOpen(false);
  };

  const confirmDelete = () => {
    if (selectedCourse) {
      deleteCourse(selectedCourse.id);
      setIsDeleteModalOpen(false);
    }
  };

  const columns = [
    {
      header: 'Course Code',
      accessor: 'code',
      cell: (course: any) => (
        <span className="font-medium text-gray-900">{course.code}</span>
      ),
    },
    {
      header: 'Course Name',
      accessor: 'name',
    },
    {
      header: 'Department',
      accessor: (course: any) => course.department?.name || 'Not assigned',
    },
    {
      header: 'Professor',
      accessor: (course: any) =>
        course.professor
          ? `${course.professor.firstName} ${course.professor.lastName}`
          : 'Not assigned',
    },
    {
      header: 'Credits',
      accessor: 'credits',
      cell: (course: any) => (
        <Badge variant="primary">{course.credits}</Badge>
      ),
    },
    {
      header: 'Students',
      accessor: (course: any) => (
        <Badge variant="secondary">{course.students?.length || 0}</Badge>
      ),
    },
    {
      header: 'Semester',
      accessor: 'semester',
    },
    {
      header: 'Actions',
      accessor: (course: any) => (
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleEditCourse(course);
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
              handleDeleteClick(course);
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
        <h1 className="text-2xl font-semibold text-gray-900">Courses</h1>
        <Button
          variant="primary"
          onClick={handleAddCourse}
          icon={<Plus className="w-5 h-5" />}
        >
          Add Course
        </Button>
      </div>

      <Card>
        <div className="mb-4">
          <Input
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon={<Search className="w-5 h-5" />}
            fullWidth
          />
        </div>

        <Table
          columns={columns}
          data={filteredCourses}
          keyExtractor={(course) => course.id}
          emptyMessage="No courses found"
        />
      </Card>

      {/* Add/Edit Course Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCourse ? 'Edit Course' : 'Add Course'}
        footer={
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleFormSubmit}>
              {editingCourse ? 'Update' : 'Add'}
            </Button>
          </div>
        }
        size="lg"
      >
        <form onSubmit={handleFormSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Course Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              fullWidth
            />

            <Input
              label="Course Code"
              name="code"
              value={formData.code}
              onChange={handleInputChange}
              required
              fullWidth
            />

            <Input
              label="Credits"
              name="credits"
              type="number"
              min="1"
              max="6"
              value={formData.credits.toString()}
              onChange={handleInputChange}
              required
              fullWidth
            />

            <Input
              label="Semester"
              name="semester"
              value={formData.semester}
              onChange={handleInputChange}
              placeholder="e.g., Fall 2023"
              required
              fullWidth
            />

            <Select
              label="Department"
              name="departmentId"
              value={formData.departmentId}
              onChange={handleInputChange}
              options={departments.map((department) => ({
                value: department.id,
                label: department.name,
              }))}
              required
              fullWidth
            />

            <Select
              label="Professor"
              name="professorId"
              value={formData.professorId}
              onChange={handleInputChange}
              options={professors
                .filter((professor) => {
                  // If we've selected a department, only show professors from that department
                  if (formData.departmentId) {
                    return professor.departmentId === formData.departmentId;
                  }
                  return true;
                })
                .map((professor) => ({
                  value: professor.id,
                  label: `${professor.firstName} ${professor.lastName}`,
                }))}
              helperText={
                formData.departmentId
                  ? "Select a professor from this department"
                  : "Select a department first to filter professors"
              }
              fullWidth
            />

            <div className="sm:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleInputChange}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              />
            </div>
          </div>
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
          Are you sure you want to delete the course{' '}
          <span className="font-semibold">{selectedCourse?.name} ({selectedCourse?.code})</span>?
        </p>
        <p className="mt-2 text-sm text-gray-500">
          This action cannot be undone. This will permanently delete the course
          and remove all student enrollments.
        </p>
      </Modal>
    </div>
  );
};

export default CoursesPage;