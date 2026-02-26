import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Flame, Utensils, Bell, BellOff } from 'lucide-react';
import { foodMenuFull } from '../mockData';

const FoodMenu = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('breakfast');
    const [menu, setMenu] = useState(() => {
        const saved = localStorage.getItem('foodMenu');
        return saved ? JSON.parse(saved) : foodMenuFull;
    });

    const [notifyEnabled, setNotifyEnabled] = useState(false);

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        const optedIn = JSON.parse(localStorage.getItem('menuNotifyEmails') || '[]');
        setNotifyEnabled(optedIn.some(s => s.email === userData.email));
    }, []);

    const handleNotifyToggle = () => {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        const { email, name } = userData;
        if (!email || email === 'N/A') { alert('No email found on your profile.'); return; }
        const optedIn = JSON.parse(localStorage.getItem('menuNotifyEmails') || '[]');
        if (!notifyEnabled) {
            if (!optedIn.some(s => s.email === email)) {
                optedIn.push({ email, name: name || 'Student' });
                localStorage.setItem('menuNotifyEmails', JSON.stringify(optedIn));
            }
            setNotifyEnabled(true);
        } else {
            localStorage.setItem('menuNotifyEmails', JSON.stringify(optedIn.filter(s => s.email !== email)));
            setNotifyEnabled(false);
        }
    };

    const tabs = [
        { id: 'breakfast', label: 'Breakfast' },
        { id: 'lunch', label: 'Lunch' },
        { id: 'snacks', label: 'Snacks' },
        { id: 'dinner', label: 'Dinner' }
    ];

    const currentItems = menu[activeTab]?.items || [];

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
                <h1 className="font-bold text-gray-800 text-xl">Food Menu</h1>

                {/* Notification toggle */}
                <button
                    onClick={handleNotifyToggle}
                    className={`ml-auto p-2 rounded-full transition-colors ${notifyEnabled
                        ? 'bg-green-100 text-green-600 hover:bg-green-200'
                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                        }`}
                    title={notifyEnabled ? 'Disable daily menu emails' : 'Get daily menu emails'}
                >
                    {notifyEnabled ? <Bell size={20} /> : <BellOff size={20} />}
                </button>
            </nav>

            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Tabs */}
                <div className="flex bg-white rounded-lg shadow-sm p-1 mb-8">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${activeTab === tab.id
                                ? 'bg-[#991B1B] text-white shadow'
                                : 'text-gray-500 hover:bg-gray-50'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Menu List */}
                <div className="space-y-4">
                    {typeof currentItems === 'string' ? (
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                            <p className="text-gray-700 whitespace-pre-wrap">{currentItems}</p>
                        </div>
                    ) : Array.isArray(currentItems) && currentItems.length > 0 ? (
                        currentItems.map((item, index) => (
                            <div key={index} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="bg-gray-100 p-3 rounded-full">
                                        <Utensils className="text-gray-500" size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">{item.name}</h3>
                                        <div className="flex items-center gap-3 mt-1">
                                            <span className={`flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${item.type === 'Veg' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                                }`}>
                                                <span className={`w-2 h-2 rounded-full ${item.type === 'Veg' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                                {item.type}
                                            </span>
                                            <span className="flex items-center gap-1 text-xs text-gray-500">
                                                <Flame size={12} className="text-orange-500" />
                                                {item.calories} cal
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg">
                                    <Star size={14} className="text-yellow-500 fill-yellow-500" />
                                    <span className="text-sm font-bold text-gray-700">{item.rating}</span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-12 text-gray-500">
                            No menu items available for this time.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FoodMenu;
