import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, Building2 } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Table from '../components/common/Table';
import Modal from '../components/common/Modal';
import Badge from '../components/common/Badge';
import { useAppContext } from '../context/AppContext';
import { Faculty } from '../types';

const FacultiesPage: React.FC = () => {
  const {
    getFacultiesWithRelations,
    addFaculty,
    updateFaculty,
    deleteFaculty,
  } = useAppContext();

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState<Faculty | null>(null);
  const [selectedFaculty, setSelectedFaculty] = useState<Faculty | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    dean: '',
    description: '',
  });

  const faculties = getFacultiesWithRelations();

  const filteredFaculties = faculties.filter(
    (faculty) =>
      faculty.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faculty.dean.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faculty.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddFaculty = () => {
    setEditingFaculty(null);
    setFormData({
      name: '',
      dean: '',
      description: '',
    });
    setIsModalOpen(true);
  };

  const handleEditFaculty = (faculty: Faculty) => {
    setEditingFaculty(faculty);
    setFormData({
      name: faculty.name,
      dean: faculty.dean,
      description: faculty.description,
    });
    setIsModalOpen(true);
  };

  const handleDeleteClick = (faculty: Faculty) => {
    setSelectedFaculty(faculty);
    setIsDeleteModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingFaculty) {
      updateFaculty(editingFaculty.id, formData);
    } else {
      addFaculty(formData);
    }

    setIsModalOpen(false);
  };

  const confirmDelete = () => {
    if (selectedFaculty) {
      deleteFaculty(selectedFaculty.id);
      setIsDeleteModalOpen(false);
    }
  };

  const columns = [
    {
      header: 'Faculty Name',
      accessor: 'name',
      cell: (faculty: any) => (
        <div className="flex items-center">
          <Building2 className="w-5 h-5 text-primary-600 mr-2" />
          <span className="font-medium text-gray-900">{faculty.name}</span>
        </div>
      ),
    },
    {
      header: 'Dean',
      accessor: 'dean',
    },
    {
      header: 'Departments',
      accessor: (faculty: any) => (
        <Badge variant="primary">{faculty.departments?.length || 0}</Badge>
      ),
    },
    {
      header: 'Description',
      accessor: 'description',
      cell: (faculty: any) => (
        <div className="max-w-md truncate">{faculty.description}</div>
      ),
    },
    {
      header: 'Actions',
      accessor: (faculty: any) => (
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleEditFaculty(faculty);
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
              handleDeleteClick(faculty);
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
        <h1 className="text-2xl font-semibold text-gray-900">Faculties</h1>
        <Button
          variant="primary"
          onClick={handleAddFaculty}
          icon={<Plus className="w-5 h-5" />}
        >
          Add Faculty
        </Button>
      </div>

      <Card>
        <div className="mb-4">
          <Input
            placeholder="Search faculties..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon={<Search className="w-5 h-5" />}
            fullWidth
          />
        </div>

        <Table
          columns={columns}
          data={filteredFaculties}
          keyExtractor={(faculty) => faculty.id}
          emptyMessage="No faculties found"
        />
      </Card>

      {/* Add/Edit Faculty Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingFaculty ? 'Edit Faculty' : 'Add Faculty'}
        footer={
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleFormSubmit}>
              {editingFaculty ? 'Update' : 'Add'}
            </Button>
          </div>
        }
      >
        <form onSubmit={handleFormSubmit}>
          <div className="space-y-4">
            <Input
              label="Faculty Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              fullWidth
            />

            <Input
              label="Dean"
              name="dean"
              value={formData.dean}
              onChange={handleInputChange}
              placeholder="Dr. Full Name"
              required
              fullWidth
            />

            <div>
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
                required
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
          Are you sure you want to delete the faculty{' '}
          <span className="font-semibold">{selectedFaculty?.name}</span>?
        </p>
        <p className="mt-2 text-sm text-gray-500">
          This action cannot be undone. This will permanently delete the faculty
          and affect all associated departments.
        </p>
        {selectedFaculty?.departments && selectedFaculty.departments.length > 0 && (
          <p className="mt-2 text-sm text-error-500 font-semibold">
            Warning: This faculty has {selectedFaculty.departments.length} department(s) associated with it.
            Deletion may affect these departments.
          </p>
        )}
      </Modal>
    </div>
  );
};

export default FacultiesPage;