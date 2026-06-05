import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const API = 'https://userside-x164.onrender.com/api/medicineItem';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  .medicine-items-container {
    font-family: 'Inter', sans-serif;
    background: linear-gradient(135deg, #fefce8 0%, #fef3c7 100%);
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
    background: linear-gradient(135deg, #b45309 0%, #d97706 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: 8px;
  }

  .header-subtitle {
    color: #92400e;
    font-size: 14px;
    font-weight: 500;
  }

  .add-item-btn {
    background: linear-gradient(135deg, #d97706 0%, #b45309 100%);
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
    box-shadow: 0 4px 6px -1px rgba(217, 119, 6, 0.2);
  }

  .add-item-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 15px -3px rgba(217, 119, 6, 0.3);
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

  /* Search Section */
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
    border-color: #d97706;
    background: white;
    box-shadow: 0 0 0 4px rgba(217, 119, 6, 0.1);
  }

  /* Items Grid */
  .items-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
    gap: 24px;
    margin-bottom: 32px;
  }

  /* Medicine Card */
  .medicine-card {
    background: white;
    border-radius: 24px;
    overflow: hidden;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
    border: 1px solid rgba(226, 232, 240, 0.8);
    position: relative;
  }

  .medicine-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 25px -12px rgba(0,0,0,0.15);
  }

  .card-image-wrapper {
    position: relative;
    height: 220px;
    overflow: hidden;
    background: linear-gradient(135deg, #fbbf24 0%, #d97706 100%);
    cursor: pointer;
  }

  .medicine-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }

  .medicine-card:hover .medicine-image {
    transform: scale(1.1);
  }

  .image-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #fbbf24 0%, #d97706 100%);
  }

  .discount-badge {
    position: absolute;
    top: 16px;
    right: 16px;
    background: #ef4444;
    color: white;
    padding: 6px 12px;
    border-radius: 20px;
    font-weight: 700;
    font-size: 13px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    z-index: 1;
  }

  .card-content {
    padding: 20px;
  }

  .medicine-name {
    font-size: 20px;
    font-weight: 700;
    color: #1e293b;
    margin-bottom: 8px;
    line-height: 1.3;
  }

  .medicine-type {
    font-size: 12px;
    color: #64748b;
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .price-section {
    margin-bottom: 12px;
  }

  .old-price {
    font-size: 14px;
    color: #94a3b8;
    text-decoration: line-through;
    margin-right: 12px;
  }

  .new-price {
    font-size: 28px;
    font-weight: 800;
    color: #d97706;
  }

  .delivery-info {
    font-size: 12px;
    color: #10b981;
    font-weight: 600;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .prescription-badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    background: #fef3c7;
    color: #d97706;
    padding: 4px 10px;
    border-radius: 8px;
    font-size: 11px;
    font-weight: 600;
    margin-bottom: 16px;
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
    border-color: #d97706;
    color: #d97706;
  }

  .page-btn.active {
    background: linear-gradient(135deg, #d97706 0%, #b45309 100%);
    color: white;
    border-color: #d97706;
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
    max-width: 600px;
    max-height: 90vh;
    overflow-y: auto;
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
    position: sticky;
    top: 0;
    background: white;
    border-radius: 32px 32px 0 0;
    z-index: 1;
  }

  .modal-title {
    font-size: 24px;
    font-weight: 700;
    background: linear-gradient(135deg, #b45309 0%, #d97706 100%);
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

  .form-input, .form-select, .form-textarea {
    width: 100%;
    padding: 12px 16px;
    border: 1.5px solid #e2e8f0;
    border-radius: 14px;
    font-size: 14px;
    font-family: 'Inter', sans-serif;
    transition: all 0.2s;
    background: #f8fafc;
  }

  .form-textarea {
    resize: vertical;
    min-height: 100px;
  }

  .form-input:focus, .form-select:focus, .form-textarea:focus {
    outline: none;
    border-color: #d97706;
    background: white;
    box-shadow: 0 0 0 4px rgba(217, 119, 6, 0.1);
  }

  /* Image Upload Area */
  .upload-area {
    border: 2px dashed #cbd5e1;
    border-radius: 20px;
    padding: 24px;
    text-align: center;
    transition: all 0.2s;
    cursor: pointer;
    background: #f8fafc;
    position: relative;
  }

  .upload-area:hover {
    border-color: #d97706;
    background: #fef3c7;
  }

  .upload-area.drag-over {
    border-color: #d97706;
    background: #fde68a;
  }

  .preview-image {
    max-width: 200px;
    max-height: 200px;
    border-radius: 16px;
    object-fit: cover;
    margin-bottom: 16px;
  }

  .remove-image-btn {
    background: #ef4444;
    color: white;
    border: none;
    padding: 6px 12px;
    border-radius: 10px;
    font-size: 12px;
    cursor: pointer;
    margin-top: 8px;
    transition: all 0.2s;
  }

  .remove-image-btn:hover {
    background: #dc2626;
    transform: scale(1.05);
  }

  .upload-progress {
    margin-top: 12px;
    width: 100%;
    height: 4px;
    background: #e2e8f0;
    border-radius: 2px;
    overflow: hidden;
  }

  .upload-progress-bar {
    height: 100%;
    background: linear-gradient(135deg, #d97706 0%, #b45309 100%);
    transition: width 0.3s ease;
  }

  /* Description text styling */
  .description-text {
    font-size: 13px;
    color: #64748b;
    line-height: 1.5;
    margin-bottom: 16px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
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
    border-top-color: #d97706;
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

  /* Modal Footer */
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
    background: linear-gradient(135deg, #d97706 0%, #b45309 100%);
    color: white;
    transition: all 0.2s;
  }

  .btn-submit:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(217, 119, 6, 0.3);
  }

  .btn-submit:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  /* Image Modal */
  .image-modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.9);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1100;
    cursor: pointer;
  }

  .full-image {
    max-width: 90%;
    max-height: 90%;
    object-fit: contain;
  }

  /* Responsive */
  @media (max-width: 768px) {
    .medicine-items-container {
      padding: 16px;
    }
    .header-title {
      font-size: 24px;
    }
    .stats-grid {
      grid-template-columns: 1fr;
    }
    .items-grid {
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

export default function MedicineItems() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(9);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: ''
  });

  useEffect(() => {
    fetchItems();
  }, [currentPage, itemsPerPage, searchTerm]);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const url = `${API}?page=${currentPage}&limit=${itemsPerPage}&search=${searchTerm}`;
      const response = await axios.get(url);
      setItems(response.data.data);
      setTotalItems(response.data.total);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      toast.error('Failed to fetch medicine items');
      console.error(error);
    }
    setLoading(false);
  };

  const handleImageChange = (file) => {
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

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    handleImageChange(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name) {
      toast.error('Medicine name is required');
      return;
    }

    if (!formData.price) {
      toast.error('Price is required');
      return;
    }

    if (parseFloat(formData.price) < 0) {
      toast.error('Price cannot be negative');
      return;
    }

    if (!imageFile && !editingItem) {
      toast.error('Please select an image for the medicine');
      return;
    }

    setIsSubmitting(true);
    setUploadProgress(0);

    const submitData = new FormData();
    submitData.append('name', formData.name);
    submitData.append('description', formData.description || '');
    submitData.append('price', formData.price);
    
    if (imageFile) {
      submitData.append('image', imageFile);
    }

    // If editing and no new image, send the existing image data
    if (editingItem && !imageFile && editingItem.image) {
      submitData.append('image', JSON.stringify(editingItem.image));
    }

    try {
      let response;
      if (editingItem) {
        response = await axios.put(`${API}/${editingItem._id}`, submitData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              setUploadProgress(percentCompleted);
            }
          }
        });
        toast.success('Medicine item updated successfully!');
      } else {
        response = await axios.post(API, submitData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              setUploadProgress(percentCompleted);
            }
          }
        });
        toast.success('Medicine item added successfully!');
      }
      
      if (response.data.success) {
        setShowModal(false);
        resetForm();
        fetchItems();
      }
    } catch (error) {
      console.error('Submit error:', error);
      toast.error(error.response?.data?.message || 'Failed to save medicine item');
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this medicine item?')) {
      try {
        await axios.delete(`${API}/${id}`);
        toast.success('Medicine item deleted successfully');
        fetchItems();
      } catch (error) {
        toast.error('Failed to delete medicine item');
        console.error(error);
      }
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description || '',
      price: item.price || ''
    });
    setImagePreview(item.image?.url);
    setImageFile(null);
    setShowModal(true);
  };

  const resetForm = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      description: '',
      price: ''
    });
    setImageFile(null);
    setImagePreview(null);
    setUploadProgress(0);
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

  const handleImageClick = (imageUrl) => {
    if (imageUrl) {
      setSelectedImage(imageUrl);
      setShowImageModal(true);
    }
  };

  const totalValue = items.reduce((sum, item) => sum + (item.oldPrice || 0), 0);
  const avgPrice = items.length > 0 ? totalValue / items.length : 0;
  const totalDiscount = items.reduce((sum, item) => {
    const discount = parseInt(item.discount) || 0;
    return sum + discount;
  }, 0);
  const avgDiscount = items.length > 0 ? totalDiscount / items.length : 0;

  return (
    <>
      <style>{styles}</style>
      <div className="medicine-items-container">
        {/* Header */}
        <div className="header-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
            <div>
              <h1 className="header-title">Medicine Items</h1>
              <p className="header-subtitle">Manage medicine items, track prices and availability</p>
            </div>
            <button className="add-item-btn" onClick={() => setShowModal(true)}>
              <span>+</span> Add New Medicine Item
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-icon" style={{ background: '#fef3c7', color: '#d97706' }}>💊</div>
            </div>
            <div className="stat-value">{totalItems}</div>
            <div className="stat-label">Total Items</div>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-icon" style={{ background: '#fef3c7', color: '#d97706' }}>💰</div>
            </div>
            <div className="stat-value">₹{avgPrice.toFixed(0)}</div>
            <div className="stat-label">Average Price</div>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-icon" style={{ background: '#fef3c7', color: '#d97706' }}>🏷️</div>
            </div>
            <div className="stat-value">{avgDiscount.toFixed(0)}%</div>
            <div className="stat-label">Avg Discount</div>
          </div>
        </div>

        {/* Search Section */}
        <div className="search-section">
          <div className="search-wrapper">
            <svg className="search-icon" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              className="search-input"
              placeholder="Search medicine items by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Items Grid */}
        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p style={{ marginTop: '16px', color: '#64748b' }}>Loading medicine items...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">💊</div>
            <h3 className="empty-title">No medicine items found</h3>
            <p className="empty-text">Click "Add New Medicine Item" to get started</p>
          </div>
        ) : (
          <>
            <div className="items-grid">
              {items.map((item) => (
                <div key={item.id} className="medicine-card">
                  <div 
                    className="card-image-wrapper"
                    onClick={() => handleImageClick(item.imageUrl)}
                  >
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.name} className="medicine-image" />
                    ) : (
                      <div className="image-placeholder">
                        <span style={{ fontSize: '64px' }}>💊</span>
                      </div>
                    )}
                    <div className="discount-badge">
                      {item.discount}
                    </div>
                  </div>

                  <div className="card-content">
                    <h3 className="medicine-name">{item.name}</h3>
                    
                    <div className="medicine-type">
                      <span>📦</span> {item.type}
                    </div>

                    <div className="price-section">
                      <span className="old-price">₹{item.oldPrice}</span>
                      <span className="new-price">₹{item.newPrice}</span>
                    </div>

                    <div className="delivery-info">
                      <span>🚚</span> {item.delivery}
                    </div>

                    {item.prescription ? (
                      <div className="prescription-badge">
                        <span>📋</span> Prescription Required
                      </div>
                    ) : (
                      <div className="prescription-badge" style={{ background: '#d1fae5', color: '#059669' }}>
                        <span>✅</span> No Prescription Needed
                      </div>
                    )}

                    <div className="card-actions">
                      <button className="edit-btn" onClick={() => handleEdit(item)}>
                        ✏️ Edit
                      </button>
                      <button className="delete-btn" onClick={() => handleDelete(item.id)}>
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
                    Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} items
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
                      <option value={20}>20 per page</option>
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
                <h2 className="modal-title">{editingItem ? 'Edit Medicine Item' : 'Add New Medicine Item'}</h2>
                <button className="close-modal" onClick={() => setShowModal(false)}>×</button>
              </div>
              
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="form-group">
                    <label className="form-label">Medicine Name <span className="required">*</span></label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g., Paracetamol 500mg, Amoxicillin 250mg"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-textarea"
                      placeholder="Medicine description, dosage, instructions, side effects..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Price (₹) <span className="required">*</span></label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      className="form-input"
                      placeholder="Enter price"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Medicine Image <span className="required">*</span></label>
                    <div
                      className={`upload-area ${dragOver ? 'drag-over' : ''}`}
                      onClick={() => document.getElementById('imageInput').click()}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                    >
                      {imagePreview ? (
                        <>
                          <img src={imagePreview} alt="Preview" className="preview-image" />
                          <button
                            type="button"
                            className="remove-image-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              setImageFile(null);
                              setImagePreview(null);
                            }}
                          >
                            Remove Image
                          </button>
                        </>
                      ) : (
                        <>
                          <div style={{ fontSize: '48px', marginBottom: '12px' }}>💊</div>
                          <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '4px' }}>
                            Click or drag & drop to upload
                          </p>
                          <p style={{ color: '#94a3b8', fontSize: '12px' }}>
                            PNG, JPG, GIF, WEBP up to 5MB
                          </p>
                        </>
                      )}
                      <input
                        id="imageInput"
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                        style={{ display: 'none' }}
                        onChange={(e) => handleImageChange(e.target.files[0])}
                        required={!editingItem && !imagePreview}
                      />
                    </div>
                    {uploadProgress > 0 && uploadProgress < 100 && (
                      <div className="upload-progress">
                        <div className="upload-progress-bar" style={{ width: `${uploadProgress}%` }}></div>
                      </div>
                    )}
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
                      editingItem ? 'Update Item' : 'Create Item'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Image Modal */}
        {showImageModal && (
          <div className="image-modal-overlay" onClick={() => setShowImageModal(false)}>
            <img src={selectedImage} alt="Full view" className="full-image" />
          </div>
        )}
      </div>
    </>
  );
}