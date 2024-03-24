/* eslint-disable */
import axios from 'axios';
import { API_URL, TYPE } from './environments';
import { ProfileService } from './profile-service';

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

  async register(firstName, lastName, email, password) {
    try {
      const { data } = await axios.post(`${API_URL}/auth/${TYPE}/register`, {
        firstName,
        lastName,
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
    return { ...user, photoURL: user.photo ?? 'https://picsum.photos/300/300' };
  }

  static async reloadData() {
    const profileService = new ProfileService();
    const user = await profileService.getProfile();
    localStorage.setItem('user', JSON.stringify(user));
  }
}
