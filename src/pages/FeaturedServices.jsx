// src/pages/FeaturedServices.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import { 
  FiPlus, FiEdit2, FiTrash2, FiSearch, FiX, FiLoader, 
  FiChevronLeft, FiChevronRight, FiRefreshCw, FiDownload,
  FiFilter, FiEye, FiTag, FiDollarSign, FiCheckCircle,
  FiXCircle, FiClock, FiStar, FiCalendar, FiUser,
  FiGrid, FiList, FiHeart, FiTrendingUp
} from 'react-icons/fi';
import { FaHeartbeat, FaStethoscope, FaAmbulance, FaUserMd } from 'react-icons/fa';

const API_URL = 'https://userside-x164.onrender.com/api/featured-services';

const FeaturedServices = () => {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [viewMode, setViewMode] = useState('grid');
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    avgPrice: 0
  });

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    headerText: '',
    badgeText: '',
    iconText: '',
    benefits: [],
    timeSlots: [],
    price: '',
    doctorId: '',
    themeColor: '#3F1D9B',
    gradient: ['#667eea', '#764ba2'],
    isActive: true,
    serviceDate: new Date().toISOString().split('T')[0]
  });
  
  const [benefitInput, setBenefitInput] = useState('');
  const [timeSlotInput, setTimeSlotInput] = useState('');

  // Fetch data
  useEffect(() => {
    fetchServices();
    fetchDoctors();
  }, []);

  // Filter services
  useEffect(() => {
    let result = [...services];
    
    if (searchTerm.trim() !== '') {
      result = result.filter(service =>
        service.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.subtitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.headerText?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (statusFilter !== 'ALL') {
      result = result.filter(service => service.isActive === (statusFilter === 'ACTIVE'));
    }
    
    result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    setFilteredServices(result);
    setCurrentPage(1);
  }, [searchTerm, services, statusFilter]);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_URL);
      
      if (response.data.success) {
        setServices(response.data.data || []);
        calculateStats(response.data.data || []);
      } else {
        toast.error(response.data.message || 'Failed to fetch services');
      }
    } catch (error) {
      console.error('Error fetching services:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch services');
    } finally {
      setLoading(false);
    }
  };

  const fetchDoctors = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get('https://userside-x164.onrender.com/api/doctors/all', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setDoctors(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  const calculateStats = (servicesData) => {
    const total = servicesData.length;
    const active = servicesData.filter(s => s.isActive).length;
    const inactive = total - active;
    const totalPrice = servicesData.reduce((sum, s) => sum + (s.price || 0), 0);
    const avgPrice = total > 0 ? totalPrice / total : 0;
    
    setStats({ total, active, inactive, avgPrice });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast.error('Please upload a valid image file (JPEG, PNG, GIF, WEBP)');
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }
    
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleAddBenefit = () => {
    if (benefitInput.trim()) {
      setFormData(prev => ({
        ...prev,
        benefits: [...prev.benefits, benefitInput.trim()]
      }));
      setBenefitInput('');
    }
  };

  const handleRemoveBenefit = (index) => {
    setFormData(prev => ({
      ...prev,
      benefits: prev.benefits.filter((_, i) => i !== index)
    }));
  };

  const handleAddTimeSlot = () => {
    if (timeSlotInput.trim()) {
      setFormData(prev => ({
        ...prev,
        timeSlots: [...prev.timeSlots, timeSlotInput.trim()]
      }));
      setTimeSlotInput('');
    }
  };

  const handleRemoveTimeSlot = (index) => {
    setFormData(prev => ({
      ...prev,
      timeSlots: prev.timeSlots.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!formData.title) {
      setError('Service title is required');
      return;
    }
    if (!formData.price || formData.price <= 0) {
      setError('Valid price is required');
      return;
    }
    if (!formData.serviceDate) {
      setError('Service date is required');
      return;
    }

    setSubmitting(true);
    setUploadProgress(0);

    try {
      const submitData = new FormData();
      submitData.append('title', formData.title.trim());
      submitData.append('subtitle', formData.subtitle);
      submitData.append('headerText', formData.headerText);
      submitData.append('badgeText', formData.badgeText);
      submitData.append('iconText', formData.iconText);
      submitData.append('benefits', JSON.stringify(formData.benefits));
      submitData.append('timeSlots', JSON.stringify(formData.timeSlots));
      submitData.append('price', formData.price);
      submitData.append('doctorId', formData.doctorId);
      submitData.append('themeColor', formData.themeColor);
      submitData.append('gradient', JSON.stringify(formData.gradient));
      submitData.append('isActive', formData.isActive);
      submitData.append('serviceDate', formData.serviceDate);
      
      if (imageFile) {
        submitData.append('image', imageFile);
      }

      let response;
      if (editingService) {
        response = await axios.put(`${API_URL}/${editingService._id}`, submitData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              setUploadProgress(percentCompleted);
            }
          }
        });
        if (response.data.success) {
          toast.success('Service updated successfully');
        }
      } else {
        response = await axios.post(API_URL, submitData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              setUploadProgress(percentCompleted);
            }
          }
        });
        if (response.data.success) {
          toast.success('Service created successfully');
        }
      }
      
      setIsModalOpen(false);
      resetForm();
      fetchServices();
    } catch (error) {
      console.error('Error saving service:', error);
      setError(error.response?.data?.message || 'Operation failed');
    } finally {
      setSubmitting(false);
      setUploadProgress(0);
    }
  };

  const handleDeleteClick = (service) => {
    setDeleteTarget(service);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      const response = await axios.delete(`${API_URL}/${deleteTarget._id}`);
      if (response.data.success) {
        toast.success('Service deleted successfully');
        setIsDeleteModalOpen(false);
        setDeleteTarget(null);
        fetchServices();
      }
    } catch (error) {
      console.error('Error deleting service:', error);
      toast.error(error.response?.data?.message || 'Failed to delete service');
    }
  };

  const handleViewDetails = (service) => {
    setSelectedService(service);
    setIsDetailModalOpen(true);
  };

  const resetForm = () => {
    setEditingService(null);
    setFormData({
      title: '',
      subtitle: '',
      headerText: '',
      badgeText: '',
      iconText: '',
      benefits: [],
      timeSlots: [],
      price: '',
      doctorId: '',
      themeColor: '#3F1D9B',
      gradient: ['#667eea', '#764ba2'],
      isActive: true,
      serviceDate: new Date().toISOString().split('T')[0]
    });
    setBenefitInput('');
    setTimeSlotInput('');
    setImageFile(null);
    setImagePreview(null);
    setError('');
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setFormData({
      title: service.title,
      subtitle: service.subtitle || '',
      headerText: service.headerText || '',
      badgeText: service.badgeText || '',
      iconText: service.iconText || '',
      benefits: service.benefits || [],
      timeSlots: service.timeSlots || [],
      price: service.price,
      doctorId: service.doctorId?._id || service.doctorId || '',
      themeColor: service.themeColor || '#3F1D9B',
      gradient: service.gradient || ['#667eea', '#764ba2'],
      isActive: service.isActive,
      serviceDate: service.serviceDate ? new Date(service.serviceDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
    });
    setImagePreview(service.image?.url);
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleRefresh = () => {
    fetchServices();
    toast.success('Refreshed successfully');
  };

  const handleExport = () => {
    const exportData = filteredServices.map(service => ({
      'ID': service._id,
      'Title': service.title,
      'Subtitle': service.subtitle,
      'Price': service.price,
      'Doctor': service.doctorId?.name || 'N/A',
      'Benefits': service.benefits?.join(', '),
      'Time Slots': service.timeSlots?.join(', '),
      'Status': service.isActive ? 'Active' : 'Inactive',
      'Service Date': new Date(service.serviceDate).toLocaleDateString(),
      'Created At': new Date(service.createdAt).toLocaleString()
    }));
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `featured-services-${new Date().toISOString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Exported successfully');
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredServices.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredServices.length / itemsPerPage);

  const getRandomGradient = () => {
    const gradients = [
      'from-purple-600 to-indigo-600',
      'from-pink-600 to-purple-600',
      'from-blue-600 to-cyan-600',
      'from-green-600 to-teal-600',
      'from-orange-600 to-red-600'
    ];
    return gradients[Math.floor(Math.random() * gradients.length)];
  };

  return (
    <div className="featured-services-container">
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
        }}
      />
      
      <div className="content-wrapper">
        {/* Header Section */}
        <div className="header-section">
          <div className="header-top">
            <div className="header-title-group">
              <div className="header-icon">
                <FiTrendingUp size={28} />
              </div>
              <div>
                <h1 className="header-title">Featured Services</h1>
                <p className="header-subtitle">Manage featured healthcare services and offerings</p>
              </div>
            </div>
            
            <div className="header-actions">
              <button onClick={handleRefresh} className="action-btn" title="Refresh">
                <FiRefreshCw size={18} />
              </button>
              <button onClick={handleExport} className="action-btn" title="Export">
                <FiDownload size={18} />
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
              <button onClick={() => { resetForm(); setIsModalOpen(true); }} className="create-btn">
                <FiPlus size={18} />
                Add Service
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-info">
              <p className="stat-label">Total Services</p>
              <p className="stat-value">{stats.total}</p>
            </div>
            <div className="stat-icon purple">
              <FiHeart size={20} />
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-info">
              <p className="stat-label">Active Services</p>
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
          <div className="search-wrapper">
            <FiSearch className="search-icon" size={18} />
            <input
              type="text"
              placeholder="Search services by title..."
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
          
          <div className="filter-row">
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              className="filter-select"
            >
              <option value="ALL">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="loading-state">
            <FiLoader className="spinner" size={48} />
            <p>Loading services...</p>
          </div>
        )}

        {/* Services Grid/List */}
        {!loading && (
          <>
            {filteredServices.length > 0 ? (
              viewMode === 'grid' ? (
                <div className="services-grid">
                  {currentItems.map((service) => (
                    <div key={service._id} className="service-card">
                      <div className="card-image" style={{ background: `linear-gradient(135deg, ${service.gradient?.[0] || '#667eea'}, ${service.gradient?.[1] || '#764ba2'})` }}>
                        {service.image?.url ? (
                          <img src={service.image.url} alt={service.title} />
                        ) : (
                          <div className="image-placeholder">
                            <FiHeart size={48} />
                          </div>
                        )}
                        {service.badgeText && (
                          <span className="badge">{service.badgeText}</span>
                        )}
                        <div className={`status-badge ${service.isActive ? 'active' : 'inactive'}`}>
                          {service.isActive ? 'Active' : 'Inactive'}
                        </div>
                      </div>
                      
                      <div className="card-content">
                        <div className="card-header">
                          <div className="icon-text">{service.iconText || '💊'}</div>
                          <h3 className="service-title">{service.title}</h3>
                        </div>
                        
                        <p className="service-subtitle">{service.subtitle}</p>
                        
                        <div className="service-details">
                          {service.doctorId && (
                            <div className="detail-item">
                              <FaUserMd size={14} />
                              <span>Dr. {service.doctorId.name}</span>
                            </div>
                          )}
                          <div className="detail-item">
                            <FiDollarSign size={14} />
                            <span>₹{service.price}</span>
                          </div>
                          <div className="detail-item">
                            <FiCalendar size={14} />
                            <span>{new Date(service.serviceDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                        
                        {service.benefits && service.benefits.length > 0 && (
                          <div className="benefits">
                            <div className="benefits-label">Benefits:</div>
                            <div className="benefits-list">
                              {service.benefits.slice(0, 2).map((benefit, idx) => (
                                <span key={idx} className="benefit-tag">{benefit}</span>
                              ))}
                              {service.benefits.length > 2 && (
                                <span className="benefit-tag more">+{service.benefits.length - 2}</span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="card-actions">
                        <button onClick={() => handleViewDetails(service)} className="view-btn">
                          <FiEye size={14} />
                          View
                        </button>
                        <button onClick={() => handleEdit(service)} className="edit-btn">
                          <FiEdit2 size={14} />
                          Edit
                        </button>
                        <button onClick={() => handleDeleteClick(service)} className="delete-btn">
                          <FiTrash2 size={14} />
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="services-list-view">
                  <table className="list-table">
                    <thead>
                      <tr>
                        <th>Image</th>
                        <th>Title</th>
                        <th>Price</th>
                        <th>Doctor</th>
                        <th>Service Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentItems.map((service) => (
                        <tr key={service._id}>
                          <td className="list-image">
                            {service.image?.url ? (
                              <img src={service.image.url} alt={service.title} />
                            ) : (
                              <div className="list-image-placeholder">
                                <FiHeart size={20} />
                              </div>
                            )}
                          </td>
                          <td>
                            <div className="list-title">{service.title}</div>
                            <div className="list-subtitle">{service.subtitle}</div>
                          </td>
                          <td className="price">₹{service.price}</td>
                          <td>{service.doctorId?.name || '—'}</td>
                          <td>{new Date(service.serviceDate).toLocaleDateString()}</td>
                          <td>
                            <span className={`status-badge-small ${service.isActive ? 'active' : 'inactive'}`}>
                              {service.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td>
                            <div className="action-buttons">
                              <button onClick={() => handleViewDetails(service)} className="icon-btn view" title="View">
                                <FiEye size={16} />
                              </button>
                              <button onClick={() => handleEdit(service)} className="icon-btn edit" title="Edit">
                                <FiEdit2 size={16} />
                              </button>
                              <button onClick={() => handleDeleteClick(service)} className="icon-btn delete" title="Delete">
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
                  <FiHeart size={48} />
                </div>
                <h3>{searchTerm ? 'No results found' : 'No services yet'}</h3>
                <p>
                  {searchTerm 
                    ? `No services match "${searchTerm}". Try a different search term.`
                    : 'Create your first featured service to get started.'}
                </p>
                {!searchTerm && (
                  <button onClick={() => { resetForm(); setIsModalOpen(true); }} className="create-empty-btn">
                    <FiPlus size={18} />
                    Create First Service
                  </button>
                )}
              </div>
            )}

            {/* Pagination */}
            {filteredServices.length > itemsPerPage && (
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
                  <FiTrendingUp size={20} />
                </div>
                <h2>{editingService ? 'Edit Service' : 'Create Service'}</h2>
                <button onClick={() => { setIsModalOpen(false); resetForm(); }} className="modal-close">
                  <FiX size={22} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="modal-form">
                {error && <div className="error-box">{error}</div>}
                
                <div className="form-grid">
                  <div className="form-group full-width">
                    <label>Service Title <span className="required">*</span></label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="e.g., Full Body Checkup, Dental Care Package"
                    />
                  </div>
                  
                  <div className="form-group full-width">
                    <label>Subtitle</label>
                    <input
                      type="text"
                      value={formData.subtitle}
                      onChange={(e) => setFormData(prev => ({ ...prev, subtitle: e.target.value }))}
                      placeholder="Brief description of the service"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Header Text</label>
                    <input
                      type="text"
                      value={formData.headerText}
                      onChange={(e) => setFormData(prev => ({ ...prev, headerText: e.target.value }))}
                      placeholder="Header text for the card"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Badge Text</label>
                    <input
                      type="text"
                      value={formData.badgeText}
                      onChange={(e) => setFormData(prev => ({ ...prev, badgeText: e.target.value }))}
                      placeholder="e.g., Popular, Best Seller"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Icon Text</label>
                    <input
                      type="text"
                      value={formData.iconText}
                      onChange={(e) => setFormData(prev => ({ ...prev, iconText: e.target.value }))}
                      placeholder="💊, 🩺, ❤️"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Price (₹) <span className="required">*</span></label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                      placeholder="Service price"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Doctor (Optional)</label>
                    <select
                      value={formData.doctorId}
                      onChange={(e) => setFormData(prev => ({ ...prev, doctorId: e.target.value }))}
                    >
                      <option value="">Select Doctor</option>
                      {doctors.map(doc => (
                        <option key={doc._id} value={doc._id}>Dr. {doc.name} - {doc.specialization}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label>Theme Color</label>
                    <input
                      type="color"
                      value={formData.themeColor}
                      onChange={(e) => setFormData(prev => ({ ...prev, themeColor: e.target.value }))}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Service Date <span className="required">*</span></label>
                    <input
                      type="date"
                      value={formData.serviceDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, serviceDate: e.target.value }))}
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
                    <label>Benefits</label>
                    <div className="array-input-group">
                      <input
                        type="text"
                        value={benefitInput}
                        onChange={(e) => setBenefitInput(e.target.value)}
                        placeholder="Enter benefit"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddBenefit())}
                      />
                      <button type="button" onClick={handleAddBenefit} className="add-btn">Add</button>
                    </div>
                    <div className="array-items-list">
                      {formData.benefits.map((benefit, idx) => (
                        <span key={idx} className="array-item">
                          {benefit}
                          <button type="button" onClick={() => handleRemoveBenefit(idx)} className="remove-item">×</button>
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="form-group full-width">
                    <label>Time Slots</label>
                    <div className="array-input-group">
                      <input
                        type="text"
                        value={timeSlotInput}
                        onChange={(e) => setTimeSlotInput(e.target.value)}
                        placeholder="Enter time slot (e.g., 10:00 AM - 12:00 PM)"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTimeSlot())}
                      />
                      <button type="button" onClick={handleAddTimeSlot} className="add-btn">Add</button>
                    </div>
                    <div className="array-items-list">
                      {formData.timeSlots.map((slot, idx) => (
                        <span key={idx} className="array-item">
                          {slot}
                          <button type="button" onClick={() => handleRemoveTimeSlot(idx)} className="remove-item">×</button>
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="form-group full-width">
                    <label>Service Image</label>
                    <div className="image-upload-area">
                      {imagePreview ? (
                        <div className="image-preview-container">
                          <img src={imagePreview} alt="Preview" className="image-preview" />
                          <button
                            type="button"
                            className="remove-image-btn"
                            onClick={() => {
                              setImageFile(null);
                              setImagePreview(null);
                            }}
                          >
                            Remove Image
                          </button>
                        </div>
                      ) : (
                        <div className="upload-placeholder" onClick={() => document.getElementById('imageInput').click()}>
                          <FiPlus size={32} />
                          <p>Click to upload image</p>
                          <small>PNG, JPG, GIF up to 5MB</small>
                        </div>
                      )}
                      <input
                        id="imageInput"
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                        style={{ display: 'none' }}
                        onChange={handleImageChange}
                      />
                    </div>
                    {uploadProgress > 0 && uploadProgress < 100 && (
                      <div className="upload-progress">
                        <div className="upload-progress-bar" style={{ width: `${uploadProgress}%` }}></div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="form-actions">
                  <button type="submit" disabled={submitting} className="submit-btn">
                    {submitting ? <FiLoader className="spinner-small" size={20} /> : (editingService ? 'Update Service' : 'Create Service')}
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
              <h3>Delete Service</h3>
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
        {isDetailModalOpen && selectedService && (
          <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setIsDetailModalOpen(false); }}>
            <div className="modal-content detail-modal">
              <div className="modal-header">
                <div className="modal-header-icon">
                  <FiTrendingUp size={20} />
                </div>
                <h2>Service Details</h2>
                <button onClick={() => setIsDetailModalOpen(false)} className="modal-close">
                  <FiX size={22} />
                </button>
              </div>
              
              <div className="detail-body">
                {selectedService.image?.url && (
                  <div className="detail-image">
                    <img src={selectedService.image.url} alt={selectedService.title} />
                  </div>
                )}
                
                <div className="detail-item">
                  <span className="detail-label">Title</span>
                  <span className="detail-value">{selectedService.title}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Subtitle</span>
                  <span className="detail-value">{selectedService.subtitle || '—'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Header Text</span>
                  <span className="detail-value">{selectedService.headerText || '—'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Badge Text</span>
                  <span className="detail-value">{selectedService.badgeText || '—'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Icon Text</span>
                  <span className="detail-value">{selectedService.iconText || '—'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Price</span>
                  <span className="detail-value price">₹{selectedService.price}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Doctor</span>
                  <span className="detail-value">{selectedService.doctorId?.name ? `Dr. ${selectedService.doctorId.name}` : 'Not assigned'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Service Date</span>
                  <span className="detail-value">{new Date(selectedService.serviceDate).toLocaleDateString()}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Status</span>
                  <span className={`detail-value status ${selectedService.isActive ? 'active' : 'inactive'}`}>
                    {selectedService.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                
                {selectedService.benefits && selectedService.benefits.length > 0 && (
                  <div className="detail-section">
                    <h4>Benefits</h4>
                    <div className="list-items">
                      {selectedService.benefits.map((benefit, idx) => (
                        <div key={idx} className="list-item">✓ {benefit}</div>
                      ))}
                    </div>
                  </div>
                )}
                
                {selectedService.timeSlots && selectedService.timeSlots.length > 0 && (
                  <div className="detail-section">
                    <h4>Time Slots</h4>
                    <div className="list-items">
                      {selectedService.timeSlots.map((slot, idx) => (
                        <div key={idx} className="list-item">🕐 {slot}</div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="detail-actions">
                <button onClick={() => { setIsDetailModalOpen(false); handleEdit(selectedService); }} className="detail-edit-btn">
                  <FiEdit2 size={16} />
                  Edit Service
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
        .featured-services-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #fef3f9 0%, #fce7f3 50%, #fbcfe8 100%);
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
        .header-icon { background: linear-gradient(135deg, #ec4899, #db2777); padding: 14px; border-radius: 20px; }
        .header-icon svg { color: white; }
        .header-title { font-size: 28px; font-weight: 700; color: #1e293b; }
        .header-subtitle { font-size: 14px; color: #64748b; margin-top: 4px; }
        .header-actions { display: flex; gap: 12px; align-items: center; }
        .action-btn { padding: 10px; background: white; border: 1px solid #e2e8f0; border-radius: 14px; cursor: pointer; }
        .view-toggle { display: flex; gap: 4px; background: #f1f5f9; padding: 4px; border-radius: 14px; }
        .view-btn { padding: 8px 12px; background: transparent; border: none; border-radius: 10px; cursor: pointer; }
        .view-btn.active { background: white; color: #ec4899; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
        .create-btn { display: flex; align-items: center; gap: 8px; padding: 10px 20px; background: linear-gradient(135deg, #ec4899, #db2777); border: none; border-radius: 14px; color: white; font-weight: 600; cursor: pointer; }

        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 28px; }
        .stat-card { background: white; border-radius: 20px; padding: 20px; display: flex; justify-content: space-between; align-items: center; border: 1px solid #e2e8f0; }
        .stat-label { font-size: 13px; color: #64748b; margin-bottom: 6px; }
        .stat-value { font-size: 28px; font-weight: 700; color: #1e293b; }
        .stat-icon { width: 48px; height: 48px; border-radius: 16px; display: flex; align-items: center; justify-content: center; }
        .stat-icon.purple { background: #fae8ff; color: #d946ef; }
        .stat-icon.green { background: #ecfdf5; color: #10b981; }
        .stat-icon.red { background: #fef2f2; color: #ef4444; }
        .stat-icon.orange { background: #fff7ed; color: #f97316; }

        .search-filters-card { background: white; border-radius: 24px; padding: 20px; margin-bottom: 28px; border: 1px solid #e2e8f0; display: flex; gap: 16px; flex-wrap: wrap; align-items: center; }
        .search-wrapper { flex: 1; position: relative; }
        .search-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: #94a3b8; }
        .search-input { width: 100%; padding: 12px 40px; border: 1px solid #e2e8f0; border-radius: 14px; }
        .search-input:focus { outline: none; border-color: #ec4899; }
        .clear-search { position: absolute; right: 14px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; }
        .filter-select { padding: 10px 14px; border: 1px solid #e2e8f0; border-radius: 12px; background: white; }

        .services-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(360px, 1fr)); gap: 24px; margin-bottom: 32px; }
        .service-card { background: white; border-radius: 24px; overflow: hidden; transition: all 0.3s; border: 1px solid #e2e8f0; }
        .service-card:hover { transform: translateY(-4px); box-shadow: 0 20px 25px -12px rgba(0,0,0,0.15); }

        .card-image { height: 180px; position: relative; overflow: hidden; display: flex; align-items: center; justify-content: center; }
        .card-image img { width: 100%; height: 100%; object-fit: cover; }
        .image-placeholder { display: flex; align-items: center; justify-content: center; height: 100%; width: 100%; color: rgba(255,255,255,0.7); }
        .badge { position: absolute; top: 16px; left: 16px; background: #fbbf24; color: #1e293b; padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 600; }
        .status-badge { position: absolute; top: 16px; right: 16px; padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 600; }
        .status-badge.active { background: #10b981; color: white; }
        .status-badge.inactive { background: #ef4444; color: white; }

        .card-content { padding: 20px; }
        .card-header { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
        .icon-text { width: 48px; height: 48px; background: #fce7f3; border-radius: 16px; display: flex; align-items: center; justify-content: center; font-size: 24px; }
        .service-title { font-size: 20px; font-weight: 700; color: #1e293b; margin: 0; }
        .service-subtitle { font-size: 13px; color: #64748b; margin-bottom: 16px; }
        
        .service-details { display: flex; flex-wrap: wrap; gap: 12px; margin-bottom: 16px; }
        .detail-item { display: flex; align-items: center; gap: 6px; font-size: 13px; color: #475569; background: #f1f5f9; padding: 4px 10px; border-radius: 8px; }
        
        .benefits { margin-bottom: 16px; }
        .benefits-label { font-size: 11px; font-weight: 600; color: #64748b; margin-bottom: 6px; }
        .benefits-list { display: flex; flex-wrap: wrap; gap: 6px; }
        .benefit-tag { background: #fce7f3; color: #db2777; padding: 4px 10px; border-radius: 8px; font-size: 11px; }
        .benefit-tag.more { background: #f1f5f9; color: #64748b; }

        .card-actions { display: flex; gap: 12px; padding: 16px 20px; border-top: 1px solid #e2e8f0; }
        .view-btn, .edit-btn, .delete-btn { flex: 1; padding: 8px; border: none; border-radius: 10px; font-size: 13px; font-weight: 500; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; }
        .view-btn { background: #fce7f3; color: #db2777; }
        .edit-btn { background: #fef3c7; color: #d97706; }
        .delete-btn { background: #fee2e2; color: #dc2626; }

        .services-list-view { background: white; border-radius: 24px; overflow: auto; border: 1px solid #e2e8f0; }
        .list-table { width: 100%; border-collapse: collapse; }
        .list-table th { text-align: left; padding: 16px 20px; background: #f8fafc; font-weight: 600; font-size: 13px; border-bottom: 1px solid #e2e8f0; }
        .list-table td { padding: 16px 20px; border-bottom: 1px solid #f1f5f9; }
        .list-table tr:hover { background: #fef3f9; }
        .list-image img { width: 50px; height: 50px; object-fit: cover; border-radius: 12px; }
        .list-image-placeholder { width: 50px; height: 50px; background: #fce7f3; border-radius: 12px; display: flex; align-items: center; justify-content: center; color: #db2777; }
        .list-title { font-weight: 600; margin-bottom: 4px; }
        .list-subtitle { font-size: 12px; color: #64748b; }
        .price { font-weight: 600; color: #10b981; }
        .status-badge-small { padding: 4px 8px; border-radius: 8px; font-size: 11px; font-weight: 500; }
        .status-badge-small.active { background: #dcfce7; color: #166534; }
        .status-badge-small.inactive { background: #fee2e2; color: #991b1b; }

        .action-buttons { display: flex; gap: 8px; }
        .icon-btn { padding: 6px; background: none; border: none; border-radius: 8px; cursor: pointer; }
        .icon-btn.view { color: #3b82f6; }
        .icon-btn.edit { color: #f59e0b; }
        .icon-btn.delete { color: #ef4444; }

        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 1000; }
        .modal-content { background: white; border-radius: 32px; width: 90%; max-height: 90vh; overflow-y: auto; }
        .large-modal { max-width: 800px; }
        .detail-modal { max-width: 550px; }
        .delete-modal { max-width: 400px; text-align: center; }

        .modal-header { display: flex; align-items: center; gap: 12px; padding: 20px 24px; background: linear-gradient(135deg, #ec4899, #db2777); color: white; position: sticky; top: 0; }
        .modal-header-icon { background: rgba(255,255,255,0.2); padding: 8px; border-radius: 12px; }
        .modal-header h2 { flex: 1; font-size: 20px; margin: 0; }
        .modal-close { background: rgba(255,255,255,0.2); border: none; border-radius: 10px; padding: 6px; cursor: pointer; color: white; }

        .modal-form { padding: 24px; }
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .form-group.full-width { grid-column: span 2; }
        .form-group label { display: block; font-size: 13px; font-weight: 600; color: #334155; margin-bottom: 6px; }
        .required { color: #ef4444; }
        .form-group input, .form-group select { width: 100%; padding: 10px 14px; border: 1px solid #e2e8f0; border-radius: 12px; }
        .form-group input:focus, .form-group select:focus { outline: none; border-color: #ec4899; }

        .array-input-group { display: flex; gap: 8px; margin-bottom: 12px; }
        .array-input-group input { flex: 1; }
        .add-btn { padding: 10px 20px; background: #ec4899; color: white; border: none; border-radius: 12px; cursor: pointer; }
        .array-items-list { display: flex; flex-wrap: wrap; gap: 8px; }
        .array-item { background: #fce7f3; color: #db2777; padding: 6px 12px; border-radius: 8px; font-size: 12px; display: flex; align-items: center; gap: 8px; }
        .remove-item { background: none; border: none; cursor: pointer; color: #ef4444; font-size: 16px; }

        .image-upload-area { border: 2px dashed #e2e8f0; border-radius: 16px; padding: 20px; text-align: center; }
        .image-preview-container { text-align: center; }
        .image-preview { max-width: 200px; max-height: 200px; border-radius: 12px; margin-bottom: 12px; }
        .remove-image-btn { background: #ef4444; color: white; border: none; padding: 6px 12px; border-radius: 8px; cursor: pointer; }
        .upload-placeholder { cursor: pointer; padding: 20px; }
        .upload-placeholder p { margin: 8px 0 4px; color: #64748b; }
        .upload-placeholder small { color: #94a3b8; }
        .upload-progress { margin-top: 12px; width: 100%; height: 4px; background: #e2e8f0; border-radius: 2px; overflow: hidden; }
        .upload-progress-bar { height: 100%; background: linear-gradient(135deg, #ec4899, #db2777); transition: width 0.3s; }

        .form-actions { display: flex; gap: 12px; margin-top: 24px; }
        .submit-btn { flex: 1; padding: 12px; background: linear-gradient(135deg, #ec4899, #db2777); border: none; border-radius: 14px; color: white; font-weight: 600; cursor: pointer; }
        .cancel-btn { flex: 1; padding: 12px; background: white; border: 1px solid #e2e8f0; border-radius: 14px; cursor: pointer; }

        .delete-icon-wrapper { width: 80px; height: 80px; background: #fee2e2; border-radius: 40px; display: flex; align-items: center; justify-content: center; margin: 24px auto 16px; color: #dc2626; }
        .delete-actions { display: flex; gap: 12px; padding: 0 24px 24px; }
        .confirm-delete-btn { flex: 1; padding: 12px; background: #dc2626; border: none; border-radius: 14px; color: white; cursor: pointer; }
        .cancel-delete-btn { flex: 1; padding: 12px; background: white; border: 1px solid #e2e8f0; border-radius: 14px; cursor: pointer; }

        .detail-body { padding: 24px; }
        .detail-image { text-align: center; margin-bottom: 20px; }
        .detail-image img { max-width: 200px; border-radius: 16px; }
        .detail-item { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #f1f5f9; }
        .detail-label { color: #64748b; font-size: 13px; }
        .detail-value { font-weight: 500; color: #1e293b; }
        .detail-value.price { color: #10b981; font-weight: 700; }
        .detail-value.status.active { color: #10b981; }
        .detail-value.status.inactive { color: #ef4444; }
        .detail-section { margin-top: 20px; }
        .detail-section h4 { font-size: 14px; font-weight: 600; margin-bottom: 10px; color: #1e293b; }
        .list-items { display: flex; flex-direction: column; gap: 6px; }
        .list-item { font-size: 13px; color: #475569; }

        .detail-actions { display: flex; gap: 12px; padding: 20px 24px; border-top: 1px solid #f1f5f9; }
        .detail-edit-btn { flex: 1; display: flex; align-items: center; justify-content: center; gap: 8px; padding: 12px; background: #ec4899; color: white; border: none; border-radius: 14px; cursor: pointer; }
        .detail-close-btn { flex: 1; padding: 12px; background: white; border: 1px solid #e2e8f0; border-radius: 14px; cursor: pointer; }

        .loading-state { background: white; border-radius: 24px; padding: 80px; text-align: center; }
        .spinner { animation: spin 1s linear infinite; color: #ec4899; }
        @keyframes spin { to { transform: rotate(360deg); } }

        .empty-state { background: white; border-radius: 24px; padding: 60px; text-align: center; }
        .empty-icon { width: 80px; height: 80px; background: #fce7f3; border-radius: 40px; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; color: #ec4899; }
        .create-empty-btn { display: inline-flex; align-items: center; gap: 10px; padding: 12px 24px; background: linear-gradient(135deg, #ec4899, #db2777); border: none; border-radius: 16px; color: white; font-weight: 600; cursor: pointer; }

        .pagination { display: flex; justify-content: center; gap: 10px; margin-top: 24px; }
        .page-nav { padding: 8px 12px; border: 1px solid #e2e8f0; background: white; border-radius: 10px; cursor: pointer; }
        .page-numbers { display: flex; gap: 6px; }
        .page-number { width: 36px; height: 36px; border: 1px solid #e2e8f0; background: white; border-radius: 10px; cursor: pointer; }
        .page-number.active { background: #ec4899; border-color: #ec4899; color: white; }

        .error-box { background: #fee2e2; color: #dc2626; padding: 12px; border-radius: 12px; font-size: 13px; margin-bottom: 20px; }
        .spinner-small { animation: spin 1s linear infinite; }

        @media (max-width: 768px) {
          .content-wrapper { padding: 20px 16px; }
          .services-grid { grid-template-columns: 1fr; }
          .form-grid { grid-template-columns: 1fr; }
          .form-group.full-width { grid-column: span 1; }
        }
      `}</style>
    </div>
  );
};

export default FeaturedServices;