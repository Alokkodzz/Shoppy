import React, { useState } from 'react';
import {
  Container,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Box,
  Button,
  Grid,
  Paper,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useCart } from '../context/CartContext';
import { createOrder } from '../api/orderService';
import { useNavigate } from 'react-router-dom';

const steps = ['Shipping', 'Payment', 'Review'];

const CheckoutPage = () => {
  const [activeStep, setActiveStep] = useState(0);
  const { cartItems, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const validationSchema = yup.object({
    firstName: yup.string().required('First name is required'),
    lastName: yup.string().required('Last name is required'),
    address: yup.string().required('Address is required'),
    city: yup.string().required('City is required'),
    state: yup.string().required('State is required'),
    zipCode: yup.string().required('Zip code is required'),
    country: yup.string().required('Country is required'),
    cardNumber: yup.string().when('activeStep', {
      is: 1,
      then: yup.string().required('Card number is required').matches(/^\d{16}$/, 'Must be 16 digits')
    }),
    cardName: yup.string().when('activeStep', {
      is: 1,
      then: yup.string().required('Name on card is required')
    }),
    expDate: yup.string().when('activeStep', {
      is: 1,
      then: yup.string().required('Expiration date is required').matches(/^(0[1-9]|1[0-2])\/\d{2}$/, 'MM/YY format')
    }),
    cvv: yup.string().when('activeStep', {
      is: 1,
      then: yup.string().required('CVV is required').matches(/^\d{3,4}$/, '3 or 4 digits')
    })
  });

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
      cardNumber: '',
      cardName: '',
      expDate: '',
      cvv: '',
      paymentMethod: 'credit'
    },
    validationSchema,
    onSubmit: async (values) => {
      if (activeStep === steps.length - 1) {
        try {
          const orderItems = cartItems.map(item => ({
            productId: item.id,
            quantity: item.quantity,
            unitPrice: item.price
          }));
          
          const orderData = {
            userId: 'current-user-id', // Replace with actual user ID
            items: orderItems,
            shippingAddress: {
              firstName: values.firstName,
              lastName: values.lastName,
              address: values.address,
              city: values.city,
              state: values.state,
              zipCode: values.zipCode,
              country: values.country
            },
            paymentMethod: values.paymentMethod
          };

          await createOrder(orderData);
          clearCart();
          navigate('/order-success');
        } catch (error) {
          console.error('Error creating order:', error);
        }
      } else {
        setActiveStep(activeStep + 1);
      }
    }
  });

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3 }}>
              {activeStep === 0 && (
                <>
                  <Typography variant="h6" gutterBottom>
                    Shipping Address
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        id="firstName"
                        name="firstName"
                        label="First name"
                        value={formik.values.firstName}
                        onChange={formik.handleChange}
                        error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                        helperText={formik.touched.firstName && formik.errors.firstName}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        id="lastName"
                        name="lastName"
                        label="Last name"
                        value={formik.values.lastName}
                        onChange={formik.handleChange}
                        error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                        helperText={formik.touched.lastName && formik.errors.lastName}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        id="address"
                        name="address"
                        label="Address"
                        value={formik.values.address}
                        onChange={formik.handleChange}
                        error={formik.touched.address && Boolean(formik.errors.address)}
                        helperText={formik.touched.address && formik.errors.address}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        id="city"
                        name="city"
                        label="City"
                        value={formik.values.city}
                        onChange={formik.handleChange}
                        error={formik.touched.city && Boolean(formik.errors.city)}
                        helperText={formik.touched.city && formik.errors.city}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        id="state"
                        name="state"
                        label="State/Province/Region"
                        value={formik.values.state}
                        onChange={formik.handleChange}
                        error={formik.touched.state && Boolean(formik.errors.state)}
                        helperText={formik.touched.state && formik.errors.state}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        id="zipCode"
                        name="zipCode"
                        label="Zip / Postal code"
                        value={formik.values.zipCode}
                        onChange={formik.handleChange}
                        error={formik.touched.zipCode && Boolean(formik.errors.zipCode)}
                        helperText={formik.touched.zipCode && formik.errors.zipCode}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        id="country"
                        name="country"
                        label="Country"
                        value={formik.values.country}
                        onChange={formik.handleChange}
                        error={formik.touched.country && Boolean(formik.errors.country)}
                        helperText={formik.touched.country && formik.errors.country}
                      />
                    </Grid>
                  </Grid>
                </>
              )}

              {activeStep === 1 && (
                <>
                  <Typography variant="h6" gutterBottom>
                    Payment Method
                  </Typography>
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel id="payment-method-label">Payment Method</InputLabel>
                    <Select
                      labelId="payment-method-label"
                      id="paymentMethod"
                      name="paymentMethod"
                      value={formik.values.paymentMethod}
                      onChange={formik.handleChange}
                      label="Payment Method"
                    >
                      <MenuItem value="credit">Credit Card</MenuItem>
                      <MenuItem value="debit">Debit Card</MenuItem>
                      <MenuItem value="paypal">PayPal</MenuItem>
                    </Select>
                  </FormControl>
                  
                  {formik.values.paymentMethod !== 'paypal' && (
                    <>
                      <TextField
                        fullWidth
                        id="cardNumber"
                        name="cardNumber"
                        label="Card number"
                        value={formik.values.cardNumber}
                        onChange={formik.handleChange}
                        error={formik.touched.cardNumber && Boolean(formik.errors.cardNumber)}
                        helperText={formik.touched.cardNumber && formik.errors.cardNumber}
                        sx={{ mb: 2 }}
                      />
                      <TextField
                        fullWidth
                        id="cardName"
                        name="cardName"
                        label="Name on card"
                        value={formik.values.cardName}
                        onChange={formik.handleChange}
                        error={formik.touched.cardName && Boolean(formik.errors.cardName)}
                        helperText={formik.touched.cardName && formik.errors.cardName}
                        sx={{ mb: 2 }}
                      />
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <TextField
                            fullWidth
                            id="expDate"
                            name="expDate"
                            label="Expiry date (MM/YY)"
                            value={formik.values.expDate}
                            onChange={formik.handleChange}
                            error={formik.touched.expDate && Boolean(formik.errors.expDate)}
                            helperText={formik.touched.expDate && formik.errors.expDate}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <TextField
                            fullWidth
                            id="cvv"
                            name="cvv"
                            label="CVV"
                            value={formik.values.cvv}
                            onChange={formik.handleChange}
                            error={formik.touched.cvv && Boolean(formik.errors.cvv)}
                            helperText={formik.touched.cvv && formik.errors.cvv}
                          />
                        </Grid>
                      </Grid>
                    </>
                  )}
                </>
              )}

              {activeStep === 2 && (
                <>
                  <Typography variant="h6" gutterBottom>
                    Review your order
                  </Typography>
                  <Typography variant="subtitle1" gutterBottom>
                    Shipping Address
                  </Typography>
                  <Typography paragraph>
                    {formik.values.firstName} {formik.values.lastName}<br />
                    {formik.values.address}<br />
                    {formik.values.city}, {formik.values.state} {formik.values.zipCode}<br />
                    {formik.values.country}
                  </Typography>
                  <Typography variant="subtitle1" gutterBottom>
                    Payment Method
                  </Typography>
                  <Typography paragraph>
                    {formik.values.paymentMethod === 'credit' && 'Credit Card'}
                    {formik.values.paymentMethod === 'debit' && 'Debit Card'}
                    {formik.values.paymentMethod === 'paypal' && 'PayPal'}
                    {formik.values.paymentMethod !== 'paypal' && (
                      <>
                        <br />**** **** **** {formik.values.cardNumber?.slice(-4)}
                        <br />Expires {formik.values.expDate}
                      </>
                    )}
                  </Typography>
                </>
              )}
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Order Summary
              </Typography>
              {cartItems.map((item) => (
                <Box key={item.id} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>
                    {item.name} × {item.quantity}
                  </Typography>
                  <Typography>${(item.price * item.quantity).toFixed(2)}</Typography>
                </Box>
              ))}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, pt: 2, borderTop: '1px solid #eee' }}>
                <Typography variant="h6">Total</Typography>
                <Typography variant="h6">${cartTotal.toFixed(2)}</Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            sx={{ mr: 1 }}
          >
            Back
          </Button>
          <Button
            variant="contained"
            color="primary"
            type="submit"
          >
            {activeStep === steps.length - 1 ? 'Place Order' : 'Next'}
          </Button>
        </Box>
      </form>
    </Container>
  );
};

export default CheckoutPage;