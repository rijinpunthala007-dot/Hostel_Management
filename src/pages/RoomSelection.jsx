import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Filter, Users, CheckCircle } from 'lucide-react';
import { rooms, hostels } from '../mockData';

const RoomSelection = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const hostelId = parseInt(searchParams.get('hostelId'));
    const [filterBlock, setFilterBlock] = useState('All');
    const [filterType, setFilterType] = useState('All');

    // Find current hostel details
    const currentHostel = hostels.find(h => h.id === hostelId) || { name: 'All Hostels' };

    const filteredRooms = rooms.filter(room => {
        // Filter by Hostel ID first
        if (hostelId && room.hostelId !== hostelId) return false;

        if (filterType !== 'All' && room.type !== filterType) return false;
        // Add more mock filtering logic if needed
        return true;
    });

    return (
        <div className="min-h-screen bg-[#F3F4F6] font-sans pb-10">
            {/* Navbar */}
            <nav className="bg-white shadow-sm px-6 py-4 flex items-center gap-4 sticky top-0 z-10">
                <button
                    onClick={() => navigate('/hostels')}
                    className="p-2 hover:bg-gray-100 rounded-full text-gray-600 transition-colors"
                >
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <img src="/logo.png" alt="College Logo" className="h-10 w-auto mb-1" />
                    <div className="flex items-baseline gap-2">
                        <h1 className="font-bold text-gray-800 text-xl">Select Room</h1>
                        {hostelId && <p className="text-sm text-gray-500">- {currentHostel.name}</p>}
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Filters */}
                <div className="bg-white p-4 rounded-lg shadow-sm mb-8 flex flex-wrap gap-4 items-center">
                    <div className="flex items-center gap-2 text-gray-500 mr-2">
                        <Filter size={18} />
                        <span className="font-medium">Filters:</span>
                    </div>

                    <select
                        className="p-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-[#991B1B] outline-none"
                        value={filterBlock}
                        onChange={(e) => setFilterBlock(e.target.value)}
                    >
                        <option value="All">All Blocks</option>
                        <option value="Block A">Block A</option>
                        <option value="Block B">Block B</option>
                    </select>

                    <select
                        className="p-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-[#991B1B] outline-none"
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                    >
                        <option value="All">All Types</option>
                        <option value="Single">Single Room</option>
                        <option value="Double">Double Room</option>
                    </select>

                    <select
                        className="p-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-[#991B1B] outline-none"
                    >
                        <option>All Floors</option>
                        <option>Ground Floor</option>
                        <option>1st Floor</option>
                        <option>2nd Floor</option>
                    </select>
                </div>

                {/* Room Grid */}
                {filteredRooms.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {filteredRooms.map((room) => (
                            <div key={room.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                                <div className="p-5">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="bg-red-50 text-[#991B1B] font-bold text-lg px-3 py-1 rounded-md">
                                            {room.number}
                                        </div>
                                        {room.available ? (
                                            <span className="flex items-center gap-1 text-green-600 text-xs font-medium bg-green-50 px-2 py-1 rounded-full">
                                                <CheckCircle size={12} /> Vacant
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1 text-gray-500 text-xs font-medium bg-gray-100 px-2 py-1 rounded-full">
                                                Occupied
                                            </span>
                                        )}
                                    </div>

                                    <div className="space-y-2 mb-6">
                                        <div className="flex items-center gap-2 text-gray-600 text-sm">
                                            <span className="font-medium">Type:</span> {room.type}
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-600 text-sm">
                                            <Users size={16} />
                                            <span>Capacity: {room.capacity} Student{room.capacity > 1 ? 's' : ''}</span>
                                        </div>
                                    </div>

                                    <div className="mt-auto">
                                        {room.available ? (
                                            <button className="w-full bg-[#991B1B] text-white py-2 rounded-lg font-medium hover:bg-red-800 transition-colors">
                                                Apply Now
                                            </button>
                                        ) : (
                                            <button disabled className="w-full bg-gray-100 text-gray-400 py-2 rounded-lg font-medium cursor-not-allowed">
                                                Full
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-10 bg-white rounded-lg border border-dashed border-gray-300">
                        <p className="text-gray-500">No rooms found matching your criteria.</p>
                        <button
                            onClick={() => { setFilterBlock('All'); setFilterType('All'); }}
                            className="text-[#991B1B] text-sm mt-2 hover:underline"
                        >
                            Reset Filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RoomSelection;
