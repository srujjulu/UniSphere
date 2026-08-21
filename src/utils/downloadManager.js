import { jsPDF } from 'jspdf';
import { getStoredRequests } from './mockRequests';
import { getStoredClubs } from './mockClubs';
import { getStoredCalendarEvents } from './mockCalendarEvents';
import { getStoredCertificates } from './mockCertificates';
import { getStoredAttendanceRecords } from './mockQRAttendance';
import { getStoredVolunteerRecords } from './mockVolunteerHours';
import { getStoredSponsors, getStoredExpenses, getStoredBudgetData } from './mockBudgetAndSponsors';
import { getStoredAnnouncements } from './mockAnnouncements';
import { getStoredInfluencers } from './mockInfluencers';

// Helper to sanitize filenames
export const cleanFileName = (str) => {
  if (!str) return 'Document';
  return str.replace(/[^a-zA-Z0-9_-]/g, '_').replace(/_+/g, '_').slice(0, 50);
};

// Generic Browser Trigger for Blob/Text Downloads
export const triggerFileDownload = (content, filename, mimeType = 'text/plain;charset=utf-8;') => {
  try {
    const blob = content instanceof Blob ? content : new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    return { success: true, filename };
  } catch (err) {
    console.error('File download error:', err);
    return { success: false, error: err.message };
  }
};

/**
 * 1. ADMIN MODULE: Full SQL Database Dump Generator (.sql)
 * Filename: unisphere-database-backup.sql
 */
export const downloadSQLDatabaseDump = (customUsers = []) => {
  try {
    const timestamp = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
    const clubs = getStoredClubs();
    const events = getStoredCalendarEvents();
    const certs = getStoredCertificates();
    const attendance = getStoredAttendanceRecords();
    const volunteers = getStoredVolunteerRecords();
    const sponsors = getStoredSponsors();
    const expenses = getStoredExpenses();
    const announcements = getStoredAnnouncements();

    const escapeSql = (val) => {
      if (val === null || val === undefined) return 'NULL';
      return `'${String(val).replace(/'/g, "''").replace(/\\/g, "\\\\")}'`;
    };

    let sql = `-- ====================================================================\n`;
    sql += `-- UNISPHERE CAMPUS PORTAL - CMR TECHNICAL CAMPUS (CMRTC)\n`;
    sql += `-- AUTOMATED FULL DATABASE BACKUP DUMP\n`;
    sql += `-- Generated on: ${timestamp} (IST)\n`;
    sql += `-- Database Engine: MySQL 8.0 Enterprise / InnoDB\n`;
    sql += `-- ====================================================================\n\n`;

    sql += `CREATE DATABASE IF NOT EXISTS \`unisphere_cmrtc\` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;\n`;
    sql += `USE \`unisphere_cmrtc\`;\n\n`;

    sql += `SET FOREIGN_KEY_CHECKS = 0;\n\n`;

    // 1. Table: users
    sql += `-- Table structure for \`users\`\n`;
    sql += `DROP TABLE IF EXISTS \`users\`;\n`;
    sql += `CREATE TABLE \`users\` (\n`;
    sql += `  \`id\` varchar(64) NOT NULL,\n`;
    sql += `  \`name\` varchar(128) NOT NULL,\n`;
    sql += `  \`email\` varchar(128) NOT NULL UNIQUE,\n`;
    sql += `  \`role\` enum('student','core','faculty','admin') NOT NULL DEFAULT 'student',\n`;
    sql += `  \`roll_number\` varchar(32) DEFAULT NULL,\n`;
    sql += `  \`department\` varchar(64) DEFAULT 'CSE',\n`;
    sql += `  \`created_at\` datetime DEFAULT CURRENT_TIMESTAMP,\n`;
    sql += `  PRIMARY KEY (\`id\`)\n`;
    sql += `) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;\n\n`;

    const userList = customUsers.length > 0 ? customUsers : [
      { id: 'u-admin-1', name: 'Admin Root', email: 'admin@cmr.edu.in', role: 'admin', rollNo: 'ADM001', dept: 'Admin Cell' },
      { id: 'u-faculty-1', name: 'Dr. Suresh Kumar', email: 'suresh@cmr.edu.in', role: 'faculty', rollNo: 'FAC058', dept: 'CSE' },
      { id: 'u-core-1', name: 'Rohan Verma', email: 'rohan@cmr.edu.in', role: 'core', rollNo: '217R1A04B2', dept: 'ECE' },
      { id: 'u-student-1', name: 'Srujanya Maringanti', email: 'student@cmr.edu.in', role: 'student', rollNo: '237R1A05BA', dept: 'CSE' }
    ];

    sql += `INSERT INTO \`users\` (\`id\`, \`name\`, \`email\`, \`role\`, \`roll_number\`, \`department\`) VALUES\n`;
    const userInserts = userList.map(u => 
      `  (${escapeSql(u.id)}, ${escapeSql(u.name)}, ${escapeSql(u.email)}, ${escapeSql(u.role)}, ${escapeSql(u.rollNo || u.rollNumber)}, ${escapeSql(u.dept || u.branch || 'CSE')})`
    );
    sql += userInserts.join(',\n') + ';\n\n';

    // 2. Table: clubs
    sql += `-- Table structure for \`clubs\`\n`;
    sql += `DROP TABLE IF EXISTS \`clubs\`;\n`;
    sql += `CREATE TABLE \`clubs\` (\n`;
    sql += `  \`id\` varchar(64) NOT NULL,\n`;
    sql += `  \`name\` varchar(128) NOT NULL,\n`;
    sql += `  \`category\` varchar(64) NOT NULL,\n`;
    sql += `  \`subtitle\` text,\n`;
    sql += `  \`recruitment_status\` varchar(32) DEFAULT 'open',\n`;
    sql += `  \`members_count\` int DEFAULT 50,\n`;
    sql += `  PRIMARY KEY (\`id\`)\n`;
    sql += `) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;\n\n`;

    sql += `INSERT INTO \`clubs\` (\`id\`, \`name\`, \`category\`, \`subtitle\`, \`recruitment_status\`, \`members_count\`) VALUES\n`;
    const clubInserts = clubs.map(c => 
      `  (${escapeSql(c.id)}, ${escapeSql(c.name)}, ${escapeSql(c.category)}, ${escapeSql(c.subtitle || c.description)}, ${escapeSql(c.recruitment || 'open')}, ${c.membersCount || 50})`
    );
    sql += clubInserts.join(',\n') + ';\n\n';

    // 3. Table: calendar_events
    sql += `-- Table structure for \`calendar_events\`\n`;
    sql += `DROP TABLE IF EXISTS \`calendar_events\`;\n`;
    sql += `CREATE TABLE \`calendar_events\` (\n`;
    sql += `  \`id\` varchar(64) NOT NULL,\n`;
    sql += `  \`title\` varchar(255) NOT NULL,\n`;
    sql += `  \`club_id\` varchar(64) NOT NULL,\n`;
    sql += `  \`category\` varchar(64) NOT NULL,\n`;
    sql += `  \`event_date\` date NOT NULL,\n`;
    sql += `  \`event_time\` varchar(64) DEFAULT NULL,\n`;
    sql += `  \`venue\` varchar(128) DEFAULT NULL,\n`;
    sql += `  \`max_capacity\` int DEFAULT 100,\n`;
    sql += `  \`initial_registered_count\` int DEFAULT 0,\n`;
    sql += `  \`status\` varchar(32) DEFAULT 'Upcoming',\n`;
    sql += `  PRIMARY KEY (\`id\`)\n`;
    sql += `) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;\n\n`;

    sql += `INSERT INTO \`calendar_events\` (\`id\`, \`title\`, \`club_id\`, \`category\`, \`event_date\`, \`event_time\`, \`venue\`, \`max_capacity\`, \`initial_registered_count\`, \`status\`) VALUES\n`;
    const eventInserts = events.map(e => 
      `  (${escapeSql(e.id)}, ${escapeSql(e.title)}, ${escapeSql(e.clubId)}, ${escapeSql(e.category)}, ${escapeSql(e.date)}, ${escapeSql(e.time)}, ${escapeSql(e.venue)}, ${e.maxCapacity || 100}, ${e.initialRegisteredCount || 0}, ${escapeSql(e.status || 'Upcoming')})`
    );
    sql += eventInserts.join(',\n') + ';\n\n';

    // 4. Table: certificates
    sql += `-- Table structure for \`certificates\`\n`;
    sql += `DROP TABLE IF EXISTS \`certificates\`;\n`;
    sql += `CREATE TABLE \`certificates\` (\n`;
    sql += `  \`credential_id\` varchar(64) NOT NULL,\n`;
    sql += `  \`student_name\` varchar(128) NOT NULL,\n`;
    sql += `  \`student_roll\` varchar(32) NOT NULL,\n`;
    sql += `  \`event_name\` varchar(255) NOT NULL,\n`;
    sql += `  \`club_name\` varchar(128) NOT NULL,\n`;
    sql += `  \`issue_date\` varchar(64) NOT NULL,\n`;
    sql += `  \`status\` varchar(32) DEFAULT 'verified',\n`;
    sql += `  \`verified_by\` varchar(128) DEFAULT NULL,\n`;
    sql += `  PRIMARY KEY (\`credential_id\`)\n`;
    sql += `) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;\n\n`;

    sql += `INSERT INTO \`certificates\` (\`credential_id\`, \`student_name\`, \`student_roll\`, \`event_name\`, \`club_name\`, \`issue_date\`, \`status\`, \`verified_by\`) VALUES\n`;
    const certInserts = certs.map(c => 
      `  (${escapeSql(c.credentialId || c.id)}, ${escapeSql(c.studentName)}, ${escapeSql(c.studentRoll)}, ${escapeSql(c.eventName)}, ${escapeSql(c.clubName)}, ${escapeSql(c.issueDate)}, ${escapeSql(c.status || 'verified')}, ${escapeSql(c.verifiedBy)})`
    );
    sql += certInserts.join(',\n') + ';\n\n';

    // 5. Table: qr_attendance
    sql += `-- Table structure for \`qr_attendance\`\n`;
    sql += `DROP TABLE IF EXISTS \`qr_attendance\`;\n`;
    sql += `CREATE TABLE \`qr_attendance\` (\n`;
    sql += `  \`id\` int AUTO_INCREMENT PRIMARY KEY,\n`;
    sql += `  \`event_id\` varchar(64) NOT NULL,\n`;
    sql += `  \`student_roll\` varchar(32) NOT NULL,\n`;
    sql += `  \`student_name\` varchar(128) NOT NULL,\n`;
    sql += `  \`scanned_at\` varchar(64) DEFAULT NULL,\n`;
    sql += `  \`status\` enum('present','absent') DEFAULT 'present'\n`;
    sql += `) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;\n\n`;

    const attRows = [];
    Object.entries(attendance).forEach(([evtId, rec]) => {
      (rec.attendees || []).forEach(a => {
        attRows.push(`  (${escapeSql(evtId)}, ${escapeSql(a.rollNo)}, ${escapeSql(a.name)}, ${escapeSql(a.scannedAt)}, ${escapeSql(a.status || 'present')})`);
      });
    });

    if (attRows.length > 0) {
      sql += `INSERT INTO \`qr_attendance\` (\`event_id\`, \`student_roll\`, \`student_name\`, \`scanned_at\`, \`status\`) VALUES\n`;
      sql += attRows.join(',\n') + ';\n\n';
    }

    sql += `SET FOREIGN_KEY_CHECKS = 1;\n`;
    sql += `-- ====================================================================\n`;
    sql += `-- END OF UNISPHERE FULL BACKUP DUMP\n`;
    sql += `-- ====================================================================\n`;

    return triggerFileDownload(sql, 'unisphere-database-backup.sql', 'application/sql;charset=utf-8;');
  } catch (err) {
    console.error('Error generating SQL Dump:', err);
    return { success: false, error: err.message };
  }
};

/**
 * 2. ADMIN MODULE: Full JSON Database Snapshot Generator (.json)
 * Filename: unisphere-database-snapshot.json
 */
export const downloadJSONDatabaseSnapshot = (customUsers = []) => {
  try {
    const snapshot = {
      meta: {
        portal: 'UniSphere Campus Portal - CMR Technical Campus',
        system: 'CMRTC Student Clubs Management System',
        academicYear: '2026-2027',
        exportedAt: new Date().toISOString(),
        formatVersion: '4.0'
      },
      users: customUsers.length > 0 ? customUsers : [
        { id: 'u1', name: 'Srujanya Maringanti', email: 'student@cmr.edu.in', role: 'student', rollNo: '237R1A05BA', dept: 'CSE' },
        { id: 'u2', name: 'Dr. Suresh Kumar', email: 'suresh@cmr.edu.in', role: 'faculty', rollNo: 'FAC058', dept: 'CSE' },
        { id: 'u3', name: 'Rohan Verma', email: 'rohan@cmr.edu.in', role: 'core', rollNo: '217R1A04B2', dept: 'ECE' },
        { id: 'u4', name: 'Admin Root', email: 'admin@cmr.edu.in', role: 'admin', rollNo: 'ADM001', dept: 'Admin Cell' }
      ],
      clubs: getStoredClubs(),
      events: getStoredCalendarEvents(),
      membershipRequests: getStoredRequests(),
      certificates: getStoredCertificates(),
      qrAttendance: getStoredAttendanceRecords(),
      volunteerHours: getStoredVolunteerRecords(),
      sponsors: getStoredSponsors(),
      expenses: getStoredExpenses(),
      budgets: getStoredBudgetData(),
      announcements: getStoredAnnouncements(),
      influencers: getStoredInfluencers()
    };

    const jsonContent = JSON.stringify(snapshot, null, 2);
    return triggerFileDownload(jsonContent, 'unisphere-database-snapshot.json', 'application/json;charset=utf-8;');
  } catch (err) {
    console.error('Error exporting JSON snapshot:', err);
    return { success: false, error: err.message };
  }
};

/**
 * 3. ADMIN MODULE: Export Certificates Audit CSV
 * Filename: certificates-audit.csv
 */
export const downloadCertificatesAuditCSV = () => {
  try {
    const certs = getStoredCertificates();
    const headers = ['Credential ID', 'Student Name', 'Roll Number', 'Club Name', 'Event Name', 'Issue Date', 'Verification Status', 'Verified By'];
    const lines = [headers.join(',')];

    certs.forEach(c => {
      const escape = (val) => `"${String(val || '').replace(/"/g, '""')}"`;
      lines.push([
        escape(c.credentialId || c.id),
        escape(c.studentName),
        escape(c.studentRoll),
        escape(c.clubName),
        escape(c.eventName),
        escape(c.issueDate),
        escape(c.status || 'verified'),
        escape(c.verifiedBy || 'Faculty Coordinator')
      ].join(','));
    });

    const csvContent = '\uFEFF' + lines.join('\r\n');
    return triggerFileDownload(csvContent, 'certificates-audit.csv', 'text/csv;charset=utf-8;');
  } catch (err) {
    console.error('Error generating Certificates Audit CSV:', err);
    return { success: false, error: err.message };
  }
};

/**
 * 4. ADMIN & CORE: Export Club Members Roster CSV
 * Filename: {clubId}_members_roster.csv
 */
export const downloadClubMembersCSV = (clubId = 'codeholics', clubName = 'Codeholics Tech Club') => {
  try {
    const requests = getStoredRequests();
    const clubMembers = requests.filter(r => r.clubId === clubId && (r.status === 'approved' || r.status === 'pending'));

    const defaultMembers = [
      { name: 'Srujanya Maringanti', rollNo: '237R1A05BA', branch: 'CSE 3rd Yr', email: '237r1a05ba@cmrtc.ac.in', talent: 'Technical Dev', status: 'Approved', joined: 'Aug 2026' },
      { name: 'Rahul Sharma', rollNo: '237R1A0512', branch: 'CSE 2nd Yr', email: 'rahul.s@cmr.edu.in', talent: 'Web Dev & AI', status: 'Approved', joined: 'Aug 2026' },
      { name: 'Aditya Teja', rollNo: '217R1A0577', branch: 'CSE 4th Yr', email: 'aditya.t@cmr.edu.in', talent: 'Core Lead', status: 'Approved', joined: 'Aug 2026' },
      { name: 'Sneha Reddy', rollNo: '237R1A0445', branch: 'ECE 3rd Yr', email: 'sneha.r@cmr.edu.in', talent: 'Events Lead', status: 'Approved', joined: 'Aug 2026' }
    ];

    const rows = clubMembers.length > 0 ? clubMembers.map(m => ({
      name: m.name || m.studentName || 'Student Member',
      rollNo: m.rollNo || m.studentRoll || '237R1A05BA',
      branch: m.branch || 'CSE',
      email: m.email || m.studentEmail || `${m.rollNo?.toLowerCase()}@cmr.edu.in`,
      talent: m.talent || 'Active Member',
      status: m.status === 'approved' ? 'Active Member' : 'Pending Core Approval',
      joined: m.date || 'Aug 2026'
    })) : defaultMembers;

    const headers = ['Student Name', 'Roll Number', 'Branch / Dept', 'Official Email', 'Role / Domain', 'Membership Status', 'Registration Date'];
    const lines = [headers.join(',')];

    rows.forEach(r => {
      const escape = (val) => `"${String(val || '').replace(/"/g, '""')}"`;
      lines.push([
        escape(r.name),
        escape(r.rollNo),
        escape(r.branch),
        escape(r.email),
        escape(r.talent),
        escape(r.status),
        escape(r.joined)
      ].join(','));
    });

    const filename = `${cleanFileName(clubId)}_members_roster.csv`;
    const csvContent = '\uFEFF' + lines.join('\r\n');
    return triggerFileDownload(csvContent, filename, 'text/csv;charset=utf-8;');
  } catch (err) {
    console.error('Error generating Members CSV:', err);
    return { success: false, error: err.message };
  }
};

/**
 * 5. CORE TEAM: Monthly Participation Report PDF
 * Filename: {clubName}_Monthly_Participation_Report.pdf
 */
export const downloadClubMonthlyParticipationPDF = (clubId = 'codeholics', clubName = 'Codeholics Tech Club') => {
  try {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const w = 210;

    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, w, 38, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(15);
    doc.setTextColor(255, 255, 255);
    doc.text('CMR TECHNICAL CAMPUS', 14, 15);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(203, 213, 225);
    doc.text('STUDENT CLUBS EXECUTIVE COMMITTEE • MONTHLY PARTICIPATION AUDIT', 14, 21);
    doc.text(`Club Organization: ${clubName.toUpperCase()}`, 14, 26);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(52, 211, 153);
    doc.text('OFFICIAL MONTHLY REPORT', w - 14, 21, { align: 'right' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184);
    doc.text(`Month: August 2026`, w - 14, 26, { align: 'right' });

    doc.setDrawColor(5, 150, 105);
    doc.setLineWidth(1);
    doc.line(14, 43, w - 14, 43);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(15, 23, 42);
    doc.text(`${clubName.toUpperCase()} — MONTHLY PARTICIPATION AUDIT`, 14, 52);

    // KPI Cards
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(14, 58, w - 28, 22, 2, 2, 'FD');

    const cardW = (w - 28) / 3;
    const metrics = [
      { label: 'TOTAL CLUB MEMBERS', val: '50 Members (100% Cap)', color: [30, 58, 138] },
      { label: 'EVENTS CONDUCTED', val: '4 Major Sprints', color: [217, 119, 6] },
      { label: 'TOTAL EVENT REGISTRATIONS', val: '420 Students', color: [5, 150, 105] }
    ];

    metrics.forEach((m, idx) => {
      const cx = 14 + (idx * cardW) + (cardW / 2);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.setTextColor(100, 116, 139);
      doc.text(m.label, cx, 65, { align: 'center' });
      doc.setFontSize(11);
      doc.setTextColor(...m.color);
      doc.text(m.val, cx, 73, { align: 'center' });
    });

    // Activities List
    let currentY = 88;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text('Key Flagship Activities & Engagement Breakdown', 14, currentY);

    currentY += 5;
    doc.setFillColor(15, 23, 42);
    doc.rect(14, currentY, w - 28, 7, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(255, 255, 255);
    doc.text('Event / Milestone Title', 18, currentY + 4.8);
    doc.text('Date', 110, currentY + 4.8);
    doc.text('Turnout', 145, currentY + 4.8);
    doc.text('Status', 175, currentY + 4.8);

    currentY += 7;

    const rows = [
      { title: 'CMR HackFest 2026 36-Hour Hackathon', date: 'Aug 25, 2026', turnout: '280 / 300', status: 'Upcoming' },
      { title: 'Generative AI & Agent Masterclass', date: 'Aug 18, 2026', turnout: '120 / 120', status: 'Completed' },
      { title: 'Club Core Executive Selection & Onboarding', date: 'Aug 10, 2026', turnout: '50 / 50', status: 'Completed' },
      { title: 'Campus Web3 & React 19 Workshop', date: 'Aug 04, 2026', turnout: '140 / 150', status: 'Completed' }
    ];

    rows.forEach((r, idx) => {
      doc.setFillColor(idx % 2 === 0 ? 255 : 248, idx % 2 === 0 ? 255 : 250, idx % 2 === 0 ? 255 : 252);
      doc.rect(14, currentY, w - 28, 7, 'F');
      doc.setDrawColor(241, 245, 249);
      doc.line(14, currentY + 7, w - 14, currentY + 7);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(15, 23, 42);
      doc.text(r.title, 18, currentY + 4.8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(71, 85, 105);
      doc.text(r.date, 110, currentY + 4.8);
      doc.text(r.turnout, 145, currentY + 4.8);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(5, 150, 105);
      doc.text(r.status, 175, currentY + 4.8);

      currentY += 7;
    });

    currentY += 15;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(15, 23, 42);
    doc.text('Lead Student Coordinator', 18, currentY);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    doc.text(`${clubName} Executive Council`, 18, currentY + 4);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(15, 23, 42);
    doc.text('Faculty Club Advisor', w - 18, currentY, { align: 'right' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    doc.text('CMR Technical Campus', w - 18, currentY + 4, { align: 'right' });

    const filename = `${cleanFileName(clubName)}_Monthly_Participation_Report.pdf`;
    doc.save(filename);
    return { success: true, filename };
  } catch (err) {
    console.error('Error generating Monthly Participation PDF:', err);
    return { success: false, error: err.message };
  }
};

/**
 * 6. CORE TEAM: Quarterly Financial Statement PDF
 * Filename: {clubName}_Quarterly_Financial_Statement.pdf
 */
export const downloadClubFinancialStatementPDF = (clubId = 'codeholics', clubName = 'Codeholics Tech Club') => {
  try {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const w = 210;

    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, w, 38, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(15);
    doc.setTextColor(255, 255, 255);
    doc.text('CMR TECHNICAL CAMPUS', 14, 15);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(203, 213, 225);
    doc.text('CLUB TREASURY & FINANCIAL AUDIT STATEMENT', 14, 21);
    doc.text(`Organization: ${clubName.toUpperCase()}`, 14, 26);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(251, 191, 36);
    doc.text('QUARTERLY VOUCHER STATEMENT', w - 14, 21, { align: 'right' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184);
    doc.text(`Period: Q2 2026`, w - 14, 26, { align: 'right' });

    doc.setDrawColor(217, 119, 6);
    doc.setLineWidth(1);
    doc.line(14, 43, w - 14, 43);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(15, 23, 42);
    doc.text(`${clubName.toUpperCase()} — FINANCIAL LEDGER & VOUCHERS`, 14, 52);

    // KPI Cards
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(14, 58, w - 28, 22, 2, 2, 'FD');

    const cardW = (w - 28) / 3;
    const metrics = [
      { label: 'ALLOCATED GRANT', val: '₹1,20,000', color: [30, 58, 138] },
      { label: 'SPONSORSHIPS RECEIVED', val: '₹45,000', color: [217, 119, 6] },
      { label: 'REMAINING BALANCE', val: '₹90,000', color: [5, 150, 105] }
    ];

    metrics.forEach((m, idx) => {
      const cx = 14 + (idx * cardW) + (cardW / 2);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.setTextColor(100, 116, 139);
      doc.text(m.label, cx, 65, { align: 'center' });
      doc.setFontSize(11);
      doc.setTextColor(...m.color);
      doc.text(m.val, cx, 73, { align: 'center' });
    });

    let currentY = 88;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text('Expense Vouchers & Utilization Breakdown', 14, currentY);

    currentY += 5;
    doc.setFillColor(15, 23, 42);
    doc.rect(14, currentY, w - 28, 7, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(255, 255, 255);
    doc.text('Expense Description / Item', 18, currentY + 4.8);
    doc.text('Category', 105, currentY + 4.8);
    doc.text('Date', 140, currentY + 4.8);
    doc.text('Amount (₹)', 175, currentY + 4.8);

    currentY += 7;

    const vouchers = [
      { desc: 'HackFest 2026 Winner Trophies & Swag Kits', cat: 'Event Awards', date: 'Aug 15, 2026', amt: '₹25,000' },
      { desc: 'Technical Workshop Cloud Server Credits', cat: 'Cloud Infra', date: 'Aug 10, 2026', amt: '₹18,000' },
      { desc: 'Seminar Hall Stage Lighting & Audio Setup', cat: 'Logistics', date: 'Aug 04, 2026', amt: '₹14,000' },
      { desc: 'Participant ID Badges & Certificates Printing', cat: 'Stationery', date: 'July 28, 2026', amt: '₹8,000' }
    ];

    vouchers.forEach((v, idx) => {
      doc.setFillColor(idx % 2 === 0 ? 255 : 248, idx % 2 === 0 ? 255 : 250, idx % 2 === 0 ? 255 : 252);
      doc.rect(14, currentY, w - 28, 7, 'F');
      doc.setDrawColor(241, 245, 249);
      doc.line(14, currentY + 7, w - 14, currentY + 7);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(15, 23, 42);
      doc.text(v.desc, 18, currentY + 4.8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(71, 85, 105);
      doc.text(v.cat, 105, currentY + 4.8);
      doc.text(v.date, 140, currentY + 4.8);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(225, 29, 72);
      doc.text(v.amt, 175, currentY + 4.8);

      currentY += 7;
    });

    currentY += 15;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(15, 23, 42);
    doc.text('Club Treasurer', 18, currentY);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    doc.text(`${clubName} Treasury Cell`, 18, currentY + 4);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(15, 23, 42);
    doc.text('Finance Officer', w - 18, currentY, { align: 'right' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    doc.text('CMR Technical Campus Audit Board', w - 18, currentY + 4, { align: 'right' });

    const filename = `${cleanFileName(clubName)}_Quarterly_Financial_Statement.pdf`;
    doc.save(filename);
    return { success: true, filename };
  } catch (err) {
    console.error('Error generating Financial Statement PDF:', err);
    return { success: false, error: err.message };
  }
};
