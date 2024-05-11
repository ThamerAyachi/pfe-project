/* eslint-disable */
import axios from 'axios';
import { API_URL, TYPE } from './environments';
import authHeader from './data-service';

export class ResumeService {
  constructor() {}

  async getResumes() {
    try {
      const config = { headers: { ...authHeader() } };
      const { data } = await axios.get(`${API_URL}/${TYPE}/resume`, config);
      return data;
    } catch (e) {
      throw new Error(e.response.data.error);
    }
  }

  async uploadResume(formData) {
    try {
      const config = { headers: { ...authHeader() } };
      const { data } = await axios.post(`${API_URL}/${TYPE}/resume`, formData, config);
      return data;
    } catch (e) {
      throw new Error(e.response.data.error);
    }
  }

  async generateResume(formData) {
    try {
      const config = { headers: { ...authHeader() } };
      const { data } = await axios.post(`${API_URL}/${TYPE}/resume/generate`, formData, config);
      return data;
    } catch (e) {
      throw new Error(e.response.data.error);
    }
  }

  async deleteResume(id) {
    try {
      const config = { headers: { ...authHeader() } };
      const { data } = await axios.delete(`${API_URL}/${TYPE}/resume/${id}`, config);
      return data;
    } catch (e) {
      throw new Error(e.response.data.error);
    }
  }
}
