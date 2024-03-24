/* eslint-disable */
import axios from 'axios';
import { API_URL, TYPE } from './environments';
import authHeader from './data-service';

export class ProfileService {
  constructor() {}

  async getProfile() {
    try {
      const config = { headers: { ...authHeader() } };
      const { data } = await axios.get(`${API_URL}/${TYPE}`, config);
      return data;
    } catch (e) {
      throw new Error(e);
    }
  }

  async updateProfilePhoto(formData) {
    try {
      const config = { headers: { ...authHeader() } };
      const { data } = await axios.post(`${API_URL}/${TYPE}/picture`, formData, config);
      return data;
    } catch (e) {
      throw new Error(e);
    }
  }
}
