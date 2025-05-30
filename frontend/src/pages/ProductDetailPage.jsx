import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Grid, 
  Card, 
  CardMedia, 
  CardContent, 
  Typography, 
  Button, 
  TextField,
  Box,
  CircularProgress
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { getProduct } from '../api/productService';
import { useCart } from '../context/CartContext';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await getProduct(id);
        setProduct(data);
      } catch (error) {
        console.error(`Error fetching product ${id}:`, error);
        navigate('/products');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, navigate]);

  const handleAddToCart = () => {
    addToCart({ ...product, quantity });
    navigate('/cart');
  };

  if (loading || !product) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardMedia
              component="img"
              image={product.imageUrl || '/placeholder-product.png'}
              alt={product.name}
              sx={{ height: 400, objectFit: 'contain', p: 2 }}
            />
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <CardContent>
            <Typography variant="h4" gutterBottom>
              {product.name}
            </Typography>
            <Typography variant="h5" color="primary" gutterBottom>
              ${product.price.toFixed(2)}
            </Typography>
            <Typography variant="body1" paragraph>
              {product.description}
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              {product.stock > 0 
                ? `${product.stock} available in stock` 
                : 'Out of stock'}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 3, mb: 3 }}>
              <TextField
                type="number"
                label="Quantity"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                inputProps={{ min: 1, max: product.stock }}
                sx={{ width: 100, mr: 2 }}
              />
              <Button 
                variant="contained" 
                color="primary" 
                size="large"
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
              >
                Add to Cart
              </Button>
            </Box>
          </CardContent>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProductDetailPage;