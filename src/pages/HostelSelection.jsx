import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Building, ArrowRight, ArrowLeft, AlertCircle } from 'lucide-react';
import { hostels } from '../mockData';

const HostelSelection = () => {
    const navigate = useNavigate();
    const [user, setUser] = React.useState(null);
    const [requests, setRequests] = React.useState([]);

    React.useEffect(() => {
        const storedUser = localStorage.getItem('userData');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else {
            // Fallback if no user in local storage
            import('../mockData').then(module => setUser(module.userData));
        }

        const storedRequests = localStorage.getItem('hostelChangeRequests');
        if (storedRequests) {
            setRequests(JSON.parse(storedRequests));
        }
    }, []);

    const [showTransferModal, setShowTransferModal] = React.useState(false);
    const [showDetailsModal, setShowDetailsModal] = React.useState(false);
    const [selectedHostel, setSelectedHostel] = React.useState(null);
    const [transferReason, setTransferReason] = React.useState('');
    const [hostelList, setHostelList] = React.useState([]); // Dynamic Hostel List
    const [rejectedRequest, setRejectedRequest] = React.useState(null); // Rejection State

    React.useEffect(() => {
        // Load Hostels (Dynamic)
        const storedHostels = localStorage.getItem('hostelData');
        if (storedHostels) {
            setHostelList(JSON.parse(storedHostels));
        } else {
            setHostelList(hostels); // Fallback to mock
        }

        // Check for Rejections
        const storedRequests = localStorage.getItem('hostelChangeRequests');
        if (storedRequests) {
            const allRequests = JSON.parse(storedRequests);
            const rejection = allRequests.find(r =>
                r.regNo === user?.regNo &&
                r.studentName === user?.name &&
                r.status === 'Rejected'
            );
            if (rejection) {
                setRejectedRequest(rejection);
            }
        }
    }, [user]);

    // Check if user has ANY active pending request (excluding rejected/dismissed ones)
    // Use strict matching: BOTH regNo AND name must match to avoid false positives from old data
    const pendingRequest = requests.find(r =>
        (r.status === 'Pending' || r.status === 'Approved') &&
        r.regNo === user?.regNo && r.studentName === user?.name);

    const dismissRejection = () => {
        if (!rejectedRequest) return;

        const storedRequests = localStorage.getItem('hostelChangeRequests');
        if (storedRequests) {
            const allRequests = JSON.parse(storedRequests);
            // Mark as 'RejectedSeen' so it doesn't show again
            const updated = allRequests.map(r => r.id === rejectedRequest.id ? { ...r, status: 'RejectedSeen' } : r);
            localStorage.setItem('hostelChangeRequests', JSON.stringify(updated));
            setRequests(updated); // Update local state
            setRejectedRequest(null);
        }
    };

    const handleRequest = (hostel) => {
        if (!user) return;
        if (pendingRequest) return; // Prevent multiple requests

        const isNewStudent = user.status === 'Pending_Hostel';

        if (isNewStudent) {
            submitRequest(hostel, "New Allocation", 'Allocation');
        } else {
            setSelectedHostel(hostel);
            setShowTransferModal(true);
        }
    };

    const submitRequest = (hostel, reason, type) => {
        const newRequest = {
            id: Date.now(),
            studentName: user.name || "Student Name",
            regNo: user.regNo || "Reg No",
            currentHostel: user.hostelName || "None",
            requestedHostel: hostel.name,
            reason: reason,
            type: type,
            status: 'Pending',
            date: new Date().toLocaleDateString(),
            studentDetails: user // Include full student profile for Admin review
        };

        const updatedRequests = [...requests, newRequest];
        setRequests(updatedRequests);
        localStorage.setItem('hostelChangeRequests', JSON.stringify(updatedRequests));

        if (type === 'Allocation') {
            // Update User Status
            const updatedUser = { ...user, status: 'Pending_Approval', hostelName: 'Pending Allocation' };
            localStorage.setItem('userData', JSON.stringify(updatedUser));
            setUser(updatedUser);
            alert('Hostel Allocation Request Sent! Please wait for Admin Approval.');
        } else {
            alert('Transfer Request Sent Successfully!');
        }
    };

    const handleTransferSubmit = (e) => {
        e.preventDefault();
        if (!transferReason.trim()) return;
        submitRequest(selectedHostel, transferReason, 'Transfer');
        setShowTransferModal(false);
        setTransferReason('');
        setSelectedHostel(null);
    };

    return (
        <div className="min-h-screen bg-[#F3F4F6] font-sans relative">
            {/* Navbar */}
            <nav className="bg-white shadow-sm px-6 py-4 flex items-center gap-4 sticky top-0 z-10">
                <button
                    onClick={() => user?.status === 'Pending_Hostel' || user?.status === 'Pending_Approval' ? navigate('/') : navigate('/student-dashboard')}
                    className="p-2 hover:bg-gray-100 rounded-full text-gray-600 transition-colors"
                >
                    <ArrowLeft size={20} />
                </button>
                <div className="flex items-center gap-3">
                    <img src="/logo.png" alt="College Logo" className="h-10 w-auto" />
                    <h1 className="font-bold text-gray-800 text-xl">Browse Hostels</h1>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Rejection Banner */}
                {rejectedRequest && (
                    <div className="mb-8 bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg flex items-center gap-3 relative">
                        <div className="bg-red-100 p-2 rounded-full">
                            <AlertCircle size={20} />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold">Request Rejected</h3>
                            <p className="text-sm">
                                Your request for <span className="font-semibold">{rejectedRequest.requestedHostel}</span> was rejected.
                                {rejectedRequest.reason && <span> Reason: {rejectedRequest.reason}</span>}
                            </p>
                        </div>
                        <button
                            onClick={dismissRejection}
                            className="bg-white text-red-700 px-3 py-1 rounded border border-red-200 text-sm font-medium hover:bg-red-50"
                        >
                            Dismiss
                        </button>
                    </div>
                )}

                {user?.status === 'Pending_Approval' && (
                    <div className="mb-8 bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-lg flex items-center gap-3">
                        <div className="bg-blue-100 p-2 rounded-full">
                            <Building size={20} />
                        </div>
                        <div>
                            <h3 className="font-bold">Request Submitted</h3>
                            <p className="text-sm">Your hostel allocation request is pending admin approval. You will be notified once approved.</p>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {hostelList.map((hostel) => {
                        const isCurrentHostel = user?.hostelName === hostel.name;
                        const isThisPending = pendingRequest?.requestedHostel === hostel.name;
                        const isNewStudent = user?.status === 'Pending_Hostel';

                        // Gender Compatibility Check
                        let isCompatible = true;
                        if (user?.gender === 'Male' && hostel.type === 'Girls') isCompatible = false;
                        if (user?.gender === 'Female' && hostel.type === 'Boys') isCompatible = false;

                        return (
                            <div key={hostel.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow group flex flex-col h-full">
                                <div className="h-48 bg-gray-200 flex items-center justify-center relative overflow-hidden flex-shrink-0">
                                    {hostel.image ? (
                                        <img
                                            src={hostel.image}
                                            alt={hostel.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-100 p-4">
                                            <Building size={48} className="text-indigo-400 mb-2" />
                                            <span className="text-sm text-indigo-400 font-medium">Image Coming Soon</span>
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-black/5 group-hover:bg-black/10 transition-colors pointer-events-none" />

                                    {/* Gender Badge */}
                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-700 shadow-sm">
                                        {hostel.type}
                                    </div>
                                </div>
                                <div className="p-6 flex flex-col flex-grow">
                                    <h2 className="text-xl font-bold text-gray-900 mb-2">{hostel.name}</h2>
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">
                                        {hostel.description}
                                    </p>

                                    <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm text-gray-500 mb-6 mt-auto bg-gray-50 p-3 rounded-lg">
                                        <div className="flex items-center justify-between">
                                            <span>Rooms:</span>
                                            <span className="font-semibold text-gray-700">{hostel.totalRooms}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span>Free Rooms:</span>
                                            <span className={`font-semibold ${hostel.availableRooms > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                {hostel.availableRooms}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span>Beds:</span>
                                            <span className="font-semibold text-gray-700">{hostel.totalBeds}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span>Free Beds:</span>
                                            <span className={`font-semibold ${hostel.availableBeds > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                {hostel.availableBeds}
                                            </span>
                                        </div>
                                        <div className="col-span-2 flex items-center justify-between border-t border-gray-200 pt-2 mt-1">
                                            <span>Bathrooms:</span>
                                            <span className="font-semibold text-gray-700">{hostel.totalBathrooms}</span>
                                        </div>
                                    </div>

                                    {/* Action Button Logic */}
                                    {isThisPending ? (
                                        pendingRequest.status === 'Approved' ? (
                                            <button disabled className="w-full bg-green-100 text-green-700 py-3 rounded-lg font-medium cursor-not-allowed border border-green-200">
                                                Request Approved
                                            </button>
                                        ) : (
                                            <button disabled className="w-full bg-blue-100 text-blue-700 py-3 rounded-lg font-medium cursor-not-allowed border border-blue-200">
                                                Waiting for Approval...
                                            </button>
                                        )
                                    ) : pendingRequest ? (
                                        <button disabled className="w-full bg-gray-100 text-gray-400 py-3 rounded-lg font-medium cursor-not-allowed border border-gray-200">
                                            Another Request Active
                                        </button>
                                    ) : !isCompatible ? (
                                        <button disabled className="w-full bg-gray-100 text-gray-400 py-3 rounded-lg font-medium cursor-not-allowed border border-gray-200">
                                            {hostel.type} Only
                                        </button>
                                    ) : isNewStudent ? (
                                        <button
                                            onClick={() => handleRequest(hostel)}
                                            disabled={pendingRequest}
                                            className="w-full flex items-center justify-center gap-2 bg-[#991B1B] text-white py-3 rounded-lg font-medium hover:bg-red-800 transition-colors group-hover:shadow-md mt-auto shadow-md"
                                        >
                                            Request Allocation
                                            <ArrowRight size={18} />
                                        </button>
                                    ) : user?.hostelName ? (
                                        isCurrentHostel ? (
                                            <button disabled className="w-full bg-gray-100 text-gray-400 py-3 rounded-lg font-medium cursor-not-allowed">
                                                Current Hostel
                                            </button>
                                        ) : pendingRequest ? (
                                            <button disabled className="w-full bg-yellow-100 text-yellow-700 py-3 rounded-lg font-medium cursor-not-allowed border border-yellow-200">
                                                Request Pending
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => handleRequest(hostel)}
                                                className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors group-hover:shadow-md mt-auto"
                                            >
                                                Request Transfer
                                            </button>
                                        )
                                    ) : (
                                        // Fallback/Legacy
                                        <Link
                                            to={`/room-selection?hostelId=${hostel.id}`}
                                            className="w-full flex items-center justify-center gap-2 bg-[#991B1B] text-white py-3 rounded-lg font-medium hover:bg-red-800 transition-colors group-hover:shadow-md mt-auto"
                                        >
                                            View Rooms
                                            <ArrowRight size={18} />
                                        </Link>
                                    )}

                                    <button
                                        onClick={() => {
                                            setSelectedHostel(hostel);
                                            setShowDetailsModal(true);
                                        }}
                                        className="w-full mt-3 flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                                    >
                                        View Gallery & Details
                                    </button>
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* Transfer Request Modal */}
                {showTransferModal && (
                    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowTransferModal(false)}>
                        <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Request Transfer</h3>
                            <p className="text-gray-600 mb-4">
                                You are requesting a transfer to <span className="font-semibold">{selectedHostel?.name}</span>.
                                Please provide a reason for your request.
                            </p>
                            <form onSubmit={handleTransferSubmit}>
                                <textarea
                                    required
                                    value={transferReason}
                                    onChange={(e) => setTransferReason(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none h-32 resize-none mb-4"
                                    placeholder="e.g. Nearer to my department..."
                                ></textarea>
                                <div className="flex justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowTransferModal(false)}
                                        className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-600 text-white font-medium hover:bg-blue-700 rounded-lg"
                                    >
                                        Submit Request
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Gallery Modal */}
                {showDetailsModal && selectedHostel && (
                    <HostelDetailsModal hostel={selectedHostel} onClose={() => setShowDetailsModal(false)} />
                )}
            </div>
        </div>
    );
};

const HostelDetailsModal = ({ hostel, onClose }) => {
    const [activeTab, setActiveTab] = React.useState('rooms');

    return (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">{hostel.name}</h2>
                        <p className="text-gray-500 text-sm mt-1">{hostel.description}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <ArrowLeft size={24} className="text-gray-500" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-200">
                    <button
                        onClick={() => setActiveTab('rooms')}
                        className={`flex-1 py-4 text-sm font-medium transition-colors border-b-2 ${activeTab === 'rooms' ? 'border-[#991B1B] text-[#991B1B]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                    >
                        Room Photos
                    </button>
                    <button
                        onClick={() => setActiveTab('facilities')}
                        className={`flex-1 py-4 text-sm font-medium transition-colors border-b-2 ${activeTab === 'facilities' ? 'border-[#991B1B] text-[#991B1B]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                    >
                        Facility Photos
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
                    {activeTab === 'rooms' && (
                        <div className="space-y-6">
                            {hostel.roomImages && hostel.roomImages.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {hostel.roomImages.map((img, idx) => (
                                        <div key={idx} className="aspect-video bg-gray-200 rounded-lg overflow-hidden shadow-sm group">
                                            <img src={img} alt={`Room ${idx + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                                    <Building size={48} className="mb-4 opacity-50" />
                                    <p>No room photos available for this hostel yet.</p>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'facilities' && (
                        <div className="space-y-6">
                            <div className="mb-6">
                                <h3 className="font-bold text-gray-900 mb-3">Available Facilities</h3>
                                <div className="flex flex-wrap gap-2">
                                    {hostel.facilities?.map((f, i) => (
                                        <span key={i} className="px-3 py-1 bg-white border border-gray-200 rounded-full text-sm text-gray-700 shadow-sm">{f}</span>
                                    ))}
                                </div>
                            </div>

                            {hostel.facilityImages && hostel.facilityImages.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {hostel.facilityImages.map((img, idx) => (
                                        <div key={idx} className="aspect-video bg-gray-200 rounded-lg overflow-hidden shadow-sm group">
                                            <img src={img} alt={`Facility ${idx + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                                    <Building size={48} className="mb-4 opacity-50" />
                                    <p>No facility photos available for this hostel yet.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HostelSelection;
