// API configuration
const API_BASE_URL = 'http://localhost:5001/api';
let token = localStorage.getItem('token') || null;

// Helper function to make API calls
async function apiCall(endpoint, method = 'GET', data = null) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (token) {
    options.headers['Authorization'] = `Bearer ${token}`;
  }

  if (data) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'API Error' }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API Error [${method} ${endpoint}]:`, error);
    throw error;
  }
}

// Auth APIs
const AuthAPI = {
  async login(email, password) {
    const res = await apiCall('/users/login', 'POST', { email, password });
    if (res.data && res.data.token) {
      token = res.data.token;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
    }
    return res;
  },

  async register(fullName, email, password) {
    const res = await apiCall('/users/register', 'POST', { fullName, email, password });
    if (res.data && res.data.token) {
      token = res.data.token;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
    }
    return res;
  },

  async logout() {
    token = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return { success: true };
  },

  getToken() {
    return token;
  },

  setToken(newToken) {
    token = newToken;
    if (newToken) {
      localStorage.setItem('token', newToken);
    }
  },

  isLoggedIn() {
    return !!token;
  },

  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }
};

// Resume APIs
const ResumeAPI = {
  async createResume(title, themeColor = '#4f46e5') {
    return apiCall('/resumes/createResume', 'POST', { title, themeColor });
  },

  async getAllResumes() {
    return apiCall('/resumes/getAllResume', 'GET');
  },

  async getResume(id) {
    return apiCall(`/resumes/getResume?id=${id}`, 'GET');
  },

  async updateResume(id, data) {
    return apiCall(`/resumes/updateResume?id=${id}`, 'PUT', data);
  },

  async deleteResume(id) {
    return apiCall(`/resumes/removeResume?id=${id}`, 'DELETE');
  }
};

// Export APIs
window.AuthAPI = AuthAPI;
window.ResumeAPI = ResumeAPI;
