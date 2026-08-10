import { getCollection, findById, insertOne, updateById, find } from '../config/db.js';

// @desc Get all events
// @route GET /api/events
export const getAllEvents = (req, res) => {
  try {
    const { clubId } = req.query;
    let events = getCollection('events');

    if (clubId && clubId !== 'all') {
      events = events.filter((e) => e.clubId === clubId);
    }

    return res.status(200).json({ success: true, count: events.length, data: events });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to fetch events.' });
  }
};

// @desc Create new event (Core Team / Faculty / Admin)
// @route POST /api/events
export const createEvent = (req, res) => {
  try {
    const { title, clubId, date, venue, tag, desc, seatsLimit, budget, coverImage } = req.body;

    if (!title || !clubId) {
      return res.status(400).json({ success: false, error: 'Event title and clubId are required.' });
    }

    const club = findById('clubs', clubId);
    const newEvent = insertOne('events', {
      title: title.trim(),
      clubId,
      clubName: club?.name || clubId,
      date: date || 'Upcoming 2026',
      venue: venue || 'CMRTC Main Campus',
      tag: tag || 'Campus Event',
      desc: desc || 'Official CMRTC student club event.',
      seatsLimit: Number(seatsLimit) || 100,
      seatsBooked: 0,
      budget: budget || '₹10,000',
      coverImage: coverImage || '/images/codeholics/codeholics-hack-the-verse.png',
      status: 'Registration Open',
      createdBy: req.user?.name || 'Coordinator'
    });

    return res.status(201).json({
      success: true,
      message: `Created event: "${newEvent.title}" 🎉`,
      data: newEvent
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to create event.' });
  }
};

// @desc Register student for an event
// @route POST /api/events/:id/register
export const registerForEvent = (req, res) => {
  try {
    const { id } = req.params;
    const event = findById('events', id);

    if (!event) {
      return res.status(404).json({ success: false, error: 'Event not found.' });
    }

    const rollNo = req.user?.rollNumber || (req.user?.email ? req.user.email.split('@')[0].toUpperCase() : 'STUDENT');
    const name = req.user?.name || 'Student Member';

    // Check if already registered
    const registrations = getCollection('registrations');
    const alreadyReg = registrations.find((r) => r.eventId === id && r.studentRoll === rollNo);

    if (alreadyReg) {
      return res.status(400).json({ success: false, error: 'You are already registered for this event.' });
    }

    // Check seat capacity
    if (event.seatsBooked >= event.seatsLimit) {
      return res.status(400).json({ success: false, error: 'Sorry, this event has reached full capacity.' });
    }

    // Generate digital QR pass ID
    const qrPassId = `CMRTC-TICKET-${Date.now().toString(36).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;

    const newRegistration = insertOne('registrations', {
      eventId: id,
      eventTitle: event.title,
      clubId: event.clubId,
      studentRoll: rollNo,
      studentName: name,
      qrPassId,
      status: 'confirmed',
      registeredAt: new Date().toISOString()
    });

    // Increment seats booked
    updateById('events', id, { seatsBooked: (event.seatsBooked || 0) + 1 });

    return res.status(201).json({
      success: true,
      message: `🎉 Registered for "${event.title}"! Digital pass generated: ${qrPassId}`,
      data: newRegistration
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to register for event.' });
  }
};

// @desc Get student registered events
// @route GET /api/events/my/registrations
export const getMyRegistrations = (req, res) => {
  try {
    const rollNo = req.user?.rollNumber;
    const myRegistrations = find('registrations', (r) => r.studentRoll === rollNo);

    return res.status(200).json({ success: true, count: myRegistrations.length, data: myRegistrations });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to fetch registered events.' });
  }
};
