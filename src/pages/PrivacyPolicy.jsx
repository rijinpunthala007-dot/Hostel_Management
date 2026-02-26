import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const PrivacyPolicy = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#F3F4F6] p-8">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-8">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-600 hover:text-[#991B1B] mb-6 transition-colors"
                >
                    <ArrowLeft size={20} /> Back
                </button>

                <h1 className="text-3xl font-bold text-gray-900 mb-6 border-b pb-4">Privacy Policy</h1>

                <div className="space-y-6 text-gray-700">
                    <section>
                        <h2 className="text-xl font-semibold text-[#991B1B] mb-2">1. Information Collection</h2>
                        <p>We collect information you provide directly to us, such as your name, registration number, email address, phone number, and guardian details when you register for the hostel.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-[#991B1B] mb-2">2. Use of Information</h2>
                        <p>The information we collect is used solely for hostel management purposes, including room allocation, fee tracking, attendance monitoring, and emergency communication.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-[#991B1B] mb-2">3. Data Security</h2>
                        <p>We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-[#991B1B] mb-2">4. Information Sharing</h2>
                        <p>We do not share your personal information with third parties except as required by college administration or law enforcement agencies.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-[#991B1B] mb-2">5. Cookies</h2>
                        <p>This system uses local storage to maintain your login session and preferences. We do not use third-party tracking cookies.</p>
                    </section>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-100 text-sm text-gray-500">
                    Last Updated: January 2026
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
