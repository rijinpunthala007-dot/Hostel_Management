import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Book, Hash, Home, Calendar, ArrowLeft } from 'lucide-react';
import { userData } from '../mockData';

const StudentProfile = () => {
    const navigate = useNavigate();
    const [user, setUser] = React.useState(userData);

    React.useEffect(() => {
        const storedUser = localStorage.getItem('userData');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    return (
        <div className="min-h-screen bg-[#F3F4F6] font-sans">
            {/* Navbar */}
            <nav className="bg-white shadow-sm px-6 py-4 flex items-center gap-4 sticky top-0 z-10">
                <button
                    onClick={() => navigate('/student-dashboard')}
                    className="p-2 hover:bg-gray-100 rounded-full text-gray-600 transition-colors"
                >
                    <ArrowLeft size={20} />
                </button>
                <h1 className="font-bold text-gray-800 text-xl">My Profile</h1>
            </nav>

            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    {/* Header Background */}
                    <div className="h-32 bg-gradient-to-r from-[#991B1B] to-[#7f1d1d]"></div>

                    {/* Profile Header */}
                    <div className="px-6 pb-8">
                        <div className="relative flex flex-col items-center -mt-16 mb-6">
                            <div className="bg-white p-1.5 rounded-full shadow-sm">
                                <div className="bg-gray-50 rounded-full border-4 border-white shadow-inner w-32 h-32 flex items-center justify-center overflow-hidden">
                                    {user.profileImage ? (
                                        <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <User className="text-gray-300" size={64} />
                                    )}
                                </div>
                            </div>
                            <div className="text-center mt-3">
                                <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
                                <p className="text-gray-500 font-medium">{user.course || user.department}</p>
                            </div>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">Academic Info</h3>
                                    <div className="space-y-5">
                                        <div className="flex items-center gap-4">
                                            <div className="bg-gray-50 p-2 rounded-lg text-gray-400">
                                                <User size={20} />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 uppercase tracking-wide">Gender</p>
                                                <p className="font-semibold text-gray-900">{user.gender || 'Not Specified'}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="bg-gray-50 p-2 rounded-lg text-gray-400">
                                                <Hash size={20} />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 uppercase tracking-wide">Registration Number</p>
                                                <p className="font-semibold text-gray-900 font-mono text-lg">{user.regNo}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="bg-gray-50 p-2 rounded-lg text-gray-400">
                                                <Book size={20} />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 uppercase tracking-wide">Department</p>
                                                <p className="font-semibold text-gray-900">{user.department}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="bg-gray-50 p-2 rounded-lg text-gray-400">
                                                <Calendar size={20} />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 uppercase tracking-wide">Year of Study</p>
                                                <p className="font-semibold text-gray-900">{user.year}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">Contact Info</h3>
                                    <div className="space-y-5">
                                        <div className="flex items-center gap-4">
                                            <div className="bg-gray-50 p-2 rounded-lg text-gray-400">
                                                <Mail size={20} />
                                            </div>
                                            <div className="overflow-hidden">
                                                <p className="text-xs text-gray-500 uppercase tracking-wide">Email Address</p>
                                                <p className="font-semibold text-gray-900 break-all">{user.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="bg-gray-50 p-2 rounded-lg text-gray-400">
                                                <Phone size={20} />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 uppercase tracking-wide">Phone Number</p>
                                                <p className="font-semibold text-gray-900">{user.phone}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-4">
                                            <div className="bg-gray-50 p-2 rounded-lg text-gray-400 mt-1">
                                                <Home size={20} />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 uppercase tracking-wide">Parent/Guardian</p>
                                                <p className="font-semibold text-gray-900">{user.parentName}</p>
                                                <p className="text-sm text-gray-500 mt-0.5">{user.parentPhone}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Room Info */}
                        <div className="mt-8 pt-6 border-t border-gray-100">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Allocation Details</h3>
                            <div className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-6 border border-gray-200">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Hostel Block</p>
                                        <p className="font-bold text-gray-900 text-lg">{user.hostelName || "Not Allocated"}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Room Number</p>
                                        <p className="font-bold text-[#991B1B] text-lg">{user.roomNumber || "-"}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentProfile;
