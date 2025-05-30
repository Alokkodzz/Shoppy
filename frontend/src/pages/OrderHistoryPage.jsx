import React, { useState, useEffect } from 'react';
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
  CircularProgress
} from '@mui/material';
import { Link } from 'react-router-dom';
import { getOrders } from '../api/orderService';

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getOrders('current-user-id'); // Replace with actual user ID
        setOrders(data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (orders.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>
          You haven't placed any orders yet
        </Typography>
        <Button 
          component={Link} 
          to="/products" 
          variant="contained" 
          color="primary"
        >
          Start Shopping
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Your Orders
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order #</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Items</TableCell>
              <TableCell align="right">Total</TableCell>
              <TableCell align="right">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.id.substring(0, 8)}</TableCell>
                <TableCell>
                  {new Date(order.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Box 
                    component="span" 
                    sx={{
                      p: 1,
                      borderRadius: 1,
                      backgroundColor: 
                        order.status === 'Delivered' ? '#4caf50' :
                        order.status === 'Cancelled' ? '#f44336' :
                        '#2196f3',
                      color: 'white'
                    }}
                  >
                    {order.status}
                  </Box>
                </TableCell>
                <TableCell>{order.items.length}</TableCell>
                <TableCell align="right">
                  ${order.totalAmount.toFixed(2)}
                </TableCell>
                <TableCell align="right">
                  <Button 
                    component={Link} 
                    to={`/orders/${order.id}`}
                    variant="outlined"
                    size="small"
                  >
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default OrderHistoryPage;