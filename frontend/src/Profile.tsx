// /frontend/src/Profile.tsx

import React, { useState, useEffect, FC, ChangeEvent } from 'react';
import { Container, Paper, TextField, Button, Typography, Avatar, Grid, CircularProgress, Alert } from '@mui/material';
import { getAuth, updateProfile, User } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useAuthContext } from './hooks/useAuth';
import './assets/styles.css';

const storage = getStorage();

const Profile: FC = () => {
  const { user } = useAuthContext();
  const [displayName, setDisplayName] = useState<string>(user?.displayName || '');
  const [photoURL, setPhotoURL] = useState<string>(user?.photoURL || '');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || '');
      setPhotoURL(user.photoURL || '');
    }
  }, [user]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleProfileUpdate = async () => {
    if (!user) return;
    setLoading(true);

    try {
      let photoURLToUpdate = photoURL;

      // Upload photo to Firebase Storage if a new file is selected
      if (selectedFile) {
        const storageRef = ref(storage, `profilePictures/${user.uid}`);
        await uploadBytes(storageRef, selectedFile);
        photoURLToUpdate = await getDownloadURL(storageRef);
      }

      // Update user profile in Firebase Auth
      await updateProfile(user, { displayName, photoURL: photoURLToUpdate });

      setPhotoURL(photoURLToUpdate);
      setError(null);
      alert('Profile updated successfully!');
    } catch (err: any) {
      console.error('Profile update failed:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <Alert severity="error">
        <Typography variant="h6">You need to be logged in to view this page.</Typography>
      </Alert>
    );
  }

  return (
    <Container maxWidth="sm" className="profile-container">
      <Paper elevation={3} className="profile-paper">
        <Typography variant="h4" align="center" gutterBottom>
          Edit Profile
        </Typography>

        <Grid container spacing={3} alignItems="center" justifyContent="center">
          <Grid item>
            <Avatar src={photoURL} className="profile-avatar" />
          </Grid>
          <Grid item>
            <input type="file" accept="image/*" onChange={handleFileChange} />
          </Grid>
        </Grid>

        <TextField
          fullWidth
          label="Display Name"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          margin="normal"
        />

        {error && (
          <Alert severity="error" className="alert">
            {error}
          </Alert>
        )}

        <Button
          variant="contained"
          color="primary"
          onClick={handleProfileUpdate}
          disabled={loading}
          className="profile-button"
        >
          {loading ? <CircularProgress size={24} /> : 'Update Profile'}
        </Button>
      </Paper>
    </Container>
  );
};

export default Profile;
