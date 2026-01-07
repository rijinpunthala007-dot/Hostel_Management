import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, FileText, Clock, CheckCircle, XCircle } from 'lucide-react';

const LeaveApplication = () => {
    const navigate = useNavigate();
    const [leaveType, setLeaveType] = useState('Weekend');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [reason, setReason] = useState('');

    // Initialize from localStorage or mock data
    const [leaveHistory, setLeaveHistory] = useState(() => {
        const saved = localStorage.getItem('leaveRequests');
        return saved ? JSON.parse(saved) : [];
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        const newLeave = {
            id: Date.now(), // Use timestamp for unique ID
            type: leaveType,
            from: startDate,
            to: endDate,
            status: 'Pending',
            reason: reason,
            studentName: 'Rahul Kumar', // Mocked user
            regNo: 'CS2023001'
        };
        const updatedHistory = [newLeave, ...leaveHistory];
        setLeaveHistory(updatedHistory);
        localStorage.setItem('leaveRequests', JSON.stringify(updatedHistory));
        alert('Leave application submitted successfully!');
        setReason('');
        setStartDate('');
        setEndDate('');
    };

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
                <div className="flex items-center gap-3">
                    <img src="/logo.png" alt="College Logo" className="h-10 w-auto" />
                    <h1 className="font-bold text-gray-800 text-xl">Apply for Leave</h1>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Application Form */}
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <FileText className="text-[#991B1B]" size={20} />
                            New Application
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Leave Type</label>
                                <select
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#991B1B] outline-none"
                                    value={leaveType}
                                    onChange={(e) => setLeaveType(e.target.value)}
                                >
                                    <option>Weekend</option>
                                    <option>Medical</option>
                                    <option>Emergency</option>
                                    <option>Other</option>
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
                                    <input
                                        type="date"
                                        required
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#991B1B] outline-none"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
                                    <input
                                        type="date"
                                        required
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#991B1B] outline-none"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                                <textarea
                                    required
                                    rows="3"
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#991B1B] outline-none"
                                    placeholder="Please describe why you need leave..."
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                ></textarea>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Supporting Document (Optional)</label>
                                <input
                                    type="file"
                                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-[#991B1B] hover:file:bg-red-100"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-[#991B1B] text-white py-2 rounded-lg font-medium hover:bg-red-800 transition-colors mt-4"
                            >
                                Submit Request
                            </button>
                        </form>
                    </div>

                    {/* History */}
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <Clock className="text-gray-600" size={20} />
                            Application History
                        </h2>
                        <div className="space-y-4">
                            {leaveHistory.map((item) => (
                                <div key={item.id} className="border border-gray-100 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <span className="font-semibold text-gray-900">{item.type} Leave</span>
                                            <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                                                <Calendar size={14} />
                                                {item.from} — {item.to}
                                            </div>
                                        </div>
                                        <span className={`px-2 py-1 rounded text-xs font-medium flex items-center gap-1 ${item.status === 'Approved' ? 'bg-green-100 text-green-700' :
                                            item.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                                                'bg-orange-100 text-orange-700'
                                            }`}>
                                            {item.status === 'Approved' && <CheckCircle size={12} />}
                                            {item.status === 'Rejected' && <XCircle size={12} />}
                                            {item.status === 'Pending' && <Clock size={12} />}
                                            {item.status}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 italic">"{item.reason}"</p>
                                </div>
                            ))}
                            {leaveHistory.length === 0 && (
                                <p className="text-center text-gray-500 py-8">No leave history found.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LeaveApplication;
