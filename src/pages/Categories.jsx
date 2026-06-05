// import React, { useState, useEffect, useRef } from 'react';
// import axios from 'axios';

// // ─────────────────────────────────────────
// // STYLES
// // ─────────────────────────────────────────
// const styles = `
//   @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&display=swap');

//   .cat-root {
//     font-family: 'Sora', sans-serif;
//     background: #f4f6fa;
//     min-height: 100vh;
//     padding: 28px 32px;
//     -webkit-font-smoothing: antialiased;
//   }

//   /* ── HEADER ── */
//   .cat-header {
//     display: flex;
//     align-items: center;
//     justify-content: space-between;
//     margin-bottom: 28px;
//     animation: fadeUp 0.35s ease both;
//   }

//   @keyframes fadeUp {
//     from { opacity: 0; transform: translateY(10px); }
//     to   { opacity: 1; transform: translateY(0); }
//   }

//   .cat-title {
//     font-size: 22px;
//     font-weight: 700;
//     color: #0f1623;
//     letter-spacing: -0.5px;
//   }

//   .cat-subtitle {
//     font-size: 12px;
//     color: #94a3b8;
//     margin-top: 3px;
//   }

//   .btn-primary {
//     display: inline-flex;
//     align-items: center;
//     gap: 7px;
//     background: #2563eb;
//     color: white;
//     border: none;
//     border-radius: 10px;
//     padding: 10px 18px;
//     font-size: 13px;
//     font-weight: 600;
//     font-family: 'Sora', sans-serif;
//     cursor: pointer;
//     transition: background 0.15s, transform 0.1s;
//   }

//   .btn-primary:hover { background: #1d4ed8; }
//   .btn-primary:active { transform: scale(0.97); }

//   /* ── SEARCH / FILTER BAR ── */
//   .cat-toolbar {
//     display: flex;
//     align-items: center;
//     gap: 12px;
//     margin-bottom: 20px;
//     animation: fadeUp 0.35s ease 0.05s both;
//   }

//   .cat-search-wrap {
//     position: relative;
//     flex: 1;
//     max-width: 340px;
//   }

//   .cat-search-icon {
//     position: absolute;
//     left: 12px;
//     top: 50%;
//     transform: translateY(-50%);
//     color: #94a3b8;
//     pointer-events: none;
//   }

//   .cat-search {
//     width: 100%;
//     padding: 9px 12px 9px 36px;
//     border: 1px solid #e2e8f0;
//     border-radius: 10px;
//     font-family: 'Sora', sans-serif;
//     font-size: 13px;
//     color: #0f1623;
//     background: #fff;
//     outline: none;
//     transition: border-color 0.15s;
//   }

//   .cat-search:focus { border-color: #2563eb; }

//   .cat-filter-select {
//     padding: 9px 14px;
//     border: 1px solid #e2e8f0;
//     border-radius: 10px;
//     font-family: 'Sora', sans-serif;
//     font-size: 13px;
//     color: #334155;
//     background: #fff;
//     outline: none;
//     cursor: pointer;
//   }

//   /* ── STATS PILLS ── */
//   .cat-stats {
//     display: flex;
//     gap: 10px;
//     margin-bottom: 20px;
//     animation: fadeUp 0.35s ease 0.08s both;
//     flex-wrap: wrap;
//   }

//   .stat-pill {
//     display: flex;
//     align-items: center;
//     gap: 6px;
//     padding: 6px 14px;
//     border-radius: 20px;
//     font-size: 12px;
//     font-weight: 600;
//     border: 1px solid;
//   }

//   .pill-total  { background: #eff4ff; color: #2563eb; border-color: #bfdbfe; }
//   .pill-active { background: #f0fdf4; color: #16a34a; border-color: #bbf7d0; }
//   .pill-inactive { background: #fef2f2; color: #dc2626; border-color: #fecaca; }
//   .pill-free   { background: #faf5ff; color: #7c3aed; border-color: #ddd6fe; }

//   /* ── TABLE CARD ── */
//   .cat-table-card {
//     background: #fff;
//     border: 1px solid #e8edf3;
//     border-radius: 14px;
//     overflow: hidden;
//     animation: fadeUp 0.35s ease 0.1s both;
//   }

//   .cat-table {
//     width: 100%;
//     border-collapse: collapse;
//   }

//   .cat-table thead tr {
//     background: #f8fafc;
//     border-bottom: 1px solid #e8edf3;
//   }

//   .cat-table th {
//     padding: 12px 16px;
//     text-align: left;
//     font-size: 10px;
//     font-weight: 700;
//     color: #94a3b8;
//     text-transform: uppercase;
//     letter-spacing: 0.6px;
//   }

//   .cat-table td {
//     padding: 14px 16px;
//     font-size: 13px;
//     color: #334155;
//     border-bottom: 1px solid #f1f5f9;
//     vertical-align: middle;
//   }

//   .cat-table tbody tr:last-child td { border-bottom: none; }

//   .cat-table tbody tr {
//     transition: background 0.12s;
//   }

//   .cat-table tbody tr:hover { background: #fafbff; }

//   /* ── CATEGORY IMAGE ── */
//   .cat-img-wrap {
//     width: 40px;
//     height: 40px;
//     border-radius: 9px;
//     overflow: hidden;
//     border: 1px solid #e2e8f0;
//     background: #f8fafc;
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     flex-shrink: 0;
//   }

//   .cat-img-wrap img {
//     width: 100%;
//     height: 100%;
//     object-fit: cover;
//   }

//   .cat-img-placeholder {
//     font-size: 16px;
//   }

//   .cat-name-cell {
//     display: flex;
//     align-items: center;
//     gap: 12px;
//   }

//   .cat-name-text {
//     font-size: 13px;
//     font-weight: 600;
//     color: #0f1623;
//   }

//   .cat-slug-text {
//     font-size: 10px;
//     color: #94a3b8;
//     font-family: monospace;
//     margin-top: 2px;
//   }

//   /* ── BADGES ── */
//   .badge {
//     display: inline-flex;
//     align-items: center;
//     gap: 4px;
//     padding: 3px 10px;
//     border-radius: 20px;
//     font-size: 11px;
//     font-weight: 600;
//   }

//   .badge-active   { background: #f0fdf4; color: #16a34a; }
//   .badge-inactive { background: #fef2f2; color: #dc2626; }
//   .badge-free     { background: #faf5ff; color: #7c3aed; }
//   .badge-paid     { background: #fffbeb; color: #d97706; }

//   /* ── TOGGLE SWITCH ── */
//   .toggle-wrap { display: flex; align-items: center; gap: 8px; }

//   .toggle {
//     position: relative;
//     width: 36px;
//     height: 20px;
//     cursor: pointer;
//   }

//   .toggle input { opacity: 0; width: 0; height: 0; }

//   .toggle-track {
//     position: absolute;
//     inset: 0;
//     background: #cbd5e1;
//     border-radius: 20px;
//     transition: background 0.2s;
//   }

//   .toggle input:checked + .toggle-track { background: #2563eb; }

//   .toggle-thumb {
//     position: absolute;
//     top: 3px;
//     left: 3px;
//     width: 14px;
//     height: 14px;
//     background: white;
//     border-radius: 50%;
//     transition: transform 0.2s;
//     box-shadow: 0 1px 3px rgba(0,0,0,0.2);
//   }

//   .toggle input:checked ~ .toggle-thumb { transform: translateX(16px); }

//   /* ── ACTION BUTTONS ── */
//   .action-btns { display: flex; align-items: center; gap: 6px; }

//   .btn-icon {
//     width: 32px;
//     height: 32px;
//     border-radius: 8px;
//     border: 1px solid #e2e8f0;
//     background: #fff;
//     cursor: pointer;
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     transition: all 0.15s;
//     font-size: 14px;
//   }

//   .btn-icon:hover { transform: translateY(-1px); }
//   .btn-icon-edit:hover  { background: #eff4ff; border-color: #bfdbfe; }
//   .btn-icon-delete:hover { background: #fef2f2; border-color: #fecaca; }

//   /* ── EMPTY STATE ── */
//   .cat-empty {
//     text-align: center;
//     padding: 60px 20px;
//     color: #94a3b8;
//   }

//   .cat-empty-icon { font-size: 40px; margin-bottom: 12px; }
//   .cat-empty-title { font-size: 15px; font-weight: 600; color: #475569; margin-bottom: 6px; }
//   .cat-empty-sub { font-size: 12px; }

//   /* ── LOADING ── */
//   .cat-loading {
//     text-align: center;
//     padding: 60px 20px;
//     color: #94a3b8;
//     font-size: 13px;
//   }

//   .spinner {
//     width: 32px;
//     height: 32px;
//     border: 3px solid #e2e8f0;
//     border-top-color: #2563eb;
//     border-radius: 50%;
//     animation: spin 0.7s linear infinite;
//     margin: 0 auto 14px;
//   }

//   @keyframes spin { to { transform: rotate(360deg); } }

//   /* ── MODAL OVERLAY ── */
//   .modal-overlay {
//     position: fixed;
//     inset: 0;
//     background: rgba(15,22,35,0.55);
//     backdrop-filter: blur(3px);
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     z-index: 1000;
//     animation: fadeOverlay 0.2s ease;
//   }

//   @keyframes fadeOverlay { from { opacity: 0; } to { opacity: 1; } }

//   .modal-box {
//     background: #fff;
//     border-radius: 16px;
//     width: 460px;
//     max-width: 95vw;
//     box-shadow: 0 24px 60px rgba(0,0,0,0.18);
//     animation: slideUp 0.25s ease;
//     overflow: hidden;
//   }

//   @keyframes slideUp {
//     from { opacity: 0; transform: translateY(16px) scale(0.98); }
//     to   { opacity: 1; transform: translateY(0) scale(1); }
//   }

//   .modal-header {
//     padding: 20px 24px 0;
//     display: flex;
//     align-items: center;
//     justify-content: space-between;
//   }

//   .modal-title { font-size: 16px; font-weight: 700; color: #0f1623; letter-spacing: -0.3px; }
//   .modal-sub   { font-size: 12px; color: #94a3b8; margin-top: 3px; }

//   .modal-close {
//     width: 30px;
//     height: 30px;
//     border-radius: 8px;
//     border: 1px solid #e2e8f0;
//     background: #fff;
//     cursor: pointer;
//     font-size: 16px;
//     color: #64748b;
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     transition: background 0.15s;
//   }

//   .modal-close:hover { background: #f8fafc; }

//   .modal-body { padding: 20px 24px 24px; }

//   /* ── FORM ── */
//   .form-group { margin-bottom: 16px; }

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
//     border-radius: 9px;
//     font-family: 'Sora', sans-serif;
//     font-size: 13px;
//     color: #0f1623;
//     background: #fff;
//     outline: none;
//     transition: border-color 0.15s, box-shadow 0.15s;
//   }

//   .form-input:focus {
//     border-color: #2563eb;
//     box-shadow: 0 0 0 3px rgba(37,99,235,0.1);
//   }

//   .form-row {
//     display: grid;
//     grid-template-columns: 1fr 1fr;
//     gap: 12px;
//   }

//   /* ── IMAGE UPLOAD AREA ── */
//   .upload-area {
//     border: 2px dashed #e2e8f0;
//     border-radius: 10px;
//     padding: 20px;
//     text-align: center;
//     cursor: pointer;
//     transition: border-color 0.15s, background 0.15s;
//     position: relative;
//   }

//   .upload-area:hover {
//     border-color: #2563eb;
//     background: #f8faff;
//   }

//   .upload-area input[type="file"] {
//     position: absolute;
//     inset: 0;
//     opacity: 0;
//     cursor: pointer;
//     width: 100%;
//     height: 100%;
//   }

//   .upload-icon { font-size: 24px; margin-bottom: 6px; }
//   .upload-text { font-size: 12px; color: #64748b; }
//   .upload-hint { font-size: 10px; color: #94a3b8; margin-top: 3px; }

//   .upload-preview {
//     position: relative;
//     width: 80px;
//     height: 80px;
//     margin: 0 auto 8px;
//     border-radius: 9px;
//     overflow: hidden;
//     border: 1px solid #e2e8f0;
//   }

//   .upload-preview img { width: 100%; height: 100%; object-fit: cover; }

//   .upload-preview-remove {
//     position: absolute;
//     top: 4px;
//     right: 4px;
//     width: 18px;
//     height: 18px;
//     border-radius: 50%;
//     background: rgba(0,0,0,0.55);
//     color: white;
//     border: none;
//     cursor: pointer;
//     font-size: 10px;
//     display: flex;
//     align-items: center;
//     justify-content: center;
//   }

//   /* ── TOGGLE CHECKBOX ── */
//   .check-row {
//     display: flex;
//     align-items: center;
//     gap: 10px;
//     padding: 10px 12px;
//     border: 1px solid #e2e8f0;
//     border-radius: 9px;
//     cursor: pointer;
//     transition: border-color 0.15s;
//   }

//   .check-row:hover { border-color: #2563eb; }

//   .check-row input { accent-color: #2563eb; width: 15px; height: 15px; cursor: pointer; }

//   .check-row-label { font-size: 13px; color: #334155; font-weight: 500; }
//   .check-row-hint  { font-size: 11px; color: #94a3b8; }

//   /* ── MODAL FOOTER ── */
//   .modal-footer {
//     display: flex;
//     align-items: center;
//     justify-content: flex-end;
//     gap: 10px;
//     padding-top: 16px;
//     border-top: 1px solid #f1f5f9;
//     margin-top: 4px;
//   }

//   .btn-ghost {
//     padding: 9px 18px;
//     border: 1px solid #e2e8f0;
//     border-radius: 9px;
//     background: #fff;
//     font-family: 'Sora', sans-serif;
//     font-size: 13px;
//     font-weight: 500;
//     color: #475569;
//     cursor: pointer;
//     transition: background 0.15s;
//   }

//   .btn-ghost:hover { background: #f8fafc; }

//   .btn-danger {
//     padding: 9px 18px;
//     border: none;
//     border-radius: 9px;
//     background: #dc2626;
//     font-family: 'Sora', sans-serif;
//     font-size: 13px;
//     font-weight: 600;
//     color: white;
//     cursor: pointer;
//     transition: background 0.15s;
//   }

//   .btn-danger:hover { background: #b91c1c; }

//   /* ── TOAST ── */
//   .toast-wrap {
//     position: fixed;
//     bottom: 24px;
//     right: 24px;
//     z-index: 2000;
//     display: flex;
//     flex-direction: column;
//     gap: 8px;
//   }

//   .toast {
//     display: flex;
//     align-items: center;
//     gap: 10px;
//     padding: 12px 18px;
//     border-radius: 10px;
//     font-size: 13px;
//     font-weight: 500;
//     box-shadow: 0 8px 24px rgba(0,0,0,0.12);
//     animation: toastIn 0.25s ease;
//     min-width: 260px;
//   }

//   @keyframes toastIn {
//     from { opacity: 0; transform: translateY(10px); }
//     to   { opacity: 1; transform: translateY(0); }
//   }

//   .toast-success { background: #0f1623; color: #fff; }
//   .toast-error   { background: #dc2626; color: #fff; }

//   /* ── PAGINATION ── */
//   .cat-pagination {
//     display: flex;
//     align-items: center;
//     justify-content: space-between;
//     padding: 14px 16px;
//     border-top: 1px solid #f1f5f9;
//     font-size: 12px;
//     color: #64748b;
//   }

//   .pag-btns { display: flex; gap: 6px; }

//   .pag-btn {
//     padding: 5px 12px;
//     border: 1px solid #e2e8f0;
//     border-radius: 7px;
//     background: #fff;
//     font-family: 'Sora', sans-serif;
//     font-size: 12px;
//     color: #475569;
//     cursor: pointer;
//     transition: background 0.12s;
//   }

//   .pag-btn:disabled { opacity: 0.4; cursor: not-allowed; }
//   .pag-btn:not(:disabled):hover { background: #f1f5f9; }

//   /* ── DELETE CONFIRM ── */
//   .delete-confirm-icon {
//     width: 52px;
//     height: 52px;
//     border-radius: 50%;
//     background: #fef2f2;
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     font-size: 22px;
//     margin: 0 auto 14px;
//   }

//   .delete-confirm-text {
//     text-align: center;
//     margin-bottom: 4px;
//   }

//   .delete-confirm-title { font-size: 15px; font-weight: 700; color: #0f1623; }
//   .delete-confirm-sub   { font-size: 12px; color: #64748b; margin-top: 6px; }
// `;

// // ─────────────────────────────────────────
// // CONSTANTS
// // ─────────────────────────────────────────
// const API_BASE = import.meta.env.VITE_API_URL || 'https://userside-x164.onrender.com/api';
// const PER_PAGE = 8;

// // ─────────────────────────────────────────
// // TOAST HELPER
// // ─────────────────────────────────────────
// let toastId = 0;

// // ─────────────────────────────────────────
// // MAIN COMPONENT
// // ─────────────────────────────────────────
// export default function Categories() {
//   const [categories, setCategories]   = useState([]);
//   const [loading, setLoading]         = useState(true);
//   const [search, setSearch]           = useState('');
//   const [filter, setFilter]           = useState('all');
//   const [page, setPage]               = useState(1);
//   const [toasts, setToasts]           = useState([]);

//   // Modal states
//   const [showForm, setShowForm]       = useState(false);
//   const [editData, setEditData]       = useState(null);
//   const [deleteTarget, setDeleteTarget] = useState(null);

//   // Form states
//   const [formTitle, setFormTitle]     = useState('');
//   const [formIsFree, setFormIsFree]   = useState(false);
//   const [formImageUrl, setFormImageUrl] = useState('');
//   const [formFile, setFormFile]       = useState(null);
//   const [previewUrl, setPreviewUrl]   = useState('');
//   const [formLoading, setFormLoading] = useState(false);

//   const fileRef = useRef();

//   // ── FETCH ──
//   const fetchCategories = async () => {
//     setLoading(true);
//     try {
//       const res = await axios.get(`${API_BASE}/categories`);
//       setCategories(res.data.data || []);
//     } catch {
//       showToast('Failed to load categories', 'error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => { fetchCategories(); }, []);

//   // ── TOAST ──
//   const showToast = (msg, type = 'success') => {
//     const id = ++toastId;
//     setToasts(p => [...p, { id, msg, type }]);
//     setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3000);
//   };

//   // ── FILTER / SEARCH / PAGINATE ──
//   const filtered = categories.filter(c => {
//     const matchSearch = (c.title || '').toLowerCase().includes(search.toLowerCase());
//     const matchFilter =
//       filter === 'all'      ? true :
//       filter === 'active'   ? c.isActive :
//       filter === 'inactive' ? !c.isActive :
//       filter === 'free'     ? c.isFree :
//       filter === 'paid'     ? !c.isFree : true;
//     return matchSearch && matchFilter;
//   });

//   const totalPages = Math.ceil(filtered.length / PER_PAGE);
//   const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

//   // ── OPEN FORM ──
//   const openCreate = () => {
//     setEditData(null);
//     setFormTitle(''); setFormIsFree(false);
//     setFormImageUrl(''); setFormFile(null); setPreviewUrl('');
//     setShowForm(true);
//   };

//   const openEdit = (cat) => {
//     setEditData(cat);
//     setFormTitle(cat.title);
//     setFormIsFree(cat.isFree);
//     setFormImageUrl(cat.image?.url || '');
//     setFormFile(null);
//     setPreviewUrl(cat.image?.url || '');
//     setShowForm(true);
//   };

//   // ── FILE PICK ──
//   const handleFilePick = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
//     setFormFile(file);
//     setPreviewUrl(URL.createObjectURL(file));
//   };

//   // ── SUBMIT ──
//   const handleSubmit = async () => {
//     if (!formTitle.trim()) { showToast('Title is required', 'error'); return; }
//     setFormLoading(true);
//     try {
//       const fd = new FormData();
//       fd.append('title', formTitle.trim());
//       fd.append('isFree', formIsFree);
//       if (formFile)            fd.append('image', formFile);
//       else if (formImageUrl)   fd.append('image', formImageUrl);

//       if (editData) {
//         await axios.put(`${API_BASE}/categories/${editData._id}`, fd);
//         showToast('Category updated ✓');
//       } else {
//         await axios.post(`${API_BASE}/categories`, fd);
//         showToast('Category created ✓');
//       }

//       setShowForm(false);
//       fetchCategories();
//     } catch (err) {
//       showToast(err?.response?.data?.message || 'Something went wrong', 'error');
//     } finally {
//       setFormLoading(false);
//     }
//   };

//   // ── TOGGLE STATUS ──
//   const handleToggle = async (cat) => {
//     try {
//       await axios.patch(`${API_BASE}/categories/toggle/${cat._id}`);
//       setCategories(prev =>
//         prev.map(c => c._id === cat._id ? { ...c, isActive: !c.isActive } : c)
//       );
//       showToast(`Category ${cat.isActive ? 'deactivated' : 'activated'}`);
//     } catch {
//       showToast('Toggle failed', 'error');
//     }
//   };

//   // ── DELETE ──
//   const handleDelete = async () => {
//     try {
//       await axios.delete(`${API_BASE}/categories/${deleteTarget._id}`);
//       showToast('Category deleted');
//       setDeleteTarget(null);
//       fetchCategories();
//     } catch {
//       showToast('Delete failed', 'error');
//     }
//   };

//   // ── STATS ──
//   const total    = categories.length;
//   const active   = categories.filter(c => c.isActive).length;
//   const inactive = categories.filter(c => !c.isActive).length;
//   const free     = categories.filter(c => c.isFree).length;

//   // ─────────────────────────────────────────
//   // RENDER
//   // ─────────────────────────────────────────
//   return (
//     <>
//       <style>{styles}</style>
//       <div className="cat-root">

//         {/* HEADER */}
//         <div className="cat-header">
//           <div>
//             <div className="cat-title">Categories</div>
//             <div className="cat-subtitle">Manage all content categories</div>
//           </div>
//           <button className="btn-primary" onClick={openCreate}>
//             <span style={{ fontSize: '18px', lineHeight: 1 }}>+</span> Add Category
//           </button>
//         </div>

//         {/* STATS */}
//         <div className="cat-stats">
//           <span className="stat-pill pill-total">📦 {total} Total</span>
//           <span className="stat-pill pill-active">✅ {active} Active</span>
//           <span className="stat-pill pill-inactive">❌ {inactive} Inactive</span>
//           <span className="stat-pill pill-free">🆓 {free} Free</span>
//         </div>

//         {/* TOOLBAR */}
//         <div className="cat-toolbar">
//           <div className="cat-search-wrap">
//             <span className="cat-search-icon">🔍</span>
//             <input
//               className="cat-search"
//               placeholder="Search categories…"
//               value={search}
//               onChange={e => { setSearch(e.target.value); setPage(1); }}
//             />
//           </div>
//           <select
//             className="cat-filter-select"
//             value={filter}
//             onChange={e => { setFilter(e.target.value); setPage(1); }}
//           >
//             <option value="all">All</option>
//             <option value="active">Active</option>
//             <option value="inactive">Inactive</option>
//             <option value="free">Free</option>
//             <option value="paid">Paid</option>
//           </select>
//         </div>

//         {/* TABLE */}
//         <div className="cat-table-card">
//           {loading ? (
//             <div className="cat-loading">
//               <div className="spinner" />
//               Loading categories…
//             </div>
//           ) : paginated.length === 0 ? (
//             <div className="cat-empty">
//               <div className="cat-empty-icon">📂</div>
//               <div className="cat-empty-title">No categories found</div>
//               <div className="cat-empty-sub">Try adjusting your search or filter</div>
//             </div>
//           ) : (
//             <>
//               <table className="cat-table">
//                 <thead>
//                   <tr>
//                     <th>#</th>
//                     <th>Category</th>
//                     <th>Type</th>
//                     <th>Status</th>
//                     <th>Toggle</th>
//                     <th>Created</th>
//                     <th>Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {paginated.map((cat, idx) => (
//                     <tr key={cat._id}>
//                       <td style={{ color: '#94a3b8', fontSize: '12px' }}>
//                         {(page - 1) * PER_PAGE + idx + 1}
//                       </td>

//                       {/* NAME + IMAGE */}
//                       <td>
//                         <div className="cat-name-cell">
//                           <div className="cat-img-wrap">
//                             {cat.image?.url
//                               ? <img src={cat.image.url} alt={cat.title} onError={e => e.target.style.display='none'} />
//                               : <span className="cat-img-placeholder">🖼️</span>
//                             }
//                           </div>
//                           <div>
//                             <div className="cat-name-text">{cat.title}</div>
//                             {cat.slug && <div className="cat-slug-text">{cat.slug}</div>}
//                           </div>
//                         </div>
//                       </td>

//                       {/* TYPE */}
//                       <td>
//                         <span className={`badge ${cat.isFree ? 'badge-free' : 'badge-paid'}`}>
//                           {cat.isFree ? '🆓 Free' : '💰 Paid'}
//                         </span>
//                       </td>

//                       {/* STATUS */}
//                       <td>
//                         <span className={`badge ${cat.isActive ? 'badge-active' : 'badge-inactive'}`}>
//                           {cat.isActive ? '● Active' : '● Inactive'}
//                         </span>
//                       </td>

//                       {/* TOGGLE */}
//                       <td>
//                         <label className="toggle">
//                           <input
//                             type="checkbox"
//                             checked={cat.isActive}
//                             onChange={() => handleToggle(cat)}
//                           />
//                           <div className="toggle-track" />
//                           <div className="toggle-thumb" />
//                         </label>
//                       </td>

//                       {/* DATE */}
//                       <td style={{ fontSize: '12px', color: '#64748b' }}>
//                         {new Date(cat.createdAt).toLocaleDateString('en-IN', {
//                           day: '2-digit', month: 'short', year: 'numeric'
//                         })}
//                       </td>

//                       {/* ACTIONS */}
//                       <td>
//                         <div className="action-btns">
//                           <button
//                             className="btn-icon btn-icon-edit"
//                             title="Edit"
//                             onClick={() => openEdit(cat)}
//                           >✏️</button>
//                           <button
//                             className="btn-icon btn-icon-delete"
//                             title="Delete"
//                             onClick={() => setDeleteTarget(cat)}
//                           >🗑️</button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>

//               {/* PAGINATION */}
//               {totalPages > 1 && (
//                 <div className="cat-pagination">
//                   <span>Showing {(page-1)*PER_PAGE+1}–{Math.min(page*PER_PAGE, filtered.length)} of {filtered.length}</span>
//                   <div className="pag-btns">
//                     <button className="pag-btn" disabled={page === 1} onClick={() => setPage(p => p-1)}>← Prev</button>
//                     <button className="pag-btn" disabled={page === totalPages} onClick={() => setPage(p => p+1)}>Next →</button>
//                   </div>
//                 </div>
//               )}
//             </>
//           )}
//         </div>

//         {/* ───────── CREATE / EDIT MODAL ───────── */}
//         {showForm && (
//           <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowForm(false)}>
//             <div className="modal-box">
//               <div className="modal-header">
//                 <div>
//                   <div className="modal-title">{editData ? 'Edit Category' : 'Add New Category'}</div>
//                   <div className="modal-sub">{editData ? `Editing: ${editData.title}` : 'Fill in the details below'}</div>
//                 </div>
//                 <button className="modal-close" onClick={() => setShowForm(false)}>✕</button>
//               </div>

//               <div className="modal-body">
//                 {/* TITLE */}
//                 <div className="form-group">
//                   <label className="form-label">Category Title *</label>
//                   <input
//                     className="form-input"
//                     placeholder="e.g. Mathematics"
//                     value={formTitle}
//                     onChange={e => setFormTitle(e.target.value)}
//                   />
//                 </div>

//                 {/* IMAGE UPLOAD */}
//                 <div className="form-group">
//                   <label className="form-label">Category Image</label>
//                   <div className="upload-area">
//                     <input
//                       type="file"
//                       accept="image/*"
//                       ref={fileRef}
//                       onChange={handleFilePick}
//                     />
//                     {previewUrl ? (
//                       <>
//                         <div className="upload-preview">
//                           <img src={previewUrl} alt="preview" />
//                           <button
//                             className="upload-preview-remove"
//                             onClick={e => {
//                               e.stopPropagation();
//                               setFormFile(null); setPreviewUrl(''); setFormImageUrl('');
//                             }}
//                           >✕</button>
//                         </div>
//                         <div className="upload-text">Click to change image</div>
//                       </>
//                     ) : (
//                       <>
//                         <div className="upload-icon">📷</div>
//                         <div className="upload-text">Click to upload image</div>
//                         <div className="upload-hint">PNG, JPG up to 5MB</div>
//                       </>
//                     )}
//                   </div>
//                 </div>

//                 {/* OR IMAGE URL */}
//                 {!formFile && (
//                   <div className="form-group">
//                     <label className="form-label">Or paste image URL</label>
//                     <input
//                       className="form-input"
//                       placeholder="https://example.com/image.jpg"
//                       value={formImageUrl}
//                       onChange={e => {
//                         setFormImageUrl(e.target.value);
//                         setPreviewUrl(e.target.value);
//                       }}
//                     />
//                   </div>
//                 )}

//                 {/* FREE / PAID */}
//                 <div className="form-group">
//                   <label className="form-label">Access Type</label>
//                   <label className="check-row">
//                     <input
//                       type="checkbox"
//                       checked={formIsFree}
//                       onChange={e => setFormIsFree(e.target.checked)}
//                     />
//                     <div>
//                       <div className="check-row-label">Free Category</div>
//                       <div className="check-row-hint">Users can access without subscription</div>
//                     </div>
//                   </label>
//                 </div>

//                 {/* FOOTER */}
//                 <div className="modal-footer">
//                   <button className="btn-ghost" onClick={() => setShowForm(false)}>Cancel</button>
//                   <button
//                     className="btn-primary"
//                     onClick={handleSubmit}
//                     disabled={formLoading}
//                     style={{ opacity: formLoading ? 0.7 : 1 }}
//                   >
//                     {formLoading ? '⏳ Saving…' : editData ? '✓ Update Category' : '+ Create Category'}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* ───────── DELETE CONFIRM MODAL ───────── */}
//         {deleteTarget && (
//           <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setDeleteTarget(null)}>
//             <div className="modal-box">
//               <div className="modal-body" style={{ paddingTop: '28px' }}>
//                 <div className="delete-confirm-icon">🗑️</div>
//                 <div className="delete-confirm-text">
//                   <div className="delete-confirm-title">Delete "{deleteTarget.title}"?</div>
//                   <div className="delete-confirm-sub">
//                     This will permanently delete the category and its image.<br />This action cannot be undone.
//                   </div>
//                 </div>
//                 <div className="modal-footer" style={{ marginTop: '20px' }}>
//                   <button className="btn-ghost" onClick={() => setDeleteTarget(null)}>Cancel</button>
//                   <button className="btn-danger" onClick={handleDelete}>Yes, Delete</button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* ───────── TOASTS ───────── */}
//         <div className="toast-wrap">
//           {toasts.map(t => (
//             <div key={t.id} className={`toast toast-${t.type}`}>
//               {t.type === 'success' ? '✅' : '❌'} {t.msg}
//             </div>
//           ))}
//         </div>

//       </div>
//     </>
//   );
// }

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

// ─────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&display=swap');

  .cat-root {
    font-family: 'Sora', sans-serif;
    background: #f4f6fa;
    min-height: 100vh;
    padding: 28px 32px;
    -webkit-font-smoothing: antialiased;
  }

  /* ── HEADER ── */
  .cat-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 28px;
    animation: fadeUp 0.35s ease both;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .cat-title {
    font-size: 22px;
    font-weight: 700;
    color: #0f1623;
    letter-spacing: -0.5px;
  }

  .cat-subtitle {
    font-size: 12px;
    color: #94a3b8;
    margin-top: 3px;
  }

  .btn-primary {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    background: #2563eb;
    color: white;
    border: none;
    border-radius: 10px;
    padding: 10px 18px;
    font-size: 13px;
    font-weight: 600;
    font-family: 'Sora', sans-serif;
    cursor: pointer;
    transition: background 0.15s, transform 0.1s;
  }

  .btn-primary:hover { background: #1d4ed8; }
  .btn-primary:active { transform: scale(0.97); }

  /* ── SEARCH / FILTER BAR ── */
  .cat-toolbar {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 20px;
    animation: fadeUp 0.35s ease 0.05s both;
  }

  .cat-search-wrap {
    position: relative;
    flex: 1;
    max-width: 340px;
  }

  .cat-search-icon {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: #94a3b8;
    pointer-events: none;
  }

  .cat-search {
    width: 100%;
    padding: 9px 12px 9px 36px;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    font-family: 'Sora', sans-serif;
    font-size: 13px;
    color: #0f1623;
    background: #fff;
    outline: none;
    transition: border-color 0.15s;
  }

  .cat-search:focus { border-color: #2563eb; }

  .cat-filter-select {
    padding: 9px 14px;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    font-family: 'Sora', sans-serif;
    font-size: 13px;
    color: #334155;
    background: #fff;
    outline: none;
    cursor: pointer;
  }

  /* ── STATS PILLS ── */
  .cat-stats {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
    animation: fadeUp 0.35s ease 0.08s both;
    flex-wrap: wrap;
  }

  .stat-pill {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 14px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    border: 1px solid;
  }

  .pill-total  { background: #eff4ff; color: #2563eb; border-color: #bfdbfe; }
  .pill-active { background: #f0fdf4; color: #16a34a; border-color: #bbf7d0; }
  .pill-inactive { background: #fef2f2; color: #dc2626; border-color: #fecaca; }
  .pill-free   { background: #faf5ff; color: #7c3aed; border-color: #ddd6fe; }

  /* ── TABLE CARD ── */
  .cat-table-card {
    background: #fff;
    border: 1px solid #e8edf3;
    border-radius: 14px;
    overflow: hidden;
    animation: fadeUp 0.35s ease 0.1s both;
  }

  .cat-table {
    width: 100%;
    border-collapse: collapse;
  }

  .cat-table thead tr {
    background: #f8fafc;
    border-bottom: 1px solid #e8edf3;
  }

  .cat-table th {
    padding: 12px 16px;
    text-align: left;
    font-size: 10px;
    font-weight: 700;
    color: #94a3b8;
    text-transform: uppercase;
    letter-spacing: 0.6px;
  }

  .cat-table td {
    padding: 14px 16px;
    font-size: 13px;
    color: #334155;
    border-bottom: 1px solid #f1f5f9;
    vertical-align: middle;
  }

  .cat-table tbody tr:last-child td { border-bottom: none; }

  .cat-table tbody tr {
    transition: background 0.12s;
  }

  .cat-table tbody tr:hover { background: #fafbff; }

  /* ── CATEGORY IMAGE ── */
  .cat-img-wrap {
    width: 40px;
    height: 40px;
    border-radius: 9px;
    overflow: hidden;
    border: 1px solid #e2e8f0;
    background: #f8fafc;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .cat-img-wrap img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .cat-img-placeholder {
    font-size: 16px;
  }

  .cat-name-cell {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .cat-name-text {
    font-size: 13px;
    font-weight: 600;
    color: #0f1623;
  }

  .cat-slug-text {
    font-size: 10px;
    color: #94a3b8;
    font-family: monospace;
    margin-top: 2px;
  }

  /* ── BADGES ── */
  .badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 3px 10px;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 600;
  }

  .badge-active   { background: #f0fdf4; color: #16a34a; }
  .badge-inactive { background: #fef2f2; color: #dc2626; }
  .badge-free     { background: #faf5ff; color: #7c3aed; }
  .badge-paid     { background: #fffbeb; color: #d97706; }

  /* ── TOGGLE SWITCH ── */
  .toggle-wrap { display: flex; align-items: center; gap: 8px; }

  .toggle {
    position: relative;
    width: 36px;
    height: 20px;
    cursor: pointer;
  }

  .toggle input { opacity: 0; width: 0; height: 0; }

  .toggle-track {
    position: absolute;
    inset: 0;
    background: #cbd5e1;
    border-radius: 20px;
    transition: background 0.2s;
  }

  .toggle input:checked + .toggle-track { background: #2563eb; }

  .toggle-thumb {
    position: absolute;
    top: 3px;
    left: 3px;
    width: 14px;
    height: 14px;
    background: white;
    border-radius: 50%;
    transition: transform 0.2s;
    box-shadow: 0 1px 3px rgba(0,0,0,0.2);
  }

  .toggle input:checked ~ .toggle-thumb { transform: translateX(16px); }

  /* ── ACTION BUTTONS ── */
  .action-btns { display: flex; align-items: center; gap: 6px; }

  .btn-icon {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
    background: #fff;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.15s;
    font-size: 14px;
  }

  .btn-icon:hover { transform: translateY(-1px); }
  .btn-icon-edit:hover  { background: #eff4ff; border-color: #bfdbfe; }
  .btn-icon-delete:hover { background: #fef2f2; border-color: #fecaca; }
  .btn-icon-symptom:hover { background: #f0fdf4; border-color: #bbf7d0; }

  /* ── EMPTY STATE ── */
  .cat-empty {
    text-align: center;
    padding: 60px 20px;
    color: #94a3b8;
  }

  .cat-empty-icon { font-size: 40px; margin-bottom: 12px; }
  .cat-empty-title { font-size: 15px; font-weight: 600; color: #475569; margin-bottom: 6px; }
  .cat-empty-sub { font-size: 12px; }

  /* ── LOADING ── */
  .cat-loading {
    text-align: center;
    padding: 60px 20px;
    color: #94a3b8;
    font-size: 13px;
  }

  .spinner {
    width: 32px;
    height: 32px;
    border: 3px solid #e2e8f0;
    border-top-color: #2563eb;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
    margin: 0 auto 14px;
  }

  @keyframes spin { to { transform: rotate(360deg); } }

  /* ── MODAL OVERLAY ── */
  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(15,22,35,0.55);
    backdrop-filter: blur(3px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    animation: fadeOverlay 0.2s ease;
  }

  @keyframes fadeOverlay { from { opacity: 0; } to { opacity: 1; } }

  .modal-box {
    background: #fff;
    border-radius: 16px;
    width: 560px;
    max-width: 95vw;
    max-height: 85vh;
    overflow-y: auto;
    box-shadow: 0 24px 60px rgba(0,0,0,0.18);
    animation: slideUp 0.25s ease;
  }

  @keyframes slideUp {
    from { opacity: 0; transform: translateY(16px) scale(0.98); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }

  .modal-header {
    padding: 20px 24px 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: sticky;
    top: 0;
    background: white;
    z-index: 1;
  }

  .modal-title { font-size: 18px; font-weight: 700; color: #0f1623; letter-spacing: -0.3px; }
  .modal-sub   { font-size: 12px; color: #94a3b8; margin-top: 3px; }

  .modal-close {
    width: 30px;
    height: 30px;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
    background: #fff;
    cursor: pointer;
    font-size: 16px;
    color: #64748b;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.15s;
  }

  .modal-close:hover { background: #f8fafc; }

  .modal-body { padding: 20px 24px 24px; }

  /* ── FORM ── */
  .form-group { margin-bottom: 16px; }

  .form-label {
    display: block;
    font-size: 12px;
    font-weight: 600;
    color: #475569;
    margin-bottom: 6px;
  }

  .form-input {
    width: 100%;
    padding: 10px 12px;
    border: 1px solid #e2e8f0;
    border-radius: 9px;
    font-family: 'Sora', sans-serif;
    font-size: 13px;
    color: #0f1623;
    background: #fff;
    outline: none;
    transition: border-color 0.15s, box-shadow 0.15s;
  }

  .form-input:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37,99,235,0.1);
  }

  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }

  /* ── IMAGE UPLOAD AREA ── */
  .upload-area {
    border: 2px dashed #e2e8f0;
    border-radius: 10px;
    padding: 20px;
    text-align: center;
    cursor: pointer;
    transition: border-color 0.15s, background 0.15s;
    position: relative;
  }

  .upload-area:hover {
    border-color: #2563eb;
    background: #f8faff;
  }

  .upload-area input[type="file"] {
    position: absolute;
    inset: 0;
    opacity: 0;
    cursor: pointer;
    width: 100%;
    height: 100%;
  }

  .upload-icon { font-size: 24px; margin-bottom: 6px; }
  .upload-text { font-size: 12px; color: #64748b; }
  .upload-hint { font-size: 10px; color: #94a3b8; margin-top: 3px; }

  .upload-preview {
    position: relative;
    width: 80px;
    height: 80px;
    margin: 0 auto 8px;
    border-radius: 9px;
    overflow: hidden;
    border: 1px solid #e2e8f0;
  }

  .upload-preview img { width: 100%; height: 100%; object-fit: cover; }

  .upload-preview-remove {
    position: absolute;
    top: 4px;
    right: 4px;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: rgba(0,0,0,0.55);
    color: white;
    border: none;
    cursor: pointer;
    font-size: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* ── TOGGLE CHECKBOX ── */
  .check-row {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 12px;
    border: 1px solid #e2e8f0;
    border-radius: 9px;
    cursor: pointer;
    transition: border-color 0.15s;
  }

  .check-row:hover { border-color: #2563eb; }

  .check-row input { accent-color: #2563eb; width: 15px; height: 15px; cursor: pointer; }

  .check-row-label { font-size: 13px; color: #334155; font-weight: 500; }
  .check-row-hint  { font-size: 11px; color: #94a3b8; }

  /* ── MODAL FOOTER ── */
  .modal-footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 10px;
    padding-top: 16px;
    border-top: 1px solid #f1f5f9;
    margin-top: 4px;
  }

  .btn-ghost {
    padding: 9px 18px;
    border: 1px solid #e2e8f0;
    border-radius: 9px;
    background: #fff;
    font-family: 'Sora', sans-serif;
    font-size: 13px;
    font-weight: 500;
    color: #475569;
    cursor: pointer;
    transition: background 0.15s;
  }

  .btn-ghost:hover { background: #f8fafc; }

  .btn-danger {
    padding: 9px 18px;
    border: none;
    border-radius: 9px;
    background: #dc2626;
    font-family: 'Sora', sans-serif;
    font-size: 13px;
    font-weight: 600;
    color: white;
    cursor: pointer;
    transition: background 0.15s;
  }

  .btn-danger:hover { background: #b91c1c; }

  /* ── TOAST ── */
  .toast-wrap {
    position: fixed;
    bottom: 24px;
    right: 24px;
    z-index: 2000;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .toast {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 18px;
    border-radius: 10px;
    font-size: 13px;
    font-weight: 500;
    box-shadow: 0 8px 24px rgba(0,0,0,0.12);
    animation: toastIn 0.25s ease;
    min-width: 260px;
  }

  @keyframes toastIn {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .toast-success { background: #0f1623; color: #fff; }
  .toast-error   { background: #dc2626; color: #fff; }

  /* ── PAGINATION ── */
  .cat-pagination {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 16px;
    border-top: 1px solid #f1f5f9;
    font-size: 12px;
    color: #64748b;
  }

  .pag-btns { display: flex; gap: 6px; }

  .pag-btn {
    padding: 5px 12px;
    border: 1px solid #e2e8f0;
    border-radius: 7px;
    background: #fff;
    font-family: 'Sora', sans-serif;
    font-size: 12px;
    color: #475569;
    cursor: pointer;
    transition: background 0.12s;
  }

  .pag-btn:disabled { opacity: 0.4; cursor: not-allowed; }
  .pag-btn:not(:disabled):hover { background: #f1f5f9; }

  /* ── DELETE CONFIRM ── */
  .delete-confirm-icon {
    width: 52px;
    height: 52px;
    border-radius: 50%;
    background: #fef2f2;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
    margin: 0 auto 14px;
  }

  .delete-confirm-text {
    text-align: center;
    margin-bottom: 4px;
  }

  .delete-confirm-title { font-size: 15px; font-weight: 700; color: #0f1623; }
  .delete-confirm-sub   { font-size: 12px; color: #64748b; margin-top: 6px; }

  /* ── SYMPTOMS LIST INSIDE MODAL ── */
  .symptoms-list {
    max-height: 300px;
    overflow-y: auto;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    margin-top: 8px;
  }

  .symptom-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 12px;
    border-bottom: 1px solid #f1f5f9;
  }

  .symptom-item:last-child {
    border-bottom: none;
  }

  .symptom-info {
    display: flex;
    align-items: center;
    gap: 10px;
    flex: 1;
  }

  .symptom-img {
    width: 32px;
    height: 32px;
    border-radius: 6px;
    object-fit: cover;
  }

  .symptom-name {
    font-size: 13px;
    font-weight: 500;
    color: #1e293b;
  }

  .btn-sm {
    padding: 4px 10px;
    font-size: 11px;
    border-radius: 6px;
    border: none;
    cursor: pointer;
    font-weight: 500;
  }

  .btn-sm-danger {
    background: #fee2e2;
    color: #dc2626;
  }

  .btn-sm-danger:hover {
    background: #fecaca;
  }

  .btn-sm-primary {
    background: #2563eb;
    color: white;
  }

  .btn-sm-primary:hover {
    background: #1d4ed8;
  }

  .add-symptom-btn-small {
    width: 100%;
    margin-top: 12px;
    padding: 10px;
    border: 2px dashed #cbd5e1;
    background: #f8fafc;
    border-radius: 10px;
    cursor: pointer;
    font-size: 12px;
    font-weight: 500;
    color: #2563eb;
    transition: all 0.2s;
  }

  .add-symptom-btn-small:hover {
    background: #eff6ff;
    border-color: #2563eb;
  }
`;

// ─────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────
const API_BASE = import.meta.env.VITE_API_URL || 'https://userside-x164.onrender.com/api';
const PER_PAGE = 8;

// ─────────────────────────────────────────
// TOAST HELPER
// ─────────────────────────────────────────
let toastId = 0;

// ─────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────
export default function Categories() {
  const [categories, setCategories]   = useState([]);
  const [loading, setLoading]         = useState(true);
  const [search, setSearch]           = useState('');
  const [filter, setFilter]           = useState('all');
  const [page, setPage]               = useState(1);
  const [toasts, setToasts]           = useState([]);
  const [doctors, setDoctors]         = useState([]);

  // Modal states
  const [showForm, setShowForm]       = useState(false);
  const [editData, setEditData]       = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  
  // Symptom modal states
  const [showSymptomsModal, setShowSymptomsModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categorySymptoms, setCategorySymptoms] = useState([]);
  const [showSymptomForm, setShowSymptomForm] = useState(false);
  const [symptomFormData, setSymptomFormData] = useState({
    name: '',
    color: '#3b82f6',
    doctors: []
  });
  const [symptomImageFile, setSymptomImageFile] = useState(null);
  const [symptomImagePreview, setSymptomImagePreview] = useState(null);
  const [symptomSubmitting, setSymptomSubmitting] = useState(false);
  const [editingSymptom, setEditingSymptom] = useState(null);

  // Form states for category
  const [formTitle, setFormTitle]     = useState('');
  const [formIsFree, setFormIsFree]   = useState(false);
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formFile, setFormFile]       = useState(null);
  const [previewUrl, setPreviewUrl]   = useState('');
  const [formLoading, setFormLoading] = useState(false);

  const fileRef = useRef();

  // ── FETCH CATEGORIES ──
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/categories`);
      setCategories(res.data.data || []);
    } catch {
      showToast('Failed to load categories', 'error');
    } finally {
      setLoading(false);
    }
  };

  // ── FETCH DOCTORS ──
  const fetchDoctors = async () => {
    try {
      const res = await axios.get(`${API_BASE}/doctors`);
      setDoctors(res.data.data || []);
    } catch {
      console.error('Failed to load doctors');
    }
  };

  useEffect(() => { 
    fetchCategories(); 
    fetchDoctors();
  }, []);

  // ── FETCH SYMPTOMS FOR CATEGORY ──
  const fetchSymptomsForCategory = async (categoryId) => {
    try {
      const res = await axios.get(`${API_BASE}/symptoms/category/${categoryId}`);
      setCategorySymptoms(res.data.data || []);
    } catch {
      setCategorySymptoms([]);
    }
  };

  // ── TOAST ──
  const showToast = (msg, type = 'success') => {
    const id = ++toastId;
    setToasts(p => [...p, { id, msg, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3000);
  };

  // ── FILTER / SEARCH / PAGINATE ──
  const filtered = categories.filter(c => {
    const matchSearch = (c.title || '').toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === 'all'      ? true :
      filter === 'active'   ? c.isActive :
      filter === 'inactive' ? !c.isActive :
      filter === 'free'     ? c.isFree :
      filter === 'paid'     ? !c.isFree : true;
    return matchSearch && matchFilter;
  });

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  // ── OPEN CATEGORY FORM ──
  const openCreate = () => {
    setEditData(null);
    setFormTitle(''); setFormIsFree(false);
    setFormImageUrl(''); setFormFile(null); setPreviewUrl('');
    setShowForm(true);
  };

  const openEdit = (cat) => {
    setEditData(cat);
    setFormTitle(cat.title);
    setFormIsFree(cat.isFree);
    setFormImageUrl(cat.image?.url || '');
    setFormFile(null);
    setPreviewUrl(cat.image?.url || '');
    setShowForm(true);
  };

  // ── OPEN SYMPTOMS MODAL ──
  const openSymptomsModal = async (category) => {
    setSelectedCategory(category);
    await fetchSymptomsForCategory(category._id);
    setShowSymptomsModal(true);
  };

  // ── OPEN ADD SYMPTOM FORM ──
  const openAddSymptom = () => {
    setEditingSymptom(null);
    setSymptomFormData({
      name: '',
      color: '#3b82f6',
      doctors: []
    });
    setSymptomImageFile(null);
    setSymptomImagePreview(null);
    setShowSymptomForm(true);
  };

  const openEditSymptom = (symptom) => {
    setEditingSymptom(symptom);
    setSymptomFormData({
      name: symptom.name,
      color: symptom.color || '#3b82f6',
      doctors: symptom.doctors?.map(d => d._id || d) || []
    });
    setSymptomImagePreview(symptom.image?.url);
    setSymptomImageFile(null);
    setShowSymptomForm(true);
  };

  // ── HANDLE SYMPTOM IMAGE ──
  const handleSymptomImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      showToast('Please upload a valid image file', 'error');
      return;
    }
    
    if (file.size > 2 * 1024 * 1024) {
      showToast('Image size should be less than 2MB', 'error');
      return;
    }
    
    setSymptomImageFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setSymptomImagePreview(e.target.result);
    reader.readAsDataURL(file);
  };

  // ── SUBMIT SYMPTOM ──
  const handleSubmitSymptom = async (e) => {
    e.preventDefault();
    
    if (!symptomFormData.name.trim()) {
      showToast('Symptom name is required', 'error');
      return;
    }

    if (!symptomImageFile && !editingSymptom) {
      showToast('Please select an image for the symptom', 'error');
      return;
    }

    setSymptomSubmitting(true);

    const submitData = new FormData();
    submitData.append('name', symptomFormData.name);
    submitData.append('color', symptomFormData.color);
    submitData.append('categoryId', selectedCategory._id);
    symptomFormData.doctors.forEach(doctorId => {
      submitData.append('doctors', doctorId);
    });
    
    if (symptomImageFile) {
      submitData.append('image', symptomImageFile);
    }

    try {
      if (editingSymptom) {
        await axios.put(`${API_BASE}/symptoms/${editingSymptom._id}`, submitData);
        showToast('Symptom updated successfully!');
      } else {
        await axios.post(`${API_BASE}/symptoms`, submitData);
        showToast('Symptom created successfully!');
      }
      
      setShowSymptomForm(false);
      await fetchSymptomsForCategory(selectedCategory._id);
      fetchCategories();
    } catch (err) {
      showToast(err?.response?.data?.message || 'Failed to save symptom', 'error');
    } finally {
      setSymptomSubmitting(false);
    }
  };

  // ── DELETE SYMPTOM ──
  const handleDeleteSymptom = async (symptomId) => {
    if (!window.confirm('Are you sure you want to delete this symptom?')) return;
    
    try {
      await axios.delete(`${API_BASE}/symptoms/${symptomId}`);
      showToast('Symptom deleted successfully');
      await fetchSymptomsForCategory(selectedCategory._id);
      fetchCategories();
    } catch (err) {
      showToast('Failed to delete symptom', 'error');
    }
  };

  // ── HANDLE DOCTOR SELECTION ──
  const handleDoctorChange = (e) => {
    const options = e.target.options;
    const selectedValues = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selectedValues.push(options[i].value);
      }
    }
    setSymptomFormData({ ...symptomFormData, doctors: selectedValues });
  };

  // ── FILE PICK FOR CATEGORY ──
  const handleFilePick = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFormFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  // ── SUBMIT CATEGORY ──
  const handleSubmitCategory = async () => {
    if (!formTitle.trim()) { showToast('Title is required', 'error'); return; }
    setFormLoading(true);
    try {
      const fd = new FormData();
      fd.append('title', formTitle.trim());
      fd.append('isFree', formIsFree);
      if (formFile)            fd.append('image', formFile);
      else if (formImageUrl)   fd.append('image', formImageUrl);

      if (editData) {
        await axios.put(`${API_BASE}/categories/${editData._id}`, fd);
        showToast('Category updated ✓');
      } else {
        await axios.post(`${API_BASE}/categories`, fd);
        showToast('Category created ✓');
      }

      setShowForm(false);
      fetchCategories();
    } catch (err) {
      showToast(err?.response?.data?.message || 'Something went wrong', 'error');
    } finally {
      setFormLoading(false);
    }
  };

  // ── TOGGLE CATEGORY STATUS ──
  const handleToggleCategory = async (cat) => {
    try {
      await axios.patch(`${API_BASE}/categories/toggle/${cat._id}`);
      setCategories(prev =>
        prev.map(c => c._id === cat._id ? { ...c, isActive: !c.isActive } : c)
      );
      showToast(`Category ${cat.isActive ? 'deactivated' : 'activated'}`);
    } catch {
      showToast('Toggle failed', 'error');
    }
  };

  // ── DELETE CATEGORY ──
  const handleDeleteCategory = async () => {
    try {
      await axios.delete(`${API_BASE}/categories/${deleteTarget._id}`);
      showToast('Category deleted');
      setDeleteTarget(null);
      fetchCategories();
    } catch {
      showToast('Delete failed', 'error');
    }
  };

  // ── STATS ──
  const total    = categories.length;
  const active   = categories.filter(c => c.isActive).length;
  const inactive = categories.filter(c => !c.isActive).length;
  const free     = categories.filter(c => c.isFree).length;

  const colorPresets = [
    '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', 
    '#ec4899', '#06b6d4', '#84cc16', '#f97316', '#6366f1'
  ];

  // ─────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────
  return (
    <>
      <style>{styles}</style>
      <div className="cat-root">

        {/* HEADER */}
        <div className="cat-header">
          <div>
            <div className="cat-title">Categories</div>
            <div className="cat-subtitle">Manage all content categories and their symptoms</div>
          </div>
          <button className="btn-primary" onClick={openCreate}>
            <span style={{ fontSize: '18px', lineHeight: 1 }}>+</span> Add Category
          </button>
        </div>

        {/* STATS */}
        <div className="cat-stats">
          <span className="stat-pill pill-total">📦 {total} Total</span>
          <span className="stat-pill pill-active">✅ {active} Active</span>
          <span className="stat-pill pill-inactive">❌ {inactive} Inactive</span>
          <span className="stat-pill pill-free">🆓 {free} Free</span>
        </div>

        {/* TOOLBAR */}
        <div className="cat-toolbar">
          <div className="cat-search-wrap">
            <span className="cat-search-icon">🔍</span>
            <input
              className="cat-search"
              placeholder="Search categories…"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
          <select
            className="cat-filter-select"
            value={filter}
            onChange={e => { setFilter(e.target.value); setPage(1); }}
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="free">Free</option>
            <option value="paid">Paid</option>
          </select>
        </div>

        {/* TABLE */}
        <div className="cat-table-card">
          {loading ? (
            <div className="cat-loading">
              <div className="spinner" />
              Loading categories…
            </div>
          ) : paginated.length === 0 ? (
            <div className="cat-empty">
              <div className="cat-empty-icon">📂</div>
              <div className="cat-empty-title">No categories found</div>
              <div className="cat-empty-sub">Try adjusting your search or filter</div>
            </div>
          ) : (
            <>
              <table className="cat-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Category</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Toggle</th>
                    <th>Symptoms</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((cat, idx) => (
                    <tr key={cat._id}>
                      <td style={{ color: '#94a3b8', fontSize: '12px' }}>
                        {(page - 1) * PER_PAGE + idx + 1}
                       </td>

                      {/* NAME + IMAGE */}
                      <td>
                        <div className="cat-name-cell">
                          <div className="cat-img-wrap">
                            {cat.image?.url
                              ? <img src={cat.image.url} alt={cat.title} onError={e => e.target.style.display='none'} />
                              : <span className="cat-img-placeholder">🖼️</span>
                            }
                          </div>
                          <div>
                            <div className="cat-name-text">{cat.title}</div>
                            {cat.slug && <div className="cat-slug-text">{cat.slug}</div>}
                          </div>
                        </div>
                       </td>

                      {/* TYPE */}
                      <td>
                        <span className={`badge ${cat.isFree ? 'badge-free' : 'badge-paid'}`}>
                          {cat.isFree ? '🆓 Free' : '💰 Paid'}
                        </span>
                       </td>

                      {/* STATUS */}
                      <td>
                        <span className={`badge ${cat.isActive ? 'badge-active' : 'badge-inactive'}`}>
                          {cat.isActive ? '● Active' : '● Inactive'}
                        </span>
                       </td>

                      {/* TOGGLE */}
                      <td>
                        <label className="toggle">
                          <input
                            type="checkbox"
                            checked={cat.isActive}
                            onChange={() => handleToggleCategory(cat)}
                          />
                          <div className="toggle-track" />
                          <div className="toggle-thumb" />
                        </label>
                       </td>

                      {/* SYMPTOMS COUNT */}
                      <td>
                        <button
                          className="btn-icon btn-icon-symptom"
                          onClick={() => openSymptomsModal(cat)}
                          title="Manage Symptoms"
                          style={{ 
                            background: '#f0fdf4', 
                            borderColor: '#bbf7d0',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            width: 'auto',
                            padding: '0 12px'
                          }}
                        >
                          🩺 {cat.symptoms?.length || 0} Symptoms
                        </button>
                       </td>

                      {/* ACTIONS */}
                      <td>
                        <div className="action-btns">
                          <button
                            className="btn-icon btn-icon-edit"
                            title="Edit Category"
                            onClick={() => openEdit(cat)}
                          >✏️</button>
                          <button
                            className="btn-icon btn-icon-delete"
                            title="Delete Category"
                            onClick={() => setDeleteTarget(cat)}
                          >🗑️</button>
                        </div>
                       </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* PAGINATION */}
              {totalPages > 1 && (
                <div className="cat-pagination">
                  <span>Showing {(page-1)*PER_PAGE+1}–{Math.min(page*PER_PAGE, filtered.length)} of {filtered.length}</span>
                  <div className="pag-btns">
                    <button className="pag-btn" disabled={page === 1} onClick={() => setPage(p => p-1)}>← Prev</button>
                    <button className="pag-btn" disabled={page === totalPages} onClick={() => setPage(p => p+1)}>Next →</button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* ───────── CATEGORY CREATE / EDIT MODAL ───────── */}
        {showForm && (
          <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowForm(false)}>
            <div className="modal-box">
              <div className="modal-header">
                <div>
                  <div className="modal-title">{editData ? 'Edit Category' : 'Add New Category'}</div>
                  <div className="modal-sub">{editData ? `Editing: ${editData.title}` : 'Fill in the details below'}</div>
                </div>
                <button className="modal-close" onClick={() => setShowForm(false)}>✕</button>
              </div>

              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Category Title *</label>
                  <input
                    className="form-input"
                    placeholder="e.g. Mathematics"
                    value={formTitle}
                    onChange={e => setFormTitle(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Category Image</label>
                  <div className="upload-area">
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileRef}
                      onChange={handleFilePick}
                    />
                    {previewUrl ? (
                      <>
                        <div className="upload-preview">
                          <img src={previewUrl} alt="preview" />
                          <button
                            className="upload-preview-remove"
                            onClick={e => {
                              e.stopPropagation();
                              setFormFile(null); setPreviewUrl(''); setFormImageUrl('');
                            }}
                          >✕</button>
                        </div>
                        <div className="upload-text">Click to change image</div>
                      </>
                    ) : (
                      <>
                        <div className="upload-icon">📷</div>
                        <div className="upload-text">Click to upload image</div>
                        <div className="upload-hint">PNG, JPG up to 5MB</div>
                      </>
                    )}
                  </div>
                </div>

                {!formFile && (
                  <div className="form-group">
                    <label className="form-label">Or paste image URL</label>
                    <input
                      className="form-input"
                      placeholder="https://example.com/image.jpg"
                      value={formImageUrl}
                      onChange={e => {
                        setFormImageUrl(e.target.value);
                        setPreviewUrl(e.target.value);
                      }}
                    />
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">Access Type</label>
                  <label className="check-row">
                    <input
                      type="checkbox"
                      checked={formIsFree}
                      onChange={e => setFormIsFree(e.target.checked)}
                    />
                    <div>
                      <div className="check-row-label">Free Category</div>
                      <div className="check-row-hint">Users can access without subscription</div>
                    </div>
                  </label>
                </div>

                <div className="modal-footer">
                  <button className="btn-ghost" onClick={() => setShowForm(false)}>Cancel</button>
                  <button
                    className="btn-primary"
                    onClick={handleSubmitCategory}
                    disabled={formLoading}
                    style={{ opacity: formLoading ? 0.7 : 1 }}
                  >
                    {formLoading ? '⏳ Saving…' : editData ? '✓ Update Category' : '+ Create Category'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ───────── SYMPTOMS MANAGEMENT MODAL ───────── */}
        {showSymptomsModal && selectedCategory && (
          <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowSymptomsModal(false)}>
            <div className="modal-box">
              <div className="modal-header">
                <div>
                  <div className="modal-title">Symptoms for: {selectedCategory.title}</div>
                  <div className="modal-sub">Manage In-person consultation symptoms</div>
                </div>
                <button className="modal-close" onClick={() => setShowSymptomsModal(false)}>✕</button>
              </div>

              <div className="modal-body">
                <button 
                  className="add-symptom-btn-small"
                  onClick={openAddSymptom}
                >
                  + Add New Symptom
                </button>

                <div className="symptoms-list">
                  {categorySymptoms.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                      <div style={{ fontSize: '32px', marginBottom: '10px' }}>🩺</div>
                      <div>No symptoms added yet</div>
                      <div style={{ fontSize: '12px', marginTop: '6px' }}>Click above to add your first symptom</div>
                    </div>
                  ) : (
                    categorySymptoms.map(symptom => (
                      <div key={symptom._id} className="symptom-item">
                        <div className="symptom-info">
                          {symptom.image?.url && (
                            <img src={symptom.image.url} alt={symptom.name} className="symptom-img" />
                          )}
                          <div>
                            <div className="symptom-name">{symptom.name}</div>
                            <div style={{ fontSize: '10px', color: '#94a3b8' }}>
                              {symptom.doctors?.length || 0} doctors assigned
                            </div>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button 
                            className="btn-sm btn-sm-primary"
                            onClick={() => openEditSymptom(symptom)}
                          >
                            Edit
                          </button>
                          <button 
                            className="btn-sm btn-sm-danger"
                            onClick={() => handleDeleteSymptom(symptom._id)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ───────── SYMPTOM CREATE / EDIT MODAL ───────── */}
        {showSymptomForm && selectedCategory && (
          <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowSymptomForm(false)}>
            <div className="modal-box">
              <div className="modal-header">
                <div>
                  <div className="modal-title">{editingSymptom ? 'Edit Symptom' : 'Add New Symptom'}</div>
                  <div className="modal-sub">For category: {selectedCategory.title}</div>
                </div>
                <button className="modal-close" onClick={() => setShowSymptomForm(false)}>✕</button>
              </div>

              <form onSubmit={handleSubmitSymptom}>
                <div className="modal-body">
                  <div className="form-group">
                    <label className="form-label">Symptom Name *</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g., Fever, Headache, Cough"
                      value={symptomFormData.name}
                      onChange={(e) => setSymptomFormData({ ...symptomFormData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Color Theme</label>
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
                      {colorPresets.map((color) => (
                        <button
                          key={color}
                          type="button"
                          style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            backgroundColor: color,
                            border: symptomFormData.color === color ? '3px solid #1e293b' : '2px solid white',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                          }}
                          onClick={() => setSymptomFormData({ ...symptomFormData, color })}
                        />
                      ))}
                    </div>
                    <input
                      type="color"
                      className="form-input"
                      value={symptomFormData.color}
                      onChange={(e) => setSymptomFormData({ ...symptomFormData, color: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Symptom Image *</label>
                    <div className="upload-area" onClick={() => document.getElementById('symptomImageInput').click()}>
                      {symptomImagePreview ? (
                        <>
                          <div className="upload-preview">
                            <img src={symptomImagePreview} alt="preview" />
                            <button
                              type="button"
                              className="upload-preview-remove"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSymptomImageFile(null);
                                setSymptomImagePreview(null);
                              }}
                            >✕</button>
                          </div>
                          <div className="upload-text">Click to change image</div>
                        </>
                      ) : (
                        <>
                          <div className="upload-icon">📷</div>
                          <div className="upload-text">Click to upload image</div>
                          <div className="upload-hint">PNG, JPG up to 2MB</div>
                        </>
                      )}
                      <input
                        id="symptomImageInput"
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={handleSymptomImageChange}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Associate Doctors</label>
                    <select
                      multiple
                      className="form-input"
                      value={symptomFormData.doctors}
                      onChange={handleDoctorChange}
                      size={4}
                      style={{ minHeight: '100px' }}
                    >
                      {doctors.map((doctor) => (
                        <option key={doctor._id} value={doctor._id}>
                          👨‍⚕️ {doctor.name} - {doctor.speciality || 'General Physician'}
                        </option>
                      ))}
                    </select>
                    <p style={{ fontSize: '11px', color: '#64748b', marginTop: '6px' }}>
                      💡 Hold Ctrl/Cmd to select multiple doctors
                    </p>
                  </div>
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn-ghost" onClick={() => setShowSymptomForm(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary" disabled={symptomSubmitting}>
                    {symptomSubmitting ? '⏳ Saving...' : (editingSymptom ? 'Update Symptom' : 'Create Symptom')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ───────── DELETE CATEGORY CONFIRM MODAL ───────── */}
        {deleteTarget && (
          <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setDeleteTarget(null)}>
            <div className="modal-box">
              <div className="modal-body" style={{ paddingTop: '28px' }}>
                <div className="delete-confirm-icon">🗑️</div>
                <div className="delete-confirm-text">
                  <div className="delete-confirm-title">Delete "{deleteTarget.title}"?</div>
                  <div className="delete-confirm-sub">
                    This will permanently delete the category and all its symptoms.<br />This action cannot be undone.
                  </div>
                </div>
                <div className="modal-footer" style={{ marginTop: '20px' }}>
                  <button className="btn-ghost" onClick={() => setDeleteTarget(null)}>Cancel</button>
                  <button className="btn-danger" onClick={handleDeleteCategory}>Yes, Delete</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ───────── TOASTS ───────── */}
        <div className="toast-wrap">
          {toasts.map(t => (
            <div key={t.id} className={`toast toast-${t.type}`}>
              {t.type === 'success' ? '✅' : '❌'} {t.msg}
            </div>
          ))}
        </div>

      </div>
    </>
  );
}