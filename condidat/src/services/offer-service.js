/* eslint-disable */
import axios from 'axios';
import { API_URL, TYPE } from './environments';
import authHeader from './data-service';

export class OfferService {
  constructor() {}

  async getOffers(limit = 5, page = 1, q = '') {
    try {
      const config = { headers: { ...authHeader() } };
      const { data } = await axios.get(
        `${API_URL}/offer?limit=${limit}&page=${page}&q=${q}`,
        config
      );
      return data;
    } catch (e) {
      throw new Error(e.response.data.error);
    }
  }

  async sendRequest(formData) {
    try {
      const config = { headers: { ...authHeader() } };
      const { data } = await axios.post(`${API_URL}/${TYPE}/request`, { ...formData }, config);
      return data;
    } catch (e) {
      throw new Error(e.response.data.error);
    }
  }
}
