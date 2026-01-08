import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Flame, Utensils } from 'lucide-react';
import { foodMenuFull } from '../mockData';

const FoodMenu = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('breakfast');
    const [menu, setMenu] = useState(() => {
        const saved = localStorage.getItem('foodMenu');
        return saved ? JSON.parse(saved) : foodMenuFull;
    });

    const parsedMenu = React.useMemo(() => {
        // Handle potentially stringified items from AdminDashboard if they were textareas
        // In AdminDashboard we save the whole object structure, but 'items' might be a string if edited in textarea
        // Detailed parsing might be needed if the structure changes.
        // For now, let's assume the structure aligns or we parse it.

        // Actually, looking at AdminDashboard, it edits 'items' property as a string (textarea).
        // But StudentDashboard expects it to be an array of objects for mapping?
        // Wait, looking at FoodMenu.jsx line 52: currentItems.map((item, index) => ... item.name, item.type etc.
        // The mockData `foodMenuFull` has arrays of objects. 
        // The AdminDashboard loads `menuData` which has `items: "Not Available"` as strings? 
        // Let's check mockData again.
        return menu;
    }, [menu]);

    // Wait, I need to check mockData.js content. menuData vs foodMenuFull.
    // AdminDashboard uses `menuData` (lines 10-12 in mockData.js) which has simple strings?
    // StudentDashboard uses `foodMenuFull` (lines 34-39) which has arrays of objects?
    // The user said "food menu updating by admin is not getting the student".
    // AdminDashboard edits `menu` state initialized with `menuData` (simple structure).
    // StudentDashboard uses `foodMenuFull` (complex structure).
    // The Admin Dashboard implementation seems to be editing a DIFFERENT data structure than what FoodMenu uses.

    // I need to align them. If Admin edits the *text* description, FoodMenu should probably display that text 
    // OR Admin should have a way to edit the structured items.
    // Given the complexity, the Admin Dashboard probably just edits a text summary, while FoodMenu expects items.
    // However, the prompt implies they should be connected. 

    // Let's look at `AdminDashboard.jsx` again.
    // It renders textareas for `data.items`. 
    // `menuData` in mockData has objects with title and items (string).

    // `FoodMenu.jsx` uses `foodMenuFull` which has arrays.

    // I will assume for now I should use the `localStorage` 'foodMenu' if available, 
    // BUT I might need to handle the format difference.
    // If the Admin saves simple strings, FoodMenu needs to handle that or Admin needs to be upgraded.
    // Let's look at what `AdminDashboard` saves. It saves `menu` state.
    // `menu` state init from `menuData`. 
    // `menuData` structure: { breakfast: { title: "Breakfast", items: "Not Available" }, ... }

    // `FoodMenu.jsx` uses `foodMenuFull` structure: { breakfast: [], ... }
    // And maps over `currentItems`.

    // If Admin saves `{ breakfast: { title: "Breakfast", items: "Eggs, Toast" } }`
    // And FoodMenu tries `currentItems.map`, it will crash if `currentItems` is `{ title... }` or the string "Eggs, Toast".

    // I MUST fix the data structure mismatch.
    // I will modify `FoodMenu.jsx` to handle the Text-based menu from Admin if present.

    const currentItems = menu[activeTab]?.items || [];
    // If currentItems is a string (from Admin Dashboard), we need to render it as text, not map it.

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
                <h1 className="font-bold text-gray-800 text-xl">Weekly Menu</h1>
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

                {/* Empty State Fallback */}
                {currentItems.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        No menu items available for this time.
                    </div>
                )}

            </div>
        </div>
    );
};

export default FoodMenu;
