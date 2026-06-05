import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const API = 'https://userside-x164.onrender.com/api/subcategories';
const CATEGORY_API = 'https://userside-x164.onrender.com/api/categories';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  .subcategories-container {
    font-family: 'Inter', sans-serif;
    background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
    min-height: 100vh;
    padding: 24px 32px;
  }

  /* Header Styles */
  .header-section {
    margin-bottom: 32px;
  }

  .header-title {
    font-size: 32px;
    font-weight: 800;
    background: linear-gradient(135deg, #1e40af 0%, #2563eb 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: 8px;
  }

  .header-subtitle {
    color: #1e3a8a;
    font-size: 14px;
    font-weight: 500;
  }

  .add-btn {
    background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
    color: white;
    border: none;
    padding: 12px 28px;
    border-radius: 12px;
    font-weight: 600;
    font-size: 14px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 10px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.2);
  }

  .add-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.3);
  }

  /* Stats Cards */
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 20px;
    margin-bottom: 32px;
  }

  .stat-card {
    background: white;
    border-radius: 20px;
    padding: 20px;
    transition: all 0.3s ease;
    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    border: 1px solid rgba(226, 232, 240, 0.8);
  }

  .stat-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 25px -12px rgba(0,0,0,0.1);
  }

  .stat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }

  .stat-icon {
    width: 48px;
    height: 48px;
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
  }

  .stat-value {
    font-size: 32px;
    font-weight: 800;
    color: #1e293b;
    margin-bottom: 4px;
  }

  .stat-label {
    font-size: 13px;
    font-weight: 500;
    color: #64748b;
  }

  /* Search & Filter Section */
  .search-section {
    background: white;
    border-radius: 20px;
    padding: 20px 24px;
    margin-bottom: 32px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    border: 1px solid rgba(226, 232, 240, 0.8);
  }

  .search-wrapper {
    position: relative;
    margin-bottom: 16px;
  }

  .search-icon {
    position: absolute;
    left: 16px;
    top: 50%;
    transform: translateY(-50%);
    color: #94a3b8;
  }

  .search-input {
    width: 100%;
    padding: 14px 16px 14px 48px;
    border: 1.5px solid #e2e8f0;
    border-radius: 14px;
    font-size: 14px;
    font-family: 'Inter', sans-serif;
    transition: all 0.2s;
    background: #f8fafc;
  }

  .search-input:focus {
    outline: none;
    border-color: #3b82f6;
    background: white;
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
  }

  .filter-wrapper {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
  }

  .filter-label {
    font-size: 13px;
    font-weight: 600;
    color: #334155;
  }

  .filter-select {
    flex: 1;
    min-width: 200px;
    padding: 10px 14px;
    border: 1.5px solid #e2e8f0;
    border-radius: 12px;
    font-size: 13px;
    font-family: 'Inter', sans-serif;
    background: #f8fafc;
    cursor: pointer;
  }

  .filter-select:focus {
    outline: none;
    border-color: #3b82f6;
  }

  .clear-filter-btn {
    padding: 10px 16px;
    background: #f1f5f9;
    border: none;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    color: #64748b;
    transition: all 0.2s;
  }

  .clear-filter-btn:hover {
    background: #e2e8f0;
    color: #1e293b;
  }

  /* SubCategories Grid */
  .subcategories-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
    gap: 24px;
    margin-bottom: 32px;
  }

  /* SubCategory Card */
  .subcategory-card {
    background: white;
    border-radius: 24px;
    overflow: hidden;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
    border: 1px solid rgba(226, 232, 240, 0.8);
    position: relative;
  }

  .subcategory-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 25px -12px rgba(0,0,0,0.15);
  }

  .card-header {
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    padding: 20px;
    color: white;
    position: relative;
  }

  .category-badge {
    position: absolute;
    top: 16px;
    right: 16px;
    background: rgba(255,255,255,0.2);
    backdrop-filter: blur(8px);
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 500;
  }

  .subcategory-icon {
    font-size: 48px;
    margin-bottom: 12px;
  }

  .subcategory-name {
    font-size: 22px;
    font-weight: 700;
    margin-bottom: 8px;
  }

  .card-content {
    padding: 20px;
  }

  .info-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 0;
    border-bottom: 1px solid #e2e8f0;
  }

  .info-label {
    font-size: 12px;
    font-weight: 600;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .info-value {
    font-size: 14px;
    font-weight: 600;
    color: #1e293b;
    background: #f1f5f9;
    padding: 4px 12px;
    border-radius: 8px;
  }

  .parent-category {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: #dbeafe;
    color: #1e40af;
    padding: 6px 12px;
    border-radius: 10px;
    font-size: 13px;
    font-weight: 600;
  }

  .card-actions {
    display: flex;
    gap: 12px;
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1.5px solid #e2e8f0;
  }

  .edit-btn, .delete-btn {
    flex: 1;
    padding: 10px;
    border: none;
    border-radius: 12px;
    font-weight: 600;
    font-size: 13px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: all 0.2s;
  }

  .edit-btn {
    background: #fef3c7;
    color: #d97706;
  }

  .edit-btn:hover {
    background: #fde68a;
    transform: translateY(-2px);
  }

  .delete-btn {
    background: #fee2e2;
    color: #dc2626;
  }

  .delete-btn:hover {
    background: #fecaca;
    transform: translateY(-2px);
  }

  /* Pagination Styles */
  .pagination-section {
    background: white;
    border-radius: 20px;
    padding: 20px 24px;
    margin-top: 24px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    border: 1px solid rgba(226, 232, 240, 0.8);
  }

  .pagination-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 16px;
  }

  .pagination-info {
    color: #64748b;
    font-size: 13px;
    font-weight: 500;
  }

  .pagination-controls {
    display: flex;
    gap: 8px;
    align-items: center;
    flex-wrap: wrap;
  }

  .page-btn {
    min-width: 38px;
    height: 38px;
    padding: 0 10px;
    border: 1.5px solid #e2e8f0;
    background: white;
    border-radius: 10px;
    cursor: pointer;
    font-weight: 600;
    font-size: 13px;
    transition: all 0.2s;
    color: #475569;
  }

  .page-btn:hover:not(:disabled) {
    background: #f1f5f9;
    border-color: #3b82f6;
    color: #3b82f6;
  }

  .page-btn.active {
    background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
    color: white;
    border-color: #2563eb;
  }

  .page-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  .page-numbers {
    display: flex;
    gap: 6px;
    align-items: center;
    flex-wrap: wrap;
  }

  .per-page-select {
    padding: 8px 12px;
    border: 1.5px solid #e2e8f0;
    border-radius: 10px;
    font-size: 13px;
    font-family: 'Inter', sans-serif;
    background: white;
    cursor: pointer;
  }

  /* Modal Styles */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.6);
    backdrop-filter: blur(8px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    animation: fadeIn 0.2s ease;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  .modal-container {
    background: white;
    border-radius: 32px;
    width: 90%;
    max-width: 500px;
    animation: slideUp 0.3s ease;
  }

  @keyframes slideUp {
    from { transform: translateY(30px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }

  .modal-header {
    padding: 24px 28px;
    border-bottom: 1.5px solid #e2e8f0;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .modal-title {
    font-size: 24px;
    font-weight: 700;
    background: linear-gradient(135deg, #1e40af 0%, #2563eb 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .close-modal {
    width: 36px;
    height: 36px;
    border-radius: 12px;
    border: none;
    background: #f1f5f9;
    font-size: 24px;
    cursor: pointer;
    color: #64748b;
    transition: all 0.2s;
  }

  .close-modal:hover {
    background: #e2e8f0;
    color: #1e293b;
  }

  .modal-body {
    padding: 28px;
  }

  .form-group {
    margin-bottom: 24px;
  }

  .form-label {
    display: block;
    font-size: 13px;
    font-weight: 700;
    color: #334155;
    margin-bottom: 8px;
  }

  .form-label .required {
    color: #ef4444;
    margin-left: 4px;
  }

  .form-input, .form-select {
    width: 100%;
    padding: 12px 16px;
    border: 1.5px solid #e2e8f0;
    border-radius: 14px;
    font-size: 14px;
    font-family: 'Inter', sans-serif;
    transition: all 0.2s;
    background: #f8fafc;
  }

  .form-input:focus, .form-select:focus {
    outline: none;
    border-color: #3b82f6;
    background: white;
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
  }

  .modal-footer {
    padding: 20px 28px;
    border-top: 1.5px solid #e2e8f0;
    display: flex;
    gap: 16px;
    justify-content: flex-end;
  }

  .btn-cancel {
    padding: 12px 24px;
    border: none;
    border-radius: 14px;
    font-weight: 600;
    font-size: 14px;
    cursor: pointer;
    background: #f1f5f9;
    color: #475569;
    transition: all 0.2s;
  }

  .btn-cancel:hover {
    background: #e2e8f0;
  }

  .btn-submit {
    padding: 12px 24px;
    border: none;
    border-radius: 14px;
    font-weight: 600;
    font-size: 14px;
    cursor: pointer;
    background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
    color: white;
    transition: all 0.2s;
  }

  .btn-submit:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
  }

  .btn-submit:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  /* Loading & Empty States */
  .loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 400px;
  }

  .spinner {
    width: 50px;
    height: 50px;
    border: 3px solid #e2e8f0;
    border-top-color: #3b82f6;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .empty-state {
    text-align: center;
    padding: 80px 20px;
    background: white;
    border-radius: 24px;
  }

  .empty-icon {
    font-size: 80px;
    margin-bottom: 20px;
  }

  .empty-title {
    font-size: 20px;
    font-weight: 700;
    color: #1e293b;
    margin-bottom: 8px;
  }

  .empty-text {
    color: #64748b;
    font-size: 14px;
  }

  /* Responsive */
  @media (max-width: 768px) {
    .subcategories-container {
      padding: 16px;
    }
    .header-title {
      font-size: 24px;
    }
    .stats-grid {
      grid-template-columns: 1fr;
    }
    .subcategories-grid {
      grid-template-columns: 1fr;
    }
    .pagination-container {
      flex-direction: column;
      align-items: center;
    }
    .pagination-controls {
      justify-content: center;
    }
  }
`;

export default function SubCategories() {
  const [subCategories, setSubCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(9);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  
  const [formData, setFormData] = useState({
    name: '',
    category: ''
  });

  useEffect(() => {
    fetchSubCategories();
    fetchCategories();
  }, [currentPage, itemsPerPage, searchTerm, selectedCategory]);

  const fetchSubCategories = async () => {
    setLoading(true);
    try {
      let url = `${API}?page=${currentPage}&limit=${itemsPerPage}&search=${searchTerm}`;
      if (selectedCategory) {
        url += `&category=${selectedCategory}`;
      }
      const response = await axios.get(url);
      setSubCategories(response.data.data);
      setTotalItems(response.data.total);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      toast.error('Failed to fetch subcategories');
      console.error(error);
    }
    setLoading(false);
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(CATEGORY_API);
      setCategories(response.data.data || response.data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name) {
      toast.error('Subcategory name is required');
      return;
    }

    if (!formData.category) {
      toast.error('Please select a parent category');
      return;
    }

    setIsSubmitting(true);

    try {
      let response;
      if (editingItem) {
        response = await axios.put(`${API}/${editingItem._id}`, formData);
        toast.success('Subcategory updated successfully!');
      } else {
        response = await axios.post(API, formData);
        toast.success('Subcategory created successfully!');
      }
      
      if (response.data.success) {
        setShowModal(false);
        resetForm();
        fetchSubCategories();
      }
    } catch (error) {
      console.error('Submit error:', error);
      toast.error(error.response?.data?.message || 'Failed to save subcategory');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this subcategory? This might affect medicines under it.')) {
      try {
        await axios.delete(`${API}/${id}`);
        toast.success('Subcategory deleted successfully');
        fetchSubCategories();
      } catch (error) {
        toast.error('Failed to delete subcategory');
        console.error(error);
      }
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      category: item.category?._id || item.category || ''
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      category: ''
    });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value));
    setCurrentPage(1);
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);
    
    if (endPage - startPage + 1 < maxVisible) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find(c => c._id === categoryId);
    return category?.name || 'Unknown';
  };

  // Group subcategories by parent category for stats
  const categoriesWithCount = subCategories.reduce((acc, sub) => {
    const catId = sub.category?._id || sub.category;
    if (catId) {
      acc[catId] = (acc[catId] || 0) + 1;
    }
    return acc;
  }, {});

  return (
    <>
      <style>{styles}</style>
      <div className="subcategories-container">
        {/* Header */}
        <div className="header-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
            <div>
              <h1 className="header-title">SubCategory Management</h1>
              <p className="header-subtitle">Organize medicines with hierarchical categories</p>
            </div>
            <button className="add-btn" onClick={() => setShowModal(true)}>
              <span>+</span> Add New SubCategory
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-icon" style={{ background: '#dbeafe', color: '#2563eb' }}>📁</div>
            </div>
            <div className="stat-value">{totalItems}</div>
            <div className="stat-label">Total SubCategories</div>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-icon" style={{ background: '#dbeafe', color: '#2563eb' }}>📂</div>
            </div>
            <div className="stat-value">{categories.length}</div>
            <div className="stat-label">Parent Categories</div>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-icon" style={{ background: '#dbeafe', color: '#2563eb' }}>📊</div>
            </div>
            <div className="stat-value">{Object.keys(categoriesWithCount).length}</div>
            <div className="stat-label">Active Categories</div>
          </div>
        </div>

        {/* Search & Filter Section */}
        <div className="search-section">
          <div className="search-wrapper">
            <svg className="search-icon" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              className="search-input"
              placeholder="Search subcategories by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="filter-wrapper">
            <span className="filter-label">Filter by Parent Category:</span>
            <select 
              className="filter-select" 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat._id} value={cat._id}>{cat.name}</option>
              ))}
            </select>
            {selectedCategory && (
              <button className="clear-filter-btn" onClick={() => setSelectedCategory('')}>
                Clear Filter
              </button>
            )}
          </div>
        </div>

        {/* SubCategories Grid */}
        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p style={{ marginTop: '16px', color: '#64748b' }}>Loading subcategories...</p>
          </div>
        ) : subCategories.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📁</div>
            <h3 className="empty-title">No subcategories found</h3>
            <p className="empty-text">Click "Add New SubCategory" to get started</p>
          </div>
        ) : (
          <>
            <div className="subcategories-grid">
              {subCategories.map((sub) => (
                <div key={sub._id} className="subcategory-card">
                  <div className="card-header">
                    <div className="subcategory-icon">
                      {sub.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="subcategory-name">{sub.name}</div>
                    {sub.category && (
                      <div className="category-badge">
                        {sub.category.name || getCategoryName(sub.category)}
                      </div>
                    )}
                  </div>

                  <div className="card-content">
                    <div className="info-row">
                      <span className="info-label">Parent Category</span>
                      <span className="parent-category">
                        📁 {sub.category?.name || getCategoryName(sub.category)}
                      </span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Created</span>
                      <span className="info-value">
                        {new Date(sub.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">SubCategory ID</span>
                      <span className="info-value">
                        {sub._id.slice(-6)}
                      </span>
                    </div>

                    <div className="card-actions">
                      <button className="edit-btn" onClick={() => handleEdit(sub)}>
                        ✏️ Edit
                      </button>
                      <button className="delete-btn" onClick={() => handleDelete(sub._id)}>
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination-section">
                <div className="pagination-container">
                  <div className="pagination-info">
                    Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} subcategories
                  </div>
                  
                  <div className="pagination-controls">
                    <button
                      className="page-btn"
                      onClick={() => handlePageChange(1)}
                      disabled={currentPage === 1}
                    >
                      « First
                    </button>
                    <button
                      className="page-btn"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      ‹ Previous
                    </button>
                    
                    <div className="page-numbers">
                      {getPageNumbers().map(page => (
                        <button
                          key={page}
                          className={`page-btn ${currentPage === page ? 'active' : ''}`}
                          onClick={() => handlePageChange(page)}
                        >
                          {page}
                        </button>
                      ))}
                    </div>
                    
                    <button
                      className="page-btn"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Next ›
                    </button>
                    <button
                      className="page-btn"
                      onClick={() => handlePageChange(totalPages)}
                      disabled={currentPage === totalPages}
                    >
                      Last »
                    </button>
                  </div>
                  
                  <div>
                    <select className="per-page-select" value={itemsPerPage} onChange={handleItemsPerPageChange}>
                      <option value={6}>6 per page</option>
                      <option value={9}>9 per page</option>
                      <option value={12}>12 per page</option>
                      <option value={15}>15 per page</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Modal for Create/Edit */}
        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2 className="modal-title">{editingItem ? 'Edit SubCategory' : 'Add New SubCategory'}</h2>
                <button className="close-modal" onClick={() => setShowModal(false)}>×</button>
              </div>
              
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="form-group">
                    <label className="form-label">SubCategory Name <span className="required">*</span></label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g., Antibiotics, Painkillers, Vitamins"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Parent Category <span className="required">*</span></label>
                    <select
                      className="form-select"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      required
                    >
                      <option value="">Select a parent category</option>
                      {categories.map((cat) => (
                        <option key={cat._id} value={cat._id}>
                          📂 {cat.name}
                        </option>
                      ))}
                    </select>
                    <p style={{ fontSize: '11px', color: '#64748b', marginTop: '6px' }}>
                      💡 This will help organize medicines under this subcategory
                    </p>
                  </div>
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <span className="spinner" style={{ width: '16px', height: '16px', display: 'inline-block', marginRight: '8px' }}></span>
                        {editingItem ? 'Updating...' : 'Creating...'}
                      </>
                    ) : (
                      editingItem ? 'Update SubCategory' : 'Create SubCategory'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}