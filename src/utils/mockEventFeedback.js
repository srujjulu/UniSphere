export const initialFeedbackData = {
  'cal-9': {
    eventId: 'cal-9',
    eventTitle: 'Pegasus 2025 Annual Cultural Fest Showcase',
    clubId: 'akriti',
    clubName: 'AKRITI Cultural Club',
    reviews: [
      {
        id: 'rev-1',
        rollNo: '237R1A05BA',
        studentName: 'Student Member',
        rating: 5,
        comment: 'Absolutely mesmerizing performances! The group dance battles and stage lighting setup were world-class.',
        date: 'July 16, 2026',
        likes: 12
      },
      {
        id: 'rev-2',
        rollNo: '237R1A0501',
        studentName: 'Ananya Sharma',
        rating: 5,
        comment: 'Best cultural fest in CMRTC history. The sound system and security coordination were top notch!',
        date: 'July 16, 2026',
        likes: 8
      },
      {
        id: 'rev-3',
        rollNo: '237R1A0512',
        studentName: 'Rahul Verma',
        rating: 4,
        comment: 'Great energy and talent showcase. Food stalls could have had more seating space.',
        date: 'July 17, 2026',
        likes: 5
      }
    ]
  },
  'cal-4': {
    eventId: 'cal-4',
    eventTitle: 'CMR HackFest 2026 36-Hour Hackathon',
    clubId: 'codeholics',
    clubName: 'Codeholics Tech Club',
    reviews: [
      {
        id: 'rev-4',
        rollNo: '237R1A05BA',
        studentName: 'Student Member',
        rating: 5,
        comment: 'The mentor guidance from Google developers was game changing! High-speed Wi-Fi and Red Bull kept us coding all 36 hours.',
        date: 'Sept 07, 2026',
        likes: 15
      },
      {
        id: 'rev-5',
        rollNo: '237R1A0588',
        studentName: 'Karthik Rao',
        rating: 4.5,
        comment: 'Incredible hackathon problem statements. Loved the AI agent tracks!',
        date: 'Sept 07, 2026',
        likes: 9
      }
    ]
  },
  'cal-3': {
    eventId: 'cal-3',
    eventTitle: 'Word-Smith Parliamentary Debate & MUN',
    clubId: 'lexis',
    clubName: 'The Lexis Club',
    reviews: [
      {
        id: 'rev-6',
        rollNo: '237R1A0505',
        studentName: 'Sneha Kapur',
        rating: 5,
        comment: 'High quality debate chairs and rigorous UN resolution drafting rules. Excellent organization by Lexis leads.',
        date: 'August 31, 2026',
        likes: 7
      }
    ]
  }
};

export const getStoredFeedbackData = () => {
  if (typeof window === 'undefined') return initialFeedbackData;
  const stored = localStorage.getItem('cmrtc_event_feedback_data');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return initialFeedbackData;
    }
  }
  return initialFeedbackData;
};

export const hasStudentSubmittedFeedback = (eventId, studentRoll = '237R1A05BA') => {
  const allData = getStoredFeedbackData();
  const eventRecord = allData[eventId];
  if (!eventRecord || !eventRecord.reviews) return false;
  return eventRecord.reviews.some(r => r.rollNo.toUpperCase() === studentRoll.toUpperCase());
};

export const saveEventFeedback = ({ eventId, eventTitle, clubId, clubName, rating, comment, studentRoll = '237R1A05BA', studentName = 'Student Member' }) => {
  if (typeof window === 'undefined') return;

  const allData = getStoredFeedbackData();
  const eventRecord = allData[eventId] || {
    eventId,
    eventTitle: eventTitle || 'CMRTC Campus Event',
    clubId: clubId || 'codeholics',
    clubName: clubName || 'Campus Club',
    reviews: []
  };

  // Prevent duplicate submissions
  if (hasStudentSubmittedFeedback(eventId, studentRoll)) {
    return { success: false, message: 'You have already submitted feedback for this event!' };
  }

  const newReview = {
    id: `rev-${Date.now()}`,
    rollNo: studentRoll.toUpperCase(),
    studentName,
    rating: Number(rating),
    comment: comment.trim(),
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
    likes: 1
  };

  const updatedReviews = [newReview, ...(eventRecord.reviews || [])];

  const updatedAll = {
    ...allData,
    [eventId]: {
      ...eventRecord,
      reviews: updatedReviews
    }
  };

  localStorage.setItem('cmrtc_event_feedback_data', JSON.stringify(updatedAll));
  return { success: true, newReview, updatedAll };
};

export const getEventFeedbackSummary = (eventId) => {
  const allData = getStoredFeedbackData();
  const eventRecord = allData[eventId] || { reviews: [] };
  const reviews = eventRecord.reviews || [];

  const totalReviews = reviews.length;
  const sumRating = reviews.reduce((acc, r) => acc + (r.rating || 5), 0);
  const avgRating = totalReviews > 0 ? (sumRating / totalReviews).toFixed(1) : '5.0';

  const mostLikedComments = [...reviews].sort((a, b) => (b.likes || 0) - (a.likes || 0)).slice(0, 3);

  return {
    totalReviews,
    avgRating,
    feedbackList: reviews,
    mostLikedComments,
    eventTitle: eventRecord.eventTitle,
    clubName: eventRecord.clubName
  };
};

export const getAllFeedbackSummaries = () => {
  const allData = getStoredFeedbackData();
  const result = [];

  Object.keys(allData).forEach(eventId => {
    const summary = getEventFeedbackSummary(eventId);
    result.push({
      eventId,
      ...summary
    });
  });

  return result;
};
