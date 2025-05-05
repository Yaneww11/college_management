import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import MainLayout from './components/layout/MainLayout';
import DashboardPage from './pages/DashboardPage';
import DepartmentsPage from './pages/DepartmentsPage';
import CoursesPage from './pages/CoursesPage';
import ProfessorsPage from './pages/ProfessorsPage';
import StudentsPage from './pages/StudentsPage';
import FacultiesPage from './pages/FacultiesPage';

function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="departments" element={<DepartmentsPage />} />
            <Route path="courses" element={<CoursesPage />} />
            <Route path="professors" element={<ProfessorsPage />} />
            <Route path="students" element={<StudentsPage />} />
            <Route path="faculties" element={<FacultiesPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;