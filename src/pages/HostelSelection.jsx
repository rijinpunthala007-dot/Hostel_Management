import { useNavigate, Link } from 'react-router-dom';
import { Building, ArrowRight, ArrowLeft } from 'lucide-react';
import { hostels } from '../mockData';

const HostelSelection = () => {
    const navigate = useNavigate();

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
                    <h1 className="font-bold text-gray-800 text-xl">Browse Hostels</h1>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {hostels.map((hostel) => (
                        <div key={hostel.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow group">
                            <div className="h-48 bg-gray-200 flex items-center justify-center relative overflow-hidden">
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
                            </div>
                            <div className="p-6">
                                <h2 className="text-xl font-bold text-gray-900 mb-2">{hostel.name}</h2>
                                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                    {hostel.description}
                                </p>

                                <div className="flex justify-between items-center text-sm text-gray-500 mb-6">
                                    <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded">
                                        {hostel.totalRooms} Total Rooms
                                    </span>
                                    <span className={`px-2 py-1 rounded ${hostel.availableRooms > 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                        {hostel.availableRooms} Available
                                    </span>
                                </div>

                                <Link
                                    to={`/room-selection?hostelId=${hostel.id}`}
                                    className="w-full flex items-center justify-center gap-2 bg-[#991B1B] text-white py-3 rounded-lg font-medium hover:bg-red-800 transition-colors group-hover:shadow-md"
                                >
                                    View Rooms
                                    <ArrowRight size={18} />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HostelSelection;
