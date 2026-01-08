import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageSquare, Send, AlertTriangle } from 'lucide-react';
import { complaints } from '../mockData';

const ComplaintSubmission = () => {
    const navigate = useNavigate();
    const [category, setCategory] = useState('Infrastructure');
    const [description, setDescription] = useState('');
    const [myComplaints, setMyComplaints] = useState(() => {
        const saved = localStorage.getItem('complaintList');
        return saved ? JSON.parse(saved) : complaints;
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        const newComplaint = {
            id: Date.now(), // Use timestamp for unique ID
            student: "Rahul Kumar", // Mocked current user - ideally get from userData
            type: category,
            desc: description,
            status: "Pending",
            date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
        };
        const updatedList = [newComplaint, ...myComplaints];
        setMyComplaints(updatedList);
        localStorage.setItem('complaintList', JSON.stringify(updatedList));
        alert('Complaint submitted successfully!');
        setDescription('');
    };

    return (
        <div className="min-h-screen bg-[#F3F4F6] font-sans">
            <nav className="bg-white shadow-sm px-6 py-4 flex items-center gap-4 sticky top-0 z-10">
                <button
                    onClick={() => navigate('/student-dashboard')}
                    className="p-2 hover:bg-gray-100 rounded-full text-gray-600 transition-colors"
                >
                    <ArrowLeft size={20} />
                </button>
                <div className="flex items-center gap-3">
                    <img src="/logo.png" alt="College Logo" className="h-10 w-auto" />
                    <h1 className="font-bold text-gray-800 text-xl">Feedback & Complaints</h1>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Submission Form */}
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <Send className="text-[#991B1B]" size={20} />
                            Submit New Complaint
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                <select
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#991B1B] outline-none"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                >
                                    <option>Infrastructure</option>
                                    <option>Food Quality</option>
                                    <option>Cleanliness</option>
                                    <option>Discipline</option>
                                    <option>Other</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    required
                                    rows="4"
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#991B1B] outline-none"
                                    placeholder="Describe your issue in detail..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                ></textarea>
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-[#991B1B] text-white py-2 rounded-lg font-medium hover:bg-red-800 transition-colors mt-4"
                            >
                                Submit Complaint
                            </button>
                        </form>
                    </div>

                    {/* Complaint History */}
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <AlertTriangle className="text-gray-600" size={20} />
                            My Complaints
                        </h2>
                        <div className="space-y-4">
                            {myComplaints.filter(c => c.student === 'Rahul Kumar').map((item) => (
                                <div key={item.id} className="border border-gray-100 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-2">
                                            <span className={`text-xs px-2 py-1 rounded font-medium ${item.type === 'Infrastructure' ? 'bg-blue-100 text-blue-700' :
                                                item.type === 'Food' ? 'bg-orange-100 text-orange-700' :
                                                    'bg-purple-100 text-purple-700'
                                                }`}>
                                                {item.type}
                                            </span>
                                            <span className="text-xs text-gray-400">{item.date}</span>
                                        </div>
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${item.status === 'Resolved' ? 'bg-green-100 text-green-700' :
                                            'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {item.status}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-700 font-medium">{item.desc}</p>
                                    {item.status === 'Resolved' && (
                                        <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                                            <MessageSquare size={12} /> Admin marked as resolved.
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ComplaintSubmission;
