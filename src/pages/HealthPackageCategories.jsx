// src/pages/HealthPackageCategories.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import { 
  FiPlus, FiEdit2, FiTrash2, FiSearch, FiX, FiLoader, 
  FiGrid, FiList, FiChevronLeft, FiChevronRight,
  FiEye, FiRefreshCw, FiDownload, FiPackage, FiCalendar
} from 'react-icons/fi';
import { FaHeartbeat, FaHospitalUser, FaStethoscope } from 'react-icons/fa';

const API_URL = 'https://userside-x164.onrender.com/api/health-package-category';

const HealthPackageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [formData, setFormData] = useState({ title: '' });
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [error, setError] = useState('');

  // Fetch categories
  useEffect(() => {
    fetchCategories();
  }, []);

  // Filter categories based on search
  useEffect(() => {
    let result = [...categories];
    
    if (searchTerm.trim() !== '') {
      result = result.filter(category =>
        category.title?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    setFilteredCategories(result);
    setCurrentPage(1);
  }, [searchTerm, categories]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/all`);
      
      if (response.data.success) {
        setCategories(response.data.data || []);
      } else {
        toast.error(response.data.message || 'Failed to fetch categories');
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!formData.title.trim()) {
      setError('Category title is required');
      return;
    }

    setSubmitting(true);
    try {
      if (editingCategory) {
        const response = await axios.put(`${API_URL}/update/${editingCategory._id}`, {
          title: formData.title.trim()
        });
        if (response.data.success) {
          toast.success('Category updated successfully');
        }
      } else {
        const response = await axios.post(`${API_URL}/create`, {
          title: formData.title.trim()
        });
        if (response.data.success) {
          toast.success('Category created successfully');
        }
      }
      setIsModalOpen(false);
      resetForm();
      fetchCategories();
    } catch (error) {
      console.error('Error saving category:', error);
      setError(error.response?.data?.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteClick = (category) => {
    setDeleteTarget(category);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      const response = await axios.delete(`${API_URL}/delete/${deleteTarget._id}`);
      if (response.data.success) {
        toast.success('Category deleted successfully');
        setIsDeleteModalOpen(false);
        setDeleteTarget(null);
        fetchCategories();
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error(error.response?.data?.message || 'Failed to delete category');
    }
  };

  const resetForm = () => {
    setFormData({ title: '' });
    setEditingCategory(null);
    setError('');
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({ title: category.title });
    setIsModalOpen(true);
  };

  const handleRefresh = () => {
    fetchCategories();
    toast.success('Refreshed successfully');
  };

  const handleExport = () => {
    const exportData = filteredCategories.map(cat => ({
      'ID': cat._id,
      'Title': cat.title,
      'Created At': new Date(cat.createdAt).toLocaleString(),
      'Updated At': new Date(cat.updatedAt).toLocaleString()
    }));
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `health-package-categories-${new Date().toISOString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Exported successfully');
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCategories.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);

  const getRandomIcon = (title) => {
    const icons = [FaHeartbeat, FaHospitalUser, FaStethoscope];
    const index = (title?.length || 0) % icons.length;
    return icons[index];
  };

  return (
    <div className="health-categories-container">
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1e293b',
            color: '#fff',
            borderRadius: '12px',
            padding: '16px',
          },
          success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
        }}
      />
      
      <div className="content-wrapper">
        {/* Header Section */}
        <div className="header-section">
          <div className="header-top">
            <div className="header-title-group">
              <div className="header-icon">
                <FaHeartbeat size={28} />
              </div>
              <div>
                <h1 className="header-title">Health Package Categories</h1>
                <p className="header-subtitle">Manage health package categories and types</p>
              </div>
            </div>
            
            <div className="header-actions">
              <button onClick={handleRefresh} className="action-btn" title="Refresh">
                <FiRefreshCw size={18} />
              </button>
              <button onClick={handleExport} className="action-btn" title="Export">
                <FiDownload size={18} />
              </button>
              <button onClick={() => { resetForm(); setIsModalOpen(true); }} className="create-btn">
                <FiPlus size={18} />
                Add Category
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-info">
              <p className="stat-label">Total Categories</p>
              <p className="stat-value">{categories.length}</p>
            </div>
            <div className="stat-icon purple">
              <FiPackage size={20} />
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-info">
              <p className="stat-label">Active Categories</p>
              <p className="stat-value">{categories.length}</p>
            </div>
            <div className="stat-icon green">
              <FaHeartbeat size={20} />
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-info">
              <p className="stat-label">Last Updated</p>
              <p className="stat-value">
                {categories.length > 0 ? new Date(Math.max(...categories.map(c => new Date(c.updatedAt)))).toLocaleDateString() : 'N/A'}
              </p>
            </div>
            <div className="stat-icon orange">
              <FiCalendar size={20} />
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-info">
              <p className="stat-label">Search Results</p>
              <p className="stat-value">{filteredCategories.length}</p>
            </div>
            <div className="stat-icon blue">
              <FiSearch size={20} />
            </div>
          </div>
        </div>

        {/* Search Section */}
        <div className="search-filters-card">
          <div className="search-wrapper">
            <FiSearch className="search-icon" size={18} />
            <input
              type="text"
              placeholder="Search categories by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="clear-search">
                <FiX size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="loading-state">
            <FiLoader className="spinner" size={48} />
            <p>Loading categories...</p>
          </div>
        )}

        {/* Categories Table */}
        {!loading && (
          <>
            {filteredCategories.length > 0 ? (
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Category Name</th>
                      <th>Created Date</th>
                      <th>Last Updated</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.map((category, index) => {
                      const IconComponent = getRandomIcon(category.title);
                      return (
                        <tr key={category._id}>
                          <td className="serial-no">{indexOfFirstItem + index + 1}</td>
                          <td>
                            <div className="category-cell">
                              <div className="category-icon">
                                <IconComponent size={18} />
                              </div>
                              <span className="category-name">{category.title}</span>
                            </div>
                          </td>
                          <td>
                            <div className="date-cell">
                              <FiCalendar size={14} />
                              {new Date(category.createdAt).toLocaleDateString()}
                            </div>
                          </td>
                          <td>
                            <div className="date-cell">
                              <FiCalendar size={14} />
                              {new Date(category.updatedAt).toLocaleDateString()}
                            </div>
                          </td>
                          <td>
                            <div className="action-buttons">
                              <button onClick={() => handleEdit(category)} className="icon-btn edit" title="Edit">
                                <FiEdit2 size={16} />
                              </button>
                              <button onClick={() => handleDeleteClick(category)} className="icon-btn delete" title="Delete">
                                <FiTrash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">
                  <FaHeartbeat size={48} />
                </div>
                <h3>{searchTerm ? 'No results found' : 'No categories yet'}</h3>
                <p>
                  {searchTerm 
                    ? `No categories match "${searchTerm}". Try a different search term.`
                    : 'Create your first health package category to get started.'}
                </p>
                {!searchTerm && (
                  <button onClick={() => { resetForm(); setIsModalOpen(true); }} className="create-empty-btn">
                    <FiPlus size={18} />
                    Create First Category
                  </button>
                )}
              </div>
            )}

            {/* Pagination */}
            {filteredCategories.length > itemsPerPage && (
              <div className="pagination">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="page-nav"
                >
                  <FiChevronLeft size={18} />
                </button>
                <div className="page-numbers">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                    <button
                      key={number}
                      onClick={() => paginate(number)}
                      className={`page-number ${currentPage === number ? 'active' : ''}`}
                    >
                      {number}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="page-nav"
                >
                  <FiChevronRight size={18} />
                </button>
              </div>
            )}
          </>
        )}

        {/* Create/Edit Modal */}
        {isModalOpen && (
          <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) { setIsModalOpen(false); resetForm(); } }}>
            <div className="modal-content">
              <div className="modal-header">
                <div className="modal-header-icon">
                  <FaHeartbeat size={20} />
                </div>
                <h2>{editingCategory ? 'Edit Category' : 'Create Category'}</h2>
                <button onClick={() => { setIsModalOpen(false); resetForm(); }} className="modal-close">
                  <FiX size={22} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="modal-form">
                {error && <div className="error-box">{error}</div>}
                
                <div className="form-group">
                  <label>Category Title <span className="required">*</span></label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ title: e.target.value })}
                    placeholder="e.g., Wellness, Preventive, Specialized"
                    autoFocus
                  />
                  <p className="form-hint">Enter a unique name for the health package category</p>
                </div>

                {formData.title && (
                  <div className="preview-box">
                    <p className="preview-label">Preview</p>
                    <div className="preview-content">
                      <FaHeartbeat size={18} />
                      <span>{formData.title}</span>
                    </div>
                  </div>
                )}

                <div className="form-actions">
                  <button type="submit" disabled={submitting} className="submit-btn">
                    {submitting ? <FiLoader className="spinner-small" size={20} /> : (editingCategory ? 'Update Category' : 'Create Category')}
                  </button>
                  <button type="button" onClick={() => { setIsModalOpen(false); resetForm(); }} className="cancel-btn">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {isDeleteModalOpen && (
          <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) { setIsDeleteModalOpen(false); setDeleteTarget(null); } }}>
            <div className="modal-content delete-modal">
              <div className="delete-icon-wrapper">
                <FiTrash2 size={40} />
              </div>
              <h3>Delete Category</h3>
              <p>
                Are you sure you want to delete <strong>"{deleteTarget?.title}"</strong>? 
                This may affect existing health packages under this category.
              </p>
              <div className="delete-actions">
                <button onClick={handleDeleteConfirm} className="confirm-delete-btn">
                  Delete
                </button>
                <button onClick={() => { setIsDeleteModalOpen(false); setDeleteTarget(null); }} className="cancel-delete-btn">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .health-categories-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #fefce8 0%, #fef3c7 50%, #fde68a 100%);
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
        }

        .content-wrapper {
          max-width: 1200px;
          margin: 0 auto;
          padding: 32px 24px;
        }

        .header-section {
          margin-bottom: 32px;
        }

        .header-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 20px;
        }

        .header-title-group {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .header-icon {
          background: linear-gradient(135deg, #f59e0b, #ea580c);
          padding: 14px;
          border-radius: 20px;
          box-shadow: 0 10px 25px -5px rgba(245, 158, 11, 0.3);
        }

        .header-icon svg {
          color: white;
        }

        .header-title {
          font-size: 28px;
          font-weight: 700;
          color: #1e293b;
        }

        .header-subtitle {
          font-size: 14px;
          color: #64748b;
          margin-top: 4px;
        }

        .header-actions {
          display: flex;
          gap: 12px;
        }

        .action-btn {
          padding: 10px;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .action-btn:hover {
          background: #f8fafc;
          color: #f59e0b;
        }

        .create-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          background: linear-gradient(135deg, #f59e0b, #ea580c);
          border: none;
          border-radius: 14px;
          color: white;
          font-weight: 600;
          cursor: pointer;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 20px;
          margin-bottom: 28px;
        }

        .stat-card {
          background: white;
          border-radius: 20px;
          padding: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border: 1px solid #e2e8f0;
        }

        .stat-label {
          font-size: 13px;
          color: #64748b;
          margin-bottom: 6px;
        }

        .stat-value {
          font-size: 28px;
          font-weight: 700;
          color: #1e293b;
        }

        .stat-icon {
          width: 48px;
          height: 48px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .stat-icon.purple { background: #eef2ff; color: #8b5cf6; }
        .stat-icon.green { background: #ecfdf5; color: #10b981; }
        .stat-icon.orange { background: #fff7ed; color: #f59e0b; }
        .stat-icon.blue { background: #eff6ff; color: #3b82f6; }

        .search-filters-card {
          background: white;
          border-radius: 20px;
          padding: 20px;
          margin-bottom: 28px;
          border: 1px solid #e2e8f0;
        }

        .search-wrapper {
          position: relative;
        }

        .search-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
        }

        .search-input {
          width: 100%;
          padding: 12px 40px;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          font-size: 14px;
        }

        .search-input:focus {
          outline: none;
          border-color: #f59e0b;
        }

        .clear-search {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
        }

        .table-container {
          background: white;
          border-radius: 20px;
          overflow: auto;
          border: 1px solid #e2e8f0;
        }

        .data-table {
          width: 100%;
          border-collapse: collapse;
        }

        .data-table th {
          text-align: left;
          padding: 14px 20px;
          background: #f8fafc;
          font-weight: 600;
          font-size: 13px;
          color: #475569;
          border-bottom: 1px solid #e2e8f0;
        }

        .data-table td {
          padding: 14px 20px;
          border-bottom: 1px solid #f1f5f9;
        }

        .data-table tr:hover {
          background: #fefce8;
        }

        .serial-no {
          width: 60px;
          color: #94a3b8;
        }

        .category-cell {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .category-icon {
          width: 32px;
          height: 32px;
          background: #fef3c7;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #f59e0b;
        }

        .category-name {
          font-weight: 500;
          color: #1e293b;
        }

        .date-cell {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #64748b;
          font-size: 13px;
        }

        .action-buttons {
          display: flex;
          gap: 8px;
        }

        .icon-btn {
          padding: 6px;
          background: none;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .icon-btn.edit { color: #f59e0b; }
        .icon-btn.delete { color: #ef4444; }

        .icon-btn:hover {
          background: #f1f5f9;
        }

        .loading-state {
          background: white;
          border-radius: 20px;
          padding: 60px;
          text-align: center;
        }

        .spinner {
          animation: spin 1s linear infinite;
          color: #f59e0b;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .empty-state {
          background: white;
          border-radius: 20px;
          padding: 60px;
          text-align: center;
        }

        .empty-icon {
          width: 80px;
          height: 80px;
          background: #fef3c7;
          border-radius: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          color: #f59e0b;
        }

        .empty-state h3 {
          font-size: 20px;
          color: #1e293b;
          margin-bottom: 8px;
        }

        .empty-state p {
          color: #64748b;
          margin-bottom: 24px;
        }

        .create-empty-btn {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 12px 24px;
          background: linear-gradient(135deg, #f59e0b, #ea580c);
          border: none;
          border-radius: 16px;
          color: white;
          font-weight: 600;
          cursor: pointer;
        }

        .pagination {
          display: flex;
          justify-content: center;
          gap: 10px;
          margin-top: 24px;
        }

        .page-nav {
          padding: 8px 12px;
          border: 1px solid #e2e8f0;
          background: white;
          border-radius: 10px;
          cursor: pointer;
        }

        .page-numbers {
          display: flex;
          gap: 6px;
        }

        .page-number {
          width: 36px;
          height: 36px;
          border: 1px solid #e2e8f0;
          background: white;
          border-radius: 10px;
          cursor: pointer;
        }

        .page-number.active {
          background: #f59e0b;
          border-color: #f59e0b;
          color: white;
        }

        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal-content {
          background: white;
          border-radius: 32px;
          max-width: 500px;
          width: 90%;
          animation: slideUp 0.3s ease;
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .modal-header {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 20px 24px;
          background: linear-gradient(135deg, #f59e0b, #ea580c);
          color: white;
          border-radius: 32px 32px 0 0;
        }

        .modal-header-icon {
          background: rgba(255, 255, 255, 0.2);
          padding: 8px;
          border-radius: 12px;
        }

        .modal-header h2 {
          flex: 1;
          font-size: 20px;
        }

        .modal-close {
          background: rgba(255, 255, 255, 0.2);
          border: none;
          border-radius: 10px;
          padding: 6px;
          cursor: pointer;
          color: white;
        }

        .modal-form {
          padding: 24px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          font-size: 14px;
          font-weight: 500;
          color: #334155;
          margin-bottom: 8px;
        }

        .required {
          color: #ef4444;
        }

        .form-group input {
          width: 100%;
          padding: 12px 16px;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          font-size: 14px;
        }

        .form-group input:focus {
          outline: none;
          border-color: #f59e0b;
        }

        .form-hint {
          font-size: 12px;
          color: #94a3b8;
          margin-top: 6px;
        }

        .preview-box {
          background: #fef3c7;
          border-radius: 16px;
          padding: 16px;
          margin-bottom: 24px;
        }

        .preview-label {
          font-size: 12px;
          font-weight: 500;
          color: #d97706;
          margin-bottom: 8px;
        }

        .preview-content {
          display: flex;
          align-items: center;
          gap: 10px;
          font-weight: 500;
          color: #1e293b;
        }

        .error-box {
          background: #fee2e2;
          color: #dc2626;
          padding: 12px;
          border-radius: 12px;
          font-size: 13px;
          margin-bottom: 20px;
        }

        .form-actions {
          display: flex;
          gap: 12px;
          margin-top: 24px;
        }

        .submit-btn {
          flex: 1;
          padding: 12px;
          background: linear-gradient(135deg, #f59e0b, #ea580c);
          border: none;
          border-radius: 14px;
          color: white;
          font-weight: 600;
          cursor: pointer;
        }

        .cancel-btn {
          flex: 1;
          padding: 12px;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          cursor: pointer;
        }

        .delete-modal {
          text-align: center;
        }

        .delete-icon-wrapper {
          width: 80px;
          height: 80px;
          background: #fee2e2;
          border-radius: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 24px auto 16px;
          color: #dc2626;
        }

        .delete-modal h3 {
          font-size: 20px;
          color: #1e293b;
          margin-bottom: 8px;
        }

        .delete-modal p {
          color: #64748b;
          margin-bottom: 24px;
          padding: 0 24px;
        }

        .delete-actions {
          display: flex;
          gap: 12px;
          padding: 0 24px 24px;
        }

        .confirm-delete-btn {
          flex: 1;
          padding: 12px;
          background: #dc2626;
          border: none;
          border-radius: 14px;
          color: white;
          font-weight: 600;
          cursor: pointer;
        }

        .cancel-delete-btn {
          flex: 1;
          padding: 12px;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          cursor: pointer;
        }

        .spinner-small {
          animation: spin 1s linear infinite;
        }

        @media (max-width: 768px) {
          .content-wrapper {
            padding: 20px 16px;
          }
          .header-title {
            font-size: 22px;
          }
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .modal-content {
            margin: 16px;
          }
        }
      `}</style>
    </div>
  );
};

export default HealthPackageCategories;