/* eslint-disable */
import React, { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

import { bgGradient } from 'src/theme/css';

import Logo from 'src/components/logo';
import { Snackbar, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { AuthService } from 'src/services/authentication-service';

export default function EmailRestPasswordView() {
  const authService = new AuthService();

  const theme = useTheme();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [massageNot, setMessage] = useState('');
  const [open, setOpen] = useState(false);
  const [sended, setSended] = useState(false);

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
      const response = await authService.sendMailRestPassword(email);
      handleClick('Email Sended succuss');
      setSended(true);
    } catch (error) {
      console.error(error);
      handleClick(error.toString());
    }
    setIsLoading(false);
  };

  const form = (
    <>
      <Card
        sx={{
          p: 5,
          width: 1,
          maxWidth: 420,
        }}
      >
        <Typography variant="h4">Find your account</Typography>

        <Typography variant="body2" sx={{ mt: 2, mb: 1 }}>
          Please enter your email to search for your account.
        </Typography>

        <form onSubmit={handelSubmit}>
          <Stack sx={{ my: 3 }}>
            <TextField
              name="email"
              label="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              inputProps={{ type: 'email' }}
              required
            />

            <div style={{ marginTop: '15px' }}></div>

            <LoadingButton fullWidth size="large" type="submit" variant="contained" color="inherit">
              {isLoading ? 'Email Sending...' : 'Send E-mail'}
            </LoadingButton>
          </Stack>
        </form>
      </Card>
    </>
  );
  const sendedSuccuss = (
    <>
      <Card
        sx={{
          p: 5,
          width: 1,
          maxWidth: 420,
        }}
      >
        <Typography variant="h4">Email Sended Succuss</Typography>

        <Typography variant="body2" sx={{ mt: 2, mb: 1 }}>
          Check your e-mail to reset your password account.
        </Typography>
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
        {sended ? sendedSuccuss : form}
      </Stack>
      <Snackbar open={open} autoHideDuration={2000} onClose={handleClose} message={massageNot} />
    </Box>
  );
}
