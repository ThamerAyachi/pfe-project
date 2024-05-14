/* eslint-disable */
import axios from 'axios';
import { API_URL, TYPE } from './environments';
import authHeader from './data-service';

export class OfferService {
  constructor() {}

  async getOffers() {
    try {
      const config = { headers: { ...authHeader() } };
      const { data } = await axios.get(`${API_URL}/${TYPE}/offer`, config);
      return data;
    } catch (e) {
      throw new Error(e.response.data.error);
    }
  }

  async deleteOffer(id) {
    try {
      const config = { headers: { ...authHeader() } };
      const { data } = await axios.delete(`${API_URL}/${TYPE}/offer/${id}`, config);
      return data;
    } catch (e) {
      throw new Error(e.response.data.error);
    }
  }
}
