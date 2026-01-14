import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Users, Home, ClipboardList, BedDouble, Utensils, Bell, AlertCircle, Search, Plus, Trash2, Edit, Save, X, Calendar, CheckCircle, XCircle, Menu, ArrowRightLeft, UserPlus, User } from 'lucide-react';
import { allStudents, complaints, hostels, announcements as initialAnnouncements, menuData } from '../mockData';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // State for interactive features
    const [students, setStudents] = useState(() => {
        const saved = localStorage.getItem('studentList');
        return saved ? JSON.parse(saved) : allStudents;
    });
    const [hostelList, setHostelList] = useState(() => {
        const saved = localStorage.getItem('hostelData');
        return saved ? JSON.parse(saved) : hostels;
    });

    React.useEffect(() => {
        localStorage.setItem('hostelData', JSON.stringify(hostelList));
    }, [hostelList]);
    const [noticeList, setNoticeList] = useState(() => {
        const saved = localStorage.getItem('announcements');
        return saved ? JSON.parse(saved) : initialAnnouncements;
    });
    const [complaintList, setComplaintList] = useState(() => {
        const saved = localStorage.getItem('complaintList');
        return saved ? JSON.parse(saved) : complaints;
    });

    React.useEffect(() => {
        localStorage.setItem('complaintList', JSON.stringify(complaintList));
    }, [complaintList]);

    React.useEffect(() => {
        localStorage.setItem('studentList', JSON.stringify(students));
    }, [students]);
    const [menu, setMenu] = useState(() => {
        const saved = localStorage.getItem('foodMenu');
        return saved ? JSON.parse(saved) : menuData;
    });
    const [leaveRequests, setLeaveRequests] = useState([]);
    const [changeRequests, setChangeRequests] = useState([]);

    // Load change requests
    React.useEffect(() => {
        const saved = localStorage.getItem('hostelChangeRequests');
        if (saved) {
            setChangeRequests(JSON.parse(saved));
        }
    }, []);

    const handleChangeRequestAction = (id, action) => {
        const updatedRequests = changeRequests.map(req => {
            if (req.id === id) {
                return { ...req, status: action };
            }
            return req;
        });

        const request = changeRequests.find(r => r.id === id);

        if (action === 'Approved') {
            // Handle New Allocation (Add to Student List)
            // Handle New Allocation (Update Student List)
            if (request && request.type === 'Allocation') {
                const existingStudentIndex = students.findIndex(s => s.regNo === request.regNo);

                if (existingStudentIndex !== -1) {
                    // Update existing student
                    const updatedStudents = [...students];
                    updatedStudents[existingStudentIndex] = {
                        ...updatedStudents[existingStudentIndex],
                        hostel: request.requestedHostel,
                        room: "Allocated", // In real app, assign specific room
                        status: 'Active',
                        feeDue: 0
                    };
                    setStudents(updatedStudents);
                } else {
                    // Create new student (fallback)
                    const newStudent = {
                        id: students.length + 1,
                        name: request.studentName,
                        regNo: request.regNo,
                        department: request.studentDetails?.department || 'N/A',
                        year: request.studentDetails?.year || '1st Year',
                        email: request.studentDetails?.email || 'N/A',
                        phone: request.studentDetails?.phone || 'N/A',
                        parentName: request.studentDetails?.parentName || 'N/A',
                        parentPhone: request.studentDetails?.parentPhone || 'N/A',
                        hostel: request.requestedHostel,
                        room: "Allocated",
                        status: 'Active',
                        feeDue: 0
                    };
                    setStudents([...students, newStudent]);
                }
            }

            // Update User Data in Local Storage (simulating DB update for the logged in user)
            const storedUser = localStorage.getItem('userData');
            if (storedUser) {
                const user = JSON.parse(storedUser);
                // Only update if this request matches the logged in user (mock logic)
                if (user.name === request.studentName || true) { // Simulating for current user
                    user.hostelName = request.requestedHostel;
                    user.roomNumber = "Allocated"; // Reset room
                    user.roomType = "Pending"; // Reset type
                    user.status = 'Allocated'; // Update status
                    localStorage.setItem('userData', JSON.stringify(user));
                }
            }

            // Update Hostel Occupancy
            const updatedHostels = hostelList.map(h => {
                if (h.name === request.requestedHostel) {
                    return {
                        ...h,
                        availableRooms: Math.max(0, h.availableRooms - 1),
                        availableBeds: Math.max(0, h.availableBeds - 1)
                    };
                }
                return h;
            });
            setHostelList(updatedHostels);
        } else if (action === 'Rejected') {
            // Revert User Data Status
            const storedUser = localStorage.getItem('userData');
            if (storedUser) {
                const user = JSON.parse(storedUser);
                // Only update if this request matches the logged in user
                if (user.name === request.studentName || true) { // Simulating for current user
                    if (request.type === 'Allocation') {
                        user.status = 'Pending_Hostel'; // Revert to initial state
                        user.hostelName = null; // Clear pending allocation
                    } else {
                        user.status = 'Active'; // Revert to active state
                        // currentHostel should already be correct, but just to be safe:
                        user.hostelName = request.currentHostel;
                    }
                    localStorage.setItem('userData', JSON.stringify(user));
                }
            }
        }

        setChangeRequests(updatedRequests);
        localStorage.setItem('hostelChangeRequests', JSON.stringify(updatedRequests));
    };

    // Load leave requests from localStorage
    React.useEffect(() => {
        const saved = localStorage.getItem('leaveRequests');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                // Filter out legacy trial data (IDs 1 and 2 for Rahul Kumar)
                const cleaned = parsed.filter(req => !(req.id === 1 || req.id === 2));

                // If data was cleaned, update storage
                if (cleaned.length !== parsed.length) {
                    localStorage.setItem('leaveRequests', JSON.stringify(cleaned));
                }

                setLeaveRequests(cleaned);
            } catch (e) {
                console.error("Failed to parse leave requests", e);
            }
        }
    }, []);

    const handleLeaveAction = (id, newStatus) => {
        const updatedRequests = leaveRequests.map(req =>
            req.id === id ? { ...req, status: newStatus } : req
        );
        setLeaveRequests(updatedRequests);
        localStorage.setItem('leaveRequests', JSON.stringify(updatedRequests));
    };

    // Modal States
    const [showStudentModal, setShowStudentModal] = useState(false);
    const [editingStudent, setEditingStudent] = useState(null);
    const [showHostelModal, setShowHostelModal] = useState(false);
    const [editingHostel, setEditingHostel] = useState(null);
    const [showNoticeModal, setShowNoticeModal] = useState(false);
    const [showApplicantModal, setShowApplicantModal] = useState(false);
    const [selectedApplicant, setSelectedApplicant] = useState(null);

    // Handlers
    const handleDeleteStudent = (id) => {
        const student = students.find(s => s.id === id);
        if (window.confirm(`Are you sure you want to remove ${student ? student.name : 'this student'}?`)) {
            setStudents(students.filter(s => s.id !== id));
        }
    };

    const handleEditStudent = (student) => {
        setEditingStudent(student);
        setShowStudentModal(true);
    };

    const handleAddStudentClick = () => {
        setEditingStudent(null);
        setShowStudentModal(true);
    };

    const handleDeleteHostel = (id) => {
        if (window.confirm('Are you sure you want to remove this hostel?')) {
            setHostelList(hostelList.filter(h => h.id !== id));
        }
    };

    const handleEditHostel = (hostel) => {
        setEditingHostel(hostel);
        setShowHostelModal(true);
    };

    const handleAddHostelClick = () => {
        setEditingHostel(null);
        setShowHostelModal(true);
    };

    const handleDeleteNotice = (id) => {
        if (window.confirm('Delete this notice?')) {
            const updated = noticeList.filter(n => n.id !== id);
            setNoticeList(updated);
            localStorage.setItem('announcements', JSON.stringify(updated));
        }
    };

    const handleSaveMenu = () => {
        localStorage.setItem('foodMenu', JSON.stringify(menu));
        alert('Food menu updated successfully!');
    };

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: Home },
        { id: 'admissions', label: 'Admissions & Transfers', icon: ArrowRightLeft },
        { id: 'students', label: 'Manage Students', icon: Users },
        { id: 'hostels', label: 'Manage Hostels', icon: BedDouble },
        { id: 'food', label: 'Food Menu', icon: Utensils },
        { id: 'complaints', label: 'Complaints', icon: AlertCircle },
        { id: 'leaves', label: 'Leave Requests', icon: Calendar },
        { id: 'notices', label: 'Notice Board', icon: Bell },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return <DashboardHome students={students} hostels={hostelList} complaints={complaintList} leaveRequests={leaveRequests} />;
            case 'students':
                return <StudentList students={students} hostels={hostelList} onDelete={handleDeleteStudent} onEdit={handleEditStudent} onAdd={handleAddStudentClick} />;
            case 'hostels':
                return <HostelManage hostels={hostelList} onDelete={handleDeleteHostel} onEdit={handleEditHostel} onAdd={handleAddHostelClick} />;
            case 'complaints':
                return <ComplaintList complaints={complaintList} setComplaints={setComplaintList} />;
            case 'food':
                return <FoodMenuManage menu={menu} setMenu={setMenu} onSave={handleSaveMenu} />;
            case 'leaves':
                return <LeaveManage requests={leaveRequests} onAction={handleLeaveAction} />;
            case 'admissions':
                return <TransferRequestList requests={changeRequests} onAction={handleChangeRequestAction} onViewDetails={(applicant) => {
                    setSelectedApplicant(applicant);
                    setShowApplicantModal(true);
                }} />;
            case 'notices':
                return <NoticeBoardManage notices={noticeList} onDelete={handleDeleteNotice} onAdd={() => setShowNoticeModal(true)} />;
            default:
                return <DashboardHome />;
        }
    };

    return (
        <div className="min-h-screen bg-[#F3F4F6] font-sans flex text-gray-800">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 fixed h-full z-10 hidden md:flex flex-col">
                <div className="p-6 border-b border-gray-100">
                    <h1 className="text-2xl font-bold text-[#991B1B] flex items-center gap-2">
                        <Home size={24} />
                        Admin Panel
                    </h1>
                </div>
                <div className="flex-1 overflow-y-auto py-4">
                    <nav className="space-y-1 px-3">
                        {menuItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${activeTab === item.id
                                    ? 'bg-red-50 text-[#991B1B]'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                            >
                                <item.icon size={20} />
                                {item.label}
                            </button>
                        ))}
                    </nav>
                </div>
                <div className="p-4 border-t border-gray-100">
                    <button
                        onClick={() => navigate('/')}
                        className="w-full flex items-center gap-2 text-gray-600 hover:text-[#991B1B] px-4 py-2 text-sm font-medium transition-colors"
                    >
                        <LogOut size={18} />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 p-4 z-20 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-600">
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                    <span className="font-bold text-[#991B1B]">Admin Panel</span>
                </div>
                <button onClick={() => navigate('/')}><LogOut size={20} /></button>
            </div>

            {/* Mobile Menu Drawer */}
            {isMobileMenuOpen && (
                <div className="md:hidden fixed inset-0 z-10 bg-black/50" onClick={() => setIsMobileMenuOpen(false)}>
                    <div className="bg-white w-64 h-full shadow-lg pt-20 px-4" onClick={e => e.stopPropagation()}>
                        <nav className="space-y-1">
                            {menuItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => {
                                        setActiveTab(item.id);
                                        setIsMobileMenuOpen(false);
                                    }}
                                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${activeTab === item.id
                                        ? 'bg-red-50 text-[#991B1B]'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                        }`}
                                >
                                    <item.icon size={20} />
                                    {item.label}
                                </button>
                            ))}
                        </nav>
                        <div className="mt-8 pt-4 border-t border-gray-100">
                            <button
                                onClick={() => navigate('/')}
                                className="w-full flex items-center gap-2 text-gray-600 hover:text-[#991B1B] px-4 py-2 text-sm font-medium transition-colors"
                            >
                                <LogOut size={18} />
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <main className="flex-1 ml-0 md:ml-64 p-8 pt-20 md:pt-8 bg-[#F3F4F6] min-h-screen">
                {renderContent()}
            </main>

            {/* Applicant Details Modal */}
            {showApplicantModal && (
                <ApplicantDetailsModal applicant={selectedApplicant} onClose={() => setShowApplicantModal(false)} />
            )}

            {/* Simulated Modals */}
            {showStudentModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in p-4">
                    <div className="bg-white p-6 rounded-lg w-full max-w-2xl shadow-xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-gray-900">{editingStudent ? `Edit Student: ${editingStudent.name}` : 'Add New Student'}</h3>
                            <button onClick={() => setShowStudentModal(false)} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
                        </div>

                        <form onSubmit={(e) => {
                            e.preventDefault();
                            const formData = new FormData(e.target);
                            const studentData = {
                                id: editingStudent ? editingStudent.id : students.length + 1,
                                name: formData.get('name'),
                                regNo: formData.get('regNo'),
                                department: formData.get('department'),
                                year: formData.get('year'),
                                email: formData.get('email'),
                                phone: formData.get('phone'),
                                parentName: formData.get('parentName'),
                                parentPhone: formData.get('parentPhone'),
                                hostel: formData.get('hostel'),
                                room: formData.get('room'),
                                status: editingStudent ? editingStudent.status : 'Active',
                                feeDue: parseInt(formData.get('feeDue')) || 0
                            };

                            if (editingStudent) {
                                setStudents(students.map(s => s.id === editingStudent.id ? studentData : s));
                                alert(`Student ${studentData.name} Updated Successfully!`);
                            } else {
                                setStudents([...students, studentData]);
                                alert('Student Added Successfully!');
                            }
                            setShowStudentModal(false);
                        }}>
                            <div className="space-y-6">
                                {/* Academic Info */}
                                <div>
                                    <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3 border-b pb-1">Academic Info</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                            <input required name="name" defaultValue={editingStudent?.name} type="text" className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-[#991B1B] outline-none" placeholder="e.g. Rahul Kumar" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Registration Number</label>
                                            <input required name="regNo" defaultValue={editingStudent?.regNo} type="text" className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-[#991B1B] outline-none" placeholder="e.g. CS2023001" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                                            <select name="department" defaultValue={editingStudent?.department} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-[#991B1B] outline-none">
                                                <option>Computer Science</option>
                                                <option>Mechanical</option>
                                                <option>Electrical</option>
                                                <option>Civil</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Year of Study</label>
                                            <select name="year" defaultValue={editingStudent?.year} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-[#991B1B] outline-none">
                                                <option>1st Year</option>
                                                <option>2nd Year</option>
                                                <option>3rd Year</option>
                                                <option>4th Year</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* Contact Info */}
                                <div>
                                    <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3 border-b pb-1">Contact Info</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                            <input required name="email" defaultValue={editingStudent?.email} type="email" className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-[#991B1B] outline-none" placeholder="student@example.com" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                            <input required name="phone" defaultValue={editingStudent?.phone} type="tel" className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-[#991B1B] outline-none" placeholder="+91 98765 43210" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Parent/Guardian Name</label>
                                            <input required name="parentName" defaultValue={editingStudent?.parentName} type="text" className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-[#991B1B] outline-none" placeholder="Guardian Name" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Parent Phone</label>
                                            <input required name="parentPhone" defaultValue={editingStudent?.parentPhone} type="tel" className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-[#991B1B] outline-none" placeholder="Parent Phone" />
                                        </div>
                                    </div>
                                </div>

                                {/* Allocation Info */}
                                <div>
                                    <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3 border-b pb-1">Allocation</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Hostel</label>
                                            <select name="hostel" defaultValue={editingStudent?.hostel} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-[#991B1B] outline-none">
                                                <option value="">Not Allocated</option>
                                                {hostels.map(h => <option key={h.id} value={h.name}>{h.name}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Room Number</label>
                                            <input name="room" defaultValue={editingStudent?.room} type="text" className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-[#991B1B] outline-none" placeholder="e.g. 101" />
                                        </div>
                                    </div>
                                </div>

                                {/* Fee Info */}
                                <div>
                                    <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3 border-b pb-1">Fee Details</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Fee Due (₹)</label>
                                            <input name="feeDue" defaultValue={editingStudent?.feeDue} type="number" className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-[#991B1B] outline-none" placeholder="0" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-100">
                                <button type="button" onClick={() => setShowStudentModal(false)} className="px-5 py-2.5 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium transition-colors">Cancel</button>
                                <button type="submit" className="px-5 py-2.5 bg-[#991B1B] text-white rounded-lg text-sm font-medium hover:bg-red-800 transition-colors shadow-sm">{editingStudent ? 'Update Student' : 'Add Student'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showHostelModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in p-4">
                    <div className="bg-white p-6 rounded-lg w-full max-w-lg shadow-xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-gray-900">{editingHostel ? 'Edit Hostel' : 'Add New Hostel'}</h3>
                            <button onClick={() => setShowHostelModal(false)} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
                        </div>

                        <form onSubmit={(e) => {
                            e.preventDefault();
                            const formData = new FormData(e.target);
                            const facilitiesInput = formData.get('facilities');
                            const facilitiesList = facilitiesInput ? facilitiesInput.split(',').map(f => f.trim()).filter(f => f) : [];

                            const roomImagesInput = formData.get('roomImages');
                            const roomImagesList = roomImagesInput ? roomImagesInput.split(/[\n,]/).map(f => f.trim()).filter(f => f) : [];

                            const facilityImagesInput = formData.get('facilityImages');
                            const facilityImagesList = facilityImagesInput ? facilityImagesInput.split(/[\n,]/).map(f => f.trim()).filter(f => f) : [];

                            const hostelData = {
                                id: editingHostel ? editingHostel.id : hostelList.length + 1,
                                name: formData.get('name'),
                                totalRooms: parseInt(formData.get('totalRooms')) || 0,
                                availableRooms: parseInt(formData.get('availableRooms')) || 0,
                                totalBeds: parseInt(formData.get('totalBeds')) || 0,
                                availableBeds: parseInt(formData.get('availableBeds')) || 0,
                                totalBathrooms: parseInt(formData.get('totalBathrooms')) || 0,
                                description: formData.get('description'),
                                image: formData.get('image'),
                                facilities: facilitiesList,
                                roomImages: roomImagesList,
                                facilityImages: facilityImagesList,
                                type: formData.get('type')
                            };

                            if (editingHostel) {
                                setHostelList(hostelList.map(h => h.id === editingHostel.id ? hostelData : h));
                                alert('Hostel Updated Successfully!');
                            } else {
                                setHostelList([...hostelList, hostelData]);
                                alert('Hostel Added Successfully!');
                            }
                            setShowHostelModal(false);
                        }}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Hostel Name</label>
                                    <input required name="name" defaultValue={editingHostel?.name} type="text" className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-[#991B1B] outline-none" placeholder="e.g. St. Peter's Hostel" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                                        <select name="type" defaultValue={editingHostel?.type || 'Boys'} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-[#991B1B] outline-none">
                                            <option value="Boys">Boys</option>
                                            <option value="Girls">Girls</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Total Rooms</label>
                                        <input required name="totalRooms" defaultValue={editingHostel?.totalRooms} type="number" className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-[#991B1B] outline-none" placeholder="e.g. 50" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Free Rooms</label>
                                        <input required name="availableRooms" defaultValue={editingHostel?.availableRooms} type="number" className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-[#991B1B] outline-none" placeholder="e.g. 5" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Total Beds</label>
                                        <input required name="totalBeds" defaultValue={editingHostel?.totalBeds} type="number" className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-[#991B1B] outline-none" placeholder="e.g. 100" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Free Beds</label>
                                        <input required name="availableBeds" defaultValue={editingHostel?.availableBeds} type="number" className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-[#991B1B] outline-none" placeholder="e.g. 10" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Total Bathrooms</label>
                                        <input required name="totalBathrooms" defaultValue={editingHostel?.totalBathrooms} type="number" className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-[#991B1B] outline-none" placeholder="e.g. 20" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                    <textarea name="description" defaultValue={editingHostel?.description} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-[#991B1B] outline-none" rows="3" placeholder="Brief description..."></textarea>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Hostel Photo URL</label>
                                    <input name="image" defaultValue={editingHostel?.image} type="text" className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-[#991B1B] outline-none" placeholder="https://example.com/image.jpg" />
                                </div>
                                <div>
                                    <input name="facilities" defaultValue={editingHostel?.facilities?.join(', ')} type="text" className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-[#991B1B] outline-none" placeholder="WiFi, Gym, Study Hall..." />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Room Photos (Ref Links)</label>
                                    <textarea name="roomImages" defaultValue={editingHostel?.roomImages?.join(',\n')} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-[#991B1B] outline-none" rows="3" placeholder="https://example.com/room1.jpg,&#10;https://example.com/room2.jpg"></textarea>
                                    <p className="text-xs text-gray-500 mt-1">Separate multiple URLs with commas</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Facility Photos (Ref Links)</label>
                                    <textarea name="facilityImages" defaultValue={editingHostel?.facilityImages?.join(',\n')} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-[#991B1B] outline-none" rows="3" placeholder="https://example.com/gym.jpg,&#10;https://example.com/library.jpg"></textarea>
                                    <p className="text-xs text-gray-500 mt-1">Separate multiple URLs with commas</p>
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-100">
                                <button type="button" onClick={() => setShowHostelModal(false)} className="px-5 py-2.5 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium transition-colors">Cancel</button>
                                <button type="submit" className="px-5 py-2.5 bg-[#991B1B] text-white rounded-lg text-sm font-medium hover:bg-red-800 transition-colors shadow-sm">{editingHostel ? 'Update Hostel' : 'Add Hostel'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showNoticeModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in p-4">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-xl">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold">Post New Notice</h3>
                            <button onClick={() => setShowNoticeModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
                        </div>
                        <p className="text-sm text-gray-500 mb-6">Create a new announcement for students.</p>
                        <div className="space-y-3">
                            <input type="text" placeholder="Title" className="w-full border rounded p-2 text-sm" />
                            <textarea placeholder="Description" rows="3" className="w-full border rounded p-2 text-sm"></textarea>
                        </div>
                        <div className="flex justify-end gap-2 mt-6">
                            <button onClick={() => setShowNoticeModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded text-sm">Cancel</button>
                            <button onClick={(e) => {
                                // Find inputs relative to the button
                                const container = e.target.closest('.bg-white');
                                const title = container.querySelector('input').value;
                                const desc = container.querySelector('textarea').value;

                                if (title && desc) {
                                    const newNotice = {
                                        id: Date.now(),
                                        title,
                                        desc,
                                        date: new Date().toLocaleDateString()
                                    };
                                    const updated = [newNotice, ...noticeList];
                                    setNoticeList(updated);
                                    localStorage.setItem('announcements', JSON.stringify(updated));
                                    alert('Notice Posted Successfully!');
                                    setShowNoticeModal(false);
                                } else {
                                    alert('Please fill in all fields');
                                }
                            }} className="px-4 py-2 bg-[#991B1B] text-white rounded text-sm font-medium">Post Notice</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Sub-Components

const DashboardHome = ({ students, hostels, complaints, leaveRequests = [] }) => {
    const stats = [
        { label: "Pending Leaves", value: leaveRequests.filter(r => r.status === 'Pending').length, icon: Calendar, color: "bg-orange-50", text: "text-orange-600" },
        { label: "Total Hostels", value: hostels.length, icon: Home, color: "bg-blue-50", text: "text-blue-600" },
        { label: "Active Students", value: students.length, icon: Users, color: "bg-purple-50", text: "text-purple-600" },
        { label: "Open Complaints", value: complaints.filter(c => c.status === 'Pending').length, icon: AlertCircle, color: "bg-red-50", text: "text-red-600" },
    ];

    const getOccupancyColor = (percentage) => {
        if (percentage >= 80) return 'bg-red-600';
        if (percentage >= 50) return 'bg-orange-500';
        return 'bg-green-500';
    };

    return (
        <div className="animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center justify-between cursor-pointer hover:shadow-md transition-shadow">
                        <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">{stat.label}</p>
                            <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                        </div>
                        <div className={`${stat.color} p-3 rounded-full`}>
                            <stat.icon className={stat.text} size={24} />
                        </div>
                    </div>
                ))}
            </div>
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 max-w-3xl">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Hostel Occupancy Levels</h3>
                <div className="space-y-6">
                    {hostels.map((hostel) => {
                        const occupied = hostel.totalRooms - hostel.availableRooms;
                        const percentage = Math.round((occupied / hostel.totalRooms) * 100);
                        return (
                            <div key={hostel.id}>
                                <div className="flex justify-between items-end mb-2">
                                    <span className="font-medium text-gray-700">{hostel.name}</span>
                                    <span className="text-sm font-bold text-gray-900">{percentage}% Filled</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-3">
                                    <div
                                        className={`${getOccupancyColor(percentage)} h-3 rounded-full transition-all duration-500`}
                                        style={{ width: `${percentage}%` }}
                                    ></div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

const StudentList = ({ students, hostels, onDelete, onAdd, onEdit }) => {
    const [selectedHostel, setSelectedHostel] = React.useState('');
    const [searchTerm, setSearchTerm] = React.useState('');

    const filteredStudents = students.filter(student => {
        const matchesHostel = selectedHostel ? student.hostel === selectedHostel : true;
        const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.regNo.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesHostel && matchesSearch;
    });

    return (
        <div className="animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Manage Students</h2>
                <button onClick={onAdd} className="w-full md:w-auto bg-[#991B1B] text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 text-sm font-medium hover:bg-red-800 transition-colors shadow-sm">
                    <Plus size={18} /> Add Student
                </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search students..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#991B1B]"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <select
                        className="px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white cursor-pointer hover:bg-gray-50"
                        value={selectedHostel}
                        onChange={(e) => setSelectedHostel(e.target.value)}
                    >
                        <option value="">All Hostels</option>
                        {hostels.map(h => (
                            <option key={h.id} value={h.name}>{h.name}</option>
                        ))}
                    </select>
                </div>
                {/* Mobile Card View */}
                <div className="md:hidden divide-y divide-gray-100">
                    {filteredStudents.length > 0 ? (
                        filteredStudents.map(student => (
                            <div key={student.id} className="p-4 flex flex-col gap-3 bg-white">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-semibold text-gray-900">{student.name}</h3>
                                        <p className="text-sm text-gray-500 font-mono">{student.regNo}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => onEdit(student)} className="p-2 text-blue-600 bg-blue-50 rounded-full" title="Edit"><Edit size={16} /></button>
                                        <button onClick={() => onDelete(student.id)} className="p-2 text-red-600 bg-red-50 rounded-full" title="Delete"><Trash2 size={16} /></button>
                                    </div>
                                </div>
                                <div className="space-y-2 text-sm mt-2 bg-gray-50 p-3 rounded-lg">
                                    <div className="flex justify-between border-b border-gray-200 pb-2">
                                        <span className="text-gray-500">Hostel:</span>
                                        <span className="text-gray-900 font-medium text-right">{student.hostel}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-gray-200 pb-2">
                                        <span className="text-gray-500">Room:</span>
                                        <span className="text-gray-900 font-medium">{student.room}</span>
                                    </div>
                                    <div className="flex justify-between items-center pt-1">
                                        <span className="text-gray-500">Fee Status:</span>
                                        <div>
                                            {student.feeDue > 0 ? (
                                                <span className="inline-block bg-red-100 text-red-700 px-2 py-0.5 rounded text-xs font-medium">
                                                    Due: ₹{student.feeDue}
                                                </span>
                                            ) : (
                                                <span className="inline-block bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-medium">
                                                    Paid
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-8 text-center text-gray-500">
                            No students found matching your criteria.
                        </div>
                    )}
                </div>

                {/* Desktop Table View */}
                < div className="hidden md:block overflow-x-auto" >
                    <table className="w-full text-left text-sm text-gray-600">
                        <thead className="bg-gray-50 text-gray-900 font-medium">
                            <tr>
                                <th className="px-6 py-3 whitespace-nowrap">Name</th>
                                <th className="px-6 py-3 whitespace-nowrap">Reg. No</th>
                                <th className="px-6 py-3 whitespace-nowrap">Hostel</th>
                                <th className="px-6 py-3 whitespace-nowrap">Room</th>
                                <th className="px-6 py-3 whitespace-nowrap">Fee Status</th>
                                <th className="px-6 py-3 text-right whitespace-nowrap">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredStudents.length > 0 ? (
                                filteredStudents.map(student => (
                                    <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{student.name}</td>
                                        <td className="px-6 py-4 font-mono whitespace-nowrap">{student.regNo}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{student.hostel}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{student.room}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {student.feeDue > 0 ? (
                                                <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-medium">
                                                    Due: ₹{student.feeDue}
                                                </span>
                                            ) : (
                                                <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-medium">
                                                    Paid
                                                </span>
                                            )}
                                        </td>

                                        <td className="px-6 py-4 text-right flex justify-end gap-2 whitespace-nowrap">
                                            <button onClick={() => onEdit(student)} className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Edit"><Edit size={16} /></button>
                                            <button onClick={() => onDelete(student.id)} className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors" title="Delete"><Trash2 size={16} /></button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                                        No students found matching your criteria.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const HostelManage = ({ hostels, onDelete, onAdd, onEdit }) => (
    <div className="animate-fade-in">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Manage Hostels</h2>
            <button onClick={onAdd} className="bg-[#991B1B] text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium hover:bg-red-800 transition-colors">
                <Plus size={18} /> Add Hostel
            </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hostels.map(hostel => (
                <div key={hostel.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-red-50 rounded-lg text-[#991B1B]">
                            <BedDouble size={24} />
                        </div>
                        <div className="flex gap-1">
                            <button onClick={() => onEdit(hostel)} className="p-1.5 text-gray-400 hover:text-blue-600 rounded-md hover:bg-blue-50 transition-colors"><Edit size={16} /></button>
                            <button onClick={() => onDelete(hostel.id)} className="p-1.5 text-gray-400 hover:text-red-600 rounded-md hover:bg-red-50 transition-colors"><Trash2 size={16} /></button>
                        </div>
                    </div>
                    {hostel.image && (
                        <img src={hostel.image} alt={hostel.name} className="w-full h-32 object-cover rounded-md mb-4" />
                    )}
                    <h3 className="text-lg font-bold text-gray-900">{hostel.name}</h3>
                    <p className="text-gray-500 text-sm mb-4 line-clamp-2">{hostel.description}</p>

                    {hostel.facilities && hostel.facilities.length > 0 && (
                        <div className="mb-4 flex flex-wrap gap-2">
                            {hostel.facilities.map((facility, index) => (
                                <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
                                    {facility}
                                </span>
                            ))}
                        </div>
                    )}

                    <div className="space-y-2 mt-4 pt-4 border-t border-gray-100">
                        <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Rooms:</span>
                                <span className="font-medium text-gray-900">{hostel.totalRooms}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Free Rooms:</span>
                                <span className={`font-medium ${hostel.availableRooms > 0 ? 'text-green-600' : 'text-red-500'}`}>{hostel.availableRooms}</span>
                            </div>

                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Beds:</span>
                                <span className="font-medium text-gray-900">{hostel.totalBeds || '-'}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Free Beds:</span>
                                <span className={`font-medium ${hostel.availableBeds > 0 ? 'text-green-600' : 'text-red-500'}`}>{hostel.availableBeds || '-'}</span>
                            </div>

                            <div className="flex justify-between text-sm col-span-2">
                                <span className="text-gray-500">Bathrooms:</span>
                                <span className="font-medium text-gray-900">{hostel.totalBathrooms || '-'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const ComplaintList = ({ complaints, setComplaints }) => {
    const [selectedImage, setSelectedImage] = React.useState(null);

    return (
        <div className="animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Student Complaints</h2>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 grid gap-6">
                    {complaints.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">No complaints found.</p>
                    ) : (
                        complaints.map(complaint => (
                            <div key={complaint.id} className="flex flex-col sm:flex-row gap-4 p-4 border border-gray-100 rounded-lg bg-gray-50/50 hover:bg-white transition-colors">
                                <div className="flex-1">
                                    <div className="flex justify-between mb-2">
                                        <span className={`text-xs px-2 py-1 rounded font-medium ${complaint.status === 'Resolved' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                                            }`}>{complaint.type}</span>
                                        <span className="text-gray-400 text-xs">{complaint.date}</span>
                                    </div>
                                    <h4 className="font-medium text-gray-900 mb-1">{complaint.desc}</h4>
                                    {complaint.image && (
                                        <div className="mb-2">
                                            <img
                                                src={complaint.image}
                                                alt="Complaint Issue"
                                                className="h-24 w-auto rounded border border-gray-200 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                                                onClick={() => setSelectedImage(complaint.image)}
                                            />
                                        </div>
                                    )}
                                    <p className="text-sm text-gray-500">Raised by: <span className="font-medium text-gray-700">{complaint.student}</span></p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <select
                                        value={complaint.status}
                                        onChange={(e) => {
                                            const newStatus = e.target.value;
                                            setComplaints(complaints.map(c => c.id === complaint.id ? { ...c, status: newStatus } : c));
                                        }}
                                        className="text-sm border-gray-200 rounded-md p-2 bg-white cursor-pointer focus:ring-2 focus:ring-[#991B1B] outline-none"
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="In Progress">In Progress</option>
                                        <option value="Resolved">Resolved</option>
                                    </select>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Image Preview Modal */}
            {selectedImage && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={() => setSelectedImage(null)}>
                    <div className="relative max-w-4xl w-full max-h-[90vh] flex items-center justify-center">
                        <button
                            className="absolute -top-10 right-0 text-white hover:text-gray-300"
                            onClick={() => setSelectedImage(null)}
                        >
                            <X size={24} />
                        </button>
                        <img
                            src={selectedImage}
                            alt="Full Preview"
                            className="max-w-full max-h-[90vh] rounded-lg shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

const FoodMenuManage = ({ menu, setMenu, onSave }) => (
    <div className="animate-fade-in">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Manage Food Menu</h2>
            <button onClick={onSave} className="bg-[#991B1B] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-800 transition-colors flex items-center gap-2">
                <Save size={18} />
                Save Changes
            </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(menu).map(([meal, data]) => (
                <div key={meal} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                    <h3 className="text-lg font-bold text-gray-900 capitalize mb-4 border-b pb-2">{data.title}</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1 uppercase">Items</label>
                            <textarea
                                value={data.items}
                                onChange={(e) => setMenu({
                                    ...menu,
                                    [meal]: { ...data, items: e.target.value }
                                })}
                                className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-[#991B1B] focus:border-red-500 outline-none transition-shadow"
                                rows="3"
                            />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const NoticeBoardManage = ({ notices, onDelete, onAdd }) => (
    <div className="animate-fade-in">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Notice Board</h2>
            <button onClick={onAdd} className="bg-[#991B1B] text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium hover:bg-red-800 transition-colors">
                <Plus size={18} /> Post Notice
            </button>
        </div>
        <div className="space-y-4">
            {notices.map(item => (
                <div key={item.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex justify-between items-start hover:shadow-md transition-shadow">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-bold text-gray-900">{item.title}</h3>
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{item.date}</span>
                        </div>
                        <p className="text-gray-600 text-sm">{item.desc}</p>
                    </div>
                    <button onClick={() => onDelete(item.id)} className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"><Trash2 size={18} /></button>
                </div>
            ))}
        </div>
    </div>
);

const LeaveManage = ({ requests, onAction }) => (
    <div className="animate-fade-in">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Manage Leave Requests</h2>
        {requests.length === 0 ? (
            <div className="bg-white p-8 rounded-lg shadow-sm text-center text-gray-500">
                No leave requests found.
            </div>
        ) : (
            <div className="space-y-4">
                {requests.map(req => (
                    <div key={req.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <span className={`px-2 py-1 rounded text-xs font-medium ${req.status === 'Approved' ? 'bg-green-100 text-green-700' :
                                    req.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                                        'bg-orange-100 text-orange-700'
                                    }`}>{req.status}</span>
                                <span className="text-sm text-gray-500">{req.date}</span>
                            </div>
                            <h3 className="font-bold text-gray-900">{req.type} Application</h3>
                            <p className="text-sm text-gray-600 mt-1">
                                <span className="font-medium">{req.studentName}</span> ({req.regNo})
                            </p>
                            <p className="text-sm text-gray-500 mt-2">
                                Date: {req.fromDate} to {req.toDate}
                            </p>
                            <p className="text-sm text-gray-600 mt-2 bg-gray-50 p-2 rounded">
                                Reason: {req.reason}
                            </p>
                        </div>

                        {req.status === 'Pending' && (
                            <div className="flex gap-3">
                                <button
                                    onClick={() => onAction(req.id, 'Approved')}
                                    className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                                >
                                    Approve
                                </button>
                                <button
                                    onClick={() => onAction(req.id, 'Rejected')}
                                    className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                                >
                                    Reject
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        )}
    </div>
);

const TransferRequestList = ({ requests, onAction, onViewDetails }) => {
    // Separate requests into Allocation (New) and Transfers
    const allocationRequests = requests.filter(r => r.type === 'Allocation');
    const transferRequests = requests.filter(r => r.type !== 'Allocation'); // Legacy or explicit 'Transfer'

    return (
        <div className="animate-fade-in space-y-8">
            {/* New Admissions Section */}
            <div>
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6 flex items-center gap-2">
                    <UserPlus size={24} className="text-[#991B1B]" />
                    New Admission Requests
                </h2>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="p-4 md:p-6">
                        {allocationRequests.length === 0 ? (
                            <p className="text-gray-500 text-center py-4">No new admission requests pending.</p>
                        ) : (
                            <div className="space-y-4">
                                {allocationRequests.map(req => (
                                    <div key={req.id} className="p-4 border border-gray-100 rounded-lg bg-blue-50/30 flex flex-col gap-4">
                                        <div className="w-full">
                                            <div className="flex flex-wrap justify-between items-start gap-2 mb-2">
                                                <div className="flex flex-col">
                                                    <h4 className="font-bold text-gray-900 text-lg">{req.studentName}</h4>
                                                    <span className="text-xs text-gray-500 font-mono">{req.regNo}</span>
                                                </div>
                                                <span className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${req.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                                                    req.status === 'Approved' ? 'bg-green-100 text-green-700' :
                                                        'bg-red-100 text-red-700'
                                                    }`}>
                                                    {req.status}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-600">Requested: <span className="font-bold text-[#991B1B]">{req.requestedHostel}</span></p>
                                        </div>

                                        <div className="flex flex-col sm:flex-row gap-3 pt-3 border-t border-gray-200 sm:border-0 sm:pt-0 items-stretch sm:items-center justify-between">
                                            {req.studentDetails && (
                                                <button onClick={() => onViewDetails(req.studentDetails)} className="text-sm text-blue-600 font-medium hover:text-blue-800 flex items-center gap-1">
                                                    View Info <ArrowRightLeft size={14} className="rotate-45" />
                                                </button>
                                            )}

                                            {req.status === 'Pending' && (
                                                <div className="flex gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                                                    <button onClick={() => onAction(req.id, 'Rejected')} className="flex-1 sm:flex-none bg-white border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors">Reject</button>
                                                    <button onClick={() => onAction(req.id, 'Approved')} className="flex-1 sm:flex-none bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors shadow-sm">Approve</button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Transfer Requests Section */}
            <div>
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6 flex items-center gap-2">
                    <ArrowRightLeft size={24} className="text-gray-600" />
                    Hostel Transfer Requests
                </h2>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="p-0 md:p-6">
                        {transferRequests.length === 0 ? (
                            <p className="text-gray-500 text-center py-8">No transfer requests pending.</p>
                        ) : (
                            <>
                                {/* Mobile Card View */}
                                <div className="md:hidden divide-y divide-gray-100">
                                    {transferRequests.map(req => (
                                        <div key={req.id} className="p-4 space-y-3">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <div className="font-bold text-gray-900">{req.studentName}</div>
                                                    <div className="text-xs text-gray-500 font-mono">{req.regNo}</div>
                                                </div>
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${req.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                                                    req.status === 'Approved' ? 'bg-green-100 text-green-700' :
                                                        'bg-red-100 text-red-700'
                                                    }`}>
                                                    {req.status}
                                                </span>
                                            </div>

                                            <div className="text-sm bg-gray-50 p-3 rounded-lg space-y-2">
                                                <div className="flex justify-between">
                                                    <span className="text-gray-500">Current:</span>
                                                    <span className="font-medium text-gray-900">{req.currentHostel}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-500">Requested:</span>
                                                    <span className="font-medium text-[#991B1B]">{req.requestedHostel}</span>
                                                </div>
                                                <div className="pt-2 border-t border-gray-200 mt-2">
                                                    <span className="text-gray-500 block mb-1 text-xs uppercase">Reason</span>
                                                    <p className="text-gray-700 italic">"{req.reason}"</p>
                                                </div>
                                            </div>

                                            {req.status === 'Pending' && (
                                                <div className="flex gap-2 pt-2">
                                                    <button onClick={() => onAction(req.id, 'Rejected')} className="flex-1 border border-red-200 text-red-600 px-3 py-2 rounded-lg text-sm font-medium hover:bg-red-50">Reject</button>
                                                    <button onClick={() => onAction(req.id, 'Approved')} className="flex-1 bg-green-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-green-700 shadow-sm">Approve</button>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {/* Desktop Table View */}
                                <div className="hidden md:block overflow-x-auto">
                                    <table className="w-full text-left text-sm text-gray-600">
                                        <thead className="bg-gray-50 text-gray-900 font-medium">
                                            <tr>
                                                <th className="px-6 py-3 whitespace-nowrap">Student</th>
                                                <th className="px-6 py-3 whitespace-nowrap">Current Hostel</th>
                                                <th className="px-6 py-3 whitespace-nowrap">Requested</th>
                                                <th className="px-6 py-3 whitespace-nowrap">Reason</th>
                                                <th className="px-6 py-3 whitespace-nowrap">Status</th>
                                                <th className="px-6 py-3 text-right whitespace-nowrap">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {transferRequests.map(req => (
                                                <tr key={req.id}>
                                                    <td className="px-6 py-4">
                                                        <div className="font-medium text-gray-900">{req.studentName}</div>
                                                        <div className="text-xs text-gray-500 font-mono">{req.regNo}</div>
                                                    </td>
                                                    <td className="px-6 py-4">{req.currentHostel}</td>
                                                    <td className="px-6 py-4 font-medium text-[#991B1B]">{req.requestedHostel}</td>
                                                    <td className="px-6 py-4 max-w-xs truncate" title={req.reason}>{req.reason}</td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${req.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                                                            req.status === 'Approved' ? 'bg-green-100 text-green-700' :
                                                                'bg-red-100 text-red-700'
                                                            }`}>
                                                            {req.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        {req.status === 'Pending' && (
                                                            <div className="flex justify-end gap-2">
                                                                <button onClick={() => onAction(req.id, 'Rejected')} className="text-red-600 hover:bg-red-50 p-1.5 rounded transition-colors"><XCircle size={18} /></button>
                                                                <button onClick={() => onAction(req.id, 'Approved')} className="text-green-600 hover:bg-green-50 p-1.5 rounded transition-colors"><CheckCircle size={18} /></button>
                                                            </div>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const ApplicantDetailsModal = ({ applicant, onClose }) => {
    if (!applicant) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
                <div className="bg-[#991B1B] px-6 py-4 flex justify-between items-center text-white shrink-0">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                        <User size={20} className="text-red-200" />
                        Applicant Details
                    </h3>
                    <button onClick={onClose} className="hover:bg-white/20 p-1 rounded-full transition-colors"><X size={20} /></button>
                </div>

                <div className="p-6 overflow-y-auto">
                    <div className="flex flex-col md:flex-row gap-6 items-start">
                        {/* Profile Photo */}
                        <div className="flex-shrink-0 mx-auto md:mx-0">
                            <div className="w-28 h-28 rounded-full border-4 border-gray-100 shadow-sm overflow-hidden bg-gray-50 flex items-center justify-center">
                                {applicant.profileImage ? (
                                    <img src={applicant.profileImage} alt={applicant.name} className="w-full h-full object-cover" />
                                ) : (
                                    <Users size={40} className="text-gray-300" />
                                )}
                            </div>
                        </div>

                        {/* Details */}
                        <div className="flex-1 w-full space-y-6">
                            <div className="text-center md:text-left">
                                <h2 className="text-2xl font-bold text-gray-900">{applicant.name}</h2>
                                <p className="text-gray-500 font-mono text-sm bg-gray-100 inline-block px-2 py-0.5 rounded mt-1">{applicant.regNo}</p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Department</p>
                                    <p className="font-medium text-gray-900">{applicant.department}</p>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Year</p>
                                    <p className="font-medium text-gray-900">{applicant.year}</p>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Gender</p>
                                    <p className="font-medium text-gray-900">{applicant.gender || 'N/A'}</p>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Phone</p>
                                    <p className="font-medium text-gray-900">{applicant.phone}</p>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 sm:col-span-2">
                                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Email Address</p>
                                    <p className="font-medium text-gray-900 break-all">{applicant.email}</p>
                                </div>
                            </div>

                            <div className="border-t border-gray-100 pt-5">
                                <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                                    <Home size={16} className="text-gray-400" /> Guardian Info
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Guardian Name</p>
                                        <p className="font-medium text-gray-900">{applicant.parentName}</p>
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Guardian Phone</p>
                                        <p className="font-medium text-gray-900">{applicant.parentPhone}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-50 px-6 py-4 flex justify-end shrink-0 border-t border-gray-100">
                    <button onClick={onClose} className="px-5 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors shadow-sm">Close</button>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
