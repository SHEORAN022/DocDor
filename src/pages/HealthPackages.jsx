// src/pages/HealthPackages.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import { 
  FiPlus, FiEdit2, FiTrash2, FiSearch, FiX, FiLoader, 
  FiChevronLeft, FiChevronRight, FiRefreshCw, FiDownload,
  FiFilter, FiEye, FiTag, FiDollarSign, FiCheckCircle,
  FiXCircle, FiClock, FiStar
} from 'react-icons/fi';
import { FaHeartbeat, FaHospitalUser, FaStethoscope, FaAmbulance } from 'react-icons/fa';

const API_URL = 'https://userside-x164.onrender.com/api/health-package';

const HealthPackages = () => {
  const [packages, setPackages] = useState([]);
  const [filteredPackages, setFilteredPackages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    avgPrice: 0
  });

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    testCount: '',
    includedTests: [],
    originalPrice: '',
    currentPrice: '',
    tag: '',
    category: '',
    isActive: true
  });
  
  const [testInput, setTestInput] = useState('');

  // Fetch data
  useEffect(() => {
    fetchPackages();
    fetchCategories();
  }, []);

  // Filter packages
  useEffect(() => {
    let result = [...packages];
    
    if (searchTerm.trim() !== '') {
      result = result.filter(pkg =>
        pkg.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pkg.subtitle?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (statusFilter !== 'ALL') {
      result = result.filter(pkg => pkg.isActive === (statusFilter === 'ACTIVE'));
    }
    
    if (categoryFilter !== 'ALL') {
      result = result.filter(pkg => pkg.category?._id === categoryFilter || pkg.category === categoryFilter);
    }
    
    result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    setFilteredPackages(result);
    setCurrentPage(1);
  }, [searchTerm, packages, statusFilter, categoryFilter]);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/all`);
      
      if (response.data.success) {
        setPackages(response.data.data || []);
        calculateStats(response.data.data || []);
      } else {
        toast.error(response.data.message || 'Failed to fetch packages');
      }
    } catch (error) {
      console.error('Error fetching packages:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch packages');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('https://userside-x164.onrender.com/api/health-package-category/all');
      if (response.data.success) {
        setCategories(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const calculateStats = (packagesData) => {
    const total = packagesData.length;
    const active = packagesData.filter(p => p.isActive).length;
    const inactive = total - active;
    const totalPrice = packagesData.reduce((sum, p) => sum + (p.currentPrice || 0), 0);
    const avgPrice = total > 0 ? totalPrice / total : 0;
    
    setStats({ total, active, inactive, avgPrice });
  };

  const handleAddTest = () => {
    if (testInput.trim()) {
      setFormData(prev => ({
        ...prev,
        includedTests: [...prev.includedTests, testInput.trim()]
      }));
      setTestInput('');
    }
  };

  const handleRemoveTest = (index) => {
    setFormData(prev => ({
      ...prev,
      includedTests: prev.includedTests.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!formData.title) {
      setError('Package title is required');
      return;
    }
    if (!formData.testCount || formData.testCount <= 0) {
      setError('Valid test count is required');
      return;
    }
    if (!formData.originalPrice || formData.originalPrice <= 0) {
      setError('Valid original price is required');
      return;
    }
    if (!formData.currentPrice || formData.currentPrice <= 0) {
      setError('Valid current price is required');
      return;
    }
    if (!formData.category) {
      setError('Please select a category');
      return;
    }

    setSubmitting(true);
    try {
      const submitData = {
        title: formData.title.trim(),
        subtitle: formData.subtitle,
        testCount: Number(formData.testCount),
        includedTests: formData.includedTests,
        originalPrice: Number(formData.originalPrice),
        currentPrice: Number(formData.currentPrice),
        tag: formData.tag,
        category: formData.category,
        isActive: formData.isActive
      };

      let response;
      if (editingPackage) {
        response = await axios.put(`${API_URL}/update/${editingPackage._id}`, submitData);
        if (response.data.success) {
          toast.success('Package updated successfully');
        }
      } else {
        response = await axios.post(`${API_URL}/create`, submitData);
        if (response.data.success) {
          toast.success('Package created successfully');
        }
      }
      
      setIsModalOpen(false);
      resetForm();
      fetchPackages();
    } catch (error) {
      console.error('Error saving package:', error);
      setError(error.response?.data?.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteClick = (pkg) => {
    setDeleteTarget(pkg);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      const response = await axios.delete(`${API_URL}/delete/${deleteTarget._id}`);
      if (response.data.success) {
        toast.success('Package deleted successfully');
        setIsDeleteModalOpen(false);
        setDeleteTarget(null);
        fetchPackages();
      }
    } catch (error) {
      console.error('Error deleting package:', error);
      toast.error(error.response?.data?.message || 'Failed to delete package');
    }
  };

  const handleViewDetails = (pkg) => {
    setSelectedPackage(pkg);
    setIsDetailModalOpen(true);
  };

  const resetForm = () => {
    setEditingPackage(null);
    setFormData({
      title: '',
      subtitle: '',
      testCount: '',
      includedTests: [],
      originalPrice: '',
      currentPrice: '',
      tag: '',
      category: '',
      isActive: true
    });
    setTestInput('');
    setError('');
  };

  const handleEdit = (pkg) => {
    setEditingPackage(pkg);
    setFormData({
      title: pkg.title,
      subtitle: pkg.subtitle || '',
      testCount: pkg.testCount,
      includedTests: pkg.includedTests || [],
      originalPrice: pkg.originalPrice,
      currentPrice: pkg.currentPrice,
      tag: pkg.tag || '',
      category: pkg.category?._id || pkg.category,
      isActive: pkg.isActive
    });
    setIsModalOpen(true);
  };

  const handleRefresh = () => {
    fetchPackages();
    toast.success('Refreshed successfully');
  };

  const handleExport = () => {
    const exportData = filteredPackages.map(pkg => ({
      'ID': pkg._id,
      'Title': pkg.title,
      'Subtitle': pkg.subtitle,
      'Test Count': pkg.testCount,
      'Included Tests': pkg.includedTests?.join(', '),
      'Original Price': pkg.originalPrice,
      'Current Price': pkg.currentPrice,
      'Discount': `${Math.round(((pkg.originalPrice - pkg.currentPrice) / pkg.originalPrice) * 100)}%`,
      'Tag': pkg.tag,
      'Category': pkg.category?.title || 'N/A',
      'Status': pkg.isActive ? 'Active' : 'Inactive',
      'Created At': new Date(pkg.createdAt).toLocaleString()
    }));
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `health-packages-${new Date().toISOString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Exported successfully');
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPackages.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredPackages.length / itemsPerPage);

  const getDiscountPercentage = (original, current) => {
    if (!original || !current) return 0;
    return Math.round(((original - current) / original) * 100);
  };

  const getRandomIcon = (title) => {
    const icons = [FaHeartbeat, FaHospitalUser, FaStethoscope, FaAmbulance];
    const index = (title?.length || 0) % icons.length;
    return icons[index];
  };

  return (
    <div className="health-packages-container">
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1e293b',
            color: '#fff',
            borderRadius: '12px',
          },
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
                <h1 className="header-title">Health Packages</h1>
                <p className="header-subtitle">Manage health checkup packages and their details</p>
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
                Add Package
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-info">
              <p className="stat-label">Total Packages</p>
              <p className="stat-value">{stats.total}</p>
            </div>
            <div className="stat-icon purple">
              <FaHeartbeat size={20} />
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-info">
              <p className="stat-label">Active Packages</p>
              <p className="stat-value">{stats.active}</p>
            </div>
            <div className="stat-icon green">
              <FiCheckCircle size={20} />
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-info">
              <p className="stat-label">Inactive</p>
              <p className="stat-value">{stats.inactive}</p>
            </div>
            <div className="stat-icon red">
              <FiXCircle size={20} />
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-info">
              <p className="stat-label">Avg Price</p>
              <p className="stat-value">₹{stats.avgPrice.toLocaleString()}</p>
            </div>
            <div className="stat-icon orange">
              <FiDollarSign size={20} />
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="search-filters-card">
          <div className="search-filters-row">
            <div className="search-wrapper">
              <FiSearch className="search-icon" size={18} />
              <input
                type="text"
                placeholder="Search packages by name..."
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
              <select 
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value)}
                className="filter-select"
              >
                <option value="ALL">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
              
              <select 
                value={categoryFilter} 
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="filter-select"
              >
                <option value="ALL">All Categories</option>
                {categories.map(cat => (
                  <option key={cat._id} value={cat._id}>{cat.title}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="loading-state">
            <FiLoader className="spinner" size={48} />
            <p>Loading packages...</p>
          </div>
        )}

        {/* Packages Grid */}
        {!loading && (
          <>
            {filteredPackages.length > 0 ? (
              <div className="packages-grid">
                {currentItems.map((pkg) => {
                  const IconComponent = getRandomIcon(pkg.title);
                  const discount = getDiscountPercentage(pkg.originalPrice, pkg.currentPrice);
                  return (
                    <div key={pkg._id} className="package-card">
                      <div className="card-header">
                        <div className="card-icon">
                          <IconComponent size={24} />
                        </div>
                        {pkg.tag && (
                          <span className="tag-badge">{pkg.tag}</span>
                        )}
                        <div className={`status-badge ${pkg.isActive ? 'active' : 'inactive'}`}>
                          {pkg.isActive ? 'Active' : 'Inactive'}
                        </div>
                      </div>
                      
                      <div className="card-content">
                        <h3 className="package-title">{pkg.title}</h3>
                        {pkg.subtitle && (
                          <p className="package-subtitle">{pkg.subtitle}</p>
                        )}
                        
                        <div className="test-count">
                          <FiStar size={14} />
                          {pkg.testCount}+ Tests Included
                        </div>
                        
                        <div className="price-section">
                          <div className="original-price">₹{pkg.originalPrice?.toLocaleString()}</div>
                          <div className="current-price">₹{pkg.currentPrice?.toLocaleString()}</div>
                          <div className="discount-badge">{discount}% OFF</div>
                        </div>
                        
                        {pkg.includedTests && pkg.includedTests.length > 0 && (
                          <div className="included-tests">
                            <div className="tests-label">Included Tests:</div>
                            <div className="tests-list">
                              {pkg.includedTests.slice(0, 3).map((test, idx) => (
                                <span key={idx} className="test-tag">{test}</span>
                              ))}
                              {pkg.includedTests.length > 3 && (
                                <span className="test-tag more">+{pkg.includedTests.length - 3}</span>
                              )}
                            </div>
                          </div>
                        )}
                        
                        <div className="category-info">
                          <FiTag size={12} />
                          {pkg.category?.title || 'Uncategorized'}
                        </div>
                      </div>
                      
                      <div className="card-actions">
                        <button onClick={() => handleViewDetails(pkg)} className="view-btn">
                          <FiEye size={14} />
                          View
                        </button>
                        <button onClick={() => handleEdit(pkg)} className="edit-btn">
                          <FiEdit2 size={14} />
                          Edit
                        </button>
                        <button onClick={() => handleDeleteClick(pkg)} className="delete-btn">
                          <FiTrash2 size={14} />
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">
                  <FaHeartbeat size={48} />
                </div>
                <h3>{searchTerm ? 'No results found' : 'No packages yet'}</h3>
                <p>
                  {searchTerm 
                    ? `No packages match "${searchTerm}". Try a different search term.`
                    : 'Create your first health package to get started.'}
                </p>
                {!searchTerm && (
                  <button onClick={() => { resetForm(); setIsModalOpen(true); }} className="create-empty-btn">
                    <FiPlus size={18} />
                    Create First Package
                  </button>
                )}
              </div>
            )}

            {/* Pagination */}
            {filteredPackages.length > itemsPerPage && (
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
            <div className="modal-content large-modal">
              <div className="modal-header">
                <div className="modal-header-icon">
                  <FaHeartbeat size={20} />
                </div>
                <h2>{editingPackage ? 'Edit Package' : 'Create Package'}</h2>
                <button onClick={() => { setIsModalOpen(false); resetForm(); }} className="modal-close">
                  <FiX size={22} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="modal-form">
                {error && <div className="error-box">{error}</div>}
                
                <div className="form-grid">
                  <div className="form-group full-width">
                    <label>Package Title <span className="required">*</span></label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="e.g., Full Body Checkup, Wellness Package"
                    />
                  </div>
                  
                  <div className="form-group full-width">
                    <label>Subtitle</label>
                    <input
                      type="text"
                      value={formData.subtitle}
                      onChange={(e) => setFormData(prev => ({ ...prev, subtitle: e.target.value }))}
                      placeholder="Brief description of the package"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Test Count <span className="required">*</span></label>
                    <input
                      type="number"
                      value={formData.testCount}
                      onChange={(e) => setFormData(prev => ({ ...prev, testCount: e.target.value }))}
                      placeholder="Number of tests"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Category <span className="required">*</span></label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    >
                      <option value="">Select Category</option>
                      {categories.map(cat => (
                        <option key={cat._id} value={cat._id}>{cat.title}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label>Original Price (₹) <span className="required">*</span></label>
                    <input
                      type="number"
                      value={formData.originalPrice}
                      onChange={(e) => setFormData(prev => ({ ...prev, originalPrice: e.target.value }))}
                      placeholder="Original price"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Current Price (₹) <span className="required">*</span></label>
                    <input
                      type="number"
                      value={formData.currentPrice}
                      onChange={(e) => setFormData(prev => ({ ...prev, currentPrice: e.target.value }))}
                      placeholder="Discounted price"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Tag</label>
                    <input
                      type="text"
                      value={formData.tag}
                      onChange={(e) => setFormData(prev => ({ ...prev, tag: e.target.value }))}
                      placeholder="e.g., Popular, Best Seller, New"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Status</label>
                    <select
                      value={formData.isActive}
                      onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.value === 'true' }))}
                    >
                      <option value="true">Active</option>
                      <option value="false">Inactive</option>
                    </select>
                  </div>
                  
                  <div className="form-group full-width">
                    <label>Included Tests</label>
                    <div className="tests-input-group">
                      <input
                        type="text"
                        value={testInput}
                        onChange={(e) => setTestInput(e.target.value)}
                        placeholder="Enter test name"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTest())}
                      />
                      <button type="button" onClick={handleAddTest} className="add-test-btn">Add</button>
                    </div>
                    <div className="tests-list-form">
                      {formData.includedTests.map((test, idx) => (
                        <span key={idx} className="test-badge">
                          {test}
                          <button type="button" onClick={() => handleRemoveTest(idx)} className="remove-test">×</button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="form-actions">
                  <button type="submit" disabled={submitting} className="submit-btn">
                    {submitting ? <FiLoader className="spinner-small" size={20} /> : (editingPackage ? 'Update Package' : 'Create Package')}
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
              <h3>Delete Package</h3>
              <p>
                Are you sure you want to delete <strong>"{deleteTarget?.title}"</strong>? This action cannot be undone.
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
        {isDetailModalOpen && selectedPackage && (
          <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setIsDetailModalOpen(false); }}>
            <div className="modal-content detail-modal">
              <div className="modal-header">
                <div className="modal-header-icon">
                  <FaHeartbeat size={20} />
                </div>
                <h2>Package Details</h2>
                <button onClick={() => setIsDetailModalOpen(false)} className="modal-close">
                  <FiX size={22} />
                </button>
              </div>
              
              <div className="detail-body">
                <div className="detail-section">
                  <div className="detail-item">
                    <span className="detail-label">Package Name</span>
                    <span className="detail-value">{selectedPackage.title}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Subtitle</span>
                    <span className="detail-value">{selectedPackage.subtitle || '—'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Category</span>
                    <span className="detail-value">{selectedPackage.category?.title || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Test Count</span>
                    <span className="detail-value">{selectedPackage.testCount} tests</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Original Price</span>
                    <span className="detail-value price">₹{selectedPackage.originalPrice?.toLocaleString()}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Current Price</span>
                    <span className="detail-value price">₹{selectedPackage.currentPrice?.toLocaleString()}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Discount</span>
                    <span className="detail-value discount">{getDiscountPercentage(selectedPackage.originalPrice, selectedPackage.currentPrice)}% OFF</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Tag</span>
                    <span className="detail-value">{selectedPackage.tag || '—'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Status</span>
                    <span className={`detail-value status ${selectedPackage.isActive ? 'active' : 'inactive'}`}>
                      {selectedPackage.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Created At</span>
                    <span className="detail-value">{new Date(selectedPackage.createdAt).toLocaleString()}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Last Updated</span>
                    <span className="detail-value">{new Date(selectedPackage.updatedAt).toLocaleString()}</span>
                  </div>
                </div>

                {selectedPackage.includedTests && selectedPackage.includedTests.length > 0 && (
                  <div className="detail-section">
                    <h3 className="section-title">Included Tests</h3>
                    <div className="tests-grid">
                      {selectedPackage.includedTests.map((test, idx) => (
                        <div key={idx} className="test-item">
                          <FiCheckCircle size={14} />
                          {test}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="detail-actions">
                <button onClick={() => { setIsDetailModalOpen(false); handleEdit(selectedPackage); }} className="detail-edit-btn">
                  <FiEdit2 size={16} />
                  Edit Package
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
        .health-packages-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
          font-family: 'Inter', system-ui, sans-serif;
        }

        .content-wrapper {
          max-width: 1400px;
          margin: 0 auto;
          padding: 32px 24px;
        }

        .header-section { margin-bottom: 32px; }
        .header-top { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 20px; }
        .header-title-group { display: flex; align-items: center; gap: 16px; }
        .header-icon { background: linear-gradient(135deg, #0284c7, #0369a1); padding: 14px; border-radius: 20px; }
        .header-icon svg { color: white; }
        .header-title { font-size: 28px; font-weight: 700; color: #1e293b; }
        .header-subtitle { font-size: 14px; color: #64748b; margin-top: 4px; }
        .header-actions { display: flex; gap: 12px; }
        .action-btn { padding: 10px; background: white; border: 1px solid #e2e8f0; border-radius: 14px; cursor: pointer; }
        .create-btn { display: flex; align-items: center; gap: 8px; padding: 10px 20px; background: linear-gradient(135deg, #0284c7, #0369a1); border: none; border-radius: 14px; color: white; font-weight: 600; cursor: pointer; }

        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 28px; }
        .stat-card { background: white; border-radius: 20px; padding: 20px; display: flex; justify-content: space-between; align-items: center; border: 1px solid #e2e8f0; }
        .stat-label { font-size: 13px; color: #64748b; margin-bottom: 6px; }
        .stat-value { font-size: 28px; font-weight: 700; color: #1e293b; }
        .stat-icon { width: 48px; height: 48px; border-radius: 16px; display: flex; align-items: center; justify-content: center; }
        .stat-icon.purple { background: #eef2ff; color: #8b5cf6; }
        .stat-icon.green { background: #ecfdf5; color: #10b981; }
        .stat-icon.red { background: #fef2f2; color: #ef4444; }
        .stat-icon.orange { background: #fff7ed; color: #f59e0b; }

        .search-filters-card { background: white; border-radius: 20px; padding: 20px; margin-bottom: 28px; border: 1px solid #e2e8f0; }
        .search-filters-row { display: flex; gap: 16px; align-items: center; flex-wrap: wrap; }
        .search-wrapper { flex: 1; position: relative; }
        .search-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: #94a3b8; }
        .search-input { width: 100%; padding: 12px 40px; border: 1px solid #e2e8f0; border-radius: 14px; }
        .search-input:focus { outline: none; border-color: #0284c7; }
        .clear-search { position: absolute; right: 14px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; }
        .filters-group { display: flex; gap: 12px; }
        .filter-select { padding: 10px 14px; border: 1px solid #e2e8f0; border-radius: 12px; background: white; }

        .packages-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(360px, 1fr)); gap: 24px; margin-bottom: 32px; }
        .package-card { background: white; border-radius: 24px; overflow: hidden; transition: all 0.3s; border: 1px solid #e2e8f0; }
        .package-card:hover { transform: translateY(-4px); box-shadow: 0 20px 25px -12px rgba(0,0,0,0.15); }

        .card-header { padding: 20px; background: linear-gradient(135deg, #0284c7, #0369a1); position: relative; display: flex; align-items: center; gap: 12px; }
        .card-icon { width: 48px; height: 48px; background: rgba(255,255,255,0.2); border-radius: 16px; display: flex; align-items: center; justify-content: center; color: white; }
        .tag-badge { background: #fbbf24; color: #1e293b; padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; }
        .status-badge { margin-left: auto; padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; }
        .status-badge.active { background: #10b981; color: white; }
        .status-badge.inactive { background: #ef4444; color: white; }

        .card-content { padding: 20px; }
        .package-title { font-size: 20px; font-weight: 700; color: #1e293b; margin-bottom: 8px; }
        .package-subtitle { font-size: 13px; color: #64748b; margin-bottom: 12px; }
        .test-count { display: inline-flex; align-items: center; gap: 6px; background: #f1f5f9; padding: 4px 12px; border-radius: 20px; font-size: 12px; margin-bottom: 16px; }
        .price-section { display: flex; align-items: baseline; gap: 12px; margin-bottom: 16px; }
        .original-price { font-size: 14px; color: #94a3b8; text-decoration: line-through; }
        .current-price { font-size: 24px; font-weight: 700; color: #0284c7; }
        .discount-badge { background: #fee2e2; color: #dc2626; padding: 4px 8px; border-radius: 8px; font-size: 11px; font-weight: 600; }
        .included-tests { margin-bottom: 12px; }
        .tests-label { font-size: 11px; font-weight: 600; color: #64748b; margin-bottom: 6px; }
        .tests-list { display: flex; flex-wrap: wrap; gap: 6px; }
        .test-tag { background: #f1f5f9; padding: 4px 10px; border-radius: 8px; font-size: 11px; color: #475569; }
        .test-tag.more { background: #e0f2fe; color: #0284c7; }
        .category-info { display: flex; align-items: center; gap: 6px; font-size: 12px; color: #64748b; padding-top: 12px; border-top: 1px solid #e2e8f0; }

        .card-actions { display: flex; gap: 12px; padding: 16px 20px; border-top: 1px solid #e2e8f0; }
        .view-btn, .edit-btn, .delete-btn { flex: 1; padding: 8px; border: none; border-radius: 10px; font-size: 13px; font-weight: 500; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; }
        .view-btn { background: #e0f2fe; color: #0284c7; }
        .edit-btn { background: #fef3c7; color: #d97706; }
        .delete-btn { background: #fee2e2; color: #dc2626; }

        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 1000; }
        .modal-content { background: white; border-radius: 32px; max-width: 700px; width: 90%; max-height: 90vh; overflow-y: auto; }
        .large-modal { max-width: 700px; }
        .modal-header { display: flex; align-items: center; gap: 12px; padding: 20px 24px; background: linear-gradient(135deg, #0284c7, #0369a1); color: white; position: sticky; top: 0; }
        .modal-header-icon { background: rgba(255,255,255,0.2); padding: 8px; border-radius: 12px; }
        .modal-header h2 { flex: 1; font-size: 20px; }
        .modal-close { background: rgba(255,255,255,0.2); border: none; border-radius: 10px; padding: 6px; cursor: pointer; color: white; }

        .modal-form { padding: 24px; }
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .form-group.full-width { grid-column: span 2; }
        .form-group label { display: block; font-size: 13px; font-weight: 600; color: #334155; margin-bottom: 6px; }
        .required { color: #ef4444; }
        .form-group input, .form-group select { width: 100%; padding: 10px 14px; border: 1px solid #e2e8f0; border-radius: 12px; }
        .form-group input:focus, .form-group select:focus { outline: none; border-color: #0284c7; }

        .tests-input-group { display: flex; gap: 8px; margin-bottom: 12px; }
        .tests-input-group input { flex: 1; }
        .add-test-btn { padding: 10px 20px; background: #0284c7; color: white; border: none; border-radius: 12px; cursor: pointer; }
        .tests-list-form { display: flex; flex-wrap: wrap; gap: 8px; }
        .test-badge { background: #e0f2fe; color: #0284c7; padding: 6px 12px; border-radius: 8px; font-size: 12px; display: flex; align-items: center; gap: 8px; }
        .remove-test { background: none; border: none; cursor: pointer; color: #ef4444; font-size: 16px; }

        .form-actions { display: flex; gap: 12px; margin-top: 24px; }
        .submit-btn { flex: 1; padding: 12px; background: linear-gradient(135deg, #0284c7, #0369a1); border: none; border-radius: 14px; color: white; font-weight: 600; cursor: pointer; }
        .cancel-btn { flex: 1; padding: 12px; background: white; border: 1px solid #e2e8f0; border-radius: 14px; cursor: pointer; }

        .delete-modal { text-align: center; max-width: 400px; }
        .delete-icon-wrapper { width: 80px; height: 80px; background: #fee2e2; border-radius: 40px; display: flex; align-items: center; justify-content: center; margin: 24px auto 16px; color: #dc2626; }
        .delete-actions { display: flex; gap: 12px; padding: 0 24px 24px; }
        .confirm-delete-btn { flex: 1; padding: 12px; background: #dc2626; border: none; border-radius: 14px; color: white; cursor: pointer; }
        .cancel-delete-btn { flex: 1; padding: 12px; background: white; border: 1px solid #e2e8f0; border-radius: 14px; cursor: pointer; }

        .detail-modal { max-width: 550px; }
        .detail-body { padding: 24px; }
        .detail-section { margin-bottom: 20px; }
        .section-title { font-size: 16px; font-weight: 600; color: #1e293b; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 2px solid #e0f2fe; }
        .detail-item { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #f1f5f9; }
        .detail-label { color: #64748b; font-size: 13px; }
        .detail-value { font-weight: 500; color: #1e293b; }
        .detail-value.price { color: #0284c7; font-weight: 700; }
        .detail-value.discount { color: #dc2626; font-weight: 600; }
        .detail-value.status.active { color: #10b981; }
        .detail-value.status.inactive { color: #ef4444; }
        .tests-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; }
        .test-item { display: flex; align-items: center; gap: 8px; padding: 6px 0; font-size: 13px; color: #475569; }

        .detail-actions { display: flex; gap: 12px; padding: 20px 24px; border-top: 1px solid #f1f5f9; }
        .detail-edit-btn { flex: 1; display: flex; align-items: center; justify-content: center; gap: 8px; padding: 12px; background: #0284c7; color: white; border: none; border-radius: 14px; cursor: pointer; }
        .detail-close-btn { flex: 1; padding: 12px; background: white; border: 1px solid #e2e8f0; border-radius: 14px; cursor: pointer; }

        .loading-state { background: white; border-radius: 24px; padding: 60px; text-align: center; }
        .spinner { animation: spin 1s linear infinite; color: #0284c7; }
        @keyframes spin { to { transform: rotate(360deg); } }

        .empty-state { background: white; border-radius: 24px; padding: 60px; text-align: center; }
        .empty-icon { width: 80px; height: 80px; background: #e0f2fe; border-radius: 40px; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; color: #0284c7; }
        .create-empty-btn { display: inline-flex; align-items: center; gap: 10px; padding: 12px 24px; background: linear-gradient(135deg, #0284c7, #0369a1); border: none; border-radius: 16px; color: white; font-weight: 600; cursor: pointer; }

        .pagination { display: flex; justify-content: center; gap: 10px; margin-top: 24px; }
        .page-nav { padding: 8px 12px; border: 1px solid #e2e8f0; background: white; border-radius: 10px; cursor: pointer; }
        .page-numbers { display: flex; gap: 6px; }
        .page-number { width: 36px; height: 36px; border: 1px solid #e2e8f0; background: white; border-radius: 10px; cursor: pointer; }
        .page-number.active { background: #0284c7; border-color: #0284c7; color: white; }

        .error-box { background: #fee2e2; color: #dc2626; padding: 12px; border-radius: 12px; font-size: 13px; margin-bottom: 20px; }

        @media (max-width: 768px) {
          .content-wrapper { padding: 20px 16px; }
          .packages-grid { grid-template-columns: 1fr; }
          .form-grid { grid-template-columns: 1fr; }
          .form-group.full-width { grid-column: span 1; }
        }
      `}</style>
    </div>
  );
};

export default HealthPackages;