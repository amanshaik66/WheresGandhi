// /frontend/src/Authentication.tsx

import React, { useState, FC } from 'react';
import { Button, TextField, Typography, Container, Grid, Paper, Divider } from '@mui/material';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './assets/styles.css'; // Central styling

const auth = getAuth();
const googleProvider = new GoogleAuthProvider();

interface AuthFormState {
  email: string;
  password: string;
  confirmPassword?: string;
}

const Authentication: FC = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState<AuthFormState>({ email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const switchMode = () => setIsSignup((prev) => !prev);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      toast.success('Signed in with Google!');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(`Google Sign-In Failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { email, password, confirmPassword } = formData;

    try {
      if (isSignup) {
        if (password !== confirmPassword) {
          throw new Error('Passwords do not match!');
        }
        await createUserWithEmailAndPassword(auth, email, password);
        toast.success('Account created successfully!');
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        toast.success('Signed in successfully!');
      }
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(`Authentication Failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xs">
      <Paper elevation={6} className="auth-container">
        <Typography variant="h5" align="center">
          {isSignup ? 'Sign Up' : 'Login'}
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Email"
                name="email"
                type="email"
                fullWidth
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Password"
                name="password"
                type="password"
                fullWidth
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </Grid>
            {isSignup && (
              <Grid item xs={12}>
                <TextField
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                  fullWidth
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
            )}
            <Grid item xs={12}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                disabled={loading}
              >
                {loading ? 'Processing...' : isSignup ? 'Sign Up' : 'Login'}
              </Button>
            </Grid>
          </Grid>
        </form>
        <Divider sx={{ margin: '20px 0' }}>OR</Divider>
        <Button
          fullWidth
          variant="outlined"
          onClick={handleGoogleSignIn}
          disabled={loading}
        >
          Sign in with Google
        </Button>
        <Grid container justifyContent="center" sx={{ marginTop: '10px' }}>
          <Grid item>
            <Button onClick={switchMode} disabled={loading}>
              {isSignup ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Authentication;
