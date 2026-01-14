import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [activeTab, setActiveTab] = useState('student');
    const [credentials, setCredentials] = useState({ identifier: '', password: '' });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleLogin = (e) => {
        e.preventDefault();
        const { identifier, password } = credentials;

        if (activeTab === 'admin') {
            // Admin Validation (Strict)
            if (identifier === 'admin@college.com' && password === 'admin123') {
                navigate('/admin-dashboard');
            } else {
                alert('Invalid Admin Credentials! (Use: admin@college.com / admin123)');
            }
        } else {
            // Student Validation (Bypass Password only)
            // Must have a valid RegNo (registered user)
            if (!identifier) {
                alert('Please enter your Registration Number!');
                return;
            }

            const storedStudents = localStorage.getItem('studentList');
            if (storedStudents) {
                const students = JSON.parse(storedStudents);
                const student = students.find(s => s.regNo === identifier || s.email === identifier);

                if (student) {
                    // Bypass Password Check: Success if Identity Valid
                    const sessionUser = { ...student };
                    delete sessionUser.password;
                    localStorage.setItem('userData', JSON.stringify(sessionUser));
                    navigate('/student-dashboard');
                } else {
                    alert('Student Record Not Found! Please Register first.');
                }
            } else {
                alert('Database Error: No Student List Found.');
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 font-sans bg-[#F3F4F6]">
            {/* Login Form Container - Centered */}
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden p-8">
                <div className="text-center">
                    <img src="/logo.png" alt="College Logo" className="h-20 w-auto mx-auto mb-6" />
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                        St Berchmans College
                    </h1>
                    <p className="text-gray-500 mt-2 text-lg">
                        Hostel Management System
                    </p>
                </div>

                <div className="mt-8">
                    {/* Tabs */}
                    <div className="flex p-1 bg-gray-100 rounded-xl mb-8">
                        <button
                            className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${activeTab === 'student'
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                            onClick={() => { setActiveTab('student'); setCredentials({ identifier: '', password: '' }); }}
                        >
                            Student Login
                        </button>
                        <button
                            className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${activeTab === 'admin'
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                            onClick={() => { setActiveTab('admin'); setCredentials({ identifier: '', password: '' }); }}
                        >
                            Admin Access
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                {activeTab === 'student' ? "Register Number" : "Email Address"}
                            </label>
                            <input
                                required
                                name="identifier"
                                value={credentials.identifier}
                                onChange={handleChange}
                                type={activeTab === 'student' ? "text" : "email"}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#991B1B] focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                                placeholder={activeTab === 'student' ? "Enter your Reg No" : "admin@college.com"}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Password
                            </label>
                            <input
                                required={activeTab === 'admin'}
                                name="password"
                                value={credentials.password}
                                onChange={handleChange}
                                type="password"
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#991B1B] focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                                placeholder={activeTab === 'admin' ? "••••••••" : "Optional"}
                            />
                            <div className="flex justify-end mt-2">
                                <a href="#" className="text-sm font-medium text-[#991B1B] hover:text-red-800">
                                    Forgot password?
                                </a>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-[#991B1B] text-white py-3.5 rounded-xl font-semibold hover:bg-red-800 transition-all duration-200 transform hover:scale-[1.02] shadow-md hover:shadow-lg"
                        >
                            {activeTab === 'student' ? 'Sign In as Student' : 'Sign In as Admin'}
                        </button>
                    </form>

                    {activeTab === 'student' && (
                        <div className="mt-6 text-center">
                            <p className="text-gray-600">
                                New Student?{' '}
                                <span
                                    onClick={() => navigate('/register')}
                                    className="text-[#991B1B] font-semibold cursor-pointer hover:underline"
                                >
                                    Register Here
                                </span>
                            </p>
                        </div>
                    )}

                    <div className="mt-8 text-center text-sm text-gray-500">
                        By signing in, you agree to our{' '}
                        <Link to="/terms" className="font-medium text-gray-900 hover:underline">Terms of Service</Link>
                        {' '}and{' '}
                        <Link to="/privacy" className="font-medium text-gray-900 hover:underline">Privacy Policy</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
