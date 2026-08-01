import axios from 'axios';
import { Product, POSMetrics, CheckoutPayload } from '../types';

const API_BASE_URL = 'http://localhost:3001/api';

export const api = {
  async getProducts(search?: string, category?: string): Promise<Product[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/products`, {
        params: { search, category },
      });
      return response.data;
    } catch (error) {
      console.warn('API connection failed, using fallback catalog data.', error);
      return [];
    }
  },

  async getCategories(): Promise<string[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/products/categories`);
      return response.data;
    } catch (error) {
      return ['All', 'Beverages', 'Bakery', 'Snacks', 'Produce', 'Dairy'];
    }
  },

  async getMetrics(): Promise<POSMetrics> {
    try {
      const response = await axios.get(`${API_BASE_URL}/orders/metrics`);
      return response.data;
    } catch (error) {
      return {
        totalSalesToday: 0,
        totalOrdersCount: 0,
        totalItemsSoldToday: 0,
        totalOrdersAllTime: 0,
      };
    }
  },

  async checkoutOrder(payload: CheckoutPayload) {
    const response = await axios.post(`${API_BASE_URL}/orders`, payload);
    return response.data;
  },
};
