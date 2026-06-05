import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import { 
  FiPlus, FiEdit2, FiTrash2, FiSearch, FiX, 
  FiLoader, FiScissors, FiFolder, FiCalendar, 
  FiEye, FiAlertCircle, FiChevronLeft, FiChevronRight, 
  FiGrid, FiList, FiDownload, FiFilter, FiRefreshCw,
  FiCheckCircle
} from 'react-icons/fi';
import { FaRegHospital, FaUserMd, FaRegClock, FaChartLine } from 'react-icons/fa';

const API_URL = 'https://userside-x164.onrender.com/api/surgery-categories';

const SurgeryCategories = () => {
  // State Management
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [formData, setFormData] = useState({ name: '' });
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  
  const searchInputRef = useRef(null);

  // Fetch categories from API
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_URL);
      
      if (response.data.success) {
        setCategories(response.data.data || []);
        setFilteredCategories(response.data.data || []);
      } else {
        toast.error(response.data.message || 'Failed to fetch categories');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Filter and sort logic
  useEffect(() => {
    let result = [...categories];
    
    if (searchTerm.trim() !== '') {
      result = result.filter(category =>
        category.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    switch (sortBy) {
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'oldest':
        result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case 'name-asc':
        result.sort((a, b) => a.name?.localeCompare(b.name));
        break;
      case 'name-desc':
        result.sort((a, b) => b.name?.localeCompare(a.name));
        break;
      default:
        break;
    }
    
    setFilteredCategories(result);
    setCurrentPage(1);
  }, [searchTerm, categories, sortBy]);

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCategories.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Form submission for create/update
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Category name is required');
      return;
    }

    setSubmitting(true);
    
    try {
      if (editingCategory) {
        const response = await axios.put(`${API_URL}/${editingCategory._id}`, {
          name: formData.name.trim()
        });
        
        if (response.data.success) {
          toast.success('Category updated successfully');
          setIsModalOpen(false);
          resetForm();
          fetchCategories();
        } else {
          toast.error(response.data.message || 'Update failed');
        }
      } else {
        const response = await axios.post(API_URL, {
          name: formData.name.trim()
        });
        
        if (response.data.success) {
          toast.success('Category created successfully');
          setIsModalOpen(false);
          resetForm();
          fetchCategories();
        } else {
          toast.error(response.data.message || 'Creation failed');
        }
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || 'Operation failed';
      toast.error(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  // Delete category
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    
    try {
      const response = await axios.delete(`${API_URL}/${deleteTarget._id}`);
      
      if (response.data.success) {
        toast.success('Category deleted successfully');
        setIsDeleteModalOpen(false);
        setDeleteTarget(null);
        fetchCategories();
      } else {
        toast.error(response.data.message || 'Delete failed');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete category');
    }
  };

  const handleDeleteClick = (category) => {
    setDeleteTarget(category);
    setIsDeleteModalOpen(true);
  };

  const resetForm = () => {
    setFormData({ name: '' });
    setEditingCategory(null);
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({ name: category.name });
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleViewDetails = (category) => {
    setSelectedCategory(category);
    setIsDetailModalOpen(true);
  };

  const handleRefresh = () => {
    fetchCategories();
    toast.success('Refreshed successfully');
  };

  const handleExport = () => {
    const data = JSON.stringify(filteredCategories, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `surgery-categories-${new Date().toISOString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Exported successfully');
  };

  // Get current month count
  const getCurrentMonthCount = () => {
    const currentMonth = new Date().getMonth();
    return categories.filter(c => new Date(c.createdAt).getMonth() === currentMonth).length;
  };

  return (
    <div className="surgery-categories-container">
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
          success: {
            iconTheme: { primary: '#10b981', secondary: '#fff' },
          },
          error: {
            iconTheme: { primary: '#ef4444', secondary: '#fff' },
          },
        }}
      />
      
      <div className="content-wrapper">
        
        {/* Header Section */}
        <div className="header-section">
          <div className="header-top">
            <div className="header-title-group">
              <div className="header-icon">
                <FiScissors size={28} />
              </div>
              <div>
                <h1 className="header-title">Surgery Categories</h1>
                <p className="header-subtitle">Manage surgical specialties and operation categories</p>
              </div>
            </div>
            
            <div className="header-actions">
              <button onClick={handleRefresh} className="action-btn" title="Refresh">
                <FiRefreshCw size={20} />
              </button>
              <button onClick={handleExport} className="action-btn" title="Export">
                <FiDownload size={20} />
              </button>
              <button onClick={handleCreate} className="create-btn">
                <FiPlus size={18} />
                Add Category
              </button>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="search-filters-card">
          <div className="search-filters-row">
            <div className="search-wrapper">
              <FiSearch className="search-icon" size={18} />
              <input
                ref={searchInputRef}
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
            
            <div className="filters-group">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`filter-btn ${showFilters ? 'active' : ''}`}
              >
                <FiFilter size={16} />
                Filter
              </button>
              
              <div className="view-toggle">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                >
                  <FiGrid size={16} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                >
                  <FiList size={16} />
                </button>
              </div>
            </div>
          </div>
          
          {showFilters && (
            <div className="filter-panel">
              <div className="filter-controls">
                <div className="sort-group">
                  <span className="sort-label">Sort by:</span>
                  <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="sort-select">
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="name-asc">Name (A-Z)</option>
                    <option value="name-desc">Name (Z-A)</option>
                  </select>
                </div>
                
                <div className="result-count">
                  Showing {filteredCategories.length} of {categories.length} categories
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-info">
              <p className="stat-label">Total Categories</p>
              <p className="stat-value">{categories.length}</p>
            </div>
            <div className="stat-icon purple">
              <FiFolder size={20} />
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-info">
              <p className="stat-label">This Month</p>
              <p className="stat-value">{getCurrentMonthCount()}</p>
            </div>
            <div className="stat-icon green">
              <FaChartLine size={20} />
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-info">
              <p className="stat-label">Active Categories</p>
              <p className="stat-value">{categories.length}</p>
            </div>
            <div className="stat-icon teal">
              <FaUserMd size={20} />
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-info">
              <p className="stat-label">Search Results</p>
              <p className="stat-value">{filteredCategories.length}</p>
            </div>
            <div className="stat-icon amber">
              <FiSearch size={20} />
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="loading-state">
            <FiLoader className="spinner" size={48} />
            <p>Loading categories...</p>
          </div>
        )}

        {/* Main Content */}
        {!loading && (
          <>
            {filteredCategories.length > 0 ? (
              viewMode === 'grid' ? (
                <div className="grid-view">
                  {currentItems.map((category, index) => (
                    <div key={category._id} className="grid-card" style={{ animationDelay: `${index * 50}ms` }}>
                      <div className="card-header-gradient">
                        <div className="card-icon-wrapper">
                          <FiScissors size={24} />
                        </div>
                        <button onClick={() => handleViewDetails(category)} className="view-details-btn">
                          <FiEye size={14} />
                        </button>
                      </div>
                      
                      <div className="card-content">
                        <h3 className="card-title">{category.name}</h3>
                        
                        <div className="card-meta">
                          <span><FaRegHospital size={12} /> Surgery Category</span>
                          <span><FiCalendar size={12} /> {new Date(category.createdAt).toLocaleDateString()}</span>
                        </div>
                        
                        <div className="card-actions">
                          <button onClick={() => handleEdit(category)} className="edit-btn">
                            <FiEdit2 size={14} />
                            Edit
                          </button>
                          <button onClick={() => handleDeleteClick(category)} className="delete-btn">
                            <FiTrash2 size={14} />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="list-view">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Category Name</th>
                        <th>Created Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentItems.map((category, index) => (
                        <tr key={category._id}>
                          <td>{indexOfFirstItem + index + 1}</td>
                          <td>
                            <div className="category-cell">
                              <div className="category-icon-small">
                                <FiScissors size={16} />
                              </div>
                              <span className="category-name">{category.name}</span>
                            </div>
                          </td>
                          <td>
                            <div className="date-cell">
                              <FiCalendar size={14} />
                              {new Date(category.createdAt).toLocaleDateString()}
                            </div>
                          </td>
                          <td>
                            <div className="action-buttons">
                              <button onClick={() => handleViewDetails(category)} className="icon-btn" title="View">
                                <FiEye size={16} />
                              </button>
                              <button onClick={() => handleEdit(category)} className="icon-btn" title="Edit">
                                <FiEdit2 size={16} />
                              </button>
                              <button onClick={() => handleDeleteClick(category)} className="icon-btn delete" title="Delete">
                                <FiTrash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            ) : (
              <div className="empty-state">
                <div className="empty-icon">
                  <FiScissors size={48} />
                </div>
                <h3>{searchTerm ? 'No results found' : 'No surgery categories yet'}</h3>
                <p>
                  {searchTerm 
                    ? `No categories match "${searchTerm}". Try a different search term.`
                    : 'Create your first surgery category to start organizing surgical procedures.'}
                </p>
                {!searchTerm && (
                  <button onClick={handleCreate} className="create-empty-btn">
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
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <div className="modal-header-icon">
                  <FiScissors size={20} />
                </div>
                <h2>{editingCategory ? 'Edit Category' : 'Create Category'}</h2>
                <button onClick={() => { setIsModalOpen(false); resetForm(); }} className="modal-close">
                  <FiX size={22} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="modal-form">
                <div className="form-group">
                  <label>Category Name <span className="required">*</span></label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ name: e.target.value })}
                    placeholder="e.g., Cardiac Surgery, Orthopedic Surgery"
                    autoFocus
                    required
                  />
                  <p className="form-hint">Enter a unique name for the surgery category</p>
                </div>

                {formData.name && (
                  <div className="preview-box">
                    <p className="preview-label">Preview</p>
                    <div className="preview-content">
                      <FiScissors size={18} />
                      <span>{formData.name}</span>
                    </div>
                  </div>
                )}

                <div className="form-actions">
                  <button type="submit" disabled={submitting} className="submit-btn">
                    {submitting ? <FiLoader className="spinner-small" size={20} /> : (editingCategory ? 'Update' : 'Create')}
                  </button>
                  <button type="button" onClick={() => { setIsModalOpen(false); resetForm(); }} className="cancel-btn">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Modal */}
        {isDeleteModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content delete-modal">
              <div className="delete-icon-wrapper">
                <FiAlertCircle size={40} />
              </div>
              <h3>Delete Category</h3>
              <p>
                Are you sure you want to delete <strong>"{deleteTarget?.name}"</strong>? This action cannot be undone.
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

        {/* Details Modal */}
        {isDetailModalOpen && selectedCategory && (
          <div className="modal-overlay">
            <div className="modal-content detail-modal">
              <div className="detail-header">
                <div className="detail-header-icon">
                  <FiScissors size={24} />
                </div>
                <h2>Category Details</h2>
                <button onClick={() => setIsDetailModalOpen(false)} className="modal-close">
                  <FiX size={22} />
                </button>
              </div>
              
              <div className="detail-body">
                <div className="detail-item">
                  <span className="detail-label">Category Name</span>
                  <span className="detail-value">{selectedCategory.name}</span>
                </div>
                
                <div className="detail-item">
                  <span className="detail-label">Created Date</span>
                  <span className="detail-value">{new Date(selectedCategory.createdAt).toLocaleString()}</span>
                </div>
                
                <div className="detail-item">
                  <span className="detail-label">Last Updated</span>
                  <span className="detail-value">{new Date(selectedCategory.updatedAt).toLocaleString()}</span>
                </div>
              </div>
              
              <div className="detail-actions">
                <button onClick={() => { setIsDetailModalOpen(false); handleEdit(selectedCategory); }} className="detail-edit-btn">
                  Edit Category
                </button>
                <button onClick={() => setIsDetailModalOpen(false)} className="detail-close-btn">
                  Close
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

        .surgery-categories-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #f8fafc 100%);
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
        }

        .content-wrapper {
          max-width: 1400px;
          margin: 0 auto;
          padding: 32px 24px;
        }

        /* Header Styles */
        .header-section {
          margin-bottom: 28px;
        }

        .header-top {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
        }

        .header-title-group {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .header-icon {
          background: linear-gradient(135deg, #4f46e5, #7c3aed);
          padding: 14px;
          border-radius: 20px;
          box-shadow: 0 10px 25px -5px rgba(79, 70, 229, 0.3);
        }

        .header-icon svg {
          color: white;
        }

        .header-title {
          font-size: 28px;
          font-weight: 700;
          color: #0f172a;
          letter-spacing: -0.02em;
        }

        .header-subtitle {
          font-size: 14px;
          color: #64748b;
          margin-top: 4px;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .action-btn {
          padding: 10px;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          color: #64748b;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .action-btn:hover {
          background: #f8fafc;
          color: #4f46e5;
          border-color: #c7d2fe;
        }

        .create-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          background: linear-gradient(135deg, #4f46e5, #7c3aed);
          border: none;
          border-radius: 14px;
          color: white;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.2);
        }

        .create-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 15px -3px rgba(79, 70, 229, 0.3);
        }

        /* Search & Filters Card */
        .search-filters-card {
          background: white;
          border-radius: 24px;
          padding: 20px;
          margin-bottom: 28px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
          border: 1px solid #e2e8f0;
        }

        .search-filters-row {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 16px;
        }

        .search-wrapper {
          flex: 1;
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
          padding: 12px 40px 12px 42px;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          font-size: 14px;
          transition: all 0.2s ease;
        }

        .search-input:focus {
          outline: none;
          border-color: #4f46e5;
          box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
        }

        .clear-search {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #94a3b8;
          cursor: pointer;
        }

        .filters-group {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .filter-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          color: #64748b;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .filter-btn.active {
          background: #eef2ff;
          border-color: #c7d2fe;
          color: #4f46e5;
        }

        .view-toggle {
          display: flex;
          gap: 4px;
          background: #f1f5f9;
          padding: 4px;
          border-radius: 14px;
        }

        .view-btn {
          padding: 8px 12px;
          background: transparent;
          border: none;
          border-radius: 10px;
          color: #64748b;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .view-btn.active {
          background: white;
          color: #4f46e5;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .filter-panel {
          margin-top: 16px;
          padding-top: 16px;
          border-top: 1px solid #e2e8f0;
        }

        .filter-controls {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }

        .sort-group {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .sort-label {
          font-size: 14px;
          color: #64748b;
        }

        .sort-select {
          padding: 8px 12px;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          font-size: 14px;
          background: white;
          cursor: pointer;
        }

        .result-count {
          font-size: 14px;
          color: #64748b;
        }

        /* Stats Grid */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 20px;
          margin-bottom: 28px;
        }

        .stat-card {
          background: white;
          border-radius: 20px;
          padding: 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border: 1px solid #e2e8f0;
          transition: all 0.2s ease;
        }

        .stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);
        }

        .stat-label {
          font-size: 13px;
          color: #64748b;
          margin-bottom: 6px;
        }

        .stat-value {
          font-size: 28px;
          font-weight: 700;
          color: #0f172a;
        }

        .stat-icon {
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 16px;
        }

        .stat-icon.purple { background: #eef2ff; color: #4f46e5; }
        .stat-icon.green { background: #ecfdf5; color: #10b981; }
        .stat-icon.teal { background: #f0fdfa; color: #14b8a6; }
        .stat-icon.amber { background: #fffbeb; color: #f59e0b; }

        /* Grid View */
        .grid-view {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 24px;
        }

        .grid-card {
          background: white;
          border-radius: 24px;
          overflow: hidden;
          transition: all 0.3s ease;
          border: 1px solid #e2e8f0;
          animation: fadeIn 0.3s ease-out forwards;
          opacity: 0;
        }

        .grid-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 25px -12px rgba(0, 0, 0, 0.1);
        }

        .card-header-gradient {
          height: 100px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          position: relative;
          display: flex;
          justify-content: center;
          align-items: flex-end;
        }

        .card-icon-wrapper {
          position: absolute;
          bottom: -24px;
          background: white;
          padding: 12px;
          border-radius: 20px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        }

        .card-icon-wrapper svg {
          color: #4f46e5;
        }

        .view-details-btn {
          position: absolute;
          top: 12px;
          right: 12px;
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(4px);
          border: none;
          padding: 8px;
          border-radius: 10px;
          color: white;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .view-details-btn:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        .card-content {
          padding: 32px 20px 20px;
          text-align: center;
        }

        .card-title {
          font-size: 18px;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 12px;
          line-height: 1.3;
        }

        .card-meta {
          display: flex;
          justify-content: center;
          gap: 16px;
          font-size: 11px;
          color: #94a3b8;
          margin-bottom: 20px;
        }

        .card-meta span {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .card-actions {
          display: flex;
          gap: 12px;
        }

        .edit-btn, .delete-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 10px;
          border-radius: 14px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
        }

        .edit-btn {
          background: #fef3c7;
          color: #d97706;
        }

        .edit-btn:hover {
          background: #fde68a;
        }

        .delete-btn {
          background: #fee2e2;
          color: #dc2626;
        }

        .delete-btn:hover {
          background: #fecaca;
        }

        /* List View */
        .list-view {
          background: white;
          border-radius: 24px;
          border: 1px solid #e2e8f0;
          overflow: hidden;
        }

        .data-table {
          width: 100%;
          border-collapse: collapse;
        }

        .data-table th {
          text-align: left;
          padding: 16px 20px;
          background: #f8fafc;
          font-weight: 600;
          font-size: 13px;
          color: #475569;
          border-bottom: 1px solid #e2e8f0;
        }

        .data-table td {
          padding: 16px 20px;
          font-size: 14px;
          color: #334155;
          border-bottom: 1px solid #f1f5f9;
        }

        .data-table tr:hover {
          background: #f8fafc;
        }

        .category-cell {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .category-icon-small {
          width: 32px;
          height: 32px;
          background: #eef2ff;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #4f46e5;
        }

        .category-name {
          font-weight: 500;
        }

        .date-cell {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #64748b;
        }

        .action-buttons {
          display: flex;
          gap: 10px;
        }

        .icon-btn {
          padding: 8px;
          background: none;
          border: none;
          border-radius: 8px;
          color: #64748b;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .icon-btn:hover {
          background: #f1f5f9;
          color: #4f46e5;
        }

        .icon-btn.delete:hover {
          background: #fee2e2;
          color: #dc2626;
        }

        /* Loading State */
        .loading-state {
          background: white;
          border-radius: 24px;
          padding: 80px;
          text-align: center;
          border: 1px solid #e2e8f0;
        }

        .spinner {
          animation: spin 1s linear infinite;
          color: #4f46e5;
          margin-bottom: 16px;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        /* Empty State */
        .empty-state {
          background: white;
          border-radius: 24px;
          padding: 60px;
          text-align: center;
          border: 1px solid #e2e8f0;
        }

        .empty-icon {
          width: 80px;
          height: 80px;
          background: #f1f5f9;
          border-radius: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          color: #94a3b8;
        }

        .empty-state h3 {
          font-size: 20px;
          color: #0f172a;
          margin-bottom: 8px;
        }

        .empty-state p {
          color: #64748b;
          max-width: 400px;
          margin: 0 auto 24px;
        }

        .create-empty-btn {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 12px 24px;
          background: #4f46e5;
          border: none;
          border-radius: 16px;
          color: white;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .create-empty-btn:hover {
          background: #4338ca;
        }

        /* Pagination */
        .pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 10px;
          margin-top: 32px;
        }

        .page-nav {
          padding: 10px;
          border: 1px solid #e2e8f0;
          background: white;
          border-radius: 12px;
          color: #64748b;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .page-nav:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .page-nav:not(:disabled):hover {
          background: #f8fafc;
          color: #4f46e5;
        }

        .page-numbers {
          display: flex;
          gap: 6px;
        }

        .page-number {
          width: 38px;
          height: 38px;
          border: 1px solid #e2e8f0;
          background: white;
          border-radius: 12px;
          color: #64748b;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .page-number.active {
          background: #4f46e5;
          border-color: #4f46e5;
          color: white;
        }

        .page-number:not(.active):hover {
          background: #f8fafc;
          border-color: #c7d2fe;
        }

        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
          animation: fadeIn 0.2s ease-out;
        }

        .modal-content {
          background: white;
          border-radius: 32px;
          max-width: 500px;
          width: 100%;
          animation: slideUp 0.3s ease-out;
          overflow: hidden;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .modal-header {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 20px 24px;
          background: linear-gradient(135deg, #4f46e5, #7c3aed);
          color: white;
        }

        .modal-header-icon {
          background: rgba(255, 255, 255, 0.2);
          padding: 8px;
          border-radius: 14px;
        }

        .modal-header h2 {
          flex: 1;
          font-size: 20px;
          font-weight: 600;
        }

        .modal-close {
          background: rgba(255, 255, 255, 0.2);
          border: none;
          border-radius: 10px;
          padding: 6px;
          color: white;
          cursor: pointer;
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
          transition: all 0.2s ease;
        }

        .form-group input:focus {
          outline: none;
          border-color: #4f46e5;
          box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
        }

        .form-hint {
          font-size: 12px;
          color: #94a3b8;
          margin-top: 6px;
        }

        .preview-box {
          background: #eef2ff;
          border-radius: 16px;
          padding: 16px;
          margin-bottom: 24px;
        }

        .preview-label {
          font-size: 12px;
          font-weight: 500;
          color: #4f46e5;
          margin-bottom: 8px;
        }

        .preview-content {
          display: flex;
          align-items: center;
          gap: 10px;
          font-weight: 500;
          color: #1e293b;
        }

        .form-actions {
          display: flex;
          gap: 12px;
        }

        .submit-btn {
          flex: 1;
          padding: 12px;
          background: #4f46e5;
          border: none;
          border-radius: 14px;
          color: white;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .submit-btn:hover:not(:disabled) {
          background: #4338ca;
        }

        .submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .cancel-btn {
          flex: 1;
          padding: 12px;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          color: #64748b;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .cancel-btn:hover {
          background: #f8fafc;
        }

        /* Delete Modal Specific */
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
          color: #0f172a;
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
          color: #64748b;
          font-weight: 600;
          cursor: pointer;
        }

        /* Detail Modal */
        .detail-header {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 20px 24px;
          background: linear-gradient(135deg, #4f46e5, #7c3aed);
          color: white;
        }

        .detail-header-icon {
          background: rgba(255, 255, 255, 0.2);
          padding: 10px;
          border-radius: 16px;
        }

        .detail-header h2 {
          flex: 1;
          font-size: 20px;
          font-weight: 600;
        }

        .detail-body {
          padding: 24px;
        }

        .detail-item {
          padding: 14px 0;
          border-bottom: 1px solid #f1f5f9;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .detail-item:last-child {
          border-bottom: none;
        }

        .detail-label {
          font-size: 14px;
          color: #64748b;
        }

        .detail-value {
          font-weight: 500;
          color: #1e293b;
        }

        .detail-actions {
          display: flex;
          gap: 12px;
          padding: 20px 24px 24px;
          border-top: 1px solid #f1f5f9;
        }

        .detail-edit-btn {
          flex: 1;
          padding: 12px;
          background: #f59e0b;
          border: none;
          border-radius: 14px;
          color: white;
          font-weight: 600;
          cursor: pointer;
        }

        .detail-close-btn {
          flex: 1;
          padding: 12px;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          color: #64748b;
          font-weight: 600;
          cursor: pointer;
        }

        .spinner-small {
          animation: spin 1s linear infinite;
          margin: 0 auto;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .content-wrapper {
            padding: 20px 16px;
          }
          
          .header-title {
            font-size: 22px;
          }
          
          .grid-view {
            grid-template-columns: 1fr;
          }
          
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          
          .data-table th, .data-table td {
            padding: 12px;
          }
          
          .modal-content {
            margin: 16px;
          }
        }
      `}</style>
    </div>
  );
};

export default SurgeryCategories;