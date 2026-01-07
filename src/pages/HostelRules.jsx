import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Shield, Sparkles } from 'lucide-react';

const HostelRules = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#F3F4F6] font-sans text-gray-800">
            <nav className="bg-white shadow-sm px-6 py-4 flex items-center gap-4 sticky top-0 z-10">
                <button
                    onClick={() => navigate('/student-dashboard')}
                    className="p-2 hover:bg-gray-100 rounded-full text-gray-600 transition-colors"
                >
                    <ArrowLeft size={20} />
                </button>
                <div className="flex items-center gap-3">
                    <img src="/logo.png" alt="College Logo" className="h-10 w-auto" />
                    <h1 className="font-bold text-gray-800 text-xl">Hostel Rules & Regulations</h1>
                </div>
            </nav>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

                {/* Timings */}
                <div className="bg-white p-8 rounded-lg shadow-sm border-l-4 border-blue-500">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="bg-blue-100 p-2 rounded-full text-blue-600">
                            <Clock size={24} />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">Hostel Timings</h2>
                    </div>
                    <ul className="list-disc pl-14 space-y-2 text-gray-600">
                        <li>Main gate closes at <strong>9:30 PM</strong> sharp. No entry allowed after this time without prior warden approval.</li>
                        <li>Breakfast: 7:30 AM - 9:00 AM</li>
                        <li>Lunch: 12:30 PM - 2:00 PM</li>
                        <li>Dinner: 7:30 PM - 9:00 PM</li>
                        <li>Silence hour must be maintained from 10:00 PM to 6:00 AM.</li>
                    </ul>
                </div>

                {/* Cleanliness */}
                <div className="bg-white p-8 rounded-lg shadow-sm border-l-4 border-green-500">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="bg-green-100 p-2 rounded-full text-green-600">
                            <Sparkles size={24} />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">Cleanliness & Hygiene</h2>
                    </div>
                    <ul className="list-disc pl-14 space-y-2 text-gray-600">
                        <li>Students are responsible for keeping their rooms clean and tidy.</li>
                        <li>Do not throw garbage in the corridors or out of windows. Use designated dustbins.</li>
                        <li>Consumption of food is strictly prohibited inside the bedrooms to avoid pests.</li>
                        <li>Room inspection will be conducted by the warden/matron every Sunday morning.</li>
                    </ul>
                </div>

                {/* Safety */}
                <div className="bg-white p-8 rounded-lg shadow-sm border-l-4 border-red-500">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="bg-red-100 p-2 rounded-full text-[#991B1B]">
                            <Shield size={24} />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">Safety & Conduct</h2>
                    </div>
                    <ul className="list-disc pl-14 space-y-2 text-gray-600">
                        <li>Ragging in any form is a criminal offence and practically banned. Zero tolerance policy applies.</li>
                        <li>Possession or consumption of alcohol, tobacco, and drugs is strictly prohibited.</li>
                        <li>Electric appliances like heaters, induction cookers, and irons are not allowed in rooms.</li>
                        <li>Visitors are allowed only in the visiting area between 4:00 PM and 6:00 PM on weekends.</li>
                        <li>ID cards must be produced whenever demanded by the hostel authorities/security staff.</li>
                    </ul>
                </div>

                <div className="text-center text-sm text-gray-500 pt-8">
                    By strictly adhering to these rules, we ensure a safe and conducive environment for everyone's growth.
                </div>
            </div>
        </div>
    );
};

export default HostelRules;
