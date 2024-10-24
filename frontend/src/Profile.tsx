// /frontend/src/Profile.tsx

import React, { useState, useEffect, FC } from 'react';
import { 
  Container, Paper, Typography, TextField, Button, Avatar, CircularProgress, Alert 
} from '@mui/material';
import { getAuth, updateProfile, updatePassword, User } from 'firebase/auth';
import { useAuthContext } from './hooks/useAuth';
import './assets/styles.css';

const auth = getAuth();

const Profile: FC = () => {
  const { user } = useAuthContext();
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || '');
      setEmail(user.email || '');
    }
  }, [user]);

  const handleUpdateProfile = async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      await updateProfile(user, { displayName });
      setSuccessMessage('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (!user) return;
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      await updatePassword(user, password);
      setSuccessMessage('Password updated successfully!');
      setPassword('');
    } catch (error) {
      console.error('Error updating password:', error);
      setError('Failed to update password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <Alert severity="error" className="alert">
        <Typography variant="body1">No user logged in. Please log in to access your profile.</Typography>
      </Alert>
    );
  }

  return (
    <Container maxWidth="sm" className="profile-container">
      <Paper elevation={3} className="profile-paper">
        <Avatar 
          alt={displayName} 
          src={user.photoURL || ''} 
          sx={{ width: 100, height: 100, marginBottom: 2 }} 
        />
        <Typography variant="h4" gutterBottom>
          {displayName || 'Your Profile'}
        </Typography>

        {loading && (
          <CircularProgress size={30} sx={{ marginBottom: 2 }} />
        )}

        {error && (
          <Alert severity="error" className="alert">
            {error}
          </Alert>
        )}

        {successMessage && (
          <Alert severity="success" className="alert">
            {successMessage}
          </Alert>
        )}

        <TextField
          fullWidth
          label="Display Name"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          margin="normal"
        />

        <TextField
          fullWidth
          label="Email"
          value={email}
          margin="normal"
          disabled
        />

        <TextField
          fullWidth
          type="password"
          label="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          margin="normal"
        />

        <Button 
          variant="contained" 
          color="primary" 
          fullWidth 
          onClick={handleUpdateProfile} 
          sx={{ marginTop: 2 }}
        >
          Update Profile
        </Button>

        <Button 
          variant="outlined" 
          color="secondary" 
          fullWidth 
          onClick={handleUpdatePassword} 
          sx={{ marginTop: 2 }}
        >
          Change Password
        </Button>
      </Paper>
    </Container>
  );
};

export default Profile;
