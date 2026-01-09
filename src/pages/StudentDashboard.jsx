import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogOut, Home, User, Wallet, BedDouble, Utensils, AlertCircle, Coffee, CalendarCheck, FilePlus, Bell, FileText, CheckCircle } from 'lucide-react';
import { userData, announcements } from '../mockData';

const StudentDashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = React.useState(userData);
    const [notices, setNotices] = React.useState(announcements);
    const [rejectedRequest, setRejectedRequest] = React.useState(null);
    const [approvedRequest, setApprovedRequest] = React.useState(null);
    const [leaveNotification, setLeaveNotification] = React.useState(null);

    React.useEffect(() => {
        const storedUser = localStorage.getItem('userData');
        let currentUser = user;
        if (storedUser) {
            currentUser = JSON.parse(storedUser);
            setUser(currentUser);
        }

        const storedNotices = localStorage.getItem('announcements');
        if (storedNotices) {
            setNotices(JSON.parse(storedNotices));
        }

        const storedRequests = localStorage.getItem('hostelChangeRequests');
        if (storedRequests) {
            const requests = JSON.parse(storedRequests);
            // Check for Rejections
            const rejection = requests.find(r =>
                (r.studentName === currentUser.name || r.regNo === currentUser.regNo) &&
                r.status === 'Rejected'
            );
            if (rejection) {
                setRejectedRequest(rejection);
            }

            // Check for Approvals (that haven't been seen/dismissed)
            const approval = requests.find(r =>
                (r.studentName === currentUser.name || r.regNo === currentUser.regNo) &&
                r.status === 'Approved'
            );
            if (approval) {
                setApprovedRequest(approval);

                // Force reload user data from localStorage
                const updatedStoredUser = localStorage.getItem('userData');
                let newUser = user;
                if (updatedStoredUser) {
                    newUser = JSON.parse(updatedStoredUser);
                }

                // FAIL-SAFE: If the storage hasn't updated yet (or failed), overwrite with approval details
                if (newUser.hostelName !== approval.requestedHostel) {
                    newUser = {
                        ...newUser,
                        hostelName: approval.requestedHostel,
                        roomNumber: "Allocated",
                        roomType: "Pending",
                        status: 'Allocated'
                    };
                    // Optional: Self-correct localStorage
                    localStorage.setItem('userData', JSON.stringify(newUser));
                }

                setUser(newUser);
            }
        }

        const storedLeaves = localStorage.getItem('leaveRequests');
        if (storedLeaves) {
            const leaves = JSON.parse(storedLeaves);
            const updatedLeave = leaves.find(l =>
                (l.studentName === currentUser.name || l.regNo === currentUser.regNo) &&
                (l.status === 'Approved' || l.status === 'Rejected')
            );
            if (updatedLeave) {
                setLeaveNotification(updatedLeave);
            }
        }
    }, []);

    const dismissNotification = (type) => {
        const storedRequests = localStorage.getItem('hostelChangeRequests');
        const storedLeaves = localStorage.getItem('leaveRequests');

        let requests = [];
        let leaves = [];

        if (storedRequests) requests = JSON.parse(storedRequests);
        if (storedLeaves) leaves = JSON.parse(storedLeaves);

        if (type === 'rejected' && rejectedRequest) {
            const updated = requests.map(r => r.id === rejectedRequest.id ? { ...r, status: 'RejectedSeen' } : r);
            localStorage.setItem('hostelChangeRequests', JSON.stringify(updated));
            setRejectedRequest(null);
        } else if (type === 'approved' && approvedRequest) {
            const updated = requests.map(r => r.id === approvedRequest.id ? { ...r, status: 'ApprovedSeen' } : r);
            localStorage.setItem('hostelChangeRequests', JSON.stringify(updated));
            setApprovedRequest(null);
        } else if (type === 'leave' && leaveNotification) {
            const updated = leaves.map(l => l.id === leaveNotification.id ? { ...l, status: l.status + 'Seen' } : l);
            localStorage.setItem('leaveRequests', JSON.stringify(updated));
            setLeaveNotification(null);
        }
    };

    // Auto-dismiss notifications
    React.useEffect(() => {
        if (rejectedRequest) {
            const timer = setTimeout(() => {
                dismissNotification('rejected');
            }, 6000);
            return () => clearTimeout(timer);
        }
    }, [rejectedRequest]);

    React.useEffect(() => {
        if (approvedRequest) {
            const timer = setTimeout(() => {
                dismissNotification('approved');
            }, 6000);
            return () => clearTimeout(timer);
        }
    }, [approvedRequest]);

    React.useEffect(() => {
        if (leaveNotification) {
            const timer = setTimeout(() => {
                dismissNotification('leave');
            }, 6000);
            return () => clearTimeout(timer);
        }
    }, [leaveNotification]);

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
                {/* Notifications */}
                {rejectedRequest && (
                    <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg relative flex items-start gap-3 shadow-sm animate-fade-in">
                        <AlertCircle className="shrink-0 mt-0.5" size={20} />
                        <div className="flex-1">
                            <strong className="font-bold block">Transfer Request Rejected</strong>
                            <span className="block sm:inline text-sm mt-1">
                                Your request to transfer to <strong>{rejectedRequest.requestedHostel}</strong> has been rejected.
                            </span>
                        </div>
                        <button
                            onClick={() => dismissNotification('rejected')}
                            className="absolute top-0 bottom-0 right-0 px-4 py-3 text-red-700 hover:text-red-900 transition-colors"
                        >
                            <span className="sr-only">Dismiss</span>
                            <svg className="fill-current h-6 w-6" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                <title>Close</title>
                                <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
                            </svg>
                        </button>
                    </div>
                )}

                {approvedRequest && (
                    <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg relative flex items-start gap-3 shadow-sm animate-fade-in">
                        <CheckCircle className="shrink-0 mt-0.5" size={20} />
                        <div className="flex-1">
                            <strong className="font-bold block">Transfer Request Approved!</strong>
                            <span className="block sm:inline text-sm mt-1">
                                Your request to transfer to <strong>{approvedRequest.requestedHostel}</strong> has been approved. Your hostel allocation has been updated.
                            </span>
                        </div>
                        <button
                            onClick={() => dismissNotification('approved')}
                            className="absolute top-0 bottom-0 right-0 px-4 py-3 text-green-700 hover:text-green-900 transition-colors"
                        >
                            <span className="sr-only">Dismiss</span>
                            <svg className="fill-current h-6 w-6" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                <title>Close</title>
                                <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
                            </svg>
                        </button>
                    </div>
                )}

                {leaveNotification && (
                    <div className={`mb-6 px-4 py-3 rounded-lg relative flex items-start gap-3 shadow-sm animate-fade-in border ${leaveNotification.status === 'Approved'
                        ? 'bg-green-50 border-green-200 text-green-700'
                        : 'bg-red-50 border-red-200 text-red-700'
                        }`}>
                        {leaveNotification.status === 'Approved' ? <CheckCircle className="shrink-0 mt-0.5" size={20} /> : <AlertCircle className="shrink-0 mt-0.5" size={20} />}
                        <div className="flex-1">
                            <strong className="font-bold block">Leave Request {leaveNotification.status}</strong>
                            <span className="block sm:inline text-sm mt-1">
                                Your <strong>{leaveNotification.type}</strong> leave request from <strong>{leaveNotification.from}</strong> to <strong>{leaveNotification.to}</strong> has been {leaveNotification.status.toLowerCase()}.
                            </span>
                        </div>
                        <button
                            onClick={() => dismissNotification('leave')}
                            className={`absolute top-0 bottom-0 right-0 px-4 py-3 transition-colors ${leaveNotification.status === 'Approved' ? 'text-green-700 hover:text-green-900' : 'text-red-700 hover:text-red-900'
                                }`}
                        >
                            <span className="sr-only">Dismiss</span>
                            <svg className="fill-current h-6 w-6" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                <title>Close</title>
                                <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
                            </svg>
                        </button>
                    </div>
                )}

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
