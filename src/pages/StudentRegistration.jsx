import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, ArrowLeft } from 'lucide-react';

const StudentRegistration = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        gender: '', // New Field
        regNo: '',
        department: 'Computer Science', // Default
        year: '1st Year',     // Default
        email: '',
        phone: '',
        parentName: '',
        parentPhone: '',
        profileImage: null,
        password: '',
        confirmPassword: ''
    });

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        // DUPLICATE CHECK: Prevent registering with an existing RegNo (e.g. CS2023001)
        const storedStudents = localStorage.getItem('studentList');
        const existingStudents = storedStudents ? JSON.parse(storedStudents) : [];
        // Important: You might also want to check against your 'mockData' if it's not fully loaded into localStorage yet
        // For now, assuming studentList is the source of truth if it exists, otherwise check basic mock consistency?
        // Actually, let's check against both if possible, or just the studentList which should contain everyone.

        const isDuplicate = existingStudents.some(s => s.regNo === formData.regNo);
        if (isDuplicate) {
            alert(`Registration Number ${formData.regNo} already exists! Please use a unique ID.`);
            return;
        }

        // Create new user object
        const newUser = {
            ...formData,
            hostelName: null,
            roomNumber: null,
            roomType: null,
            feeDue: 0,
            status: 'Pending_Hostel' // Initial Status
        };

        // Remove passwords
        delete newUser.password;
        delete newUser.confirmPassword;

        try {
            // Save to localStorage
            localStorage.setItem('userData', JSON.stringify(newUser));

            alert("Registration Successful! Please proceed to select a hostel.");
            navigate('/hostels');
        } catch (error) {
            console.error("Registration Error:", error);
            if (error.name === 'QuotaExceededError' || error.code === 22) {
                alert("Image too large! LocalStorage is full. Please choose a smaller image (under 500KB) or no image.");
            } else {
                alert("Registration failed due to a storage error. Please try again.");
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 font-sans bg-[#F3F4F6]">
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden p-8 animate-fade-in">
                <button onClick={() => navigate('/')} className="mb-6 flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors">
                    <ArrowLeft size={20} /> Back to Login
                </button>

                <div className="text-center mb-8">
                    <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <UserPlus className="text-[#991B1B]" size={32} />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Student Registration</h1>
                    <p className="text-gray-500 mt-2 text-lg">Join St Berchmans College Hostel</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Academic Info */}
                    <div>
                        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3 border-b pb-1">Academic Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <input required name="name" onChange={handleChange} type="text" className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-[#991B1B] outline-none" placeholder="e.g. Rahul Kumar" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                                <select required name="gender" onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-[#991B1B] outline-none">
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Registration Number</label>
                                <input required name="regNo" onChange={handleChange} type="text" className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-[#991B1B] outline-none" placeholder="e.g. CS2023001" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                                <select name="department" onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-[#991B1B] outline-none">
                                    <option>Computer Science</option>
                                    <option>Mechanical</option>
                                    <option>Electrical</option>
                                    <option>Civil</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Year of Study</label>
                                <select name="year" onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-[#991B1B] outline-none">
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
                        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3 border-b pb-1">Contact Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                <input required name="email" onChange={handleChange} type="email" className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-[#991B1B] outline-none" placeholder="student@example.com" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                <input required name="phone" onChange={handleChange} type="tel" className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-[#991B1B] outline-none" placeholder="+91 98765 43210" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Parent/Guardian Name</label>
                                <input required name="parentName" onChange={handleChange} type="text" className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-[#991B1B] outline-none" placeholder="Guardian Name" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Parent Phone</label>
                                <input required name="parentPhone" onChange={handleChange} type="tel" className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-[#991B1B] outline-none" placeholder="Parent Phone" />
                            </div>
                        </div>
                    </div>

                    {/* Profile Photo */}
                    <div>
                        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3 border-b pb-1">Profile Photo</h3>
                        <div className="flex items-center gap-4">
                            <div className="h-16 w-16 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden">
                                {formData.profileImage ? (
                                    <img src={formData.profileImage} alt="Preview" className="h-full w-full object-cover" />
                                ) : (
                                    <UserPlus className="text-gray-400" size={24} />
                                )}
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Upload Photo</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            // Check file size (max 500KB recommended for localStorage)
                                            if (file.size > 500000) {
                                                alert("File size too large! Please select an image under 500KB.");
                                                e.target.value = ""; // Clear input
                                                return;
                                            }

                                            const reader = new FileReader();
                                            reader.onloadend = () => {
                                                setFormData(prev => ({ ...prev, profileImage: reader.result }));
                                            };
                                            reader.readAsDataURL(file);
                                        }
                                    }}
                                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-[#991B1B] hover:file:bg-red-100 cursor-pointer"
                                />
                                <p className="text-xs text-gray-500 mt-1">Recommended: Square JPG/PNG, max 1MB</p>
                            </div>
                        </div>
                    </div>

                    {/* Security */}
                    <div>
                        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3 border-b pb-1">Security</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                <input required name="password" onChange={handleChange} type="password" className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-[#991B1B] outline-none" placeholder="••••••••" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                                <input required name="confirmPassword" onChange={handleChange} type="password" className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-[#991B1B] outline-none" placeholder="••••••••" />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-[#991B1B] text-white py-3.5 rounded-xl font-semibold hover:bg-red-800 transition-all duration-200 transform hover:scale-[1.02] shadow-md hover:shadow-lg mt-6"
                    >
                        Register & Browse Hostels
                    </button>

                    <div className="text-center mt-4">
                        <span className="text-gray-600 text-sm">Already have an account? </span>
                        <Link to="/" className="text-[#991B1B] font-medium text-sm hover:underline">Sign In</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default StudentRegistration;
