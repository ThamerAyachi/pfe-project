/* eslint-disable */
import React, { useState } from 'react';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';

import { ImageButton } from '../profile-image-button';
import { ImageSrc } from '../profile-image-src';
import { VisuallyHiddenInput } from '../profile-visually-hidden-input';

import { AuthService } from 'src/services/authentication-service';
import { ProfileService } from 'src/services/profile-service';

export default function ProfileView() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [open, setOpen] = useState(false);
  const [massageNot, setMessage] = useState('');
  const [passwords, setPasswords] = useState({ oldPassword: '', newPassword: '' });

  const profileService = new ProfileService();
  const [user, setUser] = useState(AuthService.userValue());

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    setSelectedImage(file);
    const formData = new FormData();
    if (!file) return;
    formData.append('photo', file);

    try {
      const response = await profileService.updateProfilePhoto(formData);
      setUser({ ...user, photoURL: profileService.getProfile().photoURL });
      await AuthService.reloadData();
      handleClick('Profile picture updated');
    } catch (error) {
      console.error(error);
      handleClick(error.toString());
    }
  };

  const handleUpdateProfile = async (event) => {
    event.preventDefault();
    try {
      const response = await profileService.updateProfile(user);
      await AuthService.reloadData();
      handleClick('Profile updated');
    } catch (error) {
      console.error(error);
      handleClick(error.toString());
    }
  };

  const handleUpdatePasswords = async (event) => {
    event.preventDefault();
    try {
      const response = await profileService.updatePassword(passwords);
      await AuthService.reloadData();
      handleClick('Password updated');
    } catch (error) {
      console.error(error);
      handleClick(error.toString());
    }
  };

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

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Profile</Typography>
      </Stack>

      <Card px={4}>
        <CardContent>
          <ImageButton
            focusRipple
            key="123"
            style={{
              width: 200,
              margin: '20px 0 0 0',
            }}
          >
            <VisuallyHiddenInput type="file" accept="image/*" onChange={handleFileChange} />
            {selectedImage && (
              <ImageSrc style={{ backgroundImage: `url(${URL.createObjectURL(selectedImage)})` }} />
            )}
            {!selectedImage && user.photoURL && (
              <ImageSrc style={{ backgroundImage: `url(${user.photoURL})` }} />
            )}
          </ImageButton>

          <Typography variant="h4" my={3}>
            General
          </Typography>
          <form onSubmit={handleUpdateProfile}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  id="name"
                  label="Entreprise Name"
                  variant="outlined"
                  style={{ width: '100%' }}
                  value={user.name ?? ''}
                  onChange={(e) => setUser({ ...user, name: e.target.value })}
                  required
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  id="email"
                  label="Email"
                  variant="outlined"
                  style={{ width: '100%' }}
                  value={user.email ?? ''}
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                  inputProps={{ type: 'email' }}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  id="adresse"
                  label="Adresse"
                  variant="outlined"
                  style={{ width: '100%' }}
                  value={user.adresse ?? ''}
                  onChange={(e) => setUser({ ...user, adresse: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  id="phone"
                  label="Phone"
                  variant="outlined"
                  style={{ width: '100%' }}
                  value={user.phone ?? ''}
                  onChange={(e) => setUser({ ...user, phone: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <Button type="submit" variant="contained" color="primary" style={{ width: '100%' }}>
                  Update Profile
                </Button>
              </Grid>
            </Grid>
          </form>

          <div style={{ margin: '50px 0 20px 0' }}>
            <Typography variant="h4" my={3}>
              Update Password
            </Typography>
            <form onSubmit={handleUpdatePasswords}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    id="password"
                    label="Old Password"
                    variant="outlined"
                    type="password"
                    style={{ width: '100%' }}
                    value={passwords.oldPassword ?? ''}
                    onChange={(e) => setPasswords({ ...passwords, oldPassword: e.target.value })}
                    inputProps={{ minLength: 8 }}
                    required
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    id="newPassword"
                    label="New Password"
                    variant="outlined"
                    type="password"
                    style={{ width: '100%' }}
                    value={passwords.newPassword ?? ''}
                    onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                    inputProps={{ minLength: 8 }}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    style={{ width: '100%' }}
                  >
                    Update Password
                  </Button>
                </Grid>
              </Grid>
            </form>
          </div>
        </CardContent>
      </Card>

      <Snackbar open={open} autoHideDuration={2000} onClose={handleClose} message={massageNot} />
    </Container>
  );
}
