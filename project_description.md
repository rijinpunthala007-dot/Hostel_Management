# Hostel Management System — Complete Project Description

## St Berchmans College (Autonomous), Changanacherry

---

## 1. Project Overview

The **Hostel Management System (HMS)** is a comprehensive, full-featured web application designed to digitize and streamline the end-to-end management of college hostels at St Berchmans College. The system serves two primary user roles — **Students** and **Administrators** — each with dedicated dashboards, workflows, and capabilities.

The application covers the entire lifecycle of a hostel student: from registration and hostel allocation, to room management, food menus, leave requests, complaint filing, fee tracking, and administrative oversight. The system enforces gender-based hostel restrictions, prevents duplicate requests, and provides real-time notification banners for request approvals, rejections, and leave status updates.

---

## 2. Technology Stack

| Layer | Technology |
|---|---|
| **Frontend Framework** | React 18 (with Hooks) |
| **Build Tool** | Vite 5 |
| **Routing** | React Router DOM v6 (HashRouter) |
| **Styling** | Tailwind CSS v3 |
| **Icons** | Lucide React |
| **Data Persistence** | Browser LocalStorage (simulating a backend database) |
| **Deployment** | Vercel (configured via `vercel.json`) |

---

## 3. System Architecture

### 3.1 Application Structure

```
src/
├── App.jsx                    # Root component with routing and protected routes
├── main.jsx                   # React entry point
├── index.css                  # Global Tailwind CSS imports
├── mockData.js                # Initial seed data (students, hostels, menus, etc.)
├── components/
│   └── ErrorBoundary.jsx      # Global error boundary for graceful crash recovery
└── pages/
    ├── Login.jsx              # Dual-role login (Student / Admin)
    ├── StudentRegistration.jsx # New student registration form
    ├── StudentDashboard.jsx   # Student home dashboard
    ├── HostelSelection.jsx    # Browse hostels & request allocation/transfer
    ├── RoomSelection.jsx      # Browse and filter rooms within a hostel
    ├── FoodMenu.jsx           # View daily food menu (Breakfast/Lunch/Snacks/Dinner)
    ├── LeaveApplication.jsx   # Submit and track leave requests
    ├── ComplaintSubmission.jsx # File complaints with photo attachments
    ├── HostelRules.jsx        # View hostel rules and regulations
    ├── StudentProfile.jsx     # View personal profile and allocation details
    ├── AdminDashboard.jsx     # Full admin panel with 8 management sections
    ├── TermsOfService.jsx     # Terms of Service page
    └── PrivacyPolicy.jsx      # Privacy Policy page
```

### 3.2 Routing & Access Control

- **Public Routes**: Login (`/`), Student Registration (`/register`), Terms of Service (`/terms`), Privacy Policy (`/privacy`)
- **Protected Routes**: Student Dashboard (`/student-dashboard`) — guarded by a `ProtectedRoute` wrapper that checks for a valid logged-in user session in LocalStorage. Users with `Pending_Hostel` or `Pending_Approval` status are automatically redirected to the Hostel Selection page.
- **Admin Route**: Admin Dashboard (`/admin-dashboard`) — accessible only via correct admin credentials.
- **Student Routes**: Hostel Selection (`/hostels`), Room Selection (`/room-selection`), Food Menu (`/food-menu`), Leave Application (`/leave-application`), Complaints (`/complaints`), Hostel Rules (`/rules`), Student Profile (`/profile`).

### 3.3 Data Management

All data is persisted in the browser's **LocalStorage**, simulating a backend database. Key data stores include:

| LocalStorage Key | Description |
|---|---|
| `userData` | Currently logged-in user's session data |
| `studentList` | Master list of all registered students |
| `hostelData` | List of all hostels with details and availability |
| `hostelChangeRequests` | All hostel allocation and transfer requests |
| `leaveRequests` | All leave applications submitted by students |
| `complaintList` | All complaints filed by students |
| `foodMenu` | Current food menu data for all meal times |
| `announcements` | Notice board announcements posted by admin |

---

## 4. Detailed Module Descriptions

---

### 4.1 Authentication Module (Login Page)

**Route**: `/`

The login page provides a **dual-role authentication system** with a tabbed interface to switch between Student and Admin login modes.

#### Student Login
- **Input**: Registration Number (or Email) and Password.
- **Validation**: The system looks up the student in the `studentList` stored in LocalStorage. If the student record is found (matched by Registration Number or Email), login succeeds.
- **On Success**: The student's data (excluding password) is saved to `userData` in LocalStorage, and the user is navigated to the Student Dashboard.
- **On Failure**: Appropriate error messages are shown — "Student Record Not Found" if the Registration Number does not exist.

#### Admin Login
- **Input**: Email Address and Password.
- **Validation**: Strict credential check against hardcoded admin credentials (`admin@college.com` / `admin123`).
- **On Success**: Navigation to the Admin Dashboard.
- **On Failure**: Error alert with correct credentials hint.

#### Additional Features
- "Forgot Password?" link placeholder.
- "New Student? Register Here" link for student tab.
- Links to Terms of Service and Privacy Policy at the bottom.
- Clean, centered card design with college logo and branding.

---

### 4.2 Student Registration Module

**Route**: `/register`

A comprehensive multi-section registration form for new students to create their accounts.

#### Form Sections

1. **Academic Information**
   - Full Name (required)
   - Gender (required) — Dropdown: Male, Female, Other
   - Registration Number (required, unique — validated against existing records)
   - Department — Dropdown: Computer Science, Mechanical, Electrical, Civil
   - Year of Study — Dropdown: 1st Year through 4th Year

2. **Contact Information**
   - Email Address (required)
   - Phone Number (required)
   - Parent/Guardian Name (required)
   - Parent/Guardian Phone Number (required)

3. **Profile Photo**
   - Optional image upload with live preview
   - File size validation (maximum 500KB for LocalStorage compatibility)
   - Stored as Base64 data URL

4. **Security**
   - Password (required, minimum 8 characters)
   - Confirm Password (must match)

#### Registration Logic
- **Duplicate Check**: Prevents registration if a student with the same Registration Number already exists.
- **Auto-Login**: Upon successful registration, the student is automatically logged in.
- **Initial Status**: New students are assigned a `Pending_Hostel` status, indicating they need to select a hostel.
- **Data Storage**: Student record is saved to the master `studentList` in LocalStorage (including password for future login validation). Session data (without password) is saved to `userData`.
- **Cleanup**: Any orphaned hostel requests from previous sessions for the same Registration Number are automatically removed.
- **Navigation**: After registration, the student is redirected to the Hostel Selection page to choose a hostel.

---

### 4.3 Student Dashboard

**Route**: `/student-dashboard` (Protected)

The central hub for students after login. Displays a personalized overview and provides quick access to all student features.

#### Layout

- **Sticky Navbar**: College logo, "HMS" branding, and Logout button.
- **Welcome Header**: Personalized greeting with the student's name.

#### Notification Banners (Auto-dismissing after 6 seconds)

The dashboard shows real-time notification banners for:
1. **Transfer Request Rejected** — Red banner with details of which hostel transfer was rejected. Can be manually dismissed.
2. **Transfer Request Approved** — Green banner confirming the hostel transfer approval and that allocation has been updated.
3. **Leave Request Status** — Green (Approved) or Red (Rejected) banner showing leave type, dates, and status.

Each notification is auto-dismissed after 6 seconds and marked as "seen" in LocalStorage to prevent re-showing.

#### Information Cards (Top Row — 3 columns)

1. **Profile Card**
   - Displays student's name, course/department, and registration number.
   - "View Full Profile" link to the Student Profile page.

2. **Hostel Allocation Card**
   - Shows the currently allocated hostel name, room number, and room type.
   - "Allocated" status badge.
   - "Change Hostel" button linking to the Hostel Selection page.

3. **Fee Status Card**
   - Displays outstanding fee amount (₹).
   - Color-coded indicator: Green dot with "No dues pending" or Red dot with "Payment Pending".

#### Data Synchronization
- On load, the dashboard syncs the student's session data with the master `studentList` to reflect any admin-side updates (e.g., fee changes, hostel reassignment).

#### Main Content Area (2-column layout)

1. **Announcements Section** (spans 2 columns)
   - Lists all notices posted by the admin with title, date, and description.
   - Empty state with bell icon and "No Announcements" message if no notices exist.
   - Each notice has a left border accent in the college's brand color.

2. **Quick Actions Panel** (right column, 2x2 grid + 1 full-width)
   - **Browse Hostels** — Navigate to Hostel Selection page.
   - **Food Menu** — Navigate to the Food Menu page.
   - **Leave Request** — Navigate to the Leave Application page.
   - **Complaints** — Navigate to the Complaint Submission page.
   - **Rules & Regulations** — Full-width button to the Hostel Rules page.
   - Each button features an icon with hover effects (icon color inversion on hover).

---

### 4.4 Hostel Selection & Transfer Module

**Route**: `/hostels`

A browsable catalog of all available hostels with the ability to request allocation (for new students) or transfer (for existing students).

#### Hostel Catalog Display

Each hostel is displayed as a card with:
- **Hostel Image** (or gradient placeholder with "Image Coming Soon" if no image exists).
- **Gender Badge** (top-right corner) — "Boys" or "Girls".
- **Hostel Name** and **Description**.
- **Statistics Panel**: Total Rooms, Free Rooms, Total Beds, Free Beds, Total Bathrooms.

#### Action Button Logic (per hostel card)

The button displayed on each card varies based on the user's context:

| Scenario | Button Displayed |
|---|---|
| New student (`Pending_Hostel` status) | **"Request Allocation"** (primary red button) |
| Already has a hostel & viewing current hostel | **"Current Hostel"** (disabled gray) |
| Has a pending request for THIS hostel | **"Waiting for Approval..."** (disabled blue) |
| Request for THIS hostel was approved | **"Request Approved"** (disabled green) |
| Has a pending request for ANOTHER hostel | **"Another Request Active"** (disabled gray) |
| Gender mismatch (e.g., Male student viewing Girls hostel) | **"Girls Only"** or **"Boys Only"** (disabled gray) |
| Existing student, no pending requests, compatible gender | **"Request Transfer"** (blue button) |

#### Gender-Based Restrictions
- Male students **cannot** request allocation to Girls-type hostels.
- Female students **cannot** request allocation to Boys-type hostels.
- Both genders can view all hostels but incompatible ones show a disabled button.

#### Single Pending Request Enforcement
- A student can have only **one** active pending request at a time.
- If a pending or approved request exists, all other hostels show "Another Request Active" (disabled).

#### Transfer Request Flow
1. Student clicks "Request Transfer" on a hostel card.
2. A **Transfer Modal** appears asking for a reason (e.g., "Nearer to my department").
3. On submission, a request is created with type `Transfer`, status `Pending`, and stored in `hostelChangeRequests` in LocalStorage.
4. Success alert: "Transfer Request Sent Successfully!"

#### New Allocation Flow
1. New student clicks "Request Allocation".
2. Request is created with type `Allocation`, status `Pending`.
3. Student's status is updated to `Pending_Approval` and hostel name shows "Pending Allocation".
4. A blue banner is displayed: "Your hostel allocation request is pending admin approval."

#### Rejection Banner
- If a previous request was rejected, a red banner appears at the top showing the rejected hostel name with a "Dismiss" button.

#### Hostel Details Modal
- Each card has a **"View Gallery & Details"** button.
- Opens a full-screen modal with two tabs:
  - **Room Photos** — Grid of room images (or "No room photos available" placeholder).
  - **Facility Photos** — Lists available facilities as tags + facility image gallery.

---

### 4.5 Room Selection Module

**Route**: `/room-selection?hostelId=<id>`

Allows students to browse and filter available rooms within a specific hostel.

#### Filters
- **Block Filter**: All Blocks, Block A, Block B.
- **Room Type Filter**: All Types, Single Room, Double Room.
- **Floor Filter**: All Floors, Ground Floor, 1st Floor, 2nd Floor.

#### Room Cards
Each room is displayed as a card with:
- **Room Number** (highlighted).
- **Availability Badge**: "Vacant" (green) or "Occupied" (gray).
- **Room Type** (Single/Double).
- **Capacity** indicator.
- **Apply Now** button (for vacant rooms) — Sends an application alert.
- **Full** button (disabled for occupied rooms).
- **Reset Filters** option if no rooms match the criteria.

---

### 4.6 Food Menu Module

**Route**: `/food-menu`

Displays the daily hostel food menu with a tabbed interface.

#### Tabs
- **Breakfast**, **Lunch**, **Snacks**, **Dinner** — Toggle between meal times.

#### Menu Display
- Supports two data formats:
  - **Structured Array**: Each item displayed as a card with name, Veg/Non-Veg badge (green/red), calorie count, and star rating.
  - **Plain Text**: Displays the admin-entered text as-is (for simple menu updates).
- **Empty State**: "No menu items available for this time."
- Data is loaded from LocalStorage (`foodMenu`) or falls back to mock data.

---

### 4.7 Leave Application Module

**Route**: `/leave-application`

Allows students to submit leave requests and view their application history.

#### Leave Application Form (Left Panel)
- **Leave Type**: Weekend, Medical, Emergency, Other.
- **Date Range**: From and To date pickers.
- **Reason**: Text area for explanation.
- **Supporting Document**: Optional file upload.
- **Submit Button**: Creates a leave request with `Pending` status, saves to `leaveRequests` in LocalStorage.

#### Application History (Right Panel)
- Lists all past leave requests with:
  - Leave type and date range.
  - Status badge — color-coded: Approved (green), Rejected (red), Pending (orange).
  - Reason text (italicized).
- **Empty State**: "No leave history found."

---

### 4.8 Complaint Submission Module

**Route**: `/complaints`

Enables students to file complaints with optional photo evidence and track their complaint history.

#### Complaint Form (Left Panel)
- **Category**: Infrastructure, Food Quality, Cleanliness, Discipline, Other.
- **Description**: Detailed text area.
- **Photo Upload**: Optional image attachment with live preview. Images are encoded as Base64 and stored in LocalStorage.
- **Submit Button**: Creates a complaint with `Pending` status, saves to `complaintList`.

#### My Complaints History (Right Panel)
- Lists all complaints filed by the current student with:
  - Category badge (color-coded by type — blue for Infrastructure, orange for Food, purple for others).
  - Date of submission.
  - Status badge: Pending (yellow) or Resolved (green).
  - Complaint description text.
  - Attached photo thumbnail (if any).
  - "Admin marked as resolved" note for resolved complaints.

---

### 4.9 Hostel Rules & Regulations Module

**Route**: `/rules`

A static informational page displaying the hostel rules, organized into three sections:

1. **Hostel Timings** (Blue accent)
   - Main gate closing time (9:30 PM).
   - Meal timings: Breakfast (7:30–9:00 AM), Lunch (12:30–2:00 PM), Dinner (7:30–9:00 PM).
   - Silence hours: 10:00 PM to 6:00 AM.

2. **Cleanliness & Hygiene** (Green accent)
   - Room cleanliness responsibilities.
   - Garbage disposal rules.
   - No food consumption in bedrooms.
   - Weekly room inspection schedule.

3. **Safety & Conduct** (Red accent)
   - Zero-tolerance anti-ragging policy.
   - Prohibition of alcohol, tobacco, and drugs.
   - Electrical appliance restrictions.
   - Visitor timing rules (4:00–6:00 PM weekends).
   - Mandatory ID card display.

---

### 4.10 Student Profile Module

**Route**: `/profile`

Displays the student's complete profile with a visually rich layout.

#### Profile Header
- Gradient header banner (college brand colors).
- Circular profile photo (or default user icon placeholder).
- Student name and department/course.

#### Profile Details (Two-column grid)

1. **Academic Info**
   - Gender
   - Registration Number (monospaced font)
   - Department
   - Year of Study

2. **Contact Info**
   - Email Address
   - Phone Number
   - Parent/Guardian Name and Phone

#### Allocation Details (Bottom section)
- Hostel Block name (or "Not Allocated").
- Room Number (or "-").

#### Data Synchronization
- On load, profile data is synced with the master `studentList` to reflect any admin-side updates.

---

### 4.11 Admin Dashboard

**Route**: `/admin-dashboard`

A comprehensive administrative panel with a sidebar navigation and 8 distinct management sections. The admin dashboard features both desktop (sidebar) and mobile (hamburger menu drawer) responsive layouts.

#### Sidebar Navigation

| Section | Icon | Description |
|---|---|---|
| Dashboard | Home | Overview with statistics and charts |
| Admissions & Transfers | ArrowRightLeft | Review and process student requests |
| Manage Students | Users | Full CRUD operations on student records |
| Manage Hostels | BedDouble | Full CRUD operations on hostel records |
| Food Menu | Utensils | Edit daily food menu |
| Complaints | AlertCircle | View and manage student complaints |
| Leave Requests | Calendar | Approve or reject leave requests |
| Notice Board | Bell | Post and manage announcements |

---

#### 4.11.1 Dashboard Overview

Displays four key **summary statistic cards**:
- **Pending Leaves** — Count of leave requests with "Pending" status.
- **Total Hostels** — Number of registered hostels.
- **Active Students** — Total number of students in the system.
- **Open Complaints** — Count of complaints with "Pending" status.

**Hostel Occupancy Chart**:
- Visual progress bars for each hostel showing occupancy percentage.
- Color-coded: Green (< 50%), Orange (50–79%), Red (≥ 80%).
- Calculated as: `(Total Rooms − Available Rooms) / Total Rooms × 100`.

---

#### 4.11.2 Admissions & Transfers

Manages all hostel allocation and transfer requests from students.

**Request List Display**:
- Separate sections for **New Admission Requests** (type: Allocation) and **Transfer Requests** (type: Transfer).
- Each request card shows:
  - Student Name and Registration Number.
  - Request type and date.
  - Current Hostel → Requested Hostel.
  - Reason for request.
  - Status badge (Pending, Approved, Rejected, etc.).
  - **"View Full Application"** button — Opens an Applicant Details Modal.

**Applicant Details Modal**:
- Full student profile including name, registration number, department, year, email, phone, parent details, gender, and profile image.

**Admin Actions (for Pending requests)**:
- **Approve** — Allocates the student to the requested hostel, updates the student's record in `studentList`, updates hostel occupancy (decrements available rooms/beds), and updates the student's `userData` session with the new hostel.
- **Reject** — Reverts the student's status (back to `Pending_Hostel` for new allocations, or `Active` for transfers), and preserves the student's current hostel.

---

#### 4.11.3 Manage Students

Full **CRUD** (Create, Read, Update, Delete) interface for student records.

**Student List**:
- **Search Bar**: Search by student name or registration number.
- **Hostel Filter**: Filter by specific hostel.
- **Desktop View**: Table with columns — Name, Reg. No, Hostel, Room, Fee Status, Actions.
- **Mobile View**: Card-based layout with the same information.
- **Fee Status**: Color-coded badge — "Paid" (green) for zero dues, "Due: ₹X" (red) for outstanding fees.

**Add/Edit Student Modal**:
- Sections: Academic Info (Name, Reg No, Department, Year), Contact Info (Email, Phone, Parent Name, Parent Phone), Allocation (Hostel dropdown, Room number), Fee Details (Fee Due amount).
- On save, the student list in LocalStorage is updated.

**Delete Student**:
- Confirmation dialog before deletion.
- Removes the student from the `studentList`.

---

#### 4.11.4 Manage Hostels

Full **CRUD** interface for hostel records.

**Hostel Grid**:
- Card layout (3 columns on desktop) with hostel image, name, description, facilities tags, and statistics (Rooms, Free Rooms, Beds, Free Beds, Bathrooms).
- Edit and Delete buttons on each card.

**Add/Edit Hostel Modal**:
- Fields: Hostel Name, Type (Boys/Girls), Total Rooms, Free Rooms, Total Beds, Free Beds, Total Bathrooms, Description, Hostel Photo URL, Facilities (comma-separated), Room Photos (URL list), Facility Photos (URL list).
- On save, updates `hostelData` in LocalStorage.

**Delete Hostel**:
- Confirmation dialog before deletion.

---

#### 4.11.5 Food Menu Management

Admin can edit the food menu for each meal time.

- **Meal Tabs**: Breakfast, Lunch, Snacks, Dinner.
- **Text Area Editor**: Admin enters menu items as plain text for each meal.
- **Save Button**: Persists the menu to `foodMenu` in LocalStorage. Students see the updated menu on the Food Menu page.

---

#### 4.11.6 Complaint Management

View and manage all student complaints.

**Complaint List**:
- Each complaint card shows:
  - Category type badge.
  - Complaint description.
  - Attached photo (clickable for full-screen preview).
  - Student who raised it.
  - Date of submission.

**Status Management**:
- Admin can change status via dropdown: Pending → In Progress → Resolved.
- Status changes are persisted to LocalStorage.

**Image Preview Modal**:
- Full-screen lightbox for viewing complaint photos.

---

#### 4.11.7 Leave Request Management

Review and act on student leave requests.

**Leave Request List**:
- Each request shows: Student Name, Registration Number, Leave Type, Date Range, Reason, and Status.
- **Admin Actions**: Approve or Reject buttons for pending requests.
- Status changes are saved to `leaveRequests` in LocalStorage.
- Students see the updated status as notification banners on their dashboard.

---

#### 4.11.8 Notice Board Management

Post and manage announcements visible to all students.

**Notice List**:
- Displays all posted notices with title, date, description, and a delete button.

**Post New Notice**:
- Modal with Title and Description fields.
- On posting, the notice is added to `announcements` in LocalStorage and immediately appears on student dashboards.

**Delete Notice**:
- Confirmation dialog before deletion.

---

### 4.12 Terms of Service & Privacy Policy

**Routes**: `/terms`, `/privacy`

Static informational pages providing legal and policy information for the hostel management system.

---

### 4.13 Error Boundary Component

A global `ErrorBoundary` component wraps the entire application, catching JavaScript errors during rendering and displaying a fallback UI instead of a blank screen. This ensures graceful error recovery for the end user.

---

## 5. Cross-Cutting Features

### 5.1 Responsive Design
- Fully responsive across desktop, tablet, and mobile devices.
- Admin Dashboard features a sidebar on desktop and a hamburger menu drawer on mobile.
- Student lists switch between table view (desktop) and card view (mobile).
- Modals are scrollable on small screens.

### 5.2 Real-Time Notifications
- Student Dashboard displays auto-dismissing notification banners (6-second timeout) for:
  - Hostel transfer approvals and rejections.
  - Leave request status updates.
- Notifications are marked as "seen" to prevent re-display.

### 5.3 Data Synchronization
- Student Dashboard and Profile pages sync with the master `studentList` on every load to reflect admin-side changes (fee updates, hostel reassignment, etc.).
- Hostel occupancy data is updated in real-time when allocation requests are approved.

### 5.4 Input Validation
- Required field validation on all forms.
- Password minimum length (8 characters) and match validation.
- Duplicate Registration Number check during registration.
- File size validation for profile photo and complaint image uploads (max 500KB).

### 5.5 Visual Design
- Clean, modern UI with Tailwind CSS utility classes.
- College brand color: `#991B1B` (Maroon/Dark Red).
- Consistent card-based design language.
- Hover effects and smooth transitions throughout.
- Color-coded status badges and indicators.
- Lucide React icon library for consistent iconography.

---

## 6. Default / Sample Data

The system comes pre-loaded with sample data for demonstration:

### Sample Hostels (7 hostels)
| Hostel Name | Type | Total Rooms | Facilities |
|---|---|---|---|
| St Thomas Hostel | Boys | 50 | Study Hall, Wi-Fi, Indoor Games, 24/7 Water |
| St Berchmans Hostel | Boys | 60 | Gym, Wi-Fi, TV Room, Spacious Garden |
| Sahrudaya Hostel | Boys | 45 | Library, Wi-Fi, Prayer Hall, Mess Hall |
| St Joseph's Hostel | Boys | 55 | Attached Bathrooms, Wi-Fi, Canteen, Laundry |
| St Thomas Moore Hostel | Boys | 40 | — |
| Pope John Paul II Hostel | Boys | 70 | — |
| St Mary's Hostel | Girls | 80 | Security 24/7, Wi-Fi, Study Area, Recreation Room |

### Sample Students (4 students)
| Name | Reg No | Department | Hostel | Status |
|---|---|---|---|---|
| Rahul Kumar | CS2023001 | Computer Science | St Thomas Hostel | Active |
| Aditya Singh | ME2023045 | Mechanical | St Berchmans Hostel | Warning |
| Sneha Reddy | EC2023112 | Electrical | St Mary's Hostel | Active |
| Arjun Das | CV2023088 | Civil | St Thomas Hostel | Active |

---

## 7. Admin Credentials

| Field | Value |
|---|---|
| Email | `admin@college.com` |
| Password | `admin123` |

---

## 8. How to Run the Project

```bash
# Install dependencies
npm install

# Start the development server
npm run dev

# Build for production
npm run build

# Preview the production build
npm run preview
```

The application will be available at `http://localhost:5173` (default Vite port).

---

*Prepared for: St Berchmans College (Autonomous), Changanacherry*
*Project: Hostel Management System*
*Technology: React.js + Vite + Tailwind CSS*
