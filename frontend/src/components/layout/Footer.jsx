import React from 'react';
import { Box, Typography, Container } from '@mui/material';

const Footer = () => {
  return (
    <Box 
      component="footer" 
      sx={{ 
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) => 
          theme.palette.mode === 'light'
            ? theme.palette.grey[200]
            : theme.palette.grey[800],
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="body1" align="center">
          © {new Date().getFullYear()} Shoppy - All rights reserved
        </Typography>
        <Typography variant="body2" align="center" color="text.secondary">
          An e-commerce platform build by Alok
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;