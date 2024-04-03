/* eslint-disable */
import axios from 'axios';
import { ProfileService } from './profile-service';

const API_URL = 'http://localhost:3000';
const TYPE = 'entreprise';

export class AuthService {
  constructor() {}

  async login(email, password) {
    try {
      const { data } = await axios.post(`${API_URL}/auth/${TYPE}/login`, { email, password });
      localStorage.setItem('token', data.token.access_token);
      localStorage.setItem('user', JSON.stringify(data[TYPE]));
      return data;
    } catch (e) {
      throw new Error(e);
    }
  }

  async register(name, email, password) {
    try {
      const { data } = await axios.post(`${API_URL}/auth/${TYPE}/register`, {
        name,
        email,
        password,
      });

      return data;
    } catch (e) {
      throw new Error(e);
    }
  }

  async logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  static isAuthenticated() {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');

    return !!user && !!token;
  }

  static userValue() {
    const user = JSON.parse(localStorage.getItem('user'));
    return { ...user, photoURL: user?.photo ?? 'https://picsum.photos/300/300' };
  }

  static async reloadData() {
    const profileService = new ProfileService();
    const user = await profileService.getProfile();
    localStorage.setItem('user', JSON.stringify(user));
  }

  async sendMailRestPassword(email) {
    try {
      const { data } = await axios.post(`${API_URL}/${TYPE}/rest-password`, { email });
      return data;
    } catch (e) {
      throw new Error(e.response.data.error);
    }
  }

  async validateTokenRestPassword(token) {
    try {
      const { data } = await axios.get(`${API_URL}/${TYPE}/rest-password/${token}`);
      return data;
    } catch (e) {
      throw new Error(e.response.data.error);
    }
  }

  async resetPassword(token, password) {
    try {
      const { data } = await axios.post(`${API_URL}/${TYPE}/rest-password/${token}`, { password });
      return data;
    } catch (e) {
      throw new Error(e.response.data.error);
    }
  }
}
