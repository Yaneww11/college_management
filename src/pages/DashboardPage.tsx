import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Book, Building2, GraduationCap, TrendingUp, Calendar } from 'lucide-react';
import Card from '../components/common/Card';
import { useAppContext } from '../context/AppContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const DashboardPage: React.FC = () => {
  const { dashboardStats, getDepartmentsWithRelations, getFacultiesWithRelations } = useAppContext();
  
  const departments = getDepartmentsWithRelations();
  const faculties = getFacultiesWithRelations();

  const COLORS = ['#1E40AF', '#0D9488', '#F97316', '#10B981', '#F59E0B', '#EF4444'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <div className="flex space-x-2">
          <span className="text-sm text-gray-500">Last Updated: {new Date().toLocaleDateString()}</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="transform transition-all hover:scale-105">
          <div className="flex items-center">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary-100 text-primary-800">
              <Users className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Total Students</h3>
              <p className="text-2xl font-semibold text-gray-900">{dashboardStats.totalStudents}</p>
              <p className="text-xs text-green-600 mt-1">
                <TrendingUp className="w-3 h-3 inline mr-1" />
                <span>5% increase</span>
              </p>
            </div>
          </div>
        </Card>

        <Card className="transform transition-all hover:scale-105">
          <div className="flex items-center">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-secondary-100 text-secondary-800">
              <Users className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Total Professors</h3>
              <p className="text-2xl font-semibold text-gray-900">{dashboardStats.totalProfessors}</p>
              <p className="text-xs text-green-600 mt-1">
                <TrendingUp className="w-3 h-3 inline mr-1" />
                <span>2% increase</span>
              </p>
            </div>
          </div>
        </Card>

        <Card className="transform transition-all hover:scale-105">
          <div className="flex items-center">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-accent-100 text-accent-800">
              <Book className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Total Courses</h3>
              <p className="text-2xl font-semibold text-gray-900">{dashboardStats.totalCourses}</p>
              <p className="text-xs text-green-600 mt-1">
                <TrendingUp className="w-3 h-3 inline mr-1" />
                <span>8% increase</span>
              </p>
            </div>
          </div>
        </Card>

        <Card className="transform transition-all hover:scale-105">
          <div className="flex items-center">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100 text-green-800">
              <Building2 className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Departments</h3>
              <p className="text-2xl font-semibold text-gray-900">{dashboardStats.totalDepartments}</p>
              <p className="text-xs text-gray-500 mt-1">
                <span>Across {faculties.length} faculties</span>
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Students by Department">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={dashboardStats.studentsByDepartment}
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="departmentName" 
                  angle={-45} 
                  textAnchor="end"
                  height={60}
                  tick={{ fontSize: 12 }}
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#1E40AF" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Courses by Faculty">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dashboardStats.coursesByFaculty}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                  nameKey="facultyName"
                  label={({ facultyName, count, percent }) => `${facultyName}: ${count} (${(percent * 100).toFixed(0)}%)`}
                >
                  {dashboardStats.coursesByFaculty.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Recent Enrollments">
          <div className="overflow-hidden">
            <ul className="divide-y divide-gray-200">
              {dashboardStats.recentEnrollments.map((enrollment) => {
                const student = useAppContext().students.find(s => s.id === enrollment.studentId);
                const course = useAppContext().courses.find(c => c.id === enrollment.courseId);
                
                return (
                  <li key={enrollment.id} className="py-3 flex animate-slide-in">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-100 text-primary-800">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">
                        {student?.firstName} {student?.lastName} enrolled in {course?.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        <Calendar className="w-3 h-3 inline mr-1" />
                        {new Date(enrollment.enrollmentDate).toLocaleDateString()}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
            <div className="mt-4">
              <Link
                to="/students"
                className="text-sm font-medium text-primary-600 hover:text-primary-800"
              >
                View all enrollments
              </Link>
            </div>
          </div>
        </Card>

        <Card title="Department Overview">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500">Largest Department</h3>
                <p className="text-lg font-semibold text-gray-900">Computer Science</p>
                <p className="text-sm text-gray-600">35 students</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500">Most Active Department</h3>
                <p className="text-lg font-semibold text-gray-900">Electrical Engineering</p>
                <p className="text-sm text-gray-600">15 courses</p>
              </div>
            </div>
            
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Head
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Faculty
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {departments.slice(0, 4).map((dept) => (
                  <tr key={dept.id} className="hover:bg-gray-50">
                    <td className="px-3 py-2 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{dept.name}</div>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {dept.headProfessor?.firstName} {dept.headProfessor?.lastName}
                      </div>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{dept.faculty?.name}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            <div className="text-right">
              <Link
                to="/departments"
                className="text-sm font-medium text-primary-600 hover:text-primary-800"
              >
                View all departments
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;