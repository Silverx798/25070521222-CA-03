import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Attach JWT token from localStorage if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('mythos_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Story Endpoints
export const fetchStories = async (params = {}) => {
  const res = await api.get('/stories', { params });
  return res.data;
};

export const fetchFeaturedStories = async () => {
  const res = await api.get('/stories/featured');
  return res.data.data;
};

export const fetchPopularStories = async () => {
  const res = await api.get('/stories/popular');
  return res.data.data;
};

export const fetchRecentStories = async () => {
  const res = await api.get('/stories/recent');
  return res.data.data;
};

export const fetchStoryBySlug = async (slug) => {
  const res = await api.get(`/stories/${slug}`);
  return res.data;
};

export const fetchMapStories = async (params = {}) => {
  const res = await api.get('/stories/map', { params });
  return res.data.data;
};

export const fetchRegions = async () => {
  const res = await api.get('/regions');
  return res.data.data;
};

export const searchStories = async (q) => {
  const res = await api.get('/search', { params: { q } });
  return res.data.data;
};

// Auth Endpoints
export const loginUser = async (credentials) => {
  const res = await api.post('/auth/login', credentials);
  if (res.data.token) {
    localStorage.setItem('mythos_token', res.data.token);
  }
  return res.data;
};

export const registerUser = async (userData) => {
  const res = await api.post('/auth/register', userData);
  if (res.data.token) {
    localStorage.setItem('mythos_token', res.data.token);
  }
  return res.data;
};

export const logoutUser = async () => {
  try {
    await api.post('/auth/logout');
  } finally {
    localStorage.removeItem('mythos_token');
  }
};

export const getMe = async () => {
  const res = await api.get('/auth/me');
  return res.data.user;
};

// User Profile & Collections
export const fetchUserProfile = async () => {
  const res = await api.get('/me');
  return res.data.data;
};

export const updateUserProfile = async (updates) => {
  const res = await api.patch('/me', updates);
  return res.data.data;
};

export const fetchUserSubmissions = async () => {
  const res = await api.get('/me/submissions');
  return res.data.data;
};

export const fetchUserBookmarks = async () => {
  const res = await api.get('/me/bookmarks');
  return res.data.data;
};

export const addBookmark = async (storyId) => {
  const res = await api.post(`/stories/${storyId}/bookmark`);
  return res.data;
};

export const removeBookmark = async (storyId) => {
  const res = await api.delete(`/stories/${storyId}/bookmark`);
  return res.data;
};

export const submitStory = async (storyData) => {
  const res = await api.post('/submissions', storyData);
  return res.data;
};

// Admin Moderation Endpoints
export const fetchAdminSubmissions = async (params = {}) => {
  const res = await api.get('/admin/submissions', { params });
  return res.data;
};

export const updateSubmissionStatus = async (id, payload) => {
  const res = await api.patch(`/admin/submissions/${id}`, payload);
  return res.data;
};

export const fetchReports = async () => {
  const res = await api.get('/admin/reports');
  return res.data.data;
};

export const updateReportStatus = async (id, status) => {
  const res = await api.patch(`/admin/reports/${id}`, { status });
  return res.data;
};

export const fetchAssetDiagnostics = async () => {
  const res = await api.get('/admin/diagnostics');
  return res.data.data;
};

export default api;

