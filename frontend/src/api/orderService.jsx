import axios from 'axios';

//const API_URL = process.env.VITE_PRODUCT_SERVICE_URL || 'http://3.94.57.46:5002/api';

const API_URL = 'http://3.94.57.46:5002/api';

export const createOrder = async (orderData) => {
  try {
    const response = await axios.post(`${API_URL}/orders`, orderData);
    return response.data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

export const getOrder = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/orders/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching order ${id}:`, error);
    throw error;
  }
};

export const getOrders = async (userId) => {
  try {
    const url = userId ? `${API_URL}/orders?userId=${userId}` : `${API_URL}/orders`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

export const updateOrderStatus = async (id, status) => {
  try {
    const response = await axios.put(`${API_URL}/orders/${id}/status`, { status });
    return response.data;
  } catch (error) {
    console.error(`Error updating order ${id} status:`, error);
    throw error;
  }
};