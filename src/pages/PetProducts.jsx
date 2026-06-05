// src/pages/PetProducts.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import { 
  FiPlus, FiEdit2, FiTrash2, FiSearch, FiX, FiLoader, 
  FiGrid, FiList, FiChevronLeft, FiChevronRight,
  FiEye, FiRefreshCw, FiDownload, FiFilter, FiPackage,
  FiDollarSign, FiTag, FiHeart, FiStar, FiBox
} from 'react-icons/fi';
import { FaPaw, FaDog, FaCat, FaFish, FaKiwiBird, FaHippo, FaBone, FaCartPlus } from 'react-icons/fa';

const API_URL = 'https://userside-x164.onrender.com/api';

const PetProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9);
  const [sortBy, setSortBy] = useState('newest');
  const [imagePreview, setImagePreview] = useState('');
  const [filters, setFilters] = useState({
    petCategory: '',
    needType: '',
    ageType: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    shortDescription: '',
    description: '',
    petCategory: '',
    needType: 'food',
    price: '',
    weight: '',
    flavor: '',
    ageType: 'all',
    rating: '4.5',
    stock: '1',
    image: null
  });

  const needTypeOptions = [
    { value: 'medicines', label: 'Medicines', icon: '💊', color: 'red' },
    { value: 'food', label: 'Food', icon: '🍖', color: 'green' },
    { value: 'toys', label: 'Toys', icon: '🎾', color: 'purple' },
    { value: 'accessories', label: 'Accessories', icon: '🪢', color: 'blue' }
  ];

  const ageTypeOptions = [
    { value: 'kids', label: 'Kids', icon: '🐣' },
    { value: 'adult', label: 'Adult', icon: '🐕' },
    { value: 'all', label: 'All Ages', icon: '🐾' }
  ];

  // Fetch products and categories
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [filters]);

  // Filter and sort logic
  useEffect(() => {
    let result = [...products];
    
    if (searchTerm.trim() !== '') {
      result = result.filter(product =>
        product.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.shortDescription?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    switch (sortBy) {
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'oldest':
        result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case 'price-low':
        result.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'price-high':
        result.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case 'name-asc':
        result.sort((a, b) => a.title?.localeCompare(b.title));
        break;
      case 'name-desc':
        result.sort((a, b) => b.title?.localeCompare(a.title));
        break;
      default:
        break;
    }
    
    setFilteredProducts(result);
    setCurrentPage(1);
  }, [searchTerm, products, sortBy]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      if (filters.petCategory) queryParams.append('petCategory', filters.petCategory);
      if (filters.needType) queryParams.append('needType', filters.needType);
      if (filters.ageType) queryParams.append('ageType', filters.ageType);
      
      const url = `${API_URL}/pet-products${queryParams.toString() ? `?${queryParams}` : ''}`;
      const response = await axios.get(url);
      
      if (response.data.success) {
        setProducts(response.data.data || []);
        setFilteredProducts(response.data.data || []);
      } else {
        toast.error(response.data.message || 'Failed to fetch products');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/pet-categories`);
      if (response.data.success) {
        setCategories(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to fetch categories');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error('Product title is required');
      return;
    }
    
    if (!formData.petCategory) {
      toast.error('Please select a pet category');
      return;
    }
    
    if (!formData.price || formData.price <= 0) {
      toast.error('Valid price is required');
      return;
    }
    
    setSubmitting(true);
    
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== undefined && key !== 'image') {
          formDataToSend.append(key, formData[key]);
        }
      });
      
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }
      
      let response;
      if (editingProduct) {
        response = await axios.put(`${API_URL}/pet-products/${editingProduct._id}`, formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        if (response.data.success) {
          toast.success('Product updated successfully!');
        }
      } else {
        response = await axios.post(`${API_URL}/pet-products`, formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        if (response.data.success) {
          toast.success('Product created successfully!');
        }
      }
      
      setIsModalOpen(false);
      resetForm();
      fetchProducts();
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error(error.response?.data?.message || 'Failed to save product');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      title: product.title || '',
      shortDescription: product.shortDescription || '',
      description: product.description || '',
      petCategory: product.petCategory?._id || product.petCategory || '',
      needType: product.needType || 'food',
      price: product.price || '',
      weight: product.weight || '',
      flavor: product.flavor || '',
      ageType: product.ageType || 'all',
      rating: product.rating || '4.5',
      stock: product.stock || '1',
      image: null
    });
    setImagePreview(product.image?.url || '');
    setIsModalOpen(true);
  };

  const handleDeleteClick = (product) => {
    setDeleteTarget(product);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      await axios.delete(`${API_URL}/pet-products/${deleteTarget._id}`);
      toast.success('Product deleted successfully');
      setIsDeleteModalOpen(false);
      setDeleteTarget(null);
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error(error.response?.data?.message || 'Failed to delete product');
    }
  };

  const handleViewDetails = (product) => {
    setSelectedProduct(product);
    setIsDetailModalOpen(true);
  };

  const resetForm = () => {
    setEditingProduct(null);
    setFormData({
      title: '',
      shortDescription: '',
      description: '',
      petCategory: '',
      needType: 'food',
      price: '',
      weight: '',
      flavor: '',
      ageType: 'all',
      rating: '4.5',
      stock: '1',
      image: null
    });
    setImagePreview('');
  };

  const handleRefresh = () => {
    fetchProducts();
    toast.success('Refreshed successfully');
  };

  const handleExport = () => {
    const data = JSON.stringify(filteredProducts, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pet-products-${new Date().toISOString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Exported successfully');
  };

  const clearFilters = () => {
    setFilters({
      petCategory: '',
      needType: '',
      ageType: ''
    });
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const getNeedTypeColor = (needType) => {
    const colors = {
      food: 'from-green-500 to-emerald-500',
      medicines: 'from-red-500 to-rose-500',
      toys: 'from-purple-500 to-pink-500',
      accessories: 'from-blue-500 to-cyan-500'
    };
    return colors[needType] || 'from-gray-500 to-gray-500';
  };

  const getRandomIcon = (title) => {
    const icons = [FaDog, FaCat, FaFish, FaKiwiBird, FaHippo, FaPaw, FaBone];
    const index = (title?.length || 0) % icons.length;
    return icons[index];
  };

  const getStockStatus = (stock) => {
    if (stock <= 0) return { text: 'Out of Stock', color: 'red', bg: 'bg-red-100 text-red-800' };
    if (stock < 10) return { text: 'Low Stock', color: 'orange', bg: 'bg-orange-100 text-orange-800' };
    return { text: 'In Stock', color: 'green', bg: 'bg-green-100 text-green-800' };
  };

  return (
    <div className="pet-products-container">
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
                <FaCartPlus size={28} />
              </div>
              <div>
                <h1 className="header-title">Pet Products</h1>
                <p className="header-subtitle">Manage your pet products inventory</p>
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
                Add Product
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-info">
              <p className="stat-label">Total Products</p>
              <p className="stat-value">{products.length}</p>
            </div>
            <div className="stat-icon purple">
              <FiPackage size={20} />
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-info">
              <p className="stat-label">Categories</p>
              <p className="stat-value">{categories.length}</p>
            </div>
            <div className="stat-icon green">
              <FiTag size={20} />
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-info">
              <p className="stat-label">Low Stock</p>
              <p className="stat-value">{products.filter(p => p.stock < 10 && p.stock > 0).length}</p>
            </div>
            <div className="stat-icon orange">
              <FiHeart size={20} />
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-info">
              <p className="stat-label">Out of Stock</p>
              <p className="stat-value">{products.filter(p => p.stock === 0).length}</p>
            </div>
            <div className="stat-icon red">
              <FiBox size={20} />
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
                placeholder="Search products by name..."
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
              <button onClick={() => setShowFilters(!showFilters)} className="filter-toggle-btn">
                <FiFilter size={16} />
                Filters
              </button>
              
              <div className="sort-wrapper">
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="sort-select">
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name-asc">Name (A-Z)</option>
                  <option value="name-desc">Name (Z-A)</option>
                </select>
              </div>
              
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
              <select
                value={filters.petCategory}
                onChange={(e) => setFilters(prev => ({ ...prev, petCategory: e.target.value }))}
                className="filter-select"
              >
                <option value="">All Pet Categories</option>
                {categories.map(cat => (
                  <option key={cat._id} value={cat._id}>{cat.title}</option>
                ))}
              </select>
              
              <select
                value={filters.needType}
                onChange={(e) => setFilters(prev => ({ ...prev, needType: e.target.value }))}
                className="filter-select"
              >
                <option value="">All Product Types</option>
                {needTypeOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              
              <select
                value={filters.ageType}
                onChange={(e) => setFilters(prev => ({ ...prev, ageType: e.target.value }))}
                className="filter-select"
              >
                <option value="">All Ages</option>
                {ageTypeOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              
              <button onClick={clearFilters} className="clear-filters-btn">
                Clear All
              </button>
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="loading-state">
            <FiLoader className="spinner" size={48} />
            <p>Loading products...</p>
          </div>
        )}

        {/* Main Content */}
        {!loading && (
          <>
            {filteredProducts.length > 0 ? (
              viewMode === 'grid' ? (
                <div className="grid-view">
                  {currentItems.map((product, index) => {
                    const IconComponent = getRandomIcon(product.title);
                    const stockStatus = getStockStatus(product.stock);
                    const needTypeInfo = needTypeOptions.find(opt => opt.value === product.needType);
                    return (
                      <div key={product._id} className="grid-card" style={{ animationDelay: `${index * 50}ms` }}>
                        <div className={`card-header-gradient bg-gradient-to-r ${getNeedTypeColor(product.needType)}`}>
                          <div className="card-image-wrapper">
                            {product.image?.url ? (
                              <img src={product.image.url} alt={product.title} className="card-image" />
                            ) : (
                              <div className="card-icon-placeholder">
                                <IconComponent size={32} />
                              </div>
                            )}
                          </div>
                          <button onClick={() => handleViewDetails(product)} className="view-details-btn">
                            <FiEye size={14} />
                          </button>
                          <div className="stock-badge">
                            <span className={stockStatus.bg}>
                              {stockStatus.text}
                            </span>
                          </div>
                        </div>
                        
                        <div className="card-content">
                          <h3 className="card-title">{product.title}</h3>
                          <p className="card-description">{product.shortDescription?.substring(0, 60)}</p>
                          
                          <div className="card-price-row">
                            <span className="card-price">₹{product.price}</span>
                            <span className="card-rating">
                              <FiStar size={12} /> {product.rating}
                            </span>
                          </div>
                          
                          <div className="card-meta">
                            <span className="need-type-badge" data-type={product.needType}>
                              {needTypeInfo?.icon} {needTypeInfo?.label}
                            </span>
                            <span className="age-badge">
                              {ageTypeOptions.find(opt => opt.value === product.ageType)?.icon} {product.ageType}
                            </span>
                          </div>
                          
                          <div className="card-actions">
                            <button onClick={() => handleEdit(product)} className="edit-btn">
                              <FiEdit2 size={14} />
                              Edit
                            </button>
                            <button onClick={() => handleDeleteClick(product)} className="delete-btn">
                              <FiTrash2 size={14} />
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="list-view">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Image</th>
                        <th>Product Name</th>
                        <th>Category</th>
                        <th>Type</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Rating</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentItems.map((product) => {
                        const stockStatus = getStockStatus(product.stock);
                        return (
                          <tr key={product._id}>
                            <td>
                              {product.image?.url ? (
                                <img src={product.image.url} alt={product.title} className="list-image" />
                              ) : (
                                <div className="list-image-placeholder">
                                  <FiPackage size={20} />
                                </div>
                              )}
                            </td>
                            <td>
                              <div className="product-name-cell">
                                <span className="product-title">{product.title}</span>
                                <span className="product-short-desc">{product.shortDescription?.substring(0, 50)}</span>
                              </div>
                            </td>
                            <td>{product.petCategory?.title || 'N/A'}</td>
                            <td>
                              <span className={`type-badge type-${product.needType}`}>
                                {product.needType}
                              </span>
                            </td>
                            <td className="price-cell">₹{product.price}</td>
                            <td>
                              <span className={stockStatus.bg}>
                                {product.stock} left
                              </span>
                            </td>
                            <td>
                              <span className="rating-badge">
                                <FiStar size={12} /> {product.rating}
                              </span>
                            </td>
                            <td>
                              <div className="action-buttons">
                                <button onClick={() => handleViewDetails(product)} className="icon-btn view" title="View">
                                  <FiEye size={16} />
                                </button>
                                <button onClick={() => handleEdit(product)} className="icon-btn edit" title="Edit">
                                  <FiEdit2 size={16} />
                                </button>
                                <button onClick={() => handleDeleteClick(product)} className="icon-btn delete" title="Delete">
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
              )
            ) : (
              <div className="empty-state">
                <div className="empty-icon">
                  <FaCartPlus size={48} />
                </div>
                <h3>{searchTerm ? 'No results found' : 'No products yet'}</h3>
                <p>
                  {searchTerm 
                    ? `No products match "${searchTerm}". Try a different search term.`
                    : 'Create your first product to start building your inventory.'}
                </p>
                {!searchTerm && (
                  <button onClick={() => { resetForm(); setIsModalOpen(true); }} className="create-empty-btn">
                    <FiPlus size={18} />
                    Create First Product
                  </button>
                )}
              </div>
            )}

            {/* Pagination */}
            {filteredProducts.length > itemsPerPage && (
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
                  <FaCartPlus size={20} />
                </div>
                <h2>{editingProduct ? 'Edit Product' : 'Create Product'}</h2>
                <button onClick={() => { setIsModalOpen(false); resetForm(); }} className="modal-close">
                  <FiX size={22} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="modal-form">
                <div className="form-grid">
                  <div className="form-group full-width">
                    <label>Product Title *</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Enter product name"
                      required
                    />
                  </div>
                  
                  <div className="form-group full-width">
                    <label>Short Description</label>
                    <input
                      type="text"
                      name="shortDescription"
                      value={formData.shortDescription}
                      onChange={handleInputChange}
                      placeholder="Brief description"
                    />
                  </div>
                  
                  <div className="form-group full-width">
                    <label>Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows="3"
                      placeholder="Detailed product description"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Pet Category *</label>
                    <select
                      name="petCategory"
                      value={formData.petCategory}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map(cat => (
                        <option key={cat._id} value={cat._id}>{cat.title}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label>Product Type *</label>
                    <select
                      name="needType"
                      value={formData.needType}
                      onChange={handleInputChange}
                      required
                    >
                      {needTypeOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.icon} {opt.label}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label>Price (₹) *</label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      step="0.01"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Stock Quantity *</label>
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleInputChange}
                      placeholder="1"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Weight</label>
                    <input
                      type="text"
                      name="weight"
                      value={formData.weight}
                      onChange={handleInputChange}
                      placeholder="e.g., 1kg, 500g"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Flavor</label>
                    <input
                      type="text"
                      name="flavor"
                      value={formData.flavor}
                      onChange={handleInputChange}
                      placeholder="e.g., Chicken, Fish"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Age Type</label>
                    <select
                      name="ageType"
                      value={formData.ageType}
                      onChange={handleInputChange}
                    >
                      {ageTypeOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.icon} {opt.label}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label>Rating</label>
                    <input
                      type="number"
                      name="rating"
                      value={formData.rating}
                      onChange={handleInputChange}
                      step="0.1"
                      min="0"
                      max="5"
                    />
                  </div>
                  
                  <div className="form-group full-width">
                    <label>Product Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                    {imagePreview && (
                      <div className="image-preview">
                        <img src={imagePreview} alt="Preview" />
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="form-actions">
                  <button type="submit" disabled={submitting} className="submit-btn">
                    {submitting ? <FiLoader className="spinner-small" size={20} /> : (editingProduct ? 'Update Product' : 'Create Product')}
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
              <h3>Delete Product</h3>
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
        {isDetailModalOpen && selectedProduct && (
          <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setIsDetailModalOpen(false); }}>
            <div className="modal-content detail-modal">
              <div className="detail-header">
                <div className="detail-header-icon">
                  <FaCartPlus size={24} />
                </div>
                <h2>Product Details</h2>
                <button onClick={() => setIsDetailModalOpen(false)} className="modal-close">
                  <FiX size={22} />
                </button>
              </div>
              
              <div className="detail-body">
                {selectedProduct.image?.url && (
                  <div className="detail-image">
                    <img src={selectedProduct.image.url} alt={selectedProduct.title} />
                  </div>
                )}
                
                <div className="detail-item">
                  <span className="detail-label">Product Name</span>
                  <span className="detail-value">{selectedProduct.title}</span>
                </div>
                
                <div className="detail-item">
                  <span className="detail-label">Short Description</span>
                  <span className="detail-value">{selectedProduct.shortDescription || '—'}</span>
                </div>
                
                <div className="detail-item">
                  <span className="detail-label">Description</span>
                  <span className="detail-value">{selectedProduct.description || '—'}</span>
                </div>
                
                <div className="detail-item">
                  <span className="detail-label">Category</span>
                  <span className="detail-value">{selectedProduct.petCategory?.title || 'N/A'}</span>
                </div>
                
                <div className="detail-item">
                  <span className="detail-label">Product Type</span>
                  <span className="detail-value">{selectedProduct.needType}</span>
                </div>
                
                <div className="detail-item">
                  <span className="detail-label">Price</span>
                  <span className="detail-value price">₹{selectedProduct.price}</span>
                </div>
                
                <div className="detail-item">
                  <span className="detail-label">Stock</span>
                  <span className="detail-value">{selectedProduct.stock} units</span>
                </div>
                
                <div className="detail-item">
                  <span className="detail-label">Weight</span>
                  <span className="detail-value">{selectedProduct.weight || '—'}</span>
                </div>
                
                <div className="detail-item">
                  <span className="detail-label">Flavor</span>
                  <span className="detail-value">{selectedProduct.flavor || '—'}</span>
                </div>
                
                <div className="detail-item">
                  <span className="detail-label">Age Type</span>
                  <span className="detail-value">{selectedProduct.ageType}</span>
                </div>
                
                <div className="detail-item">
                  <span className="detail-label">Rating</span>
                  <span className="detail-value">⭐ {selectedProduct.rating}/5</span>
                </div>
                
                <div className="detail-item">
                  <span className="detail-label">Created At</span>
                  <span className="detail-value">{new Date(selectedProduct.createdAt).toLocaleString()}</span>
                </div>
                
                <div className="detail-item">
                  <span className="detail-label">Last Updated</span>
                  <span className="detail-value">{new Date(selectedProduct.updatedAt).toLocaleString()}</span>
                </div>
              </div>
              
              <div className="detail-actions">
                <button onClick={() => { setIsDetailModalOpen(false); handleEdit(selectedProduct); }} className="detail-edit-btn">
                  <FiEdit2 size={16} />
                  Edit Product
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

        .pet-products-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 50%, #bbf7d0 100%);
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
        }

        .content-wrapper {
          max-width: 1400px;
          margin: 0 auto;
          padding: 32px 24px;
        }

        .header-section {
          margin-bottom: 32px;
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
          background: linear-gradient(135deg, #10b981, #059669);
          padding: 14px;
          border-radius: 20px;
          box-shadow: 0 10px 25px -5px rgba(16, 185, 129, 0.3);
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
        }

        .create-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          background: linear-gradient(135deg, #10b981, #059669);
          border: none;
          border-radius: 14px;
          color: white;
          font-weight: 600;
          cursor: pointer;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
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
        .stat-icon.red { background: #fef2f2; color: #ef4444; }

        .search-filters-card {
          background: white;
          border-radius: 24px;
          padding: 20px;
          margin-bottom: 28px;
        }

        .search-filters-row {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
          align-items: center;
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
          padding: 12px 40px;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
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

        .filters-group {
          display: flex;
          gap: 12px;
        }

        .filter-toggle-btn {
          padding: 10px 16px;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          background: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .sort-select {
          padding: 10px 14px;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
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
          cursor: pointer;
        }

        .view-btn.active {
          background: white;
          color: #10b981;
        }

        .filter-panel {
          margin-top: 16px;
          padding-top: 16px;
          border-top: 1px solid #e2e8f0;
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .filter-select {
          padding: 10px 14px;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          flex: 1;
          min-width: 150px;
        }

        .clear-filters-btn {
          padding: 10px 20px;
          background: #ef4444;
          color: white;
          border: none;
          border-radius: 14px;
          cursor: pointer;
        }

        .grid-view {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 24px;
        }

        .grid-card {
          background: white;
          border-radius: 24px;
          overflow: hidden;
          transition: all 0.3s ease;
          border: 1px solid #e2e8f0;
        }

        .grid-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 25px -12px rgba(0, 0, 0, 0.15);
        }

        .card-header-gradient {
          height: 160px;
          position: relative;
        }

        .card-image-wrapper {
          height: 100%;
          width: 100%;
        }

        .card-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .card-icon-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f3f4f6;
          color: #9ca3af;
        }

        .view-details-btn {
          position: absolute;
          top: 12px;
          right: 12px;
          background: rgba(0, 0, 0, 0.5);
          border: none;
          padding: 8px;
          border-radius: 10px;
          color: white;
          cursor: pointer;
        }

        .stock-badge {
          position: absolute;
          bottom: 12px;
          left: 12px;
        }

        .stock-badge span {
          padding: 4px 8px;
          border-radius: 8px;
          font-size: 11px;
          font-weight: 600;
        }

        .card-content {
          padding: 20px;
        }

        .card-title {
          font-size: 18px;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 8px;
        }

        .card-description {
          font-size: 13px;
          color: #64748b;
          margin-bottom: 12px;
          line-height: 1.4;
        }

        .card-price-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .card-price {
          font-size: 22px;
          font-weight: 700;
          color: #10b981;
        }

        .card-rating {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
          color: #f59e0b;
        }

        .card-meta {
          display: flex;
          gap: 8px;
          margin-bottom: 16px;
        }

        .need-type-badge {
          padding: 4px 8px;
          border-radius: 8px;
          font-size: 11px;
          background: #eef2ff;
        }

        .need-type-badge[data-type="food"] { background: #dcfce7; color: #166534; }
        .need-type-badge[data-type="medicines"] { background: #fee2e2; color: #991b1b; }
        .need-type-badge[data-type="toys"] { background: #f3e8ff; color: #6b21a5; }
        .need-type-badge[data-type="accessories"] { background: #dbeafe; color: #1e40af; }

        .age-badge {
          padding: 4px 8px;
          border-radius: 8px;
          font-size: 11px;
          background: #fff7ed;
        }

        .card-actions {
          display: flex;
          gap: 12px;
        }

        .edit-btn, .delete-btn {
          flex: 1;
          padding: 8px;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          border: none;
        }

        .edit-btn {
          background: #dbeafe;
          color: #1e40af;
        }

        .delete-btn {
          background: #fee2e2;
          color: #dc2626;
        }

        .list-view {
          background: white;
          border-radius: 24px;
          overflow: auto;
        }

        .data-table {
          width: 100%;
          border-collapse: collapse;
        }

        .data-table th {
          text-align: left;
          padding: 16px;
          background: #f8fafc;
          font-weight: 600;
          font-size: 13px;
          border-bottom: 1px solid #e2e8f0;
        }

        .data-table td {
          padding: 16px;
          border-bottom: 1px solid #f1f5f9;
        }

        .list-image {
          width: 50px;
          height: 50px;
          object-fit: cover;
          border-radius: 10px;
        }

        .list-image-placeholder {
          width: 50px;
          height: 50px;
          background: #f3f4f6;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .product-name-cell {
          display: flex;
          flex-direction: column;
        }

        .product-title {
          font-weight: 600;
          color: #1e293b;
        }

        .product-short-desc {
          font-size: 12px;
          color: #64748b;
        }

        .type-badge {
          padding: 4px 8px;
          border-radius: 8px;
          font-size: 11px;
          font-weight: 500;
        }

        .type-food { background: #dcfce7; color: #166534; }
        .type-medicines { background: #fee2e2; color: #991b1b; }
        .type-toys { background: #f3e8ff; color: #6b21a5; }
        .type-accessories { background: #dbeafe; color: #1e40af; }

        .price-cell {
          font-weight: 600;
          color: #10b981;
        }

        .rating-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 4px 8px;
          background: #fef3c7;
          border-radius: 8px;
          font-size: 12px;
          color: #d97706;
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
        }

        .icon-btn.view { color: #3b82f6; }
        .icon-btn.edit { color: #f59e0b; }
        .icon-btn.delete { color: #ef4444; }

        .loading-state {
          background: white;
          border-radius: 24px;
          padding: 80px;
          text-align: center;
        }

        .spinner {
          animation: spin 1s linear infinite;
          color: #10b981;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .empty-state {
          background: white;
          border-radius: 24px;
          padding: 60px;
          text-align: center;
        }

        .empty-icon {
          width: 80px;
          height: 80px;
          background: #dcfce7;
          border-radius: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          color: #10b981;
        }

        .pagination {
          display: flex;
          justify-content: center;
          gap: 10px;
          margin-top: 32px;
        }

        .page-nav {
          padding: 10px;
          border: 1px solid #e2e8f0;
          background: white;
          border-radius: 12px;
          cursor: pointer;
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
          cursor: pointer;
        }

        .page-number.active {
          background: #10b981;
          border-color: #10b981;
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
          max-width: 600px;
          width: 90%;
          max-height: 90vh;
          overflow-y: auto;
        }

        .large-modal {
          max-width: 800px;
        }

        .modal-header {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 20px 24px;
          background: linear-gradient(135deg, #10b981, #059669);
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

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .form-group.full-width {
          grid-column: span 2;
        }

        .form-group label {
          display: block;
          font-size: 14px;
          font-weight: 500;
          color: #334155;
          margin-bottom: 6px;
        }

        .form-group input, .form-group select, .form-group textarea {
          width: 100%;
          padding: 10px 14px;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
        }

        .form-group input:focus, .form-group select:focus, .form-group textarea:focus {
          outline: none;
          border-color: #10b981;
        }

        .image-preview {
          margin-top: 12px;
        }

        .image-preview img {
          width: 100px;
          height: 100px;
          object-fit: cover;
          border-radius: 12px;
        }

        .form-actions {
          display: flex;
          gap: 12px;
          margin-top: 24px;
        }

        .submit-btn {
          flex: 1;
          padding: 12px;
          background: linear-gradient(135deg, #10b981, #059669);
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
          max-width: 400px;
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

        .detail-modal {
          max-width: 500px;
        }

        .detail-image {
          text-align: center;
          margin-bottom: 20px;
        }

        .detail-image img {
          max-width: 200px;
          border-radius: 16px;
        }

        .detail-body {
          padding: 24px;
        }

        .detail-item {
          padding: 12px 0;
          border-bottom: 1px solid #f1f5f9;
          display: flex;
          justify-content: space-between;
        }

        .detail-label {
          color: #64748b;
          font-size: 14px;
        }

        .detail-value {
          font-weight: 500;
          color: #1e293b;
        }

        .detail-value.price {
          color: #10b981;
          font-size: 18px;
        }

        .detail-actions {
          display: flex;
          gap: 12px;
          padding: 20px 24px;
          border-top: 1px solid #f1f5f9;
        }

        .detail-edit-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px;
          background: #10b981;
          border: none;
          border-radius: 14px;
          color: white;
          cursor: pointer;
        }

        .detail-close-btn {
          flex: 1;
          padding: 12px;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          cursor: pointer;
        }

        @media (max-width: 768px) {
          .content-wrapper { padding: 20px 16px; }
          .grid-view { grid-template-columns: 1fr; }
          .form-grid { grid-template-columns: 1fr; }
          .form-group.full-width { grid-column: span 1; }
        }
      `}</style>
    </div>
  );
};

export default PetProducts;