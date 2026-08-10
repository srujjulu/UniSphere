import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Attach JWT token to all outgoing requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('unisphere_jwt_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.error || error.message || 'Network error connecting to UniSphere backend.';
    return Promise.reject(new Error(message));
  }
);

// ================= Auth Services =================
export const authApi = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  loginDemo: (role) => api.post('/auth/demo', { role }),
  getMe: () => api.get('/auth/me')
};

// ================= Clubs Services =================
export const clubsApi = {
  getAll: () => api.get('/clubs'),
  getById: (id) => api.get(`/clubs/${id}`),
  updateBudget: (id, budget) => api.put(`/clubs/${id}/budget`, { budget })
};

// ================= Membership Requests Services =================
export const requestsApi = {
  apply: (data) => api.post('/requests/apply', data),
  getForClub: (clubId) => api.get(`/requests/club/${clubId}`),
  getMy: () => api.get('/requests/my'),
  updateStatus: (id, status) => api.put(`/requests/${id}/status`, { status })
};

// ================= Events & Tickets Services =================
export const eventsApi = {
  getAll: (clubId) => api.get('/events', { params: { clubId } }),
  create: (data) => api.post('/events', data),
  register: (id) => api.post(`/events/${id}/register`),
  getMyRegistrations: () => api.get('/events/my/registrations')
};

// ================= Certificates & Public Verification =================
export const certificatesApi = {
  getAll: (params) => api.get('/certificates', { params }),
  verifyPublic: (credentialId) => api.get(`/certificates/verify/${credentialId}`),
  issue: (data) => api.post('/certificates/issue', data),
  verifyFaculty: (id) => api.put(`/certificates/${id}/verify`)
};

// ================= Gallery & Albums =================
export const galleryApi = {
  getAll: (clubId) => api.get('/gallery', { params: { clubId } }),
  create: (data) => api.post('/gallery', data),
  update: (id, data) => api.put(`/gallery/${id}`, data),
  delete: (id) => api.delete(`/gallery/${id}`)
};

// ================= Volunteer Hours =================
export const volunteerApi = {
  logHours: (data) => api.post('/volunteer-hours', data),
  getStudentHours: (rollNo) => api.get(`/volunteer-hours/${rollNo}`)
};

// ================= Event Feedback =================
export const feedbackApi = {
  submit: (data) => api.post('/feedback', data),
  getByClub: (clubId) => api.get(`/feedback/club/${clubId}`)
};

export default api;
