import React, { useState, useEffect } from 'react';

const Maintenance = () => {
    const [dots, setDots] = useState('');

    useEffect(() => {
        const interval = setInterval(() => {
            setDots(prev => (prev.length >= 3 ? '' : prev + '.'));
        }, 500);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center p-4 font-sans bg-[#F3F4F6]">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden p-8">
                {/* Logo & Title — same as Login */}
                <div className="text-center">
                    <img src="/logo.png" alt="College Logo" className="h-20 w-auto mx-auto mb-6" />
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                        St Berchmans College
                    </h1>
                    <p className="text-gray-500 mt-2 text-lg">
                        Hostel Management System
                    </p>
                </div>

                {/* Maintenance Content */}
                <div className="mt-8">
                    {/* Status Badge */}
                    <div className="flex justify-center mb-6">
                        <span className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-[#991B1B] rounded-full text-sm font-semibold">
                            <span className="relative flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#991B1B] opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#991B1B]"></span>
                            </span>
                            Server Maintenance
                        </span>
                    </div>

                    {/* Icon */}
                    <div className="flex justify-center mb-6">
                        <div className="bg-gray-100 rounded-full p-5">
                            <svg className="w-12 h-12 text-[#991B1B] animate-spin" style={{ animationDuration: '3s' }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93s.844.085 1.165-.183l.723-.559a1.125 1.125 0 011.586.139l.774.774a1.125 1.125 0 01.139 1.586l-.559.723c-.268.321-.352.776-.183 1.165.169.396.506.71.93.78l.894.15c.542.09.94.56.94 1.11v1.093c0 .55-.398 1.02-.94 1.11l-.894.149c-.424.07-.764.384-.93.78s-.085.844.183 1.165l.559.723a1.125 1.125 0 01-.139 1.586l-.774.774a1.125 1.125 0 01-1.586.139l-.723-.559c-.321-.268-.776-.352-1.165-.183-.396.169-.71.506-.78.93l-.15.894c-.09.542-.56.94-1.11.94h-1.093c-.55 0-1.02-.398-1.11-.94l-.149-.894c-.07-.424-.384-.764-.78-.93s-.844-.085-1.165.183l-.723.559a1.125 1.125 0 01-1.586-.139l-.774-.774a1.125 1.125 0 01-.139-1.586l.559-.723c.268-.321.352-.776.183-1.165a1.875 1.875 0 00-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.11v-1.093c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.764-.384.93-.78s.085-.844-.183-1.165l-.559-.723a1.125 1.125 0 01.139-1.586l.774-.774a1.125 1.125 0 011.586-.139l.723.559c.321.268.776.352 1.165.183.396-.169.71-.506.78-.93l.15-.894z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </div>
                    </div>

                    {/* Message */}
                    <div className="text-center space-y-3 mb-8">
                        <h2 className="text-xl font-bold text-gray-900">
                            We'll Be Right Back
                        </h2>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            Our system is currently undergoing scheduled maintenance to improve your experience. We'll be back shortly{dots}
                        </p>
                    </div>

                    {/* Progress bar */}
                    <div className="mb-8">
                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-[#991B1B] rounded-full"
                                style={{
                                    animation: 'maintenance-progress 2s ease-in-out infinite'
                                }}
                            />
                        </div>
                        <p className="text-xs text-gray-400 mt-2 text-center">Maintenance in progress</p>
                    </div>

                    {/* Info cards */}
                    <div className="flex gap-3 mb-6">
                        <div className="flex-1 bg-gray-50 rounded-xl p-4 text-center">
                            <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-1">Status</p>
                            <p className="text-sm font-bold text-yellow-600">In Progress</p>
                        </div>
                        <div className="flex-1 bg-gray-50 rounded-xl p-4 text-center">
                            <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-1">ETA</p>
                            <p className="text-sm font-bold text-green-600">Coming Soon</p>
                        </div>
                    </div>

                    {/* Contact */}
                    <div className="text-center">
                        <p className="text-sm text-gray-500">
                            Need help?{' '}
                            <a href="mailto:rijinpunthala007@gmail.com?subject=Hostel%20Management%20-%20Support%20Request" className="text-[#991B1B] font-semibold hover:underline">
                                Contact Admin — Rijin Johnson
                            </a>
                        </p>
                    </div>
                </div>
            </div>

            {/* Keyframe for progress bar */}
            <style>{`
                @keyframes maintenance-progress {
                    0% { width: 15%; }
                    50% { width: 85%; }
                    100% { width: 15%; }
                }
            `}</style>
        </div>
    );
};

export default Maintenance;
