import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// ─── Shared Helpers ──────────────────────────────────────────────────────────

const BRAND_COLOR = [153, 27, 27]; // #991B1B
const GRAY = [107, 114, 128];

/**
 * Adds a branded header + footer to every page of the PDF.
 */
const addBranding = (doc, title) => {
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);

        // Header bar
        doc.setFillColor(...BRAND_COLOR);
        doc.rect(0, 0, doc.internal.pageSize.width, 32, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(16);
        doc.setTextColor(255, 255, 255);
        doc.text(title, 14, 21);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.text('Hostel Management System', doc.internal.pageSize.width - 14, 21, { align: 'right' });

        // Footer
        doc.setFontSize(8);
        doc.setTextColor(...GRAY);
        const footerY = doc.internal.pageSize.height - 10;
        doc.text(
            `Generated on ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}`,
            14,
            footerY
        );
        doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.width - 14, footerY, { align: 'right' });
    }
};

/**
 * Creates and downloads a PDF document.
 */
const downloadPdf = (doc, filename) => {
    doc.save(filename);
};

// ─── Student List Export ─────────────────────────────────────────────────────

export const exportStudentList = (students, hostels) => {
    const doc = new jsPDF();

    // Summary stats
    const totalStudents = students.length;
    const activeStudents = students.filter(s => s.status === 'Active').length;
    const totalFeesDue = students.reduce((sum, s) => sum + (s.feeDue || 0), 0);

    doc.setFontSize(10);
    doc.setTextColor(...GRAY);
    doc.text(`Total Students: ${totalStudents}  |  Active: ${activeStudents}  |  Total Fees Due: ₹${totalFeesDue.toLocaleString('en-IN')}`, 14, 42);

    autoTable(doc, {
        startY: 50,
        head: [['#', 'Name', 'Reg No', 'Department', 'Hostel', 'Room', 'Status', 'Fee Due']],
        body: students.map((s, i) => [
            i + 1,
            s.name,
            s.regNo,
            s.department || '-',
            s.hostel || 'Not Allocated',
            s.room || '-',
            s.status || 'Active',
            s.feeDue > 0 ? `₹${s.feeDue.toLocaleString('en-IN')}` : 'Paid',
        ]),
        theme: 'grid',
        headStyles: { fillColor: BRAND_COLOR, fontSize: 9, fontStyle: 'bold' },
        bodyStyles: { fontSize: 8 },
        alternateRowStyles: { fillColor: [249, 250, 251] },
        styles: { cellPadding: 3, lineColor: [229, 231, 235], lineWidth: 0.25 },
    });

    addBranding(doc, 'Student List Report');
    downloadPdf(doc, `Student_List_${new Date().toISOString().slice(0, 10)}.pdf`);
};

// ─── Complaint Report Export ─────────────────────────────────────────────────

export const exportComplaintReport = (complaints) => {
    const doc = new jsPDF();

    const pending = complaints.filter(c => c.status === 'Pending').length;
    const inProgress = complaints.filter(c => c.status === 'In Progress').length;
    const resolved = complaints.filter(c => c.status === 'Resolved').length;

    doc.setFontSize(10);
    doc.setTextColor(...GRAY);
    doc.text(`Total: ${complaints.length}  |  Pending: ${pending}  |  In Progress: ${inProgress}  |  Resolved: ${resolved}`, 14, 42);

    autoTable(doc, {
        startY: 50,
        head: [['#', 'Type', 'Description', 'Raised By', 'Date', 'Status']],
        body: complaints.map((c, i) => [
            i + 1,
            c.type || '-',
            c.desc || '-',
            c.student || '-',
            c.date || '-',
            c.status || 'Pending',
        ]),
        theme: 'grid',
        headStyles: { fillColor: BRAND_COLOR, fontSize: 9, fontStyle: 'bold' },
        bodyStyles: { fontSize: 8 },
        alternateRowStyles: { fillColor: [249, 250, 251] },
        styles: { cellPadding: 3, lineColor: [229, 231, 235], lineWidth: 0.25 },
        columnStyles: { 2: { cellWidth: 60 } },
    });

    addBranding(doc, 'Complaint Report');
    downloadPdf(doc, `Complaints_${new Date().toISOString().slice(0, 10)}.pdf`);
};

// ─── Leave Request Export ────────────────────────────────────────────────────

export const exportLeaveRequests = (requests) => {
    const doc = new jsPDF('landscape');

    const approved = requests.filter(r => r.status === 'Approved').length;
    const rejected = requests.filter(r => r.status === 'Rejected').length;
    const pending = requests.filter(r => r.status === 'Pending').length;

    doc.setFontSize(10);
    doc.setTextColor(...GRAY);
    doc.text(`Total: ${requests.length}  |  Approved: ${approved}  |  Rejected: ${rejected}  |  Pending: ${pending}`, 14, 42);

    autoTable(doc, {
        startY: 50,
        head: [['#', 'Student', 'Reg No', 'Leave Type', 'From', 'To', 'Reason', 'Status']],
        body: requests.map((r, i) => [
            i + 1,
            r.studentName || '-',
            r.regNo || '-',
            r.type || '-',
            r.from || r.fromDate || '-',
            r.to || r.toDate || '-',
            r.reason || '-',
            r.status || 'Pending',
        ]),
        theme: 'grid',
        headStyles: { fillColor: BRAND_COLOR, fontSize: 9, fontStyle: 'bold' },
        bodyStyles: { fontSize: 8 },
        alternateRowStyles: { fillColor: [249, 250, 251] },
        styles: { cellPadding: 3, lineColor: [229, 231, 235], lineWidth: 0.25 },
        columnStyles: { 6: { cellWidth: 70 } },
    });

    addBranding(doc, 'Leave Requests Report');
    downloadPdf(doc, `Leave_Requests_${new Date().toISOString().slice(0, 10)}.pdf`);
};

// ─── Hostel Occupancy Export ─────────────────────────────────────────────────

export const exportHostelOccupancy = (hostels) => {
    const doc = new jsPDF();

    const totalRooms = hostels.reduce((s, h) => s + (h.totalRooms || 0), 0);
    const freeRooms = hostels.reduce((s, h) => s + (h.availableRooms || 0), 0);
    const totalBeds = hostels.reduce((s, h) => s + (h.totalBeds || 0), 0);
    const freeBeds = hostels.reduce((s, h) => s + (h.availableBeds || 0), 0);

    doc.setFontSize(10);
    doc.setTextColor(...GRAY);
    doc.text(`Total Rooms: ${totalRooms}  |  Free: ${freeRooms}  |  Total Beds: ${totalBeds}  |  Free: ${freeBeds}`, 14, 42);

    autoTable(doc, {
        startY: 50,
        head: [['#', 'Hostel Name', 'Type', 'Total Rooms', 'Free Rooms', 'Total Beds', 'Free Beds', 'Bathrooms', 'Occupancy']],
        body: hostels.map((h, i) => {
            const occupancy = h.totalRooms > 0
                ? Math.round(((h.totalRooms - h.availableRooms) / h.totalRooms) * 100)
                : 0;
            return [
                i + 1,
                h.name,
                h.type || '-',
                h.totalRooms || 0,
                h.availableRooms || 0,
                h.totalBeds || 0,
                h.availableBeds || 0,
                h.totalBathrooms || 0,
                `${occupancy}%`,
            ];
        }),
        theme: 'grid',
        headStyles: { fillColor: BRAND_COLOR, fontSize: 9, fontStyle: 'bold' },
        bodyStyles: { fontSize: 8 },
        alternateRowStyles: { fillColor: [249, 250, 251] },
        styles: { cellPadding: 3, lineColor: [229, 231, 235], lineWidth: 0.25 },
    });

    addBranding(doc, 'Hostel Occupancy Report');
    downloadPdf(doc, `Hostel_Occupancy_${new Date().toISOString().slice(0, 10)}.pdf`);
};
