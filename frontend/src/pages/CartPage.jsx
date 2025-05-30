import React from 'react';
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Box,
  TextField,
  Grid
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import DeleteIcon from '@mui/icons-material/Delete';

const CartPage = () => {
  const navigate = useNavigate();
  const {
    cartItems,
    cartCount,
    cartTotal,
    removeFromCart,
    updateQuantity,
    clearCart
  } = useCart();

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (cartCount === 0) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>
          Your cart is empty
        </Typography>
        <Button 
          component={Link} 
          to="/products" 
          variant="contained" 
          color="primary"
        >
          Continue Shopping
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Shopping Cart ({cartCount} items)
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell align="right">Price</TableCell>
                  <TableCell align="center">Quantity</TableCell>
                  <TableCell align="right">Total</TableCell>
                  <TableCell align="right">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cartItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <img 
                          src={item.imageUrl || '/placeholder-product.png'} 
                          alt={item.name} 
                          style={{ width: 50, height: 50, marginRight: 16 }} 
                        />
                        <Typography>{item.name}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="right">${item.price.toFixed(2)}</TableCell>
                    <TableCell align="center">
                      <TextField
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                        inputProps={{ min: 1 }}
                        sx={{ width: 70 }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      ${(item.price * item.quantity).toFixed(2)}
                    </TableCell>
                    <TableCell align="right">
                      <Button 
                        onClick={() => removeFromCart(item.id)}
                        color="error"
                      >
                        <DeleteIcon />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box sx={{ mt: 2, textAlign: 'right' }}>
            <Button 
              onClick={clearCart}
              color="error"
              variant="outlined"
            >
              Clear Cart
            </Button>
          </Box>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Order Summary
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography>Subtotal ({cartCount} items)</Typography>
              <Typography>${cartTotal.toFixed(2)}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography>Shipping</Typography>
              <Typography>FREE</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6">Total</Typography>
              <Typography variant="h6">${cartTotal.toFixed(2)}</Typography>
            </Box>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              onClick={handleCheckout}
            >
              Proceed to Checkout
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CartPage;