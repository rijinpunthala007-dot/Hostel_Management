import React from 'react';
import Maintenance from './pages/Maintenance';

// ============================================================
// 🔧 MAINTENANCE MODE IS ON
// To restore the app, comment out the Maintenance App below
// and uncomment the Original App section.
// ============================================================

function App() {
    return <Maintenance />;
}

export default App;

// ============================================================
// 📦 ORIGINAL APP — Uncomment below & comment above to restore
// ============================================================
/*
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import StudentRegistration from './pages/StudentRegistration';
import StudentDashboard from './pages/StudentDashboard';
import RoomSelection from './pages/RoomSelection';
import HostelSelection from './pages/HostelSelection';
import FoodMenu from './pages/FoodMenu';
import AdminDashboard from './pages/AdminDashboard';
import LeaveApplication from './pages/LeaveApplication';
import ComplaintSubmission from './pages/ComplaintSubmission';
import HostelRules from './pages/HostelRules';
import StudentProfile from './pages/StudentProfile';
import TermsOfService from './pages/TermsOfService';
import PrivacyPolicy from './pages/PrivacyPolicy';

import ErrorBoundary from './components/ErrorBoundary';

const ProtectedRoute = ({ children }) => {
    const user = JSON.parse(localStorage.getItem('userData') || 'null');

    if (!user) {
        return <Login />;
    }

    if (user.status === 'Pending_Hostel' || user.status === 'Pending_Approval') {
        return <HostelSelection />;
    }

    return children;
};

function App() {
    return (
        <HashRouter future={{ v7_relativeSplatPath: true }}>
            <ErrorBoundary>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/register" element={<StudentRegistration />} />
                    <Route
                        path="/student-dashboard"
                        element={
                            <ProtectedRoute>
                                <StudentDashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route path="/hostels" element={<HostelSelection />} />
                    <Route path="/room-selection" element={<RoomSelection />} />
                    <Route path="/food-menu" element={<FoodMenu />} />
                    <Route path="/admin-dashboard" element={<AdminDashboard />} />
                    <Route path="/leave-application" element={<LeaveApplication />} />
                    <Route path="/complaints" element={<ComplaintSubmission />} />
                    <Route path="/rules" element={<HostelRules />} />
                    <Route path="/profile" element={<StudentProfile />} />
                    <Route path="/terms" element={<TermsOfService />} />
                    <Route path="/privacy" element={<PrivacyPolicy />} />
                    <Route path="*" element={<Login />} />
                </Routes>
            </ErrorBoundary>
        </HashRouter>
    );
}

export default App;
*/
