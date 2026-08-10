import { getCollection, findById, insertOne, updateById, findOne, find } from '../config/db.js';

// @desc Get all certificates (or filter by student/club)
// @route GET /api/certificates
export const getAllCertificates = (req, res) => {
  try {
    const { clubId, studentRoll } = req.query;
    let certs = getCollection('certificates');

    if (clubId && clubId !== 'all') {
      certs = certs.filter((c) => c.clubId === clubId);
    }
    if (studentRoll) {
      certs = certs.filter((c) => c.studentRoll.toUpperCase() === studentRoll.toUpperCase());
    }

    return res.status(200).json({ success: true, count: certs.length, data: certs });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to fetch certificates.' });
  }
};

// @desc Public Verification by Credential ID (Tamper-proof Certificate Check)
// @route GET /api/certificates/verify/:credentialId
export const verifyCertificateByCredentialId = (req, res) => {
  try {
    const { credentialId } = req.params;
    const cleanId = credentialId.trim().toUpperCase();

    const cert = findOne('certificates', (c) => c.credentialId?.toUpperCase() === cleanId);

    if (!cert) {
      return res.status(404).json({
        success: false,
        valid: false,
        error: `No official record found for Credential ID "${credentialId}".`
      });
    }

    return res.status(200).json({
      success: true,
      valid: cert.status === 'verified',
      data: {
        credentialId: cert.credentialId,
        title: cert.title,
        studentName: cert.studentName,
        studentRoll: cert.studentRoll,
        clubName: cert.clubName,
        eventName: cert.eventName,
        issueDate: cert.issueDate,
        status: cert.status,
        verifiedBy: cert.verifiedBy,
        institution: 'CMR Technical Campus (UGC Autonomous), Hyderabad'
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Verification service error.' });
  }
};

// @desc Issue a new certificate (Core Team / Coordinator)
// @route POST /api/certificates/issue
export const issueCertificate = (req, res) => {
  try {
    const { title, eventName, studentRoll, studentName, clubId, description } = req.body;

    if (!title || !eventName || !studentRoll) {
      return res.status(400).json({ success: false, error: 'Title, eventName, and studentRoll are required.' });
    }

    const club = findById('clubs', clubId || 'codeholics');
    const clubCode = (clubId || 'CMR').toUpperCase().slice(0, 4);
    const credentialId = `CMRTC-2026-${clubCode}-${Math.floor(100 + Math.random() * 900)}`;

    const newCert = insertOne('certificates', {
      credentialId,
      title: title.trim(),
      eventName: eventName.trim(),
      studentRoll: studentRoll.trim().toUpperCase(),
      studentName: studentName || 'Student Member',
      clubId: clubId || 'akriti',
      clubName: club?.name || 'CMRTC Club',
      issueDate: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      status: 'pending_verification',
      verifiedBy: 'Pending Faculty Oversight',
      description: description || 'Awarded for outstanding event achievement.',
      issuedBy: req.user?.name || 'Club Coordinator'
    });

    return res.status(201).json({
      success: true,
      message: `Issued certificate for ${newCert.studentRoll}! Sent to Faculty Verification Queue. 📄`,
      data: newCert
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to issue certificate.' });
  }
};

// @desc Verify / Sign Certificate (Faculty Coordinator / Admin)
// @route PUT /api/certificates/:id/verify
export const verifyCertificate = (req, res) => {
  try {
    const { id } = req.params;
    const cert = findById('certificates', id);

    if (!cert) {
      return res.status(404).json({ success: false, error: 'Certificate record not found.' });
    }

    const verifier = `${req.user?.name || 'Faculty Coordinator'} (${req.user?.department || 'CMRTC'})`;

    const updated = updateById('certificates', id, {
      status: 'verified',
      verifiedBy: verifier,
      verifiedAt: new Date().toISOString()
    });

    return res.status(200).json({
      success: true,
      message: `Official faculty verification complete for ${updated.studentRoll} (${updated.credentialId})! ✔️`,
      data: updated
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to verify certificate.' });
  }
};
