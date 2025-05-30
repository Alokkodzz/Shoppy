import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  IconButton, 
  Badge,
  Box
} from '@mui/material';
import { ShoppingCart, AccountCircle } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

const NavBar = () => {
  const { cartCount } = useCart();

  return (
    <AppBar position="sticky">
      <Toolbar>
        <Typography 
          variant="h6" 
          component={Link} 
          to="/" 
          sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}
        >
          ShopFront
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Button 
            color="inherit" 
            component={Link} 
            to="/products"
            sx={{ mr: 1 }}
          >
            Products
          </Button>
          
          <Button 
            color="inherit" 
            component={Link} 
            to="/orders"
            sx={{ mr: 1 }}
          >
            My Orders
          </Button>
          
          <IconButton 
            color="inherit" 
            component={Link} 
            to="/cart"
            sx={{ mr: 1 }}
          >
            <Badge badgeContent={cartCount} color="secondary">
              <ShoppingCart />
            </Badge>
          </IconButton>
          
          <IconButton color="inherit">
            <AccountCircle />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;