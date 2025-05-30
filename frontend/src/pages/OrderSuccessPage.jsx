import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const OrderSuccessPage = () => {
  return (
    <Container maxWidth="md" sx={{ mt: 4, textAlign: 'center' }}>
      <CheckCircleIcon sx={{ fontSize: 80, color: 'green', mb: 2 }} />
      <Typography variant="h3" gutterBottom>
        Order Placed Successfully!
      </Typography>
      <Typography variant="h5" paragraph>
        Thank you for your purchase
      </Typography>
      <Typography variant="body1" paragraph>
        Your order has been received and is being processed.
      </Typography>
      <Box sx={{ mt: 4 }}>
        <Button 
          component={Link} 
          to="/orders" 
          variant="contained" 
          size="large"
          sx={{ mr: 2 }}
        >
          View Orders
        </Button>
        <Button 
          component={Link} 
          to="/products" 
          variant="outlined" 
          size="large"
        >
          Continue Shopping
        </Button>
      </Box>
    </Container>
  );
};

export default OrderSuccessPage;