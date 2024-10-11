import apiClient from './ServiceAPI';

const UserService = {
  getAllUsers() {
    return apiClient.get('users');
  },

  getUserById(id) {
    return apiClient.get(`users/${id}`);
  },

  createUser(userData) {
    return apiClient.post('users', userData);
  },

  updateUser(id, userData) {
    return apiClient.put(`users/${id}`, userData);
  },

  deleteUser(id) {
    return apiClient.delete(`users/${id}`);
  },
};

export default UserService;
