// /frontend/src/Dashboard.tsx

import React, { useEffect, useState, FC } from 'react';
import { Container, Typography, Grid, Paper, CircularProgress, Alert, Button } from '@mui/material';
import { useAuthContext } from './hooks/useAuth';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';
import './assets/styles.css';

const firestore = getFirestore();

interface UserStats {
  billsPaid: number;
  pendingBills: number;
  referrals: number;
}

const Dashboard: FC = () => {
  const { user } = useAuthContext();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);

  useEffect(() => {
    if (user) {
      fetchUserStats(user.uid)
        .then((stats) => setUserStats(stats))
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    }
  }, [user]);

  const fetchUserStats = async (uid: string): Promise<UserStats> => {
    const q = query(collection(firestore, 'userStats'), where('uid', '==', uid));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      throw new Error('No user stats found');
    }

    const data = querySnapshot.docs[0].data();
    return {
      billsPaid: data.billsPaid || 0,
      pendingBills: data.pendingBills || 0,
      referrals: data.referrals || 0,
    };
  };

  if (loading) {
    return (
      <div className="loading-container">
        <CircularProgress size={50} />
        <Typography variant="h6">Loading your dashboard...</Typography>
      </div>
    );
  }

  if (error) {
    return (
      <Alert severity="error" className="alert">
        <Typography variant="body1">{error}</Typography>
      </Alert>
    );
  }

  return (
    <Container maxWidth="md" className="dashboard-container">
      <Paper elevation={3} className="dashboard-paper">
        <Typography variant="h4" align="center" gutterBottom>
          Welcome, {user?.displayName || 'User'}!
        </Typography>

        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} sm={6}>
            <Paper elevation={2} className="stat-card">
              <Typography variant="h5" align="center">
                Bills Paid
              </Typography>
              <Typography variant="h6" align="center">
                {userStats?.billsPaid ?? 0}
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Paper elevation={2} className="stat-card">
              <Typography variant="h5" align="center">
                Pending Bills
              </Typography>
              <Typography variant="h6" align="center">
                {userStats?.pendingBills ?? 0}
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Paper elevation={2} className="stat-card">
              <Typography variant="h5" align="center">
                Referrals
              </Typography>
              <Typography variant="h6" align="center">
                {userStats?.referrals ?? 0}
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        <Button variant="contained" color="primary" className="refresh-button" onClick={() => window.location.reload()}>
          Refresh
        </Button>
      </Paper>
    </Container>
  );
};

export default Dashboard;
