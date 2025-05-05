import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Table from '../components/common/Table';
import Modal from '../components/common/Modal';
import Select from '../components/common/Select';
import { useAppContext } from '../context/AppContext';
import { Department } from '../types';

const DepartmentsPage: React.FC = () => {
  const { 
    getDepartmentsWithRelations, 
    faculties, 
    professors,
    addDepartment,
    updateDepartment,
    deleteDepartment
  } = useAppContext();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    facultyId: '',
    headProfessorId: '',
  });
  
  const departments = getDepartmentsWithRelations();
  
  const filteredDepartments = departments.filter(
    (department) =>
      department.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      department.faculty?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleAddDepartment = () => {
    setEditingDepartment(null);
    setFormData({
      name: '',
      facultyId: '',
      headProfessorId: '',
    });
    setIsModalOpen(true);
  };
  
  const handleEditDepartment = (department: Department) => {
    setEditingDepartment(department);
    setFormData({
      name: department.name,
      facultyId: department.facultyId,
      headProfessorId: department.headProfessorId || '',
    });
    setIsModalOpen(true);
  };
  
  const handleDeleteClick = (department: Department) => {
    setSelectedDepartment(department);
    setIsDeleteModalOpen(true);
  };
  
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingDepartment) {
      updateDepartment(editingDepartment.id, formData);
    } else {
      addDepartment(formData);
    }
    
    setIsModalOpen(false);
  };
  
  const confirmDelete = () => {
    if (selectedDepartment) {
      deleteDepartment(selectedDepartment.id);
      setIsDeleteModalOpen(false);
    }
  };
  
  const columns = [
    {
      header: 'Department Name',
      accessor: 'name',
    },
    {
      header: 'Faculty',
      accessor: (department: any) => department.faculty?.name || 'Not assigned',
    },
    {
      header: 'Head Professor',
      accessor: (department: any) => 
        department.headProfessor 
          ? `${department.headProfessor.firstName} ${department.headProfessor.lastName}` 
          : 'Not assigned',
    },
    {
      header: 'Professors',
      accessor: (department: any) => department.professors?.length || 0,
    },
    {
      header: 'Courses',
      accessor: (department: any) => department.courses?.length || 0,
    },
    {
      header: 'Actions',
      accessor: (department: any) => (
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleEditDepartment(department);
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
              handleDeleteClick(department);
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
        <h1 className="text-2xl font-semibold text-gray-900">Departments</h1>
        <Button
          variant="primary"
          onClick={handleAddDepartment}
          icon={<Plus className="w-5 h-5" />}
        >
          Add Department
        </Button>
      </div>
      
      <Card>
        <div className="mb-4">
          <Input
            placeholder="Search departments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon={<Search className="w-5 h-5" />}
            fullWidth
          />
        </div>
        
        <Table
          columns={columns}
          data={filteredDepartments}
          keyExtractor={(department) => department.id}
          emptyMessage="No departments found"
        />
      </Card>
      
      {/* Add/Edit Department Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingDepartment ? 'Edit Department' : 'Add Department'}
        footer={
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleFormSubmit}>
              {editingDepartment ? 'Update' : 'Add'}
            </Button>
          </div>
        }
      >
        <form onSubmit={handleFormSubmit}>
          <div className="space-y-4">
            <Input
              label="Department Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              fullWidth
            />
            
            <Select
              label="Faculty"
              name="facultyId"
              value={formData.facultyId}
              onChange={handleInputChange}
              options={faculties.map((faculty) => ({
                value: faculty.id,
                label: faculty.name,
              }))}
              required
              fullWidth
            />
            
            <Select
              label="Head Professor"
              name="headProfessorId"
              value={formData.headProfessorId}
              onChange={handleInputChange}
              options={professors
                .filter((professor) => {
                  // When editing, allow selecting the current head professor regardless of department
                  if (editingDepartment && professor.id === editingDepartment.headProfessorId) {
                    return true;
                  }
                  // Only show professors that belong to the same department or don't have a department yet
                  return !professor.isHeadOfDepartment;
                })
                .map((professor) => ({
                  value: professor.id,
                  label: `${professor.firstName} ${professor.lastName}`,
                }))}
              helperText="Select a professor to be the head of this department"
              fullWidth
            />
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
          Are you sure you want to delete the department{' '}
          <span className="font-semibold">{selectedDepartment?.name}</span>?
        </p>
        <p className="mt-2 text-sm text-gray-500">
          This action cannot be undone. This will permanently delete the department
          and remove all associations.
        </p>
      </Modal>
    </div>
  );
};

export default DepartmentsPage;