import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Book, Users, GraduationCap, Building2, Layers, X } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

interface NavItem {
  name: string;
  path: string;
  icon: React.ReactElement;
}

const navItems: NavItem[] = [
  { name: 'Dashboard', path: '/', icon: <Home className="w-5 h-5" /> },
  { name: 'Departments', path: '/departments', icon: <Building2 className="w-5 h-5" /> },
  { name: 'Courses', path: '/courses', icon: <Book className="w-5 h-5" /> },
  { name: 'Professors', path: '/professors', icon: <Users className="w-5 h-5" /> },
  { name: 'Students', path: '/students', icon: <GraduationCap className="w-5 h-5" /> },
  { name: 'Faculties', path: '/faculties', icon: <Layers className="w-5 h-5" /> },
];

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  return (
    <>
      <aside
        id="sidebar"
        className={`fixed top-0 left-0 z-20 h-full pt-16 flex lg:flex flex-shrink-0 flex-col w-64 transition-width duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
        aria-label="Sidebar"
      >
        <div className="relative flex-1 flex flex-col min-h-0 border-r border-gray-200 bg-white">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex-1 px-3 space-y-1">
              <div className="lg:hidden flex justify-end mb-4">
                <button
                  onClick={toggleSidebar}
                  className="text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-100"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              {navItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center py-2.5 px-4 text-base font-normal rounded-lg transition duration-200 ${
                      isActive
                        ? 'bg-primary-100 text-primary-800'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`
                  }
                  onClick={() => {
                    if (window.innerWidth < 1024) {
                      toggleSidebar();
                    }
                  }}
                >
                  {item.icon}
                  <span className="ml-3">{item.name}</span>
                </NavLink>
              ))}
            </div>
          </div>
          <div className="px-3 py-4 border-t border-gray-200">
            <a
              href="#"
              className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg hover:bg-gray-100"
            >
              <span className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900">
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-2 0c0 .993-.241 1.929-.668 2.754l-1.524-1.525a3.997 3.997 0 00.078-2.183l1.562-1.562C15.802 8.249 16 9.1 16 10zm-5.165 3.913l1.58 1.58A5.98 5.98 0 0110 16a5.976 5.976 0 01-2.516-.552l1.562-1.562a4.006 4.006 0 001.789.027zm-4.677-2.796a4.002 4.002 0 01-.041-2.08l-.08.08-1.53-1.533A5.98 5.98 0 004 10c0 .954.223 1.856.619 2.657l1.54-1.54zm1.088-6.45A5.974 5.974 0 0110 4c.954 0 1.856.223 2.657.619l-1.54 1.54a4.002 4.002 0 00-2.346.033L7.246 4.668zM12 10a2 2 0 11-4 0 2 2 0 014 0z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </span>
              <span className="ml-3">Help & Support</span>
            </a>
          </div>
        </div>
      </aside>
      <div
        className={`bg-gray-900 bg-opacity-50 fixed inset-0 z-10 lg:hidden ${
          isOpen ? 'block' : 'hidden'
        }`}
        id="sidebarBackdrop"
        onClick={toggleSidebar}
      ></div>
    </>
  );
};

export default Sidebar;