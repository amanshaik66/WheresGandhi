// /frontend/src/BillTracker.tsx

import React, { useState, useEffect, FC } from 'react';
import {
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  CircularProgress,
  Alert,
} from '@mui/material';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';
import { useAuthContext } from './hooks/useAuth';
import './assets/styles.css';

const firestore = getFirestore();

interface Bill {
  id: string;
  description: string;
  amount: number;
  status: 'paid' | 'pending';
}

const BillTracker: FC = () => {
  const { user } = useAuthContext();
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [newBill, setNewBill] = useState({ description: '', amount: 0 });

  useEffect(() => {
    if (user) {
      fetchBills(user.uid)
        .then((bills) => setBills(bills))
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    }
  }, [user]);

  const fetchBills = async (uid: string): Promise<Bill[]> => {
    const q = query(collection(firestore, 'bills'), where('uid', '==', uid));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Bill));
  };

  const handleAddBill = async () => {
    try {
      await addDoc(collection(firestore, 'bills'), {
        ...newBill,
        uid: user?.uid,
        status: 'pending',
      });
      setOpen(false);
      setNewBill({ description: '', amount: 0 });
      alert('Bill added successfully!');
    } catch (err: any) {
      console.error('Failed to add bill:', err);
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <CircularProgress size={50} />
        <Typography variant="h6">Loading your bills...</Typography>
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
    <Container maxWidth="md" className="bill-tracker-container">
      <Paper elevation={3} className="bill-tracker-paper">
        <Typography variant="h4" align="center" gutterBottom>
          Bill Tracker
        </Typography>

        <Button variant="contained" color="primary" onClick={() => setOpen(true)} className="add-bill-button">
          Add New Bill
        </Button>

        <TableContainer component={Paper} className="table-container">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Description</TableCell>
                <TableCell align="right">Amount</TableCell>
                <TableCell align="center">Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bills.map((bill) => (
                <TableRow key={bill.id}>
                  <TableCell>{bill.description}</TableCell>
                  <TableCell align="right">${bill.amount.toFixed(2)}</TableCell>
                  <TableCell align="center">{bill.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add New Bill</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Description"
            fullWidth
            value={newBill.description}
            onChange={(e) => setNewBill((prev) => ({ ...prev, description: e.target.value }))}
          />
          <TextField
            margin="dense"
            label="Amount"
            type="number"
            fullWidth
            value={newBill.amount}
            onChange={(e) => setNewBill((prev) => ({ ...prev, amount: parseFloat(e.target.value) }))}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleAddBill} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default BillTracker;
