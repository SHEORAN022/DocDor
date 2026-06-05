// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const styles = `
//   @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&display=swap');

//   .users-container {
//     font-family: 'Sora', sans-serif;
//     background: #f4f6fa;
//     min-height: 100vh;
//     padding: 28px 32px;
//   }

//   .users-header {
//     display: flex;
//     align-items: center;
//     justify-content: space-between;
//     margin-bottom: 28px;
//     flex-wrap: wrap;
//     gap: 16px;
//   }

//   .users-title {
//     font-size: 22px;
//     font-weight: 700;
//     color: #0f1623;
//     letter-spacing: -0.3px;
//   }

//   .users-subtitle {
//     font-size: 12px;
//     color: #94a3b8;
//     margin-top: 3px;
//   }

//   .stats-grid {
//     display: grid;
//     grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
//     gap: 20px;
//     margin-bottom: 24px;
//   }

//   .stat-card {
//     background: #fff;
//     border-radius: 16px;
//     padding: 20px;
//     border: 1px solid #e8edf3;
//     transition: all 0.2s;
//   }

//   .stat-card:hover {
//     transform: translateY(-2px);
//     box-shadow: 0 8px 20px rgba(0,0,0,0.05);
//   }

//   .stat-value {
//     font-size: 28px;
//     font-weight: 700;
//     color: #0f1623;
//   }

//   .stat-label {
//     font-size: 12px;
//     color: #64748b;
//     margin-top: 4px;
//   }

//   .users-toolbar {
//     display: flex;
//     align-items: center;
//     gap: 12px;
//     margin-bottom: 20px;
//     flex-wrap: wrap;
//   }

//   .search-wrap {
//     position: relative;
//     flex: 1;
//     max-width: 340px;
//   }

//   .search-input {
//     width: 100%;
//     padding: 10px 12px 10px 36px;
//     border: 1px solid #e2e8f0;
//     border-radius: 10px;
//     font-family: 'Sora', sans-serif;
//     font-size: 13px;
//     outline: none;
//     transition: all 0.2s;
//     box-sizing: border-box;
//   }

//   .search-input:focus {
//     border-color: #2563eb;
//     box-shadow: 0 0 0 3px rgba(37,99,235,0.1);
//   }

//   .search-icon {
//     position: absolute;
//     left: 12px;
//     top: 50%;
//     transform: translateY(-50%);
//     color: #94a3b8;
//   }

//   .filter-select {
//     padding: 10px 14px;
//     border: 1px solid #e2e8f0;
//     border-radius: 10px;
//     font-family: 'Sora', sans-serif;
//     font-size: 13px;
//     background: #fff;
//     cursor: pointer;
//     transition: all 0.2s;
//   }

//   .filter-select:focus {
//     border-color: #2563eb;
//     outline: none;
//   }

//   .users-table-card {
//     background: #fff;
//     border-radius: 16px;
//     border: 1px solid #e8edf3;
//     overflow-x: auto;
//   }

//   .users-table {
//     width: 100%;
//     border-collapse: collapse;
//     min-width: 800px;
//   }

//   .users-table thead tr {
//     background: #f8fafc;
//     border-bottom: 1px solid #e8edf3;
//   }

//   .users-table th {
//     padding: 14px 16px;
//     text-align: left;
//     font-size: 11px;
//     font-weight: 700;
//     color: #94a3b8;
//     text-transform: uppercase;
//     letter-spacing: 0.5px;
//   }

//   .users-table td {
//     padding: 14px 16px;
//     font-size: 13px;
//     color: #334155;
//     border-bottom: 1px solid #f1f5f9;
//   }

//   .users-table tbody tr {
//     transition: background 0.2s;
//   }

//   .users-table tbody tr:hover {
//     background: #fafbff;
//   }

//   .user-avatar {
//     width: 40px;
//     height: 40px;
//     border-radius: 12px;
//     background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     font-weight: 600;
//     color: white;
//     font-size: 16px;
//     flex-shrink: 0;
//   }

//   .user-info {
//     display: flex;
//     align-items: center;
//     gap: 12px;
//   }

//   .user-name {
//     font-weight: 600;
//     color: #0f1623;
//     margin-bottom: 2px;
//   }

//   .user-email {
//     font-size: 11px;
//     color: #94a3b8;
//   }

//   .provider-badge {
//     display: inline-flex;
//     align-items: center;
//     gap: 4px;
//     padding: 4px 10px;
//     border-radius: 20px;
//     font-size: 11px;
//     font-weight: 600;
//   }

//   .provider-local {
//     background: #eff6ff;
//     color: #2563eb;
//   }

//   .provider-google {
//     background: #fef3c7;
//     color: #d97706;
//   }

//   .role-badge {
//     display: inline-flex;
//     align-items: center;
//     gap: 4px;
//     padding: 4px 10px;
//     border-radius: 20px;
//     font-size: 11px;
//     font-weight: 600;
//   }

//   .role-admin {
//     background: #fef2f2;
//     color: #dc2626;
//   }

//   .role-user {
//     background: #f0fdf4;
//     color: #16a34a;
//   }

//   .status-badge {
//     display: inline-flex;
//     align-items: center;
//     gap: 4px;
//     padding: 4px 10px;
//     border-radius: 20px;
//     font-size: 11px;
//     font-weight: 600;
//   }

//   .status-active {
//     background: #f0fdf4;
//     color: #16a34a;
//   }

//   .status-inactive {
//     background: #fef2f2;
//     color: #dc2626;
//   }

//   .action-buttons {
//     display: flex;
//     gap: 8px;
//     align-items: center;
//   }

//   .action-btn {
//     width: 32px;
//     height: 32px;
//     border-radius: 8px;
//     border: 1px solid #e2e8f0;
//     background: #fff;
//     cursor: pointer;
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     transition: all 0.2s;
//   }

//   .action-btn:hover {
//     transform: translateY(-2px);
//   }

//   .action-btn-edit:hover {
//     background: #eff6ff;
//     border-color: #bfdbfe;
//   }

//   .action-btn-delete:hover {
//     background: #fef2f2;
//     border-color: #fecaca;
//   }

//   .toggle-switch {
//     position: relative;
//     width: 44px;
//     height: 24px;
//     cursor: pointer;
//     display: inline-block;
//   }

//   .toggle-switch input {
//     opacity: 0;
//     width: 0;
//     height: 0;
//     position: absolute;
//   }

//   .toggle-track {
//     position: absolute;
//     inset: 0;
//     background: #cbd5e1;
//     border-radius: 24px;
//     transition: background 0.2s;
//   }

//   .toggle-switch input:checked + .toggle-track {
//     background: #2563eb;
//   }

//   .toggle-thumb {
//     position: absolute;
//     top: 3px;
//     left: 3px;
//     width: 18px;
//     height: 18px;
//     background: white;
//     border-radius: 50%;
//     transition: transform 0.2s;
//     box-shadow: 0 1px 3px rgba(0,0,0,0.2);
//     pointer-events: none;
//   }

//   .toggle-switch input:checked ~ .toggle-thumb {
//     transform: translateX(20px);
//   }

//   .pagination {
//     display: flex;
//     align-items: center;
//     justify-content: space-between;
//     padding: 16px 20px;
//     border-top: 1px solid #f1f5f9;
//     flex-wrap: wrap;
//     gap: 12px;
//   }

//   .pagination-info {
//     font-size: 12px;
//     color: #64748b;
//   }

//   .pagination-buttons {
//     display: flex;
//     gap: 8px;
//   }

//   .page-btn {
//     padding: 6px 12px;
//     border: 1px solid #e2e8f0;
//     border-radius: 8px;
//     background: #fff;
//     font-family: 'Sora', sans-serif;
//     font-size: 12px;
//     cursor: pointer;
//     transition: all 0.2s;
//   }

//   .page-btn:hover:not(:disabled) {
//     background: #f1f5f9;
//     border-color: #2563eb;
//   }

//   .page-btn:disabled {
//     opacity: 0.4;
//     cursor: not-allowed;
//   }

//   .page-btn.active {
//     background: #2563eb;
//     color: white;
//     border-color: #2563eb;
//   }

//   .modal-overlay {
//     position: fixed;
//     inset: 0;
//     background: rgba(15, 22, 35, 0.6);
//     backdrop-filter: blur(4px);
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     z-index: 1000;
//     animation: fadeIn 0.2s ease;
//   }

//   @keyframes fadeIn {
//     from { opacity: 0; }
//     to { opacity: 1; }
//   }

//   .modal-container {
//     background: #fff;
//     border-radius: 20px;
//     width: 500px;
//     max-width: 90vw;
//     animation: slideUp 0.3s ease;
//   }

//   @keyframes slideUp {
//     from { opacity: 0; transform: translateY(20px); }
//     to { opacity: 1; transform: translateY(0); }
//   }

//   .modal-header {
//     padding: 20px 24px;
//     border-bottom: 1px solid #f1f5f9;
//     display: flex;
//     align-items: center;
//     justify-content: space-between;
//   }

//   .modal-title {
//     font-size: 18px;
//     font-weight: 700;
//     color: #0f1623;
//   }

//   .modal-close {
//     width: 32px;
//     height: 32px;
//     border-radius: 8px;
//     border: 1px solid #e2e8f0;
//     background: #fff;
//     cursor: pointer;
//     font-size: 18px;
//     transition: all 0.2s;
//     display: flex;
//     align-items: center;
//     justify-content: center;
//   }

//   .modal-close:hover {
//     background: #f1f5f9;
//   }

//   .modal-body {
//     padding: 24px;
//   }

//   .form-group {
//     margin-bottom: 20px;
//   }

//   .form-label {
//     display: block;
//     font-size: 12px;
//     font-weight: 600;
//     color: #475569;
//     margin-bottom: 6px;
//   }

//   .form-input {
//     width: 100%;
//     padding: 10px 12px;
//     border: 1px solid #e2e8f0;
//     border-radius: 10px;
//     font-family: 'Sora', sans-serif;
//     font-size: 13px;
//     outline: none;
//     transition: all 0.2s;
//     box-sizing: border-box;
//   }

//   .form-input:focus {
//     border-color: #2563eb;
//     box-shadow: 0 0 0 3px rgba(37,99,235,0.1);
//   }

//   .modal-footer {
//     padding: 16px 24px 24px;
//     display: flex;
//     justify-content: flex-end;
//     gap: 12px;
//   }

//   .btn-cancel {
//     padding: 10px 20px;
//     border: 1px solid #e2e8f0;
//     border-radius: 10px;
//     background: #fff;
//     font-family: 'Sora', sans-serif;
//     font-size: 13px;
//     cursor: pointer;
//     transition: all 0.2s;
//   }

//   .btn-cancel:hover { background: #f1f5f9; }

//   .btn-save {
//     padding: 10px 24px;
//     border: none;
//     border-radius: 10px;
//     background: #2563eb;
//     color: white;
//     font-family: 'Sora', sans-serif;
//     font-size: 13px;
//     font-weight: 600;
//     cursor: pointer;
//     transition: all 0.2s;
//   }

//   .btn-save:hover:not(:disabled) {
//     background: #1d4ed8;
//     transform: translateY(-1px);
//   }

//   .btn-save:disabled {
//     opacity: 0.6;
//     cursor: not-allowed;
//   }

//   .btn-danger {
//     padding: 10px 24px;
//     border: none;
//     border-radius: 10px;
//     background: #dc2626;
//     color: white;
//     font-family: 'Sora', sans-serif;
//     font-size: 13px;
//     font-weight: 600;
//     cursor: pointer;
//     transition: all 0.2s;
//   }

//   .btn-danger:hover:not(:disabled) {
//     background: #b91c1c;
//     transform: translateY(-1px);
//   }

//   .btn-danger:disabled {
//     opacity: 0.6;
//     cursor: not-allowed;
//   }

//   .loading-state {
//     text-align: center;
//     padding: 60px;
//   }

//   .spinner {
//     width: 40px;
//     height: 40px;
//     border: 3px solid #e2e8f0;
//     border-top-color: #2563eb;
//     border-radius: 50%;
//     animation: spin 0.7s linear infinite;
//     margin: 0 auto 16px;
//   }

//   @keyframes spin { to { transform: rotate(360deg); } }

//   .error-state {
//     text-align: center;
//     padding: 60px;
//   }

//   .toast-wrap {
//     position: fixed;
//     bottom: 24px;
//     right: 24px;
//     z-index: 1100;
//     display: flex;
//     flex-direction: column;
//     gap: 8px;
//   }

//   .toast {
//     padding: 12px 20px;
//     border-radius: 10px;
//     font-size: 13px;
//     font-weight: 500;
//     animation: slideIn 0.3s ease;
//     box-shadow: 0 4px 12px rgba(0,0,0,0.15);
//   }

//   @keyframes slideIn {
//     from { opacity: 0; transform: translateX(20px); }
//     to { opacity: 1; transform: translateX(0); }
//   }

//   .toast-success { background: #0f1623; color: white; }
//   .toast-error { background: #dc2626; color: white; }

//   @media (max-width: 768px) {
//     .users-container { padding: 16px; }
//     .stats-grid { grid-template-columns: repeat(2, 1fr); }
//     .users-toolbar { flex-direction: column; align-items: stretch; }
//     .search-wrap { max-width: none; }
//   }
// `;

// // ✅ API base URL - apna production URL yahan daalo
// const API_BASE = 'https://docdorsand.onrender.com/api';
// let toastId = 0;

// export default function Users() {
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [search, setSearch] = useState('');
//   const [providerFilter, setProviderFilter] = useState('all');
//   const [roleFilter, setRoleFilter] = useState('all');
//   const [statusFilter, setStatusFilter] = useState('all');
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 10;
//   const [toasts, setToasts] = useState([]);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [editFormData, setEditFormData] = useState({
//     fullname: '',
//     email: '',
//     phone: '',
//     role: 'user'
//   });
//   const [submitting, setSubmitting] = useState(false);

//   const getToken = () => localStorage.getItem('token');

//   const showToast = (message, type = 'success') => {
//     const id = ++toastId;
//     setToasts(prev => [...prev, { id, message, type }]);
//     setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
//   };

//   // ─── Fetch All Users ───────────────────────────────────────────────────────
//   const fetchUsers = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const token = getToken();
//       if (!token) {
//         setError('Please login again');
//         setTimeout(() => {
//           localStorage.clear();
//           window.location.href = '/login';
//         }, 2000);
//         setLoading(false);
//         return;
//       }

//       const response = await axios.get(`${API_BASE}/users/all-users`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       });

//       if (response.data.success) {
//         setUsers(response.data.users || []);
//       } else {
//         setError(response.data.message || 'Failed to load users');
//       }
//     } catch (err) {
//       console.error('Fetch users error:', err);
//       if (err.response?.status === 401 || err.response?.status === 403) {
//         setError('Session expired. Please login again.');
//         setTimeout(() => {
//           localStorage.clear();
//           window.location.href = '/login';
//         }, 2000);
//       } else {
//         setError(err.response?.data?.message || 'Something went wrong');
//         showToast('Failed to load users', 'error');
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//  useEffect(() => {

//   fetchUsers();

// }, [fetchUsers]);

//   // ─── Filtering & Pagination ────────────────────────────────────────────────
//   const filteredUsers = users.filter(user => {
//     if (!user) return false;
//     const matchesSearch =
//       (user.fullname || '').toLowerCase().includes(search.toLowerCase()) ||
//       (user.email || '').toLowerCase().includes(search.toLowerCase());
//     const matchesProvider = providerFilter === 'all' || user.provider === providerFilter;
//     const matchesRole     = roleFilter === 'all'     || user.role === roleFilter;
//     const matchesStatus   =
//       statusFilter === 'all' ||
//       (statusFilter === 'active'   && user.isActive) ||
//       (statusFilter === 'inactive' && !user.isActive);
//     return matchesSearch && matchesProvider && matchesRole && matchesStatus;
//   });

//   const totalPages    = Math.ceil(filteredUsers.length / itemsPerPage);
//   const paginatedUsers = filteredUsers.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage
//   );

//   const stats = {
//     total:    users.length,
//     active:   users.filter(u => u?.isActive).length,
//     inactive: users.filter(u => u && !u.isActive).length,
//     google:   users.filter(u => u?.provider === 'google').length,
//     local:    users.filter(u => u?.provider === 'local').length,
//   };

//   // ─── Edit ──────────────────────────────────────────────────────────────────
//   const handleEdit = (user) => {
//     setSelectedUser(user);
//     setEditFormData({
//       fullname: user.fullname || '',
//       email:    user.email    || '',
//       phone:    user.phone    || '',
//       role:     user.role     || 'user'
//     });
//     setShowEditModal(true);
//   };

//   // ✅ FIX: correct endpoint with user._id instead of /profile
//   const handleUpdate = async () => {
//     if (!selectedUser?._id) return;
//     setSubmitting(true);
//     try {
//       const token = getToken();
//       await axios.put(
//         `${API_BASE}/users/${selectedUser._id}`,
//         {
//           fullname: editFormData.fullname,
//           email:    editFormData.email,
//           phone:    editFormData.phone,
//           role:     editFormData.role
//         },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       showToast('User updated successfully');
//       setShowEditModal(false);
//       fetchUsers();
//     } catch (err) {
//       console.error('Update error:', err);
//       showToast(err.response?.data?.message || 'Failed to update user', 'error');
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   // ─── Delete ────────────────────────────────────────────────────────────────
//   const handleDelete = async () => {
//     if (!selectedUser?._id) return;
//     setSubmitting(true);
//     try {
//       const token = getToken();
//       await axios.delete(`${API_BASE}/users/${selectedUser._id}`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       showToast('User deleted successfully');
//       setShowDeleteModal(false);
//       setSelectedUser(null);
//       fetchUsers();
//     } catch (err) {
//       console.error('Delete error:', err);
//       showToast(err.response?.data?.message || 'Failed to delete user', 'error');
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   // ─── Toggle Active Status ──────────────────────────────────────────────────
//   const handleToggleStatus = async (user) => {
//     try {
//       const token = getToken();
//       await axios.patch(
//         `${API_BASE}/users/toggle-status/${user._id}`,
//         {},
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       showToast(`User ${user.isActive ? 'deactivated' : 'activated'} successfully`);
//       fetchUsers();
//     } catch (err) {
//       console.error('Toggle status error:', err);
//       showToast('Failed to update status', 'error');
//     }
//   };

//   const formatDate = (date) => {
//     if (!date) return 'N/A';
//     try {
//       return new Date(date).toLocaleDateString('en-IN', {
//         day: '2-digit', month: 'short', year: 'numeric'
//       });
//     } catch { return 'Invalid date'; }
//   };

//   // ─── Loading / Error States ────────────────────────────────────────────────
//   if (loading) {
//     return (
//       <>
//         <style>{styles}</style>
//         <div className="users-container">
//           <div className="loading-state">
//             <div className="spinner" />
//             <div style={{ color: '#94a3b8' }}>Loading users...</div>
//           </div>
//         </div>
//       </>
//     );
//   }

//   if (error) {
//     return (
//       <>
//         <style>{styles}</style>
//         <div className="users-container">
//           <div className="error-state">
//             <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
//             <div style={{ fontWeight: 600, marginBottom: '8px', color: '#dc2626' }}>{error}</div>
//             <button
//               onClick={fetchUsers}
//               style={{
//                 marginTop: '20px', padding: '10px 24px',
//                 background: '#2563eb', color: 'white',
//                 border: 'none', borderRadius: '10px',
//                 cursor: 'pointer', fontFamily: 'Sora, sans-serif', fontWeight: 500
//               }}
//             >
//               Try Again
//             </button>
//           </div>
//         </div>
//       </>
//     );
//   }

//   // ─── Main Render ───────────────────────────────────────────────────────────
//   return (
//     <>
//       <style>{styles}</style>
//       <div className="users-container">

//         {/* Header */}
//         <div className="users-header">
//           <div>
//             <div className="users-title">User Management</div>
//             <div className="users-subtitle">Manage all registered users ({users.length} total)</div>
//           </div>
//         </div>

//         {/* Stats */}
//         <div className="stats-grid">
//           <div className="stat-card">
//             <div className="stat-value">{stats.total}</div>
//             <div className="stat-label">Total Users</div>
//           </div>
//           <div className="stat-card">
//             <div className="stat-value">{stats.active}</div>
//             <div className="stat-label">Active</div>
//           </div>
//           <div className="stat-card">
//             <div className="stat-value">{stats.google}</div>
//             <div className="stat-label">Google Login</div>
//           </div>
//           <div className="stat-card">
//             <div className="stat-value">{stats.local}</div>
//             <div className="stat-label">Email Login</div>
//           </div>
//         </div>

//         {/* Toolbar */}
//         <div className="users-toolbar">
//           <div className="search-wrap">
//             <span className="search-icon">🔍</span>
//             <input
//               type="text"
//               className="search-input"
//               placeholder="Search by name or email..."
//               value={search}
//               onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
//             />
//           </div>
//           <select className="filter-select" value={providerFilter}
//             onChange={(e) => { setProviderFilter(e.target.value); setCurrentPage(1); }}>
//             <option value="all">All Providers</option>
//             <option value="local">Email Login</option>
//             <option value="google">Google Login</option>
//           </select>
//           <select className="filter-select" value={roleFilter}
//             onChange={(e) => { setRoleFilter(e.target.value); setCurrentPage(1); }}>
//             <option value="all">All Roles</option>
//             <option value="admin">Admin</option>
//             <option value="user">User</option>
//           </select>
//           <select className="filter-select" value={statusFilter}
//             onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}>
//             <option value="all">All Status</option>
//             <option value="active">Active</option>
//             <option value="inactive">Inactive</option>
//           </select>
//         </div>

//         {/* Table */}
//         <div className="users-table-card">
//           {paginatedUsers.length === 0 ? (
//             <div className="loading-state">
//               <div style={{ fontSize: '48px', marginBottom: '12px' }}>👥</div>
//               <div style={{ color: '#94a3b8' }}>No users found</div>
//             </div>
//           ) : (
//             <>
//               <div style={{ overflowX: 'auto' }}>
//                 <table className="users-table">
//                   <thead>
//                     <tr>
//                       <th>#</th>
//                       <th>User</th>
//                       <th>Provider</th>
//                       <th>Role</th>
//                       <th>Status</th>
//                       <th>Joined</th>
//                       <th>Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {paginatedUsers.map((user, idx) => (
//                       <tr key={user._id || idx}>
//                         <td>{(currentPage - 1) * itemsPerPage + idx + 1}</td>
//                         <td>
//                           <div className="user-info">
//                             <div className="user-avatar">
//                               {(user.fullname?.charAt(0) || 'U').toUpperCase()}
//                             </div>
//                             <div>
//                               <div className="user-name">{user.fullname || 'N/A'}</div>
//                               <div className="user-email">{user.email}</div>
//                             </div>
//                           </div>
//                         </td>
//                         <td>
//                           <span className={`provider-badge provider-${user.provider || 'local'}`}>
//                             {user.provider === 'google' ? '🔵 Google' : '📧 Email'}
//                           </span>
//                         </td>
//                         <td>
//                           <span className={`role-badge role-${user.role || 'user'}`}>
//                             {user.role === 'admin' ? '👑 Admin' : '👤 User'}
//                           </span>
//                         </td>
//                         <td>
//                           <span className={`status-badge status-${user.isActive ? 'active' : 'inactive'}`}>
//                             {user.isActive ? '● Active' : '○ Inactive'}
//                           </span>
//                         </td>
//                         <td style={{ fontSize: '12px', color: '#64748b' }}>
//                           {formatDate(user.createdAt)}
//                         </td>
//                         <td>
//                           <div className="action-buttons">
//                             {/* Toggle Status */}
//                             <label className="toggle-switch">
//                               <input
//                                 type="checkbox"
//                                 checked={!!user.isActive}
//                                 onChange={() => handleToggleStatus(user)}
//                               />
//                               <div className="toggle-track" />
//                               <div className="toggle-thumb" />
//                             </label>
//                             {/* Edit */}
//                             <button
//                               className="action-btn action-btn-edit"
//                               onClick={() => handleEdit(user)}
//                               title="Edit User"
//                             >
//                               ✏️
//                             </button>
//                             {/* Delete */}
//                             <button
//                               className="action-btn action-btn-delete"
//                               onClick={() => { setSelectedUser(user); setShowDeleteModal(true); }}
//                               title="Delete User"
//                             >
//                               🗑️
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>

//               {/* Pagination */}
//               {totalPages > 1 && (
//                 <div className="pagination">
//                   <div className="pagination-info">
//                     Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
//                     {Math.min(currentPage * itemsPerPage, filteredUsers.length)} of {filteredUsers.length}
//                   </div>
//                   <div className="pagination-buttons">
//                     <button className="page-btn" disabled={currentPage === 1}
//                       onClick={() => setCurrentPage(p => p - 1)}>
//                       Previous
//                     </button>
//                     {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
//                       <button
//                         key={page}
//                         className={`page-btn ${currentPage === page ? 'active' : ''}`}
//                         onClick={() => setCurrentPage(page)}
//                       >
//                         {page}
//                       </button>
//                     ))}
//                     <button className="page-btn" disabled={currentPage === totalPages}
//                       onClick={() => setCurrentPage(p => p + 1)}>
//                       Next
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </>
//           )}
//         </div>

//         {/* ── Edit Modal ── */}
//         {showEditModal && selectedUser && (
//           <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
//             <div className="modal-container" onClick={e => e.stopPropagation()}>
//               <div className="modal-header">
//                 <div className="modal-title">Edit User</div>
//                 <button className="modal-close" onClick={() => setShowEditModal(false)}>✕</button>
//               </div>
//               <div className="modal-body">
//                 <div className="form-group">
//                   <label className="form-label">Full Name</label>
//                   <input type="text" className="form-input"
//                     value={editFormData.fullname}
//                     onChange={e => setEditFormData({ ...editFormData, fullname: e.target.value })} />
//                 </div>
//                 <div className="form-group">
//                   <label className="form-label">Email</label>
//                   <input type="email" className="form-input"
//                     value={editFormData.email}
//                     onChange={e => setEditFormData({ ...editFormData, email: e.target.value })} />
//                 </div>
//                 <div className="form-group">
//                   <label className="form-label">Phone</label>
//                   <input type="text" className="form-input"
//                     value={editFormData.phone}
//                     onChange={e => setEditFormData({ ...editFormData, phone: e.target.value })} />
//                 </div>
//                 <div className="form-group">
//                   <label className="form-label">Role</label>
//                   <select className="form-input"
//                     value={editFormData.role}
//                     onChange={e => setEditFormData({ ...editFormData, role: e.target.value })}>
//                     <option value="user">User</option>
//                     <option value="admin">Admin</option>
//                   </select>
//                 </div>
//               </div>
//               <div className="modal-footer">
//                 <button className="btn-cancel" onClick={() => setShowEditModal(false)}>Cancel</button>
//                 <button className="btn-save" onClick={handleUpdate} disabled={submitting}>
//                   {submitting ? 'Saving...' : 'Save Changes'}
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* ── Delete Modal ── */}
//         {showDeleteModal && selectedUser && (
//           <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
//             <div className="modal-container" onClick={e => e.stopPropagation()}>
//               <div className="modal-header">
//                 <div className="modal-title">Delete User</div>
//                 <button className="modal-close" onClick={() => setShowDeleteModal(false)}>✕</button>
//               </div>
//               <div className="modal-body">
//                 <div style={{ textAlign: 'center' }}>
//                   <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
//                   <div style={{ fontWeight: 600, marginBottom: '8px' }}>
//                     Delete "{selectedUser.fullname}"?
//                   </div>
//                   <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '12px' }}>
//                     {selectedUser.email}
//                   </div>
//                   <div style={{ fontSize: '12px', color: '#dc2626' }}>
//                     This action cannot be undone.
//                   </div>
//                 </div>
//               </div>
//               <div className="modal-footer">
//                 <button className="btn-cancel" onClick={() => setShowDeleteModal(false)}>Cancel</button>
//                 <button className="btn-danger" onClick={handleDelete} disabled={submitting}>
//                   {submitting ? 'Deleting...' : 'Delete User'}
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* ── Toasts ── */}
//         <div className="toast-wrap">
//           {toasts.map(toast => (
//             <div key={toast.id} className={`toast toast-${toast.type}`}>
//               {toast.type === 'success' ? '✅' : '❌'} {toast.message}
//             </div>
//           ))}
//         </div>

//       </div>
//     </>
//   );
// }```jsx


import React, { useEffect, useState } from "react";
import axios from "axios";

function Users() {

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // =========================
  // FETCH USERS
  // =========================

  const fetchUsers = async () => {

    try {

      const token =
        localStorage.getItem("token");

      const res = await axios.get(
        "https://userside-x164.onrender.com/api/users/all-users",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        setUsers(res.data.users);
      }

    } catch (error) {

      console.log(
        "FETCH ERROR:",
        error
      );

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {

    fetchUsers();

  }, []);

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div style={styles.loading}>
        Loading Users...
      </div>
    );
  }

  // =========================
  // UI
  // =========================

  return (
    <div style={styles.container}>

      <div style={styles.header}>
        <h1 style={styles.title}>
          Users List
        </h1>

        <div style={styles.count}>
          Total Users : {users.length}
        </div>
      </div>

      <div style={styles.tableWrapper}>

        <table style={styles.table}>

          <thead>

            <tr style={styles.headRow}>

              <th style={styles.th}>#</th>
              <th style={styles.th}>Image</th>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Phone</th>
              <th style={styles.th}>Provider</th>
              <th style={styles.th}>Role</th>
              <th style={styles.th}>Status</th>

            </tr>

          </thead>

          <tbody>

            {users.map((user, index) => (

              <tr key={user._id} style={styles.tr}>

                <td style={styles.td}>
                  {index + 1}
                </td>

                <td style={styles.td}>

                  <img
                    src={
                      user.image ||
                      "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                    }
                    alt=""
                    style={styles.image}
                  />

                </td>

                <td style={styles.td}>
                  {user.fullname}
                </td>

                <td style={styles.td}>
                  {user.email}
                </td>

                <td style={styles.td}>
                  {user.phone || "N/A"}
                </td>

                <td style={styles.td}>

                  <span
                    style={{
                      ...styles.badge,
                      background:
                        user.provider === "google"
                          ? "#fef3c7"
                          : "#dbeafe",
                      color:
                        user.provider === "google"
                          ? "#92400e"
                          : "#1e40af",
                    }}
                  >
                    {user.provider}
                  </span>

                </td>

                <td style={styles.td}>

                  <span
                    style={{
                      ...styles.badge,
                      background:
                        user.role === "admin"
                          ? "#fee2e2"
                          : "#dcfce7",
                      color:
                        user.role === "admin"
                          ? "#991b1b"
                          : "#166534",
                    }}
                  >
                    {user.role}
                  </span>

                </td>

                <td style={styles.td}>

                  <span
                    style={{
                      ...styles.badge,
                      background:
                        user.isActive
                          ? "#dcfce7"
                          : "#fee2e2",
                      color:
                        user.isActive
                          ? "#166534"
                          : "#991b1b",
                    }}
                  >
                    {user.isActive
                      ? "Active"
                      : "Inactive"}
                  </span>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}

// =========================
// STYLES
// =========================

const styles = {

  container: {
    padding: "25px",
    background: "#f3f4f6",
    minHeight: "100vh",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },

  title: {
    fontSize: "30px",
    fontWeight: "700",
    color: "#111827",
  },

  count: {
    background: "#111827",
    color: "#fff",
    padding: "10px 18px",
    borderRadius: "10px",
    fontWeight: "600",
  },

  tableWrapper: {
    background: "#fff",
    borderRadius: "12px",
    overflowX: "auto",
    boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  headRow: {
    background: "#111827",
  },

  th: {
    color: "#fff",
    padding: "16px",
    textAlign: "left",
    fontSize: "14px",
  },

  td: {
    padding: "14px",
    borderBottom: "1px solid #e5e7eb",
    fontSize: "14px",
  },

  tr: {
    transition: "0.3s",
  },

  image: {
    width: "45px",
    height: "45px",
    borderRadius: "50%",
    objectFit: "cover",
  },

  badge: {
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "13px",
    fontWeight: "600",
    textTransform: "capitalize",
  },

  loading: {
    padding: "40px",
    fontSize: "24px",
    fontWeight: "600",
  },

};

export default Users;

