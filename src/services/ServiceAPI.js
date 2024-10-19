// src/services/ServiceAPI.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://api-profile-qwom.onrender.com/api',
  // baseURL: 'http://localhost:3000/api',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

export default apiClient;
