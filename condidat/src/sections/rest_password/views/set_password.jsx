/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { AuthService } from 'src/services/authentication-service';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

import { bgGradient } from 'src/theme/css';

import Logo from 'src/components/logo';
import { Snackbar, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';

export default function SetPasswordView() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [token, setToken] = useState('');
  const [tokenValidity, setTokenValidity] = useState(true);
  const [massageNot, setMessage] = useState('');
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const authService = new AuthService();

  const handleClick = (message = 'Notification') => {
    setMessage(message);
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const handelSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      const response = await authService.resetPassword(token, password);
      handleClick('Password reset succuss');
      setTimeout(() => {
        return navigate('/login');
      }, 1000);
    } catch (error) {
      console.log(error);
      handleClick(error.toString());
    }
    setIsLoading(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      const params = new URLSearchParams(window.location.search);
      const _token = params.get('token');
      setToken(_token);
      try {
        const response = await authService.validateTokenRestPassword(_token);
      } catch (err) {
        console.log(err);
        setTokenValidity(false);
        handleClick(err.toString());
      }
    };

    fetchData();
  }, []);

  const invalidToken = (
    <>
      <Card
        sx={{
          p: 5,
          width: 1,
          maxWidth: 420,
        }}
        style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column' }}
      >
        <Typography variant="h4" style={{ width: '100%' }}>
          Token invalid
        </Typography>
        <div style={{ marginTop: '15px' }}></div>
        <LoadingButton
          onClick={() => navigate('/login')}
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          color="inherit"
        >
          Go Home
        </LoadingButton>
      </Card>
    </>
  );
  const validToken = (
    <>
      <Card
        sx={{
          p: 5,
          width: 1,
          maxWidth: 420,
        }}
      >
        <Typography variant="h4">Set You new Password</Typography>
        <form onSubmit={handelSubmit}>
          <Stack sx={{ my: 3 }}>
            <TextField
              id="outlined-basic"
              label="Password"
              variant="outlined"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              inputProps={{ minLength: 8 }}
              required
            />
            <div style={{ marginTop: '15px' }}></div>
            <LoadingButton
              disabled={isLoading}
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              color="inherit"
            >
              {isLoading ? 'Loading...' : 'Reset Password'}
            </LoadingButton>
          </Stack>
        </form>
      </Card>
    </>
  );

  return (
    <Box
      sx={{
        ...bgGradient({
          color: alpha(theme.palette.background.default, 0.9),
          imgUrl: '/assets/background/overlay_4.jpg',
        }),
        height: 1,
      }}
    >
      <Logo
        sx={{
          position: 'fixed',
          top: { xs: 16, md: 24 },
          left: { xs: 16, md: 24 },
        }}
      />

      <Stack alignItems="center" justifyContent="center" sx={{ height: 1 }}>
        {tokenValidity ? validToken : invalidToken}
      </Stack>
      <Snackbar open={open} autoHideDuration={2000} onClose={handleClose} message={massageNot} />
    </Box>
  );
}
