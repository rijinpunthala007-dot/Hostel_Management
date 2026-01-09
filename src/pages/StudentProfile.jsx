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
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    {/* Header Background */}
                    <div className="h-32 bg-[#991B1B]"></div>

                    {/* Profile Header */}
                    <div className="px-8 pb-8">
                        <div className="relative flex flex-col sm:flex-row justify-center sm:justify-between items-center sm:items-end -mt-12 mb-6 gap-4">
                            <div className="bg-white p-1.5 rounded-full">
                                <div className="bg-gray-100 rounded-full border-4 border-white shadow-md w-32 h-32 flex items-center justify-center overflow-hidden">
                                    {user.profileImage ? (
                                        <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <User className="text-gray-400" size={64} />
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
                            <p className="text-gray-500 font-medium">{user.course || user.department}</p>

                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Academic Info</h3>
                                    <div className="space-y-4">
                                        <div className="flex items-start gap-3">
                                            <User className="text-gray-400 mt-0.5" size={18} />
                                            <div>
                                                <p className="text-sm text-gray-500">Gender</p>
                                                <p className="font-medium text-gray-900">{user.gender || 'Not Specified'}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <Hash className="text-gray-400 mt-0.5" size={18} />
                                            <div>
                                                <p className="text-sm text-gray-500">Registration Number</p>
                                                <p className="font-medium text-gray-900">{user.regNo}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <Book className="text-gray-400 mt-0.5" size={18} />
                                            <div>
                                                <p className="text-sm text-gray-500">Department</p>
                                                <p className="font-medium text-gray-900">{user.department}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <Calendar className="text-gray-400 mt-0.5" size={18} />
                                            <div>
                                                <p className="text-sm text-gray-500">Year of Study</p>
                                                <p className="font-medium text-gray-900">{user.year}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Contact Info</h3>
                                    <div className="space-y-4">
                                        <div className="flex items-start gap-3">
                                            <Mail className="text-gray-400 mt-0.5" size={18} />
                                            <div>
                                                <p className="text-sm text-gray-500">Email Address</p>
                                                <p className="font-medium text-gray-900">{user.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <Phone className="text-gray-400 mt-0.5" size={18} />
                                            <div>
                                                <p className="text-sm text-gray-500">Phone Number</p>
                                                <p className="font-medium text-gray-900">{user.phone}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <Home className="text-gray-400 mt-0.5" size={18} />
                                            <div>
                                                <p className="text-sm text-gray-500">Parent/Guardian</p>
                                                <p className="font-medium text-gray-900">{user.parentName}</p>
                                                <p className="text-sm text-gray-500">{user.parentPhone}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Room Info */}
                        <div className="mt-8 pt-6 border-t border-gray-100">
                            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Allocation Details</h3>
                            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-500">Hostel Block</p>
                                        <p className="font-medium text-gray-900">{user.hostelName || "Not Allocated"}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Room Number</p>
                                        <p className="font-medium text-gray-900">{user.roomNumber || "-"}</p>
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
