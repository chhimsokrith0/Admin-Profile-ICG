import apiClient from './ServiceAPI';

const AuthService = {
  login(credentials) {
    return apiClient.post('auth/login', credentials);
  },

  logout() {
    return apiClient.post('auth/logout');
  },

  register(userData) {
    return apiClient.post('auth/register', userData);
  },

  getAuthenticatedUser() {
    return apiClient.get('auth/user');
  },
};

export default AuthService;
