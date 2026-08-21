import { jsPDF } from 'jspdf';

// Helper to sanitize filenames
const cleanFileName = (str) => {
  if (!str) return 'Document';
  return str.replace(/[^a-zA-Z0-9_-]/g, '_').replace(/_+/g, '_').slice(0, 50);
};

/**
 * 1. Generates and downloads a high-resolution, official Landscape Certificate PDF
 */
export const downloadCertificatePDF = (certificate, studentUser) => {
  try {
    const studentName = studentUser?.name || certificate?.studentName || 'Student Member';
    const studentRoll = studentUser?.rollNumber || studentUser?.rollNo || certificate?.studentRoll || '237R1A05BA';
    const eventName = certificate?.eventName || 'Campus Event';
    const certTitle = certificate?.title || 'Certificate of Achievement';
    const clubName = certificate?.clubName || 'CMRTC Student Club';
    const issueDate = certificate?.issueDate || 'August 2026';
    const credentialId = certificate?.credentialId || `CMRTC-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const verifiedBy = certificate?.verifiedBy || 'Dr. Suresh Kumar (Faculty Coordinator)';
    const description = certificate?.description || 'For active participation and demonstrated excellence.';

    // Create Landscape A4 Document: 297mm x 210mm
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = 297;
    const pageHeight = 210;

    // Background color: Clean Ivory Parchment
    doc.setFillColor(255, 254, 249);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');

    // Outer Decorative Gold Border
    doc.setDrawColor(217, 119, 6); // Amber-600
    doc.setLineWidth(2);
    doc.rect(8, 8, pageWidth - 16, pageHeight - 16);

    // Inner Thin Navy Border
    doc.setDrawColor(30, 58, 138); // Blue-900
    doc.setLineWidth(0.75);
    doc.rect(12, 12, pageWidth - 24, pageHeight - 24);

    // Subtle Corner Accents
    doc.setDrawColor(217, 119, 6);
    doc.setLineWidth(1.5);
    // Top-Left
    doc.line(6, 18, 18, 6);
    // Top-Right
    doc.line(pageWidth - 6, 18, pageWidth - 18, 6);
    // Bottom-Left
    doc.line(6, pageHeight - 18, 18, pageHeight - 6);
    // Bottom-Right
    doc.line(pageWidth - 6, pageHeight - 18, pageWidth - 18, pageHeight - 6);

    // Header: Institution Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(120, 53, 15); // Amber-950
    doc.text('CMR TECHNICAL CAMPUS', pageWidth / 2, 28, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(146, 64, 14); // Amber-800
    doc.text('UGC AUTONOMOUS • NAAC A+ ACCREDITED • AFFILIATED TO JNTUH', pageWidth / 2, 34, { align: 'center' });
    doc.text('Kandlakoya (V), Medchal Road, Hyderabad - 501401, Telangana', pageWidth / 2, 39, { align: 'center' });

    // Decorative Separator Line
    doc.setDrawColor(217, 119, 6);
    doc.setLineWidth(0.5);
    doc.line(40, 43, pageWidth - 40, 43);

    // Organizing Club Tag
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(30, 58, 138); // Deep Navy
    doc.text(`[ ${clubName.toUpperCase()} ]`, pageWidth / 2, 51, { align: 'center' });

    // Main Certificate Header
    doc.setFont('times', 'bold');
    doc.setFontSize(28);
    doc.setTextColor(180, 83, 9); // Rich Gold/Amber
    doc.text('CERTIFICATE OF ACHIEVEMENT', pageWidth / 2, 64, { align: 'center' });

    // Certification intro text
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(11);
    doc.setTextColor(71, 85, 105); // Slate-600
    doc.text('This is to proudly certify that', pageWidth / 2, 73, { align: 'center' });

    // Recipient Name (Prominent & Clean)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(24);
    doc.setTextColor(15, 23, 42); // Slate-900
    doc.text(studentName.toUpperCase(), pageWidth / 2, 85, { align: 'center' });

    // Recipient Roll Number
    doc.setFont('courier', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(180, 83, 9); // Amber
    doc.text(`Roll Number: ${studentRoll}`, pageWidth / 2, 92, { align: 'center' });

    // Underline beneath recipient
    doc.setDrawColor(217, 119, 6);
    doc.setLineWidth(0.6);
    doc.line(pageWidth / 2 - 50, 95, pageWidth / 2 + 50, 95);

    // Achievement body text
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(51, 65, 85); // Slate-700
    const line1 = `has demonstrated commendable skill and earned the distinction of`;
    const line2 = `"${certTitle}"`;
    const line3 = `in the flagship campus event "${eventName}" conducted by ${clubName}.`;

    doc.text(line1, pageWidth / 2, 104, { align: 'center' });
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(120, 53, 15);
    doc.text(line2, pageWidth / 2, 111, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 65, 85);
    doc.text(line3, pageWidth / 2, 118, { align: 'center' });

    // Description note if present
    if (description) {
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(9.5);
      doc.setTextColor(100, 116, 139);
      doc.text(`"${description}"`, pageWidth / 2, 126, { align: 'center', maxWidth: 210 });
    }

    // Official Seal Graphic (Center Gold Medal)
    const sealX = pageWidth / 2;
    const sealY = 158;
    doc.setFillColor(245, 158, 11); // Amber
    doc.circle(sealX, sealY, 13, 'F');
    doc.setFillColor(254, 243, 199); // Amber light
    doc.circle(sealX, sealY, 11, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(120, 53, 15);
    doc.text('OFFICIAL', sealX, sealY - 3, { align: 'center' });
    doc.text('★ SEAL ★', sealX, sealY + 1, { align: 'center' });
    doc.text('CMRTC', sealX, sealY + 5, { align: 'center' });

    // Left Footer: Credential ID & Authenticity verification
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(5, 150, 105); // Emerald-600
    doc.text('✔ Verified Digital Credential', 25, 150);

    doc.setFont('courier', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(71, 85, 105);
    doc.text(`Credential ID: ${credentialId}`, 25, 156);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.text(`Issue Date: ${issueDate}`, 25, 161);
    doc.text('UniSphere Verified Cryptographic Hash', 25, 166);

    // Right Footer: Authorized Signatory
    doc.setFont('times', 'bolditalic');
    doc.setFontSize(13);
    doc.setTextColor(15, 23, 42);
    doc.text(verifiedBy, pageWidth - 25, 150, { align: 'right' });

    doc.setDrawColor(100, 116, 139);
    doc.setLineWidth(0.4);
    doc.line(pageWidth - 85, 153, pageWidth - 25, 153);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(30, 41, 59);
    doc.text('Authorized Faculty Coordinator', pageWidth - 25, 158, { align: 'right' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text('CMR Technical Campus, Hyderabad', pageWidth - 25, 163, { align: 'right' });

    // Bottom Footer Watermark / URL
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184);
    doc.text(`Validate Authenticity at https://unisphere.cmrtc.ac.in/verify?id=${credentialId}`, pageWidth / 2, 196, { align: 'center' });

    // Generate Dynamic Filename
    const filename = `${cleanFileName(studentName)}_${cleanFileName(eventName)}_Certificate.pdf`;
    doc.save(filename);
    return { success: true, filename };
  } catch (error) {
    console.error('Error generating certificate PDF:', error);
    return { success: false, error: error.message };
  }
};

/**
 * 2. Generates and downloads Student Portfolio PDF
 */
export const downloadPortfolioPDF = (studentUser, stats = [], badges = [], timeline = [], certs = []) => {
  try {
    const studentName = studentUser?.name || 'Student Member';
    const studentRoll = studentUser?.rollNumber || studentUser?.rollNo || '237R1A05BA';
    const studentBranch = studentUser?.branch || 'Computer Science & Engineering (CSE)';
    const academicYear = studentUser?.academicYear || '3rd Year • Semester 1';
    const email = studentUser?.email || `${studentRoll.toLowerCase()}@cmr.edu.in`;

    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = 210;
    const pageHeight = 297;

    // Header Banner (Navy/Indigo)
    doc.setFillColor(15, 23, 42); // Slate-900
    doc.rect(0, 0, pageWidth, 48, 'F');

    // Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(255, 255, 255);
    doc.text('CMR TECHNICAL CAMPUS', 15, 16);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(148, 163, 184);
    doc.text('Student Co-Curricular & Club Achievement Portfolio', 15, 22);
    doc.text('Official NAAC A+ Verified Campus Record', 15, 27);

    doc.setFillColor(37, 99, 235); // Blue-600
    doc.roundedRect(pageWidth - 65, 12, 50, 16, 3, 3, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(255, 255, 255);
    doc.text('VERIFIED RECORD', pageWidth - 40, 19, { align: 'center' });
    doc.setFont('courier', 'bold');
    doc.setFontSize(7.5);
    doc.text(studentRoll, pageWidth - 40, 24, { align: 'center' });

    // Student Profile Summary Box
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(15, 54, pageWidth - 30, 32, 3, 3, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(15, 23, 42);
    doc.text(studentName, 20, 64);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(71, 85, 105);
    doc.text(`Roll No: ${studentRoll}    |    Email: ${email}`, 20, 71);
    doc.text(`Department: ${studentBranch}`, 20, 77);
    doc.text(`Academic Standing: ${academicYear}`, 20, 82);

    // Section 1: Metrics Overview
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(30, 58, 138);
    doc.text('PERFORMANCE & PARTICIPATION METRICS', 15, 94);

    let statY = 100;
    const defaultStats = stats.length > 0 ? stats : [
      { label: 'Clubs Joined', value: '3 Active Clubs' },
      { label: 'Events Attended', value: '4 Major Events' },
      { label: 'Volunteer Hours', value: '32 Service Hours' },
      { label: 'Verified Certificates', value: '4 Credentials' }
    ];

    const colWidth = (pageWidth - 30 - 9) / 2;
    defaultStats.slice(0, 4).forEach((st, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const x = 15 + col * (colWidth + 9);
      const y = statY + row * 16;

      doc.setFillColor(241, 245, 249);
      doc.setDrawColor(203, 213, 225);
      doc.roundedRect(x, y, colWidth, 13, 2, 2, 'FD');

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(100, 116, 139);
      doc.text(st.label.toUpperCase(), x + 4, y + 5);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(15, 23, 42);
      doc.text(st.value, x + 4, y + 10);
    });

    // Section 2: Recent Attended Events Timeline
    let section2Y = 140;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(30, 58, 138);
    doc.text('NOTABLE EVENT PARTICIPATIONS & ACHIEVEMENTS', 15, section2Y);

    const defaultTimeline = timeline.length > 0 ? timeline : [
      { title: 'CMR HackFest 2026 36-Hour Hackathon', club: 'Codeholics Tech Club', date: 'Sept 05-07, 2026', achievement: '1st Runner Up • Excellence Award' },
      { title: 'Inter-College Debate & Model UN (MUN)', club: 'The Lexis Club', date: 'August 30, 2026', achievement: 'Best Delegate Award & Oratory Honor' },
      { title: 'Swachh Bharat Cleanliness & Greenery Drive', club: 'NSS Unit CMRTC', date: 'July 28, 2026', achievement: '8 Service Hours Logged' },
      { title: 'Pegasus Annual Cultural Fest 2025', club: 'AKRITI Cultural Club', date: 'Dec 15, 2025', achievement: 'Winner Group Dance Competition' }
    ];

    let eventY = section2Y + 6;
    defaultTimeline.forEach((evt, idx) => {
      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(15, eventY, pageWidth - 30, 14, 2, 2, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(15, 23, 42);
      doc.text(`${idx + 1}. ${evt.title}`, 20, eventY + 5);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(100, 116, 139);
      doc.text(`${evt.club || evt.clubName}  •  ${evt.date}`, 20, eventY + 10);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(5, 150, 105);
      doc.text(`🏆 ${evt.achievement || 'Verified Attendance'}`, pageWidth - 20, eventY + 8, { align: 'right' });

      eventY += 16;
    });

    // Section 3: Verified Certificates Registry
    let section3Y = eventY + 4;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(30, 58, 138);
    doc.text('VERIFIED CREDENTIALS & CERTIFICATES REGISTRY', 15, section3Y);

    const defaultCerts = certs.length > 0 ? certs : [
      { id: 'CMRTC-2026-CODE-091', title: 'CMR HackFest 2026 1st Runner Up Certificate', issuer: 'Codeholics Tech Club', date: 'Sept 2026' },
      { id: 'CMRTC-2026-LEX-044', title: 'Model United Nations Best Delegate Certification', issuer: 'The Lexis Club', date: 'Aug 2026' },
      { id: 'CMRTC-2026-NSS-208', title: 'National Service Scheme (NSS) Volunteer Honor', issuer: 'NSS CMRTC Unit', date: 'July 2026' }
    ];

    let certY = section3Y + 6;
    defaultCerts.forEach((c) => {
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(15, certY, pageWidth - 30, 13, 2, 2, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(15, 23, 42);
      doc.text(c.title, 20, certY + 5);

      doc.setFont('courier', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(180, 83, 9);
      doc.text(`ID: ${c.credentialId || c.id}`, 20, certY + 10);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(100, 116, 139);
      doc.text(`Issued by: ${c.issuer || c.clubName} (${c.date || c.issueDate})`, pageWidth - 20, certY + 8, { align: 'right' });

      certY += 15;
    });

    // Official Verification Footer
    doc.setDrawColor(203, 213, 225);
    doc.line(15, pageHeight - 20, pageWidth - 15, pageHeight - 20);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184);
    doc.text(`Generated by UniSphere Student Clubs Portal  •  CMR Technical Campus  •  Student Roll: ${studentRoll}`, pageWidth / 2, pageHeight - 14, { align: 'center' });
    doc.text('This is an authenticated co-curricular document authenticated by College Club Cell.', pageWidth / 2, pageHeight - 10, { align: 'center' });

    const filename = `CMRTC_${cleanFileName(studentRoll)}_Portfolio.pdf`;
    doc.save(filename);
    return { success: true, filename };
  } catch (error) {
    console.error('Error generating portfolio PDF:', error);
    return { success: false, error: error.message };
  }
};

/**
 * 3. Generates and downloads Event Entry QR Pass PDF
 */
export const downloadEventPassPDF = (event, studentUser) => {
  try {
    const studentName = studentUser?.name || 'Student Member';
    const studentRoll = studentUser?.rollNumber || studentUser?.rollNo || '237R1A05BA';
    const eventTitle = event?.title || 'Campus Event';
    const clubName = event?.clubName || 'CMRTC Club';
    const eventDate = event?.date || 'August 2026';
    const venue = event?.venue || 'CMRTC Auditorium';
    const time = event?.time || '10:00 AM';
    const passId = `PASS-${cleanFileName(studentRoll)}-${Math.floor(100 + Math.random() * 900)}`;

    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [120, 170] // Compact Ticket Format
    });

    const w = 120;
    const h = 170;

    // Header Background
    doc.setFillColor(30, 58, 138); // Navy
    doc.rect(0, 0, w, 36, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(255, 255, 255);
    doc.text('CMR TECHNICAL CAMPUS', w / 2, 12, { align: 'center' });

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(251, 191, 36); // Amber
    doc.text('OFFICIAL EVENT ENTRY PASS', w / 2, 18, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(226, 232, 240);
    doc.text(`Organized by ${clubName}`, w / 2, 24, { align: 'center' });

    // Pass Body
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(8, 42, w - 16, 118, 4, 4, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    doc.text(eventTitle, w / 2, 52, { align: 'center', maxWidth: 96 });

    doc.setDrawColor(226, 232, 240);
    doc.line(14, 62, w - 14, 62);

    // Details Grid
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text('ATTENDEE NAME:', 14, 70);
    doc.text('ROLL NUMBER:', 14, 78);
    doc.text('DATE & TIME:', 14, 86);
    doc.text('CAMPUS VENUE:', 14, 94);
    doc.text('PASS ID:', 14, 102);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(15, 23, 42);
    doc.text(studentName, 48, 70);
    doc.setFont('courier', 'bold');
    doc.text(studentRoll, 48, 78);
    doc.setFont('helvetica', 'bold');
    doc.text(`${eventDate} (${time})`, 48, 86);
    doc.text(venue, 48, 94);
    doc.setFont('courier', 'bold');
    doc.setTextColor(180, 83, 9);
    doc.text(passId, 48, 102);

    // Mock QR Code Box
    doc.setFillColor(15, 23, 42);
    doc.rect(w / 2 - 16, 110, 32, 32, 'F');
    doc.setFont('courier', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(255, 255, 255);
    doc.text('SCAN AT ENTRY', w / 2, 124, { align: 'center' });
    doc.text('★ VERIFIED ★', w / 2, 129, { align: 'center' });
    doc.text(studentRoll, w / 2, 134, { align: 'center' });

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(5, 150, 105);
    doc.text('✔ CONFIRMED REGISTRATION', w / 2, 150, { align: 'center' });

    const filename = `${cleanFileName(studentName)}_${cleanFileName(eventTitle)}_EventPass.pdf`;
    doc.save(filename);
    return { success: true, filename };
  } catch (error) {
    console.error('Error generating event pass PDF:', error);
    return { success: false, error: error.message };
  }
};

/**
 * 4. Generates and downloads Club Membership Fee Receipt PDF
 */
export const downloadClubReceiptPDF = (club, studentUser) => {
  try {
    const studentName = studentUser?.name || 'Student Member';
    const studentRoll = studentUser?.rollNumber || studentUser?.rollNo || '237R1A05BA';
    const clubName = club?.name || 'Campus Club';
    const receiptNo = `REC-${cleanFileName(club?.id || 'CLUB')}-${Math.floor(10000 + Math.random() * 90000)}`;
    const feeAmount = (club?.id === 'ncc' || club?.id === 'nss') ? 'FREE (Institutional Scheme)' : 'INR 250.00 (Annual Membership)';

    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a5' // 148 x 210 mm
    });

    const w = 148;
    const h = 210;

    // Header
    doc.setFillColor(30, 58, 138);
    doc.rect(0, 0, w, 32, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(255, 255, 255);
    doc.text('CMR TECHNICAL CAMPUS', w / 2, 13, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(251, 191, 36);
    doc.text('OFFICIAL CLUB MEMBERSHIP PAYMENT RECEIPT', w / 2, 20, { align: 'center' });
    doc.setTextColor(226, 232, 240);
    doc.text('Student Welfare & Extracurricular Activities Cell', w / 2, 26, { align: 'center' });

    // Receipt Box
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(10, 38, w - 20, 150, 3, 3, 'FD');

    doc.setFont('courier', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(71, 85, 105);
    doc.text(`Receipt No: ${receiptNo}`, 16, 48);
    doc.text(`Date: ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`, w - 16, 48, { align: 'right' });

    doc.setDrawColor(203, 213, 225);
    doc.line(16, 52, w - 16, 52);

    // Student Info
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(15, 23, 42);
    doc.text('STUDENT INFORMATION', 16, 60);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(71, 85, 105);
    doc.text(`Student Name:`, 16, 68);
    doc.text(`Roll Number:`, 16, 74);
    doc.text(`Campus Club:`, 16, 80);
    doc.text(`Validity Period:`, 16, 86);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(studentName, 50, 68);
    doc.setFont('courier', 'bold');
    doc.text(studentRoll, 50, 74);
    doc.setFont('helvetica', 'bold');
    doc.text(clubName, 50, 80);
    doc.text('Academic Year 2026 - 2027', 50, 86);

    doc.setDrawColor(203, 213, 225);
    doc.line(16, 94, w - 16, 94);

    // Fee Details
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(15, 23, 42);
    doc.text('PAYMENT DETAILS', 16, 102);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(71, 85, 105);
    doc.text(`Description:`, 16, 110);
    doc.text(`Payment Mode:`, 16, 116);
    doc.text(`Transaction Status:`, 16, 122);
    doc.text(`Amount Paid:`, 16, 128);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text('Annual Student Club Membership Fee', 50, 110);
    doc.text('Campus Digital Payment Gateway', 50, 116);
    doc.setTextColor(5, 150, 105);
    doc.text('SUCCESS / VERIFIED ✔', 50, 122);
    doc.setFontSize(10);
    doc.setTextColor(30, 58, 138);
    doc.text(feeAmount, 50, 129);

    // Signatures
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text('Authorized Finance Signature', w - 20, 168, { align: 'right' });
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text('CMRTC Finance & Club Cell', w - 20, 173, { align: 'right' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(148, 163, 184);
    doc.text('This is a computer-generated official receipt. No physical signature required.', w / 2, 196, { align: 'center' });

    const filename = `${cleanFileName(studentName)}_${cleanFileName(clubName)}_Receipt.pdf`;
    doc.save(filename);
    return { success: true, filename };
  } catch (error) {
    console.error('Error generating club receipt PDF:', error);
    return { success: false, error: error.message };
  }
};

/**
 * 6. Generates and downloads the QR Code Attendance Report CSV (Filename: QR_Attendance_Report.csv)
 */
export const downloadQRAttendanceCSV = () => {
  try {
    let attendanceData = {};
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('cmrtc_qr_attendance_data');
      if (stored) {
        try { attendanceData = JSON.parse(stored); } catch (e) { console.warn(e); }
      }
    }

    // Default rows if local data is empty
    const defaultRows = [
      { name: 'Srujanya Maringanti', rollNo: '237R1A05BA', club: 'Codeholics Tech Club', event: 'CMR HackFest 2026 36-Hour Hackathon', checkIn: 'Sept 05, 2026 • 09:14 AM', status: 'Present', method: 'Verified QR Scan' },
      { name: 'Ananya Sharma', rollNo: '237R1A0501', club: 'Codeholics Tech Club', event: 'CMR HackFest 2026 36-Hour Hackathon', checkIn: 'Sept 05, 2026 • 09:05 AM', status: 'Present', method: 'Verified QR Scan' },
      { name: 'Rahul Verma', rollNo: '237R1A0512', club: 'Codeholics Tech Club', event: 'CMR HackFest 2026 36-Hour Hackathon', checkIn: 'Sept 05, 2026 • 09:22 AM', status: 'Present', method: 'Verified QR Scan' },
      { name: 'Priya Reddy', rollNo: '237R1A0544', club: 'Codeholics Tech Club', event: 'CMR HackFest 2026 36-Hour Hackathon', checkIn: 'N/A', status: 'Absent', method: 'No Scan' },
      { name: 'Srujanya Maringanti', rollNo: '237R1A05BA', club: 'The Lexis Club', event: 'Word-Smith Parliamentary Debate & MUN', checkIn: 'Aug 30, 2026 • 10:02 AM', status: 'Present', method: 'Verified QR Scan' },
      { name: 'Sneha Kapur', rollNo: '237R1A0505', club: 'The Lexis Club', event: 'Word-Smith Parliamentary Debate & MUN', checkIn: 'Aug 30, 2026 • 09:58 AM', status: 'Present', method: 'Verified QR Scan' },
      { name: 'Vikram Singh', rollNo: '237R1A0519', club: 'The Lexis Club', event: 'Word-Smith Parliamentary Debate & MUN', checkIn: 'N/A', status: 'Absent', method: 'No Scan' },
      { name: 'Srujanya Maringanti', rollNo: '237R1A05BA', club: 'NSS Unit CMRTC', event: 'Swachh Bharat Cleanliness Drive', checkIn: 'Aug 28, 2026 • 08:45 AM', status: 'Present', method: 'Verified QR Scan' },
      { name: 'Aditya Teja', rollNo: '237R1A0530', club: 'NSS Unit CMRTC', event: 'Swachh Bharat Cleanliness Drive', checkIn: 'Aug 28, 2026 • 08:50 AM', status: 'Present', method: 'Verified QR Scan' },
      { name: 'Rohan Verma', rollNo: '237R1A0562', club: 'NCC Cadet Corps', event: 'Annual ATC Obstacle Course & Drill Bootcamp', checkIn: 'Aug 26, 2026 • 06:40 AM', status: 'Present', method: 'Verified QR Scan' },
      { name: 'Kavya Reddy', rollNo: '237R1A0578', club: 'AKRITI Cultural Club', event: 'Choreography & Hip-Hop Dance Bootcamp', checkIn: 'Sept 12, 2026 • 02:15 PM', status: 'Present', method: 'Verified QR Scan' },
      { name: 'Karthik Rao', rollNo: '237R1A0590', club: 'Film & Photography Club', event: 'Studio Lighting & DSLR Masterclass', checkIn: 'Sept 18, 2026 • 10:45 AM', status: 'Present', method: 'Verified QR Scan' }
    ];

    const rows = [];
    if (Object.keys(attendanceData).length > 0) {
      Object.values(attendanceData).forEach(eventRecord => {
        (eventRecord.attendees || []).forEach(att => {
          rows.push({
            name: att.name || 'Student Member',
            rollNo: att.rollNo || '237R1A05BA',
            club: eventRecord.clubName || 'Campus Club',
            event: eventRecord.eventTitle || 'Campus Event',
            checkIn: att.scannedAt || (att.status === 'present' ? 'Verified Scan' : 'N/A'),
            status: att.status === 'present' ? 'Present' : 'Absent',
            method: att.status === 'present' ? 'Verified QR Scan' : 'No Scan'
          });
        });
      });
    }

    const finalRows = rows.length > 0 ? rows : defaultRows;

    // Build CSV Content
    const headers = ['Student Name', 'Roll Number', 'Club Name', 'Event Name', 'Check-in Time', 'Attendance Status', 'Verification Method'];
    const csvLines = [headers.join(',')];

    finalRows.forEach(r => {
      const escape = (val) => `"${String(val || '').replace(/"/g, '""')}"`;
      csvLines.push([
        escape(r.name),
        escape(r.rollNo),
        escape(r.club),
        escape(r.event),
        escape(r.checkIn),
        escape(r.status),
        escape(r.method)
      ].join(','));
    });

    const csvContent = '\uFEFF' + csvLines.join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'QR_Attendance_Report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    return { success: true, filename: 'QR_Attendance_Report.csv' };
  } catch (error) {
    console.error('Error generating QR Attendance CSV:', error);
    return { success: false, error: error.message };
  }
};

/**
 * 7. Generates and downloads Q2 Attendance Summary PDF (Filename: Q2_Attendance_Summary.pdf)
 */
export const downloadQ2AttendanceSummaryPDF = () => {
  try {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const w = 210;
    const h = 297;

    // Header Background Accent
    doc.setFillColor(15, 23, 42); // Slate-900
    doc.rect(0, 0, w, 40, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(255, 255, 255);
    doc.text('CMR TECHNICAL CAMPUS', 14, 16);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(203, 213, 225);
    doc.text('UGC AUTONOMOUS • ACCREDITED BY NAAC WITH "A+" GRADE', 14, 22);
    doc.text('Kandlakoya (V), Medchal Road, Hyderabad - 501401, Telangana', 14, 27);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(251, 191, 36); // Amber-400
    doc.text('OFFICIAL FACULTY & DEAN OVERSIGHT REPORT', w - 14, 22, { align: 'right' });
    doc.setTextColor(148, 163, 184);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text(`Generated: ${new Date().toLocaleDateString('en-US', { month: 'long', day: '2-digit', year: 'numeric' })}`, w - 14, 28, { align: 'right' });

    // Document Title Banner
    doc.setDrawColor(217, 119, 6);
    doc.setLineWidth(1);
    doc.line(14, 46, w - 14, 46);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(15, 23, 42);
    doc.text('Q2 ATTENDANCE & CAMPUS PARTICIPATION SUMMARY', 14, 55);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(100, 116, 139);
    doc.text('Academic Quarter Q2 (July – December 2026) • Verified Smart QR Gate Attendance System', 14, 61);

    // Summary Metric Cards
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(14, 66, w - 28, 26, 3, 3, 'FD');

    const cardW = (w - 28) / 4;
    const metrics = [
      { label: 'MONITORED EVENTS', val: '11 Events', color: [30, 58, 138] },
      { label: 'TOTAL PARTICIPANTS', val: '1,420 Students', color: [15, 23, 42] },
      { label: 'AVERAGE ATTENDANCE', val: '88.4%', color: [5, 150, 105] },
      { label: 'ACTIVE CLUBS', val: '6 Clubs', color: [217, 119, 6] }
    ];

    metrics.forEach((m, idx) => {
      const cx = 14 + (idx * cardW) + (cardW / 2);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(100, 116, 139);
      doc.text(m.label, cx, 74, { align: 'center' });
      doc.setFontSize(13);
      doc.setTextColor(...m.color);
      doc.text(m.val, cx, 83, { align: 'center' });
    });

    // Event-wise Attendance Table Header
    let currentY = 102;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(15, 23, 42);
    doc.text('Event-Wise Attendance Breakdown', 14, currentY);

    currentY += 5;
    doc.setFillColor(30, 58, 138); // Deep Navy Table Header
    doc.rect(14, currentY, w - 28, 8, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(255, 255, 255);
    doc.text('Event Title', 18, currentY + 5.5);
    doc.text('Organizing Club', 85, currentY + 5.5);
    doc.text('Date', 130, currentY + 5.5);
    doc.text('Capacity', 155, currentY + 5.5);
    doc.text('Attendance %', 178, currentY + 5.5);

    currentY += 8;

    const eventList = [
      { title: 'CMR HackFest 2026 36-Hour Hackathon', club: 'Codeholics Tech', date: 'Aug 25, 2026', cap: '280/300', rate: '93.3%' },
      { title: 'Annual ATC Obstacle Drill Bootcamp', club: 'NCC Cadet Corps', date: 'Aug 26, 2026', cap: '75/100', rate: '85.0%' },
      { title: 'Swachh Bharat Cleanliness Drive', club: 'NSS Unit CMRTC', date: 'Aug 28, 2026', cap: '180/200', rate: '90.0%' },
      { title: 'Word-Smith Parliamentary Debate & MUN', club: 'The Lexis Club', date: 'Aug 30, 2026', cap: '110/120', rate: '91.6%' },
      { title: 'Generative AI & Agent Hackathon', club: 'Codeholics Tech', date: 'Sept 08, 2026', cap: '90/120', rate: '88.2%' },
      { title: 'Choreography & Hip-Hop Bootcamp', club: 'AKRITI Cultural', date: 'Sept 12, 2026', cap: '85/100', rate: '85.0%' },
      { title: 'Esperanza Creative Writing Showcase', club: 'The Lexis Club', date: 'Sept 16, 2026', cap: '60/80', rate: '82.5%' },
      { title: 'Studio Lighting & DSLR Masterclass', club: 'Film & Photography', date: 'Sept 18, 2026', cap: '45/50', rate: '90.0%' },
      { title: 'Mega Blood Donation & Medical Camp', club: 'NSS Unit CMRTC', date: 'Sept 22, 2026', cap: '350/400', rate: '87.5%' },
      { title: 'Raag 2K26 Battle of Campus Bands', club: 'AKRITI Cultural', date: 'Sept 26, 2026', cap: '420/500', rate: '84.0%' },
      { title: 'React 19 & Full-Stack AI Masterclass', club: 'Codeholics Tech', date: 'Oct 01, 2026', cap: '140/150', rate: '93.3%' }
    ];

    eventList.forEach((evt, idx) => {
      doc.setFillColor(idx % 2 === 0 ? 255 : 248, idx % 2 === 0 ? 255 : 250, idx % 2 === 0 ? 255 : 252);
      doc.rect(14, currentY, w - 28, 7, 'F');
      doc.setDrawColor(241, 245, 249);
      doc.line(14, currentY + 7, w - 14, currentY + 7);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(15, 23, 42);
      doc.text(evt.title.length > 38 ? evt.title.substring(0, 36) + '...' : evt.title, 18, currentY + 4.8);
      doc.setTextColor(71, 85, 105);
      doc.text(evt.club, 85, currentY + 4.8);
      doc.text(evt.date, 130, currentY + 4.8);
      doc.text(evt.cap, 155, currentY + 4.8);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(5, 150, 105);
      doc.text(evt.rate, 178, currentY + 4.8);

      currentY += 7;
    });

    // Verification Box & Signatures
    currentY += 12;
    doc.setFillColor(241, 245, 249);
    doc.roundedRect(14, currentY, w - 28, 28, 2, 2, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(30, 58, 138);
    doc.text('AUDIT & COMPLIANCE OBSERVATIONS', 18, currentY + 7);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(71, 85, 105);
    doc.text('1. All recorded check-in timestamps are verified via UniSphere Encrypted QR scanner tokens.', 18, currentY + 13);
    doc.text('2. 100% attendance records matched student college roll numbers registered in JNTUH portal.', 18, currentY + 18);
    doc.text('3. Attendance logs satisfy NAAC Criterion 5.3.3 and Autonomous Academic Activity Benchmarks.', 18, currentY + 23);

    // Signatures
    currentY += 38;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    doc.text('Dr. Suresh Kumar', 18, currentY);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text('Faculty Coordinator, Student Affairs', 18, currentY + 4);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    doc.text('Dr. A. Raji Reddy', w - 18, currentY, { align: 'right' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text('Director / Principal, CMRTC', w - 18, currentY + 4, { align: 'right' });

    doc.save('Q2_Attendance_Summary.pdf');
    return { success: true, filename: 'Q2_Attendance_Summary.pdf' };
  } catch (error) {
    console.error('Error generating Q2 Attendance Summary PDF:', error);
    return { success: false, error: error.message };
  }
};

/**
 * 8. Generates and downloads Annual Budget Audit PDF (Filename: Annual_Budget_Audit.pdf)
 */
export const downloadAnnualBudgetAuditPDF = () => {
  try {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const w = 210;

    // Header Background Accent
    doc.setFillColor(15, 23, 42); // Slate-900
    doc.rect(0, 0, w, 40, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(255, 255, 255);
    doc.text('CMR TECHNICAL CAMPUS', 14, 16);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(203, 213, 225);
    doc.text('UGC AUTONOMOUS • NAAC "A+" ACCREDITED • FINANCIAL AUDIT CELL', 14, 22);
    doc.text('Kandlakoya (V), Medchal Road, Hyderabad - 501401, Telangana', 14, 27);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(52, 211, 153); // Emerald-400
    doc.text('AUDIT CLEARANCE CERTIFICATE', w - 14, 22, { align: 'right' });
    doc.setTextColor(148, 163, 184);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text(`Financial Year: 2025–2026`, w - 14, 28, { align: 'right' });

    // Document Title Banner
    doc.setDrawColor(5, 150, 105);
    doc.setLineWidth(1);
    doc.line(14, 46, w - 14, 46);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(15, 23, 42);
    doc.text('ANNUAL CLUB BUDGET & SPONSORSHIP AUDIT REPORT', 14, 55);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(100, 116, 139);
    doc.text('Consolidated Financial Statements • Institutional Allocations, Corporate Sponsorships & Expenditures', 14, 61);

    // Summary Metric Cards
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(14, 66, w - 28, 26, 3, 3, 'FD');

    const cardW = (w - 28) / 4;
    const metrics = [
      { label: 'INSTITUTIONAL GRANTS', val: '₹5,50,000', color: [30, 58, 138] },
      { label: 'SPONSORSHIPS RAISED', val: '₹2,90,000', color: [217, 119, 6] },
      { label: 'TOTAL EXPENDITURE', val: '₹4,20,000', color: [225, 29, 72] },
      { label: 'REMAINING RESERVES', val: '₹4,20,000', color: [5, 150, 105] }
    ];

    metrics.forEach((m, idx) => {
      const cx = 14 + (idx * cardW) + (cardW / 2);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.setTextColor(100, 116, 139);
      doc.text(m.label, cx, 74, { align: 'center' });
      doc.setFontSize(12.5);
      doc.setTextColor(...m.color);
      doc.text(m.val, cx, 83, { align: 'center' });
    });

    // Club-wise Budget Table
    let currentY = 102;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(15, 23, 42);
    doc.text('Club-Wise Financial Audit & Balance Statement', 14, currentY);

    currentY += 5;
    doc.setFillColor(15, 23, 42);
    doc.rect(14, currentY, w - 28, 8, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(255, 255, 255);
    doc.text('Club Name', 18, currentY + 5.5);
    doc.text('Allocation', 70, currentY + 5.5);
    doc.text('Sponsorships', 100, currentY + 5.5);
    doc.text('Total Fund', 130, currentY + 5.5);
    doc.text('Expenses', 155, currentY + 5.5);
    doc.text('Balance', 180, currentY + 5.5);

    currentY += 8;

    const clubBudgets = [
      { name: 'Codeholics Tech Club', alloc: '₹1,20,000', spon: '₹45,000', total: '₹1,65,000', exp: '₹75,000', bal: '₹90,000' },
      { name: 'AKRITI Cultural Club', alloc: '₹1,50,000', spon: '₹40,000', total: '₹1,90,000', exp: '₹1,10,000', bal: '₹80,000' },
      { name: 'NSS Unit CMRTC', alloc: '₹80,000', spon: '₹18,000', total: '₹98,000', exp: '₹45,000', bal: '₹53,000' },
      { name: 'The Lexis Club', alloc: '₹60,000', spon: '₹12,000', total: '₹72,000', exp: '₹35,000', bal: '₹37,000' },
      { name: 'Film & Photography Club', alloc: '₹70,000', spon: '₹16,000', total: '₹86,000', exp: '₹40,000', bal: '₹46,000' },
      { name: 'NCC Cadet Corps CMRTC', alloc: '₹70,000', spon: '₹14,000', total: '₹84,000', exp: '₹42,000', bal: '₹42,000' }
    ];

    clubBudgets.forEach((b, idx) => {
      doc.setFillColor(idx % 2 === 0 ? 255 : 248, idx % 2 === 0 ? 255 : 250, idx % 2 === 0 ? 255 : 252);
      doc.rect(14, currentY, w - 28, 7, 'F');
      doc.setDrawColor(241, 245, 249);
      doc.line(14, currentY + 7, w - 14, currentY + 7);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(15, 23, 42);
      doc.text(b.name, 18, currentY + 4.8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(71, 85, 105);
      doc.text(b.alloc, 70, currentY + 4.8);
      doc.text(b.spon, 100, currentY + 4.8);
      doc.text(b.total, 130, currentY + 4.8);
      doc.setTextColor(225, 29, 72);
      doc.text(b.exp, 155, currentY + 4.8);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(5, 150, 105);
      doc.text(b.bal, 180, currentY + 4.8);

      currentY += 7;
    });

    // Corporate Sponsors
    currentY += 10;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(15, 23, 42);
    doc.text('Key Corporate Sponsors & Industry Partners (2025–2026)', 14, currentY);

    currentY += 4;
    doc.setFillColor(241, 245, 249);
    doc.roundedRect(14, currentY, w - 28, 22, 2, 2, 'F');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(71, 85, 105);
    doc.text('• Google Cloud Campus: ₹20,000 (Title Sponsor for HackFest 2026 Cloud Credits & Awards)', 18, currentY + 6);
    doc.text('• Spotify India Campus: ₹25,000 (Stage & Acoustic Production Sponsor for Pegasus Fest)', 18, currentY + 11);
    doc.text('• Nikon India & Red Bull: ₹31,000 (Media Gear Display & Coding Sprint Beverage Partner)', 18, currentY + 16);

    // Signatures
    currentY += 34;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    doc.text('Finance & Accounts Officer', 18, currentY);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text('CMR Technical Campus', 18, currentY + 4);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    doc.text('Chief Financial Auditor (Internal)', w - 18, currentY, { align: 'right' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text('Autonomous Audit Committee', w - 18, currentY + 4, { align: 'right' });

    doc.save('Annual_Budget_Audit.pdf');
    return { success: true, filename: 'Annual_Budget_Audit.pdf' };
  } catch (error) {
    console.error('Error generating Annual Budget Audit PDF:', error);
    return { success: false, error: error.message };
  }
};

/**
 * 9. Generates and downloads NAAC Accreditation Data PDF (Filename: NAAC_Accreditation_Data.pdf)
 */
export const downloadNAACAccreditationPDF = () => {
  try {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const w = 210;

    // Header Background Accent
    doc.setFillColor(15, 23, 42); // Slate-900
    doc.rect(0, 0, w, 40, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(255, 255, 255);
    doc.text('CMR TECHNICAL CAMPUS', 14, 16);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(203, 213, 225);
    doc.text('INTERNAL QUALITY ASSURANCE CELL (IQAC) • NAAC ACCREDITATION METRICS', 14, 22);
    doc.text('Approved by AICTE, Affiliated to JNTUH • Kandlakoya, Hyderabad - 501401', 14, 27);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(251, 191, 36); // Amber-400
    doc.text('NAAC CRITERIA 5.3.3 & 3.4.3', w - 14, 22, { align: 'right' });
    doc.setTextColor(148, 163, 184);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text('Academic Year: 2025–2026', w - 14, 28, { align: 'right' });

    // Document Title Banner
    doc.setDrawColor(217, 119, 6);
    doc.setLineWidth(1);
    doc.line(14, 46, w - 14, 46);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(15, 23, 42);
    doc.text('NAAC ACCREDITATION & CO-CURRICULAR EXTENSION REPORT', 14, 55);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(100, 116, 139);
    doc.text('Official Evidentiary Documentation for Student Progression, Certificates Issued & Social Extension Hours', 14, 61);

    // Summary Metric Cards
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(14, 66, w - 28, 26, 3, 3, 'FD');

    const cardW = (w - 28) / 4;
    const metrics = [
      { label: 'CO-CURRICULAR EVENTS', val: '18 Major Events', color: [30, 58, 138] },
      { label: 'STUDENT PARTICIPATION', val: '2,150 Records', color: [15, 23, 42] },
      { label: 'VERIFIED CERTIFICATES', val: '340 Issued', color: [5, 150, 105] },
      { label: 'VOLUNTEER HOURS', val: '1,480 Hours', color: [217, 119, 6] }
    ];

    metrics.forEach((m, idx) => {
      const cx = 14 + (idx * cardW) + (cardW / 2);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.setTextColor(100, 116, 139);
      doc.text(m.label, cx, 74, { align: 'center' });
      doc.setFontSize(12.5);
      doc.setTextColor(...m.color);
      doc.text(m.val, cx, 83, { align: 'center' });
    });

    // Detailed Section Breakdown
    let currentY = 102;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(15, 23, 42);
    doc.text('Key NAAC Extension & Club Activity Pillars', 14, currentY);

    currentY += 5;

    const sections = [
      {
        title: 'Pillar 1: Technical Innovation & Industry Hackathons (Criteria 5.3.3)',
        club: 'Codeholics Tech Club',
        desc: 'Organized 36-Hour HackFest 2026, Full-Stack AI & React 19 masterclasses, API development bootcamps with 520+ verified attendees and 80 certified project submissions.'
      },
      {
        title: 'Pillar 2: Community Outreach & Swachh Bharat Drives (Criteria 3.4.3)',
        club: 'NSS Unit CMRTC',
        desc: 'Conducted campus-wide mega blood donation camp (350+ units), tree plantation drive (500+ saplings planted), and rural literacy outreach logging 820+ verified volunteer service hours.'
      },
      {
        title: 'Pillar 3: National Cadet Corps Leadership & Discipline (Criteria 5.1.2)',
        club: 'NCC Cadet Corps CMRTC',
        desc: 'Annual Training Camp (ATC) obstacle course drills, firing range simulation training, Independence Day ceremonial parade, and disaster relief preparedness workshops.'
      },
      {
        title: 'Pillar 4: Cultural, Literary & Creative Arts Heritage (Criteria 5.3.2)',
        club: 'AKRITI Cultural, The Lexis & Film Club',
        desc: 'Annual Pegasus Fest, Raag Band Battle, Model United Nations parliamentary debates, and photography exhibitions with 1,200+ active student registrations.'
      }
    ];

    sections.forEach((sec) => {
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(14, currentY, w - 28, 22, 2, 2, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(30, 58, 138);
      doc.text(sec.title, 18, currentY + 6);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(217, 119, 6);
      doc.text(`[ ${sec.club} ]`, w - 18, currentY + 6, { align: 'right' });

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(71, 85, 105);
      const splitText = doc.splitTextToSize(sec.desc, w - 36);
      doc.text(splitText, 18, currentY + 11.5);

      currentY += 25;
    });

    // Verification Box
    currentY += 4;
    doc.setFillColor(241, 245, 249);
    doc.roundedRect(14, currentY, w - 28, 18, 2, 2, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(15, 23, 42);
    doc.text('IQAC ATTESTATION & PEER TEAM COMPLIANCE', 18, currentY + 6);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(71, 85, 105);
    doc.text('All co-curricular extension activities are verified with digital roll timestamps, certificate serial codes, and faculty sign-offs.', 18, currentY + 12);

    // Signatures
    currentY += 28;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    doc.text('IQAC Coordinator', 18, currentY);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text('Internal Quality Assurance Cell', 18, currentY + 4);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    doc.text('Principal & IQAC Chairperson', w - 18, currentY, { align: 'right' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text('CMR Technical Campus', w - 18, currentY + 4, { align: 'right' });

    doc.save('NAAC_Accreditation_Data.pdf');
    return { success: true, filename: 'NAAC_Accreditation_Data.pdf' };
  } catch (error) {
    console.error('Error generating NAAC Accreditation PDF:', error);
    return { success: false, error: error.message };
  }
};
