# Hostel Management System

A comprehensive, full-featured web application designed to digitize and streamline the end-to-end management of college hostels. Built specifically for St Berchmans College (Autonomous), Changanacherry.

## 🚀 Features

### For Students
*   **Seamless Registration:** Digital onboarding with duplicate checking and profile image cropping.
*   **Dynamic Dashboard:** Real-time notifications for leaves, complaints, and hostel allocations.
*   **Hostel Allocation & Transfer:** Browse available hostels (filtered by gender), check real-time bed capacities, and request rooms or transfers.
*   **Digital Leave Requests:** Apply for weekend, medical, or emergency leaves with optional document attachments.
*   **Complaint Ticketing:** Raise maintenance or food quality issues complete with photo evidence.
*   **Food Menu Access:** View the daily scheduled menu for Breakfast, Lunch, Snacks, and Dinner.

### For Administrators
*   **Admissions Control:** Review, approve, or reject incoming hostel allocations and transfer requests.
*   **Student Directory:** Full CRUD management of student records, including fee due tracking.
*   **Hostel Management:** Add/edit hostel buildings, update total capacities, and manage photo galleries.
*   **Workflow Queues:** Approve/reject student leave applications and update the status of maintenance complaints.
*   **Notice Board & Menus:** Push global announcements to all students and update the daily food menu dynamically.
*   **Advanced Reporting:** Generate branded, formatted PDF reports for Student Rosters (fees tracking), Hostel Occupancies, and Action Logs.

## 🛠 Technology Stack

*   **Frontend Framework:** React 18
*   **Build Tool:** Vite 5
*   **Routing:** React Router DOM v6
*   **Styling:** Tailwind CSS v3
*   **Icons:** Lucide React
*   **Data Persistence:** Browser LocalStorage (simulating a full backend database)
*   **PDF Generation:** jsPDF & jspdf-autotable
*   **Image Handling:** React Easy Crop (Base64 encoding)

## 📦 Project Structure
```text
src/
├── App.jsx                    # Root component with routing and protected routes
├── main.jsx                   # React entry point
├── index.css                  # Global Tailwind CSS imports
├── mockData.js                # Initial seed data (students, hostels, menus, etc.)
├── components/                # Reusable components (ErrorBoundary, Modals)
└── pages/                     # Full page routes (Admin/Student Dashboards, Login)
```

## 🔒 Security & Access

The application features a dual-role authentication system guarded by React Router's protected routes.
*   **Student Access:** Students log in using their Registration Number and Password. Data is securely persisted in the session storage.
*   **Admin Access:** The system employs a secure admin login portal.

**Admin Demo Credentials:**
*   **Email:** `admin@college.com`
*   **Password:** `admin123`

## 💻 Getting Started

### Prerequisites
Make sure you have Node.js (v16+ recommended) installed on your machine.

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/yourusername/hostel-management-system.git
    cd hostel-management-system
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    ```

3.  **Run the Development Server:**
    ```bash
    npm run dev
    ```
    The application will launch in your browser at `http://localhost:5173`.

### Building for Production
To create an optimized production build:
```bash
npm run build
```
To run the production preview locally:
```bash
npm run preview
```

## 🔮 Future Scalability
*   **Database Integration:** Replace LocalStorage with a robust backend architecture (e.g., Node.js + PostgreSQL).
*   **Individual Warden Logins:** Implement Role-Based Access Control (RBAC) allowing individual wardens to securely log in and manage only the students and operations specific to their own assigned hostel blocks.
*   **Payment Gateway:** Integrate online processing for students to instantly clear their "Fee Due" balances.
*   **Authentication:** Implement JWT-based secure authorization with hashed passwords.

---
*Developed for St Berchmans College (Autonomous), Changanacherry.*
