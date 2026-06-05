// src/pages/Payments.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      // Mock data - replace with your API
      const mockData = [
        { id: 'PAY001', user: 'Rajesh Kumar', amount: 1500, type: 'Razorpay', status: 'Success', date: '2024-01-15' },
        { id: 'PAY002', user: 'Priya Sharma', amount: 2500, type: 'Wallet', status: 'Success', date: '2024-01-14' },
        { id: 'PAY003', user: 'Amit Patel', amount: 500, type: 'COD', status: 'Pending', date: '2024-01-14' },
        { id: 'PAY004', user: 'Neha Gupta', amount: 3000, type: 'Razorpay', status: 'Success', date: '2024-01-13' },
        { id: 'PAY005', user: 'Vikram Singh', amount: 1200, type: 'Wallet', status: 'Failed', date: '2024-01-13' },
        { id: 'PAY006', user: 'Anita Desai', amount: 800, type: 'COD', status: 'Success', date: '2024-01-12' },
        { id: 'PAY007', user: 'Suresh Kumar', amount: 2000, type: 'Razorpay', status: 'Success', date: '2024-01-12' },
        { id: 'PAY008', user: 'Deepa Mehta', amount: 950, type: 'Wallet', status: 'Pending', date: '2024-01-11' },
      ];
      setPayments(mockData);
    } catch (error) {
      toast.error('Failed to fetch payments');
    } finally {
      setLoading(false);
    }
  };

  const filteredPayments = payments.filter(p => {
    const matchSearch = p.user.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'ALL' || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalAmount = filteredPayments.reduce((sum, p) => sum + p.amount, 0);
  const successCount = filteredPayments.filter(p => p.status === 'Success').length;
  const pendingCount = filteredPayments.filter(p => p.status === 'Pending').length;
  const failedCount = filteredPayments.filter(p => p.status === 'Failed').length;

  const getStatusColor = (status) => {
    if (status === 'Success') return '#10b981';
    if (status === 'Pending') return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Payments</h1>
          <p style={styles.subtitle}>Manage all payment transactions</p>
        </div>
        <button onClick={fetchPayments} style={styles.refreshBtn}>Refresh</button>
      </div>

      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statValue}>₹{totalAmount.toLocaleString()}</div>
          <div style={styles.statLabel}>Total Amount</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statValue}>{successCount}</div>
          <div style={styles.statLabel}>Successful</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statValue}>{pendingCount}</div>
          <div style={styles.statLabel}>Pending</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statValue}>{failedCount}</div>
          <div style={styles.statLabel}>Failed</div>
        </div>
      </div>

      <div style={styles.filterBar}>
        <input
          type="text"
          placeholder="Search by user or payment ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.searchInput}
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={styles.filterSelect}
        >
          <option value="ALL">All Status</option>
          <option value="Success">Success</option>
          <option value="Pending">Pending</option>
          <option value="Failed">Failed</option>
        </select>
      </div>

      {loading ? (
        <div style={styles.loading}>Loading...</div>
      ) : (
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Payment ID</th>
                <th style={styles.th}>User</th>
                <th style={styles.th}>Amount</th>
                <th style={styles.th}>Type</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map(payment => (
                <tr key={payment.id} style={styles.tr}>
                  <td style={styles.td}>{payment.id}</td>
                  <td style={styles.td}>{payment.user}</td>
                  <td style={styles.td}>₹{payment.amount}</td>
                  <td style={styles.td}>{payment.type}</td>
                  <td style={styles.td}>
                    <span style={{ ...styles.statusBadge, background: getStatusColor(payment.status) }}>
                      {payment.status}
                    </span>
                  </td>
                  <td style={styles.td}>{payment.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredPayments.length === 0 && (
            <div style={styles.noData}>No payments found</div>
          )}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '24px',
    background: '#f5f5f5',
    minHeight: '100vh',
    fontFamily: 'Arial, sans-serif'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
    flexWrap: 'wrap',
    gap: '16px'
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#333',
    margin: 0
  },
  subtitle: {
    fontSize: '14px',
    color: '#666',
    marginTop: '4px'
  },
  refreshBtn: {
    padding: '10px 20px',
    background: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
    marginBottom: '24px'
  },
  statCard: {
    background: 'white',
    padding: '20px',
    borderRadius: '12px',
    textAlign: 'center',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  },
  statValue: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#333'
  },
  statLabel: {
    fontSize: '13px',
    color: '#666',
    marginTop: '8px'
  },
  filterBar: {
    display: 'flex',
    gap: '12px',
    marginBottom: '20px',
    flexWrap: 'wrap'
  },
  searchInput: {
    flex: 1,
    padding: '10px 14px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '14px'
  },
  filterSelect: {
    padding: '10px 14px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '14px',
    background: 'white'
  },
  tableWrapper: {
    background: 'white',
    borderRadius: '12px',
    overflow: 'auto',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse'
  },
  th: {
    textAlign: 'left',
    padding: '12px 16px',
    background: '#f8f9fa',
    fontWeight: '600',
    fontSize: '13px',
    color: '#555',
    borderBottom: '1px solid #eee'
  },
  td: {
    padding: '12px 16px',
    borderBottom: '1px solid #eee',
    fontSize: '14px'
  },
  tr: {
    transition: 'background 0.2s'
  },
  statusBadge: {
    display: 'inline-block',
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '500',
    color: 'white'
  },
  loading: {
    textAlign: 'center',
    padding: '40px',
    background: 'white',
    borderRadius: '12px',
    color: '#666'
  },
  noData: {
    textAlign: 'center',
    padding: '40px',
    color: '#999'
  }
};

export default Payments;