import React, { useState } from 'react';
import { Menu, Bell, User, ChevronDown, X, BarChart2 } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface NavbarProps {
  toggleSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar }) => {
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const location = useLocation();
  
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/') return 'Dashboard';
    if (path.includes('/departments')) return 'Departments';
    if (path.includes('/courses')) return 'Courses';
    if (path.includes('/professors')) return 'Professors';
    if (path.includes('/students')) return 'Students';
    if (path.includes('/faculties')) return 'Faculties';
    return 'College Management System';
  };

  const toggleProfileMenu = () => {
    setProfileMenuOpen(!profileMenuOpen);
    if (notificationsOpen) setNotificationsOpen(false);
  };

  const toggleNotifications = () => {
    setNotificationsOpen(!notificationsOpen);
    if (profileMenuOpen) setProfileMenuOpen(false);
  };

  return (
    <nav className="bg-white border-b border-gray-200 fixed z-30 w-full">
      <div className="px-3 py-3 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-start">
            <button
              onClick={toggleSidebar}
              aria-expanded="true"
              aria-controls="sidebar"
              className="lg:hidden mr-2 text-gray-600 hover:text-gray-900 cursor-pointer p-2 hover:bg-gray-100 focus:bg-gray-100 focus:ring-2 focus:ring-gray-100 rounded"
            >
              <Menu className="w-6 h-6" />
            </button>
            <Link to="/" className="flex items-center">
              <BarChart2 className="h-8 w-8 text-primary-600" />
              <span className="self-center text-xl font-semibold whitespace-nowrap ml-2">
                College<span className="text-primary-600">MS</span>
              </span>
            </Link>
            <div className="hidden lg:block ml-10">
              <h1 className="text-xl font-semibold text-gray-700">{getPageTitle()}</h1>
            </div>
          </div>
          <div className="flex items-center">
            <div className="hidden sm:flex sm:items-center">
              {/* Breadcrumb could go here */}
            </div>
            <div className="flex items-center">
              {/* Notifications dropdown */}
              <div className="relative">
                <button
                  onClick={toggleNotifications}
                  className="p-2 mr-1 text-gray-500 rounded-lg hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-100"
                >
                  <span className="sr-only">View notifications</span>
                  <Bell className="w-6 h-6" />
                  <div className="absolute inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-error-500 rounded-full -top-0.5 -right-0.5">
                    3
                  </div>
                </button>
                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-2 z-10 animate-fade-in">
                    <div className="px-4 py-2 border-b border-gray-100 flex justify-between items-center">
                      <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                      <button className="text-sm text-primary-600 hover:text-primary-800">Mark all as read</button>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      <a href="#" className="flex px-4 py-3 hover:bg-gray-50 border-b border-gray-100">
                        <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                          <User className="w-4 h-4 text-primary-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-800">
                            <span className="font-semibold">New student enrollment</span>
                            <span className="text-gray-500"> for Data Structures course</span>
                          </p>
                          <p className="text-xs text-gray-400">2 min ago</p>
                        </div>
                      </a>
                      <a href="#" className="flex px-4 py-3 hover:bg-gray-50 border-b border-gray-100">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                          <User className="w-4 h-4 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-800">
                            <span className="font-semibold">Professor John Smith</span>
                            <span className="text-gray-500"> updated course materials</span>
                          </p>
                          <p className="text-xs text-gray-400">1 hour ago</p>
                        </div>
                      </a>
                      <a href="#" className="flex px-4 py-3 hover:bg-gray-50">
                        <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-3">
                          <User className="w-4 h-4 text-red-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-800">
                            <span className="font-semibold">System update</span>
                            <span className="text-gray-500"> scheduled for tonight</span>
                          </p>
                          <p className="text-xs text-gray-400">2 hours ago</p>
                        </div>
                      </a>
                    </div>
                    <a
                      href="#"
                      className="block text-center text-sm font-medium text-primary-600 hover:text-primary-800 px-4 py-2 border-t border-gray-100"
                    >
                      View all notifications
                    </a>
                  </div>
                )}
              </div>

              {/* Profile dropdown */}
              <div className="relative">
                <button
                  onClick={toggleProfileMenu}
                  className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-100"
                  id="user-menu-button"
                  aria-expanded={profileMenuOpen}
                >
                  <span className="sr-only">Open user menu</span>
                  <img
                    className="w-8 h-8 rounded-full"
                    src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=48"
                    alt="user photo"
                  />
                </button>
                {profileMenuOpen && (
                  <div
                    className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none animate-fade-in"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="user-menu-button"
                    tabIndex={-1}
                  >
                    <div className="py-3 px-4 text-sm text-gray-900 border-b border-gray-200">
                      <div className="font-semibold">Admin User</div>
                      <div className="text-gray-500 truncate">admin@college.edu</div>
                    </div>
                    <ul className="py-1 text-sm text-gray-700">
                      <li>
                        <a
                          href="#"
                          className="block py-2 px-4 hover:bg-gray-100"
                          role="menuitem"
                          tabIndex={-1}
                          id="user-menu-item-0"
                        >
                          My Profile
                        </a>
                      </li>
                      <li>
                        <a
                          href="#"
                          className="block py-2 px-4 hover:bg-gray-100"
                          role="menuitem"
                          tabIndex={-1}
                          id="user-menu-item-1"
                        >
                          Account Settings
                        </a>
                      </li>
                      <li>
                        <a
                          href="#"
                          className="block py-2 px-4 text-gray-700 hover:bg-gray-100"
                          role="menuitem"
                          tabIndex={-1}
                          id="user-menu-item-2"
                        >
                          Sign out
                        </a>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;