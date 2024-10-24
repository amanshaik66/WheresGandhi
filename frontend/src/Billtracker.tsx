// /frontend/src/BillTracker.tsx

import React, { useState, useEffect, FC, ChangeEvent, FormEvent } from 'react';
import { Container, Paper, TextField, Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress, Alert, Grid } from '@mui/material';
import { collection, addDoc, getDocs, query, where, DocumentData } from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';
import { useAuthContext } from './hooks/useAuth';
import './assets/styles.css';

interface Bill {
  id?: string;
  description: string;
  amount: number;
  dueDate: string;
  status: 'paid' | 'pending';
}

const firestore = getFirestore();

const BillTracker: FC = () => {
  const { user } = useAuthContext();
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newBill, setNewBill] = useState<Bill>({
    description: '',
    amount: 0,
    dueDate: '',
    status: 'pending',
  });

  useEffect(() => {
    if (user) {
      fetchBills(user.uid)
        .then((fetchedBills) => setBills(fetchedBills))
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    }
  }, [user]);

  const fetchBills = async (uid: string): Promise<Bill[]> => {
    const q = query(collection(firestore, 'bills'), where('uid', '==', uid));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Bill));
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewBill((prev) => ({ ...prev, [name]: name === 'amount' ? Number(value) : value }));
  };

  const handleAddBill = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setLoading(true);
      await addDoc(collection(firestore, 'bills'), { ...newBill, uid: user.uid });
      setBills((prev) => [...prev, newBill]);
      setNewBill({ description: '', amount: 0, dueDate: '', status: 'pending' });
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" className="bill-tracker-container">
      <Paper elevation={3} className="bill-tracker-paper">
        <Typography variant="h4" align="center" gutterBottom>
          Bill Tracker
        </Typography>

        {error && (
          <Alert severity="error" className="alert">
            {error}
          </Alert>
        )}

        <form onSubmit={handleAddBill} className="bill-form">
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={newBill.description}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Amount"
                name="amount"
                type="number"
                value={newBill.amount}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Due Date"
                name="dueDate"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={newBill.dueDate}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Status"
                name="status"
                select
                SelectProps={{ native: true }}
                value={newBill.status}
                onChange={handleInputChange}
              >
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" color="primary" type="submit" disabled={loading} fullWidth>
                {loading ? <CircularProgress size={24} /> : 'Add Bill'}
              </Button>
            </Grid>
          </Grid>
        </form>

        <TableContainer component={Paper} className="table-container">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Description</TableCell>
                <TableCell align="right">Amount</TableCell>
                <TableCell align="right">Due Date</TableCell>
                <TableCell align="right">Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bills.map((bill) => (
                <TableRow key={bill.id}>
                  <TableCell>{bill.description}</TableCell>
                  <TableCell align="right">${bill.amount}</TableCell>
                  <TableCell align="right">{bill.dueDate}</TableCell>
                  <TableCell align="right">{bill.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
};

export default BillTracker;
