import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import StudentDashboard from './pages/StudentDashboard';
import RoomSelection from './pages/RoomSelection';
import HostelSelection from './pages/HostelSelection';
import FoodMenu from './pages/FoodMenu';
import AdminDashboard from './pages/AdminDashboard';
import LeaveApplication from './pages/LeaveApplication';
import ComplaintSubmission from './pages/ComplaintSubmission';
import HostelRules from './pages/HostelRules';
import StudentProfile from './pages/StudentProfile';

import ErrorBoundary from './components/ErrorBoundary';

function App() {
    return (
        <BrowserRouter>
            <ErrorBoundary>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/student-dashboard" element={<StudentDashboard />} />
                    <Route path="/hostels" element={<HostelSelection />} />
                    <Route path="/room-selection" element={<RoomSelection />} />
                    <Route path="/food-menu" element={<FoodMenu />} />
                    <Route path="/admin-dashboard" element={<AdminDashboard />} />
                    <Route path="/leave-application" element={<LeaveApplication />} />
                    <Route path="/complaints" element={<ComplaintSubmission />} />
                    <Route path="/rules" element={<HostelRules />} />
                    <Route path="/profile" element={<StudentProfile />} />
                    <Route path="*" element={<Login />} />
                </Routes>
            </ErrorBoundary>
        </BrowserRouter>
    );
}

export default App;
