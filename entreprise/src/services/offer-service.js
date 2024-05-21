/* eslint-disable */
import axios from 'axios';
import { API_URL, TYPE } from './environments';
import authHeader from './data-service';

export class OfferService {
  constructor() {}

  async getOffersPublic(limit = 5, page = 1, q = '') {
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

  async getOffers() {
    try {
      const config = { headers: { ...authHeader() } };
      const { data } = await axios.get(`${API_URL}/${TYPE}/offer`, config);
      return data;
    } catch (e) {
      throw new Error(e.response.data.error);
    }
  }

  async getOfferById(id) {
    try {
      const config = { headers: { ...authHeader() } };
      const { data } = await axios.get(`${API_URL}/${TYPE}/offer/${id}`, config);
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

  async createOffer(formData) {
    try {
      const config = { headers: { ...authHeader() } };
      const { data } = await axios.post(`${API_URL}/${TYPE}/offer`, formData, config);
      return data;
    } catch (e) {
      throw new Error(e.response.data.error);
    }
  }

  async updateOffer(formData, id) {
    try {
      const config = { headers: { ...authHeader() } };
      const { data } = await axios.post(`${API_URL}/${TYPE}/offer/${id}`, formData, config);
      return data;
    } catch (e) {
      throw new Error(e.response.data.error);
    }
  }
}
