import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, textAlign: 'center' }}>
      <Typography variant="h2" gutterBottom>
        Welcome to the online Store by Alok
      </Typography>
      <Typography variant="h5" paragraph>
        Discover amazing products at great prices
      </Typography>
      <Box sx={{ mt: 4 }}>
        <Button 
          component={Link} 
          to="/products" 
          variant="contained" 
          size="large"
          sx={{ mr: 2 }}
        >
          Shop Now
        </Button>
        <Button 
          component={Link} 
          to="/orders" 
          variant="outlined" 
          size="large"
        >
          View Orders
        </Button>
      </Box>
    </Container>
  );
};

export default HomePage;