// src/services/ServiceAPI.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://api-profile-qwom.onrender.com/api', // Change this to your actual API base URL
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

export default apiClient;
