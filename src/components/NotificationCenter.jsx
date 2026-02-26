import React, { useState, useEffect, useRef } from 'react';
import { Bell, CheckCircle, XCircle, AlertCircle, Utensils, Megaphone, ArrowRightLeft, X, Trash2 } from 'lucide-react';

const NotificationCenter = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [readIds, setReadIds] = useState(() => {
        return JSON.parse(localStorage.getItem('readNotifications') || '[]');
    });
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Build notifications from localStorage data
    useEffect(() => {
        const buildNotifications = () => {
            const items = [];
            const userData = JSON.parse(localStorage.getItem('userData') || '{}');
            const now = new Date();

            // 1. Leave request updates
            const leaves = JSON.parse(localStorage.getItem('leaveRequests') || '[]');
            leaves.forEach(l => {
                if ((l.studentName === userData.name || l.regNo === userData.regNo)) {
                    if (l.status === 'Approved' || l.status === 'ApprovedSeen') {
                        items.push({
                            id: `leave-approved-${l.id}`,
                            icon: CheckCircle,
                            iconColor: 'text-green-500',
                            iconBg: 'bg-green-50',
                            title: 'Leave Approved',
                            message: `Your ${l.type || 'leave'} request has been approved.`,
                            time: l.from || 'Recently',
                            type: 'success',
                        });
                    } else if (l.status === 'Rejected' || l.status === 'RejectedSeen') {
                        items.push({
                            id: `leave-rejected-${l.id}`,
                            icon: XCircle,
                            iconColor: 'text-red-500',
                            iconBg: 'bg-red-50',
                            title: 'Leave Rejected',
                            message: `Your ${l.type || 'leave'} request has been rejected.`,
                            time: l.from || 'Recently',
                            type: 'error',
                        });
                    } else if (l.status === 'Pending') {
                        items.push({
                            id: `leave-pending-${l.id}`,
                            icon: AlertCircle,
                            iconColor: 'text-yellow-500',
                            iconBg: 'bg-yellow-50',
                            title: 'Leave Submitted',
                            message: `Your ${l.type || 'leave'} request is pending review.`,
                            time: l.from || 'Recently',
                            type: 'info',
                        });
                    }
                }
            });

            // 2. Complaint updates
            const complaints = JSON.parse(localStorage.getItem('complaintList') || '[]');
            complaints.forEach(c => {
                if (c.student === userData.name) {
                    if (c.status === 'Resolved') {
                        items.push({
                            id: `complaint-resolved-${c.id}`,
                            icon: CheckCircle,
                            iconColor: 'text-green-500',
                            iconBg: 'bg-green-50',
                            title: 'Complaint Resolved',
                            message: `Your ${c.type} complaint has been resolved.`,
                            time: c.date || 'Recently',
                            type: 'success',
                        });
                    } else if (c.status === 'In Progress') {
                        items.push({
                            id: `complaint-progress-${c.id}`,
                            icon: AlertCircle,
                            iconColor: 'text-blue-500',
                            iconBg: 'bg-blue-50',
                            title: 'Complaint In Progress',
                            message: `Your ${c.type} complaint is being addressed.`,
                            time: c.date || 'Recently',
                            type: 'info',
                        });
                    }
                }
            });

            // 3. Hostel allocation/transfer updates
            const requests = JSON.parse(localStorage.getItem('hostelChangeRequests') || '[]');
            requests.forEach(r => {
                if (r.regNo === userData.regNo && r.studentName === userData.name) {
                    if (r.status === 'Approved' || r.status === 'ApprovedSeen') {
                        items.push({
                            id: `transfer-approved-${r.id}`,
                            icon: CheckCircle,
                            iconColor: 'text-green-500',
                            iconBg: 'bg-green-50',
                            title: r.type === 'Allocation' ? 'Admission Approved' : 'Transfer Approved',
                            message: `You've been allocated to ${r.requestedHostel}.`,
                            time: 'Recently',
                            type: 'success',
                        });
                    } else if (r.status === 'Rejected' || r.status === 'RejectedSeen') {
                        items.push({
                            id: `transfer-rejected-${r.id}`,
                            icon: XCircle,
                            iconColor: 'text-red-500',
                            iconBg: 'bg-red-50',
                            title: r.type === 'Allocation' ? 'Admission Rejected' : 'Transfer Rejected',
                            message: `Request for ${r.requestedHostel} was rejected.`,
                            time: 'Recently',
                            type: 'error',
                        });
                    }
                }
            });

            // 4. Recent announcements
            const notices = JSON.parse(localStorage.getItem('announcements') || '[]');
            notices.slice(0, 3).forEach(n => {
                items.push({
                    id: `notice-${n.id}`,
                    icon: Megaphone,
                    iconColor: 'text-[#991B1B]',
                    iconBg: 'bg-red-50',
                    title: 'New Notice',
                    message: n.title,
                    time: n.date || 'Recently',
                    type: 'notice',
                });
            });

            // 5. Menu updated today
            const savedMenu = localStorage.getItem('foodMenu');
            if (savedMenu) {
                items.push({
                    id: 'menu-update',
                    icon: Utensils,
                    iconColor: 'text-orange-500',
                    iconBg: 'bg-orange-50',
                    title: 'Menu Updated',
                    message: "Today's food menu has been updated by the admin.",
                    time: 'Today',
                    type: 'info',
                });
            }

            const dismissed = JSON.parse(localStorage.getItem('dismissedNotifications') || '[]');
            setNotifications(items.filter(n => !dismissed.includes(n.id)));
        };

        buildNotifications();
        // Refresh every 30 seconds
        const interval = setInterval(buildNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    const unreadCount = notifications.filter(n => !readIds.includes(n.id)).length;

    const markAllRead = () => {
        const allIds = notifications.map(n => n.id);
        setReadIds(allIds);
        localStorage.setItem('readNotifications', JSON.stringify(allIds));
    };

    const markAsRead = (id) => {
        if (!readIds.includes(id)) {
            const updated = [...readIds, id];
            setReadIds(updated);
            localStorage.setItem('readNotifications', JSON.stringify(updated));
        }
    };

    const clearAll = () => {
        const allIds = notifications.map(n => n.id);
        const dismissed = JSON.parse(localStorage.getItem('dismissedNotifications') || '[]');
        const updated = [...new Set([...dismissed, ...allIds])];
        localStorage.setItem('dismissedNotifications', JSON.stringify(updated));
        setNotifications([]);
        setReadIds([]);
        localStorage.setItem('readNotifications', JSON.stringify([]));
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Bell Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors"
                title="Notifications"
            >
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 bg-[#991B1B] text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full animate-pulse">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute right-0 top-12 w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden"
                    style={{ animation: 'fadeInDown 0.2s ease-out' }}>
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-100">
                        <h3 className="font-bold text-gray-900 text-sm">Notifications</h3>
                        <div className="flex items-center gap-2">
                            {notifications.length > 0 && (
                                <button
                                    onClick={clearAll}
                                    title="Clear All"
                                    className="p-1.5 rounded-lg border border-red-300 text-red-600 hover:bg-red-50 hover:scale-110 active:scale-95 transition-all duration-200"
                                >
                                    <Trash2 size={12} />
                                </button>
                            )}
                            {unreadCount > 0 && (
                                <button
                                    onClick={markAllRead}
                                    className="text-xs text-[#991B1B] hover:underline font-medium"
                                >
                                    Mark all read
                                </button>
                            )}
                            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={16} />
                            </button>
                        </div>
                    </div>

                    {/* Notification List */}
                    <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
                        {notifications.length === 0 ? (
                            <div className="px-4 py-8 text-center">
                                <Bell className="mx-auto text-gray-300 mb-3" size={32} />
                                <p className="text-gray-500 text-sm">No notifications yet</p>
                                <p className="text-gray-400 text-xs mt-1">Activity updates will appear here</p>
                            </div>
                        ) : (
                            notifications.map(n => {
                                const isRead = readIds.includes(n.id);
                                const IconComponent = n.icon;
                                return (
                                    <div
                                        key={n.id}
                                        onClick={() => markAsRead(n.id)}
                                        className={`px-4 py-3 flex items-start gap-3 cursor-pointer hover:bg-gray-50 transition-colors ${!isRead ? 'bg-red-50/30' : ''
                                            }`}
                                    >
                                        <div className={`p-2 rounded-full shrink-0 ${n.iconBg}`}>
                                            <IconComponent size={16} className={n.iconColor} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between gap-2">
                                                <p className={`text-sm ${!isRead ? 'font-semibold text-gray-900' : 'font-medium text-gray-700'}`}>
                                                    {n.title}
                                                </p>
                                                {!isRead && (
                                                    <span className="w-2 h-2 bg-[#991B1B] rounded-full shrink-0"></span>
                                                )}
                                            </div>
                                            <p className="text-xs text-gray-500 mt-0.5 truncate">{n.message}</p>
                                            <p className="text-[10px] text-gray-400 mt-1">{n.time}</p>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>

                    {/* Footer */}
                    {notifications.length > 0 && (
                        <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 text-center">
                            <p className="text-xs text-gray-400">{notifications.length} notification{notifications.length !== 1 ? 's' : ''}</p>
                        </div>
                    )}
                </div>
            )}

            {/* Animation */}
            <style>{`
                @keyframes fadeInDown {
                    from { opacity: 0; transform: translateY(-8px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

export default NotificationCenter;
