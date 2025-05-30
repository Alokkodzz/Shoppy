import axios from 'axios';

const API_URL = process.env.VITE_ORDER_SERVICE_URL || 'http://localhost:5001/api';

export const getProducts = async (page = 1, pageSize = 10) => {
  try {
    const response = await axios.get(`${API_URL}/products?page=${page}&pageSize=${pageSize}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const getProduct = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/products/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
    throw error;
  }
};

export const createProduct = async (productData) => {
  try {
    const formData = new FormData();
    formData.append('Name', productData.name);
    formData.append('Description', productData.description);
    formData.append('Price', productData.price);
    formData.append('Stock', productData.stock);
    if (productData.imageFile) {
      formData.append('ImageFile', productData.imageFile);
    }

    const response = await axios.post(`${API_URL}/products`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};