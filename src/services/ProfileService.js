// src/services/ProfileService.js
import apiClient from './ServiceAPI';

const ProfileService = {
  getProfiles(page = 1, perPage = 10) {
    return apiClient.get(`profiles?page=${page}&perPage=${perPage}`);
  },
  getProfileById(id) {
    return apiClient.get(`profiles/${id}`);
  },
  updateProfile(id, profileData) {
    return apiClient.put(`profiles/${id}`, profileData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  createProfile(profileData) {
    return apiClient.post('profiles', profileData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  deleteProfile(id) {
    return apiClient.delete(`profiles/${id}`);
  },
};

export default ProfileService;
