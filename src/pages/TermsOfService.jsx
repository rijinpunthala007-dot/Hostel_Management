import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const TermsOfService = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#F3F4F6] p-8">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-8 animate-fade-in">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-600 hover:text-[#991B1B] mb-6 transition-colors"
                >
                    <ArrowLeft size={20} /> Back
                </button>

                <h1 className="text-3xl font-bold text-gray-900 mb-6 border-b pb-4">Terms of Service</h1>

                <div className="space-y-6 text-gray-700">
                    <section>
                        <h2 className="text-xl font-semibold text-[#991B1B] mb-2">1. Acceptance of Terms</h2>
                        <p>By accessing and using this Hostel Management System, you accept and agree to be bound by the terms and provision of this agreement.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-[#991B1B] mb-2">2. User Conduct</h2>
                        <p>All students and administrators are expected to use the system responsibly. Any attempt to compromise the system security or integrity is strictly prohibited.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-[#991B1B] mb-2">3. Hostel Rules</h2>
                        <p>Registration on this portal implies agreement to abide by all hostel rules and regulations governing conduct, curfews, and maintenance of hostel property.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-[#991B1B] mb-2">4. Fee Payment</h2>
                        <p>Users are responsible for timely payment of all hostel and mess fees as reflected in the dashboard. Late fees may apply as per college policy.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-[#991B1B] mb-2">5. Data Accuracy</h2>
                        <p>You agree to provide true, accurate, current, and complete information during registration and to update such information to keep it accurate, current, and complete.</p>
                    </section>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-100 text-sm text-gray-500">
                    Last Updated: January 2026
                </div>
            </div>
        </div>
    );
};

export default TermsOfService;
