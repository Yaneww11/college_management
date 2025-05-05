import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, Mail, Phone, Award } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Table from '../components/common/Table';
import Modal from '../components/common/Modal';
import Select from '../components/common/Select';
import Badge from '../components/common/Badge';
import { useAppContext } from '../context/AppContext';
import { Professor } from '../types';

const ProfessorsPage: React.FC = () => {
  const {
    getProfessorsWithRelations,
    departments,
    addProfessor,
    updateProfessor,
    deleteProfessor,
  } = useAppContext();

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingProfessor, setEditingProfessor] = useState<Professor | null>(null);
  const [selectedProfessor, setSelectedProfessor] = useState<Professor | null>(null);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    departmentId: '',
    specialization: '',
    isHeadOfDepartment: false,
    joinDate: '',
  });

  const professors = getProfessorsWithRelations();

  const filteredProfessors = professors.filter(
    (professor) =>
      `${professor.firstName} ${professor.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      professor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      professor.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      professor.department?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleAddProfessor = () => {
    setEditingProfessor(null);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      departmentId: '',
      specialization: '',
      isHeadOfDepartment: false,
      joinDate: new Date().toISOString().split('T')[0],
    });
    setIsModalOpen(true);
  };

  const handleEditProfessor = (professor: Professor) => {
    setEditingProfessor(professor);
    setFormData({
      firstName: professor.firstName,
      lastName: professor.lastName,
      email: professor.email,
      phone: professor.phone,
      departmentId: professor.departmentId,
      specialization: professor.specialization,
      isHeadOfDepartment: professor.isHeadOfDepartment,
      joinDate: new Date(professor.joinDate).toISOString().split('T')[0],
    });
    setIsModalOpen(true);
  };

  const handleDeleteClick = (professor: Professor) => {
    setSelectedProfessor(professor);
    setIsDeleteModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingProfessor) {
      updateProfessor(editingProfessor.id, formData);
    } else {
      addProfessor(formData);
    }

    setIsModalOpen(false);
  };

  const confirmDelete = () => {
    if (selectedProfessor) {
      deleteProfessor(selectedProfessor.id);
      setIsDeleteModalOpen(false);
    }
  };

  const columns = [
    {
      header: 'Professor',
      accessor: (professor: any) => (
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-600 font-semibold">
              {professor.firstName.charAt(0)}
              {professor.lastName.charAt(0)}
            </span>
          </div>
          <div className="ml-4">
            <div className="font-medium text-gray-900">{`${professor.firstName} ${professor.lastName}`}</div>
            <div className="text-gray-500 text-sm">{professor.email}</div>
          </div>
        </div>
      ),
    },
    {
      header: 'Department',
      accessor: (professor: any) => professor.department?.name || 'Not assigned',
    },
    {
      header: 'Specialization',
      accessor: 'specialization',
    },
    {
      header: 'Role',
      accessor: (professor: any) => (
        professor.isHeadOfDepartment ? (
          <Badge variant="success" className="flex items-center space-x-1">
            <Award className="w-3 h-3" />
            <span>Head of Department</span>
          </Badge>
        ) : (
          <Badge variant="default">Professor</Badge>
        )
      ),
    },
    {
      header: 'Courses',
      accessor: (professor: any) => 
        <Badge variant="secondary">{professor.courses?.length || 0}</Badge>,
    },
    {
      header: 'Contact',
      accessor: (professor: any) => (
        <div className="space-y-1">
          <div className="flex items-center text-sm text-gray-600">
            <Mail className="w-4 h-4 mr-1" />
            <span>{professor.email}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Phone className="w-4 h-4 mr-1" />
            <span>{professor.phone}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Actions',
      accessor: (professor: any) => (
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleEditProfessor(professor);
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
              handleDeleteClick(professor);
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
        <h1 className="text-2xl font-semibold text-gray-900">Professors</h1>
        <Button
          variant="primary"
          onClick={handleAddProfessor}
          icon={<Plus className="w-5 h-5" />}
        >
          Add Professor
        </Button>
      </div>

      <Card>
        <div className="mb-4">
          <Input
            placeholder="Search professors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon={<Search className="w-5 h-5" />}
            fullWidth
          />
        </div>

        <Table
          columns={columns}
          data={filteredProfessors}
          keyExtractor={(professor) => professor.id}
          emptyMessage="No professors found"
        />
      </Card>

      {/* Add/Edit Professor Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProfessor ? 'Edit Professor' : 'Add Professor'}
        footer={
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleFormSubmit}>
              {editingProfessor ? 'Update' : 'Add'}
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
              label="Specialization"
              name="specialization"
              value={formData.specialization}
              onChange={handleInputChange}
              placeholder="e.g., Artificial Intelligence"
              required
              fullWidth
            />

            <div className="flex items-center mt-6">
              <input
                id="isHeadOfDepartment"
                name="isHeadOfDepartment"
                type="checkbox"
                checked={formData.isHeadOfDepartment}
                onChange={handleInputChange}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="isHeadOfDepartment" className="ml-2 block text-sm text-gray-900">
                Head of Department
              </label>
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
          Are you sure you want to delete the professor{' '}
          <span className="font-semibold">
            {selectedProfessor?.firstName} {selectedProfessor?.lastName}
          </span>
          ?
        </p>
        <p className="mt-2 text-sm text-gray-500">
          This action cannot be undone. This will permanently delete the professor's
          record and remove all course assignments.
        </p>
        {selectedProfessor?.isHeadOfDepartment && (
          <p className="mt-2 text-sm text-error-500 font-semibold">
            Warning: This professor is currently the Head of a Department. 
            Deleting will remove them from this position.
          </p>
        )}
      </Modal>
    </div>
  );
};

export default ProfessorsPage;