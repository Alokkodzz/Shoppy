import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Container, TextField, Typography } from '@mui/material';
import { createProduct } from '../api/productService';

const AddProductPage = () => {
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: 0,
    stock: 0,
    imageFile: null
  });
  const [previewImage, setPreviewImage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProduct(prev => ({ ...prev, imageFile: file }));
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createProduct(product);
      navigate('/products');
    } catch (error) {
      console.error('Error creating product:', error);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Add New Product</Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
        <TextField
          fullWidth
          label="Product Name"
          name="name"
          value={product.name}
          onChange={handleChange}
          required
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Description"
          name="description"
          value={product.description}
          onChange={handleChange}
          multiline
          rows={4}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Price"
          name="price"
          type="number"
          value={product.price}
          onChange={handleChange}
          required
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Stock Quantity"
          name="stock"
          type="number"
          value={product.stock}
          onChange={handleChange}
          required
          sx={{ mb: 2 }}
        />
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Product Image
          </Typography>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            required
          />
          {previewImage && (
            <Box sx={{ mt: 2 }}>
              <img 
                src={previewImage} 
                alt="Preview" 
                style={{ maxWidth: '200px', maxHeight: '200px' }}
              />
            </Box>
          )}
        </Box>
        <Button 
          type="submit" 
          variant="contained" 
          color="primary"
          size="large"
        >
          Add Product
        </Button>
      </Box>
    </Container>
  );
};

export default AddProductPage;