// Initial default sponsors per club
export const initialClubSponsors = {
  codeholics: [
    {
      id: 'sp-1',
      name: 'Google Cloud Campus',
      amount: 20000,
      event: 'CMR HackFest 2026',
      description: 'Title sponsor providing cloud credits and cash prizes for winning teams.',
      status: 'Active',
      contact: 'partnerships@google.com'
    },
    {
      id: 'sp-2',
      name: 'Red Bull Student Energy',
      amount: 15000,
      event: 'Campus Hackathons & CodeSprints',
      description: 'Beverage and gaming zone sponsor for all 36-hour hackathons.',
      status: 'Active',
      contact: 'campus@redbull.com'
    },
    {
      id: 'sp-3',
      name: 'Postman API Network',
      amount: 10000,
      event: 'API Workshop & CodeSprint 5.0',
      description: 'Student workshop swag, API credits, and certificates partner.',
      status: 'Confirmed',
      contact: 'community@postman.com'
    }
  ],
  akriti: [
    {
      id: 'sp-4',
      name: 'Spotify India Campus',
      amount: 25000,
      event: 'Pegasus 2026 Cultural Fest',
      description: 'Main stage sound, lighting, and artist memento sponsorship.',
      status: 'Active',
      contact: 'campus@spotify.com'
    },
    {
      id: 'sp-5',
      name: 'Fastrack Youth Trends',
      amount: 15000,
      event: 'Fashion Walk & Dance Battle',
      description: 'Gift vouchers for winners and stage banners.',
      status: 'Active',
      contact: 'marketing@fastrack.in'
    }
  ],
  nss: [
    {
      id: 'sp-6',
      name: 'Rotary Club Hyderabad Medchal',
      amount: 18000,
      event: 'Mega Blood Donation & Cleanliness Drive',
      description: 'Medical supplies, blood donor refreshments, and plantation saplings.',
      status: 'Active',
      contact: 'medchal@rotary.org'
    }
  ],
  lexis: [
    {
      id: 'sp-7',
      name: 'Oxford Book Store Hyderabad',
      amount: 12000,
      event: 'Word-Smith Parliamentary Debate',
      description: 'Book vouchers and trophies for best debaters and delegates.',
      status: 'Active',
      contact: 'events@oxfordbookstore.in'
    }
  ],
  f9: [
    {
      id: 'sp-8',
      name: 'Nikon India Creators Network',
      amount: 16000,
      event: 'F9 Insta-Walk Photowalk & Exhibition',
      description: 'Exhibition frames printing and lens kit gear display.',
      status: 'Active',
      contact: 'creators@nikon.in'
    }
  ],
  ncc: [
    {
      id: 'sp-9',
      name: 'Veterans Welfare Trust',
      amount: 14000,
      event: 'Annual ATC Training Camp & Rifle Drill',
      description: 'Uniform insignias, obstacle course gear, and training hydration kits.',
      status: 'Active',
      contact: 'trust@veterans.org'
    }
  ]
};

// Initial default expenses per club
export const initialClubExpenses = {
  codeholics: [
    {
      id: 'exp-1',
      title: 'HackFest High-Speed Router Setup & Fiber Bandwidth',
      amount: 6500,
      category: 'Equipment',
      event: 'CMR HackFest 2026',
      date: '2026-08-15',
      description: 'Dedicated 1Gbps fiber lines and 8 Gigabit switches for 200 participants.'
    },
    {
      id: 'exp-2',
      title: 'Midnight Refreshments, Pizza & Red Bull Restock',
      amount: 8500,
      category: 'Food & Refreshments',
      event: 'CMR HackFest 2026',
      date: '2026-08-18',
      description: 'Late night meals for participants, mentors, and organizing team.'
    },
    {
      id: 'exp-3',
      title: 'CodeSprint Trophies, Medals & Cash Prize Vouchers',
      amount: 5000,
      category: 'Event Expenses',
      event: 'CodeSprint 5.0',
      date: '2026-08-01',
      description: 'Custom glass trophies and prize envelopes for Top 3 teams.'
    }
  ],
  akriti: [
    {
      id: 'exp-4',
      title: 'Auditorium Pro Audio & LED Stage Lighting',
      amount: 18000,
      category: 'Venue',
      event: 'Pegasus 2026 Cultural Fest',
      date: '2026-08-10',
      description: 'Pro sound mixer and intelligent stage lighting package.'
    }
  ],
  nss: [
    {
      id: 'exp-5',
      title: '500 Forest Nursery Saplings & Gardening Tools',
      amount: 5500,
      category: 'Event Expenses',
      event: 'Swachh Bharat Cleanliness & Greenery Drive',
      date: '2026-07-25',
      description: 'Saplings, compost bags, watering cans, and cotton hand gloves.'
    }
  ],
  lexis: [
    {
      id: 'exp-6',
      title: 'Debate Dossiers Printing & MUN Country Placards',
      amount: 3200,
      category: 'Marketing',
      event: 'Word-Smith Parliamentary Debate',
      date: '2026-08-05',
      description: 'High-quality acrylic placards and research folders for 60 delegates.'
    }
  ],
  f9: [
    {
      id: 'exp-7',
      title: 'Art Gallery Glossy Prints & Mounting Boards',
      amount: 4500,
      category: 'Event Expenses',
      event: 'F9 Annual Campus Photowalk Exhibition',
      date: '2026-08-12',
      description: 'A3 luster paper photo enlargements and foam core frames.'
    }
  ],
  ncc: [
    {
      id: 'exp-8',
      title: 'Ceremonial Drill Berets & Brass Buckles Kit',
      amount: 6000,
      category: 'Equipment',
      event: 'Republic Day Parade & Rifle Drill',
      date: '2026-08-14',
      description: 'Standardization badges and webbing belts for cadets.'
    }
  ]
};

// Base club budgets allocated by institution
export const defaultClubBaseBudget = {
  codeholics: 45000,
  akriti: 50000,
  nss: 35000,
  lexis: 30000,
  f9: 30000,
  ncc: 40000
};

// Storage keys
const SPONSORS_STORAGE_PREFIX = 'cmrtc_club_sponsors_';
const EXPENSES_STORAGE_PREFIX = 'cmrtc_club_expenses_';
const BASE_BUDGET_STORAGE_PREFIX = 'cmrtc_club_base_budget_';

// Get sponsors for a club
export const getClubSponsors = (clubId) => {
  if (typeof window === 'undefined') return initialClubSponsors[clubId] || [];
  const stored = localStorage.getItem(`${SPONSORS_STORAGE_PREFIX}${clubId}`);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return initialClubSponsors[clubId] || [];
    }
  }
  return initialClubSponsors[clubId] || [];
};

// Save all sponsors for a club
export const saveClubSponsors = (clubId, sponsorsList) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(`${SPONSORS_STORAGE_PREFIX}${clubId}`, JSON.stringify(sponsorsList));
};

// Add single sponsor
export const addClubSponsor = (clubId, sponsorData) => {
  const current = getClubSponsors(clubId);
  const newSponsor = {
    ...sponsorData,
    id: sponsorData.id || `sp-${Date.now()}`,
    amount: Number(sponsorData.amount) || 0,
    status: sponsorData.status || 'Active'
  };
  const updated = [newSponsor, ...current];
  saveClubSponsors(clubId, updated);
  return updated;
};

// Update single sponsor
export const updateClubSponsor = (clubId, sponsorId, updatedData) => {
  const current = getClubSponsors(clubId);
  const updated = current.map(s => s.id === sponsorId ? {
    ...s,
    ...updatedData,
    amount: Number(updatedData.amount !== undefined ? updatedData.amount : s.amount)
  } : s);
  saveClubSponsors(clubId, updated);
  return updated;
};

// Delete single sponsor
export const deleteClubSponsor = (clubId, sponsorId) => {
  const current = getClubSponsors(clubId);
  const updated = current.filter(s => s.id !== sponsorId);
  saveClubSponsors(clubId, updated);
  return updated;
};

// Get expenses for a club
export const getClubExpenses = (clubId) => {
  if (typeof window === 'undefined') return initialClubExpenses[clubId] || [];
  const stored = localStorage.getItem(`${EXPENSES_STORAGE_PREFIX}${clubId}`);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return initialClubExpenses[clubId] || [];
    }
  }
  return initialClubExpenses[clubId] || [];
};

// Save expenses for a club
export const saveClubExpenses = (clubId, expensesList) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(`${EXPENSES_STORAGE_PREFIX}${clubId}`, JSON.stringify(expensesList));
};

// Add single expense
export const addClubExpense = (clubId, expenseData) => {
  const current = getClubExpenses(clubId);
  const newExpense = {
    ...expenseData,
    id: expenseData.id || `exp-${Date.now()}`,
    amount: Number(expenseData.amount) || 0,
    date: expenseData.date || new Date().toISOString().split('T')[0]
  };
  const updated = [newExpense, ...current];
  saveClubExpenses(clubId, updated);
  return updated;
};

// Update single expense
export const updateClubExpense = (clubId, expenseId, updatedData) => {
  const current = getClubExpenses(clubId);
  const updated = current.map(e => e.id === expenseId ? {
    ...e,
    ...updatedData,
    amount: Number(updatedData.amount !== undefined ? updatedData.amount : e.amount)
  } : e);
  saveClubExpenses(clubId, updated);
  return updated;
};

// Delete single expense
export const deleteClubExpense = (clubId, expenseId) => {
  const current = getClubExpenses(clubId);
  const updated = current.filter(e => e.id !== expenseId);
  saveClubExpenses(clubId, updated);
  return updated;
};

// Base budget helpers
export const getClubBaseBudget = (clubId) => {
  if (typeof window === 'undefined') return defaultClubBaseBudget[clubId] || 45000;
  const stored = localStorage.getItem(`${BASE_BUDGET_STORAGE_PREFIX}${clubId}`);
  if (stored) {
    const parsed = Number(stored);
    if (!isNaN(parsed) && parsed > 0) return parsed;
  }
  return defaultClubBaseBudget[clubId] || 45000;
};

export const setClubBaseBudget = (clubId, amount) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(`${BASE_BUDGET_STORAGE_PREFIX}${clubId}`, String(amount));
};

// Compute complete financial summary for a club
export const getClubFinancialSummary = (clubId) => {
  const baseBudget = getClubBaseBudget(clubId);
  const sponsors = getClubSponsors(clubId);
  const expenses = getClubExpenses(clubId);

  const totalSponsorship = sponsors.reduce((sum, s) => sum + (Number(s.amount) || 0), 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
  const availableBalance = baseBudget + totalSponsorship - totalExpenses;

  return {
    baseBudget,
    totalSponsorship,
    totalExpenses,
    availableBalance,
    sponsorsCount: sponsors.length,
    expensesCount: expenses.length
  };
};

export const getStoredSponsors = () => {
  const clubIds = ['codeholics', 'akriti', 'nss', 'photography', 'lexis', 'ncc'];
  const all = [];
  clubIds.forEach(id => {
    const list = getClubSponsors(id);
    list.forEach(s => all.push({ ...s, clubId: id }));
  });
  return all;
};

export const getStoredExpenses = () => {
  const clubIds = ['codeholics', 'akriti', 'nss', 'photography', 'lexis', 'ncc'];
  const all = [];
  clubIds.forEach(id => {
    const list = getClubExpenses(id);
    list.forEach(e => all.push({ ...e, clubId: id }));
  });
  return all;
};

export const getStoredBudgetData = () => {
  const clubIds = ['codeholics', 'akriti', 'nss', 'photography', 'lexis', 'ncc'];
  return clubIds.map(id => ({
    clubId: id,
    ...getClubFinancialSummary(id)
  }));
};

