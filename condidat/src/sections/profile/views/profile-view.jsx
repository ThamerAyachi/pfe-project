/* eslint-disable */
import React, { useState } from 'react';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

import { ImageButton } from '../profile-image-button';
import { ImageSrc } from '../profile-image-src';
import { VisuallyHiddenInput } from '../profile-visually-hidden-input';

import { AuthService } from 'src/services/authentication-service';
import { ProfileService } from 'src/services/profile-service';

export default function ProfileView() {
  const [selectedImage, setSelectedImage] = useState(null);

  const profileService = new ProfileService();
  const [user, setUser] = useState(AuthService.userValue());

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    setSelectedImage(file);
    const formData = new FormData();
    formData.append('photo', file);

    try {
      const response = await profileService.updateProfilePhoto(formData);
      setUser(profileService.getProfile());
      await AuthService.reloadData();
    } catch (error) {
      console.error('Error:', error);
    }
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
        </CardContent>
      </Card>
    </Container>
  );
}
