import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogOut, Home, User, Wallet, BedDouble, Utensils, AlertCircle, Coffee, CalendarCheck, FilePlus, Bell, FileText } from 'lucide-react';
import { userData, announcements } from '../mockData';

const StudentDashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = React.useState(userData);
    const [notices, setNotices] = React.useState(announcements);

    React.useEffect(() => {
        const storedUser = localStorage.getItem('userData');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }

        const storedNotices = localStorage.getItem('announcements');
        if (storedNotices) {
            setNotices(JSON.parse(storedNotices));
        }
    }, []);

    return (
        <div className="min-h-screen bg-[#F3F4F6] font-sans">
            {/* Navbar */}
            <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center sticky top-0 z-10">
                <div className="flex items-center gap-2">
                    <img src="/logo.png" alt="College Logo" className="h-10 w-auto" />
                    <span className="font-bold text-gray-800 text-lg">HMS</span>
                </div>
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 text-gray-600 hover:text-[#991B1B] font-medium"
                >
                    <LogOut size={18} />
                    Logout
                </button>
            </nav>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">
                        Welcome back, {user.name}!
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Here's your hostel dashboard overview.
                    </p>
                </div>

                {/* Top Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* Profile Card */}
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                        <div className="flex items-start justify-between mb-4">
                            <div className="bg-red-50 p-2 rounded-full">
                                <User className="text-[#991B1B]" size={24} />
                            </div>
                        </div>
                        <h3 className="font-semibold text-lg text-gray-900">{user.name}</h3>
                        <p className="text-sm text-gray-500">{user.course}</p>
                        <p className="text-sm text-gray-500 font-mono mt-1">{user.regNo}</p>
                        <Link to="/profile" className="text-[#991B1B] text-sm font-medium mt-4 inline-block hover:underline">
                            View Full Profile
                        </Link>
                    </div>

                    {/* Hostel Allocation Card */}
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                        <div className="flex items-start justify-between mb-4">
                            <div className="bg-blue-50 p-2 rounded-full">
                                <Home className="text-blue-600" size={24} />
                            </div>
                            <span className="bg-green-100 text-green-600 text-xs px-2 py-1 rounded-full font-medium">
                                Allocated
                            </span>
                        </div>
                        <h3 className="font-semibold text-lg text-gray-900 mb-1">Hostel Allocated</h3>
                        <h4 className="font-bold text-md text-[#991B1B] mb-2">{user.hostelName}</h4>
                        <div className="space-y-1 mb-4">
                            <p className="text-sm text-gray-600 flex justify-between">
                                <span>Room No:</span>
                                <span className="font-medium text-gray-900">{user.roomNumber}</span>
                            </p>
                            <p className="text-sm text-gray-600 flex justify-between">
                                <span>Type:</span>
                                <span className="font-medium text-gray-900">{user.roomType}</span>
                            </p>
                        </div>

                        <Link
                            to="/hostels"
                            className="w-full border border-blue-600 text-blue-600 py-2 rounded-lg hover:bg-blue-50 font-medium transition-colors block text-center"
                        >
                            Change Hostel
                        </Link>
                    </div>

                    {/* Fee Status Card */}
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                        <div className="flex items-start justify-between mb-4">
                            <div className="bg-green-50 p-2 rounded-full">
                                <FileText className="text-green-600" size={24} />
                            </div>
                        </div>
                        <h3 className="font-bold text-2xl text-gray-900">{user.feeDue}</h3>
                        <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                            <span className="w-2 h-2 bg-green-500 rounded-full inline-block"></span>
                            No dues pending
                        </p>
                    </div>
                </div>

                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Announcements (Span 2) */}
                    <div className="lg:col-span-2">
                        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Bell size={20} />
                            Announcements
                        </h2>
                        <div className="space-y-4">
                            {notices.length > 0 ? (
                                notices.map((item) => (
                                    <div key={item.id} className="bg-white p-5 rounded-lg shadow-sm border-l-4 border-[#991B1B]">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-semibold text-gray-900">{item.title}</h3>
                                            <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">{item.date}</span>
                                        </div>
                                        <p className="text-gray-600 text-sm leading-relaxed">
                                            {item.desc}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 text-center flex flex-col items-center justify-center">
                                    <Bell className="text-gray-300 mb-3" size={48} />
                                    <h3 className="text-lg font-medium text-gray-900">No Announcements</h3>
                                    <p className="text-gray-500 text-sm mt-1">Check back later for updates from the hostel administration.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column - Quick Actions */}
                    <div>
                        <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <Link
                                to="/hostels"
                                className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:border-[#991B1B] hover:shadow-md transition-all flex flex-col items-center gap-3 text-center group"
                            >
                                <div className="bg-red-50 p-3 rounded-full group-hover:bg-[#991B1B] transition-colors">
                                    <Home className="text-[#991B1B] group-hover:text-white" size={24} />
                                </div>
                                <span className="text-sm font-medium text-gray-700">Browse Hostels</span>
                            </Link>

                            <Link
                                to="/food-menu"
                                className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:border-[#991B1B] hover:shadow-md transition-all flex flex-col items-center gap-3 text-center group"
                            >
                                <div className="bg-orange-50 p-3 rounded-full group-hover:bg-orange-500 transition-colors">
                                    <Coffee className="text-orange-500 group-hover:text-white" size={24} />
                                </div>
                                <span className="text-sm font-medium text-gray-700">Food Menu</span>
                            </Link>

                            <Link
                                to="/leave-application"
                                className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:border-[#991B1B] hover:shadow-md transition-all flex flex-col items-center gap-3 text-center group"
                            >
                                <div className="bg-purple-50 p-3 rounded-full group-hover:bg-purple-500 transition-colors">
                                    <CalendarCheck className="text-purple-500 group-hover:text-white" size={24} />
                                </div>
                                <span className="text-sm font-medium text-gray-700">Leave Request</span>
                            </Link>

                            <Link
                                to="/complaints"
                                className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:border-[#991B1B] hover:shadow-md transition-all flex flex-col items-center gap-3 text-center group"
                            >
                                <div className="bg-blue-50 p-3 rounded-full group-hover:bg-blue-500 transition-colors">
                                    <AlertCircle className="text-blue-500 group-hover:text-white" size={24} />
                                </div>
                                <span className="text-sm font-medium text-gray-700">Complaints</span>
                            </Link>

                            <Link
                                to="/rules"
                                className="col-span-2 bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:border-[#991B1B] hover:shadow-md transition-all flex flex-row items-center justify-center gap-3 text-center group"
                            >
                                <div className="bg-yellow-50 p-2 rounded-full group-hover:bg-yellow-500 transition-colors">
                                    <FileText className="text-yellow-600 group-hover:text-white" size={20} />
                                </div>
                                <span className="text-sm font-medium text-gray-700">Rules & Regulations</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
