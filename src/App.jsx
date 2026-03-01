import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Pages
import AuthPage from './pages/AuthPage';
import HomePage from './pages/HomePage';
import CalendarPage from './pages/CalendarPage';
import EventsPage from './pages/EventsPage';
import TimetablePage from './pages/TimetablePage';
import AttendancePage from './pages/AttendancePage';
import ProfilePage from './pages/ProfilePage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import StudyPlanPage from './pages/StudyPlanPage';

// Icons
import {
  HiHome, HiOutlineHome,
  HiCalendar, HiOutlineCalendar,
  HiCollection, HiOutlineCollection,
  HiClipboardList, HiOutlineClipboardList,
  HiUser, HiOutlineUser,
  HiClock, HiOutlineClock,
  HiOutlineSparkles, HiSparkles
} from 'react-icons/hi';

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated || location.pathname === '/auth') return null;

  const navItems = [
    { path: '/', label: 'Home', icon: HiOutlineHome, activeIcon: HiHome },
    { path: '/calendar', label: 'Calendar', icon: HiOutlineCalendar, activeIcon: HiCalendar },
    { path: '/study-plan', label: 'AI Plan', icon: HiOutlineSparkles, activeIcon: HiSparkles },
    { path: '/timetable', label: 'Timetable', icon: HiOutlineClock, activeIcon: HiClock },
    { path: '/events', label: 'Events', icon: HiOutlineClipboardList, activeIcon: HiClipboardList },
    { path: '/profile', label: 'Profile', icon: HiOutlineUser, activeIcon: HiUser },
  ];

  return (
    <nav className="bottom-nav">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        const Icon = isActive ? item.activeIcon : item.icon;
        return (
          <div
            key={item.path}
            className={`nav-item ${isActive ? 'active' : ''}`}
            onClick={() => navigate(item.path)}
          >
            <Icon />
            <span>{item.label}</span>
          </div>
        );
      })}
    </nav>
  );
};

import LoadingSpinner from './components/LoadingSpinner';
import Footer from './components/Footer';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div className="loading-screen"><LoadingSpinner /></div>;
  return isAuthenticated ? children : <Navigate to="/auth" replace />;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div className="loading-screen">Loading...</div>;
  return !isAuthenticated ? children : <Navigate to="/" replace />;
};

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <div className="app-container">
            <main className="main-content">
              <Routes>
                <Route path="/auth" element={<PublicRoute><AuthPage /></PublicRoute>} />
                <Route path="/forgot-password" element={<PublicRoute><ForgotPasswordPage /></PublicRoute>} />
                <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
                <Route path="/calendar" element={<ProtectedRoute><CalendarPage /></ProtectedRoute>} />
                <Route path="/events" element={<ProtectedRoute><EventsPage /></ProtectedRoute>} />
                <Route path="/timetable" element={<ProtectedRoute><TimetablePage /></ProtectedRoute>} />
                <Route path="/attendance" element={<ProtectedRoute><AttendancePage /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                <Route path="/study-plan" element={<ProtectedRoute><StudyPlanPage /></ProtectedRoute>} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
              <Footer />
            </main>
            <Navigation />
            <ToastContainer position="top-right" theme="colored" />
          </div>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
