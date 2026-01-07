export const userData = {
    name: "Student Name",
    regNo: "Reg No.",
    course: "Course Name",
    attendance: "0%",
    feeDue: "₹0",
    hostelName: "St Thomas Hostel",
    roomNumber: "101"
};

export const menuData = {
    breakfast: { title: "Breakfast", items: "Not Available" },
    lunch: { title: "Lunch", items: "Not Available" },
    dinner: { title: "Dinner", items: "Not Available" }
};

export const statsData = [
    { label: "Attendance", value: "0%" },
    { label: "Fee Due", value: "₹0" }
];

export const announcements = [];

export const hostels = [
    { id: 1, name: "St Thomas Hostel", description: "Boys Hostel. Comfortable stay with study halls.", totalRooms: 50, availableRooms: 50, image: "/hostels/St Thomas Hostel.png", type: "Boys", facilities: ["Study Hall", "Wi-Fi", "Indoor Games", "24/7 Water"] },
    { id: 2, name: "St Berchmans Hostel", description: "Boys Hostel. Spacious rooms and recreational areas.", totalRooms: 60, availableRooms: 60, image: "/hostels/St Berchmans Hostel.png", type: "Boys", facilities: ["Gym", "Wi-Fi", "TV Room", "Spacious Garden"] },
    { id: 3, name: "Sahrudaya Hostel", description: "Boys Hostel. Focus on community and academic excellence.", totalRooms: 45, availableRooms: 45, image: "/hostels/Sahrudaya Hostel.png", type: "Boys", facilities: ["Library", "Wi-Fi", "Prayer Hall", "Mess Hall"] },
    { id: 4, name: "St Joseph’s Hostel", description: "Boys Hostel. Modern facilities and close to library.", totalRooms: 55, availableRooms: 55, image: "/hostels/St Joseph’s Hostel.png", type: "Boys", facilities: ["Attached Bathrooms", "Wi-Fi", "Canteen", "Laundry"] },
    { id: 5, name: "St Thomas Moore Hostel", description: "Boys Hostel. Peaceful environment for focused students.", totalRooms: 40, availableRooms: 40, image: "/hostels/St Thomas Moore Hostel.png", type: "Boys" },
    { id: 6, name: "Pope John Paul II Hostel", description: "Boys Hostel. Newly renovated with premium amenities.", totalRooms: 70, availableRooms: 70, image: null, type: "Boys" },
    { id: 7, name: "St Mary’s Hostel", description: "Girls Hostel. Safe, secure, and homely atmosphere.", totalRooms: 80, availableRooms: 80, image: "/hostels/St Mary’s Hostel.png", type: "Girls", facilities: ["Security 24/7", "Wi-Fi", "Study Area", "Recreation Room"] },
];

export const rooms = [];

export const foodMenuFull = {
    breakfast: [],
    lunch: [],
    snacks: [],
    dinner: []
};

export const allStudents = [
    {
        id: 1,
        name: "Rahul Kumar",
        regNo: "CS2023001",
        department: "Computer Science",
        year: "3rd Year",
        email: "rahul@example.com",
        phone: "+91 9876543210",
        parentName: "Suresh Kumar",
        parentPhone: "+91 9876543211",
        hostel: "St Thomas Hostel",
        room: "101",
        status: "Active",
        feeDue: 0
    },
    {
        id: 2,
        name: "Aditya Singh",
        regNo: "ME2023045",
        department: "Mechanical",
        year: "2nd Year",
        email: "aditya@example.com",
        phone: "+91 9123456789",
        parentName: "Vikram Singh",
        parentPhone: "+91 9123456780",
        hostel: "St Berchmans Hostel",
        room: "204",
        status: "Warning",
        feeDue: 15000
    },
    {
        id: 3,
        name: "Sneha Reddy",
        regNo: "EC2023112",
        department: "Electrical",
        year: "4th Year",
        email: "sneha@example.com",
        phone: "+91 9988776655",
        parentName: "Rajesh Reddy",
        parentPhone: "+91 9988776650",
        hostel: "St Mary’s Hostel",
        room: "305",
        status: "Active",
        feeDue: 0
    },
    {
        id: 4,
        name: "Arjun Das",
        regNo: "CV2023088",
        department: "Civil",
        year: "1st Year",
        email: "arjun@example.com",
        phone: "+91 8877665544",
        parentName: "Manoj Das",
        parentPhone: "+91 8877665540",
        hostel: "St Thomas Hostel",
        room: "105",
        status: "Active",
        feeDue: 5000
    }
];

export const complaints = [];
